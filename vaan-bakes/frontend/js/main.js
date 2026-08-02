// main.js

document.addEventListener('DOMContentLoaded', () => {
    const scrollToHash = (hash) => {
        if (!hash) return;
        const target = document.querySelector(hash);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleHashLinkClick = (event) => {
        const link = event.currentTarget;
        const href = link.getAttribute('href') || '';

        if (!href.includes('#')) {
            return;
        }

        const url = new URL(link.href, window.location.href);
        const samePage = url.origin === window.location.origin && url.pathname === window.location.pathname;

        if (samePage && url.hash) {
            event.preventDefault();
            scrollToHash(url.hash);
        }
    };

    document.querySelectorAll('a[href*="#"]').forEach((link) => {
        link.addEventListener('click', handleHashLinkClick);
    });

    window.addEventListener('load', () => {
        if (window.location.hash) {
            setTimeout(() => scrollToHash(window.location.hash), 150);
        }
    });

    const searchForm = document.querySelector('.header-search-form');
    const searchInput = document.getElementById('site-search');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const query = searchInput.value.trim().toLowerCase();

            if (!query) {
                return;
            }

            const isStorePage = document.querySelectorAll('.product-category').length > 0;

            if (isStorePage && typeof window.__filterStoreCatalog === 'function') {
                window.__filterStoreCatalog(query);
                return;
            }

            const pageMap = [
                { match: ['cake builder', 'builder', 'custom cake'], target: 'store.html#cake-builder' },
                { match: ['cakes', 'cake'], target: 'store.html#cakes' },
                { match: ['cupcakes', 'cupcake'], target: 'store.html#cupcakes' },
                { match: ['cookies', 'cookie'], target: 'store.html#cookies' },
                { match: ['seasonal', 'special', 'seasonal specials'], target: '#seasonal-specials' },
                { match: ['about', 'me'], target: '#about' },
                { match: ['contact'], target: '#contact' }
            ];

            const result = pageMap.find((entry) => entry.match.some((item) => query.includes(item)));

            if (result) {
                if (result.target.startsWith('#')) {
                    scrollToHash(result.target);
                    return;
                }

                window.location.href = result.target;
                return;
            }

            window.location.href = 'store.html';
        });
    }

    const seasonalSpecialsGrid = document.getElementById('seasonal-specials-grid');
    if (seasonalSpecialsGrid) {
        loadSeasonalSpecials(seasonalSpecialsGrid);
    }
});

async function loadSeasonalSpecials(seasonalSpecialsGrid) {
    try {
        const response = await fetch(window.apiUrl('/api/products/specials'));
        if (response.ok) {
            window.__vaanSeasonalSpecials = await response.json();
        }
    } catch (err) {
        console.warn('Seasonal specials backend unreachable, using fallback list:', err);
    }

    {
        const fallbackSpecials = [
            {
                title: 'Monsoon Mango Cake',
                description: 'Soft vanilla layers with mango cream and toasted coconut.',
                price: 'From $42',
                tag: 'Seasonal favorite'
            },
            {
                title: 'Pistachio Rose Cupcakes',
                description: 'Light pistachio sponge finished with a rose buttercream swirl.',
                price: 'From $18',
                tag: 'Limited batch'
            },
            {
                title: 'Holiday Cookie Box',
                description: 'A giftable cookie mix with warm spices and butter glaze.',
                price: 'From $24',
                tag: 'Gift ready'
            }
        ];

        const specials = Array.isArray(window.__vaanSeasonalSpecials) && window.__vaanSeasonalSpecials.length
            ? window.__vaanSeasonalSpecials
            : fallbackSpecials;

        seasonalSpecialsGrid.innerHTML = specials.map((item, index) => {
            const imageData = item.image || [
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"%3E%3Crect width="600" height="420" rx="36" fill="%23f6eee6"/%3E%3Crect x="116" y="130" width="368" height="170" rx="30" fill="%235e2e4f" fill-opacity="0.12"/%3E%3Ctext x="300" y="220" text-anchor="middle" font-family="Arial" font-size="34" font-weight="700" fill="%234a332d"%3ESEASONAL%3C/text%3E%3Ctext x="300" y="260" text-anchor="middle" font-family="Arial" font-size="26" fill="%238d4e3b"%3ESPECIALS%3C/text%3E%3C/svg%3E',
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"%3E%3Crect width="600" height="420" rx="36" fill="%23fbf4ea"/%3E%3Ccircle cx="186" cy="186" r="58" fill="%23d7b38d"/%3E%3Ccircle cx="300" cy="160" r="44" fill="%235e2e4f" fill-opacity="0.18"/%3E%3Ccircle cx="414" cy="186" r="58" fill="%238d4e3b" fill-opacity="0.28"/%3E%3Ctext x="300" y="316" text-anchor="middle" font-family="Arial" font-size="32" font-weight="700" fill="%234a332d"%3ESEASONAL%3C/text%3E%3C/svg%3E',
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"%3E%3Crect width="600" height="420" rx="36" fill="%23f5eee5"/%3E%3Crect x="120" y="114" width="360" height="192" rx="30" fill="%238d4e3b" fill-opacity="0.16"/%3E%3Ctext x="300" y="218" text-anchor="middle" font-family="Arial" font-size="34" font-weight="700" fill="%234a332d"%3ESEASONAL%3C/text%3E%3C/svg%3E'
            ][index % 3];

            return `
                <article class="seasonal-special-card">
                    <img class="seasonal-special-image" src="${imageData}" alt="${item.title}">
                    <p class="story-eyebrow">${item.tag || 'New this season'}</p>
                    <h3 class="seasonal-special-title">${item.title}</h3>
                    <p class="paragraph">${item.description}</p>
                    <div class="seasonal-special-meta">
                        <span>${item.price || 'Available now'}</span>
                    </div>
                </article>
            `;
        }).join('');
    }
}

