# NextStep — QA Hazırlık Belgesi

## Projeye Genel Bakış

**NextStep**, React + TypeScript + Firebase ile yazılmış bir iş başvurusu takip uygulamasıdır.

- **Stack:** React 19, Vite, Tailwind CSS v4, Zustand, Firebase (Auth + Firestore), Framer Motion
- **Deployment:** Vercel (vercel.json mevcut)
- **Dil:** Türkçe / İngilizce (i18n destekli)

---

## Yapılan Düzeltmeler

Bu oturumda tespit edilip düzeltilen hatalar:

| # | Dosya | Hata | Düzeltme |
|---|-------|------|----------|
| 1 | `Dashboard.tsx` | `statusColor` map'te `'Olumsuz'` key'i vardı; ancak ApplicationStatus tipi `'Reddedildi'` kullanıyor — hiçbir başvuruda kırmızı renk çalışmıyordu | `'Reddedildi'`, `'Teknik Mülakat'`, `'İK Mülakatı'`, `'Vaka / Ödev'`, `'Yanıt Yok'` renkleri eklendi |
| 2 | `ForgotPassword.tsx` | Tüm akış mock/sahte `setTimeout` ile simüle ediliyordu; Firebase `resetPassword` hiç çağrılmıyordu. Üstelik "Step 2" şifre girişi de sahte (Firebase email-link ile çalışır) | Gerçek `resetPassword` Firebase çağrısına geçildi, tek adımlı sade akışa dönüştürüldü |
| 3 | `GeminiWidget.tsx` | Hazır soru butonları `setInput(q); setTimeout(send, 0)` yapıyordu — `send` eski `input` değerini (boş string) yakaladığı için hiç mesaj gönderilmiyordu (stale closure bug) | Send mantığı butona satır içine taşındı |
| 4 | `CV.tsx` | ATS skor bar genişliği tüm kategoriler için `v / 30` ile hesaplanıyordu; oysa her kategorinin max değeri farklı (30, 25, 20, 20, 5) | Her kategori kendi max değerine göre hesaplanıyor, "X / max" formatında gösteriliyor |
| 5 | `Applications.tsx` | Filtre dropdown sadece 5 durumu listeniyor; `Teknik Mülakat`, `İK Mülakatı`, `Vaka / Ödev`, `İptal`, `Yanıt Yok` yoktu | Tüm 10 durum eklendi |
| 6 | `LandingPage.tsx` | "Nasıl Çalışır" bölümü 4. adım başlığı `'Geliş'` yazıyordu (eksik kelime) | `'Gelişim'` olarak düzeltildi |
| 7 | `Settings.tsx` | `isDark = theme === 'dark'` kullanılıyordu — `'system'` teması seçiliyken ve OS koyu moddaysa Ayarlar sayfası açık modda görünüyordu | `useDark()` hook'u kullanılacak şekilde güncellendi |

---

## Kullanıcının Yapması Gerekenler

### 1. Ortam Değişkenleri (`.env.local`) — ZORUNLU

Proje root dizininde `.env.local` dosyası oluşturulmalı. Bu dosya `.gitignore`'da ve olmadan uygulama çalışmaz.

```env
# Firebase (ZORUNLU)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Gemini AI (İSTEĞE BAĞLI — CV analizi ve widget için)
VITE_GEMINI_API_KEY=

# EmailJS (İSTEĞE BAĞLI — geri bildirim formu için)
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

> EmailJS veya Gemini anahtarı yoksa ilgili özellikler devre dışı kalır veya `mailto:` fallback devreye girer — hata vermez.

---

### 2. Firebase Projesi Ayarları

Firebase Console'da (`console.firebase.google.com`) yapılması gerekenler:

#### Authentication
- **Email/Password** provider etkinleştirilmeli
- İzin verilen domainler: `localhost`, `nextstep.app` (veya Vercel URL)

#### Firestore Database
- Veritabanı oluşturulmalı (production veya test mode)
- Aşağıdaki güvenlik kuralları uygulanmalı:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /applications/{docId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

> Mevcut durumda `applications` koleksiyonu `userId` alanına göre sorgulanıyor. Firestore'da bu sorgunun çalışması için **bileşik index** gerekebilir:
> - Koleksiyon: `applications`
> - Alan 1: `userId` (Ascending)
> - Alan 2: `createdAt` (Descending)
>
> Firestore bu index'i ilk sorgu hatasında Console'da otomatik link olarak sunar.

---

### 3. Vercel Deployment

```bash
# Vercel CLI kurulu değilse:
npm i -g vercel@latest

