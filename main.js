// Import Firebase dependencies
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

// Your Firebase configuration

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

// Get Firestore instance
const db = getFirestore(app);

// Function to fetch and print all appointments
const fetchAllAppointments = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "Appointments"));
        querySnapshot.forEach((doc) => {
            // console.log({ id: doc.id, ...doc.data() });
            console.log(doc.data().patientName);
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
    }
};

fetchAllAppointments();
