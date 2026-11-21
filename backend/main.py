import os
from datetime import datetime, timezone
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import text
from database import Base, engine, get_db
from auth import router as auth_router, get_current_user
import models  # Register ORM models before creating tables

app = FastAPI(title="AST PRO API", version="0.2.0")
allowed_origins = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

@app.on_event("startup")
def create_database_tables():
    Base.metadata.create_all(bind=engine)

app.include_router(auth_router)

class RiskSettings(BaseModel):
    mode: str = Field(default="paper", pattern="^(paper|live)$")
    max_risk_percent: float = Field(default=1.0, ge=0.1, le=2.0)
    daily_loss_limit_percent: float = Field(default=2.0, ge=0.5, le=5.0)
    max_open_positions: int = Field(default=3, ge=1, le=10)

@app.get("/")
def root():
    return {"name": "AST PRO", "message": "API is running", "docs": "/docs"}

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "ast-pro-api", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.get("/api/health/database")
def database_health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}

@app.get("/api/dashboard")
def dashboard(user=Depends(get_current_user)):
    return {
        "mode": "PAPER / DEMO",
        "market_data": "SAMPLE",
        "account_balance": 10000.0,
        "today_pnl": 0.0,
        "open_positions": 0,
        "win_rate": None,
        "signals": [
            {"symbol": symbol, "side": "WAIT", "confidence": 0, "reason": "Market data provider not connected"}
            for symbol in ["XAUUSD", "NIFTY", "BANKNIFTY"]
        ],
    }

@app.get("/api/risk-defaults")
def risk_defaults():
    return RiskSettings().model_dump()
