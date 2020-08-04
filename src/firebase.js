import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDbXLeEIZbahb8e1LdHC-J2qixYlkd9JNE",
    authDomain: "instagram-clone-react-6c8f6.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-6c8f6.firebaseio.com",
    projectId: "instagram-clone-react-6c8f6",
    storageBucket: "instagram-clone-react-6c8f6.appspot.com",
    messagingSenderId: "386160917462",
    appId: "1:386160917462:web:a342f211898aefb1e78277",
    measurementId: "G-HRSN247CX2"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };