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
var conversations = [];
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
        }
        stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
        chatMessage.createdAt = new Date().toISOString();
        console.log(chatMessage);
        
        if (!chatMessage.receiverId) {
            console.error("No receiver ID specified");
            return;
        }
        
        conversations[receiverId].messages.push(chatMessage);
        addMessageToUI(chatMessage);
        
        // Send to server
    }
    input.value = '';
}

function connect() {
    socket = new SockJS(WEBSOCKET_URL);
    stompClient = Stomp.over(socket);
    
    stompClient.connect({}, 
        (frame) => {
            // Subscribe to public channel
            stompClient.subscribe(`/topic/public`, 
                (message) => {
                    console.log("Received user message:", message);
                    const receivedMessage = JSON.parse(message.body);
                    addMessageToUI(receivedMessage);
                }
            );

            stompClient.subscribe(`/user/${user.id}/queue/messages`, 
                (message) => {
                    console.log("Received chat message:", message);
                    const receivedMessage = JSON.parse(message.body);
                    conversations[receivedMessage['senderId']].messages.push(receivedMessage);
                    addMessageToUI(receivedMessage);
                }
            );

            console.log('Connected:', frame);
            
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

async function loadConversationHistory(receiverId) {
    try {
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.innerHTML = 'Loading...';
        const messages = conversations[receiverId].messages;
        console.log(messages);
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
        console.log(messageList.data);
        conversations = groupMessagesByConversation(messageList.data);
        renderAllConversations(conversations);
        console.log(conversations);
        
        // If we're in a specific conversation view, setup the chat UI
        if (receiverId) {
            setupChatView(receiverId, receiverName);
        }
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
        console.log(lastActivity);
        
        // Determine if the user is sender or receiver
        if (message.senderId === user.id) {
            conversationId = message.receiverId;
            conversationName = message.receiverName;
            conversationType = message.receiverType || 'https://via.placeholder.com/40';
        } else {
            conversationId = message.senderId;
            conversationName = message.senderName;
            conversationType = message.receiverType || 'https://via.placeholder.com/40';
        }

        if (!conversations[conversationId]) {
            conversations[conversationId] = {
                receiverId: conversationId,
                receiverName: conversationName,
                receiverType: conversationType,
                messages: [],
                timestamp: lastActivity
            };
        } else if (lastActivity > new Date(conversations[conversationId].lastActivity)) {
            // Update last activity if this message is newer
            conversations[conversationId].timestamp = lastActivity;
        }
        
        conversations[conversationId].messages.push(message);
    };

    // Sort messages within each conversation by timestamp
    Object.values(conversations).forEach(conversation => {
        conversation.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });

    return conversations;
}

function renderAllConversations(conversations) {
    const chatUsersList = document.querySelector('.chat-users');
    if (!chatUsersList) return; // Skip if we're not on the conversations page
    
    chatUsersList.innerHTML = ''; // Clear existing conversations

    // Convert to array and sort by last activity
    const sortedConversations = Object.values(conversations).sort(
        (a, b) => new Date(b.lastActivity) - new Date(a.lastActivity)
    );

    sortedConversations.forEach(conversation => {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const isActive = conversation.receiverId === parseInt(receiverId);
        
        const messagePreview = lastMessage.content.length > 30 ? 
            lastMessage.content.substring(0, 30) + '...' : 
            lastMessage.content;
            
        const conversationElement = document.createElement('div');
        conversationElement.className = `chat-user`;
        conversationElement.innerHTML = `
            <img src="${conversation.avatar}" alt="User avatar">
            <div class="chat-user-info">
                <h4>${conversation.receiverName}</h4>
                <p>${messagePreview}</p>
                <small>${formatTime(lastMessage.createdAt)}</small>
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
        console.log("ALALALALAL");
        const chatMessages = chatMain.querySelector('.chat-messages');
        if (chatMessages) {
            const messageClass = message.senderId === currentUserId ? 'sent' : 'received';
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${messageClass}`;
            messageDiv.innerHTML = `
                <p>${message.content}</p>
                <span class="time">${formatTime(message.createdAt)}</span>
            `;
            
            chatMessages.appendChild(messageDiv);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    } else if (message.senderId !== currentUserId) {
        // If message is from someone else and we're not in that conversation,
        // we could show a notification here
        showNotification(message.senderName, message.content);
    }
}

function formatTime(timestamp) {
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
        icon: "path/to/icon.png" // Add your app icon here
    });
    
    notification.onclick = function() {
        window.focus();
        this.close();
    };
}

document.addEventListener('DOMContentLoaded', async () => {
    // First connect to WebSocket

    
    // Then fetch and render messages
    await fetch_and_render_messages();
    

    
    // If we're in a specific conversation, scroll to bottom of chat
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    connect();
});

window.addEventListener('beforeunload', function() {
    if (socket) {
        socket.close();
    }
});
