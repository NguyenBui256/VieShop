// Handle login form submission
const LOGIN_URL = 'http://localhost:8080/api/v1/auth/sign-in'
const REGIS_URL = 'http://localhost:8080/api/v1/auth/sign-up'

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

async function login(username, password) {
    const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            "username": username, 
            "password": password 
        })
    });
    const data = await response.json();
    if (data.error) {
        alert(data.message);
    } else {
        localStorage.setItem('isLogin', true);
        // localStorage.setItem('access-token', data.data.access_token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setCookie('access-token', data.data.access_token, 1);
        window.location.href = 'index.html';
    }
}

// Handle register form submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        register();
    });
}

async function register() {
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const sdt = document.getElementById('phoneNumber').value;
    const thanhPho = document.getElementById('thanhPho').value;
    const quan = document.getElementById('quan').value;
    const phuong = document.getElementById('phuong').value;
    const diachi = document.getElementById('diaChi').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
        
    if (password !== confirmPassword) {
        alert('Mật khẩu không khớp!');
        return;
    }

    // Here you would typically make an API call to your backend
    // For demo purposes, we'll just simulate a successful registration
    const userData = {
        "username": username,
        "email": email,
        "password": password,
        "phoneNumber": sdt,
        "fullName": fullname,
        "thanhPho": thanhPho,
        "quan": quan,
        "phuong": phuong,
        "diaChiNha": diachi
    };

    const response = await fetch(REGIS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    alert(data.message);
}

// Check if user is logged in
function checkAuth() {
    const isLogin = localStorage.getItem('isLogin') || "";
    if ((!isLogin || isLogin === "") && !window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
        window.location.href = 'login.html';
    }
}

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', checkAuth);