import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6uNL-RZQsdPJdHn-ukx8evC7nwc1DAfU",
  authDomain: "kyros3-90656.firebaseapp.com",
  projectId: "kyros3-90656",
  storageBucket: "kyros3-90656.appspot.com",
  messagingSenderId: "204759012323",
  appId: "1:204759012323:web:178a6003fe61b2f31206d6"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db, firebase };
