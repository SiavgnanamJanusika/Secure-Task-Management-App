from fastapi import Depends, HTTPException, status

from app.core.oauth2 import get_current_active_user


def require_role(*allowed_roles: str):
    """
    Dependency factory for role-based access control.

    Usage:
        @router.get("/admin-only")
        async def admin_route(user = Depends(require_role("admin"))):
            ...
    """

    normalized_allowed_roles = {str(role).strip().lower() for role in allowed_roles}

    async def role_checker(current_user: dict = Depends(get_current_active_user)) -> dict:
        current_role = str(current_user.get("role", "")).strip().lower()
        if current_role not in normalized_allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )
        return current_user

    return role_checker
