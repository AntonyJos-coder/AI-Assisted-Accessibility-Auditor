-- Run once via `npm run init-db`, or `psql -f db/schema.sql`

CREATE TABLE IF NOT EXISTS scans (
    id            SERIAL PRIMARY KEY,
    target_url    TEXT NOT NULL,
    started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at   TIMESTAMPTZ,
    pages_scanned INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS issues (
    id          SERIAL PRIMARY KEY,
    scan_id     INTEGER NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    page        TEXT NOT NULL,
    severity    TEXT NOT NULL CHECK (severity IN ('critical', 'serious', 'moderate', 'minor')),
    issue       TEXT NOT NULL,      -- axe rule id / short description
    fix         TEXT,               -- axe help text + helpUrl
    selector    TEXT,               -- CSS selector of the offending element
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_issues_scan_id  ON issues(scan_id);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON issues(severity);
