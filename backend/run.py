#!/usr/bin/env python3
"""
Simple Backend Startup Script
Run this to start the backend server
"""

import sys
import os

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

print("=" * 60)
print("🚀 Starting The Financial Atelier Backend")
print("=" * 60)
print()

# Check if dependencies are installed
try:
    import fastapi
    import uvicorn
    import motor
    print("✅ Dependencies found")
except ImportError as e:
    print(f"❌ Missing dependency: {e}")
    print()
    print("Please install dependencies:")
    print("  pip3 install -r requirements.txt")
    sys.exit(1)

# Check if .env file exists
env_file = os.path.join(backend_dir, '.env')
if not os.path.exists(env_file):
    print("❌ .env file not found!")
    print(f"Expected location: {env_file}")
    sys.exit(1)
else:
    print("✅ .env file found")

print()
print("🔌 Connecting to MongoDB Atlas...")
print("📊 Database: Druminaa")
print("🌐 Server will start on: http://localhost:8000")
print("📖 API Docs: http://localhost:8000/docs")
print()
print("Press Ctrl+C to stop the server")
print("=" * 60)
print()

# Start the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
