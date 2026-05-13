// Admin & Public Upload Module
function uploadContent() {
    const type = document.getElementById('content-type').value;
    const title = document.getElementById('content-title').value;
    const url = document.getElementById('content-url').value;

    if (!title || !url) return alert("ביטע פיל אויס אלע פילדס!");

    // אָקטיוויזירן דעם פּראָגרעס באַר
    const container = document.getElementById('progress-container');
    const bar = document.getElementById('progress-bar');
    const text = document.getElementById('progress-text');
    
    container.style.display = 'block';
    let percent = 0;
    
    const interval = setInterval(() => {
        percent += Math.floor(Math.random() * 15) + 5; 
        
        if (percent >= 100) {
            percent = 100;
            clearInterval(interval);
            
            // שיקן די דאַטן צו Firebase
            db.ref('content/' + type).push({
                title: title,
                url: url,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            }).then(() => {
                setTimeout(() => {
                    container.style.display = 'none';
                    bar.style.width = '0%';
                    alert("דער " + type + " איז ארויף מיט הצלחה!");
                    document.getElementById('content-title').value = '';
                    document.getElementById('content-url').value = '';
                }, 500);
            });
        }
        
        bar.style.width = percent + '%';
        text.innerHTML = percent + '%';
    }, 250); 
}

// פֿונקציע אויסצומעקן (נאָר פֿאַרן אדמיניסטראַטאָר)
function deleteItem(category, id) {
    if (confirm("ביסטו זיכער דו ווילסט דאָס אויסמעקן?")) {
        db.ref('content/' + category + '/' + id).remove();
    }
                                         }
