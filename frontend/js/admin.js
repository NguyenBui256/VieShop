import { getCookie } from "./auth.js";

// API URLs
const API_BASE_URL = "http://localhost:8080/api/v1";
const ADMIN_BASE_URL = "http://localhost:8080/api/admin";
const USERS_API = `${ADMIN_BASE_URL}/users`;
const SHOPS_API = `${API_BASE_URL}/shops`;
const PRODUCTS_API = `${API_BASE_URL}/products`;
const ORDERS_API = `${ADMIN_BASE_URL}/orders`;
const CATEGORIES_API = `${API_BASE_URL}/categories`;

// Global variables
let currentPage = 1;
let itemsPerPage = 10;
let currentSection = "dashboard";
let currentUser = null;
let deleteItemId = null;
let deleteItemType = null;

// Check if user is admin
document.addEventListener("DOMContentLoaded", function() {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
        currentUser = JSON.parse(userStr);
        
        // Check if user is admin
        if (currentUser.role !== 'ADMIN') {
            // Redirect to home page if not admin
            window.location.href = 'welcome.html';
            return;
        }
        
        // Set admin name and avatar
        document.getElementById('adminName').textContent = currentUser.fullName || currentUser.username;
        if (currentUser.avatarUrl) {
            document.getElementById('adminAvatar').src = currentUser.avatarUrl;
        }
        
        // Initialize dashboard
        initDashboard();
    } else {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
    }
});

// Initialize dashboard
function initDashboard() {
    // Setup navigation
    setupNavigation();
    
    // Load dashboard data
    loadDashboardData();
    
    // Setup event listeners for modals
    setupModalListeners();
    
    // Setup settings listeners
    setupSettingsListeners();
}

// Setup navigation
function setupNavigation() {
    // Get all menu items
    const menuItems = document.querySelectorAll('.admin-menu-item');
    
    // Add click event listener to each menu item
    menuItems.forEach(item => {
        if (item.id === 'logoutBtn') {
            item.addEventListener('click', handleLogout);
        } else {
            item.addEventListener('click', function() {
                // Get section name from data attribute
                const section = this.getAttribute('data-section');
                
                // Switch to selected section
                switchSection(section);
                
                // Update active menu item
                menuItems.forEach(mi => mi.classList.remove('active'));
                this.classList.add('active');
            });
        }
    });
    
    // Toggle sidebar
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.admin-sidebar');
    
    toggleSidebarBtn.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });
}

// Switch section
function switchSection(section) {
    // Update current section
    currentSection = section;
    
    // Update section title
    document.getElementById('sectionTitle').textContent = section.charAt(0).toUpperCase() + section.slice(1);
    
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(s => s.classList.remove('active'));
    
    // Show selected section
    document.getElementById(`${section}-section`).classList.add('active');
    
    // Load section data
    loadSectionData(section);
}

// Load section data
function loadSectionData(section) {
    switch (section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'users':
            loadUsers();
            break;
        case 'shops':
            loadShops();
            break;
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'settings':
            // Settings are static, no need to load data
            break;
    }
}

// Handle logout
function handleLogout() {
    // Clear localStorage
    localStorage.removeItem('isLogin');
    localStorage.removeItem('user');
    
    // Clear cookies
    document.cookie = 'access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Setup modal listeners
function setupModalListeners() {
    // Get all modals
    const modals = document.querySelectorAll('.modal');
    const overlay = document.getElementById('overlay');
    
    // Close modal function
    function closeModal() {
        modals.forEach(modal => modal.style.display = 'none');
        overlay.style.display = 'none';
    }
    
    // Close modal when clicking on overlay
    overlay.addEventListener('click', closeModal);
    
    // Close modal when clicking on close button
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Close modal when clicking on cancel button
    document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Setup specific modal listeners
    setupUserModalListeners();
    setupShopModalListeners();
    setupProductModalListeners();
    setupCategoryModalListeners();
    setupOrderDetailModalListeners();
    setupDeleteConfirmModalListeners();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Create pagination
function createPagination(totalItems, containerId, callback) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const container = document.getElementById(containerId);
    
    container.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&laquo;';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            callback(currentPage);
            createPagination(totalItems, containerId, callback);
        }
    });
    container.appendChild(prevBtn);
    
    // Page buttons
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.toggle('active', i === currentPage);
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            callback(currentPage);
            createPagination(totalItems, containerId, callback);
        });
        container.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&raquo;';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            callback(currentPage);
            createPagination(totalItems, containerId, callback);
        }
    });
    container.appendChild(nextBtn);
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Fetch statistics
        const statsResponse = await fetch(`${ADMIN_BASE_URL}/statistics`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access-token')}`
            }
        });
        
        if (!statsResponse.ok) {
            throw new Error('Failed to fetch statistics');
        }
        
        const statsData = await statsResponse.json();
        
        // Update dashboard stats
        document.getElementById('totalUsers').textContent = statsData.data.totalUsers || 0;
        document.getElementById('totalShops').textContent = statsData.data.totalShops || 0;
        document.getElementById('totalProducts').textContent = statsData.data.totalProducts || 0;
        document.getElementById('totalOrders').textContent = statsData.data.totalOrders || 0;
        
        // Render charts
        renderSalesChart(statsData.data.salesData || []);
        renderUserGrowthChart(statsData.data.userGrowthData || []);
        
        // Load recent orders
        loadRecentOrders();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        
        // Set default values if API fails
        document.getElementById('totalUsers').textContent = '0';
        document.getElementById('totalShops').textContent = '0';
        document.getElementById('totalProducts').textContent = '0';
        document.getElementById('totalOrders').textContent = '0';
        
        // Render empty charts
        renderSalesChart([]);
        renderUserGrowthChart([]);
    }
}

