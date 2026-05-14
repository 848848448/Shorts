// Firebase Config (מער זיכער - נוצט דיין עקזיסטירנדע אינסטאנץ)
const db = firebase.database();
let currentGroupId = null;

// די הויפט פונקציע וואס Screenshot_20260514-015617.png האט געזוכט
function renderGroupsList() {
    const vp = document.getElementById('app-viewport');
    vp.innerHTML = `
        <div class="chat-container">
            <header>
                <i class="fas fa-bars" style="color:var(--primary)"></i>
                <b style="letter-spacing:1px; font-size:1.1rem;">EMPIRE CHAT</b>
                <button onclick="createNewGroup()" class="send-btn" style="width:32px; height:32px; font-size:0.8rem;">+</button>
            </header>
            <div id="groups-container" style="flex:1; overflow-y:auto; padding:15px;"></div>
        </div>
    `;
    
    db.ref('groups').on('value', snap => {
        const container = document.getElementById('groups-container');
        if(!container) return;
        container.innerHTML = "";
        snap.forEach(child => {
            const g = child.val();
            container.innerHTML += `
                <div onclick="openGroup('${child.key}', '${g.name}')" 
                     style="background:var(--card-bg); margin-bottom:12px; padding:18px; border-radius:15px; display:flex; align-items:center; gap:15px; border:1px solid #222;">
                    <div style="background:linear-gradient(45deg, #333, #111); width:50px; height:50px; border-radius:15px; display:flex; align-items:center; justify-content:center; color:var(--primary); font-weight:bold; font-size:1.2rem;">
                        ${g.name[0].toUpperCase()}
                    </div>
                    <div style="flex:1">
                        <div style="font-weight:bold; font-size:1rem;">${g.name}</div>
                        <div style="font-size:0.75rem; color:#888;">קליק ארנצוגיין</div>
                    </div>
                    <i class="fas fa-chevron-left" style="opacity:0.3; font-size:0.8rem;"></i>
                </div>
            `;
        });
    });
}

function openGroup(id, name) {
    currentGroupId = id;
    const vp = document.getElementById('app-viewport');
    vp.innerHTML = `
        <div class="chat-container">
            <header>
                <button onclick="renderGroupsList()" style="background:none; border:none; color:var(--primary); font-size:1.2rem;"><i class="fas fa-arrow-right"></i></button>
                <b>${name}</b>
                <i class="fas fa-info-circle" style="opacity:0.5"></i>
            </header>
            <div id="msg-box" class="messages-area"></div>
            <div id="typing-box" style="padding:0 25px; height:18px; font-size:0.7rem; color:var(--primary);"></div>
            <div class="input-area">
                <button onclick="triggerUpload()" style="background:none; border:none; color:#777; font-size:1.3rem;"><i class="fas fa-image"></i></button>
                <input type="text" id="mInput" placeholder="שרייב עפעס פריש..." oninput="isTyping()">
                <button class="send-btn" onclick="postMsg()"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    loadMessages(id);
}

function loadMessages(id) {
    db.ref(`groups/${id}/messages`).limitToLast(50).on('value', snap => {
        const box = document.getElementById('msg-box');
        if(!box) return;
        box.innerHTML = "";
        snap.forEach(child => {
            const m = child.val();
            const isMe = m.sender === currentUser.nickname;
            box.innerHTML += `
                <div class="message ${isMe ? 'my-message' : 'other-message'}">
                    <span class="msg-info">${m.sender} • ${m.time}</span>
                    <div>${m.text}</div>
                </div>
            `;
        });
        box.scrollTop = box.scrollHeight;
    });
    
    // Typing indicator logic
    db.ref(`groups/${id}/typing`).on('value', snap => {
        const tBox = document.getElementById('typing-box');
        if(!tBox) return;
        let typers = [];
        snap.forEach(u => { if(u.key !== currentUser.nickname) typers.push(u.key); });
        tBox.innerText = typers.length > 0 ? typers.join(', ') + " שרייבט יעצט..." : "";
    });
}

function postMsg() {
    const inp = document.getElementById('mInput');
    if(!inp.value.trim()) return;
    db.ref(`groups/${currentGroupId}/messages`).push({
        text: inp.value,
        sender: currentUser.nickname,
        time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
        ts: Date.now()
    });
    inp.value = "";
    db.ref(`groups/${currentGroupId}/typing/${currentUser.nickname}`).remove();
}

function isTyping() {
    db.ref(`groups/${currentGroupId}/typing/${currentUser.nickname}`).set(true);
    clearTimeout(window.tOut);
    window.tOut = setTimeout(() => db.ref(`groups/${currentGroupId}/typing/${currentUser.nickname}`).remove(), 2000);
}

function createNewGroup() {
    const n = prompt("נאמען פאר די נייע גרופע:");
    if(n) db.ref('groups').push({ name: n, createdBy: currentUser.nickname });
}
