let currentUser = {
    nickname: localStorage.getItem('nickname') || 'Guest',
    color: localStorage.getItem('userColor') || '#38bdf8'
};

const storage = firebase.storage(); // דאס מוז זיין דא!

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    window.scrollTo(0,0);
}

// --- Upload System ---
function triggerUpload(type) {
    const input = document.getElementById('file-upload-input');
    input.accept = type === 'status' ? 'image/*' : 'video/*,audio/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const ref = storage.ref(`${type}s/${Date.now()}_${file.name}`);
            const task = ref.put(file);
            document.getElementById('upload-progress-container').classList.remove('hidden');
            
            task.on('state_changed', (snap) => {
                let prog = (snap.bytesTransferred / snap.totalBytes) * 100;
                document.getElementById('upload-progress-bar').style.width = prog + '%';
            }, (err) => { alert("Error: " + err.message); }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    db.ref(type).push({ url, uploader: currentUser.nickname, time: Date.now() });
                    document.getElementById('upload-progress-container').classList.add('hidden');
                    alert("ארויפגעלאדן!");
                });
            });
        }
    };
    input.click();
}

// --- Status Viewer ---
let storyList = [];
let sIdx = 0;
let sTimer;

db.ref('status').on('value', snap => {
    const list = document.getElementById('status-list');
    list.innerHTML = `<div class="status-item" onclick="triggerUpload('status')"><div class="plus-icon">+</div><p>Status</p></div>`;
    storyList = [];
    snap.forEach(c => storyList.push(c.val()));
    if(storyList.length > 0) {
        list.innerHTML += `<div class="status-item" onclick="openStories()">
            <div style="width:60px; height:60px; border-radius:50%; border:2px solid #38bdf8; overflow:hidden;">
                <img src="${storyList[storyList.length-1].url}" style="width:100%; height:100%; object-fit:cover;">
            </div><p>Stories</p></div>`;
    }
});

function openStories() {
    sIdx = 0;
    document.getElementById('story-viewer').classList.remove('hidden');
    playStory();
}

function playStory() {
    clearInterval(sTimer);
    const s = storyList[sIdx];
    document.getElementById('story-img').src = s.url;
    document.getElementById('story-username').innerText = s.uploader;
    const prog = document.getElementById('story-progress-container');
    prog.innerHTML = storyList.map((_, i) => `<div class="progress-bar"><div class="progress-fill" id="f-${i}"></div></div>`).join('');
    for(let i=0; i<sIdx; i++) document.getElementById(`f-${i}`).style.width = "100%";
    let w = 0;
    sTimer = setInterval(() => {
        w += 1;
        document.getElementById(`f-${sIdx}`).style.width = w + "%";
        if(w >= 100) nextStory();
    }, 50);
}

function nextStory() {
    if(sIdx < storyList.length - 1) { sIdx++; playStory(); } else closeStory();
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
    if(!input.value.trim()) return;
    db.ref('messages').push({ sender: currentUser.nickname, text: input.value, color: currentUser.color });
    input.value = "";
}

db.ref('messages').limitToLast(30).on('value', snap => {
    const cont = document.getElementById('chat-messages');
    cont.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        cont.innerHTML += `<div class="message ${d.sender === currentUser.nickname ? 'sent' : ''}"><b>${d.sender}:</b><br>${d.text}</div>`;
    });
    cont.scrollTop = cont.scrollHeight;
});

function saveUserSettings() {
    currentUser.nickname = document.getElementById('user-nickname').value;
    currentUser.color = document.getElementById('user-color').value;
    localStorage.setItem('nickname', currentUser.nickname);
    if(currentUser.nickname === "MASTER_ADMIN") document.getElementById('admin-entry').classList.remove('hidden');
    alert("געסייווט!");
                    }
