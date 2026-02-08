import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBA_0moLqgJgUa4a1cDJr9SLtRjh84T_W0",
  authDomain: "lab06-expense-14778.firebaseapp.com",
  projectId: "lab06-expense-14778",
  storageBucket: "lab06-expense-14778.firebasestorage.app",
  messagingSenderId: "298903518750",
  appId: "1:298903518750:web:63bddee183b4a08277f80f",
  measurementId: "G-LMPVFHJ127"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
