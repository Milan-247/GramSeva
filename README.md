# 🌾 GramSeva (ഗ്രാമസേവ) — Unified Kerala Grama Panchayat & Citizen Services Portal

GramSeva is an offline-first, multilingual emergency, public utility, and digital governance portal designed specifically for local Grama Panchayats, villages, and towns across Kerala. Built with **React 19**, **Vite**, **Tailwind CSS**, **Motion**, **Leaflet**, and **Firebase**, GramSeva bridges the gap between rural citizens and public services with tax payments, grievance tracking, certificate guides, emergency dialers, and localized maps.

---

## 🌟 Key Features

- 🌐 **Multilingual Accessibility**: Native support for **Malayalam (മലയാളം)**, **English**, **Hindi (हिंदी)**, **Telugu (తెలుగు)**, and **Kannada (ಕನ್ನಡ)** with a dynamic language selector dial wheel.
- 💳 **Unified Grama Panchayat Tax Gateway**:
  - Calculate and pay **Property Tax**, **Building Tax (Plinth Area)**, **Water Charges**, and **Professional Tax**.
  - Instant **5% Early Online Rebate** discounts.
  - Multiple payment options (UPI with instant QR Code, Net Banking, Debit/Credit Card).
  - Printable & downloadable official state receipts with verifiable QR authentication.
- 📢 **Grievance & Redressal Tracking System**:
  - Lodge local complaints for water supply, road repairs/potholes, street lighting, waste disposal, health, and agriculture.
  - Auto-generated tracking ticket IDs (`GS-2026-XXXX`).
  - Real-time status tracker (*Submitted*, *Under Review*, *Assigned*, *In Progress*, *Resolved*).
  - Assigned Duty Officer badges and direct complaint status lookup by Ticket ID or phone number.
- 📜 **Joint Dependency Certificate Resolver**:
  - Step-by-step guidance for obtaining essential certificates (Birth, Death, Income, Caste, Domicile, Land Valuation, Building Permits).
  - Complete breakdown of issuing authorities (**Village Office**, **Grama Panchayat**, **Akshaya Common Service Centre**).
  - Comprehensive document intake checklists, turnaround time estimates, and processing fee details.
- 📋 **Required Documents Checklists**:
  - Interactive accordion checklist for every public service (Aadhaar, Ration Card, Land Tax Receipts, Passport photos, etc.).
  - Real-time completion progress indicators and instant copy-to-clipboard function.
- 🗺️ **Interactive Service Map & Geolocation**:
  - Integrated Leaflet map with custom category markers, live route navigation, and a "Near Me" radius filter.
- 📞 **Direct Helpline & Emergency Contacts**:
  - One-touch dialers for Police (112), Fire & Rescue (101), Health/Ambulance (108), KSEB Power, KWA Water, Kudumbashree units, and local autorickshaw/taxi stands.
- 🔐 **Firebase Auth & Firestore Cloud Sync**:
  - Secure login/signup with Firebase Auth and profile synchronization.
  - Offline-first cache architecture ensuring uninterrupted performance in low-connectivity rural areas.
- 📊 **Panchayat Analytics Dashboard**:
  - Recharts visual distribution charts for service density across healthcare, water, utilities, and emergency hubs.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Database & Authentication**: [Firebase / Firestore](https://firebase.google.com/)
- **Maps & Geolocation**: [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **AI Capabilities**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini API)

---

## 📁 Project Architecture

```text
gramseva/
├── src/
│   ├── components/
│   │   ├── CategoryChart.jsx               # Visual service category distribution charts
│   │   ├── CertificateResolver.jsx         # Joint dependency certificate guidance engine
│   │   ├── FirebaseAuthModal.jsx           # Firebase authentication & citizen sign-in modal
│   │   ├── GraamsevaSeal.jsx               # Official Grama Panchayat emblem seal
│   │   ├── GrievanceTracker.jsx            # Local complaint lodging & ticket tracker
│   │   ├── LanguageWheel.jsx               # Animated dial wheel for 5-language toggle
│   │   ├── RequiredDocumentsAccordion.jsx  # Interactive document requirement checklist
│   │   ├── ServiceMap.jsx                  # Leaflet interactive map with custom pins
│   │   ├── Skeletons.jsx                   # Loading state placeholders
│   │   ├── TaxPaymentPortal.jsx            # Grama Panchayat tax calculator & gateway
│   │   └── WiseGatekeeperLogin.jsx         # Citizen onboarding & ward verification
│   ├── data/
│   │   └── services.js                     # Localized dataset & Kerala district/panchayat maps
│   ├── lib/
│   │   └── firebase.js                     # Firebase app initialization & Firestore client
│   ├── context/                            # React state context providers
│   ├── utils/                              # Helper functions & formatting utilities
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

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
