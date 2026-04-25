from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.services.scoring import scoring_service


app = FastAPI(title=settings.PROJECT_NAME)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to Top Bin API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.on_event("startup")
async def start_scheduler():
    scheduler = AsyncIOScheduler()
    # Run every day at 3:00 AM
    scheduler.add_job(scoring_service.run_daily_scoring_pipeline, 'cron', hour=3, minute=0)
    # OR: Run every 6 hours to keep the league fresh
    # scheduler.add_job(scoring_service.run_daily_scoring_pipeline, 'interval', hours=6)
    scheduler.start()