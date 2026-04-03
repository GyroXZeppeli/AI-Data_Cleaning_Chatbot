import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from models.database import get_db
from models.dataset import Dataset
from routes.datasets import get_current_user_id
import pandas as pd

router = APIRouter(prefix="/download", tags=["download"])

@router.get("/{dataset_id}")
def download_dataset(dataset_id: int, format: str = "csv", db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    dataset = db.query(Dataset).filter(Dataset.dataset_id == dataset_id, Dataset.user_id == user_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    if not os.path.exists(dataset.file_path):
        raise HTTPException(status_code=404, detail="File missing from server")
        
    # If requested format is same as original, just send the file
    if (format == "csv" and dataset.file_path.endswith(".csv")) or \
       (format == "xlsx" and dataset.file_path.endswith(".xlsx")):
        return FileResponse(path=dataset.file_path, filename=dataset.file_name, media_type="application/octet-stream")
        
    # Convert format
    try:
        temp_path = f"datasets/uploads/temp_{dataset_id}.{format}"
        if dataset.file_path.endswith('.csv'):
            df = pd.read_csv(dataset.file_path)
        else:
            df = pd.read_excel(dataset.file_path)
            
        if format == "csv":
            df.to_csv(temp_path, index=False)
            media_type = "text/csv"
            dl_name = dataset.file_name.replace(".xlsx", ".csv")
        elif format == "xlsx":
            df.to_excel(temp_path, index=False)
            media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            dl_name = dataset.file_name.replace(".csv", ".xlsx")
        elif format == "json":
            df.to_json(temp_path, orient="records")
            media_type = "application/json"
            dl_name = dataset.file_name.replace(".csv", ".json").replace(".xlsx", ".json")
        else:
            raise HTTPException(status_code=400, detail="Unsupported download format")
            
        return FileResponse(path=temp_path, filename=dl_name, media_type=media_type)
        
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")
