// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvx5lt56N4vgGNmY4bf3ZuyMbOe8rxCDo",
  authDomain: "bookbay-newsletter.firebaseapp.com",
  projectId: "bookbay-newsletter",
  storageBucket: "bookbay-newsletter.appspot.com",
  messagingSenderId: "242778234115",
  appId: "1:242778234115:web:96aa5e9c8ed3cd51929d36",
  measurementId: "G-KGVX849LHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db };