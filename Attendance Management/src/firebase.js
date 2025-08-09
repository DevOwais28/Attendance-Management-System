import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-CmzSHgxivOlZ3vIqHgQsThfXXJ38ZSQ",
  authDomain: "attendance-management-sy-29722.firebaseapp.com",
  projectId: "attendance-management-sy-29722",
  storageBucket: "attendance-management-sy-29722.firebasestorage.app",
  messagingSenderId: "603176785466",
  appId: "1:603176785466:web:e29394ca240abdcc754703",
  measurementId: "G-36K8Y23RBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth , db}
