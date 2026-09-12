import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Red Cross Social Media Platform - Official Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD6RSFYz07qlfanlRUMxU3S9j97moPQ9dk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "redcross-social-media-platform.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "redcross-social-media-platform",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "redcross-social-media-platform.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "588898067299",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:588898067299:web:ba4f6153fa7a442cac6956",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0YLWLYEV2K"
};

let app, auth, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('Firebase initialized successfully for project:', firebaseConfig.projectId);
} catch (e) {
  console.warn('Firebase initialized in fallback mode:', e);
}

export { app, auth, db };
