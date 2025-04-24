from fastapi import APIRouter

router = APIRouter(prefix="/api/user")

@router.get("/debug")
async def root():
    return {"message": "Hello from user service!"}

@router.post("/login")
async def login():
    return {"message": "Login endpoint"}

@router.post("/register")
async def register():
    return {"message": "Register endpoint"}