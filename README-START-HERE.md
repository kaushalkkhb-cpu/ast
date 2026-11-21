# AST PRO — AI Smart Trading Terminal

AST PRO is a staged trading workspace. This repository contains the web UI and FastAPI authentication/API foundation.

## Current status
- Responsive React/Vite dashboard and sign-in/register screens.
- Frontend login is connected to the FastAPI register, login and current-user endpoints.
- Passwords are hashed with Argon2; API access uses short-lived JWT bearer tokens.
- SQLAlchemy supports local SQLite and hosted PostgreSQL via psycopg 3.
- Dashboard figures are sample placeholders only.
- No broker is connected. No real orders can be sent. Live trading is intentionally disabled.

## Run locally

### Backend
1. Open a terminal in `backend`.
2. Create and activate a Python virtual environment.
3. Install dependencies: `pip install -r requirements.txt`.
4. Copy `.env.example` to `.env`; set a long random `JWT_SECRET_KEY` for any shared environment.
5. Run: `uvicorn main:app --reload --port 8000`.
6. API docs: `http://localhost:8000/docs`.

### Frontend
1. Open a terminal in `frontend`.
2. Run `npm install`.
3. Set `VITE_API_BASE_URL=http://localhost:8000` in a local `.env` file.
4. Run `npm run dev` and open the Vite URL, usually `http://localhost:5173`.

Authentication endpoints:
- `POST /api/auth/register` — JSON: `{"email":"you@example.com","password":"at-least-10-characters"}`
- `POST /api/auth/login` — returns a bearer access token.
- `GET /api/auth/me` — requires `Authorization: Bearer <token>`.
- `GET /api/health/database` — checks database connectivity.

## Free test deployment (not production)

The `render.yaml` Blueprint describes a free Render static site and API service. It does not create a database automatically.

1. Create a free Supabase project and copy its PostgreSQL connection string from Project Settings → Database. Keep its password private.
2. Ensure the connection string uses the SQLAlchemy driver prefix `postgresql+psycopg://`; the backend also normalizes standard `postgresql://` and `postgres://` prefixes.
3. Open Render and create a Blueprint from this GitHub repository. Review the two services.
4. When prompted for `DATABASE_URL`, paste the Supabase connection string. When prompted for `ALLOWED_ORIGINS`, enter the exact frontend origin shown by Render (for example, `https://ast-pro-web.onrender.com`).
5. After the API service is created, set the frontend service's `VITE_API_BASE_URL` to the full API origin (for example, `https://ast-pro-api.onrender.com`), then trigger a new frontend deploy. Use the actual URLs shown in your Render dashboard, not the examples.
6. Check `/api/health` and `/api/health/database` on the API URL, then test registration and login on the website.

Render free web services sleep after 15 minutes idle and may take about a minute to wake. Free Render Postgres expires after 30 days, so this blueprint expects Supabase for PostgreSQL. Supabase Free projects may pause after a week of low activity. Free tiers are suitable for a prototype only, not for a service users rely on or 24/7 trading. Confirm current limits before deployment.

## Security and trading safeguards
- The Render Blueprint generates a production JWT secret. Never commit secrets or send them in chat.
- Configure exact CORS origins; do not use wildcard origins with credentials.
- Add email verification, password reset, login rate limiting, monitoring and database migrations before opening registration publicly.
- Do not store broker credentials in the browser or source code.
- No broker is connected, no real market data is connected, and live trading is disabled. Do not interpret sample dashboard values as real balances, P&L, or signals.
