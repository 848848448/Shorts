// Firebase Setup
const firebaseConfig = {
  apiKey: "לייג_דא_אריין_דיין_API_KEY",
  authDomain: "shorts-e05cc.firebaseapp.com",
  databaseURL: "https://shorts-e05cc-default-rtdb.firebaseio.com",
  projectId: "shorts-e05cc",
  storageBucket: "shorts-e05cc.appspot.com",
  messagingSenderId: "777444333", // דיין עכטע ID
  appId: "1:777444333:web:abcd123" // דיין עכטע App ID
};

// Initialize
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();
