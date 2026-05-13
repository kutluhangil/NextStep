import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, List, PieChart, Settings, FileText, LogOut } from 'lucide-react';
import { useLanguage } from '../../lib/i18n';
import { useAppStore } from '../../store/useAppStore';
import { logoutUser } from '../../lib/authService';

export function FloatingDock() {
    const [hovered, setHovered] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const logout = useAppStore(state => state.logout);

    const DOCK_ITEMS = [
        { id: 'home', label: t('nav.dashboard'), icon: Home, path: '/dashboard' },
        { id: 'add', label: t('nav.add'), icon: PlusCircle, path: '/add' },
        { id: 'list', label: t('nav.applications'), icon: List, path: '/applications' },
        { id: 'analytics', label: t('nav.analytics'), icon: PieChart, path: '/analytics' },
        { id: 'cv', label: t('nav.cv'), icon: FileText, path: '/cv' },
        { id: 'settings', label: t('nav.settings'), icon: Settings, path: '/settings' },
    ];

    const handleLogout = async () => {
        await logoutUser();
        logout();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.8, delay: 0.2 }}
            className="glass-dock flex items-center gap-1 rounded-full px-3 py-2.5 sm:gap-2 sm:px-4 sm:py-3"
        >
            {DOCK_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                    <Link
                        key={item.id}
                        to={item.path}
                        onMouseEnter={() => setHovered(item.id)}
                        onMouseLeave={() => setHovered(null)}
                        className="group relative flex items-center justify-center rounded-full p-2.5 sm:p-3 transition-colors duration-200 hover:bg-black/5 min-w-[44px] min-h-[44px]"
                        aria-label={item.label}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-indicator"
                                className="absolute -bottom-1 h-1 w-1 rounded-full bg-black/60"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}

                        <AnimatePresence>
                            {hovered === item.id && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: -45, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                                    className="absolute -top-1 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-black/80 px-3 py-1.5 text-xs font-medium text-white shadow-xl whitespace-nowrap pointer-events-none"
                                >
                                    {item.label}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            animate={{ scale: hovered === item.id ? 1.2 : 1, y: hovered === item.id ? -4 : 0 }}
                            transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
                        >
                            <Icon
                                size={21}
                                className={`transition-colors duration-300 ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-black/80'}`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                        </motion.div>
                    </Link>
                );
            })}

            {/* Logout */}
            <button
                onMouseEnter={() => setHovered('logout')}
                onMouseLeave={() => setHovered(null)}
                onClick={handleLogout}
                className="group relative flex items-center justify-center rounded-full p-2.5 sm:p-3 transition-colors duration-200 hover:bg-rose-50 min-w-[44px] min-h-[44px]"
                aria-label={t('dashboard.logout')}
            >
                <AnimatePresence>
                    {hovered === 'logout' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: -45, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                            className="absolute -top-1 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-black/80 px-3 py-1.5 text-xs font-medium text-white shadow-xl whitespace-nowrap pointer-events-none"
                        >
                            {t('dashboard.logout')}
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div
                    animate={{ scale: hovered === 'logout' ? 1.2 : 1, y: hovered === 'logout' ? -4 : 0 }}
                    transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
                >
                    <LogOut size={21} className="transition-colors duration-300 text-gray-500 group-hover:text-rose-500" strokeWidth={2} />
                </motion.div>
            </button>
        </motion.nav>
    );
}
