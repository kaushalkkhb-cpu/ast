# AST PRO — AI Smart Trading Terminal

Starter workspace for the AST PRO web dashboard and API.

## Current status
- Responsive React/Vite dashboard scaffold.
- FastAPI backend with health, dashboard sample and risk-default endpoints.
- Displayed account and market values are sample placeholders.
- No broker is connected. No real orders can be sent. Live trading is intentionally disabled.

## Run locally

Backend: enter the backend folder, create and activate a Python virtual environment, run `pip install -r requirements.txt`, then run `uvicorn main:app --reload --port 8000`. API documentation is at http://localhost:8000/docs.

Frontend: enter the frontend folder, run `npm install`, then `npm run dev`. Open the local Vite address shown in the terminal, usually http://localhost:5173.

## Next milestones
1. Authentication and secure user settings.
2. Verified market-data adapter with source and timestamps.
3. Historical backtesting including fees, slippage and out-of-sample validation.
4. Paper trading and audit logs.
5. Angel One and Vantage MT5 integration after verifying current API, IP and account requirements.
6. Live execution only behind explicit authorization, strict risk limits and an emergency kill switch.

Never commit broker passwords, API keys, access tokens or environment files.
