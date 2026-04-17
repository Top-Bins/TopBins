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

    async def sync_match_stats(self, match_id: int):
        # 1. Fetch the data from Sportmonks
        params = {"include": "lineups.details"}
        fixture_data = await self.get(f"fixtures/{match_id}", params=params)

        supabase.table("matches").upsert({
            "id": match_id,
            "name": fixture_data['name'],
            "starting_at": fixture_data['starting_at']
        }).execute()
 
        data = fixture_data.get("data", {})
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
        
        # Convert string dates to datetime objects
        current_start = datetime.strptime(start_date, "%Y-%m-%d")
        final_end = datetime.strptime(end_date, "%Y-%m-%d")
        
        total_matches = 0
        
        # We loop in 90-day chunks to stay safely under the 100-day API limit
        while current_start < final_end:
            # Calculate the end of this specific chunk
            current_end = min(current_start + timedelta(days=90), final_end)
            
            start_str = current_start.strftime("%Y-%m-%d")
            end_str = current_end.strftime("%Y-%m-%d")
            
            print(f"   🔄 Syncing chunk: {start_str} to {end_str}...")
            
            params = {"filters": f"fixtureLeagues:{league_id}"}
            
            try:
                endpoint = f"fixtures/between/{start_str}/{end_str}"
                response = await self.get(endpoint, params=params)
                fixtures = response.get("data", [])
                
                for fix in fixtures:
                    # 1. Split "Team A vs Team B" into two variables
                    full_name = fix.get("name", "Unknown vs Unknown")
                    if " vs " in full_name:
                        home, away = full_name.split(" vs ", 1)
                    else:
                        home, away = full_name, "Unknown"

                    # 2. Upsert using your EXACT Supabase column names
                    supabase.table("matches").upsert({
                        "id": fix.get("id"),
                        "home_team_name": home.strip(),
                        "away_team_name": away.strip(),
                        "kickoff_at": fix.get("starting_at"), # Maps starting_at -> kickoff_at
                        # "matchweek_id": fix.get("round_id") # Optional: mapping round to matchweek
                    }).execute()
                
                total_matches += len(fixtures)
                
                # Move the window forward for the next loop (start at end + 1 day)
                current_start = current_end + timedelta(days=1)
                
            except Exception as e:
                print(f"🚨 Match Sync failed for chunk {start_str}: {e}")
                break # Stop the loop if we hit a real error

        print(f"--- ✨ Finished! Total matches synced: {total_matches} ---")
        return {"status": "success", "matches_synced": total_matches}
 

sportmonks = SportmonksClient()