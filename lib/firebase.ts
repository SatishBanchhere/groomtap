import {getFirestore} from "firebase/firestore"
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {initializeApp, getApps, getApp} from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAEPbnOymqZNKVokmbruDKmkIt3lhpO_wI",
    authDomain: "salon-d41ac.firebaseapp.com",
    projectId: "salon-d41ac",
    storageBucket: "salon-d41ac.firebasestorage.app",
    messagingSenderId: "66076205678",
    appId: "1:66076205678:web:5b2f0cca9b7887fdfefc7f"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
export {app, auth, db, googleProvider, signInWithPopup};