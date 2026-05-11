import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { resetPassword } from '../../lib/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleSendLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await resetPassword(email);
            setIsSent(true);
        } catch (err: unknown) {
            const e = err as { code?: string };
            if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-email') {
                setError('Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.');
            } else {
                setError('Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#f8f8fa] px-6 py-20 overflow-hidden">
            <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="relative w-full max-w-[420px]"
            >
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">N</span>
                        </div>
                        <span className="text-xl font-bold text-[#1d1d1f] tracking-tight">NextStep</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-2">Şifremi Unuttum</h1>
                    <p className="text-sm text-black/50">Hesabınıza ait e-posta adresini girin.</p>
                </div>

                <div className="bg-white rounded-[28px] border border-black/5 shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8">
                    <AnimatePresence mode="wait">
                        {!isSent ? (
                            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <form onSubmit={handleSendLink} className="flex flex-col gap-5">
                                    {error && (
                                        <div className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                                            {error}
                                        </div>
                                    )}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/40">E-posta</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3.5 text-sm font-medium text-black outline-none transition-all placeholder:text-black/25 focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
                                            placeholder="ornek@email.com"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || !email}
                                        className="mt-2 w-full rounded-full bg-gradient-to-r from-orange-400 via-rose-500 to-pink-500 py-4 text-sm font-bold text-white transition-all hover:shadow-[0_8px_24px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 disabled:opacity-50"
                                    >
                                        {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col items-center justify-center text-center py-4"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                                    className="mb-5 rounded-full bg-emerald-500/10 p-4 text-emerald-500"
                                >
                                    <CheckCircle2 size={40} />
                                </motion.div>
                                <h2 className="text-xl font-bold text-[#1d1d1f] mb-2">E-posta Gönderildi</h2>
                                <p className="text-sm text-black/50 mb-6 leading-relaxed">
                                    <strong className="text-black/70">{email}</strong> adresine şifre sıfırlama bağlantısı gönderildi. E-postanızı kontrol edin.
                                </p>
                                <Link
                                    to="/login"
                                    className="w-full rounded-full bg-gradient-to-r from-orange-400 via-rose-500 to-pink-500 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 inline-block text-center"
                                >
                                    Giriş Sayfasına Dön
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isSent && (
                        <div className="mt-6 text-center text-sm text-black/50">
                            <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                                ← Giriş sayfasına dön
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
