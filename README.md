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
cp .env.example .env   # adjust VITE_API_URL if the backend runs elsewhere
npm run dev
```

## Running the backend

```
cd backend
cp .env.example .env   # adjust DB credentials and set a real JWT_SECRET
dotnet tool install --global dotnet-ef   # first time only
dotnet ef database update                # applies migrations to the shaadihub DB
dotnet run
```

Health check: `GET http://localhost:5114/api/health` — returns `{ "status": "ok", "database": "connected" }` when the MySQL connection succeeds.

## Auth

- `POST /api/auth/signup/client` — `{ firstName, lastName, email, password }`
- `POST /api/auth/signup/provider` — `{ name, email, phone, password }`
- `POST /api/auth/login` — `{ email, password }`

All three return `{ token, role, displayName, email }`. Passwords are hashed with BCrypt; tokens are JWTs signed with `JWT_SECRET`.
