# MİNO - İş Başvuru Takip Sistemi

## Overview

Geleneksel ve karmaşık Excel tabanlı iş başvuru takibini, Apple (Mac Mini) minimalizmine sahip, premium ve yüksek performanslı bir web uygulamasına dönüştürüyoruz.
Proje, Socratic Gate kararlarıyla **Floating Mac-style Dock & Typographic Canvas** (standart sol menü reddedildi) ve **Zustand + LocalStorage** (çevrimdışı/mock Firebase) ile şekillenmiştir.

## Project Type

**WEB** (React, TypeScript) -> `frontend-specialist`

## Success Criteria

- [ ] Apple benzeri minimalist ve akıcı "Wow" efekti hissettiren arayüz.
- [ ] "Left-Sidebar + Navbar" SaaS klişesinden uzak durularak "Floating Dock" ile çalışmak.
- [ ] Verilerin Firebase öncesi Zustand ile tarayıcıda izole / kalıcı (offline) olarak saklanması.
- [ ] Animasyonların (Framer Motion) her yerde kesintisiz bir deneyim sunması.
- [ ] Core Web Vitals ölçümlerinde ve Lighthouse skorunda 90+ başarı.
- [ ] Mobil cihazlarda kusursuz kullanım.

## Tech Stack

- **Framework:** React 18+ (Vite)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS v4 (Özelleştirilmiş, margin ve typo odaklı)
- **Animation:** Framer Motion (GPU hızlandırmalı pürüzsüz geçişler)
- **State Management:** Zustand (Persist middleware modülü ile)
- **Routing:** React Router DOM
- **Charts:** Recharts (Minimalize edilmiş temayla)
- **Icons:** Lucide React

## File Structure

```
src/
├── assets/          # Görseller ve statik dosyalar
├── components/      # Reusable bileşenler (Dock, Buttons, Animations)
├── features/        # Modüler özellikler (Auth, Dashboard, Tracker)
├── hooks/           # Özel hook'lar
├── layouts/         # Temel layout ve Dock frame
├── pages/           # Route ekranları (Landing, Dashboard, Auth)
├── store/           # Zustand stateleri
├── styles/          # Tailwind globals, değişkenler
└── utils/           # Helper fonksiyonlar
```

## Task Breakdown

| Task ID | Name                 | Agent                 | Skills                  | INPUT→OUTPUT→VERIFY                                                    |
| ------- | -------------------- | --------------------- | ----------------------- | ---------------------------------------------------------------------- |
| T-1     | Proje İskeleti       | `orchestrator`        | `app-builder`           | Vite Kurulumu → React TS Projesi → Çalışan `npm run dev`               |
| T-2     | UI System & Fonts    | `frontend-specialist` | `frontend-design`       | Apple Fonts + Tailwind → Tipografi CSS → Sorunsuz derleme              |
| T-3     | Floating Dock Layout | `frontend-specialist` | `ui-ux-pro-max`         | Geleneksel Navbar iptali → Yüzen alt Dock → Hover animasyonları        |
| T-4     | Landing Page         | `frontend-specialist` | `react-best-practices`  | Metin ve Hero Mockup → Animasyonlu Typografik Hero → Akıcı Scroll      |
| T-5     | Zustand Store        | `backend-specialist`  | `nodejs-best-practices` | Tip Tanımları (Başvuru) → Persist Store Modeli → DevTools entegrasyonu |
| T-6     | Auth UI Mock         | `frontend-specialist` | `frontend-design`       | Giriş formu → Pürüzsüz Input geçişi → Sinyal butonları                 |
| T-7     | Dashboard View       | `frontend-specialist` | `react-best-practices`  | İstatistikler → Tipografik Canvas düzeni → Bileşen yüklenme state'i    |
| T-8     | Başvuru Formu        | `frontend-specialist` | `web-design-guidelines` | Form alanları → Kayıt UI/UX (Hata gösterimi) → Store eşitlemesi        |
| T-9     | Liste & Filtreler    | `frontend-specialist` | `react-best-practices`  | Veri seti → Filtrelenen Liste → Anında update olan tablo               |
| T-10    | Analitik Grafik      | `frontend-specialist` | `frontend-design`       | Grafikler → Minimalist Rechart adaptasyonu → Görsel kontrol            |

## Phase X: Verification

- [ ] `npm run lint` && `npx tsc --noEmit` hatasız geçecek
- [ ] Konsolda hiçbir gereksiz log olmayacak
- [ ] Tüm etkileşimler `<button>` ve focus (klavye erişilebilirliği) kurallarına uygun
- [ ] UI'da **"Mor/Violet/Indigo" rengin KESİNLİKLE OLMAMASI** (Purple Ban)
- [ ] Masaüstü Mac hissiyatını veren "Floating Dock" kontrolü.
