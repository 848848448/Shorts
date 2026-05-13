const firebaseConfig = {
  apiKey: "AIzaSyAmKpAnoV_aG_3_rGMf4l_FzcbAWzwHTnY",
  authDomain: "flutter-ai-playground-8cfec.firebaseapp.com",
  databaseURL: "https://flutter-ai-playground-8cfec-default-rtdb.firebaseio.com",
  projectId: "flutter-ai-playground-8cfec",
  storageBucket: "flutter-ai-playground-8cfec.firebasestorage.app",
  messagingSenderId: "989658103041",
  appId: "1:989658103041:web:f33b1ed6d748ef98b96f00"
};

// צינדט אָן Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
const storage = firebase.storage();
