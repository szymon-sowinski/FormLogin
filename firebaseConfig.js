// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7L2TIfMEtroHAUEPc9RRu4vaS5UNpLRk",
  authDomain: "reactapp-1fb69.firebaseapp.com",
  projectId: "reactapp-1fb69",
  storageBucket: "reactapp-1fb69.firebasestorage.app",
  messagingSenderId: "487158297693",
  appId: "1:487158297693:web:e31465763ef282af7209b4",
  measurementId: "G-GGJ2GTG3KB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);