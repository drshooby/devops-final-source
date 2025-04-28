from pydantic import BaseModel, EmailStr

class EmailRequest(BaseModel):
    to_email: EmailStr
    name: str
    photo_count: int