// firebase-init.js
// Shared Firebase setup — import { auth, db, googleProvider } from "./firebase-init.js"
// in any page that needs Firebase.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDdVvGB-7CyKzyOrd7JJuLTBiinlXOu8TE",
  authDomain: "market-system-5dfc3.firebaseapp.com",
  projectId: "market-system-5dfc3",
  storageBucket: "market-system-5dfc3.firebasestorage.app",
  messagingSenderId: "78541507822",
  appId: "1:78541507822:web:92eda27eece6518632b7ff",
  measurementId: "G-DL1D8RS478",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();