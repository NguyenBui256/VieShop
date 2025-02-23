// Toggle chatbot window
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotWindow = document.querySelector('.chatbot-window');
const chatbotClose = document.querySelector('.chatbot-close');

const user = JSON.parse(localStorage.getItem('user'));

const urlParams = new URLSearchParams(window.location.search);
const receiverId = urlParams.get('id');
const receiverName = urlParams.get('name');
const receiverType = urlParams.get('type');

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
    addMessage(input);
    if(input.value && stompClient) {
        let chatMessage = {
            // "senderId": user.id,
            "senderName": user.name,
            "messageType": "CHAT",
            "content": input.value
        }
        console.log(chatMessage);
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    }
    input.value = '';
}

function addMessage(input) {
    const messagesContainer = input.closest('.chat-main, .chatbot-window')
        .querySelector('.chat-messages, .chatbot-messages');
    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message sent';
    
    const messageText = document.createElement('p');
    messageText.textContent = input.value;
    
    const messageTime = document.createElement('span');
    messageTime.className = 'time';
    messageTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(messageText);
    messageDiv.appendChild(messageTime);
    
    // Add message to container
    messagesContainer.appendChild(messageDiv);
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

}

async function connect() {
    socket = new SockJS('http://localhost:8080/ws');
    stompClient = await Stomp.over(socket);
    
    await stompClient.connect({}, 
        (frame) => {
            console.log('Connected:', frame);
            stompClient.send(`/app/chat.addUser`, {}, JSON.stringify({
                // "senderId": user.id,
                "senderName": user.name,
                "messageType": "JOIN"
            })); 

            stompClient.subscribe(`/topic/public`, 
                (message) => {
                    addMessage(message.body);
                }
            );
        },
        (error) => { 
            console.log('Error:', error);
        }
    );
}

document.addEventListener('DOMContentLoaded', async () => {
    await connect();
});

