from pydantic import BaseModel, EmailStr

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

    class Config:
        orm_mode = True

from typing import Optional, Dict, Any

class CleanOperation(BaseModel):
    dataset_id: int
    operation: str
    params: Optional[Dict[str, Any]] = None

class CleanOperationResponse(BaseModel):
    success: bool
    message: str
    rows_affected: Optional[int] = None
    new_stats: Optional[Dict[str, Any]] = None
