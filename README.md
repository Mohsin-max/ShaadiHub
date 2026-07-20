# ShaadiHub

Premium venue booking marketplace for Pakistan. See `PROJECT_SPEC.md` for full requirements and `CLAUDE.md` for development guidance.

## Structure

```
frontend/   React + Vite + Tailwind CSS
backend/    ASP.NET Core Web API + MySQL (EF Core / Pomelo)
```

## Prerequisites

- Node.js 18+
- .NET SDK 10
- MySQL running locally (e.g. via XAMPP), with a database named `shaadihub`

## Running the frontend

```
cd frontend
npm install
npm run dev
```

## Running the backend

```
cd backend
cp .env.example .env   # adjust DB credentials if needed
dotnet run
```

Health check: `GET http://localhost:5114/api/health` — returns `{ "status": "ok", "database": "connected" }` when the MySQL connection succeeds.
