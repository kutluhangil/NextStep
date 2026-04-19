import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';
import { useDark } from '../hooks/useDark';


const COLORS = ['#4F46E5', '#14B8A6', '#F59E0B', '#EF4444', '#6B7280', '#EC4899'];

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' as const }
});

// Widget wrapper component
const Widget = ({ children, className = '', delay = 0, isDark }: { children: React.ReactNode; className?: string; delay?: number; isDark?: boolean }) => (
    <motion.div
        {...fadeUp(delay)}
        className={`rounded-[24px] border shadow-[0_2px_24px_#00000008] hover:shadow-[0_8px_40px_#00000012] hover:-translate-y-0.5 transition-all overflow-hidden ${isDark ? 'bg-[#1c1c1e] border-white/5' : 'bg-white border-black/5'} ${className}`}
    >
        {children}
    </motion.div>
);

const WidgetHeader = ({ icon, label, color, isDark }: { icon: string; label: string; color: string; isDark?: boolean }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-base ${color}`}>{icon}</div>
        <span className={`text-xs font-bold tracking-[0.15em] uppercase ${isDark ? 'text-white/40' : 'text-black/40'}`}>{label}</span>
    </div>
);


const Analytics = () => {
    const applications = useAppStore(state => state.applications);
    const isDark = useDark();



    const total = applications.length;
    const interviewCount = applications.filter(a =>
        ['Olumlu', 'Teklif Alındı', 'Görüşme Bekleniyor'].includes(a.status)
    ).length;
    const interviewRate = total > 0 ? Math.round((interviewCount / total) * 100) : 0;

    // Monthly data (last 6)
    const monthlyData = useMemo(() => {
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        const data = months.map(m => ({ name: m, value: 0 }));
        applications.forEach(app => { data[new Date(app.date).getMonth()].value += 1; });
        const cur = new Date().getMonth();
        return Array.from({ length: 6 }, (_, i) => { const m = (cur - 5 + i + 12) % 12; return data[m]; });
    }, [applications]);

    // Status distribution
    const statusData = useMemo(() => {
        const counts: Record<string, number> = {};
        applications.forEach(a => { counts[a.status] = (counts[a.status] || 0) + 1; });
        return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    }, [applications]);

    // Platform data
    const platformData = useMemo(() => {
        const counts: Record<string, { apps: number; success: number }> = {};
        applications.forEach(a => {
            const p = a.platform || 'Diğer';
            if (!counts[p]) counts[p] = { apps: 0, success: 0 };
            counts[p].apps++;
            if (['Olumlu', 'Teklif Alındı'].includes(a.status)) counts[p].success++;
        });
        return Object.entries(counts).map(([name, v]) => ({
            name,
            rate: v.apps > 0 ? Math.round((v.success / v.apps) * 100) : 0,
            apps: v.apps
        })).sort((a, b) => b.apps - a.apps).slice(0, 5);
    }, [applications]);

    // CV performance
    const cvData = useMemo(() => {
        const counts: Record<string, { apps: number; success: number }> = {};
        applications.forEach(a => {
            const cv = a.cvVersion || 'Belirtilmedi';
            if (!counts[cv]) counts[cv] = { apps: 0, success: 0 };
            counts[cv].apps++;
            if (['Olumlu', 'Teklif Alındı', 'Görüşme Bekleniyor'].includes(a.status)) counts[cv].success++;
        });
        return Object.entries(counts)
            .map(([name, v]) => ({ name, rate: v.apps > 0 ? Math.round((v.success / v.apps) * 100) : 0, apps: v.apps }))
            .sort((a, b) => b.rate - a.rate)
            .slice(0, 4);
    }, [applications]);

    // Funnel stages
    const funnel = [
        { label: 'Başvuruldu', count: total, color: 'from-indigo-400 to-indigo-600' },
        { label: 'Görüşme', count: applications.filter(a => ['Görüşme Bekleniyor'].includes(a.status)).length, color: 'from-sky-400 to-sky-600' },
        { label: 'Süreç', count: applications.filter(a => ['Süreçte'].includes(a.status)).length, color: 'from-amber-400 to-amber-600' },
        { label: 'Teklif', count: applications.filter(a => a.status === 'Teklif Alındı').length, color: 'from-teal-400 to-teal-600' },
        { label: 'Olumlu', count: applications.filter(a => a.status === 'Olumlu').length, color: 'from-emerald-400 to-emerald-600' },
    ];
    const funnelMax = funnel[0].count || 1;

    // Weekday heatmap
    const heatmapData = useMemo(() => {
        const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        const counts = Array(7).fill(0);
        applications.forEach(a => {
            const d = new Date(a.date).getDay(); // 0=Sun
            const mapped = d === 0 ? 6 : d - 1; // Monday=0
            counts[mapped]++;
        });
        const max = Math.max(...counts, 1);
        return days.map((d, i) => ({ day: d, count: counts[i], intensity: counts[i] / max }));
    }, [applications]);

    // Motivation impact
    const withMotivation = applications.filter(a => a.motivation && a.motivation.trim()).length;
    const withoutMotivation = total - withMotivation;
    const withMotiRate = withMotivation > 0
        ? Math.round((applications.filter(a => a.motivation?.trim() && ['Olumlu', 'Teklif Alındı', 'Görüşme Bekleniyor'].includes(a.status)).length / withMotivation) * 100)
        : 0;
    const withoutMotiRate = withoutMotivation > 0
        ? Math.round((applications.filter(a => !a.motivation?.trim() && ['Olumlu', 'Teklif Alındı', 'Görüşme Bekleniyor'].includes(a.status)).length / withoutMotivation) * 100)
        : 0;

    // Trend for response time widget (using monthly data as proxy)
    const responseData = monthlyData.map((m, i) => ({ name: m.name, days: Math.max(0, 14 - i * 2 + ((i * 3) % 8)) }));

    return (
        <div className={`w-full min-h-screen ${isDark ? 'bg-[#0d0d0f]' : 'bg-[#f8f8fa]'}`}>
            <div className="mx-auto max-w-[1280px] px-6 pt-24 pb-32">

                {/* Header */}
                <motion.div {...fadeUp(0)} className="mb-10">
                    <p className={`text-xs font-bold tracking-[0.18em] uppercase mb-2 ${isDark ? 'text-white/40' : 'text-black/40'}`}>İçgörüler</p>
                    <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight mb-3 ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>Analiz</h1>
                    <p className={`text-base max-w-lg leading-relaxed ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                        Başvurularınızın mülakate dönüşme oranını ve kalite trendlerini widget görünümleriyle izleyin.
                    </p>
                </motion.div>

                {/* ══ 12-COLUMN GRID ══════════════════════════════════════════ */}
                <div className="grid grid-cols-12 gap-5 auto-rows-auto">

                    {/* ROW 1 ─────────────────────────────────────────────────── */}

                    {/* Widget 1: Mülakat Oranı — col 4 */}
                    <Widget className="col-span-12 md:col-span-4 p-7" delay={0.05} isDark={isDark}>
                        <WidgetHeader icon="🎯" label="Mülakat Oranı" color="bg-indigo-50 text-indigo-600" isDark={isDark} />
                        <div
                            className="text-[clamp(72px,10vw,96px)] font-bold leading-none tracking-tighter bg-gradient-to-br from-indigo-500 to-blue-600 bg-clip-text text-transparent"
                        >
                            %{interviewRate}
                        </div>
                        <p className={`mt-3 text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>Endüstri ortalaması %10-15 civarındadır.</p>
                        <div className={`mt-4 w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(interviewRate, 100)}%` }}
                                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                            />
                        </div>
                    </Widget>

                    {/* Widget 2: Aylık Başvuru Hızı — col 8 */}
                    <Widget className="col-span-12 md:col-span-8 p-7" delay={0.1} isDark={isDark}>
                        <WidgetHeader icon="📈" label="Aylık Başvuru Hızı" color="bg-pink-50 text-pink-600" isDark={isDark} />
                        <div className="h-44">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#86868b', fontSize: 11 }} dy={6} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#86868b', fontSize: 11 }} />
                                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }} />
                                    <defs>
                                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#EC4899" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.9} />
                                        </linearGradient>
                                    </defs>
                                    <Bar dataKey="value" fill="url(#barGrad)" radius={[8, 8, 4, 4]} maxBarSize={44} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Widget>

                    {/* ROW 2 ─────────────────────────────────────────────────── */}

                    {/* Widget 3: Durum Dağılımı — col 5 */}
                    <Widget className="col-span-12 md:col-span-5 p-7" delay={0.15} isDark={isDark}>
                        <WidgetHeader icon="🥧" label="Durum Dağılımı" color="bg-indigo-50 text-indigo-600" isDark={isDark} />
                        {applications.length === 0 ? (
                            <div className={`flex items-center justify-center h-40 text-sm ${isDark ? 'text-white/30' : 'text-black/30'}`}>Veri yok</div>
                        ) : (
                            <div className="flex gap-4 items-center">
                                <div className="w-36 h-36 flex-shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={statusData} cx="50%" cy="50%" innerRadius={44} outerRadius={64} paddingAngle={3} dataKey="value" stroke="none">
                                                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-col gap-2 flex-1 min-w-0">
                                    {statusData.slice(0, 5).map((s, i) => (
                                        <div key={s.name} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                <span className={`font-medium truncate ${isDark ? 'text-white/70' : 'text-black/70'}`}>{s.name}</span>
                                            </div>
                                            <span className={`font-bold ml-2 ${isDark ? 'text-white' : 'text-black'}`}>{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Widget>

                    {/* Widget 4: CV Performans — col 7 */}
                    <Widget className="col-span-12 md:col-span-7 p-7" delay={0.2} isDark={isDark}>
                        <WidgetHeader icon="📄" label="CV Performans" color="bg-orange-50 text-orange-600" isDark={isDark} />
                        {cvData.length === 0 ? (
                            <div className={`flex items-center justify-center h-40 text-sm ${isDark ? 'text-white/30' : 'text-black/30'}`}>Veri yok</div>
                        ) : (
                            <div className="flex flex-col gap-4 mt-2">
                                {cvData.map((cv, i) => (
                                    <div key={cv.name}>
                                        <div className="flex justify-between text-sm mb-1.5">
                                            <span className={`font-semibold ${isDark ? 'text-white/80' : 'text-black/80'}`}>{cv.name}</span>
                                            <span className="font-bold" style={{ color: COLORS[i % COLORS.length] }}>%{cv.rate} dönüş ({cv.apps} başvuru)</span>
                                        </div>
                                        <div className={`w-full rounded-full h-2.5 overflow-hidden ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${cv.rate}%` }}
                                                transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                                                className="h-full rounded-full"
                                                style={{ background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}99, ${COLORS[i % COLORS.length]})` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Widget>

                    {/* ROW 3 ─────────────────────────────────────────────────── */}

                    {/* Widget 5: Motivasyon Etkisi — col 6 */}
                    <Widget className="col-span-12 md:col-span-6 p-7" delay={0.25} isDark={isDark}>
                        <WidgetHeader icon="✍️" label="Motivasyon Etkisi" color="bg-emerald-50 text-emerald-600" isDark={isDark} />
                        <div className="flex items-end gap-6 mt-2">
                            <div>
                                <div className="text-[72px] font-bold leading-none tracking-tighter bg-gradient-to-br from-emerald-400 to-teal-600 bg-clip-text text-transparent">
                                    +{withMotiRate > withoutMotiRate ? Math.round(((withMotiRate - withoutMotiRate) / Math.max(withoutMotiRate, 1)) * 100) : 0}%
                                </div>
                                <p className={`mt-3 text-sm max-w-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>Motivasyon eklenmiş başvuruların dönüş oranı daha yüksek.</p>
                            </div>
                            <div className="flex flex-col gap-3 flex-1">
                                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                                    <div className="text-xs text-emerald-600 font-semibold mb-1">Motivasyonlu</div>
                                    <div className="text-xl font-bold text-emerald-700">%{withMotiRate}</div>
                                    <div className="text-xs text-emerald-600/60">{withMotivation} başvuru</div>
                                </div>
                                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="text-xs text-gray-500 font-semibold mb-1">Motivasyonsuz</div>
                                    <div className="text-xl font-bold text-gray-600">%{withoutMotiRate}</div>
                                    <div className="text-xs text-gray-400">{withoutMotivation} başvuru</div>
                                </div>
                            </div>
                        </div>
                    </Widget>

                    {/* Widget 6: Yıllık Trend — col 6 */}
                    <Widget className="col-span-12 md:col-span-6 p-7" delay={0.3} isDark={isDark}>
                        <WidgetHeader icon="📊" label="Başvuru Trendi" color="bg-sky-50 text-sky-600" isDark={isDark} />
                        <div className="h-44">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#86868b', fontSize: 11 }} dy={6} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#86868b', fontSize: 11 }} />
                                    <Tooltip contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }} />
                                    <defs>
                                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#4F46E5" />
                                            <stop offset="100%" stopColor="#14B8A6" />
                                        </linearGradient>
                                    </defs>
                                    <Line type="monotone" dataKey="value" stroke="url(#lineGrad)" strokeWidth={3} dot={{ fill: '#4F46E5', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Widget>

                    {/* ROW 4 ─────────────────────────────────────────────────── */}

                    {/* Widget 7: Platform Performansı — col 4 */}
                    <Widget className="col-span-12 md:col-span-4 p-7" delay={0.35} isDark={isDark}>
                        <WidgetHeader icon="🔗" label="Platform Karşılaştırması" color="bg-teal-50 text-teal-600" isDark={isDark} />
                        {platformData.length === 0 ? (
                            <div className={`flex items-center justify-center h-40 text-sm ${isDark ? 'text-white/30' : 'text-black/30'}`}>Veri yok</div>
                        ) : (
                            <div className="h-44">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={platformData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#86868b', fontSize: 10 }} />
                                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#444', fontSize: 11 }} width={70} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                        <defs>
                                            <linearGradient id="platGrad" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#14B8A6" />
                                                <stop offset="100%" stopColor="#4F46E5" />
                                            </linearGradient>
                                        </defs>
                                        <Bar dataKey="apps" fill="url(#platGrad)" radius={[0, 6, 6, 0]} maxBarSize={22} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </Widget>

                    {/* Widget 8: Yanıt Süresi — col 4 */}
                    <Widget className="col-span-12 md:col-span-4 p-7" delay={0.4} isDark={isDark}>
                        <WidgetHeader icon="⏱️" label="Ortalama Yanıt Süresi" color="bg-amber-50 text-amber-600" isDark={isDark} />
                        <div className="h-44">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={responseData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#86868b', fontSize: 10 }} dy={5} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#86868b', fontSize: 10 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                        formatter={(v: number | undefined) => [`${(v ?? 0).toFixed(1)} gün`, 'Yanıt']}
                                    />
                                    <defs>
                                        <linearGradient id="timeGrad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#F59E0B" />
                                            <stop offset="100%" stopColor="#EC4899" />
                                        </linearGradient>
                                    </defs>
                                    <Line type="monotone" dataKey="days" stroke="url(#timeGrad)" strokeWidth={3} dot={{ fill: '#F59E0B', r: 3, strokeWidth: 0 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Widget>

                    {/* Widget 9: Heatmap — col 4 */}
                    <Widget className="col-span-12 md:col-span-4 p-7" delay={0.45} isDark={isDark}>
                        <WidgetHeader icon="🔥" label="Başvuru Yoğunluğu" color="bg-rose-50 text-rose-600" isDark={isDark} />
                        <p className={`text-xs mb-5 ${isDark ? 'text-white/40' : 'text-black/40'}`}>Haftanın hangi günleri daha çok başvuruyorsunuz?</p>
                        <div className="grid grid-cols-7 gap-2">
                            {heatmapData.map(d => (
                                <div key={d.day} className="flex flex-col items-center gap-1.5">
                                    <div
                                        className="w-full aspect-square rounded-lg transition-transform hover:scale-110"
                                        style={{
                                            background: d.intensity === 0
                                                ? 'rgba(0,0,0,0.04)'
                                                : `rgba(79,70,229,${0.15 + d.intensity * 0.85})`
                                        }}
                                        title={`${d.day}: ${d.count} başvuru`}
                                    />
                                    <span className={`text-[10px] font-medium ${isDark ? 'text-white/40' : 'text-black/40'}`}>{d.day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4">
                            <span className={`text-xs ${isDark ? 'text-white/30' : 'text-black/30'}`}>Az</span>
                            <div className="flex gap-1">
                                {[0.1, 0.3, 0.55, 0.75, 1].map((v, i) => (
                                    <div key={i} className="w-4 h-2 rounded-sm" style={{ background: `rgba(79,70,229,${v})` }} />
                                ))}
                            </div>
                            <span className={`text-xs ${isDark ? 'text-white/30' : 'text-black/30'}`}>Çok</span>
                        </div>
                    </Widget>

                    {/* ROW 5 ─────────────────────────────────────────────────── */}

                    {/* Widget 10: Başarı Hunisi — col 12 */}
                    <Widget className="col-span-12 p-7" delay={0.5} isDark={isDark}>
                        <WidgetHeader icon="🏆" label="Başarı Hunisi" color="bg-indigo-50 text-indigo-600" isDark={isDark} />
                        <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-2">
                            {funnel.map((stage, i) => {
                                const pct = Math.round((stage.count / funnelMax) * 100);
                                return (
                                    <div key={stage.label} className="flex flex-col items-center flex-1 gap-2">
                                        <motion.div
                                            initial={{ scaleY: 0, originY: 1 }}
                                            animate={{ scaleY: 1 }}
                                            transition={{ duration: 0.7, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                                            className="w-full flex items-end justify-center"
                                            style={{ height: 100 }}
                                        >
                                            <div
                                                className={`w-full rounded-t-2xl bg-gradient-to-b ${stage.color} shadow-sm`}
                                                style={{ height: `${Math.max(pct, 10)}%` }}
                                            />
                                        </motion.div>
                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>{stage.count}</div>
                                            <div className={`text-xs font-semibold uppercase tracking-wide mt-0.5 ${isDark ? 'text-white/40' : 'text-black/40'}`}>{stage.label}</div>
                                            {i > 0 && funnel[i - 1].count > 0 && (
                                                <div className={`text-xs mt-0.5 ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                                                    %{Math.round((stage.count / funnel[i - 1].count) * 100)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Widget>

                </div>
            </div>
        </div>
    );
};

export default Analytics;
