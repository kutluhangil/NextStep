  <div align="center">                                                                                                                                                     
                                                                                                                                                                           
  ```                                                                                                                                                                      
  ███╗   ██╗███████╗██╗  ██╗████████╗                                                                                                                                      
  ████╗  ██║██╔════╝╚██╗██╔╝╚══██╔══╝                                                                                                                                      
  ██╔██╗ ██║█████╗   ╚███╔╝    ██║                                                                                                                                         
  ██║╚██╗██║██╔══╝   ██╔██╗    ██║                                                                                                                                         
  ██║ ╚████║███████╗██╔╝ ██╗   ██║                                                                                                                                         
  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝   ╚═╝                                
                                                                                                                                                                           
  ███████╗████████╗███████╗██████╗                                
  ██╔════╝╚══██╔══╝██╔════╝██╔══██╗                                                                                                                                        
  ███████╗   ██║   █████╗  ██████╔╝                                                                                                                                        
  ╚════██║   ██║   ██╔══╝  ██╔═══╝
  ███████║   ██║   ███████╗██║                                                                                                                                             
  ╚══════╝   ╚═╝   ╚══════╝╚═╝                                                                                                                                             
  ```
                                                                                                                                                                           
  <h3>Akıllı İş Başvurusu Takip Sistemi</h3>                                                                                                                               
   
  <br/>                                                                                                                                                                    
                                                                  
  **Tüm başvurularını tek ekranda yönet. CV'ni analiz et. Kariyerini verilerle geliştir.**                                                                                 
   
  *Excel tablolarından, kayıp tarihlerden ve "bu şirket bana dönmüş müydü?" anlarından kurtul — tek bir temiz ekrana geç.*                                                 
                                                                  
  <br/>                                                                                                                                                                    
                                                                  
  [![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)                                                
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)                                                   
  [![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)                             
  [![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=white)](https://firebase.google.com/)         
  [![Gemini](https://img.shields.io/badge/Gemini-1.5%20Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)                                
  [![Zustand](https://img.shields.io/badge/Zustand-state-f59e0b?style=flat-square)](https://zustand-demo.pmnd.rs/)                                                         
  [![License](https://img.shields.io/badge/License-Personal-2c3e50?style=flat-square)]()                                                                                   
                                                                                                                                                                           
  <br/>                                                                                                                                                                    
                                                                                                                                                                           
  [💡 Neden?](#-neden-yaptım) · [✨ Özellikler](#-özellikler) · [📸 Ekranlar](#-ekran-görüntüleri) · [🏗 Mimari](#-mimari) · [🚀 Kurulum](#-kurulum--çalıştırma) · [🗺 Yol   
  Haritası](#-yol-haritası)
                                                                                                                                                                           
  </div>                                                          

  ---

  ## 💡 Neden Yaptım?                                                                                                                                                      
  
  İş başvurusu süreci düşündüğümden çok daha kaotik çıktı. Dolayısıyla önce bir Excel tablosu açtım — sonra sütunlar çoğaldı, sekmeler çoğaldı, tarihler kayboldu.         
                                                                  
  ```                                                                                                                                                                      
  ◄───── İŞ ARAMA AKIŞI ─────►                                    
                                                                                                                                                                           
    LinkedIn ──┐
    Kariyer.net─┤   ┌──────────┐   ┌─────────────┐   ┌──────────┐                                                                                                          
    Indeed  ───┼──►│ Başvuru  │──►│  IK Döndü?  │──►│  Teklif  │                                                                                                           
    Direkt   ──┤   │  gönder  │   │ Test · Case │   │  veya    │                                                                                                           
    Referans ──┘   └──────────┘   └─────────────┘   │   Red    │                                                                                                           
                                                    └──────────┘                                                                                                           
                                                                                                                                                                           
         ↑                      ↑                     ↑                                                                                                                    
     Hangi CV?         Ne zamandı?             Hangi kriter?                                                                                                               
  ```                                                                                                                                                                      
                                                                                                                                                                           
  Excel her işe yarar ama iş takibi için tasarlanmamış. Bunun yerine **tam olarak ihtiyacım olan şeyi sıfırdan yazdım:**                                                   
                                                                  
  > *Her başvuru — platformu, cover letter'ı, IK notu, test linki, CV versiyonu dahil — tek bir karta sığıyor. Dashboard'da anlık durum. Analiz'de hangi CV'nin daha çok   
  döndüğü. Gemini AI ile ATS puanlaması. Her kullanıcı sadece kendi verisini görüyor.*
                                                                                                                                                                           
  Pratik bir ihtiyaç + React / TypeScript / Firebase stack'iyle derinlemesine çalışma fırsatı.                                                                             
  
  ---                                                                                                                                                                      
                                                                  
  ## 🌐 Canlı Demo                                                                                                                                                         
  
  > *(Yakında yayınlanacak — Vercel / Firebase Hosting)*                                                                                                                   
                                                                  
  ---                                                                                                                                                                      
                                                                  
  ## ✨ Özellikler

  Uygulama altı ana akış üzerine kurulu. Her akış bağımsız sayfaya karşılık geliyor, hepsi aynı Firestore şemasını paylaşıyor.                                             
  
  ### 🔐 Kimlik Doğrulama                                                                                                                                                  
                                                                  
  | Özellik | Detay |                                                                                                                                                      
  |---|---|                                                       
  | ✉️  E-posta / şifre | Firebase Authentication |
  | 🔁 Şifre sıfırlama | E-posta ile doğrulama bağlantısı |                                                                                                                
  | 🔒 Veri izolasyonu | Firestore security rules — her kullanıcı sadece kendi `uid`'sindeki dokümanları görebilir |                                                       
                                                                                                                                                                           
  ### 📊 Dashboard                                                                                                                                                         
                                                                                                                                                                           
  ```                                                             
  ┌───────────────────────────────────────────────────────────────┐
  │   Merhaba Kutluhan · 20 Nisan Pazar                           │                                                                                                        
  ├──────────┬──────────┬──────────┬──────────┬───────────────────┤                                                                                                        
  │  TOPLAM  │  BU AY   │ SÜREÇTE  │ OLUMLU   │                   │                                                                                                        
  │    47    │    12    │    8     │    3     │                   │                                                                                                        
  ├──────────┴──────────┴──────────┴──────────┘                   │                                                                                                        
  │                                                               │                                                                                                        
  │  Son Hareketler                                               │
  │  ─────────────                                                │                                                                                                        
  │  • Trendyol     · Görüşme  · 18 Nis · LinkedIn  · CV v3       │
  │  • Getir        · Red      · 15 Nis · Kariyer   · CV v3       │                                                                                                        
  │  • Hepsiburada  · Teklif   · 12 Nis · Doğrudan  · CV v4       │                                                                                                        
  └───────────────────────────────────────────────────────────────┘                                                                                                        
  ```                                                                                                                                                                      
                                                                                                                                                                           
  ### ➕ Başvuru Ekle                                             
                                                                                                                                                                           
  Tek form, kapsamlı kayıt:                                                                                                                                                
  
  | Alan | Detay |                                                                                                                                                         
  |---|---|                                                       
  | 🏢 Temel bilgiler | Firma · Pozisyon · Başvuru Tarihi · Durum |
  | 🌍 Konum | Şehir · Ülke · Remote/Hybrid/Ofis · Sözleşme Türü |                                                                                                         
  | 🔗 Kaynak | Platform (LinkedIn, Kariyer.net, Indeed, Doğrudan…) · İlan Linki |                                                                                         
  | 📄 Belgeler | CV Versiyonu · Test Linki · Cover Letter metni |                                                                                                         
  | 👥 Süreç | IK Görüşmesi Notu · Diğer Mülakatlar · Geri Bildirimler |                                                                                                   
                                                                                                                                                                           
  ### 📋 Başvurular                                                                                                                                                        
                                                                                                                                                                           
  Tek bir tabloda tüm geçmiş. Arama · duruma göre filtre · Excel/PDF dışa aktar · satıra tıklayınca detay sayfası · ilana tek tıkla erişim.                                
  
  ### 📈 Analiz                                                                                                                                                            
                                                                  
  | Metrik | Görselleştirme |                                                                                                                                              
  |---|---|                                                       
  | 🎯 Mülakat dönüş oranı | Single KPI |
  | 📆 Aylık başvuru hızı | Bar chart |                                                                                                                                    
  | 🟠 Durum dağılımı | Donut chart |                                                                                                                                      
  | 📑 CV versiyonu performansı | Yatay bar (dönüş %'si) |                                                                                                                 
  | 💬 Cover letter etkisi | Karşılaştırma paneli |                                                                                                                        
  | 📉 Başvuru trendi | Çizgi grafik (cumulative) |                                                                                                                        
                                                                                                                                                                           
  ### 📄 CV Analizi                                                                                                                                                        
                                                                                                                                                                           
  ```                                                             
  ┌──────────────┐   ┌────────────────────┐   ┌──────────────┐
  │  PDF yükle   │──►│  pdf.js ile parse  │──►│  ATS skoru   │                                                                                                             
  │  (max 5 MB)  │   │  → metin çıkarımı  │   │   0 – 100    │                                                                                                             
  └──────────────┘   └────────────────────┘   └──────┬───────┘                                                                                                             
                                                     │                                                                                                                     
                            ┌────────────────────────┘                                                                                                                     
                            ▼                                                                                                                                              
  ┌─────────────────────────────────────────────────────────────┐ 
  │  Bölüm bazlı puanlar                                        │                                                                                                          
  │  ────────────────────                                       │
  │  • Anahtar kelimeler     ████████░░   78 / 100              │                                                                                                          
  │  • İletişim bilgileri    ██████████   95 / 100              │                                                                                                          
  │  • Bölüm başlıkları      ███████░░░   72 / 100              │                                                                                                          
  │  • İçerik uzunluğu       ████████░░   82 / 100              │                                                                                                          
  │                                                             │                                                                                                          
  │  Gemini AI serbest soru                                     │                                                                                                          
  │  ────────────────────                                       │                                                                                                          
  │  "Bu CV yazılım mühendisi ilanına uygun mu?"    [Sor →]    │
  └─────────────────────────────────────────────────────────────┘                                                                                                          
  ```                                                             
                                                                                                                                                                           
  ### 🌐 Çoklu Dil                                                

  Türkçe / İngilizce — landing sayfasından tek tıkla.                                                                                                                      
  
  ### 📱 Mobile-First Tasarım                                                                                                                                              
                                                                  
  Tamamen responsive. Masaüstü'de sidebar, mobilde alt navigasyon çubuğu. Touch-friendly: tüm butonlar 44 × 44 px minimum.                                                 
  
  ---                                                                                                                                                                      
                                                                  
  ## 📸 Ekran Görüntüleri                                                                                                                                                  
  
  <table>                                                                                                                                                                  
    <tr>                                                          
      <td align="center">
        <strong>🏠 Dashboard</strong><br/>                                                                                                                                 
        <img src="./public/screen-dashboard.png" alt="Dashboard" />
      </td>                                                                                                                                                                
      <td align="center">                                         
        <strong>➕ Başvuru Ekle</strong><br/>                                                                                                                              
        <img src="./public/screen-add.png" alt="Başvuru Ekle" />                                                                                                           
      </td>
    </tr>                                                                                                                                                                  
    <tr>                                                          
      <td align="center">
        <strong>📋 Tüm Başvurular</strong><br/>                                                                                                                            
        <img src="./public/screen-applications.png" alt="Başvurular" />
      </td>                                                                                                                                                                
      <td align="center">                                                                                                                                                  
        <strong>📄 CV Analizi</strong><br/>
        <img src="./public/screen-cv.png" alt="CV Analizi" />                                                                                                              
      </td>                                                                                                                                                                
    </tr>
    <tr>                                                                                                                                                                   
      <td align="center" colspan="2">                             
        <strong>📈 Analiz</strong><br/>
        <img src="./public/screen-analytics.png" alt="Analiz" />                                                                                                           
      </td>
    </tr>                                                                                                                                                                  
  </table>                                                        

  ---

  ## 🛠 Kullanılan Teknolojiler                                                                                                                                             
  
  | Katman | Teknoloji | Neden |                                                                                                                                           
  |--------|-----------|-------|                                  
  | **Frontend** | React 18 · TypeScript · Vite 6 | Modern DX, sıfır-config HMR, tip güvenliği |                                                                           
  | **Stil** | Tailwind CSS · Framer Motion | Utility-first, animasyonlar akıcı ve deklaratif |                                                                            
  | **State** | Zustand | Redux'un boilerplate'i olmadan global state |                                                                                                    
  | **Routing** | React Router DOM v6 | Nested layout desteği + loader API |                                                                                               
  | **Auth** | Firebase Authentication | E-posta + reset akışı out-of-the-box |                                                                                            
  | **Veritabanı** | Firestore | Real-time sync + kullanıcı bazlı security rules |                                                                                         
  | **AI** | Google Gemini 1.5 Flash | Ücretsiz tier + JSON mode + hızlı yanıt |                                                                                           
  | **CV Parse** | pdf.js | Tarayıcıda PDF → metin, sunucuya yük yok |                                                                                                     
  | **Export** | xlsx · jsPDF + AutoTable | Excel ve PDF çıktıları client-side |                                                                                           
  | **Grafik** | Recharts | Declarative, responsive, SVG-based |                                                                                                           
  | **E-posta** | EmailJS | Backend'siz iletişim formu |                                                                                                                   
  | **İkon** | Lucide React | Temiz, tek stilde, tree-shakable |                                                                                                           
                                                                                                                                                                           
  ---                                                                                                                                                                      
                                                                                                                                                                           
  ## 🏗 Mimari                                                     

  NextStep **client-side first**. Gerçek zamanlı Firestore dinleyicileri, tip-güvenli servis katmanı ve global Zustand store üzerine kurulu.                               
  
  ```                                                                                                                                                                      
  ┌──────────────────────────────────────────────────────────────┐
  │                         main.tsx                             │
  │          (React root · Router · global providers)            │
  └──────────┬──────────────────────────────┬────────────────────┘                                                                                                         
             │                              │
     ┌───────▼────────┐              ┌──────▼────────────────┐                                                                                                             
     │    pages/      │              │     components/        │                                                                                                            
     │ ────────────   │              │     ─────────          │                                                                                                            
     │ Dashboard      │              │ analytics/ · charts    │                                                                                                            
     │ Applications   │              │ applications/ · table  │                                                                                                            
     │ AddApplication │              │ layout/ · Nav + Bottom │                                                                                                            
     │ Analytics      │              │ Icons/ · SVG + logo    │                                                                                                            
     │ CV             │              └────────────────────────┘                                                                                                            
     │ auth/ (Login…) │                                                                                                                                                    
     └───────┬────────┘                                                                                                                                                    
             │                                                                                                                                                             
     ┌───────▼────────┐   ┌──────────────┐   ┌────────────────┐                                                                                                            
     │    hooks/      │   │    store/    │   │    services/   │   
     │ ────────────── │   │ ──────────── │   │ ──────────── │                                                                                                              
     │ useAuth        │◄──│ useAppStore  │◄──│ firebase.ts    │                                                                                                            
     │ useFirestore   │   │ (Zustand)    │   │ gemini.ts      │                                                                                                            
     │ useLocale      │   │              │   │ export.ts      │                                                                                                            
     └────────────────┘   └──────────────┘   └──────┬─────────┘                                                                                                            
                                                    │                                                                                                                      
                                      ┌─────────────┼─────────────┐                                                                                                        
                                      ▼             ▼             ▼                                                                                                        
                               ┌──────────┐  ┌──────────┐  ┌──────────┐
                               │ Firebase │  │  Gemini  │  │ EmailJS  │                                                                                                    
                               │ Auth +   │  │   API    │  │  (opt.)  │
                               │Firestore │  │          │  │          │                                                                                                    
                               └──────────┘  └──────────┘  └──────────┘                                                                                                    
  ```                                                                                                                                                                      
                                                                                                                                                                           
  > 🔒 **Güvenlik kuralı:** Firestore security rules `allow read, write: if request.auth.uid == resource.data.ownerId;` — başka kullanıcıya ait dokümanı okumak *imkânsız*.
  
  ### Proje Yapısı                                                                                                                                                         
                                                                  
  ```
  src/
  ├── components/
  │   ├── analytics/        ← Grafik ve KPI bileşenleri                                                                                                                    
  │   ├── applications/     ← Başvuru tablosu + filtre
  │   ├── Icons/            ← SVG ikonlar + NEXT.svg logo                                                                                                                  
  │   └── layout/           ← Navbar · BottomNav · Sidebar                                                                                                                 
  ├── hooks/                ← useAuth · useFirestore · useLocale                                                                                                           
  ├── pages/                                                                                                                                                               
  │   ├── auth/             ← Login · Register · ForgotPassword                                                                                                            
  │   ├── AddApplication.tsx                                      
  │   ├── Analytics.tsx                                                                                                                                                    
  │   ├── Applications.tsx                                                                                                                                                 
  │   ├── CV.tsx
  │   ├── Dashboard.tsx                                                                                                                                                    
  │   └── LandingPage.tsx                                                                                                                                                  
  ├── services/             ← Firebase · Gemini API · Export helpers
  ├── store/                ← Zustand (useAppStore)                                                                                                                        
  ├── types/                ← TypeScript arayüzleri               
  └── main.tsx                                                                                                                                                             
  ```                                                             
                                                                                                                                                                           
  ---                                                             

  ## 🔬 Veri Modeli                                                                                                                                                        
  
  Her başvuru tek bir Firestore dokümanına karşılık gelir:                                                                                                                 
                                                                  
  ```typescript                                                                                                                                                            
  interface Application {
    id: string;              // Firestore doc id                                                                                                                           
    ownerId: string;         // Firebase Auth uid  → security rule
    company: string;                                                                                                                                                       
    position: string;
    appliedAt: Timestamp;                                                                                                                                                  
    status: 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';                                                                                                  
    location: {
      city: string;                                                                                                                                                        
      country: string;                                            
      workMode: 'remote' | 'hybrid' | 'office';                                                                                                                            
      contract: 'fullTime' | 'partTime' | 'intern' | 'contract';  
    };                                                                                                                                                                     
    source: {
      platform: 'linkedin' | 'kariyernet' | 'indeed' | 'direct' | 'referral';                                                                                              
      postingUrl?: string;                                                                                                                                                 
    };
    documents: {                                                                                                                                                           
      cvVersion: string;                                          
      coverLetter?: string;                                                                                                                                                
      testUrl?: string;
    };                                                                                                                                                                     
    interviews: InterviewRound[];                                 
    notes: string;                                                                                                                                                         
    createdAt: Timestamp;
    updatedAt: Timestamp;                                                                                                                                                  
  }                                                               
  ```

  ### ATS Skor Algoritması                                                                                                                                                 
  
  ```                                                                                                                                                                      
  ATS score = Σ (sectionWeight × sectionScore)                    
                                                                                                                                                                           
  Bölüm                  Ağırlık     Kriter
  ─────                  ───────     ──────                                                                                                                                
  Anahtar kelimeler      0.30        İlanla örtüşme oranı                                                                                                                  
  İletişim bilgileri     0.15        E-posta + telefon + LinkedIn                                                                                                          
  Bölüm başlıkları       0.20        "Experience", "Education", "Skills"                                                                                                   
  İçerik uzunluğu        0.15        1–2 sayfa ideal                                                                                                                       
  Aksiyon fiilleri       0.10        "led", "built", "shipped"                                                                                                             
  Metrik / sayı          0.10        "%30 artış", "3 milyon kullanıcı"                                                                                                     
                                                                                                                                                                           
  final 0 – 100 → Gemini'ye context olarak geçer                                                                                                                           
  ```                                                                                                                                                                      
                                                                  
  ---                                                                                                                                                                      
                                                                  
  ## 🚀 Kurulum & Çalıştırma                                                                                                                                               
  
  ### Gereksinimler                                                                                                                                                        
                                                                  
  - **Node.js** ≥ 18
  - **npm** veya **yarn**
  - **Firebase** projesi (Auth + Firestore)
  - **Google Gemini** API anahtarı ([ai.google.dev](https://ai.google.dev/))                                                                                               
                                                                                                                                                                           
  ### Adımlar                                                                                                                                                              
                                                                                                                                                                           
  ```bash                                                         
  # 1 · Repoyu klonla
  git clone https://github.com/kutluhangil/Job-Tracking-Web-Form.git                                                                                                       
  cd Job-Tracking-Web-Form                                                                                                                                                 
                                                                                                                                                                           
  # 2 · Bağımlılıkları yükle                                                                                                                                               
  npm install                                                                                                                                                              
                                                                  
  # 3 · Ortam değişkenlerini kopyala ve doldur
  cp .env.example .env.local                                                                                                                                               
  
  # 4 · Geliştirme sunucusunu başlat                                                                                                                                       
  npm run dev                                                     
  # ► http://localhost:5173
  ```                                                                                                                                                                      
  
  ### Komutlar                                                                                                                                                             
                                                                  
  ```bash
  npm run dev        # Vite dev server · HMR
  npm run build      # Production bundle → dist/
  npm run preview    # dist/ üzerinde preview                                                                                                                              
  npm run lint       # ESLint + TypeScript tip kontrolü
  ```                                                                                                                                                                      
                                                                  
  ### Mobil Cihazda Test                                                                                                                                                   
                                                                  
  Aynı Wi-Fi ağındaki telefondan erişmek için:                                                                                                                             
                                                                  
  ```bash                                                                                                                                                                  
  ipconfig getifaddr en0        # Mac'in yerel IP'sini al         
  # Telefonda aç: http://192.168.x.x:5173                                                                                                                                  
  ```                                                                                                                                                                      
                                                                                                                                                                           
  ---                                                                                                                                                                      
                                                                  
  ## 🔑 Ortam Değişkenleri                                                                                                                                                 
  
  `.env.local` dosyası oluştur ve doldur:                                                                                                                                  
                                                                  
  ```env                                                                                                                                                                   
  # Firebase                                                      
  VITE_FIREBASE_API_KEY=...
  VITE_FIREBASE_AUTH_DOMAIN=...
  VITE_FIREBASE_PROJECT_ID=...                                                                                                                                             
  VITE_FIREBASE_STORAGE_BUCKET=...
  VITE_FIREBASE_MESSAGING_SENDER_ID=...                                                                                                                                    
  VITE_FIREBASE_APP_ID=...                                        
                                                                                                                                                                           
  # Google Gemini                                                 
  VITE_GEMINI_API_KEY=...
                                                                                                                                                                           
  # EmailJS (opsiyonel — iletişim formu için)
  VITE_EMAILJS_SERVICE_ID=...                                                                                                                                              
  VITE_EMAILJS_TEMPLATE_ID=...                                                                                                                                             
  VITE_EMAILJS_PUBLIC_KEY=...
  ```                                                                                                                                                                      
                                                                                                                                                                           
  > 🔐 `.env.local` hiçbir zaman commit edilmez — `.gitignore`'da zaten dışlanmış durumda.                                                                                 
                                                                                                                                                                           
  ---                                                                                                                                                                      
                                                                  
  ## 🗺 Yol Haritası

  | Durum | Özellik |
  |:---:|---|
  | ✅ | E-posta / şifre ile kayıt + giriş |                                                                                                                               
  | ✅ | Firestore kullanıcı bazlı izolasyon |                                                                                                                             
  | ✅ | Dashboard — KPI + son hareketler |                                                                                                                                
  | ✅ | Başvuru CRUD + detay sayfası |                                                                                                                                    
  | ✅ | Arama · filtre · Excel / PDF export |                                                                                                                             
  | ✅ | Analiz — 6 grafik + KPI |                                
  | ✅ | CV Analizi — ATS skor + Gemini serbest soru |                                                                                                                     
  | ✅ | Türkçe / İngilizce i18n |                                                                                                                                         
  | ✅ | Mobile-first responsive + bottom nav |                                                                                                                            
  | 🔄 | Canlı deploy (Vercel / Firebase Hosting) |                                                                                                                        
  | 🔄 | E-mail verification akışı |                                                                                                                                       
  | ○ | Google / GitHub OAuth ile giriş |                                                                                                                                  
  | ○ | Başvuru hatırlatma (takvim entegrasyonu) |                                                                                                                         
  | ○ | Şirket bazlı trend raporu |                                                                                                                                        
  | ○ | Chrome extension — LinkedIn'den tek tıkla kayıt |                                                                                                                  
  | ○ | Kariyer koçu moduna Gemini prompt template'leri |                                                                                                                  
  | ○ | Dark mode |                                                                                                                                                        
                                                                                                                                                                           
  <sub>✅ Bitti · 🔄 Yapılıyor · ○ Planlanıyor</sub>                                                                                                                       
                                                                                                                                                                           
  ---                                                                                                                                                                      
                                                                  
  ## 🛠 Teknik Notlar

  ```
  Framework      React 18 · functional + hooks
  Language       TypeScript 5 · strict · noImplicitAny                                                                                                                     
  Build tool     Vite 6 · SWC JSX transform                                                                                                                                
  Router         React Router DOM v6 · lazy loading                                                                                                                        
  State          Zustand · persist middleware                                                                                                                              
  Styling        Tailwind CSS · PostCSS · Framer Motion                                                                                                                    
  Forms          Native + controlled inputs (RHF yerine sade)                                                                                                              
  Auth + DB      Firebase SDK v10 · modular                                                                                                                                
  AI             Gemini 1.5 Flash · JSON mode · streaming cevap                                                                                                            
  PDF parse      pdf.js · client-side text extraction                                                                                                                      
  Export         xlsx · jsPDF + AutoTable                                                                                                                                  
  Charts         Recharts · responsive container                                                                                                                           
  i18n           Context + JSON lokalize dosyalar (react-i18next yerine hafif)                                                                                             
  Deploy         GitHub Actions → Firebase Hosting (planlı)                                                                                                                
  ```                                                                                                                                                                      
                                                                                                                                                                           
  ---                                                                                                                                                                      
                                                                  
  ## 👤 Geliştirici                                                                                                                                                        
  
  <table>                                                                                                                                                                  
    <tr>                                                          
      <td align="center" width="100%">
        <br/>                                                                                                                                                              
        <strong>Kutluhan Gül</strong><br/>
        <em>Full Stack Developer</em>                                                                                                                                      
        <br/><br/>                                                                                                                                                         
        <a href="https://github.com/kutluhangil">
          <img src="https://img.shields.io/badge/GitHub-kutluhangil-181717?style=flat-square&logo=github&logoColor=white" />                                               
        </a>                                                                                                                                                               
        <a href="https://www.linkedin.com/in/kutluhangil/">
          <img src="https://img.shields.io/badge/LinkedIn-kutluhangil-0A66C2?style=flat-square&logo=linkedin&logoColor=white" />                                           
        </a>                                                                                                                                                               
        <br/><br/>                                                                                                                                                         
      </td>                                                                                                                                                                
    </tr>                                                         
  </table>                                                                                                                                                                 
  
  > Bu proje tamamen bireysel olarak, kişisel ihtiyaçtan doğarak geliştirildi.                                                                                             
  > İş arama sürecini daha sistematik ve veri odaklı hale getirmek için tasarlandı.                                                                                        
                                                                                                                                                                           
  ---                                                                                                                                                                      
                                                                                                                                                                           
  ## 📄 Lisans                                                    

  Kişisel kullanım ve portföy amacıyla geliştirilmiştir.                                                                                                                   
  © 2026 **NextStep** — Kutluhan Gül. Tüm hakları saklıdır.
                                                                                                                                                                           
  ---                                                             
                                                                                                                                                                           
  <div align="center">                                            

  *"Başvurular bir olasılık oyunudur.*                                                                                                                                     
  *Veri tutmak o oyunu satrança çevirir."*
                                                                                                                                                                           
  <br/>                                                           
                                                                                                                                                                           
  ⭐ **Repoyu beğendiysen star atmayı unutma!**                                                                                                                            
  
  </div>  
