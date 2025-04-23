from datetime import datetime

from pydantic import BaseModel

class TokenData(BaseModel):
    username: str
    exp_datetime: datetime