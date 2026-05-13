import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, Mail, Briefcase, Code2, Globe } from 'lucide-react';
import SpidermanIcon from '../Icons/spiderman.svg';
import { useLanguage } from '../../lib/i18n';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const BONE = '#faf9f6';
const BONE_MUTED = '#f0ede8';
const INK = '#1a1a1a';
const BORDER = 'rgba(26, 26, 26, 0.08)';
const FONT_SANS = '-apple-system, "SF Pro Display", "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
const FONT_MONO = '"SF Mono", "JetBrains Mono", "Fira Code", monospace';

const CONTENT = {
    tr: {
        heading: 'Hakkımda',
        paragraphs: [
            'Amazon\'da 2,5+ yıl Kıdemli Satış Ortağı Destek Uzmanı olarak yüksek performanslı, yapılandırılmış bir ortamda karmaşık vakalar, politika değerlendirmeleri ve çapraz ekip iş birlikleriyle çalıştıktan sonra 2024\'te yazılım geliştirmeye bilinçli bir geçiş yaptım.',
            'Kapsamlı bir Full Stack Development programıyla HTML, CSS, JavaScript, React ve Node.js\'te güçlü teknik temeller oluştururken kişisel ve ekip projelerinde duyarlı tasarım, temiz mimari ve ölçeklenebilir çözümlere odaklanarak aktif olarak çalışıyorum.',
            'ABD dahil çeşitli ülkelerde 8+ yıllık uluslararası profesyonel deneyimle güçlü analitik düşünce, problem çözme becerileri ve disiplinli çalışma anlayışı edindim. Kullanıcı odaklı, etkili dijital ürünler üretmeye odaklanıyorum.',
        ],
        highlights: [
            { Icon: Briefcase, label: 'Amazon — 2,5+ Yıl', desc: 'Kıdemli Satış Ortağı Destek Uzmanı' },
            { Icon: Code2, label: '2024\'ten İtibaren', desc: 'Full Stack geliştirici' },
            { Icon: Globe, label: '8+ Yıl Uluslararası', desc: 'ABD dahil çok uluslu deneyim' },
        ],
        strengths: ['Analitik Düşünme', 'Problem Çözme', 'Adaptasyon', 'Disiplinli Çalışma'],
        stackLabel: 'Teknoloji Yığını',
        strengthsLabel: 'Güçlü Yönler',
        contact: 'İletişim',
    },
    en: {
        heading: 'About Me',
        paragraphs: [
            'Full Stack Developer in transition with 2.5+ years of experience as a Senior Selling Partner Support Associate at Amazon, where I worked in a structured, high-performance environment handling complex cases, policy-based evaluations, and cross-functional collaboration.',
            'In 2024, I made a deliberate career shift into software development and began an intensive Full Stack Development program to build strong technical foundations in modern web technologies — HTML, CSS, JavaScript, React, and Node.js — focusing on responsive design, clean architecture, and scalable solutions.',
            'Backed by 8+ years of international professional experience, including hospitality and supervisory roles in the United States, I bring strong analytical thinking, problem-solving skills, adaptability, and a disciplined work ethic. I am focused on growing as a developer and contributing to impactful, user-centered digital products.',
        ],
        highlights: [
            { Icon: Briefcase, label: 'Amazon — 2.5+ Years', desc: 'Senior Selling Partner Support Associate' },
            { Icon: Code2, label: 'Since 2024', desc: 'Active Full Stack Developer' },
            { Icon: Globe, label: '8+ Years International', desc: 'Multi-national experience incl. USA' },
        ],
        strengths: ['Analytical Thinking', 'Problem Solving', 'Adaptability', 'Disciplined Work Ethic'],
        stackLabel: 'Tech Stack',
        strengthsLabel: 'Core Strengths',
        contact: 'Contact',
    },
};

const TagLine = ({ tag, text, delay = 0 }: { tag: string; text: string; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.5, ease: 'easeOut' }}
        style={{ fontFamily: FONT_MONO, fontSize: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}
    >
        <span style={{ color: '#0ea5e9', fontWeight: 500 }}>&lt;{tag}&gt;</span>
        <span style={{ color: INK, fontWeight: 500 }}>{text}</span>
        <span style={{ color: '#0ea5e9', fontWeight: 500 }}>&lt;/{tag}&gt;</span>
    </motion.div>
);

