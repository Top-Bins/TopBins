# app/api/v1/endpoints/sportmonks.py
from fastapi import APIRouter, HTTPException
from app.services.sportmonks import sportmonks

router = APIRouter()

# Notice the {match_id} in the path and the match_id: int in the function
@router.post("/sync-match-stats/{match_id}")
async def sync_match_stats(match_id: int):
    """
    Fetch match data from Sportmonks and upsert into Supabase.
    """ 
    try:
        result = await sportmonks.sync_match_stats(match_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sync-season-players/{season_id}")
async def sync_season_players(season_id: int):
    """
    Fetch all players for a season and upsert into Supabase.
    """
    try:
        result = await sportmonks.sync_players_by_season(season_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sync-matches-by-date-range/{start_date}/{end_date}/{league_id}")
async def sync_matches_by_date_range(start_date: str, end_date: str, league_id: int):
    """
    Fetch matches for a date range and upsert into Supabase.
    """
    try:
        result = await sportmonks.sync_matches_by_date_range(start_date, end_date, league_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/maintenance/reset-matches")
async def reset_matches():
    """
    Reset matches and stats_synced flag.
    """ 
    try:
        result = await sportmonks.run_match_maintenance()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sync-finished-match-stats")
async def sync_finished_match_stats():
    """
    Sync stats for all finished matches that haven't been synced yet.
    """
    try:
        result = await sportmonks.sync_finished_match_stats()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))