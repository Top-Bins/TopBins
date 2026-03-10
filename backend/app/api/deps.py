import jwt
import base64
import httpx
from typing import Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Simple cache for JWKS to avoid over-fetching
JWKS_CACHE: Dict[str, Any] = {}

def get_jwks() -> Dict[str, Any]:
    global JWKS_CACHE
    if JWKS_CACHE:
        return JWKS_CACHE
    
    url = f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json"
    headers = {"apikey": settings.SUPABASE_KEY}
    
    try:
        with httpx.Client() as client:
            response = client.get(url, headers=headers)
            response.raise_for_status()
            JWKS_CACHE = response.json()
            return JWKS_CACHE
    except Exception as e:
        print(f"JWKS Fetch Error: {e}", flush=True)
        return {"keys": []}

def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        header = jwt.get_unverified_header(token)
        alg = header.get("alg")
        kid = header.get("kid")

        if alg in ["ES256", "RS256"]:
            # Asymmetric validation using JWKS
            jwks = get_jwks()
            public_key = None
            
            for key in jwks.get("keys", []):
                if key.get("kid") == kid:
                    try:
                        from jwt.algorithms import get_default_algorithms
                        alg_obj = get_default_algorithms().get(alg)
                        if alg_obj:
                            public_key = alg_obj.from_jwk(key)
                    except Exception:
                        pass
                    break
            
            if not public_key:
                raise credentials_exception
            
            payload = jwt.decode(
                token, 
                public_key, 
                algorithms=[alg],
                options={"verify_aud": False}
            )
        else:
            # Symmetric validation (standard Supabase HS256)
            secret = settings.SUPABASE_JWT_SECRET
            if len(secret) > 40: 
                try:
                    secret = base64.b64decode(secret)
                except Exception:
                    pass
            
            payload = jwt.decode(
                token, 
                secret, 
                algorithms=["HS256"], 
                options={"verify_aud": False}
            )

        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"JWT Validation Error: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
