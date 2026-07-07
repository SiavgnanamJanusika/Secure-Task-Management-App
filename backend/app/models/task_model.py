from datetime import datetime, timezone
from enum import Enum


class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


def task_helper(task: dict) -> dict:
    return {
        "id": str(task["_id"]),
        "title": task["title"],
        "description": task.get("description", ""),
        "status": task.get("status", TaskStatus.TODO.value),
        "assigned_to": task.get("assigned_to"),
        "assigned_to_name": task.get("assigned_to_name", ""),
        "created_by": task.get("created_by"),
        "created_at": task.get("created_at"),
        "updated_at": task.get("updated_at"),
    }


def new_task_document(
    title: str,
    description: str,
    assigned_to: str,
    created_by: str,
    assigned_to_name: str = "",
    status: str = TaskStatus.TODO.value,
) -> dict:
    now = datetime.now(timezone.utc)
    return {
        "title": title,
        "description": description,
        "status": status,
        "assigned_to": assigned_to,
        "assigned_to_name": assigned_to_name,
        "created_by": created_by,
        "created_at": now,
        "updated_at": now,
    }
