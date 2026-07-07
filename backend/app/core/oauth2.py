from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_token
from app.database import users_collection
from app.models.user_model import user_helper

# tokenUrl points to the login endpoint (used for OpenAPI docs / Swagger UI)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

CREDENTIALS_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    payload = decode_token(token)
    if payload is None or payload.get("type") != "access":
        raise CREDENTIALS_EXCEPTION

    user_id = payload.get("sub")
    if user_id is None:
        raise CREDENTIALS_EXCEPTION

    try:
        oid = ObjectId(user_id)
    except InvalidId:
        raise CREDENTIALS_EXCEPTION

    user = await users_collection.find_one({"_id": oid})
    if user is None:
        raise CREDENTIALS_EXCEPTION

    return user_helper(user)


async def get_current_active_user(current_user: dict = Depends(get_current_user)) -> dict:
    # Placeholder for future "disabled" / "is_active" flag checks.
    return current_user