// Load recent orders
async function loadRecentOrders() {
    try {
        const response = await fetch(`${ORDERS_API}/recent?limit=5`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access-token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch recent orders');
        }
        
        const data = await response.json();
        const orders = data.data || [];
        
        const recentOrdersTable = document.getElementById('recentOrdersTable');
        recentOrdersTable.innerHTML = '';
        
        if (orders.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" style="text-align: center;">No recent orders</td>';
            recentOrdersTable.appendChild(row);
            return;
        }
        
        orders.forEach(order => {
            const row = document.createElement('tr');
            
            const statusClass = getStatusClass(order.status);
            
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.user.fullName || order.user.username}</td>
                <td>${formatDate(order.createdAt)}</td>
                <td>${formatPrice(order.totalAmount)}</td>
                <td><span class="status-badge ${statusClass}">${order.status}</span></td>
            `;
            
            row.addEventListener('click', () => {
                showOrderDetails(order.id);
            });
            
            recentOrdersTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent orders:', error);
        
        const recentOrdersTable = document.getElementById('recentOrdersTable');
        recentOrdersTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">Failed to load recent orders</td></tr>';
    }
}

// Get status class for styling
function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'active':
            return 'status-active';
        case 'inactive':
            return 'status-inactive';
        case 'pending':
            return 'status-pending';
        case 'processing':
            return 'status-processing';
        case 'shipped':
            return 'status-shipped';
        case 'delivered':
            return 'status-delivered';
        case 'cancelled':
            return 'status-cancelled';
        default:
            return '';
    }
}

// Render sales chart
function renderSalesChart(salesData) {
    // If no data, create sample data
    if (!salesData || salesData.length === 0) {
        salesData = generateSampleSalesData();
    }
    
    const salesChart = echarts.init(document.getElementById('salesChart'));
    
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                const data = params[0].data;
                return `${params[0].axisValue}<br/>${params[0].marker}Sales: ${formatPrice(data)}`;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: salesData.map(item => item.date)
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function(value) {
                    return formatPrice(value).replace('₫', '');
                }
            }
        },
        series: [
            {
                name: 'Sales',
                type: 'line',
                smooth: true,
                lineStyle: {
                    width: 3,
                    shadowColor: 'rgba(0,0,0,0.3)',
                    shadowBlur: 10,
                    shadowOffsetY: 8
                },
                itemStyle: {
                    color: '#3498db'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(52, 152, 219, 0.8)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(52, 152, 219, 0.1)'
                        }
                    ])
                },
                data: salesData.map(item => item.amount)
            }
        ]
    };
    
    salesChart.setOption(option);
    
    // Handle resize
    window.addEventListener('resize', function() {
        salesChart.resize();
    });
}

// Render user growth chart
function renderUserGrowthChart(userData) {
    // If no data, create sample data
    if (!userData || userData.length === 0) {
        userData = generateSampleUserData();
    }
    
    const userGrowthChart = echarts.init(document.getElementById('userGrowthChart'));
    
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                return `${params[0].axisValue}<br/>${params[0].marker}New Users: ${params[0].data}`;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: userData.map(item => item.date)
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'New Users',
                type: 'bar',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#83bff6' },
                        { offset: 0.5, color: '#2ecc71' },
                        { offset: 1, color: '#27ae60' }
                    ])
                },
                data: userData.map(item => item.count)
            }
        ]
    };
    
    userGrowthChart.setOption(option);
    
    // Handle resize
    window.addEventListener('resize', function() {
        userGrowthChart.resize();
    });
}

// Generate sample sales data
function generateSampleSalesData() {
    const data = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const formattedDate = date.toLocaleDateString('vi-VN', {
            month: 'short',
            day: 'numeric'
        });
        
        // Generate random amount between 1M and 50M
        const amount = Math.floor(Math.random() * 49000000) + 1000000;
        
        data.push({
            date: formattedDate,
            amount: amount
        });
    }
    
    return data;
}

// Generate sample user data
function generateSampleUserData() {
    const data = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        
        const formattedDate = date.toLocaleDateString('vi-VN', {
            month: 'short',
            year: 'numeric'
        });
        
        // Generate random count between 5 and 100
        const count = Math.floor(Math.random() * 95) + 5;
        
        data.push({
            date: formattedDate,
            count: count
        });
    }
    
    return data;
}

// User Management
// ---------------

// Load users
async function loadUsers(page = 1) {
    try {
        currentPage = page;
        
        // Get filter values
        const searchQuery = document.getElementById('userSearchInput').value;
        const roleFilter = document.getElementById('userRoleFilter').value;
        
        // Build query parameters
        let queryParams = `?page=${page - 1}&size=${itemsPerPage}`;
        if (searchQuery) {
            queryParams += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (roleFilter) {
            queryParams += `&role=${encodeURIComponent(roleFilter)}`;
        }
        
        const response = await fetch(`${USERS_API}${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access-token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        const users = data.data.content || [];
        const totalItems = data.data.totalElements || 0;
        
        renderUsers(users);
        createPagination(totalItems, 'usersPagination', loadUsers);
    } catch (error) {
        console.error('Error loading users:', error);
        
        const usersTable = document.getElementById('usersTable');
        usersTable.innerHTML = '<tr><td colspan="7" style="text-align: center;">Failed to load users</td></tr>';
    }
}

// Render users
function renderUsers(users) {
    const usersTable = document.getElementById('usersTable');
    usersTable.innerHTML = '';
    
    if (users.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" style="text-align: center;">No users found</td>';
        usersTable.appendChild(row);
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.fullName || '-'}</td>
            <td>${user.phoneNumber || '-'}</td>
            <td>${user.role || 'USER'}</td>
            <td class="actions">
                <button class="edit-btn" title="Edit User"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Delete User"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add event listeners to action buttons
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => {
            showEditUserModal(user);
        });
        
        deleteBtn.addEventListener('click', () => {
            showDeleteConfirmModal('user', user.id, user.username);
        });
        
        usersTable.appendChild(row);
    });
}

// Setup user modal listeners
function setupUserModalListeners() {
    const addUserBtn = document.getElementById('addUserBtn');
    const userModal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    const overlay = document.getElementById('overlay');
    
    // Show add user modal
    addUserBtn.addEventListener('click', () => {
        showAddUserModal();
    });
    
    // Handle user form submission
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userId = userForm.getAttribute('data-user-id');
        const isEditing = !!userId;
        
        const userData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            fullName: document.getElementById('fullName').value,
            phoneNumber: document.getElementById('phone').value,
            role: document.getElementById('role').value,
            status: document.getElementById('status').value
        };
        
        // Add password only if provided (for editing) or required (for adding)
        const password = document.getElementById('password').value;
        if (password || !isEditing) {
            userData.password = password;
        }
        
        try {
            let response;
            
            if (isEditing) {
                // Update existing user
                response = await fetch(`${USERS_API}/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('access-token')}`
                    },
                    body: JSON.stringify(userData)
                });
            } else {
                // Create new user
                response = await fetch(USERS_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('access-token')}`
                    },
                    body: JSON.stringify(userData)
                });
            }
            
            if (!response.ok) {
                throw new Error(`Failed to ${isEditing ? 'update' : 'create'} user`);
            }
            
            // Close modal and reload users
            userModal.style.display = 'none';
            overlay.style.display = 'none';
            loadUsers(currentPage);
            
            // Show success message
            alert(`User ${isEditing ? 'updated' : 'created'} successfully`);
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} user:`, error);
            alert(`Failed to ${isEditing ? 'update' : 'create'} user. Please try again.`);
        }
    });
    
    // Setup filter button
    const userFilterBtn = document.getElementById('userFilterBtn');
    userFilterBtn.addEventListener('click', () => {
        loadUsers(1); // Reset to first page when filtering
    });
}

// Show add user modal
function showAddUserModal() {
    const userModal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    const overlay = document.getElementById('overlay');
    const userModalTitle = document.getElementById('userModalTitle');
    
    // Reset form
    userForm.reset();
    userForm.removeAttribute('data-user-id');
    
    // Update modal title
    userModalTitle.textContent = 'Add User';
    
    // Show password field (required for new users)
    document.getElementById('password').required = true;
    
    // Show modal
    userModal.style.display = 'flex';
    overlay.style.display = 'block';
}

// Show edit user modal
function showEditUserModal(user) {
    const userModal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    const overlay = document.getElementById('overlay');
    const userModalTitle = document.getElementById('userModalTitle');
    
    // Fill form with user data
    document.getElementById('username').value = user.username || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('fullName').value = user.fullName || '';
    document.getElementById('phone').value = user.phoneNumber || '';
    document.getElementById('role').value = user.role || 'USER';
    document.getElementById('status').value = user.status || 'active';
    
    // Clear password field (not required for editing)
    document.getElementById('password').value = '';
    document.getElementById('password').required = false;
    
    // Set user ID for form submission
    userForm.setAttribute('data-user-id', user.id);
    
    // Update modal title
    userModalTitle.textContent = 'Edit User';
    
    // Show modal
    userModal.style.display = 'flex';
    overlay.style.display = 'block';
}

// Shop Management
// --------------

