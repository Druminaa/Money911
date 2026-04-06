from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId
from typing import List, Optional
from app.database import get_db
from app.auth import get_current_user
from app.schemas.schemas import TransactionCreate

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

def fmt(t: dict) -> dict:
    return {
        "id": t["_id"],
        "description": t["description"],
        "amount": t["amount"],
        "type": t["type"],
        "category": t["category"],
        "date": t["date"],
        "status": t.get("status", "COMPLETED"),
        "created_at": t["created_at"],
    }

@router.get("/")
async def get_transactions(
    category: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
    user=Depends(get_current_user)
):
    db = get_db()
    query = {"user_id": user["_id"]}
    if category and category != "All Categories":
        query["category"] = category
    if search:
        query["description"] = {"$regex": search, "$options": "i"}

    skip = (page - 1) * limit
    cursor = db.transactions.find(query).sort("created_at", -1).skip(skip).limit(limit)
    transactions = await cursor.to_list(length=limit)
    total = await db.transactions.count_documents(query)
    return {"data": [fmt(t) for t in transactions], "total": total, "page": page}

@router.post("/", status_code=201)
async def create_transaction(body: TransactionCreate, user=Depends(get_current_user)):
    db = get_db()
    doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "description": body.description,
        "amount": body.amount,
        "type": body.type,
        "category": body.category,
        "date": body.date,
        "status": "COMPLETED",
        "created_at": datetime.utcnow(),
    }
    await db.transactions.insert_one(doc)
    return fmt(doc)

@router.delete("/{transaction_id}", status_code=204)
async def delete_transaction(transaction_id: str, user=Depends(get_current_user)):
    db = get_db()
    result = await db.transactions.delete_one({"_id": transaction_id, "user_id": user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")

@router.get("/summary")
async def get_summary(user=Depends(get_current_user)):
    db = get_db()
    pipeline = [
        {"$match": {"user_id": user["_id"]}},
        {"$group": {"_id": "$type", "total": {"$sum": "$amount"}}}
    ]
    result = await db.transactions.aggregate(pipeline).to_list(length=10)
    income = next((r["total"] for r in result if r["_id"] == "income"), 0)
    expense = next((r["total"] for r in result if r["_id"] == "expense"), 0)
    return {"total_income": income, "total_expense": expense, "net_surplus": income - expense}
