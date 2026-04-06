from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId
from typing import List
from app.database import get_db
from app.auth import get_current_user
from app.schemas.schemas import BudgetCreate, UserUpdate

router = APIRouter(prefix="/api/budgets", tags=["Budgets"])

@router.get("/")
async def get_budgets(user=Depends(get_current_user)):
    db = get_db()
    budgets = await db.budgets.find({"user_id": user["_id"]}).to_list(length=100)
    return {"data": [{"id": b["_id"], **{k: v for k, v in b.items() if k not in ["_id", "user_id"]}} for b in budgets]}

@router.post("/", status_code=201)
async def create_budget(body: BudgetCreate, user=Depends(get_current_user)):
    db = get_db()
    doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "category": body.category,
        "amount": body.amount,
        "period": body.period,
        "spent": 0.0,
        "created_at": datetime.utcnow(),
    }
    await db.budgets.insert_one(doc)
    return {"id": doc["_id"], **{k: v for k, v in doc.items() if k not in ["_id", "user_id"]}}

@router.delete("/{budget_id}", status_code=204)
async def delete_budget(budget_id: str, user=Depends(get_current_user)):
    db = get_db()
    result = await db.budgets.delete_one({"_id": budget_id, "user_id": user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Budget not found")
