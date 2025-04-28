from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
import aiosmtplib
from email.message import EmailMessage

from schemas import EmailRequest
import config

router = APIRouter(prefix="/api/email")

@router.get("/health")
async def health_check():
    return {"message": "Hello from email service!"}

@router.post("/send")
async def send_email(request: EmailRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(_send_email_task, request)
    return {"message": "Email is being sent in background."}

async def _send_email_task(request: EmailRequest):
    subject = f"Milestone Achieved!"
    body = f"Congrats {request.name} on getting us to {request.photo_count} photos!"

    message = EmailMessage()
    message["From"] = config.FROM_EMAIL
    message["To"] = request.to_email
    message["Subject"] = subject
    message.set_content(body)

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