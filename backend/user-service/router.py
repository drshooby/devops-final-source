from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from db import async_session
from models import User
from schemas import UserCreate, UserLogin
from utils import generate_salt, hash_password, create_access_token, decode_access_token

router = APIRouter(prefix="/api/user")

async def get_db():
    async with async_session() as session:
        yield session

@router.get("/health")
async def root():
    return {"message": "Hello from user service!"}

@router.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await db.execute(
        User.__table__.select().where(User.username == user.username)
    )
    if existing_user.scalar():
        raise HTTPException(status_code=400, detail="Username already exists")

    salt = generate_salt()
    hashed_pw = hash_password(user.password, salt)

    new_user = User(
        username=user.username,
        hashed_password=hashed_pw,
        salt=salt
    )

    db.add(new_user)
    await db.commit()

    return {"message": "User registered successfully"}

@router.post("/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        User.__table__.select().where(User.username == user.username)
    )
    db_user = result.scalar()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    incoming_hash = hash_password(user.password, db_user.salt)

    if incoming_hash != db_user.hashed_password:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    # Create a JWT token
    token = create_access_token({"sub": user.username})

    return {"access_token": token, "token_type": "bearer"}

from fastapi import Header

@router.get("/verify")
async def verify(authorization: str = Header(...)):
    token = authorization.split(" ")[1]  # Extract the token after "Bearer"
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return {"message": "Token is valid", "user": payload.get("sub")}