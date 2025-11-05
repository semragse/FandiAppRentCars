# FandiRent 3-Tier Architecture

This project restructures the existing static HTML site (`index.html`, `admin.html`) into a simple 3-tier car rental application.

## 1. Frontend (Client)
- Existing static HTML/CSS/JS (`index.html`, `admin.html`).
- Enhancements: Calls REST API for dynamic cars & reservations.
- You can later migrate to React/Vue; current vanilla JS already fetches the backend for reservations.

## 2. Backend (Server)
- Node.js + Express (`backend/server.js`).
- REST Endpoints:
  - `GET /health` – Health check.
  - `GET /cars` – List cars.
  - `GET /reservations?carId=car1` – List reservations (optionally filtered by car).
  - `POST /reservations` – Create reservation with overlap validation.
  - `DELETE /reservations/:id` – Remove reservation.
  - `POST /seed` – Seed initial data (dev only).
- Business rules: Prevent overlapping reservations; auto-calculates price if not provided.

## 3. Database (Persistence)
- Sequelize ORM with dual mode:
  - Default: SQLite file (`database.sqlite`) for easy local start.
  - Optional: PostgreSQL (set `DB_DIALECT=postgres` and connection env vars).
- Models: `Car`, `Reservation` with relations `Car.hasMany(Reservation)`.

## Folder Structure
```
backend/
  server.js
  seed.js
  models/
    index.js
    car.js
    reservation.js
  .env.example
index.html
admin.html
images/
README.md
```

## Quick Start (Windows PowerShell)
```powershell
cd backend
# Install dependencies
npm install
# (Optional) copy env example
cp .env.example .env
# Start API
npm start
```
- API runs on: http://localhost:3001
- `admin.html` already points to this URL.

## Switching to PostgreSQL
Create a `.env` file:
```
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fandirent
DB_USER=postgres
DB_PASS=yourpassword
PORT=3001
```
Then restart the server.

## Seeding Data
```powershell
cd backend
npm run seed   # Destroys existing data and recreates with sample cars/reservations
```
Or hit the endpoint (non-destructive if cars already exist):
```powershell
Invoke-RestMethod -Method Post http://localhost:3001/seed
```

## Extending Further
- Frontend framework: Add a `frontend/` folder with React or Vue; consume the same endpoints.
- Authentication: Add JWT (middleware) for protected admin routes.
- Validation: Use `zod` or `express-validator` for request schemas.
- Testing: Add Jest + Supertest for API tests.

## Sample Reservation Payload
```json
{
  "carId": "car1",
  "startDate": "2025-11-10",
  "endDate": "2025-11-12",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+212600000000"
}
```
Server computes `totalPrice` if omitted.

## Pricing Logic
Currently simple (daily rate * days) in backend; advanced progressive discount & season logic exists only in the frontend UI. To unify, move that logic into a shared module or replicate in backend on create.

## Next Steps
1. Replace in-page `carsDatabase` with dynamic fetch `/cars`.
2. Add PUT endpoint for modifying reservations.
3. Add user accounts & authentication.
4. Centralize price calculation in backend for consistency.

## Troubleshooting
- Port already in use: Change `PORT` in `.env`.
- SQLite locked: Stop previous node process or delete `database.sqlite` safely.
- Postgres auth error: Verify credentials & that the service is running.

Enjoy building FandiRent! 🚗

## Publication sur GitHub
Suivez ces étapes pour versionner et publier le projet:

```powershell
# 1. Vérifier l'état
git status

# 2. Ajouter uniquement ce que vous voulez (ici tout)
git add .

# 3. Créer un commit descriptif
git commit -m "Initialisation du dépôt public + .gitignore"

# 4. (Une seule fois) définir la branche principale sur 'main'
git branch -M main

# 5. Ajouter le remote
git remote add origin https://github.com/semragse/FandiRent.git

# 6. Envoyer le premier push
git push -u origin main

# Commits suivants:
# (modifier des fichiers)
# puis
git add <fichier(s)>
git commit -m "Message clair"
git push

# Si le repo GitHub avait déjà un README initial
# et qu'il y a un conflit d'historiques:
# (utiliser)
# git pull --allow-unrelated-histories origin main
```

Points clés:
- Ne versionnez pas `backend/node_modules` (déjà dans `.gitignore`).
- Ajoutez vos variables sensibles dans `.env` mais ne poussez jamais ce fichier (gardez `.env.example`).
- Utilisez des messages de commit compréhensibles: verbe à l'infinitif + objet ("Ajouter paiement", "Corriger validation dates").

Astuce: pour voir rapidement les derniers commits:
```powershell
git log --oneline -n 10
```

