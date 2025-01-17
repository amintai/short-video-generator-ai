// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-short-video-generator-a99a3.firebaseapp.com",
  projectId: "ai-short-video-generator-a99a3",
  storageBucket: "ai-short-video-generator-a99a3.firebasestorage.app",
  messagingSenderId: "1010403950915",
  appId: "1:1010403950915:web:7247c030fbb3d5b90a6ff6",
  measurementId: "G-QP4DLZXLYW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
