from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title='AST PRO API', version='0.1.0')
app.add_middleware(CORSMiddleware, allow_origins=['http://localhost:5173'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

class RiskSettings(BaseModel):
    mode: str = Field(default='paper', pattern='^(paper|live)$')
    max_risk_percent: float = Field(default=1.0, ge=0.1, le=2.0)
    daily_loss_limit_percent: float = Field(default=2.0, ge=0.5, le=5.0)
    max_open_positions: int = Field(default=3, ge=1, le=10)

@app.get('/')
def root(): return {'name': 'AST PRO', 'message': 'API is running', 'docs': '/docs'}

@app.get('/api/health')
def health(): return {'status': 'ok', 'service': 'ast-pro-api', 'timestamp': datetime.now(timezone.utc).isoformat()}

@app.get('/api/dashboard')
def dashboard():
    return {'mode': 'PAPER / DEMO', 'market_data': 'SAMPLE', 'account_balance': 10000.0, 'today_pnl': 0.0, 'open_positions': 0, 'win_rate': None, 'signals': [{'symbol': s, 'side': 'WAIT', 'confidence': 0, 'reason': 'Market data provider not connected'} for s in ['XAUUSD', 'NIFTY', 'BANKNIFTY']]}

@app.get('/api/risk-defaults')
def risk_defaults(): return RiskSettings().model_dump()
