import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../lib/i18n';
import * as pdfjsLib from 'pdfjs-dist';

// Use bundled worker inline
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

// ── ATS Scoring ────────────────────────────────────────────────────
const ATS_KEYWORDS = [
    'experience', 'education', 'skills', 'summary', 'project', 'achievement',
    'responsible', 'developed', 'managed', 'led', 'created', 'built', 'designed',
    'implemented', 'javascript', 'typescript', 'react', 'python', 'sql',
    'deneyim', 'eğitim', 'beceri', 'özet', 'proje', 'başarı', 'geliştirdi',
    'yönetti', 'tasarladı', 'oluşturdu',
];

const ATS_MUST_SECTIONS = ['experience', 'education', 'skills', 'contact', 'deneyim', 'eğitim', 'beceri', 'iletişim'];

function computeATSScore(text: string): { score: number; breakdown: Record<string, number>; tips: string[] } {
    const lower = text.toLowerCase();
    const words = lower.split(/\s+/);
    const tips: string[] = [];

    const keywordScore = Math.min(30, ATS_KEYWORDS.filter(k => lower.includes(k)).length * 2);
    const sectionScore = Math.min(25, ATS_MUST_SECTIONS.filter(s => lower.includes(s)).length * 5);
    const lengthScore = words.length > 300 ? 20 : Math.round((words.length / 300) * 20);
    const emailScore = /\b[\w.-]+@[\w.-]+\.\w{2,}\b/.test(lower) ? 10 : 0;
    const phoneScore = /(\+?\d[\d\s\-().]{7,}\d)/.test(lower) ? 10 : 0;
    const linkScore = /(github|linkedin|portfolio|behance)/.test(lower) ? 5 : 0;

    if (!emailScore) tips.push('E-posta adresi eklemeyi unutmayın.');
    if (!phoneScore) tips.push('Telefon numarası eksik.');
    if (linkScore === 0) tips.push('GitHub veya LinkedIn profil linki ekleyin.');
    if (lengthScore < 15) tips.push('CV içeriği çok kısa — daha fazla deneyim/beceri ekleyin.');
    if (sectionScore < 15) tips.push('Experience, Education, Skills bölümleri net başlıklarla ayrılmalı.');
    if (keywordScore < 15) tips.push("Sektörünüze özgü anahtar kelimeler kullanın.");

    const total = keywordScore + sectionScore + lengthScore + emailScore + phoneScore + linkScore;
    return {
        score: Math.min(100, total),
        breakdown: { 'Anahtar Kelimeler': keywordScore, 'Bölümler': sectionScore, 'İçerik Uzunluğu': lengthScore, 'İletişim Bilgisi': emailScore + phoneScore, 'Profil Linkleri': linkScore },
        tips,
    };
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

async function askGemini(cvText: string, userQ: string, lang: string): Promise<string> {
    if (!GEMINI_API_KEY) return lang === 'tr'
        ? 'Gemini API anahtarı bulunamadı. .env.local dosyasına VITE_GEMINI_API_KEY ekleyin.'
        : 'Gemini API key not found. Add VITE_GEMINI_API_KEY to .env.local.';

    const systemPrompt = lang === 'tr'
        ? `Sen bir kariyer koçu ve CV uzmanısın. Kullanıcının CV'sini analiz et ve yardımcı ol. CV:\n\n${cvText.slice(0, 8000)}`
        : `You are a career coach and CV expert. Analyze the user's CV and help them. CV:\n\n${cvText.slice(0, 8000)}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt}\n\n${userQ}` }] }] }),
    });
    if (!res.ok) throw new Error('Gemini API error');
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Yanıt alınamadı.';
}

// ── CV Sections Parser ─────────────────────────────────────────────
function parseCVSections(text: string): Record<string, string> {
    const sectionHeaders = ['EXPERIENCE', 'EDUCATION', 'SKILLS', 'SUMMARY', 'CONTACT', 'PROJECTS', 'CERTIFICATIONS',
        'DENEYİM', 'EĞİTİM', 'BECERİLER', 'ÖZET', 'İLETİŞİM', 'PROJELER'];
    const sections: Record<string, string> = {};
    let currentSection = 'Genel';
    const lines = text.split('\n');

    for (const line of lines) {
        const trimmed = line.trim().toUpperCase();
        const isHeader = sectionHeaders.some(h => trimmed.includes(h) && trimmed.length < 40);
        if (isHeader) {
            currentSection = line.trim();
            sections[currentSection] = '';
        } else {
            sections[currentSection] = (sections[currentSection] || '') + '\n' + line;
        }
    }
    return sections;
}

