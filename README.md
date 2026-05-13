<div align="center">

<br />

<img src="https://img.shields.io/badge/NextStep-v2.1-000000?style=for-the-badge&logoColor=white" alt="version" />
<img src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="react" />
<img src="https://img.shields.io/badge/TailwindCSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="tailwind" />
<img src="https://img.shields.io/badge/Gemini--1.5-AI-412991?style=for-the-badge&logo=google&logoColor=white" alt="gemini" />
<img src="https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="firebase" />
<img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="vercel" />

<br /><br />

```text
 ███╗   ██╗███████╗██╗  ██╗████████╗███████╗████████╗███████╗██████╗ 
 ████╗  ██║██╔════╝╚██╗██╔╝╚══██╔══╝██╔════╝╚══██╔══╝██╔════╝██╔══██╗
 ██╔██╗ ██║█████╗   ╚███╔╝    ██║   ███████╗   ██║   █████╗  ██████╔╝
 ██║╚██╗██║██╔══╝   ██╔██╗    ██║   ╚════██║   ██║   ██╔══╝  ██╔═══╝ 
 ██║ ╚████║███████╗██╔╝ ██╗   ██║   ███████║   ██║   ███████╗██║     
 ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     
```

### **One dashboard. Every application.**
### Track jobs, polish CVs and land offers — with AI on your side.

