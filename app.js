// --- 2026 PLATFORM CORE ENGINE ---

// 1. הויפט אפלאוד פונקציע
async function uploadContent() {
    const title = document.getElementById('content-title').value;
    const fileInput = document.getElementById('content-file');
    const file = fileInput.files[0];
    const type = "videos"; // דערווייל שטעלן מיר אלעס אלס ווידעא

    if (!title || !file) return alert("שרייב א נאמען און קלייב אויס א פייל!");

    const container = document.getElementById('progress-container');
    const bar = document.getElementById('progress-bar');
    container.style.display = 'block';

    try {
        const storageRef = firebase.storage().ref(`${type}/${Date.now()}_${file.name}`);
        const uploadTask = storageRef.put(file);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                bar.style.width = progress + '%';
            }, 
            (error) => alert("עראר: " + error.message), 
            async () => {
                const url = await uploadTask.snapshot.ref.getDownloadURL();
                await firebase.database().ref(`content/${type}`).push({
                    title: title,
                    url: url,
                    time: firebase.database.ServerValue.TIMESTAMP
                });
                alert("פארטיג! עס איז אפלאודעד.");
                container.style.display = 'none';
                document.getElementById('content-title').value = '';
                fileInput.value = '';
            }
        );
    } catch (err) {
        alert("קאנעקשאן פראבלעם.");
    }
}

// 2. ווייזן ווידעאס (Compact Mode)
firebase.database().ref('content/videos').on('value', (snap) => {
    const list = document.getElementById('video-list');
    list.innerHTML = '';
    snap.forEach((child) => {
        const item = child.val();
        list.innerHTML += `
            <div style="margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                <video src="${item.url}" controls style="max-height: 80px;"></video>
                <p style="font-size: 0.75rem; margin: 5px 0;">${item.title}</p>
            </div>`;
    });
});

// 3. טשעט לאגיק (Real-time)
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value;
    if (msg) {
        firebase.database().ref('chat').push({
            text: msg,
            time: firebase.database.ServerValue.TIMESTAMP
        });
        input.value = '';
    }
}

firebase.database().ref('chat').limitToLast(5).on('value', (snap) => {
    const display = document.getElementById('chat-display');
    display.innerHTML = '';
    snap.forEach((child) => {
        display.innerHTML += `<p style="margin: 2px 0; background: rgba(255,255,255,0.05); padding: 5px; border-radius: 5px;">${child.val().text}</p>`;
    });
    display.scrollTop = display.scrollHeight;
});
