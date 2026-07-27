console.log('🔍 Store.js is loading...');

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ===================================
// PRODUCTS DATA - USING COLORS INSTEAD OF SVG
// ===================================
const productsData = {
    cakes: [
        { id: 'cake1', name: 'Chocolate Dream Cake', price: 45.99, description: 'Rich chocolate layers with ganache', color: '#8B4513' },
        { id: 'cake2', name: 'Vanilla Bean Delight', price: 42.99, description: 'Classic vanilla with buttercream', color: '#F5DEB3' },
        { id: 'cake3', name: 'Red Velvet Romance', price: 48.99, description: 'Velvety red layers with cream cheese', color: '#DC143C' },
        { id: 'cake4', name: 'Strawberry Bliss', price: 46.99, description: 'Fresh strawberry layers', color: '#FF69B4' },
        { id: 'cake5', name: 'Lemon Zest Cake', price: 44.99, description: 'Tangy lemon with cream frosting', color: '#FFD700' },
        { id: 'cake6', name: 'Caramel Coffee Cake', price: 47.99, description: 'Coffee-infused with caramel drizzle', color: '#D2691E' },
        { id: 'cake7', name: 'Black Forest', price: 49.99, description: 'Chocolate, cherry, and cream layers', color: '#4B0082' },
        { id: 'cake8', name: 'Carrot Walnut Cake', price: 43.99, description: 'Spiced carrot with cream cheese', color: '#FF8C00' },
        { id: 'cake9', name: 'Tiramisu Cake', price: 50.99, description: 'Italian-inspired coffee delight', color: '#8B7355' },
        { id: 'cake10', name: 'Blueberry Cheesecake', price: 52.99, description: 'Creamy cheesecake with blueberries', color: '#4169E1' },
        { id: 'cake11', name: 'Coconut Paradise', price: 45.99, description: 'Tropical coconut layers', color: '#F5F5DC' },
        { id: 'cake12', name: 'Matcha Green Tea', price: 48.99, description: 'Delicate matcha flavor', color: '#90EE90' }
    ],
    cupcakes: [
        { id: 'cup1', name: 'Chocolate Cupcake', price: 4.99, description: 'Mini chocolate delight', color: '#8B4513' },
        { id: 'cup2', name: 'Vanilla Cupcake', price: 4.49, description: 'Classic vanilla swirl', color: '#F5DEB3' },
        { id: 'cup3', name: 'Red Velvet Cupcake', price: 5.49, description: 'Mini red velvet treat', color: '#DC143C' },
        { id: 'cup4', name: 'Strawberry Cupcake', price: 4.99, description: 'Fresh strawberry topped', color: '#FF69B4' },
        { id: 'cup5', name: 'Lemon Cupcake', price: 4.79, description: 'Zesty lemon flavor', color: '#FFD700' },
        { id: 'cup6', name: 'Caramel Cupcake', price: 5.29, description: 'Caramel swirl topping', color: '#D2691E' },
        { id: 'cup7', name: 'Mint Chocolate Chip', price: 5.49, description: 'Refreshing mint chocolate', color: '#98FB98' },
        { id: 'cup8', name: 'Peanut Butter Cup', price: 5.29, description: 'Creamy peanut butter', color: '#CD853F' },
        { id: 'cup9', name: 'Cookies & Cream', price: 5.49, description: 'Oreo topped cupcake', color: '#696969' },
        { id: 'cup10', name: 'Salted Caramel', price: 5.49, description: 'Sweet and salty combo', color: '#DAA520' },
        { id: 'cup11', name: 'Funfetti Cupcake', price: 4.99, description: 'Colorful sprinkle delight', color: '#FFB6C1' },
        { id: 'cup12', name: 'S\'mores Cupcake', price: 5.79, description: 'Campfire classic', color: '#8B4513' }
    ],
    cookies: [
        { id: 'cook1', name: 'Chocolate Chip Cookie', price: 2.99, description: 'Classic chocolate chip', color: '#8B4513' },
        { id: 'cook2', name: 'Oatmeal Raisin', price: 2.79, description: 'Hearty oatmeal with raisins', color: '#D2B48C' },
        { id: 'cook3', name: 'Sugar Cookie', price: 2.49, description: 'Sweet sugar classic', color: '#FFE4B5' },
        { id: 'cook4', name: 'Double Chocolate', price: 3.29, description: 'Extra chocolate goodness', color: '#4B0082' },
        { id: 'cook5', name: 'Peanut Butter Cookie', price: 2.99, description: 'Creamy peanut butter', color: '#CD853F' },
        { id: 'cook6', name: 'Snickerdoodle', price: 2.79, description: 'Cinnamon sugar perfection', color: '#F4A460' },
        { id: 'cook7', name: 'White Chocolate Macadamia', price: 3.49, description: 'Premium nut cookie', color: '#FFFACD' },
        { id: 'cook8', name: 'Ginger Snap', price: 2.69, description: 'Spicy ginger flavor', color: '#CD5C5C' },
        { id: 'cook9', name: 'Lemon Cookie', price: 2.79, description: 'Tangy lemon zest', color: '#FFD700' },
        { id: 'cook10', name: 'Red Velvet Cookie', price: 3.29, description: 'Velvety red cookie', color: '#DC143C' },
        { id: 'cook11', name: 'M&M Cookie', price: 3.49, description: 'Colorful candy cookie', color: '#FF6347' },
        { id: 'cook12', name: 'Brownie Cookie', price: 3.49, description: 'Fudgy brownie texture', color: '#3B2F2F' }
    ]
};

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
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
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
// HELPER: LIGHTEN COLOR
// ===================================
function lightenColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// ===================================
// LOAD PRODUCTS
// ===================================
function loadProducts() {
    console.log('📦 Loading products...');
    
    // Load Cakes
    const cakesGrid = document.getElementById('cakes-grid');
    if (cakesGrid) {
        productsData.cakes.forEach(product => {
            cakesGrid.appendChild(createProductCard(product));
        });
        console.log(`✅ Loaded ${productsData.cakes.length} cakes`);
    }

    // Load Cupcakes
    const cupcakesGrid = document.getElementById('cupcakes-grid');
    if (cupcakesGrid) {
        productsData.cupcakes.forEach(product => {
            cupcakesGrid.appendChild(createProductCard(product));
        });
        console.log(`✅ Loaded ${productsData.cupcakes.length} cupcakes`);
    }

    // Load Cookies
    const cookiesGrid = document.getElementById('cookies-grid');
    if (cookiesGrid) {
        productsData.cookies.forEach(product => {
            cookiesGrid.appendChild(createProductCard(product));
        });
        console.log(`✅ Loaded ${productsData.cookies.length} cookies`);
    }
}

