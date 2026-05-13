import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { AboutModal } from '../components/layout/AboutModal';
import { useLanguage } from '../lib/i18n';

// ── Tokens ─────────────────────────────────────────────────────
const BONE = '#faf9f6';
const BONE2 = '#f0ede8';
const BORDER = '#e2ded8';
const INK = '#1a1a1a';
const INK_MID = '#6b6560';
const INK_FAINT = '#a8a39d';
const ACCENT = 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #14b8a6 100%)';
const VERSION = 'v2.1';

// ── Word Cycler (UNTOUCHED) ────────────────────────────────────
const CHARS = 'ABCDEFGHKLMNPRSTUVYZ0123456789#@!%&';
const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];

const TR_WORDS = ['Yönet.', 'Geliştir.', 'Düzenle.', 'Başlat.', 'Planla.', 'Takip Et.', 'Güçlendir.', 'Keşfet.', 'Hedefle.', 'İlerle.'];
const EN_WORDS = ['Career.', 'Future.', 'Journey.', 'Growth.', 'Success.', 'Goals.', 'Path.', 'Story.', 'Strategy.', 'Ambition.'];

function useWordCycler(words: string[]) {
    const [display, setDisplay] = useState(words[0]);
    const [opacity, setOpacity] = useState(1);
    const wordsRef = useRef(words);
    useEffect(() => { wordsRef.current = words; }, [words]);

    useEffect(() => {
        const SCRAMBLE_MS = 1800;
        const PAUSE_MS = 900;
        const FADE_MS = 250;
        const TICK_MS = 50;

        let wordIndex = 0;
        let phase: 'scramble' | 'pause' = 'scramble';
        let phaseStart = Date.now();
        let fading = false;

        const tick = () => {
            const now = Date.now();
            const elapsed = now - phaseStart;
            const target = wordsRef.current[wordIndex];

            if (phase === 'scramble') {
                const fadeInProgress = Math.min(elapsed / FADE_MS, 1);
                if (elapsed < FADE_MS) setOpacity(fadeInProgress);
                else if (fading) { setOpacity(1); fading = false; }

                const progress = Math.min(elapsed / SCRAMBLE_MS, 1);
                const resolved = Math.floor(progress * target.length);
                setDisplay(
                    target.split('').map((ch, i) => {
                        if (ch === ' ') return ' ';
                        if (i < resolved) return ch;
                        return rand();
                    }).join('')
                );
                if (elapsed >= SCRAMBLE_MS) {
                    setDisplay(target);
                    setOpacity(1);
                    phase = 'pause';
                    phaseStart = now;
                }
            } else {
                if (elapsed >= PAUSE_MS - FADE_MS && !fading) fading = true;
                if (fading) {
                    const fadeProgress = Math.min((elapsed - (PAUSE_MS - FADE_MS)) / FADE_MS, 1);
                    setOpacity(1 - fadeProgress);
                }
                if (elapsed >= PAUSE_MS) {
                    wordIndex = (wordIndex + 1) % wordsRef.current.length;
                    phase = 'scramble';
                    phaseStart = now;
                }
            }
        };

        const id = setInterval(tick, TICK_MS);
        return () => clearInterval(id);
    }, []);

    return { display, opacity };
}

// ── Animated count-up ──────────────────────────────────────────
function useCountUp(target: number, duration: number, start: boolean) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!start) return;
        let frame = 0;
        const t0 = Date.now();
        const tick = () => {
            const elapsed = Date.now() - t0;
            const p = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.floor(target * eased));
            if (p < 1) frame = requestAnimationFrame(tick);
            else setValue(target);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target, duration, start]);
    return value;
}

// ── Reveal hook ────────────────────────────────────────────────
const useInView = (threshold = 0.2) => {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
};

const Reveal = ({ children, delay = 0, y = 16 }: { children: React.ReactNode; delay?: number; y?: number }) => {
    const { ref, inView } = useInView();
    return (
        <motion.div ref={ref}
            initial={{ opacity: 0, y }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}>
            {children}
        </motion.div>
    );
};

