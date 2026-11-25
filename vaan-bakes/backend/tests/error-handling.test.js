const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
const { after, before, test } = require('node:test');

const backendDir = path.resolve(__dirname, '..');
const port = 4100 + Math.floor(Math.random() * 1000);
const baseUrl = `http://127.0.0.1:${port}`;
let server;

async function waitForServer() {
    for (let attempt = 0; attempt < 50; attempt++) {
        if (server.exitCode !== null) {
            throw new Error(`Backend exited before becoming ready (code ${server.exitCode})`);
        }
        try {
            const response = await fetch(`${baseUrl}/healthz`);
            if (response.ok) return;
        } catch {
            // The listener may not have started yet.
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error('Backend did not become ready in time');
}

before(async () => {
    server = spawn(process.execPath, ['server.js'], {
        cwd: backendDir,
        env: {
            ...process.env,
            DATABASE_URL: '',
            PORT: String(port)
        },
        stdio: 'ignore'
    });
    await waitForServer();
});

after(() => {
    server?.kill();
});

test('malformed request bodies return a JSON client error', async () => {
    const response = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{"customer":'
    });

    assert.equal(response.status, 400);
    assert.match(response.headers.get('content-type') || '', /application\/json/);
    assert.deepEqual(await response.json(), { error: 'Invalid JSON payload' });
});

test('a rejected order does not leave earlier item stock decremented', async () => {
    const initialCatalogResponse = await fetch(`${baseUrl}/api/products?flat=true`);
    const initialCatalog = await initialCatalogResponse.json();
    const product = initialCatalog.find((item) => item.stock > 1);
    assert.ok(product, 'expected an in-stock catalog item');

    const orderResponse = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            customer: { name: 'Test Buyer', email: 'buyer@example.test', address: '1 Test St' },
            items: [
                { productId: product.id, quantity: 1 },
                { productId: 'missing-product', quantity: 1 }
            ]
        })
    });
    assert.equal(orderResponse.status, 404);

    const updatedCatalogResponse = await fetch(`${baseUrl}/api/products?flat=true`);
    const updatedCatalog = await updatedCatalogResponse.json();
    const updatedProduct = updatedCatalog.find((item) => item.id === product.id);
    assert.equal(updatedProduct.stock, product.stock);
});
