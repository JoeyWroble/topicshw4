from beanie import init_beanie, Document
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from sleep import Sleep

class User(Document):
    email: EmailStr
    hashed_password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str

async def init():
    client = AsyncIOMotorClient("mongodb+srv://joewroble72:BogI9ZkKSzidv8pS@users.goppkgg.mongodb.net/")
    database = client["sleep_tracker"]
    await init_beanie(database, document_models=[User, Sleep])
