from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo import ReturnDocument

from app.database import users_collection
from app.models.user_model import user_helper, Role
from app.core.oauth2 import get_current_active_user
from app.core.permissions import require_role
from app.schemas.user_schema import UserOut, RoleUpdate

controller = APIRouter(prefix="/api/users", tags=["Users"])


@controller.get("/me", response_model=UserOut)
async def read_own_profile(current_user: dict = Depends(get_current_active_user)):
    return current_user


@controller.get("", response_model=list[UserOut])
async def list_all_users(current_user: dict = Depends(get_current_active_user)):
    """
    Any authenticated user can list users — the admin task-assignment form
    needs this to populate the "assign to" dropdown. Only admins get the
    ability to actually change roles (see PATCH /{user_id}/role below).
    """
    cursor = users_collection.find({})
    return [user_helper(u) async for u in cursor]


@controller.patch("/{user_id}/role", response_model=UserOut)
async def update_user_role(
    user_id: str, payload: RoleUpdate, admin_user: dict = Depends(require_role("admin"))
):
    """Admin-only: promote a user to admin, or demote an admin back to user."""
    if payload.role not in (Role.ADMIN.value, Role.USER.value):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role must be 'admin' or 'user'.")

    try:
        oid = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id.")

    result = await users_collection.find_one_and_update(
        {"_id": oid}, {"$set": {"role": payload.role}}, return_document=ReturnDocument.AFTER
    )
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return user_helper(result)
