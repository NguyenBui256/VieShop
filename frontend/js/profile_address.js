import { getCookie } from "./auth.js";

const ADDRESS_URL = 'http://localhost:8080/api/v1/address/personal-address';

// Hàm thêm địa chỉ mẫu (chạy ví dụ)
async function loadAddresses() {
    var sampleAddresses;
    const addressList = document.getElementById('addressList');

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
        sessionStorage.setItem('user-address', JSON.stringify(sampleAddresses));
        console.log(sampleAddresses);
    }

    sampleAddresses.forEach((address, index) => {
        const addressItem = document.createElement('div');
        addressItem.className = 'address-item';
        addressItem.innerHTML = `
            <div>
                <h4>${address.addressTitle}</h4>
                <p>${address.streetAddress + ", " + address.ward + ", " + address.district + ", " + address.province}</p>
            </div>
            <div class="address-actions">
                <button class="btn btn-primary" onclick="viewAddress(${index})">Xem</button>
                <button class="btn btn-secondary" onclick="editAddress(${index})">Sửa</button>
                <button class="btn btn-danger" onclick="deleteAddress(${index})">Xóa</button>
            </div>
        `;
        addressList.appendChild(addressItem);
    });
}

function addNewAddress() {
    alert('Chức năng thêm địa chỉ mới đang phát triển.');
}

document.getElementById('addAddressBtn').addEventListener('click', addNewAddress);

function viewAddress(index) {
    alert(`Xem chi tiết địa chỉ ${index + 1}`);
}

function editAddress(index) {
    alert(`Sửa địa chỉ ${index + 1}`);
}

function deleteAddress(index) {
    alert(`Xóa địa chỉ ${index + 1}`);
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadAddresses();
});