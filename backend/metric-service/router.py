from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from db import async_session
from schemas import Photo
from models import Photo as PhotoModel

from utils import calculate_next_milestone

router = APIRouter(prefix="/api/metrics")

async def get_db():
    async with async_session() as session:
        yield session

@router.get("/health")
async def health_check():
    return {"message": "Hello from metric service!"}

@router.get("/progress")
async def get_metrics(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PhotoModel))
    photos = result.scalars().all()

    count = len(photos)
    next_milestone = calculate_next_milestone(count)
    progress = min(int((count / next_milestone) * 100), 100) if next_milestone else 100

    return {
        "count": count,
        "nextMilestone": next_milestone,
        "progress": progress
    }