# Auto EDA

Instant exploratory data analysis in the browser. Upload a CSV and get comprehensive stats, distributions, correlations, and missing value analysis — no setup, no code.

**Live demo:** [auto-eda-revinobakmaldi.vercel.app](https://auto-eda-revinobakmaldi.vercel.app)

## Features

- **Dataset Overview** — rows, columns, memory usage, duplicates, missing cells, data types
- **Variable Analysis** — per-column statistics with histograms (numeric) and bar charts (categorical)
- **Missing Values** — horizontal bar chart sorted by missing percentage
- **Correlation Matrix** — interactive SVG heatmap with diverging color scale
- **Data Preview** — first 10 rows with type indicators

## Tech Stack

- **Frontend:** Next.js, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Recharts
- **Backend:** Python serverless function (Pandas, NumPy) on Vercel
- **Styling:** Glassmorphism design with dark mode support

## Getting Started

```bash
npm install
vercel dev
```

Open [localhost:3000](http://localhost:3000) and upload a CSV or click "Try with sample data."

> `vercel dev` is required (instead of `npm run dev`) because the backend is a Python serverless function.

## Project Structure

```
auto-eda/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout (Geist fonts, metadata)
│   ├── page.tsx          # Main page — upload → analyzing → dashboard → error
│   └── globals.css       # Tailwind 4 + design tokens
├── api/
│   └── analyze.py        # Python serverless: POST /api/analyze
├── components/
│   ├── upload/           # File dropzone, sample dataset button
│   ├── dashboard/        # Overview, variable cards, missing values, heatmap, data table
│   └── shared/           # Glassmorphism card, section header, navbar, animated background
├── lib/                  # Types, API client, animations, utilities
├── public/
│   └── sample.csv        # Sample dataset (80 rows, mixed types, intentional gaps)
├── requirements.txt      # pandas, numpy
└── vercel.json           # Python runtime config
```

## API

**`POST /api/analyze`** — multipart/form-data with `file` field (CSV, max 4MB)

Returns dataset overview, per-variable statistics, missing value breakdown, correlation matrix, and sample rows.

## Deploy

Push to GitHub and import on [Vercel](https://vercel.com). The Python function is auto-detected via `vercel.json`.
