from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.MONGO_URI)
database = client[settings.MONGO_DB_NAME]

users_collection = database["users"]
tasks_collection = database["tasks"]


async def init_indexes():
    """Call on app startup to ensure required indexes exist."""
    await users_collection.create_index("email", unique=True)
    await tasks_collection.create_index("assigned_to")
