import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ApplicationStatus =
    | 'Süreçte'
    | 'Görüşme Bekleniyor'
    | 'Teknik Mülakat'
    | 'İK Mülakatı'
    | 'Vaka / Ödev'
    | 'Teklif Alındı'
    | 'Olumlu'
    | 'Reddedildi'
    | 'İptal'
    | 'Yanıt Yok';

export type WorkType = 'Uzaktan' | 'Hibrit' | 'Ofis' | 'Belirtilmedi';
export type ContractType = 'Tam Zamanlı' | 'Yarı Zamanlı' | 'Staj' | 'Sözleşmeli' | 'Freelance';
export type SalaryPeriod = 'Aylık' | 'Yıllık';

export interface Application {
    id: string;
    no: number;
    // Core
    companyName: string;
    position: string;
    department: string;
    jobLink: string;
    date: string;
    status: ApplicationStatus;
    // Location & Work Style
    city: string;
    country: string;
    workType: WorkType;
    contractType: ContractType;
    // Salary
    salaryMin: string;
    salaryMax: string;
    salaryCurrency: string;
    salaryPeriod: SalaryPeriod;
    // Platform & CV
    platform: string;
    cvVersion: string;
    // Content
    motivation: string;
    testLink: string;
    // Interview tracking
    hrName: string;
    hrEmail: string;
    interviewDate: string;
    interviewNotes: string;
    followUpDate: string;
    // Outcome
    offerAmount: string;
    rejectionReason: string;
    priority: 'Düşük' | 'Orta' | 'Yüksek';
    tags: string;          // comma-separated
    notes: string;
    // Metadata
    createdAt: number;
}

export type Theme = 'light' | 'dark' | 'system';

export interface NotificationPrefs {
    weeklyReport: boolean;
    reminderInactive: boolean;
    offerAlerts: boolean;
}

interface AppState {
    isAuthenticated: boolean;
    firebaseUid: string | null;
    user: { name: string; email: string } | null;
    applications: Application[];
    theme: Theme;
    notifications: NotificationPrefs;

    // Actions
    login: (email: string, name?: string, uid?: string) => void;
    // Async Cloud Actions
    addApplicationAsync: (app: Omit<Application, 'id' | 'no' | 'createdAt'>) => Promise<void>;
    updateApplicationAsync: (id: string, app: Partial<Application>) => Promise<void>;
    deleteApplicationAsync: (id: string) => Promise<void>;
    fetchApplications: () => Promise<void>;
    wipeApplications: () => Promise<void>;
}

import { addApplicationFS, updateApplicationFS, deleteApplicationFS, getApplicationsFS, wipeUserApplicationsFS } from '../lib/firestoreService';

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            firebaseUid: null,
            user: null,
            applications: [],
            theme: 'light' as Theme,
            notifications: {
                weeklyReport: true,
                reminderInactive: true,
                offerAlerts: false,
            },

            login: (email, name = 'Kullanıcı', uid) =>
                set({ isAuthenticated: true, firebaseUid: uid ?? null, user: { name, email } }),

            logout: () =>
                set({ isAuthenticated: false, firebaseUid: null, user: null, applications: [] }),

            addApplication: (appData) =>
                set((state) => {
                    const newNo = state.applications.length > 0 ? Math.max(...state.applications.map(a => a.no)) + 1 : 1;
                    const newApp: Application = { ...appData, id: crypto.randomUUID(), no: newNo, createdAt: Date.now() };
                    return { applications: [newApp, ...state.applications] };
                }),

            updateApplication: (id, updatedData) =>
                set((state) => ({
                    applications: state.applications.map(app => app.id === id ? { ...app, ...updatedData } : app),
                })),

            deleteApplication: (id) =>
                set((state) => ({
                    applications: state.applications.filter(app => app.id !== id),
                })),

            setApplications: (apps) => set({ applications: apps }),
            setTheme: (theme) => set({ theme }),
            setNotifications: (prefs) => set((state) => ({ notifications: { ...state.notifications, ...prefs } })),

            // --- Async Firebase Actions ---
            addApplicationAsync: async (appData) => {
                const { firebaseUid } = get();
                if (!firebaseUid) throw new Error("Kullanıcı girişi bulunamadı.");
                
                // Add to cloud first
                const docId = await addApplicationFS(firebaseUid, appData);
                
                // Then set locally
                set((state) => {
                    const newNo = state.applications.length > 0 ? Math.max(...state.applications.map(a => a.no)) + 1 : 1;
                    const newApp: Application = { ...appData, id: docId, no: newNo, createdAt: Date.now() };
                    return { applications: [newApp, ...state.applications] };
                });
            },

            updateApplicationAsync: async (id, updatedData) => {
                await updateApplicationFS(id, updatedData);
                set((state) => ({
                    applications: state.applications.map(app => app.id === id ? { ...app, ...updatedData } : app),
                }));
            },

            deleteApplicationAsync: async (id) => {
                await deleteApplicationFS(id);
                set((state) => ({
                    applications: state.applications.filter(app => app.id !== id),
                }));
            },

            fetchApplications: async () => {
                const { firebaseUid } = get();
                if (firebaseUid) {
                    const apps = await getApplicationsFS(firebaseUid);
                    set({ applications: apps });
                }
            },

            wipeApplications: async () => {
                const { firebaseUid } = get();
                if (firebaseUid) {
                    await wipeUserApplicationsFS(firebaseUid);
                    set({ applications: [] });
                }
            }
        }),
        {
            name: 'nextstep-storage',
            partialize: (state) => ({
                theme: state.theme,
                notifications: state.notifications,
                // Do not persist applications, always pull from DB for real sync
                // But wait, offline-first means we should persist it. 
                // Let's persist them, and on start we just fetch and overwrite.
                applications: state.applications,
                isAuthenticated: state.isAuthenticated,
                firebaseUid: state.firebaseUid,
                user: state.user
            }),
        }
    )
);
