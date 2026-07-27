# Vaan Bakes 🧁

A small-batch bakery storefront with a custom cake builder, real-time order processing, and full-stack monitoring. Built with a static HTML/CSS/JS frontend (GSAP + anime.js animations) backed by an Express API, auto-provisioned Prometheus metrics, and a Grafana dashboard.

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-latest-E6522C?logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-latest-F46800?logo=grafana&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock&logoColor=white)
![anime.js](https://img.shields.io/badge/anime.js-3.2-E01E5A)

## Features

- **Online Storefront** — Browse 36 products across cakes, cupcakes, and cookies with real-time stock availability
- **Custom Cake Builder** — Interactive cake designer with size, layers, flavor, filling, frosting, and toppings; live preview and pricing
- **Shopping Cart & Checkout** — Full cart with localStorage persistence, checkout form, and order submission via REST API
- **Order Management** — Backend validates stock, decrements inventory, and returns order confirmations with unique IDs
- **Prometheus Metrics** — Instrumented HTTP request counters/durations, order tracking (placed/failed), order value distributions, and out-of-stock gauge
- **Grafana Dashboard** — Auto-provisioned dashboard with traffic, latency, error rate, order throughput, and stock metrics
- **Brand Identity** — Warm plum-and-caramel gradient palette, stock imagery with brand-color fallback, smooth GSAP/anime.js page animations
- **Dockerized Deployment** — One-command startup for backend + Prometheus + Grafana via Docker Compose
- **Responsive Design** — Fully responsive layout across desktop, tablet, and mobile

## Project Structure

```
vaan-bakes/
├── frontend/                          # Static site (served by Express)
│   ├── index.html                     # Homepage
│   ├── store.html                     # Store + cake builder
│   ├── refund.html                    # Refund policy
│   ├── css/
│   │   └── styles.css                 # Complete stylesheet
│   └── js/
│       ├── main.js                    # Homepage logic, animations, cake builder
│       ├── store.js                   # Store catalog, cart, checkout
│       ├── products.js                # Product rendering helpers
│       ├── scroll-waves.js            # Wave overlay animations
│       └── cake3d.js                  # 3D cake visualization
├── backend/                           # Express API server
│   ├── server.js                      # App entry, static serving, metrics endpoint
│   ├── package.json
│   ├── Dockerfile
│   └── src/
│       ├── metrics.js                 # Prometheus instrumentation
│       ├── data/
│       │   └── products.js            # Product catalog + seasonal specials
│       └── routes/
│           ├── products.js            # Product API routes
│           └── orders.js              # Order API routes
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
├── docker-compose.yml                 # Backend + Prometheus + Grafana
├── CHANGELOG.md                       # Version history
└── README.md                          # This file
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) (recommended)
- OR [Node.js 20+](https://nodejs.org/) for local development

## Getting Started

### Docker (Recommended)

Brings up the backend, Prometheus, and Grafana together:

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

### Local Development (Backend Only)

```bash
cd vaan-bakes/backend
npm install
npm start
```

The backend serves the frontend directly at http://localhost:4000 and exposes the API under `/api`.

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

### Refund Policy (`/refund.html`)
Comprehensive refund and cancellation policy with contact information.

## Notes

- The product catalog and orders are in-memory (reset on restart) — this keeps the stack lightweight without requiring a database. Swapping in a real database would be the natural next step.
- Stock photos use [picsum.photos](https://picsum.photos) seeded by product ID. For production, replace with licensed photography or your own images.

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

