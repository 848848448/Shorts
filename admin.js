// Admin & Upload Module - Final Version
async function uploadContent() {
    // 1. באקומען די אינפארמאציע פונעם פעידזש
    const type = document.getElementById('content-type').value;
    const title = document.getElementById('content-title').value;
    const fileInput = document.getElementById('content-file');
    const file = fileInput.files[0];

    // קוקן אויב אלעס איז דא
    if (!title || !file) {
        return alert("ביטע שרייב א נאמען און קלייב אויס א פייל!");
    }

    const container = document.getElementById('progress-container');
    const bar = document.getElementById('progress-bar');
    const text = document.getElementById('progress-text');
    
    // ווייזן דעם פראגרעס באר
    container.style.display = 'block';
    bar.style.width = '0%';
    text.innerHTML = 'מערקורי לאדנט...';

    try {
        // 2. אנהייבן דעם Storage אפלאוד
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`${type}/${Date.now()}_${file.name}`);
        const uploadTask = fileRef.put(file);

        // 3. נאכקוקן דעם פראצעס
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                bar.style.width = progress + '%';
                text.innerHTML = Math.round(progress) + '%';
            }, 
            (error) => {
                // אויב עס איז דא אן עראר (למשל Rules נישט גוט)
                console.error("Firebase Storage Error:", error);
                alert("פראבלעם מיט Firebase Storage: " + error.message);
                container.style.display = 'none';
            }, 
            async () => {
                // 4. ווען עס ענדיגט זיך - באקומען דעם לינק
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                
                // 5. סייווט אינעם Realtime Database
                await firebase.database().ref('content/' + type).push({
                    title: title,
                    url: downloadURL,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });

                alert("מזל טוב! דער " + type + " איז ארויף!");
                
                // רייניגן
                container.style.display = 'none';
                document.getElementById('content-title').value = '';
                fileInput.value = '';
            }
        );
    } catch (err) {
        console.error("General Error:", err);
        alert("עפעס זעט אויס נישט ריכטיג אינעם קאנעקשאן.");
        container.style.display = 'none';
    }
}

// פונקציע אויסצומעקן
function deleteItem(category, id) {
    if (confirm("ביסטו זיכער?")) {
        firebase.database().ref('content/' + category + '/' + id).remove();
    }
        }
