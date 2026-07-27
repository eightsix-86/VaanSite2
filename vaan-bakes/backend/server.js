const path = require('path');
const express = require('express');

const { register, httpMetricsMiddleware } = require('./src/metrics');
const { router: productsRouter } = require('./src/routes/products');
const { router: ordersRouter } = require('./src/routes/orders');

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

app.use(express.json());
app.use(httpMetricsMiddleware);

// --- API ---
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

// --- Prometheus scrape endpoint ---
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// --- Static frontend ---
app.use(express.static(FRONTEND_DIR));
app.get(/^(?!\/api|\/metrics|\/healthz).*/, (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Vaan Bakes backend listening on http://localhost:${PORT}`);
    console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});
