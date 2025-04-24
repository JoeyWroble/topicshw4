from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sleep_routes import sleep_router
from routes.auth_routes import auth_router
from fastapi.middleware.cors import CORSMiddleware


from db import init as init_db 

app = FastAPI()

# solve CORS issues
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app = FastAPI(title="My Sleep Tracker")
app.include_router(sleep_router, tags=["Sleeps"], prefix="/sleeps")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])

app.include_router(auth_router, tags=["Auth"], prefix="/auth")

@app.get("/")
async def welcome() -> dict:
    return FileResponse("./frontend/index.html")

app.mount("/", StaticFiles(directory="frontend"), name="static")

@app.on_event("startup")
async def app_init():
    await init_db()
