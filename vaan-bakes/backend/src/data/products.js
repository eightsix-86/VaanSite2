// Product catalog for Vaan Bakes.
//
// Each product now carries an `image` field you can set to any URL.
// Simply replace the picsum.photos URL with your own image URL.
// The `keywords` & `stock` fields are kept for backward compatibility.

// Build a fallback stock-photo URL (used when no custom image is set).
function imageFor(category, id, keywords) {
    return `https://picsum.photos/seed/${id}/640/480`;
}

const RAW_CATALOG = {
    cakes: [
        // ─── To add your own image, just change the `image` URL below ───
        { id: 101, name: 'Chocolate Dream Cake',        price: 25.00, description: 'Rich chocolate layers with ganache',              image: 'https://picsum.photos/seed/101/640/480' },
        { id: 102, name: 'Vanilla Bean Delight',         price: 25.00, description: 'Classic vanilla with buttercream',              image: 'https://picsum.photos/seed/102/640/480' },
        { id: 103, name: 'Red Velvet Romance',           price: 25.00, description: 'Velvety red layers with cream cheese',          image: 'https://picsum.photos/seed/103/640/480' },
        { id: 104, name: 'Strawberry Bliss',             price: 25.00, description: 'Fresh strawberry layers',                      image: 'https://picsum.photos/seed/104/640/480' },
        { id: 105, name: 'Lemon Zest Cake',              price: 25.00, description: 'Tangy lemon with cream frosting',              image: 'https://picsum.photos/seed/105/640/480' },
        { id: 106, name: 'Caramel Coffee Cake',          price: 25.00, description: 'Coffee-infused with caramel drizzle',          image: 'https://picsum.photos/seed/106/640/480' },
        { id: 107, name: 'Black Forest',                 price: 25.00, description: 'Chocolate, cherry, and cream layers',          image: 'https://picsum.photos/seed/107/640/480' },
        { id: 108, name: 'Carrot Walnut Cake',           price: 25.00, description: 'Spiced carrot with cream cheese',             image: 'https://picsum.photos/seed/108/640/480' },
        { id: 109, name: 'Tiramisu Cake',                price: 25.00, description: 'Italian-inspired coffee delight',              image: 'https://picsum.photos/seed/109/640/480' },
        { id: 110, name: 'Blueberry Cheesecake',         price: 25.00, description: 'Creamy cheesecake with blueberries',           image: 'https://picsum.photos/seed/110/640/480' },
        { id: 111, name: 'Coconut Paradise',             price: 25.00, description: 'Tropical coconut layers',                     image: 'https://picsum.photos/seed/111/640/480' },
        { id: 112, name: 'Matcha Green Tea',             price: 25.00, description: 'Delicate matcha flavor',                      image: 'https://picsum.photos/seed/112/640/480' }
    ],
    cupcakes: [
        { id: 201, name: 'Chocolate Cupcake',            price: 9.00,  description: 'Mini chocolate delight',                      image: 'https://picsum.photos/seed/201/640/480' },
        { id: 202, name: 'Vanilla Cupcake',              price: 9.00,  description: 'Classic vanilla swirl',                       image: 'https://picsum.photos/seed/202/640/480' },
        { id: 203, name: 'Red Velvet Cupcake',           price: 9.00,  description: 'Mini red velvet treat',                      image: 'https://picsum.photos/seed/203/640/480' },
        { id: 204, name: 'Strawberry Cupcake',           price: 9.00,  description: 'Fresh strawberry topped',                    image: 'https://picsum.photos/seed/204/640/480' },
        { id: 205, name: 'Lemon Cupcake',                price: 9.00,  description: 'Zesty lemon flavor',                         image: 'https://picsum.photos/seed/205/640/480' },
        { id: 206, name: 'Caramel Cupcake',              price: 9.00,  description: 'Caramel swirl topping',                      image: 'https://picsum.photos/seed/206/640/480' },
        { id: 207, name: 'Mint Chocolate Chip',          price: 9.00,  description: 'Refreshing mint chocolate',                  image: 'https://picsum.photos/seed/207/640/480' },
        { id: 208, name: 'Peanut Butter Cup',            price: 9.00,  description: 'Creamy peanut butter',                       image: 'https://picsum.photos/seed/208/640/480' },
        { id: 209, name: 'Cookies & Cream',              price: 9.00,  description: 'Oreo topped cupcake',                        image: 'https://picsum.photos/seed/209/640/480' },
        { id: 210, name: 'Salted Caramel',               price: 9.00,  description: 'Sweet and salty combo',                      image: 'https://picsum.photos/seed/210/640/480' },
        { id: 211, name: 'Funfetti Cupcake',             price: 9.00,  description: 'Colorful sprinkle delight',                  image: 'https://picsum.photos/seed/211/640/480' },
        { id: 212, name: "S'mores Cupcake",              price: 9.00,  description: 'Campfire classic',                          image: 'https://picsum.photos/seed/212/640/480' }
    ],
    cookies: [
        { id: 301, name: 'Chocolate Chip Cookie',        price: 7.00,  description: 'Classic chocolate chip',                     image: 'https://picsum.photos/seed/301/640/480' },
        { id: 302, name: 'Oatmeal Raisin',               price: 7.00,  description: 'Hearty oatmeal with raisins',                image: 'https://picsum.photos/seed/302/640/480' },
        { id: 303, name: 'Sugar Cookie',                 price: 7.00,  description: 'Sweet sugar classic',                        image: 'https://picsum.photos/seed/303/640/480' },
        { id: 304, name: 'Double Chocolate',             price: 7.00,  description: 'Extra chocolate goodness',                   image: 'https://picsum.photos/seed/304/640/480' },
        { id: 305, name: 'Peanut Butter Cookie',         price: 7.00,  description: 'Creamy peanut butter',                       image: 'https://picsum.photos/seed/305/640/480' },
        { id: 306, name: 'Snickerdoodle',                price: 7.00,  description: 'Cinnamon sugar perfection',                  image: 'https://picsum.photos/seed/306/640/480' },
        { id: 307, name: 'White Chocolate Macadamia',    price: 7.00,  description: 'Premium nut cookie',                         image: 'https://picsum.photos/seed/307/640/480' },
        { id: 308, name: 'Ginger Snap',                  price: 7.00,  description: 'Spicy ginger flavor',                        image: 'https://picsum.photos/seed/308/640/480' },
        { id: 309, name: 'Lemon Cookie',                 price: 7.00,  description: 'Tangy lemon zest',                           image: 'https://picsum.photos/seed/309/640/480' },
        { id: 310, name: 'Red Velvet Cookie',            price: 7.00,  description: 'Velvety red cookie',                         image: 'https://picsum.photos/seed/310/640/480' },
        { id: 311, name: 'M&M Cookie',                   price: 7.00,  description: 'Colorful candy cookie',                      image: 'https://picsum.photos/seed/311/640/480' },
        { id: 312, name: 'Brownie Cookie',               price: 7.00,  description: 'Fudgy brownie texture',                      image: 'https://picsum.photos/seed/312/640/480' }
    ]
};

