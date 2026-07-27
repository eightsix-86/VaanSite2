// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Cart functionality
    let cart = [];
    const cartButton = document.getElementById('cart-button');
    cartButton.addEventListener('click', () => {
        // Logic to display cart items
        alert('Cart functionality to be implemented.');
    });

    // Event listeners for buttons
    const orderButtons = document.querySelectorAll('.order-button');
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            addToCart(productId);
        });
    });

    function addToCart(productId) {
        // Logic to add product to cart
        cart.push(productId);
        alert(`Product ${productId} added to cart!`);
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
document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: {
                    y: targetSection,
                    offsetY: 100
                },
                ease: "power3.inOut"
            });
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

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

// ===================================
// 3D CAKE ROTATION ON SCROLL - FIXED
// ===================================
const cake3d = document.getElementById('cake3d');

if (cake3d) {
    // Initial cake entrance animation
    gsap.from('.cake-3d', {
        scale: 0,
        opacity: 0,
        duration: 1.5,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: '.cake-section',
            start: 'top bottom',
            once: true
        }
    });

    // Initial visibility for layers
    gsap.set('.cake-layer', { opacity: 1 });
    gsap.set('.cake-slice', { opacity: 0, x: -50 });
    gsap.set('.callout', { opacity: 0, x: -20 });
    gsap.set('.cake-text-content', { opacity: 0, y: 30 });

    // Rotate cake on scroll
    gsap.to('.cake-3d', {
        scrollTrigger: {
            trigger: '.cake-section',
            start: 'top center',
            end: 'center center-=100',
            scrub: 1,
        },
        rotateY: 360,
        ease: "none"
    });

    // Show slice animation
    gsap.to('.cake-slice', {
        scrollTrigger: {
            trigger: '.cake-section',
            start: 'center center',
            end: 'bottom center',
            scrub: 1,
        },
        x: 0,
        opacity: 1,
        ease: "power2.out"
    });

    // Animate callouts
    gsap.to('.callout', {
        scrollTrigger: {
            trigger: '.cake-section',
            start: 'center center-=100',
            end: 'bottom center',
            scrub: 1,
        },
        opacity: 1,
        x: 0,
        stagger: 0.2,
        ease: "power2.out"
    });

    // Fade in text content
    gsap.to('.cake-text-content', {
        scrollTrigger: {
            trigger: '.cake-text-content',
            start: 'top bottom-=100',
            end: 'top center',
            scrub: 1,
        },
        opacity: 1,
        y: 0,
        ease: "power2.out"
    });

    // Floating animation for cake layers
    anime({
        targets: '.cake-layer',
        translateY: [
            { value: -10, duration: 1500 },
            { value: 0, duration: 1500 }
        ],
        loop: true,
        easing: 'easeInOutSine',
        delay: anime.stagger(300)
    });
}

// 3D Cake scroll-based rotation
ScrollTrigger.create({
    trigger: '.cake-section-3d',
    start: 'top center',
    end: 'bottom center',
    scrub: 1,
    onUpdate: (self) => {
        if (typeof targetRotation !== 'undefined' && !isDragging) {
            // Rotate cake based on scroll progress
            targetRotation.y = self.progress * Math.PI * 2;
            targetRotation.x = 0.2 + self.progress * 0.3;
        }
    }
});

// Animate text content when scrolling
gsap.to('.cake-text-content', {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '.cake-section-3d',
        start: 'top center',
        end: 'center center',
        scrub: 1
    }
});

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