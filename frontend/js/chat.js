// Toggle chatbot window
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotWindow = document.querySelector('.chatbot-window');
const chatbotClose = document.querySelector('.chatbot-close');

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
    
    // Clear input
    input.value = '';
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}