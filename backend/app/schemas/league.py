from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, Union

# Base schema for shared attributes
class LeagueBase(BaseModel):
    name: str
    status: Optional[str] = "pending"

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
    created_at: datetime
    status: str

    class Config:
        from_attributes = True

class DraftPick(BaseModel):
    team_id: UUID
    player_id: Union[str, int]

class DraftState(BaseModel):
    status: str
    current_turn_team_id: Optional[UUID]
    draft_order: list[UUID]
    picks: list[DraftPick]
    is_complete: bool


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
