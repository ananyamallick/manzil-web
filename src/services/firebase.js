// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCO3rx1PbM9HcQIp9DznpnZYqhsp-B4HTc",
  authDomain: "manzil-eb661.firebaseapp.com",
  databaseURL: "https://manzil-eb661-default-rtdb.firebaseio.com",
  projectId: "manzil-eb661",
  storageBucket: "manzil-eb661.firebasestorage.app",
  messagingSenderId: "79397833849",
  appId: "1:79397833849:web:17044693d661d1e075d8a8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);