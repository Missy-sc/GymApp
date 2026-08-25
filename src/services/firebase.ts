import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseEnabled = Boolean(config.apiKey && config.projectId);
export const firebaseApp = firebaseEnabled
  ? (getApps()[0] ?? initializeApp(config))
  : null;
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const cloudStorage = firebaseApp ? getStorage(firebaseApp) : null;
if (import.meta.env.VITE_FIREBASE_EMULATORS === 'true') {
  if (auth) connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  if (db) connectFirestoreEmulator(db, '127.0.0.1', 8080);
  if (cloudStorage) connectStorageEmulator(cloudStorage, '127.0.0.1', 9199);
}

export const analytics: Promise<Analytics | null> =
  firebaseApp && config.measurementId
    ? isSupported().then((supported) => (supported ? getAnalytics(firebaseApp) : null))
    : Promise.resolve(null);


// Firestore: users, exercises, routines, workout_sessions, user_preferences. User records carry userId.
