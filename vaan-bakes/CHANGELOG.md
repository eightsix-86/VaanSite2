# Changelog

## Initial Release — v1.0.0

The initial launch of Vaan Bakes, transforming a static bakery storefront into a full-stack application with monitoring.

### What changed from the original static version

#### 1. A real backend
The old `store.js` had a hardcoded `productsData` object baked into the frontend.
That's now served by the backend instead:

- `GET /api/products` — full catalog, grouped by category
- `GET /api/products/:category` — e.g. `/api/products/cakes`
- `GET /api/products/specials` — seasonal specials feed (what `index.html`'s
  "Seasonal Specials" section was already designed to pull from a data source)
- `POST /api/orders` — validates the cart against real stock, decrements
  inventory, and returns an order confirmation. The checkout form on
  `store.html` now actually submits here instead of doing nothing.
- `GET /healthz` — basic liveness check

`store.js` and `main.js` fetch from these instead of using local hardcoded data.
If the backend is unreachable, `main.js` falls back to its original hardcoded
seasonal specials so the homepage doesn't break.

#### 2. Stock images instead of color blocks
Each of the 36 products previously rendered as a plain color rectangle with
its name overlaid as text. Every product (and the homepage category tiles)
now shows a real stock photo, sourced by flavor/category keyword (e.g.
"Red Velvet Romance" → a red-velvet-cake photo). Images are pinned per
product (`?lock=<id>`) so they stay the same on every page load instead of
shuffling. If a photo fails to load, the card falls back to the brand
gradient underneath it.

#### 3. One consistent brand gradient
The product/cupcake/cookie card backgrounds previously used a different
random two-color gradient per item (derived from a per-product hex `color`
field). They've been switched to the same `135deg, #5e2e4f → #8d4e3b`
gradient already used on the "Build Your Own Cake" button (`.btn-primary`
in `styles.css`), so the whole storefront reads as one palette. The stock
photos sit on top of that gradient with a subtle multiply blend so the
warm plum/caramel tone carries through even over a photo.

#### 4. Prometheus + Grafana
The backend is instrumented with [`prom-client`](https://github.com/siimon/prom-client):

- Default Node.js process metrics (memory, event loop lag, GC)
- `http_requests_total` / `http_request_duration_seconds` — labeled by
  method, route, and status code
- `vaan_orders_total` — orders placed vs. failed
- `vaan_order_value_dollars` — distribution of order totals
- `vaan_products_out_of_stock` — live gauge of sold-out items

All exposed at `GET /metrics`. `docker-compose.yml` runs Prometheus scraping
that endpoint every 10s, and Grafana auto-provisions a Prometheus datasource
plus a ready-made dashboard (traffic, latency, error rate, order throughput,
order value percentiles, out-of-stock count).

## Fixes & Improvements

### Image reliability
Replaced unreliable `loremflickr.com` with `picsum.photos` across all files
for consistent stock photo loading.

### CSS refinements
- Removed `mix-blend-mode: multiply` from `.product-image-photo` that made
  images look too dark with the brand gradient background.
- Updated seasonal specials text to "Handpicked seasonal treats — made fresh,
  available for a limited time."
- Removed "Editable from backend" label from seasonal special cards.

