# Cravings

## Live Demo

**Production:** [https://cravings-prod.up.railway.app](https://cravings-prod.up.railway.app)

**Test Accounts:**
- Username: `test` / Password: `test`
- Username: `dumbledore` / Password: `dumbledore` *(Albus Dumbledore, headmaster@hogwarts.com — because every app needs a wizard)*

## About This App

Scroll through images of dishes from nearby restaurants based on what you are craving that night. Just filter for preferences and location, and you're ready to find your perfect match. Think Tinder meets Yelp.

Once you like a restaurant, it gets added to your favorites making it easy to narrow down your search to find the one. Also, check out what other people are liking on your newsfeed to plan an outing with friends.

## Features

- **Swipe-style restaurant discovery** — filter by cuisine, diet, location, radius, and accessibility
- **Save favorites** — build a collection of up to 20 restaurants
- **Social newsfeed** — see what others are liking and removing in real time
- **User profiles** — editable details (name, email, zip code)
- **Team page** — browse all registered users
- **Session-based auth** — signup, login, and logout with Passport.js
- **Mobile responsive** — designed to work on phones, tablets, and desktops

## App Preview

Visit the [live demo](https://cravings-prod.up.railway.app) to see it in action. Key pages to explore:

- **Search** — the main swiping UI with filter controls
- **Favorites** — grid of saved restaurants
- **Newsfeed** — activity feed of what everyone's liking
- **Profile** — your editable user details
- **Team** — all registered users

## Background

This was originally a school project built with the **Yelp Fusion API** and deployed on **Heroku**. After Heroku dropped its free tier and Yelp tightened API access, the app sat dormant for a while.

In 2026 it was revived with the help of **Claude Code** — migrating from Heroku to **Railway** for hosting and swapping out the Yelp API for **Geoapify Places API** as the restaurant data source.

### Timeline

- **2019** — Original school project (Yelp Fusion API + Heroku)
- **2026** — Revived with Claude Code (Geoapify + Railway, dependency upgrades, UI redesign)

## Architecture Overview

```
React (port 3000) → Express API (port 3001) → MySQL (Sequelize)
                                              → Geoapify Places API
```

- **Auth:** Session-based with Passport.js local strategy (not JWT)
- **State:** React Context (`UserContext`) provides `user`, `isLoggedIn`, `loading` globally
- **Structure:** Monorepo — React client lives in `client/`, Express server at the root

## Learnings from Working with Claude Code

Here are some things Claude picked up (and helped solve) while modernizing this app:

- **Node version compatibility is a rabbit hole.** The original app used react-scripts@3, which crashed on Node 22. The first instinct was to slap on the `--openssl-legacy-provider` flag to work around OpenSSL 3.0 issues, but that only papered over part of the problem. Ultimately the real fix was upgrading each package dependency individually — updating react-scripts, webpack, and other outdated packages one by one until everything played nicely with Node 22.
- **Legacy config files can be misleading.** The repo had `config.js`, `config/database.js`, and `config/config.json` — only `config.json` was actually used by Sequelize. Tracking down which config file was live took some detective work.
- **API migration is more than swapping URLs.** Yelp and Geoapify return completely different response shapes. The server-side transformation layer had to be rewritten to map Geoapify's `catering.restaurant` category data (cuisine, diet, phone, hours) into the format the React frontend expected.
- **Railway deployment has its own quirks.** Getting the build pipeline right — making sure the client builds, the server starts, and MySQL connects with the right env vars — required iterating through several deploy attempts to nail down.
- **Session-based auth + proxy config needs care.** The dev setup proxies port 3000 to 3001, and Passport.js sessions need to survive that hop. Small misconfigurations here silently break login without obvious errors.
- **UI redesign with sticky navbar.** Refreshed the profile, team, newsfeed, and auth pages with a modern look and added a sticky navbar for better navigation.
- **Writing Playwright tests exposed blind spots.** Claude set up Playwright from scratch, wrote the config, created a shared login helper, and generated 27 E2E tests across 7 files — all passing. But the initial test suite had notable gaps. Claude covered the "happy path" well: login/logout, auth guards, basic search, and page loading. What it missed was the *user journey* — it didn't test adding and removing favorites, verifying those actions showed up in the newsfeed, filter visibility and behavior (like cuisine disabling for non-restaurant types), signup flows (both successful and failed), or actually editing and saving profile changes. Poorva had to review the test suite and specifically ask for each of these scenarios. The lesson: Claude is good at scaffolding tests for obvious flows, but a human needs to think through the edge cases and end-to-end user stories that actually matter. Claude also initially used `page.goto()` for navigation which broke tests because the app stores auth state in React Context (memory only) — full page reloads wiped the session. Switching to navbar link clicks for client-side routing fixed it, but it was a reminder that Claude needs to understand app architecture, not just test patterns.

## What Poorva Taught Claude

- **Don't trust the "quick fix."** When Claude suggested the `--openssl-legacy-provider` flag as the solution to Node compatibility issues, Poorva pushed back when it didn't actually work — teaching Claude that sometimes you need to do the harder work of upgrading dependencies properly instead of reaching for workarounds.
- **Context that only a human has.** Claude had no idea this was a school project, that Yelp had tightened API access, or that Heroku killed its free tier. Poorva provided the *why* behind the migration — without that context, Claude would have been solving the wrong problems.
- **The app's original vision.** The Tinder-meets-Yelp concept, the swiping UX, the social newsfeed — that creative product thinking came from Poorva and her team. Claude can write code, but it can't dream up an app idea over late-night study sessions.
- **Mobile responsiveness isn't optional.** Claude built features that looked great on desktop but fell apart on mobile. It took several rounds of Poorva flagging broken layouts, overlapping elements, and unusable swipe interactions on her phone before Claude got the responsive design right. A reminder that real users don't test on a 27" monitor.
- **Do your own research.** When it came time to replace the Yelp API, Claude suggested the obvious options — Foursquare, Google Places API, etc. But Poorva did her own digging, found Geoapify as a free-tier-friendly alternative, read through the docs herself, and shared them with Claude to implement. Claude didn't discover the best solution — Poorva did.
- **When to stop over-engineering.** Poorva kept things focused on what mattered — get it deployed, get it working, make it look good. No need for perfect abstractions or premature optimization.
- **Test coverage isn't just about passing tests.** Claude generated a full Playwright test suite that all passed — but passing isn't the same as thorough. Poorva reviewed the tests and pointed out missing scenarios one by one: "Where's the remove favorite test?" "Verify the newsfeed shows the activity." "Did you test filters?" "What about signup?" "What about actually editing the profile?" Each question revealed a gap Claude hadn't considered. The takeaway: AI can generate tests quickly, but a human who understands the product needs to audit what's actually being tested.

## What Claude Taught Poorva

- **Systematic API migration.** How to map one API's response shape to another, building a server-side transformation layer so the frontend doesn't need to know the data source changed from Yelp to Geoapify.
- **Debugging config file chaos.** The repo had three config files (`config.js`, `config/database.js`, `config/config.json`) and only one was real. Claude traced the Sequelize import chain to figure out which one actually mattered.
- **Railway deployment pipeline.** From setting up environment variables to getting the build command right to troubleshooting MySQL connections — the nuts and bolts of deploying to a new platform.
- **Modernizing legacy code without breaking it.** Upgrading dependencies one at a time, testing along the way, and knowing which packages to update in which order to avoid cascading breakage.
- **UI refresh patterns.** Redesigning pages with modern styling, implementing a sticky navbar, and cleaning up the auth flow — small changes that make an old project feel new again.

## Technologies Used

- **APIs:** Geoapify Places API (formerly Yelp Fusion)
- **Backend:** Express, express-session, Passport.js, Sequelize, MySQL, bcrypt, dotenv
- **Frontend:** React, React Router, Axios, Bootstrap, react-toastify
- **Testing:** Playwright (E2E)
- **Deployment:** Railway (formerly Heroku)

## Getting Started

### Prerequisites

- Node.js 22+
- MySQL
- npm
- Chromium (installed automatically by Playwright)

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/cravings-app/cravings.git
   cd cravings
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This installs server dependencies at the root, then automatically installs client dependencies and builds the client via the `postinstall` script.

3. **Create a `.env` file** in the project root:
   ```
   MYSQL_USER=root
   MYSQL_PASS=yourpassword
   MYSQL_DATABASE=cravings_db
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   SECRET=your_session_secret
   GEOAPIFY_API_KEY=your_geoapify_api_key
   ```
   Get a free Geoapify API key at [myprojects.geoapify.com](https://myprojects.geoapify.com).

4. **Set up the database**
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS cravings_db"
   mysql -u root -p < seeders/seed.sql
   ```
   Also update `config/config.json` with your local MySQL password — Sequelize reads credentials from there, not from `.env`.

5. **Run the app**
   ```bash
   npm run start:dev
   ```
   This starts the Express server on port 3001 and the React dev server on port 3000 concurrently.

6. **Run E2E tests** (requires the dev servers to be running)
   ```bash
   npx playwright install chromium
   npm run test:e2e
   ```
   Runs 27 Playwright tests covering auth, search, filters, favorites, newsfeed, profile, team, and logout.

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/restaurants` | GET | Fetch restaurants from Geoapify (params: category, location) |
| `/api/post/favoritestodb` | POST | Save a restaurant to favorites + log to feeds |
| `/api/get/favoritesfromdb` | GET | Get current user's favorites (session-based) |
| `/api/delete/favorite/:id` | DELETE | Remove a favorite + log to feeds |
| `/api/get/feedsfromdb` | GET | Get 10 most recent activity items |
| `/api/signup` | POST | Create a new user |
| `/api/login` | POST | Authenticate with Passport.js |

## Project Structure

```
├── client/src/          # React frontend
│   ├── pages/           # Route pages (Search, Favorites, Profile, Newsfeed, Team, etc.)
│   ├── components/      # Reusable UI (Navbar, RestaurantCard, SearchBar, etc.)
│   ├── context/         # React Context (UserContext)
│   └── utils/           # API helper (Axios)
├── models/              # Sequelize models (Users, Favorites, Feeds)
├── routes/api/          # Express API routes
├── passport/            # Auth strategy + middleware
├── config/              # Database config (config.json)
├── seeders/             # SQL seed data
└── server.js            # Express entry point
```

## Known Limitations

- Favorites capped at 20 per user
- Restaurant images use rotating placeholder food photos (not actual restaurant images from the API)
- No automated test suite
- Geoapify free tier: 3,000 API calls/day

## Future Enhancements

- Restaurant details page with map integration
- Realtime push notifications
- Ability to add restaurant reviews
- Enhanced user interaction (groups, subscriptions, follows)
- Scheduling dinners with friends
- Newsfeed showing users who also saved a restaurant
