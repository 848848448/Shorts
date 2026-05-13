const firebaseConfig = {
    apiKey: "AIzaSyAmKpAnoV_aG_3_rGMf4l_FzcbAWzwHTnY",
    authDomain: "flutter-ai-playground-8cfec.firebaseapp.com",
    databaseURL: "https://flutter-ai-playground-8cfec-default-rtdb.firebaseio.com",
    projectId: "flutter-ai-playground-8cfec",
    storageBucket: "flutter-ai-playground-8cfec.appspot.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database(), storage = firebase.storage();

db.ref('content').on('value', s => { window.data = s.val() || {}; });

function showReels() {
    const cont = document.getElementById('reels-container');
    cont.innerHTML = '';
    for(let id in data) {
        if(data[id].type === 'videos') {
            cont.innerHTML += `<div class="reel-unit"><video src="${data[id].url}" loop playsinline onclick="this.paused?this.play():this.pause()"></video></div>`;
        }
    }
    document.getElementById('reels-overlay').style.display = 'block';
}

function closeReels() {
    document.getElementById('reels-overlay').style.display = 'none';
    document.querySelectorAll('video').forEach(v => v.pause());
}

function startUpload(el) {
    const file = el.files[0];
    if(!file) return;
    const type = file.type.includes('video') ? 'videos' : 'music';
    alert("Uploading... 🚀");
    storage.ref('files/' + Date.now()).put(file).then(s => s.ref.getDownloadURL()).then(url => {
        db.ref('content').push({ url, type, time: Date.now() });
        alert("Success!");
    });
}
