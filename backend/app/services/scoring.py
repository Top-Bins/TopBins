# app/services/scoring.py

from app.db.supabase import supabase
from datetime import datetime, timedelta, timezone


class ScoringService:
    # 1. Define the Point Map based on developer_name
    POINT_MAP = {
        "GOALS": 10,
        "ASSISTS": 6,
        "INTERCEPTIONS": 1,
        "BLOCKED_SHOTS": 1,
        "ACCURATE_CROSSES": 1,
        "ACCURATE_PASSES": 0.1,
        "BALL_RECOVERY": 1,
        "BIG_CHANCES_CREATED": 2,
        "DISPOSSESSED": -0.5,
        "DRIBBLED_PAST": 1, # As requested
        "DUELS_WON": 0.5,
        "DUELS_LOST": -0.5,
        "FOULS": -0.5,
        "KEY_PASSES": 1,
        "PASSES_IN_FINAL_THIRD": 0.1,
        "PENALTIES_WON": 3,
        "SAVES": 2,
        "TACKLES_WON": 0.5,
        "TOUCHES": 0.1,
        "YELLOWCARDS": -1,
        "REDCARDS": -4,
        "SHOTS_ON_TARGET": 1
    }

    async def calculate_pending_scores(self):
        # 1. Fetch the data - ensure we select 'stats' as well
        response = supabase.table("player_match_stats") \
            .select("id, stats, match_id, player_id, matches!inner(finished)") \
            .eq("scored", False) \
            .eq("matches.finished", True) \
            .execute()

        stats_records = response.data
        if not stats_records:
            return {"message": "No pending stats to score."}

        updates = []

        for record in stats_records:
            record_id = record["id"]
            # We need the actual dictionary for the math
            perf_data = record.get("stats", {}).get("performance_data", [])
            
            total_score = 0.0

            for stat in perf_data:
                dev_name = stat.get("developer_name")
                value = stat.get("value", 0)

                if dev_name == "MINUTES_PLAYED":
                    if value > 60: total_score += 2
                    elif value >= 1: total_score += 1
                elif dev_name in self.POINT_MAP:
                    total_score += (value * self.POINT_MAP[dev_name])

            # 2. Re-include EVERY non-nullable column in the update
            updates.append({
                "id": record_id,
                "player_id": record["player_id"],
                "match_id": record["match_id"],
                "stats": record["stats"], # Re-including the JSON block satisfies the constraint
                "points_earned": round(total_score, 1),
                "scored": True
            })

        # 3. Batch update back to Supabase
        if updates:
            # This will now succeed because the 'stats' column isn't null in the payload
            supabase.table("player_match_stats").upsert(updates).execute()

        return {
            "status": "success",
            "players_scored": len(updates)
        }

    # Add this method to your existing ScoringService class
    async def update_matchweek_standings(self, matchweek_id: int):
        """
        Aggregates all player stats for a specific matchweek 
        and updates the player_matchweek_scores table.
        """
        # 1. Fetch all points earned by players in this matchweek
        # We join with 'matches' to filter by matchweek_id
        response = supabase.table("player_match_stats") \
            .select("player_id, points_earned, matches!inner(matchweek_id)") \
            .eq("matches.matchweek_id", matchweek_id) \
            .execute()

        stats_entries = response.data
        if not stats_entries:
            return {"message": f"No stats found for matchweek {matchweek_id}"}

        # 2. Aggregate points per player using a dictionary
        # Dictionary structure: { player_id: total_points }
        weekly_totals = {}
        for entry in stats_entries:
            p_id = entry["player_id"]
            points = entry["points_earned"] or 0
            
            if p_id in weekly_totals:
                weekly_totals[p_id] += points
            else:
                weekly_totals[p_id] = points

        # 3. Prepare data for upsert
        upsert_data = [
            {
                "player_id": p_id,
                "matchweek_id": matchweek_id,
                "total_points": round(total, 1)
            }
            for p_id, total in weekly_totals.items()
        ]

        # 4. Push to player_matchweek_scores
        if upsert_data:
            # Note: This requires a Unique Constraint or Composite Primary Key 
            # on (player_id, matchweek_id) in your database to work as an update.
            try:
                supabase.table("player_matchweek_scores").upsert(upsert_data).execute()
            except Exception as e:
                print(f"Error updating standings: {e}")
                return {"status": "error", "message": str(e)}

        return {
            "status": "success",
            "matchweek": matchweek_id,
            "players_tallied": len(upsert_data)
        }

    async def backfill_all_matchweeks(self):
        """
        Helper to run the standings update for every matchweek in the DB.
        Useful for your initial 228-match setup.
        """
        weeks_res = supabase.table("matchweeks").select("id").execute()
        week_ids = [w['id'] for w in weeks_res.data]
        
        results = []
        for mw_id in week_ids:
            res = await self.update_matchweek_standings(mw_id)
            results.append(res)
            
        return {"status": "complete", "weeks_processed": len(results)}


    async def run_daily_scoring_pipeline(self):
        print(f"[{datetime.now()}] Starting Daily Scoring Pipeline...")

        # Step 1: Sync raw stats from Sportmonks
        # We use the function we built that checks finished=True, stats_synced=False
        sync_result = await match_service.sync_finished_match_stats()
        print(f"Sync Complete: {sync_result.get('matches_synced', 0)} matches synced.")

        # Step 2: Calculate points for all new performances
        # This handles the 1000-row batches we set up
        score_result = await self.calculate_all_pending_scores()
        print(f"Scoring Complete: {score_result.get('total_scored', 0)} players scored.")

        # Step 3: Update Matchweek Standings
        # We only want to update weeks that actually have games
        # Usually, this is the 'live' week and the most recent 'finished' week
        active_weeks_res = supabase.table("matchweeks") \
            .select("id") \
            .or_("status.eq.live,status.eq.finished") \
            .execute()
        
        active_week_ids = [w['id'] for w in active_weeks_res.data]

        for mw_id in active_week_ids:
            standing_res = await self.update_matchweek_standings(mw_id)
            print(f"Standings Updated for Week {mw_id}: {standing_res.get('players_tallied')} players.")

        return {"status": "success", "message": "Full pipeline executed."}

scoring_service = ScoringService()