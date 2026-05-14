// 1. דיין פערזענליכע פייערבbase קאנפיג - מאך זיכער דאס שטימט מיט דיין פראיעקט!
const firebaseConfig = {
    apiKey: "AIzaSy...", 
    authDomain: "848848448.firebaseapp.com",
    databaseURL: "https://848848448-default-rtdb.firebaseio.com",
    projectId: "848848448",
    storageBucket: "848848448.appspot.com",
};

// איניציאליזירן Firebase אויב עס איז נאכנישט דא
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// 2. די הויפט פונקציע צו ווייזן גרופעס
function renderGroupsList() {
    const vp = document.getElementById('app-viewport');
    if (!vp) return;

    vp.innerHTML = `
        <div class="chat-container">
            <header>
                <i class="fas fa-bars" style="color:var(--primary)"></i>
                <b style="letter-spacing:1px; font-size:1.1rem;">EMPIRE CHAT</b>
                <button onclick="createNewGroup()" class="send-btn" style="width:38px; height:38px; display:flex; align-items:center; justify-content:center;">
                    <i class="fas fa-plus"></i>
                </button>
            </header>
            <div id="groups-container" style="flex:1; overflow-y:auto; padding:15px;">
                <div id="loading-msg" style="text-align:center; padding:20px; opacity:0.5;">לאדנט גרופעס...</div>
            </div>
        </div>
    `;
    
    // ציען גרופעס פון פייערבbase
    database.ref('groups').on('value', (snap) => {
        const container = document.getElementById('groups-container');
        if(!container) return;
        container.innerHTML = "";
        
        if (!snap.exists()) {
            container.innerHTML = `
                <div style="text-align:center; margin-top:50px; color:#888;">
                    <i class="fas fa-comments" style="font-size:3rem; margin-bottom:15px; display:block;"></i>
                    נאכנישט דא קיין גרופעס.<br>דרוק דעם + צו מאכן די ערשטע גרופע!
                </div>`;
            return;
        }

        snap.forEach(child => {
            const g = child.val();
            container.innerHTML += `
                <div onclick="openGroup('${child.key}', '${g.name}')" 
                     style="background:var(--card-bg); margin-bottom:12px; padding:18px; border-radius:18px; display:flex; align-items:center; gap:15px; border:1px solid #222; cursor:pointer; animation: fadeIn 0.3s ease;">
                    <div style="background:linear-gradient(135deg, var(--primary), var(--secondary)); width:50px; height:50px; border-radius:15px; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:1.2rem; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                        ${g.name ? g.name[0].toUpperCase() : '?'}
                    </div>
                    <div style="flex:1">
                        <div style="font-weight:bold; font-size:1rem; color:white;">${g.name}</div>
                        <div style="font-size:0.75rem; color:#666;">קליק צו עפענען דעם טשעט</div>
                    </div>
                    <i class="fas fa-chevron-left" style="opacity:0.2;"></i>
                </div>
            `;
        });
    });
}

// 3. פונקציע צו באשאפן א נייע גרופע
function createNewGroup() {
    const groupName = prompt("לייג אריין א נאמען פאר דיין נייע אימפעריע גרופע:");
    if (!groupName || groupName.trim() === "") return;

    const newGroupRef = database.ref('groups').push();
    newGroupRef.set({
        name: groupName,
        createdAt: Date.now(),
        createdBy: "Admin"
    }).then(() => {
        alert("גרופע '" + groupName + "' איז באשאפן געווארן!");
    }).catch((error) => {
        alert("פעלער: " + error.message);
    });
}

// 4. עפענען א גרופע (פארריכט)
function openGroup(id, name) {
    const vp = document.getElementById('app-viewport');
    vp.innerHTML = `
        <div class="chat-container">
            <header>
                <button onclick="renderGroupsList()" style="background:none; border:none; color:var(--primary); font-size:1.2rem;"><i class="fas fa-arrow-right"></i></button>
                <b>${name}</b>
                <div style="width:30px;"></div>
            </header>
            <div id="msg-box" class="messages-area"></div>
            <div class="input-area">
                <input type="text" id="mInput" placeholder="שרייב א מעסעדזש...">
                <button class="send-btn" onclick="postMsg('${id}')"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    // לאדן מעסעדזשעס פונקציע דא...
                              }
