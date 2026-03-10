import uuid
from typing import List, Optional
from app.db.supabase import supabase
from app.schemas.league import LeagueCreate, League, LeagueMember

class LeagueService:
    @staticmethod
    def create_league(league_data: LeagueCreate, creator_id: str, team_name: str = "My Team") -> League:
        # Generate a unique invite code
        invite_code = f"BIN-{uuid.uuid4().hex[:6].upper()}"
        
        # Insert league into 'leagues' table (matches screenshot: creator_id)
        payload = {
            "name": league_data.name,
            "invite_code": invite_code,
            "creator_id": creator_id
        }
        
        result = supabase.table("leagues").insert(payload).execute()
        new_league = result.data[0]
        
        # Automatically create the first team for the creator (matches screenshot: teams table)
        team_payload = {
            "league_id": new_league["id"],
            "user_id": creator_id,
            "team_name": team_name
        }
        supabase.table("teams").insert(team_payload).execute()
        
        return League(**new_league)

    @staticmethod
    def join_league(invite_code: str, user_id: str, team_name: str) -> LeagueMember:
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
