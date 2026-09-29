# AI-Assisted Accessibility Auditor ♿

## AI-Powered Website Accessibility Auditing System

![Node.js](https://img.shields.io/badge/Backend-Node.js-339933)
![Express](https://img.shields.io/badge/Framework-Express.js-000000)
![Playwright](https://img.shields.io/badge/Automation-Playwright-2EAD33)
![axe-core](https://img.shields.io/badge/Accessibility-axe--core-663399)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E)
![AI](https://img.shields.io/badge/AI-Assisted-2563EB)

> An AI-assisted accessibility auditing system that automatically crawls websites using Playwright, detects accessibility violations with axe-core, captures page screenshots, stores audit history, and provides AI-powered explanations and suggested fixes.

---

## 🎯 Problem It Solves

Websites can contain accessibility barriers that make them difficult to use for people with disabilities. These problems can include missing accessible labels, incorrect page structure, poor semantic HTML, insufficient color contrast, and other WCAG-related issues.

Manually checking every page of a website is time-consuming and makes it easy to overlook problems.

**AI-Assisted Accessibility Auditor** helps solve this by automatically crawling website pages, running accessibility tests, organizing detected violations by severity, capturing visual evidence, and helping developers understand how the issues can be fixed.

---

## 💡 Solution

The system combines **Playwright** and **axe-core** to perform automated accessibility auditing.

Instead of manually configuring a website URL in the application, users can enter a URL directly into the dashboard and start an audit.

The system then:

1. Crawls the website automatically.
2. Runs axe-core accessibility tests.
3. Detects accessibility violations dynamically.
4. Captures screenshots of scanned pages.
5. Stores results in PostgreSQL.
6. Displays results through an interactive dashboard.
7. Uses AI to explain detected problems.
8. Generates suggested accessibility fixes.
9. Compares current and previous scans.

---

## 🖥️ Dashboard Preview

| Feature | Description |
|---|---|
| 🔍 **Website Audit** | Enter a website URL directly from the dashboard and start an accessibility scan |
| ♿ **Accessibility Detection** | Dynamically detects accessibility violations using axe-core |
| 🌐 **Website Crawling** | Playwright automatically crawls pages within the target website |
| 📸 **Page Screenshots** | Captures screenshots of scanned pages and associates them with audit results |
| 🤖 **AI Analysis** | Provides contextual explanations for detected accessibility problems |
| 🛠️ **AI Fix Suggestions** | Generates suggested fixes for accessibility violations |
| 📊 **Audit Dashboard** | Displays total issues, severity levels, scanned pages, and issue statistics |
| 📈 **Historical Comparison** | Compares accessibility issues between current and previous scans |
| 🗄️ **Result Storage** | Stores scan results, page information, and screenshot paths in PostgreSQL |

---

## ⚙️ How It Works

**Website URL → Playwright Crawler → axe-core Scan → Violation Detection → Screenshot Capture → PostgreSQL → Dashboard → AI Explanation & Fix**

The accessibility findings are **not hard-coded**. They are generated dynamically from the website being audited using axe-core.

---

## 🏗️ System Architecture

```text
                     User
                       │
                       ▼
              ┌─────────────────┐
              │    Dashboard    │
              │   Enter URL     │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Express.js API  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   Playwright    │
              │ Website Crawler │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │    axe-core     │
              │ Accessibility   │
              │     Scan        │
              └────────┬────────┘
                       │
              ┌────────┴─────────┐
              ▼                  ▼
       Screenshot Capture   Violations
              │                  │
              └────────┬─────────┘
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              └────────┬────────┘
                       │
                ┌──────┴──────┐
                ▼             ▼
          Dashboard        AI Analysis
                           & Fixes
```

---

## 🛠️ Tech Stack

**JavaScript, Node.js, Express.js, Playwright, axe-core, PostgreSQL, HTML, CSS, REST API, AI API**

---

## 📊 Accessibility Results

Detected violations are categorized by severity:

- 🔴 **Critical**
- 🟠 **Serious**
- 🟡 **Moderate**
- 🟢 **Minor**

For detected issues, the dashboard can display information such as the affected page, element selector, occurrence count, severity, screenshot, AI explanation, and suggested fix.

---

## 📂 Project Structure

```text
AI-Assisted-Accessibility-Auditor/
│
├── ai.js
├── chart.js
├── crawl.js
├── dashboard.html
├── db.js
├── initDb.js
├── server.js
├── schema.sql
├── package.json
├── package-lock.json
│
├── public/
│   └── chart.js
│
├── screenshots/
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AntonyJos-coder/AI-Assisted-Accessibility-Auditor.git
cd AI-Assisted-Accessibility-Auditor
```

### 2. Install dependencies

```bash
npm install
npx playwright install
```

### 3. Configure environment variables

Create a `.env` file using `.env.example`.

```env
TARGET_URL=https://example.com
MAX_PAGES=20
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/a11y_scanner
PORT=3000
```

### 4. Configure PostgreSQL

Create the required PostgreSQL database and initialize the project tables using the provided database setup/schema.

### 5. Start the server

```bash
npm run server
```

Open:

```text
http://localhost:3000
```

Enter a website URL and click **Audit**.

---

## 📚 What I Learned

Through this project I gained practical experience with:

- Browser automation using **Playwright**
- Accessibility testing using **axe-core**
- Website crawling
- REST API development
- Node.js and Express.js backend development
- PostgreSQL database integration
- Dynamic URL processing
- Automated screenshot capture
- Asynchronous scan processing
- AI API integration
- Historical scan comparison
- Dashboard data visualization
- Git and GitHub project management

---

## 🔮 Future Improvements

- WCAG compliance reporting
- Exportable PDF audit reports
- User accounts and saved projects
- Scheduled accessibility scans
- Accessibility regression alerts
- Improved scan progress tracking
- Cloud deployment
- Advanced AI-assisted remediation guidance

---

## 📌 Project Purpose

This project was developed to explore how **browser automation, accessibility testing, databases, dashboards, and AI** can be combined into a practical tool that helps developers identify and understand accessibility problems in websites.

---

## 👨‍💻 Author

**Antony Jos**

Computer Engineering | Web Development | Data Analytics
