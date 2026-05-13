// videos.js - FULL SOCIAL VERSION
function renderVideos() {
    viewport.innerHTML = `
        <div class="shorts-wrapper">
            <div class="shorts-header">
                <i class="fas fa-arrow-right" onclick="loadPage('home')"></i>
                <span>THE EMPIRE SHORTS</span>
                <i class="fas fa-camera" onclick="triggerShortsUpload()"></i>
            </div>
            <div id="shorts-feed" class="shorts-feed"></div>
        </div>
    `;
    loadShortsWithSocial();
}

function loadShortsWithSocial() {
    const feed = document.getElementById('shorts-feed');
    firebase.database().ref('video').on('value', snap => {
        if(!feed) return;
        feed.innerHTML = "";
        snap.forEach(child => {
            const d = child.val();
            const id = child.key;
            feed.innerHTML += `
                <div class="short-video-container">
                    <video src="${d.url}" loop onclick="togglePlay(this)"></video>
                    
                    <div class="video-actions">
                        <div class="action-item" onclick="likeVideo('${id}')">
                            <i class="fas fa-heart"></i>
                            <span id="likes-${id}">${d.likes || 0}</span>
                        </div>
                        <div class="action-item" onclick="openComments('${id}')">
                            <i class="fas fa-comment"></i>
                            <span>${d.commentCount || 0}</span>
                        </div>
                        <div class="action-item">
                            <i class="fas fa-share"></i>
                        </div>
                    </div>

                    <div class="video-info">
                        <h3>@${d.uploader}</h3>
                        <p>${d.caption || 'Empire Shorts...'}</p>
                        <button class="follow-btn" onclick="followUser('${d.uploader}')">Follow</button>
                    </div>
                </div>
            `;
        });
    });
}

function togglePlay(v) { v.paused ? v.play() : v.pause(); }

function likeVideo(id) {
    const ref = firebase.database().ref('video/' + id + '/likes');
    ref.transaction(c => (c || 0) + 1);
}

function triggerShortsUpload() {
    const input = document.getElementById('file-upload-input');
    input.accept = "video/*";
    input.onchange = (e) => {
        const file = e.target.files[0];
        if(file) uploadFileToEmpire(file, 'video');
    };
    input.click();
            }
