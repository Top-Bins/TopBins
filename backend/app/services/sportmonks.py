import httpx
from typing import Any, Dict, Optional
from app.core.config import settings
from app.db.supabase import supabase
from datetime import datetime, timedelta

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

    

    async def sync_players_by_season(self, season_id: int):
        print(f"--- 🚀 Starting Player Sync for Season {season_id} ---")
        
        # We use the verified include string to get the 'person' details (names)
        params = {"include": "players.player"}
        
        try:
            response = await self.get(f"teams/seasons/{season_id}", params=params)
            teams = response.get("data", [])
            
            if not teams:
                print("❌ No teams found. Check the Season ID.")
                return {"status": "error", "message": "No teams found"}

            total_players = 0

            for team in teams:
                club_name = team.get("name")
                # In v3, this list is named 'players'
                squad_entries = team.get("players", [])
                print(f"   ⚽ Processing {club_name} ({len(squad_entries)} roster entries)")
                
                for entry in squad_entries:
                    # The 'player_id' is at the top level of the squad entry
                    player_id = entry.get("player_id")
                    
                    # The 'name' is nested inside the 'player' object
                    player_details = entry.get("player", {})
                    player_name = player_details.get("name")
                    
                    if player_id and player_name:
                        # Upsert into your Supabase table
                        supabase.table("players").upsert({
                            "id": player_id,
                            "name": player_name,
                            "position": "Player", # We can refine this later
                            "club_name": club_name
                        }).execute()
                        total_players += 1
            
            print(f"--- ✨ Sync Finished. Added {total_players} players to Supabase. ---")
            return {"status": "success", "total_players_synced": total_players}

        except Exception as e:
            print(f"🚨 CRITICAL ERROR: {str(e)}")
            import traceback
            traceback.print_exc()
            raise e

    async def sync_matches_by_date_range(self, start_date: str, end_date: str, league_id: int):
        print(f"--- 📅 Syncing Matches for League {league_id} ---")
        
        current_start = datetime.strptime(start_date, "%Y-%m-%d")
        final_end = datetime.strptime(end_date, "%Y-%m-%d")
        total_matches = 0
        
        while current_start < final_end:
            current_end = min(current_start + timedelta(days=90), final_end)
            page = 1
            
            while True:
                params = {
                    "filters": f"fixtureLeagues:{league_id}",
                    "page": page,
                    "per_page": 50 
                }
                
                endpoint = f"fixtures/between/{current_start.strftime('%Y-%m-%d')}/{current_end.strftime('%Y-%m-%d')}"
                response = await self.get(endpoint, params=params)
                fixtures = response.get("data", [])
                meta = response.get("meta", {})
                
                # --- DEBUG: Run this once to see your plan's meta structure ---
                if page == 1 and total_matches == 0:
                    print(f"🔍 DEBUG Meta: {meta}")
                
                for fix in fixtures:
                    full_name = fix.get("name", "Unknown vs Unknown")
                    home, away = full_name.split(" vs ", 1) if " vs " in full_name else (full_name, "Unknown")
                    
                    supabase.table("matches").upsert({
                        "id": fix.get("id"),
                        "home_team_name": home.strip(),
                        "away_team_name": away.strip(),
                        "kickoff_at": fix.get("starting_at")
                    }).execute()
                
                total_matches += len(fixtures)
                print(f"   ✅ {current_start.strftime('%m/%d')} Chunk: Page {page} synced ({len(fixtures)} matches)")

                # ROBUST PAGINATION CHECK
                pagination = meta.get("pagination", {})
                # Check for 'has_more' in meta OR pagination object
                has_more = meta.get("has_more") or pagination.get("has_more")
                
                # Fallback: If we got 25 matches (your likely cap) and has_more is missing/None, 
                # assume there is more data.
                if has_more is False or (not has_more and len(fixtures) < 25):
                    break
                    
                page += 1
                if page > 10: # Safety break to prevent infinite loops
                    break

            current_start = current_end + timedelta(days=1)
                
        print(f"--- ✨ Finished! Total matches in DB: {total_matches} ---")
        return {"status": "success", "matches_synced": total_matches}
 

sportmonks = SportmonksClient()