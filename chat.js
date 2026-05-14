// chat.js - THE EMPIRE ULTIMATE 2026
let currentGroupId = null;
let typingTimeout = null;

// 1. ווייזט די ליסטע פון גרופעס (פארריכט דעם טעות פון Screenshot_20260514-015617.png)
function renderGroupsList() {
    const vp = document.getElementById('app-viewport');
    vp.innerHTML = `
        <div class="chat-container">
            <header style="padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222;">
                <button onclick="loadPage('home')" style="background:none; border:none; color:#007AFF; font-size:1.5rem;">➔</button>
                <b style="font-size: 1.2rem;">גרופעס</b>
                <button onclick="createNewGroup()" style="background:#007AFF; border:none; padding:5px 12px; border-radius:10px; color:white; font-weight:bold;">+</button>
            </header>
            <div id="groups-list" style="flex:1; overflow-y:auto; padding:15px;"></div>
        </div>
    `;
    loadGroups();
}

function loadGroups() {
    firebase.database().ref('groups').on('value', snap => {
        const list = document.getElementById('groups-list');
        if(!list) return;
        list.innerHTML = "";
        snap.forEach(child => {
            let g = child.val();
            let id = child.key;
            let msgCount = g.messages ? Object.keys(g.messages).length : 0;
            list.innerHTML += `
                <div class="menu-btn" onclick="enterGroup('${id}', '${g.name}')" style="margin-bottom:15px; padding: 20px; flex-direction: row; justify-content: space-between; width:100%;">
                    <div style="display:flex; align-items:center; gap:15px;">
                        <div style="background:#222; width:45px; height:45px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#007AFF;">${g.name[0]}</div>
                        <div style="text-align:right;">
                            <div style="font-weight:bold;">${g.name}</div>
                            <div style="font-size:0.7rem; opacity:0.5;">${msgCount} מעסעדזשעס</div>
                        </div>
                    </div>
                    ${msgCount > 5 ? '<span style="background:#ff416c; font-size:0.6rem; padding:2px 6px; border-radius:5px;">TRENDING 🔥</span>' : ''}
                </div>
            `;
        });
    });
}

// 2. עפענט א ספעציפישע גרופע מיט די נייע "2026" דעזיין
function enterGroup(id, name) {
    currentGroupId = id;
    const vp = document.getElementById('app-viewport');
    vp.innerHTML = `
        <div class="chat-container">
            <header style="padding: 15px; border-bottom: 1px solid #222; display: flex; justify-content: space-between; align-items: center; background:#000;">
                <button onclick="renderGroupsList()" style="background:none; border:none; color:#007AFF; font-size:1.2rem;">➔</button>
                <b style="font-size: 1rem;">${name}</b>
                <i class="fas fa-ellipsis-v" style="opacity:0.5;"></i>
            </header>
            
            <div id="messages-area" class="messages-area"></div>
            
            <div id="typing-status" style="padding: 0 20px; font-size: 0.7rem; color: #007AFF; height: 15px;"></div>

            <div class="input-area">
                <button onclick="sendImage()" style="background:none; border:none; color:#888; font-size:1.2rem;"><i class="fas fa-camera"></i></button>
                <input type="text" id="chatInput" placeholder="שרייב עפעס..." oninput="reportTyping()">
                <button class="send-btn" onclick="publishMessage()"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    listenToMessages(id);
}

// 3. שיקן מעסעדזשעס מיט צייט און נאמען
function publishMessage() {
    const input = document.getElementById('chatInput');
    if(!input.value.trim()) return;

    firebase.database().ref(`groups/${currentGroupId}/messages`).push({
        text: input.value,
        sender: currentUser.nickname,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        timestamp: Date.now()
    });
    input.value = "";
}

// 4. לייוו מעסעדזשעס מיט "רעאקציעס"
function listenToMessages(id) {
    firebase.database().ref(`groups/${id}/messages`).on('value', snap => {
        const area = document.getElementById('messages-area');
        if(!area) return;
        area.innerHTML = "";
        snap.forEach(child => {
            const m = child.val();
            const isMe = m.sender === currentUser.nickname;
            area.innerHTML += `
                <div class="message ${isMe ? 'my-message' : 'other-message'}" onclick="addReaction('${child.key}')">
                    <span class="msg-info">${m.sender} • ${m.time}</span>
                    <div>${m.text}</div>
                    ${m.reaction ? `<span style="position:absolute; bottom:-10px; left:10px; background:#333; border-radius:10px; padding:2px 5px; font-size:0.7rem;">${m.reaction}</span>` : ''}
                </div>
            `;
        });
        area.scrollTop = area.scrollHeight;
    });
}

// 5. טייפינג אינדיקעיטאר
function reportTyping() {
    firebase.database().ref(`groups/${currentGroupId}/typing/${currentUser.nickname}`).set(true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        firebase.database().ref(`groups/${currentGroupId}/typing/${currentUser.nickname}`).remove();
    }, 2000);
}

// 6. בילדער סיסטעם
function sendImage() {
    const el = document.createElement('input');
    el.type = 'file'; el.accept = 'image/*';
    el.onchange = (e) => uploadFileToEmpire(e.target.files[0], `groups/${currentGroupId}/messages`, 'chat_images');
    el.click();
        }
