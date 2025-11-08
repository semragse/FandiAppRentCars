# Deployment Guide (Railway + PostgreSQL)

## 1. Overview
Production uses PostgreSQL (DATABASE_URL). Local dev keeps SQLite (`fandicars.db`). Code auto-detects `DATABASE_URL` and switches dialect.

## 2. Files
- `Deploy/railway.toml` – Service start command
- `Deploy/env.example` – Variables reference
- `Deploy/start-migrate.js` – Auth + sync + optional seed

## 3. Required Environment Variables
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://USER:PASS@HOST:5432/DB
DATABASE_SSL=true (or false if Railway disables SSL)
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=app_password
PAYPAL_BUSINESS_EMAIL=business@example.com
SEED_ON_START=false
```

## 4. Steps on Railway
1. Create new project → Add service from GitHub repo.
2. Set build image (Auto).
3. Add env vars from section above.
4. Deploy: Railway runs `npm run migrate && npm run start:prod`.
5. Verify logs: look for `API running on http://` and `Database connection established`.
6. Open public URL: `/health` should return JSON.

## 5. Optional Seeding
Set `SEED_ON_START=true` for first deploy only then revert to false.

## 6. Local Dev
```
cd backend
npm install
npm run seed   # regenerate SQLite with demo data
npm start      # starts API (SQLite)
```

## 7. Troubleshooting
- SSL errors: set `DATABASE_SSL=false` temporarily.
- Missing tables: run `npm run migrate` manually.
- No cars on first prod start: enable seed once or create via admin UI.

## 8. Safety
Never commit real secrets. Use Railway env dashboard.
