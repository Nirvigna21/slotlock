# SlotLock — Setup Instructions

This is your COMPLETE project — everything merged together, both old and new code.
Just replace your current SlotLock folder contents with this (or use this as your project going forward).

## 1. Server setup

cd server
npm install
Create a file named .env (copy .env.example and fill in real values):
  MONGO_URI=your real Atlas connection string
  PORT=5000
  JWT_SECRET=your real random secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

Then:
npm run dev

Expect to see:
  MongoDB connected: ...
  Server running on http://localhost:5000

## 2. Client setup (in a NEW terminal, keep server running)

cd client
npm install
npm run dev

Opens at http://localhost:5173

## 3. Test the full flow in the browser

1. Register as an "owner"
2. Go to "Manage Resources" -> create a resource -> generate slots for a date
3. Log out, register/login as a "customer"
4. Browse resources -> pick a date -> book a slot
5. Go to "My Bookings" -> see it, cancel it if you want

## Full file list

server/
  package.json, .env.example, .gitignore
  src/
    app.js, server.js
    config/db.js
    models/ User.js, Resource.js, Slot.js, Booking.js, Ledger.js, Waitlist.js
    controllers/ authController.js, resourceController.js, slotController.js, bookingController.js
    routes/ authRoutes.js, resourceRoutes.js, slotRoutes.js, bookingRoutes.js
    middleware/ authMiddleware.js
    utils/ generateToken.js
    jobs/ releaseExpiredHolds.js

client/
  package.json, vite.config.js, index.html, .env, .gitignore
  src/
    main.jsx, App.jsx, index.css
    api/axios.js
    context/AuthContext.jsx
    components/ Navbar.jsx, ProtectedRoute.jsx
    pages/ Login.jsx, Register.jsx, Resources.jsx, ResourceDetail.jsx, ManageResources.jsx, MyBookings.jsx
