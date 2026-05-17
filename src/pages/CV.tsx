import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../lib/i18n';
import * as pdfjsLib from 'pdfjs-dist';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useAppStore } from '../store/useAppStore';
import { useDark } from '../hooks/useDark';
import { Trash2 } from 'lucide-react';

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
const ScoreRing = ({ score, isDark }: { score: number; isDark?: boolean }) => {
    const r = 52, c = 2 * Math.PI * r;
    const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
    return (
        <div className="relative flex items-center justify-center w-36 h-36">
            <svg viewBox="0 0 120 120" className="w-36 h-36 -rotate-90">
                <circle cx="60" cy="60" r={r} strokeWidth="10" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} fill="none" />
                <circle cx="60" cy="60" r={r} strokeWidth="10" stroke={color} fill="none" strokeLinecap="round"
                    strokeDasharray={c} strokeDashoffset={c - (score / 100) * c}
                    style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
            </svg>
            <div className="absolute text-center">
                <div className="text-3xl font-black" style={{ color }}>{score}</div>
                <div className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-black/55'}`}>/ 100</div>
            </div>
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────────────
const CVPage = () => {
    useDocumentTitle('CV Analizi');
    const { t, lang } = useLanguage();
    const cvAnalysis = useAppStore(s => s.cvAnalysis);
    const saveCVAnalysisAsync = useAppStore(s => s.saveCVAnalysisAsync);
    const deleteCVAnalysisAsync = useAppStore(s => s.deleteCVAnalysisAsync);
    const appendGeminiTurn = useAppStore(s => s.appendGeminiTurn);
    const setCVAnalysis = useAppStore(s => s.setCVAnalysis);
    const firebaseUid = useAppStore(s => s.firebaseUid);
    const isDark = useDark();

    const [loading, setLoading] = useState(false);
    const [geminiMsg, setGeminiMsg] = useState('');
    const [geminiLoading, setGeminiLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    // Derived values from persisted store
    const fileName = cvAnalysis?.fileName ?? '';
    const cvText = cvAnalysis?.cvText ?? '';
    const sections = cvAnalysis?.sections ?? {};
    const atsResult = cvAnalysis
        ? { score: cvAnalysis.atsScore, breakdown: cvAnalysis.atsBreakdown, tips: cvAnalysis.atsTips }
        : null;
    const geminiHistory = cvAnalysis?.geminiHistory ?? [];

    const processPDF = async (file: File) => {
        setLoading(true);
        setErrorMsg('');
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            for (let p = 1; p <= pdf.numPages; p++) {
                const page = await pdf.getPage(p);
                const content = await page.getTextContent();
                fullText += content.items.map((i: unknown) => (i as { str?: string }).str ?? '').join(' ') + '\n';
            }
            const parsedSections = parseCVSections(fullText);
            const ats = computeATSScore(fullText);
            // Persist to store (local) and Firestore (cloud) so it survives navigation AND re-login
            const cv = {
                fileName: file.name,
                cvText: fullText,
                sections: parsedSections,
                atsScore: ats.score,
                atsBreakdown: ats.breakdown,
                atsTips: ats.tips,
                geminiHistory: [] as { q: string; a: string }[],
                uploadedAt: Date.now(),
            };
            if (firebaseUid) {
                await saveCVAnalysisAsync(cv);
            } else {
                setCVAnalysis(cv);
            }
        } catch {
            setErrorMsg(lang === 'tr' ? 'PDF okunamadı. Lütfen farklı bir dosya deneyin.' : 'Could not read PDF. Please try a different file.');
        } finally {
            setLoading(false);
        }
    };

    const handleFile = (f: File) => {
        if (f.type !== 'application/pdf') {
            setErrorMsg(lang === 'tr' ? 'Yalnızca PDF dosyaları desteklenmektedir.' : 'Only PDF files are supported.');
            return;
        }
        if (f.size > 10 * 1024 * 1024) {
            setErrorMsg(lang === 'tr' ? 'Dosya 10MB sınırını aşıyor.' : 'File exceeds the 10MB limit.');
            return;
        }
        processPDF(f);
    };

    const handleClearCV = async () => {
        if (firebaseUid) {
            await deleteCVAnalysisAsync();
        } else {
            setCVAnalysis(null);
        }
        setGeminiMsg('');
        setErrorMsg('');
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleGemini = async () => {
        if (!geminiMsg.trim() || !cvText) return;
        const question = geminiMsg;
        setGeminiLoading(true);
        try {
            const resp = await askGemini(cvText, question, lang);
            appendGeminiTurn(question, resp);
            setGeminiMsg('');
        } catch {
            appendGeminiTurn(question, lang === 'tr' ? 'Hata oluştu. Tekrar deneyin.' : 'An error occurred. Please try again.');
        } finally {
            setGeminiLoading(false);
        }
    };

    // Theme-aware classes
    const cardCls = isDark ? 'bg-[#1c1c1e] border-white/5' : 'bg-white border-black/5';
    const sectionCls = isDark ? 'bg-white/[0.03] border-white/5' : 'bg-[#fafafa] border-black/5';
    const titleCls = isDark ? 'text-white' : 'text-[#1d1d1f]';
    const subCls = isDark ? 'text-white/70' : 'text-black/60';
    const mutedCls = isDark ? 'text-white/60' : 'text-black/55';
    const dropzoneCls = isDark
        ? 'border-white/15 bg-white/[0.03] hover:border-orange-400 hover:bg-orange-500/10'
        : 'border-black/10 bg-white hover:border-orange-300 hover:bg-orange-50/30';
    const dropzoneActiveCls = isDark ? 'border-orange-400 bg-orange-500/15' : 'border-orange-400 bg-orange-50/50';

    return (
        <div className={`w-full min-h-screen ${isDark ? 'bg-[#0d0d0f]' : 'bg-[#f8f8fa]'}`}>
            <div className="mx-auto max-w-[1000px] px-4 sm:px-6 pt-20 sm:pt-24 pb-32">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 sm:mb-10">
                    <p className={`text-xs font-bold tracking-[0.18em] uppercase mb-2 ${subCls}`}>CV</p>
                    <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-2 ${titleCls}`}>{t('cv.title')}</h1>
                    <p className={`text-sm ${mutedCls}`}>{t('cv.subtitle')}</p>
                </motion.div>

                {/* Upload Zone */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                    onClick={() => { if (!fileName) fileRef.current?.click(); }}
                    className={`relative group rounded-3xl border-2 border-dashed transition-all p-10 sm:p-16 text-center mb-6 ${fileName ? 'cursor-default' : 'cursor-pointer'} ${dragOver ? dropzoneActiveCls : dropzoneCls}`}
                >
                    <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                    {loading ? (
                        <div className="flex flex-col items-center gap-3">
                            <svg className="animate-spin h-8 w-8 text-orange-400" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <p className={`text-sm font-medium ${mutedCls}`}>{t('cv.analyzing')}</p>
                        </div>
                    ) : fileName ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isDark ? 'bg-emerald-500/15 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>✅</div>
                            <p className={`text-sm font-bold ${titleCls}`}>{fileName}</p>
                            {cvAnalysis?.uploadedAt && (
                                <p className={`text-xs ${subCls}`}>
                                    {lang === 'tr' ? 'Yüklenme: ' : 'Uploaded: '}
                                    {new Date(cvAnalysis.uploadedAt).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-3 justify-center">
                                <button type="button" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                                    className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${isDark ? 'bg-orange-500/15 border-orange-500/30 text-orange-400 hover:bg-orange-500/25' : 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'}`}>
                                    {lang === 'tr' ? 'Farklı CV Yükle' : 'Upload Different CV'}
                                </button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); handleClearCV(); }}
                                    className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all ${isDark ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25' : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'}`}>
                                    <Trash2 size={12} /> {lang === 'tr' ? 'CV\'yi Kaldır' : 'Remove CV'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>📄</div>
                            <p className={`text-base font-semibold ${titleCls}`}>{t('cv.dropzone')}</p>
                            <p className={`text-xs ${subCls}`}>PDF • Maks. 10MB</p>
                        </div>
                    )}
                </motion.div>

                {/* Error message */}
                {errorMsg && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className={`rounded-2xl border px-5 py-3 text-sm font-semibold flex items-center gap-2 mb-5 ${isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'}`}
                        role="alert">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {errorMsg}
                    </motion.div>
                )}

                {/* Results */}
                <AnimatePresence>
                    {atsResult && (
                        <motion.div key="results" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                            className="flex flex-col gap-5">

                            {/* ATS Score */}
                            <div className={`rounded-3xl border shadow-[0_2px_24px_#00000008] p-6 sm:p-8 ${cardCls}`}>
                                <h3 className={`text-base font-bold mb-6 ${titleCls}`}>{t('cv.atsScore')}</h3>
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                                    <ScoreRing score={atsResult.score} isDark={isDark} />
                                    <div className="flex-1 w-full">
                                        <div className="space-y-3 mb-5">
                                            {Object.entries(atsResult.breakdown).map(([k, v]) => {
                                                const maxMap: Record<string, number> = {
                                                    'Anahtar Kelimeler': 30,
                                                    'Bölümler': 25,
                                                    'İçerik Uzunluğu': 20,
                                                    'İletişim Bilgisi': 20,
                                                    'Profil Linkleri': 5,
                                                };
                                                const max = maxMap[k] ?? 30;
                                                return (
                                                    <div key={k}>
                                                        <div className={`flex justify-between text-xs font-medium mb-1 ${subCls}`}>
                                                            <span>{k}</span><span>{v} / {max}</span>
                                                        </div>
                                                        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/8' : 'bg-black/5'}`}>
                                                            <motion.div className="h-full rounded-full"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${Math.min((v / max) * 100, 100)}%` }}
                                                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                                                style={{ background: 'linear-gradient(90deg, #f97316, #14b8a6)' }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {atsResult.tips.length > 0 && (
                                            <div className={`rounded-2xl border p-4 ${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100'}`}>
                                                <p className={`text-xs font-bold mb-2 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>💡 {lang === 'tr' ? 'İyileştirme Önerileri' : 'Suggestions'}</p>
                                                <ul className="space-y-1">
                                                    {atsResult.tips.map((tip, i) => (
                                                        <li key={i} className={`text-xs flex items-start gap-2 ${isDark ? 'text-amber-200' : 'text-amber-600'}`}>
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
                                <div className={`rounded-3xl border shadow-[0_2px_24px_#00000008] p-6 sm:p-8 ${cardCls}`}>
                                    <h3 className={`text-base font-bold mb-5 ${titleCls}`}>{lang === 'tr' ? 'CV Bölümleri' : 'CV Sections'}</h3>
                                    <div className="space-y-4">
                                        {Object.entries(sections).filter(([, v]) => v.trim().length > 10).map(([section, content]) => (
                                            <details key={section} className={`group rounded-2xl border overflow-hidden ${sectionCls}`}>
                                                <summary className={`flex justify-between items-center px-5 py-4 cursor-pointer font-semibold text-sm list-none ${titleCls}`}>
                                                    {section || 'Genel'}
                                                    <svg className={`w-4 h-4 group-open:rotate-180 transition-transform ${subCls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                                </summary>
                                                <pre className={`px-5 pb-4 text-xs leading-relaxed whitespace-pre-wrap font-sans ${subCls}`}>{content.trim()}</pre>
                                            </details>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Ask Gemini */}
                            <div className={`rounded-3xl border shadow-[0_2px_24px_#00000008] p-6 sm:p-8 ${cardCls}`}>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, #4285f4, #db4437, #f4b400, #0f9d58)' }}>
                                        <span className="text-white font-bold text-sm">G</span>
                                    </div>
                                    <div>
                                        <h3 className={`text-base font-bold ${titleCls}`}>{t('cv.askGemini')}</h3>
                                        <p className={`text-xs ${subCls}`}>{lang === 'tr' ? 'CV hakkında Gemini\'ye soru sorun' : 'Ask Gemini about your CV'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input type="text" value={geminiMsg} onChange={e => setGeminiMsg(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') handleGemini(); }}
                                        placeholder={t('cv.geminiPlaceholder')}
                                        className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-300 ${isDark ? 'border-white/8 bg-white/5 text-white placeholder:text-white/45' : 'border-black/8 bg-[#fafafa] text-black placeholder:text-black/45'}`} />
                                    <button onClick={handleGemini} disabled={!geminiMsg.trim() || geminiLoading}
                                        className="w-full sm:w-auto rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                                        style={{ background: 'linear-gradient(135deg, #f97316, #14b8a6)' }}>
                                        {geminiLoading ? '...' : t('gemini.send')}
                                    </button>
                                </div>
                                {/* Persisted chat history */}
                                {geminiHistory.length > 0 && (
                                    <div className="mt-5 flex flex-col gap-3">
                                        {geminiHistory.map((turn, i) => (
                                            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                                className="flex flex-col gap-2">
                                                <div className="self-end max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-medium text-white"
                                                    style={{ background: 'linear-gradient(135deg, #f97316, #14b8a6)' }}>
                                                    {turn.q}
                                                </div>
                                                <div className={`rounded-2xl border p-4 text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'bg-white/5 border-white/8 text-white/80' : 'bg-[#fafafa] border-black/5 text-black/75'}`}>
                                                    {turn.a}
                                                </div>
                                            </motion.div>
                                        ))}
                                        {geminiLoading && (
                                            <div className={`rounded-2xl border p-4 flex items-center gap-1.5 ${isDark ? 'bg-white/5 border-white/8' : 'bg-[#fafafa] border-black/5'}`}>
                                                {[0, 1, 2].map(i => (
                                                    <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                                                        className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/40' : 'bg-black/30'}`} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CVPage;
