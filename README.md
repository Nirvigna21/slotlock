# SlotLock

A concurrency-safe resource booking platform built to solve a problem most booking-app tutorials ignore: **preventing double-booking when multiple users try to book the same slot at the same time.**

Built for turf/court booking, coworking desks, salons, or any shared resource with fixed time slots.

## The Problem

Most student booking-app projects do this:
```
1. Check if slot is free
2. If free, create the booking
```
These are two separate database operations — if two users hit "Book" within milliseconds of each other, both requests can pass step 1 before either completes step 2, resulting in **both bookings succeeding** for the same slot.

SlotLock solves this using **MongoDB transactions + optimistic locking + idempotency keys**, making double-booking structurally impossible rather than just "unlikely."

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas (replica set, required for transactions)
- **Auth:** JWT (access tokens), bcrypt for password hashing
- **Background jobs:** node-cron (auto-releases abandoned slot holds after 2 minutes)

## How Booking Concurrency Is Handled

1. When a user books a slot, the server generates/receives an **idempotency key** — a retried request (e.g. from a flaky network) never creates a duplicate booking.
2. A **MongoDB transaction** wraps three operations atomically: flipping the slot's status, creating the booking record, and writing an audit log (ledger) entry.
3. The slot flip uses `findOneAndUpdate` with a condition (`status: 'open'`) — if another request already claimed the slot, this update matches zero documents, and the booking fails cleanly with a "slot no longer available" response instead of corrupting state.
4. A compound **unique index** on `(resourceId, startTime)` makes it structurally impossible for two slot documents to exist for the same resource and time — enforced at the database level, not just application logic.

## Features

- JWT-based auth with role-based access control (`customer`, `owner`, `admin`)
- Resource management (owners create resources, generate time slots in bulk)
- Concurrency-safe slot booking with transactional guarantees
- Booking cancellation with automatic slot release
- Waitlist system for fully-booked slots
- Background job to auto-release abandoned "held" slots (2-minute hold window)
- Full audit trail (ledger) of every booking/cancellation action

## Project Structure

```
SlotLock/
├── server/               # Express + MongoDB backend
│   ├── src/
│   │   ├── config/       # DB connection
│   │   ├── models/       # Mongoose schemas
│   │   ├── controllers/  # Route logic
│   │   ├── routes/       # API route definitions
│   │   ├── middleware/   # Auth/role protection
│   │   ├── jobs/         # Background cron jobs
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
└── client/               # React frontend
    ├── src/
    │   ├── api/          # Axios instance
    │   ├── context/      # Auth context
    │   ├── components/   # Reusable UI
    │   ├── pages/        # Route pages
    │   └── App.jsx
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (must be a replica set — Atlas's free M0 tier is one by default)

### 1. Clone and set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_random_secret_key
```

```bash
npm run dev
```

### 2. Set up the frontend

```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173`

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Log in |
| GET | `/api/resources` | — | List resources |
| POST | `/api/resources` | Owner | Create a resource |
| POST | `/api/slots/generate` | Owner | Bulk-generate time slots |
| GET | `/api/slots/resource/:id` | — | View slots for a resource |
| POST | `/api/bookings` | Auth | Book a slot (transactional) |
| DELETE | `/api/bookings/:id` | Auth | Cancel a booking |
| GET | `/api/bookings/me` | Auth | View your bookings |

## What's Next

- Automated concurrency test proving zero double-bookings under simultaneous load
- Redis caching for read-heavy slot browsing
- Docker Compose setup for local development
- CI pipeline (GitHub Actions)

## Author

Built by Nirvigna.
