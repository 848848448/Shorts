function renderChat() {
    viewport.innerHTML = `
        <div class="page" style="padding:15px;">
            <button onclick="loadPage('home')" style="background:none; border:none; color:var(--accent); font-size:1.2rem; margin-bottom:20px;">
                <i class="fas fa-arrow-right"></i> צוריק
            </button>
            <div id="chat-box" style="height:70vh; overflow-y:auto; display:flex; flex-direction:column; gap:10px; padding-bottom:100px;"></div>
            
            <div style="position:fixed; bottom:0; left:0; width:100%; padding:15px; background:#000; display:flex; gap:10px;">
                <input type="text" id="chat-input" placeholder="שרייב עפעס..." style="flex:1; padding:12px; border-radius:25px; border:none; background:#1a1a1a; color:#fff;">
                <button onclick="sendMessage()" style="background:var(--accent); border:none; width:45px; height:45px; border-radius:50%; color:#000;">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    listenToMessages();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    if(!input.value.trim()) return;
    firebase.database().ref('public_chat').push({
        sender: currentUser.nickname,
        text: input.value,
        time: Date.now()
    });
    input.value = "";
}

function listenToMessages() {
    firebase.database().ref('public_chat').limitToLast(50).on('value', snap => {
        const box = document.getElementById('chat-box');
        if(!box) return;
        box.innerHTML = "";
        snap.forEach(child => {
            const d = child.val();
            const isMe = d.sender === currentUser.nickname;
            box.innerHTML += `
                <div style="align-self: ${isMe ? 'flex-start' : 'flex-end'}; background: ${isMe ? 'var(--accent)' : '#222'}; color: ${isMe ? '#000' : '#fff'}; padding: 10px 15px; border-radius: 15px; max-width: 80%;">
                    <small style="display:block; font-size:0.6rem; opacity:0.7;">${d.sender}</small>
                    ${d.text}
                </div>
            `;
        });
        box.scrollTop = box.scrollHeight;
    });
        }
