const viewport = document.getElementById('app-viewport');

// 1. באניצער סיסטעם - מאכט זיכער אז יעדער קען גראד טעקסטן
let currentUser = {
    nickname: localStorage.getItem('nickname') || 'גאסט_' + Math.floor(Math.random()*9999),
    color: localStorage.getItem('userColor') || '#38bdf8'
};
localStorage.setItem('nickname', currentUser.nickname);

// 2. פונקציע צו טוישן בלעטער
function loadPage(page) {
    viewport.innerHTML = ""; 
    if (page === 'home') renderHome();
    else if (page === 'chat') renderGroupsList(); // נייע גרופעס סיסטעם
    else if (page === 'videos') renderVideos();
    else if (page === 'music') renderMusic();
}

// 3. הויפט בלאט דעזיין
function renderHome() {
    viewport.innerHTML = `
        <div style="padding: 40px 20px; text-align: center;">
            <h1 style="color: var(--accent); font-size: 2.5rem; margin-bottom: 10px;">THE EMPIRE</h1>
            <p style="opacity: 0.6; margin-bottom: 30px;">שלום עליכם, ${currentUser.nickname}</p>
            
            <div class="grid">
                <div class="menu-btn" onclick="loadPage('chat')">
                    <i class="fas fa-users"></i>
                    <span>גרופעס & טשעט</span>
                </div>
                <div class="menu-btn" onclick="loadPage('videos')">
                    <i class="fas fa-play-circle"></i>
                    <span>שאָרץ</span>
                </div>
                <div class="menu-btn" onclick="loadPage('music')">
                    <i class="fas fa-music"></i>
                    <span>מוזיק</span>
                </div>
                <div class="menu-btn" onclick="loadPage('home')">
                    <i class="fas fa-cog"></i>
                    <span>סעטינגס</span>
                </div>
            </div>
        </div>
    `;
}

// 4. גלאבאלע Upload פונקציע (פאר בילדער, ווידעא, מוזיק)
function uploadFileToEmpire(file, type, folder) {
    const barCont = document.getElementById('upload-progress-container');
    const bar = document.getElementById('upload-progress-bar');
    barCont.classList.remove('hidden');
    
    const storageRef = firebase.storage().ref(`${folder}/${Date.now()}_${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
        (snap) => { bar.style.width = (snap.bytesTransferred / snap.totalBytes * 100) + '%'; }, 
        (err) => { alert("Upload Error: " + err.message); barCont.classList.add('hidden'); }, 
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
                firebase.database().ref(type).push({
                    url: url,
                    uploader: currentUser.nickname,
                    time: Date.now(),
                    likes: 0
                });
                barCont.classList.add('hidden');
                alert("Upload Success!");
            });
        }
    );
}

// אנהייבן דעם סייט גראד ביים לאדנט
window.onload = renderHome;
