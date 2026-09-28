require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function startScan(targetUrl) {
  const { rows } = await pool.query(
    `INSERT INTO scans (target_url) VALUES ($1) RETURNING id`,
    [targetUrl]
  );
  return rows[0].id;
}

async function finishScan(scanId, pagesScanned) {
  await pool.query(
    `UPDATE scans SET finished_at = now(), pages_scanned = $2 WHERE id = $1`,
    [scanId, pagesScanned]
  );
}

async function insertIssue(scanId, { page, severity, issue, fix, selector }) {
  await pool.query(
    `INSERT INTO issues (scan_id, page, severity, issue, fix, selector)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [scanId, page, severity, issue, fix, selector]
  );
}

async function insertScanPage(scanId, { pageUrl, screenshotPath }) {
  await pool.query(
    `INSERT INTO scan_pages (scan_id, page_url, screenshot_path)
     VALUES ($1, $2, $3)`,
    [scanId, pageUrl, screenshotPath]
  );
}

module.exports = {
  pool,
  startScan,
  finishScan,
  insertIssue,
  insertScanPage,
};