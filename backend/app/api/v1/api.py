from fastapi import APIRouter
from app.api.v1.endpoints import sportmonks # Import your new file

api_router = APIRouter()
api_router.include_router(sportmonks.router, prefix="/sportmonks", tags=["sportmonks"])

# Import and include other routers here as we add them
# from app.api.v1.endpoints import fixtures
# api_router.include_router(fixtures.router, prefix="/fixtures", tags=["fixtures"])
