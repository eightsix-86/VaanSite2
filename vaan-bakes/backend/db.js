// Database layer for Vaan Bakes.
//
// Uses a Supabase-hosted PostgreSQL instance when DATABASE_URL is set.
// If DATABASE_URL is missing (local dev without a DB), every function
// transparently falls back to the in-memory catalog/orders so the site
// still works — the exact same behavior as v1.

const path = require('path');
const { Pool } = require('pg');

// In-memory fallback data (mirrors the original hardcoded catalog).
const { catalog: memoryCatalog, seasonalSpecials } = require('./src/data/products');

const DATABASE_URL = process.env.DATABASE_URL;

let pool = null;
if (DATABASE_URL) {
    pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false }
    });
}

const dbEnabled = () => Boolean(pool);

// ---------------------------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------------------------

async function listProducts() {
    if (!dbEnabled()) {
        return {
            catalog: memoryCatalog,
            seasonalSpecials
        };
    }

    const { rows: products } = await pool.query('SELECT * FROM products ORDER BY category, created_at');
    const { rows: images } = await pool.query(
        'SELECT * FROM product_images ORDER BY product_id, position ASC'
    );

    // Attach images[] to each product.
    const catalog = { cakes: [], cupcakes: [], cookies: [] };
    for (const p of products) {
        const imgs = images
            .filter((i) => i.product_id === p.id)
            .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.position - b.position);

        catalog[p.category] = catalog[p.category] || [];
        catalog[p.category].push({
            id: p.id,
            name: p.name,
            description: p.description,
            price: Number(p.price),
            stock: p.stock,
            keywords: p.keywords || '',
            category: p.category,
            image: imgs.find((i) => i.is_primary)?.url || imgs[0]?.url || '',
            images: imgs.map((i) => i.url)
        });
    }

    return { catalog, seasonalSpecials };
}

async function listSeasonalSpecials() {
    if (!dbEnabled()) return seasonalSpecials;
    const { rows } = await pool.query('SELECT * FROM seasonal_specials ORDER BY position ASC');
    return rows;
}

async function getProduct(id) {
    if (!dbEnabled()) {
        return Object.values(memoryCatalog).flat().find((p) => p.id === id) || null;
    }
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    const p = rows[0];
    const { rows: images } = await pool.query(
        'SELECT * FROM product_images WHERE product_id = $1 ORDER BY position ASC',
        [id]
    );
    return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        stock: p.stock,
        keywords: p.keywords || '',
        category: p.category,
        image: images.find((i) => i.is_primary)?.url || images[0]?.url || '',
        images: images.map((i) => i.url)
    };
}

// Upsert a product (create or update). images is an array of URLs; the first
// entry is marked primary unless `primaryIndex` says otherwise.
async function upsertProduct(product) {
    if (!dbEnabled()) return product;

    const { id, category, name, description, price, stock, keywords, images = [] } = product;

    await pool.query(
        `INSERT INTO products (id, category, name, description, price, stock, keywords, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7, now())
         ON CONFLICT (id) DO UPDATE SET
           category = EXCLUDED.category,
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           price = EXCLUDED.price,
           stock = EXCLUDED.stock,
           keywords = EXCLUDED.keywords,
           updated_at = now()`,
        [id, category, name, description, price, stock, keywords]
    );

    if (images && images.length) {
        await pool.query('DELETE FROM product_images WHERE product_id = $1', [id]);
        const primaryUrl = images[0];
        for (let i = 0; i < images.length; i++) {
            await pool.query(
                `INSERT INTO product_images (product_id, url, position, is_primary)
                 VALUES ($1,$2,$3,$4)`,
                [id, images[i], i, images[i] === primaryUrl]
            );
        }
    }

    return getProduct(id);
}

async function deleteProduct(id) {
    if (!dbEnabled()) return true;
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return true;
}

// ---------------------------------------------------------------------------
// ORDERS
// ---------------------------------------------------------------------------

