from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, Dict, Any

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(BaseModel):
    user_id: int
    name: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)

class AIConfig(BaseModel):
    provider: str = "openrouter"
    model: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None

class DatasetOut(BaseModel):
    dataset_id: int
    file_name: str
    file_path: str
    rows: int
    columns: int
    upload_time: Any

    model_config = ConfigDict(from_attributes=True)

class CleanOperation(BaseModel):
    dataset_id: int
    operation: str
    params: Optional[Dict[str, Any]] = None

class CleanOperationResponse(BaseModel):
    success: bool
    message: str
    rows_affected: Optional[int] = None
    new_stats: Optional[Dict[str, Any]] = None
