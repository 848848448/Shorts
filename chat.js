// Chat Module - Handles all messaging
const chatDisplay = document.getElementById('chat-display');

// 1. Function to send a message
function sendMessage(user, text) {
    const messageId = Date.now();
    db.ref('content/chat/' + messageId).set({
        username: user,
        message: text,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
}

// 2. Listen for new messages (Real-time)
function loadChat() {
    db.ref('content/chat').limitToLast(20).on('value', (snapshot) => {
        chatDisplay.innerHTML = ''; // Clear display
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const msgElement = document.createElement('p');
            msgElement.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
            chatDisplay.appendChild(msgElement);
        });
        // Scroll to bottom
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    });
}

// Start the chat module
loadChat();
