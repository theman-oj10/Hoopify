// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";
import firebase from 'firebase/compat/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHLyLBe7Bh5Q48rUK2-x8-A6A2vxk0hdI",
  authDomain: "orbital-app-proto.firebaseapp.com",
  projectId: "orbital-app-proto",
  storageBucket: "orbital-app-proto.appspot.com",
  messagingSenderId: "965591983424",
  appId: "1:965591983424:web:759b1b999d60cfd6e6c6a5",
  measurementId: "G-JV5TKFE1BX"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, storage, db , app, firebase };





