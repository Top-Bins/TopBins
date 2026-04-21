from fastapi import APIRouter, HTTPException
from app.services.scoring import scoring_service # Import the instance

router = APIRouter()

@router.post("/calculate-pending-scores")
async def calculate_pending_scores():
    """
    Calculate points for finished matches that haven't been scored yet.
    """
    try:
        # Call the instance method
        result = await scoring_service.calculate_pending_scores()
        
        # If the service returned an error status, reflect that in the HTTP code
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
            
        return result
    except Exception as e:
        # Log the error here if you have a logger
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}") 

@router.post("/update-matchweek-standings/{matchweek_id}")
async def update_matchweek_standings(matchweek_id: int):
    """
    Recalculates and updates the total points for a specific matchweek.
    """
    try:
        result = await scoring_service.update_matchweek_standings(matchweek_id)
        
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/backfill-all-matchweeks")
async def backfill_all_matchweeks():
    """
    Runs the standings update for every matchweek in the database.
    """
    try:
        result = await scoring_service.backfill_all_matchweeks()
        
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

