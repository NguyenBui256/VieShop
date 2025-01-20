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
    const products = [
        {
            id: 1,
            name: 'Sản phẩm 1',
            price: 199000,
            image: '/api/placeholder/100/100'
        },
        {
            id: 2,
            name: 'Sản phẩm 2',
            price: 299000,
            image: '/api/placeholder/100/100'
        }
    ];

    // Count occurrences of each product
    const cartItems = cart.reduce((acc, productId) => {
        acc[productId] = (acc[productId] || 0) + 1;
        return acc;
    }, {});

    // Convert to array of items with quantity
    return Object.entries(cartItems).map(([productId, quantity]) => {
        const product = products.find(p => p.id === parseInt(productId));
        return {
            ...product,
            quantity
        };
    });
}

// Create cart item HTML
function createCartItemHTML(item) {
    return `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">${formatPrice(item.price)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="updateQuantity(${item.id}, this.value)">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeItem(${item.id})">
                <i data-lucide="trash-2"></i>
            </button>
        </div>
    `;
}

// Update cart total
function updateTotal() {
    const items = getCartItems();
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalPrice').textContent = formatPrice(total);
}

// Update quantity of item
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeItem(productId);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(id => id !== productId);
    for (let i = 0; i < newQuantity; i++) {
        cart.push(productId);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Remove item from cart
function removeItem(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(id => id !== productId);
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
        lucide.createIcons();
    }
    
    updateTotal();
    updateCartBadge();
}

// Update cart badge
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = cart.length;
    }
}

// Checkout function
function checkout() {
    alert('Chức năng thanh toán đang được phát triển!');
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', renderCart);