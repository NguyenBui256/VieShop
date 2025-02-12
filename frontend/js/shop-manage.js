const SHOP_GET_URL = 'http://localhost:8080/api/v1/shops/owning-shop'
const SHOP_URL = 'http://localhost:8080/api/v1/shops'

var shopList = document.getElementById("shopList");
var addShopBtn = document.getElementById("addShopBtn");
var shopModal = document.getElementById("shopModal");
var shopForm = document.getElementById("shopForm");
var closeModalBtn = document.getElementById("closeModalBtn");

let shops = [];
let isEditing = false;
let editingIndex = null;
var user = JSON.parse(localStorage.getItem('user'));

async function fetch_shop() {
    const response = await fetch(SHOP_GET_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('access-token')
        }
    });
    const data = await response.json();
    if (data.error) {
        alert(data.message);
    } else {
        shops = data.data;
        console.log(shops);
        sessionStorage.setItem('shops', JSON.stringify(shops));
    }
}

// Hiển thị modal
addShopBtn.addEventListener("click", () => {
    shopModal.style.display = "flex";
    isEditing = false;
    shopForm.reset();
    document.getElementById("modalTitle").textContent = "Thêm cửa hàng";
});

// Đóng modal
closeModalBtn.addEventListener("click", () => {
    shopModal.style.display = "none";
});

// Xử lý form thêm/sửa
shopForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    var shopName = document.getElementById("shopName").value;
    var shopAddress = document.getElementById("shopAddress").value;
    var shopPhoneNumber = document.getElementById("shopPhoneNumber").value;
    var shopDescription = document.getElementById("shopDescription").value;
    var shopAvatarUrl = document.getElementById("shopAvatarUrl").value;
    var shopBannerUrl = document.getElementById("shopBannerUrl").value;

    if (isEditing) {
        shops[editingIndex] = { shopName, shopAddress, shopDescription, shopPhoneNumber, shopAvatarUrl, shopBannerUrl };
        await callUpdateShopApi();
    } else {
        await callAddShopApi();
    }

    renderShops();
    shopModal.style.display = "none";
});

async function callAddShopApi() {
    const response = await fetch(SHOP_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('access-token')
        },
        body: JSON.stringify({
            "userId": user.id,
            "name": document.getElementById("shopName").value,
            "description": document.getElementById("shopDescription").value,
            "avatarUrl": document.getElementById("shopAvatarUrl").value,
            "bannerUrl": document.getElementById("shopBannerUrl").value,
            "address": document.getElementById("shopAddress").value,
            "phone": document.getElementById("shopPhoneNumber").value,
            "rating": 0
        })
    });
    const data = await response.json();
    if(data.data != null) {
        shops.push(data.data);
    } else {
        alert(data.message);
    }
}

// Render danh sách cửa hàng
function renderShops() {
    shopList.innerHTML = "";

    shops.forEach((shop, index) => {
        const shopItem = document.createElement("div");
        shopItem.className = "shop-item";

        shopItem.innerHTML = `
            <div class="shop-details">
                <div class="shop-avatar">
                    <img src="${shop.avatarUrl}" class="shop-avatar" alt="Avatar cửa hàng" id="shopAvatar">
                </div>
                <div class="shop-text">
                    <a href="shop.html?id=${shop.id}">
                        <h3>${shop.name}</h3>
                    </a>
                        <p>Địa chỉ: ${shop.address}</p>
                        <p>Mô tả: ${shop.description}</p>
                        <p>Số điện thoại: ${shop.phone}</p>
                        <p>Số sao đánh giá: ${shop.rating} <i class="fa-solid fa-star"></i></p>
                </div>
            </div>
        `;

        shopList.appendChild(shopItem);
    });
}

// Sửa cửa hàng
function editShop(index) {
    const shop = shops[index];
    document.getElementById("shopName").value = shop.name;
    document.getElementById("shopLocation").value = shop.address;

    isEditing = true;
    editingIndex = index;

    document.getElementById("modalTitle").textContent = "Sửa cửa hàng";
    shopModal.style.display = "flex";
}

// Xóa cửa hàng
function deleteShop(index) {
    shops.splice(index, 1);
    renderShops();
}

window.onload = async () => {
    await fetch_shop();
    renderShops();
}
