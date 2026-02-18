# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

- **Dev (both servers):** `npm run start:dev` — runs backend (nodemon, port 3001) and React client (port 3000) concurrently
- **Client only:** `npm run client` — starts React dev server on port 3000
- **Server only:** `node server.js` — starts Express server on port 3001
- **Production build:** `npm run build` — builds React app into `client/build/`
- **Install client deps:** `npm run install` (runs `cd client && npm install`)
- **Seed DB:** `mysql -u root -p < seeders/seed.sql`

**Node version:** Node 22 is fine. The `NODE_OPTIONS=--openssl-legacy-provider` flag is set in the client/build scripts for OpenSSL 3.0 compatibility.

## Architecture

This is a restaurant discovery app (Tinder-style swiping for restaurants) using Express + MySQL/Sequelize backend and React frontend in a monorepo.

### Backend

- **Entry point:** `server.js` — Express app with session-based auth via Passport.js local strategy
- **Database:** MySQL with Sequelize 4 ORM. Connection configured via `models/index.js` which reads from `config/config.json` (not `config.js` or `config/database.js` — those are unused legacy files)
- **Models:** `models/Users.js` (bcrypt password hashing via beforeCreate hook), `models/Favorites.js`, `models/Feeds.js` (activity log). Tables auto-created by `db.sequelize.sync()` on server start
- **Routes:** `routes/api/api-routes.js` (restaurants, favorites, feeds), `routes/api/users-routes.js` (auth: signup, login, logout)
- **Auth:** Passport local strategy in `passport/localStrategy.js`. Session-based (not JWT). User ID accessed via `req.session.passport.user.id`
- **External API:** Geoapify Places API called from api-routes.js (requires `GEOAPIFY_API_KEY` env var). Geocodes location first, then searches `catering.restaurant` category. Returns cuisine, diet, phone, website, opening hours. Response is transformed server-side to match the frontend's expected shape.

### Frontend

- **Location:** `client/` — Create React App with react-scripts@3
- **Proxy:** `localhost:3000` proxies API calls to `localhost:3001` (set in `client/package.json`)
- **State:** React Context (`client/src/context/UserContext.js`) provides `user`, `isLoggedIn`, `loading` globally
- **API calls:** All in `client/src/utils/API.js` using Axios
- **Key pages:** Search (main swiping UI), Favorites, Newsfeed (activity feed), Profile/EditProfile, Team (all users), Login/Signup

### Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/restaurants` | GET | Fetch from Geoapify API (params: category, location) |
| `/api/post/favoritestodb` | POST | Save restaurant + log to feeds |
| `/api/get/favoritesfromdb` | GET | Get user's favorites (session-based) |
| `/api/delete/favorite/:id` | DELETE | Remove favorite + log to feeds |
| `/api/get/feedsfromdb` | GET | Get 10 most recent activity items |
| `/api/signup` | POST | Create user |
| `/api/login` | POST | Passport authenticate |

## Environment Variables

Required in `.env` at project root:
```
MYSQL_USER, MYSQL_PASS, MYSQL_DATABASE, MYSQL_HOST, MYSQL_PORT
SECRET              # Express session secret
GEOAPIFY_API_KEY    # Geoapify Places API key (free tier: 3,000 calls/day)
```

**Important:** `models/index.js` reads credentials from `config/config.json`, not from env vars. The development password in `config.json` must match your local MySQL root password.
