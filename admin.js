async function uploadContent() {
    const type = document.getElementById('content-type').value;
    const title = document.getElementById('content-title').value;
    const fileInput = document.getElementById('content-file'); // מאַך זיכער דאָס שטימט מיט די HTML
    const file = fileInput.files[0];

    if (!title || !file) {
        return alert("ביטע שרייב א נאמען און קלייב אויס א פייל!");
    }

    const container = document.getElementById('progress-container');
    const bar = document.getElementById('progress-bar');
    const text = document.getElementById('progress-text');
    
    container.style.display = 'block';
    bar.style.width = '0%'; // אנהייבן פון נול

    // אנהייבן דעם אפלאוד
    const storageRef = firebase.storage().ref(type + '/' + Date.now() + "_" + file.name);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            bar.style.width = progress + '%';
            text.innerHTML = Math.round(progress) + '%';
        }, 
        (error) => {
            alert("עראָר: " + error.message);
        }, 
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                db.ref('content/' + type).push({
                    title: title,
                    url: downloadURL,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                }).then(() => {
                    alert("דער פייל איז ארויף מיט הצלחה!");
                    container.style.display = 'none';
                    document.getElementById('content-title').value = '';
                    fileInput.value = '';
                });
            });
        }
    );
                }