// Place an order atomically: validate stock, decrement it, insert order + items.
async function createOrder({ customer, items }) {
    if (!dbEnabled()) {
        return createOrderMemory({ customer, items });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        let total = 0;
        const lineItems = [];

        for (const { productId, quantity } of items) {
            const { rows } = await client.query('SELECT * FROM products WHERE id = $1 FOR UPDATE', [productId]);
            const product = rows[0];
            if (!product) throw { status: 404, message: `Unknown product "${productId}"` };
            if (quantity < 1) throw { status: 400, message: `Invalid quantity for "${productId}"` };
            if (product.stock < quantity) {
                throw { status: 409, message: `Not enough stock for "${product.name}" (have ${product.stock}, wanted ${quantity})` };
            }
            await client.query('UPDATE products SET stock = stock - $1, updated_at = now() WHERE id = $2', [quantity, productId]);
            total += Number(product.price) * quantity;
            lineItems.push({ productId, name: product.name, unitPrice: Number(product.price), quantity });
        }

        const { rows: [orderRow] } = await client.query(
            `INSERT INTO orders (customer, total, status)
             VALUES ($1, $2, 'placed')
             RETURNING id, total, status, created_at`,
            [JSON.stringify(customer), Number(total.toFixed(2))]
        );

        for (const li of lineItems) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, name, unit_price, quantity)
                 VALUES ($1,$2,$3,$4,$5)`,
                [orderRow.id, li.productId, li.name, li.unitPrice, li.quantity]
            );
        }

        await client.query('COMMIT');

        return {
            id: orderRow.id,
            customer,
            items: lineItems,
            total: Number(orderRow.total),
            status: orderRow.status,
            createdAt: orderRow.created_at
        };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

function createOrderMemory({ customer, items }) {
    const catalog = memoryCatalog;

    // Clone current stock from the in-memory catalog.
    const allProducts = Object.values(catalog).flat();
    const lineItems = [];
    let total = 0;

    for (const { productId, quantity } of items) {
        const product = allProducts.find((p) => p.id === productId);
        if (!product) {
            const err = new Error(`Unknown product "${productId}"`);
            err.status = 404;
            throw err;
        }
        if (quantity < 1) {
            const err = new Error(`Invalid quantity for "${productId}"`);
            err.status = 400;
            throw err;
        }
        if (product.stock < quantity) {
            const err = new Error(`Not enough stock for "${product.name}" (have ${product.stock}, wanted ${quantity})`);
            err.status = 409;
            throw err;
        }
        product.stock -= quantity;
        total += product.price * quantity;
        lineItems.push({ productId, name: product.name, unitPrice: product.price, quantity });
    }

    const order = {
        id: require('crypto').randomUUID(),
        customer,
        items: lineItems,
        total: Number(total.toFixed(2)),
        status: 'placed',
        createdAt: new Date().toISOString()
    };
    return order;
}

async function getOrder(id) {
    if (!dbEnabled()) {
        return null;
    }
    const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    const order = rows[0];
    const { rows: items } = await pool.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [id]
    );
    return {
        id: order.id,
        customer: order.customer,
        total: Number(order.total),
        status: order.status,
        createdAt: order.created_at,
        items: items.map((i) => ({
            productId: i.product_id,
            name: i.name,
            unitPrice: Number(i.unit_price),
            quantity: i.quantity
        }))
    };
}

async function listOrders(limit = 50) {
    if (!dbEnabled()) return [];
    const { rows } = await pool.query(
        `SELECT o.id, o.customer, o.total, o.status, o.created_at,
                COALESCE(json_agg(json_build_object(
                    'productId', oi.product_id,
                    'name', oi.name,
                    'unitPrice', oi.unit_price,
                    'quantity', oi.quantity
                ) ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
         FROM orders o
         LEFT JOIN order_items oi ON oi.order_id = o.id
         GROUP BY o.id
         ORDER BY o.created_at DESC
         LIMIT $1`, [limit]);
    return rows.map((r) => ({
        id: r.id,
        customer: r.customer,
        total: Number(r.total),
        status: r.status,
        createdAt: r.created_at,
        items: r.items
    }));
}

// ---------------------------------------------------------------------------
// EVENTS (tracking)
// ---------------------------------------------------------------------------

async function trackEvent({ sessionId, eventType, productId, category, data }) {
    if (!dbEnabled()) return;
    await pool.query(
        `INSERT INTO events (session_id, event_type, product_id, category, data)
         VALUES ($1,$2,$3,$4,$5)`,
        [sessionId || null, eventType, productId || null, category || null, JSON.stringify(data || {})]
    );
}

// ---------------------------------------------------------------------------
// CAKE BUILDER CONFIG
// ---------------------------------------------------------------------------

const DEFAULT_BUILDER_CONFIG = {
    pricing: {
        size: { mini: 32, small: 44, medium: 58, large: 76 },
        layers: { 2: 0, 3: 10, 4: 18 },
        flavor: { 'classic-vanilla': 0, 'double-chocolate': 4, 'red-velvet': 5, 'lemon-zest': 3 },
        filling: { 'vanilla-cream': 0, 'berry-compote': 5, 'salted-caramel': 6, 'chocolate-ganache': 7 },
        frosting: { buttercream: 0, chocolate: 4, strawberry: 4, 'cream-cheese': 5 },
        sideFrosting: { smooth: 0, rosettes: 6, drip: 7, rustic: 3 },
        toppings: { 'fresh-berries': 4, sprinkles: 2, macarons: 7, 'edible-flowers': 5, 'chocolate-shards': 4 }
    },
    labels: {
        size: { mini: 'Mini 6-inch', small: 'Small 8-inch', medium: 'Medium 10-inch', large: 'Large 12-inch' },
        layers: { 2: '2 layers', 3: '3 layers', 4: '4 layers' },
        flavor: { 'classic-vanilla': 'Classic Vanilla', 'double-chocolate': 'Double Chocolate', 'red-velvet': 'Red Velvet', 'lemon-zest': 'Lemon Zest' },
        filling: { 'vanilla-cream': 'Vanilla Cream', 'berry-compote': 'Berry Compote', 'salted-caramel': 'Salted Caramel', 'chocolate-ganache': 'Chocolate Ganache' },
        frosting: { buttercream: 'Vanilla buttercream', chocolate: 'Chocolate silk', strawberry: 'Strawberry cream', 'cream-cheese': 'Cream cheese' },
        sideFrosting: { smooth: 'Smooth finish', rosettes: 'Rosette sides', drip: 'Drip finish', rustic: 'Rustic spatula' },
        toppings: { 'fresh-berries': 'Fresh berries', sprinkles: 'Sprinkles', macarons: 'Macarons', 'edible-flowers': 'Edible flowers', 'chocolate-shards': 'Chocolate shards' }
    },
    basePrice: 32
};

async function getBuilderConfig() {
    if (!dbEnabled()) return DEFAULT_BUILDER_CONFIG;
    const { rows } = await pool.query('SELECT config FROM cake_builder_config WHERE name = $1 ORDER BY id DESC LIMIT 1', ['default']);
    if (rows.length === 0) return DEFAULT_BUILDER_CONFIG;
    return { ...DEFAULT_BUILDER_CONFIG, ...rows[0].config };
}

async function saveBuilderConfig(config) {
    if (!dbEnabled()) return config;
    await pool.query(
        `INSERT INTO cake_builder_config (name, config, updated_at)
         VALUES ('default', $1, now())
         ON CONFLICT (id) DO NOTHING`,
        [JSON.stringify(config)]
    );
    return config;
}

// ---------------------------------------------------------------------------
// RECOMMENDATIONS — based on view/cart/order frequency
// ---------------------------------------------------------------------------

async function getRecommendations(productId, limit = 4) {
    if (!dbEnabled()) {
        // Fall back to same-category products.
        const p = Object.values(memoryCatalog).flat().find((x) => x.id === productId);
        if (!p) return [];
        return Object.values(memoryCatalog)
            .flat()
            .filter((x) => x.category === p.category && x.id !== productId)
            .slice(0, limit);
    }

    // Rank products by how often they were viewed/carted/ordered *together*
    // with the given product (same session or same order). If none, fall back
    // to category neighbors.
    const { rows } = await pool.query(
        `WITH target AS (
             SELECT product_id FROM events WHERE product_id = $1
         ),
         paired AS (
             SELECT e2.product_id, COUNT(*) AS score
             FROM events e1
             JOIN events e2
               ON e1.session_id = e2.session_id
              AND e1.product_id <> e2.product_id
             WHERE e1.product_id = $1
               AND e2.product_id IS NOT NULL
             GROUP BY e2.product_id
             ORDER BY score DESC
             LIMIT $2
         )
         SELECT p.*,
                (SELECT url FROM product_images i
                  WHERE i.product_id = p.id
                  ORDER BY i.is_primary DESC, i.position ASC LIMIT 1) AS image
         FROM paired pr
         JOIN products p ON p.id = pr.product_id
         ORDER BY pr.score DESC
         LIMIT $2`,
        [productId, limit]
    );

    if (rows.length === 0) {
        const target = await getProduct(productId);
        if (!target) return [];
        const { rows: catRows } = await pool.query(
            `SELECT p.*,
                    (SELECT url FROM product_images i
                      WHERE i.product_id = p.id
                      ORDER BY i.is_primary DESC, i.position ASC LIMIT 1) AS image
             FROM products p
             WHERE p.category = $1 AND p.id <> $2
             ORDER BY p.created_at DESC
             LIMIT $3`,
            [target.category, productId, limit]
        );
        return catRows.map((p) => ({ ...p, price: Number(p.price), image: p.image || '' }));
    }

    return rows.map((p) => ({ ...p, price: Number(p.price), image: p.image || '' }));
}

module.exports = {
    pool,
    query: (text, params) => pool.query(text, params),
    dbEnabled,
    listProducts,
    listSeasonalSpecials,
    getProduct,
    upsertProduct,
    deleteProduct,
    createOrder,
    getOrder,
    listOrders,
    trackEvent,
    getBuilderConfig,
    saveBuilderConfig,
    getRecommendations
};

