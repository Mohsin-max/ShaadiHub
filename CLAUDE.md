# CLAUDE.md

This file provides guidance to Claude Code when working on this repository.

## Project Overview

**ShaadiHub** — a premium SaaS-style marketplace web app for Pakistan 
connecting wedding/event venues (halls, banquets, ballrooms, lawns) with 
clients searching for a venue. Three roles: **Client**, **Venue Owner**, 
and **Admin**. No online payments — bookings are finalized through a 
structured request/offer negotiation system (no chat/messaging). Contact 
info between client and venue owner is hidden until a booking is 
confirmed.

**Repository:** https://github.com/Mohsin-max/ShaadiHub

Full detailed requirements are in `PROJECT_SPEC.md` — always refer to it 
before building any feature. If a requirement is unclear or missing from 
that file, ask before assuming.

## Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** .NET (ASP.NET Core Web API)
- **Database:** MySQL, running locally via **XAMPP**. Database name: 
  `shaadihub` (already created — use this existing database, do not 
  create a new one with a different name).
  - Default XAMPP MySQL credentials (use in backend config/`.env` unless 
    testing shows otherwise): `DB_HOST=localhost`, `DB_USER=root`, 
    `DB_PASSWORD=` (empty), `DB_PORT=3306`, `DB_NAME=shaadihub`
  - Never hardcode credentials in code — use environment variables/
    configuration files (e.g. `appsettings.json` with environment 
    overrides for .NET), and gitignore any file containing secrets.
  - Use a proper migration approach (EF Core migrations, or versioned SQL 
    migration scripts) so schema is version-controlled and reproducible.
- **Design:** Must look like a large, established, premium SaaS platform 
  — think Stripe/Linear/Airbnb dashboard quality. Compact, clean, 
  crystal-clear UI. Never bulky, cluttered, or template-looking. See 
  PROJECT_SPEC.md Section 10 for the full design system (colors, fonts, 
  component style).

## UI Source — Important

UI screens for this project are designed externally in **Google Stitch** 
and provided to Claude Code as **HTML/Tailwind code** by the user. When 
given this HTML:

- Convert it faithfully into React components — preserve the visual 
  design (colors, spacing, typography, layout) as closely as possible.
- Refactor into clean, reusable components (don't just paste raw HTML 
  into a page file) — extract shared pieces (buttons, cards, badges, 
  form inputs) into their own components so they're reused consistently 
  across screens, matching how the design system should behave.
- Wire up interactivity/state/routing appropriately for a React app, even 
  though the source HTML is static.

## Repository Structure & Git Workflow

Monorepo with frontend and backend as **separate top-level folders**, both 
pushed to the GitHub repo above:

```
ShaadiHub/
  /frontend        → React + Tailwind app
  /backend         → .NET Web API app
  PROJECT_SPEC.md
  CLAUDE.md
  README.md
```

- Keep `frontend/` and `backend/` fully independent (own dependency files, 
  own config/secrets, both gitignored appropriately).
- Add a root `.gitignore` covering `node_modules/`, `bin/`, `obj/`, `.env`, 
  build artifacts (`dist/`, `build/`), and any local secrets files.
- Commit and push after each completed milestone/section with a clear, 
  descriptive commit message.
- Do not push broken/non-running code — verify it works first.

## Internal Folder Layout

```
frontend/
  /src
    /components
    /pages
    /hooks
    /context
    /utils
backend/
  (standard ASP.NET Core Web API structure)
  /Controllers
  /Models
  /Data          (DbContext, migrations)
  /Services
  /Middleware
```

## Development Approach — UI First (Important, Different From Usual)

This project is built **UI first, then logic**, section by section — not 
"all UI, then all backend," and not the traditional backend-first 
approach:

1. User provides Stitch-generated HTML for a set of screens (e.g. all 
   Client-facing screens, or all Venue Owner screens).
2. Claude Code converts that HTML into React components/pages first — 
   purely visual, no backend wiring yet.
3. Once a section's UI is in place and confirmed, backend (.NET API 
   endpoints + MySQL) and frontend integration are built to make that 
   section functional.
4. Move to the next section (UI → logic) rather than jumping ahead.

Suggested section order (adjust as the user provides UI for each):
1. Project scaffolding (frontend + backend + MySQL connection, no 
   features yet)
2. Auth (Client + Venue Owner signup/login) — UI then logic
3. Venue Owner: venue listing (add/edit venue, dashboard) — UI then logic
4. Booking calendar (editable + read-only views) — UI then logic
5. Client: browse/search with area-checkbox filters — UI then logic
6. Venue detail page (gallery, calendar, maps link, no contact info 
   shown) — UI then logic
7. Booking Request & Offer Negotiation system (both Client and Venue 
   Owner sides) — UI then logic
8. Admin panel — UI then logic
9. Polish, responsive check, edge cases

## Rules & Conventions

- Follow `PROJECT_SPEC.md` exactly for field names, flows, and logic — 
  especially:
  - Section 6 (calendar date/year rules — timezone-safety is critical, 
    re-read carefully before implementing)
  - Section 7 (booking request/negotiation flow and exactly when contact 
    info is revealed — only after mutual "Booked" confirmation, never 
    before)
  - Section 4.2 (location fields: a Google Maps link field + a separate 
    Area Name field — no map picker UI)
- No CNIC field anywhere in Venue Owner signup.
- No phone/contact info displayed anywhere in the UI for either party 
  until a booking request reaches "Booked" status.
- No chat/messaging UI of any kind — all client↔owner interaction goes 
  through the request/offer system.
- Component names: PascalCase (e.g. `VenueCard.jsx`)
- API routes: RESTful, versioned if appropriate (e.g. `/api/venues`, 
  `/api/auth/login`)
- Passwords hashed (e.g. BCrypt.Net in .NET) — never stored in plain text.
- Role-based access control for Client / Venue Owner / Admin routes, both 
  frontend (route guards) and backend (API authorization).
- After completing each section: test it manually/via automated checks, 
  confirm it works, then move to the next.

## What NOT to build

- Online payments or in-app transactions
- Reviews/ratings
- Subscription billing
- Chat/messaging (replaced by the request/offer system — do not build 
  this even if it seems simpler)