from fastapi import APIRouter, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import User, UserCreate, UserLogin, UserResponse, Token
from auth import get_password_hash, verify_password, create_access_token, verify_token
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_db():
    from server import db
    return db


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Register a new admin user"""
    # Check if username already exists
    existing_user = await db.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = await db.users.find_one({"email": user_data.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password)
    )
    
    await db.users.insert_one(user.dict())
    return UserResponse(**user.dict())


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Login and get access token"""
    user = await db.users.find_one({"username": credentials.username})
    
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    access_token = create_access_token(
        data={"sub": user["username"], "user_id": user["id"]}
    )
    
    return Token(access_token=access_token)


@router.get("/verify")
async def verify_user(payload: dict = Depends(verify_token)):
    """Verify token and return user info"""
    return {"username": payload.get("sub"), "user_id": payload.get("user_id")}


@router.get("/users", response_model=list[UserResponse])
async def get_users(
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all users (admin only)"""
    users = await db.users.find().to_list(100)
    return [UserResponse(**user) for user in users]


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a user (admin only)"""
    # Don't allow deleting yourself
    if payload.get("user_id") == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "User deleted successfully"}