[Live App](https://job-tracking-web-form.vercel.app) · [Report Bug](https://github.com/kutluhangil/Job-Tracking-Web-Form/issues) · [Request Feature](https://github.com/kutluhangil/Job-Tracking-Web-Form/issues)

</div>

---

## ✦ What is NextStep?

**NextStep** is a modern, bilingual job application tracker built for serious job seekers. Stop losing applications in messy spreadsheets — track every company, recruiter, interview round and CV version in one premium dashboard. Get AI-powered CV feedback from **Google Gemini**, sync everything to **Firebase**, and export your data anytime.

Built with **React 19**, **Tailwind CSS 4** and **Framer Motion**, with a flowing-gradient design language and a full dark mode.

---

## ⚡ Features

| Feature | Description |
|---------|-------------|
| 📊 **Live Dashboard** | Animated welcome banner, stats grid (total/this month/in-progress/offers), recent activity table |
| 🗂️ **Kanban Board** | Drag-free board view grouping applications by status |
| ➕ **Rich Tracking Form** | Company, role, salary range, location, work type, contract, HR contact, interview dates, follow-up reminders, tags |
| ✏️ **Edit + Detail View** | Full edit page per application + side modal for quick inspection |
| 🔍 **Smart Filters** | Search by company/role, filter across all 10 statuses, sort by date/company |
| 📤 **Multi-Format Export** | Excel (xlsx), PDF (jsPDF + autotable), JSON backup |
| 📥 **JSON Import** | Restore from any previous JSON backup |
| 🤖 **CV Analysis** | Drag-and-drop PDF → ATS scoring across 5 categories → Gemini chat for tailored feedback |
| 💬 **Gemini Widget** | Floating career assistant with context-aware suggestions |
| 📈 **Analytics Page** | Status distribution, platform success, monthly trends, motivation impact |
| 🌐 **TR / EN i18n** | Full bilingual UI, language preference persisted in localStorage |
| 🎨 **Light / Dark / System** | Three theme modes, auto-following the OS when set to System |
| 🔐 **Auth** | Firebase Email/Password + Google Sign-In with `select_account` prompt |
| 📨 **Feedback Form** | EmailJS-powered, with graceful `mailto:` fallback |
| 🎬 **Premium Hero** | Scramble-cycling headline with gradient text + interactive screenshot showcase |

---

## 🛠️ Tech Stack

```
Framework       →  React 19 · Vite · TypeScript 5
Styling         →  Tailwind CSS 4 · Framer Motion · Lucide Icons
State           →  Zustand (with persist middleware)
Routing         →  React Router 7 (lazy routes + protected layout)
Auth            →  Firebase Authentication (Email + Google)
Database        →  Firebase Firestore (per-user isolated collection)
AI              →  Google Gemini 1.5 Flash (CV chat + widget)
PDF Parsing     →  PDF.js (in-browser)
Export          →  xlsx · jsPDF · jspdf-autotable · html2canvas
Email           →  EmailJS (with mailto: fallback)
Hosting         →  Vercel
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- A Firebase project with **Authentication** + **Firestore** enabled
- A Google **Generative Language API** key (from AI Studio or Google Cloud Console)

### Local Development

```bash
# Clone
git clone https://github.com/kutluhangil/Job-Tracking-Web-Form.git
cd Job-Tracking-Web-Form

# Install
npm install

# Configure
cp .env.example .env.local
# Fill in the values listed below

# Run
npm run dev          # http://localhost:5173
npm run build        # production build to /dist
npx tsc --noEmit     # type check
```

### Environment Variables

Create `.env.local` in the project root with:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key | ✅ |
| `VITE_FIREBASE_AUTH_DOMAIN` | `<project-id>.firebaseapp.com` | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | ✅ |
| `VITE_FIREBASE_STORAGE_BUCKET` | `<project-id>.firebasestorage.app` | ✅ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging Sender ID | ✅ |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | ✅ |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics Measurement ID | optional |
| `VITE_GEMINI_API_KEY` | Generative Language API Key | optional (CV/chat features off without it) |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service for feedback | optional (falls back to `mailto:`) |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID | optional |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | optional |

---

## 🔥 Firebase Setup

In the [Firebase Console](https://console.firebase.google.com):

**1. Authentication**
- Enable **Email/Password** under Sign-in method
- Enable **Google** under Sign-in method
- Add `localhost` and your production domain to Authorized domains

**2. Firestore Database** — apply these rules:

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

**3. Composite Index** — Firestore will surface a one-click link the first time the query runs. Otherwise add manually:
- Collection: `applications`
- Fields: `userId` (Asc), `createdAt` (Desc)

**4. Gemini API** — In Google Cloud Console, enable the **Generative Language API** for the project that owns the key. If you generated the key in [AI Studio](https://aistudio.google.com), the API is enabled by default.

---

## ☁️ Deploy to Vercel

```bash
npm i -g vercel@latest
vercel --prod
```

Then in **Vercel Dashboard → Settings → Environment Variables**, add every `VITE_*` variable for the **Production** environment. After adding, trigger a redeploy.

After deploying, add your Vercel URL (e.g. `your-app.vercel.app`) to Firebase **Authorized Domains**.

---

## 📐 Project Structure

```text
NextStep/
├── public/                       # Static assets, screenshots, favicon
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── FloatingDock.tsx  # Bottom nav with logout button
│   │   │   ├── GeminiWidget.tsx  # Floating AI career assistant
│   │   │   ├── Reveal.tsx        # Intersection-observer fade-in
│   │   │   └── Typography.tsx
│   │   └── layout/
│   │       ├── Navbar.tsx        # Top nav for landing/auth
│   │       └── AboutModal.tsx    # Bilingual profile modal
│   ├── hooks/
│   │   ├── useDark.ts            # Resolves light/dark/system → boolean
│   │   └── useTheme.ts           # Applies <html data-theme>
│   ├── layouts/
│   │   └── AppLayout.tsx         # FloatingDock + GeminiWidget + <Outlet />
│   ├── lib/
│   │   ├── firebase.ts           # Firebase init (env vars)
│   │   ├── authService.ts        # Email + Google auth helpers
│   │   ├── firestoreService.ts   # CRUD + wipe
│   │   └── i18n.tsx              # TR/EN translations + context
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ForgotPassword.tsx
│   │   ├── LandingPage.tsx       # Hero + showcase + flowing-gradient CTA
│   │   ├── Dashboard.tsx         # Greeting banner + stats + recent
│   │   ├── AddApplication.tsx
│   │   ├── EditApplication.tsx
│   │   ├── Applications.tsx      # List view + Kanban + filters
│   │   ├── Analytics.tsx         # Charts and trends
│   │   ├── CV.tsx                # PDF upload + ATS + Gemini chat
│   │   └── Settings.tsx          # Profile, theme, notifications, data, feedback
│   ├── store/
│   │   └── useAppStore.ts        # Zustand store (state + async Firebase actions)
│   ├── App.tsx                   # Router + auth observer + reminder check
│   └── main.tsx                  # Entry point + LanguageProvider
├── .env.example
├── vercel.json
└── package.json
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       NEXTSTEP CLIENT                       │
│                                                             │
│   ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│   │  Zustand   │  │  React 19  │  │   Framer Motion      │  │
│   │  + persist │  │  + Router  │  │   + Tailwind v4      │  │
│   └────────────┘  └────────────┘  └──────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
            ┌───────────────┼────────────────┐
            │               │                │
   ┌────────────────┐ ┌────────────┐ ┌──────────────┐
   │   Firebase     │ │  Gemini    │ │   EmailJS    │
   │ Auth +         │ │  1.5 Flash │ │  (feedback   │
   │ Firestore      │ │  (CV + chat)│ │   fallback) │
   └────────────────┘ └────────────┘ └──────────────┘
```

State flows through Zustand with optimistic UI updates: the local store mutates immediately while Firestore mutations happen in the background. `onAuthChange` keeps Firebase auth state mirrored into the store, and protected routes redirect unauthenticated visitors to the landing page.

---

## 🔒 Security & Privacy

| Layer | Implementation |
|-------|---------------|
| **Database** | Firestore rules ensure a user can only query/mutate documents where `userId == request.auth.uid` |
| **Auth** | Firebase Authentication with email verification + Google OAuth (`prompt: 'select_account'`) |
| **Data Wipe** | Settings → "Tüm Verileri Sil" removes every Firestore document for the current user + clears local persistence |
| **API Keys** | All keys are `VITE_*` build-time env vars; never committed (`.env.local` is gitignored) |
| **Error Handling** | All async Firebase + Gemini calls are wrapped in `try/catch` with user-friendly fallbacks |

---

## 🧪 Known Limitations

| Area | Status |
|------|--------|
| Settings → Change Password | Shows a "coming soon" toast (Firebase email-link flow planned) |
| Settings → Active Sessions | Single-session app for now |
| Analytics → Avg Response Time | Decorative estimate, not a real measurement |
| CV → ATS Score | Heuristic keyword matching; not a real ATS engine |

---

## 🤝 Contributing

Pull requests are welcome.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">

Built by [**kutluhangil**](https://github.com/kutluhangil)

<br />

**[job-tracking-web-form.vercel.app](https://job-tracking-web-form.vercel.app)**

<br />

*If NextStep helps your job search, consider giving the repo a ⭐*

</div>