// Load shops
async function loadShops(page = 1) {
    try {
        currentPage = page;
        
        // Get filter values
        const searchQuery = document.getElementById('shopSearchInput').value;
        const statusFilter = document.getElementById('shopStatusFilter').value;
        
        // Build query parameters
        let queryParams = `?page=${page - 1}&size=${itemsPerPage}`;
        if (searchQuery) {
            queryParams += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (statusFilter) {
            queryParams += `&status=${encodeURIComponent(statusFilter)}`;
        }
        
        const response = await fetch(`${SHOPS_API}${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access-token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch shops');
        }
        
        const data = await response.json();
        const shops = data.data.content || [];
        const totalItems = data.data.totalElements || 0;
        
        renderShops(shops);
        createPagination(totalItems, 'shopsPagination', loadShops);
        
        // Also load users for shop owner dropdown
        loadUsersForShopDropdown();
    } catch (error) {
        console.error('Error loading shops:', error);
        
        const shopsTable = document.getElementById('shopsTable');
        shopsTable.innerHTML = '<tr><td colspan="8" style="text-align: center;">Failed to load shops</td></tr>';
    }
}

// Render shops
function renderShops(shops) {
    const shopsTable = document.getElementById('shopsTable');
    shopsTable.innerHTML = '';
    
    if (shops.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="8" style="text-align: center;">No shops found</td>';
        shopsTable.appendChild(row);
        return;
    }
    
    shops.forEach(shop => {
        const row = document.createElement('tr');
        
        const statusClass = getStatusClass(shop.status || 'active');
        
        row.innerHTML = `
            <td>${shop.id}</td>
            <td>${shop.name}</td>
            <td>${shop.user ? (shop.user.fullName || shop.user.username) : '-'}</td>
            <td>${shop.address || '-'}</td>
            <td>${shop.phone || '-'}</td>
            <td>${shop.rating || '0'} <i class="fas fa-star" style="color: #f39c12;"></i></td>
            <td><span class="status-badge ${statusClass}">${shop.status || 'active'}</span></td>
            <td class="actions">
                <button class="view-btn" title="View Shop"><i class="fas fa-eye"></i></button>
                <button class="edit-btn" title="Edit Shop"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Delete Shop"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add event listeners to action buttons
        const viewBtn = row.querySelector('.view-btn');
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        viewBtn.addEventListener('click', () => {
            window.location.href = `shop.html?id=${shop.id}`;
        });
        
        editBtn.addEventListener('click', () => {
            showEditShopModal(shop);
        });
        
        deleteBtn.addEventListener('click', () => {
            showDeleteConfirmModal('shop', shop.id, shop.name);
        });
        
        shopsTable.appendChild(row);
    });
}

// Load users for shop owner dropdown
async function loadUsersForShopDropdown() {
    try {
        const response = await fetch(`${USERS_API}?role=SELLER&size=100`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access-token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        const users = data.data.content || [];
        
        const shopOwnerSelect = document.getElementById('shopOwner');
        shopOwnerSelect.innerHTML = '<option value="">Select Owner</option>';
        
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.fullName || user.username;
            shopOwnerSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading users for shop dropdown:', error);
    }
}

// Setup shop modal listeners
function setupShopModalListeners() {
    const addShopBtn = document.getElementById('addShopBtn');
    const shopModal = document.getElementById('shopModal');
    const shopForm = document.getElementById('shopForm');
    const overlay = document.getElementById('overlay');
    
    // Show add shop modal
    addShopBtn.addEventListener('click', () => {
        showAddShopModal();
    });
    
    // Handle shop form submission
    shopForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const shopId = shopForm.getAttribute('data-shop-id');
        const isEditing = !!shopId;
        
        const shopData = {
            name: document.getElementById('shopName').value,
            userId: document.getElementById('shopOwner').value,
            description: document.getElementById('shopDescription').value,
            address: document.getElementById('shopAddress').value,
            phone: document.getElementById('shopPhone').value,
            avatarUrl: document.getElementById('shopAvatarUrl').value,
            bannerUrl: document.getElementById('shopBannerUrl').value,
            status: document.getElementById('shopStatus').value
        };
        
        try {
            let response;
            
            if (isEditing) {
                // Update existing shop
                response = await fetch(`${SHOPS_API}/${shopId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('access-token')}`
                    },
                    body: JSON.stringify(shopData)
                });
            } else {
                // Create new shop
                response = await fetch(SHOPS_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('access-token')}`
                    },
                    body: JSON.stringify(shopData)
                });
            }
            
            if (!response.ok) {
                throw new Error(`Failed to ${isEditing ? 'update' : 'create'} shop`);
            }
            
            // Close modal and reload shops
            shopModal.style.display = 'none';
            overlay.style.display = 'none';
            loadShops(currentPage);
            
            // Show success message
            alert(`Shop ${isEditing ? 'updated' : 'created'} successfully`);
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} shop:`, error);
            alert(`Failed to ${isEditing ? 'update' : 'create'} shop. Please try again.`);
        }
    });
    
    // Setup filter button
    const shopFilterBtn = document.getElementById('shopFilterBtn');
    shopFilterBtn.addEventListener('click', () => {
        loadShops(1); // Reset to first page when filtering
    });
}

// Show add shop modal
function showAddShopModal() {
    const shopModal = document.getElementById('shopModal');
    const shopForm = document.getElementById('shopForm');
    const overlay = document.getElementById('overlay');
    const shopModalTitle = document.getElementById('shopModalTitle');
    
    // Reset form
    shopForm.reset();
    shopForm.removeAttribute('data-shop-id');
    
    // Update modal title
    shopModalTitle.textContent = 'Add Shop';
    
    // Show modal
    shopModal.style.display = 'flex';
    overlay.style.display = 'block';
}

// Show edit shop modal
function showEditShopModal(shop) {
    const shopModal = document.getElementById('shopModal');
    const shopForm = document.getElementById('shopForm');
    const overlay = document.getElementById('overlay');
    const shopModalTitle = document.getElementById('shopModalTitle');
    
    // Fill form with shop data
    document.getElementById('shopName').value = shop.name || '';
    document.getElementById('shopOwner').value = shop.user ? shop.user.id : '';
    document.getElementById('shopDescription').value = shop.description || '';
    document.getElementById('shopAddress').value = shop.address || '';
    document.getElementById('shopPhone').value = shop.phone || '';
    document.getElementById('shopAvatarUrl').value = shop.avatarUrl || '';
    document.getElementById('shopBannerUrl').value = shop.bannerUrl || '';
    document.getElementById('shopStatus').value = shop.status || 'active';
    
    // Set shop ID for form submission
    shopForm.setAttribute('data-shop-id', shop.id);
    
    // Update modal title
    shopModalTitle.textContent = 'Edit Shop';
    
    // Show modal
    shopModal.style.display = 'flex';
    overlay.style.display = 'block';
}

// Product Management
// -----------------

