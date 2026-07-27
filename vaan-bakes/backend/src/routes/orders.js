const express = require('express');
const crypto = require('crypto');
const { catalog } = require('../data/products');
const { ordersTotal, orderValue, outOfStockGauge } = require('../metrics');

const router = express.Router();

// In-memory order log. A real deployment would swap this for a database;
// it's enough here to make the metrics and endpoints meaningfully real.
const orders = [];

function findProduct(id) {
    return Object.values(catalog).flat().find((p) => p.id === id);
}

function recalculateOutOfStockGauge() {
    const count = Object.values(catalog).flat().filter((p) => p.stock <= 0).length;
    outOfStockGauge.set(count);
}
recalculateOutOfStockGauge();

// POST /api/orders
// body: { customer: { name, email, phone, address }, items: [{ productId, quantity }] }
router.post('/', (req, res) => {
    const { customer, items } = req.body || {};

    if (!customer || !customer.name || !customer.email || !customer.address) {
        ordersTotal.inc({ status: 'failed' });
        return res.status(400).json({ error: 'customer.name, customer.email, and customer.address are required' });
    }
    if (!Array.isArray(items) || items.length === 0) {
        ordersTotal.inc({ status: 'failed' });
        return res.status(400).json({ error: 'items must be a non-empty array' });
    }

    const lineItems = [];
    for (const { productId, quantity } of items) {
        const product = findProduct(productId);
        const qty = Number(quantity) || 0;

        if (!product) {
            ordersTotal.inc({ status: 'failed' });
            return res.status(404).json({ error: `Unknown product "${productId}"` });
        }
        if (qty < 1) {
            ordersTotal.inc({ status: 'failed' });
            return res.status(400).json({ error: `Invalid quantity for "${productId}"` });
        }
        if (product.stock < qty) {
            ordersTotal.inc({ status: 'failed' });
            return res.status(409).json({ error: `Not enough stock for "${product.name}" (have ${product.stock}, wanted ${qty})` });
        }
        lineItems.push({ product, quantity: qty });
    }

    // Everything validated — commit the stock decrement and record the order.
    let total = 0;
    for (const { product, quantity } of lineItems) {
        product.stock -= quantity;
        total += product.price * quantity;
    }
    recalculateOutOfStockGauge();

    const order = {
        id: crypto.randomUUID(),
        customer,
        items: lineItems.map(({ product, quantity }) => ({
            productId: product.id,
            name: product.name,
            unitPrice: product.price,
            quantity
        })),
        total: Number(total.toFixed(2)),
        status: 'placed',
        createdAt: new Date().toISOString()
    };
    orders.push(order);

    ordersTotal.inc({ status: 'placed' });
    orderValue.observe(order.total);

    res.status(201).json(order);
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
    const order = orders.find((o) => o.id === req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
});

module.exports = { router };
