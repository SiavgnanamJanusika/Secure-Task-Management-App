from fastapi import APIRouter, Depends
from ..auth.oauth2 import get_current_user
from ..database.mongodb import tasks_collection

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/user-summary")
async def user_summary(user: dict = Depends(get_current_user)):
    owner_id = str(user["_id"])
    pipeline = [
        {"$match": {"owner_id": owner_id}},
        {"$group": {
            "_id": "$status",
            "count": {"$sum": 1},
            "total_duration": {"$sum": "$duration"}
        }}
    ]
    agg = tasks_collection.aggregate(pipeline)
    summary = {}
    async for row in agg:
        summary[row["_id"]] = {
            "count": row["count"],
            "total_duration": row["total_duration"],
        }
    # include tasks list
    tasks = []
    async for t in tasks_collection.find({"owner_id": owner_id}):
        tasks.append({
            "id": str(t["_id"]),
            "name": t["name"],
            "duration": t["duration"],
            "status": t["status"]
        })
    return {"summary": summary, "tasks": tasks}
