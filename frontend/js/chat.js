import { getCookie } from "./auth";

const MESSAGE_URL = "http://localhost:8080/api/v1/messages";

// Toggle chatbot window
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotWindow = document.querySelector('.chatbot-window');
const chatbotClose = document.querySelector('.chatbot-close');

const user = JSON.parse(localStorage.getItem('user'));

const urlParams = new URLSearchParams(window.location.search);
const receiverId = urlParams.get('id');
const receiverName = urlParams.get('name');
const receiverType = urlParams.get('type');

var messageList = [];
var socket = null;
var stompClient = null;

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
            messageId: "msg" + Date.now(), // Tạo ID tạm thời
            messageType: "CHAT",
            content: input.value,
            senderName: user.username, // Tên người dùng hiện tại
            senderId: user.id, // ID người dùng hiện tại
            receiverName: "nguyenvana", // Sẽ được điền sau khi gửi lên server
            receiverId: 1,
            receiverType: "USER",
            timestamp: new Date().toISOString()
        }
        addMessageToUI(chatMessage);
        console.log(chatMessage);
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    }
    input.value = '';
}

function connect() {
    socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    
    stompClient.connect({}, 
        (frame) => {
            stompClient.subscribe(`/topic/public`, 
                (message) => {
                    addMessageToUI(message.body);
                }
            );

            console.log('Connected:', frame);
            stompClient.send(`/app/chat.addUser`, {}, JSON.stringify({
                "senderId": user.id,
                "senderName": user.username,
                "messageType": "JOIN"
            })); 
            
        },
        (error) => { 
            console.log('Error:', error);
        }
    );
}

function groupMessagesByConversation(messages) {
    const conversations = {};
    
    messages.forEach(message => {
        // Xác định ID của cuộc trò chuyện (thường là cặp người gửi-người nhận)
        let conversationId;
        let otherPersonId;
        let otherPersonName;
        
        // Giả sử người dùng hiện tại là admin1
        const currentUserId = "admin1";
        
        if (message.senderId === currentUserId) {
            conversationId = message.receiverId;
            otherPersonId = message.receiverId;
            otherPersonName = message.receiverName;
        } else {
            conversationId = message.senderId;
            otherPersonId = message.senderId;
            otherPersonName = message.senderName;
        }
        
        // Nếu chưa có conversation này thì tạo mới
        if (!conversations[conversationId]) {
            conversations[conversationId] = {
                id: conversationId,
                personName: otherPersonName,
                messages: []
            };
        }
        
        // Thêm tin nhắn vào cuộc trò chuyện
        conversations[conversationId].messages.push(message);
    });
    
    // Sắp xếp tin nhắn trong mỗi cuộc trò chuyện theo thời gian
    Object.values(conversations).forEach(conversation => {
        conversation.messages.sort((a, b) => {
            return new Date(a.timestamp) - new Date(b.timestamp);
        });
    });
    
    return Object.values(conversations);
}

// Hàm chính để render tất cả cuộc trò chuyện
function renderAllConversations(messages) {
    const conversations = groupMessagesByConversation(messages);
    const chatContainer = document.getElementById('chat-container');
    
    // Xóa nội dung cũ
    chatContainer.innerHTML = '';
    
    // Render từng cuộc trò chuyện
    conversations.forEach(conversation => {
        const chatBox = renderConversation(conversation);
        chatBox.setAttribute('data-conversation-id', conversation.id);
        chatContainer.appendChild(chatBox);
    });
}

function renderConversation(conversation) {
    const currentUserId = user.username; // Người dùng hiện tại
    
    // Lấy tin nhắn cuối cùng để hiển thị preview
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    console.log(lastMessage);
    
    // Tạo HTML cho box chat
    const chatBox = document.createElement('div');
    chatBox.className = 'chat-main';
    
    // Header của box chat
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chat-header';
    chatHeader.innerHTML = `
        <img src="https://via.placeholder.com/40" alt="User avatar">
        <a href="chat.html?id=${conversation.id}"><h3>${conversation.personName}</h3></a>
    `;
    
    // Nội dung tin nhắn
    const chatMessages = document.createElement('div');
    chatMessages.className = 'chat-messages';
    
    // Render tất cả tin nhắn trong cuộc trò chuyện
    conversation.messages.forEach(msg => {
        const messageClass = msg.senderId === currentUserId ? 'sent' : 'received';
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${messageClass}`;
        messageDiv.innerHTML = `
            <p>${msg.content}</p>
            <span class="time">${formatTime(msg.timestamp)}</span>
        `;
        chatMessages.appendChild(messageDiv);
    });
    
    // Input để nhập tin nhắn
    const chatInput = document.createElement('div');
    chatInput.className = 'chat-input';
    chatInput.innerHTML = `
        <input type="text" placeholder="Nhập tin nhắn...">
        <button class="send-button">
            <i class="fa-solid fa-paper-plane"></i>
        </button>
    `;
    
    // Thêm event listener cho nút gửi
    chatInput.querySelector('.send-button').addEventListener('click', function() {
        const inputField = chatInput.querySelector('input');
        const messageContent = inputField.value.trim();
        
        if (messageContent) {
            sendMessage(conversation.id, messageContent);
            inputField.value = '';
        }
    });
    
    // Thêm event listener cho input field (gửi khi nhấn Enter)
    chatInput.querySelector('input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const messageContent = this.value.trim();
            
            if (messageContent) {
                sendMessage(conversation.id, messageContent);
                this.value = '';
            }
        }
    });
    
    // Ghép các phần lại với nhau
    chatBox.appendChild(chatHeader);
    chatBox.appendChild(chatMessages);
    chatBox.appendChild(chatInput);
    
    return chatBox;
}

function addMessageToUI(message) {
    const currentUserId = user.id; // ID người dùng hiện tại
    
    // Tìm box chat tương ứng
    let chatBoxId;
    if (message.senderId === currentUserId) {
        chatBoxId = message.receiverId;
    } else {
        chatBoxId = message.senderId;
    }
    
    const chatBox = document.querySelector(`.chat-main[data-conversation-id="${chatBoxId}"]`);
    
    if (chatBox) {
        const chatMessages = chatBox.querySelector('.chat-messages');
        const messageClass = message.senderId === currentUserId ? 'sent' : 'received';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${messageClass}`;
        messageDiv.innerHTML = `
            <p>${message.content}</p>
            <span class="time">${formatTime(message.timestamp)}</span>
        `;
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

async function fetch_and_render_messages() {
    const response = await fetch(MESSAGE_URL+"/user/"+user.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('access-token')
        }
    });
    const data = await response.json();
    console.log(data);
    messageList = data;

    renderAllConversations(messageList);
    return;
}

document.addEventListener('DOMContentLoaded', async () => {
    connect();
    await fetch_and_render_messages();
});

window.addEventListener('beforeunload', function() {
    if (socket) {
        socket.close();
    }
});

