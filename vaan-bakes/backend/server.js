require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

const { register, httpMetricsMiddleware } = require('./src/metrics');
const { router: productsRouter } = require('./src/routes/products');
const { router: ordersRouter } = require('./src/routes/orders');
const { router: eventsRouter } = require('./src/routes/events');
const { router: builderRouter } = require('./src/routes/builder');
const { router: adminRouter } = require('./src/routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

// Enable CORS for split-hosting (frontend on Netlify/GitHub Pages, API on Render).
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin.split(',').map((o) => o.trim()) }));

app.use(express.json());
app.use(httpMetricsMiddleware);

// --- API ---
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/events', eventsRouter);
app.use('/api/builder-config', builderRouter);
app.use('/api/admin', adminRouter);

app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

// --- Prometheus scrape endpoint ---
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// --- Static frontend (served when running as a monolith) ---
app.use(express.static(FRONTEND_DIR));
app.get(/^(?!\/api|\/metrics|\/healthz).*/, (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Vaan Bakes backend listening on http://localhost:${PORT}`);
    console.log(`Metrics available at http://localhost:${PORT}/metrics`);
    console.log(`Admin panel: ${process.env.ADMIN_PASSWORD ? 'enabled' : 'DISABLED (set ADMIN_PASSWORD env var)'}`);
});

