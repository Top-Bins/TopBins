import httpx
from typing import Any, Dict, Optional
from app.core.config import settings
from app.db.supabase import supabase

class SportmonksClient:
    BASE_URL = "https://api.sportmonks.com/v3/football"
    
    def __init__(self):
        self.api_token = settings.SPORTMONKS_API_TOKEN
        
    async def get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        if params is None:
            params = {}
        params["api_token"] = self.api_token
        
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.BASE_URL}/{endpoint}", params=params)
            response.raise_for_status()
            return response.json()

    async def sync_match_stats(self, match_id: int):
        # 1. Fetch the data from Sportmonks
        params = {"include": "lineups.details"} 
        response = await self.get(f"fixtures/{match_id}", params=params)

        supabase.table("matches").upsert({
            "id": match_id,
            "name": fixture_data['name'],
            "starting_at": fixture_data['starting_at']
        }).execute()
        
        data = response.get("data", {})
        lineups = data.get("lineups", [])

        processed_count = 0

        # 2. Loop through every player in the match
        for entry in lineups:
            player_id = entry.get("player_id")
            stats_list = entry.get("details", [])

            if player_id and stats_list:
                try:
                    # 3. Push the data into your Supabase table
                    supabase.table("player_match_stats").upsert({
                        "player_id": player_id,
                        "match_id": match_id,
                        "stats": {"performance_data": stats_list}, 
                        "points_earned": 0 
                    }).execute()
                    processed_count += 1
                except Exception as e:
                    # This will skip players (like the Rangers players) 
                    # that aren't in your 'players' table yet.
                    print(f"Skipping player {player_id}: {e}")

        return {"status": "success", "players_saved": processed_count}
    

sportmonks = SportmonksClient()
