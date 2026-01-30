import httpx
from typing import Any, Dict, Optional
from app.core.config import settings

class SportsMonkClient:
    BASE_URL = "https://api.sportsmonk.com/v3/football"
    
    def __init__(self):
        self.api_token = settings.SPORTSMONK_API_TOKEN
        
    async def get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        if params is None:
            params = {}
        params["api_token"] = self.api_token
        
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.BASE_URL}/{endpoint}", params=params)
            response.raise_for_status()
            return response.json()

    async def get_fixtures(self) -> Dict[str, Any]:
        # Example method to get fixtures
        return await self.get("fixtures")

sportsmonk = SportsMonkClient()
