from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db
from models.dataset import Dataset
from models.history import History
from models.schemas import CleanOperation, CleanOperationResponse
from services.data_cleaner import DataCleaner
from services.analysis_engine import analyze_dataset
from routes.datasets import get_current_user_id

router = APIRouter(prefix="/clean", tags=["cleaning"])

@router.post("/", response_model=CleanOperationResponse)
def apply_cleaning_operation(
    operation: CleanOperation,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    dataset = db.query(Dataset).filter(Dataset.dataset_id == operation.dataset_id, Dataset.user_id == user_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found or access denied")
        
    try:
        cleaner = DataCleaner(dataset.file_path)
        rows_affected = 0
        action_desc = ""
        
        op = operation.operation
        params = operation.params or {}
        
        if op == "drop_duplicates":
            rows_affected = cleaner.drop_duplicates()
            action_desc = f"Dropped {rows_affected} duplicate rows"
        elif op == "fill_missing":
            col = params.get("column")
            method = params.get("method")
            if not col or not method: raise ValueError("column and method required")
            rows_affected = cleaner.fill_missing(col, method, params.get("value"))
            action_desc = f"Filled {rows_affected} missing values in '{col}' using {method}"
        elif op == "drop_missing":
            col = params.get("column")
            rows_affected = cleaner.drop_missing(col)
            action_desc = f"Dropped {rows_affected} rows with missing values" + (f" in '{col}'" if col else "")
        elif op == "remove_outliers":
            col = params.get("column")
            if not col: raise ValueError("column required")
            rows_affected = cleaner.remove_outliers(col)
            action_desc = f"Removed {rows_affected} outlier rows in '{col}'"
        elif op == "rename_column":
            old_name = params.get("old_name")
            new_name = params.get("new_name")
            if not old_name or not new_name: raise ValueError("old_name and new_name required")
            cleaner.rename_column(old_name, new_name)
            action_desc = f"Renamed column '{old_name}' to '{new_name}'"
        elif op == "drop_column":
            col = params.get("column")
            if not col: raise ValueError("column required")
            cleaner.drop_column(col)
            action_desc = f"Dropped column '{col}'"
        else:
            raise HTTPException(status_code=400, detail=f"Unknown operation: {op}")
            
        # Re-analyze to update metadata
        new_analysis = analyze_dataset(dataset.file_path)
        if new_analysis.get("success"):
            dataset.rows = new_analysis["summary"]["rows"]
            dataset.columns = new_analysis["summary"]["columns"]
            
        # Log History
        hist = History(dataset_id=dataset.dataset_id, action=action_desc)
        db.add(hist)
        db.commit()
        
        return {
            "success": True, 
            "message": action_desc,
            "rows_affected": rows_affected,
            "new_stats": new_analysis.get("summary") if new_analysis.get("success") else None
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
