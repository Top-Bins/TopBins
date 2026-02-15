from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter()

@router.get("/me")
def read_users_me(user = Depends(get_current_user)):
    """
    Fetch the current logged-in user.
    This endpoint is protected and requires a valid Supabase token.
    """
    return {
        "id": user.user.id,
        "email": user.user.email,
        "aud": user.user.aud,
        "created_at": user.user.created_at
    }
