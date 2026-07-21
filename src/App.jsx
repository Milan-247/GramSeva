import { lazy, Suspense, useState, useEffect, useRef, useMemo, useTransition } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Phone,
  MapPin,
  Clock,
  User,
  Search,
  Building2,
  Droplet,
  HeartPulse,
  Sprout,
  GraduationCap,
  Wifi,
  WifiOff,
  Plus,
  X,
  Languages,
  HelpCircle,
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Shield,
  Store,
  Baby,
  FileText,
  Hospital,
  School,
  Landmark,
  Waves,
  Wheat,
  ClipboardList,
  Stethoscope,
  Ambulance,
  FlaskConical,
  BookOpen,
  FileCheck2,
  Banknote,
  Home,
  Trees,
  BusFront,
  Scale,
  HandCoins,
  AlertTriangle,
  Copy,
  Share2,
  MessageCircle,
  Flag,
  ListChecks,
  Eye,
  Type,
  Siren,
  Filter,
  ChevronRight,
  CheckCircle2,
  Keyboard,
  Sparkles
} from "lucide-react";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import uiBackdrop from "./assets/gramseva-bg.svg";
import {
  INITIAL_SERVICES,
  KERALA_DISTRICTS,
  LOCALITIES_EN
} from "./data/services";

const ServiceMap = lazy(() => import("./components/ServiceMap.jsx"));

const CATEGORY_ALIASES = {
  health: ["hospital", "clinic", "doctor", "medical", "ambulance", "phc", "fhc", "health centre", "arogya", "ആരോഗ്യം", "ആശുപത്രി", "ಆರೋಗ್ಯ", "ಆಸ್ಪತ್ರೆ", "स्वास्थ्य", "अस्पताल", "వైద్యం", "ఆసుపత్రి"],
  water: ["water", "kwa", "jal", "pipe", "connection", "drinking water", "tank", "borewell", "vellam", "വെള്ളം", "ജലം", "ನೀರು", "ಜಲ", "पानी", "जल", "నీరు", "జలం"],
  agriculture: ["krishi", "farm", "farmer", "seed", "soil", "fertilizer", "agriculture", "kisan", "കൃഷി", "കർഷകൻ", "ಕೃಷಿ", "ರೈತ", "कृषि", "किसान", "వ్యవసాయం", "రైతు"],
  education: ["school", "college", "teacher", "education", "class", "student", "library", "വിദ്യാഭ്യാസം", "സ്കൂൾ", "ಶಾಲೆ", "ಶಿಕ್ಷಣ", "स्कूल", "शिक्षा", "పాఠశాల", "విద్య"],
  government: ["panchayat", "village", "revenue", "registry", "akshaya", "certificate", "office", "ration", "tax", "പഞ്ചായത്ത്", "വില്ലേജ്", "കച്ചേരി", "ಪಂಚಾಯತ್", "ಕಚೇರಿ", "सरकार", "पंचायत", "प्रमाणपत्र", "ప్రభుత్వం", "పంచాయతీ"]
};

function normalizeSearchText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}