// Load products
async function loadProducts(page = 1) {
    try {
        currentPage = page;
        
        // Get filter values
        const searchQuery = document.getElementById('productSearchInput').value;
        const categoryFilter = document.getElementById('productCategoryFilter').value;
        const shopFilter = document.getElementById('productShopFilter').value;
        
        // Build query parameters
        let queryParams = `?page=${page - 1}&size=${itemsPerPage}`;
        if (searchQuery) {
            queryParams += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (categoryFilter) {
            queryParams += `&categoryId=${encodeURIComponent(categoryFilter)}`;
        }
        if (shopFilter) {
            queryParams += `&shopId=${encodeURIComponent(shopFilter)}`;
        }
        
        const response = await fetch(`${PRODUCTS_API}${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access-token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        const products = data.data.content || [];
        const totalItems = data.data.totalElements || 0;
        
        renderProducts(products);
        createPagination(totalItems, 'productsPagination', loadProducts);
        
        // Also load categories and shops for dropdowns if not already loaded
        if (!document.getElementById('productCategoryFilter').options.length > 1) {
            loadCategoriesForDropdown();
        }
        if (!document.getElementById('productShopFilter').options.length > 1) {
            loadShopsForDropdown();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        
        const productsTable = document.getElementById('productsTable');
        productsTable.innerHTML = '<tr><td colspan="8" style="text-align: center;">Failed to load products</td></tr>';
    }
}

// Render products
function renderProducts(products) {
    const productsTable = document.getElementById('productsTable');
    productsTable.innerHTML = '';
    
    if (products.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="8" style="text-align: center;">No products found</td>';
        productsTable.appendChild(row);
        return;
    }
    
    products.forEach(product => {
        const row = document.createElement('tr');
        
        // Find thumbnail image
        let thumbnailUrl = 'assets/default-product.png';
        if (product.productImageList && product.productImageList.length > 0) {
            const thumbnail = product.productImageList.find(img => img.isThumbnail) || product.productImageList[0];
            thumbnailUrl = thumbnail.imageUrl;
        }
        
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${thumbnailUrl}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
            <td>${product.name}</td>
            <td>${product.shop ? product.shop.name : '-'}</td>
            <td>${product.category ? product.category.name : '-'}</td>
            <td>${formatPrice(product.price)}</td>
            <td>${product.quantity || 0}</td>
            <td class="actions">
                <button class="view-btn" title="View Product"><i class="fas fa-eye"></i></button>
                <button class="edit-btn" title="Edit Product"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Delete Product"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add event listeners to action buttons
        const viewBtn = row.querySelector('.view-btn');
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        viewBtn.addEventListener('click', () => {
            window.location.href = `view-product.html?id=${product.id}`;
        });
        
        editBtn.addEventListener('click', () => {
            showEditProductModal(product);
        });
        
        deleteBtn.addEventListener('click', () => {
            showDeleteConfirmModal('product', product.id, product.name);
        });
        
        productsTable.appendChild(row);
    });
}

// Load categories for dropdown
async function loadCategoriesForDropdown() {
    try {
        const response = await fetch(`${CATEGORIES_API}?size=100`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access-token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        const categories = data.data.content || [];
        
        // Populate category filter dropdown
        const categoryFilter = document.getElementById('productCategoryFilter');
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
        
        // Populate category dropdown in product modal
        const categorySelect = document.getElementById('productCategory');
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories for dropdown:', error);
    }
}

// Load shops for dropdown
async function loadShopsForDropdown() {
    try {
        const response = await fetch(`${SHOPS_API}?size=100`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access-token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch shops');
        }
        
        const data = await response.json();
        const shops = data.data.content || [];
        
        // Populate shop filter dropdown
        const shopFilter = document.getElementById('productShopFilter');
        shopFilter.innerHTML = '<option value="">All Shops</option>';
        
        shops.forEach(shop => {
            const option = document.createElement('option');
            option.value = shop.id;
            option.textContent = shop.name;
            shopFilter.appendChild(option);
        });
        
        // Populate shop dropdown in product modal
        const shopSelect = document.getElementById('productShop');
        shopSelect.innerHTML = '<option value="">Select Shop</option>';
        
        shops.forEach(shop => {
            const option = document.createElement('option');
            option.value = shop.id;
            option.textContent = shop.name;
            shopSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading shops for dropdown:', error);
    }
}

// Setup product modal listeners
function setupProductModalListeners() {
    const addProductBtn = document.getElementById('addProductBtn');
    const productModal = document.getElementById('productModal');
    const productForm = document.getElementById('productForm');
    const overlay = document.getElementById('overlay');
    
    // Show add product modal
    addProductBtn.addEventListener('click', () => {
        showAddProductModal();
    });
    
    // Handle product form submission
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const productId = productForm.getAttribute('data-product-id');
        const isEditing = !!productId;
        
        const productData = {
            name: document.getElementById('productName').value,
            shopId: document.getElementById('productShop').value,
            categoryId: document.getElementById('productCategory').value,
            description: document.getElementById('productDescription').value,
            price: parseFloat(document.getElementById('productPrice').value),
            quantity: parseInt(document.getElementById('productStock').value),
            imageUrl: document.getElementById('productImageUrl').value
        };
        
        try {
            let response;
            
            if (isEditing) {
                // Update existing product
                response = await fetch(`${PRODUCTS_API}/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('access-token')}`
                    },
                    body: JSON.stringify(productData)
                });
            } else {
                // Create new product
                response = await fetch(PRODUCTS_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('access-token')}`
                    },
                    body: JSON.stringify(productData)
                });
            }
            
            if (!response.ok) {
                throw new Error(`Failed to ${isEditing ? 'update' : 'create'} product`);
            }
            
            // Close modal and reload products
            productModal.style.display = 'none';
            overlay.style.display = 'none';
            loadProducts(currentPage);
            
            // Show success message
            alert(`Product ${isEditing ? 'updated' : 'created'} successfully`);
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} product:`, error);
            alert(`Failed to ${isEditing ? 'update' : 'create'} product. Please try again.`);
        }
    });
    
    // Setup filter button
    const productFilterBtn = document.getElementById('productFilterBtn');
    productFilterBtn.addEventListener('click', () => {
        loadProducts(1); // Reset to first page when filtering
    });
}

// Show add product modal
function showAddProductModal() {
    const productModal = document.getElementById('productModal');
    const productForm = document.getElementById('productForm');
    const overlay = document.getElementById('overlay');
    const productModalTitle = document.getElementById('productModalTitle');
    
    // Reset form
    productForm.reset();
    productForm.removeAttribute('data-product-id');
    
    // Update modal title
    productModalTitle.textContent = 'Add Product';
    
    // Show modal
    productModal.style.display = 'flex';
    overlay.style.display = 'block';
    
    // Ensure dropdowns are populated
    if (!document.getElementById('productCategory').options.length > 1) {
        loadCategoriesForDropdown();
    }
    if (!document.getElementById('productShop').options.length > 1) {
        loadShopsForDropdown();
    }
}

// Show edit product modal
function showEditProductModal(product) {
    const productModal = document.getElementById('productModal');
    const productForm = document.getElementById('productForm');
    const overlay = document.getElementById('overlay');
    const productModalTitle = document.getElementById('productModalTitle');
    
    // Fill form with product data
    document.getElementById('productName').value = product.name || '';
    document.getElementById('productShop').value = product.shop ? product.shop.id : '';
    document.getElementById('productCategory').value = product.category ? product.category.id : '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productPrice').value = product.price || 0;
    document.getElementById('productStock').value = product.quantity || 0;
    
    // Find thumbnail image URL
    let imageUrl = '';
    if (product.productImageList && product.productImageList.length > 0) {
        const thumbnail = product.productImageList.find(img => img.isThumbnail) || product.productImageList[0];
        imageUrl = thumbnail.imageUrl;
    }
    document.getElementById('productImageUrl').value = imageUrl;
    
    // Set product ID for form submission
    productForm.setAttribute('data-product-id', product.id);
    
    // Update modal title
    productModalTitle.textContent = 'Edit Product';
    
    // Show modal
    productModal.style.display = 'flex';
    overlay.style.display = 'block';
    
    // Ensure dropdowns are populated
    if (!document.getElementById('productCategory').options.length > 1) {
        loadCategoriesForDropdown();
    }
    if (!document.getElementById('productShop').options.length > 1) {
        loadShopsForDropdown();
    }
}

// Order Management
// ---------------

// Load orders
async function loadOrders(page = 1) {
    try {
        currentPage = page;
        
        // Get filter values
        const searchQuery = document.getElementById('orderSearchInput').value;
        const statusFilter = document.getElementById('orderStatusFilter').value;
        
        // Build query parameters
        let queryParams = `?page=${page - 1}&size=${itemsPerPage}`;
        if (searchQuery) {
            queryParams += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (statusFilter) {
            queryParams += `&status=${encodeURIComponent(statusFilter)}`;
        }
        
        const response = await fetch(`${ORDERS_API}${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access-token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        const orders = data.data.content || [];
        const totalItems = data.data.totalElements || 0;
        
        renderOrders(orders);
        createPagination(totalItems, 'ordersPagination', loadOrders);
    } catch (error) {
        console.error('Error loading orders:', error);
        
        const ordersTable = document.getElementById('ordersTable');
        ordersTable.innerHTML = '<tr><td colspan="7" style="text-align: center;">Failed to load orders</td></tr>';
    }
}

