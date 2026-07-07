from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.user_schema import UserCreate, UserLogin, UserOut, TokenResponse, RefreshRequest
from app.services import auth_service
from app.core.oauth2 import get_current_active_user

controller = APIRouter(prefix="/api/auth", tags=["Authentication"])


@controller.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate):
    """
    Register a new user.
    Email must contain '@' and a valid domain.
    Password must be 6+ chars with 1 uppercase, 1 lowercase, and 1 special character.
    """
    return await auth_service.register_user(payload)


@controller.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2-compliant login endpoint (used by Swagger UI's 'Authorize' button
    and standard OAuth2 password-flow clients). Expects form fields:
    username (= email) and password.
    """
    credentials = UserLogin(email=form_data.username, password=form_data.password)
    return await auth_service.authenticate_user(credentials)


@controller.post("/login-json", response_model=TokenResponse)
async def login_json(payload: UserLogin):
    """
    Convenience JSON login endpoint for the React frontend
    (avoids having to send x-www-form-urlencoded from the browser).
    """
    return await auth_service.authenticate_user(payload)


@controller.post("/refresh")
async def refresh(payload: RefreshRequest):
    return await auth_service.refresh_access_token(payload.refresh_token)


@controller.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_active_user)):
    return current_user
