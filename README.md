# TransitOps — Smart Transport Operations Platform

TransitOps is a full-stack MERN transport operations platform that digitizes
vehicle, driver, dispatch, maintenance, and expense management — replacing the
spreadsheet-and-logbook workflow with a single operational source of truth.

Built for an 8-hour hackathon sprint. The core is fully functional: real
authentication, a rules-driven dispatch engine, and live analytics.

---

## ✨ Highlights

- **Role-based access** — Admin, Fleet Manager, Driver, Safety Officer, Financial Analyst
- **Dispatch rules engine** — every trip dispatch is validated server-side against 7 business rules
  (retired/in-shop vehicle, already-on-trip vehicle/driver, suspended driver, expired license, cargo over capacity)
- **Automatic status transitions** — dispatching/completing/cancelling trips and opening/closing
  maintenance records automatically flips vehicle & driver status
- **Live dashboard** — animated KPI cards, vehicle status donut, monthly trips/expenses/fuel charts, recent trips table
- **Fuel & expense tracking** with automatic operational-cost roll-ups
- **Reports** — fleet utilization, fuel efficiency, per-vehicle ROI, CSV export
- **Search, filter, sort & pagination** on every list view
- **Dark mode**, responsive layout, toast notifications, loading skeletons

## 🧱 Tech Stack

**Frontend:** React (Vite) · Tailwind CSS · React Router DOM · React Hook Form ·
Axios · React Icons · Recharts · Framer Motion

**Backend:** Node.js · Express · MongoDB · Mongoose · JWT · bcryptjs · express-validator

## 📁 Project Structure

```
TransitOps/
├── client/          # React (Vite) frontend
│   └── src/
│       ├── components/   # navbar, sidebar, ui, charts, tables, modals, loaders...
│       ├── pages/         # auth, dashboard, vehicles, drivers, trips, maintenance, fuel, reports, settings, profile
│       ├── layouts/        # AuthLayout, DashboardLayout
│       ├── context/         # AuthContext, ThemeContext
│       ├── services/         # axios API modules
│       ├── hooks/, utils/, routes/, store/
├── server/           # Express + MongoDB backend
│   └── src/
│       ├── models/        # User, Vehicle, Driver, Trip, Maintenance, FuelLog, Expense
│       ├── controllers/     # business logic per module
│       ├── routes/           # REST endpoints
│       ├── middleware/        # auth (JWT + RBAC), validation, error handling
│       ├── validators/         # express-validator rule sets
│       ├── utils/               # ApiFeatures (search/filter/sort/paginate), CSV export, token generator
│       ├── seed/                 # demo data generator
│       └── constants/             # shared enums
└── docs/
```

See `docs/INSTALLATION.md` for setup and `docs/API.md` for the full endpoint reference.

## 🚀 Quick Start

```bash
# 1. Backend
cd server
cp .env.example .env      # edit MONGO_URI / JWT_SECRET if needed
npm install
npm run seed               # populate demo data (24 vehicles, 20 drivers, 60+ trips...)
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm run dev                  # http://localhost:5173
```

### Demo logins (password: `password123`)

| Role | Email |
|---|---|
| Admin | admin@transitops.com |
| Fleet Manager | fleetmanager@transitops.com |
| Driver | driver@transitops.com |
| Safety Officer | safety@transitops.com |
| Financial Analyst | finance@transitops.com |

## 🔐 Business Rules Enforced on Dispatch

A trip can only move `Draft → Dispatched` if **all** of the following pass:

1. Vehicle is not Retired
2. Vehicle is not In Shop
3. Vehicle is not already On Trip
4. Driver is not Suspended
5. Driver is not already On Trip
6. Driver's license has not expired
7. Cargo weight does not exceed the vehicle's max capacity

Completing a trip returns both vehicle and driver to `Available`. Cancelling a
dispatched trip does the same. Opening a maintenance record automatically sets
the vehicle to `In Shop`; completing it restores `Available` (unless retired).

## 📌 Notes & Roadmap

The mandatory deliverables (auth/RBAC, full CRUD, trip validations, automatic
status transitions, maintenance workflow, fuel & expense tracking, dashboard,
charts, CSV export, search/filter/sort, dark mode) are implemented end-to-end.
Bonus items not wired up in this build — PDF export, email reminders for
license expiry, QR codes, and Cloudinary document upload — are straightforward
additions on top of the existing structure (see `docs/ROADMAP.md`).
