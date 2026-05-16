import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useLanguage } from '../lib/i18n';

const NotFound = () => {
    const { lang } = useLanguage();
    useDocumentTitle(lang === 'tr' ? '404 — Sayfa Bulunamadı' : '404 — Page Not Found');

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center px-5 overflow-hidden"
            style={{ background: '#faf9f6', minHeight: '100dvh' as React.CSSProperties['minHeight'] }}>
            <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)' }} />
            <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.10) 0%, transparent 70%)' }} />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 text-center max-w-md mx-auto">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] mb-3" style={{ color: '#f97316' }}>
                    {lang === 'tr' ? 'Hata 404' : 'Error 404'}
                </p>
                <h1 className="font-black tracking-[-0.04em] leading-none mb-4"
                    style={{
                        fontSize: 'clamp(72px,18vw,140px)',
                        background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #14b8a6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                    404
                </h1>
                <h2 className="text-2xl font-black tracking-tight mb-3" style={{ color: '#1a1a1a' }}>
                    {lang === 'tr' ? 'Sayfa bulunamadı.' : 'Page not found.'}
                </h2>
                <p className="text-base leading-relaxed mb-8" style={{ color: '#6b6560' }}>
                    {lang === 'tr'
                        ? 'Aradığın sayfa kaldırılmış, taşınmış ya da hiç var olmamış olabilir.'
                        : "The page you're looking for might have been removed, renamed or never existed."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/"
                        className="rounded-full px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(249,115,22,0.3)]"
                        style={{ background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #14b8a6 100%)' }}>
                        {lang === 'tr' ? 'Anasayfaya Dön' : 'Back to Home'}
                    </Link>
                    <button onClick={() => window.history.back()}
                        className="rounded-full px-8 py-3.5 text-sm font-semibold transition-all hover:bg-black/5"
                        style={{ border: '1.5px solid #e2ded8', color: '#6b6560' }}>
                        ← {lang === 'tr' ? 'Geri Git' : 'Go Back'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
