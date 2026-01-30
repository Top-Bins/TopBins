# Top Bin ⚽️

**Top Bin** is a next-generation fantasy soccer platform designed to bridge the "scoring gap." Traditional fantasy sports over-index on goals and assists; Top Bin uses a weighted, multi-dimensional scoring engine to reward the true impact of players, including progressive passes, interceptions, and big chances created.

---

## 🚀 Vision
The "scoring gap" often ignores the contributions of world-class defensive midfielders or creative playmakers who don't always end up on the scoresheet. Our platform develops a transparent, flexible, and data-driven experience that reflects the actual flow of the "beautiful game."

## 🛠 Tech Stack
* **Frontend:** Next.js, Tailwind CSS
* **Backend:** Python, FastAPI
* **Database:** Supabase (PostgreSQL + Auth)
* **API:** Real-time Match Data Integration

## 🎯 Project Goals
* **Custom Scoring Engine:** Design a logic layer to translate raw match data (tackles, key passes) into fractional points.
* **API Integration:** Fetch and normalize real-time match data, player stats, and fixtures.
* **Core Infrastructure:** Secure backend and dashboard-style frontend for squad management.
* **League Management:** Public/private league creation with live weekly/seasonal leaderboards.

## 📅 Milestones

## Milestones for January
  Set up the project repository
  Find a realtime datasource
## Milestones for February
  Finalize the scoring math
  Integrate datasource into database
  Develop backend logic for player scoring
## Milestones for March
  Start work on front end
  Build out API’s to connect front an back
## Milestones for April
  Finalize the frontend
  Launch the League Management system. Implement authentication, league creation, and live point calculation during actual match days.
  Bug fixing, performance optimization, and final documentation.

---

## 🏃‍♂️ How to Run

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase and Sportsmonk credentials

5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`.
   API Documentation: `http://localhost:8000/docs`.
