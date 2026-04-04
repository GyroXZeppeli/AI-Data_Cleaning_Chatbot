# AI Data Cleaning Chatbot

Full-stack dataset cleaning app with a FastAPI backend and a React/Vite frontend.

## Stack

- Backend: FastAPI, SQLAlchemy, Pandas, Plotly
- Frontend: React, Vite
- AI integration: Google Gemini via `langchain-google-genai`

## Project Structure

```text
AI-Data_Cleaning_Chatbot/
├── backend/
├── frontend/
└── ai_data_cleaning.db
```

## Requirements

- Python 3.12+
- Node.js 20+ and npm
- Git

## Environment Setup

Copy the example env files before starting the app.

### Linux / macOS

```bash
cp .env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Windows PowerShell

```powershell
Copy-Item .env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Then update the values you need:

- `GOOGLE_API_KEY` for Gemini-powered features
- `SECRET_KEY` for JWT signing
- `DATABASE_URL` if you do not want the default SQLite database
- `VITE_API_BASE_URL` if the frontend should target a non-default backend URL

## Backend Setup

### Linux / macOS

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

### Windows

```powershell
cd backend
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

## Frontend Setup

### Linux / macOS / Windows

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

The backend loads values from `backend/.env` automatically at startup.

## Verified Commands

These were verified in setup:

- Backend imports successfully with the declared dependencies
- Backend responds on `GET /`
- Frontend production build succeeds with `npm run build`

## Notes

- The frontend expects the backend at `http://localhost:8000`.
- The backend uses a local SQLite database file.
- There is a non-blocking Pydantic v2 warning in `backend/models/schemas.py` because `orm_mode = True` should eventually be replaced with `from_attributes = True`.
