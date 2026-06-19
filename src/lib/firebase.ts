import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, query, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAJcISSbWhsbBa8vDcjqgBpTMuL2dKmJ2o",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "coloursplash-studio.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "coloursplash-studio",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "coloursplash-studio.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1068974207455",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1068974207455:web:d5ec8db474dfde516a546a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8E2XY2D964"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Lazy-load analytics and performance - don't block initial render
let analyticsInstance: any = null;
let performanceInstance: any = null;

export const getFirebaseServices = async () => {
  if (!analyticsInstance || !performanceInstance) {
    try {
      const [
        { getAnalytics },
        { getPerformance }
      ] = await Promise.all([
        import("firebase/analytics"),
        import("firebase/performance")
      ]);
      analyticsInstance = getAnalytics(app);
      performanceInstance = getPerformance(app);
    } catch (e) {
      // Analytics/Performance may fail in some environments
    }
  }
  return { analyticsInstance, performanceInstance };
};

// Initialize services lazily after page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    requestIdleCallback?.(() => getFirebaseServices()) ?? setTimeout(() => getFirebaseServices(), 3000);
  }, { once: true });
}

export { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut };
export { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, query, limit };
export type { User };
