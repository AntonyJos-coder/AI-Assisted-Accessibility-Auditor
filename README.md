AI-Assisted Accessibility Auditor

A web-based accessibility auditing system built with Playwright, axe-core, Node.js, Express.js, and PostgreSQL. Users can enter a website URL, run an audit, view dynamically detected accessibility issues, see page screenshots, compare scan history, and use AI-assisted explanations and fixes.

What I Learned
Web automation and page crawling with Playwright
Automated accessibility testing with axe-core
Building REST APIs with Node.js and Express.js
PostgreSQL database design and data relationships
Dynamic URL handling and asynchronous audit processes
Automated screenshot capture and page-level result mapping
AI API integration for contextual explanations and fixes
Historical scan comparison and dashboard data visualization
Git, GitHub, environment variables, and project security
Project Overview

This project automates website accessibility auditing by combining browser automation with axe-core testing. It detects accessibility violations from the actual scanned website, stores the results, captures screenshots, and presents everything through a dashboard.

Project Relevance

The project demonstrates practical skills in web accessibility, backend development, browser automation, database management, API integration, AI-assisted development, and software engineering. It also addresses the practical need to identify accessibility issues before they affect website users.

How It Works

Users enter a website URL → Playwright crawls the pages → axe-core detects accessibility violations → screenshots are captured → results are stored in PostgreSQL → the dashboard displays findings and history → AI provides explanations and suggested fixes.

Technology Used
Node.js
Express.js
Playwright
axe-core
PostgreSQL
JavaScript
HTML / CSS
AI API
Git / GitHub
Project Structure
AI-Assisted-Accessibility-Auditor/
├── ai.js
├── chart.js
├── crawl.js
├── dashboard.html
├── db.js
├── initDb.js
├── package.json
├── package-lock.json
├── schema.sql
├── server.js
├── public/
│   └── chart.js
├── .env.example
├── .gitignore
└── README.md

Generated files such as .env, node_modules, and screenshots are excluded from the repository.

Getting Started
1. Clone
git clone https://github.com/AntonyJos-coder/AI-Assisted-Accessibility-Auditor.git
cd AI-Assisted-Accessibility-Auditor
2. Install dependencies
npm install
3. Install Playwright
npx playwright install
4. Configure environment

Create .env using .env.example and configure your PostgreSQL connection.

TARGET_URL=https://example.com
MAX_PAGES=20
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/a11y_scanner
PORT=3000
5. Initialize database

Make sure PostgreSQL is running, then initialize the required database tables using the project's database setup.

6. Start the application
npm run server

Open:

http://localhost:3000
7. Run an audit

Enter a website URL in the dashboard and click Audit. The system will scan the website and display the detected accessibility results.
