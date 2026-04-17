from fastapi import APIRouter
from app.api.v1.endpoints import sportmonks # Import your new file
from app.api.v1.endpoints import leagues

api_router = APIRouter()

api_router.include_router(sportmonks.router, prefix="/sportmonks", tags=["sportmonks"])
api_router.include_router(leagues.router, prefix="/leagues", tags=["leagues"])