// ── Screens data ──────────────────────────────────────────────
const SCREENS = [
    { img: '/screen-dashboard.png', label: { tr: 'Dashboard', en: 'Dashboard' }, desc: { tr: 'Anlık özet ve istatistikler.', en: 'Live stats and overview.' } },
    { img: '/screen-add.png', label: { tr: 'Başvuru Ekle', en: 'Add Application' }, desc: { tr: 'Hızlı kayıt formu.', en: 'Quick logging form.' } },
    { img: '/screen-applications.png', label: { tr: 'Başvurular', en: 'Applications' }, desc: { tr: 'Filtre, sıralama, dışa aktarma.', en: 'Filter, sort, export.' } },
    { img: '/screen-cv.png', label: { tr: 'CV', en: 'CV' }, desc: { tr: 'ATS skoru + Gemini önerileri.', en: 'ATS score + Gemini suggestions.' } },
    { img: '/screen-analytics.png', label: { tr: 'Analiz', en: 'Analytics' }, desc: { tr: 'Platform ve durum dağılımı.', en: 'Platform & status breakdown.' } },
];

// ── ProductPreview — compact side-by-side ─────────────────────
const ProductPreview = ({ lang }: { lang: string }) => {
    const [active, setActive] = useState(0);
    const [auto, setAuto] = useState(true);

    useEffect(() => {
        if (!auto) return;
        const id = setInterval(() => setActive(i => (i + 1) % SCREENS.length), 3800);
        return () => clearInterval(id);
    }, [auto]);

    return (
        <section className="relative py-14 sm:py-16 px-5">
            <div className="mx-auto max-w-[1180px]">
                <Reveal>
                    <div className="flex items-end justify-between gap-6 mb-7 flex-wrap">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.28em] mb-2" style={{ color: '#f97316' }}>
                                {lang === 'tr' ? 'Tek Ekrandan' : 'One Screen'}
                            </p>
                            <h2 className="font-black tracking-[-0.035em] leading-[1]"
                                style={{ fontSize: 'clamp(26px,3.5vw,40px)', color: INK }}>
                                {lang === 'tr' ? 'Her şey göz önünde.' : 'Everything in one view.'}
                            </h2>
                        </div>
                        <p className="text-sm max-w-[320px]" style={{ color: INK_MID }}>
                            {lang === 'tr'
                                ? 'Dashboard, başvurular, CV analizi ve istatistikler — tek arayüz.'
                                : 'Dashboard, applications, CV analysis and stats — one interface.'}
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
                    {/* Screen preview */}
                    <Reveal delay={0.05} y={24}>
                        <div className="relative rounded-2xl overflow-hidden"
                            style={{
                                border: `1px solid ${BORDER}`,
                                background: '#fff',
                                boxShadow: '0 24px 60px -20px rgba(0,0,0,0.15)',
                            }}>
                            <div className="flex items-center gap-1.5 px-3 py-2"
                                style={{ background: '#f5f2ee', borderBottom: `1px solid ${BORDER}` }}>
                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57', opacity: 0.85 }} />
                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e', opacity: 0.85 }} />
                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840', opacity: 0.85 }} />
                                <div className="ml-2 rounded text-[10px] font-mono px-2 py-0.5" style={{ background: BONE2, color: INK_FAINT }}>
                                    nextstep.app
                                </div>
                            </div>
                            <div className="relative" style={{ aspectRatio: '16 / 10', background: BONE }}>
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={active}
                                        src={SCREENS[active].img}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.45 }}
                                        className="absolute inset-0 w-full h-full"
                                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                                        draggable={false}
                                    />
                                </AnimatePresence>
                            </div>
                        </div>
                    </Reveal>

                    {/* Tabs as list */}
                    <Reveal delay={0.1} y={24}>
                        <div className="flex flex-col gap-2">
                            {SCREENS.map((s, i) => {
                                const isActive = active === i;
                                return (
                                    <button key={i} onClick={() => { setAuto(false); setActive(i); }}
                                        className="relative text-left rounded-xl px-4 py-3 transition-all group"
                                        style={{
                                            background: isActive ? '#fff' : 'transparent',
                                            border: `1px solid ${isActive ? '#f97316' : BORDER}`,
                                            boxShadow: isActive ? '0 8px 24px -8px rgba(249,115,22,0.25)' : 'none',
                                        }}>
                                        {/* Active progress bar */}
                                        {isActive && auto && (
                                            <motion.div
                                                key={`bar-${i}`}
                                                initial={{ width: '0%' }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 3.8, ease: 'linear' }}
                                                className="absolute bottom-0 left-0 h-0.5 rounded-b-xl"
                                                style={{ background: ACCENT }}
                                            />
                                        )}
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[13px] font-bold" style={{ color: isActive ? INK : INK_MID }}>
                                                {lang === 'tr' ? s.label.tr : s.label.en}
                                            </span>
                                            <span className="text-[10px] font-mono" style={{ color: INK_FAINT }}>
                                                0{i + 1}
                                            </span>
                                        </div>
                                        <p className="text-[12px] mt-0.5" style={{ color: INK_FAINT }}>
                                            {lang === 'tr' ? s.desc.tr : s.desc.en}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

// ── StatStrip — single compact row ────────────────────────────
const StatStrip = ({ lang }: { lang: string }) => {
    const { ref, inView } = useInView(0.4);
    const widgets = useCountUp(6, 1200, inView);
    const free = useCountUp(100, 1300, inView);
    const statuses = useCountUp(10, 1100, inView);

    const items = [
        { v: '∞', sub: lang === 'tr' ? 'Sınırsız başvuru' : 'Unlimited apps' },
        { v: widgets.toString(), sub: lang === 'tr' ? 'Analiz widgetı' : 'Analytics widgets' },
        { v: `%${free}`, sub: lang === 'tr' ? 'Ücretsiz' : 'Free' },
        { v: statuses.toString(), sub: lang === 'tr' ? 'Durum kategorisi' : 'Status types' },
    ];

    return (
        <section ref={ref as React.RefObject<HTMLDivElement>} className="px-5 py-10"
            style={{ background: BONE2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
            <div className="mx-auto max-w-[1100px]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                    {items.map((s, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 14 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center md:border-r md:last:border-r-0"
                            style={{ borderColor: BORDER }}>
                            <div className="font-black tracking-[-0.04em] leading-none mb-1.5"
                                style={{
                                    fontSize: 'clamp(28px,3.5vw,44px)',
                                    background: ACCENT,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>
                                {s.v}
                            </div>
                            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: INK_MID }}>
                                {s.sub}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── Features — uniform tight grid ─────────────────────────────
const Features = ({ lang, t }: { lang: string; t: (key: 'landing.featuresLabel' | 'landing.featuresTitle' | 'landing.featuresSub') => string }) => {
    const tr = [
        { e: '📊', h: 'Akıllı Analiz', s: 'CV versiyonları, mülakat oranları, platform başarısı.' },
        { e: '⚡', h: 'Sıfır Karmaşa', s: "Excel'e veda. Hızlı kayıt, tüm geçmiş tek yerde." },
        { e: '🤖', h: 'Gemini AI', s: 'PDF sürükle, ATS puanı + öneriler al.' },
        { e: '🎯', h: 'Motivasyon', s: 'Hangi yazılar işe yarıyor — kanıtlanmış.' },
        { e: '🔒', h: 'Gizlilik', s: 'Veriler yalnızca senin hesabında.' },
        { e: '📥', h: 'Dışa Aktarma', s: 'Excel · PDF · JSON istediğin format.' },
    ];
    const en = [
        { e: '📊', h: 'Smart Analytics', s: 'CV versions, interview rates, platform success.' },
        { e: '⚡', h: 'Zero Chaos', s: 'Goodbye spreadsheets. Quick log, history in one place.' },
        { e: '🤖', h: 'Gemini AI', s: 'Drop a PDF, get ATS score + suggestions.' },
        { e: '🎯', h: 'Motivation', s: 'Which cover letters work — proven.' },
        { e: '🔒', h: 'Privacy', s: 'Data stays in your account only.' },
        { e: '📥', h: 'Export', s: 'Excel · PDF · JSON, any format.' },
    ];
    const cards = lang === 'tr' ? tr : en;

    return (
        <section id="features" className="py-14 sm:py-16 px-5" style={{ background: BONE }}>
            <div className="mx-auto max-w-[1180px]">
                <Reveal>
                    <div className="flex items-end justify-between gap-6 mb-7 flex-wrap">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.28em] mb-2" style={{ color: '#f97316' }}>
                                {t('landing.featuresLabel')}
                            </p>
                            <h2 className="font-black tracking-[-0.035em] leading-[1]"
                                style={{ fontSize: 'clamp(26px,3.5vw,40px)', color: INK }}>
                                {t('landing.featuresTitle')}
                            </h2>
                        </div>
                        <p className="text-sm max-w-[320px]" style={{ color: INK_MID }}>
                            {t('landing.featuresSub')}
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cards.map((c, i) => (
                        <Reveal key={c.h} delay={i * 0.05} y={14}>
                            <motion.div
                                whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(0,0,0,0.07)' }}
                                transition={{ duration: 0.25 }}
                                className="h-full rounded-2xl p-5 group"
                                style={{ background: '#fff', border: `1px solid ${BORDER}` }}>
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 transition-transform group-hover:scale-110"
                                        style={{ background: BONE2, border: `1px solid ${BORDER}` }}>
                                        {c.e}
                                    </div>
                                    <h3 className="text-[14px] font-bold leading-tight pt-1.5" style={{ color: INK, letterSpacing: '-0.01em' }}>
                                        {c.h}
                                    </h3>
                                </div>
                                <p className="text-[12.5px] leading-relaxed" style={{ color: INK_MID }}>{c.s}</p>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── Steps — horizontal compact row ────────────────────────────
interface Step { step: string; title: string; desc: string }
const Steps = ({ steps, t }: { steps: Step[]; t: (key: 'landing.howLabel' | 'landing.howTitle') => string }) => {
    return (
        <section id="how" className="py-14 sm:py-16 px-5"
            style={{ background: BONE2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
            <div className="mx-auto max-w-[1180px]">
                <Reveal>
                    <div className="flex items-end justify-between gap-6 mb-7 flex-wrap">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.28em] mb-2" style={{ color: '#14b8a6' }}>
                                {t('landing.howLabel')}
                            </p>
                            <h2 className="font-black tracking-[-0.035em] leading-[1]"
                                style={{ fontSize: 'clamp(26px,3.5vw,40px)', color: INK }}>
                                {t('landing.howTitle')}
                            </h2>
                        </div>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {steps.map((s, i) => (
                        <Reveal key={s.step} delay={i * 0.06} y={14}>
                            <motion.div
                                whileHover={{ y: -3 }}
                                transition={{ duration: 0.25 }}
                                className="relative h-full rounded-2xl p-5"
                                style={{ background: '#fff', border: `1px solid ${BORDER}` }}>
                                <div className="flex items-baseline justify-between mb-3">
                                    <div className="text-2xl font-black" style={{
                                        background: ACCENT,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        letterSpacing: '-0.04em',
                                    }}>
                                        {s.step}
                                    </div>
                                    <div className="w-6 h-px" style={{ background: BORDER }} />
                                </div>
                                <h3 className="text-[14px] font-bold mb-1" style={{ color: INK, letterSpacing: '-0.01em' }}>{s.title}</h3>
                                <p className="text-[12.5px] leading-relaxed" style={{ color: INK_MID }}>{s.desc}</p>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── CTA — compact flowing gradient ────────────────────────────
const CTA = ({ lang, t, onClick }: { lang: string; t: (key: 'landing.ctaTitle' | 'landing.ctaSub' | 'landing.ctaBtn') => string; onClick: () => void }) => {
    return (
        <section className="relative px-6 py-16 sm:py-20 overflow-hidden text-center"
            style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ec4899 30%, #14b8a6 60%, #6366f1 85%, #14b8a6 100%)',
                backgroundSize: '300% 300%',
                animation: 'gradientFlow 8s ease infinite',
            }}>
            <div className="absolute inset-0 pointer-events-none bg-white/10 backdrop-blur-[1px]" />
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.05)' }} />

            <div className="relative z-10 mx-auto max-w-[560px]">
                <Reveal>
                    <p className="text-[10px] font-bold tracking-[0.28em] text-white/75 uppercase mb-3.5">
                        {lang === 'tr' ? '✨ HEMEN BAŞLA' : '✨ GET STARTED'}
                    </p>
                    <h2 className="font-black leading-[1.05] tracking-[-0.03em] text-white mb-4 drop-shadow-sm"
                        style={{ fontSize: 'clamp(26px,4vw,44px)' }}>
                        {t('landing.ctaTitle')}
                    </h2>
                    <p className="mx-auto mb-7 max-w-md text-[14px] sm:text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>
                        {t('landing.ctaSub')}
                    </p>
                    <button onClick={onClick}
                        className="rounded-full bg-white px-10 py-3 text-sm font-bold shadow-[0_12px_36px_rgba(0,0,0,0.18)] transition-all hover:scale-[1.05] hover:-translate-y-0.5 active:scale-[0.98]"
                        style={{ color: '#f97316' }}>
                        {t('landing.ctaBtn')} →
                    </button>
                </Reveal>
            </div>

            <style>{`
                @keyframes gradientFlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </section>
    );
};

// ── WhatsNew + version ────────────────────────────────────────
const WhatsNew = ({ lang }: { lang: string }) => {
    const items = lang === 'tr'
        ? [
            { tag: 'YENİ', title: 'Kanban Görünümü', desc: 'Başvuruları duruma göre grupla.' },
            { tag: 'YENİ', title: 'Google ile Giriş', desc: 'Tek tıkla Firebase üzerinden Google girişi.' },
            { tag: 'GELİŞTİRME', title: 'Akan Gradient CTA', desc: 'Dashboard greeting animasyonu Landing\'de.' },
        ]
        : [
            { tag: 'NEW', title: 'Kanban View', desc: 'Group applications by status.' },
            { tag: 'NEW', title: 'Sign in with Google', desc: 'One-click Google sign-in via Firebase.' },
            { tag: 'IMPROVED', title: 'Flowing-gradient CTA', desc: 'Dashboard greeting animation, now on Landing.' },
        ];

    return (
        <section className="py-12 sm:py-14 px-5" style={{ background: BONE }}>
            <div className="mx-auto max-w-[1100px]">
                <Reveal>
                    <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: INK_FAINT }}>
                                {lang === 'tr' ? 'Yenilikler' : "What's new"}
                            </span>
                            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.18em] uppercase"
                                style={{ background: '#fff', border: `1px solid ${BORDER}`, color: INK }}>
                                {VERSION}
                            </span>
                        </div>
                        <p className="text-xs" style={{ color: INK_FAINT }}>
                            {lang === 'tr' ? 'Son güncellemeler' : 'Latest updates'}
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {items.map((it, i) => (
                        <Reveal key={it.title} delay={i * 0.05} y={12}>
                            <motion.div
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.25 }}
                                className="rounded-xl p-4"
                                style={{ background: '#fff', border: `1px solid ${BORDER}` }}>
                                <span className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider mb-2"
                                    style={{ background: 'rgba(249,115,22,0.1)', color: '#c2410c' }}>
                                    {it.tag}
                                </span>
                                <h3 className="text-[13px] font-bold mb-0.5" style={{ color: INK, letterSpacing: '-0.01em' }}>{it.title}</h3>
                                <p className="text-[12px] leading-relaxed" style={{ color: INK_MID }}>{it.desc}</p>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── FooterCol helper ──────────────────────────────────────────
const FooterCol = ({ title, links }: { title: string; links: { label: string; href?: string; onClick?: () => void }[] }) => (
    <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: INK }}>{title}</p>
        <ul className="flex flex-col gap-2">
            {links.map((l, i) => (
                <li key={i}>
                    {l.onClick ? (
                        <button onClick={l.onClick} className="text-[12.5px] font-medium transition-colors hover:text-black"
                            style={{ color: INK_MID }}>
                            {l.label}
                        </button>
                    ) : (
                        <a href={l.href} target={l.href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                            className="text-[12.5px] font-medium transition-colors hover:text-black"
                            style={{ color: INK_MID }}>
                            {l.label}
                        </a>
                    )}
                </li>
            ))}
        </ul>
    </div>
);

// ── Main ──────────────────────────────────────────────────────
const LandingPage = () => {
    const [showAbout, setShowAbout] = useState(false);
    const navigate = useNavigate();
    const { t, lang } = useLanguage();
    const heroRef = useRef<HTMLDivElement>(null);

    const wordList = lang === 'tr' ? TR_WORDS : EN_WORDS;
    const { display: scrambledText, opacity: scrambleOpacity } = useWordCycler(wordList);
    const scrambleLine1 = lang === 'tr' ? 'Kariyerini' : 'Own Your';

    const steps: Step[] = lang === 'tr'
        ? [
            { step: '01', title: 'Kayıt Ol', desc: 'E-posta ya da Google ile saniyelerde hesap aç.' },
            { step: '02', title: 'Ekle', desc: 'Firma, pozisyon, tarih, platform — hızlı form.' },
            { step: '03', title: 'Takip Et', desc: 'Anlık durum + istatistikler dashboard\'da.' },
            { step: '04', title: 'Gelişim', desc: 'Veriyle stratejini öğren, CV\'ni AI ile düzelt.' },
        ]
        : [
            { step: '01', title: 'Sign Up', desc: 'Free account in seconds — email or Google.' },
            { step: '02', title: 'Log', desc: 'Company, role, date, platform — quick form.' },
            { step: '03', title: 'Track', desc: 'Live status + stats on dashboard.' },
            { step: '04', title: 'Improve', desc: 'Learn from data, polish CV with AI.' },
        ];

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden" style={{
            background: BONE,
            color: INK,
            fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
        }}>
            <Navbar onAboutClick={() => setShowAbout(true)} />

            {/* ────────────────────────────────────────────────── */}
            {/* HERO — UNTOUCHED                                  */}
            {/* ────────────────────────────────────────────────── */}
            <section ref={heroRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-5 overflow-hidden">
                <div className="pointer-events-none absolute inset-0"
                    style={{ background: `radial-gradient(ellipse 70% 50% at 50% 40%, rgba(249,115,22,0.06) 0%, transparent 70%)` }} />

                <div className="relative z-10 max-w-[960px] pt-32 pb-16 flex flex-col items-center">
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-widest uppercase"
                        style={{ background: BONE2, border: `1px solid ${BORDER}`, color: INK_MID }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#f97316' }} />
                        {t('landing.badge')}
                    </motion.div>

                    <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-sm sm:text-base font-semibold mb-4 tracking-wide"
                        style={{ color: INK_MID }}>
                        {lang === 'tr' ? 'İş Başvuru Takip Platformu' : 'Job Application Tracker'}
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }}>
                        <h1 className="font-black tracking-[-0.04em] leading-[0.92]"
                            style={{ fontSize: 'clamp(52px, 10vw, 112px)', color: INK }}>
                            {scrambleLine1}
                        </h1>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}>
                        <div
                            style={{
                                fontSize: 'clamp(52px, 10vw, 112px)',
                                fontWeight: 900,
                                letterSpacing: '-0.04em',
                                lineHeight: 0.92,
                                marginBottom: 'clamp(24px, 3vw, 32px)',
                                background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #14b8a6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                display: 'block',
                                whiteSpace: 'nowrap',
                                minWidth: '10ch',
                                opacity: scrambleOpacity,
                                transition: 'opacity 0.25s ease',
                            }}>
                            {scrambledText}
                        </div>
                    </motion.div>

                    <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
                        className="max-w-lg text-base sm:text-lg leading-relaxed font-medium mb-10 sm:mb-14"
                        style={{ color: INK_MID }}>
                        {t('landing.sub')}
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
                        className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <button onClick={() => navigate('/login')}
                            className="w-full sm:w-auto rounded-full px-10 py-4 text-base font-bold text-white transition-all hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(249,115,22,0.3)]"
                            style={{ background: ACCENT }}>
                            {t('landing.cta')}
                        </button>
                        <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto rounded-full px-10 py-4 text-base font-semibold transition-all hover:bg-black/5"
                            style={{ border: `1.5px solid ${BORDER}`, color: INK_MID }}>
                            {t('landing.howBtn')} ↓
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ── COMPACT SECTIONS ── */}
            <ProductPreview lang={lang} />
            <StatStrip lang={lang} />
            <Features lang={lang} t={t} />
            <Steps steps={steps} t={t} />
            <CTA lang={lang} t={t} onClick={() => navigate('/login')} />
            <WhatsNew lang={lang} />

            {/* ── FOOTER ── compact 4-col ── */}
            <footer style={{ borderTop: `1px solid ${BORDER}`, background: BONE2 }} className="pt-10 pb-6 px-5">
                <div className="mx-auto max-w-[1200px]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-2.5">
                                <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: ACCENT }}>
                                    <span className="text-white font-black text-xs">N</span>
                                </div>
                                <span className="font-black tracking-tight text-base" style={{ color: INK }}>NextStep</span>
                            </div>
                            <p className="text-[12.5px] leading-relaxed max-w-[240px]" style={{ color: INK_MID }}>
                                {lang === 'tr'
                                    ? 'Kariyer takibi için akıllı, premium dashboard.'
                                    : 'Smart, premium dashboard for career tracking.'}
                            </p>
                        </div>

                        <FooterCol title={lang === 'tr' ? 'Ürün' : 'Product'} links={[
                            { label: lang === 'tr' ? 'Özellikler' : 'Features', href: '#features' },
                            { label: lang === 'tr' ? 'Nasıl Çalışır' : 'How It Works', href: '#how' },
                            { label: lang === 'tr' ? 'Yenilikler' : "What's New", href: '#' },
                        ]} />

                        <FooterCol title={lang === 'tr' ? 'Geliştirici' : 'Developer'} links={[
                            { label: lang === 'tr' ? 'Hakkında' : 'About', onClick: () => setShowAbout(true) },
                            { label: 'GitHub', href: 'https://github.com/kutluhangil' },
                            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kutluhangil/' },
                        ]} />

                        <FooterCol title={lang === 'tr' ? 'Kaynak' : 'Resources'} links={[
                            { label: lang === 'tr' ? 'Giriş Yap' : 'Sign In', onClick: () => navigate('/login') },
                            { label: lang === 'tr' ? 'Kayıt Ol' : 'Sign Up', onClick: () => navigate('/register') },
                            { label: lang === 'tr' ? 'İletişim' : 'Contact', href: 'mailto:kutluhangul@windowslive.com' },
                        ]} />
                    </div>

                    <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2.5"
                        style={{ borderTop: `1px solid ${BORDER}` }}>
                        <p className="text-[11px]" style={{ color: INK_FAINT }}>
                            © 2026 NextStep · {lang === 'tr' ? 'Kutluhan Gül.' : 'by Kutluhan Gül.'}
                        </p>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold tracking-[0.18em] uppercase rounded-full px-2 py-0.5"
                                style={{ background: '#fff', border: `1px solid ${BORDER}`, color: INK_MID }}>
                                {VERSION}
                            </span>
                            <span className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider" style={{ color: INK_FAINT }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {lang === 'tr' ? 'Çalışıyor' : 'Operational'}
                            </span>
                        </div>
                    </div>
                </div>
            </footer>

            <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
        </div>
    );
};

export default LandingPage;
