// Music Module
db.ref('content/music').on('value', (snapshot) => {
    const list = document.getElementById('music-list');
    list.innerHTML = '';
    snapshot.forEach(child => {
        const data = child.val();
        list.innerHTML += `
            <div class="music-item" style="margin-bottom:15px; background: #0f172a; padding: 10px; border-radius: 10px;">
                <p style="margin-bottom: 5px;">🎵 ${data.title}</p>
                <audio src="${data.url}" controls style="width: 100%;"></audio>
                <button class="admin-only" onclick="deleteItem('music', '${child.key}')">Delete 🗑️</button>
            </div>`;
    });
});
