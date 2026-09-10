# ShopEase — Frontend

The online storefront for **ShopEase**, a React single-page application. It talks to the ShopEase backend (Express + Prisma + PostgreSQL, not in this repo) through a JSON API.

## Features

- **Storefront home** — product categories, featured tiles, and the latest inventory
- **Search & product listing** — filter and browse products
- **Product details** — full product view with price, description, and add-to-cart
- **Cart** — quantity controls, totals, and a live item-count badge on the navbar
- **Checkout** — shipping/payment details collected per user
- **Order summary** — confirmation screen by order number after checkout
- **Orders** — look up past orders by the email used at checkout
- **Animated delivery mascot** — a Lottie run-cycle character in the navbar that:
  - patrols back and forth between the logo and the cart
  - flies to the cart (with the product thumbnail) when an item is added
  - pauses for users with `prefers-reduced-motion`

## Tech Stack

| Tool | Purpose |
| --- | --- |
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| React Router 6 | Client-side routing |
| Tailwind CSS 3 | Styling |
| Axios | API requests |
| @lottiefiles/dotlottie-react | Lottie animations |
| Prettier + ESLint | Code formatting & linting |

## Quick Start

```bash
npm install          # install dependencies
cp .env.example .env # set VITE_API_URL (defaults to http://localhost:5000/api)
npm run dev          # start the dev server (default http://localhost:5173)
```

Other scripts:

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:5000/api`). Required for the app to load products and place orders. |

`.env` is git-ignored; commit a copy as `.env.example` for reference.

## Folder Structure

```
client/
├── public/
│   └── lottie/             # Lottie animation assets
│       └── runner.json     # navbar delivery mascot (recolored to brand palette)
├── src/
│   ├── components/         # reusable UI
│   │   ├── Footer.jsx
│   │   ├── LottieRunner.jsx    # Lottie mascot wrapper (patrols + reduced-motion aware)
│   │   ├── Navbar.jsx          # header, cart badge, patrol & flight animations
│   │   ├── QuantityControl.jsx
│   │   └── ...
│   ├── context/
│   │   └── CartContext.jsx     # global cart state + fly-to-cart events
│   ├── pages/              # route views
│   │   ├── HomeStorefront.jsx  # "/"
│   │   ├── SearchResults.jsx   # "/search"
│   │   ├── ProductDetails.jsx  # "/product/:id"
│   │   ├── ProductListing.jsx
│   │   ├── Cart.jsx            # "/cart"
│   │   ├── Checkout.jsx        # "/checkout"
│   │   ├── OrderSummary.jsx    # "/order/:orderNumber"
│   │   └── Orders.jsx          # "/orders"
│   ├── services/
│   │   └── api.js              # axios client (reads VITE_API_URL)
│   ├── utils/
│   │   └── session.js
│   ├── App.jsx              # route table & layout
│   ├── main.jsx             # entry point
│   └── index.css            # Tailwind + component classes & custom animations
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## API Contract

The frontend expects the backend at `{VITE_API_URL}`:

- `GET  /products` — product list
- `GET  /products/:id` — product detail
- `GET  /categories` — categories
- `POST /orders` — place an order
- `GET  /orders?email=...` — order history by email
- `GET  /health` — backend health check

See the ShopEase backend repository for the implementation.

## Deployment

Any static host works (Vercel, Netlify, Render). Build once with `VITE_API_URL` set to your backend URL, serve `dist/`, and add an SPA fallback so `/product/:id` etc. rewrite to `index.html`.

```json
// vercel.json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```