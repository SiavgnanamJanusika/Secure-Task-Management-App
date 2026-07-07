from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status

from app.database import tasks_collection, users_collection
from app.models.task_model import new_task_document, task_helper
from app.schemas.task_schema import TaskCreate, TaskUpdate


def _to_object_id(value: str, label: str = "id") -> ObjectId:
    try:
        return ObjectId(value)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid {label}.")


async def _get_user_or_404(user_id: str) -> dict:
    oid = _to_object_id(user_id, "user id")
    user = await users_collection.find_one({"_id": oid})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assigned user not found.")
    return user


async def create_task(payload: TaskCreate, created_by: str) -> dict:
    """Admin-only: create a task and assign it to a specific user."""
    assignee = await _get_user_or_404(payload.assigned_to)

    doc = new_task_document(
        title=payload.title,
        description=payload.description or "",
        assigned_to=str(assignee["_id"]),
        assigned_to_name=assignee.get("full_name", assignee.get("email", "")),
        created_by=created_by,
        status=payload.status.value if payload.status else "todo",
    )
    result = await tasks_collection.insert_one(doc)
    created = await tasks_collection.find_one({"_id": result.inserted_id})
    return task_helper(created)


async def list_tasks_for_user(user_id: str, role: str) -> list[dict]:
    # Admins see every task; regular users only see tasks assigned to them.
    normalized_role = (role or "").strip().lower()
    query = {} if normalized_role == "admin" else {"assigned_to": user_id}
    cursor = tasks_collection.find(query).sort("created_at", -1)
    return [task_helper(t) async for t in cursor]


async def get_task(task_id: str, user_id: str, role: str) -> dict:
    oid = _to_object_id(task_id, "task id")
    task = await tasks_collection.find_one({"_id": oid})
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")
    if (role or "").strip().lower() != "admin" and task["assigned_to"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This task isn't assigned to you.")
    return task_helper(task)


async def update_task(task_id: str, payload: TaskUpdate, user_id: str, role: str) -> dict:
    oid = _to_object_id(task_id, "task id")
    task = await tasks_collection.find_one({"_id": oid})
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")

    is_admin = (role or "").strip().lower() == "admin"
    if not is_admin and task["assigned_to"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This task isn't assigned to you.")

    update_data = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}

    if not is_admin:
        # Regular users can only update the task's status ("do the task").
        update_data = {k: v for k, v in update_data.items() if k == "status"}
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update a task's status.",
            )

    if "assigned_to" in update_data:
        assignee = await _get_user_or_404(update_data["assigned_to"])
        update_data["assigned_to"] = str(assignee["_id"])
        update_data["assigned_to_name"] = assignee.get("full_name", assignee.get("email", ""))

    if "status" in update_data and hasattr(update_data["status"], "value"):
        update_data["status"] = update_data["status"].value
    update_data["updated_at"] = datetime.now(timezone.utc)

    await tasks_collection.update_one({"_id": oid}, {"$set": update_data})
    updated = await tasks_collection.find_one({"_id": oid})
    return task_helper(updated)


async def delete_task(task_id: str) -> None:
    """Admin-only: delete any task."""
    oid = _to_object_id(task_id, "task id")
    task = await tasks_collection.find_one({"_id": oid})
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")

    await tasks_collection.delete_one({"_id": oid})