// Flatten + enrich once at startup: add slug id, category, stock.
const catalog = {};
for (const [category, items] of Object.entries(RAW_CATALOG)) {
    catalog[category] = items.map((item, index) => ({
        ...item,
        id: `${category.slice(0, -1)}-${item.id}`,
        category,
        keywords: item.keywords || '',
        stock: 12 + ((index * 7) % 20)
    }));
}

const seasonalSpecials = [
    {
        id: 'special-1',
        title: 'Monsoon Mango Cake',
        description: 'Soft vanilla layers with mango cream and toasted coconut.',
        price: 'From $42',
        tag: 'Seasonal favorite',
        image: 'https://picsum.photos/seed/9001/640/480'
    },
    {
        id: 'special-2',
        title: 'Pistachio Rose Cupcakes',
        description: 'Light pistachio sponge finished with a rose buttercream swirl.',
        price: 'From $18',
        tag: 'Limited batch',
        image: 'https://picsum.photos/seed/9002/640/480'
    },
    {
        id: 'special-3',
        title: 'Holiday Cookie Box',
        description: 'A giftable cookie mix with warm spices and butter glaze.',
        price: 'From $24',
        tag: 'Gift ready',
        image: 'https://picsum.photos/seed/9003/640/480'
    }
];

module.exports = { catalog, seasonalSpecials };

