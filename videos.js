// Video Module - Handles fetching and displaying videos
const videoList = document.getElementById('video-list');

function loadVideos() {
    db.ref('content/videos').on('value', (snapshot) => {
        videoList.innerHTML = ''; 
        snapshot.forEach((childSnapshot) => {
            const videoData = childSnapshot.val();
            const videoElement = document.createElement('div');
            videoElement.className = 'video-item';
            videoElement.innerHTML = `
                <video src="${videoData.url}" controls width="100%"></video>
                <p>${videoData.title || 'בלי כותרת'}</p>
            `;
            videoList.appendChild(videoElement);
        });
    });
}

// Start the video module
loadVideos();
