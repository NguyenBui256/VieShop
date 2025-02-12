const ORDER_URL_OF_USER = "http://localhost:8080/api/v1/orders/belong-to-user";
const user = JSON.parse(localStorage.getItem('user'));
const address = JSON.parse(sessionStorage.getItem('user-address'));
const product = JSON.parse(sessionStorage.getItem('products'));
var orders = [];

function toggleEditMode() {
    const inputs = document.querySelectorAll('.form-input');
    const editButton = document.getElementById('editButton');
    const submitButton = document.getElementById('submitButton');

    const isDisabled = inputs[0].disabled;

    inputs.forEach(input => input.disabled = !isDisabled);

    if (isDisabled) {
        editButton.textContent = "Hủy chỉnh sửa";
        submitButton.style.display = "inline-block";
    } else {
        editButton.textContent = "Chỉnh sửa thông tin";
        submitButton.style.display = "none";
    }
}

function getAddressFromId(id) {
    for(const a of address) {
        if(a.id == id) {
            return a;
        }
    }   
    return null;
}

function toggleChangePassword(show) {
    const overlay = document.getElementById('changePasswordOverlay');
    overlay.style.display = show ? 'flex' : 'none';
}

document.getElementById('profileForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    toggleEditMode();
    updateUser();
});

document.getElementById('changePasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    toggleChangePassword(false);
    updatePassword();
});

async function fetch_order() {
    try {
        const response = await fetch(ORDER_URL_OF_USER+"/"+user.id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('access-token')
            }
        });
        const data = await response.json();
        console.log("Cac don hang: ");
        console.log(data.data);
        orders = data.data;
    } catch (error) {
        console.error("Không thể tải đơn hàng. Vui lòng thử lại sau.");
        return;
    }


}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function load_order() {
    const orderList = document.getElementById("orderList");
    for(const order of orders) {
        const orderItem = document.createElement("div");
        orderItem.classList.add("order-item");
        orderItem.innerHTML = `
            <div class="order-header">
                <span>Đơn hàng #${order.id}</span>
                <span class="order-total">Tổng tiền: ${formatPrice(order.totalAmount)}</span>
                <span class="order-date">${order.createdAt}</span>
            </div>
            <div class="order-content">
                <span>Trạng thái: ${order.status}</span>
                <span>Hình thức giao hàng: ${order.shippingMethod}</span>
                <span>Giao đến: ${getAddressFromId(order.addressId)}</span>
            </div>
        `;

        // <div class="order-details" id="order_${order.id}_item_list"></div>

        orderItem.addEventListener("click", () => {
            const details = orderItem.querySelector(".order-details");
            details.style.display = details.style.display === "none" ? "block" : "none";
        });
        orderList.appendChild(orderItem);
    };
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetch_order();
    load_order();
});