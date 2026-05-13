// 1. באניצער דאטא
let currentUser = {
    nickname: localStorage.getItem('nickname') || 'Guest',
    color: localStorage.getItem('userColor') || '#38bdf8',
    isAdmin: false
};

// 2. סוויטשן בלעטער
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.remove('hidden');
    window.scrollTo(0, 0);
}

// 3. זוך סיסטעם
function toggleSearch() {
    document.getElementById('search-bar-container').classList.toggle('hidden');
}

// 4. טשעט סיסטעם (WhatsApp Style)
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    db.ref('messages').push({
        sender: currentUser.nickname,
        color: currentUser.color,
        text: msg,
        timestamp: Date.now(),
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
    input.value = "";
}

db.ref('messages').limitToLast(50).on('value', (snapshot) => {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    container.innerHTML = "";
    snapshot.forEach((child) => {
        const data = child.val();
        const isMe = data.sender === currentUser.nickname;
        container.innerHTML += `
            <div class="message ${isMe ? 'sent' : 'received'}">
                <span style="color:${data.color}; font-size:0.7rem; font-weight:bold; display:block;">${data.sender}</span>
                <div>${data.text}</div>
                <small style="font-size:0.6rem; opacity:0.6; display:block; text-align:left;">${data.time}</small>
            </div>
        `;
    });
    container.scrollTop = container.scrollHeight;
});

// 5. אפלאוד סיסטעם (Shorts, Music, Status)
function triggerUpload(type) {
    const input = document.getElementById('file-upload-input');
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) uploadFile(file, type);
    };
    input.click();
}

function uploadFile(file, type) {
    const ref = storage.ref(`${type}s/${Date.now()}_${file.name}`);
    const task = ref.put(file);

    task.on('state_changed', 
        (snap) => {
            const prog = (snap.bytesTransferred / snap.totalBytes) * 100;
            document.getElementById('upload-progress-bar').style.width = prog + '%';
            document.getElementById('upload-progress-container').classList.remove('hidden');
        },
        (err) => alert("Error: " + err.message),
        () => {
            task.snapshot.ref.getDownloadURL().then(url => {
                db.ref(type === 'video' ? 'shorts' : type === 'audio' ? 'music' : 'status').push({
                    url, uploader: currentUser.nickname, time: Date.now()
                });
                document.getElementById('upload-progress-container').classList.add('hidden');
                alert("פערטיג ארויפגעלאדן!");
            });
        }
    );
}

// 6. סעטינגס & אדמין לאגין
function saveUserSettings() {
    const nick = document.getElementById('user-nickname').value;
    const col = document.getElementById('user-color').value;
    if (nick) {
        localStorage.setItem('nickname', nick);
        localStorage.setItem('userColor', col);
        currentUser.nickname = nick;
        currentUser.color = col;
        
        // אדמין סוד: טייפ MASTER_ADMIN
        if (nick === "MASTER_ADMIN") {
            document.getElementById('admin-entry').classList.remove('hidden');
            alert("ADMIN MODE ON");
        } else {
            alert("סעטינגס געסייווט!");
        }
    }
}

// 7. אדמין קאנטראל (מעקן זאכן)
function manageContent() {
    const pass = prompt("לייג אריין אדמין Password:");
    if (pass === "1234") { // דו קענסט עס טוישן
        const path = prompt("וואס ווילסטו מעקן? (shorts/messages/music)");
        if (path) db.ref(path).remove().then(() => alert("אלעס אויסגעמעקט!"));
    }
}

// לאדן דאטא ביים אנהייב
document.getElementById('user-nickname').value = currentUser.nickname;
document.getElementById('user-color').value = currentUser.color;
