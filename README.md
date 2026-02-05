# 📦 Shipment Tracking Dashboard (Excel → Web Analytics Tool)

A lightweight web-based tracking dashboard that allows users to import shipment data from Excel files, monitor tracking status, filter results, and export reports. Built as a client-side analytics tool to streamline operational tracking workflows and reduce manual lookup effort.

This project demonstrates practical skills in data ingestion, client-side processing, UI-driven analytics, and reporting automation using JavaScript and modern web tooling.

---

## 🎯 Project Purpose

Operational and support teams often receive shipment or asset tracking data in spreadsheet format. This dashboard converts raw Excel tracking exports into an interactive, filterable, and exportable tracking view.

The tool helps users:

* Import shipment tracking data from Excel
* View outbound and inbound tracking status
* Filter and sort shipment records
* Copy formatted tracking summaries
* Export processed results to CSV or Excel
* Persist session data using local storage

---

## 🖥️ Features

* 📥 Excel file import (`.xlsx`, `.xls`)
* ➕ Append or replace tracking datasets
* 🔎 Filter by delivery status and exception state
* ↕️ Sort by ticket number, status, and last update
* 📊 Interactive tracking results table
* 📋 One-click copy of tracking summaries
* 📦 CSV and Excel export
* 💾 Local storage persistence between sessions
* 🧪 Built-in sample dataset loader
* 🪟 Detail and confirmation modals
* 🔔 Toast notifications for user actions

---

## 🛠️ Tech Stack

**Frontend**

* HTML5
* Vanilla JavaScript
* Tailwind CSS

**Libraries**

* SheetJS (xlsx) — Excel parsing and export
* Browser LocalStorage — client-side persistence

**Concepts Demonstrated**

* Client-side data ingestion
* Data normalization and mapping
* UI state management
* Table rendering and filtering
* File export generation
* Modal and notification systems

---

## 📂 Project Structure

```
src/
  index.html        → Main dashboard UI
  styles.css        → Custom styles
  app.js            → Dashboard logic (recommended split)

assets/
  screenshots/      → README images

README.md
```

---

## ▶️ How To Run

### Option A — Direct Open

Open the file in your browser:

```
src/index.html
```

---

### Option B — Local Server (recommended)

```bash
cd src
python -m http.server 8000
```

Visit:

```
http://localhost:8000
```

---

## 📥 Expected Excel Format

The importer looks for columns similar to:

* Ticket Number / ID
* Outbound Tracking
* Inbound Tracking

Column names are matched flexibly using keyword patterns, so exact naming is not required.

---

## 🔍 Example Workflow

1. Export tracking data from your system into Excel
2. Upload the file using **Import Data**
3. Review shipment status results
4. Apply filters or sorting
5. Export filtered results to CSV or Excel
6. Copy tracking summaries as needed

---

## 📸 Screenshots

*Add screenshots here for strongest portfolio impact*

```
assets/screenshots/dashboard.png
assets/screenshots/filters.png
assets/screenshots/details-modal.png
```

---

## 💼 Portfolio Relevance

This project highlights practical Data / Business Analyst adjacent skills:

* Turning raw operational data into usable dashboards
* Automating spreadsheet-based workflows
* Designing user-focused reporting tools
* Building lightweight analytics interfaces
* Implementing exportable business reports

---

## ⚠️ Notes

* Tracking status is simulated for demo purposes
* No external APIs are called
* Do not upload sensitive shipment data to public deployments
* Sample datasets should be sanitized before sharing

---

## 🚀 Future Improvements

* Real carrier API integration
* User-defined column mapping UI
* Saved filter presets
* Role-based views
* Chart summaries and KPI widgets
* Backend persistence layer

---

## 📜 License

This project is for academic and educational use. Add a formal license if distributing publicly.

