// main.js - EMPIRE CORE FINAL FIX
const db = firebase.database();

// הויפט פונקציע וואס Screenshot_20260514-015617.png האט געזוכט
function loadPage(page) {
    const vp = document.getElementById('app-viewport');
    if (!vp) return;
    vp.innerHTML = ""; 

    if (page === 'home') {
        if (typeof renderHome === "function") renderHome();
    } else if (page === 'chat') {
        renderGroupsList();
    }
}

function renderGroupsList() {
    const vp = document.getElementById('app-viewport');
    vp.innerHTML = `
        <div style="display:flex; flex-direction:column; height:100vh; background:#0a0a0b;">
            <header style="padding:15px; background:#161618; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #222;">
                <button onclick="loadPage('home')" style="background:none; border:none; color:#00d2ff; font-size:1.5rem;">➔</button>
                <b style="color:white; letter-spacing:1px;">EMPIRE CHAT</b>
                <button onclick="createNewGroup()" style="background:#00d2ff; border:none; width:35px; height:35px; border-radius:50%; color:black; font-weight:bold;">+</button>
            </header>
            <div id="groups-list" style="flex:1; overflow-y:auto; padding:15px;"></div>
        </div>
    `;

    db.ref('groups').on('value', snap => {
        const list = document.getElementById('groups-list');
        if (!list) return;
        list.innerHTML = "";
        
        if (!snap.exists()) {
            list.innerHTML = "<div style='color:#555; text-align:center; margin-top:50px;'>נאכנישט דא קיין גרופעס.</div>";
            return;
        }

        snap.forEach(child => {
            const g = child.val();
            list.innerHTML += `
                <div onclick="enterChat('${child.key}', '${g.name}')" style="background:#161618; padding:20px; border-radius:15px; margin-bottom:12px; border:1px solid #222; color:white;">
                    <b>${g.name}</b>
                </div>
            `;
        });
    });
}

function createNewGroup() {
    const n = prompt("נאמען פאר די גרופע:");
    if (n) {
        db.ref('groups').push({
            name: n,
            ts: Date.now()
        });
    }
}

function enterChat(id, name) {
    const vp = document.getElementById('app-viewport');
    vp.innerHTML = `
        <div style="display:flex; flex-direction:column; height:100vh; background:#0a0a0b;">
            <header style="padding:15px; background:#161618; display:flex; align-items:center; gap:15px; border-bottom:1px solid #222;">
                <button onclick="renderGroupsList()" style="background:none; border:none; color:#00d2ff; font-size:1.2rem;">➔</button>
                <b style="color:white;">${name}</b>
            </header>
            <div id="msgs" style="flex:1; overflow-y:auto; padding:15px; display:flex; flex-direction:column; gap:10px;"></div>
            <div style="padding:15px; background:#111; display:flex; gap:10px;">
                <input type="text" id="mInp" style="flex:1; background:#222; border:1px solid #333; color:white; padding:10px; border-radius:20px;">
                <button onclick="sendMsg('${id}')" style="background:#00d2ff; border:none; width:40px; height:40px; border-radius:50%; color:black;">></button>
            </div>
        </div>
    `;

    db.ref('groups/' + id + '/messages').on('value', snap => {
        const box = document.getElementById('msgs');
        if (!box) return;
        box.innerHTML = "";
        snap.forEach(c => {
            const m = c.val();
            box.innerHTML += `<div style="background:#222; color:white; padding:10px; border-radius:10px; align-self:flex-start;">${m.text}</div>`;
        });
        box.scrollTop = box.scrollHeight;
    });
}

function sendMsg(gid) {
    const i = document.getElementById('mInp');
    if (!i.value.trim()) return;
    db.ref('groups/' + gid + '/messages').push({ text: i.value });
    i.value = "";
                }
