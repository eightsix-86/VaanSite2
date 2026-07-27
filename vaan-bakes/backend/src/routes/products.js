const express = require('express');
const { catalog, seasonalSpecials } = require('../data/products');

const router = express.Router();

function allProducts() {
    return Object.values(catalog).flat();
}

// GET /api/products              -> full catalog, grouped by category
// GET /api/products?flat=true    -> flat array of every product
router.get('/', (req, res) => {
    if (req.query.flat === 'true') {
        return res.json(allProducts());
    }
    res.json(catalog);
});

// GET /api/products/specials -> seasonal specials feed
router.get('/specials', (req, res) => {
    res.json(seasonalSpecials);
});

// GET /api/products/:category -> e.g. /api/products/cakes
router.get('/:category', (req, res) => {
    const items = catalog[req.params.category];
    if (!items) {
        return res.status(404).json({ error: `Unknown category "${req.params.category}"` });
    }
    res.json(items);
});

// GET /api/products/:category/:id
router.get('/:category/:id', (req, res) => {
    const items = catalog[req.params.category];
    const product = items && items.find((p) => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

module.exports = { router, allProducts };
