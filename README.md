# Accessibility Scanner (Playwright + axe-core + Postgres)

Implements the 5-step pipeline:

1. **Website** — you pick a `TARGET_URL`.
2. **Playwright Crawls** — `src/crawl.js` opens it and follows same-origin links.
3. **Run axe-core** — each page is scanned with `@axe-core/playwright`.
4. **Store in Postgres** — every issue is saved with page, severity, issue, and fix.
5. **Developer Dashboard** — `src/server.js` + `public/dashboard.html` show KPI cards,
   an issues-over-time chart (current vs. previous scan), and a top-issues list.

## 1. Install prerequisites

- Node.js 18+
- PostgreSQL running locally (or a connection string to one)

```bash
npm install
npx playwright install chromium   # downloads the browser Playwright drives
```

## 2. Configure

```bash
cp .env.example .env
```

Edit `.env`:
- `TARGET_URL` — the site to crawl (e.g. `https://your-site.com`)
- `MAX_PAGES` — crawl limit, default 20
- `DATABASE_URL` — your Postgres connection string
- `PORT` — dashboard port, default 3000

## 3. Create the database and tables

```bash
createdb a11y_scanner        # if the DB doesn't exist yet
npm run init-db              # applies db/schema.sql
```

## 4. Run a scan

```bash
npm run crawl
```

This crawls `TARGET_URL`, runs axe-core on each page found, and writes every
violation into the `issues` table (linked to a row in `scans`). Run it again
later on the same site and the dashboard will compare the two most recent
scans.

## 5. Open the dashboard

```bash
npm run server
```

Visit `http://localhost:3000`.

## Project layout

```
axe-a11y-scanner/
├── db/schema.sql       # scans + issues tables
├── src/
│   ├── db.js           # Postgres pool + insert/update helpers
│   ├── initDb.js        # applies schema.sql
│   ├── crawl.js         # steps 1-4: crawl, scan, store
│   └── server.js         # step 5: dashboard API + static server
├── public/dashboard.html # step 5: dashboard UI
└── .env.example
```

## Notes / what you'll need to do

- I couldn't install Postgres or download the Playwright browser or run this
  end-to-end in this workspace (no network access to those services here), so
  this hasn't been run against a live site — test it against a small site
  first, e.g. `TARGET_URL=https://example.com` with `MAX_PAGES=3`.
- `MAX_PAGES` defaults to 20 to avoid accidentally crawling a huge site — raise
  it once you're happy with the results on a small run.
- axe's `impact` field is one of `critical | serious | moderate | minor`; the
  dashboard's KPI cards show the first three to match the mockup.
- If you want scheduled/automatic scans (e.g. nightly), wrap `npm run crawl`
  in a cron job or CI pipeline — that's not included here.
