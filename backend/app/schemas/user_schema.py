from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator

from app.utils.validators import validate_password, PASSWORD_RULE_MESSAGE


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    # Note: no "role" field here on purpose. Public sign-up always creates a
    # regular user; admin accounts are seeded or promoted separately.

    @field_validator("password")
    @classmethod
    def check_password_strength(cls, v: str) -> str:
        if not validate_password(v):
            raise ValueError(PASSWORD_RULE_MESSAGE)
        return v

    @field_validator("full_name")
    @classmethod
    def check_full_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Full name cannot be empty.")
        return v.strip()


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    created_at: Optional[datetime] = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut


class RefreshRequest(BaseModel):
    refresh_token: str


class RoleUpdate(BaseModel):
    role: str  # "admin" or "user"
