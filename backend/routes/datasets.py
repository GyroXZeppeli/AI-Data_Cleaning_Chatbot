import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from models.database import get_db
from models.dataset import Dataset
from services.analysis_engine import analyze_dataset

# We need a dependency to get the current user, mimicking the auth flow securely
# For simplicity in this structure, we assume user_id is passed or decoded from token
# Mocking get_current_user for now until we fully wire JWT dependency
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from services.auth import SECRET_KEY, ALGORITHM
from models.schemas import DatasetOut

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return int(user_id)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

router = APIRouter(prefix="/datasets", tags=["datasets"])

UPLOAD_DIR = "datasets/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/", response_model=list[DatasetOut])
def list_datasets(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    datasets = (
        db.query(Dataset)
        .filter(Dataset.user_id == user_id)
        .order_by(Dataset.upload_time.desc())
        .all()
    )
    return datasets

@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    if not (file.filename.endswith('.csv') or file.filename.endswith('.xlsx')):
         raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported")
         
    file_path = os.path.join(UPLOAD_DIR, f"{user_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    analysis = analyze_dataset(file_path)
    if not analysis.get("success"):
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to analyze dataset: {analysis.get('error')}")
        
    new_dataset = Dataset(
        user_id=user_id,
        file_name=file.filename,
        file_path=file_path,
        rows=analysis["summary"]["rows"],
        columns=analysis["summary"]["columns"]
    )
    db.add(new_dataset)
    db.commit()
    db.refresh(new_dataset)
    
    return {
        "dataset_id": new_dataset.dataset_id,
        "message": "Upload successful",
        "analysis": analysis
    }
