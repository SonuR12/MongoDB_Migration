# MongoDBMigrate

A web-based MongoDB migration tool built with Next.js. Migrate data between MongoDB organizations and clusters without touching the terminal — no `mongodump`, no `mongorestore`.

## Features

- Paste source and destination MongoDB connection strings
- Preview all databases and collection counts before migrating
- One-click migration across all collections
- Works with or without a database name in the connection string
- Connection strings are never stored — used only in-memory per request

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. Paste your **source** `mongodb+srv://...` connection string
2. Click **Preview Data** to see all databases and collection counts
3. Paste your **destination** `mongodb+srv://...` connection string
4. Click **Migrate →**
5. View per-collection migration results

## Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/databaseName
```

The database name at the end is optional — if omitted, all databases on the cluster will be migrated.

## Tech Stack

- [Next.js 16](https://nextjs.org) — App Router + API Routes
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/) — direct DB access
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [Vercel](https://vercel.com) — deployment

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/preview` | POST | Lists all databases and collection counts from source |
| `/api/migrate` | POST | Migrates all collections from source to destination |

## Deploy on Vercel

Push to GitHub and import the repo on [vercel.com](https://vercel.com). Vercel auto-detects Next.js — no configuration needed.

## Security Notes

- Never commit real connection strings to version control
- Rotate your MongoDB Atlas password if it was ever exposed publicly
- Add IP allowlist rules in Atlas under **Network Access**

## Changelog

### v0.3 — Preview & Bug Fixes
- Fixed duplicate key warnings in database list
- Fixed crash when `docs` field was undefined on stale state
- Preview now shows database-level summary only (no internal collections)

### v0.2 — Database Auto-Discovery
- Connection strings without a database name now work (like MongoDB Compass)
- Auto-discovers all databases via `listDatabases()`
- Added `/api/preview` route for pre-migration data inspection

### v0.1 — Initial Release
- Basic migration form with source + destination inputs
- MongoDB-inspired dark UI with green accents
- Per-collection migration results panel
