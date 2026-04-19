import {
    collection, doc, addDoc, getDocs, updateDoc, deleteDoc,
    query, where, orderBy, serverTimestamp, writeBatch, type DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Application } from '../store/useAppStore';

const COLL = 'applications';

// ── Add ──────────────────────────────────────────────────────────
export const addApplicationFS = async (
    userId: string,
    appData: Omit<Application, 'id' | 'no' | 'createdAt'>
) => {
    try {
        const ref = await addDoc(collection(db, COLL), {
            ...appData,
            userId,
            createdAt: serverTimestamp(),
        });
        return ref.id;
    } catch (error) {
        console.error("🔥 Firestore Add Error:", error);
        throw error;
    }
};

// ── Get all for user ─────────────────────────────────────────────
export const getApplicationsFS = async (userId: string): Promise<Application[]> => {
    try {
        const q = query(
            collection(db, COLL),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        return snap.docs.map((d, i) => ({
            id: d.id,
            no: i + 1,
            createdAt: d.data().createdAt?.toMillis?.() ?? Date.now(),
            ...(d.data() as DocumentData),
        })) as Application[];
    } catch (error) {
        console.error("🔥 Firestore Get Error:", error);
        throw error;
    }
};

// ── Update ───────────────────────────────────────────────────────
export const updateApplicationFS = async (id: string, data: Partial<Application>) => {
    try {
        const ref = doc(db, COLL, id);
        await updateDoc(ref, { ...data });
    } catch (error) {
        console.error("🔥 Firestore Update Error:", error);
        throw error;
    }
};

// ── Delete ───────────────────────────────────────────────────────
export const deleteApplicationFS = async (id: string) => {
    try {
        await deleteDoc(doc(db, COLL, id));
    } catch (error) {
        console.error("🔥 Firestore Delete Error:", error);
        throw error;
    }
};

// ── Wipe all for user ────────────────────────────────────────────
export const wipeUserApplicationsFS = async (userId: string) => {
    try {
        const q = query(collection(db, COLL), where('userId', '==', userId));
        const snap = await getDocs(q);
        
        const batch = writeBatch(db);
        snap.docs.forEach((docSnap) => {
            batch.delete(docSnap.ref);
        });
        
        await batch.commit();
    } catch (error) {
        console.error("🔥 Firestore Wipe Error:", error);
        throw error;
    }
};
