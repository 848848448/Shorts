const viewport = document.getElementById('app-viewport');

// באניצער דאטא
let currentUser = {
    nickname: localStorage.getItem('nickname') || 'Guest_' + Math.floor(Math.random()*1000),
    color: localStorage.getItem('userColor') || '#38bdf8',
    isAdmin: localStorage.getItem('isAdmin') === 'true'
};

// פונקציע צו טוישן בלעטער
function loadPage(page) {
    viewport.innerHTML = ""; // קלינען דעם סקרין
    if (page === 'home') renderHome();
    else if (page === 'chat') renderChat();
    else if (page === 'videos') renderVideos();
    else if (page === 'music') renderMusic();
    else if (page === 'admin') renderAdmin();
    window.scrollTo(0,0);
}

function renderHome() {
    viewport.innerHTML = `
        <header style="padding:30px 20px; text-align:center;">
            <h1 style="color:var(--accent); font-size:2rem; margin:0;">THE EMPIRE</h1>
            <p style="font-size:0.8rem; opacity:0.6;">שלום עליכם, ${currentUser.nickname}</p>
        </header>
        <div class="grid">
            <div class="menu-btn" onclick="loadPage('chat')"><i class="fas fa-comments"></i><span>טשעט</span></div>
            <div class="menu-btn" onclick="loadPage('videos')"><i class="fas fa-play-circle"></i><span>שאָרץ</span></div>
            <div class="menu-btn" onclick="loadPage('music')"><i class="fas fa-music"></i><span>מוזיק</span></div>
            <div class="menu-btn" onclick="loadPage('admin')"><i class="fas fa-user-shield"></i><span>אדמין</span></div>
        </div>
    `;
}

// אנהייבן דעם סייט
renderHome();
