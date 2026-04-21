# app/services/matchweeks.py

from app.db.supabase import supabase
from datetime import datetime, timedelta, timezone

class MatchweekService:
    async def setup_filtered_matchweeks(self):
        # 1. Season Boundaries
        start_date = datetime(2025, 7, 30, tzinfo=timezone.utc)
        end_boundary = datetime(2026, 5, 20, tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        
        current_start = start_date
        valid_week_counter = 1
        final_matchweeks = []

        print("Analyzing season schedule for valid matchweeks...")

        # 2. Iterate through the calendar
        while current_start < end_boundary:
            current_end = current_start + timedelta(days=7)
            
            # Density check
            match_check = supabase.table("matches") \
                .select("id", count="exact") \
                .gte("kickoff_at", current_start.isoformat()) \
                .lt("kickoff_at", current_end.isoformat()) \
                .execute()
            
            match_count = match_check.count if match_check.count is not None else 0

            if match_count >= 5:
                # 3. Use your new ENUM labels exactly as defined
                status = "scheduled"
                if current_end < now:
                    status = "finished"
                elif current_start <= now < current_end:
                    status = "live"

                final_matchweeks.append({
                    "id": valid_week_counter,
                    "start_date": current_start.isoformat(),
                    "end_date": current_end.isoformat(),
                    "status": status
                })
                
                print(f"Week {valid_week_counter} approved: {match_count} games.")
                valid_week_counter += 1

            current_start = current_end

        if not final_matchweeks:
            return {"status": "error", "message": "No valid weeks found."}

        # 4. Save to Supabase
        supabase.table("matchweeks").upsert(final_matchweeks).execute()

        # 5. Link matches to their weeks
        total_linked = 0
        for week in final_matchweeks:
            res = supabase.table("matches") \
                .update({"matchweek_id": week["id"]}) \
                .gte("kickoff_at", week["start_date"]) \
                .lt("kickoff_at", week["end_date"]) \
                .execute()
            total_linked += len(res.data)

        return {
            "status": "success", 
            "weeks_created": len(final_matchweeks),
            "matches_linked": total_linked
        }

matchweek_service = MatchweekService()