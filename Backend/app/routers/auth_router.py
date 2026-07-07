from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.user_schema import (
    UserRegister,
    UserLogin
)

from app.services.auth_service import (
    register_user,
    login_user,
    get_current_user
)

from app.auth import verify_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)



@router.post("/register")
async def register(user: UserRegister):

    result = await register_user(user)

    if result is None:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return {
        "message": "User registered successfully",
        "user": result
    }



@router.post("/login")
async def login(user: UserLogin):

    result = await login_user(user)

    if result is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return result



@router.get("/me")
async def current_user(
    user = Depends(get_current_user)
):

    return {
        "user": user
    }



@router.get("/admin")
async def admin_route(
    user = Depends(get_current_user)
):

    if user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return {
        "message": "Welcome Admin"
    }