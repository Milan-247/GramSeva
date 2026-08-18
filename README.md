# 🌾 GramSeva — Unified Grama Panchayat & Citizen Services Portal

GramSeva is an offline-first, multilingual emergency, public utility, and digital governance portal designed for local Grama Panchayats, villages, blocks, and towns across India. Built with **React 19**, **Vite**, **Tailwind CSS**, **Motion**, **Leaflet**, and **Firebase**, GramSeva bridges the gap between rural citizens and public services with digital document vaults, joint dependency certificate guidance, grievance tracking, emergency dialers, and localized interactive maps.

---

## 🌟 Key Features

- 🌐 **Multilingual & Pan-State Accessibility**: Native support for **English**, **Malayalam (മലയാളം)**, **Kannada (ಕನ್ನಡ)**, **Telugu (తెలుగు)**, **Tamil (தமிழ்)**, and **Hindi (हिंदी)** with interactive state and district selectors.
- 🗂️ **Digital Document Wallet & Vault**:
  - Secure offline-first digital document storage with client-side OCR text extraction and biometric/PIN lock.
  - Pre-configured citizen vault presets (Aadhaar, Voter ID, Ration Card, Land Records, Caste/Income certificates).
  - Quick QR verification and instant document export.
- 📜 **AO* Certificate Dependency Resolver**:
  - Algorithmic graph search for certificate prerequisites and issuance chains (Income, Caste, Domicile, Non-Creamy Layer, Land Valuation, Building Permits).
  - Complete breakdown of issuing authorities (**Village Office**, **Grama Panchayat**, **Revenue Department**, **Common Service Centres**).
  - Turnaround time estimates, processing fee details, and step-by-step required document checklists.
- 📢 **Grievance & Redressal Tracking System**:
  - Lodge local complaints for water supply, road repairs, street lighting, waste disposal, health, and agriculture.
  - Auto-generated tracking ticket IDs (`GS-2026-XXXX`).
  - Real-time status tracking (*Submitted*, *Under Review*, *Assigned*, *In Progress*, *Resolved*) with priority badges.
- 🗺️ **Interactive Service Map & Geolocation**:
  - Integrated Leaflet map with custom category markers, 24/7 emergency facility filters, and multi-state coordinates.
- 📞 **Direct Helpline & Emergency Contacts**:
  - One-touch dialers for Police (112), Fire & Rescue (101), Health/Ambulance (108), Electricity Boards, Water Authorities, and local civic desks.
- 🔐 **Firebase Auth & Cloud Sync**:
  - Citizen profile synchronization with Firebase Authentication and Firestore security rules.
  - Offline-first cache architecture ensuring uninterrupted performance in low-connectivity areas.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling & Design System**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Database & Authentication**: [Firebase / Firestore](https://firebase.google.com/)
- **Maps & Geolocation**: [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **AI Capabilities**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini API)

---

## 📁 Project Architecture

```text
gramseva/
├── src/
│   ├── components/
│   │   ├── CertificateResolver.jsx         # AO* graph search certificate guidance engine
│   │   ├── DigitalDocumentWallet.jsx       # Citizen document vault & OCR extraction
│   │   ├── FirebaseAuthModal.jsx           # Firebase authentication & citizen sign-in modal
│   │   ├── GraamSevaSeal.jsx               # Official civic emblem seal
│   │   ├── GrievanceTracker.jsx            # Local complaint lodging & ticket tracker
│   │   ├── LanguageWheel.jsx               # Animated dial wheel for multi-language toggle
│   │   ├── RequiredDocumentsAccordion.jsx  # Interactive document requirement checklist
│   │   ├── ServiceMap.jsx                  # Leaflet interactive map with category markers
│   │   ├── Skeletons.jsx                   # Loading state placeholders
│   │   ├── UserProfileHub.jsx              # Citizen profile & verification hub
│   │   └── WiseGatekeeperLogin.jsx         # Citizen onboarding & ward verification
│   ├── data/
│   │   ├── services.js                     # Localized public services directory
│   │   ├── certificateGraphData.js         # Certificate dependency rules & graph nodes
│   │   ├── searchDictionary.js             # Phonetic and multilingual search index
│   │   └── regionalGreetings.js            # Localized greeting messages
│   ├── lib/
│   │   └── firebase.js                     # Firebase app initialization & Firestore client
│   ├── context/                            # Language & application state providers
│   ├── utils/                              # Helper functions, OCR, and AO* solver
│   ├── App.jsx                             # Main layout, tab navigation, & filtering logic
│   ├── types.ts                            # TypeScript data definitions
│   └── main.jsx                            # Vite application entry point
├── public/                                 # Static assets & SVG icons
├── firebase-applet-config.json             # Firebase project configuration
├── firestore.rules                         # Firestore security rules
├── .env.example                            # Environment variable template
├── package.json                            # Dependencies & npm scripts
└── vite.config.ts                          # Vite configuration file
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18 or higher) and npm installed:

```bash
node -v
npm -v
```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/gramseva.git
   cd gramseva
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` (optional, for Gemini AI features & Firebase config):
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 📜 NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local Vite development server on port 3000 |
| `npm run build` | Builds the production bundle in `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs Vite production build verification |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
