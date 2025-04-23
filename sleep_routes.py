from fastapi import APIRouter, Depends, HTTPException, Path, status
from utils.token_data import TokenData
from routes.auth_routes import get_current_user
from sleep import Sleep, SleepRequest
from beanie.operators import In
from typing import List
from bson import ObjectId

sleep_router = APIRouter()

@sleep_router.get("", response_model=List[Sleep])
async def get_sleeps(current_user: TokenData = Depends(get_current_user)):
    return await Sleep.find(Sleep.email == current_user.username).to_list()

@sleep_router.post("", response_model=Sleep, status_code=status.HTTP_201_CREATED)
async def add_sleep(sleep: SleepRequest, current_user: TokenData = Depends(get_current_user)):
    new_sleep = Sleep(
        email=current_user.username,
        date=sleep.date,
        timeToSleep=sleep.timeToSleep,
        timeAwake=sleep.timeAwake
    )
    await new_sleep.insert()
    return new_sleep

@sleep_router.get("/{id}", response_model=Sleep)
async def get_sleep_by_id(id: str, current_user: TokenData = Depends(get_current_user)):
    sleep = await Sleep.get(ObjectId(id))
    if not sleep or sleep.email != current_user.username:
        raise HTTPException(status_code=404, detail="Sleep log not found")
    return sleep

@sleep_router.delete("/{id}")
async def delete_sleep_by_id(id: str, current_user: TokenData = Depends(get_current_user)):
    sleep = await Sleep.get(ObjectId(id))
    if not sleep or sleep.email != current_user.username:
        raise HTTPException(status_code=404, detail="Sleep log not found")
    
    await sleep.delete()
    return {"msg": f"Sleep log with ID={id} deleted."}
