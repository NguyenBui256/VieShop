// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Here you would typically make an API call to your backend
        // For demo purposes, we'll just simulate a successful login
        const userData = {
            email,
            name: 'User Demo',
            token: 'demo-token'
        };

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));

        // Redirect to home page
        window.location.href = 'index.html';
    });
}

// Handle register form submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }

        // Here you would typically make an API call to your backend
        // For demo purposes, we'll just simulate a successful registration
        const userData = {
            email,
            name: 'User Demo',
            token: 'demo-token'
        };

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));

        // Redirect to home page
        window.location.href = 'index.html';
    });
}

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user && !window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
        window.location.href = 'login.html';
    }
}

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', checkAuth);