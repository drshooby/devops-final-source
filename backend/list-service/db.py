from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
import os

DATABASE_URL = os.getenv("POSTGRES_URL")

engine = create_async_engine(DATABASE_URL)

async_session = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
)