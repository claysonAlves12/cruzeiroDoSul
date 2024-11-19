// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxiMFYZzbt4AOa-SH_ridSCUyAVg61ZJc",
  authDomain: "controledeestoque-2615f.firebaseapp.com",
  projectId: "controledeestoque-2615f",
  storageBucket: "controledeestoque-2615f.firebasestorage.app",
  messagingSenderId: "157081444483",
  appId: "1:157081444483:web:90d466da1108480915bbb6",
  measurementId: "G-PCD7EV5EFQ"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Inicialize o Firestore
const db = getFirestore(app);

export { db };
