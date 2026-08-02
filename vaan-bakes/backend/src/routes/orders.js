const express = require('express');
const db = require('../../db');
const { ordersTotal, orderValue, outOfStockGauge, eventIngestion } = require('../metrics');

const router = express.Router();

// POST /api/orders
// body: { customer: { name, email, phone, address }, items: [{ productId, quantity }] }
router.post('/', async (req, res) => {
    const { customer, items } = req.body || {};

    if (!customer || !customer.name || !customer.email || !customer.address) {
        ordersTotal.inc({ status: 'failed' });
        return res.status(400).json({ error: 'customer.name, customer.email, and customer.address are required' });
    }
    if (!Array.isArray(items) || items.length === 0) {
        ordersTotal.inc({ status: 'failed' });
        return res.status(400).json({ error: 'items must be a non-empty array' });
    }

    try {
        const order = await db.createOrder({ customer, items });

        ordersTotal.inc({ status: 'placed' });
        orderValue.observe(order.total);

        // Track order event for recommendations
        const sessionId = req.get('x-session-id') || null;
        eventIngestion.inc({ type: 'order_placed' });
        db.trackEvent({
            sessionId,
            eventType: 'order_placed',
            data: { items: order.items.map((i) => i.productId) }
        }).catch(() => {});

        // Refresh out-of-stock gauge
        const { catalog } = await db.listProducts().catch(() => ({ catalog: {} }));
        const all = Object.values(catalog).flat();
        outOfStockGauge.set(all.filter((p) => p.stock <= 0).length);

        res.status(201).json(order);
    } catch (err) {
        ordersTotal.inc({ status: 'failed' });
        const status = err.status || 500;
        res.status(status).json({ error: err.message || 'Failed to place order' });
    }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
    try {
        const order = await db.getOrder(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        console.error(`GET /api/orders/${req.params.id} failed:`, err);
        res.status(500).json({ error: 'Failed to load order' });
    }
});

module.exports = { router };

