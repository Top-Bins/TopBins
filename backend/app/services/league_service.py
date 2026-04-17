import uuid
import random
from typing import List, Optional
from app.db.supabase import supabase
from app.schemas.league import LeagueCreate, League, LeagueMember

class LeagueService:
    @staticmethod
    def _ensure_profile_exists(user_id: str):
        """Ensures a profile exists for the user to satisfy foreign key constraints."""
        try:
            # Check if profile exists
            res = supabase.table("profiles").select("id").eq("id", user_id).execute()
            if not res.data:
                # Create a default profile
                supabase.table("profiles").insert({
                    "id": user_id
                }).execute()
        except Exception:
            # Ignore errors here; if it's a hard FK error, the main operation will fail with a clear DB message
            pass

    @staticmethod
    def create_league(league_data: LeagueCreate, creator_id: str, team_name: str = "My Team") -> League:
        # Ensure profile exists first (satisfy leagues.creator_id -> profiles.id)
        LeagueService._ensure_profile_exists(creator_id)
        
        # Generate a unique invite code
        invite_code = f"BIN-{uuid.uuid4().hex[:6].upper()}"
        
        # Insert league into 'leagues' table 
        payload = {
            "name": league_data.name,
            "invite_code": invite_code,
            "creator_id": creator_id
        }
        
        result = supabase.table("leagues").insert(payload).execute()
        if not result.data:
            raise ValueError(f"Failed to create league: {result}")
            
        new_league = result.data[0]
        
        # Automatically create the first team for the creator
        team_payload = {
            "league_id": new_league["id"],
            "user_id": creator_id,
            "team_name": team_name
        }
        supabase.table("teams").insert(team_payload).execute()
        
        return League(**new_league)

    @staticmethod
    def join_league(invite_code: str, user_id: str, team_name: str) -> LeagueMember:
        # Ensure profile exists first
        LeagueService._ensure_profile_exists(user_id)
        
        # 1. Find the league by invite code
        league_result = supabase.table("leagues").select("id").eq("invite_code", invite_code).execute()
        
        if not league_result.data:
            raise ValueError("Invalid invite code")
            
        league_id = league_result.data[0]["id"]
        
        # 2. Insert into 'teams' table (instead of league_members)
        payload = {
            "league_id": league_id,
            "user_id": user_id,
            "team_name": team_name
        }
        
        try:
            result = supabase.table("teams").insert(payload).execute()
            return LeagueMember(**result.data[0])
        except Exception as e:
            if "23505" in str(e) or "teams_user_id_league_id_key" in str(e):
                raise Exception("Already in league")
            raise e

    @staticmethod
    def get_user_leagues(user_id: str) -> List[League]:
        # Fetch leagues where the user has a team
        result = supabase.table("teams").select("leagues(*)").eq("user_id", user_id).execute()
        
        leagues = [League(**item["leagues"]) for item in result.data if "leagues" in item]
        return leagues

    @staticmethod
    def get_league_details(league_id: str) -> dict:
        # Fetch league details
        league_res = supabase.table("leagues").select("*").eq("id", league_id).execute()
        if not league_res.data:
            raise ValueError(f"League {league_id} not found")
        league_data = league_res.data[0]

        # Fetch teams/members
        teams_res = supabase.table("teams").select("*").eq("league_id", league_id).execute()
        
        members = []
        for team in teams_res.data:
            members.append({
                "id": team["id"],
                "user_id": team["user_id"],
                "name": "Manager",
                "team_name": team["team_name"],
                "points": 0, # Placeholder
                "rank": 0    # Placeholder
            })
        
        league_data["members"] = members
        return league_data

    @staticmethod
    def start_draft(league_id: str, creator_id: str) -> dict:
        # Fetch league details to verify creator
        league_res = supabase.table("leagues").select("*").eq("id", league_id).execute()
        if not league_res.data:
            raise ValueError(f"League {league_id} not found")
        league_data = league_res.data[0]
        
        if league_data["creator_id"] != creator_id:
            raise ValueError("Only the league creator can start the draft")
            
        settings = league_data.get("settings") or {}
        if settings.get("draft_status") in ["ACTIVE", "COMPLETED"]:
            raise ValueError("Draft has already started or is completed")
            
        # Fetch all teams in the league
        teams_res = supabase.table("teams").select("id").eq("league_id", league_id).execute()
        team_ids = [t["id"] for t in teams_res.data]
        
        if not team_ids:
            raise ValueError("No teams in the league to draft")
            
        # Shuffle for random order
        random.shuffle(team_ids)
        
        # 16 rounds snake draft
        draft_order = []
        for round_num in range(16):
            if round_num % 2 == 0:
                draft_order.extend(team_ids)
            else:
                draft_order.extend(reversed(team_ids))
                
        settings["draft_status"] = "ACTIVE"
        settings["draft_order"] = draft_order # Array of team_ids representing each pick
        settings["current_pick_index"] = 0
        settings["draft_picks"] = [] # Array of objects: {pick_number, team_id, player_id}
        
        # Update database
        update_res = supabase.table("leagues").update({"settings": settings}).eq("id", league_id).execute()
        if not update_res.data:
            raise ValueError("Failed to update league settings")
            
        return update_res.data[0]

    @staticmethod
    def get_available_players(league_id: str) -> List[dict]:
        league_res = supabase.table("leagues").select("settings").eq("id", league_id).execute()
        if not league_res.data:
            raise ValueError("League not found")
            
        settings = league_res.data[0].get("settings") or {}
        draft_picks = settings.get("draft_picks") or []
        drafted_player_ids = [pick.get("player_id") for pick in draft_picks]
        
        players_res = supabase.table("players").select("*").limit(500).execute()
        
        available = [p for p in players_res.data if p["id"] not in drafted_player_ids]
        return available

    @staticmethod
    def make_draft_pick(league_id: str, user_id: str, player_id: int) -> dict:
        league_res = supabase.table("leagues").select("*").eq("id", league_id).execute()
        if not league_res.data:
            raise ValueError("League not found")
        league_data = league_res.data[0]
        
        settings = league_data.get("settings") or {}
        if settings.get("draft_status") != "ACTIVE":
            raise ValueError("Draft is not active")
            
        team_res = supabase.table("teams").select("id").eq("league_id", league_id).eq("user_id", user_id).execute()
        if not team_res.data:
            raise ValueError("User is not in this league")
        user_team_id = team_res.data[0]["id"]
        
        draft_order = settings.get("draft_order", [])
        current_pick_index = settings.get("current_pick_index", 0)
        
        if current_pick_index >= len(draft_order):
            raise ValueError("Draft is already finished")
            
        if draft_order[current_pick_index] != user_team_id:
            raise ValueError("It is not your turn to pick")
            
        draft_picks = settings.get("draft_picks", [])
        if player_id in [p["player_id"] for p in draft_picks]:
            raise ValueError("Player is already drafted")
            
        draft_picks.append({
            "pick_number": current_pick_index + 1,
            "team_id": user_team_id,
            "player_id": player_id
        })
        
        settings["draft_picks"] = draft_picks
        settings["current_pick_index"] = current_pick_index + 1
        
        if settings["current_pick_index"] >= len(draft_order):
            settings["draft_status"] = "COMPLETED"
            
        update_res = supabase.table("leagues").update({"settings": settings}).eq("id", league_id).execute()
        return update_res.data[0]
