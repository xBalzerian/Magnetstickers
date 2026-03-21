# 🧲 MagnetStickers.art

Custom die-cut magnet sticker store powered by Next.js, Supabase, Printful, KIE AI, and PayPal.

## Tech Stack
- **Frontend**: Next.js 15 + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Fulfillment**: Printful (Product ID: 656 — Die-Cut Magnets)
- **Payments**: PayPal Checkout
- **Design AI**: KIE API / Z-Image model
- **Hosting**: Vercel

## Printful Die-Cut Magnet Specs
| Size | Variant ID | Print File | DPI | Cost |
|------|-----------|------------|-----|------|
| 3″ × 3″ | 16366 | 900 × 900 px | 300 | $3.32 |
| 4″ × 4″ | 16367 | 1200 × 1200 px | 300 | $3.83 |
| 6″ × 6″ | 16465 | 1800 × 1800 px | 300 | $5.87 |

**File format**: PNG with transparent background, RGB color mode

## Environment Variables
See `.env.example` for required variables.

## Setup
1. Clone repo
2. Copy `.env.example` to `.env.local` and fill in keys
3. Run SQL migration in Supabase SQL Editor (`supabase/migrations/001_initial_schema.sql`)
4. `npm install && npm run dev`

## Deployment
Connected to Vercel — auto-deploys on push to `main`.

## Admin Panel
Visit `/admin` — password protected.
