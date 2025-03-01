let currentImageIndex = 0;
let productImages = [];

// Khởi tạo trang
async function initializeProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    const product = await fetchProduct(productId);
    if (!product) {
        showNotification('Không tìm thấy sản phẩm');
        return;
    }

    productImages = product.images || [product.image];
    renderProductGallery();
    renderProductInfo(product);
    renderShopInfo(product.shop);
    renderReviews(product.reviews);
    initializeGalleryNavigation();
}

// Xử lý navigation gallery
function initializeGalleryNavigation() {
    document.querySelector('.gallery-nav.prev').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
        updateGallery();
    });

    document.querySelector('.gallery-nav.next').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % productImages.length;
        updateGallery();
    });
}

// Render gallery
function renderProductGallery() {
    const galleryContainer = document.getElementById('productImages');
    galleryContainer.innerHTML = productImages.map((image, index) => `
        <img src="${image}" 
             alt="Product image ${index + 1}" 
             class="product-image" 
             style="opacity: ${index === currentImageIndex ? '1' : '0'}"
        >
    `).join('');
}

// Cập nhật gallery
function updateGallery() {
    const images = document.querySelectorAll('.product-image');
    images.forEach((img, index) => {
        img.style.opacity = index === currentImageIndex ? '1' : '0';
    });
}

// Render thông tin sản phẩm
function renderProductInfo(product) {
    const productInfo = document.getElementById('productInfo');
    const variantsHTML = product.variants.map(variant => `
        <div class="variant-group">
            <h4 class="variant-title">${variant.name}</h4>
            <div class="variant-options">
                ${variant.values.map(value => `
                    <div class="variant-option" 
                         data-variant-name="${variant.name}" 
                         data-value="${value}"
                         onclick="selectVariant(this)">
                        ${value}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    productInfo.innerHTML = `
        <h1 class="product-title">${product.name}</h1>
        <p class="product-price">${formatPrice(product.basePrice)}</p>
        <div class="product-variants">
            ${variantsHTML}
        </div>
        <div class="quantity-selector">
            <label>Số lượng:</label>
            <input type="number" id="quantityInput" value="1" min="1" max="${product.stockQuantity}">
        </div>
        <button class="btn btn-primary" onclick="addToCart()">
            Thêm vào giỏ hàng
        </button>
    `;
}

// Render rating bars
function renderRatingBars(ratings) {
    const ratingBars = document.getElementById('ratingBars');
    ratingBars.innerHTML = Array(5).fill(0).map((_, index) => {
        const starCount = 5 - index;
        const count = ratings[starCount] || 0;
        const percentage = (count / ratings.total) * 100;
        
        return `
            <div class="rating-bar">
                <span>${starCount} sao</span>
                <div class="bar-fill">
                    <div class="bar-value" style="width: ${percentage}%"></div>
                </div>
                <span>${count}</span>
            </div>
        `;
    }).join('');
}

// Các hàm khác giữ nguyên như đã có

// Xử lý upload ảnh
const imageUpload = document.getElementById('imageUpload');
const videoUpload = document.getElementById('videoUpload');
const uploadPreview = document.getElementById('uploadPreview');
let uploadedFiles = [];

imageUpload.addEventListener('change', handleImageUpload);
videoUpload.addEventListener('change', handleVideoUpload);

function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (getImageCount() + files.length > 5) {
        showNotification('Chỉ được upload tối đa 5 ảnh');
        return;
    }
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                addPreviewItem('image', event.target.result, file);
            };
            reader.readAsDataURL(file);
        }
    });
}

function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (getVideoCount() >= 1) {
        showNotification('Chỉ được upload 1 video');
        return;
    }

    if (file && file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            addPreviewItem('video', event.target.result, file);
        };
        reader.readAsDataURL(file);
    }
}

function addPreviewItem(type, src, file) {
    const div = document.createElement('div');
    div.className = 'preview-item';
    
    const media = type === 'image' 
        ? `<img src="${src}" alt="preview">`
        : `<video src="${src}" controls></video>`;
        
    div.innerHTML = `
        ${media}
        <button class="remove-btn" onclick="removePreviewItem(this)">
            <i class="fa-solid fa-times"></i>
        </button>
    `;
    
    uploadPreview.appendChild(div);
    uploadedFiles.push({ type, file });
}

function removePreviewItem(button) {
    const item = button.parentElement;
    const index = Array.from(uploadPreview.children).indexOf(item);
    uploadedFiles.splice(index, 1);
    item.remove();
}

function getImageCount() {
    return uploadedFiles.filter(file => file.type === 'image').length;
}

function getVideoCount() {
    return uploadedFiles.filter(file => file.type === 'video').length;
}

// Xử lý thêm vào giỏ hàng
document.querySelector('.btn-add-to-cart').addEventListener('click', function() {
    // Lấy thông tin sản phẩm từ trang
    const productId = new URLSearchParams(window.location.search).get('id');
    const selectedVariants = getSelectedVariants();
    
    // Thêm vào giỏ hàng
    addToCart(productId, selectedVariants);
});

function getSelectedVariants() {
    const variants = {};
    document.querySelectorAll('.variant-option.selected').forEach(option => {
        const group = option.closest('.variant-group');
        const title = group.querySelector('.variant-title').textContent;
        variants[title] = option.textContent;
    });
    return variants;
}

function addToCart(productId, variants) {
    // Lấy giỏ hàng hiện tại từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Thêm sản phẩm mới
    cart.push({
        productId,
        variants,
        quantity: 1,
        dateAdded: new Date().toISOString()
    });
    
    // Lưu giỏ hàng
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật badge số lượng
    updateCartBadge();
    
    // Hiển thị thông báo
    showNotification('Đã thêm sản phẩm vào giỏ hàng');
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const badge = document.querySelector('.cart-badge');
    badge.textContent = cart.length;
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.querySelector('p').textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}