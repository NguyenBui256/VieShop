const CHECKOUT_URL = "http://localhost:8080/api/v1/order-payos";
const SAVE_PAYMENT_URL = "http://localhost:8080/api/v1/payment"
const orderId = localStorage.getItem('lastOrderId');
const transactionId = localStorage.getItem('lastTransactionId');
const userId = JSON.parse(localStorage.getItem('user')).id;

async function checkout_result() {
    const response = await fetch(CHECKOUT_URL + "/" + transactionId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('access-token')
        }
    });
    const data = await response.json();
    console.log(data);
    let payment = data.data;

    let requestBody = {
        "orderId": orderId,
        "userId": userId,
        "transactionId": payment.orderCode,
        "amount": payment.amount,
        "status": payment.status,
        "description": payment.transactions[0].description,
        "isDelete": false
    }
    console.log(requestBody);
    const response2 = await fetch(SAVE_PAYMENT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('access-token')
        },
        body: JSON.stringify(requestBody)
    });
    const data2 = await response2.json();
    console.log(data2.message);
    return;
}

window.onload = async () => {
    await checkout_result();
}