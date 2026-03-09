import uuid
from typing import List, Optional
from app.db.supabase import supabase
from app.schemas.league import LeagueCreate, League, LeagueMember

class LeagueService:
    @staticmethod
    def create_league(league_data: LeagueCreate, owner_id: str) -> League:
        # Generate a simple unique invite code
        invite_code = f"BIN-{uuid.uuid4().hex[:6].upper()}"
        
        # Insert league into 'leagues' table
        payload = {
            "name": league_data.name,
            "invite_code": invite_code,
            "owner_id": owner_id
        }
        
        result = supabase.table("leagues").insert(payload).execute()
        new_league = result.data[0]
        
        # Automatically add the owner as the first member
        membership_payload = {
            "league_id": new_league["id"],
            "user_id": owner_id
        }
        supabase.table("league_members").insert(membership_payload).execute()
        
        return League(**new_league)

    @staticmethod
    def join_league(invite_code: str, user_id: str) -> LeagueMember:
        # 1. Find the league by invite code
        league_result = supabase.table("leagues").select("id").eq("invite_code", invite_code).execute()
        
        if not league_result.data:
            raise ValueError("Invalid invite code")
            
        league_id = league_result.data[0]["id"]
        
        # 2. Insert into 'league_members' table
        payload = {
            "league_id": league_id,
            "user_id": user_id
        }
        
        result = supabase.table("league_members").insert(payload).execute()
        return LeagueMember(**result.data[0])

    @staticmethod
    def get_user_leagues(user_id: str) -> List[League]:
        # Fetch leagues where the user is a member
        result = supabase.table("league_members").select("leagues(*)").eq("user_id", user_id).execute()
        
        # Supabase returns nested data for joins, flatten it
        leagues = [League(**item["leagues"]) for item in result.data if "leagues" in item]
        return leagues
