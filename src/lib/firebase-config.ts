
// src/lib/firebase-config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  "projectId": "trackray-driver-04346802-2b17f",
  "appId": "1:853926248496:web:ebbcc64f95d5a8ed382df5",
  "apiKey": "AIzaSyDvnEVk4vzOcSXaF2luYPp6JsJixqoVeZA",
  "authDomain": "trackray-driver-04346802-2b17f.firebaseapp.com",
  "messagingSenderId": "853926248496"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
