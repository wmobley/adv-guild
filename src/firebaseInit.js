import { initializeApp } from "firebase/app";
// If you plan to use other Firebase services like Analytics, Firestore, Auth, etc.,
// you would import them here. For example:
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Optional: for Google Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// You can export the initialized app or specific services
export default app;
// For example, if you were using Auth:
// export const auth = getAuth(app);