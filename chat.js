function renderChatScreen(groupName) {
    const viewport = document.getElementById('app-viewport');
    viewport.innerHTML = `
        <div class="chat-container">
            <header style="padding: 15px; border-bottom: 1px solid #222; display: flex; justify-content: space-between; align-items: center;">
                <button onclick="loadPage('chat')" style="background:none; border:none; color:#007AFF; font-size:1.2rem;">➔</button>
                <b style="font-size: 1rem;">${groupName}</b>
                <div style="width:20px;"></div>
            </header>
            
            <div id="messages" class="messages-area">
                <!-- מעסעדזשעס קומען דא אריין -->
            </div>

            <div class="input-area">
                <button class="attach-btn" style="background:none; border:none; color:#888;"><i class="fas fa-plus"></i></button>
                <input type="text" id="msgInput" placeholder="שרייב עפעס...">
                <button class="send-btn" onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    listenForMessages(groupName); // הייב אן צוהערן צו Firebase
}
