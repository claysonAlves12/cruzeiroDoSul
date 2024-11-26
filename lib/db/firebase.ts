// firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: 'AIzaSyCAmpoe1xLX93iOuwaT8vd3VRQUIXgBfq0',
  authDomain: 'cruzeirodosul-ca084.firebaseapp.com',
  projectId: 'cruzeirodosul-ca084',
  storageBucket: 'cruzeirodosul-ca084.firebasestorage.app',
  messagingSenderId: '882376384560',
  appId: '1:882376384560:web:dc27f96144e5fee51f0df5',
  measurementId: 'G-PCD7EV5EFQ',
};

// Inicialize o Firebase apenas se ainda não foi inicializado
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicialize o Firestore e Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };