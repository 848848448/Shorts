let currentUser = {
    nickname: localStorage.getItem('nickname') || 'Guest',
    color: localStorage.getItem('userColor') || '#38bdf8'
};

const storage = firebase.storage();

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById(pageId);
    if(target) target.classList.remove('hidden');
    window.scrollTo(0,0);
}

function toggleSearch() {
    document.getElementById('search-bar-container').classList.toggle('hidden');
}

// --- Upload Logic ---
function triggerUpload(type) {
    const input = document.getElementById('file-upload-input');
    input.accept = type === 'status' ? 'image/*' : (type === 'video' ? 'video/*' : '*/*');
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const ref = storage.ref(`${type}s/${Date.now()}_${file.name}`);
        const task = ref.put(file);
        
        document.getElementById('upload-progress-container').classList.remove('hidden');
        
        task.on('state_changed', 
            (snap) => {
                let prog = (snap.bytesTransferred / snap.totalBytes) * 100;
                document.getElementById('upload-progress-bar').style.width = prog + '%';
            }, 
            (err) => { alert("Error: " + err.message); document.getElementById('upload-progress-container').classList.add('hidden'); }, 
            () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    db.ref(type).push({ url, uploader: currentUser.nickname, time: Date.now() });
                    document.getElementById('upload-progress-container').classList.add('hidden');
                    alert("פערטיג!");
                });
            }
        );
    };
    input.click();
}

// --- Stories ---
let storyList = [];
let sIdx = 0;
let sTimer;

db.ref('status').on('value', snap => {
    const list = document.getElementById('status-list');
    list.innerHTML = `<div class="status-item" onclick="triggerUpload('status')"><div class="plus-icon"><i class="fas fa-plus"></i></div><p>Status</p></div>`;
    storyList = [];
    snap.forEach(c => storyList.push(c.val()));
    if(storyList.length > 0) {
        const lastImg = storyList[storyList.length-1].url;
        list.innerHTML += `
            <div class="status-item" onclick="openStories()">
                <div style="width:60px; height:60px; border-radius:50%; border:2px solid #38bdf8; overflow:hidden; margin:0 auto;">
                    <img src="${lastImg}" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <p>Stories</p>
            </div>`;
    }
});

function openStories() {
    if(storyList.length === 0) return;
    sIdx = 0;
    document.getElementById('story-viewer').classList.remove('hidden');
    playStory();
}

function playStory() {
    clearInterval(sTimer);
    const s = storyList[sIdx];
    const img = document.getElementById('story-img');
    img.src = s.url;
    document.getElementById('story-username').innerText = s.uploader;
    
    const prog = document.getElementById('story-progress-container');
    prog.innerHTML = storyList.map((_, i) => `<div class="progress-bar"><div class="progress-fill" id="f-${i}"></div></div>`).join('');
    
    for(let i=0; i<sIdx; i++) document.getElementById(`f-${i}`).style.width = "100%";
    
    let w = 0;
    sTimer = setInterval(() => {
        w += 1;
        const fill = document.getElementById(`f-${sIdx}`);
        if(fill) fill.style.width = w + "%";
        if(w >= 100) nextStory();
    }, 40);
}

function nextStory() {
    if(sIdx < storyList.length - 1) { sIdx++; playStory(); } 
    else closeStory();
}
function prevStory() {
    if(sIdx > 0) { sIdx--; playStory(); }
}
function closeStory() {
    clearInterval(sTimer);
    document.getElementById('story-viewer').classList.add('hidden');
}

// --- Chat ---
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const txt = input.value.trim();
    if(!txt) return;
    db.ref('messages').push({ sender: currentUser.nickname, text: txt, color: currentUser.color, time: Date.now() });
    input.value = "";
}

db.ref('messages').limitToLast(50).on('value', snap => {
    const cont = document.getElementById('chat-messages');
    if(!cont) return;
    cont.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const isMe = d.sender === currentUser.nickname;
        cont.innerHTML += `<div class="message ${isMe ? 'sent' : 'received'}"><b>${d.sender}:</b><br>${d.text}</div>`;
    });
    cont.scrollTop = cont.scrollHeight;
});

// --- Settings ---
function saveUserSettings() {
    const nick = document.getElementById('user-nickname').value;
    const col = document.getElementById('user-color').value;
    if(nick) {
        currentUser.nickname = nick;
        currentUser.color = col;
        localStorage.setItem('nickname', nick);
        localStorage.setItem('userColor', col);
        if(nick === "MASTER_ADMIN") document.getElementById('admin-entry').classList.remove('hidden');
        alert("געסייווט!");
    }
}

// Init
document.getElementById('user-nickname').value = currentUser.nickname;
document.getElementById('user-color').value = currentUser.color;
