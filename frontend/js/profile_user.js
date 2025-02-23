import { getCookie } from "./auth.js";

const USERINFO_URL = 'http://localhost:8080/api/v1/users/personal-info';
const FIXINFO_URL = 'http://localhost:8080/api/v1/users/fix-personal-info';
const FIXPASS_URL = 'http://localhost:8080/api/v1/users/update-password';
const LOGOUT_URL = 'http://localhost:8080/api/v1/logout'

async function fetchUser(){
    const response = await fetch(USERINFO_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + getCookie('access-token')
        }
    });
    const data = await response.json();
    if (data.error) {
        alert(data.message);
    } else {
        let user = data.data;
        console.log(user);
        document.getElementById('fullName').value = user.fullName;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phoneNumber;
        document.getElementById('username').value = user.username;
    }
}

async function updateUser() {
    const response = await fetch(FIXINFO_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + getCookie('access-token')
        },
        body: JSON.stringify({
            "username": "",
            "email": document.getElementById('email').value,
            "password": "",
            "phoneNumber": document.getElementById('phone').value,
            "fullName": document.getElementById('fullName').value,
            "thanhPho": null,
            "quan": null,
            "phuong": null,
            "diaChiNha": null
        })
    })
    const data = await response.json();
    alert(data.message);
}

async function updatePassword() {
    let oldPassword = document.getElementById('oldPassword').value;
    let newPassword = document.getElementById('newPassword').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    if (newPassword !== confirmPassword) {
        alert('Mật khẩu mới không khớp!');
        return;
    }
    const response = await fetch(FIXPASS_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + getCookie('access-token')
        },
        body: JSON.stringify({
            "oldPassword": oldPassword,
            "newPassword": newPassword
        })
    })
    const data = await response.json();
    alert(data.message);
}

async function logout() {
    const isLogout = confirm("Bạn có chắc chắn muốn đăng xuất?");
    if(isLogout) {
        const response = await fetch(LOGOUT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + getCookie('access-token')
            }
        });
        const data = await response.json();
        if (data.error) {
            alert(data.message);
        } else {
            document.cookie = "";
            localStorage.clear();
            window.location.href = 'login.html';
        }
    }
}

document.getElementById('logoutBtn').addEventListener('click', logout);

// document.getElementById('updateInfo').addEventListener('click', updateUser);


document.addEventListener('DOMContentLoaded', async () => {
    await fetchUser();
});