
# SnoopySnack

A food-ordering website for snacks, pizza, donuts, and drinks.

## Release Version

**Current Version: v1.0.0**

This release includes the initial website layout, login and signup interface, food categories, product search, shopping cart, quantity controls, and demo checkout.

## Versioning (Semantic Versioning)

SnoopySnack follows Semantic Versioning (MAJOR.MINOR.PATCH).

- MAJOR: Incompatible changes that require significant updates.
- MINOR: New features that remain compatible with existing functionality.
- PATCH: Bug fixes and small corrections.

Example: v1.0.1 represents a patch release that fixes bugs without introducing major new features.

## Documentation

- Software Maintenance Plan: `SnoopySnack_Software_Maintenance_Plan.pdf`
- Disaster Recovery Plan: `SnoopySnack_Disaster_Recovery_Plan.pdf`

## Technologies Used

- HTML
- CSS
- GitHub
- Node.js, Express
- Supabase (Postgres), Vercel

## Backend API (Node.js + Express + Supabase)

The website (in `public/`) and the API run together from one Express server. Data is stored in Supabase (Postgres) and the app can be deployed on Vercel.

### Setup
1. Create a project at https://supabase.com.
2. In **SQL Editor**, run `supabase/schema.sql` (snacks table + 24 seed items), then `supabase/users.sql` (users table for signup/login).
3. Copy `.env.example` to `.env` and fill in `SUPABASE_URL` (base URL only), `SUPABASE_KEY` (publishable key) and `SUPABASE_SERVICE_KEY` (secret key, server only) from Project Settings > API Keys.
4. `npm install`, then `npm start`, and open http://localhost:3000

### Endpoints
- `GET /api/snacks` (optional `?category=Pizza`, `?available=true`)
- `POST /api/signup` and `POST /api/login` with JSON `{ "username": "...", "password": "..." }`

### Deploy to Vercel
Import the GitHub repo in Vercel and add `SUPABASE_URL`, `SUPABASE_KEY` and `SUPABASE_SERVICE_KEY` under **Settings > Environment Variables**, then deploy.
