from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List
from app.schemas.league import LeagueCreate, League, LeagueJoin, LeagueMember, LeagueDetails
from app.services.league_service import LeagueService

router = APIRouter()

from app.api.deps import get_current_user_id

@router.post("/", response_model=League)
async def create_league(
    league_data: LeagueCreate,
    user_id: str = Depends(get_current_user_id)
):
    try:
        return LeagueService.create_league(league_data, user_id, team_name=league_data.team_name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/join", response_model=LeagueMember)
async def join_league(
    join_data: LeagueJoin,
    user_id: str = Depends(get_current_user_id)
):
    try:
        return LeagueService.join_league(join_data.invite_code, user_id, join_data.team_name)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=List[League])
async def get_my_leagues(
    user_id: str = Depends(get_current_user_id)
):
    return LeagueService.get_user_leagues(user_id)

@router.get("/{league_id}", response_model=LeagueDetails)
async def get_league(
    league_id: str,
    user_id: str = Depends(get_current_user_id)
):
    try:
        return LeagueService.get_league_details(league_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
