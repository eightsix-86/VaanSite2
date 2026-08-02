const express = require('express');
const db = require('../../db');
const { eventIngestion, productViews, cartAdds } = require('../metrics');

const router = express.Router();

// POST /api/events
// body: { eventType, productId?, category?, data? }
// Session is read from the x-session-id header (set by the frontend).
router.post('/', async (req, res) => {
    const { eventType, productId, category, data } = req.body || {};
    const sessionId = req.get('x-session-id') || null;

    if (!eventType) {
        return res.status(400).json({ error: 'eventType is required' });
    }

    const allowed = ['product_view', 'cart_add', 'checkout_start', 'order_placed', 'builder_use'];
    if (!allowed.includes(eventType)) {
        return res.status(400).json({ error: `eventType must be one of: ${allowed.join(', ')}` });
    }

    try {
        await db.trackEvent({ sessionId, eventType, productId, category, data });

        // Update Prometheus counters for behavioral analytics.
        eventIngestion.inc({ type: eventType });
        if (eventType === 'product_view' && productId) productViews.inc({ product_id: productId });
        if (eventType === 'cart_add' && productId) cartAdds.inc({ product_id: productId });

        res.status(201).json({ ok: true });
    } catch (err) {
        console.error('POST /api/events failed:', err);
        res.status(500).json({ error: 'Failed to record event' });
    }
});

module.exports = { router };

