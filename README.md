# 🌾 GramSeva — Village Services Directory

An offline-first, multilingual emergency and essential public services directory designed for local panchayats, villages, and towns across Kerala. Built with **React 19**, **Vite**, **Tailwind CSS**, and **Leaflet**, GramSeva connects rural citizens with vital government services, emergency helplines, Akshaya centers, Kudumbashree units, health centers, and public utilities.

---

## 🌟 Key Features

- 🌐 **Multilingual Accessibility**: Native support for **Malayalam (മലയാളം)**, **English**, **Hindi (हिंदी)**, **Telugu (తెలుగు)**, and **Kannada (ಕನ್ನಡ)** with a dynamic language selector wheel.
- 📋 **Required Documents Accordion**: Interactive, collapsible checklist for each service (Aadhaar, Ration Card, Tax Receipts, Land Ownership, etc.) with real-time progress bars and instant copy-to-clipboard functionality.
- 📍 **Granular District & Panchayat Filtering**: Filter services by all 14 Kerala districts and deep sub-localities (e.g., Azhiyur Panchayat, Mukkali, Chombala, Koroth Road, Kunhippally, etc.).
- 🗺️ **Interactive Service Map**: Integrated Leaflet map with custom geolocation markers, category color coding, and a "Near Me" radius filter.
- 📞 **Direct Emergency & Helpline Dialer**: One-touch contact cards for Police, Fire, Hospitals, KSEB Water/Power offices, Kudumbashree, Grama Panchayat offices, and local autorickshaw/taxi stands.
- 📊 **Category Analytics**: Visual charts powered by Recharts displaying service density across sectors (Government, Health, Water/Utilities, Agriculture, Education, Emergency).
- 📜 **Official Certificate Resolver**: Interactive tool to identify required certificates, issuing authorities (Village Office, Panchayat, Akshaya), required proofs, and process turnaround times.
- ⚡ **Offline-First & Local Persistence**: Saves document progress, saved contacts, and user search preferences directly in the browser's local storage.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/) + [Motion](https://motion.dev/)
- **Maps & Geolocation**: [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini API)

---

## 📁 Directory Structure

```text
gramseva/
├── src/
│   ├── components/
│   │   ├── CategoryChart.jsx               # Visual service category distribution chart
│   │   ├── CertificateResolver.jsx         # Interactive certificate guidance tool
│   │   ├── LanguageWheel.jsx               # Dial wheel for language selection
│   │   ├── RequiredDocumentsAccordion.jsx  # Collapsible document checklist component
│   │   ├── ServiceMap.jsx                  # Leaflet map container & custom pins
│   │   └── Skeletons.jsx                   # Loading skeletons
│   ├── data/
│   │   └── services.js                     # Localized dataset & Kerala locality mappings
│   ├── App.jsx                             # Main application layout & filtering logic
│   └── main.tsx                            # Vite entry point
├── public/                                 # Static assets & SVG icons
├── .env.example                            # Environment variable definitions
├── package.json                            # Project dependencies & scripts
└── vite.config.ts                          # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18 or higher) and npm installed on your machine.

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
   Copy `.env.example` to `.env` (optional, for Gemini AI features):
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

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Contributors

Thanks to everyone who helps improve GramSeva through code, documentation, testing, and community feedback.


