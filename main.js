const viewport = document.getElementById('app-viewport');
const db = firebase.database();

let currentUser = {
    nickname: localStorage.getItem('nickname') || 'Guest_' + Math.floor(Math.random()*1000),
    color: localStorage.getItem('userColor') || '#38bdf8'
};

function loadPage(page) {
    if (page === 'home') renderHome();
    else if (page === 'chat') renderChat();
    else if (page === 'videos') renderVideos();
    else if (page === 'music') renderMusic();
}

function renderHome() {
    viewport.innerHTML = `
        <h1 style="text-align:center; color:var(--accent); padding-top:40px;">THE EMPIRE</h1>
        <div class="grid">
            <div class="menu-btn" onclick="loadPage('chat')"><i class="fas fa-comments"></i><span>טשעט</span></div>
            <div class="menu-btn" onclick="loadPage('videos')"><i class="fas fa-play"></i><span>שאָרץ</span></div>
            <div class="menu-btn" onclick="loadPage('music')"><i class="fas fa-music"></i><span>מוזיק</span></div>
            <div class="menu-btn" onclick="loadPage('home')"><i class="fas fa-cog"></i><span>סעטינגס</span></div>
        </div>
    `;
}

function uploadFileToEmpire(file, type) {
    const barCont = document.getElementById('upload-progress-container');
    const bar = document.getElementById('upload-progress-bar');
    barCont.classList.remove('hidden');
    
    const ref = firebase.storage().ref(`${type}s/${Date.now()}_${file.name}`);
    const task = ref.put(file);

    task.on('state_changed', 
        snap => { bar.style.width = (snap.bytesTransferred / snap.totalBytes * 100) + '%'; },
        err => { alert(err.message); barCont.classList.add('hidden'); },
        () => {
            task.snapshot.ref.getDownloadURL().then(url => {
                db.ref(type).push({ url, uploader: currentUser.nickname, time: Date.now(), likes: 0 });
                barCont.classList.add('hidden');
                alert("ארויפגעלאדן!");
            });
        }
    );
}

renderHome();
