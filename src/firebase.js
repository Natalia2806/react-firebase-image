// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDej5uEByiw4QyAq5QJoWp8cQm8pQ6aD_Q",
    authDomain: "react-firebase-b778b.firebaseapp.com",
    projectId: "react-firebase-b778b",
    storageBucket: "react-firebase-b778b.appspot.com",
    messagingSenderId: "933179451434",
    appId: "1:933179451434:web:3696137e2a95cbaa95bb53"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export{firebase}