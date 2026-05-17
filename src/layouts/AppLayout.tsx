import { Outlet, useLocation } from 'react-router-dom';
import { FloatingDock } from '../components/common/FloatingDock';
import { GeminiWidget } from '../components/common/GeminiWidget';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useDark } from '../hooks/useDark';


export default function AppLayout() {
    const location = useLocation();
    useTheme(); // Apply data-theme to <html> based on stored preference
    const isDark = useDark();

    return (
        <div className={`relative min-h-screen w-full overflow-hidden transition-colors ${isDark ? 'bg-[#0d0d0f] text-white' : 'bg-[#f8f8fa] text-[#1d1d1f]'}`}>
            <main className="relative z-0 h-full w-full pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                        className="w-full h-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            <div className="fixed bottom-6 sm:bottom-8 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-2rem)] max-w-max">
                <FloatingDock />
            </div>

            <GeminiWidget />
        </div>
    );
}

