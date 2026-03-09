from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List
from app.schemas.league import LeagueCreate, League, LeagueJoin, LeagueMember
from app.services.league_service import LeagueService

router = APIRouter()

# TODO: Replace with actual auth dependency
async def get_current_user_id():
    # Placeholder: In a real app, this would come from a JWT/Supabase Auth
    return "00000000-0000-0000-0000-000000000000"

@router.post("/", response_model=League)
async def create_league(
    league_data: LeagueCreate,
    user_id: str = Depends(get_current_user_id)
):
    try:
        return LeagueService.create_league(league_data, user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/join", response_model=LeagueMember)
async def join_league(
    join_data: LeagueJoin,
    user_id: str = Depends(get_current_user_id)
):
    try:
        return LeagueService.join_league(join_data.invite_code, user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=List[League])
async def get_my_leagues(
    user_id: str = Depends(get_current_user_id)
):
    return LeagueService.get_user_leagues(user_id)
