<div align="center">

<br />

<img src="https://img.shields.io/badge/NextStep-v2.0-000000?style=for-the-badge&logoColor=white" alt="version" />
<img src="https://img.shields.io/badge/Built_with-TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="react" />
<img src="https://img.shields.io/badge/TailwindCSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="tailwind" />
<img src="https://img.shields.io/badge/Gemini--1.5-Powered-412991?style=for-the-badge&logo=google&logoColor=white" alt="gemini" />
<img src="https://img.shields.io/badge/Firebase-Database-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="firebase" />

<br /><br />

```text
 ███╗   ██╗███████╗██╗  ██╗████████╗███████╗████████╗███████╗██████╗ 
 ████╗  ██║██╔════╝╚██╗██╔╝╚══██╔══╝██╔════╝╚══██╔══╝██╔════╝██╔══██╗
 ██╔██╗ ██║█████╗   ╚███╔╝    ██║   ███████╗   ██║   █████╗  ██████╔╝
 ██║╚██╗██║██╔══╝   ██╔██╗    ██║   ╚════██║   ██║   ██╔══╝  ██╔═══╝ 
 ██║ ╚████║███████╗██╔╝ ██╗   ██║   ███████║   ██║   ███████╗██║     
 ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     
```

### **One Dashboard. Every Application.** — Track jobs, review CVs & secure offers.

[Live App](https://nextstep.app) · [Report Bug](https://github.com/kutluhangil/Job-Tracking-Web-Form/issues) · [Request Feature](https://github.com/kutluhangil/Job-Tracking-Web-Form/issues)

</div>

---

## ✦ What is NextStep?

**NextStep** is an intelligent job application tracking system that transforms how you manage your career search. Stop losing track of applications in messy spreadsheets and stay organized with a comprehensive dashboard powered by Google Gemini AI.

Every interview, every cover letter, and every HR note—saved securely in the cloud. Built for speed, deep analytical insight, and a stunning "Obsidian Luxury" dark-mode experience.

---

## ⚡ Features

| Feature | Description |
|---------|-------------|
| 📊 **Advanced Dashboard** | Visualize total applications, conversion rates, and monthly trends |
| ➕ **Comprehensive Tracking**| Save HR notes, company details, platform ties, tech stacks, and follow-ups |
| 📄 **AI CV Analysis** | Upload your CV PDF, and let **Gemini 1.5** grade it using ATS logic and provide pinpoint feedback |
| 🌍 **Bilingual Interface** | Seamless toggle between Turkish & English — across the entire UI |
| 🎨 **Premium UI** | Smooth Framer Motion transitions, beautiful gradients, and a true dark mode layout |
| 🗂️ **Cloud Sync** | Optimistic UI updates with Firebase Firestore synchronization for zero-latency cross-device use |
| 🔐 **Bulletproof Auth** | Robust Firebase Authentication with isolated user data and security rules |
| 💳 **Export Anywhere** | Export your application history as raw JSON or perfectly formatted PDF/Excel sheets |

---

## 🖼️ Screenshots

> *(Coming soon — High-quality mockups of NextStep interface)*

---

## 🛠️ Tech Stack

```
Frontend        →  React 19 · Vite · TypeScript · Tailwind CSS 4 · Framer Motion · Zustand
i18n            →  Custom Context-driven native i18n
Fonts           →  Satoshi (display) · DM Sans (body) · JetBrains Mono (mono)
AI Engine       →  Google Gemini 1.5 Flash (PDF parsing & text synthesis)
Database        →  Firebase Firestore (NoSQL + Realtime Sync)
Auth            →  Firebase Authentication
Data Export     →  xlsx · jsPDF · jsPDF-AutoTable
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       NEXTSTEP CLIENT                       │
│                                                             │
│   ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│   │ Zustand 4  │  │ React 19   │  │   Framer Motion      │  │
│   │ State Mgr  │  │ Component  │  │   Animations         │  │
│   └────────────┘  └────────────┘  └──────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Async Try/Catch Sync)
             ┌──────────────┼──────────────┐
             │                             │
    ┌────────────────┐             ┌────────────────┐
    │    Firebase    │             │   Gemini 1.5   │
    │  (Deployment,  │             │   (AI Models & │
    │ Auth & Storage)│             │  Resume Logic) │
    └────────────────┘             └────────────────┘
```

---

## 📐 Project Structure

```text
Job-Tracking-Web-Form/
├── public/                 # Static assets and fonts
├── src/
│   ├── components/
│   │   ├── analytics/      # Application conversion charts (Recharts)
│   │   ├── applications/   # Comprehensive datatables and filters
│   │   ├── common/         # Buttons, Inputs, Gemini Widgets
│   │   ├── layout/         # Navigation, Sidebar, Mobile Bottom-nav
│   ├── hooks/              # Custom hooks (e.g., useDark, useAuth)
│   ├── lib/
│   │   ├── firebase.ts     # Firebase initialization & clients
│   │   ├── firestoreService# Cloud-sync business logic
│   │   ├── authService.ts  # Session management
│   │   └── i18n.tsx        # React translation context
│   ├── pages/
│   │   ├── auth/           # Login, Register, Forgot Password
│   │   ├── Dashboard.tsx   # Top stats and recent activities
│   │   ├── AddApplication  # Main tracking form
│   │   ├── Applications    # Interactive list view
│   │   ├── Analytics.tsx   # Visualized trajectory
│   │   ├── Settings.tsx    # Wipe data, theme prefs, exports
│   │   └── CV.tsx          # Gemini-powered ATS screener
│   ├── store/
│   │   └── useAppStore.ts  # Zustand: Global source of truth
│   ├── App.tsx             # Setup React Router & Auth Observer
│   └── main.tsx            # Entry point
├── .env.example            # Environment variables template
├── package.json            # Scripts & dependencies
└── vite.config.ts          # Vite build specifications
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- Firebase account (Auth + Firestore enabled)
- Google Gemini API key

### Local Development

```bash
# Clone the repository
git clone https://github.com/kutluhangil/Job-Tracking-Web-Form.git
cd Job-Tracking-Web-Form

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Fill in your Firebase & Gemini credentials

# Start the dev server
npm run dev
```

App runs at `http://localhost:5173`.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID`| Firebase Sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | Yes |
| `VITE_GEMINI_API_KEY` | Official Google Gemini API Key | Yes |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS Service (for feedback) | No |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS Template | No |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS Public Key | No |

---

## 🔒 Security & Data Privacy

| Layer | Implementation |
|-------|---------------|
| **Database** | Firebase Firestore Rules enforce absolute user isolation. (No user can query another's data) |
| **Authentication** | Firebase Auth secure sessions, email validation, and encrypted password storage. |
| **State Sync** | Data wipes securely completely eviscerate Cloud payloads. |
| **API** | `try/catch` boundaries on all asynchronous Firebase and Gemini fetch logic. |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">

Built with precision by [kutluhangil](https://github.com/kutluhangil)

<br />

**[nextstep.app](https://nextstep.app)**

<br />

*If you find this useful, consider giving it a ⭐*

</div>
