// Admin session handling — supports both DB-backed (Postgres) and
// in-memory token storage for local dev without a database.

const crypto = require('crypto');
const db = require('../db');

const memoryTokens = new Set();

async function createToken() {
    const token = crypto.randomBytes(24).toString('hex');
    if (db.dbEnabled()) {
        await db.query('INSERT INTO admin_sessions (token) VALUES ($1) ON CONFLICT (token) DO NOTHING', [token]);
    } else {
        memoryTokens.add(token);
    }
    return token;
}

async function isValidToken(token) {
    if (!token) return false;
    if (!db.dbEnabled()) return memoryTokens.has(token);
    const { rows } = await db.query(
        'SELECT 1 FROM admin_sessions WHERE token = $1 AND expires_at > now()',
        [token]
    );
    return rows.length > 0;
}

module.exports = { createToken, isValidToken };

