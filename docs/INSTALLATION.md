# Installation Guide

## Prerequisites

- Node.js 18+
- MongoDB (local install, or a free cluster on MongoDB Atlas)
- npm

## 1. Clone / Unzip the project

```bash
cd TransitOps
```

## 2. Backend setup

```bash
cd server
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/transitops
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

If using MongoDB Atlas, set `MONGO_URI` to your connection string, e.g.
`mongodb+srv://<user>:<password>@cluster0.mongodb.net/transitops`.

Install dependencies and seed demo data:

```bash
npm install
npm run seed
```

The seed script creates 5 demo users (one per role), 24 vehicles, 20 drivers,
60+ historical trips, active draft/dispatched trips, maintenance records, 80
fuel logs and 40 expenses — enough for every dashboard chart and report to
render meaningfully out of the box.

Start the API:

```bash
npm run dev      # nodemon, auto-restarts on change
# or
npm start        # plain node
```

The API runs on `http://localhost:5000`. Health check: `GET /api/health`.

## 3. Frontend setup

In a new terminal:

```bash
cd client
npm install
npm run dev
```

The app runs on `http://localhost:5173` and proxies `/api` requests to the
backend (configured in `vite.config.js`).

## 4. Login

Use any of the demo accounts listed in the root `README.md`
(password `password123`), or register a new account from `/register`.

## 5. Production build

```bash
# Frontend
cd client
npm run build        # outputs to client/dist — serve with any static host / nginx

# Backend
cd server
npm start             # set NODE_ENV=production and a real JWT_SECRET first
```

## Troubleshooting

- **`MongoServerError: connect ECONNREFUSED`** — MongoDB isn't running locally.
  Start it with `mongod`, or switch `MONGO_URI` to an Atlas connection string.
- **401 errors immediately after login** — check that `JWT_SECRET` in `.env`
  hasn't changed between requests (restarting the server with a new secret
  invalidates existing tokens; just log in again).
- **CORS errors** — make sure `CLIENT_URL` in `server/.env` matches the URL
  the frontend is actually served from.
