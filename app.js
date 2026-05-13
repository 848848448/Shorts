// --- DATABASE & STORAGE LOGIC ---

// 1. Upload Function
async function uploadContent() {
    const type = document.getElementById('content-type').value;
    const title = document.getElementById('content-title').value;
    const file = document.getElementById('content-file').files[0];

    if (!title || !file) return alert("פיל אויס אלע פעלדער!");

    const container = document.getElementById('progress-container');
    const bar = document.getElementById('progress-bar');
    const text = document.getElementById('progress-text');

    container.style.display = 'block';

    const storageRef = storage.ref(`${type}/${Date.now()}_${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            bar.style.width = progress + '%';
            text.innerText = Math.round(progress) + '%';
        }, 
        (error) => alert(error.message), 
        async () => {
            const url = await uploadTask.snapshot.ref.getDownloadURL();
            await db.ref(`content/${type}`).push({ title, url, time: Date.now() });
            alert("ארויף מיט הצלחה!");
            container.style.display = 'none';
            document.getElementById('content-title').value = '';
        }
    );
}

// 2. Load Content (Real-time)
db.ref('content/videos').on('value', (snap) => {
    const list = document.getElementById('video-list');
    list.innerHTML = '';
    snap.forEach((child) => {
        const item = child.val();
        list.innerHTML += `
            <div class="item">
                <video src="${item.url}" controls></video>
                <p>${item.title}</p>
            </div>`;
    });
});

// 3. Chat Logic
function sendChatMessage() {
    const msg = document.getElementById('chat-input').value;
    if (msg) {
        db.ref('chat').push({ text: msg, time: Date.now() });
        document.getElementById('chat-input').value = '';
    }
}

db.ref('chat').limitToLast(10).on('value', (snap) => {
    const display = document.getElementById('chat-display');
    display.innerHTML = '';
    snap.forEach((child) => {
        display.innerHTML += `<p class="msg">${child.val().text}</p>`;
    });
    display.scrollTop = display.scrollHeight;
});
