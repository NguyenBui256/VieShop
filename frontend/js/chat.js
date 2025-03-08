const MESSAGE_URL = "http://localhost:8080/api/v1/messages";
const WEBSOCKET_URL = 'http://localhost:8080/ws';

// Toggle chatbot window
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotWindow = document.querySelector('.chatbot-window');
const chatbotClose = document.querySelector('.chatbot-close');

const user = JSON.parse(localStorage.getItem('user'));

var receiverId;
var receiverName;
var receiverType;

var messageList = [];
var conversations = {};
var socket = null;
var stompClient = null;

function getCookie(cname) {
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

// Initialize chatbot UI if elements exist
if (chatbotToggle && chatbotWindow && chatbotClose) {
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.add('active');
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });
}

// Handle chat input
const chatInputs = document.querySelectorAll('.chat-input input, .chatbot-input input');
const sendButtons = document.querySelectorAll('.send-button');

chatInputs.forEach((input, index) => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim() !== '') {
            sendMessage(input);
        }
    });

    if (sendButtons[index]) {
        sendButtons[index].addEventListener('click', () => {
            if (input.value.trim() !== '') {
                sendMessage(input);
            }
        });
    }
});

function sendMessage(input) {
    if(input.value && stompClient) {
        let chatMessage = {
            messageId: "msg" + Date.now(), // Temporary ID
            messageType: "CHAT",
            content: input.value,
            senderName: user.username,
            senderId: user.id,
            receiverName: receiverName || "Unknown",
            receiverId: receiverId ? parseInt(receiverId) : null,
            receiverType: receiverType,
            createdAt: new Date().toISOString()
        }
        stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
        
        if (!chatMessage.receiverId) {
            console.error("No receiver ID specified");
            return;
        }
        
        // Initialize conversation if it doesn't exist
        if (!conversations[receiverId]) {
            conversations[receiverId] = {
                receiverId: receiverId,
                receiverName: receiverName,
                receiverType: receiverType,
                messages: [],
                timestamp: new Date().toISOString()
            };
        }
        
        conversations[receiverId].messages.push(chatMessage);
        addMessageToUI(chatMessage);
    }
    input.value = '';
}

function connect() {
    socket = new SockJS(WEBSOCKET_URL);
    stompClient = Stomp.over(socket);
    
    stompClient.connect({}, 
        (frame) => {
            console.log('Connected to WebSocket:', frame);
            
            // Subscribe to public channel
            stompClient.subscribe(`/topic/public`, 
                (message) => {
                    console.log("Received public message:", message);
                    const receivedMessage = JSON.parse(message.body);
                    handleIncomingMessage(receivedMessage);
                }
            );

            // Subscribe to personal channel for direct messages
            stompClient.subscribe(`/user/${user.id}/queue/messages`, 
                (message) => {
                    console.log("Received private message:", message);
                    const receivedMessage = JSON.parse(message.body);
                    handleIncomingMessage(receivedMessage);
                }
            );
            
            // Notify server that user is online
            stompClient.send(`/app/chat.addUser`, {}, JSON.stringify({
                "senderId": user.id,
                "senderName": user.username,
                "messageType": "JOIN"
            })); 
            
            // Load message history for current conversation if we're in a chat view
            if (receiverId) {
                loadConversationHistory(receiverId);
            }
        },
        (error) => { 
            console.log('Error connecting to WebSocket:', error);
            // Implement reconnection logic here
            setTimeout(connect, 5000);
        }
    );
}

// Handle incoming messages from WebSocket
function handleIncomingMessage(message) {
    // Skip system messages
    if (message.messageType === "JOIN" || message.messageType === "LEAVE") {
        return;
    }
    
    const senderId = message.senderId;
    
    // Initialize conversation if it doesn't exist
    if (!conversations[senderId]) {
        conversations[senderId] = {
            receiverId: senderId,
            receiverName: message.senderName,
            receiverType: message.receiverType || 'USER',
            messages: [],
            timestamp: message.createdAt || new Date().toISOString(),
            avatar: 'https://via.placeholder.com/40'
        };
    }
    
    // Add message to conversation
    conversations[senderId].messages.push(message);
    conversations[senderId].timestamp = message.createdAt || new Date().toISOString();
    
    // If we're currently viewing this conversation, add message to UI
    if (receiverId && parseInt(receiverId) === parseInt(senderId)) {
        addMessageToUI(message);
    } else {
        // Otherwise show notification
        showNotification(message.senderName, message.content);
        
        // Update conversation list to show new message
        renderAllConversations(conversations);
        
        // Update message count badge
        updateMessageCount();
    }
}

// Update the message count badge
function updateMessageCount() {
    const messageCount = document.getElementById('messageCount');
    if (messageCount) {
        // Count unread messages (this is a simplified version - you might want to track read status)
        const unreadCount = Object.values(conversations)
            .filter(conv => parseInt(conv.receiverId) !== parseInt(receiverId))
            .length;
        
        messageCount.textContent = unreadCount > 0 ? unreadCount : '0';
    }
}

