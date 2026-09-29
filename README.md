# AI-Assisted Accessibility Auditor ♿

## AI-Powered Website Accessibility Auditing System

![Node.js](https://img.shields.io/badge/Backend-Node.js-339933)
![Express](https://img.shields.io/badge/Framework-Express.js-000000)
![Playwright](https://img.shields.io/badge/Automation-Playwright-2EAD33)
![axe-core](https://img.shields.io/badge/Accessibility-axe--core-663399)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1)
![AI](https://img.shields.io/badge/AI-Assisted-2563EB)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E)

> An AI-assisted accessibility auditing system that automatically crawls websites using Playwright, detects accessibility violations with axe-core, captures page screenshots, stores audit history, and provides AI-powered explanations and suggested fixes.

---

## 🖥️ Dashboard Preview

<!-- Add your dashboard screenshot here -->
![Accessibility Auditor Dashboard](screenshots/dashboard-preview.png)

| Feature | Description |
|---|---|
| 🔍 **Website Audit** | Enter any website URL directly from the dashboard and start an accessibility scan |
| ♿ **Accessibility Detection** | Dynamically detects accessibility violations using axe-core |
| 🌐 **Website Crawling** | Playwright automatically crawls pages within the target website |
| 📸 **Page Screenshots** | Captures screenshots of scanned pages and connects them with audit results |
| 🤖 **AI Analysis** | Provides contextual explanations for detected accessibility problems |
| 🛠️ **AI Fix Suggestions** | Generates suggested fixes for accessibility violations |
| 📊 **Audit Dashboard** | Displays total issues, severity levels, scanned pages, and issue statistics |
| 📈 **Historical Comparison** | Compares accessibility issues between current and previous scans |
| 🗄️ **Result Storage** | Stores scan results, page information, and screenshot paths in PostgreSQL |

---

## ⚙️ How It Works

**Enter Website URL → Playwright Crawls Website → axe-core Detects Violations → Screenshots Captured → Results Stored in PostgreSQL → Dashboard Displays Results → AI Explains Issues & Suggests Fixes**

---

## 🛠️ Tech Stack

**JavaScript, Node.js, Express.js, Playwright, axe-core, PostgreSQL, HTML, CSS, REST API, AI API**

---

## 📂 Project Structure

```text
AI-Assisted-Accessibility-Auditor/
├── ai.js
├── crawl.js
├── dashboard.html
├── db.js
├── initDb.js
├── server.js
├── schema.sql
├── package.json
├── public/
│   └── chart.js
├── screenshots/
├── .env.example
├── .gitignore
└── README.md
