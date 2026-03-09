from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

# Base schema for shared attributes
class LeagueBase(BaseModel):
    name: str

# Schema for creating a league
class LeagueCreate(LeagueBase):
    pass

# Schema for joining a league
class LeagueJoin(BaseModel):
    invite_code: str

# Schema for returning a league (API response)
class League(LeagueBase):
    id: UUID
    invite_code: str
    owner_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Schema for league membership
class LeagueMember(BaseModel):
    league_id: UUID
    user_id: UUID
    joined_at: datetime

    class Config:
        from_attributes = True
