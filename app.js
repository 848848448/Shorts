// 1. גלאבאלע וועריאבלס
let currentUser = {
    nickname: localStorage.getItem('nickname') || 'Guest',
    color: localStorage.getItem('userColor') || '#38bdf8',
    isAdmin: false // מיר וועלן דאס טוישן שפעטער אינעם אדמין לאגין
};

// 2. Page Navigation - סוויטשן צווישן בלעטער
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    window.scrollTo(0, 0);
}

// 3. זוך-באר טאגעל
function toggleSearch() {
    const bar = document.getElementById('search-bar-container');
    bar.classList.toggle('hidden');
}

// 4. ארויפלאדן סיסטעם (אויטאמאטיש אן קיין נאמען)
function triggerUpload(type) {
    const fileInput = document.getElementById('file-upload-input');
    fileInput.accept = type === 'video' ? 'video/*' : type === 'audio' ? 'audio/*' : 'image/*';
    fileInput.onchange = (e) => uploadToFirebase(e.target.files[0], type);
    fileInput.click();
}

function uploadToFirebase(file, type) {
    if (!file) return;

    const storageRef = firebase.storage().ref(`${type}s/${Date.now()}_${file.name}`);
    const uploadTask = storageRef.put(file);
    const progressContainer = document.getElementById('upload-progress-container');
    const progressBar = document.getElementById('upload-progress-bar');

    progressContainer.classList.remove('hidden');

    uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.style.width = progress + '%';
            progressBar.innerText = Math.round(progress) + '%';
        }, 
        (error) => { console.error(error); alert("Upload Failed!"); }, 
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                saveToDatabase(url, type, file.name);
                progressContainer.classList.add('hidden');
                progressBar.style.width = '0%';
                alert(type.toUpperCase() + " ארויפגעלאדן הצלחה'דיג!");
            });
        }
    );
}

function saveToDatabase(url, type, originalName) {
    const dbPath = type === 'video' ? 'shorts' : type === 'audio' ? 'music' : 'photos';
    db.ref(dbPath).push({
        url: url,
        name: originalName,
        uploader: currentUser.nickname,
        timestamp: Date.now(),
        likes: 0
    });
}

// 5. וואטסעפ טשעט לאגיק
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (text === "") return;

    db.ref('messages').push({
        sender: currentUser.nickname,
        color: currentUser.color,
        text: text,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
    input.value = "";
}

// לייוו טשעט ריסיווער
db.ref('messages').limitToLast(50).on('value', (snapshot) => {
    const container = document.getElementById('chat-messages');
    container.innerHTML = "";
    snapshot.forEach((child) => {
        const data = child.val();
        const isMe = data.sender === currentUser.nickname;
        container.innerHTML += `
            <div class="message ${isMe ? 'sent' : 'received'}">
                <span class="msg-info" style="color: ${data.color}">${data.sender}</span>
                ${data.text}
                <small style="display:block; font-size:0.6rem; opacity:0.7;">${data.time}</small>
            </div>
        `;
    });
    container.scrollTop = container.scrollHeight;
});

// 6. Shorts Renderer (YouTube Style)
db.ref('shorts').on('value', (snapshot) => {
    const container = document.getElementById('shorts-container');
    container.innerHTML = "";
    snapshot.forEach((child) => {
        const v = child.val();
        container.innerHTML += `
            <div class="short-video-container">
                <video src="${v.url}" loop onclick="this.paused ? this.play() : this.pause()"></video>
                <div class="shorts-overlay" style="position:absolute; bottom:80px; right:20px; display:flex; flex-direction:column; gap:20px;">
                    <i class="fas fa-heart" style="font-size:1.8rem;"></i>
                    <i class="fas fa-comment" style="font-size:1.8rem;"></i>
                    <i class="fas fa-share" style="font-size:1.8rem;"></i>
                </div>
                <div style="position:absolute; bottom:20px; right:20px;">
                    <p>@${v.uploader}</p>
                </div>
            </div>
        `;
    });
});

// 7. פראפיל סעטינגס
function saveUserSettings() {
    const nick = document.getElementById('user-nickname').value;
    const col = document.getElementById('user-color').value;
    if (nick) {
        localStorage.setItem('nickname', nick);
        localStorage.setItem('userColor', col);
        currentUser.nickname = nick;
        currentUser.color = col;
        alert("סעטינגס געסייווט!");
    }
}

// 8. אדמין טשעק (פשוט'ע ווערסיע)
document.getElementById('user-nickname').addEventListener('input', (e) => {
    if (e.target.value === "MASTER_ADMIN") { // דאס איז דיין סוד
        document.getElementById('admin-entry').classList.remove('hidden');
    }
});

// Load Nickname on Start
document.getElementById('user-nickname').value = currentUser.nickname;
document.getElementById('user-color').value = currentUser.color;
