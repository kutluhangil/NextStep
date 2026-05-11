import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useDark(): boolean {
    const theme = useAppStore(state => state.theme);
    const [systemDark, setSystemDark] = useState(
        () => window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    useEffect(() => {
        if (theme !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [theme]);

    if (theme === 'dark') return true;
    if (theme === 'system') return systemDark;
    return false;
}
