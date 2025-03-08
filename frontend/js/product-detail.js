let currentImageIndex = 0;
let productImages = [];
let currentProduct = null;

// Khởi tạo trang
async function initializeProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/v1/products/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie('access-token')
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }
        
        const jsonResponse = await response.json();
        const product = jsonResponse.data;
        currentProduct = product;
        
        if (!product) {
            showNotification('Không tìm thấy sản phẩm');
            return;
        }

        // Extract images from product
        productImages = [];
        if (product.productImageList && product.productImageList.length > 0) {
            for (const image of product.productImageList) {
                productImages.push(image.imageUrl);
            }
        }
        
        renderProductGallery();
        renderImageIndicators();
        renderProductInfo(product);
        renderShopInfo(product.shop);
        renderFullDescription(product.description);
        
        if (product.reviews) {
            renderReviews(product.reviews);
        }
        
        initializeGalleryNavigation();
        initializeTabNavigation();
        initializeReviewForm();
        initializeQuantityButtons();
        initializeAddToCartButton();
        updateCartBadge();
    } catch (error) {
        console.error('Error fetching product:', error);
        showNotification('Không thể tải thông tin sản phẩm');
    }
}

// Xử lý navigation gallery
function initializeGalleryNavigation() {
    document.querySelector('.gallery-nav.prev').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
        updateGallery();
        updateImageIndicators();
    });

    document.querySelector('.gallery-nav.next').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % productImages.length;
        updateGallery();
        updateImageIndicators();
    });
}

// Initialize tab navigation
function initializeTabNavigation() {
    const tabButtons = document.querySelectorAll('[data-tab]');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
            
            // Add active class to clicked button and show corresponding tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).style.display = 'block';
        });
    });
}

// Initialize quantity buttons
function initializeQuantityButtons() {
    // Make the quantity buttons global functions
    window.increaseQuantity = function() {
        const input = document.getElementById('quantityInput');
        const max = parseInt(input.getAttribute('max'));
        const currentValue = parseInt(input.value);
        
        if (currentValue < max) {
            input.value = currentValue + 1;
        }
    };
    
    window.decreaseQuantity = function() {
        const input = document.getElementById('quantityInput');
        const currentValue = parseInt(input.value);
        
        if (currentValue > 1) {
            input.value = currentValue - 1;
        }
    };
}

// Initialize add to cart button
function initializeAddToCartButton() {
    const addToCartBtn = document.querySelector('.btn-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            addToCart();
        });
    }
}

// Render image indicators (dots)
function renderImageIndicators() {
    const indicatorsContainer = document.getElementById('imageIndicators');
    
    if (productImages.length <= 1) {
        indicatorsContainer.style.display = 'none';
        return;
    }
    
    indicatorsContainer.innerHTML = productImages.map((_, index) => `
        <div class="indicator ${index === currentImageIndex ? 'active' : ''}" 
             data-index="${index}" 
             onclick="selectImage(${index})"></div>
    `).join('');
    
    // Make the selectImage function global
    window.selectImage = function(index) {
        currentImageIndex = index;
        updateGallery();
        updateImageIndicators();
    };
}

