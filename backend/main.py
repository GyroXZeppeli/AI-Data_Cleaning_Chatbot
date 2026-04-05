import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, datasets, cleaning, ai_agent, insights, download, history as history_router
from models import user, dataset, history
from models.database import engine

load_dotenv()

# Create the database tables
user.Base.metadata.create_all(bind=engine)
dataset.Base.metadata.create_all(bind=engine)
history.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Data Cleaning API")

cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(datasets.router)
app.include_router(cleaning.router)
app.include_router(ai_agent.router)
app.include_router(insights.router)
app.include_router(history_router.router)
app.include_router(download.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Data Cleaning API"}