export const AboutModal = ({ isOpen, onClose }: Props) => {
    const { lang } = useLanguage();
    const c = CONTENT[lang as 'tr' | 'en'] ?? CONTENT.tr;

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed', inset: 0,
                            background: 'rgba(250, 249, 246, 0.65)',
                            backdropFilter: 'blur(18px)',
                            WebkitBackdropFilter: 'blur(18px)',
                            zIndex: 200,
                        }}
                    />

                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 201, pointerEvents: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '20px', fontFamily: FONT_SANS,
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 28, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.97 }}
                            transition={{ duration: 0.5, type: 'spring', bounce: 0, damping: 26, stiffness: 220 }}
                            style={{
                                pointerEvents: 'auto',
                                width: '100%',
                                maxWidth: '880px',
                                maxHeight: '92vh',
                                overflowY: 'auto',
                                background: BONE,
                                borderRadius: '32px',
                                boxShadow: '0 40px 100px -20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
                                border: '1px solid ' + BORDER,
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                            }}
                        >
                            {/* Close */}
                            <button
                                onClick={onClose}
                                style={{
                                    position: 'absolute', top: '20px', right: '20px', zIndex: 10,
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    background: BONE_MUTED, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: INK, border: 'none', cursor: 'pointer', transition: 'opacity 0.2s',
                                    opacity: 0.55,
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '0.55'}
                            >
                                <X size={17} strokeWidth={2} />
                            </button>

                            <div style={{ padding: '44px 48px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

                                {/* ── Header ── */}
                                <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.88 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.45 }}
                                        style={{
                                            width: '88px', height: '88px', flexShrink: 0,
                                            borderRadius: '22px',
                                            background: '#fff',
                                            border: `1px solid ${BORDER}`,
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <img src={SpidermanIcon} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </motion.div>

                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                                <span style={{ opacity: 0.35, fontWeight: 500, fontFamily: FONT_MONO, fontSize: '16px' }}>#</span>
                                                <h2 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.03em', margin: 0, color: INK }}>
                                                    {c.heading}
                                                </h2>
                                            </div>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: INK }}>Kutluhan Gül</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: INK, opacity: 0.45, fontFamily: FONT_MONO }}>
                                                Full Stack Developer · {lang === 'tr' ? 'Kariyer Geçişinde' : 'In Transition'}
                                            </p>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* ── Bio paragraphs ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {c.paragraphs.map((p, i) => (
                                        <motion.p
                                            key={i}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
                                            style={{ margin: 0, fontSize: '14px', lineHeight: 1.75, color: INK, opacity: 0.78 }}
                                        >
                                            {p}
                                        </motion.p>
                                    ))}
                                </div>

                                {/* ── Career Highlights ── */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                                    {c.highlights.map(({ Icon, label, desc }, i) => (
                                        <motion.div
                                            key={label}
                                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.45 }}
                                            style={{
                                                background: '#fff',
                                                border: `1px solid ${BORDER}`,
                                                borderRadius: '16px',
                                                padding: '16px 20px',
                                                display: 'flex', alignItems: 'flex-start', gap: '12px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                            }}
                                        >
                                            <div style={{
                                                width: '34px', height: '34px', borderRadius: '10px',
                                                background: BONE_MUTED, flexShrink: 0,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Icon size={16} strokeWidth={2} style={{ color: INK, opacity: 0.6 }} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: 700, color: INK, marginBottom: '2px' }}>{label}</div>
                                                <div style={{ fontSize: '12px', color: INK, opacity: 0.5 }}>{desc}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* ── Tech Stack ── */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.45 }}
                                    style={{
                                        background: '#fff', border: `1px solid ${BORDER}`,
                                        borderRadius: '20px', padding: '22px',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
                                        {['#ff5f57', '#febc2e', '#28c840'].map(col => (
                                            <div key={col} style={{ width: '10px', height: '10px', borderRadius: '50%', background: col, opacity: 0.85 }} />
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                        <TagLine tag="stack" text="" delay={0.75} />
                                        <div style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '7px', borderLeft: `1px solid ${BONE_MUTED}`, margin: '2px 0 2px 10px' }}>
                                            <TagLine tag="frontend" text="React + Vite" delay={0.85} />
                                            <TagLine tag="language" text="TypeScript" delay={0.92} />
                                            <TagLine tag="backend" text="Firebase" delay={0.99} />
                                            <TagLine tag="database" text="Firestore" delay={1.06} />
                                            <TagLine tag="ui" text="Tailwind + Motion" delay={1.13} />
                                        </div>
                                        <TagLine tag="stack" text="" delay={1.2} />
                                    </div>
                                </motion.div>

                                {/* ── Social Links ── */}
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.5 }}
                                    style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingTop: '28px', borderTop: `1px solid ${BORDER}` }}
                                >
                                    {[
                                        { href: 'https://github.com/kutluhangil', icon: <Github size={16} />, label: 'GitHub', bg: INK, color: '#fff', shadow: 'rgba(26,26,26,0.2)' },
                                        { href: 'https://www.linkedin.com/in/kutluhangil/', icon: <Linkedin size={16} />, label: 'LinkedIn', bg: '#0A66C2', color: '#fff', shadow: 'rgba(10,102,194,0.25)' },
                                        { href: 'mailto:kutluhangul@windowslive.com', icon: <Mail size={16} />, label: c.contact, bg: '#fff', color: INK, shadow: 'rgba(0,0,0,0.05)', border: `1px solid ${BORDER}` },
                                    ].map(({ href, icon, label, bg, color, shadow, border }) => (
                                        <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                            <motion.div
                                                whileHover={{ y: -2, boxShadow: `0 12px 28px ${shadow}` }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    padding: '10px 20px', borderRadius: '100px',
                                                    background: bg, color, fontSize: '13px', fontWeight: 600,
                                                    boxShadow: `0 6px 20px ${shadow}`,
                                                    border: border ?? 'none',
                                                    transition: 'box-shadow 0.2s',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {icon}<span>{label}</span>
                                            </motion.div>
                                        </a>
                                    ))}
                                </motion.div>

                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
