from fastapi import APIRouter, Depends, status

from app.schemas.task_schema import TaskCreate, TaskUpdate, TaskOut
from app.services import task_service
from app.core.oauth2 import get_current_active_user
from app.core.permissions import require_role

controller = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@controller.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
async def create_task(payload: TaskCreate, admin_user: dict = Depends(require_role("admin"))):
    """Admin-only: create a task and assign it to a user."""
    return await task_service.create_task(payload, created_by=admin_user["id"])


@controller.get("", response_model=list[TaskOut])
async def list_tasks(current_user: dict = Depends(get_current_active_user)):
    """
    Admins see every task in the system.
    Regular users only see tasks that have been assigned to them.
    """
    return await task_service.list_tasks_for_user(
        user_id=current_user["id"], role=current_user["role"]
    )


@controller.get("/{task_id}", response_model=TaskOut)
async def get_task(task_id: str, current_user: dict = Depends(get_current_active_user)):
    return await task_service.get_task(task_id, user_id=current_user["id"], role=current_user["role"])


@controller.put("/{task_id}", response_model=TaskOut)
async def update_task(
    task_id: str, payload: TaskUpdate, current_user: dict = Depends(get_current_active_user)
):
    """
    Admins can edit any field (including reassigning a task to a different user).
    Regular users may only update the status of a task assigned to them
    (i.e. "do the task": to do -> in progress -> done).
    """
    return await task_service.update_task(
        task_id, payload, user_id=current_user["id"], role=current_user["role"]
    )


@controller.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: str, admin_user: dict = Depends(require_role("admin"))):
    """Admin-only: delete a task."""
    await task_service.delete_task(task_id)
