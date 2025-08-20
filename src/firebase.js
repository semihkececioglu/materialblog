// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCOC4QOznVGRt2shTEmO8K04nG9BNQmozY",
  authDomain: "mblog-16d98.firebaseapp.com",
  projectId: "mblog-16d98",
  storageBucket: "mblog-16d98.firebasestorage.app",
  messagingSenderId: "812283045204",
  appId: "1:812283045204:web:54f1059f8abe014feb94c1",
  measurementId: "G-NDVDVD70Z1",
};

// Firebase app init
const app = initializeApp(firebaseConfig);

// Analytics sadece browser tarafında çalışır
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { analytics, logEvent };
