# Kaaviya Textiles — Bargur

Shop management website for saree retail: catalog CRUD, stock management, sales & purchase receipts.

## Stack (100% free & open source)

- **Next.js** — UI + API
- **SQLite** via **Prisma** — all data stored locally in `prisma/dev.db`
- **No payment**, no cloud DB, no subscriptions

## Features

- **Dashboard** — overview, low-stock alerts, recent sales/purchases
- **Saree catalog** — CRUD with variants (Banaras, Silk Saree, Cotton Sarees) and price points (₹300–₹2000)
- **Stock management** — inventory table + manual adjustments
- **Sales receipts** — create sale, print receipt, auto-deduct stock
- **Purchase receipts** — stock inward from vendors, auto-add stock
- **Tags** — placeholder page for future barcode/QR scanning

## Getting started

```bash
cd kaaviya-textiles
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data location

SQLite database file: `prisma/dev.db` — back this up to preserve all receipts and inventory.

## Sample images

Product photos use [Unsplash](https://unsplash.com) URLs (free to use). Replace with your own shop photos anytime in the catalog edit form.
