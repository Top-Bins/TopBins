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
        league_res = supabase.table("leagues").select("creator_id").eq("id", league_id).execute()
        if not league_res.data:
            raise ValueError("League not found")
        if str(league_res.data[0]["creator_id"]) != creator_id:
            raise ValueError("Only the league creator can start the draft")
            
        result = supabase.table("leagues").update({"status": "drafting"}).eq("id", league_id).execute()
        if not result.data:
            raise Exception("Failed to update league status")
        return {"status": "success"}

    @staticmethod
    def get_draft_state(league_id: str) -> dict:
        league_res = supabase.table("leagues").select("status").eq("id", league_id).execute()
        if not league_res.data:
            raise ValueError("League not found")
        status = league_res.data[0].get("status", "pending")
        
        teams_res = supabase.table("teams").select("id").eq("league_id", league_id).order("created_at").execute()
        teams = [team["id"] for team in teams_res.data]
        
        if not teams:
            return {"status": status, "current_turn_team_id": None, "draft_order": [], "picks": [], "is_complete": False}
            
        picks_res = supabase.table("team_players").select("team_id, player_id").in_("team_id", teams).execute()
        picks = picks_res.data if picks_res.data else []
        
        num_picks = len(picks)
        total_teams = len(teams)
        max_players_per_team = 15
        
        is_complete = num_picks >= total_teams * max_players_per_team
        
        current_turn_team_id = None
        if not is_complete:
            round_num = num_picks // total_teams
            position_in_round = num_picks % total_teams
            
            if round_num % 2 != 0:
                turn_index = total_teams - 1 - position_in_round
            else:
                turn_index = position_in_round
                
            current_turn_team_id = teams[turn_index]
            
        return {
            "status": status,
            "current_turn_team_id": current_turn_team_id,
            "draft_order": teams,
            "picks": picks,
            "is_complete": is_complete
        }

    @staticmethod
    def make_draft_pick(league_id: str, user_id: str, player_id: str) -> dict:
        team_res = supabase.table("teams").select("id").eq("league_id", league_id).eq("user_id", user_id).execute()
        if not team_res.data:
            raise ValueError("You are not part of this league")
        user_team_id = team_res.data[0]["id"]
        
        state = LeagueService.get_draft_state(league_id)
        if state["is_complete"]:
            raise ValueError("Draft is already complete")
        if state["current_turn_team_id"] != user_team_id:
            raise ValueError("It is not your turn to pick")
            
        if any(str(pick["player_id"]) == player_id for pick in state["picks"]):
            raise ValueError("Player has already been drafted in this league")
            
        result = supabase.table("team_players").insert({
            "team_id": user_team_id,
            "player_id": player_id
        }).execute()
        
        if not result.data:
            raise Exception("Failed to save draft pick")
            
        new_state = LeagueService.get_draft_state(league_id)
        if new_state["is_complete"]:
            supabase.table("leagues").update({"status": "active"}).eq("id", league_id).execute()
            
        return {"status": "success", "pick": result.data[0]}
