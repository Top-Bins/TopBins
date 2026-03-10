from fastapi import APIRouter

api_router = APIRouter()

from app.api.v1.endpoints import leagues

api_router = APIRouter()

api_router.include_router(leagues.router, prefix="/leagues", tags=["leagues"])
