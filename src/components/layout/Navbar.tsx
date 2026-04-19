import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Menu, X } from 'lucide-react';
import NextLogo from '../Icons/NEXT.svg';
import { useLanguage } from '../../lib/i18n';

const LangToggle = () => {
    const { lang, setLang } = useLanguage();
    return (
        <button
            onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
            className="flex items-center gap-1 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-bold text-black/70 transition-all hover:border-black/25 hover:bg-white backdrop-blur-sm"
            title={lang === 'tr' ? 'Switch to English' : "Türkçe'ye geç"}
        >
            <span className="text-base leading-none">{lang === 'tr' ? '🇹🇷' : '🇬🇧'}</span>
            <span>{lang === 'tr' ? 'TR' : 'EN'}</span>
        </button>
    );
};

export const Navbar = ({ onAboutClick }: { onAboutClick?: () => void }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isAuthenticated = useAppStore(state => state.isAuthenticated);
    const navigate = useNavigate();
    const { t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-black/5 py-3' : 'bg-transparent py-5'}`}
            >
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
                    <Link to="/" className="text-xl font-bold tracking-tighter text-black flex items-center gap-[10px] group flex-shrink-0">
                        <img src={NextLogo} alt="NextStep Logo" className="h-16 sm:h-20 transition-transform duration-300 group-hover:scale-105" />
                        <span className="hidden sm:inline text-xl font-bold">NextStep</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-3">
                        <LangToggle />
                        {onAboutClick && (
                            <button onClick={onAboutClick}
                                className="text-sm font-medium text-black/60 hover:text-black transition-colors px-3 py-2 tracking-wide">
                                About
                            </button>
                        )}
                        {isAuthenticated ? (
                            <button onClick={() => navigate('/dashboard')}
                                className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-transform hover:scale-105">
                                {t('nav.goDashboard')}
                            </button>
                        ) : (
                            <>
                                <button onClick={() => navigate('/login')}
                                    className="text-sm font-medium text-black hover:text-black/70 transition-colors px-3 py-2">
                                    {t('nav.login')}
                                </button>
                                <button onClick={() => navigate('/register')}
                                    className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-transform hover:scale-105">
                                    {t('nav.register')}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile: lang toggle + hamburger */}
                    <div className="flex md:hidden items-center gap-2">
                        <LangToggle />
                        <button className="p-2 text-black min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden" />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 md:hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-5 flex justify-between items-center border-b border-black/5">
                                <span className="font-bold text-black tracking-tight">NextStep</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-black bg-black/5 rounded-full hover:bg-black/10">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex flex-col gap-3 px-5 mt-6">
                                {onAboutClick && (
                                    <button onClick={() => { setIsMobileMenuOpen(false); onAboutClick(); }}
                                        className="w-full py-4 text-lg font-medium text-black border-b border-black/5 text-left">
                                        About
                                    </button>
                                )}
                                {isAuthenticated ? (
                                    <button onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }}
                                        className="w-full text-center rounded-2xl bg-black py-4 text-base font-medium text-white">
                                        {t('nav.goDashboard')}
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
                                            className="w-full py-4 text-lg font-medium text-black border-b border-black/5 text-left">
                                            {t('nav.login')}
                                        </button>
                                        <button onClick={() => { setIsMobileMenuOpen(false); navigate('/register'); }}
                                            className="w-full mt-2 rounded-2xl bg-black py-4 text-base font-medium text-white text-center">
                                            {t('nav.register')}
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
