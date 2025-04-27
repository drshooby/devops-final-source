from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from db import async_session
from models import Photo as PhotoModel
from schemas import PhotoCreate, Photo

router = APIRouter(prefix="/api/list")

async def get_db():
    async with async_session() as session:
        yield session

@router.get("/health")
async def health_check():
    return {"message": "Hello from listing service!"}

@router.get("/photos", response_model=list[Photo])
async def list_photos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PhotoModel))
    photos = result.scalars().all()
    return photos

@router.post("/photos", response_model=Photo)
async def create_photo(photo: PhotoCreate, db: AsyncSession = Depends(get_db)):
    new_photo = PhotoModel(name=photo.name, url=str(photo.url))
    db.add(new_photo)
    await db.commit()
    await db.refresh(new_photo)
    return new_photo

@router.delete("/photos/{photo_id}")
async def delete_photo(photo_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PhotoModel).where(PhotoModel.id == photo_id))
    photo = result.scalar_one_or_none()

    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    await db.delete(photo)
    await db.commit()
    return {"message": "Photo deleted"}