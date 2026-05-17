import {
    collection, doc, addDoc, getDocs, getDoc, setDoc, updateDoc, deleteDoc,
    query, where, orderBy, serverTimestamp, writeBatch, type DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Application, CVAnalysis } from '../store/useAppStore';

const COLL = 'applications';
const CV_COLL = 'cvAnalyses';

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
        if (import.meta.env.DEV) console.error("Firestore Add Error:", error);
        throw error;
    }
};

// ── Get all for user ─────────────────────────────────────────────
// Tries the composite-indexed query first; falls back to a single-where query
// and sorts client-side if the index isn't ready yet.
export const getApplicationsFS = async (userId: string): Promise<Application[]> => {
    if (!userId) return [];
    const mapDocs = (docs: { id: string; data: () => DocumentData }[]): Application[] =>
        docs
            .map((d) => ({
                id: d.id,
                createdAt: (d.data() as { createdAt?: { toMillis?: () => number } }).createdAt?.toMillis?.() ?? Date.now(),
                ...(d.data() as DocumentData),
            }))
            .sort((a, b) => (b.createdAt as number) - (a.createdAt as number))
            .map((d, i) => ({ ...d, no: i + 1 } as Application));

    try {
        const q = query(
            collection(db, COLL),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        return mapDocs(snap.docs);
    } catch (error) {
        if (import.meta.env.DEV) console.error("Firestore Get Error (indexed):", error);
        // Fallback for missing composite index — slower but still works.
        try {
            const q2 = query(collection(db, COLL), where('userId', '==', userId));
            const snap2 = await getDocs(q2);
            return mapDocs(snap2.docs);
        } catch (err2) {
            if (import.meta.env.DEV) console.error("Firestore Get Error (fallback):", err2);
            throw err2;
        }
    }
};

// ── CV Analysis — single doc per user ────────────────────────────
export const saveCVAnalysisFS = async (userId: string, cv: CVAnalysis): Promise<void> => {
    if (!userId) return;
    try {
        await setDoc(doc(db, CV_COLL, userId), { ...cv, userId });
    } catch (error) {
        if (import.meta.env.DEV) console.error("Firestore CV Save Error:", error);
        throw error;
    }
};

export const getCVAnalysisFS = async (userId: string): Promise<CVAnalysis | null> => {
    if (!userId) return null;
    try {
        const snap = await getDoc(doc(db, CV_COLL, userId));
        if (!snap.exists()) return null;
        const { userId: _uid, ...rest } = snap.data() as CVAnalysis & { userId?: string };
        return rest as CVAnalysis;
    } catch (error) {
        if (import.meta.env.DEV) console.error("Firestore CV Get Error:", error);
        return null;
    }
};

export const deleteCVAnalysisFS = async (userId: string): Promise<void> => {
    if (!userId) return;
    try {
        await deleteDoc(doc(db, CV_COLL, userId));
    } catch (error) {
        if (import.meta.env.DEV) console.error("Firestore CV Delete Error:", error);
    }
};

// ── Update ───────────────────────────────────────────────────────
export const updateApplicationFS = async (id: string, data: Partial<Application>) => {
    try {
        const ref = doc(db, COLL, id);
        await updateDoc(ref, { ...data });
    } catch (error) {
        if (import.meta.env.DEV) console.error("Firestore Update Error:", error);
        throw error;
    }
};

// ── Delete ───────────────────────────────────────────────────────
export const deleteApplicationFS = async (id: string) => {
    try {
        await deleteDoc(doc(db, COLL, id));
    } catch (error) {
        if (import.meta.env.DEV) console.error("Firestore Delete Error:", error);
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
        if (import.meta.env.DEV) console.error("Firestore Wipe Error:", error);
        throw error;
    }
};
