from contextlib import asynccontextmanager
from fastapi import FastAPI
from router import router
from db import engine
from models import Base
from dotenv import load_dotenv
from sqlalchemy import text

import os

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    environment = os.getenv("ENVIRONMENT", "dev")
    if environment == "dev":
        async with engine.begin() as conn:
            # Manually drop leftover sequences first
            await conn.execute(text("DROP SEQUENCE IF EXISTS photos_id_seq CASCADE"))

            # Then drop all tables
            await conn.run_sync(Base.metadata.drop_all)

            # Then recreate fresh tables
            await conn.run_sync(Base.metadata.create_all)
        print("✅ Tables auto-created (dev environment)")
    else:
        print(f"🚀 Startup in {environment} environment — no table creation")
    yield

app = FastAPI(docs_url=None, redoc_url=None, lifespan=lifespan)

app.include_router(router)