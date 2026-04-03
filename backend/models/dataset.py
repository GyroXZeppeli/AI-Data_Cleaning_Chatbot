from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from models.database import Base
from datetime import datetime

class Dataset(Base):
    __tablename__ = "datasets"

    dataset_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    file_name = Column(String(255))
    file_path = Column(String(500))
    upload_time = Column(DateTime, default=datetime.utcnow)
    rows = Column(Integer)
    columns = Column(Integer)
