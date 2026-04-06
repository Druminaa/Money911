import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from bson import ObjectId
import bcrypt
import sys
import os

# Add the parent directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.config import settings

async def create_demo_account():
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # Demo account details
    demo_email = "demo@financial-atelier.com"
    demo_password = "Demo@123"  # Meets requirements: 1 uppercase, lowercase, special char, number
    
    # Check if demo account already exists
    existing_user = await db.users.find_one({"email": demo_email})
    if existing_user:
        print(f"❌ Demo account already exists with email: {demo_email}")
        client.close()
        return
    
    # Hash password using bcrypt directly
    password_bytes = demo_password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
    
    # Create demo user
    user_id = str(ObjectId())
    demo_user = {
        "_id": user_id,
        "full_name": "Demo User",
        "email": demo_email,
        "password": hashed_password,
        "phone": "+1-234-567-8900",
        "address": "123 Demo Street, Demo City, DC 12345",
        "currency": "USD ($)",
        "plan": "Premium",
        "created_at": datetime.utcnow(),
    }
    
    # Insert demo user
    await db.users.insert_one(demo_user)
    print("✅ Demo account created successfully!")
    print(f"\n📧 Email: {demo_email}")
    print(f"🔑 Password: {demo_password}")
    print(f"\n💡 Use these credentials to login to the application")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_demo_account())
