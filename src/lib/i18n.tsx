/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

export type Lang = 'tr' | 'en';

const translations = {
    // ── Navigation
    'nav.dashboard': { tr: 'Anasayfa', en: 'Home' },
    'nav.add': { tr: 'Ekle', en: 'Add' },
    'nav.applications': { tr: 'Başvurular', en: 'Applications' },
    'nav.analytics': { tr: 'Analiz', en: 'Analytics' },
    'nav.settings': { tr: 'Ayarlar', en: 'Settings' },
    'nav.cv': { tr: 'CV', en: 'CV' },
    'nav.login': { tr: 'Giriş Yap', en: 'Sign In' },
    'nav.register': { tr: 'Kayıt Ol', en: 'Sign Up' },
    'nav.goDashboard': { tr: 'Panele Git', en: 'Go to Dashboard' },

    // ── Landing
    'landing.badge': { tr: 'Kariyer Takip Platformu', en: 'Career Tracking Platform' },
    'landing.hero1': { tr: 'Kariyerini', en: 'Own Your' },
    'landing.hero2': { tr: 'Yönet.', en: 'Career.' },
    'landing.sub': { tr: 'İş başvurularınızı takip edin, analiz edin ve stratejinizi verilerle geliştirin.', en: 'Track applications, analyze results, and improve your strategy with data.' },
    'landing.cta': { tr: 'Ücretsiz Başla', en: 'Get Started Free' },
    'landing.howBtn': { tr: 'Nasıl Çalışır?', en: 'How It Works?' },
    'landing.statsUnlimited': { tr: 'Sınırsız', en: 'Unlimited' },
    'landing.statsUnlimitedSub': { tr: 'Başvuru takip', en: 'Application tracking' },
    'landing.statsWidgets': { tr: 'Analiz widgetı', en: 'Analytics widgets' },
    'landing.statsWidgetsSub': { tr: "Dashboard'da", en: 'On dashboard' },
    'landing.statsServer': { tr: 'Sunucu', en: 'Servers' },
    'landing.statsServerSub': { tr: 'Bulut yok, yerel', en: 'Local, no cloud' },
    'landing.statsFree': { tr: '% 100 Ücretsiz', en: '100% Free' },
    'landing.statsFreeSub': { tr: 'Her zaman', en: 'Always' },
    'landing.featuresTitle': { tr: 'İhtiyacınız olan her şey, tek yerde.', en: 'Everything you need, in one place.' },
    'landing.featuresSub': { tr: 'Binlerce saat kaybettiren Excel tablolarından kurtulun.', en: 'Say goodbye to time-consuming spreadsheets.' },
    'landing.featuresLabel': { tr: 'Özellikler', en: 'Features' },
    'landing.howLabel': { tr: 'Nasıl Çalışır', en: 'How It Works' },
    'landing.howTitle': { tr: '4 adımda kariyer kontrolü.', en: '4 steps to career control.' },
    'landing.ctaTitle': { tr: 'Başvuruya Hazır Mısın?', en: 'Ready to Apply Smarter?' },
    'landing.ctaSub': { tr: 'Saniyeler içinde hesabınızı oluşturun ve NextStep ile kariyerinizi şekillendirin.', en: 'Create your account in seconds and shape your career with NextStep.' },
    'landing.ctaBtn': { tr: 'Ücretsiz Başla', en: 'Get Started Free' },

    // ── Dashboard
    'dashboard.overview': { tr: 'GENEL BAKIŞ', en: 'OVERVIEW' },
    'dashboard.hello': { tr: 'Merhaba', en: 'Hello' },
    'dashboard.noApps': { tr: 'İlk başvurunu eklemek için hazır mısın?', en: 'Ready to add your first application?' },
    'dashboard.appsTracked': { tr: 'başvuru takibinde', en: 'applications tracked' },
    'dashboard.activeProcess': { tr: 'aktif süreç', en: 'active process' },
    'dashboard.logout': { tr: 'Çıkış Yap', en: 'Sign Out' },
    'dashboard.total': { tr: 'Toplam Başvuru', en: 'Total Applications' },
    'dashboard.thisMonth': { tr: 'Bu Ay', en: 'This Month' },
    'dashboard.inProgress': { tr: 'Süreçte', en: 'In Progress' },
    'dashboard.positive': { tr: 'Olumlu Sonuç', en: 'Positive Result' },
    'dashboard.recentLabel': { tr: 'Son Hareketler', en: 'Recent Activity' },
    'dashboard.viewAll': { tr: 'Tümünü Gör →', en: 'View All →' },
    'dashboard.addNew': { tr: '+ Yeni Başvuru', en: '+ New Application' },

    // ── Applications
    'apps.title': { tr: 'Başvurular', en: 'Applications' },
    'apps.exportExcel': { tr: 'Excel İndir', en: 'Export Excel' },
    'apps.exportPdf': { tr: 'PDF İndir', en: 'Export PDF' },
    'apps.search': { tr: 'Ara...', en: 'Search...' },
    'apps.noApps': { tr: 'Henüz başvuru yok', en: 'No applications yet' },
    'apps.delete': { tr: 'Sil', en: 'Delete' },
    'apps.open': { tr: 'İlanı Aç', en: 'Open Listing' },

    // ── Add Application
    'add.title': { tr: 'Başvuru Ekle', en: 'Add Application' },
    'add.subtitle': { tr: 'Bilgileri eksiksiz doldurun.', en: 'Fill in all details completely.' },
    'add.save': { tr: 'Kaydet', en: 'Save' },
    'add.cancel': { tr: 'İptal', en: 'Cancel' },
    'add.section.core': { tr: 'Temel Bilgiler', en: 'Core Information' },
    'add.section.location': { tr: 'Konum & Çalışma', en: 'Location & Work Style' },
    'add.section.platform': { tr: 'Platform & Döküman', en: 'Platform & Document' },
    'add.section.process': { tr: 'Süreç Notları', en: 'Process Notes' },
    'add.company': { tr: 'Firma Adı', en: 'Company Name' },
    'add.position': { tr: 'Pozisyon', en: 'Position' },
    'add.jobLink': { tr: 'İş İlanı Linki', en: 'Job Listing Link' },
    'add.date': { tr: 'Başvuru Tarihi', en: 'Application Date' },
    'add.status': { tr: 'Durum', en: 'Status' },
    'add.city': { tr: 'Şehir', en: 'City' },
    'add.country': { tr: 'Ülke', en: 'Country' },
    'add.workType': { tr: 'Çalışma Biçimi', en: 'Work Type' },
    'add.contractType': { tr: 'Sözleşme Türü', en: 'Contract Type' },
    'add.platform': { tr: 'Platform', en: 'Platform' },
    'add.cvVersion': { tr: 'CV Versiyonu', en: 'CV Version' },
    'add.testLink': { tr: 'Test Linki', en: 'Test Link' },
    'add.motivation': { tr: 'Motivasyon / Başvuru Yazısı', en: 'Motivation / Cover Letter' },
    'add.afterApply': { tr: 'Başvurudan Sonra Olanlar', en: 'What Happened After' },
    'add.comments': { tr: 'Yorumlar', en: 'Comments' },
    'add.hrInterview': { tr: 'İK Görüşmesi', en: 'HR Interview' },
    'add.otherInterviews': { tr: 'Diğer Mülakat Süreçleri', en: 'Other Interview Stages' },
    'add.feedback': { tr: 'Notlar / Geri Bildirim', en: 'Notes / Feedback' },
    'add.saved': { tr: 'Başvuru başarıyla kaydedildi', en: 'Application saved successfully' },

    // ── Settings
    'settings.title': { tr: 'Ayarlar', en: 'Settings' },
    'settings.subtitle': { tr: 'Hesap, güvenlik ve tercihlerinizi yönetin.', en: 'Manage your account, security and preferences.' },
    'settings.profile': { tr: 'Profil', en: 'Profile' },
    'settings.security': { tr: 'Güvenlik', en: 'Security' },
    'settings.appearance': { tr: 'Görünüm', en: 'Appearance' },
    'settings.notifications': { tr: 'Bildirimler', en: 'Notifications' },
    'settings.data': { tr: 'Veri Yönetimi', en: 'Data Management' },
    'settings.danger': { tr: 'Tehlike Bölgesi', en: 'Danger Zone' },
    'settings.feedback': { tr: 'Geri Bildirim', en: 'Feedback' },
    'settings.logout': { tr: 'Oturumu Kapat', en: 'Sign Out' },
    'settings.fbTitle': { tr: 'Geri Bildirim Gönder', en: 'Send Feedback' },
    'settings.fbSub': { tr: 'Hata mı buldun? Önerin mi var? Hemen ilet.', en: 'Found a bug? Have a suggestion? Let us know.' },
    'settings.fbType': { tr: 'Tür', en: 'Type' },
    'settings.fbBug': { tr: 'Hata / Bug', en: 'Bug Report' },
    'settings.fbSuggestion': { tr: 'Öneri', en: 'Suggestion' },
    'settings.fbOther': { tr: 'Diğer', en: 'Other' },
    'settings.fbMessage': { tr: 'Mesajınız', en: 'Your message' },
    'settings.fbSend': { tr: 'Gönder', en: 'Send' },
    'settings.fbSent': { tr: 'Mesajınız iletildi, teşekkürler!', en: 'Message sent, thank you!' },

    // ── CV Page
    'cv.title': { tr: 'CV Analizi', en: 'CV Analysis' },
    'cv.subtitle': { tr: "CV'nizi yükleyin, ATS skoru alın, Gemini ile analiz ettirin.", en: 'Upload your CV, get an ATS score, analyze with Gemini.' },
    'cv.dropzone': { tr: "PDF'inizi buraya sürükleyin veya tıklayın", en: 'Drag & drop your PDF here or click to browse' },
    'cv.atsScore': { tr: 'ATS Skoru', en: 'ATS Score' },
    'cv.analyzing': { tr: 'Analiz ediliyor...', en: 'Analyzing...' },
    'cv.askGemini': { tr: "Gemini'ye Sor", en: 'Ask Gemini' },
    'cv.geminiPlaceholder': { tr: "CV'mi analiz et ve iyileştirme öner", en: 'Analyze my CV and suggest improvements' },

    // ── Gemini Widget
    'gemini.title': { tr: 'Gemini ile Konuş', en: 'Chat with Gemini' },
    'gemini.placeholder': { tr: 'Kariyer sorunuzu sorun...', en: 'Ask your career question...' },
    'gemini.send': { tr: 'Gönder', en: 'Send' },
    'gemini.noKey': { tr: 'Gemini API anahtarı henüz eklenmedi.', en: 'Gemini API key not set yet.' },

    // ── Auth
    'auth.login.title': { tr: 'Tekrar hoş geldin', en: 'Welcome back' },
    'auth.login.sub': { tr: 'Hesabınıza giriş yapın', en: 'Sign in to your account' },
    'auth.login.email': { tr: 'E-posta', en: 'Email' },
    'auth.login.password': { tr: 'Şifre', en: 'Password' },
    'auth.login.remember': { tr: 'Beni hatırla', en: 'Remember me' },
    'auth.login.forgot': { tr: 'Şifremi unuttum', en: 'Forgot password' },
    'auth.login.btn': { tr: 'Giriş Yap', en: 'Sign In' },
    'auth.login.loading': { tr: 'Giriş yapılıyor...', en: 'Signing in...' },
    'auth.login.noAccount': { tr: 'Hesabın yok mu?', en: "Don't have an account?" },
    'auth.register.title': { tr: 'Hesap Oluştur', en: 'Create Account' },
} as const;

type TranslationKey = keyof typeof translations;

interface LangContextType {
    lang: Lang;
    setLang: (l: Lang) => void;
    t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextType>({
    lang: 'tr',
    setLang: () => { },
    t: (key) => translations[key]?.tr ?? key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLangState] = useState<Lang>(() => {
        return (localStorage.getItem('nextstep-lang') as Lang) ?? 'tr';
    });

    const setLang = (l: Lang) => {
        setLangState(l);
        localStorage.setItem('nextstep-lang', l);
    };

    const t = (key: TranslationKey): string =>
        translations[key]?.[lang] ?? translations[key]?.tr ?? key;

    return (
        <LangContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LangContext.Provider>
    );
};

export const useLanguage = () => useContext(LangContext);
