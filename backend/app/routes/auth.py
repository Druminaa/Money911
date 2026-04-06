from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from bson import ObjectId
from app.database import get_db
from app.auth import hash_password, verify_password, create_access_token
from app.schemas.schemas import RegisterRequest, LoginRequest, TokenResponse, GoogleAuthRequest
from app.config import settings
import logging
import httpx

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse)
async def register(body: RegisterRequest):
    try:
        db = get_db()
        
        # Check if user already exists
        existing_user = await db.users.find_one({"email": body.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create new user
        user_id = str(ObjectId())
        user = {
            "_id": user_id,
            "full_name": body.full_name,
            "email": body.email,
            "password": hash_password(body.password),
            "phone": "",
            "address": "",
            "currency": "USD ($)",
            "plan": "Free",
            "created_at": datetime.utcnow(),
        }
        
        # Insert user into database
        await db.users.insert_one(user)
        logger.info(f"User registered: {body.email}")
        
        # Create access token
        token = create_access_token({"sub": user_id})
        
        # Return response without password
        user_response = {k: v for k, v in user.items() if k != "password"}
        return {"access_token": token, "user": user_response}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    try:
        db = get_db()
        
        # Find user by email
        user = await db.users.find_one({"email": body.email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Verify password
        if not verify_password(body.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Create access token
        token = create_access_token({"sub": user["_id"]})
        logger.info(f"User logged in: {body.email}")
        
        # Return response without password
        user_response = {k: v for k, v in user.items() if k != "password"}
        return {"access_token": token, "user": user_response}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@router.post("/google", response_model=TokenResponse)
async def google_auth(body: GoogleAuthRequest):
    """Authenticate user with Google OAuth token"""
    try:
        # Verify Google token by getting user info
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {body.token}"}
            )
            
            if response.status_code != 200:
                logger.error(f"Google API error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=401, detail="Invalid Google token")
            
            google_data = response.json()
            
            email = google_data.get("email")
            name = google_data.get("name", "")
            
            if not email:
                raise HTTPException(status_code=400, detail="Email not provided by Google")
        
        db = get_db()
        
        # Check if user exists
        user = await db.users.find_one({"email": email})
        
        if not user:
            # Create new user from Google account
            user_id = str(ObjectId())
            user = {
                "_id": user_id,
                "full_name": name,
                "email": email,
                "password": "",  # No password for Google auth users
                "phone": "",
                "address": "",
                "currency": "USD ($)",
                "plan": "Free",
                "auth_provider": "google",
                "created_at": datetime.utcnow(),
            }
            await db.users.insert_one(user)
            logger.info(f"New user registered via Google: {email}")
        else:
            user_id = user["_id"]
            logger.info(f"User logged in via Google: {email}")
        
        # Create access token
        token = create_access_token({"sub": user_id})
        
        # Return response without password
        user_response = {k: v for k, v in user.items() if k != "password"}
        return {"access_token": token, "user": user_response}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Google auth error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Google authentication failed: {str(e)}")
