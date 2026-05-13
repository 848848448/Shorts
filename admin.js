// Admin Module - Handle File Uploads to Firebase Storage
async function uploadContent() {
    const type = document.getElementById('content-type').value;
    const title = document.getElementById('content-title').value;
    const fileInput = document.getElementById('content-file');
    const file = fileInput.files[0];

    // קודם קוקן אויב אלעס איז אויסגעפילט
    if (!title || !file) {
        return alert("ביטע שרייב א נאמען און קלייב אויס א פייל פונעם פאון!");
    }

    // ווייזן דעם פראגרעס באר
    const container = document.getElementById('progress-container');
    const bar = document.getElementById('progress-bar');
    const text = document.getElementById('progress-text');
    container.style.display = 'block';

    // 1. שאפן א פלאץ אינערהאלב Firebase Storage
    const storageRef = firebase.storage().ref(type + '/' + Date.now() + "_" + file.name);
    const uploadTask = storageRef.put(file);

    // 2. נאכגיין דעם פראגרעס פונעם אפלאוד
    uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            bar.style.width = progress + '%';
            text.innerHTML = Math.round(progress) + '%';
        }, 
        (error) => {
            console.error(error);
            alert("עפעס איז נישט גוט געגאנגען: " + error.message);
            container.style.display = 'none';
        }, 
        () => {
            // 3. ווען עס ענדיגט זיך, באקום דעם לינק פונעם עכטן פייל
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                
                // 4. לייג אריין דעם לינק און דעם טיטל אינעם Database
                db.ref('content/' + type).push({
                    title: title,
                    url: downloadURL,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                }).then(() => {
                    alert("דער פייל איז ארויף געוואלדיג!");
                    
                    // רייניגן די אינפּוטס
                    container.style.display = 'none';
                    bar.style.width = '0%';
                    document.getElementById('content-title').value = '';
                    fileInput.value = ''; // רייניגט דעם פייל סעלעקטאר
                });
            });
        }
    );
}

// פונקציע אויסצומעקן
function deleteItem(category, id) {
    if (confirm("ביסטו זיכער דו ווילסט דאס אויסמעקן?")) {
        db.ref('content/' + category + '/' + id).remove();
    }
                          }
