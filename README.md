# Vaan Bakes

A bakery storefront with a product catalog, custom cake builder, ordering flow,
and an admin area. The project includes a browser-based frontend and a Node.js
backend.

## What’s here

- Browse cakes, cupcakes, and cookies.
- Build and price a custom cake.
- Add products to a cart and submit an order.
- Manage selected store data through an admin page.

## Project layout

```text
supabase/                 Database configuration
vaan-bakes/
  frontend/               Storefront pages and browser scripts
  backend/                Express service and API routes
  monitoring/             Monitoring configuration
docker-compose.yml        Local service definitions
```

This is a high-level map, not a complete file listing.

## Run locally

Use Node.js 20 or later:

```bash
cd vaan-bakes/backend
npm install
npm start
```

The service normally listens on port `4000` and also serves the frontend.
Database setup and environment configuration are not covered here.

## More information

This README is an overview only. It does not include the full API reference,
all configuration options, test expectations, or deployment steps. Consult the
project files for details that are not described here.
