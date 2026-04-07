import uuid
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
                    "id": user_id,
                    "username": f"User-{user_id[:8]}"
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
        
        result = supabase.table("teams").insert(payload).execute()
        return LeagueMember(**result.data[0])

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

        # Fetch teams/members and joined profiles for username
        teams_res = supabase.table("teams").select("*, profiles(username)").eq("league_id", league_id).execute()
        
        members = []
        for team in teams_res.data:
            members.append({
                "id": team["id"],
                "user_id": team["user_id"],
                "name": team["profiles"]["username"] if team.get("profiles") else "Unknown",
                "team_name": team["team_name"],
                "points": 0, # Placeholder
                "rank": 0    # Placeholder
            })
        
        league_data["members"] = members
        return league_data
