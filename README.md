SR Electronics Park — Sovereign POS
An Enterprise of Salsabilah Amin Limited • Powered by Gemini
A 100% browser-based, single-file Point of Sale (POS), inventory, and accounting web application built for SR Electronics Park. All operational data is stored locally in the browser (localStorage), with zero third-party backend dependencies and full JSON backup/restore control.
Core Modules
Module
Bengali Label
Key Capabilities
Dashboard
ড্যাশবোর্ড
8 real-time KPI cards, period filter (All Time, This Month, Today), 3 Chart.js visualizations, low-stock alerts, and due invoice collection
POS Terminal
POS বিক্রয়
Live product search & category filter, cart controls, quick-add customer, fixed/% discount, optional 5% VAT, multi-method payments (Cash, bKash, Nagad, Card, Due), and print-ready receipt
Products & Stock
পণ্য ও স্টক
Add, edit, and delete products with SKU, category, warranty, cost/sale price, stock count, alert threshold, and CSV export
Sales & Invoices
বিক্রয় ও ইনভয়েস
Searchable invoice history, Paid/Due status filter, due collection, receipt re-printing, and CSV export
Purchases & Expenses
ক্রয় ও ব্যয়
Supplier stock purchase entry (auto-updates stock & supplier due) and categorized business expense logging
Customers & Suppliers
গ্রাহক ও সরবরাহকারী
Customer/supplier directory with due tracking and one-click due settlement
Reports & Backup
রিপোর্ট ও ডেটা ব্যাকআপ
Profit & Loss summary (Gross Sales, COGS, Expenses, Net Profit), full JSON export/import restore, and demo data reset

Built-In Utilities
Bilingual Interface (BN / EN): Instant switching between Bengali and English navigation labels.
Theme Toggle (Dark / Light): Sovereign dark mode with golden SR monogram and cyan/gold accents, plus a high-contrast light mode.
Quick Calculator: Built-in modal calculator accessible from the top header.
Print-Ready Receipts: Dedicated @media print styling for clean invoice printing.
Tech Stack
Structure & Logic: Single-file HTML5 + Vanilla JavaScript (ES6+)
Styling: Tailwind CSS (3.4.17 CDN) + CSS custom properties
Charts: Chart.js (4.4.1 CDN)
Typography: Google Fonts (Inter & Noto Sans Bengali)
Storage: Browser localStorage (sr_electronics_sovereign_pos_v1)
Quick Start
Clone the repository:
git clone https://github.com/alaminsohagofficial/salsabilah-empire-pos.git
cd salsabilah-empire-pos


Open index.html (or sr_electronics_pos.html) directly in any modern web browser, or deploy the repository with GitHub Pages for instant web access.
Data Sovereignty & Backup
No data is transmitted to external servers; all records remain in your local browser storage.
Use রিপোর্ট ও ডেটা ব্যাকআপ → সম্পূর্ণ ব্যাকআপ (JSON) regularly to download a portable backup file, and ব্যাকআপ রিস্টোর (JSON) to restore on any device.
SR Electronics Park — An Enterprise of Salsabilah Amin Limited • Powered by Gemini
