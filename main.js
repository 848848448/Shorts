function uploadFileToEmpire(file, type) {
    const barCont = document.getElementById('upload-progress-container');
    const bar = document.getElementById('upload-progress-bar');
    
    barCont.classList.remove('hidden');
    
    const storageRef = firebase.storage().ref(`${type}s/${Date.now()}_${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
        (snap) => {
            let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
            bar.style.width = percentage + '%';
        }, 
        (err) => {
            alert("Upload Failed: " + err.message);
            barCont.classList.add('hidden');
        }, 
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
                firebase.database().ref(type).push({
                    url: url,
                    uploader: currentUser.nickname,
                    time: Date.now(),
                    likes: 0,
                    caption: "Check out my new video!"
                });
                barCont.classList.add('hidden');
                alert("מזל טוב! דיין ווידעא איז ארויף.");
            });
        }
    );
}
