// --- User Setup ---
let currentUser = {
    nickname: localStorage.getItem('nickname') || 'Guest_' + Math.floor(Math.random()*1000),
    color: localStorage.getItem('userColor') || '#38bdf8'
};

const storage = firebase.storage();
const db = firebase.database();

// --- Navigation ---
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    window.scrollTo(0,0);
}

// --- Online Status ---
const userStatusRef = db.ref('status_online/' + currentUser.nickname);
db.ref('.info/connected').on('value', (snap) => {
    if (snap.val() === true) {
        userStatusRef.onDisconnect().remove();
        userStatusRef.set({ status: "online" });
    }
});

db.ref('status_online').on('value', snap => {
    const list = document.getElementById('online-users-list');
    list.innerHTML = "";
    snap.forEach(child => {
        list.innerHTML += `<div class="online-user" onclick="startPrivateChat('${child.key}')"><span class="dot"></span> ${child.key}</div>`;
    });
});

// --- Public Chat ---
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    if(!input.value.trim()) return;
    db.ref('public_chat').push({ sender: currentUser.nickname, text: input.value });
    input.value = "";
}

db.ref('public_chat').limitToLast(50).on('value', snap => {
    const cont = document.getElementById('chat-messages');
    cont.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        cont.innerHTML += `<div class="msg ${d.sender === currentUser.nickname ? 'sent' : ''}"><b>${d.sender}:</b><br>${d.text}</div>`;
    });
    cont.scrollTop = cont.scrollHeight;
});

// --- Private Chat ---
let currentPartner = "";
function startPrivateChat(name) {
    if(name === currentUser.nickname) return;
    currentPartner = name;
    document.getElementById('private-chat-title').innerText = "טשעט מיט " + name;
    showPage('private-chat-page');
    loadPrivateMessages();
}

function loadPrivateMessages() {
    const id = [currentUser.nickname, currentPartner].sort().join('_');
    db.ref('private_chats/' + id).on('value', snap => {
        const cont = document.getElementById('private-messages-cont');
        cont.innerHTML = "";
        snap.forEach(c => {
            const d = c.val();
            cont.innerHTML += `<div class="msg ${d.sender === currentUser.nickname ? 'sent' : ''}">${d.text}</div>`;
        });
        cont.scrollTop = cont.scrollHeight;
    });
}

function sendPrivateMsg() {
    const input = document.getElementById('private-input');
    if(!input.value.trim()) return;
    const id = [currentUser.nickname, currentPartner].sort().join('_');
    db.ref('private_chats/' + id).push({ sender: currentUser.nickname, text: input.value });
    input.value = "";
}

// --- Settings ---
function saveUserSettings() {
    currentUser.nickname = document.getElementById('user-nickname').value;
    currentUser.color = document.getElementById('user-color').value;
    localStorage.setItem('nickname', currentUser.nickname);
    localStorage.setItem('userColor', currentUser.color);
    alert("געסייווט!");
    location.reload();
}

document.getElementById('user-nickname').value = currentUser.nickname;
document.getElementById('user-color').value = currentUser.color;
