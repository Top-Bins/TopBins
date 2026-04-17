from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

# Base schema for shared attributes
class LeagueBase(BaseModel):
    name: str

# Schema for creating a league
class LeagueCreate(LeagueBase):
    team_name: str

# Schema for joining a league
class LeagueJoin(BaseModel):
    invite_code: str
    team_name: str

# Schema for returning a league (API response)
class League(LeagueBase):
    id: UUID
    invite_code: str
    creator_id: UUID
    settings: Optional[dict] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Schema for league membership (via Teams table)
class LeagueMember(BaseModel):
    id: UUID
    league_id: UUID
    user_id: UUID
    team_name: str
    created_at: datetime

    class Config:
        from_attributes = True

class MemberDetail(BaseModel):
    id: UUID
    user_id: str
    name: str
    team_name: str
    points: int
    rank: int

class LeagueDetails(League):
    members: list[MemberDetail]
