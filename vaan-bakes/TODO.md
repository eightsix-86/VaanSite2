# Fix Plan

## Issues Fixed
- ✅ **Backend not running**: Missing `node_modules`. Ran `npm install` and started server on port 4000.
- ✅ **Homepage images not loading**: Replaced unreliable `loremflickr.com` with `picsum.photos` across all files.
- ✅ **Product images in store**: Updated `backend/src/data/products.js` `imageFor()` function to use `picsum.photos`.
- ✅ **Showcase images on homepage**: Updated `frontend/index.html` showcase section images.
- ✅ **CSS fix**: Removed `mix-blend-mode: multiply` from `.product-image-photo` that made images look too dark with the brand gradient background.
- ✅ **Seasonal specials text**: Changed placeholder to "Handpicked seasonal treats — made fresh, available for a limited time."
- ✅ **Removed "Editable from backend"**: Removed that label from seasonal special cards.

## How To Add Your Own Images

To use your own custom images instead of picsum.photos, edit:

### For Product Catalog Images
Open `backend/src/data/products.js` — each product gets its image from the `imageFor()` function. To give a product a specific URL, add an `image` field directly:

```js
cakes: [
  { 
    id: 101, 
    name: 'Chocolate Dream Cake', 
    price: 45.99, 
    description: 'Rich chocolate layers with ganache', 
    keywords: 'chocolate',
    image: 'https://your-server.com/images/chocolate-cake.jpg' // <-- custom image
  },
  // ... rest of products
]
```

Then update the mapping code to use `item.image` if it exists:
```js
catalog[category] = items.map((item, index) => ({
    ...item,
    id: `${category.slice(0, -1)}-${item.id}`,
    category,
    image: item.image || imageFor(category, item.id, item.keywords), // custom or auto
    stock: 12 + ((index * 7) % 20)
}));
```

### For Seasonal Specials
Edit the `seasonalSpecials` array in the same file — each entry has an `image` field you can set to any URL.

### For Homepage Showcase Images
Open `frontend/index.html` and replace the `src` attribute of the showcase `<img>` tags.