// Update image indicators
function updateImageIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentImageIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Render gallery
function renderProductGallery() {
    const galleryContainer = document.getElementById('productImages');
    
    if (productImages.length === 0) {
        galleryContainer.innerHTML = `
            <img src="assets/product-placeholder.jpg" alt="Product image" class="product-image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
        `;
        return;
    }
    
    galleryContainer.innerHTML = productImages.map((image, index) => `
        <img src="${image}" 
             alt="Product image ${index + 1}" 
             class="product-image" 
             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: ${index === currentImageIndex ? '1' : '0'}; transition: opacity 0.3s ease;"
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

// Format price to VND
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Render full description in the description tab
function renderFullDescription(description) {
    const descriptionContainer = document.getElementById('fullDescription');
    if (descriptionContainer) {
        descriptionContainer.innerHTML = description || 'No description available';
    }
}

// Render thông tin sản phẩm
function renderProductInfo(product) {
    const productInfo = document.getElementById('productInfo');
    
    // Prepare variants HTML if product has variants
    let variantsHTML = '';
    if (product.productVariants && product.productVariants.length > 0) {
        variantsHTML = `
            <div class="product-variants">
                <div class="variant-group">
                    <h4 class="variant-title">Phân loại</h4>
                    <div class="variant-options">
                        ${product.productVariants.map(variant => `
                            <div class="variant-option" 
                                data-variant-id="${variant.id}" 
                                data-value="${variant.name}"
                                onclick="selectVariant(this)">
                                ${variant.name}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    productInfo.innerHTML = `
        <h1 class="product-title">${product.name}</h1>
        
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: var(--spacing-md);">
            <div style="display: flex; align-items: center; gap: 0.25rem; color: #fbbf24;">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
                <span style="color: var(--gray-600); margin-left: 0.5rem;">(${product.rating || '0.0'})</span>
            </div>
            <span style="color: var(--gray-600);">|</span>
            <span style="color: var(--gray-600);">${product.reviews ? product.reviews.length : '0'} Reviews</span>
        </div>
        
        <div style="margin-bottom: var(--spacing-lg);">
            <p class="price" style="font-size: 2rem;">${formatPrice(product.basePrice)}</p>
            <p style="color: var(--gray-600);">
                <i class="fas fa-check-circle" style="color: #10b981;"></i> 
                ${product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
        </div>
        
        <div style="margin-bottom: var(--spacing-lg);">
            <h3>Description</h3>
            <p style="color: var(--gray-600); line-height: 1.6;" id="productDescription">
                ${product.description ? (product.description.length > 200 ? product.description.substring(0, 200) + '...' : product.description) : 'No description available'}
            </p>
        </div>
        
        ${variantsHTML}
        
        <div style="display: flex; gap: 1rem; margin-bottom: var(--spacing-lg);">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button class="btn btn-outline" onclick="decreaseQuantity()">-</button>
                <input type="number" id="quantityInput" value="1" min="1" max="${product.stockQuantity}" class="form-control" style="width: 60px; text-align: center;">
                <button class="btn btn-outline" onclick="increaseQuantity()">+</button>
            </div>
            <button class="btn btn-primary btn-add-to-cart" style="flex: 1;">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
        </div>
        
        <div style="display: flex; gap: 1rem;">
            <button class="btn btn-outline" style="flex: 1;">
                <i class="far fa-heart"></i> Add to Wishlist
            </button>
            <button class="btn btn-outline" style="flex: 1;">
                <i class="fas fa-share-alt"></i> Share
            </button>
        </div>
    `;
    
    // Make the selectVariant function global
    window.selectVariant = function(element) {
        // Remove active class from all options in the same group
        const group = element.closest('.variant-group');
        group.querySelectorAll('.variant-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add active class to selected option
        element.classList.add('selected');
    };
}

// Render shop information
function renderShopInfo(shop) {
    if (!shop) return;
    
    const shopInfoContainer = document.getElementById('shopInfo');
    shopInfoContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md);">
            <img src="${shop.avatar || 'assets/shop-placeholder.jpg'}" alt="${shop.name}" 
                style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
            <div>
                <h3>${shop.name}</h3>
                <p style="color: var(--gray-600);">${shop.description || 'No description available'}</p>
                <a href="/shop.html?id=${shop.id}" class="btn btn-outline" style="margin-top: var(--spacing-sm);">
                    Visit Shop
                </a>
            </div>
        </div>
    `;
}

// Render rating bars
function renderRatingBars(ratings) {
    const ratingBars = document.getElementById('ratingBars');
    
    if (!ratings || !ratings.total) {
        ratingBars.innerHTML = '<p>No ratings yet</p>';
        return;
    }
    
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

// Render reviews
function renderReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    
    if (!reviews || reviews.length === 0) {
        reviewsList.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
        return;
    }
    
    // Calculate ratings summary
    const ratingsSummary = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        total: reviews.length
    };
    
    let totalRating = 0;
    reviews.forEach(review => {
        const rating = review.rating || 5;
        ratingsSummary[rating] = (ratingsSummary[rating] || 0) + 1;
        totalRating += rating;
    });
    
    const averageRating = totalRating / reviews.length;
    
    // Update average rating display
    document.querySelector('.average-rating .rating-number').textContent = averageRating.toFixed(1);
    document.querySelector('.total-reviews').textContent = `${reviews.length} reviews`;
    
    // Update stars
    const stars = document.querySelectorAll('.average-rating .stars i');
    stars.forEach((star, index) => {
        if (index < Math.floor(averageRating)) {
            star.className = 'fas fa-star';
        } else if (index < Math.ceil(averageRating) && averageRating % 1 !== 0) {
            star.className = 'fas fa-star-half-alt';
        } else {
            star.className = 'far fa-star';
        }
    });
    
    // Render rating bars
    renderRatingBars(ratingsSummary);
    
    // Render review list
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="${review.user?.avatar || 'assets/user-placeholder.jpg'}" alt="User" class="reviewer-avatar">
                    <div>
                        <h4>${review.user?.name || 'Anonymous'}</h4>
                        <div class="review-rating">
                            ${Array(5).fill(0).map((_, i) => 
                                i < review.rating 
                                    ? '<i class="fas fa-star"></i>' 
                                    : '<i class="far fa-star"></i>'
                            ).join('')}
                        </div>
                        <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div class="review-content">
                <h5>${review.title || 'Review'}</h5>
                <p>${review.content}</p>
                ${review.images && review.images.length > 0 ? `
                    <div class="review-images">
                        ${review.images.map(img => `
                            <img src="${img}" alt="Review image" class="review-image">
                        `).join('')}
                    </div>
                ` : ''}
                ${review.video ? `
                    <div class="review-video">
                        <video src="${review.video}" controls></video>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Initialize review form
function initializeReviewForm() {
    // Star rating functionality
    const stars = document.querySelectorAll('.star-rating i');
    let selectedRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
        
        star.addEventListener('mouseout', function() {
            highlightStars(selectedRating);
        });
        
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            highlightStars(selectedRating);
        });
    });
    
    function highlightStars(count) {
        stars.forEach((star, index) => {
            star.className = index < count ? 'fas fa-star' : 'far fa-star';
        });
    }
    
    // Review form submission
    document.getElementById('reviewForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (selectedRating === 0) {
            showNotification('Vui lòng chọn số sao đánh giá');
            return;
        }
        
        const reviewData = {
            productId: new URLSearchParams(window.location.search).get('id'),
            rating: selectedRating,
            title: document.getElementById('reviewTitle').value,
            content: document.getElementById('reviewContent').value,
            images: [],
            video: null
        };
        
        // Here you would normally send the review data to your API
        console.log('Review data:', reviewData);
        showNotification('Cảm ơn bạn đã gửi đánh giá!');
        
        // Reset form
        document.getElementById('reviewForm').reset();
        selectedRating = 0;
        highlightStars(0);
        document.getElementById('uploadPreview').innerHTML = '';
        uploadedFiles = [];
    });
}

// Xử lý upload ảnh
const imageUpload = document.getElementById('imageUpload');
const videoUpload = document.getElementById('videoUpload');
const uploadPreview = document.getElementById('uploadPreview');
let uploadedFiles = [];

if (imageUpload) {
    imageUpload.addEventListener('change', handleImageUpload);
}

if (videoUpload) {
    videoUpload.addEventListener('change', handleVideoUpload);
}

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
            <i class="fas fa-times"></i>
        </button>
    `;
    
    uploadPreview.appendChild(div);
    uploadedFiles.push({ type, file });
}

// Make removePreviewItem global
window.removePreviewItem = function(button) {
    const item = button.parentElement;
    const index = Array.from(uploadPreview.children).indexOf(item);
    uploadedFiles.splice(index, 1);
    item.remove();
};

function getImageCount() {
    return uploadedFiles.filter(file => file.type === 'image').length;
}

function getVideoCount() {
    return uploadedFiles.filter(file => file.type === 'video').length;
}

// Xử lý thêm vào giỏ hàng
function addToCart() {
    if (!currentProduct) {
        showNotification('Không thể thêm sản phẩm vào giỏ hàng');
        return;
    }
    
    // Lấy thông tin sản phẩm từ trang
    const productId = currentProduct.id;
    const quantity = parseInt(document.getElementById('quantityInput').value);
    
    // Lấy variant đã chọn (nếu có)
    let selectedVariant = null;
    const selectedVariantElement = document.querySelector('.variant-option.selected');
    if (selectedVariantElement) {
        selectedVariant = {
            id: selectedVariantElement.getAttribute('data-variant-id'),
            name: selectedVariantElement.getAttribute('data-value')
        };
    }
    
    // Kiểm tra xem đã chọn variant chưa (nếu có variants)
    if (currentProduct.productVariants && currentProduct.productVariants.length > 0 && !selectedVariant) {
        showNotification('Vui lòng chọn phân loại sản phẩm');
        return;
    }
    
    // Thêm vào giỏ hàng
    const cartItem = {
        productId,
        variant: selectedVariant,
        quantity,
        dateAdded: new Date().toISOString()
    };
    
    // Lấy giỏ hàng hiện tại từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Thêm sản phẩm mới
    cart.push(cartItem);
    
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
    if (badge) {
        badge.textContent = cart.length;
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.querySelector('p').textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Helper function to get cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeProductPage);