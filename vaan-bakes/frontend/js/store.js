console.log('🔍 Store.js is loading...');

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ===================================
// PRODUCTS DATA - LOADED FROM THE BACKEND CATALOG API
// ===================================
// Populated by loadProducts() below via GET /api/products. Kept as a
// fallback-free variable (not a hardcoded catalog) so the store always
// reflects what the backend actually has in stock.
let productsData = { cakes: [], cupcakes: [], cookies: [] };

// The same 135deg plum-to-caramel gradient used on the "Build Your Own
// Cake" button (see .btn-primary in styles.css), reused here so every
// product tile — and the button — share one consistent brand gradient.
const BRAND_GRADIENT = 'linear-gradient(135deg, #5e2e4f 0%, #8d4e3b 100%)';

async function fetchProductsData() {
    const response = await fetch('/api/products');
    if (!response.ok) {
        throw new Error(`Failed to load products: ${response.status}`);
    }
    return response.json();
}

// ===================================
// CART FUNCTIONALITY
// ===================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count on page load
updateCartCount();

// View Cart Button
const viewCartBtn = document.getElementById('view-cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');

if (viewCartBtn) {
    viewCartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Cart button clicked'); // Debug
        openCart();
    });
}

if (closeCart) {
    closeCart.addEventListener('click', function() {
        cartModal.classList.remove('active');
    });
}

// Close modal when clicking outside
if (cartModal) {
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function openCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    if (!cartModal || !cartItemsContainer || !cartTotalPrice) {
        console.error('Cart elements not found');
        return;
    }
    
    // Clear previous items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">Your cart is empty</p>';
        cartTotalPrice.textContent = '$0.00';
    } else {
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                </div>
                <button class="remove-item-btn" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
        
        // Add remove functionality
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                openCart(); // Refresh cart display
            });
        });
    }
    
    cartModal.classList.add('active');
}

// Add to Cart functionality
function addToCart(productId, name, price, image) {
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            productId: productId,
            name: name,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show feedback
    alert(`${name} added to cart!`);
}

// Make addToCart globally accessible
window.addToCart = addToCart;

