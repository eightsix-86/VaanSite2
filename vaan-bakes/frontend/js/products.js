const products = [
    {
        id: 1,
        name: "Chocolate Cake",
        description: "Rich and moist chocolate cake topped with creamy chocolate frosting.",
        price: 25.00,
        image: "assets/images/chocolate-cake.jpg",
        category: "cakes"
    },
    {
        id: 2,
        name: "Vanilla Cupcake",
        description: "Light and fluffy vanilla cupcake with a swirl of vanilla buttercream.",
        price: 3.50,
        image: "assets/images/vanilla-cupcake.jpg",
        category: "cupcakes"
    },
    {
        id: 3,
        name: "Oatmeal Raisin Cookie",
        description: "Chewy oatmeal cookie packed with plump raisins and a hint of cinnamon.",
        price: 1.50,
        image: "assets/images/oatmeal-raisin-cookie.jpg",
        category: "cookies"
    }
];

function displayProducts() {
    const productContainer = document.getElementById('product-container');
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productContainer.appendChild(productCard);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    // Logic to add the product to the cart
    console.log(`${product.name} has been added to the cart.`);
}

document.addEventListener('DOMContentLoaded', displayProducts);