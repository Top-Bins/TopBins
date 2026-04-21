import httpx
from typing import Any, Dict, Optional
from app.core.config import settings
from app.db.supabase import supabase
from datetime import datetime, timedelta, timezone

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
        params = {"include": "lineups.details.type"}
        response = await self.get(f"fixtures/{match_id}", params=params)
        
        fixture_data = response.get("data", {})
        if not fixture_data:
            return {"status": "error", "message": "No data found"}

        lineups = fixture_data.get("lineups", [])
        stats_to_upsert = []

        # 2. Extract and clean player stats
        for entry in lineups:
            player_id = entry.get("player_id")
            details = entry.get("details", [])

            # Skip if there's no player ID or the details list is empty
            if not player_id or not details:
                continue

            processed_stats = []
            for stat in details:
                stat_type = stat.get("type", {})
                
                processed_stats.append({
                    "type_id": stat.get("type_id"),
                    "developer_name": stat_type.get("developer_name"),
                    "value": stat.get("data", {}).get("value"),
                    "name": stat_type.get("name"),
                    "group": stat_type.get("stat_group")
                })

            stats_to_upsert.append({
                "player_id": player_id,
                "match_id": match_id,
                "stats": {"performance_data": processed_stats},
                "points_earned": 0  # Default to 0, let your scoring logic handle this later
            })

        # 3. Batch push to Supabase
        if stats_to_upsert:
            try:
                # Note: This will fail if a player_id doesn't exist in your 'players' table 
                # due to Foreign Key constraints.
                supabase.table("player_match_stats").upsert(stats_to_upsert).execute()
            except Exception as e:
                print(f"Upsert failed: {e}")
                return {"status": "error", "message": str(e)}

        return {"status": "success", "players_synced": len(stats_to_upsert)}

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
                
                # Show meta on first page to confirm structure
                if page == 1:
                    print(f"🔍 DEBUG Meta for chunk {current_start.strftime('%m/%d')}: {meta}")
                
                for fix in fixtures:
                    # 1. Parse Names
                    full_name = fix.get("name", "Unknown vs Unknown")
                    home, away = full_name.split(" vs ", 1) if " vs " in full_name else (full_name, "Unknown")
                    
                    # 2. Determine if Finished (result_info is null for upcoming games)
                    result_info = fix.get("result_info")
                    is_finished = result_info is not None
                    
                    # 3. Upsert into Supabase
                    supabase.table("matches").upsert({
                        "id": fix.get("id"),
                        "home_team_name": home.strip(),
                        "away_team_name": away.strip(),
                        "kickoff_at": fix.get("starting_at"),
                        "finished": is_finished,
                        "stats_synced": False # Reset to False to ensure stats are re-collected if needed
                    }).execute()
                
                total_matches += len(fixtures)
                print(f"   ✅ Page {page}: {len(fixtures)} matches synced.")

                # --- ROBUST PAGINATION CHECK ---
                pagination = meta.get("pagination", {})
                has_more = meta.get("has_more") or pagination.get("has_more")
                
                # If has_more is missing, but we got a full page (usually 25 or 50), 
                # we try the next page just to be safe.
                if has_more is False:
                    break
                if has_more is None and len(fixtures) < 25:
                    break
                    
                page += 1
                if page > 15: # Safety break
                    break

            current_start = current_end + timedelta(days=1)
                    
        print(f"--- ✨ Finished! Total matches in DB: {total_matches} ---")
        return {"status": "success", "matches_synced": total_matches}
 
    async def run_match_maintenance(self):
        print("--- 🧹 Starting Match Maintenance ---")
        now = datetime.now(timezone.utc).isoformat()
        
        try:
            # 1. Mark past matches as finished
            # We look for matches where kickoff is less than (lt) 'now'
            res_finished = supabase.table("matches")\
                .update({"finished": True})\
                .lt("kickoff_at", now)\
                .execute()
            
            print(f"   ✅ Marked {len(res_finished.data)} past matches as finished.")

            res_stats = supabase.table("matches")\
                .update({"stats_synced": False})\
                .execute()
                
            print(f"   ✅ Reset stats_synced for {len(res_stats.data)} matches")
            
            return {
                "status": "success", 
                "matches_finished": len(res_finished.data),
                "stats_reset": len(res_stats.data)
            }

        except Exception as e:
            print(f"🚨 Maintenance failed: {e}")
            return {"status": "error", "message": str(e)}

sportmonks = SportmonksClient()