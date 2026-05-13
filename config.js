const firebaseConfig = {
  apiKey: "AIzaSyAmKpAnoV_aG_3_rGMf4TW7I9vO7W3zXk",
  authDomain: "flutter-ai-playground-8cfec.firebaseapp.com",
  databaseURL: "https://flutter-ai-playground-8cfec-default-rtdb.firebaseio.com",
  projectId: "flutter-ai-playground-8cfec",
  storageBucket: "flutter-ai-playground-8cfec.appspot.com",
  messagingSenderId: "989658103041",
  appId: "1:989658103041:web:f33b1ed6d748ef98b96f00"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();
