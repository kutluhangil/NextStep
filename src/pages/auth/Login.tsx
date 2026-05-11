import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { loginUser, loginWithGoogle } from '../../lib/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const login = useAppStore(state => state.login);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem('nextstep-remembered-email');
        if (saved) { setEmail(saved); setRememberMe(true); }
    }, []);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const user = await loginWithGoogle();
            const name = user.displayName || user.email?.split('@')[0] || 'Kullanıcı';
            login(user.email ?? '', name, user.uid);
            navigate('/dashboard');
        } catch (err: unknown) {
            const e = err as { code?: string };
            if (e.code !== 'auth/popup-closed-by-user') {
                setError('Google ile giriş yapılamadı. Tekrar deneyin.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await loginUser(email, password);
            if (rememberMe) {
                localStorage.setItem('nextstep-remembered-email', email);
            } else {
                localStorage.removeItem('nextstep-remembered-email');
            }
            const name = user.displayName || email.split('@')[0];
            login(user.email ?? email, name, user.uid);
            navigate('/dashboard');
        } catch (err: unknown) {
            const e = err as { code?: string };
            if (e.code === 'auth/invalid-credential') setError('E-posta veya şifre hatalı.');
            else if (e.code === 'auth/too-many-requests') setError('Çok fazla deneme. Lütfen bekleyin.');
            else setError('Giriş yapılamadı. Tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#f8f8fa] px-6 py-20 overflow-hidden">
            <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-50/30 rounded-full blur-3xl" />

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
                    <h1 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-2">Tekrar hoş geldin</h1>
                    <p className="text-sm text-black/50">Hesabınıza giriş yapın</p>
                </div>

                <div className="bg-white rounded-[28px] border border-black/5 shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8">
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        {error && (
                            <div className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/40">E-posta</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3.5 text-sm font-medium text-black outline-none transition-all placeholder:text-black/25 focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
                                placeholder="ornek@email.com" required />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/40">Şifre</label>
                            <div className="relative">
                                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3.5 pr-12 text-sm font-medium text-black outline-none transition-all placeholder:text-black/25 focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
                                    placeholder="••••••••" required />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 transition-colors" tabIndex={-1}>
                                    {showPass
                                        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    }
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                <div className="relative">
                                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="sr-only" />
                                    <div className={`w-5 h-5 rounded-[6px] border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-gradient-to-br from-orange-400 to-rose-500 border-orange-400' : 'border-black/20 bg-white group-hover:border-orange-300'}`}>
                                        {rememberMe && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                    </div>
                                </div>
                                <span className="text-sm text-black/60 font-medium select-none">Beni hatırla</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                                Şifremi unuttum
                            </Link>
                        </div>

                        <motion.button type="submit" disabled={loading || !email || !password} whileTap={{ scale: 0.98 }}
                            className="mt-2 w-full rounded-full bg-gradient-to-r from-orange-400 via-rose-500 to-pink-500 py-4 text-sm font-bold text-white transition-all hover:shadow-[0_8px_24px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    Giriş yapılıyor...
                                </span>
                            ) : 'Giriş Yap'}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="relative mt-6 mb-5">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-black/8" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-3 text-xs text-black/40 font-medium">veya</span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 rounded-full border border-black/10 bg-white py-3.5 text-sm font-semibold text-black/80 transition-all hover:bg-black/5 hover:border-black/15 disabled:opacity-50"
                    >
                        <svg width="18" height="18" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.8 29.3 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.3-.1-2.7-.4-4z"/>
                            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.5 5.1 29.5 3 24 3 16.3 3 9.6 7.9 6.3 14.7z"/>
                            <path fill="#4CAF50" d="M24 45c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 36.5 26.9 37 24 37c-5.2 0-9.5-3.2-11.3-7.8l-6.5 5C9.6 40.2 16.3 45 24 45z"/>
                            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.8l6.2 5.2C41.3 36.1 44 30.7 44 24c0-1.3-.1-2.7-.4-4z"/>
                        </svg>
                        Google ile Giriş Yap
                    </button>

                    <div className="mt-5 text-center text-sm text-black/50">
                        Hesabın yok mu?{' '}
                        <Link to="/register" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">Kayıt Ol</Link>
                    </div>
                </div>
                <p className="mt-5 text-center text-xs text-black/30 leading-relaxed">
                    Giriş yaparak Gizlilik Politikası'nı kabul etmiş olursunuz.
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
