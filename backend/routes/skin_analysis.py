from fastapi import APIRouter, HTTPException
from database import get_db
from bson import ObjectId

router = APIRouter()


@router.get("/analyses/{analysis_id}")
async def get_analysis(analysis_id: str):
    db = get_db()
    doc = await db.skin_analyses.find_one({"_id": ObjectId(analysis_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("/analyses/user/{email}")
async def get_analyses_by_user(email: str):
    db = get_db()
    cursor = db.skin_analyses.find({"user_email": email}).sort("created_at", -1)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        results.append(doc)
    return results
