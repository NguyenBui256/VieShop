import { getCookie } from "./auth.js";

const PAYOS_URL = 'http://localhost:8080/api/v1/order-payos/create';
const PAYMENT_URL = 'http://localhost:8080/api/v1/payment';
const ADDRESS_URL = 'http://localhost:8080/api/v1/address/personal-address';
const ORDER_URL = 'http://localhost:8080/api/v1/orders';
const ITEM_URL = 'http://localhost:8080/api/v1/items';

var cart = JSON.parse(localStorage.getItem('cart')) || [];
var user = JSON.parse(localStorage.getItem('user'));

// Checkout function
async function checkout() {
    if (getTotalPrice() == 0) {
        alert("Giỏ hàng trống!");
        return;
    }
    const select = document.getElementById("addressSelect");
    if (!select.value) {
        alert("Vui lòng chọn địa chỉ giao hàng!");
        return;
    }


    const order = await createOrder();
    for(const item of cart) {
        await createOrderItem(item, order);
    }
    let payOSrequestBody = {
        "productName": "Thanh toan hoa don dat hang VieShop",
        "description": `Thanh toan don hang ${order.id}`,
        "returnUrl": "http://127.0.0.1:3000/success.html",
        "price": getTotalPrice(),
        "cancelUrl": "http://127.0.0.1:3000/cancel.html"
    }

    try {
        const response = await fetch(PAYOS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie('access-token')
            },
            body: JSON.stringify(payOSrequestBody)
        });
        let jsonObject = await response.json();
        localStorage.setItem('lastOrderId', order.id);
        localStorage.setItem('lastTransactionId', jsonObject.data.orderCode);
        console.log(jsonObject);

        let transaction = {
            "orderId": order.id,
            "userId": user.id, 
            "transactionId": jsonObject.data.orderCode,
            "amount": jsonObject.data.amount,
            "status": jsonObject.data.status,
            "description": jsonObject.data.description,
            "checkoutUrl": jsonObject.data.checkoutUrl
        };
        
        await fetch(PAYMENT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie('access-token')
            },
            body: JSON.stringify(transaction)
        });

        window.open(transaction.checkoutUrl, "_self");

    } catch (error) {
        console.error("Lỗi khi thanh toán: ", error);
    }
    return;
}

async function createOrder() {
    let requestBody = { 
        "userId": user.id,
        "addressId": document.getElementById('addressSelect').options[document.getElementById('addressSelect').selectedIndex].getAttribute('address-id'),
        "totalAmount": getTotalPrice(),
        "status": "PENDING",
        "shippingMethod": "FREESHIP",
        "shippingFee": 0,
        "isDelete": false
    }
    try {
        const response = await fetch(ORDER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + getCookie('access-token')
            },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng: ", error);
        return null;
    }
}

function getTotalPrice() {
    let sum = 0;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    for(const item of cart) {
        sum += item.variant.price * item.quantity;
    }
    return sum;
}

async function loadAddresses() {
    var sampleAddresses = [];

    const response = await fetch(ADDRESS_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + getCookie('access-token')
        }
    })
    const data = await response.json();
    console.log(data);
    if (data.error) {
        alert(data.message);
    } else {
        sampleAddresses = data.data;
        console.log(sampleAddresses);
    }

    const addressSelect = document.getElementById('addressSelect'); // Thẻ <select> chứa danh sách địa chỉ

    sampleAddresses.forEach((address, index) => {
        const option = document.createElement('option');
        option.className = 'address-item';
        option.setAttribute('address-id', address.id);
        option.value = index; // Lưu index để có thể lấy dữ liệu khi chọn
        option.textContent = `${address.addressTitle} - ${address.streetAddress}, ${address.ward}, ${address.district}, ${address.province}`;
        addressSelect.appendChild(option);
    });
    return;
}

async function createOrderItem(item, order) {
    console.log(item);
    let requestBody = {
        "orderId": order.id,
        "productId": item.productId,
        "variantId": item.variant.id,
        "quantity": item.quantity,
        "isDelete": false
    }
    const response = await fetch(ITEM_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + getCookie('access-token')
        },
        body: JSON.stringify(requestBody)
    });
    const data = await response.json();
    console.log(item);
    console.log(data.message);
}


document.getElementById('checkoutBtn').addEventListener('click', checkout);

document.addEventListener('DOMContentLoaded', async () => {
    await loadAddresses();
});