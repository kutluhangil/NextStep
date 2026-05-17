import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import type { Application, ApplicationStatus } from '../store/useAppStore';
import { Caption } from '../components/common/Typography';
import { Reveal } from '../components/common/Reveal';
import { Search, Filter, ArrowDown, ArrowUp, Download, X, Pencil, Trash2, LayoutGrid, List, Tag } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useDark } from '../hooks/useDark';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// ── Status colors ──────────────────────────────────────────────────
const STATUS_COLOR: Record<string, { bg: string; text: string; border: string }> = {
    'Süreçte':            { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-100' },
    'Görüşme Bekleniyor': { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-100' },
    'Teknik Mülakat':     { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-100' },
    'İK Mülakatı':        { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-100' },
    'Vaka / Ödev':        { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-100' },
    'Teklif Alındı':      { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
    'Olumlu':             { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
    'Reddedildi':         { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-100' },
    'İptal':              { bg: 'bg-gray-50',    text: 'text-gray-500',    border: 'border-gray-100' },
    'Yanıt Yok':          { bg: 'bg-gray-50',    text: 'text-gray-400',    border: 'border-gray-100' },
};

const ALL_STATUSES: ApplicationStatus[] = [
    'Süreçte', 'Görüşme Bekleniyor', 'Teknik Mülakat', 'İK Mülakatı',
    'Vaka / Ödev', 'Teklif Alındı', 'Olumlu', 'Reddedildi', 'İptal', 'Yanıt Yok',
];

const StatusBadge = ({ status }: { status: string }) => {
    const c = STATUS_COLOR[status] ?? { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100' };
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
            {status}
        </span>
    );
};

// ── Kanban Board ───────────────────────────────────────────────────
interface KanbanProps {
    apps: Application[];
    onSelect: (app: Application) => void;
    onEdit: (app: Application) => void;
    onDelete: (id: string) => void;
    isDark: boolean;
}

const KanbanBoard = ({ apps, onSelect, onEdit, onDelete, isDark }: KanbanProps) => {
    const colBg = isDark ? 'bg-white/[0.03] border-white/5' : 'bg-black/[0.02] border-black/5';
    const cardBg = isDark ? 'bg-[#1c1c1e] border-white/5 hover:border-white/10' : 'bg-white border-black/5 hover:border-black/10 hover:shadow-md';
    const subText = isDark ? 'text-white/50' : 'text-black/60';
    const headText = isDark ? 'text-white/60' : 'text-black/55';

    return (
        <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
                {ALL_STATUSES.map(status => {
                    const colApps = apps.filter(a => a.status === status);
                    const sc = STATUS_COLOR[status];
                    return (
                        <div key={status} className={`w-64 rounded-2xl border p-3 flex flex-col gap-2 ${colBg}`}>
                            {/* Column Header */}
                            <div className="flex items-center justify-between px-1 pb-1">
                                <span className={`text-xs font-bold uppercase tracking-wider ${headText}`}>{status}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sc?.bg ?? 'bg-gray-50'} ${sc?.text ?? 'text-gray-600'}`}>
                                    {colApps.length}
                                </span>
                            </div>

                            {/* Cards */}
                            <div className="flex flex-col gap-2 min-h-[80px]">
                                <AnimatePresence>
                                    {colApps.map(app => (
                                        <motion.div
                                            key={app.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            onClick={() => onSelect(app)}
                                            className={`rounded-xl border p-3 cursor-pointer transition-all ${cardBg}`}
                                        >
                                            <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>
                                                {app.companyName}
                                            </p>
                                            <p className={`text-xs truncate mt-0.5 ${subText}`}>{app.position}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className={`text-[10px] ${subText}`}>
                                                    {new Date(app.date).toLocaleDateString('tr-TR')}
                                                </span>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={e => { e.stopPropagation(); onEdit(app); }}
                                                        className="p-1 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-black/55"
                                                        title="Düzenle"
                                                    >
                                                        <Pencil size={11} />
                                                    </button>
                                                    <button
                                                        onClick={e => { e.stopPropagation(); onDelete(app.id); }}
                                                        className="p-1 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors text-black/55"
                                                        title="Sil"
                                                    >
                                                        <Trash2 size={11} />
                                                    </button>
                                                </div>
                                            </div>
                                            {app.priority && app.priority !== 'Orta' && (
                                                <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${
                                                    app.priority === 'Yüksek'
                                                        ? 'bg-red-50 text-red-500'
                                                        : 'bg-gray-50 text-gray-400'
                                                }`}>
                                                    {app.priority}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {colApps.length === 0 && (
                                    <div className={`text-center py-6 text-xs ${subText}`}>Boş</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────────────
const Applications = () => {
    useDocumentTitle('Başvurular');
    const applications = useAppStore(state => state.applications);
    const updateApplicationAsync = useAppStore(state => state.updateApplicationAsync);
    const deleteApplicationAsync = useAppStore(state => state.deleteApplicationAsync);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [sortField, setSortField] = useState<'date' | 'companyName'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;
    const [exporting, setExporting] = useState<null | 'excel' | 'pdf'>(null);
    const isDark = useDark();
    const importRef = useRef<HTMLInputElement>(null);

    const inputDark = isDark ? 'border-white/10 bg-white/5 text-white placeholder:text-white/60' : 'border-black/10 bg-[#fbfbfd]';
    const rowCls = isDark
        ? 'bg-white/5 border-white/5 hover:bg-white/10'
        : 'bg-white/60 border-black/5 hover:bg-white hover:shadow-md';
    const subText = isDark ? 'text-white/60' : 'text-black/60';
    const modalBg = isDark ? 'bg-[#1c1c1e]' : 'bg-white';
    const modalText = isDark ? 'text-white' : 'text-black';
    const modalSub = isDark ? 'text-white/70' : 'text-black/60';

    const handleSort = (field: 'date' | 'companyName') => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const filteredApps = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        return applications
            .filter(app => {
                // Extended search: company, position, department, city, platform, hrName
                const haystack = [
                    app.companyName, app.position, app.department,
                    app.city, app.platform, app.hrName,
                ].map(s => (s ?? '').toLowerCase()).join(' ');
                const matchesSearch = q ? haystack.includes(q) : true;
                const matchesStatus = statusFilter ? app.status === statusFilter : true;
                const matchesTag = tagFilter
                    ? (app.tags ?? '').toLowerCase().split(',').some(t => t.trim().includes(tagFilter.toLowerCase()))
                    : true;
                return matchesSearch && matchesStatus && matchesTag;
            })
            .sort((a, b) => {
                if (sortField === 'date') {
                    return sortOrder === 'asc'
                        ? new Date(a.date).getTime() - new Date(b.date).getTime()
                        : new Date(b.date).getTime() - new Date(a.date).getTime();
                } else {
                    return sortOrder === 'asc'
                        ? a.companyName.localeCompare(b.companyName)
                        : b.companyName.localeCompare(a.companyName);
                }
            });
    }, [applications, searchTerm, statusFilter, tagFilter, sortField, sortOrder]);

    // Reset page when filter/sort/view changes
    useEffect(() => { setPage(1); }, [searchTerm, statusFilter, tagFilter, sortField, sortOrder, viewMode]);

    const totalPages = Math.max(1, Math.ceil(filteredApps.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pagedApps = useMemo(
        () => filteredApps.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
        [filteredApps, safePage]
    );
    const hasFilter = !!(searchTerm.trim() || statusFilter || tagFilter.trim());

    const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
        setUpdatingStatusId(id);
        try {
            await updateApplicationAsync(id, { status: newStatus });
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const handleDelete = async (id: string) => {
        setDeleting(true);
        try {
            await deleteApplicationAsync(id);
            if (selectedApp?.id === id) setSelectedApp(null);
        } finally {
            setDeleting(false);
            setConfirmDeleteId(null);
        }
    };

    const exportToExcel = async () => {
        if (exporting) return;
        setExporting('excel');
        // yield to the event loop so the UI updates before sync XLSX call blocks
        await new Promise(r => setTimeout(r, 0));
        try {
            const ws = XLSX.utils.json_to_sheet(filteredApps.map(app => ({
                No: app.no,
                Firma: app.companyName,
                Pozisyon: app.position,
                Tarih: new Date(app.date).toLocaleDateString('tr-TR'),
                Durum: app.status,
                Platform: app.platform,
                CvVersiyonu: app.cvVersion,
                Notlar: app.motivation,
                Etiketler: app.tags,
            })));
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Basvurular");
            XLSX.writeFile(wb, "nextstep_basvurular.xlsx");
        } finally {
            setExporting(null);
        }
    };

    const exportToPDF = async () => {
        if (exporting) return;
        setExporting('pdf');
        await new Promise(r => setTimeout(r, 0));
        try {
            const doc = new jsPDF();
            doc.text("NextStep Is Basvuru Raporu", 14, 15);
            const tableData = filteredApps.map(app => [
                app.no, app.companyName, app.position,
                new Date(app.date).toLocaleDateString('tr-TR'), app.status, app.platform,
            ]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (doc as any).autoTable({
                head: [['No', 'Firma', 'Pozisyon', 'Tarih', 'Durum', 'Platform']],
                body: tableData, startY: 20, theme: 'grid',
                styles: { fontSize: 8, font: 'helvetica' },
                headStyles: { fillColor: [99, 102, 241] },
            });
            doc.save("nextstep_basvurular.pdf");
        } finally {
            setExporting(null);
        }
    };

    return (
        <div className={`mx-auto max-w-[1300px] px-6 pt-24 pb-48 ${isDark ? 'text-white' : ''}`}>

            {/* ── Header ──────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <Reveal direction="down" duration={0.6}>
                    <div className="flex items-center gap-6">
                        <div>
                            <Caption>TAKİP</Caption>
                            <h1 className={`mt-1 text-[clamp(28px,4vw,36px)] font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>
                                Tüm Başvurular
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 mt-4 ml-4">
                            <button onClick={exportToExcel} disabled={exporting !== null || filteredApps.length === 0}
                                className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                {exporting === 'excel'
                                    ? <><div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /> Hazırlanıyor</>
                                    : <><Download size={14} /> EXCEL</>}
                            </button>
                            <button onClick={exportToPDF} disabled={exporting !== null || filteredApps.length === 0}
                                className="flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                {exporting === 'pdf'
                                    ? <><div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" /> Hazırlanıyor</>
                                    : <><Download size={14} /> PDF</>}
                            </button>
                        </div>
                    </div>
                </Reveal>

                <Reveal direction="down" delay={0.1}>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        {/* View Toggle */}
                        <div className={`flex rounded-full border p-1 gap-0.5 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-black shadow-sm' : isDark ? 'text-white/50' : 'text-black/60'}`}
                            >
                                <List size={13} /> Liste
                            </button>
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${viewMode === 'kanban' ? 'bg-white text-black shadow-sm' : isDark ? 'text-white/50' : 'text-black/60'}`}
                            >
                                <LayoutGrid size={13} /> Kanban
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Search size={16} className={isDark ? 'text-white/70' : 'text-black/60'} />
                            </div>
                            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Firma veya pozisyon..."
                                aria-label="Başvurularda firma, pozisyon, departman ile arama yap"
                                className={`w-full sm:w-52 rounded-full border py-2.5 pl-10 pr-4 text-sm transition-all ${inputDark}`} />
                        </div>

                        {/* Tag Filter */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Tag size={14} className={isDark ? 'text-white/70' : 'text-black/60'} />
                            </div>
                            <input type="text" value={tagFilter} onChange={e => setTagFilter(e.target.value)}
                                placeholder="Etiket..."
                                aria-label="Etikete göre filtrele"
                                className={`w-full sm:w-36 rounded-full border py-2.5 pl-10 pr-4 text-sm transition-all ${inputDark}`} />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Filter size={14} className={isDark ? 'text-white/70' : 'text-black/60'} />
                            </div>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                                aria-label="Duruma göre filtrele"
                                className={`w-full sm:w-44 appearance-none rounded-full border py-2.5 pl-10 pr-8 text-sm transition-all ${inputDark}`}>
                                <option value="">Tüm Durumlar</option>
                                {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* ── Kanban View ──────────────────────────────────────── */}
            {viewMode === 'kanban' && (
                <Reveal direction="up" delay={0.1} className="w-full">
                    <KanbanBoard
                        apps={filteredApps}
                        onSelect={setSelectedApp}
                        onEdit={app => navigate(`/edit/${app.id}`)}
                        onDelete={id => setConfirmDeleteId(id)}
                        isDark={isDark}
                    />
                </Reveal>
            )}

            {/* ── List View ────────────────────────────────────────── */}
            {viewMode === 'list' && (
                <Reveal direction="up" delay={0.2} className="w-full">
                    <div className="flex flex-col gap-4 apple-glass-card p-4 sm:p-8">
                        {/* Desktop Headers */}
                        <div className={`hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 rounded-2xl border text-xs font-semibold uppercase tracking-wider ${isDark ? 'bg-gradient-to-r from-indigo-500/10 to-pink-500/10 border-white/10 text-white/70' : 'bg-gradient-to-r from-indigo-50/50 to-pink-50/50 border-black/5 text-black/60'}`}>
                            <div className="col-span-2 cursor-pointer hover:text-black flex items-center gap-1 transition-colors" onClick={() => handleSort('companyName')}>
                                Firma / Pozisyon
                                {sortField === 'companyName' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                            </div>
                            <div className="col-span-3">Durum</div>
                            <div className="col-span-1 cursor-pointer hover:text-black flex items-center gap-1 transition-colors" onClick={() => handleSort('date')}>
                                Tarih
                                {sortField === 'date' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                            </div>
                            <div className="col-span-1">Platform</div>
                            <div className="col-span-1">CV</div>
                            <div className="col-span-1">Motivasyon</div>
                            <div className="col-span-1 text-center">Test</div>
                            <div className="col-span-2 text-right">Aksiyon</div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <AnimatePresence>
                                {filteredApps.length === 0 ? (
                                    <div className={`text-center py-16 px-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/8 text-white/60' : 'bg-white border-black/5 text-black/55'}`}>
                                        <div className="text-4xl mb-3">{hasFilter ? '🔍' : '📭'}</div>
                                        <p className={`font-bold mb-1 ${isDark ? 'text-white/85' : 'text-black/70'}`}>
                                            {hasFilter ? 'Sonuç bulunamadı' : 'Henüz başvuru eklemediniz'}
                                        </p>
                                        <p className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                                            {hasFilter
                                                ? 'Filtreleri sıfırlayıp tekrar deneyin.'
                                                : 'İlk başvurunuzu eklemek için Ekle butonunu kullanın.'}
                                        </p>
                                        {hasFilter && (
                                            <button onClick={() => { setSearchTerm(''); setStatusFilter(''); setTagFilter(''); }}
                                                className={`mt-5 rounded-full border px-5 py-2 text-xs font-bold transition-all ${isDark ? 'border-white/15 text-white/70 hover:bg-white/5' : 'border-black/10 text-black/70 hover:bg-black/5'}`}>
                                                Filtreleri Temizle
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    pagedApps.map((app, index) => (
                                        <motion.div
                                            key={app.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: index * 0.04 }}
                                            className={`group flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:items-center rounded-2xl p-4 sm:px-6 shadow-sm border transition-all hover:-translate-y-0.5 ${rowCls}`}
                                        >
                                            {/* Company + Position */}
                                            <div className="col-span-2 flex flex-col">
                                                <div className={`text-base font-bold truncate ${isDark ? 'text-white' : 'text-black'} group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-rose-500 group-hover:bg-clip-text group-hover:text-transparent transition-all`}>
                                                    {app.companyName}
                                                </div>
                                                <div className={`text-sm truncate ${subText}`}>{app.position}</div>
                                                {app.tags && (
                                                    <div className="flex gap-1 flex-wrap mt-1">
                                                        {app.tags.split(',').slice(0, 2).map(tag => tag.trim()).filter(Boolean).map(tag => (
                                                            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Status (quick change select) */}
                                            <div className="col-span-3 flex items-center">
                                                <div className="relative">
                                                    <select
                                                        value={app.status}
                                                        onChange={e => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                                                        disabled={updatingStatusId === app.id}
                                                        className={`appearance-none text-xs font-semibold px-3 py-1.5 rounded-full border pr-7 cursor-pointer transition-all focus:outline-none disabled:opacity-60 ${
                                                            STATUS_COLOR[app.status]
                                                                ? `${STATUS_COLOR[app.status].bg} ${STATUS_COLOR[app.status].text} ${STATUS_COLOR[app.status].border}`
                                                                : 'bg-gray-50 text-gray-600 border-gray-100'
                                                        }`}
                                                    >
                                                        {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                                                        {updatingStatusId === app.id
                                                            ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60" />
                                                            : <ArrowDown size={10} className="opacity-50" />
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Date */}
                                            <div className={`col-span-1 text-sm ${subText}`}>
                                                {new Date(app.date).toLocaleDateString('tr-TR')}
                                            </div>

                                            {/* Platform */}
                                            <div className={`col-span-1 text-sm ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                                                {app.platform || '-'}
                                            </div>

                                            {/* CV */}
                                            <div className={`col-span-1 text-sm ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                                                {app.cvVersion || '-'}
                                            </div>

                                            {/* Motivation */}
                                            <div className={`col-span-1 text-sm ${subText}`}>
                                                {app.motivation ? <span className="text-emerald-600 font-semibold">✓</span> : '-'}
                                            </div>

                                            {/* Test */}
                                            <div className="col-span-1 text-sm text-center">
                                                {app.testLink ? (
                                                    <a href={app.testLink} target="_blank" rel="noopener noreferrer"
                                                        className="text-indigo-500 hover:underline font-medium" onClick={e => e.stopPropagation()}>
                                                        Test
                                                    </a>
                                                ) : <span className={subText}>-</span>}
                                            </div>

                                            {/* Actions */}
                                            <div className="col-span-2 flex items-center lg:justify-end gap-2 max-lg:mt-2 flex-wrap">
                                                {app.jobLink && (
                                                    <a href={app.jobLink} target="_blank" rel="noopener noreferrer"
                                                        className="btn-gradient inline-flex items-center justify-center px-3 py-1.5 text-xs text-white rounded-full" onClick={e => e.stopPropagation()}>
                                                        İlan
                                                    </a>
                                                )}
                                                <button onClick={() => setSelectedApp(app)}
                                                    className={`inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${isDark ? 'border-white/10 text-white/70 hover:bg-white/5' : 'border-black/10 text-black hover:bg-black/5'}`}>
                                                    Detay
                                                </button>
                                                <button onClick={() => navigate(`/edit/${app.id}`)}
                                                    className="inline-flex items-center justify-center rounded-full border border-indigo-200 text-indigo-600 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-50 transition-all"
                                                    title="Düzenle">
                                                    <Pencil size={12} />
                                                </button>
                                                <button onClick={() => setConfirmDeleteId(app.id)}
                                                    className="inline-flex items-center justify-center rounded-full border border-red-200 text-red-500 px-3 py-1.5 text-xs font-semibold hover:bg-red-50 transition-all"
                                                    title="Sil">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Pagination ───────────────────────────────── */}
                        {filteredApps.length > PAGE_SIZE && (
                            <div className="flex items-center justify-between gap-3 flex-wrap pt-4 mt-2 border-t border-black/5">
                                <p className={`text-xs ${subText}`}>
                                    <span className="font-semibold">{(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredApps.length)}</span>
                                    {' / '}
                                    <span className="font-semibold">{filteredApps.length}</span> başvuru
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={safePage === 1}
                                        className={`min-w-[40px] h-10 rounded-full border text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'border-white/10 text-white/70 hover:bg-white/5' : 'border-black/10 text-black/70 hover:bg-black/5'}`}>
                                        ←
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                                        .map((p, idx, arr) => (
                                            <span key={p} className="flex items-center">
                                                {idx > 0 && arr[idx - 1] !== p - 1 && (
                                                    <span className={`px-1.5 text-xs ${subText}`}>···</span>
                                                )}
                                                <button onClick={() => setPage(p)}
                                                    className={`min-w-[40px] h-10 rounded-full text-xs font-bold transition-all ${
                                                        safePage === p
                                                            ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md'
                                                            : isDark
                                                                ? 'border border-white/10 text-white/70 hover:bg-white/5'
                                                                : 'border border-black/10 text-black/70 hover:bg-black/5'
                                                    }`}>
                                                    {p}
                                                </button>
                                            </span>
                                        ))}
                                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={safePage === totalPages}
                                        className={`min-w-[40px] h-10 rounded-full border text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'border-white/10 text-white/70 hover:bg-white/5' : 'border-black/10 text-black/70 hover:bg-black/5'}`}>
                                        →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Reveal>
            )}

            {/* ── Detail Modal ─────────────────────────────────────── */}
            <AnimatePresence>
                {selectedApp && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-md p-4 sm:p-6"
                        onClick={() => setSelectedApp(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className={`relative w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-3xl sm:rounded-[32px] p-5 sm:p-8 shadow-2xl ${modalBg}`}
                            onClick={e => e.stopPropagation()}
                            style={{ maxHeight: '85dvh' as React.CSSProperties['maxHeight'] }}
                        >
                            <button onClick={() => setSelectedApp(null)}
                                aria-label="Kapat"
                                className="absolute top-3 right-3 sm:top-6 sm:right-6 w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors flex items-center justify-center">
                                <X size={20} className="text-black/70" />
                            </button>

                            {/* Edit button in modal */}
                            <button
                                onClick={() => { setSelectedApp(null); navigate(`/edit/${selectedApp.id}`); }}
                                className="absolute top-6 right-16 flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-colors"
                            >
                                <Pencil size={12} /> Düzenle
                            </button>

                            <div className="mb-8">
                                <div className="text-sm font-semibold text-blue-500 mb-2 uppercase tracking-wide">Başvuru Detayı</div>
                                <h3 className={`text-3xl font-bold tracking-tight ${modalText}`}>{selectedApp.companyName}</h3>
                                <div className={`text-lg mt-1 ${subText}`}>{selectedApp.position}</div>
                                {selectedApp.department && (
                                    <div className={`text-sm mt-0.5 ${modalSub}`}>{selectedApp.department}</div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${modalSub}`}>Başvuru Tarihi</div>
                                    <div className={`text-base font-medium ${modalText}`}>{new Date(selectedApp.date).toLocaleDateString('tr-TR')}</div>
                                </div>
                                <div>
                                    <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${modalSub}`}>Durum</div>
                                    <StatusBadge status={selectedApp.status} />
                                </div>
                                {selectedApp.priority && (
                                    <div>
                                        <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${modalSub}`}>Öncelik</div>
                                        <div className={`text-base font-medium ${modalText}`}>{selectedApp.priority}</div>
                                    </div>
                                )}
                                {(selectedApp.salaryMin || selectedApp.salaryMax) && (
                                    <div>
                                        <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${modalSub}`}>Maaş Aralığı</div>
                                        <div className={`text-base font-medium ${modalText}`}>
                                            {selectedApp.salaryMin && selectedApp.salaryMax
                                                ? `${selectedApp.salaryMin} – ${selectedApp.salaryMax} ${selectedApp.salaryCurrency ?? ''} / ${selectedApp.salaryPeriod ?? ''}`
                                                : `${selectedApp.salaryMin || selectedApp.salaryMax} ${selectedApp.salaryCurrency ?? ''}`
                                            }
                                        </div>
                                    </div>
                                )}
                                {selectedApp.hrName && (
                                    <div>
                                        <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${modalSub}`}>İK Uzmanı</div>
                                        <div className={`text-base font-medium ${modalText}`}>{selectedApp.hrName}</div>
                                        {selectedApp.hrEmail && <div className={`text-sm ${subText}`}>{selectedApp.hrEmail}</div>}
                                    </div>
                                )}
                                {selectedApp.interviewDate && (
                                    <div>
                                        <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${modalSub}`}>Mülakat Tarihi</div>
                                        <div className={`text-base font-medium ${modalText}`}>{selectedApp.interviewDate}</div>
                                    </div>
                                )}
                                {selectedApp.followUpDate && (
                                    <div>
                                        <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${modalSub}`}>Takip Tarihi</div>
                                        <div className={`text-base font-medium ${modalText}`}>{selectedApp.followUpDate}</div>
                                    </div>
                                )}
                                {selectedApp.offerAmount && (
                                    <div>
                                        <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${modalSub}`}>Teklif Tutarı</div>
                                        <div className={`text-base font-medium ${modalText}`}>{selectedApp.offerAmount}</div>
                                    </div>
                                )}
                                <div className="sm:col-span-2">
                                    <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${modalSub}`}>Süreç Notları</div>
                                    <div className={`text-base bg-black/5 rounded-2xl p-4 min-h-[60px] ${modalText}`}>
                                        {selectedApp.notes || 'Henüz not eklenmemiş.'}
                                    </div>
                                </div>
                                {selectedApp.motivation && (
                                    <div className="sm:col-span-2">
                                        <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${modalSub}`}>Motivasyon Yazısı</div>
                                        <div className={`text-base bg-black/5 rounded-2xl p-4 min-h-[60px] ${modalText}`}>
                                            {selectedApp.motivation}
                                        </div>
                                    </div>
                                )}
                                {selectedApp.interviewNotes && (
                                    <div className="sm:col-span-2">
                                        <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${modalSub}`}>Mülakat Notları</div>
                                        <div className={`text-base bg-black/5 rounded-2xl p-4 ${modalText}`}>
                                            {selectedApp.interviewNotes}
                                        </div>
                                    </div>
                                )}
                                {selectedApp.tags && (
                                    <div className="sm:col-span-2">
                                        <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${modalSub}`}>Etiketler</div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedApp.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                                                <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {selectedApp.testLink && (
                                    <div className="sm:col-span-2">
                                        <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${modalSub}`}>Değerlendirme Testi</div>
                                        <a href={selectedApp.testLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:underline font-medium">
                                            Teste Git ↗
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Delete Confirm Modal ─────────────────────────────── */}
            <AnimatePresence>
                {confirmDeleteId && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
                        onClick={() => !deleting && setConfirmDeleteId(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ type: 'spring', duration: 0.4 }}
                            className={`relative w-full max-w-sm rounded-3xl p-8 shadow-2xl ${isDark ? 'bg-[#1c1c1e]' : 'bg-white'}`}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-3xl mb-4 text-center">🗑️</div>
                            <h3 className={`text-xl font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>
                                Başvuruyu Sil
                            </h3>
                            <p className={`text-sm text-center mb-8 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                                Bu başvuruyu kalıcı olarak silmek istediğinize emin misiniz?
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmDeleteId(null)} disabled={deleting}
                                    className={`flex-1 rounded-full border py-3 text-sm font-semibold transition-all ${isDark ? 'border-white/10 text-white/70' : 'border-black/10 text-black/70 hover:bg-black/5'}`}>
                                    İptal
                                </button>
                                <button onClick={() => handleDelete(confirmDeleteId)} disabled={deleting}
                                    className="flex-1 rounded-full bg-red-500 text-white py-3 text-sm font-bold hover:bg-red-600 transition-all disabled:opacity-50">
                                    {deleting ? 'Siliniyor...' : 'Evet, Sil'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* hidden import ref (used from Settings) */}
            <input ref={importRef} type="file" accept=".json" className="hidden" />
        </div>
    );
};

export default Applications;
