import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Guard Firebase initialization to prevent build crashes
const isBrowser = typeof window !== "undefined";

let app: FirebaseApp | undefined;
try {
    if (getApps().length === 0) {
        if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
            app = initializeApp(firebaseConfig);
        }
    } else {
        app = getApp();
    }
} catch (e) {
    if (!isBrowser) {
        console.warn("⚠️ Firebase initialization skipped during build (server-side).");
    } else {
        console.error("❌ Firebase initialization failed:", e);
    }
}

// Exported instances with safety checks
export const auth = app ? getAuth(app) : ({} as Auth);
export const db = app ? getFirestore(app) : ({} as Firestore);
export const storage = app ? getStorage(app) : ({} as FirebaseStorage);

export const initAnalytics = async () => {
    if (app && isBrowser && await isSupported()) {
        return getAnalytics(app);
    }
    return null;
};

export default app;
