const express = require('express');
const db = require('../../db');
const { productViews, cartAdds } = require('../metrics');

const router = express.Router();

// GET /api/products             -> full catalog, grouped by category
// GET /api/products?flat=true   -> flat array of every product
router.get('/', async (req, res) => {
    try {
        const { catalog, seasonalSpecials } = await db.listProducts();
        if (req.query.flat === 'true') {
            return res.json(Object.values(catalog).flat());
        }
        res.json({ ...catalog, seasonalSpecials });
    } catch (err) {
        console.error('GET /api/products failed:', err);
        res.status(500).json({ error: 'Failed to load products' });
    }
});

// GET /api/products/specials -> seasonal specials feed
router.get('/specials', async (req, res) => {
    try {
        res.json(await db.listSeasonalSpecials());
    } catch (err) {
        console.error('GET /api/products/specials failed:', err);
        res.status(500).json({ error: 'Failed to load specials' });
    }
});

// GET /api/products/recommended/:id -> recommendations based on tracking
router.get('/recommended/:id', async (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 4, 8);
        const recs = await db.getRecommendations(req.params.id, limit);
        res.json(recs);
    } catch (err) {
        console.error('GET /api/products/recommended/:id failed:', err);
        res.status(500).json({ error: 'Failed to load recommendations' });
    }
});

// GET /api/products/:category -> e.g. /api/products/cakes
router.get('/:category', async (req, res) => {
    try {
        const { catalog } = await db.listProducts();
        const items = catalog[req.params.category];
        if (!items) {
            return res.status(404).json({ error: `Unknown category "${req.params.category}"` });
        }
        res.json(items);
    } catch (err) {
        console.error(`GET /api/products/${req.params.category} failed:`, err);
        res.status(500).json({ error: 'Failed to load category' });
    }
});

// GET /api/products/:category/:id
router.get('/:category/:id', async (req, res) => {
    try {
        const product = await db.getProduct(req.params.id);
        if (!product || product.category !== req.params.category) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Track the view (async, non-blocking)
        const sessionId = req.get('x-session-id') || null;
        productViews.inc({ product_id: product.id });
        db.trackEvent({
            sessionId,
            eventType: 'product_view',
            productId: product.id,
            category: product.category
        }).catch(() => {});

        res.json(product);
    } catch (err) {
        console.error(`GET /api/products/${req.params.category}/${req.params.id} failed:`, err);
        res.status(500).json({ error: 'Failed to load product' });
    }
});

module.exports = { router };