// ===================================
// CAKE BUILDER INTERACTIONS
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const builderSection = document.getElementById('cake-builder');

    if (!builderSection) {
        return;
    }

    const pricing = {
        size: { mini: 32, small: 44, medium: 58, large: 76 },
        layers: { 2: 0, 3: 10, 4: 18 },
        flavor: {
            'classic-vanilla': 0,
            'double-chocolate': 4,
            'red-velvet': 5,
            'lemon-zest': 3
        },
        filling: {
            'vanilla-cream': 0,
            'berry-compote': 5,
            'salted-caramel': 6,
            'chocolate-ganache': 7
        },
        frosting: {
            buttercream: 0,
            chocolate: 4,
            strawberry: 4,
            'cream-cheese': 5
        },
        sideFrosting: {
            smooth: 0,
            rosettes: 6,
            drip: 7,
            rustic: 3
        },
        toppings: {
            'fresh-berries': 4,
            sprinkles: 2,
            macarons: 7,
            'edible-flowers': 5,
            'chocolate-shards': 4
        }
    };

    const labels = {
        size: {
            mini: 'Mini 6-inch',
            small: 'Small 8-inch',
            medium: 'Medium 10-inch',
            large: 'Large 12-inch'
        },
        layers: {
            2: '2 layers',
            3: '3 layers',
            4: '4 layers'
        },
        flavor: {
            'classic-vanilla': 'Classic Vanilla',
            'double-chocolate': 'Double Chocolate',
            'red-velvet': 'Red Velvet',
            'lemon-zest': 'Lemon Zest'
        },
        filling: {
            'vanilla-cream': 'Vanilla Cream',
            'berry-compote': 'Berry Compote',
            'salted-caramel': 'Salted Caramel',
            'chocolate-ganache': 'Chocolate Ganache'
        },
        frosting: {
            buttercream: 'Vanilla buttercream',
            chocolate: 'Chocolate silk',
            strawberry: 'Strawberry cream',
            'cream-cheese': 'Cream cheese'
        },
        sideFrosting: {
            smooth: 'Smooth finish',
            rosettes: 'Rosette sides',
            drip: 'Drip finish',
            rustic: 'Rustic spatula'
        },
        toppings: {
            'fresh-berries': 'Fresh berries',
            sprinkles: 'Sprinkles',
            macarons: 'Macarons',
            'edible-flowers': 'Edible flowers',
            'chocolate-shards': 'Chocolate shards'
        }
    };

    const selected = {
        size: 'mini',
        layers: '2',
        flavor: 'classic-vanilla',
        filling: 'vanilla-cream',
        frosting: 'buttercream',
        sideFrosting: 'smooth',
        toppings: new Set(['fresh-berries'])
    };

    const preview = {
        root: builderSection.querySelector('.preview-card'),
        cake: builderSection.querySelector('.cake-preview'),
        layers: Array.from(builderSection.querySelectorAll('.cake-layer-preview')),
        frostingRing: builderSection.querySelector('.cake-frosting-ring'),
        garnish: builderSection.querySelector('.cake-garnish')
    };

    const summaryEl = document.getElementById('builder-summary');
    const detailsEl = document.getElementById('builder-details');
    const priceEl = document.getElementById('builder-price');
    const flavorSelect = document.getElementById('cake-flavor');
    const fillingSelect = document.getElementById('cake-filling');
    const messageInput = document.getElementById('cake-message');

    function setActiveChip(groupName, value) {
        const group = builderSection.querySelector(`[data-group="${groupName}"]`);
        if (!group) return;

        group.querySelectorAll('.choice-chip').forEach((chip) => {
            chip.classList.toggle('active', chip.dataset.value === value);
        });
    }

    function getToppingCostAndLabels() {
        const chosen = [];
        let cost = 0;

        builderSection.querySelectorAll('.topping-pill input[type="checkbox"]').forEach((checkbox) => {
            if (checkbox.checked) {
                chosen.push(labels.toppings[checkbox.value]);
                cost += pricing.toppings[checkbox.value] || 0;
            }
        });

        return { chosen, cost };
    }

    function applyPreviewStyles() {
        const palette = {
            'classic-vanilla': {
                layers: ['#f4e1c1', '#e6c78c', '#f2d7a8', '#cfa462'],
                frosting: '#f7efe3',
                accent: '#d59a61',
                garnish: '#8f5a2f'
            },
            'double-chocolate': {
                layers: ['#7a4336', '#5f302a', '#8a5645', '#42221f'],
                frosting: '#f0e2d7',
                accent: '#9a6b52',
                garnish: '#4a2a24'
            },
            'red-velvet': {
                layers: ['#9a2f45', '#b33f5a', '#d25a73', '#74293c'],
                frosting: '#f5e9e5',
                accent: '#cf8b9a',
                garnish: '#5e2e4f'
            },
            'lemon-zest': {
                layers: ['#e6c84f', '#f2d978', '#d7b83a', '#f8ebad'],
                frosting: '#fff6dd',
                accent: '#b08c2d',
                garnish: '#5f4a15'
            }
        };

        const frostingPalette = {
            buttercream: '#f7efe3',
            chocolate: '#6c4036',
            strawberry: '#e78b9a',
            'cream-cheese': '#efe7de'
        };

        const sidePalette = {
            smooth: { ring: '#ead8c9', shadow: 'rgba(74, 51, 45, 0.12)' },
            rosettes: { ring: '#d3a1a3', shadow: 'rgba(122, 48, 108, 0.2)' },
            drip: { ring: '#c06f58', shadow: 'rgba(63, 36, 47, 0.18)' },
            rustic: { ring: '#b58d6e', shadow: 'rgba(74, 51, 45, 0.16)' }
        };

        const layerCount = parseInt(selected.layers, 10);
        const chosenPalette = palette[selected.flavor] || palette['classic-vanilla'];
        const frostingColor = frostingPalette[selected.frosting] || frostingPalette.buttercream;
        const sideStyle = sidePalette[selected.sideFrosting] || sidePalette.smooth;
        const layerLayout = {
            2: [
                { bottom: 74, height: 104, width: 180 },
                { bottom: 168, height: 80, width: 160 }
            ],
            3: [
                { bottom: 58, height: 96, width: 186 },
                { bottom: 144, height: 74, width: 170 },
                { bottom: 208, height: 58, width: 152 }
            ],
            4: [
                { bottom: 46, height: 86, width: 188 },
                { bottom: 124, height: 72, width: 172 },
                { bottom: 188, height: 58, width: 158 },
                { bottom: 238, height: 46, width: 144 }
            ]
        };

        if (preview.root) {
            preview.root.style.background = `linear-gradient(135deg, rgba(255, 250, 244, 0.96) 0%, rgba(233, 206, 183, 0.94) 100%)`;
            preview.root.style.boxShadow = `0 18px 60px ${sideStyle.shadow}`;
        }

        if (preview.cake) {
            preview.cake.style.background = `linear-gradient(180deg, rgba(252, 247, 241, 0.96) 0%, ${chosenPalette.accent} 100%)`;
        }

        const visibleLayers = layerLayout[layerCount] || layerLayout[2];

        preview.layers.forEach((layer, index) => {
            const spec = visibleLayers[index];
            if (!spec) {
                layer.style.opacity = '0';
                layer.style.visibility = 'hidden';
                return;
            }

            layer.style.opacity = '1';
            layer.style.visibility = 'visible';
            layer.style.bottom = `${spec.bottom}px`;
            layer.style.height = `${spec.height}px`;
            layer.style.width = `${spec.width}px`;
            layer.style.background = `linear-gradient(180deg, ${chosenPalette.layers[index] || chosenPalette.layers[chosenPalette.layers.length - 1]} 0%, ${chosenPalette.layers[Math.min(index + 1, chosenPalette.layers.length - 1)] || chosenPalette.layers[0]} 100%)`;
        });

        if (preview.frostingRing) {
            const ringBottom = layerCount === 4 ? 172 : layerCount === 3 ? 160 : 146;
            const ringWidth = layerCount === 4 ? 210 : layerCount === 3 ? 202 : 196;
            preview.frostingRing.style.bottom = `${ringBottom}px`;
            preview.frostingRing.style.width = `${ringWidth}px`;
            preview.frostingRing.style.background = `linear-gradient(180deg, ${frostingColor} 0%, ${sideStyle.ring} 100%)`;
            preview.frostingRing.style.boxShadow = `0 8px 18px ${sideStyle.shadow}`;
        }

        if (preview.garnish) {
            preview.garnish.style.background = `radial-gradient(circle at 35% 35%, #fff 0%, ${frostingColor} 18%, ${chosenPalette.garnish} 100%)`;
        }
    }

    function updateBuilder() {
        const toppings = getToppingCostAndLabels();
        const basePrice = pricing.size[selected.size] || 0;
        const note = messageInput ? messageInput.value.trim() : '';
        const total = basePrice
            + (pricing.layers[selected.layers] || 0)
            + (pricing.flavor[selected.flavor] || 0)
            + (pricing.filling[selected.filling] || 0)
            + (pricing.frosting[selected.frosting] || 0)
            + (pricing.sideFrosting[selected.sideFrosting] || 0)
            + toppings.cost;

        const details = [
            `${labels.size[selected.size]} · ${labels.layers[selected.layers]}`,
            `Flavor: ${labels.flavor[selected.flavor]}`,
            `Filling: ${labels.filling[selected.filling]}`,
            `Frosting: ${labels.frosting[selected.frosting]}`,
            `Sides: ${labels.sideFrosting[selected.sideFrosting]}`,
            `Toppings: ${toppings.chosen.join(', ')}`
        ];

        if (note) {
            details.push(`Note: ${note}`);
        }

        summaryEl.textContent = `${labels.size[selected.size]}, ${labels.layers[selected.layers]}, ${labels.frosting[selected.frosting]}, ${labels.sideFrosting[selected.sideFrosting]}`;
        detailsEl.innerHTML = details.map((item) => `<li>${item}</li>`).join('');
        priceEl.textContent = `$${total}`;

        applyPreviewStyles();
    }

    builderSection.querySelectorAll('[data-group]').forEach((group) => {
        group.addEventListener('click', (event) => {
            const button = event.target.closest('.choice-chip');
            if (!button) return;

            const groupName = group.dataset.group;
            const stateKey = groupName === 'side-frosting' ? 'sideFrosting' : groupName;
            selected[stateKey] = button.dataset.value;
            setActiveChip(groupName, button.dataset.value);
            updateBuilder();
        });
    });

    if (flavorSelect) {
        selected.flavor = flavorSelect.value;
        flavorSelect.addEventListener('change', () => {
            selected.flavor = flavorSelect.value;
            updateBuilder();
        });
    }

    if (fillingSelect) {
        selected.filling = fillingSelect.value;
        fillingSelect.addEventListener('change', () => {
            selected.filling = fillingSelect.value;
            updateBuilder();
        });
    }

    builderSection.querySelectorAll('.topping-pill input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                selected.toppings.add(checkbox.value);
            } else {
                selected.toppings.delete(checkbox.value);
            }
            updateBuilder();
        });
    });

    if (messageInput) {
        messageInput.addEventListener('input', updateBuilder);
    }

    updateBuilder();

    // ─── Add custom cake build to cart ───
    const reserveBtn = builderSection.querySelector('.builder-cta');
    if (reserveBtn) {
        reserveBtn.addEventListener('click', function() {
            const toppings = getToppingCostAndLabels();
            const basePrice = pricing.size[selected.size] || 0;
            const note = messageInput ? messageInput.value.trim() : '';
            const total = basePrice
                + (pricing.layers[selected.layers] || 0)
                + (pricing.flavor[selected.flavor] || 0)
                + (pricing.filling[selected.filling] || 0)
                + (pricing.frosting[selected.frosting] || 0)
                + (pricing.sideFrosting[selected.sideFrosting] || 0)
                + toppings.cost;

            const buildDetails = {
                size: labels.size[selected.size],
                layers: labels.layers[selected.layers],
                flavor: labels.flavor[selected.flavor],
                filling: labels.filling[selected.filling],
                frosting: labels.frosting[selected.frosting],
                sideFrosting: labels.sideFrosting[selected.sideFrosting],
                toppings: toppings.chosen.join(', '),
                note: note
            };

            if (typeof window.addCustomCakeToCart === 'function') {
                window.addCustomCakeToCart(buildDetails, total);
            } else {
                alert('Please open the store page to add custom cakes to your cart.');
            }
        });
    }
});

