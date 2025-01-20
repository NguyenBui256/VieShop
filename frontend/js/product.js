// Sample product data
const products = [
    {
        id: 1,
        name: 'Sản phẩm 1',
        price: 199000,
        image: 'alo.jpg',
        description: 'Mô tả sản phẩm 1'
    },
    {
        id: 2,
        name: 'Sản phẩm 2',
        price: 299000,
        image: 'alo.jpg',
        description: 'Mô tả sản phẩm 2'
    },
    // Add more products as needed
];

// Format price to VND
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    `;
}

// Add to cart function
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
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

// Initialize product grid
function initializeProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
    }
    updateCartBadge();
}

function renderProducts(filteredProducts) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        productsGrid.innerHTML += createProductCard(product);
    });
}

function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const priceFilter = document.getElementById('priceFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;

    let filteredProducts = products;

    // Lọc theo tên sản phẩm
    if (searchInput) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchInput) || product.description.toLowerCase().includes(searchInput)
            || product.price.toString().includes(searchInput)
        );
    }

    // Lọc theo giá
    if (priceFilter) {
        if (priceFilter === 'low') {
            filteredProducts = filteredProducts.filter(product => product.price < 200000);
        } else if (priceFilter === 'medium') {
            filteredProducts = filteredProducts.filter(product => product.price >= 200000 && product.price <= 500000);
        } else if (priceFilter === 'high') {
            filteredProducts = filteredProducts.filter(product => product.price > 500000);
        }
    }

    // Lọc theo loại
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }

    renderProducts(filteredProducts);
}

// Render all products on initial load
document.addEventListener('DOMContentLoaded', () => {
    initializeProducts();
});

document.querySelector('.logo').addEventListener('click', () => {
    initializeProducts();
});
