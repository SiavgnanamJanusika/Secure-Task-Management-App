from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import EmailStr
from bson import ObjectId
from ..database.mongodb import users_collection
from ..schemas.auth_schema import RegisterRequest, LoginRequest, TokenResponse
from ..auth.hashing import hash_password, verify_password
from ..auth.jwt_handler import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse)
async def register(data: RegisterRequest):
    # unique email
    existing = await users_collection.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    # unique username
    existing_u = await users_collection.find_one({"username": data.username})
    if existing_u:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")

    from ..models.user import user_doc
    hashed = hash_password(data.password)
    role = "user"  # role assignment via admin route only
    doc = user_doc(username=data.username, email=data.email, password_hash=hashed, role=role)
    res = await users_collection.insert_one(doc)
    token = create_access_token(str(res.inserted_id), role)
    return TokenResponse(access_token=token)

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    user = await users_collection.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(str(user["_id"]), user["role"])
    return TokenResponse(access_token=token)
