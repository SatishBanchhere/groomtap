// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyAEPbnOymqZNKVokmbruDKmkIt3lhpO_wI",
  authDomain: "salon-d41ac.firebaseapp.com",
  projectId: "salon-d41ac",
  storageBucket: "salon-d41ac.firebasestorage.app",
  messagingSenderId: "66076205678",
  appId: "1:66076205678:web:5b2f0cca9b7887fdfefc7f"
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
