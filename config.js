const firebaseConfig = {
  apiKey: "דיין-שליסל",
  authDomain: "דיין-דאָמעין",
  databaseURL: "דיין-URL",
  projectId: "דיין-ID",
  storageBucket: "דיין-סטאָרידזש-באָקס",
  messagingSenderId: "...",
  appId: "..."
};

// אנהייבן Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();
