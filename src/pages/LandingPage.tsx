import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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

// ── Word Cycler (untouched) ─────────────────────────────────────
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
                        if (ch === ' ') return ' ';
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

// ── Animated counter ──────────────────────────────────────────
function useCountUp(target: number, duration = 1400, start: boolean) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!start) return;
        let frame = 0;
        const startTime = Date.now();
        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(target * eased));
            if (progress < 1) frame = requestAnimationFrame(tick);
            else setValue(target);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target, duration, start]);
    return value;
}

// ── Intersection-based reveal ─────────────────────────────────
const useInView = (threshold = 0.15) => {
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

// ── Apple-style fade-up reveal ────────────────────────────────
const Reveal = ({ children, delay = 0, y = 32 }: { children: React.ReactNode; delay?: number; y?: number }) => {
    const { ref, inView } = useInView();
    return (
        <motion.div ref={ref}
            initial={{ opacity: 0, y }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}>
            {children}
        </motion.div>
    );
};

// ── Screens data ──────────────────────────────────────────────
const SCREENS = [
    { img: '/screen-dashboard.png', url: 'nextstep.app/dashboard', label: { tr: 'Anasayfa', en: 'Dashboard' }, desc: { tr: 'Anlık özet ve istatistikler', en: 'Live stats and overview' } },
    { img: '/screen-add.png', url: 'nextstep.app/add', label: { tr: 'Başvuru Ekle', en: 'Add Application' }, desc: { tr: 'Hızlı form ile başvuru kaydet', en: 'Log applications with a quick form' } },
    { img: '/screen-applications.png', url: 'nextstep.app/applications', label: { tr: 'Başvurular', en: 'Applications' }, desc: { tr: 'Filtrele, sırala, Excel/PDF dışa aktar', en: 'Filter, sort, export to Excel/PDF' } },
    { img: '/screen-cv.png', url: 'nextstep.app/cv', label: { tr: 'CV Analizi', en: 'CV Analysis' }, desc: { tr: 'ATS skoru ve Gemini önerileri', en: 'ATS scoring and Gemini suggestions' } },
    { img: '/screen-analytics.png', url: 'nextstep.app/analytics', label: { tr: 'Analiz', en: 'Analytics' }, desc: { tr: 'Platform ve durum istatistikleri', en: 'Platform and status analytics' } },
];

// ── ProductCanvas — big Apple-style preview ───────────────────
const ProductCanvas = ({ lang }: { lang: string }) => {
    const [active, setActive] = useState(0);
    const [auto, setAuto] = useState(true);
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
    const yParallax = useTransform(scrollYProgress, [0, 1], [40, -40]);

    useEffect(() => {
        if (!auto) return;
        const t = setInterval(() => setActive(i => (i + 1) % SCREENS.length), 4200);
        return () => clearInterval(t);
    }, [auto]);

    return (
        <section ref={sectionRef} className="relative py-24 sm:py-36 px-5 overflow-hidden">
            <div className="pointer-events-none absolute inset-0" style={{
                background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(249,115,22,0.05) 0%, transparent 60%)'
            }} />

            <div className="relative mx-auto max-w-[1180px]">
                <Reveal>
                    <div className="text-center mb-14 sm:mb-20">
                        <p className="text-[11px] font-bold uppercase tracking-[0.32em] mb-5" style={{ color: '#f97316' }}>
                            {lang === 'tr' ? 'Tek Ekrandan' : 'One Screen'}
                        </p>
                        <h2 className="font-black tracking-[-0.045em] leading-[0.98]" style={{
                            fontSize: 'clamp(40px,7vw,86px)', color: INK,
                        }}>
                            {lang === 'tr' ? 'Her şey,' : 'Everything,'}
                            <br />
                            <span style={{
                                background: ACCENT,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                {lang === 'tr' ? 'göz önünde.' : 'in one place.'}
                            </span>
                        </h2>
                    </div>
                </Reveal>

                <motion.div style={{ y: yParallax }}>
                    <Reveal delay={0.1} y={60}>
                        <div className="relative rounded-[28px] overflow-hidden"
                            style={{
                                border: `1px solid ${BORDER}`,
                                background: '#fff',
                                boxShadow: '0 50px 140px -30px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.03)',
                            }}>
                            {/* Browser chrome */}
                            <div className="flex items-center gap-1.5 px-5 py-3.5"
                                style={{ background: '#f5f2ee', borderBottom: `1px solid ${BORDER}` }}>
                                <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57', opacity: 0.85 }} />
                                <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e', opacity: 0.85 }} />
                                <span className="w-3 h-3 rounded-full" style={{ background: '#28c840', opacity: 0.85 }} />
                                <div className="ml-4 rounded-md px-3 py-1 text-[11px] font-mono"
                                    style={{ background: BONE2, color: INK_FAINT }}>
                                    {SCREENS[active].url}
                                </div>
                            </div>

                            {/* Screen with crossfade */}
                            <div className="relative" style={{ aspectRatio: '16 / 9.6', background: BONE }}>
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={active}
                                        src={SCREENS[active].img}
                                        alt={lang === 'tr' ? SCREENS[active].label.tr : SCREENS[active].label.en}
                                        initial={{ opacity: 0, scale: 1.04 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                                        className="absolute inset-0 w-full h-full"
                                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                                        draggable={false}
                                    />
                                </AnimatePresence>
                            </div>
                        </div>
                    </Reveal>
                </motion.div>

                {/* Tab dock + description */}
                <Reveal delay={0.2}>
                    <div className="mt-10 flex flex-col items-center gap-5">
                        <div className="rounded-full p-1.5 flex flex-wrap justify-center gap-1"
                            style={{ background: '#fff', border: `1px solid ${BORDER}`, boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                            {SCREENS.map((s, i) => (
                                <button key={i} onClick={() => { setAuto(false); setActive(i); }}
                                    className="rounded-full px-4 sm:px-5 py-2 text-xs font-bold transition-all whitespace-nowrap"
                                    style={{
                                        background: active === i ? ACCENT : 'transparent',
                                        color: active === i ? '#fff' : INK_MID,
                                        boxShadow: active === i ? '0 6px 16px rgba(249,115,22,0.28)' : 'none',
                                    }}>
                                    {lang === 'tr' ? s.label.tr : s.label.en}
                                </button>
                            ))}
                        </div>
                        <motion.p
                            key={active}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-sm font-medium"
                            style={{ color: INK_MID }}>
                            {lang === 'tr' ? SCREENS[active].desc.tr : SCREENS[active].desc.en}
                        </motion.p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

// ── StatBand — massive Apple-style numbers ────────────────────
const StatBand = ({ lang }: { lang: string }) => {
    const { ref, inView } = useInView(0.3);
    const widgets = useCountUp(6, 1500, inView);
    const free = useCountUp(100, 1600, inView);
    const statuses = useCountUp(10, 1500, inView);

    const items = [
        { v: '∞', sub: lang === 'tr' ? 'Sınırsız başvuru' : 'Unlimited apps' },
        { v: widgets.toString(), sub: lang === 'tr' ? 'Analiz widgetı' : 'Analytics widgets' },
        { v: `%${free}`, sub: lang === 'tr' ? 'Tamamen ücretsiz' : 'Completely free' },
        { v: statuses.toString(), sub: lang === 'tr' ? 'Durum kategorisi' : 'Status categories' },
    ];

    return (
        <section ref={ref as React.RefObject<HTMLDivElement>} className="relative py-24 sm:py-32 px-5"
            style={{ background: BONE2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
            <div className="mx-auto max-w-[1180px]">
                <Reveal>
                    <p className="text-center text-[11px] font-bold uppercase tracking-[0.32em] mb-14 sm:mb-20"
                        style={{ color: INK_FAINT }}>
                        {lang === 'tr' ? 'Sayılarla' : 'By the numbers'}
                    </p>
                </Reveal>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-4">
                    {items.map((s, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 36 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center">
                            <div className="font-black tracking-[-0.06em] leading-none mb-3"
                                style={{ fontSize: 'clamp(56px,9vw,128px)', color: INK }}>
                                {s.v}
                            </div>
                            <div className="text-sm sm:text-[15px] font-semibold" style={{ color: INK_MID }}>
                                {s.sub}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── BentoFeatures — Apple-style varied-size grid ──────────────
const BentoFeatures = ({ lang, t }: { lang: string; t: (key: 'landing.featuresLabel' | 'landing.featuresTitle' | 'landing.featuresSub') => string }) => {
    const trCards = [
        { e: '📊', h: 'Akıllı Analiz', s: 'CV versiyonları, mülakat oranları, platform başarısı tek görünümde.', span: 'md:col-span-2 md:row-span-2', tone: 'feature' },
        { e: '⚡', h: 'Sıfır Karmaşa', s: 'Excel\'e veda. Hızlı kayıt.', span: '', tone: 'compact' },
        { e: '🎯', h: 'Motivasyon', s: 'Hangi yazılar işe yarıyor?', span: '', tone: 'compact' },
        { e: '🤖', h: 'Gemini AI', s: 'Anlık CV puanlama ve kişiye özel öneriler. PDF\'ini sürükle, bırak.', span: 'md:col-span-2', tone: 'accent' },
        { e: '🔒', h: 'Gizlilik Önce', s: 'Veriler sadece senin hesabında.', span: '', tone: 'compact' },
        { e: '📥', h: 'Dışa Aktarma', s: 'Excel · PDF · JSON.', span: '', tone: 'compact' },
    ];
    const enCards = [
        { e: '📊', h: 'Smart Analytics', s: 'CV versions, interview rates, platform success — one view.', span: 'md:col-span-2 md:row-span-2', tone: 'feature' },
        { e: '⚡', h: 'Zero Chaos', s: 'Goodbye spreadsheets. Fast logging.', span: '', tone: 'compact' },
        { e: '🎯', h: 'Motivation', s: 'Which cover letters actually convert?', span: '', tone: 'compact' },
        { e: '🤖', h: 'Gemini AI', s: 'Live CV scoring and tailored suggestions. Drag, drop your PDF.', span: 'md:col-span-2', tone: 'accent' },
        { e: '🔒', h: 'Privacy First', s: 'Data stays in your account.', span: '', tone: 'compact' },
        { e: '📥', h: 'Export', s: 'Excel · PDF · JSON.', span: '', tone: 'compact' },
    ];
    const cards = lang === 'tr' ? trCards : enCards;

    return (
        <section className="py-24 sm:py-36 px-5" style={{ background: BONE }}>
            <div className="mx-auto max-w-[1200px]">
                <Reveal>
                    <div className="text-center mb-14 sm:mb-20 max-w-[760px] mx-auto">
                        <p className="text-[11px] font-bold uppercase tracking-[0.32em] mb-5" style={{ color: '#f97316' }}>
                            {t('landing.featuresLabel')}
                        </p>
                        <h2 className="font-black tracking-[-0.045em] leading-[0.98] mb-5"
                            style={{ fontSize: 'clamp(40px,7vw,86px)', color: INK }}>
                            {t('landing.featuresTitle')}
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed" style={{ color: INK_MID }}>
                            {t('landing.featuresSub')}
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[180px] sm:auto-rows-[200px]">
                    {cards.map((c, i) => (
                        <Reveal key={c.h} delay={i * 0.07}>
                            <BentoCard {...c} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

const BentoCard = ({ e, h, s, span, tone }: { e: string; h: string; s: string; span: string; tone: string }) => {
    const isAccent = tone === 'accent';
    const isFeature = tone === 'feature';
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`relative h-full rounded-[28px] overflow-hidden p-7 sm:p-8 flex flex-col justify-between ${span}`}
            style={{
                background: isAccent
                    ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
                    : isFeature
                        ? 'linear-gradient(135deg, #fff 0%, #faf5ef 100%)'
                        : '#fff',
                border: isAccent ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${BORDER}`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
            }}>
            {isAccent && (
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.35) 0%, transparent 70%)' }} />
            )}
            {isFeature && (
                <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)' }} />
            )}

            <div className="relative">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                    style={{
                        background: isAccent ? 'rgba(255,255,255,0.08)' : BONE2,
                        border: isAccent ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${BORDER}`,
                    }}>
                    {e}
                </div>
            </div>
            <div className="relative">
                <h3 className="font-bold tracking-tight mb-2"
                    style={{
                        fontSize: isFeature ? 'clamp(22px,3vw,32px)' : '17px',
                        color: isAccent ? '#fff' : INK,
                        letterSpacing: '-0.02em',
                    }}>
                    {h}
                </h3>
                <p className="leading-relaxed"
                    style={{
                        fontSize: isFeature ? '15px' : '13.5px',
                        color: isAccent ? 'rgba(255,255,255,0.6)' : INK_MID,
                    }}>
                    {s}
                </p>
            </div>
        </motion.div>
    );
};

// ── StepsTimeline — Apple-style vertical timeline ─────────────
interface Step { step: string; title: string; desc: string }
const StepsTimeline = ({ steps, t }: { steps: Step[]; t: (key: 'landing.howLabel' | 'landing.howTitle') => string }) => {
    return (
        <section id="how" className="py-24 sm:py-36 px-5"
            style={{ background: BONE2, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
            <div className="mx-auto max-w-[900px]">
                <Reveal>
                    <div className="text-center mb-16 sm:mb-24">
                        <p className="text-[11px] font-bold uppercase tracking-[0.32em] mb-5" style={{ color: '#14b8a6' }}>
                            {t('landing.howLabel')}
                        </p>
                        <h2 className="font-black tracking-[-0.045em] leading-[0.98]"
                            style={{ fontSize: 'clamp(40px,7vw,86px)', color: INK }}>
                            {t('landing.howTitle')}
                        </h2>
                    </div>
                </Reveal>

                <div className="relative">
                    {/* timeline line */}
                    <div className="absolute left-7 sm:left-9 top-3 bottom-3 w-px" style={{ background: BORDER }} />

                    {steps.map((s, i) => (
                        <Reveal key={s.step} delay={i * 0.12}>
                            <div className="relative pl-20 sm:pl-24 pb-10 sm:pb-12 last:pb-0 group">
                                <motion.div
                                    whileHover={{ scale: 1.08, rotate: -2 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute left-0 top-0 w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-2xl flex items-center justify-center text-base sm:text-xl font-black"
                                    style={{
                                        background: '#fff',
                                        border: `1px solid ${BORDER}`,
                                        color: INK,
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                    }}>
                                    {s.step}
                                </motion.div>
                                <div className="pt-1">
                                    <h3 className="font-bold tracking-tight mb-2"
                                        style={{ fontSize: 'clamp(22px,3vw,30px)', color: INK, letterSpacing: '-0.02em' }}>
                                        {s.title}
                                    </h3>
                                    <p className="text-base sm:text-[17px] leading-relaxed max-w-xl" style={{ color: INK_MID }}>
                                        {s.desc}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── WhatsNew + version ────────────────────────────────────────
const WhatsNew = ({ lang }: { lang: string }) => {
    const items = lang === 'tr'
        ? [
            { tag: 'YENİ', title: 'Kanban Görünümü', desc: 'Başvurularını sürükle-bırak yapmadan duruma göre grupla.' },
            { tag: 'YENİ', title: 'Google ile Giriş', desc: 'Tek tıkla Firebase üzerinden Google hesabıyla giriş.' },
            { tag: 'GELİŞTİRME', title: 'Akan Gradient CTA', desc: 'Dashboard greeting card animasyonu Landing\'e taşındı.' },
        ]
        : [
            { tag: 'NEW', title: 'Kanban View', desc: 'Group your applications by status without drag-and-drop.' },
            { tag: 'NEW', title: 'Sign in with Google', desc: 'One-click Google sign-in via Firebase.' },
            { tag: 'IMPROVED', title: 'Flowing-gradient CTA', desc: 'The dashboard greeting card animation, now on Landing.' },
        ];

    return (
        <section className="py-20 sm:py-28 px-5" style={{ background: BONE }}>
            <div className="mx-auto max-w-[1100px]">
                <Reveal>
                    <div className="flex flex-col items-center justify-center gap-3 mb-12 sm:mb-16">
                        <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.22em] uppercase"
                            style={{ background: '#fff', border: `1px solid ${BORDER}`, color: INK }}>
                            {VERSION}
                        </span>
                        <p className="text-[11px] font-bold uppercase tracking-[0.32em]" style={{ color: INK_FAINT }}>
                            {lang === 'tr' ? 'Yenilikler' : "What's new"}
                        </p>
                        <h2 className="font-black tracking-[-0.045em] leading-[0.98] text-center"
                            style={{ fontSize: 'clamp(32px,5vw,54px)', color: INK }}>
                            {lang === 'tr' ? 'Son güncellemeler.' : 'Latest updates.'}
                        </h2>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    {items.map((it, i) => (
                        <Reveal key={it.title} delay={i * 0.08}>
                            <motion.div
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.3 }}
                                className="rounded-2xl p-6 h-full"
                                style={{ background: '#fff', border: `1px solid ${BORDER}`, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                                <span className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider mb-3"
                                    style={{ background: 'rgba(249,115,22,0.1)', color: '#c2410c' }}>
                                    {it.tag}
                                </span>
                                <h3 className="text-[17px] font-bold tracking-tight mb-1.5" style={{ color: INK, letterSpacing: '-0.01em' }}>
                                    {it.title}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: INK_MID }}>{it.desc}</p>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

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
            { step: '01', title: 'Kayıt Ol', desc: 'Saniyeler içinde ücretsiz hesap oluştur. E-posta ya da Google ile giriş.' },
            { step: '02', title: 'Başvuru Ekle', desc: 'Firma, pozisyon, tarih ve platform bilgilerini hızlı formla gir.' },
            { step: '03', title: 'Takip Et', desc: 'Dashboard\'da anlık durum, istatistik ve son hareketleri tek bakışta gör.' },
            { step: '04', title: 'Gelişim', desc: 'Veriyle hangi stratejinin işe yaradığını öğren, CV\'ni AI ile geliştir.' },
        ]
        : [
            { step: '01', title: 'Sign Up', desc: 'Create a free account in seconds. Email or Google sign-in.' },
            { step: '02', title: 'Log Applications', desc: 'Enter company, role, date and platform via the quick form.' },
            { step: '03', title: 'Track Progress', desc: 'See real-time status, stats and recent activity from your dashboard.' },
            { step: '04', title: 'Improve', desc: 'Use data to find what actually works, polish your CV with AI.' },
        ];

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden" style={{
            background: BONE,
            color: INK,
            fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
        }}>
            <Navbar onAboutClick={() => setShowAbout(true)} />

            {/* ────────────────────────────────────────────────── */}
            {/* HERO — DO NOT TOUCH (per user request)            */}
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

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, y: [0, 8, 0] }}
                        transition={{ opacity: { delay: 1.2, duration: 0.6 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
                        className="mt-16 flex flex-col items-center gap-2"
                        style={{ color: INK_FAINT }}>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                            {lang === 'tr' ? 'Aşağı kaydır' : 'Scroll'}
                        </span>
                        <div className="w-px h-10" style={{ background: `linear-gradient(to bottom, ${INK_FAINT}, transparent)` }} />
                    </motion.div>
                </div>
            </section>

            {/* ── PRODUCT CANVAS ── */}
            <ProductCanvas lang={lang} />

            {/* ── STAT BAND ── */}
            <StatBand lang={lang} />

            {/* ── BENTO FEATURES ── */}
            <BentoFeatures lang={lang} t={t} />

            {/* ── STEPS TIMELINE ── */}
            <StepsTimeline steps={steps} t={t} />

            {/* ── CTA — Flowing gradient (dashboard greeting animation) ── */}
            <section className="relative px-6 py-24 sm:py-36 overflow-hidden text-center"
                style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ec4899 30%, #14b8a6 60%, #6366f1 85%, #14b8a6 100%)',
                    backgroundSize: '300% 300%',
                    animation: 'gradientFlow 8s ease infinite',
                }}>
                <div className="absolute inset-0 pointer-events-none bg-white/10 backdrop-blur-[1px]" />
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.03)' }} />

                <div className="relative z-10 mx-auto max-w-[720px]">
                    <Reveal>
                        <p className="text-[11px] font-bold tracking-[0.32em] text-white/75 uppercase mb-6">
                            {lang === 'tr' ? '✨ HEMEN BAŞLA' : '✨ GET STARTED'}
                        </p>
                        <h2 className="font-black leading-[0.98] tracking-[-0.045em] text-white mb-6 drop-shadow-sm"
                            style={{ fontSize: 'clamp(40px,7vw,86px)' }}>
                            {t('landing.ctaTitle')}
                        </h2>
                        <p className="mx-auto mb-12 max-w-md text-base sm:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>
                            {t('landing.ctaSub')}
                        </p>
                        <button onClick={() => navigate('/login')}
                            className="rounded-full bg-white px-14 py-4 text-base font-bold shadow-[0_16px_50px_rgba(0,0,0,0.22)] transition-all hover:scale-[1.06] hover:-translate-y-1 active:scale-[0.98]"
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

            {/* ── WHAT'S NEW + Version ── */}
            <WhatsNew lang={lang} />

            {/* ── FOOTER ── Apple-style multi-column ── */}
            <footer style={{ borderTop: `1px solid ${BORDER}`, background: BONE2 }} className="pt-14 pb-8 px-5">
                <div className="mx-auto max-w-[1200px]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: ACCENT }}>
                                    <span className="text-white font-black text-sm">N</span>
                                </div>
                                <span className="font-black tracking-tight text-lg" style={{ color: INK }}>NextStep</span>
                            </div>
                            <p className="text-sm leading-relaxed max-w-[240px]" style={{ color: INK_MID }}>
                                {lang === 'tr'
                                    ? 'Kariyer takibi için akıllı, premium dashboard.'
                                    : 'A smart, premium dashboard for career tracking.'}
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

                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
                        style={{ borderTop: `1px solid ${BORDER}` }}>
                        <p className="text-xs" style={{ color: INK_FAINT }}>
                            © 2026 NextStep · {lang === 'tr' ? 'Kutluhan Gül tarafından geliştirildi.' : 'Built by Kutluhan Gül.'}
                        </p>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold tracking-[0.22em] uppercase rounded-full px-2.5 py-1"
                                style={{ background: '#fff', border: `1px solid ${BORDER}`, color: INK_MID }}>
                                {VERSION}
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: INK_FAINT }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {lang === 'tr' ? 'Tüm sistemler çalışıyor' : 'All systems operational'}
                            </span>
                        </div>
                    </div>
                </div>
            </footer>

            <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
        </div>
    );
};

// ── FooterCol helper ──────────────────────────────────────────
const FooterCol = ({ title, links }: { title: string; links: { label: string; href?: string; onClick?: () => void }[] }) => (
    <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: INK }}>
            {title}
        </p>
        <ul className="flex flex-col gap-2.5">
            {links.map((l, i) => (
                <li key={i}>
                    {l.onClick ? (
                        <button onClick={l.onClick} className="text-sm font-medium transition-colors hover:text-black"
                            style={{ color: INK_MID }}>
                            {l.label}
                        </button>
                    ) : (
                        <a href={l.href} target={l.href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                            className="text-sm font-medium transition-colors hover:text-black"
                            style={{ color: INK_MID }}>
                            {l.label}
                        </a>
                    )}
                </li>
            ))}
        </ul>
    </div>
);

export default LandingPage;
