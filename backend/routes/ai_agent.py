from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models.database import get_db
from models.dataset import Dataset
from services.ai_agent import generate_cleaning_plan, process_natural_language_query
from services.analysis_engine import analyze_dataset
from routes.datasets import get_current_user_id
from models.schemas import AIConfig

router = APIRouter(prefix="/ai", tags=["ai"])

class ChatRequest(BaseModel):
    dataset_id: int
    user_message: str
    ai_config: AIConfig

class AutoCleanRequest(BaseModel):
    dataset_id: int
    ai_config: AIConfig

@router.post("/auto-clean-plan")
def get_auto_clean_plan(req: AutoCleanRequest, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    dataset = db.query(Dataset).filter(Dataset.dataset_id == req.dataset_id, Dataset.user_id == user_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    analysis = analyze_dataset(dataset.file_path)
    if not analysis.get("success"):
        raise HTTPException(status_code=500, detail="Failed to analyze dataset")
        
    summary_str = f"Rows: {analysis['summary']['rows']}, Columns: {analysis['summary']['columns']}"
    issues_str = f"Missing values: {analysis['issues']['total_missing']}, Duplicates: {analysis['issues']['duplicates']}"
    
    try:
        plan = generate_cleaning_plan(summary_str, issues_str, req.ai_config)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service request failed: {str(e)}")
    
    return {"plan": plan, "analysis": analysis}

@router.post("/chat")
def chat_with_agent(req: ChatRequest, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    dataset = db.query(Dataset).filter(Dataset.dataset_id == req.dataset_id, Dataset.user_id == user_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    analysis = analyze_dataset(dataset.file_path)
    columns_str = ", ".join(analysis["summary"]["column_names"]) if analysis.get("success") else "unknown"
    
    try:
        ai_response = process_natural_language_query(req.user_message, columns_str, req.ai_config)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service request failed: {str(e)}")
    
    # In a full flow, we'd parse this response, potentially execute the pandas code safely, 
    # and return the result. For now, we return the AI's answer/code directly.
    return {"ai_response": ai_response}
