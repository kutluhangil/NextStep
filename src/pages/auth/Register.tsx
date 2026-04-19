import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { registerUser } from '../../lib/authService';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const login = useAppStore(state => state.login);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const displayName = `${firstName} ${lastName}`.trim();
            const user = await registerUser(email, password, displayName);
            login(user.email ?? email, displayName, user.uid);
            navigate('/dashboard');
        } catch (err: unknown) {
            const e = err as { code?: string };
            if (e.code === 'auth/email-already-in-use') setError('Bu e-posta adresi zaten kayıtlı.');
            else if (e.code === 'auth/weak-password') setError('Şifre en az 6 karakter olmalı.');
            else if (e.code === 'auth/invalid-email') setError('Geçersiz e-posta adresi.');
            else setError('Kayıt yapılamadı. Tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const field = (
        label: string, value: string,
        onChange: (v: string) => void,
        type = 'text', placeholder = ''
    ) => (
        <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/40">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required
                className="w-full rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3.5 text-sm font-medium text-black outline-none transition-all placeholder:text-black/25 focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-400/20" />
        </div>
    );

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
                            {field('Ad', firstName, setFirstName)}
                            {field('Soyad', lastName, setLastName)}
                        </div>
                        {field('E-posta', email, setEmail, 'email', 'ornek@email.com')}

                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/40">Şifre</label>
                            <div className="relative">
                                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="En az 6 karakter" required minLength={6}
                                    className="w-full rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3.5 pr-12 text-sm font-medium text-black outline-none transition-all placeholder:text-black/25 focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-400/20" />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 transition-colors" tabIndex={-1}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        {showPass ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <motion.button type="submit" disabled={loading || !email || !password || !firstName} whileTap={{ scale: 0.98 }}
                            className="mt-2 w-full rounded-full bg-gradient-to-r from-orange-400 via-rose-500 to-pink-500 py-4 text-sm font-bold text-white transition-all hover:shadow-[0_8px_24px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 disabled:opacity-50">
                            {loading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center text-sm text-black/50">
                        Zaten hesabın var mı?{' '}
                        <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">Giriş Yap</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
