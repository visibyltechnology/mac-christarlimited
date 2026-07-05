// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSUgYpW8ubE6pzXH2B3k0iYV_xNF0u2Go",
  authDomain: "mac-christar-54008.firebaseapp.com",
  projectId: "mac-christar-54008",
  storageBucket: "mac-christar-54008.firebasestorage.app",
  messagingSenderId: "458511803825",
  appId: "1:458511803825:web:7d7068feffafed84c80990",
  measurementId: "G-EVSN1DRX2M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
