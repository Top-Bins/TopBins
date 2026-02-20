import os
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

# Setup the Bearer scheme
security = HTTPBearer()
JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
ALGORITHM = "HS256"

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        # 1. Decode and verify the token
        # Note: Supabase uses 'authenticated' as the default audience (aud)
        payload = jwt.decode(
            token, 
            JWT_SECRET, 
            algorithms=[ALGORITHM], 
            audience="authenticated"
        )
        
        # 2. Extract the user ID (the 'sub' claim in JWTs)
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token: Missing sub claim")
            
        return {"user_id": user_id, "email": payload.get("email")}

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")