-- ============================================================
-- Vaan Bakes PostgreSQL Schema (Supabase-compatible)
-- This is the canonical schema, kept in sync with
-- backend/schema.sql (used by `npm run seed`).
--
-- Applied automatically by the Supabase GitHub integration on
-- push. Idempotent — safe to run repeatedly.
-- ============================================================

-- ------------------------------------------------------------------
-- PRODUCTS
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id          TEXT PRIMARY KEY,          -- e.g. 'cake-101'
    category    TEXT NOT NULL,             -- cakes | cupcakes | cookies
    name        TEXT NOT NULL,
    description TEXT,
    price       NUMERIC(10,2) NOT NULL DEFAULT 0,
    stock       INTEGER NOT NULL DEFAULT 0,
    keywords    TEXT DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Multiple images per product (primary flag controls the card image).
CREATE TABLE IF NOT EXISTS product_images (
    id         SERIAL PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url        TEXT NOT NULL,
    position   INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

-- ------------------------------------------------------------------
-- ORDERS
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer    JSONB NOT NULL,           -- { name, email, phone, address }
    total       NUMERIC(10,2) NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'placed',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
    id         SERIAL PRIMARY KEY,
    order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id),
    name       TEXT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    quantity   INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ------------------------------------------------------------------
-- TRACKING EVENTS (views, cart adds, checkouts, orders)
-- Used by the recommendation engine + Prometheus metrics.
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id          BIGSERIAL PRIMARY KEY,
    session_id  TEXT,
    event_type  TEXT NOT NULL,            -- product_view | cart_add | checkout_start | order_placed
    product_id  TEXT REFERENCES products(id) ON DELETE SET NULL,
    category    TEXT,
    data        JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_product   ON events(product_id);
CREATE INDEX IF NOT EXISTS idx_events_type      ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created   ON events(created_at);

-- ------------------------------------------------------------------
-- SEASONAL SPECIALS (shown on the homepage seasonal feed)
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seasonal_specials (
    id          TEXT PRIMARY KEY,          -- e.g. 'special-1'
    title       TEXT NOT NULL,
    description TEXT,
    price       TEXT,                      -- display string, e.g. 'From $42'
    tag         TEXT,
    image       TEXT,
    position    INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------
-- CAKE BUILDER CONFIG (editable from the admin panel — no hardcoding)
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cake_builder_config (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL DEFAULT 'default',
    config     JSONB NOT NULL,            -- { pricing, labels, options, basePrice }
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------
-- ADMIN SESSIONS (simple token-based auth)
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_sessions (
    token      TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '7 days'
);

