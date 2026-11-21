# ReactBoard — Admin Dashboard UI

A responsive React + TypeScript dashboard UI inspired by the supplied screenshot. It uses sample data only and is ready for later API integration.

## Features
- Dark sidebar with workspace navigation and report links
- Revenue, orders, average order value, and product sales KPI cards
- Revenue line chart, monthly order bar chart, customer satisfaction donut chart
- Traffic source progress bars
- Searchable recent-orders table with status labels and pagination controls
- Wishlist list with interactive remove/edit demo actions
- Toast notifications, responsive mobile navigation, and accessible control labels

## Run locally
Requirements: Node.js 18+

```bash
npm install
npm run dev
```

## Build for production
```bash
npm run build
npm run preview
```

## Project structure
- `src/App.tsx` — dashboard layout, sample data, chart components, and interactions
- `src/styles.css` — responsive styling and visual theme
- `src/main.tsx` — React entry point
- `index.html` — Vite app shell

## Notes
All figures and records are demonstration data. No backend, authentication, or real reporting API is connected. The Google Fonts import is optional; the UI falls back to local sans-serif fonts if unavailable.
