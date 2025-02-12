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

    // console.log(cartItems);

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
    console.log(item);
    let html = `<div class="cart-item" data-id="${item.product.id}">
            <img src="${ava}" alt="${item.product.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.product.name}</h3>
                <h3 class="cart-item-variant">${item.variant.name}</h3>
                <p class="cart-item-price">${formatPrice(item.variant.price)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.product.id}, ${item.variant.id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="updateQuantity(${item.product.id}, ${item.variant}, this.value)">
                    <button class="quantity-btn" onclick="updateQuantity(${item.product.id}, ${item.variant.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeItem(${item.product.id}, '${item.variant}')">
                <i data-lucide="trash-2"></i>
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
function updateQuantity(productId, variantId, newQuantity) {
    if (newQuantity < 1) {
        removeItem(productId); // Xóa sản phẩm khi số lượng < 1
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Cập nhật số lượng của sản phẩm dựa trên productId và variant
    cart = cart.map(item => {
        if (item.productId == productId && item.variant.id == variantId) {
            return { ...item, variant: item.variant, quantity: newQuantity }; // Cập nhật quantity
        }
        return item;
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart(); // Cập nhật lại giao diện giỏ hàng
}


// Remove item from cart
function removeItem(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(product => product.productId !== productId);
    console.log("sau filter");
    console.log(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Render cart
function renderCart() {
    const cartItems = getCartItems();
    console.log(cartItems);
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
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = cart.length;
    }
}

// Initialize cart when page loads
// document.addEventListener('DOMContentLoaded', renderCart);

document.addEventListener("DOMContentLoaded", async () => {
    products = JSON.parse(sessionStorage.getItem('products')) || [];
    renderCart();
    updateCartBadge();
});