const express = require('express');
const db = require('../../db');
const { createToken, isValidToken } = require('../admin-sessions');

const router = express.Router();

// ---------------------------------------------------------------------------
// Auth — single admin password via ADMIN_PASSWORD env var.
// Login issues a bearer token stored in admin_sessions (DB) or in-memory.
// ---------------------------------------------------------------------------

async function requireAdmin(req, res, next) {
    const auth = req.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    const valid = await isValidToken(token);
    if (!valid) return res.status(401).json({ error: 'Unauthorized' });
    next();
}

// POST /api/admin/login  body: { password }
router.post('/login', async (req, res) => {
    const { password } = req.body || {};
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
        return res.status(500).json({ error: 'ADMIN_PASSWORD is not configured on the server' });
    }
    if (!password || password !== expected) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    const token = await createToken();
    res.json({ token });
});

// ---------------------------------------------------------------------------
// Products CRUD (admin only)
// ---------------------------------------------------------------------------

// GET /api/admin/products — list all products with images
router.get('/products', requireAdmin, async (req, res) => {
    try {
        const { catalog } = await db.listProducts();
        res.json(Object.values(catalog).flat());
    } catch (err) {
        console.error('GET /api/admin/products failed:', err);
        res.status(500).json({ error: 'Failed to load products' });
    }
});

// POST /api/admin/products — create product
// body: { id?, category, name, description, price, stock, keywords, images: [urls] }
router.post('/products', requireAdmin, async (req, res) => {
    try {
        const body = req.body || {};
        if (!body.category || !body.name) {
            return res.status(400).json({ error: 'category and name are required' });
        }
        const categorySlug = body.category.slice(0, -1); // cakes -> cake
        const { catalog } = await db.listProducts();
        const existing = catalog[body.category] || [];
        const nextNum = Math.max(0, ...existing.map((p) => Number(p.id.split('-')[1]) || 0)) + 1;
        const id = body.id || `${categorySlug}-${nextNum}`;

        const product = await db.upsertProduct({
            id,
            category: body.category,
            name: body.name,
            description: body.description || '',
            price: Number(body.price) || 0,
            stock: Number(body.stock) || 0,
            keywords: body.keywords || '',
            images: Array.isArray(body.images) ? body.images.filter(Boolean) : []
        });
        res.status(201).json(product);
    } catch (err) {
        console.error('POST /api/admin/products failed:', err);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// PUT /api/admin/products/:id — update product
router.put('/products/:id', requireAdmin, async (req, res) => {
    try {
        const body = req.body || {};
        const existing = await db.getProduct(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Product not found' });

        const product = await db.upsertProduct({
            id: req.params.id,
            category: body.category || existing.category,
            name: body.name || existing.name,
            description: body.description !== undefined ? body.description : existing.description,
            price: body.price !== undefined ? Number(body.price) : existing.price,
            stock: body.stock !== undefined ? Number(body.stock) : existing.stock,
            keywords: body.keywords !== undefined ? body.keywords : existing.keywords,
            images: Array.isArray(body.images) ? body.images.filter(Boolean) : existing.images
        });
        res.json(product);
    } catch (err) {
        console.error(`PUT /api/admin/products/${req.params.id} failed:`, err);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', requireAdmin, async (req, res) => {
    try {
        await db.deleteProduct(req.params.id);
        res.json({ ok: true });
    } catch (err) {
        console.error(`DELETE /api/admin/products/${req.params.id} failed:`, err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// ---------------------------------------------------------------------------
// Orders (admin only) — list all orders
// ---------------------------------------------------------------------------

router.get('/orders', requireAdmin, async (req, res) => {
    try {
        const orders = await db.listOrders(Number(req.query.limit) || 50);
        res.json(orders);
    } catch (err) {
        console.error('GET /api/admin/orders failed:', err);
        res.status(500).json({ error: 'Failed to load orders' });
    }
});

// ---------------------------------------------------------------------------
// Cake builder config (admin only)
// ---------------------------------------------------------------------------

router.get('/builder-config', requireAdmin, async (req, res) => {
    try {
        res.json(await db.getBuilderConfig());
    } catch (err) {
        console.error('GET /api/admin/builder-config failed:', err);
        res.status(500).json({ error: 'Failed to load builder config' });
    }
});

router.put('/builder-config', requireAdmin, async (req, res) => {
    try {
        const config = req.body || {};
        await db.saveBuilderConfig(config);
        res.json(config);
    } catch (err) {
        console.error('PUT /api/admin/builder-config failed:', err);
        res.status(500).json({ error: 'Failed to save builder config' });
    }
});

module.exports = { router };

