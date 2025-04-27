from pydantic import BaseModel, HttpUrl
from datetime import datetime

class PhotoBase(BaseModel):
    name: str
    url: HttpUrl  # ensures a valid URL

class PhotoCreate(PhotoBase):
    pass  # used when creating a new photo

class Photo(PhotoBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True