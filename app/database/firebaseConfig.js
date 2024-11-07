// Modular SDK import (version 9+)
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBFe8pLW6w3odnR-5hquUodLS0ukd-PJZM",
  authDomain: "rxreminder-e3e27.firebaseapp.com",
  projectId: "rxreminder-e3e27",
  storageBucket: "rxreminder-e3e27.firebasestorage.app",
  messagingSenderId: "1008765824991",
  appId: "1:1008765824991:web:5c8eb16300d9340bbb1e6a",
  measurementId: "G-JHZ6MH396P"
};  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };