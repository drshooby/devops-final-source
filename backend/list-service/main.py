from contextlib import asynccontextmanager
from fastapi import FastAPI
from router import router
from dotenv import load_dotenv

import os

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"Welcome to list-service environment: {os.getenv('ENVIRONMENT')}")
    yield

app = FastAPI(docs_url=None, redoc_url=None, lifespan=lifespan)

app.include_router(router)