// Render orders
function renderOrders(orders) {
    const ordersTable = document.getElementById('ordersTable');
    ordersTable.innerHTML = '';
    
    if (orders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" style="text-align: center;">No orders found</td>';
        ordersTable.appendChild(row);
        return;
    }
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        
        const statusClass = getStatusClass(order.status);
        const paymentStatus = order.isPaid ? 'Paid' : 'Unpaid';
        const paymentStatusClass = order.isPaid ? 'status-delivered' : 'status-pending';
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.user ? (order.user.fullName || order.user.username) : '-'}</td>
            <td>${formatDate(order.createdAt)}</td>
            <td>${formatPrice(order.totalAmount)}</td>
            <td><span class="status-badge ${statusClass}">${order.status}</span></td>
            <td><span class="status-badge ${paymentStatusClass}">${paymentStatus}</span></td>
            <td class="actions">
                <button class="view-btn" title="View Order Details"><i class="fas fa-eye"></i></button>
            </td>
        `;
        
        // Add event listener to view button
        const viewBtn = row.querySelector('.view-btn');
        viewBtn.addEventListener('click', () => {
            showOrderDetails(order.id);
        });
        
        ordersTable.appendChild(row);
    });
}

// Show order details
async function showOrderDetails(orderId) {
    try {
        const response = await fetch(`${ORDERS_API}/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access-token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }
        
        const data = await response.json();
        const order = data.data;
        
        // Fill order details in modal
        document.getElementById('orderDetailId').textContent = order.id;
        document.getElementById('orderDetailDate').textContent = formatDate(order.createdAt);
        document.getElementById('orderDetailStatus').value = order.status.toLowerCase();
        
        // Customer info
        document.getElementById('orderCustomerName').textContent = order.user ? (order.user.fullName || order.user.username) : '-';
        document.getElementById('orderCustomerEmail').textContent = order.user ? order.user.email : '-';
        document.getElementById('orderCustomerPhone').textContent = order.user ? (order.user.phoneNumber || '-') : '-';
        
        // Shipping address
        const address = order.address || {};
        const addressText = `${address.diaChiNha || ''}, ${address.phuong || ''}, ${address.quan || ''}, ${address.thanhPho || ''}`;
        document.getElementById('orderShippingAddress').textContent = addressText;
        
        // Payment info
        document.getElementById('orderPaymentMethod').textContent = order.paymentMethod || 'Online Payment';
        document.getElementById('orderPaymentStatus').textContent = order.isPaid ? 'Paid' : 'Unpaid';
        document.getElementById('orderTransactionId').textContent = order.transactionId || '-';
        
        // Order items
        const orderItemsTable = document.getElementById('orderItemsTable');
        orderItemsTable.innerHTML = '';
        
        if (!order.items || order.items.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" style="text-align: center;">No items in this order</td>';
            orderItemsTable.appendChild(row);
        } else {
            let subtotal = 0;
            
            order.items.forEach(item => {
                const row = document.createElement('tr');
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                row.innerHTML = `
                    <td>${item.product ? item.product.name : 'Unknown Product'}</td>
                    <td>${item.product && item.product.shop ? item.product.shop.name : '-'}</td>
                    <td>${formatPrice(item.price)}</td>
                    <td>${item.quantity}</td>
                    <td>${formatPrice(itemTotal)}</td>
                `;
                
                orderItemsTable.appendChild(row);
            });
            
            // Order summary
            document.getElementById('orderSubtotal').textContent = formatPrice(subtotal);
            document.getElementById('orderShipping').textContent = formatPrice(order.shippingFee || 0);
            document.getElementById('orderTotal').textContent = formatPrice(order.totalAmount);
        }
        
        // Show modal
        const orderDetailModal = document.getElementById('orderDetailModal');
        const overlay = document.getElementById('overlay');
        orderDetailModal.style.display = 'flex';
        overlay.style.display = 'block';
        
        // Set order ID for update status
        document.getElementById('updateOrderStatusBtn').setAttribute('data-order-id', order.id);
    } catch (error) {
        console.error('Error fetching order details:', error);
        alert('Failed to load order details. Please try again.');
    }
}

