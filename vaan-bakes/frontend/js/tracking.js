// ============================================================
// Vaan Bakes — Behavioral tracking
// ============================================================
// Fires lightweight POSTs to /api/events (via the configured
// API base URL) so the backend can:
//   1. Feed the recommendation engine (views, cart adds, orders)
//   2. Power Prometheus behavioral metrics
// Fails silently — tracking never blocks the shopping experience.
// ============================================================

(function () {
    // Stable per-browser session id.
    let sessionId = localStorage.getItem('vaan_session_id');
    if (!sessionId) {
        sessionId = 's-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
        localStorage.setItem('vaan_session_id', sessionId);
    }

    function sendEvent(eventType, productId, category, data) {
        try {
            fetch(window.apiUrl('/api/events'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId },
                body: JSON.stringify({ eventType, productId, category, data }),
                keepalive: true
            }).catch(() => {});
        } catch (err) {
            // ignore
        }
    }

    window.__track = {
        viewProduct(product) {
            if (!product) return;
            sendEvent('product_view', product.id, product.category);
        },
        addToCart(product) {
            if (!product) return;
            sendEvent('cart_add', product.id, product.category);
        },
        checkoutStart() {
            sendEvent('checkout_start');
        },
        orderPlaced(items) {
            sendEvent('order_placed', null, null, { items });
        },
        builderUse(data) {
            sendEvent('builder_use', null, null, data || {});
        }
    };
})();

