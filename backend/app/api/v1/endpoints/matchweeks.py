from fastapi import APIRouter, HTTPException
from app.services.matchweeks import matchweek_service # Import the instance

router = APIRouter()

@router.post("/setup-matchweeks")
async def setup_matchweeks():
    """
    Setup matchweeks for the 2025/26 Season with 5-game minimum threshold.
    """
    try:
        # Call the instance method
        result = await matchweek_service.setup_filtered_matchweeks()
        
        # If the service returned an error status, reflect that in the HTTP code
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
            
        return result
    except Exception as e:
        # Log the error here if you have a logger
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")