// Setup order detail modal listeners
function setupOrderDetailModalListeners() {
    const closeOrderDetailBtn = document.getElementById('closeOrderDetailBtn');
    const closeOrderDetailModal = document.getElementById('closeOrderDetailModal');
    const updateOrderStatusBtn = document.getElementById('updateOrderStatusBtn');
    const orderDetailModal = document.getElementById('orderDetailModal');
    const overlay = document.getElementById('overlay');
    
    // Close modal
    closeOrderDetailBtn.addEventListener('click', () => {
        orderDetailModal.style.display = 'none';
        overlay.style.display = 'none';
    });
    
    closeOrderDetailModal.addEventListener('click', () => {
        orderDetailModal.style.display = 'none';
        overlay.style.display = 'none';
    });
    
    // Update order status
    updateOrderStatusBtn.addEventListener('click', async () => {
        const orderId = updateOrderStatusBtn.getAttribute('data-order-id');
        const newStatus = document.getElementById('orderDetailStatus').value;
        
        try {
            const response = await fetch(`${ORDERS_API}/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access-token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update order status');
            }
            
            // Close modal and reload orders
            orderDetailModal.style.display = 'none';
            overlay.style.display = 'none';
            loadOrders(currentPage);
            
            // Show success message
            alert('Order status updated successfully');
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status. Please try again.');
        }
    });
    
    // Setup filter button
    const orderFilterBtn = document.getElementById('orderFilterBtn');
    orderFilterBtn.addEventListener('click', () => {
        loadOrders(1); // Reset to first page when filtering
    });
}

// Category Management
// -----------------

// Load categories
async function loadCategories() {
    try {
        const response = await fetch(`${CATEGORIES_API}?size=100`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access-token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        const categories = data.data.content || [];
        
        renderCategories(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
        
        const categoriesTable = document.getElementById('categoriesTable');
        categoriesTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">Failed to load categories</td></tr>';
    }
}

// Render categories
function renderCategories(categories) {
    const categoriesTable = document.getElementById('categoriesTable');
    categoriesTable.innerHTML = '';
    
    if (categories.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" style="text-align: center;">No categories found</td>';
        categoriesTable.appendChild(row);
        return;
    }
    
    categories.forEach(category => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${category.description || '-'}</td>
            <td>${category.productCount || 0}</td>
            <td class="actions">
                <button class="edit-btn" title="Edit Category"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Delete Category"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add event listeners to action buttons
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => {
            showEditCategoryModal(category);
        });
        
        deleteBtn.addEventListener('click', () => {
            showDeleteConfirmModal('category', category.id, category.name);
        });
        
        categoriesTable.appendChild(row);
    });
}

// Setup category modal listeners
function setupCategoryModalListeners() {
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const categoryModal = document.getElementById('categoryModal');
    const categoryForm = document.getElementById('categoryForm');
    const overlay = document.getElementById('overlay');
    
    // Show add category modal
    addCategoryBtn.addEventListener('click', () => {
        showAddCategoryModal();
    });
    
    // Handle category form submission
    categoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const categoryId = categoryForm.getAttribute('data-category-id');
        const isEditing = !!categoryId;
        
        const categoryData = {
            name: document.getElementById('categoryName').value,
            description: document.getElementById('categoryDescription').value
        };
        
        try {
            let response;
            
            if (isEditing) {
                // Update existing category
                response = await fetch(`${CATEGORIES_API}/${categoryId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('access-token')}`
                    },
                    body: JSON.stringify(categoryData)
                });
            } else {
                // Create new category
                response = await fetch(CATEGORIES_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('access-token')}`
                    },
                    body: JSON.stringify(categoryData)
                });
            }
            
            if (!response.ok) {
                throw new Error(`Failed to ${isEditing ? 'update' : 'create'} category`);
            }
            
            // Close modal and reload categories
            categoryModal.style.display = 'none';
            overlay.style.display = 'none';
            loadCategories();
            
            // Show success message
            alert(`Category ${isEditing ? 'updated' : 'created'} successfully`);
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} category:`, error);
            alert(`Failed to ${isEditing ? 'update' : 'create'} category. Please try again.`);
        }
    });
}

// Show add category modal
function showAddCategoryModal() {
    const categoryModal = document.getElementById('categoryModal');
    const categoryForm = document.getElementById('categoryForm');
    const overlay = document.getElementById('overlay');
    const categoryModalTitle = document.getElementById('categoryModalTitle');
    
    // Reset form
    categoryForm.reset();
    categoryForm.removeAttribute('data-category-id');
    
    // Update modal title
    categoryModalTitle.textContent = 'Add Category';
    
    // Show modal
    categoryModal.style.display = 'flex';
    overlay.style.display = 'block';
}

// Show edit category modal
function showEditCategoryModal(category) {
    const categoryModal = document.getElementById('categoryModal');
    const categoryForm = document.getElementById('categoryForm');
    const overlay = document.getElementById('overlay');
    const categoryModalTitle = document.getElementById('categoryModalTitle');
    
    // Fill form with category data
    document.getElementById('categoryName').value = category.name || '';
    document.getElementById('categoryDescription').value = category.description || '';
    
    // Set category ID for form submission
    categoryForm.setAttribute('data-category-id', category.id);
    
    // Update modal title
    categoryModalTitle.textContent = 'Edit Category';
    
    // Show modal
    categoryModal.style.display = 'flex';
    overlay.style.display = 'block';
}

// Delete Confirmation Modal
// -----------------------

// Setup delete confirmation modal listeners
function setupDeleteConfirmModalListeners() {
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const closeDeleteConfirmModal = document.getElementById('closeDeleteConfirmModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const overlay = document.getElementById('overlay');
    
    // Close modal
    closeDeleteConfirmModal.addEventListener('click', () => {
        deleteConfirmModal.style.display = 'none';
        overlay.style.display = 'none';
    });
    
    cancelDeleteBtn.addEventListener('click', () => {
        deleteConfirmModal.style.display = 'none';
        overlay.style.display = 'none';
    });
    
    // Confirm delete
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!deleteItemType || !deleteItemId) {
            return;
        }
        
        try {
            let apiUrl;
            
            switch (deleteItemType) {
                case 'user':
                    apiUrl = `${USERS_API}/${deleteItemId}`;
                    break;
                case 'shop':
                    apiUrl = `${SHOPS_API}/${deleteItemId}`;
                    break;
                case 'product':
                    apiUrl = `${PRODUCTS_API}/${deleteItemId}`;
                    break;
                case 'category':
                    apiUrl = `${CATEGORIES_API}/${deleteItemId}`;
                    break;
                default:
                    throw new Error('Invalid item type');
            }
            
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access-token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to delete ${deleteItemType}`);
            }
            
            // Close modal
            deleteConfirmModal.style.display = 'none';
            overlay.style.display = 'none';
            
            // Reload data based on item type
            switch (deleteItemType) {
                case 'user':
                    loadUsers(currentPage);
                    break;
                case 'shop':
                    loadShops(currentPage);
                    break;
                case 'product':
                    loadProducts(currentPage);
                    break;
                case 'category':
                    loadCategories();
                    break;
            }
            
            // Show success message
            alert(`${deleteItemType.charAt(0).toUpperCase() + deleteItemType.slice(1)} deleted successfully`);
            
            // Reset delete item variables
            deleteItemType = null;
            deleteItemId = null;
        } catch (error) {
            console.error(`Error deleting ${deleteItemType}:`, error);
            alert(`Failed to delete ${deleteItemType}. Please try again.`);
        }
    });
}

