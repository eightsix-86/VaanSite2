# Vaan Bakes 🧁

A full-stack bakery storefront with a custom cake builder, real-time order processing, an admin panel, behavioral analytics, and full-stack monitoring. Built with a static HTML/CSS/JS frontend (GSAP + anime.js animations), an Express API backed by PostgreSQL (Supabase), and auto-provisioned Prometheus + Grafana observability.

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-latest-E6522C?logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-latest-F46800?logo=grafana&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Render-deploy-46E3B7?logo=render&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock&logoColor=white)
![anime.js](https://img.shields.io/badge/anime.js-3.2-E01E5A)

## Features

- **Online Storefront** — Browse 36 products across cakes, cupcakes, and cookies with real-time stock availability
- **Custom Cake Builder** — Interactive cake designer with size, layers, flavor, filling, frosting, and toppings; live preview and pricing
- **Shopping Cart & Checkout** — Full cart with localStorage persistence, checkout form, and order submission via REST API
- **Order Management** — Backend validates stock, decrements inventory atomically, and returns order confirmations with unique IDs
- **Admin Panel** — Password-protected dashboard (`/admin.html`) to manage products (CRUD), view orders, and edit cake-builder pricing — all backed by the database
- **Recommendation Engine** — Personalized "Recommended for You" section powered by behavioral tracking (views, cart adds, orders)
- **Behavioral Analytics** — Lightweight events API feeds the recommender and behavioral metrics
- **PostgreSQL Persistence** — Products, orders, events, builder config, and admin sessions stored in Supabase Postgres; graceful in-memory fallback when no DB is configured
- **Prometheus Metrics** — Instrumented HTTP request counters/durations, order tracking (placed/failed), order value distributions, and out-of-stock gauge
- **Grafana Dashboard** — Auto-provisioned dashboard with traffic, latency, error rate, order throughput, and stock metrics
- **Split-Hosting Ready** — CORS support and a configurable API base URL so the frontend can live on Netlify/GitHub Pages while the API runs on Render
- **Dockerized Deployment** — One-command startup for backend + Prometheus + Grafana via Docker Compose
- **Responsive Design** — Fully responsive layout across desktop, tablet, and mobile

## Project Structure

```
vaan-bakes/
├── frontend/                          # Static site (served by Express)
│   ├── index.html                     # Homepage
│   ├── store.html                     # Store + cake builder + recommendations
│   ├── refund.html                    # Refund policy
│   ├── admin.html                     # Admin panel (password-protected)
│   ├── css/
│   │   └── styles.css                 # Complete stylesheet
│   └── js/
│       ├── config.js                  # Configurable API base URL
│       ├── tracking.js                # Behavioral event tracking
│       ├── main.js                    # Homepage logic, animations, cake builder
│       ├── store.js                   # Store catalog, cart, checkout, recommendations
│       ├── products.js                # Product rendering helpers
│       ├── scroll-waves.js            # Wave overlay animations
│       └── cake3d.js                  # 3D cake visualization
├── backend/                           # Express API server
│   ├── server.js                      # App entry, static serving, metrics endpoint
│   ├── db.js                          # Database layer (Postgres + in-memory fallback)
│   ├── schema.sql                     # PostgreSQL schema (Supabase-compatible)
│   ├── seed.js                        # Seeds catalog into Postgres (npm run seed)
│   ├── package.json
│   ├── Dockerfile
│   └── src/
│       ├── metrics.js                 # Prometheus instrumentation
│       ├── admin-sessions.js          # Token-based admin auth
│       ├── data/
│       │   └── products.js            # Seed catalog + seasonal specials
│       └── routes/
│           ├── products.js            # Product API routes + recommendations
│           ├── orders.js              # Order API routes
│           ├── events.js              # Behavioral tracking events
│           ├── builder.js             # Cake builder config API
│           └── admin.js               # Admin CRUD (products, orders, builder)
├── monitoring/
│   ├── prometheus.yml                 # Prometheus scrape config
│   └── grafana/
│       ├── provisioning/
│       │   ├── datasources/
│       │   │   └── datasource.yml     # Auto-provisioned Prometheus datasource
│       │   └── dashboards/
│       │       └── dashboard.yml      # Auto-provisioned dashboard config
│       └── dashboards/
│           └── vaan-bakes.json        # Pre-built Grafana dashboard
├── render.yaml                        # Render Blueprint (free-tier deploy)
├── docker-compose.yml                 # Backend + Prometheus + Grafana
├── .gitignore                         # Secrets & build artifacts ignored
├── CHANGELOG.md                       # Version history
└── README.md                          # This file
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) for full local stack
- [Node.js 20+](https://nodejs.org/) for local development
- [Supabase](https://supabase.com/) (free) or any PostgreSQL instance for persistence (optional for local dev — falls back to in-memory)

## Getting Started

### Quick start (no database — in-memory fallback)

```bash
cd vaan-bakes/backend
npm install
npm start
```

The backend serves the frontend at http://localhost:4000 and exposes the API under `/api`. Without `DATABASE_URL`, products and orders fall back to an in-memory store (reset on restart) — perfect for a quick demo.

### With PostgreSQL (Supabase)

1. Create a free project on [Supabase](https://supabase.com/), copy the database connection string.
2. Configure the backend:

```bash
cd vaan-bakes/backend
cp .env.example .env
# edit .env → set DATABASE_URL, ADMIN_PASSWORD, PORT
npm install
npm run seed     # applies schema.sql + loads the product catalog
npm start
```

3. Open:
   - Site: http://localhost:4000
   - Admin panel: http://localhost:4000/admin.html (use your `ADMIN_PASSWORD`)

### Full local stack with Docker (backend + Prometheus + Grafana)

```bash
cd vaan-bakes
docker compose up --build
```

| Service    | URL                          | Credentials      |
|------------|------------------------------|------------------|
| Site       | http://localhost:4000        | —                |
| Prometheus | http://localhost:9090        | —                |
| Grafana    | http://localhost:3000        | `admin` / `admin` |

Grafana loads with the "Vaan Bakes Backend" dashboard pre-installed.

## Environment Variables

All configuration lives in `backend/.env` (copy `backend/.env.example`). Never commit real secrets.

| Variable          | Required | Description                                                              |
|-------------------|----------|--------------------------------------------------------------------------|
| `DATABASE_URL`    | No*      | PostgreSQL connection string (Supabase URI). Omit for in-memory fallback |
| `DATABASE_SSL`    | No       | `true` by default; set `false` for local Postgres without SSL            |
| `PORT`            | No       | HTTP port (default `4000`)                                               |
| `ADMIN_PASSWORD`  | No*      | Enables `/admin.html` + `/api/admin/*`. Strong password recommended      |
| `CORS_ORIGIN`     | No       | Comma-separated allowed origins for split hosting (default `*`)          |

\* Needed for full features: set `DATABASE_URL` for persistence and `ADMIN_PASSWORD` to unlock the admin panel.

## API Reference

### Public endpoints

| Method | Endpoint                                    | Description                                      |
|--------|---------------------------------------------|--------------------------------------------------|
| `GET`  | `/api/products`                             | Full catalog, grouped by category                |
| `GET`  | `/api/products?flat=true`                  | Flat array of all products                       |
| `GET`  | `/api/products/specials`                    | Seasonal specials feed                           |
| `GET`  | `/api/products/:category`                   | Products by category (`cakes`, `cupcakes`, `cookies`) |
| `GET`  | `/api/products/:category/:id`               | Single product by ID                             |
| `GET`  | `/api/products/recommended/:id`             | Recommendations for a product (`?limit=4`)       |
| `POST` | `/api/orders`                               | Place an order (see request body below)          |
| `GET`  | `/api/orders/:id`                           | Get order status by ID                           |
| `POST` | `/api/events`                               | Behavioral tracking (views, cart adds, orders)   |
| `GET`  | `/api/builder-config`                       | Cake builder configuration                       |
| `GET`  | `/healthz`                                  | Liveness check                                   |
| `GET`  | `/metrics`                                  | Prometheus metrics scrape endpoint               |

### Admin endpoints (require `Authorization: Bearer <token>`)

| Method | Endpoint                     | Description                             |
|--------|------------------------------|-----------------------------------------|
| `POST` | `/api/admin/login`           | Authenticate with password → returns token |
| `GET`  | `/api/admin/products`        | List all products                       |
| `POST` | `/api/admin/products`        | Create a product                        |
| `PUT`  | `/api/admin/products/:id`    | Update a product                        |
| `DELETE` | `/api/admin/products/:id`  | Delete a product                        |
| `GET`  | `/api/admin/orders`          | List recent orders                      |
| `GET`  | `/api/admin/builder-config`  | Get builder config                      |
| `PUT`  | `/api/admin/builder-config`  | Save builder config                     |

### POST /api/orders Request Body

```json
{
  "customer": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1-555-123-4567",
    "address": "123 Baker St, Springfield"
  },
  "items": [
    { "productId": "cake-101", "quantity": 1 },
    { "productId": "cupcake-201", "quantity": 6 }
  ]
}
```

### POST /api/orders Response (201)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "customer": { ... },
  "items": [ ... ],
  "total": 79.00,
  "status": "placed",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

## Deployment

### Render (API) + Supabase (database)

The repo includes a Render Blueprint (`render.yaml`):

1. Create a free Supabase project and copy the connection string.
2. In Render: **New + → Blueprint → connect this repo**. Render provisions the web service from `render.yaml`.
3. Set `DATABASE_URL` and `ADMIN_PASSWORD` as environment variables in the Render dashboard (values stay private — they never live in the repo).
4. Run the one-time seed: `DATABASE_URL=... npm run seed` (using the Render Shell or locally against the same DB).

Your API is live at `https://<service-name>.onrender.com`.

### Split hosting (frontend on Netlify / GitHub Pages)

1. Deploy the API to Render as above.
2. Set the API base in `frontend/js/config.js`:

```js
window.API_BASE_URL = window.API_BASE_URL || 'https://vaan-bakes-api.onrender.com';
```

3. Deploy the `frontend/` folder to Netlify or GitHub Pages.
4. Ensure `CORS_ORIGIN` on the backend includes your frontend domain (or keep `*` for a public catalog).

## Monitoring

### Prometheus Metrics

The backend is instrumented with [`prom-client`](https://github.com/siimon/prom-client) and exposes custom metrics at `/metrics` alongside default Node.js runtime metrics (memory, event loop lag, GC):

| Metric                          | Type       | Labels                                | Description                        |
|---------------------------------|------------|---------------------------------------|------------------------------------|
| `http_requests_total`           | Counter    | `method`, `route`, `status_code`      | HTTP request volume by endpoint    |
| `http_request_duration_seconds` | Histogram  | `method`, `route`, `status_code`      | Request latency distribution       |
| `vaan_orders_total`             | Counter    | `status` (`placed`, `failed`)         | Order throughput                   |
| `vaan_order_value_dollars`      | Histogram  | —                                     | Distribution of order totals       |
| `vaan_products_out_of_stock`    | Gauge      | —                                     | Current out-of-stock product count |

### Grafana Dashboard

The auto-provisioned dashboard includes panels for:

- **Traffic** — HTTP request rate by route and method
- **Latency** — p50/p90/p99 request duration
- **Error Rate** — 4xx/5xx ratio over time
- **Order Throughput** — Orders placed vs. failed
- **Order Value Percentiles** — Order total distribution
- **Out-of-Stock Count** — Live gauge of zero-stock items

## Pages

### Home (`/`)
Hero section with brand story, product category showcase cards, seasonal specials feed (pulled from the backend API with local fallback), about section, and contact info.

### Store (`/store.html`)
Full product catalog organized into Cakes, Cupcakes, and Cookies sections. Features:
- Personalized "Recommended for You" section based on behavioral tracking
- Category navigation with smooth scroll
- Product cards with stock photos and brand-gradient fallback
- Real-time stock badges and "Add to Cart" buttons
- Interactive cake builder with live preview and pricing
- Shopping cart modal with checkout flow

### Admin Panel (`/admin.html`)
Password-protected dashboard for store management:
- Product CRUD (create, edit, delete) with multiple images per product
- Order history viewer
- Cake builder pricing/label editor

### Refund Policy (`/refund.html`)
Comprehensive refund and cancellation policy with contact information.

## Notes

- Without `DATABASE_URL`, the app runs with an in-memory catalog/orders and still serves the full site — ideal for demos. Set up Supabase for real persistence.
- Stock photos use [picsum.photos](https://picsum.photos) seeded by product ID. For production, replace with licensed photography or your own images.
- Event tracking fires lightweight POSTs that fail silently — analytics never blocks the shopping experience.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">Made with ❤️ and a lot of buttercream</p>

