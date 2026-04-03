from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Make sure you create a database named 'ai_data_cleaning' in your local MySQL instance
# Replace 'root' and 'password' with your actual MySQL credentials if necessary.
SQLALCHEMY_DATABASE_URL = "sqlite:///./ai_data_cleaning.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
