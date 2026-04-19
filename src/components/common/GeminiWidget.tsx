import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useLanguage } from '../../lib/i18n';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

interface Message { role: 'user' | 'model'; text: string; }

async function sendToGemini(messages: Message[], lang: string, appCount: number): Promise<string> {
    if (!GEMINI_API_KEY) return lang === 'tr'
        ? '⚠️ Gemini API anahtarı bulunamadı. `.env.local` dosyasına VITE_GEMINI_API_KEY ekleyin.'
        : '⚠️ Gemini API key not found. Add VITE_GEMINI_API_KEY to .env.local.';

    const systemCtx = lang === 'tr'
        ? `Sen NextStep adlı iş başvuru takip uygulamasında çalışan kariyer koçu Gemini'sin. Kullanıcının şu an ${appCount} başvurusu var. Türkçe yanıt ver. Kısa ve net ol.`
        : `You are Gemini, a career coaching assistant in NextStep job tracking app. The user has ${appCount} job applications. Reply concisely in English.`;

    const contents = [
        { role: 'user', parts: [{ text: systemCtx }] },
        { role: 'model', parts: [{ text: lang === 'tr' ? 'Merhaba! Kariyer konusunda sana nasıl yardımcı olabilirim?' : 'Hi! How can I help you with your career today?' }] },
        ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
    ];

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? (lang === 'tr' ? 'Yanıt alınamadı.' : 'No response received.');
}

export function GeminiWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const applications = useAppStore(s => s.applications);
    const { lang, t } = useLanguage();
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, loading]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 300);
    }, [open]);

    const send = async () => {
        const text = input.trim();
        if (!text || loading) return;
        const newMessages: Message[] = [...messages, { role: 'user', text }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);
        try {
            const reply = await sendToGemini(newMessages, lang, applications.length);
            setMessages(m => [...m, { role: 'model', text: reply }]);
        } catch {
            setMessages(m => [...m, { role: 'model', text: lang === 'tr' ? '❌ Bir hata oluştu. Tekrar deneyin.' : '❌ An error occurred. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ── Floating Button ─────────────────────────────────── */}
            <motion.button
                onClick={() => setOpen(o => !o)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="fixed bottom-28 right-5 sm:bottom-8 sm:right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(99,102,241,0.35)] transition-all"
                style={{ background: open ? '#1d1d1f' : 'linear-gradient(135deg, #f97316, #ec4899, #14b8a6)' }}
                aria-label={t('gemini.title')}
            >
                <AnimatePresence mode="wait">
                    {open
                        ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="text-white text-xl font-bold">✕</motion.span>
                        : <motion.span key="gem" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="text-xl">✨</motion.span>
                    }
                </AnimatePresence>
            </motion.button>

            {/* ── Chat Panel ──────────────────────────────────────── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.95 }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                        className="fixed bottom-48 right-4 sm:bottom-24 sm:right-6 z-40 w-[min(380px,calc(100vw-2rem))] flex flex-col rounded-3xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] border border-black/5 overflow-hidden"
                        style={{ height: 'min(560px, 70dvh)' }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5" style={{ background: 'linear-gradient(135deg, #f97316, #ec4899, #14b8a6)', borderRadius: '24px 24px 0 0' }}>
                            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-sm font-bold text-white">G</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white">{t('gemini.title')}</p>
                                <p className="text-[10px] text-white/60">{lang === 'tr' ? 'Kariyer asistanın · Gemini 2.0' : 'Your career assistant · Gemini 2.0'}</p>
                            </div>
                            <button onClick={() => setMessages([])} className="text-[10px] text-white/60 hover:text-white/90 transition-colors">
                                {lang === 'tr' ? 'Sıfırla' : 'Clear'}
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                            {messages.length === 0 && (
                                <div className="text-center mt-8">
                                    <div className="text-4xl mb-3">✨</div>
                                    <p className="text-sm font-semibold text-black/70">
                                        {lang === 'tr' ? 'Merhaba! Nasıl yardımcı olabilirim?' : "Hi! How can I help you?"}
                                    </p>
                                    <p className="text-xs text-black/40 mt-1">
                                        {lang === 'tr' ? 'CV, mülakat, kariyer tavsiyeleri...' : 'CV tips, interview prep, career advice...'}
                                    </p>
                                    <div className="mt-5 flex flex-col gap-2">
                                        {(lang === 'tr'
                                            ? ['CV\'mi nasıl iyileştirebilirim?', 'Başvuru sürecime genel bak', 'Mülakat için nasıl hazırlanmalıyım?']
                                            : ['How can I improve my CV?', 'Review my application process', 'How should I prep for interviews?']
                                        ).map(q => (
                                            <button key={q} onClick={() => { setInput(q); setTimeout(send, 0); }}
                                                className="w-full text-left text-xs font-medium rounded-xl bg-black/4 px-4 py-2.5 text-black/60 hover:bg-black/8 transition-colors border border-black/5">
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user'
                                        ? 'text-white font-medium'
                                        : 'bg-black/4 text-black/80 font-normal'
                                        }`}
                                        style={m.role === 'user' ? { background: 'linear-gradient(135deg, #f97316, #14b8a6)' } : {}}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="rounded-2xl bg-black/4 px-4 py-3 flex items-center gap-1.5">
                                        {[0, 1, 2].map(i => (
                                            <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                                                className="w-1.5 h-1.5 rounded-full bg-black/30" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="px-4 py-3 border-t border-black/5 flex items-center gap-2">
                            <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') send(); }}
                                placeholder={t('gemini.placeholder')}
                                className="flex-1 min-w-0 rounded-xl border border-black/8 bg-[#fafafa] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-300" />
                            <button onClick={send} disabled={!input.trim() || loading}
                                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all hover:scale-105 disabled:opacity-40"
                                style={{ background: 'linear-gradient(135deg, #f97316, #14b8a6)' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
