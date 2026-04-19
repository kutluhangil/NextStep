import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { AboutModal } from '../components/layout/AboutModal';
import { useLanguage } from '../lib/i18n';

// ── Word Cycler — reliable setInterval approach ───────────────
const CHARS = 'ABCDEFGHKLMNPRSTUVYZ0123456789#@!%&';
const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];

// Word lists outside component — stable references, never recreated
const TR_WORDS = ['Yönet.', 'Geliştir.', 'Düzenle.', 'Başlat.', 'Planla.', 'Takip Et.', 'Güçlendir.', 'Keşfet.', 'Hedefle.', 'İlerle.'];
const EN_WORDS = ['Career.', 'Future.', 'Journey.', 'Growth.', 'Success.', 'Goals.', 'Path.', 'Story.', 'Strategy.', 'Ambition.'];

function useWordCycler(words: string[]) {
    const [display, setDisplay] = useState(words[0]);
    const [opacity, setOpacity] = useState(1);
    const wordsRef = useRef(words);
    useEffect(() => {
        wordsRef.current = words;
    }, [words]);

    useEffect(() => {
        const SCRAMBLE_MS = 1800;  // 1.8s scramble
        const PAUSE_MS = 900;   // 0.9s hold
        const FADE_MS = 250;   // fade-out before switch
        const TICK_MS = 50;    // 20fps — smooth

        let wordIndex = 0;
        let phase: 'scramble' | 'pause' = 'scramble';
        let phaseStart = Date.now();
        let fading = false;

        const tick = () => {
            const now = Date.now();
            const elapsed = now - phaseStart;
            const target = wordsRef.current[wordIndex];

            if (phase === 'scramble') {
                // Fade in during first FADE_MS
                const fadeInProgress = Math.min(elapsed / FADE_MS, 1);
                if (elapsed < FADE_MS) setOpacity(fadeInProgress);
                else if (fading) { setOpacity(1); fading = false; }

                const progress = Math.min(elapsed / SCRAMBLE_MS, 1);
                const resolved = Math.floor(progress * target.length);
                setDisplay(
                    target.split('').map((ch, i) => {
                        if (ch === ' ') return '\u00a0'; // non-breaking space
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
                // Near end of pause: fade out
                if (elapsed >= PAUSE_MS - FADE_MS && !fading) {
                    fading = true;
                }
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

// ── Intersection-based reveal ───────────────────────────────────────
const useInView = (threshold = 0.15) => {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
};

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    const { ref, inView } = useInView();
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
            {children}
        </motion.div>
    );
};

// ── FeatureShowcase: interactive stacked window cards ─────────────
interface ShowcaseProps {
    bone2: string; border: string; ink: string; inkFaint: string; lang: string;
}

// ── Real-screenshot showcase ───────────────────────────────────────
const SCREENS = [
    { img: '/screen-dashboard.png', url: 'nextstep.app/dashboard', label: { tr: 'Anasayfa', en: 'Dashboard' }, desc: { tr: 'Anlık özet ve istatistikler', en: 'Live stats and overview' } },
    { img: '/screen-add.png', url: 'nextstep.app/add', label: { tr: 'Başvuru Ekle', en: 'Add Application' }, desc: { tr: 'Hızlı form ile başvuru kaydet', en: 'Log applications with a quick form' } },
    { img: '/screen-applications.png', url: 'nextstep.app/applications', label: { tr: 'Başvurular', en: 'Applications' }, desc: { tr: 'Tüm başvuruları listele ve dışa aktar', en: 'List, filter and export applications' } },
    { img: '/screen-cv.png', url: 'nextstep.app/cv', label: { tr: 'CV Analizi', en: 'CV Analysis' }, desc: { tr: 'ATS skoru ve Gemini önerileri', en: 'ATS scoring and Gemini suggestions' } },
    { img: '/screen-analytics.png', url: 'nextstep.app/analytics', label: { tr: 'Analiz', en: 'Analytics' }, desc: { tr: 'Platform ve durum istatistikleri', en: 'Platform and status analytics' } },
];

const FeatureShowcase = React.memo(({ bone2, border, ink, inkFaint, lang }: ShowcaseProps) => {
    const [active, setActive] = useState(0);
    const total = SCREENS.length;
    const next = () => setActive(p => (p + 1) % total);
    const prev = () => setActive(p => (p - 1 + total) % total);

    return (
        <div className="dash-enter w-full" style={{ maxWidth: 760, margin: '5rem auto 0' }}>
            {/* ── Card stack ── */}
            <div className="relative select-none" style={{ height: 480, perspective: '1200px' }}>
                {SCREENS.map((s, idx) => {
                    const offset = idx - active;
                    const absOffset = Math.abs(offset);
                    const isActive = offset === 0;

                    // Fan layout: cards spread to left/right of the active one
                    const tx = offset * 48;                            // horizontal spread
                    const ty = absOffset * 12;                         // depth sink
                    const rz = offset * 3;                             // slight fan rotation
                    const sc = isActive ? 1 : Math.max(0.82, 1 - absOffset * 0.07);
                    const op = isActive ? 1 : Math.max(0.35, 1 - absOffset * 0.22);
                    const zIdx = total - absOffset;

                    return (
                        <div key={s.url}
                            onClick={() => { if (!isActive) setActive(idx); else next(); }}
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: 0,
                                width: '100%',
                                maxWidth: 680,
                                transform: `translateX(calc(-50% + ${tx}px)) translateY(${ty}px) rotate(${rz}deg) scale(${sc})`,
                                opacity: op,
                                zIndex: zIdx,
                                cursor: isActive ? 'default' : 'pointer',
                                transition: 'transform 0.55s cubic-bezier(0.34,1.4,0.64,1), opacity 0.4s ease, box-shadow 0.3s ease',
                                transformOrigin: 'top center',
                                borderRadius: 20,
                                overflow: 'hidden',
                                boxShadow: isActive
                                    ? '0 40px 100px rgba(0,0,0,0.18), 0 0 0 1.5px rgba(249,115,22,0.35)'
                                    : '0 8px 32px rgba(0,0,0,0.08)',
                                border: isActive
                                    ? '1.5px solid rgba(249,115,22,0.25)'
                                    : `1px solid ${border}`,
                                background: '#fff',
                            }}>
                            {/* Browser chrome */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#f5f2ee', borderBottom: `1px solid ${border}` }}>
                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', opacity: 0.8, display: 'inline-block' }} />
                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', opacity: 0.8, display: 'inline-block' }} />
                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', opacity: 0.8, display: 'inline-block' }} />
                                <span style={{ marginLeft: 8, fontSize: 9, color: inkFaint, background: bone2, borderRadius: 6, padding: '2px 8px' }}>{s.url}</span>
                            </div>
                            {/* Real screenshot fills the card */}
                            <img
                                src={s.img}
                                alt={lang === 'tr' ? s.label.tr : s.label.en}
                                draggable={false}
                                style={{ width: '100%', display: 'block', userSelect: 'none', pointerEvents: 'none', maxHeight: 430, objectFit: 'cover', objectPosition: 'top' }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* ── Tab bar ── */}
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                {/* Pill tabs */}
                <div style={{ display: 'flex', gap: 8, background: bone2, borderRadius: 999, padding: '6px 8px', border: `1px solid ${border}` }}>
                    {SCREENS.map((s, i) => (
                        <button key={i} onClick={() => setActive(i)}
                            style={{
                                borderRadius: 999,
                                padding: '6px 18px',
                                fontSize: 12,
                                fontWeight: active === i ? 700 : 500,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.34,1.4,0.64,1)',
                                color: active === i ? '#fff' : inkFaint,
                                background: active === i
                                    ? 'linear-gradient(135deg, #f97316, #14b8a6)'
                                    : 'transparent',
                                boxShadow: active === i ? '0 4px 16px rgba(249,115,22,0.3)' : 'none',
                            }}>
                            {lang === 'tr' ? s.label.tr : s.label.en}
                        </button>
                    ))}
                </div>

                {/* Description */}
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 14, color: inkFaint, margin: 0 }}>
                        {lang === 'tr' ? SCREENS[active].desc.tr : SCREENS[active].desc.en}
                    </p>
                </div>

                {/* Prev / Next arrows */}
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={prev}
                        style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${border}`, background: '#fff', cursor: 'pointer', fontSize: 16, color: ink, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ←
                    </button>
                    <button onClick={next}
                        style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg,#f97316,#14b8a6)', cursor: 'pointer', fontSize: 16, color: '#fff', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        →
                    </button>
                </div>
            </div>
        </div>
    );
});
FeatureShowcase.displayName = 'FeatureShowcase';

// ── Main component ──────────────────────────────────────────────────

const LandingPage = () => {
    const [showAbout, setShowAbout] = useState(false);
    const navigate = useNavigate();
    const { t, lang } = useLanguage();
    const [activeStep, setActiveStep] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);

    // Cycling words — lists are defined outside component (stable references)
    const wordList = lang === 'tr' ? TR_WORDS : EN_WORDS;
    const { display: scrambledText, opacity: scrambleOpacity } = useWordCycler(wordList);
    const scrambleLine1 = lang === 'tr' ? 'Kariyerini' : 'Own Your';

    const steps = lang === 'tr'
        ? [
            { step: '01', title: 'Kayıt Ol', desc: 'Saniyeler içinde ücretsiz hesap oluşturun.' },
            { step: '02', title: 'Başvuru Ekle', desc: 'Firma, pozisyon, tarih ve platform bilgilerini girin.' },
            { step: '03', title: 'Takip Et', desc: 'Dashboard ile anlık durum ve analizleri görün.' },
            { step: '04', title: 'Geliş', desc: 'Verilerle hangi stratejinin işe yaradığını öğrenin.' },
        ]
        : [
            { step: '01', title: 'Sign Up', desc: 'Create a free account in seconds.' },
            { step: '02', title: 'Log Applications', desc: 'Enter company, role, date and platform.' },
            { step: '03', title: 'Track Progress', desc: 'See real-time status from your dashboard.' },
            { step: '04', title: 'Improve', desc: 'Use data to figure out what actually works.' },
        ];

    const feats = lang === 'tr'
        ? [
            { e: '📊', t: 'Akıllı Analiz', d: 'CV versiyonları, mülakat oranları ve platform başarısı tek ekranda.' },
            { e: '⚡', t: 'Sıfır Karmaşa', d: 'Excel tablolarına veda edin. Hızlı kayıt, tüm geçmişiniz bir arada.' },
            { e: '🎯', t: 'Motivasyon Takibi', d: 'Hangi yazıların işe yaradığını ölçün.' },
            { e: '📈', t: 'Platform Karşılaştırması', d: 'Hangi platform daha çok dönüş getiriyor?' },
            { e: '🔒', t: 'Gizlilik Önce', d: 'Verileriniz yalnızca sizin hesabınızda.' },
            { e: '📥', t: 'Dışa Aktarma', d: 'Excel ve PDF olarak tüm geçmişi indirin.' },
        ]
        : [
            { e: '📊', t: 'Smart Analytics', d: 'CV versions, interview rates, platform success in one view.' },
            { e: '⚡', t: 'Zero Chaos', d: 'Goodbye spreadsheets. Quick log, full history in one place.' },
            { e: '🎯', t: 'Motivation Tracking', d: 'Measure which cover letters actually work.' },
            { e: '📈', t: 'Platform Comparison', d: 'Which platform drives more responses?' },
            { e: '🔒', t: 'Privacy First', d: 'Data stored in your account only.' },
            { e: '📥', t: 'Export', d: 'Download full history as Excel or PDF.' },
        ];

    useEffect(() => {
        const t = setInterval(() => setActiveStep(s => (s + 1) % 4), 3000);
        return () => clearInterval(t);
    }, []);

    // ── Tokens ──────────────────────────────────────────────────────
    const bone = '#faf9f6';
    const bone2 = '#f0ede8';
    const border = '#e2ded8';
    const ink = '#1a1a1a';
    const inkMid = '#6b6560';
    const inkFaint = '#a8a39d';
    const accent = 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #14b8a6 100%)';

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden" style={{
            background: bone,
            color: ink,
            fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
        }}>
            <Navbar onAboutClick={() => setShowAbout(true)} />

            {/* ── HERO ──────────────────────────────────────────── */}
            <section ref={heroRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-5 overflow-hidden">
                {/* Subtle radial on bone */}
                <div className="pointer-events-none absolute inset-0"
                    style={{ background: `radial-gradient(ellipse 70% 50% at 50% 40%, rgba(249,115,22,0.06) 0%, transparent 70%)` }} />

                <div className="relative z-10 max-w-[960px] pt-32 pb-16 flex flex-col items-center">
                    {/* Badge */}
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-widest uppercase"
                        style={{ background: bone2, border: `1px solid ${border}`, color: inkMid }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#f97316' }} />
                        {t('landing.badge')}
                    </motion.div>

                    {/* Subtitle above */}
                    <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-sm sm:text-base font-semibold mb-4 tracking-wide"
                        style={{ color: inkMid }}>
                        {lang === 'tr' ? 'İş Başvuru Takip Platformu' : 'Job Application Tracker'}
                    </motion.p>

                    {/* Headline line 1 — static */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }}>
                        <h1 className="font-black tracking-[-0.04em] leading-[0.92]"
                            style={{ fontSize: 'clamp(52px, 10vw, 112px)', color: ink }}>
                            {scrambleLine1}
                        </h1>
                    </motion.div>

                    {/* Headline line 2 — scramble with fade */}
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
                                // 🔒 Prevent layout reflow: lock dimensions to widest word
                                whiteSpace: 'nowrap',
                                minWidth: '10ch',
                                opacity: scrambleOpacity,
                                transition: 'opacity 0.25s ease',
                            }}>
                            {scrambledText}
                        </div>
                    </motion.div>

                    {/* Sub */}
                    <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
                        className="max-w-lg text-base sm:text-lg leading-relaxed font-medium mb-10 sm:mb-14"
                        style={{ color: inkMid }}>
                        {t('landing.sub')}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
                        className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <button onClick={() => navigate('/login')}
                            className="w-full sm:w-auto rounded-full px-10 py-4 text-base font-bold text-white transition-all hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(249,115,22,0.3)]"
                            style={{ background: accent }}>
                            {t('landing.cta')}
                        </button>
                        <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto rounded-full px-10 py-4 text-base font-semibold transition-all hover:bg-black/5"
                            style={{ border: `1.5px solid ${border}`, color: inkMid }}>
                            {t('landing.howBtn')} ↓
                        </button>
                    </motion.div>

                    {/* ── INTERACTIVE FEATURE SHOWCASE ── */}
                    <FeatureShowcase bone2={bone2} border={border} ink={ink} inkFaint={inkFaint} lang={lang} />
                </div>
            </section>

            {/* ── STATS ─────────────────────────────────────────── */}
            <section style={{ background: bone2, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }} className="py-12 sm:py-16 px-5">
                <div className="mx-auto max-w-[1100px]">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12">
                        {[
                            { v: '∞', l: t('landing.statsUnlimited'), s: t('landing.statsUnlimitedSub') },
                            { v: '6', l: t('landing.statsWidgets'), s: t('landing.statsWidgetsSub') },
                            { v: '0', l: t('landing.statsServer'), s: t('landing.statsServerSub') },
                            { v: '%100', l: t('landing.statsFree'), s: t('landing.statsFreeSub') },
                        ].map((s, i) => (
                            <Reveal key={s.l} delay={i * 0.08}>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-black tracking-tighter mb-1" style={{
                                        background: accent,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}>{s.v}</div>
                                    <div className="text-sm font-bold" style={{ color: ink }}>{s.l}</div>
                                    <div className="text-xs mt-0.5" style={{ color: inkFaint }}>{s.s}</div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ──────────────────────────────────────── */}
            <section id="features" className="py-24 sm:py-32 px-5" style={{ background: bone }}>
                <div className="mx-auto max-w-[1100px]">
                    <Reveal>
                        <div className="text-center mb-16 sm:mb-20">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#f97316' }}>{t('landing.featuresLabel')}</p>
                            <h2 className="font-black tracking-[-0.03em] leading-tight mb-4" style={{ fontSize: 'clamp(28px,5vw,54px)', color: ink }}>
                                {t('landing.featuresTitle')}
                            </h2>
                            <p className="text-base max-w-xl mx-auto" style={{ color: inkMid }}>{t('landing.featuresSub')}</p>
                        </div>
                    </Reveal>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {feats.map((f, i) => (
                            <Reveal key={f.t} delay={i * 0.07}>
                                <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] cursor-default"
                                    style={{ background: '#fff', border: `1px solid ${border}` }}>
                                    <div className="text-3xl mb-4">{f.e}</div>
                                    <h3 className="text-base font-bold mb-2" style={{ color: ink }}>{f.t}</h3>
                                    <p className="text-sm leading-relaxed" style={{ color: inkMid }}>{f.d}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ──────────────────────────────────── */}
            <section id="how" style={{ background: bone2, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }} className="py-24 sm:py-32 px-5">
                <div className="mx-auto max-w-[1100px]">
                    <Reveal>
                        <div className="text-center mb-16 sm:mb-20">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#14b8a6' }}>{t('landing.howLabel')}</p>
                            <h2 className="font-black tracking-[-0.03em] leading-tight" style={{ fontSize: 'clamp(28px,5vw,54px)', color: ink }}>
                                {t('landing.howTitle')}
                            </h2>
                        </div>
                    </Reveal>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {steps.map((s, i) => (
                            <Reveal key={s.step} delay={i * 0.1}>
                                <motion.div animate={activeStep === i ? { scale: 1.04, y: -6 } : { scale: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full cursor-default transition-shadow"
                                    style={activeStep === i
                                        ? { background: accent as unknown as string, border: 'none', boxShadow: '0 12px 40px rgba(249,115,22,0.2)' }
                                        : { background: '#fff', border: `1px solid ${border}` }
                                    }>
                                    <div className="text-4xl font-black mb-4" style={{ color: activeStep === i ? 'rgba(255,255,255,0.22)' : border }}>{s.step}</div>
                                    <div className="text-base font-bold mb-2" style={{ color: activeStep === i ? '#fff' : ink }}>{s.title}</div>
                                    <p className="text-sm leading-relaxed" style={{ color: activeStep === i ? 'rgba(255,255,255,0.75)' : inkMid }}>{s.desc}</p>
                                </motion.div>
                            </Reveal>
                        ))}
                    </div>
                    <div className="flex justify-center gap-2 mt-10">
                        {steps.map((_, i) => (
                            <button key={i} onClick={() => setActiveStep(i)}
                                className="rounded-full transition-all"
                                style={{ width: activeStep === i ? 28 : 8, height: 8, background: activeStep === i ? '#f97316' : border }} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────────── */}
            <section className="px-4 sm:px-6 py-20 sm:py-28" style={{ background: bone }}>
                <div className="mx-auto max-w-[960px]">
                    <Reveal>
                        <div className="relative text-center rounded-[28px] sm:rounded-[40px] p-12 sm:p-20 overflow-hidden"
                            style={{ background: accent as unknown as string, boxShadow: '0 24px 80px rgba(249,115,22,0.2)' }}>
                            <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.08)' }} />
                            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.06)' }} />
                            <div className="relative z-10">
                                <h2 className="font-black leading-tight tracking-tight text-white mb-4" style={{ fontSize: 'clamp(24px,4vw,48px)' }}>
                                    {t('landing.ctaTitle')}
                                </h2>
                                <p className="mx-auto mb-10 max-w-md text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                    {t('landing.ctaSub')}
                                </p>
                                <button onClick={() => navigate('/login')}
                                    className="rounded-full bg-white px-12 py-4 text-base font-bold transition-all hover:scale-[1.05] hover:-translate-y-0.5"
                                    style={{ color: '#f97316' }}>
                                    {t('landing.ctaBtn')}
                                </button>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── FOOTER ────────────────────────────────────────── */}
            <footer style={{ borderTop: `1px solid ${border}`, background: bone2 }} className="py-8 sm:py-10 px-5">
                <div className="mx-auto max-w-[1100px] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: accent as unknown as string }}>
                            <span className="text-white font-bold text-xs">N</span>
                        </div>
                        <span className="font-bold tracking-tight" style={{ color: ink }}>NextStep</span>
                    </div>
                    <p className="text-xs" style={{ color: inkFaint }}>
                        {lang === 'tr' ? 'Kutluhan Gül tarafından iş başvurularını takip etmek için yapılmıştır.' : 'Built by Kutluhan Gül for smarter job tracking.'}
                    </p>
                    <p className="text-xs" style={{ color: inkFaint }}>© 2026 NextStep</p>
                </div>
            </footer>

            <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
        </div>
    );
};

export default LandingPage;