// ===================================
// CREATE PRODUCT CARD WITH GRADIENT
// ===================================
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // FORCE VISIBILITY WITH INLINE STYLES
    card.style.cssText = 'opacity: 1 !important; transform: translateY(0) !important;';
    
    const lightColor = lightenColor(product.color, 40);
    const isDark = ['#8B4513', '#4B0082', '#696969', '#3B2F2F', '#DC143C', '#D2691E'].includes(product.color);
    const textColor = isDark ? 'white' : '#333';
    
    card.innerHTML = `
        <div class="product-image" style="background: linear-gradient(135deg, ${product.color} 0%, ${lightColor} 100%); display: flex; align-items: center; justify-content: center; height: 250px; color: ${textColor}; font-size: 1.2rem; font-weight: 600; text-align: center; padding: 20px; text-shadow: 1px 1px 3px rgba(0,0,0,0.2);">
            ${product.name}
        </div>
        <div class="product-info">
            <h4 class="product-name">${product.name}</h4>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>
    `;
    
    // Add to cart event
    const addBtn = card.querySelector('.add-to-cart-btn');
    addBtn.addEventListener('click', () => addToCart(product.name, product.price, product.color));
    
    return card;
}

// ===================================
// INITIALIZE - SINGLE DOMContentLoaded
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded - Initializing store...');
    
    // Load products first
    loadProducts();
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