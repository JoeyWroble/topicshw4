from beanie import Document
from pydantic import BaseModel, EmailStr

class Sleep(Document):
    email: EmailStr
    date: str
    timeToSleep: str
    timeAwake: str

class SleepRequest(BaseModel):
    date: str
    timeToSleep: str
    timeAwake: str