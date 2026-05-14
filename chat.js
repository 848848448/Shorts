// chat.js - THE EMPIRE SUPER-GROUPS
let currentGroupId = null;

// 1. ווייזט די ליסטע פון אלע גרופעס
function renderGroupsList() {
    viewport.innerHTML = `
        <div class="chat-wrapper" style="padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <button onclick="loadPage('home')" style="background:none; border:none; color:var(--accent); font-size:1.5rem;"><i class="fas fa-arrow-right"></i></button>
                <h2 style="margin:0;">די אימפעריע גרופעס</h2>
                <button onclick="createNewGroupPrompt()" style="background:var(--accent); border:none; padding:8px 15px; border-radius:10px; color:#000; font-weight:bold;">+ נייע גרופ</button>
            </div>
            <div id="groups-container">לאדנט גרופעס...</div>
        </div>
    `;
    loadGroupsFromDB();
}

// 2. לאדנט די גרופעס און רעכנט אויס די "Trending"
function loadGroupsFromDB() {
    firebase.database().ref('groups').on('value', snap => {
        const container = document.getElementById('groups-container');
        if(!container) return;
        container.innerHTML = "";
        
        let groups = [];
        snap.forEach(child => {
            let data = child.val();
            data.id = child.key;
            // רעכנט אקטיוויטעט (וויפיל מעסעדזשעס זענען דא)
            data.score = data.messages ? Object.keys(data.messages).length : 0;
            groups.push(data);
        });

        // סארטירט לויט די מערסטע אקטיוויטעט (Trending)
        groups.sort((a, b) => b.score - a.score);

        groups.forEach((g, index) => {
            const isTrending = index < 3 && g.score > 0; // די שפיץ 3 זענען Trending
            container.innerHTML += `
                <div class="group-card" onclick="enterGroup('${g.id}', '${g.name}')">
                    <div style="display:flex; align-items:center; gap:15px;">
                        <div style="width:50px; height:50px; background:#222; border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--accent); font-weight:bold;">
                            ${g.name.charAt(0)}
                        </div>
                        <div>
                            <div style="font-weight:bold; font-size:1.1rem;">${g.name} ${isTrending ? '<span class="trending-badge">🔥 TRENDING</span>' : ''}</div>
                            <div style="font-size:0.8rem; opacity:0.6;">${g.score} מעסעדזשעס</div>
                        </div>
                    </div>
                    <i class="fas fa-chevron-left" style="opacity:0.3;"></i>
                </div>
            `;
        });
    });
}

// 3. עפענט א ספעציפישע גרופע
function enterGroup(id, name) {
    currentGroupId = id;
    viewport.innerHTML = `
        <div class="chat-wrapper">
            <div class="shorts-header" style="background:#111; position:relative; padding:15px;">
                <i class="fas fa-arrow-right" onclick="renderGroupsList()"></i>
                <span style="font-weight:bold;">${name}</span>
                <i class="fas fa-info-circle"></i>
            </div>
            <div id="chat-messages" class="chat-messages"></div>
            <div id="typing-indicator" style="padding:5px 20px; font-size:0.7rem; color:var(--accent); height:20px;"></div>
            <div class="input-area">
                <button class="action-btn" onclick="triggerMediaUpload()"><i class="fas fa-paperclip"></i></button>
                <input type="text" id="chat-input" placeholder="שרייב עפעס..." oninput="handleTyping()">
                <button class="send-btn" onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    listenForMessages(id);
}

// 4. שיקן א מעסעדזש
function sendMessage() {
    const input = document.getElementById('chat-input');
    if(!input.value.trim() || !currentGroupId) return;

    firebase.database().ref(`groups/${currentGroupId}/messages`).push({
        text: input.value,
        sender: currentUser.nickname,
        color: currentUser.color,
        time: Date.now()
    });
    input.value = "";
}

// 5. לאדנט די מעסעדזשעס לייוו
function listenForMessages(groupId) {
    firebase.database().ref(`groups/${groupId}/messages`).limitToLast(50).on('value', snap => {
        const msgDiv = document.getElementById('chat-messages');
        if(!msgDiv) return;
        msgDiv.innerHTML = "";
        snap.forEach(child => {
            const m = child.val();
            const isMe = m.sender === currentUser.nickname;
            msgDiv.innerHTML += `
                <div style="align-self: ${isMe ? 'flex-end' : 'flex-start'}; background: ${isMe ? 'var(--accent)' : '#222'}; color: ${isMe ? '#000' : '#fff'}; padding: 10px 15px; border-radius: 15px; max-width: 80%; margin-bottom: 5px;">
                    <div style="font-size: 0.7rem; font-weight: bold; margin-bottom: 3px; opacity: 0.7;">${m.sender}</div>
                    <div style="word-break: break-word;">${m.text}</div>
                </div>
            `;
        });
        msgDiv.scrollTop = msgDiv.scrollHeight;
    });
}

// 6. עפענען א נייע גרופע
function createNewGroupPrompt() {
    const name = prompt("וויאזוי זאל די גרופע הייסן?");
    if(name) {
        const newGroupRef = firebase.database().ref('groups').push();
        newGroupRef.set({
            name: name,
            creator: currentUser.nickname,
            createdAt: Date.now()
        });
    }
}

// 7. בילדער ארויפלאדן אינעם טשעט
function triggerMediaUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if(file && currentGroupId) {
            uploadFileToEmpire(file, `groups/${currentGroupId}/messages`, 'chat_media');
        }
    };
    input.click();
            }
