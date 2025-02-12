const PRODUCT_URL = 'http://localhost:8080/api/v1/products';

var shop;
var products = []; // Mảng lưu danh sách sản phẩm
var editingProductIndex = null;

const myShopGrid = document.getElementById("myShopGrid");
const addProductBtn = document.getElementById("addProductBtn");
const productModal = document.getElementById("productModal");
const editProductCloseModalBtn = document.getElementById("editProductCloseModalBtn");
const editShopCloseModalBtn = document.getElementById("editShopCloseModalBtn");
const productForm = document.getElementById("productForm");
const modalTitle = document.getElementById("modalTitle");
const editProductBtn = document.getElementById("editProductBtn");
const deleteProductBtn = document.getElementById("deleteProductBtn");

const productAvaImageInput = document.getElementById("productAvaImage");
const productImageInput = document.getElementById("productImage");
const avaImagePreviewContainer = document.getElementById("avaImagePreviewContainer");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");

addProductBtn.addEventListener("click", () => {
    modalTitle.textContent = "Thêm sản phẩm";
    editingProductIndex = null;
    productForm.reset();
    productModal.classList.add("active");
});

editProductCloseModalBtn.addEventListener("click", () => {
    productModal.classList.remove("active");
});

productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let product = products[editingProductIndex];

    const newProduct = { 
        "shopId": shopId,
        "categoryId": productForm.productCategory.value,
        "name": productForm.productName.value,
        "description": productForm.product,
        "basePrice": productForm.productPrice.value,
        "stockQuantity": productForm.productQuantity.value,
        "rating": 0,
        "productImageList": productForm.productImage.value,
        "productVariants": productForm.productVariants.value
    };

    if (editingProductIndex !== null) {
        products[editingProductIndex] = newProduct;
        const response = await fetch(PRODUCT_URL+"/"+product.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('access-token')
            },
            body: JSON.stringify(newProduct)
        })
        const data = await response.json();
        alert(data.message);
        editingProductIndex = null;
    } else {
        addProduct(newProduct);
    }
    productModal.classList.remove("active");
    productForm.reset();
    renderProducts();
});

async function fetch_products() {
    const response = await fetch(SHOP_PRODUCT_URL+"/"+shopId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('access-token')
        }
    });
    const data = await response.json();
    console.log(data);
    if(data.error) {
        alert(data.message);
    } else {
        products = data.data;

    }

}

function renderProducts() {
    let html = ``;
    let index = 0;
    for(const product of products) {
        let ava = "";
        for (const image of product.productImageList) {
            if(image.isThumbnail == true) {
                ava = image.imageUrl;
                break;
            }
        }
        console.log(ava);
        html += `
            <div class="product-card">
                <img src="${ava}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <a href="view-product.html?id=${product.id}">
                        <h3 class="product-title">${product.name}</h3>
                    </a>
                    <p class="product-price">${product.basePrice.toLocaleString()} VND</p>
                    <p class="product-quantity">Số lượng: ${product.stockQuantity}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="action-buttons">
                        <button class="btn btn-primary editProductBtn" data-index="${index}">Sửa</button>
                        <button class="btn btn-danger deleteProductBtn" data-index="${index}">Xóa</button>
                    </div>
                </div>
            </div>
        `
        index++;
    }
    myShopGrid.innerHTML = html;
    document.querySelectorAll(".editProductBtn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            editProduct(event.target.getAttribute("data-index"));
        });
    });

    document.querySelectorAll(".deleteProductBtn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            deleteProduct(event.target.getAttribute("data-index"));
        });
    });
}

async function addProduct() {
    const response = await fetch(PRODUCT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('access-token')
        },
        body: JSON.stringify({
            "shopId": shopId,
            "categoryId": productForm.productCategory.value,
            "name": productForm.productName.value,
            "description": productForm.product,
            "basePrice": productForm.productPrice.value,
            "stockQuantity": productForm.productQuantity.value
        })
    })
    const data = await response.json();
    if(!data.ok) {
        alert(data.message);
    } else {
        products.push(data.data);
    }
    renderProducts();
}

function editProduct(index) {
    const product = products[index];
    editingProductIndex = index;
    modalTitle.textContent = "Sửa sản phẩm";
    productForm.productName.value = product.name;
    productForm.productPrice.value = product.basePrice;
    productModal.classList.add("active");
    
}

async function deleteProduct(index) {
    confirm("Bạn có chắc muốn xóa sản phẩm này?");
    if(confirm == true) {
        let productId = products[index].id;
        fetch(PRODUCT_URL+"/"+productId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('access-token')
            }
        });
        const data = await response.json();
        console.log(data);
        alert(data.message);

        products.splice(index, 1);
        renderProducts();
    }
}

// Xử lý ảnh đại diện (chỉ 1 ảnh)
productAvaImageInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    avaImagePreviewContainer.innerHTML = ""; // Xóa ảnh cũ
    if (file) {
        const imgElement = createImagePreview(file, () => {
            productAvaImageInput.value = ""; // Xóa input file khi xóa ảnh
            avaImagePreviewContainer.innerHTML = ""; // Xóa ảnh hiển thị
        });
        avaImagePreviewContainer.appendChild(imgElement);
    }
});

// Xử lý nhiều ảnh sản phẩm
productImageInput.addEventListener("change", function (event) {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
        const imgElement = createImagePreview(file, () => {
            imgElement.remove(); // Xóa ảnh khỏi giao diện
            removeFileFromInput(productImageInput, file);
        });
        imagePreviewContainer.appendChild(imgElement);
    });
});

// Hàm tạo ảnh preview với nút xóa
function createImagePreview(file, onDelete) {
    const reader = new FileReader();
    const container = document.createElement("div");
    container.classList.add("image-preview");

    const img = document.createElement("img");
    img.classList.add("preview-image");
    img.alt = "Preview";

    const closeButton = document.createElement("button");
    closeButton.classList.add("delete-btn");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", onDelete);

    reader.onload = function (e) {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);

    container.appendChild(img);
    container.appendChild(closeButton);
    return container;
}

// Hàm xóa file khỏi input[type="file"]
function removeFileFromInput(inputElement, fileToRemove) {
    const dt = new DataTransfer();
    Array.from(inputElement.files).forEach((file) => {
        if (file !== fileToRemove) {
            dt.items.add(file);
        }
    });
    inputElement.files = dt.files;
}

window.editProduct = editProduct; // Để gọi được từ HTML
window.deleteProduct = deleteProduct; // Để gọi được từ HTML

