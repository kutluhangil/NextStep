/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import { safeStorage } from './safeStorage';

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

    // ── Shared table columns
    'col.company':    { tr: 'Firma / Pozisyon', en: 'Company / Position' },
    'col.status':     { tr: 'Durum',            en: 'Status' },
    'col.date':       { tr: 'Tarih',            en: 'Date' },
    'col.platform':   { tr: 'Platform',          en: 'Platform' },
    'col.cv':         { tr: 'CV',               en: 'CV' },
    'col.motivation': { tr: 'Motivasyon',        en: 'Motivation' },
    'col.test':       { tr: 'Test',             en: 'Test' },
    'col.listing':    { tr: 'İlan',             en: 'Listing' },

    // ── Shared actions
    'action.cancel':  { tr: 'İptal',       en: 'Cancel' },
    'action.delete':  { tr: 'Sil',         en: 'Delete' },
    'action.edit':    { tr: 'Düzenle',     en: 'Edit' },
    'action.detail':  { tr: 'Detay',       en: 'Detail' },
    'action.update':  { tr: 'Güncelle',    en: 'Update' },
    'action.view':    { tr: 'Görüntüle →', en: 'View →' },
    'action.deleting':{ tr: 'Siliniyor...', en: 'Deleting...' },
    'action.saving':  { tr: 'Kaydediliyor...', en: 'Saving...' },

    // ── Date locale helper
    'locale': { tr: 'tr-TR', en: 'en-US' },

    // ── Dashboard additions
    'dashboard.noAppsEmpty':  { tr: 'Henüz hiç başvuru eklemedin.', en: "You haven't added any applications yet." },
    'dashboard.emptyIcon':    { tr: '📭', en: '📭' },

    // ── Applications page
    'apps.allApps':          { tr: 'Tüm Başvurular',           en: 'All Applications' },
    'apps.trackLabel':       { tr: 'TAKİP',                    en: 'TRACKING' },
    'apps.preparing':        { tr: 'Hazırlanıyor',             en: 'Preparing' },
    'apps.list':             { tr: 'Liste',                    en: 'List' },
    'apps.kanban':           { tr: 'Kanban',                   en: 'Kanban' },
    'apps.searchPlaceholder':{ tr: 'Firma veya pozisyon...',   en: 'Company or position...' },
    'apps.tagPlaceholder':   { tr: 'Etiket...',                en: 'Tag...' },
    'apps.allStatuses':      { tr: 'Tüm Durumlar',             en: 'All Statuses' },
    'apps.noResult':         { tr: 'Sonuç bulunamadı',         en: 'No results found' },
    'apps.noResultSub':      { tr: 'Filtreleri sıfırlayıp tekrar deneyin.', en: 'Reset filters and try again.' },
    'apps.noAppsTitle':      { tr: 'Henüz başvuru eklemediniz', en: 'No applications yet' },
    'apps.noAppsSub':        { tr: 'İlk başvurunuzu eklemek için Ekle butonunu kullanın.', en: 'Use the Add button to create your first application.' },
    'apps.clearFilters':     { tr: 'Filtreleri Temizle',       en: 'Clear Filters' },
    'apps.kanbanEmpty':      { tr: 'Boş',                      en: 'Empty' },
    'apps.pagination':       { tr: 'başvuru',                  en: 'applications' },
    'apps.deleteTitle':      { tr: 'Başvuruyu Sil',            en: 'Delete Application' },
    'apps.deleteMsg':        { tr: 'Bu başvuruyu kalıcı olarak silmek istediğinize emin misiniz?', en: 'Are you sure you want to permanently delete this application?' },
    'apps.confirmDelete':    { tr: 'Evet, Sil',                en: 'Yes, Delete' },
    'apps.detailTitle':      { tr: 'Başvuru Detayı',           en: 'Application Detail' },
    'apps.appDate':          { tr: 'Başvuru Tarihi',           en: 'Application Date' },
    'apps.processNotes':     { tr: 'Süreç Notları',            en: 'Process Notes' },
    'apps.noNotes':          { tr: 'Henüz not eklenmemiş.',    en: 'No notes added yet.' },
    'apps.motivationLetter': { tr: 'Motivasyon Yazısı',        en: 'Cover Letter' },
    'apps.interviewNotes':   { tr: 'Mülakat Notları',          en: 'Interview Notes' },
    'apps.tags':             { tr: 'Etiketler',                en: 'Tags' },
    'apps.assessmentTest':   { tr: 'Değerlendirme Testi',      en: 'Assessment Test' },
    'apps.goToTest':         { tr: 'Teste Git ↗',             en: 'Go to Test ↗' },
    'apps.priority':         { tr: 'Öncelik',                  en: 'Priority' },
    'apps.salaryRange':      { tr: 'Maaş Aralığı',            en: 'Salary Range' },
    'apps.hrExpert':         { tr: 'İK Uzmanı',               en: 'HR Expert' },
    'apps.interviewDate':    { tr: 'Mülakat Tarihi',           en: 'Interview Date' },
    'apps.followUpDate':     { tr: 'Takip Tarihi',             en: 'Follow-up Date' },
    'apps.offerAmount':      { tr: 'Teklif Tutarı',            en: 'Offer Amount' },

    // ── Settings additions
    'settings.personalization':   { tr: 'Kişiselleştirme',                  en: 'Personalization' },
    'settings.manage':            { tr: 'Hesap, güvenlik ve tercihlerinizi yönetin.', en: 'Manage your account, security and preferences.' },
    'settings.firstName':         { tr: 'Ad',                               en: 'First Name' },
    'settings.lastName':          { tr: 'Soyad',                            en: 'Last Name' },
    'settings.email':             { tr: 'E-posta',                          en: 'Email' },
    'settings.profileInfo':       { tr: 'Profil bilgileri hesabınızdan alınır.', en: 'Profile info is pulled from your account.' },
    'settings.signOut':           { tr: 'Oturumu Kapat',                    en: 'Sign Out' },
    'settings.securityTitle':     { tr: 'Güvenlik',                         en: 'Security' },
    'settings.securitySub':       { tr: 'Hesabınızı güvende tutmak için şifrenizi düzenli olarak güncelleyin.', en: 'Update your password regularly to keep your account secure.' },
    'settings.changePassword':    { tr: 'Şifre Değiştir',                   en: 'Change Password' },
    'settings.changePassDesc':    { tr: 'Son şifre değişikliği: Bilinmiyor', en: 'Last changed: Unknown' },
    'settings.activeSessions':    { tr: 'Aktif Oturumlar',                  en: 'Active Sessions' },
    'settings.activeSessionsDesc':{ tr: 'Farklı cihazlardaki oturumlarınızı görün ve kapatın', en: 'View and close sessions across devices' },
    'settings.appearanceTitle':   { tr: 'Görünüm',                          en: 'Appearance' },
    'settings.appearanceSub':     { tr: 'Arayüz teması ve görünüm tercihleri.', en: 'Interface theme and display preferences.' },
    'settings.themeRow':          { tr: 'Tema',                             en: 'Theme' },
    'settings.themeDesc':         { tr: 'Açık, Koyu veya sistem varsayılanı', en: 'Light, Dark or system default' },
    'settings.themeLight':        { tr: 'Açık',                             en: 'Light' },
    'settings.themeDark':         { tr: 'Koyu',                             en: 'Dark' },
    'settings.themeSystem':       { tr: 'Sistem',                           en: 'System' },
    'settings.langTitle':         { tr: 'Dil',                              en: 'Language' },
    'settings.langDesc':          { tr: 'Uygulama arayüz dili',            en: 'Application interface language' },
    'settings.notifTitle':        { tr: 'Bildirimler',                      en: 'Notifications' },
    'settings.notifSub':          { tr: 'Hangi uyarıları almak istediğinizi seçin.', en: 'Choose which alerts you want to receive.' },
    'settings.weeklyReport':      { tr: 'Haftalık Rapor',                   en: 'Weekly Report' },
    'settings.weeklyReportDesc':  { tr: 'Her Pazartesi başvuru özetinizi alın', en: 'Get your application summary every Monday' },
    'settings.inactiveAlert':     { tr: 'Hareketsizlik Uyarısı',           en: 'Inactivity Alert' },
    'settings.inactiveAlertDesc': { tr: '7 gün başvuru yoksa hatırlatma',  en: 'Reminder if no applications for 7 days' },
    'settings.browserNotif':      { tr: 'Tarayıcı Bildirimleri',           en: 'Browser Notifications' },
    'settings.browserNotifDesc':  { tr: 'Takip tarihi gelen başvurular için masaüstü bildirimi', en: 'Desktop notifications for follow-up due applications' },
    'settings.activeLabel':       { tr: 'Aktif ✓',                         en: 'Active ✓' },
    'settings.allowNotif':        { tr: 'İzin Ver',                        en: 'Allow' },
    'settings.dataTitle':         { tr: 'Veri Yönetimi',                   en: 'Data Management' },
    'settings.dataSub':           { tr: 'Başvuru verilerinizi dışa aktarın veya silin.', en: 'Export or delete your application data.' },
    'settings.exportTitle':       { tr: 'Verileri Dışa Aktar',             en: 'Export Data' },
    'settings.importTitle':       { tr: 'Verileri İçe Aktar',              en: 'Import Data' },
    'settings.importDesc':        { tr: 'Daha önce dışa aktarılan JSON yedeğini geri yükle', en: 'Restore a previously exported JSON backup' },
    'settings.importBtn':         { tr: 'JSON Yükle',                      en: 'Upload JSON' },
    'settings.importingBtn':      { tr: 'Aktarılıyor...',                  en: 'Importing...' },
    'settings.exportBtn':         { tr: 'JSON İndir',                      en: 'Download JSON' },
    'settings.storageTitle':      { tr: 'Depolama',                        en: 'Storage' },
    'settings.storageDesc':       { tr: 'Veriler Firebase Firestore ve yerel olarak saklanır', en: 'Data stored on Firebase Firestore and locally' },
    'settings.storageCount':      { tr: 'başvuru',                         en: 'applications' },
    'settings.dangerTitle':       { tr: 'Tehlike Bölgesi',                 en: 'Danger Zone' },
    'settings.dangerSub':         { tr: 'Bu işlemler geri alınamaz. Dikkatli olun.', en: 'These actions cannot be undone. Be careful.' },
    'settings.wipeTitle':         { tr: 'Tüm Verileri Sil',               en: 'Delete All Data' },
    'settings.wipeDesc':          { tr: 'Tüm başvurular, geçmiş ve ayarlar kalıcı olarak silinir.', en: 'All applications, history and settings will be permanently deleted.' },
    'settings.wipeBtn':           { tr: 'Tüm Verileri Sil',               en: 'Delete All Data' },
    'settings.wipeWarning':       { tr: '⚠️ Bu işlem geri alınamaz!',     en: '⚠️ This action cannot be undone!' },
    'settings.wipeWarningDesc':   { tr: 'Tüm başvuru verileri kalıcı olarak silinecek. Emin misiniz?', en: 'All application data will be permanently deleted. Are you sure?' },
    'settings.wipeConfirm':       { tr: 'Evet, Sil',                      en: 'Yes, Delete' },
    'settings.wiping':            { tr: 'Siliniyor...',                    en: 'Deleting...' },
    'settings.themeUpdated':      { tr: 'Tema güncellendi',                en: 'Theme updated' },
    'settings.prefUpdated':       { tr: 'Tercih güncellendi',              en: 'Preference updated' },
    'settings.langChanged':       { tr: 'Dil değiştirildi',                en: 'Language changed' },
    'settings.oneSession':        { tr: 'Tek oturum aktif — bu cihaz',    en: 'One active session — this device' },
    'settings.passwordSoon':      { tr: 'Şifre güncelleme yakında aktif olacak', en: 'Password update coming soon' },
    'settings.notifGranted':      { tr: 'Bildirim izni verildi ✓',        en: 'Notification permission granted ✓' },
    'settings.notifDenied':       { tr: 'Bildirim izni reddedildi',        en: 'Notification permission denied' },
    'settings.notifUnsupported':  { tr: 'Bu tarayıcı bildirimleri desteklemiyor', en: 'Notifications not supported in this browser' },
    'settings.importedCount':     { tr: 'başvuru içe aktarıldı ✓',        en: 'applications imported ✓' },
    'settings.noValidApps':       { tr: 'Geçerli başvuru bulunamadı.',    en: 'No valid applications found.' },
    'settings.jsonError':         { tr: 'JSON dosyası okunamadı.',         en: 'Could not read JSON file.' },
    'settings.exportedCount':     { tr: 'başvuru dışa aktarıldı',         en: 'applications exported' },

    // ── Analytics
    'analytics.title':     { tr: 'Analiz',                  en: 'Analytics' },
    'analytics.label':     { tr: 'ANALİZ',                  en: 'ANALYTICS' },
    'analytics.noData':    { tr: 'Henüz yeterli veri yok.', en: 'Not enough data yet.' },
    'analytics.byStatus':  { tr: 'Durum Dağılımı',          en: 'Status Breakdown' },
    'analytics.byMonth':   { tr: 'Aylık Başvurular',        en: 'Monthly Applications' },
    'analytics.byPlatform':{ tr: 'Platforma Göre',          en: 'By Platform' },
    'analytics.byPosition':{ tr: 'Pozisyona Göre',          en: 'By Position' },
    'analytics.topCompany':{ tr: 'En Çok Başvurulan',       en: 'Most Applied' },
    'analytics.successRate':{ tr: 'Başarı Oranı',           en: 'Success Rate' },
    'analytics.total':     { tr: 'Toplam',                  en: 'Total' },
    'analytics.applications':{ tr: 'başvuru',               en: 'applications' },

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
        return (safeStorage.get('nextstep-lang') as Lang) ?? 'tr';
    });

    const setLang = (l: Lang) => {
        setLangState(l);
        safeStorage.set('nextstep-lang', l);
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
