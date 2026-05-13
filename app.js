// --- באַניצער דאַטאַ ---
let currentUser = {
    nickname: localStorage.getItem('nickname') || 'Guest_' + Math.floor(Math.random()*1000),
    color: localStorage.getItem('userColor') || '#38bdf8',
    isAdmin: localStorage.getItem('isAdmin') === 'true'
};

const storage = firebase.storage();

// --- אָנליין סטאַטוס סיסטעם ---
const onlineRef = db.ref('.info/connected');
const userStatusRef = db.ref('status_online/' + currentUser.nickname);

onlineRef.on('value', (snap) => {
    if (snap.val() === false) return;
    userStatusRef.onDisconnect().remove().then(() => {
        userStatusRef.set({ status: "online", last_seen: Date.now() });
    });
});

// ווייזן ווער איז אָנליין
db.ref('status_online').on('value', snap => {
    const list = document.getElementById('online-users-list');
    if(!list) return;
    list.innerHTML = "";
    snap.forEach(child => {
        list.innerHTML += `<div class="online-user" onclick="startPrivateChat('${child.key}')">
            <span class="dot"></span> ${child.key}
        </div>`;
    });
});

// --- פּריוואַטע טשעט לאָגיק ---
let currentChatPartner = null;

function startPrivateChat(partner) {
    if(partner === currentUser.nickname) return;
    currentChatPartner = partner;
    showPage('private-chat-page');
    document.getElementById('private-chat-title').innerText = "שמועס מיט " + partner;
    loadPrivateMessages();
}

function loadPrivateMessages() {
    const chatID = [currentUser.nickname, currentChatPartner].sort().join('_');
    db.ref('private_messages/' + chatID).limitToLast(50).on('value', snap => {
        const cont = document.getElementById('private-messages-cont');
        cont.innerHTML = "";
        snap.forEach(child => {
            const d = child.val();
            const isMe = d.sender === currentUser.nickname;
            cont.innerHTML += `<div class="msg ${isMe ? 'sent' : 'received'}">${d.text}</div>`;
        });
        cont.scrollTop = cont.scrollHeight;
    });
}

function sendPrivateMsg() {
    const input = document.getElementById('private-input');
    if(!input.value.trim() || !currentChatPartner) return;
    const chatID = [currentUser.nickname, currentChatPartner].sort().join('_');
    db.ref('private_messages/' + chatID).push({
        sender: currentUser.nickname,
        text: input.value,
        time: Date.now()
    });
    input.value = "";
}

// --- Upload מיט פּראָגרעס (Shorts/Status) ---
function triggerUpload(type) {
    const input = document.getElementById('file-upload-input');
    input.onchange = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const ref = storage.ref(`${type}s/${Date.now()}_${file.name}`);
        const task = ref.put(file);
        
        document.getElementById('upload-progress-container').classList.remove('hidden');
        task.on('state_changed', (snap) => {
            let prog = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            document.getElementById('upload-progress-bar').style.width = prog + '%';
        }, null, () => {
            task.snapshot.ref.getDownloadURL().then(url => {
                db.ref(type).push({ url, uploader: currentUser.nickname, time: Date.now() });
                document.getElementById('upload-progress-container').classList.add('hidden');
                alert("ארויפֿגעלאָדן!");
            });
        });
    };
    input.click();
}

// --- Page Switcher ---
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
                                               }
