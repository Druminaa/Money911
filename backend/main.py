from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import connect_db, close_db
from app.config import settings
from app.routes.auth import router as auth_router
from app.routes.transactions import router as transactions_router
from app.routes.budgets import router as budgets_router
from app.routes.goals import router as goals_router
from app.routes.other import (
    cash_router, loan_router, analytics_router, user_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(
    title="The Financial Atelier API",
    description="Backend API for The Financial Atelier — Premium Wealth Management",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth_router)
app.include_router(transactions_router)
app.include_router(budgets_router)
app.include_router(goals_router)
app.include_router(cash_router)
app.include_router(loan_router)
app.include_router(analytics_router)
app.include_router(user_router)

@app.get("/")
async def root():
    return {"message": "The Financial Atelier API is running 🏦", "docs": "/docs"}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
