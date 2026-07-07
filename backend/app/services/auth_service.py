from fastapi import HTTPException, status

from app.database import users_collection
from app.models.user_model import new_user_document, user_helper
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.schemas.user_schema import UserCreate, UserLogin, TokenResponse


async def register_user(payload: UserCreate) -> dict:
    existing = await users_collection.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    # Public registration always creates a regular "user" account.
    # Admin accounts are created via the seed script or promoted by an
    # existing admin (see PATCH /api/users/{id}/role) — never self-selected
    # through this endpoint, even if a client sends a "role" field.
    doc = new_user_document(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        role="user",
    )
    result = await users_collection.insert_one(doc)
    created = await users_collection.find_one({"_id": result.inserted_id})
    return user_helper(created)


async def authenticate_user(payload: UserLogin) -> TokenResponse:
    user = await users_collection.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_data = {"sub": str(user["_id"]), "role": str(user.get("role", "user")).strip().lower()}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_helper(user),
    )


async def refresh_access_token(refresh_token: str) -> dict:
    payload = decode_token(refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token.",
        )

    user_id = payload.get("sub")
    new_access_token = create_access_token({"sub": user_id, "role": str(payload.get("role", "user")).strip().lower()})
    return {"access_token": new_access_token, "token_type": "bearer"}
