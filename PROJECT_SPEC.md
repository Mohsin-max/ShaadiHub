# ShaadiHub - Project Specification

**Repository:** https://github.com/Mohsin-max/ShaadiHub

## 1. Project Overview

ShaadiHub is a premium SaaS-style online marketplace in Pakistan connecting 
wedding/event venues (halls, banquets, ballrooms, lawns) with clients 
searching for a venue. There is no online payment system — venue owners and 
clients negotiate a booking through a structured request/offer system, and 
finalize details themselves once a booking is confirmed.

**Three user roles:**
1. **Client** — searches for and browses venues, sends booking requests
2. **Venue Owner** — lists venues (halls/banquets/ballrooms/lawns/etc.), 
   manages availability calendar, handles incoming booking requests
3. **Admin** — oversees the platform (accounts, listings, activity)

---

## 2. Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** .NET (ASP.NET Core Web API)
- **Database:** MySQL (local, via XAMPP — database name `shaadihub`, 
  default XAMPP credentials: host `localhost`, user `root`, empty password, 
  port `3306`)
- **UI source:** UI screens are designed externally in Google Stitch (as 
  HTML/Tailwind), then converted into React components. See Section 9 
  (Development Approach) — **UI is built first, then business logic/backend 
  integration follows.**

---

## 3. Authentication

### 3.1 Signup Page
A single signup page with a toggle: **"Sign up as Client"** vs **"Sign up 
as Venue Owner."**

#### Client Signup Fields:
- First Name
- Last Name
- Email
- Password
- OR "Continue with Google" (Google OAuth)

#### Venue Owner Signup Fields:
- Name
- Email
- Phone
- Password
- (No CNIC. No Google OAuth option for this role.)

### 3.2 Login Page
Single shared login page (email/password) for all roles. System detects 
role after authentication and redirects to the correct dashboard 
(Client / Venue Owner / Admin).

---

## 4. Venue Owner Flow

### 4.1 Venue Owner Dashboard (empty state)
Prominent "Add New Venue" action when the owner has no venues yet.

### 4.2 Add/Edit Venue Form
- **Type** (dropdown): Hall / Banquet / Ballroom / Lawn / Other
- **Venue Name**
- **Capacity** (number, e.g. 300)
- **Images** (multiple upload)
- **Location fields:**
  - **Google Maps Link** — a URL the owner copies from Google Maps 
    pointing to the exact venue location (no in-app map picker)
  - **Area Name** — a free-text field for the commonly known area/
    neighborhood name (e.g. "Liaquatabad", "Gulberg") — used for client-side 
    area filtering, independent of the Maps link
- **Price** (optional)
- **Description** (optional textarea)

### 4.3 Venue Owner Dashboard (after venues added)
- List/grid of all venues owned by this account (an owner can add multiple 
  venues)
- Edit option per venue
- Access to that venue's Booking Calendar
- Access to Incoming Requests for that venue

### 4.4 Booking Calendar (Venue Owner Side — Editable)
- Month-by-month calendar view, starting from the current month/year.
- Owner clicks a date to mark it "Booked" (click again to unmark).
- See Section 6 for full date/year navigation rules.

---

## 5. Client Flow

### 5.1 Browse/Search Page
- **No sidebar navigation for the Client role.**
- Filter panel: **area/neighborhood checkboxes** (multi-select, based on 
  the "Area Name" values venue owners have entered), plus Venue Type, 
  Capacity, and Budget range filters.
- Results as cards: image, venue name, area, type, capacity, starting price.

### 5.2 Venue Detail Page
- Full image gallery
- Full details (name, type, capacity, price, description)
- **"View on Google Maps" link/button** (opens the owner's pasted Maps 
  link in a new tab — no embedded map)
- Booking availability calendar (read-only — see Section 6)
- **No phone number or direct contact info shown here.** Contact info is 
  only revealed once a booking is mutually confirmed (see Section 7).
- Prominent **"Send Booking Request"** action (see Section 7)

### 5.3 Client "My Requests"
- List of the client's booking requests across venues: venue, date, 
  status, current price on the table.
- Clicking a request opens the negotiation detail view (Section 7).

---

## 6. Calendar Logic (Core Feature)

### 6.1 Visual States
| State | Who sees it | Behavior |
|---|---|---|
| Past date | Both | Disabled/greyed out, not clickable |
| Booked date | Both | Highlighted (brand color) |
| Available date | Both | Normal/default |

### 6.2 Venue Owner View
Fully interactive — click a date to mark/unmark as "Booked."

### 6.3 Client View
Read-only — same color logic, no click-to-book action. Purpose: client 
instantly sees which dates are free.

