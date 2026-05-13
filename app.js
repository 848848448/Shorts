let currentUser = {
    nickname: localStorage.getItem('nickname') || 'Guest',
    color: localStorage.getItem('userColor') || '#38bdf8'
};

// --- Page Navigation ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

// --- Status System (WhatsApp Style) ---
let currentStories = [];
let storyIdx = 0;
let storyInterval;

function triggerUpload(type) {
    const input = document.getElementById('file-upload-input');
    input.accept = type === 'status' ? 'image/*' : (type === 'video' ? 'video/*' : '*/*');
    input.onchange = (e) => uploadFile(e.target.files[0], type);
    input.click();
}

function uploadFile(file, type) {
    if (!file) return;
    const ref = storage.ref(`${type}s/${Date.now()}_${file.name}`);
    const task = ref.put(file);
    
    document.getElementById('upload-progress-container').classList.remove('hidden');
    
    task.on('state_changed', (snap) => {
        let prog = (snap.bytesTransferred / snap.totalBytes) * 100;
        document.getElementById('upload-progress-bar').style.width = prog + '%';
    }, null, () => {
        task.snapshot.ref.getDownloadURL().then(url => {
            db.ref(type).push({ url, uploader: currentUser.nickname, time: Date.now() });
            document.getElementById('upload-progress-container').classList.add('hidden');
            alert("הצלחה!");
        });
    });
}

// Listen for Statuses
db.ref('status').on('value', snap => {
    const list = document.getElementById('status-list');
    list.innerHTML = `<div class="status-item" onclick="triggerUpload('status')"><div class="plus-icon">+</div><p>Status</p></div>`;
    let stories = [];
    snap.forEach(child => { stories.push(child.val()); });
    if(stories.length > 0) {
        list.innerHTML += `<div class="status-item" onclick='openStoryViewer(${JSON.stringify(stories)})'>
            <div style="width:60px; height:60px; border-radius:50%; border:2px solid #38bdf8; overflow:hidden;">
                <img src="${stories[stories.length-1].url}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <p>Stories</p></div>`;
    }
});

function openStoryViewer(stories) {
    currentStories = stories;
    storyIdx = 0;
    document.getElementById('story-viewer').classList.remove('hidden');
    renderStory();
}

function renderStory() {
    clearInterval(storyInterval);
    const story = currentStories[storyIdx];
    document.getElementById('story-img').src = story.url;
    document.getElementById('story-username').innerText = story.uploader;
    
    const progCont = document.getElementById('story-progress-container');
    progCont.innerHTML = currentStories.map((_, i) => `<div class="progress-bar"><div class="progress-fill" id="fill-${i}"></div></div>`).join('');
    
    for(let i=0; i<storyIdx; i++) document.getElementById(`fill-${i}`).style.width = "100%";
    
    let w = 0;
    storyInterval = setInterval(() => {
        w += 2;
        document.getElementById(`fill-${storyIdx}`).style.width = w + "%";
        if(w >= 100) nextStory();
    }, 100);
}

function nextStory() {
    if(storyIdx < currentStories.length - 1) { storyIdx++; renderStory(); } 
    else closeStory();
}
function prevStory() {
    if(storyIdx > 0) { storyIdx--; renderStory(); }
}
function closeStory() {
    clearInterval(storyInterval);
    document.getElementById('story-viewer').classList.add('hidden');
}

// --- Chat System ---
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    if(!input.value.trim()) return;
    db.ref('messages').push({ sender: currentUser.nickname, text: input.value, color: currentUser.color, time: new Date().toLocaleTimeString() });
    input.value = "";
}

db.ref('messages').limitToLast(50).on('value', snap => {
    const cont = document.getElementById('chat-messages');
    cont.innerHTML = "";
    snap.forEach(child => {
        const d = child.val();
        const isMe = d.sender === currentUser.nickname;
        cont.innerHTML += `<div class="message ${isMe ? 'sent' : 'received'}"><b>${d.sender}:</b><br>${d.text}</div>`;
    });
    cont.scrollTop = cont.scrollHeight;
});

// --- Admin & Settings ---
function saveUserSettings() {
    currentUser.nickname = document.getElementById('user-nickname').value;
    currentUser.color = document.getElementById('user-color').value;
    localStorage.setItem('nickname', currentUser.nickname);
    localStorage.setItem('userColor', currentUser.color);
    if(currentUser.nickname === "MASTER_ADMIN") document.getElementById('admin-entry').classList.remove('hidden');
    alert("געסייווט!");
}

function manageContent(type) {
    if(confirm(`זיכער דו ווילסט מעקן אלע ${type}?`)) db.ref(type).remove();
}

document.getElementById('user-nickname').value = currentUser.nickname;