// Show delete confirmation modal
function showDeleteConfirmModal(itemType, itemId, itemName) {
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const deleteConfirmMessage = document.getElementById('deleteConfirmMessage');
    const overlay = document.getElementById('overlay');
    
    // Set delete item variables
    deleteItemType = itemType;
    deleteItemId = itemId;
    
    // Update confirmation message
    deleteConfirmMessage.textContent = `Are you sure you want to delete the ${itemType} "${itemName}"? This action cannot be undone.`;
    
    // Show modal
    deleteConfirmModal.style.display = 'flex';
    overlay.style.display = 'block';
}

// Settings Management
// -----------------

// Setup settings listeners
function setupSettingsListeners() {
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    
    saveSettingsBtn.addEventListener('click', () => {
        const settings = {
            siteName: document.getElementById('siteName').value,
            siteDescription: document.getElementById('siteDescription').value,
            contactEmail: document.getElementById('contactEmail').value,
            maintenanceMode: document.getElementById('maintenanceMode').value
        };
        
        // Save settings to localStorage (in a real app, this would be saved to the server)
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        
        alert('Settings saved successfully');
    });
    
    // Load saved settings if available
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        document.getElementById('siteName').value = settings.siteName || 'VieShop';
        document.getElementById('siteDescription').value = settings.siteDescription || 'VieShop - Vietnamese Online Shopping Platform';
        document.getElementById('contactEmail').value = settings.contactEmail || 'contact@vieshop.com';
        document.getElementById('maintenanceMode').value = settings.maintenanceMode || 'off';
    }
}
