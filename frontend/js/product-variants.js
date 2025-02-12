const variantsGrid = document.getElementById("variantsGrid");
const addVariantBtn = document.getElementById("addVariantBtn");

// addVariantBtn.addEventListener("click", function () {
//     addVariant();
// });

function addVariant() {
    const variantDiv = document.createElement("div");
    variantDiv.classList.add("variant-item");

    variantDiv.innerHTML = `
        <label>Thuộc tính:</label>
        <input type="text" class="variant-attribute" placeholder="Ví dụ: Cỡ, Màu, ...">
        
        <label>Giá trị:</label>
        <input type="text" class="variant-value" placeholder="Ví dụ: Xanh, Đỏ, ...">
        
        <label>Số lượng:</label>
        <input type="number" class="variant-quantity" min="0" value="0">
        
        <label>Giá riêng:</label>
        <input type="number" class="variant-price" min="0" value="0">

        <button class="edit-variant">Sửa</button>
        <button class="delete-variant">Xóa</button>
    `;

    // Nút xóa
    variantDiv.querySelector(".delete-variant").addEventListener("click", function () {
        variantsGrid.removeChild(variantDiv);
    });

    // Nút sửa (cho phép chỉnh sửa lại input)
    variantDiv.querySelector(".edit-variant").addEventListener("click", function () {
        let inputs = variantDiv.querySelectorAll("input");
        inputs.forEach(input => input.toggleAttribute("disabled"));
    });

    // Thêm vào variantsGrid
    variantsGrid.appendChild(variantDiv);
}

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