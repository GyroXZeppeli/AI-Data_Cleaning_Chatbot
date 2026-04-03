from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db
from models.dataset import Dataset
from models.history import History
from routes.datasets import get_current_user_id

router = APIRouter(prefix="/history", tags=["history"])

@router.get("/")
def get_user_history(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    # Get all datasets for user
    datasets = db.query(Dataset).filter(Dataset.user_id == user_id).all()
    if not datasets:
        return {"history": []}
        
    dataset_ids = [d.dataset_id for d in datasets]
    dataset_map = {d.dataset_id: d.file_name for d in datasets}
    
    # Get history for those datasets
    history_records = db.query(History).filter(History.dataset_id.in_(dataset_ids)).order_by(History.timestamp.desc()).all()
    
    result = []
    for h in history_records:
        result.append({
            "history_id": h.history_id,
            "dataset_id": h.dataset_id,
            "dataset_name": dataset_map.get(h.dataset_id, "Unknown"),
            "action": h.action,
            "timestamp": h.timestamp
        })
        
    return {"history": result}
