# AST PRO — AI Smart Trading Terminal

Starter workspace for the AST PRO web dashboard and API.

## Current status
- Responsive React/Vite dashboard scaffold.
- FastAPI backend with health, sample dashboard and risk-default endpoints.
- SQLAlchemy database foundation; SQLite is used for local development by default, PostgreSQL is supported through DATABASE_URL.
- Email/password registration and login API with Argon2 password hashing and short-lived JWT access tokens.
- Displayed account and market values are sample placeholders.
- No broker is connected. No real orders can be sent. Live trading is intentionally disabled.

## Run locally

### Backend
1. Open a terminal in the `backend` folder.
2. Create and activate a Python virtual environment.
3. Install dependencies: `pip install -r requirements.txt`.
4. Copy `.env.example` to `.env`. For local-only testing, SQLite works without DATABASE_URL. Before any deployment, set a strong random JWT_SECRET_KEY and a production DATABASE_URL.
5. Run: `uvicorn main:app --reload --port 8000`.
6. API documentation: http://localhost:8000/docs.

Authentication endpoints:
- `POST /api/auth/register` — JSON body: `{"email":"you@example.com","password":"at-least-10-characters"}`
- `POST /api/auth/login` — returns a bearer access token.
- `GET /api/auth/me` — requires `Authorization: Bearer <token>`.
- `GET /api/health/database` — checks database connectivity.

### Frontend
1. Open a terminal in the `frontend` folder.
2. Run `npm install`, then `npm run dev`.
3. Open the local Vite address shown in the terminal, usually http://localhost:5173.

## Security and deployment notes
- Copy `.env.example` to `.env` locally; never commit real secrets.
- Set ALLOWED_ORIGINS to the exact deployed frontend origin(s).
- Replace the local development JWT secret before deployment. Use a long, randomly generated secret stored only in the hosting provider's secret manager.
- Use managed PostgreSQL for a hosted deployment; do not rely on a local SQLite file on ephemeral hosting.
- Add HTTPS, rate limiting, email verification, password reset, login abuse monitoring and database migrations before public production use.
- Do not store broker credentials in the browser or source code.

## Next milestones
1. Connect the frontend login/register screens to the authentication API.
2. Deploy frontend, API and managed database with production secrets.
3. Verified market-data adapter with source and timestamps.
4. Historical backtesting including fees, slippage and out-of-sample validation.
5. Paper trading and audit logs.
6. Angel One and Vantage MT5 integration after verifying current API, IP and account requirements.
7. Live execution only behind explicit authorization, strict risk limits and an emergency kill switch.

No broker is connected and no live trading is enabled. Sample dashboard figures must not be treated as real account or market data.
