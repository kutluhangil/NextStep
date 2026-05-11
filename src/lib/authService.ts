import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    type User,
} from 'firebase/auth';
import { auth } from './firebase';

// ── Register new user ────────────────────────────────────────────
export const registerUser = async (email: string, password: string, displayName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    return cred.user;
};

// ── Login ────────────────────────────────────────────────────────
export const loginUser = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
};

// ── Google Sign-In ───────────────────────────────────────────────
export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
};

// ── Logout ───────────────────────────────────────────────────────
export const logoutUser = () => signOut(auth);

// ── Password reset ───────────────────────────────────────────────
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

// ── Auth state observer ──────────────────────────────────────────
export const onAuthChange = (callback: (user: User | null) => void) =>
    onAuthStateChanged(auth, callback);
