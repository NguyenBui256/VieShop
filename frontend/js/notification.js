class WebSocketNotification {
    constructor(userId) {
        this.unreadCount = 0;
        this.notifications = [];
        this.stompClient = null;
        this.userId = userId;
        this.initializeElements();
        this.setupEventListeners();
        this.connect();
    }

    initializeElements() {
        this.notificationButton = document.querySelector('.notification-button');
        this.notificationBadge = document.querySelector('.notification-badge');
        this.notificationDropdown = document.querySelector('.notification-dropdown');
    }

    setupEventListeners() {
        // Toggle dropdown when clicking notification button
        this.notificationButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.notificationButton.contains(e.target)) {
                this.hideDropdown();
            }
        });
    }

    toggleDropdown() {
        this.notificationDropdown.classList.toggle('show');
    }

    hideDropdown() {
        this.notificationDropdown.classList.remove('show');
    }

    addNotification(notification) {
        this.notifications.unshift(notification);
        this.unreadCount++;
        this.updateBadge();
        this.showToast(notification);
        let html = `
            <div class="notification-item unread">
                <p>Phân loại: ${notification.status}</p>
                <p>Message: ${notification.message}</p>
                <p>Title: ${notification.title}</p>
            </div>
        `;
        this.notificationDropdown.innerHTML += html;
    }

    updateBadge() {
        this.notificationBadge.textContent = this.unreadCount;
        this.notificationBadge.style.display = this.unreadCount > 0 ? 'block' : 'none';
    }

    connect() {
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(socket);
        
        this.stompClient.connect({}, 
            (frame) => {
                console.log('Connected:', frame);
                this.stompClient.subscribe(`/user/${this.userId}/notification`, 
                    (notification) => {
                        this.addNotification(JSON.parse(notification.body));
                    }
                );
            },
            (error) => {
                console.log('Error:', error);
            }
        );
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
    }

    renderNotifications() {
        this.notifications.forEach(notification => {
            const notificationDiv = document.createElement('div');
            notificationDiv.className = 'notification';
            notificationDiv.textContent = notification.message || JSON.stringify(notification);
            this.notificationDropdown.appendChild(notificationDiv);
        });
    }

    showToast(notification) {
        // Implement toast notification if needed
        console.log('New notification:', notification);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    if (userId) {
        const wsNotification = new WebSocketNotification(userId);
    }
});