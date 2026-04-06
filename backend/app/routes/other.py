from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId
from app.database import get_db
from app.auth import get_current_user
from app.schemas.schemas import CashCreate, LoanCreate, UserUpdate

# ── Cash ──────────────────────────────────────────────────────────────────────
cash_router = APIRouter(prefix="/api/cash", tags=["Cash"])

@cash_router.get("/")
async def get_cash(user=Depends(get_current_user)):
    db = get_db()
    entries = await db.cash.find({"user_id": user["_id"]}).sort("created_at", -1).to_list(length=200)
    return {"data": [{"id": e["_id"], "type": e["type"], "amount": e["amount"],
             "category": e["category"], "note": e.get("note", ""),
             "date": e["date"], "created_at": e["created_at"]} for e in entries]}

@cash_router.post("/", status_code=201)
async def create_cash(body: CashCreate, user=Depends(get_current_user)):
    db = get_db()
    now = datetime.utcnow()
    doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "type": body.type,
        "amount": body.amount,
        "category": body.category,
        "note": body.note or "",
        "date": now.strftime("%b %d, %Y"),
        "created_at": now,
    }
    await db.cash.insert_one(doc)
    return {"id": doc["_id"], **{k: v for k, v in doc.items() if k not in ["_id", "user_id"]}}

@cash_router.delete("/{entry_id}", status_code=204)
async def delete_cash(entry_id: str, user=Depends(get_current_user)):
    db = get_db()
    result = await db.cash.delete_one({"_id": entry_id, "user_id": user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Entry not found")

@cash_router.get("/summary")
async def cash_summary(user=Depends(get_current_user)):
    db = get_db()
    pipeline = [{"$match": {"user_id": user["_id"]}},
                {"$group": {"_id": "$type", "total": {"$sum": "$amount"}}}]
    result = await db.cash.aggregate(pipeline).to_list(length=10)
    cash_in  = next((r["total"] for r in result if r["_id"] == "in"), 0)
    cash_out = next((r["total"] for r in result if r["_id"] == "out"), 0)
    return {"cash_in": cash_in, "cash_out": cash_out, "balance": cash_in - cash_out}


# ── Loans ─────────────────────────────────────────────────────────────────────
loan_router = APIRouter(prefix="/api/loans", tags=["Loans"])

@loan_router.get("/")
async def get_loans(user=Depends(get_current_user)):
    db = get_db()
    loans = await db.loans.find({"user_id": user["_id"]}).sort("created_at", -1).to_list(length=100)
    return [{"id": l["_id"], **{k: v for k, v in l.items() if k not in ["_id", "user_id"]}} for l in loans]

@loan_router.post("/", status_code=201)
async def create_loan(body: LoanCreate, user=Depends(get_current_user)):
    db = get_db()
    doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "type": body.type,
        "name": body.name,
        "amount": body.amount,
        "interest_rate": body.interest_rate,
        "duration": body.duration,
        "purpose": body.purpose,
        "status": "Active",
        "progress": 0.0,
        "created_at": datetime.utcnow(),
    }
    await db.loans.insert_one(doc)
    return {"id": doc["_id"], **{k: v for k, v in doc.items() if k not in ["_id", "user_id"]}}

@loan_router.delete("/{loan_id}", status_code=204)
async def delete_loan(loan_id: str, user=Depends(get_current_user)):
    db = get_db()
    result = await db.loans.delete_one({"_id": loan_id, "user_id": user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Loan not found")


# ── Analytics ─────────────────────────────────────────────────────────────────
analytics_router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@analytics_router.get("/summary")
async def analytics_summary(user=Depends(get_current_user)):
    db = get_db()
    pipeline = [{"$match": {"user_id": user["_id"]}},
                {"$group": {"_id": "$type", "total": {"$sum": "$amount"}}}]
    result = await db.transactions.aggregate(pipeline).to_list(length=10)
    income  = next((r["total"] for r in result if r["_id"] == "income"), 0)
    expense = next((r["total"] for r in result if r["_id"] == "expense"), 0)
    savings_rate = round(((income - expense) / income) * 100, 1) if income > 0 else 0

    cat_pipeline = [{"$match": {"user_id": user["_id"], "type": "expense"}},
                    {"$group": {"_id": "$category", "total": {"$sum": "$amount"}}},
                    {"$sort": {"total": -1}}, {"$limit": 1}]
    top = await db.transactions.aggregate(cat_pipeline).to_list(length=1)
    top_category = top[0]["_id"] if top else "N/A"

    return {"total_income": income, "total_expense": expense,
            "net_surplus": income - expense, "savings_rate": savings_rate,
            "top_category": top_category, "growth_pct": 12.4}

@analytics_router.get("/monthly")
async def monthly_breakdown(user=Depends(get_current_user)):
    db = get_db()
    pipeline = [
        {"$match": {"user_id": user["_id"]}},
        {"$group": {
            "_id": {"month": {"$month": "$created_at"}, "type": "$type"},
            "total": {"$sum": "$amount"}
        }},
        {"$sort": {"_id.month": 1}}
    ]
    result = await db.transactions.aggregate(pipeline).to_list(length=100)
    return result

@analytics_router.get("/categories")
async def category_breakdown(user=Depends(get_current_user)):
    db = get_db()
    pipeline = [
        {"$match": {"user_id": user["_id"], "type": "expense"}},
        {"$group": {"_id": "$category", "total": {"$sum": "$amount"}}},
        {"$sort": {"total": -1}}
    ]
    return await db.transactions.aggregate(pipeline).to_list(length=20)


# ── User ──────────────────────────────────────────────────────────────────────
user_router = APIRouter(prefix="/api/users", tags=["Users"])

@user_router.get("/me")
async def get_me(user=Depends(get_current_user)):
    return {k: v for k, v in user.items() if k != "password"}

@user_router.patch("/me")
async def update_me(body: UserUpdate, user=Depends(get_current_user)):
    db = get_db()
    update = {k: v for k, v in body.dict().items() if v is not None}
    result = await db.users.find_one_and_update(
        {"_id": user["_id"]}, {"$set": update}, return_document=True
    )
    return {k: v for k, v in result.items() if k != "password"}
