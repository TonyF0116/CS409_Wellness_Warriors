# Wellness Warriors

Project for tracking daily wellness habits. The repo now contains a lightweight Express backend plus the existing React client.

## Running the apps locally

1. **Backend**
   ```bash
   cd server
   npm install
   npm run dev
   ```
   The API listens on `http://localhost:4000/api` by default and persists data to `server/data/db.json`.

2. **Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Set `VITE_API_BASE_URL` if the backend runs on a different host/port (defaults to `http://localhost:4000/api`):
   ```
   # client/.env
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

## Available API routes

- `GET /api/health` – status check.
- `GET/POST/PUT/DELETE /api/habits` – CRUD operations for habits.
- `POST /api/habits/:id/completions` – log a completion for a day.
- `DELETE /api/habits/:id/completions/:completionId` – undo a completion.
- `GET /api/progress/overview` – aggregated stats (streaks, totals).
- `GET /api/progress/calendar?start=YYYY-MM-DD&end=YYYY-MM-DD` – calendar heatmap data.

All requests accept an optional `x-user-id` header; until authentication is implemented the client sends the logged-in user's generated id.
