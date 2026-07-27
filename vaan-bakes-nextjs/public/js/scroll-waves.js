// Create this new file
let lastScrollTop = 0;
let scrollSpeed = 0;
let scrollTimeout;

window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollSpeed = Math.abs(currentScrollTop - lastScrollTop);
    lastScrollTop = currentScrollTop;

    // Clear previous timeout
    clearTimeout(scrollTimeout);

    // Apply speed classes based on scroll velocity
    if (scrollSpeed > 50) {
        document.body.classList.add('scrolling-fast');
        document.body.classList.remove('scrolling-medium', 'scrolling-slow');
    } else if (scrollSpeed > 20) {
        document.body.classList.add('scrolling-medium');
        document.body.classList.remove('scrolling-fast', 'scrolling-slow');
    } else if (scrollSpeed > 0) {
        document.body.classList.add('scrolling-slow');
        document.body.classList.remove('scrolling-fast', 'scrolling-medium');
    }

    // Reset to normal speed after scrolling stops
    scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling-fast', 'scrolling-medium', 'scrolling-slow');
    }, 150);
}, false);