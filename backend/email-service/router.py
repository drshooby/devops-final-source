from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
import aiosmtplib
from email.message import EmailMessage

from schemas import EmailSchema
from . import config

router = APIRouter(prefix="/api/email")

@router.get("/health")
async def health_check():
    return {"message": "Hello from email service!"}

@router.post("/send")
async def send_email(email: EmailSchema, background_tasks: BackgroundTasks):
    background_tasks.add_task(_send_email_task, email)
    return {"message": "Email is being sent in background."}

async def _send_email_task(email: EmailSchema):
    message = EmailMessage()
    message["From"] = config.FROM_EMAIL
    message["To"] = email.to_email
    message["Subject"] = email.subject
    message.set_content(email.body)

    try:
        await aiosmtplib.send(
            message,
            hostname=config.SMTP_HOST,
            port=config.SMTP_PORT,
            start_tls=True,
            username=config.SMTP_USERNAME,
            password=config.SMTP_PASSWORD,
        )
    except aiosmtplib.SMTPException as e:
        print(f"Failed to send email: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email.")