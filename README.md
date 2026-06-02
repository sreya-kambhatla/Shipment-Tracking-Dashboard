# FedEx Shipment Tracking Dashboard

A client-side shipment tracking dashboard that turns Excel exports into a live, filterable, and exportable tracking view — no backend required. Built for operational and support teams who manage FedEx outbound and inbound shipments from spreadsheets.

**[Live Demo →](https://sreya-kambhatla.github.io/Shipment-Tracking-Dashboard/)**

---

## Overview

Tracking dozens of shipments across tickets manually is slow and error-prone. This dashboard solves that by letting you drop in an Excel file and instantly get a structured, filterable view of every shipment — with status indicators, progress bars, detail modals, and one-click exports.

Everything runs in the browser. No server, no login, no data leaves your machine.

---

## Features

| Feature | Details |
|---|---|
| **Excel Import** | Drag in any `.xlsx` or `.xls` file — columns are auto-detected |
| **Append Mode** | Add new shipments to existing data without overwriting |
| **Status Indicators** | Animated badge dots for Delivered, In Transit, Out for Delivery, Pending, and Exception |
| **Progress Bars** | 4-step inline progress bar per shipment (Label → Picked Up → In Transit → Delivered) |
| **Filter & Sort** | Filter by status, hide delivered, sort by ticket/date — all combinable |
| **Detail Modals** | Full shipment breakdown with location, estimated delivery, and status per direction |
| **Copy Tracking** | One-click copy of formatted tracking summary to clipboard |
| **Export** | Download results as CSV or Excel (`.xlsx`) |
| **Dark Mode** | Full dark theme with system preference detection and manual toggle |
| **Persistence** | Session data, filters, and sort state saved to localStorage |
| **Sample Data** | 12 pre-built shipments covering all status types — load instantly, no file needed |

---

## Getting Started

### Option 1 — GitHub Pages (live)

Visit the deployed URL above. No setup required.

### Option 2 — Open locally

```bash
git clone https://github.com/sreya-kambhatla/shipment-tracking-dashboard.git
cd shipment-tracking-dashboard
# Open src/index.html in your browser
open src/index.html
```

### Option 3 — Local dev server

```bash
cd src
python -m http.server 8000
# Visit http://localhost:8000
```

---

## Using the Dashboard

**With your own data:**

1. Prepare an Excel file with at least these columns:
   - `Ticket Number`
   - `Outbound Tracking`
   - `Inbound Tracking` *(optional)*
2. Click **Import** to replace, or **Append** to add to existing data
3. Use the **Filter & Sort** panel to narrow results
4. Click the eye icon on any row for full shipment details
5. Export filtered results via the **Export** button

**With sample data:**

Click **Load Sample Data** — 12 shipments across all status types load instantly so you can explore every feature without a file.

A ready-to-use `sample_data.xlsx` is included in the repo root for testing the file importer.

---

## Excel Format

The importer uses flexible keyword matching on column headers — exact naming isn't required.

| Column | Matched by |
|---|---|
| Ticket Number | header containing `ticket` |
| Outbound Tracking | header containing `outbound` |
| Inbound Tracking | header containing `inbound` *(optional)* |

---

## Project Structure

```
shipment-tracking-dashboard/
├── src/
│   ├── index.html        — Dashboard UI and layout
│   ├── styles.css        — Design system (CSS variables, dark mode, components)
│   └── app.js            — All application logic
├── sample_data.xlsx      — 12-row sample file for import testing
└── README.md
```

---

## Tech Stack

- **HTML5 / Vanilla JavaScript** — no framework dependencies
- **Tailwind CSS** (CDN) — utility layout classes
- **SheetJS (xlsx)** — Excel parsing and export
- **CSS custom properties** — full dark/light theming
- **localStorage** — client-side persistence

---

## Deploying to GitHub Pages

1. Go to your repo **Settings → Pages**
2. Set source to **Deploy from a branch**
3. Branch: `main` · Folder: `/src`
4. Save — your site will be live at `https://<username>.github.io/<repo-name>/`

---

## Notes

- Tracking statuses are **simulated** for demo purposes — no real FedEx API calls are made
- All data stays in your browser; nothing is sent to any server
- Do not upload files containing real customer PII to a publicly deployed instance

---

## License

For educational and portfolio use. Add a formal license (e.g. MIT) if distributing publicly.
