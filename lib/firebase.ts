// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUxC-5Q4SoFd27-K1pV6K_b0-95Xk4Sfc",
  authDomain: "doczappoint.firebaseapp.com",
  databaseURL: "https://doczappoint-default-rtdb.firebaseio.com",
  projectId: "doczappoint",
  storageBucket: "doczappoint.firebasestorage.app",
  messagingSenderId: "499780804318",
  appId: "1:499780804318:web:d5133138f9831b1cc0ac4f",
  measurementId: "G-63KJP30E1H"
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
