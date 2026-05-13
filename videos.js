function renderVideos() {
    viewport.innerHTML = `
        <div class="shorts-wrapper">
            <div class="shorts-header">
                <i class="fas fa-arrow-right" onclick="loadPage('home')"></i>
                <span>שאָרץ</span>
                <i class="fas fa-camera" onclick="triggerShortsUpload()"></i>
            </div>

            <div id="shorts-feed" class="shorts-feed">
                </div>
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
                    <video src="${d.url}" loop onclick="this.paused ? this.play() : this.pause()"></video>
                    
                    <div class="video-actions">
                        <div class="action-item" onclick="likeVideo('${id}')">
                            <i class="fas fa-heart"></i>
                            <span>${d.likes || 0}</span>
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

function likeVideo(id) {
    const ref = firebase.database().ref(`video/${id}/likes`);
    ref.transaction(currentLikes => (currentLikes || 0) + 1);
        }
