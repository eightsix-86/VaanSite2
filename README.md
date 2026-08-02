# Vaan Bakes 🧁

A full-stack bakery storefront with a custom cake builder, real-time order processing, admin panel, and full-stack monitoring. Built with a static HTML/CSS/JS frontend (GSAP + anime.js animations) backed by an Express API, PostgreSQL via Supabase, auto-provisioned Prometheus metrics, and a Grafana dashboard.

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-latest-E6522C?logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-latest-F46800?logo=grafana&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deploy-46E3B7?logo=render&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock&logoColor=white)
![anime.js](https://img.shields.io/badge/anime.js-3.2-E01E5A)

## Features

- **Online Storefront** — Browse 36 products across cakes, cupcakes, and cookies with real-time stock availability
- **Custom Cake Builder** — Interactive cake designer with size, layers, flavor, filling, frosting, and toppings; live preview and pricing
- **Shopping Cart & Checkout** — Full cart with localStorage persistence, checkout form, and order submission via REST API
- **Order Management** — Backend validates stock against the database, decrements inventory, and returns order confirmations with unique UUIDs
- **Persistent PostgreSQL Storage** — Products, images, orders, events, seasonal specials, and cake builder config all stored in Supabase PostgreSQL
- **Admin Panel** — Password-protected dashboard (`/admin.html`) for editing products, images, seasonal specials, and cake builder config
- **Tracking & Recommendations** — Event tracking (views, cart adds, checkouts, orders) powering recommendation logic
- **Prometheus Metrics** — Instrumented HTTP request counters/durations, order tracking (placed/failed), order value distributions, and out-of-stock gauge
- **Grafana Dashboard** — Auto-provisioned dashboard with traffic, latency, error rate, order throughput, and stock metrics
- **Brand Identity** — Warm plum-and-caramel gradient palette, stock imagery with brand-color fallback, smooth GSAP/anime.js page animations
- **Dockerized Deployment** — One-command startup for backend + Prometheus + Grafana via Docker Compose, or deploy to Render via the Blueprint
- **Responsive Design** — Fully responsive layout across desktop, tablet, and mobile

## Project Structure

```
VaanSite2/                             # repo root
├── render.yaml                        # Render Blueprint (Docker deploy)
├── docker-compose.yml                 # Backend + Prometheus + Grafana
├── supabase/
│   ├── config.toml                    # Supabase project config
│   └── migrations/
│       └── 00001_init.sql             # Canonical schema (idempotent)
├── vaan-bakes/
│   ├── frontend/                      # Static site (served by Express)
│   │   ├── index.html                 # Homepage
│   │   ├── store.html                 # Store + cake builder
│   │   ├── refund.html                # Refund policy
│   │   ├── admin.html                 # Admin panel
│   │   ├── css/styles.css             # Complete stylesheet
│   │   └── js/                        # main, store, products, tracking,
│   │                                  # scroll-waves, cake3d, config
│   ├── backend/                       # Express API server
│   │   ├── server.js                  # App entry, static serving, metrics
│   │   ├── db.js                      # Postgres pool + memory fallback
│   │   ├── schema.sql                 # Postgres schema (source of truth)
│   │   ├── seed.js                    # Apply schema + seed catalog
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── src/
│   │       ├── metrics.js             # Prometheus instrumentation
│   │       ├── admin-sessions.js      # Token-based admin auth
│   │       ├── data/products.js       # Seed catalog + seasonal specials
│   │       └── routes/                # products, orders, events, builder, admin
│   └── monitoring/
│       ├── prometheus.yml
│       └── grafana/
│           ├── provisioning/          # auto-provisioned datasource + dashboard
│           └── dashboards/vaan-bakes.json
└── CHANGELOG.md                       # Version history
```

## Prerequisites

- [Node.js 20+](https://nodejs.org/) for local development
- [Docker](https://docs.docker.com/get-docker/) + [Docker Compose](https://docs.docker.com/compose/install/) (optional, for the full monitoring stack)
- A [Supabase](https://supabase.com/) project (or any PostgreSQL database) for persistence
- A [Render](https://render.com/) account (for deployment)

## Getting Started

### 1. Database Setup (Supabase)

1. Create a free Supabase project.
2. Get your connection string from **Project Settings → Database → Connection string** (use the **Session pooler** for IPv4 compatibility).
3. Create `vaan-bakes/backend/.env` from the template:

```bash
cd vaan-bakes/backend
cp .env.example .env   # then fill in your values
```

```dotenv
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-1-<region>.pooler.supabase.com:5432/postgres
DATABASE_SSL=true
PORT=4000
ADMIN_PASSWORD=your-secret-password
CORS_ORIGIN=*
```

> `.env` is git-ignored — your credentials never reach the repo.

### 2. Seed the Database

```bash
cd vaan-bakes/backend
npm install
npm run seed
```

This applies `schema.sql` and loads the 36 products, 3 seasonal specials, and the default cake builder config.

### 3. Run Locally

```bash
cd vaan-bakes/backend
npm start
```

- Site & API: http://localhost:4000
- Health check: http://localhost:4000/healthz
- Metrics: http://localhost:4000/metrics
- Admin panel: http://localhost:4000/admin.html (requires `ADMIN_PASSWORD`)

### 4. Full Stack with Monitoring (Docker Compose)

From the **repo root**:

```bash
docker compose up --build
```

| Service    | URL                          | Credentials      |
|------------|------------------------------|------------------|
| Site + API | http://localhost:4000        | —                |
| Prometheus | http://localhost:9090        | —                |
| Grafana    | http://localhost:3000        | `admin` / `admin` |

## Deploying to Render

The repo includes a [Render Blueprint](render.yaml) that provisions a Docker-based web service bundling both the API and the static frontend.

### One-time setup

1. Push this repo to GitHub.
2. On Render: **New + → Blueprint → select the repo**.
3. Render reads `render.yaml` and creates the `vaan-bakes-api` service.
4. In the service's **Environment** tab, set:
   - `DATABASE_URL` — your Supabase session pooler URL
   - `DATABASE_SSL=true`
   - `ADMIN_PASSWORD` — a strong password for the admin panel
   - `CORS_ORIGIN=*` (or your frontend domain)
5. Deploy. The health check hits `/healthz`.

Your API will be live at:

```
https://vaan-bakes-api.onrender.com/api/products
```

## API Reference

| Method | Endpoint                        | Description                                      |
|--------|----------------------------------|--------------------------------------------------|
| `GET`  | `/api/products`                  | Full catalog, grouped by category                |
| `GET`  | `/api/products?flat=true`       | Flat array of all products                       |
| `GET`  | `/api/products/specials`        | Seasonal specials feed                           |
| `GET`  | `/api/products/:category`       | Products by category (`cakes`, `cupcakes`, `cookies`) |
| `GET`  | `/api/products/:category/:id`   | Single product by ID                             |
| `POST` | `/api/orders`                   | Place an order (see request body below)          |
| `GET`  | `/api/orders/:id`               | Get order status by ID                           |
| `POST` | `/api/events`                   | Record a tracking event (view / cart add, etc.)  |
| `GET`  | `/api/builder-config`           | Cake builder configuration                       |
| `GET`  | `/api/admin/*`                  | Admin CRUD endpoints (protected)                 |
| `GET`  | `/healthz`                      | Liveness check                                   |
| `GET`  | `/metrics`                      | Prometheus metrics scrape endpoint               |

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

## Monitoring

### Prometheus Metrics

The backend is instrumented with [`prom-client`](https://github.com/siimon/prom-client) and exposes the following custom metrics at `/metrics` alongside default Node.js runtime metrics (memory, event loop lag, GC):

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
- Category navigation with smooth scroll
- Product cards with stock photos and brand-gradient fallback
- Real-time stock badges and "Add to Cart" buttons
- Interactive cake builder with live preview and pricing
- Shopping cart modal with checkout flow

### Admin (`/admin.html`)
Password-protected dashboard (protected by `ADMIN_PASSWORD`) for managing the product catalog, images, seasonal specials, and cake builder configuration — all persisted to PostgreSQL.

### Refund Policy (`/refund.html`)
Comprehensive refund and cancellation policy with contact information.

## Notes

- The backend gracefully falls back to an in-memory store if `DATABASE_URL` is not set — great for quick local demos, but data resets on restart.
- Stock photos use [picsum.photos](https://picsum.photos) seeded by product ID. For production, replace with licensed photography or your own images via the admin panel.

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

