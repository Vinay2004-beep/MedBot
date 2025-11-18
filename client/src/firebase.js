// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtlzL29vXndKsG_t9VD8d1IAIGise9rAQ",
  authDomain: "medbot-df915.firebaseapp.com",
  projectId: "medbot-df915",
  storageBucket: "medbot-df915.appspot.com",
  messagingSenderId: "342420189629",
  appId: "1:342420189629:web:a3764255b7160378c4a2d4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