### 6.4 Year/Date Navigation Rules
- Calendar always opens on the current month of the current year (real 
  system date).
- Can navigate forward to future years freely (e.g. 2026 → 2027 → 2028...).
- Cannot navigate backward into past years once the year has changed.
- Individual past dates within the current month auto-disable based on 
  today's real date — never hardcoded, always computed live.
- Past year data stays in the database (never deleted); it's simply not 
  reachable via calendar navigation.
- **Timezone safety is critical:** a date marked "booked" must display as 
  the exact same date on both the owner's and client's side — no off-by-one 
  errors from timezone/UTC conversion. Store and compare dates as plain 
  date values (no implicit timezone shifting).

---

## 7. Booking Request & Offer Negotiation System

*(This replaces any chat/messaging system — there is no open-ended chat 
in this product.)*

### 7.1 Sending a Request
From the venue detail page, a client selects an available date and submits 
a **Booking Request** with:
- The selected date
- An **offer price** (client can propose a price different from the 
  listed price, e.g. venue listed at Rs. 80,000, client offers Rs. 70,000)
- An optional short note

### 7.2 Venue Owner Response
The owner sees incoming requests with: client name (or identifier), venue, 
requested date, listed price vs. offered price (clearly compared). The 
owner can:
- **Accept** the offer as-is
- **Reject** (must provide a short reason, shown to the client)
- **Counter-Offer** (propose a new price, e.g. Rs. 75,000)

### 7.3 Negotiation Loop
If countered, the client sees the updated request with the full 
negotiation trail (a simple history: original offer → counter-offer → 
etc.) and the same three options: Accept / Reject / Counter-Offer. This 
continues until either side Accepts or Rejects.

### 7.4 Confirmation
Once both sides agree (one side Accepts the other's latest offer), the 
request status becomes **"Booked."** At this point:
- The relevant calendar date is automatically marked as booked.
- **Both parties' phone numbers are revealed to each other for the first 
  time** — this is the only point in the flow where contact info is 
  shared. All further coordination (menu, decor, advance payment, etc.) 
  happens offline between the client and venue owner; the platform's 
  responsibility ends here.

### 7.5 Request Statuses
`Pending` → `Countered` (can loop) → `Accepted`/`Booked` or `Rejected`

Status colors (for consistent UI use): Pending = neutral/gold, Countered = 
amber, Accepted = green, Rejected = muted red, Booked = filled brand-plum 
badge.

---

## 8. Admin Panel

- **Dashboard overview:** key stat cards — total venue owners, total 
  clients, total venues listed, pending activity, recent request activity.
- **Venue Owner accounts table:** list of registered venue owners with 
  basic info and account status.
- **All Venues management table:** searchable/filterable table of every 
  venue (name, owner, area, status) with view/deactivate actions.
- **All Clients table:** basic client account info and status.
- *(Approval workflow for new venue owners/listings — to be finalized; 
  not required to block MVP if not explicitly requested.)*

---

## 9. Development Approach — UI First

Unlike a typical backend-first build, this project is being built **UI 
first, then logic:**

1. UI screens are designed in Google Stitch (exported as HTML/Tailwind).
2. Claude Code converts each screen's HTML into corresponding React 
   components, matching the design closely.
3. Once the frontend UI shell for a section is in place, backend (.NET 
   API) and database logic are wired in to make it functional.
4. Repeat per feature area (auth → venue listing → calendar → requests → 
   admin) rather than building all UI before any logic, or vice versa — 
   go section by section: **UI for a section, then its logic, then the 
   next section's UI, then its logic.**

---

## 10. Design System

- **Colors:** Deep plum/violet as primary brand color; a richer, more 
  noticeable **antique-gold** used deliberately as a premium accent (key 
  CTAs, badges, icons, highlights) — not just a faint tint. Warm off-white/
  canvas background, soft neutral grays for borders/secondary text.
- **Typography:** Serif display font (e.g. Fraunces) for headings/brand 
  moments; clean sans-serif (e.g. Inter) for body/UI text. Precise, 
  consistent type scale throughout.
- **Component style:** Compact, refined, appropriately sized — never 
  oversized/bulky. Moderate rounded corners, soft layered shadows, 
  consistent iconography, tight intentional spacing. Enterprise dashboard 
  quality — should feel like a large, established platform, not a 
  prototype.
- **UX priority:** Every screen must be instantly understandable to a 
  non-technical venue owner and a first-time client alike — no ambiguity 
  about what action to take next.

---

## 11. Out of Scope (for now)

- Online payments / in-app transactions
- Reviews and ratings
- Subscription billing for venue owners
- Mobile app (React Native)
- Chat/messaging (intentionally replaced by the request/offer system)