// ===================================
// GSAP ANIMATIONS & INTERACTIONS
// ===================================

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ===================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ===================================
// The hash scrolling is handled in the shared DOMContentLoaded block above.

// ===================================
// HEADER ANIMATION ON LOAD
// ===================================
gsap.from('.main-header', {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});



gsap.from('.nav-link', {
    y: -50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    delay: 0.5,
    ease: "power3.out"
});

// ===================================
// HERO SECTION ANIMATIONS
// ===================================
gsap.from('.hero-heading', {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out',
    delay: 0.5
});

gsap.from('.hero-buttons', {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'back.out(1.5)',
    delay: 1
});

// Button hover animations with anime.js
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        anime({
            targets: this,
            scale: 1.05,
            duration: 300,
            easing: 'easeOutElastic(1, .5)'
        });
    });
    
    btn.addEventListener('mouseleave', function() {
        anime({
            targets: this,
            scale: 1,
            duration: 300,
            easing: 'easeOutElastic(1, .5)'
        });
    });
});

// The old 3D cake animation path has been removed with the homepage swap.

// ===================================
// ABOUT SECTION ANIMATIONS
// ===================================
gsap.from('.about-section .section-heading', {
    opacity: 0,
    y: 50,
    duration: 0.8,
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 90%',
        toggleActions: 'play none none none'
    }
});

