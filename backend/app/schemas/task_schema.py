from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator

from app.models.task_model import TaskStatus


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    status: Optional[TaskStatus] = TaskStatus.TODO
    assigned_to: str  # id of the user this task is assigned to (admin sets this)

    @field_validator("title")
    @classmethod
    def check_title(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Task title cannot be empty.")
        return v.strip()


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    assigned_to: Optional[str] = None  # admins can reassign a task


class TaskOut(BaseModel):
    id: str
    title: str
    description: str
    status: str
    assigned_to: str
    assigned_to_name: Optional[str] = ""
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
