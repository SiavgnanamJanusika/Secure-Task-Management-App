from datetime import datetime, timezone
from enum import Enum


class Role(str, Enum):
    ADMIN = "admin"
    USER = "user"


def user_helper(user: dict) -> dict:
    """Convert a raw Mongo user document into a safe, JSON-serializable dict."""
    role = str(user.get("role", Role.USER.value)).strip().lower()
    if role not in {Role.ADMIN.value, Role.USER.value}:
        role = Role.USER.value

    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user.get("full_name", ""),
        "role": role,
        "created_at": user.get("created_at"),
    }


def new_user_document(email: str, hashed_password: str, full_name: str, role: str = Role.USER.value) -> dict:
    normalized_role = str(role).strip().lower()
    if normalized_role not in {Role.ADMIN.value, Role.USER.value}:
        normalized_role = Role.USER.value

    return {
        "email": email.lower().strip(),
        "hashed_password": hashed_password,
        "full_name": full_name,
        "role": normalized_role,
        "created_at": datetime.now(timezone.utc),
    }