// ===================================
// ADD CUSTOM CAKE BUILD TO CART
// ===================================
window.addCustomCakeToCart = function(buildDetails, totalPrice) {
    const productId = 'custom-cake-' + Date.now();
    const name = `Custom Cake (${buildDetails.size}, ${buildDetails.layers}, ${buildDetails.flavor})`;
    const note = buildDetails.note ? ` — Note: ${buildDetails.note}` : '';
    
    cart.push({
        productId: productId,
        name: name,
        price: parseFloat(totalPrice),
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%235e2e4f"/%3E%3Ctext x="100" y="110" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="white"%3ECUSTOM%3C/text%3E%3Ctext x="100" y="135" text-anchor="middle" font-family="Arial" font-size="14" fill="%23d7b38d"%3ECAKE%3C/text%3E%3C/svg%3E',
        quantity: 1,
        isCustomCake: true,
        details: buildDetails
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    alert(`Custom cake added to cart! ($${totalPrice.toFixed(2)})${note}`);
};

// ===================================
// LOAD PRODUCTS (from the backend catalog API)
// ===================================
async function loadProducts() {
    console.log('📦 Loading products from /api/products...');

    try {
        productsData = await fetchProductsData();
    } catch (err) {
        console.error('⚠️ Could not reach the backend catalog:', err);
        const anyGrid = document.getElementById('cakes-grid') || document.getElementById('cupcakes-grid') || document.getElementById('cookies-grid');
        if (anyGrid) {
            anyGrid.closest('.product-category').insertAdjacentHTML('beforebegin',
                '<p class="builder-lead" style="text-align:center;">We couldn\'t load the store catalog right now. Please refresh the page.</p>');
        }
        return;
    }

    const sections = [
        ['cakes', 'cakes-grid'],
        ['cupcakes', 'cupcakes-grid'],
        ['cookies', 'cookies-grid']
    ];

    sections.forEach(([category, gridId]) => {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        const items = productsData[category] || [];
        items.forEach(product => grid.appendChild(createProductCard(product)));
        console.log(`✅ Loaded ${items.length} ${category}`);
    });
}

// ===================================
// CREATE PRODUCT CARD - STOCK PHOTO OVER THE BRAND GRADIENT
// ===================================
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    // FORCE VISIBILITY WITH INLINE STYLES
    card.style.cssText = 'opacity: 1 !important; transform: translateY(0) !important;';

    const outOfStock = (product.stock ?? 1) <= 0;

    card.innerHTML = `
        <div class="product-image" style="background: ${BRAND_GRADIENT};">
            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
                class="product-image-photo"
                onerror="this.style.display='none';"
            >
            ${outOfStock ? '<span class="product-stock-badge">Sold out</span>' : ''}
        </div>
        <div class="product-info">
            <h4 class="product-name">${product.name}</h4>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-id="${product.id}" ${outOfStock ? 'disabled' : ''}>
                ${outOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
        </div>
    `;

    // Add to cart event
    const addBtn = card.querySelector('.add-to-cart-btn');
    if (!outOfStock) {
        addBtn.addEventListener('click', () => addToCart(product.id, product.name, product.price, product.image));
    }

    return card;
}

// ===================================
// STORE SEARCH / FILTERING
// ===================================
function filterStoreCatalog(query) {
    const normalizedQuery = (query || '').trim().toLowerCase();
    const sections = document.querySelectorAll('.product-category');
    let firstVisibleSection = null;

    sections.forEach((section) => {
        const cards = section.querySelectorAll('.product-card');
        let visibleCount = 0;

        cards.forEach((card) => {
            const text = card.textContent.toLowerCase();
            const matches = !normalizedQuery || text.includes(normalizedQuery);
            card.style.display = matches ? '' : 'none';

            if (matches) {
                visibleCount += 1;
            }
        });

        section.style.display = !normalizedQuery || visibleCount > 0 ? '' : 'none';

        if (!firstVisibleSection && section.style.display !== 'none') {
            firstVisibleSection = section;
        }
    });

    if (firstVisibleSection && normalizedQuery) {
        firstVisibleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

window.__filterStoreCatalog = filterStoreCatalog;

// ===================================
// CHECKOUT - submits the cart to POST /api/orders
// ===================================
function openCheckout() {
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    if (!checkoutModal || !checkoutItems || !checkoutTotal) return;

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    let total = 0;
    checkoutItems.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `<p>${item.name} x ${item.quantity} — $${(item.price * item.quantity).toFixed(2)}</p>`;
    }).join('');
    checkoutTotal.textContent = `$${total.toFixed(2)}`;

    document.getElementById('cart-modal')?.classList.remove('active');
    checkoutModal.classList.add('active');
}

document.getElementById('checkout-btn')?.addEventListener('click', openCheckout);
document.getElementById('close-checkout')?.addEventListener('click', () => {
    document.getElementById('checkout-modal')?.classList.remove('active');
});

document.getElementById('checkout-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        customer: {
            name: document.getElementById('customer-name').value.trim(),
            email: document.getElementById('customer-email').value.trim(),
            phone: document.getElementById('customer-phone').value.trim(),
            address: document.getElementById('customer-address').value.trim()
        },
        items: cart.map(item => ({ productId: item.productId, quantity: item.quantity }))
    };

    const submitBtn = e.target.querySelector('.submit-order-btn');
    if (submitBtn) submitBtn.disabled = true;

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Order failed');
        }

        alert(`Thanks, ${payload.customer.name}! Order placed (#${data.id.slice(0, 8)}).`);
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        document.getElementById('checkout-modal')?.classList.remove('active');
        e.target.reset();
    } catch (err) {
        alert(`Couldn't place order: ${err.message}`);
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
});

// ===================================
// INITIALIZE - SINGLE DOMContentLoaded
// ===================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOM Content Loaded - Initializing store...');

    // Load products first (async: comes from the backend now)
    await loadProducts();
    updateCartCount();

    console.log('✅ Products loaded successfully!');

    // Make cards visible with stagger effect
    setTimeout(() => {
        const cards = document.querySelectorAll('.product-card');
        console.log(`🎨 Making ${cards.length} cards visible`);
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 50);
        });
    }, 100);
});

console.log('🛒 Store functionality loaded!');