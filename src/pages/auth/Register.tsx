import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { registerUser, loginWithGoogle } from '../../lib/authService';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

// Per-field character limits — declared once, reused in JSX + validation
const LIMITS = {
    firstName: { max: 50, label: 'Ad' },
    lastName: { max: 50, label: 'Soyad' },
    email: { max: 254, label: 'E-posta' },        // RFC 5321
    password: { min: 6, max: 128, label: 'Şifre' }, // 128 = common ceiling
} as const;

const Register = () => {
    useDocumentTitle('Kayıt Ol');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const login = useAppStore(state => state.login);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        if (loading) return;
        setLoading(true);
        setError('');
        try {
            const user = await loginWithGoogle();
            const name = user.displayName || user.email?.split('@')[0] || 'Kullanıcı';
            login(user.email ?? '', name, user.uid);
            navigate('/dashboard', { replace: true });
        } catch (err: unknown) {
            const e = err as { code?: string };
            if (e.code !== 'auth/popup-closed-by-user') {
                setError('Google ile kayıt yapılamadı. Tekrar deneyin.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        const trimmedEmail = email.trim();
        const trimmedFirst = firstName.trim();
        const trimmedLast = lastName.trim();
        const displayName = `${trimmedFirst} ${trimmedLast}`.trim();

        // ── Per-field validation with specific messages ──
        const errs: Record<string, string> = {};

        if (!trimmedFirst) errs.firstName = 'Ad alanı zorunludur.';
        else if (trimmedFirst.length > LIMITS.firstName.max) errs.firstName = `Ad en fazla ${LIMITS.firstName.max} karakter olabilir (şu an ${trimmedFirst.length}).`;

        if (trimmedLast.length > LIMITS.lastName.max) errs.lastName = `Soyad en fazla ${LIMITS.lastName.max} karakter olabilir (şu an ${trimmedLast.length}).`;

        if (!trimmedEmail) errs.email = 'E-posta alanı zorunludur.';
        else if (trimmedEmail.length > LIMITS.email.max) errs.email = `E-posta en fazla ${LIMITS.email.max} karakter olabilir (şu an ${trimmedEmail.length}).`;
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) errs.email = 'Geçerli bir e-posta adresi girin (örn. ad@firma.com).';

        if (!password) errs.password = 'Şifre alanı zorunludur.';
        else if (password.length < LIMITS.password.min) errs.password = `Şifre en az ${LIMITS.password.min} karakter olmalı (şu an ${password.length}).`;
        else if (password.length > LIMITS.password.max) errs.password = `Şifre en fazla ${LIMITS.password.max} karakter olabilir (şu an ${password.length}).`;

        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            setError('');
            return;
        }
        setFieldErrors({});

        setLoading(true);
        setError('');
        try {
            const user = await registerUser(trimmedEmail, password, displayName);
            login(user.email ?? trimmedEmail, displayName, user.uid);
            navigate('/dashboard', { replace: true });
        } catch (err: unknown) {
            const e = err as { code?: string; message?: string };
            if (e.code === 'auth/email-already-in-use') setFieldErrors({ email: 'Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.' });
            else if (e.code === 'auth/weak-password') setFieldErrors({ password: 'Şifre yeterince güçlü değil. En az 6 karakter girin.' });
            else if (e.code === 'auth/invalid-email') setFieldErrors({ email: 'Geçersiz e-posta adresi formatı.' });
            else if (e.code === 'auth/network-request-failed') setError('Ağ bağlantısı yok. İnternetinizi kontrol edin.');
            else setError('Kayıt yapılamadı: ' + (e.message ?? 'beklenmeyen bir hata oluştu.'));
        } finally {
            setLoading(false);
        }
    };

    const field = (
        name: 'firstName' | 'lastName' | 'email',
        label: string, value: string,
        onChange: (v: string) => void,
        type = 'text', placeholder = ''
    ) => {
        const err = fieldErrors[name];
        const max = name === 'email' ? LIMITS.email.max : LIMITS[name].max;
        const overLimit = value.length > max;
        return (
            <div>
                <label className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/60">
                    <span>{label}{name !== 'lastName' && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}</span>
                    <span className={`font-mono normal-case tracking-normal text-[10px] ${overLimit ? 'text-rose-600' : 'text-black/55'}`}>
                        {value.length}/{max}
                    </span>
                </label>
                <input type={type} value={value} onChange={e => { onChange(e.target.value); if (err) setFieldErrors(p => { const n = { ...p }; delete n[name]; return n; }); }}
                    placeholder={placeholder}
                    maxLength={max}
                    aria-invalid={!!err}
                    autoComplete={type === 'email' ? 'email' : name === 'firstName' ? 'given-name' : name === 'lastName' ? 'family-name' : 'off'}
                    className={`w-full rounded-xl border bg-[#fafafa] px-4 py-3.5 text-base sm:text-sm font-medium text-black outline-none transition-all placeholder:text-black/45 focus:bg-white focus:ring-2 ${err ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400/20 focus:border-rose-400' : 'border-black/8 focus:border-orange-300 focus:ring-orange-400/20'}`} />
                {err && (
                    <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-start gap-1" role="alert">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 flex-shrink-0">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {err}
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#f8f8fa] px-6 py-20 overflow-hidden">
            <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl" />

            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }}
                className="relative w-full max-w-[440px]">

                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">N</span>
                        </div>
                        <span className="text-xl font-bold text-[#1d1d1f] tracking-tight">NextStep</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-2">Hesap Oluştur</h1>
                    <p className="text-sm text-black/50">Kariyer takibine hemen başlayın</p>
                </div>

                <div className="bg-white rounded-[28px] border border-black/5 shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8">
                    <form onSubmit={handleRegister} className="flex flex-col gap-4">
                        {error && (
                            <div className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">{error}</div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            {field('firstName', 'Ad', firstName, setFirstName)}
                            {field('lastName', 'Soyad', lastName, setLastName)}
                        </div>
                        {field('email', 'E-posta', email, setEmail, 'email', 'ornek@email.com')}

                        <div>
                            <label className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/60">
                                <span>Şifre<span className="text-rose-500 ml-1" aria-hidden="true">*</span></span>
                                <span className={`font-mono normal-case tracking-normal text-[10px] ${password.length > LIMITS.password.max ? 'text-rose-600' : 'text-black/55'}`}>
                                    {password.length}/{LIMITS.password.max}
                                </span>
                            </label>
                            <div className="relative">
                                <input type={showPass ? 'text' : 'password'} value={password}
                                    onChange={e => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors(p => { const n = { ...p }; delete n.password; return n; }); }}
                                    placeholder="En az 6 karakter" minLength={LIMITS.password.min} maxLength={LIMITS.password.max}
                                    autoComplete="new-password"
                                    aria-invalid={!!fieldErrors.password}
                                    className={`w-full rounded-xl border bg-[#fafafa] px-4 py-3.5 pr-12 text-base sm:text-sm font-medium text-black outline-none transition-all placeholder:text-black/45 focus:bg-white focus:ring-2 ${fieldErrors.password ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400/20 focus:border-rose-400' : 'border-black/8 focus:border-orange-300 focus:ring-orange-400/20'}`} />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/55 hover:text-black/60 transition-colors" tabIndex={-1}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        {showPass ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                                    </svg>
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-start gap-1" role="alert">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 flex-shrink-0">
                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        <motion.button type="submit" disabled={loading || !email || !password || !firstName} whileTap={{ scale: 0.98 }}
                            className="mt-2 w-full rounded-full bg-gradient-to-r from-orange-400 via-rose-500 to-pink-500 py-4 text-sm font-bold text-white transition-all hover:shadow-[0_8px_24px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 disabled:opacity-50">
                            {loading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="relative mt-5 mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-black/8" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-3 text-xs text-black/60 font-medium">veya</span>
                        </div>
                    </div>

                    {/* Google Sign Up */}
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
                        Google ile Kayıt Ol
                    </button>

                    <div className="mt-5 text-center text-sm text-black/50">
                        Zaten hesabın var mı?{' '}
                        <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">Giriş Yap</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
