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
        document.getElementById("productsContainer").innerHTML = `<p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>`;
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
    const productsContainer = document.getElementById('productsContainer');
    if (productsContainer) {
        productsContainer.innerHTML = products.forEach((product) => {
            const productItem = document.createElement('div');
            productItem.innerHTML = createProductCard(product);
            productsContainer.appendChild(productItem);
        });
    }
    document.querySelectorAll("#addToCartBtn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            showVariantSelection(event.target.getAttribute("data-index"));
        });
    });
    updateCartBadge();
}

function renderProducts(filteredProducts) {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        productsContainer.innerHTML += createProductCard(product);
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

window.onload = async () => {
    await fetch_products();
    updateCartBadge();
}

document.querySelector('#shopBtn').addEventListener('click', () => {
    initializeProducts();
});

function showVariantSelection(productId) {
    var product;
    for(const p of products) {
        if(p.id == productId) {
            product = p;
            break;
        }
    }
    // Tạo HTML cho các option của variant
    console.log(product.productVariants);
    let variantOptionsHTML = `<div class="radioVariantName">`;
    variantOptionsHTML += `<label class="variantLabel">`
    for(const variant of product.productVariants) {
        variantOptionsHTML += `
            <input type="radio" class="variant-select" name="name" value="${variant.name}" variant-id="${variant.id}">
            <span>${variant.name}</span>
        `;
    }
    variantOptionsHTML += `</label>`;
    variantOptionsHTML += `</div>`;
    // Tạo overlay và modal
    let overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.innerHTML = `
        <div class="modal">
            <h3>${product.name}</h3>
            <form id="variantForm">
                ${variantOptionsHTML}
                <div class="form-group">
                    <label>Số lượng:</label>
                    <input type="number" id="quantityInput" min="1" value="1" max="${product.stockQuantity}">
                </div>
                <div class="modal-buttons">
                    <button type="button" class="btn-confirm" onclick="confirmAddToCart(${product.id})">
                        Thêm vào giỏ hàng
                    </button>
                    <button type="button" class="btn-cancel" onclick="hideVariantSelection()">
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

function confirmAddToCart(productId) {
    let selectedOption = document.querySelector(`input[class="variant-select"]:checked`);
    let variant = null;
    // console.log(selectedOption);
    for(const p of products) {
        if(p.id == productId) {
            for(const v of p.productVariants) {
                if(v.id == selectedOption.getAttribute('variant-id')) {
                    variant = v;
                    break;
                }
            }
            break;
        }
    }
    if(variant == null) {
        alert('Vui lòng chọn thuộc tính sản phẩm!');
        return;
    }
    const quantity = parseInt(document.getElementById('quantityInput').value, 10);
    
    // Tạo object chứa thông tin sản phẩm để thêm vào giỏ hàng
    const cartItem = {
        productId,
        variant,
        quantity
    };
    console.log(cartItem);
    
    // Lưu vào localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật số lượng hiển thị trên giỏ hàng
    updateCartBadge();
    
    // Đóng modal
    hideVariantSelection();
    
    // Hiển thị thông báo thành công
    alert('Đã thêm sản phẩm vào giỏ hàng!');
}

function hideVariantSelection() {
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.remove();
    }
}