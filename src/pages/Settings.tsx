import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import type { Application } from '../store/useAppStore';
import emailjs from '@emailjs/browser';
import { useLanguage } from '../lib/i18n';
import type { Lang } from '../lib/i18n';
import { useDark } from '../hooks/useDark';
import type { Theme } from '../store/useAppStore';
import { logoutUser } from '../lib/authService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { safeStorage } from '../lib/safeStorage';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: 'easeOut' as const }
});

const Settings = () => {
    useDocumentTitle('Ayarlar');
    const user = useAppStore(state => state.user);
    const logout = useAppStore(state => state.logout);
    const applications = useAppStore(state => state.applications);
    const theme = useAppStore(state => state.theme);
    const setThemeStore = useAppStore(state => state.setTheme);
    const notifications = useAppStore(state => state.notifications);
    const setNotifications = useAppStore(state => state.setNotifications);
    const navigate = useNavigate();
    const { t, lang, setLang } = useLanguage();
    const wipeApplications = useAppStore(state => state.wipeApplications);
    const [showConfirm, setShowConfirm] = useState(false);
    const [wiping, setWiping] = useState(false);
    const [saved, setSaved] = useState<string | null>(null);
    const [fbType, setFbType] = useState('Bug / Hata');
    const [fbMessage, setFbMessage] = useState('');
    const [fbSending, setFbSending] = useState(false);
    const [fbSent, setFbSent] = useState(false);
    const [importing, setImporting] = useState(false);
    const importRef = useRef<HTMLInputElement>(null);
    const addApplicationAsync = useAppStore(state => state.addApplicationAsync);

    const isDark = useDark();
    const card = isDark ? 'bg-[#1c1c1e] border-white/5' : 'bg-white border-black/5';
    const titleColor = isDark ? 'text-white' : 'text-[#1d1d1f]';
    const subColor = isDark ? 'text-white/70' : 'text-black/60';
    const inputBg = isDark ? 'bg-white/5 border-white/8 text-white/70' : 'bg-[#fafafa] border-black/8 text-black/70';
    const rowBorder = isDark ? 'border-white/5' : 'border-black/5';

    const handleFeedback = async () => {
        if (!fbMessage.trim() || fbSending) return;
        setFbSending(true);
        try {
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

            if (serviceId && templateId && publicKey) {
                await emailjs.send(serviceId, templateId, {
                    feedback_type: fbType,
                    feedback_message: fbMessage,
                    user_email: user?.email ?? 'anonymous',
                    to_email: 'kutluhangul@windowslive.com',
                }, publicKey);
            } else {
                window.location.href = `mailto:kutluhangul@windowslive.com?subject=NextStep Feedback: ${fbType}&body=${encodeURIComponent(fbMessage)}`;
            }
            setFbSent(true);
            setFbMessage('');
            setTimeout(() => setFbSent(false), 3500);
        } catch {
            window.location.href = `mailto:kutluhangul@windowslive.com?subject=NextStep Feedback: ${fbType}&body=${encodeURIComponent(fbMessage)}`;
        } finally {
            setFbSending(false);
        }
    };

    const handleWipeData = async () => {
        if (wiping) return;
        setWiping(true);
        try {
            await wipeApplications();
            safeStorage.remove('nextstep-storage');
            safeStorage.remove('nextstep-remembered-email');
            window.location.href = '/';
        } catch (error) {
            if (import.meta.env.DEV) console.error(error);
            alert("Silme işlemi sırasında hata oluştu. Bağlantınızı kontrol edin.");
            setWiping(false);
            setShowConfirm(false);
        }
    };

    const handleLogout = async () => {
        await logoutUser();
        logout();
        // replace history so the back button can't return to a protected page
        navigate('/', { replace: true });
    };

    const toast = (msg: string) => {
        setSaved(msg);
        setTimeout(() => setSaved(null), 2000);
    };

    const handleImportJSON = () => importRef.current?.click();

    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImporting(true);
        try {
            const text = await file.text();
            const json = JSON.parse(text);
            const apps: Partial<Application>[] = Array.isArray(json)
                ? json
                : Array.isArray(json.applications)
                    ? json.applications
                    : [];
            if (apps.length === 0) { toast(t('settings.noValidApps')); return; }

            let count = 0;
            for (const app of apps) {
                const { id: _id, no: _no, createdAt: _ca, userId: _uid, ...rest } = app as Application & { userId?: string };
                if (rest.companyName && rest.position) {
                    await addApplicationAsync(rest as Omit<Application, 'id' | 'no' | 'createdAt'>);
                    count++;
                }
            }
            toast(`${count} ${t('settings.importedCount')}`);
        } catch {
            toast(t('settings.jsonError'));
        } finally {
            setImporting(false);
            e.target.value = '';
        }
    };

    // Export from Zustand store (real data, not localStorage)
    const handleExportJSON = () => {
        const exportData = {
            exportedAt: new Date().toISOString(),
            user: user?.email,
            applications,
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nextstep-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast(`${applications.length} ${t('settings.exportedCount')}`);
    };

    const handleThemeChange = (newTheme: Theme) => {
        setThemeStore(newTheme);
        toast(t('settings.themeUpdated'));
    };

    const handleLangChange = (l: Lang) => {
        setLang(l);
        toast(t('settings.langChanged'));
    };

    const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'NS';

    const SettingRow = ({ icon, title, description, children }: {
        icon: string; title: string; description: string; children: React.ReactNode
    }) => (
        <div className={`flex flex-col sm:flex-row sm:items-center gap-4 py-5 border-b ${rowBorder} last:border-0`}>
            <div className="flex items-start gap-4 flex-1">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5 ${isDark ? 'bg-white/8' : 'bg-black/5'}`}>{icon}</div>
                <div>
                    <div className={`font-semibold text-sm ${titleColor}`}>{title}</div>
                    <div className={`text-xs mt-0.5 leading-relaxed max-w-xs ${subColor}`}>{description}</div>
                </div>
            </div>
            <div className="ml-13 sm:ml-0">{children}</div>
        </div>
    );

    const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
        <button
            onClick={onChange}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none ${checked ? 'bg-gradient-to-r from-indigo-500 to-blue-500' : isDark ? 'bg-white/15' : 'bg-black/10'}`}
        >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    );

    const themeOptions: { value: Theme; label: string; icon: string }[] = [
        { value: 'light', label: t('settings.themeLight'), icon: '☀️' },
        { value: 'dark', label: t('settings.themeDark'), icon: '🌙' },
        { value: 'system', label: t('settings.themeSystem'), icon: '💻' },
    ];

    const langOptions: { code: Lang; flag: string; label: string }[] = [
        { code: 'tr', flag: '🇹🇷', label: 'Türkçe' },
        { code: 'en', flag: '🇬🇧', label: 'English' },
    ];

    return (
        <div className={`w-full min-h-screen ${isDark ? 'bg-[#0d0d0f]' : 'bg-[#f8f8fa]'}`}>
            <div className="mx-auto max-w-[860px] px-4 sm:px-6 pt-20 sm:pt-24 pb-32">

                {/* Header */}
                <motion.div {...fadeUp(0)} className="mb-8 sm:mb-10">
                    <p className={`text-xs font-bold tracking-[0.18em] uppercase mb-2 ${subColor}`}>{t('settings.personalization')}</p>
                    <h1 className={`text-3xl sm:text-5xl font-bold tracking-tight mb-3 ${titleColor}`}>{t('settings.title')}</h1>
                    <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-white/50' : 'text-black/50'}`}>{t('settings.manage')}</p>
                </motion.div>

                <div className="flex flex-col gap-4 sm:gap-5">

                    {/* ── PROFILE CARD ─────────────────────────────────────── */}
                    <motion.div {...fadeUp(0.08)} className={`${card} rounded-[24px] border shadow-[0_2px_24px_#00000008] p-5 sm:p-8 overflow-hidden relative`}>
                        <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-indigo-400/5' : 'bg-indigo-400/8'}`} />

                        {/* Avatar + name row */}
                        <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg flex-shrink-0">
                                {initials}
                            </div>
                            <div>
                                <div className={`text-lg sm:text-xl font-bold ${titleColor}`}>{user?.name || 'Kullanıcı'}</div>
                                <div className={`text-sm mt-0.5 ${subColor}`}>{user?.email || ''}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${subColor}`}>{t('settings.firstName')}</label>
                                <input type="text" disabled value={user?.name?.split(' ')[0] || ''}
                                    className={`w-full rounded-xl border px-4 py-3 text-sm font-medium ${inputBg}`} />
                            </div>
                            <div>
                                <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${subColor}`}>{t('settings.lastName')}</label>
                                <input type="text" disabled value={user?.name?.split(' ').slice(1).join(' ') || ''}
                                    className={`w-full rounded-xl border px-4 py-3 text-sm font-medium ${inputBg}`} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${subColor}`}>{t('settings.email')}</label>
                                <input type="email" disabled value={user?.email || ''}
                                    className={`w-full rounded-xl border px-4 py-3 text-sm font-medium ${inputBg}`} />
                            </div>
                        </div>

                        <div className={`mt-5 sm:mt-6 pt-4 sm:pt-5 border-t ${rowBorder} flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3`}>
                            <span className={`text-xs ${subColor}`}>{t('settings.profileInfo')}</span>
                            <button onClick={handleLogout}
                                className={`rounded-full border px-6 py-2.5 text-sm font-semibold transition-all hover:border-red-200 hover:text-red-600 hover:bg-red-50 ${isDark ? 'border-white/10 text-white/70' : 'border-black/10 bg-white text-black/70'}`}>
                                {t('settings.signOut')}
                            </button>
                        </div>
                    </motion.div>

                    {/* ── SECURITY CARD ────────────────────────────────────── */}
                    <motion.div {...fadeUp(0.12)} className={`${card} rounded-[24px] border shadow-[0_2px_24px_#00000008] p-5 sm:p-8`}>
                        <h3 className={`text-base font-bold mb-1 ${titleColor}`}>{t('settings.securityTitle')}</h3>
                        <p className={`text-xs mb-5 ${subColor}`}>{t('settings.securitySub')}</p>

                        <SettingRow icon="🔒" title={t('settings.changePassword')} description={t('settings.changePassDesc')}>
                            <button onClick={() => toast(t('settings.passwordSoon'))}
                                className={`whitespace-nowrap rounded-full border px-5 py-2 text-xs font-bold transition-all hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 ${isDark ? 'border-white/10 text-white/60' : 'border-black/10 text-black/70'}`}>
                                {t('action.update')}
                            </button>
                        </SettingRow>

                        <SettingRow icon="📱" title={t('settings.activeSessions')} description={t('settings.activeSessionsDesc')}>
                            <button onClick={() => toast(t('settings.oneSession'))}
                                className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors">
                                {t('action.view')}
                            </button>
                        </SettingRow>
                    </motion.div>

                    {/* ── GÖRÜNÜM KARTI ────────────────────────────────────── */}
                    <motion.div {...fadeUp(0.16)} className={`${card} rounded-[24px] border shadow-[0_2px_24px_#00000008] p-5 sm:p-8`}>
                        <h3 className={`text-base font-bold mb-1 ${titleColor}`}>{t('settings.appearanceTitle')}</h3>
                        <p className={`text-xs mb-5 ${subColor}`}>{t('settings.appearanceSub')}</p>

                        <SettingRow icon="🎨" title={t('settings.themeRow')} description={t('settings.themeDesc')}>
                            <div className="flex gap-2 flex-wrap">
                                {themeOptions.map(opt => (
                                    <button key={opt.value}
                                        onClick={() => handleThemeChange(opt.value)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${theme === opt.value
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.35)]'
                                                : isDark
                                                    ? 'border-white/10 text-white/60 hover:border-white/20 hover:bg-white/5'
                                                    : 'border-black/10 text-black/60 hover:border-indigo-300 hover:bg-indigo-50'
                                            }`}>
                                        <span>{opt.icon}</span>
                                        <span>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </SettingRow>

                        <SettingRow icon="🌐" title={t('settings.langTitle')} description={t('settings.langDesc')}>
                            <div className="flex gap-2">
                                {langOptions.map(opt => (
                                    <button
                                        key={opt.code}
                                        onClick={() => handleLangChange(opt.code)}
                                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                                            lang === opt.code
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.35)]'
                                                : isDark
                                                    ? 'border-white/8 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/8'
                                                    : 'border-black/8 bg-[#fafafa] text-black/60 hover:border-indigo-300 hover:bg-indigo-50'
                                        }`}
                                    >
                                        <span>{opt.flag}</span>
                                        <span>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </SettingRow>
                    </motion.div>

                    {/* ── BİLDİRİM KARTI ───────────────────────────────────── */}
                    <motion.div {...fadeUp(0.2)} className={`${card} rounded-[24px] border shadow-[0_2px_24px_#00000008] p-5 sm:p-8`}>
                        <h3 className={`text-base font-bold mb-1 ${titleColor}`}>{t('settings.notifTitle')}</h3>
                        <p className={`text-xs mb-5 ${subColor}`}>{t('settings.notifSub')}</p>

                        <SettingRow icon="📊" title={t('settings.weeklyReport')} description={t('settings.weeklyReportDesc')}>
                            <Toggle checked={notifications.weeklyReport} onChange={() => { setNotifications({ weeklyReport: !notifications.weeklyReport }); toast(t('settings.prefUpdated')); }} />
                        </SettingRow>

                        <SettingRow icon="⏰" title={t('settings.inactiveAlert')} description={t('settings.inactiveAlertDesc')}>
                            <Toggle checked={notifications.reminderInactive} onChange={() => { setNotifications({ reminderInactive: !notifications.reminderInactive }); toast(t('settings.prefUpdated')); }} />
                        </SettingRow>

                        <SettingRow icon="🔔" title={t('settings.browserNotif')} description={t('settings.browserNotifDesc')}>
                            {typeof Notification !== 'undefined' && Notification.permission === 'granted' ? (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">{t('settings.activeLabel')}</span>
                            ) : (
                                <button
                                    onClick={async () => {
                                        if (typeof Notification === 'undefined') {
                                            toast(t('settings.notifUnsupported'));
                                            return;
                                        }
                                        const perm = await Notification.requestPermission();
                                        toast(perm === 'granted' ? t('settings.notifGranted') : t('settings.notifDenied'));
                                    }}
                                    className={`whitespace-nowrap rounded-full border px-5 py-2 text-xs font-bold transition-all hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 ${isDark ? 'border-white/10 text-white/60' : 'border-black/10 text-black/70'}`}>
                                    {t('settings.allowNotif')}
                                </button>
                            )}
                        </SettingRow>
                    </motion.div>

                    {/* ── VERİ YÖNETİMİ ────────────────────────────────────── */}
                    <motion.div {...fadeUp(0.24)} className={`${card} rounded-[24px] border shadow-[0_2px_24px_#00000008] p-5 sm:p-8`}>
                        <h3 className={`text-base font-bold mb-1 ${titleColor}`}>{t('settings.dataTitle')}</h3>
                        <p className={`text-xs mb-5 ${subColor}`}>{t('settings.dataSub')}</p>

                        <SettingRow icon="📥" title={t('settings.exportTitle')} description={`${applications.length} ${t('settings.storageCount')} JSON`}>
                            <button onClick={handleExportJSON}
                                className={`whitespace-nowrap rounded-full border px-5 py-2 text-xs font-bold transition-all hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 ${isDark ? 'border-white/10 text-white/60' : 'border-black/10 text-black/70'}`}>
                                {t('settings.exportBtn')}
                            </button>
                        </SettingRow>

                        <SettingRow icon="📤" title={t('settings.importTitle')} description={t('settings.importDesc')}>
                            <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
                            <button onClick={handleImportJSON} disabled={importing}
                                className={`whitespace-nowrap rounded-full border px-5 py-2 text-xs font-bold transition-all hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 ${isDark ? 'border-white/10 text-white/60' : 'border-black/10 text-black/70'}`}>
                                {importing ? t('settings.importingBtn') : t('settings.importBtn')}
                            </button>
                        </SettingRow>

                        <SettingRow icon="📦" title={t('settings.storageTitle')} description={t('settings.storageDesc')}>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${isDark ? 'text-white/70 bg-white/5' : 'text-black/60 bg-black/5'}`}>
                                {applications.length} {t('settings.storageCount')}
                            </span>
                        </SettingRow>
                    </motion.div>

                    {/* ── GERİ BİLDİRİM ─────────────────────────────────── */}
                    <motion.div {...fadeUp(0.26)} className={`${card} rounded-[24px] border shadow-[0_2px_24px_#00000008] p-5 sm:p-8`}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg, #f97316, #14b8a6)' }}>💬</div>
                            <div>
                                <h3 className={`text-base font-bold ${titleColor}`}>{t('settings.fbTitle')}</h3>
                                <p className={`text-xs ${subColor}`}>{t('settings.fbSub')}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="sm:w-44">
                                    <label htmlFor="fb-type" className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${subColor}`}>
                                        {t('settings.fbType')}
                                    </label>
                                    <div className="relative">
                                        <select id="fb-type" value={fbType} onChange={e => setFbType(e.target.value)}
                                            className={`w-full rounded-xl border px-4 py-3 text-sm font-medium focus:outline-none appearance-none ${isDark ? 'bg-white/5 border-white/8 text-white' : 'bg-[#fafafa] border-black/8 text-black'}`}>
                                            <option>Bug / Hata</option>
                                            <option>Öneri</option>
                                            <option>Diğer</option>
                                        </select>
                                        <div className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${subColor}`}>
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="fb-message" className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${subColor}`}>
                                        {t('settings.fbMessage')}
                                    </label>
                                    <textarea id="fb-message" value={fbMessage} onChange={e => setFbMessage(e.target.value)}
                                        rows={3} placeholder="Buraya yazın..."
                                        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium focus:outline-none resize-none ${isDark ? 'bg-white/5 border-white/8 text-white placeholder:text-white/60' : 'bg-[#fafafa] border-black/8 text-black placeholder:text-black/45'}`} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <p className={`text-xs ${subColor}`}>→ kutluhangul@windowslive.com</p>
                                <button onClick={handleFeedback} disabled={!fbMessage.trim() || fbSending || fbSent}
                                    className="rounded-full px-5 sm:px-6 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 whitespace-nowrap"
                                    style={{ background: fbSent ? '#22c55e' : 'linear-gradient(135deg, #f97316, #14b8a6)' }}>
                                    {fbSent ? '✓ Gönderildi!' : fbSending ? '...' : t('settings.fbSend')}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── TEHLİKE BÖLGESI ──────────────────────────────────── */}
                    <motion.div {...fadeUp(0.31)} className={`rounded-[24px] border p-5 sm:p-8 ${isDark ? 'bg-[#1c0a0a] border-rose-900/30 shadow-[0_2px_24px_rgba(244,63,94,0.04)]' : 'bg-white border-rose-100 shadow-[0_2px_24px_rgba(244,63,94,0.06)]'}`}>
                        <h3 className="text-base font-bold text-rose-600 mb-1">{t('settings.dangerTitle')}</h3>
                        <p className={`text-xs mb-5 ${isDark ? 'text-rose-400/70' : 'text-rose-400'}`}>{t('settings.dangerSub')}</p>

                        <AnimatePresence mode="wait">
                            {!showConfirm ? (
                                <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
                                    <div>
                                        <div className={`font-semibold text-sm ${titleColor}`}>{t('settings.wipeTitle')}</div>
                                        <div className={`text-xs mt-0.5 max-w-xs leading-relaxed ${subColor}`}>{t('settings.wipeDesc')}</div>
                                    </div>
                                    <button onClick={() => setShowConfirm(true)}
                                        className="whitespace-nowrap rounded-full border border-rose-200 bg-rose-50 px-5 sm:px-6 py-2.5 text-xs font-bold text-rose-600 transition-all hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-[0_4px_16px_rgba(244,63,94,0.3)]">
                                        {t('settings.wipeBtn')}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="confirm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${isDark ? 'bg-rose-900/20 border-rose-800/30' : 'bg-rose-50 border-rose-200/60'}`}>
                                    <div className="flex-1">
                                        <div className="font-bold text-rose-600 text-sm mb-1">{t('settings.wipeWarning')}</div>
                                        <div className={`text-xs ${isDark ? 'text-rose-400/70' : 'text-rose-600/70'}`}>{t('settings.wipeWarningDesc')}</div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <button onClick={handleWipeData} disabled={wiping}
                                            className="rounded-full bg-rose-600 px-5 sm:px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-rose-700 hover:shadow-[0_4px_16px_rgba(225,29,72,0.4)] disabled:opacity-50">
                                            {wiping ? t('settings.wiping') : t('settings.wipeConfirm')}
                                        </button>
                                        <button onClick={() => setShowConfirm(false)} disabled={wiping}
                                            className={`rounded-full border px-5 sm:px-6 py-2.5 text-xs font-bold transition-all ${isDark ? 'border-white/10 text-white/60 hover:bg-white/5' : 'border-black/10 text-black/60 hover:bg-black/5'} disabled:opacity-50`}>
                                            {t('action.cancel')}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                </div>

                {/* Toast */}
                <AnimatePresence>
                    {saved && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, y: 20, x: '-50%' }}
                            className={`fixed bottom-28 sm:bottom-32 left-1/2 z-50 rounded-full border shadow-2xl px-5 sm:px-6 py-3 text-sm font-semibold flex items-center gap-2 ${isDark ? 'bg-[#1c1c1e] border-white/10 text-white' : 'bg-white border-black/10 text-[#1d1d1f]'}`}
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            {saved}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default Settings;
