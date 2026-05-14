function renderVideos() {
    viewport.innerHTML = `
        <div class="shorts-wrapper">
            <div class="shorts-header">
                <i class="fas fa-arrow-right" style="font-size: 1.5rem; color: white;" onclick="loadPage('home')"></i>
                <span style="font-weight: bold; letter-spacing: 1px;">EMPIRE SHORTS</span>
                <i class="fas fa-plus-square" style="font-size: 1.5rem; color: var(--accent);" onclick="triggerShortsUpload()"></i>
            </div>
            <div id="shorts-feed" class="shorts-feed">
                <div style="padding-top: 100px; text-align: center;">לאדנט ווידעאס...</div>
            </div>
        </div>
    `;
    loadShortsFromFirebase();
}

function loadShortsFromFirebase() {
    const feed = document.getElementById('shorts-feed');
    firebase.database().ref('video').on('value', snap => {
        if(!feed) return;
        feed.innerHTML = "";
        
        if(!snap.exists()) {
            feed.innerHTML = `<div style="height:100vh; display:flex; align-items:center; justify-content:center;">קיין ווידעאס דא דערווייל. לאדן ארויף!</div>`;
            return;
        }

        snap.forEach(child => {
            const d = child.val();
            const id = child.key;
            feed.innerHTML += `
                <div class="short-video-container">
                    <video src="${d.url}" loop playsinline onclick="toggleVideo(this)"></video>
                    
                    <div class="video-actions">
                        <div class="action-item" onclick="likeVideo('${id}')">
                            <i class="fas fa-heart"></i>
                            <span>${d.likes || 0}</span>
                        </div>
                        <div class="action-item">
                            <i class="fas fa-comment"></i>
                            <span>${d.commentCount || 0}</span>
                        </div>
                        <div class="action-item">
                            <i class="fas fa-share-alt"></i>
                        </div>
                    </div>

                    <div class="video-info">
                        <h3>@${d.uploader}</h3>
                        <p>${d.caption || 'Empire New Short!'}</p>
                        <button class="follow-btn">Follow</button>
                    </div>
                </div>
            `;
        });
    });
}

function toggleVideo(v) {
    if (v.paused) {
        // Stop all other videos first
        document.querySelectorAll('video').forEach(vid => vid.pause());
        v.play();
    } else {
        v.pause();
    }
}

function likeVideo(id) {
    firebase.database().ref('video/' + id + '/likes').transaction(c => (c || 0) + 1);
}

function triggerShortsUpload() {
    // דאס עפנט די פיילס פונעם פאון
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'video/*';
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // רופט די פונקציע פון main.js
            uploadFileToEmpire(file, 'video');
        }
    };
    fileInput.click();
                            }
