const express = require('express');
const db = require('../../db');

const router = express.Router();

// GET /api/builder-config -> the editable cake-builder configuration
router.get('/', async (req, res) => {
    try {
        const config = await db.getBuilderConfig();
        res.json(config);
    } catch (err) {
        console.error('GET /api/builder-config failed:', err);
        res.status(500).json({ error: 'Failed to load builder config' });
    }
});

module.exports = { router };

