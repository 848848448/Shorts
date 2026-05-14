// main.js - THE EMPIRE COMPLETE CORE (RE-ENGINEERED)

// 1. האנדלט די גאנצע "Routing" (וואס Screenshot_20260514-015617.png האט געזוכט)
function loadPage(page) {
    const vp = document.getElementById('app-viewport');
    if (!vp) return;
    
    vp.innerHTML = ""; // רייניגט די פעידזש

    if (page === 'home') {
        renderHome();
    } else if (page === 'chat') {
        renderGroupsList(); // דאס עפנט די גרופעס
    }
}

// 2. די הויפט גרופעס ליסטע - פאקטישע דעזיין 2026
function renderGroupsList() {
    const vp = document.getElementById('app-viewport');
    vp.innerHTML = `
        <div class="chat-container">
            <header style="display:flex; justify-content:space-between; align-items:center; padding:15px; background:#000; border-bottom:1px solid #222;">
                <button onclick="loadPage('home')" style="background:none; border:none; color:#00d2ff; font-size:1.5rem;">➔</button>
                <b style="color:white; font-size:1.2rem; letter-spacing:1px;">EMPIRE CHAT</b>
                <button onclick="createNewGroup()" style="background:#00d2ff; border:none; width:35px; height:35px; border-radius:50%; color:black; font-weight:bold; font-size:1.2rem;">+</button>
            </header>
            <div id="groups-list-area" style="flex:1; overflow-y:auto; padding:15px;">
                <!-- דא קומען די גרופעס -->
            </div>
        </div>
    `;
    
    // ציען גרופעס פונעם דאטנבאזע
    firebase.database().ref('groups').on('value', (snap) => {
        const area = document.getElementById('groups-list-area');
        if (!area) return;
        area.innerHTML = "";

        if (!snap.exists()) {
            area.innerHTML = "<div style='color:#555; text-align:center; margin-top:50px;'>נאכנישט דא קיין גרופעס.<br>מאך די ערשטע גרופע מיט'ן + קנעפל.</div>";
            return;
        }

        snap.forEach(child => {
            const g = child.val();
            area.innerHTML += `
                <div onclick="enterChat('${child.key}', '${g.name}')" 
                     style="background:#161618; border:1px solid #222; padding:20px; border-radius:15px; margin-bottom:12px; display:flex; align-items:center; gap:15px;">
                    <div style="background:linear-gradient(135deg, #00d2ff, #3a7bd5); width:45px; height:45px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;">
                        ${g.name[0].toUpperCase()}
                    </div>
                    <div style="flex:1">
                        <div style="color:white; font-weight:bold;">${g.name}</div>
                        <div style="color:#666; font-size:0.7rem;">קליק צו עפענען</div>
                    </div>
                </div>
            `;
        });
    });
}

// 3. באשאפן א נייע גרופע
function createNewGroup() {
    const n = prompt("נאמען פאר די נייע גרופע:");
    if (n && n.trim() !== "") {
        firebase.database().ref('groups').push({
            name: n,
            creator: currentUser.nickname || "Admin",
            ts: Date.now()
        });
    }
}

// 4. אריינגיין אין א טשעט
function enterChat(id, name) {
    const vp = document.getElementById('app-viewport');
    vp.innerHTML = `
        <div class="chat-container">
            <header style="padding:15px; background:#000; border-bottom:1px solid #222; display:flex; align-items:center; gap:15px;">
                <button onclick="renderGroupsList()" style="background:none; border:none; color:#00d2ff; font-size:1.2rem;">➔</button>
                <b style="color:white;">${name}</b>
            </header>
            <div id="chat-messages" style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:10px;"></div>
            <div class="input-area" style="padding:15px; background:#111; display:flex; gap:10px;">
                <input type="text" id="msgInput" style="flex:1; background:#222; border:1px solid #333; color:white; padding:12px; border-radius:25px;" placeholder="שרייב עפעס...">
                <button onclick="sendMsg('${id}')" style="background:#00d2ff; border:none; width:45px; height:45px; border-radius:50%; color:black;"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    
    // לאדן מעסעדזשעס
    firebase.database().ref('groups/' + id + '/messages').on('value', snap => {
        const box = document.getElementById('chat-messages');
        if (!box) return;
        box.innerHTML = "";
        snap.forEach(mChild => {
            const m = mChild.val();
            const isMe = m.sender === currentUser.nickname;
            box.innerHTML += `
                <div style="align-self:${isMe ? 'flex-start' : 'flex-end'}; background:${isMe ? '#00d2ff' : '#222'}; color:${isMe ? 'black' : 'white'}; padding:10px 15px; border-radius:15px; max-width:80%;">
                    <div style="font-size:0.6rem; opacity:0.6;">${m.sender}</div>
                    ${m.text}
                </div>
            `;
        });
        box.scrollTop = box.scrollHeight;
    });
}

function sendMsg(groupId) {
    const inp = document.getElementById('msgInput');
    if (!inp.value.trim()) return;
    firebase.database().ref('groups/' + groupId + '/messages').push({
        text: inp.value,
        sender: currentUser.nickname || "User",
        time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
    });
    inp.value = "";
            }
