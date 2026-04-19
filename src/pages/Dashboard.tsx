import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';
import { useDark } from '../hooks/useDark';


const statusColor: Record<string, string> = {
    'Süreçte': 'bg-blue-50 text-blue-700 border-blue-100',
    'Görüşme Bekleniyor': 'bg-amber-50 text-amber-700 border-amber-100',
    'Teklif Alındı': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Olumlu': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Olumsuz': 'bg-red-50 text-red-700 border-red-100',
    'İptal': 'bg-gray-50 text-gray-500 border-gray-100',
};

const Dashboard = () => {
    const user = useAppStore(state => state.user);
    const applications = useAppStore(state => state.applications);
    const logout = useAppStore(state => state.logout);
    const navigate = useNavigate();
    const isDark = useDark();

    const card = isDark ? 'bg-[#1c1c1e] border-white/5 text-white' : 'bg-white border-black/5 text-[#1d1d1f]';
    const rowHover = isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-[#fafafe]';
    const divider = isDark ? 'divide-white/5' : 'divide-black/5';
    const mutedText = isDark ? 'text-white/40' : 'text-black/40';
    const subText = isDark ? 'text-white/60' : 'text-black/60';
    const colHead = isDark ? 'text-white/30' : 'text-black/40';


    const total = applications.length;
    const inProgress = applications.filter(a => a.status === 'Süreçte' || a.status === 'Görüşme Bekleniyor').length;
    const offers = applications.filter(a => a.status === 'Teklif Alındı' || a.status === 'Olumlu').length;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthApps = applications.filter(a => {
        const d = new Date(a.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    const firstName = user?.name?.split(' ')[0] || 'Kullanıcı';

    const stats = [
        { label: 'Toplam Başvuru', value: total, color: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
        { label: 'Bu Ay', value: thisMonthApps, color: 'from-sky-400 to-cyan-600', bg: 'bg-sky-50', text: 'text-sky-600' },
        { label: 'Süreçte', value: inProgress, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600' },
        { label: 'Olumlu Sonuç', value: offers, color: 'from-emerald-400 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    ];

    return (
        <div className={`w-full min-h-screen ${isDark ? 'bg-[#0d0d0f]' : 'bg-[#f8f8fa]'}`}>
            <div className="mx-auto max-w-[1280px] px-6 pt-24 pb-32">

                {/* ── HEADER / GREETING BANNER ─────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="relative mb-10 w-full rounded-3xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #f97316 0%, #ec4899 30%, #14b8a6 60%, #6366f1 85%, #14b8a6 100%)',
                        backgroundSize: '300% 300%',
                        animation: 'gradientFlow 6s ease infinite',
                    }}
                >
                    {/* Glass overlay */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] pointer-events-none" />
                    {/* Decorative circles */}
                    <div className="absolute -right-12 -top-12 w-52 h-52 bg-white/8 rounded-full pointer-events-none" />
                    <div className="absolute right-24 -bottom-8 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-8 py-8">
                        <div>
                            <p className="text-xs font-bold tracking-[0.22em] text-white/60 uppercase mb-2">
                                {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-snug">
                                Merhaba, <span className="drop-shadow-lg">{firstName}</span> 👋
                            </h1>
                            <p className="mt-1.5 text-sm text-white/70 font-medium">
                                {total === 0
                                    ? 'İlk başvurunu eklemek için hazır mısın?'
                                    : `${total} başvuru takibinde · ${inProgress} aktif süreç`
                                }
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="self-start sm:self-auto flex-shrink-0 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/30 hover:shadow-[0_4px_16px_rgba(255,255,255,0.2)]"
                        >
                            Çıkış Yap
                        </button>
                    </div>
                    <style>{`
                        @keyframes gradientFlow {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                    `}</style>
                </motion.div>

                {/* ── STATS GRID ─────────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
                            className={`${card} rounded-3xl p-6 border shadow-[0_2px_16px_#00000008] hover:shadow-[0_8px_32px_#00000014] hover:-translate-y-0.5 transition-all`}
                        >
                            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-sm`}>
                                <span className="text-white font-bold text-lg">{s.value}</span>
                            </div>
                            <p className={`text-3xl font-bold ${s.text} mb-1`}>{s.value}</p>
                            <p className={`text-sm font-medium ${mutedText}`}>{s.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* ── DIVIDER ────────────────────────────────────────── */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent mb-10" />

                {/* ── SON HAREKETLER ─────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>Son Hareketler</h2>
                        <button
                            onClick={() => navigate('/applications')}
                            className="text-sm font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
                        >
                            Tümünü Gör →
                        </button>
                    </div>

                    {applications.length === 0 ? (
                        <div className={`flex flex-col items-center justify-center py-20 rounded-3xl border ${isDark ? 'bg-[#1c1c1e] border-white/5' : 'bg-white border-black/5'}`}>
                            <div className="text-5xl mb-4">📭</div>
                            <p className={`font-medium ${mutedText}`}>Henüz hiç başvuru eklemedin.</p>
                        </div>
                    ) : (
                        <div className={`${card} rounded-3xl border shadow-[0_2px_24px_#00000008] overflow-hidden`}>
                            {/* Table Header */}
                            <div className={`hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-[#fafafa]'}`}>
                                {['Firma / Pozisyon', 'Durum', 'Tarih', 'Platform', 'CV', 'Motivasyon', 'Test', 'İlan'].map(h => (
                                    <div key={h} className={`text-xs font-bold uppercase tracking-widest ${colHead}`}>{h}</div>
                                ))}
                            </div>

                            {/* Rows */}
                            <div className={`flex flex-col ${divider}`}>
                                {applications.slice(0, 5).map((app, i) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + i * 0.07, ease: 'easeOut' }}
                                        className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-5 ${rowHover} transition-colors cursor-pointer`}
                                    >
                                        <div className="flex flex-col min-w-0">
                                            <span className={`font-bold truncate ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>{app.companyName}</span>
                                            <span className={`text-sm truncate ${subText}`}>{app.position}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border whitespace-nowrap ${statusColor[app.status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <div className={`flex items-center text-sm ${subText}`}>
                                            {new Date(app.date).toLocaleDateString('tr-TR')}
                                        </div>
                                        <div className={`flex items-center text-sm ${subText}`}>{app.platform || '—'}</div>
                                        <div className={`flex items-center text-sm ${subText}`}>{app.cvVersion || '—'}</div>
                                        <div className={`flex items-center text-sm ${subText}`}>
                                            {app.motivation ? (
                                                <span className="text-emerald-600 font-semibold">✓ Eklendi</span>
                                            ) : <span className="text-black/30">—</span>}
                                        </div>
                                        <div className="flex items-center text-sm">
                                            {app.testLink ? (
                                                <a href={app.testLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold" onClick={e => e.stopPropagation()}>Var</a>
                                            ) : <span className="text-black/30">—</span>}
                                        </div>
                                        <div className="flex items-center">
                                            {app.jobLink ? (
                                                <a
                                                    href={app.jobLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={e => e.stopPropagation()}
                                                    className="whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 text-xs font-bold text-white hover:shadow-[0_4px_16px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 transition-all"
                                                >
                                                    İlanı Aç
                                                </a>
                                            ) : <span className="text-black/30">—</span>}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

            </div >
        </div >
    );
};

export default Dashboard;
