from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
import logging

logger = logging.getLogger(__name__)

client: AsyncIOMotorClient = None
db = None

async def connect_db():
    global client, db
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        # Test the connection
        await client.admin.command('ping')
        db = client[settings.DATABASE_NAME]
        logger.info(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
        print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB: {e}")
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise

async def close_db():
    global client
    if client:
        client.close()
        logger.info("🔌 MongoDB connection closed")
        print("🔌 MongoDB connection closed")

def get_db():
    if db is None:
        raise RuntimeError("Database not connected. Call connect_db() first.")
    return db
