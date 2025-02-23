import { getCookie } from "./auth.js";

const PAYMENT_URL = "http://localhost:8080/api/v1/order-payos/cancel";
const SAVE_PAYMENT_URL = "http://localhost:8080/api/v1/payment"
const orderId = localStorage.getItem('lastOrderId');
const transactionId = localStorage.getItem('lastTransactionId');
const userId = JSON.parse(localStorage.getItem('user')).id;

async function checkout_result() {
    const response = await fetch(PAYMENT_URL + "/" + transactionId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('access-token')
        }
    });
    const data = await response.json();
    console.log(data);
    return;
}

window.onload = async () => {
    await checkout_result();
}