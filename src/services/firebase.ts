import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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
export const analytics: Promise<Analytics | null> =
  firebaseApp && config.measurementId
    ? isSupported().then((supported) => (supported ? getAnalytics(firebaseApp) : null))
    : Promise.resolve(null);

let authReady: Promise<User> | null = null;

export function ensureAnonymousAuth(): Promise<User> {
  if (!auth) {
    return Promise.reject(new Error('Firebase Authentication is not configured'));
  }

  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }

  authReady ??= new Promise<User>((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        unsubscribe();
        if (user) {
          resolve(user);
          return;
        }

        try {
          const credential = await signInAnonymously(auth);
          resolve(credential.user);
        } catch (error) {
          authReady = null;
          reject(error);
        }
      },
      (error) => {
        unsubscribe();
        authReady = null;
        reject(error);
      },
    );
  });

  return authReady;
}

// Firestore: users, exercises, routines, workout_sessions, user_preferences. User records carry userId.
