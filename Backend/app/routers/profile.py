from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from app.core.deps import get_current_active_user
from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.user import PasswordChange, ProfileUpdate, UserOut

router = APIRouter(prefix="/profile", tags=["Profile"])


def _to_out(user: User) -> UserOut:
    return UserOut(id=str(user.id), **user.model_dump(exclude={"id", "hashed_password"}))


@router.get("/me", response_model=UserOut)
async def get_my_profile(current_user: User = Depends(get_current_active_user)):
    """Data needed to render the logged-in user's profile page."""
    return _to_out(current_user)


@router.put("/me", response_model=UserOut)
async def update_my_profile(
    payload: ProfileUpdate,
    current_user: User = Depends(get_current_active_user),
):
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    current_user.updated_at = datetime.now(timezone.utc)
    await current_user.save()
    return _to_out(current_user)


@router.put("/me/password")
async def change_my_password(
    payload: PasswordChange,
    current_user: User = Depends(get_current_active_user),
):
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    current_user.hashed_password = hash_password(payload.new_password)
    current_user.updated_at = datetime.now(timezone.utc)
    await current_user.save()
    return {"detail": "Password updated successfully"}


@router.delete("/me")
async def delete_my_account(current_user: User = Depends(get_current_active_user)):
    await current_user.delete()
    return {"detail": "Account deleted"}
