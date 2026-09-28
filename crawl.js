require("dotenv").config();
const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");
const {
  startScan,
  finishScan,
  insertIssue,
  insertScanPage,
} = require("./db");
const fs = require("fs");
const path = require("path");

const SCREENSHOT_DIR = path.join(__dirname, "screenshots");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const TARGET_URL = process.env.TARGET_URL || "https://example.com";
const MAX_PAGES = parseInt(process.env.MAX_PAGES || "20", 10);

function sameOrigin(url, origin) {
  try {
    return new URL(url).origin === origin;
  } catch {
    return false;
  }
}

async function crawlAndScan(targetUrl = TARGET_URL) {
  const origin = new URL(targetUrl).origin;
  const visited = new Set();
  const queue = [targetUrl];

  const browser = await chromium.launch();
  const context = await browser.newContext();

  console.log(`Step 1: target website -> ${targetUrl}`);
  const scanId = await startScan(targetUrl);

  let pagesScanned = 0;
  let totalIssues = 0;

  while (queue.length && pagesScanned < MAX_PAGES) {
    const url = queue.shift();

    if (visited.has(url)) continue;
    visited.add(url);

    const page = await context.newPage();

    try {
      console.log(`Step 2: crawling ${url}`);

      await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 60000,
      });

      const screenshotName = `scan-${Date.now()}-${pagesScanned + 1}.png`;
      const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);

      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      console.log(`Screenshot captured: ${screenshotPath}`);
      await insertScanPage(scanId, {
  pageUrl: url,
  screenshotPath: `/screenshots/${screenshotName}`,
});

console.log(`Screenshot saved to DB for: ${url}`);

      // Store page URL and screenshot path in PostgreSQL
      await insertScanPage(scanId, {
        pageUrl: url,
        screenshotPath: screenshotPath,
      });

      console.log(`Screenshot path stored for ${url}`);

      // Discover more same-origin links to keep crawling
      const links = await page.$$eval(
        "a[href]",
        (as) => as.map((a) => a.href)
      );

      for (const link of links) {
        const clean = link.split("#")[0];
        const targetPath = new URL(targetUrl).pathname;

        if (
          sameOrigin(clean, origin) &&
          new URL(clean).pathname.startsWith(targetPath) &&
          !visited.has(clean) &&
          !queue.includes(clean)
        ) {
          queue.push(clean);
        }
      }

      console.log(`Step 3: running axe-core on ${url}`);

      const results = await new AxeBuilder({ page }).analyze();

      for (const violation of results.violations) {
        const severity = violation.impact || "moderate";

        for (const node of violation.nodes) {
          await insertIssue(scanId, {
            page: url,
            severity,
            issue: violation.description || violation.id,
            fix: `${violation.help} (${violation.helpUrl})`,
            selector: node.target?.join(", ") || null,
          });

          totalIssues++;
        }
      }

      pagesScanned++;
    } catch (err) {
      console.warn(`  Skipping ${url}: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await context.close();
  await browser.close();

  console.log(`Step 4: storing results in Postgres (scan #${scanId})`);

  await finishScan(scanId, pagesScanned);

  console.log(
    `Done. Pages scanned: ${pagesScanned}, issues found: ${totalIssues}. ` +
      `Open the dashboard (npm run server) to review.`
  );
}

crawlAndScan().catch((err) => {
  console.error("Crawl failed:", err);
  process.exit(1);
});