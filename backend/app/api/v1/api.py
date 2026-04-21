from fastapi import APIRouter
from app.api.v1.endpoints import sportmonks # Import your new file
from app.api.v1.endpoints import leagues
from app.api.v1.endpoints import matchweeks

api_router = APIRouter()

api_router.include_router(sportmonks.router, prefix="/sportmonks", tags=["sportmonks"])
api_router.include_router(leagues.router, prefix="/leagues", tags=["leagues"])
api_router.include_router(matchweeks.router, prefix="/matchweeks", tags=["matchweeks"])
