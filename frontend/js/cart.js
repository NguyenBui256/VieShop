var products;

// Format price to VND
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Get cart items from localStorage
function getCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Count occurrences of each product in cart
    const cartItems = cart.reduce((acc, { productId, variant, quantity }) => {
        const key = `${productId}-${variant.id}`; // Create a unique key for each variant
        acc[key] = acc[key] || { productId, variant, quantity: 0  };
        acc[key].quantity += quantity; // Add the quantity for the same product variant
        return acc;
    }, {});

    // Convert to array of items with product details
    if (!Array.isArray(products) || products.length === 0) {
        console.error("Error: products is not defined or empty");
        return [];
    }    
    return Object.values(cartItems).map(({ productId, variant, quantity }) => {
        const product = products.find(product => product.id == parseInt(productId));
        if (product) {  
            return {
                product: product,
                variant: variant,
                quantity: quantity
            };
        }
    }).filter(item => item); // Filter out any undefined items
}


// Create cart item HTML
function createCartItemHTML(item) {
    let ava = "";
    for(const image of item.product.productImageList){
        if(image.isThumbnail === true){
            ava = image.imageUrl;
            break;
        }
    }
    
    let html = `<div class="cart-item" data-id="${item.product.id}" data-variant-id="${item.variant.id}">
            <img src="${ava}" alt="${item.product.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.product.name}</h3>
                <h3 class="cart-item-variant">${item.variant.name}</h3>
                <p class="cart-item-price">${formatPrice(item.variant.price)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-btn" onclick="updateQuantity(${item.product.id}, ${item.variant.id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="updateQuantity(${item.product.id}, ${item.variant.id}, parseInt(this.value))">
                    <button class="quantity-btn increase-btn" onclick="updateQuantity(${item.product.id}, ${item.variant.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeItem(${item.product.id}, ${item.variant.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>`;
    return html;
}

function getTotalPrice() {
    let sum = 0;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    for(const item of cart) {
        sum += item.variant.price * item.quantity;
    }
    return sum;
}

// Update cart total
function updateTotal() {
    document.getElementById('totalPrice').textContent = formatPrice(getTotalPrice());
}

// Update quantity of item
window.updateQuantity = function(productId, variantId, newQuantity) {
    if (newQuantity < 1) {
        removeItem(productId, variantId); // Remove product when quantity < 1
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update quantity of product based on productId and variantId
    cart = cart.map(item => {
        if (item.productId == productId && item.variant.id == variantId) {
            return { ...item, quantity: parseInt(newQuantity) }; // Update quantity
        }
        return item;
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart(); // Update cart UI
}

// Remove item from cart
window.removeItem = function(productId, variantId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => !(item.productId == productId && item.variant.id == variantId));
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Render cart
function renderCart() {
    const cartItems = getCartItems();
    const cartContainer = document.getElementById('cartItems');
    
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p>Giỏ hàng trống</p>';
    } else {
        cartContainer.innerHTML = cartItems.map(createCartItemHTML).join('');
    }
    
    updateTotal();
    updateCartBadge();
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        if (badge.id === 'cartCount') {
            badge.textContent = totalItems;
        }
    });
}

// Initialize cart when page loads
document.addEventListener("DOMContentLoaded", async () => {
    try {
        products = JSON.parse(sessionStorage.getItem('products')) || [];
        if (products.length === 0) {
            console.warn("No products found in sessionStorage");
        }
        renderCart();
        updateCartBadge();
    } catch (error) {
        console.error("Error initializing cart:", error);
    }
});