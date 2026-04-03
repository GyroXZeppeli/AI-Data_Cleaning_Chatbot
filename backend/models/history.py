from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from models.database import Base
from datetime import datetime

class History(Base):
    __tablename__ = "history"

    history_id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.dataset_id"))
    action = Column(String(500))
    timestamp = Column(DateTime, default=datetime.utcnow)