gsap.from('.about-content .paragraph', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 85%',
        toggleActions: 'play none none none'
    }
});

// ===================================
// CONTACT SECTION ANIMATIONS
// ===================================
gsap.from('.contact-section .section-heading', {
    opacity: 0,
    scale: 0.8,
    duration: 0.8,
    scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 85%',
        toggleActions: 'play none none none'
    }
});

gsap.from('.contact-item', {
    opacity: 0,
    y: 50,
    duration: 0.6,
    stagger: 0.15,
    scrollTrigger: {
        trigger: '.contact-info',
        start: 'top 90%',
        toggleActions: 'play none none none'
    }
});

// Contact item hover effect with anime.js
document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        anime({
            targets: this,
            scale: 1.05,
            duration: 400,
            easing: 'easeOutElastic(1, .6)'
        });
    });
    
    item.addEventListener('mouseleave', function() {
        anime({
            targets: this,
            scale: 1,
            duration: 400,
            easing: 'easeOutElastic(1, .6)'
        });
    });
});

// ===================================
// FOOTER ANIMATIONS
// ===================================
//iakudhs

// Footer animations
gsap.from('.footer-content > div', {
    opacity: 0,
    y: 20,
    duration: 0.5,
    stagger: 0.1,
    scrollTrigger: {
        trigger: '.main-footer',
        start: 'top 95%',
        toggleActions: 'play none none none'
    }
});

// ===================================
// SOCIAL MEDIA ICONS ANIMATIONS
// ===================================
/* gsap.from('.social-link', {
    scrollTrigger: {
        trigger: '.footer-social',
        start: 'top bottom-=50',
        toggleActions: 'play none none reverse'
    },
    scale: 0,
    rotation: 360,
    duration: 0.6,
    stagger: 0.1,
    delay: 0.7,
    ease: "back.out(1.7)"
}); */

// Social link hover animations with anime.js
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        anime({
            targets: this,
            rotate: 360,
            scale: 1.2,
            duration: 500,
            easing: 'easeOutElastic(1, .5)'
        });
    });
    
    link.addEventListener('mouseleave', function() {
        anime({
            targets: this,
            rotate: 0,
            scale: 1,
            duration: 500,
            easing: 'easeOutElastic(1, .5)'
        });
    });
});

// ===================================
// NAV LINK ACTIVE STATE
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// ===================================
// LOADING ANIMATION
// ===================================
window.addEventListener('load', () => {
    anime({
        targets: 'body',
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeInOutQuad'
    });
});

console.log('Main animations loaded with 3D cake integration');