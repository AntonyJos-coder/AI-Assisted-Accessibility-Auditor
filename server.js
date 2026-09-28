const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const { spawn } = require("child_process");
const {
  explainAccessibilityIssue,
  generateAccessibilityFix
} = require("./ai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(express.json());

// Serve files from the project folder
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/screenshots",
  express.static(path.join(__dirname, "screenshots"))
);

// Serve screenshots

// Dashboard
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

// Audit
app.post("/api/audit", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "URL is required"
      });
    }

    let targetUrl;

    try {
      targetUrl = new URL(url).href;
    } catch {
      return res.status(400).json({
        error: "Invalid URL"
      });
    }

    console.log(`Starting audit for: ${targetUrl}`);

    const crawlProcess = spawn(process.execPath, ["crawl.js"], {
      cwd: __dirname,
      env: {
        ...process.env,
        TARGET_URL: targetUrl
      }
    });

    crawlProcess.stdout.on("data", (data) => {
      process.stdout.write(`[AUDIT] ${data}`);
    });

    crawlProcess.stderr.on("data", (data) => {
      process.stderr.write(`[AUDIT ERROR] ${data}`);
    });

    crawlProcess.on("close", (code) => {
      console.log(`Audit process finished with code: ${code}`);
    });

    res.json({
      success: true,
      message: "Audit started",
      targetUrl
    });

  } catch (error) {
    console.error("Audit API error:", error);

    res.status(500).json({
      error: error.message
    });
  }
});

// Scan status
app.get("/api/scan-status", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        target_url,
        pages_scanned,
        finished_at
      FROM scans
      ORDER BY id DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.json({
        scanId: null,
        targetUrl: null,
        pagesScanned: 0,
        finished: false
      });
    }

    const scan = result.rows[0];

    res.json({
      scanId: scan.id,
      targetUrl: scan.target_url,
      pagesScanned: Number(scan.pages_scanned || 0),
      finished: scan.finished_at !== null
    });

  } catch (error) {
    console.error("Scan-status API error:", error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Summary
app.get("/api/summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.id AS scan_id,
        s.target_url,
        s.pages_scanned,
        COUNT(i.id) AS total_issues,
        COUNT(i.id) FILTER (WHERE i.severity = 'critical') AS critical,
        COUNT(i.id) FILTER (WHERE i.severity = 'serious') AS serious,
        COUNT(i.id) FILTER (WHERE i.severity = 'moderate') AS moderate,
        COUNT(i.id) FILTER (WHERE i.severity = 'minor') AS minor
      FROM scans s
      LEFT JOIN issues i ON i.scan_id = s.id
      WHERE s.id = (SELECT MAX(id) FROM scans)
      GROUP BY s.id, s.target_url, s.pages_scanned
    `);

    if (result.rows.length === 0) {
      return res.json({
        targetUrl: null,
        pagesScanned: 0,
        total: 0,
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0
      });
    }

    const row = result.rows[0];

    res.json({
      targetUrl: row.target_url,
      pagesScanned: Number(row.pages_scanned),
      total: Number(row.total_issues),
      critical: Number(row.critical),
      serious: Number(row.serious),
      moderate: Number(row.moderate),
      minor: Number(row.minor)
    });

  } catch (error) {
    console.error("Summary API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Scan pages + screenshots
app.get("/api/scan-pages", async (req, res) => {
  try {
    const scanId = req.query.scanId;

    let result;

    if (scanId) {
      result = await pool.query(`
        SELECT
          id,
          scan_id,
          page_url,
          screenshot_path,
          created_at
        FROM scan_pages
        WHERE scan_id = $1
        ORDER BY id
      `, [scanId]);
    } else {
      result = await pool.query(`
        SELECT
          id,
          scan_id,
          page_url,
          screenshot_path,
          created_at
        FROM scan_pages
        WHERE scan_id = (SELECT MAX(id) FROM scans)
        ORDER BY id
      `);
    }

    const pages = result.rows.map((row) => {
      const filename = path.basename(row.screenshot_path || "");

      return {
        id: row.id,
        scanId: row.scan_id,
        pageUrl: row.page_url,
        screenshot: filename
          ? `/screenshots/${filename}`
          : null,
        createdAt: row.created_at
      };
    });

    res.json(pages);

  } catch (error) {
    console.error("Scan-pages API error:", error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Issues over time
app.get("/api/issues-over-time", async (req, res) => {
  try {
    const currentScanResult = await pool.query(`
      SELECT id, target_url
      FROM scans
      ORDER BY id DESC
      LIMIT 1
    `);

    if (currentScanResult.rows.length === 0) {
      return res.json({
        current: [],
        previous: []
      });
    }

    const currentScan = currentScanResult.rows[0];

    const previousScanResult = await pool.query(`
      SELECT id
      FROM scans
      WHERE target_url = $1
        AND id < $2
      ORDER BY id DESC
      LIMIT 1
    `, [currentScan.target_url, currentScan.id]);

    const previousId = previousScanResult.rows[0]?.id;

    async function getPageCounts(scanId) {
      if (!scanId) return [];

      const result = await pool.query(`
        SELECT page, COUNT(*)::int AS count
        FROM issues
        WHERE scan_id = $1
        GROUP BY page
        ORDER BY page
      `, [scanId]);

      return result.rows;
    }

    res.json({
      current: await getPageCounts(currentScan.id),
      previous: await getPageCounts(previousId)
    });

  } catch (error) {
    console.error("Issues-over-time API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Top issues
app.get("/api/top-issues", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        i.issue,
        i.severity,
        COUNT(*)::int AS count,
        MIN(i.page) AS page,
        MIN(i.selector) AS selector,
        (
          SELECT sp.screenshot_path
          FROM scan_pages sp
          WHERE sp.scan_id = i.scan_id
            AND sp.page_url = MIN(i.page)
          LIMIT 1
        ) AS screenshot_path
      FROM issues i
      WHERE i.scan_id = (SELECT MAX(id) FROM scans)
      GROUP BY i.scan_id, i.issue, i.severity
      ORDER BY count DESC
      LIMIT 10
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Top-issues API error:", error);
    res.status(500).json({ error: error.message });
  }
});
// AI explanation
app.post("/api/ai-explain", async (req, res) => {
  try {
    const { issue, severity, page, selector } = req.body;

    if (!issue) {
      return res.status(400).json({
        error: "Issue is required"
      });
    }

    const explanation = await explainAccessibilityIssue({
      issue,
      severity: severity || "unknown",
      page: page || "unknown",
      selector: selector || "Not available"
    });

    res.json({
      explanation
    });

  } catch (error) {
    console.error("AI explanation error:", error);

    res.status(500).json({
      error: error.message
    });
  }
});

// AI fix
app.post("/api/ai-fix", async (req, res) => {
  try {
    const { issue, severity, page, selector } = req.body;

    if (!issue) {
      return res.status(400).json({
        error: "Issue is required"
      });
    }

    const fix = await generateAccessibilityFix({
      issue,
      severity: severity || "unknown",
      page: page || "unknown",
      selector: selector || "unknown"
    });

    res.json({
      fix
    });

  } catch (error) {
    console.error("AI fix error:", error);

    res.status(500).json({
      error: error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Dashboard running at http://localhost:${port}`);
});