// ── Score Ring ─────────────────────────────────────────────────────
const ScoreRing = ({ score }: { score: number }) => {
    const r = 52, c = 2 * Math.PI * r;
    const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
    return (
        <div className="relative flex items-center justify-center w-36 h-36">
            <svg viewBox="0 0 120 120" className="w-36 h-36 -rotate-90">
                <circle cx="60" cy="60" r={r} strokeWidth="10" stroke="rgba(0,0,0,0.06)" fill="none" />
                <circle cx="60" cy="60" r={r} strokeWidth="10" stroke={color} fill="none" strokeLinecap="round"
                    strokeDasharray={c} strokeDashoffset={c - (score / 100) * c}
                    style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
            </svg>
            <div className="absolute text-center">
                <div className="text-3xl font-black" style={{ color }}>{score}</div>
                <div className="text-xs font-bold text-black/50">/ 100</div>
            </div>
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────────────
const CVPage = () => {
    const { t, lang } = useLanguage();
    const [cvText, setCvText] = useState('');
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [sections, setSections] = useState<Record<string, string>>({});
    const [atsResult, setAtsResult] = useState<ReturnType<typeof computeATSScore> | null>(null);
    const [geminiMsg, setGeminiMsg] = useState('');
    const [geminiResponse, setGeminiResponse] = useState('');
    const [geminiLoading, setGeminiLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const processPDF = async (file: File) => {
        setLoading(true);
        setFileName(file.name);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            for (let p = 1; p <= pdf.numPages; p++) {
                const page = await pdf.getPage(p);
                const content = await page.getTextContent();
                fullText += content.items.map((i: unknown) => (i as { str?: string }).str ?? '').join(' ') + '\n';
            }
            setCvText(fullText);
            setSections(parseCVSections(fullText));
            setAtsResult(computeATSScore(fullText));
        } catch {
            setCvText(lang === 'tr' ? 'PDF okunamadı.' : 'Could not read PDF.');
        } finally {
            setLoading(false);
        }
    };

    const handleFile = (f: File) => {
        if (f.type === 'application/pdf') processPDF(f);
    };

    const handleGemini = async () => {
        if (!geminiMsg.trim() || !cvText) return;
        setGeminiLoading(true);
        try {
            const resp = await askGemini(cvText, geminiMsg, lang);
            setGeminiResponse(resp);
        } catch {
            setGeminiResponse(lang === 'tr' ? 'Hata oluştu. Tekrar deneyin.' : 'An error occurred. Please try again.');
        } finally {
            setGeminiLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#f8f8fa]">
            <div className="mx-auto max-w-[1000px] px-4 sm:px-6 pt-20 sm:pt-24 pb-32">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 sm:mb-10">
                    <p className="text-xs font-bold tracking-[0.18em] text-black/40 uppercase mb-2">CV</p>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] mb-2">{t('cv.title')}</h1>
                    <p className="text-sm text-black/50">{t('cv.subtitle')}</p>
                </motion.div>

                {/* Upload Zone */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                    onClick={() => fileRef.current?.click()}
                    className={`group cursor-pointer rounded-3xl border-2 border-dashed transition-all p-10 sm:p-16 text-center mb-6 ${dragOver ? 'border-orange-400 bg-orange-50/50' : 'border-black/10 bg-white hover:border-orange-300 hover:bg-orange-50/30'}`}
                >
                    <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                    {loading ? (
                        <div className="flex flex-col items-center gap-3">
                            <svg className="animate-spin h-8 w-8 text-orange-400" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <p className="text-sm font-medium text-black/50">{t('cv.analyzing')}</p>
                        </div>
                    ) : fileName ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl">✅</div>
                            <p className="text-sm font-bold text-[#1d1d1f]">{fileName}</p>
                            <p className="text-xs text-black/40">{lang === 'tr' ? 'Farklı dosya için tıklayın' : 'Click to change file'}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📄</div>
                            <p className="text-base font-semibold text-[#1d1d1f]">{t('cv.dropzone')}</p>
                            <p className="text-xs text-black/40">PDF • Maks. 10MB</p>
                        </div>
                    )}
                </motion.div>

                {/* Results */}
                <AnimatePresence>
                    {atsResult && (
                        <motion.div key="results" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                            className="flex flex-col gap-5">

                            {/* ATS Score */}
                            <div className="bg-white rounded-3xl border border-black/5 shadow-[0_2px_24px_#00000008] p-6 sm:p-8">
                                <h3 className="text-base font-bold text-[#1d1d1f] mb-6">{t('cv.atsScore')}</h3>
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                                    <ScoreRing score={atsResult.score} />
                                    <div className="flex-1 w-full">
                                        <div className="space-y-3 mb-5">
                                            {Object.entries(atsResult.breakdown).map(([k, v]) => (
                                                <div key={k}>
                                                    <div className="flex justify-between text-xs font-medium text-black/60 mb-1">
                                                        <span>{k}</span><span>{v}</span>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-black/5 overflow-hidden">
                                                        <motion.div className="h-full rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(v / 30) * 100}%` }}
                                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                                            style={{ background: 'linear-gradient(90deg, #f97316, #14b8a6)' }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {atsResult.tips.length > 0 && (
                                            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
                                                <p className="text-xs font-bold text-amber-700 mb-2">💡 {lang === 'tr' ? 'İyileştirme Önerileri' : 'Suggestions'}</p>
                                                <ul className="space-y-1">
                                                    {atsResult.tips.map((tip, i) => (
                                                        <li key={i} className="text-xs text-amber-600 flex items-start gap-2">
                                                            <span className="mt-0.5 flex-shrink-0">→</span>{tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* CV Sections */}
                            {Object.entries(sections).filter(([, v]) => v.trim().length > 10).length > 0 && (
                                <div className="bg-white rounded-3xl border border-black/5 shadow-[0_2px_24px_#00000008] p-6 sm:p-8">
                                    <h3 className="text-base font-bold text-[#1d1d1f] mb-5">{lang === 'tr' ? 'CV Bölümleri' : 'CV Sections'}</h3>
                                    <div className="space-y-4">
                                        {Object.entries(sections).filter(([, v]) => v.trim().length > 10).map(([section, content]) => (
                                            <details key={section} className="group rounded-2xl bg-[#fafafa] border border-black/5 overflow-hidden">
                                                <summary className="flex justify-between items-center px-5 py-4 cursor-pointer font-semibold text-sm text-[#1d1d1f] list-none">
                                                    {section || 'Genel'}
                                                    <svg className="w-4 h-4 text-black/40 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                                </summary>
                                                <pre className="px-5 pb-4 text-xs text-black/60 leading-relaxed whitespace-pre-wrap font-sans">{content.trim()}</pre>
                                            </details>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Ask Gemini */}
                            <div className="bg-white rounded-3xl border border-black/5 shadow-[0_2px_24px_#00000008] p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, #4285f4, #db4437, #f4b400, #0f9d58)' }}>
                                        <span className="text-white font-bold text-sm">G</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-[#1d1d1f]">{t('cv.askGemini')}</h3>
                                        <p className="text-xs text-black/40">{lang === 'tr' ? 'CV hakkında Gemini\'ye soru sorun' : 'Ask Gemini about your CV'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input type="text" value={geminiMsg} onChange={e => setGeminiMsg(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') handleGemini(); }}
                                        placeholder={t('cv.geminiPlaceholder')}
                                        className="flex-1 rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-300" />
                                    <button onClick={handleGemini} disabled={!geminiMsg.trim() || geminiLoading}
                                        className="w-full sm:w-auto rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                                        style={{ background: 'linear-gradient(135deg, #f97316, #14b8a6)' }}>
                                        {geminiLoading ? '...' : t('gemini.send')}
                                    </button>
                                </div>
                                <AnimatePresence>
                                    {geminiResponse && (
                                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="mt-4 rounded-2xl bg-[#fafafa] border border-black/5 p-5 text-sm text-black/75 leading-relaxed whitespace-pre-wrap">
                                            {geminiResponse}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CVPage;
