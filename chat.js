// chat.js - FIXED VERSION
function renderGroupsList() {
    const vp = document.getElementById('app-viewport');
    if (!vp) return;

    vp.innerHTML = `
        <div class="chat-container">
            <header>
                <i class="fas fa-bars" style="color:var(--primary)"></i>
                <b style="letter-spacing:1px; font-size:1.1rem;">EMPIRE CHAT</b>
                <button onclick="createNewGroup()" class="send-btn" style="width:32px; height:32px; font-size:0.8rem; display:flex; align-items:center; justify-content:center;">+</button>
            </header>
            <div id="groups-container" style="flex:1; overflow-y:auto; padding:15px;"></div>
        </div>
    `;
    
    // נוצן דירעקטן פייערבbase רוף
    firebase.database().ref('groups').on('value', snap => {
        const container = document.getElementById('groups-container');
        if(!container) return;
        container.innerHTML = "";
        
        if (!snap.exists()) {
            container.innerHTML = "<div style='text-align:center; opacity:0.5; margin-top:50px;'>נאכנישט דא קיין גרופעס.<br>דרוק דעם + צו מאכן איינס!</div>";
            return;
        }

        snap.forEach(child => {
            const g = child.val();
            container.innerHTML += `
                <div onclick="openGroup('${child.key}', '${g.name}')" 
                     style="background:var(--card-bg); margin-bottom:12px; padding:18px; border-radius:15px; display:flex; align-items:center; gap:15px; border:1px solid #222; cursor:pointer;">
                    <div style="background:linear-gradient(45deg, var(--primary), var(--secondary)); width:50px; height:50px; border-radius:15px; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:1.2rem;">
                        ${g.name ? g.name[0].toUpperCase() : '?'}
                    </div>
                    <div style="flex:1">
                        <div style="font-weight:bold; font-size:1rem;">${g.name}</div>
                        <div style="font-size:0.75rem; color:#888;">קליק ארנצוגיין</div>
                    </div>
                    <i class="fas fa-chevron-left" style="opacity:0.3; font-size:0.8rem;"></i>
                </div>
            `;
        });
    });
}

function createNewGroup() {
    const n = prompt("נאמען פאר די נייע גרופע:");
    if (!n || n.trim() === "") return;

    // זיכער מאכן אז מיר האבן א ניקנאמען
    const senderName = (typeof currentUser !== 'undefined' && currentUser.nickname) ? currentUser.nickname : "Admin";

    firebase.database().ref('groups').push({ 
        name: n, 
        createdBy: senderName,
        timestamp: Date.now()
    }).then(() => {
        console.log("גרופע באשאפן מיט הצלחה!");
    }).catch(err => {
        alert("פעלער: " + err.message);
    });
}

// די פונקציע מוז אויך דא זיין כדי openGroup זאל ארבעטן
function openGroup(id, name) {
    currentGroupId = id;
    const vp = document.getElementById('app-viewport');
    vp.innerHTML = `
        <div class="chat-container">
            <header>
                <button onclick="renderGroupsList()" style="background:none; border:none; color:var(--primary); font-size:1.2rem;"><i class="fas fa-arrow-right"></i></button>
                <b>${name}</b>
                <i class="fas fa-info-circle" style="opacity:0.5"></i>
            </header>
            <div id="msg-box" class="messages-area"></div>
            <div id="typing-box" style="padding:0 25px; height:18px; font-size:0.7rem; color:var(--primary);"></div>
            <div class="input-area">
                <input type="text" id="mInput" placeholder="שרייב עפעס פריש..." oninput="isTyping()">
                <button class="send-btn" onclick="postMsg()"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    loadMessages(id);
}

// ... די איבריגע פונקציעס (loadMessages, postMsg, וכו') בלייבן די זעלבע ווי פריער
