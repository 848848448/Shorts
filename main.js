// main.js
const viewport = document.getElementById('app-viewport');

// באניצער דעטאלן
let currentUser = {
    nickname: localStorage.getItem('nickname') || 'User_' + Math.floor(Math.random()*999),
    color: localStorage.getItem('userColor') || '#38bdf8'
};

// פונקציע צו טוישן בלעטער - דאס פרינט די HTML אויפן סקרין
function loadPage(page) {
    console.log("Loading page: " + page);
    viewport.innerHTML = ""; 
    
    if (page === 'home') {
        renderHome();
    } else if (page === 'chat') {
        if (typeof renderChat === "function") renderChat();
    } else if (page === 'videos') {
        if (typeof renderVideos === "function") renderVideos();
    } else if (page === 'music') {
        if (typeof renderMusic === "function") renderMusic();
    }
}

function renderHome() {
    viewport.innerHTML = `
        <div class="home-container">
            <h1 class="main-logo">THE EMPIRE</h1>
            <div class="grid">
                <div class="menu-btn" onclick="loadPage('videos')">
                    <i class="fas fa-play-circle"></i>
                    <span>שאָרץ</span>
                </div>
                <div class="menu-btn" onclick="loadPage('chat')">
                    <i class="fas fa-comments"></i>
                    <span>קאמיוניטי טשעט</span>
                </div>
                <div class="menu-btn" onclick="loadPage('home')">
                    <i class="fas fa-cog"></i>
                    <span>סעטינגס</span>
                </div>
                <div class="menu-btn" onclick="loadPage('music')">
                    <i class="fas fa-music"></i>
                    <span>מוזיק</span>
                </div>
            </div>
        </div>
    `;
}

// Upload Function (פאר אלע פיילס)
function uploadFileToEmpire(file, type) {
    const barCont = document.getElementById('upload-progress-container');
    const bar = document.getElementById('upload-progress-bar');
    barCont.classList.remove('hidden');
    
    const storageRef = firebase.storage().ref(`${type}s/${Date.now()}_${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
        (snap) => { bar.style.width = (snap.bytesTransferred / snap.totalBytes * 100) + '%'; }, 
        (err) => { alert(err.message); barCont.classList.add('hidden'); }, 
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
                firebase.database().ref(type).push({
                    url: url, uploader: currentUser.nickname, time: Date.now(), likes: 0
                });
                barCont.classList.add('hidden');
                alert("Upload Success!");
            });
        }
    );
}

// אנהייבן דעם סייט
window.onload = () => {
    renderHome();
};
