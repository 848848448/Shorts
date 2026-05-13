// Firebase Config - מאך זיכער דאס איז דיינע!
const firebaseConfig = {
    apiKey: "AIzaSyAmKpAnoV_aG_3_rGMf4l_FzcbAWzwHTnY",
    authDomain: "flutter-ai-playground-8cfec.firebaseapp.com",
    databaseURL: "https://flutter-ai-playground-8cfec-default-rtdb.firebaseio.com",
    projectId: "flutter-ai-playground-8cfec",
    storageBucket: "flutter-ai-playground-8cfec.appspot.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database(), storage = firebase.storage();

// Get Data
db.ref('content').on('value', s => { window.masterData = s.val() || {}; });

// DIRECT UPLOAD - NO FORMS!
function doUpload(el) {
    const file = el.files[0];
    if(!file) return;

    let type = "pics";
    if(file.type.includes('video')) type = "videos";
    if(file.type.includes('audio')) type = "music";

    alert("אפלאוד הייבט זיך אן... ביטע ווארט");

    const ref = storage.ref('uploads/' + Date.now() + "_" + file.name);
    ref.put(file).then(s => s.ref.getDownloadURL()).then(url => {
        db.ref('content').push({
            title: "New " + type,
            url: url,
            type: type,
            time: Date.now()
        });
        alert("סוקסעס! די ווידעא איז ארויף.");
        if(type === 'videos') showReels();
    }).catch(e => alert("Error: " + e.message));
}

function showReels() {
    const list = document.getElementById('reels-list');
    list.innerHTML = '';
    for(let id in masterData) {
        if(masterData[id].type === 'videos') {
            list.innerHTML += `
                <div class="reel-video">
                    <video src="${masterData[id].url}" loop playsinline onclick="this.paused?this.play():this.pause()"></video>
                    <div class="reel-ui-right">
                        <div class="action-icon">❤️</div>
                        <div class="action-icon">💬</div>
                        <div class="action-icon">🔗</div>
                    </div>
                    <div class="reel-ui-bottom">
                        <b>@Dian_User ✅</b>
                        <p>${masterData[id].title}</p>
                    </div>
                </div>`;
        }
    }
    document.getElementById('reels-view').style.display = 'block';
}

function closeReels() {
    document.getElementById('reels-view').style.display = 'none';
    document.querySelectorAll('video').forEach(v => v.pause());
                            }
