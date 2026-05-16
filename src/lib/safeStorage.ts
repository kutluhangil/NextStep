// localStorage wrapper that fails silently — iOS Safari Private Mode throws on writes.

export const safeStorage = {
    get(key: string): string | null {
        try {
            return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
        } catch {
            return null;
        }
    },
    set(key: string, value: string): void {
        try {
            if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
        } catch {
            // iOS Private Mode quota = 0; silently ignore.
        }
    },
    remove(key: string): void {
        try {
            if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
        } catch {
            // ignore
        }
    },
};
