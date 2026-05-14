const viewport = document.getElementById('app-viewport');

// מאכט זיכער אז יעדער האט א נאמען גלייך
let currentUser = {
    nickname: localStorage.getItem('nickname') || 'User_' + Math.floor(Math.random()*999),
    color: localStorage.getItem('userColor') || '#38bdf8'
};
localStorage.setItem('nickname', currentUser.nickname);

function loadPage(page) {
    console.log("Navigating to: " + page);
    viewport.innerHTML = ""; 
    if (page === 'home') renderHome();
    else if (page === 'chat') {
        if (typeof renderGroupsList === "function") renderGroupsList();
        else viewport.innerHTML = "<h2 style='text-align:center; padding-top:50px;'>chat.js פעלט אדער האט א טעות</h2>";
    }
    else if (page === 'videos') renderVideos();
}

function renderHome() {
    viewport.innerHTML = `
        <div style="padding: 40px 20px; text-align: center;">
            <h1 style="color: #38bdf8; font-size: 2.5rem; margin-bottom: 10px;">THE EMPIRE</h1>
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
            </div>
        </div>
    `;
}

// דאס מוז זיין דא אז דער בלאט זאל זיך עפענען גלייך
window.onload = renderHome;
