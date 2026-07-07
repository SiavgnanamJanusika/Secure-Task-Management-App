from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.models.user import Role




class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str



class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: Role
    is_active: bool
    bio: str | None = None
    avatar_url: str | None = None
    phone: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True




class ProfileUpdate(BaseModel):
    """Fields a logged-in user is allowed to edit on their own profile."""
    full_name: str | None = Field(default=None, min_length=2, max_length=100)
    bio: str | None = Field(default=None, max_length=500)
    avatar_url: str | None = None
    phone: str | None = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)



class AdminUserUpdate(BaseModel):
    """Fields only an admin can change on any user's account."""
    full_name: str | None = None
    role: Role | None = None
    is_active: bool | None = None


class UserListOut(BaseModel):
    items: list[UserOut]
    total: int
    page: int
    page_size: int
