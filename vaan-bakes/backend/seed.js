// Seed script — loads the static catalog into Supabase PostgreSQL.
//
// Usage:
//   DATABASE_URL=postgresql://... npm run seed
//
// Safe to run multiple times (idempotent): products are upserted by id,
// product_images are recreated, cake builder config is inserted once.

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { catalog, seasonalSpecials } = require('./src/data/products');

async function main() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('❌ DATABASE_URL is not set. Set it first (e.g. DATABASE_URL=postgresql://... npm run seed)');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: url,
        ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false }
    });

    console.log('🔄 Applying schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);

    console.log('🌱 Seeding products + images...');
    for (const [category, items] of Object.entries(catalog)) {
        for (const item of items) {
            await pool.query(
                `INSERT INTO products (id, category, name, description, price, stock, keywords, updated_at)
                 VALUES ($1,$2,$3,$4,$5,$6,$7, now())
                 ON CONFLICT (id) DO UPDATE SET
                   category = EXCLUDED.category,
                   name = EXCLUDED.name,
                   description = EXCLUDED.description,
                   price = EXCLUDED.price,
                   stock = EXCLUDED.stock,
                   keywords = EXCLUDED.keywords,
                   updated_at = now()`,
                [item.id, category, item.name, item.description, item.price, item.stock, item.keywords || '']
            );

            // Images — use the single existing image as primary. Admin panel
            // can add more later.
            const primaryUrl = item.image || `https://picsum.photos/seed/${item.id}/640/480`;
            await pool.query('DELETE FROM product_images WHERE product_id = $1', [item.id]);
            await pool.query(
                `INSERT INTO product_images (product_id, url, position, is_primary)
                 VALUES ($1,$2,0,TRUE)`,
                [item.id, primaryUrl]
            );
        }
    }

    // Seed seasonal specials (homepage feed).
    console.log('🍨 Seeding seasonal specials...');
    for (const [index, special] of seasonalSpecials.entries()) {
        await pool.query(
            `INSERT INTO seasonal_specials (id, title, description, price, tag, image, position)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             ON CONFLICT (id) DO UPDATE SET
               title = EXCLUDED.title,
               description = EXCLUDED.description,
               price = EXCLUDED.price,
               tag = EXCLUDED.tag,
               image = EXCLUDED.image,
               position = EXCLUDED.position`,
            [special.id, special.title, special.description, special.price, special.tag, special.image, index]
        );
    }

    // Insert cake builder default config if not present.
    const DEFAULT_BUILDER_CONFIG = {
        pricing: {
            size: { mini: 32, small: 44, medium: 58, large: 76 },
            layers: { 2: 0, 3: 10, 4: 18 },
            flavor: { 'classic-vanilla': 0, 'double-chocolate': 4, 'red-velvet': 5, 'lemon-zest': 3 },
            filling: { 'vanilla-cream': 0, 'berry-compote': 5, 'salted-caramel': 6, 'chocolate-ganache': 7 },
            frosting: { buttercream: 0, chocolate: 4, strawberry: 4, 'cream-cheese': 5 },
            sideFrosting: { smooth: 0, rosettes: 6, drip: 7, rustic: 3 },
            toppings: { 'fresh-berries': 4, sprinkles: 2, macarons: 7, 'edible-flowers': 5, 'chocolate-shards': 4 }
        },
        labels: {
            size: { mini: 'Mini 6-inch', small: 'Small 8-inch', medium: 'Medium 10-inch', large: 'Large 12-inch' },
            layers: { 2: '2 layers', 3: '3 layers', 4: '4 layers' },
            flavor: { 'classic-vanilla': 'Classic Vanilla', 'double-chocolate': 'Double Chocolate', 'red-velvet': 'Red Velvet', 'lemon-zest': 'Lemon Zest' },
            filling: { 'vanilla-cream': 'Vanilla Cream', 'berry-compote': 'Berry Compote', 'salted-caramel': 'Salted Caramel', 'chocolate-ganache': 'Chocolate Ganache' },
            frosting: { buttercream: 'Vanilla buttercream', chocolate: 'Chocolate silk', strawberry: 'Strawberry cream', 'cream-cheese': 'Cream cheese' },
            sideFrosting: { smooth: 'Smooth finish', rosettes: 'Rosette sides', drip: 'Drip finish', rustic: 'Rustic spatula' },
            toppings: { 'fresh-berries': 'Fresh berries', sprinkles: 'Sprinkles', macarons: 'Macarons', 'edible-flowers': 'Edible flowers', 'chocolate-shards': 'Chocolate shards' }
        },
        basePrice: 32
    };
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM cake_builder_config');
    if (rows[0].count === 0) {
        await pool.query(
            `INSERT INTO cake_builder_config (name, config)
             VALUES ('default', $1)`,
            [JSON.stringify(DEFAULT_BUILDER_CONFIG)]
        );
        console.log('🍰 Cake builder config seeded.');
    }

    console.log(`✅ Done. Seeded ${Object.values(catalog).flat().length} products.`);
    await pool.end();
}

main().catch((err) => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});