function getDuplicateKey(service) {
  const data = service.translations?.en || Object.values(service.translations || {})[0] || {};
  return normalizeSearchText(`${data.title || ""} ${service.localityName || ""} ${service.districtName || ""}`);
}
function DirectoryApp() {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const locStrings = {
    en: {
      locationHubTitle: "Location Filter Hub",
      districtLabel: "Select District",
      localityLabel: "Select Locality",
      allDistricts: "All Districts",
      allLocalities: "All Municipalities / Villages",
      nearMeBtn: "Simulate GPS / Locate Me",
      nearMeActiveDesc: "Location: Vaikom, Kottayam",
      radiusLabel: "Search Radius",
      sortByNearest: "Sort by Proximity"
    },
    ml: {
      locationHubTitle: "\u0D2A\u0D4D\u0D30\u0D3E\u0D26\u0D47\u0D36\u0D3F\u0D15 \u0D24\u0D3F\u0D30\u0D1A\u0D4D\u0D1A\u0D3F\u0D7D",
      districtLabel: "\u0D1C\u0D3F\u0D32\u0D4D\u0D32 \u0D24\u0D3F\u0D30\u0D1E\u0D4D\u0D1E\u0D46\u0D1F\u0D41\u0D15\u0D4D\u0D15\u0D41\u0D15",
      localityLabel: "\u0D38\u0D4D\u0D25\u0D32\u0D02 \u0D24\u0D3F\u0D30\u0D1E\u0D4D\u0D1E\u0D46\u0D1F\u0D41\u0D15\u0D4D\u0D15\u0D41\u0D15",
      allDistricts: "\u0D0E\u0D32\u0D4D\u0D32\u0D3E \u0D1C\u0D3F\u0D32\u0D4D\u0D32\u0D15\u0D33\u0D41\u0D02 (\u0D15\u0D47\u0D30\u0D33\u0D02 \u0D2E\u0D41\u0D34\u0D41\u0D35\u0D7B)",
      allLocalities: "\u0D0E\u0D32\u0D4D\u0D32\u0D3E \u0D38\u0D4D\u0D25\u0D32\u0D19\u0D4D\u0D19\u0D33\u0D41\u0D02 / \u0D35\u0D3F\u0D32\u0D4D\u0D32\u0D47\u0D1C\u0D41\u0D15\u0D7E",
      nearMeBtn: "\u0D0E\u0D28\u0D4D\u0D31\u0D46 \u0D38\u0D2E\u0D40\u0D2A\u0D24\u0D4D\u0D24\u0D41\u0D33\u0D4D\u0D33\u0D35 \u0D15\u0D23\u0D4D\u0D1F\u0D46\u0D24\u0D4D\u0D24\u0D41\u0D15 (GPS)",
      nearMeActiveDesc: "\u0D28\u0D3F\u0D19\u0D4D\u0D19\u0D33\u0D41\u0D1F\u0D46 \u0D38\u0D4D\u0D25\u0D3E\u0D28\u0D02: \u0D35\u0D48\u0D15\u0D4D\u0D15\u0D02, \u0D15\u0D4B\u0D1F\u0D4D\u0D1F\u0D2F\u0D02",
      radiusLabel: "\u0D1A\u0D41\u0D31\u0D4D\u0D31\u0D33\u0D35\u0D4D \u0D2A\u0D30\u0D3F\u0D27\u0D3F",
      sortByNearest: "\u0D05\u0D1F\u0D41\u0D24\u0D4D\u0D24\u0D41\u0D33\u0D4D\u0D33\u0D35 \u0D06\u0D26\u0D4D\u0D2F\u0D02 \u0D15\u0D3E\u0D23\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D15"
    },
    hi: {
      locationHubTitle: "\u0938\u094D\u0925\u093E\u0928 \u092B\u093F\u0932\u094D\u091F\u0930 \u0915\u0947\u0902\u0926\u094D\u0930",
      districtLabel: "\u091C\u093F\u0932\u093E \u091A\u0941\u0928\u0947\u0902",
      localityLabel: "\u0938\u094D\u0925\u093E\u0928 / \u0928\u0917\u0930 \u091A\u0941\u0928\u0947\u0902",
      allDistricts: "\u0938\u092D\u0940 \u091C\u093F\u0932\u0947",
      allLocalities: "\u0938\u092D\u0940 \u0938\u094D\u0925\u093E\u0928 / \u0917\u093E\u0901\u0935",
      nearMeBtn: "\u091C\u0940\u092A\u0940\u090F\u0938 \u0938\u093F\u092E\u0941\u0932\u0947\u0936\u0928 / \u092E\u0947\u0930\u0947 \u0928\u093F\u0915\u091F",
      nearMeActiveDesc: "\u0905\u0928\u0941\u0915\u0930\u0923 \u0938\u094D\u0925\u093E\u0928: \u0935\u0948\u0915\u094B\u092E, \u0915\u094B\u091F\u094D\u091F\u093E\u092F\u092E",
      radiusLabel: "\u0916\u094B\u091C \u0915\u093E \u0926\u093E\u092F\u0930\u093E",
      sortByNearest: "\u0928\u093F\u0915\u091F\u0924\u092E \u092A\u0939\u0932\u0947 \u0926\u093F\u0916\u093E\u090F\u0902"
    },
    te: {
      locationHubTitle: "\u0C2A\u0C4D\u0C30\u0C3E\u0C02\u0C24\u0C40\u0C2F \u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D",
      districtLabel: "\u0C1C\u0C3F\u0C32\u0C4D\u0C32\u0C3E\u0C28\u0C41 \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F",
      localityLabel: "\u0C17\u0C4D\u0C30\u0C3E\u0C2E\u0C02 / \u0C28\u0C17\u0C30\u0C02 \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F",
      allDistricts: "\u0C05\u0C28\u0C4D\u0C28\u0C3F \u0C1C\u0C3F\u0C32\u0C4D\u0C32\u0C3E\u0C32\u0C41",
      allLocalities: "\u0C05\u0C28\u0C4D\u0C28\u0C3F \u0C2A\u0C4D\u0C30\u0C3E\u0C02\u0C24\u0C3E\u0C32\u0C41",
      nearMeBtn: "\u0C28\u0C3E \u0C38\u0C2E\u0C40\u0C2A\u0C02\u0C32\u0C4B \u0C09\u0C28\u0C4D\u0C28\u0C35\u0C3F (GPS)",
      nearMeActiveDesc: "\u0C2A\u0C4D\u0C30\u0C38\u0C4D\u0C24\u0C41\u0C24 \u0C38\u0C4D\u0C25\u0C3E\u0C28\u0C02: \u0C35\u0C48\u0C15\u0C4B\u0C2E\u0C4D, \u0C15\u0C4A\u0C1F\u0C4D\u0C1F\u0C3E\u0C2F\u0C02",
      radiusLabel: "\u0C2A\u0C30\u0C3F\u0C27\u0C3F \u0C26\u0C42\u0C30\u0C02",
      sortByNearest: "\u0C38\u0C2E\u0C40\u0C2A\u0C02\u0C32\u0C4B\u0C28\u0C3F\u0C35\u0C3F \u0C32\u0C4B\u0C21\u0C4D \u0C1A\u0C47\u0C2F\u0C3F"
    }
  };
  const ls = locStrings[language] || locStrings.en;
  const ui = {
    en: {
      emergency: "Emergency",
      services: "Services",
      map: "Map",
      suggest: "Suggest",
      profile: "Profile",
      reportWrongInfo: "Report wrong info",
      reportTitle: "Report incorrect service details",
      reportHint: "Tell local volunteers what needs correction.",
      reportPlaceholder: "Phone number is wrong, timing changed, location closed...",
      submitReport: "Submit report",
      documentChecklist: "Document checklist",
      actions: "Quick actions",
      copyPhone: "Copy phone",
      copyDetails: "Copy details",
      whatsapp: "WhatsApp",
      share: "Share",
      searchSuggestions: "Suggestions",
      emergencyIntro: "Fast access to urgent health, safety, and public support contacts.",
      noEmergency: "No emergency services found for these filters.",
      accessibility: "Accessibility",
      largeText: "Large text",
      highContrast: "High contrast",
      mapFilter: "Map filter"
    },
    ml: {
      emergency: "\u0D05\u0D1F\u0D3F\u0D2F\u0D28\u0D4D\u0D24\u0D3F\u0D30\u0D02",
      services: "\u0D38\u0D47\u0D35\u0D28\u0D19\u0D4D\u0D19\u0D7E",
      map: "\u0D2E\u0D3E\u0D2A\u0D4D\u0D2A\u0D4D",
      suggest: "\u0D28\u0D3F\u0D7C\u0D26\u0D4D\u0D26\u0D47\u0D36\u0D02",
      profile: "\u0D2A\u0D4D\u0D30\u0D4A\u0D2B\u0D48\u0D7D",
      reportWrongInfo: "\u0D24\u0D46\u0D31\u0D4D\u0D31\u0D3E\u0D2F \u0D35\u0D3F\u0D35\u0D30\u0D02 \u0D31\u0D3F\u0D2A\u0D4D\u0D2A\u0D4B\u0D7C\u0D1F\u0D4D\u0D1F\u0D4D \u0D1A\u0D46\u0D2F\u0D4D\u0D2F\u0D41\u0D15",
      reportTitle: "\u0D38\u0D47\u0D35\u0D28 \u0D35\u0D3F\u0D35\u0D30 \u0D24\u0D3F\u0D30\u0D41\u0D24\u0D4D\u0D24\u0D7D \u0D31\u0D3F\u0D2A\u0D4D\u0D2A\u0D4B\u0D7C\u0D1F\u0D4D\u0D1F\u0D4D",
      reportHint: "\u0D24\u0D3F\u0D30\u0D41\u0D24\u0D4D\u0D24\u0D47\u0D23\u0D4D\u0D1F \u0D15\u0D3E\u0D30\u0D4D\u0D2F\u0D02 \u0D38\u0D28\u0D4D\u0D28\u0D26\u0D4D\u0D27\u0D2A\u0D4D\u0D30\u0D35\u0D7C\u0D24\u0D4D\u0D24\u0D15\u0D30\u0D46 \u0D05\u0D31\u0D3F\u0D2F\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D15.",
      reportPlaceholder: "\u0D2B\u0D4B\u0D7A \u0D28\u0D2E\u0D4D\u0D2A\u0D7C \u0D24\u0D46\u0D31\u0D4D\u0D31\u0D3E\u0D23\u0D4D, \u0D38\u0D2E\u0D2F\u0D02 \u0D2E\u0D3E\u0D31\u0D3F, \u0D38\u0D4D\u0D25\u0D32\u0D02 \u0D05\u0D1F\u0D1E\u0D4D\u0D1E\u0D41...",
      submitReport: "\u0D31\u0D3F\u0D2A\u0D4D\u0D2A\u0D4B\u0D7C\u0D1F\u0D4D\u0D1F\u0D4D \u0D38\u0D2E\u0D7C\u0D2A\u0D4D\u0D2A\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D15",
      documentChecklist: "\u0D30\u0D47\u0D16\u0D3E \u0D2A\u0D1F\u0D4D\u0D1F\u0D3F\u0D15",
      actions: "\u0D35\u0D47\u0D17\u0D24\u0D4D\u0D24\u0D3F\u0D32\u0D41\u0D33\u0D4D\u0D33 \u0D2A\u0D4D\u0D30\u0D35\u0D7C\u0D24\u0D4D\u0D24\u0D28\u0D19\u0D4D\u0D19\u0D7E",
      copyPhone: "\u0D2B\u0D4B\u0D7A \u0D2A\u0D15\u0D7C\u0D24\u0D4D\u0D24\u0D41\u0D15",
      copyDetails: "\u0D35\u0D3F\u0D35\u0D30\u0D02 \u0D2A\u0D15\u0D7C\u0D24\u0D4D\u0D24\u0D41\u0D15",
      whatsapp: "\u0D35\u0D3E\u0D1F\u0D4D\u0D1F\u0D4D\u0D38\u0D4D\u0D06\u0D2A\u0D4D\u0D2A\u0D4D",
      share: "\u0D2A\u0D19\u0D4D\u0D15\u0D3F\u0D1F\u0D41\u0D15",
      searchSuggestions: "\u0D28\u0D3F\u0D7C\u0D26\u0D4D\u0D26\u0D47\u0D36\u0D19\u0D4D\u0D19\u0D7E",
      emergencyIntro: "\u0D06\u0D30\u0D4B\u0D17\u0D4D\u0D2F\u0D02, \u0D38\u0D41\u0D30\u0D15\u0D4D\u0D37, \u0D2A\u0D4A\u0D24\u0D41 \u0D38\u0D39\u0D3E\u0D2F\u0D02 \u0D0E\u0D28\u0D4D\u0D28\u0D3F\u0D35\u0D2F\u0D4D\u0D15\u0D4D\u0D15\u0D41\u0D33\u0D4D\u0D33 \u0D05\u0D1F\u0D3F\u0D2F\u0D28\u0D4D\u0D24\u0D3F\u0D30 \u0D2C\u0D28\u0D4D\u0D27\u0D19\u0D4D\u0D19\u0D7E.",
      noEmergency: "\u0D08 \u0D2B\u0D3F\u0D7D\u0D1F\u0D4D\u0D1F\u0D31\u0D3F\u0D7D \u0D05\u0D1F\u0D3F\u0D2F\u0D28\u0D4D\u0D24\u0D3F\u0D30 \u0D38\u0D47\u0D35\u0D28\u0D19\u0D4D\u0D19\u0D33\u0D3F\u0D32\u0D4D\u0D32.",
      accessibility: "\u0D05\u0D15\u0D4D\u0D38\u0D38\u0D3F\u0D2C\u0D3F\u0D32\u0D3F\u0D31\u0D4D\u0D31\u0D3F",
      largeText: "\u0D35\u0D32\u0D3F\u0D2F \u0D1F\u0D46\u0D15\u0D4D\u0D38\u0D4D\u0D31\u0D4D\u0D31\u0D4D",
      highContrast: "\u0D39\u0D48 \u0D15\u0D4B\u0D7A\u0D1F\u0D4D\u0D30\u0D3E\u0D38\u0D4D\u0D31\u0D4D\u0D31\u0D4D",
      mapFilter: "\u0D2E\u0D3E\u0D2A\u0D4D\u0D2A\u0D4D \u0D2B\u0D3F\u0D7D\u0D1F\u0D4D\u0D1F\u0D7C"
    },
    hi: {
      emergency: "\u0906\u092A\u093E\u0924\u0915\u093E\u0932",
      services: "\u0938\u0947\u0935\u093E\u090F\u0902",
      map: "\u092E\u0948\u092A",
      suggest: "\u0938\u0941\u091D\u093E\u0935",
      profile: "\u092A\u094D\u0930\u094B\u092B\u093E\u0907\u0932",
      reportWrongInfo: "\u0917\u0932\u0924 \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u0915\u0930\u0947\u0902",
      reportTitle: "\u0938\u0947\u0935\u093E \u0935\u093F\u0935\u0930\u0923 \u0938\u0941\u0927\u093E\u0930 \u0930\u093F\u092A\u094B\u0930\u094D\u091F",
      reportHint: "\u0938\u094D\u0925\u093E\u0928\u0940\u092F \u0938\u094D\u0935\u092F\u0902\u0938\u0947\u0935\u0915\u094B\u0902 \u0915\u094B \u092C\u0924\u093E\u090F\u0902 \u0915\u094D\u092F\u093E \u0938\u0941\u0927\u093E\u0930\u0928\u093E \u0939\u0948\u0964",
      reportPlaceholder: "\u092B\u094B\u0928 \u0928\u0902\u092C\u0930 \u0917\u0932\u0924 \u0939\u0948, \u0938\u092E\u092F \u092C\u0926\u0932\u093E \u0939\u0948, \u0938\u094D\u0925\u093E\u0928 \u092C\u0902\u0926 \u0939\u0948...",
      submitReport: "\u0930\u093F\u092A\u094B\u0930\u094D\u091F \u092D\u0947\u091C\u0947\u0902",
      documentChecklist: "\u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C \u0938\u0942\u091A\u0940",
      actions: "\u0924\u094D\u0935\u0930\u093F\u0924 \u0915\u094D\u0930\u093F\u092F\u093E\u090F\u0902",
      copyPhone: "\u092B\u094B\u0928 \u0915\u0949\u092A\u0940 \u0915\u0930\u0947\u0902",
      copyDetails: "\u0935\u093F\u0935\u0930\u0923 \u0915\u0949\u092A\u0940 \u0915\u0930\u0947\u0902",
      whatsapp: "WhatsApp",
      share: "\u0936\u0947\u092F\u0930 \u0915\u0930\u0947\u0902",
      searchSuggestions: "\u0938\u0941\u091D\u093E\u0935",
      emergencyIntro: "\u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F, \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0914\u0930 \u0938\u093E\u0930\u094D\u0935\u091C\u0928\u093F\u0915 \u0938\u0939\u093E\u092F\u0924\u093E \u0915\u0947 \u0932\u093F\u090F \u0924\u0947\u091C \u0938\u0902\u092A\u0930\u094D\u0915\u0964",
      noEmergency: "\u0907\u0928 \u092B\u093F\u0932\u094D\u091F\u0930\u094B\u0902 \u092E\u0947\u0902 \u0906\u092A\u093E\u0924\u0915\u093E\u0932\u0940\u0928 \u0938\u0947\u0935\u093E\u090F\u0902 \u0928\u0939\u0940\u0902 \u092E\u093F\u0932\u0940\u0902\u0964",
      accessibility: "\u0938\u0941\u0932\u092D\u0924\u093E",
      largeText: "\u092C\u0921\u093C\u093E \u091F\u0947\u0915\u094D\u0938\u094D\u091F",
      highContrast: "\u0909\u091A\u094D\u091A \u0915\u0902\u091F\u094D\u0930\u093E\u0938\u094D\u091F",
      mapFilter: "\u092E\u0948\u092A \u092B\u093F\u0932\u094D\u091F\u0930"
    },
    te: {
      emergency: "\u0C05\u0C24\u0C4D\u0C2F\u0C35\u0C38\u0C30\u0C02",
      services: "\u0C38\u0C47\u0C35\u0C32\u0C41",
      map: "\u0C2E\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D",
      suggest: "\u0C38\u0C42\u0C1A\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F",
      profile: "\u0C2A\u0C4D\u0C30\u0C4A\u0C2B\u0C48\u0C32\u0C4D",
      reportWrongInfo: "\u0C24\u0C2A\u0C4D\u0C2A\u0C41 \u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C28\u0C3F\u0C35\u0C47\u0C26\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F",
      reportTitle: "\u0C38\u0C47\u0C35\u0C3E \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32 \u0C38\u0C35\u0C30\u0C23 \u0C28\u0C3F\u0C35\u0C47\u0C26\u0C3F\u0C15",
      reportHint: "\u0C0F\u0C26\u0C3F \u0C38\u0C30\u0C3F\u0C1A\u0C47\u0C2F\u0C3E\u0C32\u0C4B \u0C38\u0C4D\u0C25\u0C3E\u0C28\u0C3F\u0C15 \u0C35\u0C3E\u0C32\u0C02\u0C1F\u0C40\u0C30\u0C4D\u0C32\u0C15\u0C41 \u0C24\u0C46\u0C32\u0C3F\u0C2F\u0C1C\u0C47\u0C2F\u0C02\u0C21\u0C3F.",
      reportPlaceholder: "\u0C2B\u0C4B\u0C28\u0C4D \u0C28\u0C02\u0C2C\u0C30\u0C4D \u0C24\u0C2A\u0C4D\u0C2A\u0C41, \u0C38\u0C2E\u0C2F\u0C02 \u0C2E\u0C3E\u0C30\u0C3F\u0C02\u0C26\u0C3F, \u0C38\u0C4D\u0C25\u0C32\u0C02 \u0C2E\u0C42\u0C38\u0C3F\u0C35\u0C47\u0C36\u0C3E\u0C30\u0C41...",
      submitReport: "\u0C28\u0C3F\u0C35\u0C47\u0C26\u0C3F\u0C15 \u0C2A\u0C02\u0C2A\u0C02\u0C21\u0C3F",
      documentChecklist: "\u0C2A\u0C24\u0C4D\u0C30\u0C3E\u0C32 \u0C1C\u0C3E\u0C2C\u0C3F\u0C24\u0C3E",
      actions: "\u0C24\u0C4D\u0C35\u0C30\u0C3F\u0C24 \u0C1A\u0C30\u0C4D\u0C2F\u0C32\u0C41",
      copyPhone: "\u0C2B\u0C4B\u0C28\u0C4D \u0C15\u0C3E\u0C2A\u0C40",
      copyDetails: "\u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41 \u0C15\u0C3E\u0C2A\u0C40",
      whatsapp: "WhatsApp",
      share: "\u0C2A\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F",
      searchSuggestions: "\u0C38\u0C42\u0C1A\u0C28\u0C32\u0C41",
      emergencyIntro: "\u0C06\u0C30\u0C4B\u0C17\u0C4D\u0C2F\u0C02, \u0C2D\u0C26\u0C4D\u0C30\u0C24, \u0C2A\u0C4D\u0C30\u0C1C\u0C3E \u0C38\u0C39\u0C3E\u0C2F\u0C02 \u0C15\u0C4B\u0C38\u0C02 \u0C35\u0C47\u0C17\u0C35\u0C02\u0C24\u0C2E\u0C48\u0C28 \u0C38\u0C02\u0C2A\u0C4D\u0C30\u0C26\u0C3F\u0C02\u0C2A\u0C41\u0C32\u0C41.",
      noEmergency: "\u0C08 \u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D\u0C32\u0C32\u0C4B \u0C05\u0C24\u0C4D\u0C2F\u0C35\u0C38\u0C30 \u0C38\u0C47\u0C35\u0C32\u0C41 \u0C32\u0C47\u0C35\u0C41.",
      accessibility: "\u0C2F\u0C3E\u0C15\u0C4D\u0C38\u0C46\u0C38\u0C3F\u0C2C\u0C3F\u0C32\u0C3F\u0C1F\u0C40",
      largeText: "\u0C2A\u0C46\u0C26\u0C4D\u0C26 \u0C1F\u0C46\u0C15\u0C4D\u0C38\u0C4D\u0C1F\u0C4D",
      highContrast: "\u0C39\u0C48 \u0C15\u0C3E\u0C02\u0C1F\u0C4D\u0C30\u0C3E\u0C38\u0C4D\u0C1F\u0C4D",
      mapFilter: "\u0C2E\u0C4D\u0C2F\u0C3E\u0C2A\u0C4D \u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D"
    },
    kn: {
      emergency: "\u0CA4\u0CC1\u0CB0\u0CCD\u0CA4\u0CC1",
      services: "\u0CB8\u0CC7\u0CB5\u0CC6\u0C97\u0CB3\u0CC1",
      map: "\u0CA8\u0C95\u0CCD\u0CB7\u0CC6",
      suggest: "\u0CB8\u0CC2\u0C9A\u0CBF\u0CB8\u0CBF",
      profile: "\u0CAA\u0CCD\u0CB0\u0CCA\u0CAB\u0CC8\u0CB2\u0CCD",
      reportWrongInfo: "\u0CA4\u0CAA\u0CCD\u0CAA\u0CC1 \u0CAE\u0CBE\u0CB9\u0CBF\u0CA4\u0CBF\u0CAF\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB5\u0CB0\u0CA6\u0CBF \u0CAE\u0CBE\u0CA1\u0CBF",
      reportTitle: "\u0CA4\u0CAA\u0CCD\u0CAA\u0CBE\u0CA6 \u0CB8\u0CC7\u0CB5\u0CBE \u0CB5\u0CBF\u0CB5\u0CB0 \u0CB5\u0CB0\u0CA6\u0CBF",
      reportHint: "\u0CAF\u0CBE\u0CB5 \u0CB5\u0CBF\u0CB5\u0CB0 \u0CA4\u0CBF\u0CA6\u0CCD\u0CA6\u0CAC\u0CC7\u0C95\u0CC1 \u0C8E\u0C82\u0CA6\u0CC1 \u0CB8\u0CCD\u0CA5\u0CB3\u0CC0\u0CAF \u0CB8\u0CCD\u0CB5\u0CAF\u0C82\u0CB8\u0CC7\u0CB5\u0C95\u0CB0\u0CBF\u0C97\u0CC6 \u0CA4\u0CBF\u0CB3\u0CBF\u0CB8\u0CBF.",
      reportPlaceholder: "\u0CAB\u0CCB\u0CA8\u0CCD \u0CB8\u0C82\u0C96\u0CCD\u0CAF\u0CC6 \u0CA4\u0CAA\u0CCD\u0CAA\u0CBE\u0C97\u0CBF\u0CA6\u0CC6, \u0CB8\u0CAE\u0CAF \u0CAC\u0CA6\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6, \u0CB8\u0CCD\u0CA5\u0CB3 \u0CAE\u0CC1\u0C9A\u0CCD\u0C9A\u0CBF\u0CA6\u0CC6...",
      submitReport: "\u0CB5\u0CB0\u0CA6\u0CBF \u0C95\u0CB3\u0CC1\u0CB9\u0CBF\u0CB8\u0CBF",
      documentChecklist: "\u0CA6\u0CBE\u0C96\u0CB2\u0CC6\u0C97\u0CB3 \u0CAA\u0C9F\u0CCD\u0C9F\u0CBF",
      actions: "\u0CA4\u0CCD\u0CB5\u0CB0\u0CBF\u0CA4 \u0C95\u0CCD\u0CB0\u0CAE\u0C97\u0CB3\u0CC1",
      copyPhone: "\u0CAB\u0CCB\u0CA8\u0CCD \u0CA8\u0C95\u0CB2\u0CBF\u0CB8\u0CBF",
      copyDetails: "\u0CB5\u0CBF\u0CB5\u0CB0 \u0CA8\u0C95\u0CB2\u0CBF\u0CB8\u0CBF",
      whatsapp: "WhatsApp",
      share: "\u0CB9\u0C82\u0C9A\u0CBF",
      searchSuggestions: "\u0CB8\u0CB2\u0CB9\u0CC6\u0C97\u0CB3\u0CC1",
      emergencyIntro: "\u0C86\u0CB0\u0CCB\u0C97\u0CCD\u0CAF, \u0CAD\u0CA6\u0CCD\u0CB0\u0CA4\u0CC6 \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0CB8\u0CBE\u0CB0\u0CCD\u0CB5\u0C9C\u0CA8\u0CBF\u0C95 \u0CB8\u0CB9\u0CBE\u0CAF\u0C95\u0CCD\u0C95\u0CBE\u0C97\u0CBF \u0CA4\u0CC1\u0CB0\u0CCD\u0CA4\u0CC1 \u0CB8\u0C82\u0CAA\u0CB0\u0CCD\u0C95\u0C97\u0CB3\u0CC1.",
      noEmergency: "\u0C88 \u0CAB\u0CBF\u0CB2\u0CCD\u0C9F\u0CB0\u0CCD\u200C\u0C97\u0CB3\u0CB2\u0CCD\u0CB2\u0CBF \u0CA4\u0CC1\u0CB0\u0CCD\u0CA4\u0CC1 \u0CB8\u0CC7\u0CB5\u0CC6\u0C97\u0CB3\u0CC1 \u0C95\u0C82\u0CA1\u0CC1\u0CAC\u0C82\u0CA6\u0CBF\u0CB2\u0CCD\u0CB2.",
      accessibility: "\u0CAA\u0CCD\u0CB0\u0CB5\u0CC7\u0CB6\u0CAF\u0CCB\u0C97\u0CCD\u0CAF\u0CA4\u0CC6",
      largeText: "\u0CA6\u0CCA\u0CA1\u0CCD\u0CA1 \u0CAA\u0CA0\u0CCD\u0CAF",
      highContrast: "\u0CB9\u0CC8 \u0C95\u0CBE\u0C82\u0C9F\u0CCD\u0CB0\u0CBE\u0CB8\u0CCD\u0C9F\u0CCD",
      mapFilter: "\u0CA8\u0C95\u0CCD\u0CB7\u0CC6 \u0CAB\u0CBF\u0CB2\u0CCD\u0C9F\u0CB0\u0CCD"
    }
  }[language] || {
    emergency: "Emergency",
    services: "Services",
    map: "Map",
    suggest: "Suggest",
    profile: "Profile",
    reportWrongInfo: "Report wrong info",
    reportTitle: "Report incorrect service details",
    reportHint: "Tell local volunteers what needs correction.",
    reportPlaceholder: "Phone number is wrong, timing changed, location closed...",
    submitReport: "Submit report",
    documentChecklist: "Document checklist",
    actions: "Quick actions",
    copyPhone: "Copy phone",
    copyDetails: "Copy details",
    whatsapp: "WhatsApp",
    share: "Share",
    searchSuggestions: "Suggestions",
    emergencyIntro: "Fast access to urgent health, safety, and public support contacts.",
    noEmergency: "No emergency services found for these filters.",
    accessibility: "Accessibility",
    largeText: "Large text",
    highContrast: "High contrast",
    mapFilter: "Map filter"
  };
  const [currentTab, setCurrentTab] = useState("services");
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mapCategoryFilter, setMapCategoryFilter] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("Kozhikode");
  const [selectedLocality, setSelectedLocality] = useState("Mukkali");
  const [isNearMeActive, setIsNearMeActive] = useState(false);
  const [nearMeDistance, setNearMeDistance] = useState(30);
  const [sortByProximity, setSortByProximity] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [reportService, setReportService] = useState(null);
  const [reportText, setReportText] = useState("");
  const [isLargeText, setIsLargeText] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isUiPending, startUiTransition] = useTransition();
  const [settledSearchQuery, setSettledSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const navigateToTab = (tabId) => {
    if (tabId === currentTab) return;
    startUiTransition(() => setCurrentTab(tabId));
  };
  const chooseCategory = (categoryKey) => {
    startUiTransition(() => setSelectedCategory(categoryKey));
  };
  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, selectedCategory, selectedDistrict, selectedLocality, isNearMeActive, sortByProximity]);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setSettledSearchQuery(searchQuery), 140);
    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);
  const getSimulatedDistance = (service) => {
    if (service.id === "serv-m1") return 1.2;
    if (service.id === "serv-m2") return 0.4;
    if (service.id === "serv-m3") return 2.8;
    if (service.id === "serv-m4") return 0.9;
    if (service.id === "serv-m5") return 1.7;
    if (service.id === "serv-m6") return 0.6;
    let hash = 0;
    const idStr = service.id || "";
    for (let j = 0; j < idStr.length; j++) {
      hash = idStr.charCodeAt(j) + ((hash << 5) - hash);
    }
    const noise = Math.abs(hash % 10) / 10;
    const isSameDistrict = service.districtName === "Kottayam";
    const isSameLocality = service.localityName === "Vaikom";
    if (isSameDistrict && isSameLocality) {
      return Math.round((0.5 + noise * 1.5) * 10) / 10;
    } else if (isSameDistrict) {
      const idx = Math.abs(hash % 12) + 3;
      return Math.round((idx + noise) * 10) / 10;
    } else {
      const distMapping = {
        "Alappuzha": 34,
        "Ernakulam": 42,
        "Idukki": 74,
        "Pathanamthitta": 66,
        "Kollam": 112,
        "Thrissur": 122,
        "Thiruvananthapuram": 174,
        "Palakkad": 182,
        "Malappuram": 224,
        "Kozhikode": 268,
        "Wayanad": 322,
        "Kannur": 354,
        "Kasaragod": 435
      };
      const baseDist = distMapping[service.districtName || ""] || 160;
      return Math.round((baseDist + noise * 12) * 10) / 10;
    }
  };
  const getServiceSearchText = (service) => {
    const translationText = Object.values(service.translations || {})
      .flatMap((entry) => [
        entry.title,
        entry.description,
        entry.category,
        entry.location,
        entry.hours,
        entry.contactName,
        ...(entry.history || []),
        ...(entry.extraNotes || [])
      ])
      .filter(Boolean);

    return normalizeSearchText([
      ...translationText,
      service.categoryKey,
      service.districtName,
      service.localityName,
      service.phoneNumber,
      ...(CATEGORY_ALIASES[service.categoryKey] || [])
    ].join(" "));
  };
  const getSearchScore = (haystack, haystackTokens, normalizedQuery) => {
    if (!normalizedQuery) return 0;
    if (haystack.includes(normalizedQuery)) return 120 + normalizedQuery.length;

    const queryTokens = normalizedQuery.split(" ").filter(Boolean);
    let score = 0;

    queryTokens.forEach((queryToken) => {
      let bestTokenScore = 0;
      const maxDistance = queryToken.length > 7 ? 2 : 1;

      for (const token of haystackTokens) {
        if (token === queryToken) {
          bestTokenScore = 32;
          break;
        }
        if (bestTokenScore < 20 && (token.startsWith(queryToken) || token.includes(queryToken))) {
          bestTokenScore = 20;
          continue;
        }
        if (
          bestTokenScore < 14
          && queryToken.length >= 4
          && token.length >= 4
          && Math.abs(token.length - queryToken.length) <= maxDistance
          && levenshteinDistance(queryToken, token) <= maxDistance
        ) {
          bestTokenScore = 14;
        }
      }

      score += bestTokenScore;
    });

    return score;
  };
  const getVerificationAgeDays = (service) => {
    if (!service.lastVerified) return 999;
    const verifiedDate = new Date(service.lastVerified);
    if (Number.isNaN(verifiedDate.getTime())) return 999;
    return Math.max(0, Math.floor((Date.now() - verifiedDate.getTime()) / 86400000));
  };
  const getDuplicateCount = (service, counts) => counts[getDuplicateKey(service)] || 0;
  const getVerificationScore = (service, counts) => {
    const data = service.translations.en || Object.values(service.translations || {})[0] || {};
    let score = 40;
    if (service.phoneNumber) score += 12;
    if (data.location) score += 10;
    if (data.hours) score += 10;
    if (data.contactName) score += 8;
    if (Object.keys(service.translations || {}).length >= 4) score += 8;
    if (getVerificationAgeDays(service) <= 30) score += 12;
    if (getDuplicateCount(service, counts) > 1) score -= 15;
    return Math.max(35, Math.min(100, score));
  };
  const getConfidenceLevel = (score) => {
    if (score >= 86) return "High confidence";
    if (score >= 68) return "Needs routine check";
    return "Verify before visiting";
  };
  const getLastCheckedBy = (service) => {
    const checkerByCategory = {
      health: "Health volunteer desk",
      water: "Ward water committee",
      agriculture: "Krishi help desk",
      education: "School liaison desk",
      government: "Panchayat registry desk"
    };
    return checkerByCategory[service.categoryKey] || "Local volunteer desk";
  };
  const [services, setServices] = useState([]);
  const [selectedDetailService, setSelectedDetailService] = useState(null);
  const [detailPreviewLang, setDetailPreviewLang] = useState(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isMapDragging, setIsMapDragging] = useState(false);
  const [mapDragStart, setMapDragStart] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleKeyboardShortcuts = (event) => {
      const target = event.target;
      const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      if (event.key === "Escape") {
        if (reportService) {
          setReportService(null);
        } else if (selectedDetailService) {
          setSelectedDetailService(null);
          setDetailPreviewLang(null);
        } else if (searchQuery) {
          setSearchQuery("");
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyboardShortcuts);
    return () => window.removeEventListener("keydown", handleKeyboardShortcuts);
  }, [reportService, searchQuery, selectedDetailService]);
  useEffect(() => {
    if (selectedDetailService) {
      setMapZoom(1);
      setMapPan({ x: 0, y: 0 });
      setIsMapDragging(false);
    }
  }, [selectedDetailService]);
  const getServiceHistory = (service) => {
    const trans = service.translations[language] || service.translations["en"];
    if (trans.history && trans.history.length > 0) {
      return trans.history;
    }
    switch (service.categoryKey) {
      case "health":
        switch (language) {
          case "hi":
            return [
              "24 \u0918\u0902\u091F\u0947 \u092A\u0939\u0932\u0947: \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915 \u091F\u0940\u0915\u093E\u0915\u0930\u0923 \u0938\u094D\u091F\u0949\u0915 \u0914\u0930 \u092C\u093E\u0932 \u092A\u0942\u0930\u0915 \u092D\u094B\u091C\u0928 \u0906\u092A\u0942\u0930\u094D\u0924\u093F \u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u0915\u093F\u092F\u093E \u0917\u092F\u093E\u0964",
              "3 \u0926\u093F\u0928 \u092A\u0939\u0932\u0947: \u091A\u093F\u0915\u093F\u0924\u094D\u0938\u093E \u0905\u0927\u093F\u0915\u093E\u0930\u0940 \u0926\u094D\u0935\u093E\u0930\u093E \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915 \u091A\u093F\u0915\u093F\u0924\u094D\u0938\u093E \u0915\u093F\u091F \u0938\u094D\u091F\u0949\u0915 \u0915\u093E \u092A\u0941\u0928: \u0928\u093F\u0930\u0940\u0915\u094D\u0937\u0923 \u0915\u093F\u092F\u093E \u0917\u092F\u093E\u0964",
              "1 \u0938\u092A\u094D\u0924\u093E\u0939 \u092A\u0939\u0932\u0947: \u0938\u094C\u0930 \u090A\u0930\u094D\u091C\u093E \u0926\u094D\u0935\u093E\u0930\u093E \u0938\u0902\u091A\u093E\u0932\u093F\u0924 \u091F\u0940\u0915\u093E \u092A\u094D\u0930\u0936\u0940\u0924\u0928 \u092C\u0948\u091F\u0930\u0940 \u0915\u093E \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u092A\u0942\u0930\u094D\u0923 \u0939\u0941\u0906\u0964"
            ];
          case "te":
            return [
              "24 \u0C17\u0C02\u0C1F\u0C32 \u0C15\u0C4D\u0C30\u0C3F\u0C24\u0C02: \u0C36\u0C3F\u0C36\u0C41 \u0C28\u0C3F\u0C30\u0C4B\u0C27\u0C15 \u0C1F\u0C40\u0C15\u0C3E\u0C32\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2A\u0C4D\u0C30\u0C3E\u0C25\u0C2E\u0C3F\u0C15 \u0C06\u0C30\u0C4B\u0C17\u0C4D\u0C2F \u0C2E\u0C02\u0C26\u0C41\u0C32 \u0C28\u0C3F\u0C32\u0C4D\u0C35 \u0C27\u0C43\u0C35\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F.",
              "3 \u0C30\u0C4B\u0C1C\u0C41\u0C32 \u0C15\u0C4D\u0C30\u0C3F\u0C24\u0C02: \u0C06\u0C30\u0C4B\u0C17\u0C4D\u0C2F \u0C2C\u0C4B\u0C30\u0C4D\u0C21\u0C41 \u0C05\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C3F \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C2A\u0C4D\u0C30\u0C25\u0C2E \u0C1A\u0C3F\u0C15\u0C3F\u0C24\u0C4D\u0C38 \u0C2E\u0C02\u0C26\u0C41\u0C32 \u0C2A\u0C41\u0C28\u0C03\u0C38\u0C4D\u0C25\u0C3E\u0C2A\u0C28 \u0C1C\u0C30\u0C3F\u0C17\u0C3F\u0C02\u0C26\u0C3F.",
              "1 \u0C35\u0C3E\u0C30\u0C02 \u0C15\u0C4D\u0C30\u0C3F\u0C24\u0C02: \u0C35\u0C4D\u0C2F\u0C3E\u0C15\u0C4D\u0C38\u0C3F\u0C28\u0C4D \u0C28\u0C3F\u0C32\u0C4D\u0C35 \u0C38\u0C4B\u0C32\u0C3E\u0C30\u0C4D \u0C30\u0C3F\u0C2B\u0C4D\u0C30\u0C3F\u0C1C\u0C3F\u0C30\u0C47\u0C1F\u0C30\u0C4D \u0C2C\u0C4D\u0C2F\u0C3E\u0C1F\u0C30\u0C40\u0C32\u0C41 \u0C35\u0C3F\u0C1C\u0C2F\u0C35\u0C02\u0C24\u0C02\u0C17\u0C3E \u0C2A\u0C28\u0C3F\u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C2F\u0C28\u0C3F \u0C28\u0C3F\u0C35\u0C47\u0C26\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F."
            ];
          case "ml":
            return [
              "24 \u0D2E\u0D23\u0D3F\u0D15\u0D4D\u0D15\u0D42\u0D7C \u0D2E\u0D41\u0D7B\u0D2A\u0D4D: \u0D15\u0D41\u0D1F\u0D4D\u0D1F\u0D3F\u0D15\u0D7E\u0D15\u0D4D\u0D15\u0D41\u0D33\u0D4D\u0D33 \u0D15\u0D41\u0D24\u0D4D\u0D24\u0D3F\u0D35\u0D46\u0D2A\u0D4D\u0D2A\u0D4D \u0D2E\u0D30\u0D41\u0D28\u0D4D\u0D28\u0D41\u0D15\u0D33\u0D41\u0D1F\u0D46 \u0D32\u0D2D\u0D4D\u0D2F\u0D24 \u0D2A\u0D30\u0D3F\u0D36\u0D4B\u0D27\u0D3F\u0D1A\u0D4D\u0D1A\u0D41\u0D31\u0D2A\u0D4D\u0D2A\u0D3E\u0D15\u0D4D\u0D15\u0D3F.",
              "3 \u0D26\u0D3F\u0D35\u0D38\u0D02 \u0D2E\u0D41\u0D7B\u0D2A\u0D4D: \u0D38\u0D41\u0D30\u0D15\u0D4D\u0D37\u0D3E \u0D2E\u0D3E\u0D28\u0D26\u0D23\u0D4D\u0D21\u0D19\u0D4D\u0D19\u0D7E \u0D2E\u0D46\u0D21\u0D3F\u0D15\u0D4D\u0D15\u0D7D \u0D13\u0D2B\u0D40\u0D38\u0D7C \u0D2A\u0D30\u0D3F\u0D36\u0D4B\u0D27\u0D3F\u0D1A\u0D4D\u0D1A\u0D4D \u0D38\u0D3E\u0D15\u0D4D\u0D37\u0D4D\u0D2F\u0D2A\u0D4D\u0D2A\u0D46\u0D1F\u0D41\u0D24\u0D4D\u0D24\u0D3F.",
              "1 \u0D06\u0D34\u0D4D\u200C\u0D1A \u0D2E\u0D41\u0D7B\u0D2A\u0D4D: \u0D35\u0D3E\u0D15\u0D4D\u0D38\u0D3F\u0D7B \u0D15\u0D47\u0D1F\u0D41\u0D15\u0D42\u0D1F\u0D3E\u0D24\u0D46 \u0D38\u0D42\u0D15\u0D4D\u0D37\u0D3F\u0D15\u0D4D\u0D15\u0D3E\u0D28\u0D41\u0D33\u0D4D\u0D33 \u0D38\u0D4B\u0D33\u0D3E\u0D7C \u0D31\u0D2B\u0D4D\u0D30\u0D3F\u0D1C\u0D31\u0D47\u0D31\u0D4D\u0D31\u0D7C \u0D2A\u0D4D\u0D30\u0D35\u0D7C\u0D24\u0D4D\u0D24\u0D28\u0D02 \u0D2A\u0D30\u0D3F\u0D36\u0D4B\u0D27\u0D3F\u0D1A\u0D4D\u0D1A\u0D41."
            ];
          default:
            return [
              "24 hours ago: Child immunization card inventories and essential cold-chain vaccine checked.",
              "3 days ago: Primary first-aid boxes and trauma bandages cargo verified by District Health Desk.",
              "1 week ago: Micro-solar back-up battery and vaccine cabinet temperature log validated."
            ];
        }
      case "water":
        switch (language) {
          case "hi":
            return [
              "12 \u0918\u0902\u091F\u0947 \u092A\u0939\u0932\u0947: \u092C\u094B\u0930\u0935\u0947\u0932 \u0938\u0902\u091A\u093E\u0932\u0928 \u0915\u093E \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u0914\u0930 \u091F\u0940\u0921\u0940\u090F\u0938 \u092A\u093E\u0928\u0940 \u0915\u0940 \u0917\u0941\u0923\u0935\u0924\u094D\u0924\u093E \u0915\u0940 \u091C\u093E\u0902\u091A \u0938\u092B\u0932 \u0930\u0939\u0940\u0964",
              "2 \u0926\u093F\u0928 \u092A\u0939\u0932\u0947: \u0906\u0930\u0913 \u0928\u093F\u0938\u094D\u092A\u0902\u0926\u0928 \u091D\u093F\u0932\u094D\u0932\u0940 (\u0906\u0930\u0913 \u092E\u0947\u092E\u094D\u092C\u094D\u0930\u0947\u0928) \u0915\u093E \u092C\u0948\u0915\u0935\u093E\u0936 \u091A\u0915\u094D\u0930 \u092A\u0942\u0930\u093E \u0915\u093F\u092F\u093E \u0917\u092F\u093E\u0964",
              "1 \u0938\u092A\u094D\u0924\u093E\u0939 \u092A\u0939\u0932\u0947: \u0917\u094D\u0930\u093E\u092E \u091C\u0932 \u0938\u092E\u093F\u0924\u093F \u0926\u094D\u0935\u093E\u0930\u093E \u0913\u0935\u0930\u0939\u0947\u0921 \u091F\u0948\u0902\u0915 \u0938\u094D\u0935\u091A\u094D\u091B\u0924\u093E \u0915\u093E \u0911\u0921\u093F\u091F \u0938\u092B\u0932 \u0930\u0939\u093E\u0964"
            ];
          case "te":
            return [
              "12 \u0C17\u0C02\u0C1F\u0C32 \u0C15\u0C4D\u0C30\u0C3F\u0C24\u0C02: \u0C28\u0C40\u0C1F\u0C3F \u0C28\u0C3E\u0C23\u0C4D\u0C2F\u0C24 \u0C2A\u0C30\u0C40\u0C15\u0C4D\u0C37 (TDS \u0C38\u0C4D\u0C25\u0C3E\u0C2F\u0C3F) \u0C35\u0C3F\u0C1C\u0C2F\u0C35\u0C02\u0C24\u0C02\u0C17\u0C3E \u0C27\u0C43\u0C35\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F.",
              "2 \u0C30\u0C4B\u0C1C\u0C41\u0C32 \u0C15\u0C4D\u0C30\u0C3F\u0C24\u0C02: \u0C2B\u0C3F\u0C32\u0C4D\u0C1F\u0C30\u0C4D \u0C2A\u0C4D\u0C32\u0C3E\u0C02\u0C1F\u0C4D \u0C06\u0C30\u0C4D.\u0C13 \u0C2E\u0C46\u0C02\u0C2C\u0C4D\u0C30\u0C47\u0C28\u0C4D \u0C35\u0C3F\u0C1C\u0C2F\u0C35\u0C02\u0C24\u0C02\u0C17\u0C3E \u0C15\u0C4D\u0C32\u0C40\u0C28\u0C4D \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F.",
              "1 \u0C35\u0C3E\u0C30\u0C02 \u0C15\u0C4D\u0C30\u0C3F\u0C24\u0C02: \u0C17\u0C4D\u0C30\u0C3E\u0C2E \u0C28\u0C40\u0C1F\u0C3F \u0C15\u0C2E\u0C3F\u0C1F\u0C40 \u0C38\u0C2D\u0C4D\u0C2F\u0C41\u0C32 \u0C38\u0C2E\u0C15\u0C4D\u0C37\u0C02\u0C32\u0C4B \u0C1F\u0C4D\u0C2F\u0C3E\u0C02\u0C15\u0C4D \u0C15\u0C4D\u0C32\u0C4B\u0C30\u0C3F\u0C28\u0C47\u0C37\u0C28\u0C4D \u0C06\u0C21\u0C3F\u0C1F\u0C4D \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F."
            ];
          case "ml":
            return [
              "12 \u0D2E\u0D23\u0D3F\u0D15\u0D4D\u0D15\u0D42\u0D7C \u0D2E\u0D41\u0D7B\u0D2A\u0D4D: \u0D15\u0D41\u0D1F\u0D3F\u0D35\u0D46\u0D33\u0D4D\u0D33\u0D24\u0D4D\u0D24\u0D3F\u0D28\u0D4D\u0D31\u0D46 \u0D36\u0D41\u0D26\u0D4D\u0D27\u0D3F \u0D05\u0D33\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D1F\u0D3F\u0D21\u0D3F\u0D0E\u0D38\u0D4D \u0D2A\u0D30\u0D3F\u0D36\u0D4B\u0D27\u0D28 \u0D2A\u0D42\u0D7C\u0D24\u0D4D\u0D24\u0D3F\u0D2F\u0D3E\u0D15\u0D4D\u0D15\u0D3F.",
              "2 \u0D26\u0D3F\u0D35\u0D38\u0D02 \u0D2E\u0D41\u0D7B\u0D2A\u0D4D: \u0D31\u0D3F\u0D35\u0D47\u0D34\u0D4D\u200C\u0D38\u0D4D \u0D13\u0D38\u0D4D\u0D2E\u0D4B\u0D38\u0D3F\u0D38\u0D4D (RO) \u0D2A\u0D4D\u0D32\u0D3E\u0D28\u0D4D\u0D31\u0D3F\u0D32\u0D46 \u0D2B\u0D3F\u0D7D\u0D1F\u0D4D\u0D1F\u0D31\u0D41\u0D15\u0D7E \u0D35\u0D43\u0D24\u0D4D\u0D24\u0D3F\u0D2F\u0D3E\u0D15\u0D4D\u0D15\u0D3F.",
              "1 \u0D06\u0D34\u0D4D\u200C\u0D1A \u0D2E\u0D41\u0D7B\u0D2A\u0D4D: \u0D35\u0D3E\u0D1F\u0D4D\u0D1F\u0D7C\u0D2E\u0D4D\u0D2E\u0D3F\u0D31\u0D4D\u0D31\u0D3F\u0D2F\u0D41\u0D1F\u0D46 \u0D06\u0D2D\u0D3F\u0D2E\u0D41\u0D16\u0D4D\u0D2F\u0D24\u0D4D\u0D24\u0D3F\u0D7D \u0D13\u0D35\u0D7C\u0D39\u0D46\u0D21\u0D4D \u0D1F\u0D3E\u0D19\u0D4D\u0D15\u0D4D \u0D15\u0D4D\u0D32\u0D4B\u0D31\u0D3F\u0D28\u0D47\u0D37\u0D7B \u0D2A\u0D42\u0D7C\u0D24\u0D4D\u0D24\u0D3F\u0D2F\u0D3E\u0D15\u0D4D\u0D15\u0D3F."
            ];
          default:
            return [
              "12 hours ago: Hourly borewell outflow rate and water TDS (turbidity) levels validated.",
              "2 days ago: Reverse osmosis filtration filtration membrane clean backwash cycle executed.",
              "1 week ago: Overhead distribution steel tank chlorination audited and certified safe."
            ];
        }
      case "agriculture":
        switch (language) {
          case "hi":
            return [
              "\u0906\u091C: \u0915\u0932\u094D\u092F\u093E\u0923\u0938\u094B\u0928\u093E \u0909\u091A\u094D\u091A-\u0917\u0941\u0923\u0935\u0924\u094D\u0924\u093E \u092C\u0940\u091C \u0938\u094D\u091F\u0949\u0915 \u0915\u0947 \u092C\u092B\u0930 \u0915\u093E \u0928\u093F\u0930\u0940\u0915\u094D\u0937\u0923 \u0915\u093F\u092F\u093E \u0917\u092F\u093E\u0964",
              "3 \u0926\u093F\u0928 \u092A\u0939\u0932\u0947: \u0938\u0939\u0915\u093E\u0930\u0940 \u091C\u0948\u0935-\u0909\u0930\u094D\u0935\u0930\u0915 \u0915\u0940 \u0928\u0908 \u0916\u0947\u092A \u0921\u093F\u092A\u094B \u092E\u0947\u0902 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0939\u0941\u0908\u0964",
              "1 \u0938\u092A\u094D\u0924\u093E\u0939 \u092A\u0939\u0932\u0947: \u092E\u0943\u0926\u093E \u092A\u0930\u0940\u0915\u094D\u0937\u0923 \u0921\u093F\u091C\u093F\u091F\u0932 \u0930\u0940\u0921\u0930 \u0915\u093E \u0905\u0902\u0936\u093E\u0902\u0915\u0928 \u0914\u0930 \u0938\u0924\u094D\u092F\u093E\u092A\u0928 \u092A\u0942\u0930\u094D\u0923 \u0915\u0902\u092A\u094D\u092F\u0942\u091F\u0930 \u0905\u092A\u0921\u0947\u091F \u0915\u0947 \u0938\u093E\u0925 \u092A\u0942\u0930\u093E\u0964"
            ];
          case "te":
            return [
              "\u0C08\u0C30\u0C4B\u0C1C\u0C41: \u0C32\u0C2D\u0C4D\u0C2F\u0C24\u0C32\u0C4B \u0C09\u0C28\u0C4D\u0C28 \u0C2E\u0C47\u0C32\u0C41\u0C30\u0C15\u0C02 \u0C35\u0C3F\u0C24\u0C4D\u0C24\u0C28\u0C3E\u0C32 \u0C38\u0C02\u0C1A\u0C3F \u0C28\u0C3F\u0C32\u0C4D\u0C35\u0C32\u0C28\u0C41 \u0C24\u0C28\u0C3F\u0C16\u0C40 \u0C1A\u0C47\u0C36\u0C3E\u0C30\u0C41.",
              "3 \u0C30\u0C4B\u0C1C\u0C41\u0C32 \u0C15\u0C4D\u0C30\u0C3F\u0C24\u0C02: \u0C38\u0C39\u0C15\u0C3E\u0C30 \u0C38\u0C47\u0C02\u0C26\u0C4D\u0C30\u0C40\u0C2F \u0C0E\u0C30\u0C41\u0C35\u0C41\u0C32 \u0C38\u0C2A\u0C4D\u0C32\u0C48 \u0C35\u0C3F\u0C1C\u0C2F\u0C35\u0C02\u0C24\u0C02\u0C17\u0C3E \u0C21\u0C3F\u0C2A\u0C4B\u0C15\u0C41 \u0C1A\u0C47\u0C30\u0C3F\u0C02\u0C26\u0C3F.",
              "1 \u0C35\u0C3E\u0C30\u0C02 \u0C15\u0C4D\u0C30\u0C3F\u0C24\u0C02: \u0C38\u0C30\u0C3F\u0C15\u0C4A\u0C24\u0C4D\u0C24 \u0C21\u0C3F\u0C1C\u0C3F\u0C1F\u0C32\u0C4D \u0C28\u0C47\u0C32 \u0C2A\u0C30\u0C40\u0C15\u0C4D\u0C37 \u0C2A\u0C30\u0C3F\u0C15\u0C30\u0C02 \u0C27\u0C43\u0C35\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F."
            ];
          case "ml":
            return [
              "\u0D07\u0D28\u0D4D\u0D28\u0D4D: \u0D15\u0D7C\u0D37\u0D15\u0D7C\u0D15\u0D4D\u0D15\u0D41\u0D33\u0D4D\u0D33 \u0D38\u0D2C\u0D4D\u200C\u0D38\u0D3F\u0D21\u0D3F \u0D35\u0D33\u0D19\u0D4D\u0D19\u0D33\u0D41\u0D1F\u0D46\u0D2F\u0D41\u0D02 \u0D35\u0D3F\u0D24\u0D4D\u0D24\u0D41 \u0D35\u0D3F\u0D24\u0D30\u0D23 \u0D36\u0D43\u0D02\u0D16\u0D32\u0D2F\u0D41\u0D1F\u0D46\u0D2F\u0D41\u0D02 \u0D38\u0D4D\u0D31\u0D4D\u0D31\u0D4B\u0D15\u0D4D\u0D15\u0D4D \u0D2A\u0D30\u0D3F\u0D36\u0D4B\u0D27\u0D3F\u0D1A\u0D4D\u0D1A\u0D41.",
              "3 \u0D26\u0D3F\u0D35\u0D38\u0D02 \u0D2E\u0D41\u0D7B\u0D2A\u0D4D: \u0D1C\u0D48\u0D35 \u0D35\u0D33\u0D19\u0D4D\u0D19\u0D33\u0D41\u0D1F\u0D46\u0D2F\u0D41\u0D02 \u0D24\u0D46\u0D19\u0D4D\u0D19\u0D3F\u0D7B \u0D24\u0D48\u0D15\u0D33\u0D41\u0D1F\u0D46\u0D2F\u0D41\u0D02 \u0D2A\u0D41\u0D24\u0D3F\u0D2F \u0D2C\u0D3E\u0D1A\u0D4D\u0D1A\u0D4D \u0D13\u0D2B\u0D40\u0D38\u0D3F\u0D7D \u0D0E\u0D24\u0D4D\u0D24\u0D3F\u0D1A\u0D4D\u0D1A\u0D41.",
              "1 \u0D06\u0D34\u0D4D\u200C\u0D1A \u0D2E\u0D41\u0D7B\u0D2A\u0D4D: \u0D2E\u0D23\u0D4D\u0D23\u0D4D \u0D2A\u0D30\u0D3F\u0D36\u0D4B\u0D27\u0D28\u0D3E \u0D35\u0D3F\u0D2D\u0D3E\u0D17\u0D24\u0D4D\u0D24\u0D3F\u0D32\u0D46 \u0D36\u0D3E\u0D38\u0D4D\u0D24\u0D4D\u0D30\u0D40\u0D2F \u0D15\u0D4D\u0D2F\u0D3E\u0D32\u0D3F\u0D2C\u0D4D\u0D30\u0D47\u0D37\u0D7B \u0D35\u0D3F\u0D1C\u0D2F\u0D15\u0D30\u0D2E\u0D3E\u0D2F\u0D3F \u0D2A\u0D42\u0D7C\u0D24\u0D4D\u0D24\u0D3F\u0D2F\u0D3E\u0D15\u0D4D\u0D15\u0D3F."
            ];
          default:
            return [
              "Today: Certified high-yield wheat (Kalyansona) seed stock balance verified.",
              "3 days ago: Liquid bio-fertilizer supply freight registered and stocked into warehouse.",
              "1 week ago: Soil testing electronic calibration probe benchmark set."
            ];
        }
      case "education":
        switch (language) {
          case "hi":
            return [
              "\u0915\u0932: \u092C\u091A\u094D\u091A\u094B\u0902 \u0915\u0947 \u0926\u0948\u0928\u093F\u0915 \u092E\u0927\u094D\u092F\u093E\u0939\u094D\u0928 \u092A\u094C\u0937\u094D\u091F\u093F\u0915 \u092D\u094B\u091C\u0928 \u0915\u0940 \u0938\u094D\u0935\u091A\u094D\u091B\u0924\u093E \u092E\u0902\u091C\u0942\u0930\u0940 \u092A\u094D\u0930\u092E\u093E\u0923\u093F\u0924 \u0939\u0941\u0908\u0964",
              "4 \u0926\u093F\u0928 \u092A\u0939\u0932\u0947: \u0908-\u0932\u0930\u094D\u0928\u093F\u0902\u0917 \u0915\u0902\u092A\u094D\u092F\u0942\u091F\u0930 \u0932\u0948\u092C \u0915\u0947 \u0938\u094C\u0930 \u092C\u0948\u091F\u0930\u0940 \u0907\u0928\u0935\u0930\u094D\u091F\u0930 \u0938\u0930\u094D\u0935\u093F\u0938\u093F\u0902\u0917 \u0915\u0940 \u0917\u0908\u0964",
              "2 \u0938\u092A\u094D\u0924\u093E\u0939 \u092A\u0939\u0932\u0947: \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915 \u0936\u093F\u0915\u094D\u0937\u093E \u092C\u094B\u0930\u094D\u0921 \u0926\u094D\u0935\u093E\u0930\u093E \u0928\u0908 \u092A\u093E\u0920\u094D\u092F\u092A\u0941\u0938\u094D\u0924\u0915\u094B\u0902 \u0915\u093E \u0928\u093F: \u0936\u0941\u0932\u094D\u0915 \u0935\u093F\u0924\u0930\u0923 \u0938\u0902\u092A\u0928\u094D\u0928\u0964"
            ];
          case "te":
            return [
              "\u0C28\u0C3F\u0C28\u0C4D\u0C28: \u0C2E\u0C27\u0C4D\u0C2F\u0C3E\u0C39\u0C4D\u0C28 \u0C2D\u0C4B\u0C1C\u0C28 \u0C2A\u0C25\u0C15\u0C02\u0C32\u0C4B \u0C2A\u0C4D\u0C30\u0C24\u0C3F \u0C35\u0C3F\u0C26\u0C4D\u0C2F\u0C3E\u0C30\u0C4D\u0C25\u0C3F\u0C15\u0C3F \u0C35\u0C3F\u0C1F\u0C2E\u0C3F\u0C28\u0C4D\u0C32\u0C41 \u0C15\u0C32\u0C3F\u0C17\u0C3F\u0C28 \u0C2A\u0C4C\u0C37\u0C4D\u0C1F\u0C3F\u0C15\u0C3E\u0C39\u0C3E\u0C30\u0C02 \u0C05\u0C02\u0C26\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F.",
              "4 \u0C30\u0C4B\u0C1C\u0C41\u0C32 \u0C15\u0C4D\u0C30\u0C3F\u0C24\u0C02: \u0C08-\u0C32\u0C46\u0C30\u0C4D\u0C28\u0C3F\u0C02\u0C17\u0C4D \u0C30\u0C42\u0C2E\u0C4D \u0C38\u0C4B\u0C32\u0C3E\u0C30\u0C4D \u0C2A\u0C35\u0C30\u0C4D \u0C07\u0C28\u0C4D\u0C35\u0C30\u0C4D\u0C1F\u0C30\u0C4D \u0C2C\u0C4D\u0C2F\u0C3E\u0C1F\u0C30\u0C40 \u0C38\u0C30\u0C4D\u0C35\u0C40\u0C38\u0C3F\u0C02\u0C17\u0C4D \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F.",
              "2 \u0C35\u0C3E\u0C30\u0C3E\u0C32 \u0C15\u0C4D\u0C30\u0C3F\u0C24\u0C02: \u0C2A\u0C4D\u0C30\u0C3E\u0C25\u0C2E\u0C3F\u0C15 \u0C35\u0C3F\u0C26\u0C4D\u0C2F\u0C3E \u0C2E\u0C02\u0C21\u0C32\u0C3F \u0C35\u0C3E\u0C30\u0C3F \u0C2A\u0C41\u0C38\u0C4D\u0C24\u0C15\u0C3E\u0C32 \u0C09\u0C1A\u0C3F\u0C24 \u0C2A\u0C02\u0C2A\u0C3F\u0C23\u0C40 \u0C06\u0C21\u0C3F\u0C1F\u0C4D \u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C2F\u0C3F\u0C02\u0C26\u0C3F."
            ];
          case "ml":
            return [
              "\u0D07\u0D28\u0D4D\u0D28\u0D32\u0D46: \u0D09\u0D1A\u0D4D\u0D1A\u0D2D\u0D15\u0D4D\u0D37\u0D23 \u0D2A\u0D26\u0D4D\u0D27\u0D24\u0D3F\u0D2F\u0D3F\u0D32\u0D46 (\u0D38\u0D57\u0D1C\u0D28\u0D4D\u0D2F \u0D09\u0D23\u0D4D\u0D23\u0D4D) \u0D36\u0D41\u0D1A\u0D3F\u0D24\u0D4D\u0D35\u0D35\u0D41\u0D02 \u0D38\u0D41\u0D30\u0D15\u0D4D\u0D37\u0D3F\u0D24\u0D24\u0D4D\u0D35\u0D35\u0D41\u0D02 \u0D09\u0D31\u0D2A\u0D4D\u0D2A\u0D3E\u0D15\u0D4D\u0D15\u0D3F.",
              "4 \u0D26\u0D3F\u0D35\u0D38\u0D02 \u0D2E\u0D41\u0D7B\u0D2A\u0D4D: \u0D10.\u0D1F\u0D3F \u0D15\u0D2E\u0D4D\u0D2A\u0D4D\u0D2F\u0D42\u0D1F\u0D4D\u0D1F\u0D7C \u0D15\u0D4D\u0D32\u0D3E\u0D38\u0D4D\u0D31\u0D42\u0D2E\u0D3F\u0D32\u0D46 \u0D2F\u0D41\u0D2A\u0D3F\u0D0E\u0D38\u0D4D \u0D2C\u0D3E\u0D31\u0D4D\u0D31\u0D31\u0D3F \u0D2C\u0D3E\u0D15\u0D4D\u0D15\u0D2A\u0D4D\u0D2A\u0D41\u0D15\u0D7E \u0D38\u0D7C\u0D35\u0D40\u0D38\u0D4D \u0D1A\u0D46\u0D2F\u0D4D\u0D24\u0D41.",
              "2 \u0D06\u0D34\u0D4D\u200C\u0D1A \u0D2E\u0D41\u0D7B\u0D2A\u0D4D: \u0D38\u0D02\u0D38\u0D4D\u0D25\u0D3E\u0D28 \u0D35\u0D3F\u0D26\u0D4D\u0D2F\u0D3E\u0D2D\u0D4D\u0D2F\u0D3E\u0D38 \u0D2C\u0D4B\u0D7C\u0D21\u0D3F\u0D28\u0D4D\u0D31\u0D46 \u0D2A\u0D41\u0D24\u0D3F\u0D2F \u0D2A\u0D3E\u0D20\u0D2A\u0D41\u0D38\u0D4D\u0D24\u0D15\u0D19\u0D4D\u0D19\u0D33\u0D41\u0D1F\u0D46 \u0D35\u0D3F\u0D24\u0D30\u0D23\u0D02 \u0D2A\u0D42\u0D7C\u0D24\u0D4D\u0D24\u0D3F\u0D2F\u0D3E\u0D15\u0D4D\u0D15\u0D3F."
            ];
          default:
            return [
              "Yesterday: Daily Mid-Day Meal nutrition safety & hygiene audit clearance standard granted.",
              "4 days ago: Computer lab e-classroom solar storage inverter batteries fully serviced.",
              "2 weeks ago: Free primary textbook library stock replenished and logged."
            ];
        }
      default:
        switch (language) {
          case "hi":
            return [
              "\u0915\u0932: \u091C\u0928 \u0936\u093F\u0915\u093E\u092F\u0924 \u092A\u0941\u0938\u094D\u0924\u093F\u0915\u093E \u0915\u093E \u0921\u093F\u091C\u093F\u091F\u0932\u0940\u0915\u0930\u0923 \u0915\u093F\u092F\u093E \u0917\u092F\u093E \u0914\u0930 \u0911\u0928\u0932\u093E\u0907\u0928 \u092A\u094B\u0930\u094D\u091F\u0932 \u092A\u0930 \u0938\u093F\u0902\u0915 \u0915\u093F\u092F\u093E \u0917\u092F\u093E\u0964",
              "3 \u0926\u093F\u0928 \u092A\u0939\u0932\u0947: \u092A\u0902\u091A\u093E\u092F\u0924 \u0935\u093F\u0915\u093E\u0938 \u0915\u094B\u0937 \u0916\u0930\u094D\u091A \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u092C\u094B\u0930\u094D\u0921 \u092A\u0930 \u0938\u093E\u0930\u094D\u0935\u091C\u0928\u093F\u0915 \u0930\u0942\u092A \u0938\u0947 \u091A\u0938\u094D\u092A\u093E \u0915\u0940 \u0917\u0908\u0964",
              "1 \u0938\u092A\u094D\u0924\u093E\u0939 \u092A\u0939\u0932\u0947: \u0928\u0935\u0928\u093F\u0930\u094D\u0935\u093E\u091A\u093F\u0924 \u0909\u092A\u0917\u094D\u0930\u093E\u092E \u0938\u092E\u093F\u0924\u093F \u0938\u0926\u0938\u094D\u092F\u094B\u0902 \u0915\u0940 \u092C\u0948\u0920\u0915 \u0906\u092F\u094B\u091C\u093F\u0924 \u0914\u0930 \u092E\u093F\u0928\u091F \u092C\u0941\u0915 \u092A\u0930 \u0939\u0938\u094D\u0924\u093E\u0915\u094D\u0937\u0930 \u0939\u0941\u090F\u0964"
            ];
          case "te":
            return [
              "\u0C28\u0C3F\u0C28\u0C4D\u0C28: \u0C2A\u0C4D\u0C30\u0C1C\u0C3E \u0C2B\u0C3F\u0C30\u0C4D\u0C2F\u0C3E\u0C26\u0C41\u0C32 \u0C30\u0C3F\u0C1C\u0C3F\u0C38\u0C4D\u0C1F\u0C30\u0C4D \u0C21\u0C3F\u0C1C\u0C3F\u0C1F\u0C32\u0C48\u0C1C\u0C4D \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C3F \u0C2A\u0C4D\u0C30\u0C2D\u0C41\u0C24\u0C4D\u0C35 \u0C35\u0C46\u0C2C\u0C4D\u200C\u0C38\u0C48\u0C1F\u0C4D\u200C\u0C15\u0C41 \u0C2A\u0C02\u0C2A\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F.",
              "3 \u0C30\u0C4B\u0C1C\u0C41\u0C32 \u0C15\u0C4D\u0C30\u0C3F\u0C24\u0C02: \u0B95\u0BBF\u0BB0\u0BBE\u0BAE \u0BAA\u0B9E\u0BCD\u0B9A\u0D3E\u0D2F\u0C24\u0C40 \u0C05\u0C2D\u0C3F\u0C35\u0C43\u0C26\u0C4D\u0C27\u0C3F \u0C28\u0C3F\u0C27\u0C41\u0C32 \u0C16\u0C30\u0C4D\u0C1A\u0C41\u0C32 \u0C2A\u0C24\u0C4D\u0C30\u0C3E\u0C32\u0C28\u0C41 \u0C2C\u0C4B\u0C30\u0C4D\u0C21\u0C41\u0C2A\u0C48 \u0C2A\u0C4D\u0C30\u0C26\u0C30\u0C4D\u0C36\u0C3F\u0C02\u0C1A\u0C3E\u0C30\u0C41.",
              "1 \u0C35\u0C3E\u0C30\u0C02 \u0C15\u0C4D\u0C30\u0C3F\u0C24\u0C02: \u0C2A\u0C02\u0C1A\u0C3E\u0C2F\u0C24\u0C40 \u0C38\u0C2E\u0C3F\u0C24\u0C3F \u0C38\u0C30\u0C4D\u0C2A\u0C02\u0C1A\u0C4D \u0C38\u0C2E\u0C15\u0C4D\u0C37\u0C02\u0C32\u0C4B \u0C1C\u0C30\u0C3F\u0C17\u0C3F\u0C28 \u0C2A\u0C4D\u0C30\u0C1C\u0C3E \u0C24\u0C40\u0C30\u0C4D\u0C2E\u0C3E\u0C28\u0C02 \u0C28\u0C2E\u0C4B\u0C26\u0C41 \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F."
            ];
          case "ml":
            return [
              "\u0D07\u0D28\u0D4D\u0D28\u0D32\u0D46: \u0D24\u0D26\u0D4D\u0D26\u0D47\u0D36 \u0D2A\u0D4A\u0D24\u0D41\u0D2A\u0D30\u0D3E\u0D24\u0D3F \u0D2A\u0D30\u0D3F\u0D39\u0D3E\u0D30 \u0D38\u0D46\u0D32\u0D4D\u0D32\u0D3F\u0D32\u0D46 \u0D05\u0D2A\u0D47\u0D15\u0D4D\u0D37\u0D15\u0D7E \u0D2A\u0D1E\u0D4D\u0D1A\u0D3E\u0D2F\u0D24\u0D4D\u0D24\u0D4D \u0D35\u0D46\u0D2C\u0D4D \u0D2A\u0D4B\u0D7C\u0D1F\u0D4D\u0D1F\u0D32\u0D3F\u0D32\u0D47\u0D15\u0D4D\u0D15\u0D4D \u0D38\u0D2E\u0D28\u0D4D\u0D35\u0D2F\u0D3F\u0D2A\u0D4D\u0D2A\u0D3F\u0D1A\u0D4D\u0D1A\u0D41.",
              "3 \u0D26\u0D3F\u0D35\u0D38\u0D02 \u0D2E\u0D41\u0D7B\u0D2A\u0D4D: \u0D38\u0D3E\u0D2E\u0D4D\u0D2A\u0D24\u0D4D\u0D24\u0D3F\u0D15 \u0D35\u0D3F\u0D15\u0D38\u0D28 \u0D2B\u0D23\u0D4D\u0D1F\u0D41\u0D15\u0D33\u0D41\u0D1F\u0D46 \u0D1A\u0D3F\u0D32\u0D35\u0D4D \u0D05\u0D35\u0D32\u0D4B\u0D15\u0D28 \u0D31\u0D3F\u0D2A\u0D4D\u0D2A\u0D4B\u0D7C\u0D1F\u0D4D\u0D1F\u0D4D \u0D28\u0D4B\u0D1F\u0D4D\u0D1F\u0D40\u0D38\u0D4D \u0D2C\u0D4B\u0D7C\u0D21\u0D3F\u0D7D \u0D2A\u0D4D\u0D30\u0D38\u0D3F\u0D26\u0D4D\u0D27\u0D40\u0D15\u0D30\u0D3F\u0D1A\u0D4D\u0D1A\u0D41.",
              "1 \u0D06\u0D34\u0D4D\u200C\u0D1A \u0D2E\u0D41\u0D7B\u0D2A\u0D4D: \u0D2A\u0D1E\u0D4D\u0D1A\u0D3E\u0D2F\u0D24\u0D4D\u0D24\u0D4D \u0D1C\u0D28\u0D2A\u0D4D\u0D30\u0D24\u0D3F\u0D28\u0D3F\u0D27\u0D3F\u0D15\u0D33\u0D41\u0D1F\u0D46 \u0D05\u0D35\u0D32\u0D4B\u0D15\u0D28 \u0D2F\u0D4B\u0D17\u0D02 \u0D24\u0D4A\u0D34\u0D3F\u0D32\u0D41\u0D31\u0D2A\u0D4D\u0D2A\u0D4D \u0D2A\u0D26\u0D4D\u0D27\u0D24\u0D3F \u0D15\u0D3E\u0D30\u0D4D\u0D2F\u0D15\u0D4D\u0D37\u0D2E\u0D24 \u0D35\u0D3F\u0D32\u0D2F\u0D3F\u0D30\u0D41\u0D24\u0D4D\u0D24\u0D3F."
            ];
          default:
            return [
              "Yesterday: Public grievance log countersigned and transmitted to district portal via cellular sync.",
              "3 days ago: Village development funds balance ledger posted on community notice board.",
              "1 week ago: Elected Ward Council session logged and birth certificates countersigned."
            ];
        }
    }
  };
  const getServiceGuidelines = (service) => {
    const trans = service.translations[language] || service.translations["en"];
    if (trans.volunteerNotesDetail) {
      return trans.volunteerNotesDetail;
    }
    switch (service.categoryKey) {
      case "health":
        switch (language) {
          case "hi":
            return "\u0938\u093F\u0938\u094D\u091F\u0930 \u0906\u0928\u0902\u0926\u0940 \u092C\u093E\u0908 \u0909\u092A-\u0915\u0947\u0902\u0926\u094D\u0930 \u092A\u0930\u093F\u0938\u0930 \u0915\u0947 \u0939\u0940 \u092C\u0917\u0932 \u092E\u0947\u0902 \u0928\u093F\u0935\u093E\u0938 \u0915\u0930\u0924\u0940 \u0939\u0948\u0902\u0964 \u0930\u093E\u0924 \u0915\u0947 \u0906\u092A\u093E\u0924\u0915\u093E\u0932\u0940\u0928 \u092A\u094D\u0930\u0938\u0935 \u092E\u093E\u092E\u0932\u094B\u0902 \u092F\u093E \u0917\u0902\u092D\u0940\u0930 \u091A\u094B\u091F\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F, \u0938\u0940\u0927\u0947 \u0909\u0928\u0915\u0947 \u0928\u093F\u0935\u093E\u0938 \u0915\u0947 \u0926\u094D\u0935\u093E\u0930 \u092A\u0930 \u0926\u0938\u094D\u0924\u0915 \u0926\u0947\u0902\u0964 \u0928\u093F\u092F\u092E\u093F\u0924 \u091F\u0940\u0915\u093E\u0915\u0930\u0923 \u0938\u0924\u094D\u0930 \u0939\u0930 \u0938\u094B\u092E\u0935\u093E\u0930 \u0914\u0930 \u0917\u0941\u0930\u0941\u0935\u093E\u0930 \u0915\u094B \u0906\u092F\u094B\u091C\u093F\u0924 \u0939\u094B\u0924\u0947 \u0939\u0948\u0902\u0964 \u0915\u0943\u092A\u092F\u093E \u092C\u091A\u094D\u091A\u0947 \u0915\u093E \u092A\u0941\u0930\u093E\u0928\u093E \u091F\u0940\u0915\u093E\u0915\u0930\u0923 \u092E\u093E\u0924\u0943 \u0915\u093E\u0930\u094D\u0921 \u0938\u093E\u0925 \u0932\u093E\u0928\u093E \u0928 \u092D\u0942\u0932\u0947\u0902\u0964";
          case "te":
            return "\u0C38\u0C3F\u0C38\u0C4D\u0C1F\u0C30\u0C4D \u0C06\u0C28\u0C02\u0C26\u0C3F \u0C2C\u0C3E\u0C2F\u0C3F \u0C06\u0C30\u0C4B\u0C17\u0C4D\u0C2F \u0C15\u0C47\u0C02\u0C26\u0C4D\u0C30\u0C02 \u0C06\u0C35\u0C30\u0C23\u0C32\u0C4B\u0C28\u0C47 \u0C28\u0C3F\u0C35\u0C38\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C1F\u0C3E\u0C30\u0C41. \u0C30\u0C3E\u0C24\u0C4D\u0C30\u0C3F \u0C35\u0C47\u0C33 \u0C05\u0C24\u0C4D\u0C2F\u0C35\u0C38\u0C30 \u0C2A\u0C4D\u0C30\u0C38\u0C35\u0C3E\u0C32\u0C41 \u0C32\u0C47\u0C26\u0C3E \u0C24\u0C40\u0C35\u0C4D\u0C30\u0C2E\u0C48\u0C28 \u0C17\u0C3E\u0C2F\u0C3E\u0C32\u0C41 \u0C35\u0C02\u0C1F\u0C3F \u0C35\u0C3F\u0C37\u0C2F\u0C3E\u0C32\u0C4D\u0C32\u0C4B \u0C39\u0C46\u0C21\u0C4D \u0C15\u0C4D\u0C35\u0C3E\u0C30\u0C4D\u0C1F\u0C30\u0C4D \u0C24\u0C32\u0C41\u0C2A\u0C41\u0C28\u0C41 \u0C28\u0C47\u0C30\u0C41\u0C17\u0C3E \u0C38\u0C02\u0C2A\u0C4D\u0C30\u0C26\u0C3F\u0C02\u0C1A\u0C35\u0C1A\u0C4D\u0C1A\u0C41. \u0C38\u0C3E\u0C27\u0C3E\u0C30\u0C23 \u0C2A\u0C4B\u0C32\u0C3F\u0C2F\u0C4B \u0C21\u0C4D\u0C30\u0C3E\u0C2A\u0C4D\u0C38\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2A\u0C3F\u0C32\u0C4D\u0C32\u0C32 \u0C1F\u0C40\u0C15\u0C3E\u0C32\u0C41 \u0C2A\u0C4D\u0C30\u0C24\u0C3F \u0C38\u0C4B\u0C2E\u0C35\u0C3E\u0C30\u0C02 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C17\u0C41\u0C30\u0C41\u0C35\u0C3E\u0C30\u0C02 \u0C09\u0C26\u0C2F\u0C02 \u0C28\u0C3F\u0C30\u0C4D\u0C35\u0C39\u0C3F\u0C38\u0C4D\u0C24\u0C3E\u0C30\u0C41. \u0C36\u0C3F\u0C36\u0C41\u0C35\u0C41 \u0C17\u0C41\u0C32\u0C3E\u0C2C\u0C40 \u0C15\u0C3E\u0C30\u0C4D\u0C21\u0C41 \u0C24\u0C2A\u0C4D\u0C2A\u0C28\u0C3F\u0C38\u0C30\u0C3F\u0C17\u0C3E \u0C24\u0C40\u0C38\u0C41\u0C15\u0C41\u0C30\u0C3E\u0C35\u0C3E\u0C32\u0C3F.";
          case "ml":
            return "\u0D39\u0D46\u0D7D\u0D24\u0D4D\u0D24\u0D4D \u0D28\u0D47\u0D34\u0D4D\u200C\u0D38\u0D4D \u0D38\u0D3F\u0D38\u0D4D\u0D31\u0D4D\u0D31\u0D7C \u0D2E\u0D47\u0D30\u0D3F \u0D1C\u0D4B\u0D38\u0D2B\u0D4D \u0D06\u0D36\u0D41\u0D2A\u0D24\u0D4D\u0D30\u0D3F \u0D35\u0D33\u0D2A\u0D4D\u0D2A\u0D3F\u0D7D \u0D24\u0D28\u0D4D\u0D28\u0D46\u0D2F\u0D3E\u0D23\u0D4D \u0D24\u0D3E\u0D2E\u0D38\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28\u0D24\u0D4D. \u0D30\u0D3E\u0D24\u0D4D\u0D30\u0D3F\u0D2F\u0D3F\u0D7D \u0D05\u0D1F\u0D3F\u0D2F\u0D28\u0D4D\u0D24\u0D3F\u0D30 \u0D2A\u0D4D\u0D30\u0D38\u0D35 \u0D06\u0D35\u0D36\u0D4D\u0D2F\u0D19\u0D4D\u0D19\u0D7E\u0D15\u0D4D\u0D15\u0D4B \u0D15\u0D20\u0D3F\u0D28\u0D2E\u0D3E\u0D2F \u0D2A\u0D30\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D15\u0D7E\u0D15\u0D4D\u0D15\u0D4B \u0D35\u0D47\u0D23\u0D4D\u0D1F\u0D3F \u0D15\u0D4B\u0D1F\u0D4D\u0D1F\u0D47\u0D34\u0D4D\u200C\u0D38\u0D4D \u0D15\u0D4B\u0D33\u0D3F\u0D02\u0D17\u0D4D \u0D2C\u0D46\u0D7D \u0D09\u0D2A\u0D2F\u0D4B\u0D17\u0D3F\u0D15\u0D4D\u0D15\u0D3E\u0D35\u0D41\u0D28\u0D4D\u0D28\u0D24\u0D3E\u0D23\u0D4D. \u0D15\u0D41\u0D1F\u0D4D\u0D1F\u0D3F\u0D15\u0D7E\u0D15\u0D4D\u0D15\u0D41\u0D33\u0D4D\u0D33 \u0D15\u0D41\u0D24\u0D4D\u0D24\u0D3F\u0D35\u0D46\u0D2A\u0D4D\u0D2A\u0D41\u0D15\u0D7E \u0D0E\u0D32\u0D4D\u0D32\u0D3E \u0D24\u0D3F\u0D19\u0D4D\u0D15\u0D33\u0D3E\u0D34\u0D4D\u0D1A\u0D2F\u0D41\u0D02 \u0D35\u0D4D\u0D2F\u0D3E\u0D34\u0D3E\u0D34\u0D4D\u0D1A\u0D2F\u0D41\u0D02 \u0D30\u0D3E\u0D35\u0D3F\u0D32\u0D46\u0D2F\u0D3E\u0D23\u0D4D. \u0D15\u0D41\u0D1E\u0D4D\u0D1E\u0D3F\u0D28\u0D4D\u0D31\u0D46 \u0D39\u0D46\u0D7D\u0D24\u0D4D\u0D24\u0D4D \u0D15\u0D3E\u0D7C\u0D21\u0D4D \u0D2E\u0D31\u0D15\u0D4D\u0D15\u0D3E\u0D24\u0D46 \u0D15\u0D4A\u0D23\u0D4D\u0D1F\u0D41\u0D35\u0D30\u0D41\u0D15.";
          default:
            return "Nurse Midwife Sister Anandi Bai resides directly adjacent to the clinic precinct. For emergency obstetrics or severe injury protocols during local off-hours, knock on the side residence buzzer instead of front gate lock. Regular immunizations run every Monday and Thursday morning. Please remember to bring the child's pink health verification card.";
        }
      case "water":
        switch (language) {
          case "hi":
            return "\u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u092A\u0930\u093F\u0935\u093E\u0930 \u091F\u094B\u0915\u0928 \u092A\u0930 \u092A\u094D\u0930\u0924\u093F\u0926\u093F\u0928 \u0905\u0927\u093F\u0915\u0924\u092E 20 \u0932\u0940\u091F\u0930 \u092A\u0940\u0928\u0947 \u0915\u093E \u092A\u093E\u0928\u0940 \u0938\u0940\u092E\u093F\u0924 \u0939\u0948\u0964 \u0906\u0930\u0913 \u092A\u093E\u0928\u0940 \u0915\u0947 5 \u0930\u0941\u092A\u092F\u0947 \u0935\u093E\u0932\u0947 \u0938\u093F\u0915\u094D\u0915\u0947 \u0938\u0940\u0927\u0947 \u0930\u093E\u091C\u0942 \u0915\u0941\u0930\u094D\u092E\u0940 \u0938\u0947 \u092A\u0939\u0932\u0947 \u0916\u0930\u0940\u0926 \u0932\u0947\u0902\u0964 \u0915\u0943\u092A\u092F\u093E \u0915\u0924\u093E\u0930 \u092E\u0947\u0902 \u0916\u0921\u093C\u0947 \u0939\u094B\u0928\u0947 \u0938\u0947 \u092A\u0939\u0932\u0947 \u0905\u092A\u0928\u0947 \u0915\u0928\u093F\u0938\u094D\u0924\u0930 \u092C\u0930\u094D\u0924\u0928\u094B\u0902 \u0915\u094B \u0905\u091A\u094D\u091B\u0940 \u0924\u0930\u0939 \u0938\u0947 \u0938\u0948\u0928\u093F\u091F\u093E\u0907\u091C-\u0927\u094B \u0932\u0947\u0902\u0964";
          case "te":
            return "\u0C28\u0C40\u0C1F\u0C3F \u0C0E\u0C26\u0C4D\u0C26\u0C21\u0C3F \u0C26\u0C43\u0C37\u0C4D\u0C1F\u0C4D\u0C2F\u0C3E \u0C2A\u0C4D\u0C30\u0C24\u0C3F \u0C15\u0C41\u0C1F\u0C41\u0C02\u0C2C\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C12\u0C15 \u0C30\u0C4B\u0C1C\u0C41\u0C15\u0C41 \u0C17\u0C30\u0C3F\u0C37\u0C4D\u0C1F\u0C02\u0C17\u0C3E 20 \u0C32\u0C40\u0C1F\u0C30\u0C4D\u0C32 \u0C2E\u0C02\u0C1A\u0C3F\u0C28\u0C40\u0C30\u0C41 \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47 \u0C2A\u0C02\u0C2A\u0C3F\u0C23\u0C40 \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F. \u0C32\u0C48\u0C28\u0C4D \u0C32\u0C4B \u0C28\u0C3F\u0C32\u0C2C\u0C21\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C2E\u0C41\u0C02\u0C26\u0C47 5 \u0C30\u0C42\u0C2A\u0C3E\u0C2F\u0C32 \u0C06\u0C30\u0C4D.\u0C13 \u0C15\u0C3E\u0C2F\u0C3F\u0C28\u0C4D\u200C\u0C28\u0C3F \u0C30\u0C3E\u0C1C\u0C41 \u0C15\u0C41\u0C30\u0C4D\u0C2E\u0C3F \u0C35\u0C26\u0C4D\u0C26 \u0C15\u0C4A\u0C28\u0C41\u0C17\u0C4B\u0C32\u0C41 \u0C1A\u0C47\u0C2F\u0C3E\u0C32\u0C3F. \u0C26\u0C2F\u0C1A\u0C47\u0C38\u0C3F \u0C36\u0C41\u0C2D\u0C4D\u0C30\u0C2A\u0C30\u0C3F\u0C1A\u0C3F\u0C28 \u0C2A\u0C3E\u0C24\u0C4D\u0C30\u0C32\u0C24\u0C4B \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47 \u0C32\u0C48\u0C28\u0C4D \u0C32\u0C4B \u0C28\u0C3F\u0C32\u0C2C\u0C21\u0C02\u0C21\u0C3F.";
          case "ml":
            return "\u0D15\u0D41\u0D1F\u0D3F\u0D35\u0D46\u0D33\u0D4D\u0D33 \u0D15\u0D4D\u0D37\u0D3E\u0D2E\u0D02 \u0D09\u0D33\u0D4D\u0D33 \u0D38\u0D2E\u0D2F\u0D19\u0D4D\u0D19\u0D33\u0D3F\u0D7D \u0D13\u0D30\u0D4B \u0D15\u0D41\u0D1F\u0D41\u0D02\u0D2C\u0D24\u0D4D\u0D24\u0D3F\u0D28\u0D41\u0D02 \u0D2A\u0D4D\u0D30\u0D24\u0D3F\u0D26\u0D3F\u0D28\u0D02 \u0D2A\u0D30\u0D2E\u0D3E\u0D35\u0D27\u0D3F 20 \u0D32\u0D3F\u0D31\u0D4D\u0D31\u0D7C \u0D35\u0D46\u0D33\u0D4D\u0D33\u0D02 \u0D2E\u0D3E\u0D24\u0D4D\u0D30\u0D2E\u0D3E\u0D2F\u0D3F \u0D2A\u0D30\u0D3F\u0D2E\u0D3F\u0D24\u0D2A\u0D4D\u0D2A\u0D46\u0D1F\u0D41\u0D24\u0D4D\u0D24\u0D3F\u0D2F\u0D3F\u0D30\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28\u0D41. \u0D15\u0D4D\u0D2F\u0D42 \u0D28\u0D3F\u0D7D\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28\u0D24\u0D3F\u0D28\u0D4D \u0D2E\u0D41\u0D7B\u0D2A\u0D4D \u0D24\u0D28\u0D4D\u0D28\u0D46 \u0D35\u0D4B\u0D32\u0D28\u0D4D\u0D31\u0D40\u0D2F\u0D7C \u0D2C\u0D3E\u0D32\u0D7B \u0D15\u0D46.\u0D2F\u0D3F\u0D7D \u0D28\u0D3F\u0D28\u0D4D\u0D28\u0D41\u0D02 \u0D1C\u0D32\u0D28\u0D3F\u0D27\u0D3F \u0D1F\u0D4B\u0D15\u0D4D\u0D15\u0D7A \u0D35\u0D3E\u0D19\u0D4D\u0D19\u0D3F\u0D1A\u0D4D\u0D1A\u0D3F\u0D30\u0D3F\u0D15\u0D4D\u0D15\u0D47\u0D23\u0D4D\u0D1F\u0D24\u0D3E\u0D23\u0D4D. \u0D35\u0D43\u0D24\u0D4D\u0D24\u0D3F\u0D2F\u0D41\u0D33\u0D4D\u0D33 \u0D2A\u0D3E\u0D24\u0D4D\u0D30\u0D19\u0D4D\u0D19\u0D7E \u0D2E\u0D3E\u0D24\u0D4D\u0D30\u0D02 \u0D09\u0D2A\u0D2F\u0D4B\u0D17\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D15.";
          default:
            return "In periods of severe dry local spells, consumption output is strictly capped at 20 Litres per day per household token. Purchase 5-Rupee RO coins directly from Raju Kurmi before queuing up at filtration tanks. Clean-sanitized and chemical-free containers only.";
        }
      case "agriculture":
        switch (language) {
          case "hi":
            return "\u0938\u0939\u0915\u093E\u0930\u0940 \u0921\u093F\u092A\u094B \u0926\u0930 \u092A\u0930 \u0915\u0943\u0937\u093F \u0938\u092C\u094D\u0938\u093F\u0921\u0940 \u0938\u093E\u092E\u0917\u094D\u0930\u0940 \u0915\u093E \u0932\u093E\u092D \u0909\u0920\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u092E\u0942\u0932 \u0915\u093F\u0938\u093E\u0928 \u0935\u093F\u0936\u093F\u0937\u094D\u091F \u0906\u0908\u0921\u0940 \u0915\u093E\u0930\u094D\u0921 (\u091C\u0948\u0938\u0947 \u092A\u0940\u090F\u092E-\u0915\u093F\u0938\u093E\u0928 \u092F\u093E \u0930\u093E\u091C\u094D\u092F \u092A\u093E\u0938\u092C\u0941\u0915 \u092A\u094D\u0930\u0924\u093F\u0932\u093F\u092A\u093F) \u092A\u094D\u0930\u0938\u094D\u0924\u0941\u0924 \u0915\u0930\u0928\u093E \u0905\u0928\u093F\u0935\u093E\u0930\u094D\u092F \u0939\u0948\u0964 \u0915\u0943\u0937\u093F \u091C\u0941\u0924\u093E\u0908 \u0935\u093E\u0932\u0940 \u091F\u094D\u0930\u0948\u0915\u094D\u091F\u0930 \u092E\u0936\u0940\u0928\u0930\u0940 \u092C\u0941\u0915\u093F\u0902\u0917 \u0928\u094D\u092F\u0942\u0928\u0924\u092E 48 \u0918\u0902\u091F\u0947 \u092A\u0939\u0932\u0947 \u0921\u093F\u092A\u094B \u092A\u094D\u0930\u092C\u0902\u0927\u0915 \u0936\u094D\u0930\u0940 \u092E\u0939\u0947\u0902\u0926\u094D\u0930 \u092A\u094D\u0930\u0938\u093E\u0926 \u0915\u0947 \u092A\u093E\u0938 \u0926\u0930\u094D\u091C \u0915\u0940 \u091C\u093E\u0928\u0940 \u091A\u093E\u0939\u093F\u090F\u0964";
          case "te":
            return "\u0C38\u0C2C\u0C4D\u0C38\u0C3F\u0C21\u0C40\u0C24\u0C4B \u0C15\u0C42\u0C21\u0C3F\u0C28 \u0C35\u0C4D\u0C2F\u0C35\u0C38\u0C3E\u0C2F \u0C35\u0C3F\u0C24\u0C4D\u0C24\u0C28\u0C3E\u0C32\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C30\u0C38\u0C3E\u0C2F\u0C28\u0C3E\u0C32\u0C41 \u0C15\u0C4A\u0C28\u0C41\u0C17\u0C4B\u0C32\u0C41 \u0C1A\u0C47\u0C2F\u0C41\u0C1F\u0C15\u0C41 \u0C2E\u0C40 \u0C35\u0C26\u0C4D\u0C26 \u0C30\u0C48\u0C24\u0C41 \u0C2C\u0C02\u0C27\u0C41 \u0C32\u0C47\u0C26\u0C3E \u0C2A\u0C3F\u0C0E\u0C2E\u0C4D \u0C15\u0C3F\u0C38\u0C3E\u0C28\u0C4D \u0C17\u0C41\u0C30\u0C4D\u0C24\u0C3F\u0C02\u0C2A\u0C41 \u0C2A\u0C24\u0C4D\u0C30\u0C02 \u0C24\u0C2A\u0C4D\u0C2A\u0C28\u0C3F\u0C38\u0C30\u0C3F\u0C17\u0C3E \u0C09\u0C02\u0C21\u0C3E\u0C32\u0C3F. \u0C1F\u0C4D\u0C30\u0C3E\u0C15\u0C4D\u0C1F\u0C30\u0C4D \u0C05\u0C26\u0C4D\u0C26\u0C46 \u0C17\u0C02\u0C1F\u0C32 \u0C15\u0C4A\u0C30\u0C15\u0C41 \u0C15\u0C28\u0C40\u0C38\u0C02 48 \u0C17\u0C02\u0C1F\u0C32 \u0C2E\u0C41\u0C02\u0C26\u0C47 \u0C21\u0C3F\u0C2A\u0C4B \u0C2E\u0C47\u0C28\u0C47\u0C1C\u0C30\u0C4D \u0C36\u0C4D\u0C30\u0C40 \u0C2E\u0C39\u0C47\u0C02\u0C26\u0C4D\u0C30 \u0C2A\u0C4D\u0C30\u0C38\u0C3E\u0C26\u0C4D \u0C35\u0C26\u0C4D\u0C26 \u0C2C\u0C41\u0C15\u0C3F\u0C02\u0C17\u0C4D \u0C1A\u0C47\u0C38\u0C41\u0C15\u0C4B\u0C35\u0C3E\u0C32\u0C3F.";
          case "ml":
            return "\u0D38\u0D2C\u0D4D\u200C\u0D38\u0D3F\u0D21\u0D3F \u0D28\u0D3F\u0D30\u0D15\u0D4D\u0D15\u0D3F\u0D32\u0D41\u0D33\u0D4D\u0D33 \u0D35\u0D3F\u0D24\u0D4D\u0D24\u0D41\u0D15\u0D33\u0D41\u0D02 \u0D35\u0D33\u0D19\u0D4D\u0D19\u0D33\u0D41\u0D02 \u0D32\u0D2D\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28\u0D24\u0D3F\u0D28\u0D3E\u0D2F\u0D3F \u0D15\u0D7C\u0D37\u0D15\u0D7C \u0D24\u0D19\u0D4D\u0D19\u0D33\u0D41\u0D1F\u0D46 \u0D2B\u0D3E\u0D7C\u0D2E\u0D7C \u0D10\u0D21\u0D3F \u0D15\u0D3E\u0D7C\u0D21\u0D4B \u0D31\u0D47\u0D37\u0D7B \u0D15\u0D3E\u0D7C\u0D21\u0D4B \u0D15\u0D43\u0D37\u0D3F\u0D2D\u0D35\u0D7B \u0D15\u0D57\u0D23\u0D4D\u0D1F\u0D31\u0D3F\u0D7D \u0D38\u0D2E\u0D7C\u0D2A\u0D4D\u0D2A\u0D3F\u0D15\u0D4D\u0D15\u0D47\u0D23\u0D4D\u0D1F\u0D24\u0D3E\u0D23\u0D4D. \u0D35\u0D32\u0D3F\u0D2F \u0D1F\u0D4D\u0D30\u0D3E\u0D15\u0D4D\u0D1F\u0D31\u0D41\u0D15\u0D7E \u0D24\u0D41\u0D1F\u0D19\u0D4D\u0D19\u0D3F\u0D2F \u0D15\u0D43\u0D37\u0D3F \u0D09\u0D2A\u0D15\u0D30\u0D23\u0D19\u0D4D\u0D19\u0D7E \u0D35\u0D3E\u0D1F\u0D15\u0D2F\u0D4D\u0D15\u0D4D\u0D15\u0D4D \u0D0E\u0D1F\u0D41\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28\u0D24\u0D3F\u0D28\u0D3E\u0D2F\u0D3F \u0D05\u0D21\u0D4D\u0D35\u0D3E\u30F3\u30B9 \u0D2C\u0D41\u0D15\u0D4D\u0D15\u0D3F\u0D19\u0D4D \u0D15\u0D41\u0D31\u0D1E\u0D4D\u0D1E\u0D24\u0D4D 48 \u0D2E\u0D23\u0D3F\u0D15\u0D4D\u0D15\u0D42\u0D7C \u0D2E\u0D41\u0D7B\u0D2A\u0D46\u0D19\u0D4D\u0D15\u0D3F\u0D32\u0D41\u0D02 \u0D15\u0D43\u0D37\u0D3F \u0D13\u0D2B\u0D40\u0D38\u0D7C \u0D35\u0D34\u0D3F \u0D1A\u0D46\u0D2F\u0D4D\u0D24\u0D3F\u0D30\u0D3F\u0D15\u0D4D\u0D15\u0D23\u0D02.";
          default:
            return "To utilize subsidized cooperative farm materials, presentation of your official Farmer Unique Registration (PM-KISAN status or State Land Record Booklet) is mandatory at the checkout counter. Agricultural heavy till equipment hires must be reserved minimum 48 hours in advance in ledger book of Depot Manager.";
        }
      case "education":
        switch (language) {
          case "hi":
            return "\u0938\u094D\u0915\u0942\u0932 \u0926\u094B\u092A\u0939\u0930 \u0915\u0947 \u092D\u094B\u091C\u0928 \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0930\u092E \u0915\u0947 \u0924\u0939\u0924 \u092C\u091A\u094D\u091A\u094B\u0902 \u0915\u094B \u0930\u094B\u091C\u093C\u093E\u0928\u093E \u0924\u093E\u091C\u093E \u0906\u0939\u093E\u0930 \u092A\u094D\u0930\u0926\u093E\u0928 \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u0905\u092D\u093F\u092D\u093E\u0935\u0915\u094B\u0902 \u0938\u0947 \u0905\u0928\u0941\u0930\u094B\u0927 \u0939\u0948 \u0915\u093F \u0935\u0947 \u0939\u0930 \u0924\u093F\u092E\u093E\u0939\u0940 \u092C\u0948\u0920\u0915 \u092E\u0947\u0902 \u092C\u091A\u094D\u091A\u094B\u0902 \u0915\u0940 \u0938\u0940\u0916\u0928\u0947 \u0915\u0947 \u092A\u094D\u0930\u0924\u093F \u0938\u0939\u092E\u0924\u093F \u092B\u0949\u0930\u094D\u092E \u091C\u092E\u093E \u0915\u0930\u0947\u0902\u0964 \u0938\u0930\u0915\u093E\u0930\u0940 \u091B\u093E\u0924\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u0915\u0947 \u0906\u0935\u0947\u0926\u0928 \u0915\u0947 \u0932\u093F\u090F \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921 \u0914\u0930 \u092D\u093E\u092E\u093E\u0936\u093E\u0939 \u0906\u0908\u0921\u0940 \u0915\u0940 \u092A\u094D\u0930\u0924\u093F \u092A\u094D\u0930\u0927\u093E\u0928\u093E\u0927\u094D\u092F\u093E\u092A\u093F\u0915\u093E \u0915\u0947 \u092A\u093E\u0938 \u091C\u092E\u093E \u0915\u0930\u0947\u0902\u0964";
          case "te":
            return "\u0C2E\u0C27\u0C4D\u0C2F\u0C3E\u0C39\u0C4D\u0C28 \u0C2D\u0C4B\u0C1C\u0C28 \u0C2A\u0C25\u0C15\u0C02\u0C32\u0C4B \u0C2A\u0C4D\u0C30\u0C24\u0C3F \u0C35\u0C3F\u0C26\u0C4D\u0C2F\u0C3E\u0C30\u0C4D\u0C25\u0C3F\u0C15\u0C3F \u0C35\u0C3F\u0C1F\u0C2E\u0C3F\u0C28\u0C4D\u0C32\u0C41 \u0C15\u0C32\u0C3F\u0C17\u0C3F\u0C28 \u0C2A\u0C4C\u0C37\u0C4D\u0C1F\u0C3F\u0C15\u0C3E\u0C39\u0C3E\u0C30\u0C02 \u0C05\u0C02\u0C26\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F. \u0C2A\u0C4D\u0C30\u0C2D\u0C41\u0C24\u0C4D\u0C35 \u0C09\u0C1A\u0C3F\u0C24 \u0C26\u0C41\u0C38\u0C4D\u0C24\u0C41\u0C32\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C38\u0C4D\u0C15\u0C3E\u0C32\u0C30\u0C4D\u200C\u0C37\u0C3F\u0C2A\u0C4D \u0C26\u0C30\u0C16\u0C3E\u0C38\u0C4D\u0C24\u0C41\u0C32 \u0C15\u0C4A\u0C30\u0C15\u0C41 \u0C38\u0C02\u0C2C\u0C02\u0C27\u0C3F\u0C24 \u0C15\u0C41\u0C32 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C06\u0C26\u0C3E\u0C2F \u0C27\u0C43\u0C35\u0C40\u0C15\u0C30\u0C23 \u0C2A\u0C24\u0C4D\u0C30\u0C3E\u0C32\u0C28\u0C41 \u0C2A\u0C4D\u0C30\u0C27\u0C3E\u0C28\u0C4B\u0C2A\u0C3E\u0C27\u0C4D\u0C2F\u0C3E\u0C2F\u0C41\u0C30\u0C3E\u0C32\u0C48\u0C28 \u0C38\u0C3E\u0C32\u0C4D\u0C1F\u0C46\u0C21\u0C4D \u0C15\u0C2E\u0C32\u0C2E\u0C4D\u0C2E \u0C17\u0C3E\u0C30\u0C3F \u0C35\u0C26\u0C4D\u0C26 \u0C38\u0C2E\u0C30\u0C4D\u0C2A\u0C3F\u0C02\u0C1A\u0C3E\u0C32\u0C3F.";
          case "ml":
            return "\u0D38\u0D4D\u0D15\u0D42\u0D33\u0D3F\u0D32\u0D46 \u0D15\u0D41\u0D1F\u0D4D\u0D1F\u0D3F\u0D15\u0D7E\u0D15\u0D4D\u0D15\u0D41\u0D33\u0D4D\u0D33 \u0D38\u0D57\u0D1C\u0D28\u0D4D\u0D2F \u0D09\u0D1A\u0D4D\u0D1A\u0D2D\u0D15\u0D4D\u0D37\u0D23 \u0D2A\u0D26\u0D4D\u0D27\u0D24\u0D3F \u0D26\u0D3F\u0D35\u0D38\u0D35\u0D41\u0D02 \u0D15\u0D43\u0D24\u0D4D\u0D2F\u0D2E\u0D3E\u0D2F\u0D3F \u0D28\u0D1F\u0D2A\u0D4D\u0D2A\u0D3F\u0D32\u0D3E\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28\u0D41\u0D23\u0D4D\u0D1F\u0D4D. \u0D15\u0D41\u0D1F\u0D4D\u0D1F\u0D3F\u0D15\u0D33\u0D41\u0D1F\u0D46 \u0D2A\u0D20\u0D28 \u0D2A\u0D41\u0D30\u0D4B\u0D17\u0D24\u0D3F \u0D05\u0D35\u0D32\u0D4B\u0D15\u0D28\u0D02 \u0D1A\u0D46\u0D2F\u0D4D\u0D2F\u0D41\u0D28\u0D4D\u0D28\u0D24\u0D3F\u0D28\u0D3E\u0D2F\u0D41\u0D33\u0D4D\u0D33 \u0D30\u0D15\u0D4D\u0D37\u0D3F\u0D24\u0D3E\u0D15\u0D4D\u0D15\u0D33\u0D41\u0D1F\u0D46 \u0D2F\u0D4B\u0D17\u0D24\u0D4D\u0D24\u0D3F\u0D7D \u0D0E\u0D32\u0D4D\u0D32\u0D3E \u0D15\u0D4D\u0D35\u0D3E\u0D7C\u0D1F\u0D4D\u0D1F\u0D31\u0D3F\u0D32\u0D41\u0D02 \u0D28\u0D3F\u0D7C\u0D2C\u0D28\u0D4D\u0D27\u0D2E\u0D3E\u0D2F\u0D41\u0D02 \u0D2A\u0D19\u0D4D\u0D15\u0D46\u0D1F\u0D41\u0D15\u0D4D\u0D15\u0D47\u0D23\u0D4D\u0D1F\u0D24\u0D3E\u0D23\u0D4D. \u0D2A\u0D41\u0D24\u0D3F\u0D2F \u0D38\u0D4D\u0D15\u0D4B\u0D33\u0D7C\u0D37\u0D3F\u0D2A\u0D4D\u0D2A\u0D4D \u0D05\u0D2A\u0D47\u0D15\u0D4D\u0D37\u0D15\u0D7E \u0D39\u0D46\u0D21\u0D4D\u0D2E\u0D3E\u0D38\u0D4D\u0D31\u0D4D\u0D31\u0D7C \u0D30\u0D3E\u0D27\u0D3E\u0D15\u0D43\u0D37\u0D4D\u0D23\u0D7B \u0D15\u0D46.\u0D2F\u0D4D\u0D15\u0D4D\u0D15\u0D4D \u0D28\u0D47\u0D30\u0D3F\u0D1F\u0D4D\u0D1F\u0D4D \u0D38\u0D2E\u0D7C\u0D2A\u0D4D\u0D2A\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D15.";
          default:
            return "Our primary school distributes dietary-inspected warm midday children meals daily. Parents are requested to submit mandatory progress card acknowledgment receipts every quarter. For state-funded uniform and writing supplies benefits, file the child's identity copy on desk of Headmistress Kamala Reddy.";
        }
      default:
        switch (language) {
          case "hi":
            return "\u0917\u094D\u0930\u093E\u092E \u092A\u0930\u093F\u0937\u0926 \u091C\u0928-\u0936\u093F\u0915\u093E\u092F\u0924 \u0926\u0930\u094D\u091C \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0906\u0935\u0947\u0926\u0915 \u0915\u0947 \u092A\u093E\u0938 \u092A\u0939\u091A\u093E\u0928 \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 (\u091C\u0948\u0938\u0947 \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921 \u0905\u0925\u0935\u093E \u0917\u094D\u0930\u093E\u092E \u0930\u093E\u0936\u0928 \u0915\u093E\u0930\u094D\u0921) \u092A\u094D\u0930\u0938\u094D\u0924\u0941\u0924 \u0939\u094B\u0928\u093E \u0939\u094B\u0928\u093E \u0906\u0935\u0936\u094D\u092F\u0915 \u0939\u0948\u0964 \u092D\u0942\u092E\u093F \u0930\u093F\u0915\u0949\u0930\u094D\u0921 \u0914\u0930 \u0916\u0938\u0930\u093E \u0928\u0902\u092C\u0930 \u0928\u0915\u0932 \u092A\u094D\u0930\u0924\u093F\u092F\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u092A\u0902\u091A\u093E\u092F\u0924 \u0938\u0939\u093E\u092F\u0915 \u0915\u0947 \u092A\u093E\u0938 \u0906\u0935\u0947\u0926\u0928 \u092A\u0924\u094D\u0930 \u091C\u092E\u093E \u0915\u0930\u0947\u0902, \u091C\u093F\u0938\u0947 \u0924\u0948\u092F\u093E\u0930 \u0939\u094B\u0928\u0947 \u092E\u0947\u0902 \u0938\u093E\u092E\u093E\u0928\u094D\u092F\u0924: 48 \u0938\u0947 72 \u0915\u093E\u0930\u094D\u092F \u0926\u093F\u0935\u0938 \u0918\u0902\u091F\u0947 \u0932\u0917\u0924\u0947 \u0939\u0948\u0902\u0964";
          case "te":
            return "\u0C2A\u0C02\u0C1A\u0C3E\u0C2F\u0C24\u0C40 \u0C38\u0C39\u0C3E\u0C2F \u0C15\u0C47\u0C02\u0C26\u0C4D\u0C30\u0C02\u0C32\u0C4B \u0C2A\u0C4D\u0C30\u0C1C\u0C3E \u0C2B\u0C3F\u0C30\u0C4D\u0C2F\u0C3E\u0C26\u0C41\u0C32 \u0C15\u0C4A\u0C30\u0C15\u0C41 \u0C2E\u0C40 \u0C17\u0C41\u0C30\u0C4D\u0C24\u0C3F\u0C02\u0C2A\u0C41 \u0C15\u0C3E\u0C30\u0C4D\u0C21\u0C41 (\u0C06\u0C27\u0C3E\u0C30\u0C4D \u0C32\u0C47\u0C26\u0C3E \u0C30\u0C47\u0C37\u0C28\u0C4D \u0C15\u0C3E\u0C30\u0C4D\u0C21\u0C4D) \u0C38\u0C2E\u0C30\u0C4D\u0C2A\u0C3F\u0C02\u0C1A\u0C3E\u0C32\u0C3F. \u0C2D\u0C42\u0C2E\u0C3F \u0C30\u0C3F\u0C15\u0C3E\u0C30\u0C4D\u0C21\u0C41\u0C32\u0C41 \u0C32\u0C47\u0C26\u0C3E \u0C2A\u0C1F\u0C4D\u0C1F\u0C3E\u0C26\u0C3E\u0C30\u0C41 \u0C2A\u0C3E\u0C38\u0C4D \u0C2A\u0C4A\u0C02\u0C26\u0C41\u0C1F\u0C15\u0C41 \u0C26\u0C30\u0C16\u0C3E\u0C38\u0C4D\u0C24\u0C41 \u0C1A\u0C47\u0C38\u0C41\u0C15\u0C41\u0C28\u0C4D\u0C28 \u0C24\u0C30\u0C4D\u0C35\u0C3E\u0C24 \u0C38\u0C3E\u0C27\u0C3E\u0C30\u0C23\u0C02\u0C17\u0C3E \u0C30\u0C3F\u0C15\u0C3E\u0C30\u0C4D\u0C21\u0C41\u0C32\u0C41 \u0C35\u0C46\u0C32\u0C3F\u0C15\u0C3F\u0C24\u0C40\u0C2F\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F 48 \u0C28\u0C41\u0C02\u0C21\u0C3F 72 \u0C17\u0C02\u0C1F\u0C32 \u0C38\u0C2E\u0C2F\u0C02 \u0C2A\u0C21\u0C41\u0C24\u0C41\u0C02\u0C26\u0C3F.";
          case "ml":
            return "\u0D2A\u0D1E\u0D4D\u0D1A\u0D3E\u0D2F\u0D24\u0D4D\u0D24\u0D4D \u0D2A\u0D30\u0D3E\u0D24\u0D3F \u0D2A\u0D30\u0D3F\u0D39\u0D3E\u0D30 \u0D38\u0D46\u0D32\u0D4D\u0D32\u0D3F\u0D7D \u0D2A\u0D30\u0D3E\u0D24\u0D3F \u0D28\u0D7D\u0D15\u0D41\u0D28\u0D4D\u0D28\u0D24\u0D3F\u0D28\u0D4D \u0D35\u0D4B\u0D1F\u0D4D\u0D1F\u0D7C \u0D10\u0D21\u0D3F\u0D2F\u0D4B \u0D06\u0D27\u0D3E\u0D7C \u0D15\u0D3E\u0D7C\u0D21\u0D4B \u0D38\u0D2E\u0D7C\u0D2A\u0D4D\u0D2A\u0D3F\u0D15\u0D4D\u0D15\u0D47\u0D23\u0D4D\u0D1F\u0D24\u0D41\u0D23\u0D4D\u0D1F\u0D4D. \u0D2A\u0D41\u0D24\u0D3F\u0D2F \u0D15\u0D46\u0D1F\u0D4D\u0D1F\u0D3F\u0D1F \u0D2A\u0D46\u0D7C\u0D2E\u0D3F\u0D31\u0D4D\u0D31\u0D41\u0D15\u0D33\u0D41\u0D02 \u0D15\u0D48\u0D35\u0D36\u0D3E\u0D35\u0D15\u0D3E\u0D36 \u0D38\u0D7C\u0D1F\u0D4D\u0D1F\u0D3F\u0D2B\u0D3F\u0D15\u0D4D\u0D15\u0D31\u0D4D\u0D31\u0D41\u0D15\u0D33\u0D41\u0D02 \u0D05\u0D2A\u0D47\u0D15\u0D4D\u0D37 \u0D38\u0D2E\u0D7C\u0D2A\u0D4D\u0D2A\u0D3F\u0D1A\u0D4D\u0D1A\u0D4D 48 \u0D2E\u0D41\u0D24\u0D7D 72 \u0D2A\u0D4D\u0D30\u0D35\u0D7C\u0D24\u0D4D\u0D24\u0D28 \u0D2E\u0D23\u0D3F\u0D15\u0D4D\u0D15\u0D42\u0D31\u0D41\u0D15\u0D7E\u0D15\u0D4D\u0D15\u0D41\u0D33\u0D4D\u0D33\u0D3F\u0D7D \u0D05\u0D24\u0D3F\u0D30\u0D2A\u0D4D\u0D2A\u0D3F\u0D33\u0D4D\u0D33\u0D3F \u0D2A\u0D1E\u0D4D\u0D1A\u0D3E\u0D2F\u0D24\u0D4D\u0D24\u0D4D \u0D13\u0D2B\u0D40\u0D38\u0D3F\u0D7D \u0D28\u0D3F\u0D28\u0D4D\u0D28\u0D41\u0D02 \u0D15\u0D48\u0D2A\u0D4D\u0D2A\u0D31\u0D4D\u0D31\u0D3E\u0D35\u0D41\u0D28\u0D4D\u0D28\u0D24\u0D3E\u0D23\u0D4D.";
          default:
            return "Grievance logging inside Gram Council registry accepts verification strictly upon showing your Resident ID (Aadhaar or local Ration Registration). Land boundary maps or ownership ledger certification requests are processed within a standard 48 to 72 operating hour cycle at Panchayat Bhawan desk.";
        }
    }
  };
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("health");
  const [newDesc, setNewDesc] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newHours, setNewHours] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [isEmergencyCheck, setIsEmergencyCheck] = useState(false);
  const [newDistrict, setNewDistrict] = useState("Kozhikode");
  const [newLocality, setNewLocality] = useState("Mukkali");
  const [successToast, setSuccessToast] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedServices = localStorage.getItem("village_custom_services");
      if (savedServices) {
        try {
          const parsed = JSON.parse(savedServices);
          setServices([...INITIAL_SERVICES, ...parsed]);
        } catch (e) {
          console.error("Error reading saved services", e);
          setServices(INITIAL_SERVICES);
        }
      } else {
        setServices(INITIAL_SERVICES);
      }
    }
  }, []);
  const handleAddService = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !newPhone.trim()) {
      return;
    }
    const newId = `custom-serv-${Date.now()}`;
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const distLookup = KERALA_DISTRICTS.find((d) => d.en === newDistrict);
    const distLocalizedName = distLookup ? distLookup[language] || newDistrict : newDistrict;
    const serviceTranslationObj = {
      title: newTitle,
      description: newDesc,
      category: newCategory === "health" ? t.health : newCategory === "water" ? t.water : newCategory === "agriculture" ? t.agriculture : newCategory === "education" ? t.education : t.government,
      location: `${newLocation ? newLocation + ", " : ""}${newLocality}, ${distLocalizedName}, Kerala`,
      hours: newHours || "9:00 AM - 5:00 PM",
      contactName: newContact || "Community Volunteer"
    };
    const translationsRecord = {
      en: { ...serviceTranslationObj, category: "Volunteer Suggestion" },
      hi: { ...serviceTranslationObj, title: `${newTitle} (\u0938\u094D\u0935\u092F\u0902\u0938\u0947\u0935\u0915 \u0938\u0941\u091D\u093E\u0935)`, category: "\u0938\u094D\u0935\u092F\u0902\u0938\u0947\u0935\u0915 \u092F\u094B\u0917\u0926\u093E\u0928" },
      te: { ...serviceTranslationObj, title: `${newTitle} (\u0C38\u0C4D\u0C35\u0C1A\u0C4D\u0C1B\u0C02\u0C26 \u0C38\u0C47\u0C35)`, category: "\u0C38\u0C4D\u0C35\u0C1A\u0C4D\u0C1B\u0C02\u0C26 \u0C2A\u0C4D\u0C30\u0C24\u0C3F\u0C2A\u0C3E\u0C26\u0C28" },
      ml: { ...serviceTranslationObj, title: `${newTitle} (\u0D38\u0D28\u0D4D\u0D28\u0D26\u0D4D\u0D27\u0D38\u0D47\u0D35\u0D28 \u0D38\u0D2E\u0D7C\u0D2A\u0D4D\u0D2A\u0D23\u0D02)`, category: "\u0D35\u0D4B\u0D33\u0D23\u0D4D\u0D1F\u0D3F\u0D2F\u0D7C \u0D28\u0D3F\u0D7C\u0D26\u0D4D\u0D26\u0D47\u0D36\u0D02" },
      kn: { ...serviceTranslationObj, title: `${newTitle} (\u0CB8\u0CCD\u0CB5\u0CAF\u0C82\u0CB8\u0CC7\u0CB5\u0C95 \u0CB8\u0CC2\u0C9A\u0CA8\u0CC6)`, category: "\u0CB8\u0CCD\u0CB5\u0CAF\u0C82\u0CB8\u0CC7\u0CB5\u0C95 \u0CB8\u0CC2\u0C9A\u0CA8\u0CC6" }
    };
    const newService = {
      id: newId,
      categoryKey: newCategory,
      phoneNumber: newPhone,
      lastVerified: today,
      isEmergency: isEmergencyCheck,
      districtName: newDistrict,
      localityName: newLocality,
      translations: translationsRecord
    };
    const updatedServices = [newService, ...services];
    setServices(updatedServices);
    localStorage.setItem("village_custom_services", JSON.stringify([newService, ...services.filter((s) => s.id.startsWith("custom-serv-"))]));
    setNewTitle("");
    setNewDesc("");
    setNewLocation("");
    setNewHours("");
    setNewContact("");
    setNewPhone("");
    setIsEmergencyCheck(false);
    setSuccessToast("Service suggested successfully!");
    setTimeout(() => setSuccessToast(null), 3e3);
    navigateToTab("services");
  };
  const getCategoryIcon = (categoryKey) => {
    switch (categoryKey) {
      case "health":
        return <Stethoscope className="w-5 h-5" />;
      case "water":
        return <Waves className="w-5 h-5" />;
      case "agriculture":
        return <Wheat className="w-5 h-5" />;
      case "education":
        return <School className="w-5 h-5" />;
      default:
        return <Landmark className="w-5 h-5" />;
    }
  };
  const getCategoryColor = (categoryKey) => {
    switch (categoryKey) {
      case "health":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "water":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "agriculture":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "education":
        return "bg-violet-500/10 text-violet-400 border-violet-500/20";
      default:
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    }
  };
  const getCategoryName = (categoryKey) => {
    switch (categoryKey) {
      case "health":
        return t.health;
      case "water":
        return t.water;
      case "agriculture":
        return t.agriculture;
      case "education":
        return t.education;
      default:
        return t.government;
    }
  };
  const getCustomizedIcon = (service) => {
    const titleLower = (service.translations.en?.title || "").toLowerCase();
    const categoryLower = (service.translations.en?.category || "").toLowerCase();
    const haystack = `${titleLower} ${categoryLower}`;
    const catLower = service.categoryKey;
    if (haystack.includes("police") || haystack.includes("security")) {
      return <Shield className="w-5 h-5" />;
    }
    if (haystack.includes("hospital") || haystack.includes("taluk")) {
      return <Hospital className="w-5 h-5" />;
    }
    if (haystack.includes("health") || haystack.includes("clinic") || haystack.includes("phc") || haystack.includes("fhc")) {
      return <Stethoscope className="w-5 h-5" />;
    }
    if (haystack.includes("ambulance") || haystack.includes("emergency")) {
      return <Ambulance className="w-5 h-5" />;
    }
    if (haystack.includes("water") || haystack.includes("jal") || haystack.includes("kwa")) {
      return <Waves className="w-5 h-5" />;
    }
    if (haystack.includes("school") || haystack.includes("ghss") || haystack.includes("glps") || haystack.includes("education")) {
      return <School className="w-5 h-5" />;
    }
    if (haystack.includes("library") || haystack.includes("book")) {
      return <BookOpen className="w-5 h-5" />;
    }
    if (haystack.includes("krishi") || haystack.includes("farm") || haystack.includes("agri")) {
      return <Wheat className="w-5 h-5" />;
    }
    if (haystack.includes("soil") || haystack.includes("lab") || haystack.includes("test")) {
      return <FlaskConical className="w-5 h-5" />;
    }
    if (haystack.includes("ration") || haystack.includes("shop")) {
      return <Store className="w-5 h-5" />;
    }
    if (haystack.includes("anganwadi") || haystack.includes("child")) {
      return <Baby className="w-5 h-5" />;
    }
    if (haystack.includes("village") || haystack.includes("registry") || haystack.includes("panchayat") || haystack.includes("office")) {
      return <Landmark className="w-5 h-5" />;
    }
    if (haystack.includes("certificate") || haystack.includes("document") || haystack.includes("revenue")) {
      return <FileCheck2 className="w-5 h-5" />;
    }
    if (haystack.includes("pension") || haystack.includes("welfare") || haystack.includes("fund")) {
      return <HandCoins className="w-5 h-5" />;
    }
    if (haystack.includes("bank") || haystack.includes("akshaya") || haystack.includes("e-centre")) {
      return <Banknote className="w-5 h-5" />;
    }
    if (haystack.includes("bus") || haystack.includes("transport")) {
      return <BusFront className="w-5 h-5" />;
    }
    if (haystack.includes("forest") || haystack.includes("garden")) {
      return <Trees className="w-5 h-5" />;
    }
    if (haystack.includes("court") || haystack.includes("legal")) {
      return <Scale className="w-5 h-5" />;
    }
    if (haystack.includes("housing") || haystack.includes("home")) {
      return <Home className="w-5 h-5" />;
    }
    if (haystack.includes("application") || haystack.includes("register")) {
      return <ClipboardList className="w-5 h-5" />;
    }
    return getCategoryIcon(catLower);
  };
  const categoryOptions = [
    { key: "all", label: t.allCategories || "All", icon: <Building2 className="w-3.5 h-3.5" /> },
    { key: "health", label: t.health || "Health", icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { key: "education", label: t.education || "Education", icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { key: "government", label: t.government || "Government", icon: <Shield className="w-3.5 h-3.5" /> },
    { key: "water", label: t.water || "Water", icon: <Droplet className="w-3.5 h-3.5" /> },
    { key: "agriculture", label: t.agriculture || "Agriculture", icon: <Sprout className="w-3.5 h-3.5" /> }
  ];
  const getServiceShareText = (service) => {
    const data = service.translations[language] || service.translations.en;
    return `${data.title}
${data.location}
${data.hours}
Phone: ${service.phoneNumber}`;
  };
  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccessToast(label);
    } catch {
      setSuccessToast(text);
    }
    setTimeout(() => setSuccessToast(null), 2200);
  };
  const shareService = async (service) => {
    const data = service.translations[language] || service.translations.en;
    const text = getServiceShareText(service);
    if (navigator.share) {
      await navigator.share({ title: data.title, text }).catch(() => void 0);
    } else {
      await copyText(text, "Service details copied");
    }
  };
  const submitReport = () => {
    if (!reportService || !reportText.trim()) return;
    const report = {
      serviceId: reportService.id,
      title: reportService.translations.en.title,
      message: reportText.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = localStorage.getItem("gramseva_reports");
    const reports = saved ? JSON.parse(saved) : [];
    localStorage.setItem("gramseva_reports", JSON.stringify([report, ...reports]));
    setReportService(null);
    setReportText("");
    setSuccessToast("Report saved for volunteer review");
    setTimeout(() => setSuccessToast(null), 2200);
  };
  const getDocumentChecklist = (service) => {
    const title = service.translations.en.title.toLowerCase();
    const category = service.categoryKey;
    if (title.includes("akshaya") || title.includes("e-centre")) {
      return ["Aadhaar card", "Mobile number linked to Aadhaar", "Service-specific certificate or application number", "Fee receipt if applicable"];
    }
    if (title.includes("village") || title.includes("registry") || category === "government") {
      return ["Aadhaar or voter ID", "Address proof", "Previous certificate or application number", "Passport-size photo if required"];
    }
    if (category === "health") {
      return ["Aadhaar or health ID", "Previous prescription or health card", "Vaccination card for children", "Emergency contact number"];
    }
    if (category === "education") {
      return ["Student ID or birth certificate", "Parent Aadhaar/contact number", "Previous school record if available", "Address proof"];
    }
    if (category === "water") {
      return ["Consumer number if available", "Address proof", "Recent bill or connection receipt", "Photo of issue for complaints"];
    }
    if (category === "agriculture") {
      return ["Land tax receipt or farmer ID", "Aadhaar card", "Bank passbook copy", "Krishi registration number if available"];
    }
    return ["Aadhaar card", "Address proof", "Phone number", "Relevant application or receipt"];
  };
  const duplicateCounts = useMemo(() => services.reduce((acc, service) => {
    const key = getDuplicateKey(service);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {}), [services]);
  const searchableServices = useMemo(() => services.map((service) => {
    const searchText = getServiceSearchText(service);
    return {
      service,
      searchText,
      searchTokens: [...new Set(searchText.split(" ").filter(Boolean))]
    };
  }), [services]);
  const normalizedSearchQuery = normalizeSearchText(settledSearchQuery);
  const filteredServices = useMemo(() => searchableServices
    .map(({ service, searchText, searchTokens }) => ({
      service,
      searchScore: getSearchScore(searchText, searchTokens, normalizedSearchQuery)
    }))
    .filter(({ service, searchScore }) => {
      if (selectedCategory !== "all" && service.categoryKey !== selectedCategory) {
        if (selectedCategory === "agriculture" && service.translations.en.category.toLowerCase() === "ration") {
        } else {
          return false;
        }
      }
      if (selectedDistrict !== "all" && service.districtName !== selectedDistrict) return false;
      if (selectedLocality !== "all" && service.localityName !== selectedLocality) return false;
      if (isNearMeActive && getSimulatedDistance(service) > nearMeDistance) return false;
      return !normalizedSearchQuery || searchScore > 0;
    })
    .sort((a, b) => {
      if (normalizedSearchQuery && b.searchScore !== a.searchScore) return b.searchScore - a.searchScore;
      if (isNearMeActive || sortByProximity) return getSimulatedDistance(a.service) - getSimulatedDistance(b.service);
      return 0;
    })
    .map(({ service }) => service), [searchableServices, normalizedSearchQuery, selectedCategory, selectedDistrict, selectedLocality, isNearMeActive, nearMeDistance, sortByProximity]);
  const emergencyServices = useMemo(() => filteredServices
    .filter((service) => service.isEmergency || service.categoryKey === "health" || /police|ambulance|hospital|fire|emergency|helpline/i.test(service.translations.en.title))
    .slice(0, 24), [filteredServices]);
  const searchSuggestions = searchQuery.trim().length > 0 ? filteredServices.slice(0, 5).map((service) => {
    const data = service.translations[language] || service.translations.en;
    return { id: service.id, label: data.title, helper: data.category };
  }) : [
    { id: "birth certificate", label: "Birth certificate", helper: t.government || "Government" },
    { id: "ration card", label: "Ration card", helper: t.government || "Government" },
    { id: "water connection", label: "Water connection", helper: t.water || "Water" },
    { id: "family health centre", label: "Family Health Centre", helper: t.health || "Health" }
  ];
  return <div id="dir-app-root" style={{ "--gram-bg": `url(${uiBackdrop})` }} className={`gram-root min-h-screen ${isHighContrast ? "bg-black high-contrast" : ""} text-slate-900 font-sans antialiased flex items-stretch justify-center transition-all duration-300 ${isLargeText ? "text-[110%]" : ""}`}>
      <a href="#service-results" className="skip-link">Skip to service results</a>
      <nav className="observatory-nav" aria-label="Primary navigation">
        <div className="brand-mark">
          <span className="brand-glyph">GS</span>
          <span>GramSeva</span>
        </div>
        <div className="nav-links" role="tablist" aria-label="Directory sections">
          <button onClick={() => navigateToTab("services")} className={currentTab === "services" ? "active" : ""} role="tab" aria-selected={currentTab === "services"}>Directory</button>
          <button onClick={() => navigateToTab("emergency")} className={currentTab === "emergency" ? "active" : ""} role="tab" aria-selected={currentTab === "emergency"}>Emergency</button>
          <button onClick={() => navigateToTab("map")} className={currentTab === "map" ? "active" : ""} role="tab" aria-selected={currentTab === "map"}>Map Grid</button>
          <button onClick={() => navigateToTab("suggest")} className={currentTab === "suggest" ? "active" : ""} role="tab" aria-selected={currentTab === "suggest"}>Contribute</button>
        </div>
        <button onClick={() => navigateToTab("profile")} className="follow-link">Open Controls</button>
      </nav>
      
      {
    /* Desktop context panel */
  }
      <div className="context-panel command-panel hidden 2xl:flex flex-col max-w-xs mr-6 border border-stone-200/80 p-6 rounded-[32px] space-y-6 shadow-sm animate-soft-rise">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-700 text-white rounded-2xl shadow-sm icon-tile animate-float">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <p className="font-label text-[9px] text-signal-orange font-black uppercase tracking-[0.24em]">Civic OS</p>
            <h1 className="kinetic-title font-classical text-4xl font-normal tracking-tight">GramSeva</h1>
            <p className="font-label text-[10px] text-ice-white font-bold uppercase tracking-wider">Verified local directory</p>
          </div>
        </div>

        <p className="observatory-copy text-sm leading-relaxed">
          A midnight civic observatory for panchayat services. Verified contacts, timings, emergency routes, document checklists, and multilingual records are traced in one searchable grid.
        </p>

        <div className="editorial-signal">
          <span className="spark-mark">*</span>
          <p>
            Local services become <strong>visible</strong> when the data is precise, multilingual, and easy to verify.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="neo-stat">
            <span>{filteredServices.length}</span>
            <small>records</small>
          </div>
          <div className="neo-stat">
            <span>{supportedLanguages.length}</span>
            <small>langs</small>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-3 text-xs font-semibold text-slate-700">
            <div className="w-2 h-2 rounded-full bg-emerald-700 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
            <span>Kozhikode and Mukkali data ready on launch</span>
          </div>
          <div className="flex items-center space-x-3 text-xs font-semibold text-slate-700">
            <div className="w-2 h-2 rounded-full bg-emerald-700 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
            <span>Map view for nearby public facilities</span>
          </div>
          <div className="flex items-center space-x-3 text-xs font-semibold text-slate-700">
            <div className="w-2 h-2 rounded-full bg-emerald-700 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
            <span>English, Malayalam, Hindi, and Telugu content</span>
          </div>
          <div className="flex items-center space-x-3 text-xs font-semibold text-slate-700">
            <div className="w-2 h-2 rounded-full bg-emerald-700 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
            <span>Local storage keeps added services available</span>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 text-[11px] text-slate-500 font-medium leading-relaxed">
          Built as a resident-facing prototype: search the directory, view facilities on the map, add suggestions, and manage local data from the profile tab.
        </div>

        <div className="signal-stack">
          <span>THEY</span>
          <span>HAVE</span>
          <span>BECOME</span>
          <span>FINDABLE</span>
        </div>
      </div>

      {
    /* App frame */
  }
      <div className="directory-frame relative w-full max-w-[1600px] h-dvh min-h-[620px] bg-[#101214] lg:h-[calc(100vh-32px)] lg:my-4 lg:rounded-2xl lg:border lg:border-slate-300/70 lg:shadow-2xl flex flex-col overflow-hidden transition-all">
        
        {
    /* Dynamic Mobile Banner Header block */
  }
        <header className="gram-header app-header text-white p-4 sm:p-5 lg:p-6 pt-6 pb-5 shrink-0 flex flex-col gap-2 relative">
          
          {
    /* Virtual OS Status Bar */
  }
          <div className="h-6 flex justify-between items-center text-[12px] text-white/95 font-semibold px-1 mb-1">
            <span>9:41</span>
            <span className="font-label text-[10px] font-extrabold tracking-widest text-emerald-100 uppercase">GramSeva</span>
            <div className={`network-status flex items-center space-x-1 px-2.5 py-0.5 text-[9px] font-bold border transition-colors ${isOfflineMode ? "is-offline bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-emerald-500/20 text-emerald-200 border-emerald-300/30"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOfflineMode ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
              <span className="font-label">Offline Ready</span>
            </div>
          </div>

          {
    /* Panchayat Branding */
  }
          <div className="flex justify-between items-start gap-2 mt-1">
            <div className="flex-1 min-w-0">
              <p className="font-label text-[9px] uppercase tracking-[0.32em] text-signal-orange mb-1">GramSeva command grid</p>
              <h2 className="header-title font-classical text-3xl lg:text-5xl font-black text-white tracking-tight truncate leading-none drop-shadow-sm">
                {selectedLocality === "all"
                  ? selectedDistrict === "all" ? "Kerala Service Directory" : `${selectedDistrict} Service Directory`
                  : `${selectedLocality} Panchayat`}
              </h2>
              <p className="text-xs lg:text-sm text-emerald-100/95 font-semibold tracking-wide mt-1">
                {selectedDistrict === "all" ? "All Kerala districts" : `${selectedDistrict} District`} &middot; {filteredServices.length} services
              </p>
            </div>
            
            {
    /* Quick Vernacular Lang Buttons (Capsule style matching mockup) */
  }
            <div className="language-switcher flex bg-black/20 p-0.5 border border-white/15 shrink-0">
              {[
    { code: "en", label: "EN", name: "English" },
    { code: "ml", label: "\u0D2E\u0D32", name: "Malayalam" },
    { code: "hi", label: "\u0939\u093F", name: "Hindi" },
    { code: "te", label: "\u0C24\u0C46", name: "Telugu" },
    { code: "kn", label: "\u0C95", name: "Kannada" }
  ].map((lang) => {
    const isActive = language === lang.code;
    return <button
      type="button"
      key={lang.code}
      onClick={() => setLanguage(lang.code)}
      aria-pressed={isActive}
      aria-label={`Use ${lang.name}`}
      title={lang.name}
      className={isActive ? "is-active" : ""}
    >
                    {lang.label}
                  </button>;
  })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="header-metric">
              <span>{filteredServices.length}</span>
              <small>services</small>
            </div>
            <div className="header-metric">
              <span>{emergencyServices.length}</span>
              <small>urgent</small>
            </div>
            <div className="header-metric">
              <span>{supportedLanguages.length}</span>
              <small>languages</small>
            </div>
          </div>

          <div className="hero-wireframe">
            <p>
              Verified civic records for <span>health</span>, water, schools, revenue offices, agriculture support, and emergency services.
            </p>
          </div>

          {
    /* Primary search input */
  }
          <div className="relative md:max-w-3xl">
            <div className={`service-search bg-white flex items-center mt-3 border ${isSearchFocused ? "is-focused" : ""} ${searchQuery !== settledSearchQuery ? "is-searching" : ""}`}>
              <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
              <input
    ref={searchInputRef}
    type="text"
    aria-busy={searchQuery !== settledSearchQuery}
    aria-label="Search services by name, category, place, contact, or language"
    placeholder={t.searchPlaceholder || "Search services..."}
    value={searchQuery}
    onFocus={() => setIsSearchFocused(true)}
    onBlur={() => setTimeout(() => setIsSearchFocused(false), 140)}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full text-slate-800 placeholder-slate-400 bg-transparent text-sm py-2 px-2.5 outline-none border-none leading-none font-semibold"
  />
              {searchQuery ? <button onClick={() => setSearchQuery("")} className="search-clear" aria-label="Clear search">
                  <X className="w-4 h-4" />
                </button> : <span className="search-shortcut" aria-hidden="true"><Keyboard className="w-3.5 h-3.5" /> /</span>}
            </div>
            {isSearchFocused && searchSuggestions.length > 0 && <div className="search-suggestions absolute top-full mt-2 left-0 right-0 z-40 bg-white/95 text-slate-900 border border-slate-200 rounded-xl shadow-xl p-2">
                <div className="px-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">{ui.searchSuggestions}</div>
                {searchSuggestions.map((item) => <button
    key={item.id}
    onMouseDown={() => setSearchQuery(item.label)}
    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 transition flex items-center justify-between gap-3"
  >
                    <span className="text-xs font-bold truncate">{item.label}</span>
                    <span className="text-[10px] text-emerald-700 font-bold shrink-0">{item.helper}</span>
                  </button>)}
              </div>}
          </div>

        </header>

        {
    /* View switcher container */
  }
        <div className={`app-content-shell flex-1 flex flex-col min-h-0 bg-[#101214] ${isUiPending ? "is-pending" : ""}`} aria-busy={isUiPending}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentTab}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.14, ease: [0.2, 0.8, 0.2, 1] }}
              className="tab-surface flex-1 flex flex-col min-h-0"
            >
          
          {
    /* Tab Content 1: Services Directory List */
  }
          {currentTab === "services" && <>
              {
    /* Category Horizontal Filter Row */
  }
              <div className="category-strip flex overflow-x-auto gap-2 px-4 sm:px-5 lg:px-6 py-3 border-b border-zinc-800/80 scrollbar-none shrink-0 select-none" role="toolbar" aria-label="Filter services by category">
                {categoryOptions.map((cat) => {
    const isActive = selectedCategory === cat.key;
    return <button
      key={cat.key}
      onClick={() => chooseCategory(cat.key)}
      aria-pressed={isActive}
      aria-label={`Show ${cat.label} services`}
      className={`category-pill ${isActive ? "is-active" : ""} flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition whitespace-nowrap border shrink-0 active:scale-95 ${isActive ? "bg-zinc-800 text-white border-emerald-500/30 shadow-sm" : "bg-transparent text-zinc-400 border-zinc-800/60 hover:text-white hover:border-zinc-700"}`}
    >
                      {cat.icon}
                <span className="font-label text-[11px]">{cat.label}</span>
                    </button>;
  })}
              </div>

              <div className="interaction-rail px-4 sm:px-5 lg:px-6 py-3 border-b border-zinc-800/70">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                    <span className="rail-chip rail-result-count"><Sparkles className="w-3.5 h-3.5" /> {filteredServices.length} matches</span>
                    <span className="rail-chip">{selectedCategory === "all" ? "All services" : getCategoryName(selectedCategory)}</span>
                    <span className="rail-chip">{selectedDistrict === "all" ? "All districts" : selectedDistrict}</span>
                    <span className="rail-chip">{selectedLocality === "all" ? "All localities" : selectedLocality}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setSortByProximity((value) => !value)} className={`rail-action ${sortByProximity ? "is-active" : ""}`} aria-pressed={sortByProximity}>Nearest first</button>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedDistrict("Kozhikode");
                        setSelectedLocality("Mukkali");
                        setSortByProximity(false);
                      }}
                      className="rail-action"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {
    /* Dynamic scrollable directory area */
  }
              <div id="service-results" className="service-observatory flex-1 overflow-y-auto px-4 sm:px-5 lg:px-6 pt-4 pb-24 scrollbar-none" tabIndex={-1}>
                <div className="service-feed-heading flex justify-between items-end gap-4 px-1 mb-1">
                  <div>
                    <span className="service-feed-kicker">Directory results</span>
                    <h3>Services near {selectedLocality === "all" ? selectedDistrict : selectedLocality}</h3>
                  </div>
                  <span className="service-feed-count">Showing {Math.min(visibleCount, filteredServices.length)} of {filteredServices.length}</span>
                </div>

                <AnimatePresence initial={false} mode="popLayout">
                  {filteredServices.length > 0 ? filteredServices.slice(0, visibleCount).map((service, index) => {
    const data = service.translations[language] || service.translations["en"];
    const isVerifiedPulse = (() => {
      if (!service.lastVerified) return false;
      try {
        const verifiedDate = new Date(service.lastVerified);
        const diffTime = Math.abs((/* @__PURE__ */ new Date()).getTime() - verifiedDate.getTime());
        const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
        return diffDays <= 30;
      } catch (e) {
        return false;
      }
    })();
    const verificationScore = getVerificationScore(service, duplicateCounts);
    const duplicateCount = getDuplicateCount(service, duplicateCounts);
    return <motion.div
      key={service.id}
      layout={shouldReduceMotion ? false : "position"}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.16, delay: shouldReduceMotion ? 0 : Math.min(index * 0.012, 0.08), ease: [0.2, 0.8, 0.2, 1] }}
      onClick={() => setSelectedDetailService(service)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setSelectedDetailService(service);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${data.title}`}
      className="service-card bg-zinc-900/95 border border-zinc-800/80 p-4 sm:p-5 cursor-pointer transition flex flex-row gap-3 sm:gap-4 relative"
    >
                          {
      /* Emergency Stripe */
    }
                          {service.isEmergency && <div className="absolute top-0 bottom-0 left-0 w-1 bg-rose-500" />}

                          {
      /* Customized icon wrapper on left */
    }
                          <div className={`icon-tile w-12 h-12 lg:w-13 lg:h-13 flex items-center justify-center shrink-0 ${getCategoryColor(service.categoryKey)}`}>
                            {getCustomizedIcon(service)}
                          </div>

                          {
      /* Detail block on right */
    }
                          <div className="flex-1 min-w-0">
                            <div className="service-card-head flex flex-col min-[520px]:flex-row min-[520px]:items-start min-[520px]:justify-between gap-2">
                              <h3 className="service-card-title text-[15px] sm:text-base font-extrabold text-white leading-snug pr-1">
                                {data.title}
                              </h3>
                              
                              {
      /* Status indicator capsule */
    }
                              {isVerifiedPulse ? <span className="service-status shrink-0 text-[10px] font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-500/25 px-2 py-1 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Verified</span>
                                </span> : <span className="service-status shrink-0 text-[9px] font-black tracking-tight text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded-full">
                                  May be outdated
                                </span>}
                            </div>

                            <p className="font-label text-[10px] text-zinc-400 font-bold tracking-wide uppercase mt-1">
                              {data.category}
                            </p>

                            <p className="service-card-description text-xs lg:text-[11px] text-zinc-400/90 leading-relaxed mt-2">
                              {data.description}
                            </p>

                            {
      /* Info Badges */
    }
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500 font-semibold mt-2.5">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-emerald-500" />
                                <span>{getSimulatedDistance(service)} km</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-zinc-500" />
                                <span className="service-hours">{data.hours}</span>
                              </div>
                            </div>
                            <div className="data-quality-row" aria-label={`Verification score ${verificationScore} percent, ${getConfidenceLevel(verificationScore)}`}>
                              <span>{verificationScore}% verified</span>
                              <span>{getConfidenceLevel(verificationScore)}</span>
                              <span>{getLastCheckedBy(service)}</span>
                              {duplicateCount > 1 && <span className="duplicate-risk">Duplicate risk</span>}
                            </div>
                            <div className="service-card-footer mt-3">
                              <span>View service details</span>
                              <span aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></span>
                            </div>
                          </div>

                        </motion.div>;
  }) : <div className="text-center py-12 px-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl lg:col-span-2">
                      <HelpCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                      <p className="text-zinc-400 text-xs font-bold">{t.noServicesFound || "No services found"}</p>
                      <button
    onClick={() => {
      setSearchQuery("");
      setSelectedCategory("all");
      setSelectedDistrict("Kozhikode");
      setSelectedLocality("Mukkali");
    }}
    className="mt-3 text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest hover:underline"
  >
                        Reset Local Filters
                      </button>
                    </div>}
                </AnimatePresence>

                {filteredServices.length > visibleCount && <div className="pt-2 pb-4 text-center lg:col-span-2">
                    <button
    onClick={() => setVisibleCount((p) => p + 12)}
    className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/80 text-emerald-400 font-extrabold text-xs uppercase tracking-widest rounded-2xl transition shadow-md active:scale-98"
  >
                      Show 12 more services
                    </button>
                    <p className="text-[10px] text-zinc-500 font-semibold mt-1.5">
                      Showing {visibleCount} of {filteredServices.length} services
                    </p>
                  </div>}
              </div>
            </>}

          {
    /* Tab Content 2: Emergency quick access */
  }
          {currentTab === "emergency" && <div className="flex-1 overflow-y-auto px-4 sm:px-5 lg:px-8 pt-4 sm:pt-5 pb-24 scrollbar-none space-y-4">
              <div className="bg-rose-950/40 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-rose-500/15 text-rose-300 flex items-center justify-center shrink-0">
                  <Siren className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-classical text-xl text-white font-black">{ui.emergency}</h3>
                  <p className="text-xs text-rose-100/75 leading-relaxed mt-1">{ui.emergencyIntro}</p>
                </div>
              </div>

              {emergencyServices.length > 0 ? <div className="grid gap-3 lg:grid-cols-2">
                  {emergencyServices.map((service) => {
    const data = service.translations[language] || service.translations.en;
    return <div key={service.id} className="bg-zinc-900/95 border border-zinc-800 rounded-2xl p-4 flex gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getCategoryColor(service.categoryKey)}`}>
                          {service.isEmergency ? <AlertTriangle className="w-5 h-5" /> : getCustomizedIcon(service)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-classical text-base text-white font-black leading-snug line-clamp-2">{data.title}</h4>
                            <span className="text-[9px] text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold shrink-0">Urgent</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{data.location}</p>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            <a href={`tel:${service.phoneNumber}`} className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white py-2 text-[11px] font-black">
                              <Phone className="w-3.5 h-3.5" />
                              Call
                            </a>
                            <button onClick={() => setSelectedDetailService(service)} className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-2 text-[11px] font-black">
                              Details
                            </button>
                          </div>
                        </div>
                      </div>;
  })}
                </div> : <div className="text-center py-12 px-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl">
                  <AlertTriangle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-zinc-400 text-xs font-bold">{ui.noEmergency}</p>
                </div>}
            </div>}

          {
    /* Tab Content 2: Full interactive vector map */
  }
          {currentTab === "map" && <Suspense fallback={<div className="flex-1 grid place-items-center bg-[#121214] text-zinc-300 text-xs font-black uppercase tracking-widest">Loading real map...</div>}>
              <ServiceMap
                services={filteredServices}
                categoryOptions={categoryOptions}
                mapCategoryFilter={mapCategoryFilter}
                setMapCategoryFilter={setMapCategoryFilter}
                getCategoryName={getCategoryName}
                setSelectedDetailService={setSelectedDetailService}
                ui={ui}
              />
            </Suspense>}
          {currentTab === "suggest" && <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 md:pt-6 pb-24 scrollbar-none">
              <div className="border-b border-zinc-800 pb-3 max-w-5xl mx-auto">
                <h3 className="font-classical text-lg font-black text-white tracking-wide flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>{t.addServiceTitle || "Suggest Service"}</span>
                </h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Contribute details about essential community assets. Your submissions are cached instantly.
                </p>
              </div>

              <form onSubmit={handleAddService} className="max-w-5xl mx-auto mt-4 grid gap-3.5 text-xs md:grid-cols-2">
                
                <div className="md:col-span-2">
                  <label htmlFor="suggest-service-title" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Service Title *
                  </label>
                  <input
    id="suggest-service-title"
    type="text"
    required
    placeholder="e.g. Primary Health Centre Subcenter"
    value={newTitle}
    onChange={(e) => setNewTitle(e.target.value)}
    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:col-span-2">
                  <div>
                    <label htmlFor="suggest-service-category" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
    id="suggest-service-category"
    value={newCategory}
    onChange={(e) => setNewCategory(e.target.value)}
    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-2 py-2 focus:outline-none focus:border-emerald-500"
  >
                      <option value="health">{t.health || "Health"}</option>
                      <option value="water">{t.water || "Water"}</option>
                      <option value="agriculture">{t.agriculture || "Agriculture"}</option>
                      <option value="education">{t.education || "Education"}</option>
                      <option value="government">{t.government || "Government"}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="suggest-service-phone" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
    id="suggest-service-phone"
    type="tel"
    required
    placeholder="+91 XXXXX XXXXX"
    value={newPhone}
    onChange={(e) => setNewPhone(e.target.value)}
    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
  />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="suggest-service-description" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Description & Service details *
                  </label>
                  <textarea
    id="suggest-service-description"
    required
    rows={2.5}
    placeholder="Describe what help, documents, or aids are provided here..."
    value={newDesc}
    onChange={(e) => setNewDesc(e.target.value)}
    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:col-span-2">
                  <div>
                    <label htmlFor="suggest-service-hours" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Operating Hours
                    </label>
                    <input
    id="suggest-service-hours"
    type="text"
    placeholder="e.g. 9:00 AM - 4:00 PM"
    value={newHours}
    onChange={(e) => setNewHours(e.target.value)}
    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
  />
                  </div>
                  <div>
                    <label htmlFor="suggest-service-contact" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Contact Name
                    </label>
                    <input
    id="suggest-service-contact"
    type="text"
    placeholder="e.g. Sister Lakshmi"
    value={newContact}
    onChange={(e) => setNewContact(e.target.value)}
    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
  />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:col-span-2">
                  <div>
                    <label htmlFor="suggest-service-district" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      District
                    </label>
                    <select
    id="suggest-service-district"
    value={newDistrict}
    onChange={(e) => {
      setNewDistrict(e.target.value);
      const locals = LOCALITIES_EN[e.target.value] || [];
      setNewLocality(locals[0] || "");
    }}
    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-2 py-2 focus:outline-none focus:border-emerald-500"
  >
                      {KERALA_DISTRICTS.map((d) => <option key={d.en} value={d.en}>{d.en}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="suggest-service-locality" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Locality
                    </label>
                    <select
    id="suggest-service-locality"
    value={newLocality}
    onChange={(e) => setNewLocality(e.target.value)}
    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-2 py-2 focus:outline-none focus:border-emerald-500"
  >
                      {(LOCALITIES_EN[newDistrict] || []).map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="suggest-service-address" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Landmark / Address
                  </label>
                  <input
    id="suggest-service-address"
    type="text"
    placeholder="e.g. Opposite Local Library block"
    value={newLocation}
    onChange={(e) => setNewLocation(e.target.value)}
    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
  />
                </div>

                <div className="flex items-center space-x-2 pt-1 md:col-span-2">
                  <input
    type="checkbox"
    id="mobile-em-chk"
    checked={isEmergencyCheck}
    onChange={(e) => setIsEmergencyCheck(e.target.checked)}
    className="w-4 h-4 bg-zinc-900 border-zinc-800 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
  />
                  <label htmlFor="mobile-em-chk" className="text-[10px] font-extrabold text-zinc-300 select-none cursor-pointer uppercase tracking-wider">
                    Emergency 24/7 Service
                  </label>
                </div>

                <button
    type="submit"
    className="w-full md:max-w-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition mt-3 shadow-lg uppercase tracking-wider text-[11px] md:col-span-2"
  >
                  {t.submitBtn || "Submit to Local Directory"}
                </button>

              </form>
            </div>}

          {
    /* Tab Content 4: Profile / Diagnostic settings */
  }
          {currentTab === "profile" && <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 md:pt-6 pb-24 scrollbar-none">
              <div className="border-b border-zinc-800 pb-3 max-w-5xl mx-auto">
                <h3 className="font-classical text-lg font-black text-white tracking-wide">
                  Directory Settings
                </h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Local data controls, place filters, and offline access.
                </p>
              </div>

              {
    /* State Controls Block */
  }
              <div className="max-w-5xl mx-auto mt-4 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-4 shadow-md">
                
                {
    /* Simulated Offline Switch */
  }
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black text-white block uppercase tracking-wider">Network Status</span>
                    <span className="text-[9px] text-zinc-400 block">Use locally saved directory data</span>
                  </div>
                  <button
    type="button"
    onClick={() => setIsOfflineMode(!isOfflineMode)}
    aria-label="Use locally saved directory data"
    aria-pressed={isOfflineMode}
    className={`p-2 rounded-xl transition ${isOfflineMode ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}
  >
                    {isOfflineMode ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
                  </button>
                </div>

                {
    /* District and Locality Selection Hub */
  }
                <div className="pt-3 border-t border-zinc-800/80 space-y-3">
                  <span className="text-[10px] font-black text-zinc-500 block uppercase tracking-wider">Location Config</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="profile-district" className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">District</label>
                      <select
    id="profile-district"
    value={selectedDistrict}
    onChange={(e) => {
      setSelectedDistrict(e.target.value);
      const locals = LOCALITIES_EN[e.target.value] || [];
      setSelectedLocality(locals[0] || "all");
    }}
    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-1.5 text-[10px] outline-none"
  >
                        <option value="all">All Districts</option>
                        {KERALA_DISTRICTS.map((d) => <option key={d.en} value={d.en}>{d.en}</option>)}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="profile-locality" className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Locality</label>
                      <select
    id="profile-locality"
    value={selectedLocality}
    onChange={(e) => setSelectedLocality(e.target.value)}
    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-1.5 text-[10px] outline-none"
  >
                        <option value="all">All Localities</option>
                        {(LOCALITIES_EN[selectedDistrict] || []).map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {
    /* Simulated GPS block */
  }
                <div className="pt-3 border-t border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-black text-white block uppercase tracking-wider">Nearby Services</span>
                      <span className="text-[9px] text-zinc-400 block">Sort and filter by approximate distance</span>
                    </div>
                    <button
    type="button"
    onClick={() => {
      const nextVal = !isNearMeActive;
      setIsNearMeActive(nextVal);
      if (nextVal) {
        setSelectedDistrict("all");
        setSelectedLocality("all");
      }
    }}
    aria-label="Sort and filter by approximate distance"
    aria-pressed={isNearMeActive}
    className={`p-2 rounded-xl transition ${isNearMeActive ? "bg-amber-500/20 text-amber-300" : "bg-zinc-950 text-zinc-500"}`}
  >
                      <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: isNearMeActive ? "8s" : "0s" }} />
                    </button>
                  </div>

                  {isNearMeActive && <div className="space-y-2 pt-1 animate-fade-in">
                      <div className="flex justify-between items-center text-[9px] text-zinc-400 font-bold uppercase">
                        <span>Search Radius</span>
                        <span className="text-amber-400 font-black">{nearMeDistance} km</span>
                      </div>
                      <input
    type="range"
    min="5"
    max="200"
    step="5"
    value={nearMeDistance}
    onChange={(e) => setNearMeDistance(Number(e.target.value))}
    className="w-full accent-emerald-500 h-1 bg-zinc-950 rounded"
  />
                    </div>}
                </div>

              </div>

              {
    /* Cache status report */
  }
              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 text-[11px] text-zinc-400 space-y-2">
                <span className="font-black text-white block uppercase tracking-wider">Local Data Status</span>
                <div className="flex justify-between font-mono text-[10px]">
                  <span>Directory records:</span>
                  <span className="text-emerald-400">{services.length.toLocaleString("en-IN")} services</span>
                </div>
                <div className="flex justify-between font-mono text-[10px]">
                  <span>Saved in browser:</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>
                <div className="flex justify-between font-mono text-[10px]">
                  <span>Update mode:</span>
                  <span className="text-zinc-500">Manual review</span>
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 text-[11px] text-zinc-400 space-y-3">
                <span className="font-black text-white block uppercase tracking-wider">{ui.accessibility}</span>
                <button
    type="button"
    onClick={() => setIsLargeText(!isLargeText)}
    aria-pressed={isLargeText}
    className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 transition ${isLargeText ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-zinc-950 border-zinc-800 text-zinc-300"}`}
  >
                  <span className="flex items-center gap-2 font-bold"><Type className="w-4 h-4" />{ui.largeText}</span>
                  <span>{isLargeText ? "On" : "Off"}</span>
                </button>
                <button
    type="button"
    onClick={() => setIsHighContrast(!isHighContrast)}
    aria-pressed={isHighContrast}
    className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 transition ${isHighContrast ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-zinc-950 border-zinc-800 text-zinc-300"}`}
  >
                  <span className="flex items-center gap-2 font-bold"><Eye className="w-4 h-4" />{ui.highContrast}</span>
                  <span>{isHighContrast ? "On" : "Off"}</span>
                </button>
              </div>

              {
    /* Reset State Button */
  }
              <button
    type="button"
    onClick={() => {
      setSearchQuery("");
      setSelectedCategory("all");
      setMapCategoryFilter("all");
      setSelectedDistrict("Kozhikode");
      setSelectedLocality("Mukkali");
      setIsNearMeActive(false);
      setNearMeDistance(30);
      setSortByProximity(false);
      setIsOfflineMode(false);
      setIsLargeText(false);
      setIsHighContrast(false);
    }}
    className="w-full py-2.5 bg-zinc-900 border border-zinc-800 hover:text-white transition rounded-xl text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-2"
  >
                Reset App State
              </button>
              </div>

            </div>}

            </motion.div>
          </AnimatePresence>
        </div>

        {
    /* Dynamic bottom detail drawer (native iOS/Android style slide up drawer overlay) */
  }
        <AnimatePresence>
          {selectedDetailService && (() => {
    const activeDetailLang = detailPreviewLang || language;
    const detailData = selectedDetailService.translations[activeDetailLang] || selectedDetailService.translations["en"];
    const historyLogs = getServiceHistory(selectedDetailService);
    const guidelines = getServiceGuidelines(selectedDetailService);
    const detailVerificationScore = getVerificationScore(selectedDetailService, duplicateCounts);
    const detailDuplicateCount = getDuplicateCount(selectedDetailService, duplicateCounts);
    const isRecentVerified = (() => {
      if (!selectedDetailService.lastVerified) return false;
      try {
        const verifiedDate = new Date(selectedDetailService.lastVerified);
        const diffTime = Math.abs((/* @__PURE__ */ new Date()).getTime() - verifiedDate.getTime());
        const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
        return diffDays <= 30;
      } catch (e) {
        return false;
      }
    })();
    return <>
                {
      /* Backdrop dark shroud inside smartphone */
    }
                <div
      onClick={() => {
        setSelectedDetailService(null);
        setDetailPreviewLang(null);
      }}
      className="absolute inset-0 bg-black/60 z-40 backdrop-blur-xs cursor-pointer"
    />

                {
      /* Bottom slide-up sheet drawer */
    }
                <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 400 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-detail-title"
      className="absolute inset-x-0 bottom-0 max-h-[85%] md:inset-x-auto md:right-0 md:top-0 md:bottom-0 md:h-full md:w-[min(460px,42vw)] md:max-h-none bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-800 rounded-t-[32px] md:rounded-none shadow-[0_-12px_42px_rgba(0,0,0,0.85)] md:shadow-[-18px_0_42px_rgba(0,0,0,0.45)] z-50 flex flex-col overflow-hidden text-zinc-100 font-sans"
    >
                  
                  {
      /* Pull Handle accent */
    }
                  <div className="w-11 h-1 bg-zinc-800 rounded-full mx-auto my-3 shrink-0 md:hidden" />

                  {
      /* Header Row */
    }
                  <div className="px-5 pt-0 md:pt-5 pb-3 border-b border-zinc-900 flex justify-between items-start gap-2 shrink-0">
                    <div className="flex items-start space-x-3 pr-2 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getCategoryColor(selectedDetailService.categoryKey)}`}>
                        {getCustomizedIcon(selectedDetailService)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block leading-none mb-1">
                          {getCategoryName(selectedDetailService.categoryKey)}
                        </span>
                        <h4 id="service-detail-title" className="font-classical text-sm sm:text-base font-black text-white leading-tight">
                          {detailData.title}
                        </h4>
                      </div>
                    </div>
                    <button
      type="button"
      aria-label="Close service details"
      onClick={() => {
        setSelectedDetailService(null);
        setDetailPreviewLang(null);
      }}
      className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition"
    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {
      /* Quick Preview Language Swapper widget (Vernacular helper) */
    }
                  <div className="bg-zinc-900/60 border-b border-zinc-900 px-5 py-2 shrink-0 flex items-center justify-between gap-2.5 text-[9px] font-bold text-zinc-400 select-none">
                    <span className="font-label">Vernacular Swapper:</span>
                    <div className="flex bg-black/30 p-0.5 rounded border border-zinc-800">
                      {[
      { code: "en", flag: "\u{1F1EC}\u{1F1E7}", label: "EN" },
      { code: "ml", flag: "\u{1F1EE}\u{1F1F3}", label: "\u0D2E\u0D32" },
      { code: "hi", flag: "\u{1F1EE}\u{1F1F3}", label: "\u0939\u093F" },
      { code: "te", flag: "\u{1F1EE}\u{1F1F3}", label: "\u0C24\u0C46" },
      { code: "kn", flag: "\u{1F1EE}\u{1F1F3}", label: "\u0C95" }
    ].map((lang) => {
      const isActive = activeDetailLang === lang.code;
      return <button
        key={lang.code}
        onClick={() => setDetailPreviewLang(lang.code)}
        className={`px-2 py-0.5 rounded-[3px] text-[8.5px] font-extrabold transition-all ${isActive ? "bg-emerald-600 text-white shadow-xs" : "text-zinc-500 hover:text-white"}`}
      >
                            {lang.label}
                          </button>;
    })}
                    </div>
                  </div>

                  {
      /* Scrollable details view content */
    }
                  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs leading-relaxed">
                    
                    {
      /* Primary specs row */
    }
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-3 bg-zinc-900/40 border border-zinc-900 p-3 rounded-2xl">
                      <div>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block mb-0.5">Contact</span>
                        <span className="font-bold text-white block truncate">{detailData.contactName || "Local Volunteer"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block mb-0.5">Hours</span>
                        <span className="font-bold text-white block truncate">{detailData.hours}</span>
                      </div>
                      <div className="sm:col-span-2 md:col-span-1 xl:col-span-2 pt-2 border-t border-zinc-900">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block mb-0.5">Location</span>
                        <p className="text-[10px] text-zinc-300 leading-tight font-medium">{detailData.location}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block mb-0.5">Verification score</span>
                        <span className="font-bold text-white block">{detailVerificationScore}% - {getConfidenceLevel(detailVerificationScore)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block mb-0.5">Last checked by</span>
                        <span className="font-bold text-white block">{getLastCheckedBy(selectedDetailService)}</span>
                      </div>
                      {detailDuplicateCount > 1 && <div className="sm:col-span-2 md:col-span-1 xl:col-span-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-2 text-[10px] font-bold text-amber-200">
                        Possible duplicate found in this locality. Verify before publishing changes.
                      </div>}
                    </div>

                    {
      /* Description Text block */
    }
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block">Description Details</span>
                      <p className="text-zinc-300 leading-relaxed font-medium">{detailData.description}</p>
                    </div>

                    {
      /* Direct Telephone Dialer Dial btn */
    }
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block">{ui.actions}</span>
                      <div className="grid grid-cols-2 gap-2">
                        <a
      href={`tel:${selectedDetailService.phoneNumber}`}
      className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black py-3 px-4 rounded-xl transition uppercase tracking-wider shadow-lg shrink-0 select-none active:scale-95"
    >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                        <a
      href={`https://wa.me/${selectedDetailService.phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(getServiceShareText(selectedDetailService))}`}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center space-x-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-100 text-[11px] font-black py-3 px-4 rounded-xl transition uppercase tracking-wider"
    >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{ui.whatsapp}</span>
                        </a>
                        <button
      onClick={() => copyText(selectedDetailService.phoneNumber, "Phone number copied")}
      className="flex items-center justify-center space-x-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-100 text-[11px] font-black py-3 px-4 rounded-xl transition uppercase tracking-wider"
    >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{ui.copyPhone}</span>
                        </button>
                        <button
      onClick={() => copyText(getServiceShareText(selectedDetailService), "Service details copied")}
      className="flex items-center justify-center space-x-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-100 text-[11px] font-black py-3 px-4 rounded-xl transition uppercase tracking-wider"
    >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{ui.copyDetails}</span>
                        </button>
                        <button
      onClick={() => shareService(selectedDetailService)}
      className="flex items-center justify-center space-x-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-100 text-[11px] font-black py-3 px-4 rounded-xl transition uppercase tracking-wider"
    >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{ui.share}</span>
                        </button>
                      </div>
                      <button
      onClick={() => setReportService(selectedDetailService)}
      className="flex items-center justify-center space-x-2 w-full bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 text-amber-300 text-[11px] font-black py-2.5 px-4 rounded-xl transition uppercase tracking-wider"
    >
                        <Flag className="w-3.5 h-3.5" />
                        <span>{ui.reportWrongInfo}</span>
                      </button>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-900 p-3 rounded-2xl space-y-2">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                        <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
                        {ui.documentChecklist}
                      </span>
                      <div className="space-y-1.5">
                        {getDocumentChecklist(selectedDetailService).map((item) => <label key={item} className="flex items-start gap-2 text-[10.5px] text-zinc-300 leading-snug">
                            <input type="checkbox" className="mt-0.5 accent-emerald-500" />
                            <span>{item}</span>
                          </label>)}
                      </div>
                    </div>

                    {
      /* Static Verification Timeline */
    }
                    <div className="space-y-2 pt-1">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block">Verification Timeline</span>
                      <div className="border-l border-zinc-800 pl-3 ml-1.5 space-y-3.5">
                        {historyLogs.slice(0, 2).map((log, idx) => <div key={idx} className="relative">
                            <span className="absolute -left-[15.5px] top-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
                            <p className="text-[10.5px] text-zinc-400 font-medium leading-normal">{log}</p>
                          </div>)}
                      </div>
                    </div>

                    {
      /* Community Guidelines Notes */
    }
                    <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-2xl space-y-1 mt-1 select-none">
                      <span className="text-[9px] font-black text-amber-500 uppercase tracking-wider block">Community Guidelines</span>
                      <p className="text-[10px] text-amber-100/90 leading-normal font-medium">{guidelines}</p>
                    </div>

                  </div>

                </motion.div>
              </>;
  })()}
        </AnimatePresence>

        <AnimatePresence>
          {reportService && <>
              <div className="absolute inset-0 bg-black/70 z-[60] backdrop-blur-xs" onClick={() => setReportService(null)} />
              <motion.div
    initial={{ opacity: 0, scale: 0.96, y: 12 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96, y: 12 }}
    role="dialog"
    aria-modal="true"
    aria-labelledby="report-dialog-title"
    className="absolute z-[61] left-4 right-4 top-24 md:left-1/2 md:right-auto md:w-[420px] md:-translate-x-1/2 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-4 text-zinc-100"
  >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 id="report-dialog-title" className="font-classical text-lg font-black text-white">{ui.reportTitle}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{ui.reportHint}</p>
                  </div>
                  <button type="button" aria-label="Close report dialog" onClick={() => setReportService(null)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-3 rounded-xl bg-zinc-900/70 border border-zinc-800 p-3 text-xs text-zinc-300">
                  {reportService.translations[language]?.title || reportService.translations.en.title}
                </div>
                <textarea
    value={reportText}
    onChange={(e) => setReportText(e.target.value)}
    placeholder={ui.reportPlaceholder}
    className="mt-3 w-full min-h-[110px] bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 resize-none"
  />
                <button
    onClick={submitReport}
    disabled={!reportText.trim()}
    className="mt-3 w-full bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-500 hover:bg-emerald-700 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider"
  >
                  {ui.submitReport}
                </button>
              </motion.div>
            </>}
        </AnimatePresence>

        {
    /* Global Floating Toast for successful directory additions */
  }
        {successToast && <div role="status" aria-live="polite" className="absolute top-20 inset-x-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-center text-[10px] font-extrabold uppercase tracking-widest animate-bounce">
            {successToast}
          </div>}

        {
    /* Static virtual bottom nav tab row (matching screenshots) */
  }
        <div className="bottom-dock app-dock absolute bottom-0 inset-x-0 border-t border-zinc-800/85 flex items-center justify-around z-40 px-2 select-none" role="tablist" aria-label="Main app tabs">
          {[
    { id: "services", label: ui.services, icon: <Building2 className="w-5 h-5" /> },
    { id: "emergency", label: ui.emergency, icon: <Siren className="w-5 h-5" /> },
    { id: "map", label: ui.map, icon: <Compass className="w-5 h-5" /> },
    { id: "suggest", label: ui.suggest, icon: <Plus className="w-5 h-5" /> },
    { id: "profile", label: ui.profile, icon: <User className="w-5 h-5" /> }
  ].map((tab) => {
    const isActive = currentTab === tab.id;
    return <button
      key={tab.id}
      type="button"
      onClick={() => navigateToTab(tab.id)}
      role="tab"
      aria-selected={isActive}
      aria-current={isActive ? "page" : undefined}
      aria-label={`Open ${tab.label}`}
      className={`dock-button ${isActive ? "is-active" : ""} flex flex-col items-center justify-center gap-1 flex-1 py-1 transition cursor-pointer select-none active:scale-95 ${isActive ? "text-emerald-400 font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
    >
                {tab.icon}
                <span className="font-label text-[8px] md:text-[9px] font-extrabold tracking-wider uppercase leading-none">{tab.label}</span>
              </button>;
  })}
        </div>

      </div>

    </div>;
}
function App() {
  return <LanguageProvider>
      <DirectoryApp />
    </LanguageProvider>;
}
export {
  App as default
};
