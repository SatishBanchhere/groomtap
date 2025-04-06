// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6-KKOufnA9n-I9fL5MVbMUz7GD4Sq8tM",
  authDomain: "doctor-app-data-c0eb7.firebaseapp.com",
  projectId: "doctor-app-data-c0eb7",
  storageBucket: "doctor-app-data-c0eb7.firebasestorage.app",
  messagingSenderId: "228452345569",
  appId: "1:228452345569:web:49d03e9b2f810b6e8639a0",
  measurementId: "G-50NWHPL2V4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Configure Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});