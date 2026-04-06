from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId
from app.database import get_db
from app.auth import get_current_user
from app.schemas.schemas import GoalCreate, GoalUpdate

router = APIRouter(prefix="/api/goals", tags=["Goals"])

def fmt(g: dict) -> dict:
    progress = round((g["current_amount"] / g["target_amount"]) * 100, 1) if g["target_amount"] > 0 else 0
    return {"id": g["_id"], "title": g["title"], "category": g["category"],
            "target_amount": g["target_amount"], "current_amount": g["current_amount"],
            "deadline": g.get("deadline"), "progress": progress, "created_at": g["created_at"]}

@router.get("/")
async def get_goals(user=Depends(get_current_user)):
    db = get_db()
    goals = await db.goals.find({"user_id": user["_id"]}).to_list(length=100)
    return {"data": [fmt(g) for g in goals]}

@router.post("/", status_code=201)
async def create_goal(body: GoalCreate, user=Depends(get_current_user)):
    db = get_db()
    doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "title": body.title,
        "category": body.category,
        "target_amount": body.target_amount,
        "current_amount": body.current_amount,
        "deadline": body.deadline,
        "created_at": datetime.utcnow(),
    }
    await db.goals.insert_one(doc)
    return fmt(doc)

@router.patch("/{goal_id}")
async def update_goal(goal_id: str, body: GoalUpdate, user=Depends(get_current_user)):
    db = get_db()
    update = {k: v for k, v in body.dict().items() if v is not None}
    result = await db.goals.find_one_and_update(
        {"_id": goal_id, "user_id": user["_id"]},
        {"$set": update},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Goal not found")
    return fmt(result)

@router.delete("/{goal_id}", status_code=204)
async def delete_goal(goal_id: str, user=Depends(get_current_user)):
    db = get_db()
    result = await db.goals.delete_one({"_id": goal_id, "user_id": user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Goal not found")
