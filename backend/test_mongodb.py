import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

async def test_connection():
    try:
        mongodb_url = os.getenv("MONGODB_URL")
        database_name = os.getenv("DATABASE_NAME", "financial_atelier")
        
        print(f"🔄 Connecting to MongoDB Atlas...")
        print(f"Database: {database_name}")
        
        client = AsyncIOMotorClient(mongodb_url, serverSelectionTimeoutMS=5000)
        
        # Test connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas!")
        
        # List databases
        db_list = await client.list_database_names()
        print(f"📚 Available databases: {db_list}")
        
        client.close()
        print("🔌 Connection closed")
        
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        print("\n💡 Common fixes:")
        print("1. Check your MONGODB_URL in .env file")
        print("2. Verify username and password are correct")
        print("3. URL encode special characters in password")
        print("4. Check Network Access allows your IP (0.0.0.0/0)")
        print("5. Verify Database User has proper permissions")

if __name__ == "__main__":
    asyncio.run(test_connection())
