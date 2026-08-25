import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const NOT_CONFIGURED = 'Sign-in is unavailable because Firebase is not configured.';

function requireAuth() {
  if (!auth) throw new Error(NOT_CONFIGURED);
  return auth;
}

const MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'That email address is not valid.',
  'auth/missing-email': 'Enter your email address first.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account matches that email.',
  'auth/wrong-password': 'Email or password is incorrect.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/email-already-in-use': 'That email is already registered. Try signing in.',
  'auth/weak-password': 'Use a password with at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/popup-closed-by-user': 'The Google window was closed before finishing.',
  'auth/cancelled-popup-request': 'The Google window was closed before finishing.',
  'auth/unauthorized-domain': 'This domain is not authorized in Firebase Authentication.',
  'auth/operation-not-allowed': 'This sign-in method is disabled in Firebase Authentication.',
};

export function authErrorMessage(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  if (MESSAGES[code]) return MESSAGES[code];
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}

export async function saveUserProfile(user: User): Promise<void> {
  if (!db) return;
  await setDoc(
    doc(db, 'users', user.uid),
    {
      userId: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? '',
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}

export const authService = {
  subscribe(callback: (user: User | null) => void) {
    return auth ? onAuthStateChanged(auth, callback) : (callback(null), () => {});
  },
  currentUser(): User | null {
    return auth?.currentUser ?? null;
  },
  async signInWithEmail(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(requireAuth(), email.trim(), password);
    await saveUserProfile(credential.user).catch(() => undefined);
    return credential.user;
  },
  async registerWithEmail(name: string, email: string, password: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(requireAuth(), email.trim(), password);
    const displayName = name.trim();
    if (displayName) await updateProfile(credential.user, { displayName }).catch(() => undefined);
    await saveUserProfile(credential.user).catch(() => undefined);
    return credential.user;
  },
  async signInWithGoogle(): Promise<User | null> {
    const instance = requireAuth();
    try {
      const credential = await signInWithPopup(instance, googleProvider);
      await saveUserProfile(credential.user).catch(() => undefined);
      return credential.user;
    } catch (error) {
      const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
      if (code !== 'auth/popup-blocked' && code !== 'auth/operation-not-supported-in-this-environment') throw error;
      await signInWithRedirect(instance, googleProvider);
      return null;
    }
  },
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(requireAuth(), email.trim());
  },
  async signOut(): Promise<void> {
    if (auth) await firebaseSignOut(auth);
  },
};
