// Prometheus instrumentation for the Vaan Bakes API.
//
// Exposes:
//   - default Node.js process/runtime metrics (memory, event loop, GC)
//   - http_requests_total            counter, labeled by method/route/status
//   - http_request_duration_seconds  histogram, labeled by method/route/status
//   - vaan_orders_total              counter, labeled by status (placed/failed)
//   - vaan_order_value_dollars       histogram of order totals
//   - vaan_products_out_of_stock     gauge, current out-of-stock product count
//   - vaan_product_views_total       counter, labeled by product_id
//   - vaan_cart_adds_total           counter, labeled by product_id
//   - vaan_event_ingestion_total     counter, labeled by event type

const client = require('prom-client');

const register = new client.Registry();
register.setDefaultLabels({ app: 'vaan-bakes-backend' });
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests received',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register]
});

const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    registers: [register]
});

const ordersTotal = new client.Counter({
    name: 'vaan_orders_total',
    help: 'Total number of orders placed, by outcome',
    labelNames: ['status'],
    registers: [register]
});

const orderValue = new client.Histogram({
    name: 'vaan_order_value_dollars',
    help: 'Distribution of successful order totals in dollars',
    buckets: [5, 10, 25, 50, 75, 100, 150, 250],
    registers: [register]
});

const outOfStockGauge = new client.Gauge({
    name: 'vaan_products_out_of_stock',
    help: 'Number of catalog items currently at zero stock',
    registers: [register]
});

// --- Behavioral metrics (used for recommendations + analytics) ---

const productViews = new client.Counter({
    name: 'vaan_product_views_total',
    help: 'Number of product detail views, by product',
    labelNames: ['product_id'],
    registers: [register]
});

const cartAdds = new client.Counter({
    name: 'vaan_cart_adds_total',
    help: 'Number of times a product was added to the cart',
    labelNames: ['product_id'],
    registers: [register]
});

const eventIngestion = new client.Counter({
    name: 'vaan_event_ingestion_total',
    help: 'Total tracking events ingested, by type',
    labelNames: ['type'],
    registers: [register]
});

// Express middleware: times every request and records it under a
// low-cardinality route label (the matched Express path, e.g.
// "/api/products/:category", not the raw URL) so metric series don't
// explode as products are added.
function httpMetricsMiddleware(req, res, next) {
    const stopTimer = httpRequestDuration.startTimer();
    res.on('finish', () => {
        const route = (req.route && req.baseUrl + req.route.path) || req.path || 'unknown';
        const labels = { method: req.method, route, status_code: res.statusCode };
        httpRequestsTotal.inc(labels);
        stopTimer(labels);
    });
    next();
}

module.exports = {
    register,
    httpMetricsMiddleware,
    ordersTotal,
    orderValue,
    outOfStockGauge,
    productViews,
    cartAdds,
    eventIngestion
};

