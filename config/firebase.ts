// src/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyAeHlPrO8lT8IucNWOofnCa_8lPTpLlGQA",
  authDomain: "cashwise-d9603.firebaseapp.com",
  projectId: "cashwise-d9603",
  storageBucket: "cashwise-d9603.firebasestorage.app",
  messagingSenderId: "1052438452997",
  appId: "1:1052438452997:web:cea2d51edae85a11c1356c",
  measurementId: "G-NZ4PTYBX83",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