async function loadConversationHistory(receiverId) {
    try {
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.innerHTML = 'Loading...';
        
        // Ensure the conversation exists
        if (!conversations[receiverId] || !conversations[receiverId].messages) {
            chatMessages.innerHTML = 'No messages yet. Start a conversation!';
            return;
        }
        
        const messages = conversations[receiverId].messages;
        
        // Clear existing messages in the UI
        if (chatMessages) {
            chatMessages.innerHTML = '';
            
            // Render messages in order
            messages.forEach(message => {
                addMessageToUI(message);
            });
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    } catch (error) {
        console.error('Error fetching conversation history:', error);
    }
}

async function fetch_and_render_messages() {
    try {
        const response = await fetch(`${MESSAGE_URL}/user/${user.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access-token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }

        messageList = await response.json();
        console.log("Fetched messages:", messageList.data);
        conversations = groupMessagesByConversation(messageList.data);
        renderAllConversations(conversations);
        
        // If we're in a specific conversation view, setup the chat UI
        if (receiverId) {
            setupChatView(receiverId, receiverName);
        }
        
        // Update message count badge
        updateMessageCount();
        
        return;
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

function groupMessagesByConversation(messages) {
    const conversations = {};
    
    for(const message of messages) {
        let conversationId;
        let conversationName;
        let conversationType;
        let lastActivity = message.created_at || formatTime(new Date());
        
        // Determine if the user is sender or receiver
        if (message.senderId === user.id) {
            conversationId = message.receiverId;
            conversationName = message.receiverName;
            conversationType = message.receiverType || 'USER';
        } else {
            conversationId = message.senderId;
            conversationName = message.senderName;
            conversationType = message.senderType || 'USER';
        }

        if (!conversations[conversationId]) {
            conversations[conversationId] = {
                receiverId: conversationId,
                receiverName: conversationName,
                receiverType: conversationType,
                messages: [],
                timestamp: lastActivity,
                avatar: 'https://via.placeholder.com/40'
            };
        } else if (lastActivity > new Date(conversations[conversationId].timestamp)) {
            // Update last activity if this message is newer
            conversations[conversationId].timestamp = lastActivity;
        }
        
        conversations[conversationId].messages.push(message);
    };

    // Sort messages within each conversation by timestamp
    Object.values(conversations).forEach(conversation => {
        conversation.messages.sort((a, b) => new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt));
    });

    return conversations;
}

function renderAllConversations(conversations) {
    const chatUsersList = document.querySelector('.chat-users');
    if (!chatUsersList) return; // Skip if we're not on the conversations page
    
    chatUsersList.innerHTML = ''; // Clear existing conversations

    // Convert to array and sort by last activity
    const sortedConversations = Object.values(conversations).sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    sortedConversations.forEach(conversation => {
        if (!conversation.messages || conversation.messages.length === 0) {
            return; // Skip conversations with no messages
        }
        
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const isActive = conversation.receiverId === parseInt(receiverId);
        
        const messagePreview = lastMessage.content.length > 30 ? 
            lastMessage.content.substring(0, 30) + '...' : 
            lastMessage.content;
            
        const conversationElement = document.createElement('div');
        conversationElement.className = `chat-user ${isActive ? 'active' : ''}`;
        conversationElement.innerHTML = `
            <img src="${conversation.avatar}" alt="User avatar">
            <div class="chat-user-info">
                <h4>${conversation.receiverName}</h4>
                <p>${messagePreview}</p>
                <small>${formatTime(lastMessage.createdAt || lastMessage.timestamp)}</small>
            </div>
        `;

        conversationElement.addEventListener('click', () => {
            document.querySelector('.chat-main').setAttribute('style', 'display: flex');
            receiverId = conversation.receiverId;
            receiverName = conversation.receiverName;
            receiverType = conversation.receiverType;
            chatUsersList.querySelectorAll('.chat-user').forEach(user => user.classList.remove('active'));
            conversationElement.classList.add('active');
            loadConversationHistory(receiverId);
        });

        chatUsersList.appendChild(conversationElement);
    });
}

function setupChatView(conversationId, conversationName) {
    // Find the chat header element
    const chatHeader = document.querySelector('.chat-header');
    if (chatHeader) {
        // Update chat header with conversation name
        chatHeader.innerHTML = `
            <h3>${conversationName}</h3>
        `;
    }
    
    // Set the conversation ID attribute on the chat main container
    const chatMain = document.querySelector('.chat-main');
    if (chatMain) {
        chatMain.setAttribute('data-conversation-id', conversationId);
    }
}

function addMessageToUI(message) {
    const currentUserId = user.id;
    
    // If we're in the conversation view that matches this message
    const chatMain = document.querySelector(`.chat-main`);
    if (chatMain) {
        const chatMessages = chatMain.querySelector('.chat-messages');
        if (chatMessages) {
            const messageClass = parseInt(message.senderId) === parseInt(currentUserId) ? 'sent' : 'received';
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${messageClass}`;
            messageDiv.innerHTML = `
                <p>${message.content}</p>
                <span class="time">${formatTime(message.createdAt || message.timestamp)}</span>
            `;
            
            chatMessages.appendChild(messageDiv);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    } else if (parseInt(message.senderId) !== parseInt(currentUserId)) {
        // If message is from someone else and we're not in that conversation,
        // we could show a notification here
        showNotification(message.senderName, message.content);
    }
}

function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatLocalDateTime(date) {
    if (!(date instanceof Date)) {
        throw new Error("Invalid date object");
    }
    
    const pad = (num) => String(num).padStart(2, '0');
    
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Tháng bắt đầu từ 0
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function showNotification(sender, content) {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return;
    }
    
    // Check if permission is already granted
    if (Notification.permission === "granted") {
        createNotification(sender, content);
    }
    // Otherwise, request permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                createNotification(sender, content);
            }
        });
    }
}

function createNotification(sender, content) {
    const notification = new Notification(sender, {
        body: content,
        icon: "assets/logo.png" // Updated to use the app logo
    });
    
    notification.onclick = function() {
        window.focus();
        this.close();
    };
}

document.addEventListener('DOMContentLoaded', async () => {
    // First fetch and render messages
    await fetch_and_render_messages();
    
    // Then connect to WebSocket
    connect();
    
    // If we're in a specific conversation, scroll to bottom of chat
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

window.addEventListener('beforeunload', function() {
    if (stompClient) {
        stompClient.disconnect();
    }
    if (socket) {
        socket.close();
    }
});
