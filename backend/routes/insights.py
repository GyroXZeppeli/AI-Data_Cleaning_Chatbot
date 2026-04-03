from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db
from models.dataset import Dataset
from services.insights import generate_insights_text
from services.visualization import generate_plot_json
from services.analysis_engine import analyze_dataset
from routes.datasets import get_current_user_id

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/{dataset_id}/summary")
def get_insights_summary(dataset_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    dataset = db.query(Dataset).filter(Dataset.dataset_id == dataset_id, Dataset.user_id == user_id).first()
    if not dataset: raise HTTPException(status_code=404, detail="Dataset not found")
    
    analysis = analyze_dataset(dataset.file_path)
    text = generate_insights_text(analysis)
    
    return {"text_insights": text, "stats": analysis.get("summary")}

@router.get("/{dataset_id}/plot")
def get_plot(dataset_id: int, column: str = "none", plot_type: str = "correlation", db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    dataset = db.query(Dataset).filter(Dataset.dataset_id == dataset_id, Dataset.user_id == user_id).first()
    if not dataset: raise HTTPException(status_code=404, detail="Dataset not found")
    
    result = generate_plot_json(dataset.file_path, column, plot_type)
    if not result["success"]:
         raise HTTPException(status_code=400, detail=result["error"])
         
    return result
