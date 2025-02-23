import { getCookie } from "./auth.js";

// Sample product data
var products = [];
const FETCH_PRODUCTS_API = "http://localhost:8080/api/v1/products";

async function fetch_products() {
    console.log("alo");
    try {
        console.log("Bearer " + getCookie('access-token'));
        const response = await fetch(FETCH_PRODUCTS_API, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie('access-token')
            }
        });
        let jsonObject = await response.json();
        products = jsonObject.data.content;
        console.log("Danh sách sản phẩm:", products);
        sessionStorage.setItem('products', JSON.stringify(products));
        renderProducts(products);
    } catch (error) {
        // Xử lý lỗi
        console.log(error);
        document.getElementById("productsGrid").innerHTML = `<p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>`;
    }
}

// Format price to VND
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}


function createProductCard(product) {
    let ava = "";
    for(const image of product.productImageList){
        if(image.isThumbnail === true){
            ava = image.imageUrl;
            break;
        }
    }
    return `
        <div class="product-card">
            <img src="${ava}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <p class="product-category">Phân loại: ${product.category.name}</p>
                <a href="view-product.html?id=${product.id}"><h3 class="product-title">${product.name}</h3></a>
                <p class="product-price">${formatPrice(product.basePrice)}</p>
                <p class="product-quantity">Số lượng: ${product.stockQuantity}</p>
                <p class="product-rating">Đánh giá: ${product.rating}/5</p>
                <a href="/shop.html?id=${product.shop.id}"class="product-shop">Shop: ${product.shop.name}</a>
                <button class="btn btn-primary" onclick="showVariantSelection(${product.id})">
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    `;
}

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
        productsGrid.innerHTML = products.forEach((product) => {
            const productItem = document.createElement('div');
            productItem.innerHTML = createProductCard(product);
            productsGrid.appendChild(productItem);
        });
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
            product.name.toLowerCase().includes(searchInput)
        );
    }

    // Lọc theo giá
    if (priceFilter) {
        if (priceFilter === 'low') {
            filteredProducts = filteredProducts.filter(product => product.basePrice < 200000);
        } else if (priceFilter === 'medium') {
            filteredProducts = filteredProducts.filter(product => product.basePrice >= 200000 && product.basePrice <= 500000);
        } else if (priceFilter === 'high') {
            filteredProducts = filteredProducts.filter(product => product.basePrice > 500000);
        }
    }

    // Lọc theo loại
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(product => product.category.name === categoryFilter);
    }

    renderProducts(filteredProducts);
}

window.onload = () => {
    fetch_products();
    updateCartBadge();
}

document.querySelector('.logo').addEventListener('click', () => {
    initializeProducts();
});