# Deploy:
vercel --prod
```

Vercel Dashboard'da tüm `VITE_*` env değişkenleri **Production** ortamı için eklenmelidir.

---

## QA Test Senaryoları

### Auth Akışı
- [ ] Kayıt ol (yeni email + şifre)
- [ ] Giriş yap (email + şifre)
- [ ] "Beni Hatırla" seçeneğiyle tarayıcı kapatıp açtıktan sonra email alanının dolu gelmesi
- [ ] Şifremi Unuttum → email gelip gelmediğini kontrol et
- [ ] Yanlış şifreyle giriş → hata mesajı görünmeli
- [ ] Giriş yaptıktan sonra `/` sayfasına gidince `/dashboard`'a yönlendirme
- [ ] Çıkış yap → `/` sayfasına dönüş

### Dashboard
- [ ] Tüm durum renklerinin doğru görünmesi (özellikle `Reddedildi`, `Teknik Mülakat`)
- [ ] Karşılama banner'ında kullanıcı adı görünmesi
- [ ] İstatistik kartlarının doğru sayıları göstermesi
- [ ] "Son Hareketler" tablosunda son 5 başvuru görünmesi
- [ ] "Tümünü Gör" butonunun `/applications` sayfasına gitmesi

### Başvuru Ekleme
- [ ] Firma ve pozisyon zorunlu alan kontrolü
- [ ] Başarılı kayıt → toast mesajı → `/dashboard`'a yönlendirme
- [ ] Firebase'de verinin gerçekten oluştuğunu kontrol et (Firestore Console)

### Başvurular Sayfası
- [ ] Arama (firma adı ve pozisyon)
- [ ] Tüm 10 durum filtresi çalışıyor mu?
- [ ] Tarih ve firma adına göre sıralama
- [ ] Excel export → dosya indirilmeli
- [ ] PDF export → dosya indirilmeli
- [ ] "Detaylar" modalının açılıp kapanması
- [ ] Test linki varsa modal içinde tıklanabilmeli

### Analiz Sayfası
- [ ] Hiç başvuru yokken tüm "Veri yok" alanlarının görünmesi
- [ ] Başvuru ekleyince grafiklerin güncellenmesi
- [ ] Mülakat Oranı hesabının doğruluğu
- [ ] Motivasyon Etkisi widget'ının mantıklı değerler göstermesi

### CV Analizi
- [ ] PDF sürükle-bırak çalışması
- [ ] PDF seçince analiz başlaması
- [ ] ATS skor ring animasyonu
- [ ] Her breakdown barının doğru oranda dolması (v / kategorinin max değeri)
- [ ] Gemini anahtarı varsa soru-cevap çalışması
- [ ] Gemini anahtarı yoksa anlamlı hata mesajı

### Ayarlar
- [ ] Tema değişikliği → tüm sayfalarda etki göstermeli (özellikle System modu)
- [ ] "Tüm Verileri Sil" onay akışı ve Firebase'den silme
- [ ] JSON export → dosya indirilmeli
- [ ] Geri bildirim gönderme (EmailJS varsa email, yoksa mailto açılmalı)
- [ ] Oturumu Kapat → anasayfaya dönüş

### Gemini Widget
- [ ] Widget butonuna tıklayınca açılması
- [ ] Hazır soru butonlarına tıklayınca mesaj gönderilmesi
- [ ] Enter tuşuyla mesaj gönderme
- [ ] Sohbet temizleme ("Sıfırla") butonu

### Dil Desteği
- [ ] TR/EN dil değişimi Landing Page'de
- [ ] Dil tercihinin localStorage'da saklanması
- [ ] Sayfa yenilendikten sonra tercih korunması

### Dark Mode
- [ ] Açık / Koyu / Sistem seçenekleri
- [ ] Sistem seçiliyken OS temasının takip edilmesi
- [ ] Ayarlar sayfasının da doğru tema ile gösteriyor olması

### Responsive
- [ ] Mobil (375px): FloatingDock, formlar, tablolar
- [ ] Tablet (768px): Grid düzeni
- [ ] Desktop (1280px+): Tam layout

---

## Bilinen Sınırlamalar (Bug Değil)

| Alan | Durum |
|------|-------|
| Şifre Değiştirme (Ayarlar) | Henüz implement edilmemiş — "yakında" toast gösterir |
| Aktif Oturumlar (Ayarlar) | Henüz implement edilmemiş — single session mesajı gösterir |
| Analytics → Ortalama Yanıt Süresi | Gerçek veri değil, dekoratif grafik (başvuru tarihine dayalı tahmin) |
| Analytics → Mülakat Oranı "endüstri ortalaması" | Sabit metin, gerçek karşılaştırma değil |
| Landing Page → "0 Sunucu" istatistiği | Yanıltıcı: Firebase cloud kullanılıyor, sıfır değil |
| CV → ATS Skoru | Basit keyword matching, gerçek ATS motorundan farklı |

---

## Lokal Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# .env.local dosyasını oluştur (yukarıdaki şablona bakın)

# Geliştirme sunucusunu başlat
npm run dev

# Type kontrolü
npx tsc --noEmit

# Production build
npm run build
```

---

## Dosya Yapısı Özeti

```
src/
├── App.tsx              # Router + Firebase auth listener
├── main.tsx             # Entry point + LanguageProvider
├── store/
│   └── useAppStore.ts   # Zustand store (state + Firebase actions)
├── lib/
│   ├── firebase.ts      # Firebase init (env vars'dan)
│   ├── authService.ts   # Auth fonksiyonları
│   ├── firestoreService.ts  # CRUD + wipe
│   └── i18n.tsx         # TR/EN çeviriler + context
├── layouts/
│   └── AppLayout.tsx    # FloatingDock + GeminiWidget + page outlet
├── pages/
│   ├── LandingPage.tsx  # Giriş sayfası
│   ├── Dashboard.tsx    # Ana panel
│   ├── Applications.tsx # Başvuru listesi + filtre + export
│   ├── AddApplication.tsx # Başvuru ekleme formu
│   ├── Analytics.tsx    # Grafik widget'ları
│   ├── CV.tsx           # PDF yükleme + ATS + Gemini
│   ├── Settings.tsx     # Profil, tema, bildirim, veri yönetimi
│   └── auth/
│       ├── Login.tsx
│       ├── Register.tsx
│       └── ForgotPassword.tsx
├── components/
│   ├── common/
│   │   ├── FloatingDock.tsx
│   │   ├── GeminiWidget.tsx
│   │   ├── Reveal.tsx
│   │   └── Typography.tsx
│   └── layout/
│       ├── Navbar.tsx
│       └── AboutModal.tsx
└── hooks/
    ├── useDark.ts       # isDark boolean (sistem teması destekli)
    └── useTheme.ts      # <html data-theme> uygular
```
