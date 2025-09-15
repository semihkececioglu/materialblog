import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Firebase app init
const app = initializeApp(firebaseConfig);

// Analytics sadece browser tarafında çalışır
let analytics;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Analytics başlatılamadı:", error);
  }
}

export { analytics, logEvent };
