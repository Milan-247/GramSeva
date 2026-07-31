import { lazy, Suspense, useState, useEffect, useRef, useMemo, useTransition } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Phone,
  MapPin,
  Map as MapIcon,
  List,
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
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Keyboard,
  Sparkles,
  Palette,
  LogIn,
  LogOut,
  ShieldCheck,
  Smartphone,
  IdCard,
  UserCheck,
  Mic,
  MicOff,
  History,
  QrCode,
  Printer,
  Download,
  BookmarkCheck,
  FolderCheck
} from "lucide-react";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import uiBackdrop from "./assets/gramseva-bg.svg";
import graamsevaLogo from "./assets/graamseva-logo.svg";
import {
  INITIAL_SERVICES,
  KERALA_DISTRICTS,
  AZHIYUR_SUB_LOCALITIES,
  LOCALITIES_EN
} from "./data/services";
import {
  KERALA_DISTRICTS_LIST,
  KERALA_PANCHAYATS_BY_DISTRICT
} from "./data/keralaPanchayatsData.js";

import { DirectorySkeleton, MapSkeleton } from "./components/Skeletons.jsx";
import LanguageWheel from "./components/LanguageWheel.jsx";
import RequiredDocumentsAccordion from "./components/RequiredDocumentsAccordion.jsx";

const ServiceMap = lazy(() => import("./components/ServiceMap.jsx"));
const CertificateResolver = lazy(() => import("./components/CertificateResolver.jsx"));

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
      resolver: "Cert Resolver",
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
      resolver: "സർട്ടിഫിക്കറ്റ് സോൾവർ",
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
      resolver: "प्रमाणपत्र हल",
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
      resolver: "సర్టిఫికేట్ పరిష్కారం",
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
  const currentTheme = "civic-light";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "civic-light");
  }, []);

  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // QOL #5: Recent Search History State
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("gramseva_recent_searches");
      return saved ? JSON.parse(saved) : ["Income Certificate", "Farmer Subsidy", "KSEB Electricity", "Primary Health Center", "Drinking Water"];
    } catch (e) {
      return ["Income Certificate", "Farmer Subsidy", "KSEB Electricity", "Primary Health Center"];
    }
  });

  const saveRecentSearch = (term) => {
    if (!term || term.trim().length < 2) return;
    const cleaned = term.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== cleaned.toLowerCase());
      const updated = [cleaned, ...filtered].slice(0, 6);
      try {
        localStorage.setItem("gramseva_recent_searches", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("gramseva_recent_searches");
    } catch (e) {}
  };

  // QOL #6: Web Speech API Voice Search
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please type your query in the search bar.");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === "ml" ? "ml-IN" : language === "hi" ? "hi-IN" : language === "te" ? "te-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSearchQuery(transcript);
          saveRecentSearch(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // QOL #1: Saved Citizen Document Wallet State
  const [walletDocs, setWalletDocs] = useState(() => {
    try {
      const saved = localStorage.getItem("gramseva_held_docs");
      return saved ? JSON.parse(saved) : ["aadhaar", "ration_card", "income_cert"];
    } catch (e) {
      return ["aadhaar", "ration_card"];
    }
  });

  const toggleWalletDoc = (docId) => {
    setWalletDocs((prev) => {
      const next = prev.includes(docId) ? prev.filter((d) => d !== docId) : [...prev, docId];
      try {
        localStorage.setItem("gramseva_held_docs", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mapCategoryFilter, setMapCategoryFilter] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("Kozhikode");
  const [selectedLocality, setSelectedLocality] = useState("Azhiyur");
  const [isNearMeActive, setIsNearMeActive] = useState(false);
  const [nearMeDistance, setNearMeDistance] = useState(30);
  const [sortByProximity, setSortByProximity] = useState(false);
  const [groupByPlace, setGroupByPlace] = useState(true);
  const [collapsedPlaces, setCollapsedPlaces] = useState({});
  const togglePlaceCollapse = (placeName) => setCollapsedPlaces((prev) => ({ ...prev, [placeName]: !prev[placeName] }));
  const [expandedSubgroups, setExpandedSubgroups] = useState({});
  const toggleSubgroup = (subgroupId) => setExpandedSubgroups((prev) => ({ ...prev, [subgroupId]: !prev[subgroupId] }));
  const [visibleCount, setVisibleCount] = useState(12);
  const [reportService, setReportService] = useState(null);
  const [reportText, setReportText] = useState("");
  const [isLargeText, setIsLargeText] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isUiPending, startUiTransition] = useTransition();

  // User Authentication & Citizen Profile state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("gramseva_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [loginMethod, setLoginMethod] = useState("otp");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginAadhaar, setLoginAadhaar] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [loginNameInput, setLoginNameInput] = useState("");
  const [loginRoleInput, setLoginRoleInput] = useState("Resident / Citizen");
  const [loginError, setLoginError] = useState("");

  const DEMO_ACCOUNTS = [
    {
      name: "Suresh Kumar",
      phone: "+91 94470 12345",
      aadhaarLast4: "8912",
      district: "Kozhikode",
      locality: "Azhiyur",
      role: "Resident / Farmer",
      roleBadge: "Villager",
      rationCard: "BPL (Pink Card)",
      avatarColor: "bg-emerald-600"
    },
    {
      name: "Smt. Anitha C. V.",
      phone: "+91 94471 98765",
      aadhaarLast4: "4321",
      district: "Kozhikode",
      locality: "Azhiyur",
      role: "Panchayat President",
      roleBadge: "Official",
      rationCard: "APL (White Card)",
      avatarColor: "bg-amber-600"
    },
    {
      name: "Fatima Beevi",
      phone: "+91 94472 55443",
      aadhaarLast4: "6789",
      district: "Kottayam",
      locality: "Vaikom",
      role: "Asha Worker / Health Volunteer",
      roleBadge: "Health Worker",
      rationCard: "Non-Priority (Blue Card)",
      avatarColor: "bg-teal-600"
    }
  ];

  const handleQuickDemoLogin = (account) => {
    const userObj = {
      ...account,
      loggedInAt: new Date().toISOString()
    };
    setCurrentUser(userObj);
    try {
      localStorage.setItem("gramseva_user", JSON.stringify(userObj));
    } catch (e) {}
    setSuccessToast(`Welcome back, ${account.name}!`);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (loginMethod === "otp" && !loginPhone.trim()) {
      setLoginError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (loginMethod === "aadhaar" && loginAadhaar.replace(/\s+/g, "").length < 12) {
      setLoginError("Please enter a 12-digit Aadhaar number.");
      return;
    }
    setLoginError("");
    setOtpSent(true);
    setOtpInput("1947");
  };

  const handleVerifyAndLogin = (e) => {
    e.preventDefault();
    if (!otpInput || otpInput.trim().length < 4) {
      setLoginError("Please enter the 4-digit OTP code.");
      return;
    }
    const name = loginNameInput.trim() || (loginMethod === "otp" ? `Resident (${loginPhone.slice(-4) || "Mobile"})` : `Aadhaar Holder (${loginAadhaar.slice(-4) || "Card"})`);
    const userObj = {
      name,
      phone: loginPhone ? `+91 ${loginPhone}` : "+91 98470 00000",
      aadhaarLast4: loginAadhaar ? loginAadhaar.slice(-4) : "1947",
      district: selectedDistrict !== "all" ? selectedDistrict : "Kozhikode",
      locality: selectedLocality !== "all" ? selectedLocality : "Azhiyur",
      role: loginRoleInput,
      roleBadge: "Verified Citizen",
      rationCard: "Priority BPL",
      avatarColor: "bg-emerald-700",
      loggedInAt: new Date().toISOString()
    };
    setCurrentUser(userObj);
    try {
      localStorage.setItem("gramseva_user", JSON.stringify(userObj));
    } catch (e) {}
    setOtpSent(false);
    setOtpInput("");
    setLoginPhone("");
    setLoginAadhaar("");
    setLoginNameInput("");
    setLoginError("");
    setSuccessToast(`Logged in successfully as ${name}`);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("gramseva_user");
    } catch (e) {}
    setSuccessToast("Logged out successfully");
    setTimeout(() => setSuccessToast(""), 3500);
  };
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
        return "bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs";
      case "water":
        return "bg-sky-50 text-sky-700 border border-sky-200/80 shadow-2xs";
      case "agriculture":
        return "bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs";
      case "education":
        return "bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs";
      default:
        return "bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs";
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
      if (selectedLocality !== "all") {
        if (selectedLocality === "Azhiyur" || selectedLocality.toLowerCase().includes("azhiyur")) {
          const isAzhiyurPanchayat = service.panchayatName === "Azhiyur" || service.localityName === "Azhiyur" || AZHIYUR_SUB_LOCALITIES.some((sub) => sub.en === service.localityName);
          if (!isAzhiyurPanchayat) return false;
        } else if (service.localityName !== selectedLocality) {
          return false;
        }
      }
      if (isNearMeActive && getSimulatedDistance(service) > nearMeDistance) return false;
      return !normalizedSearchQuery || searchScore > 0;
    })
    .sort((a, b) => {
      if (normalizedSearchQuery && b.searchScore !== a.searchScore) return b.searchScore - a.searchScore;
      if (isNearMeActive || sortByProximity) return getSimulatedDistance(a.service) - getSimulatedDistance(b.service);
      return 0;
    })
    .map(({ service }) => service), [searchableServices, normalizedSearchQuery, selectedCategory, selectedDistrict, selectedLocality, isNearMeActive, nearMeDistance, sortByProximity]);
  const cleanTitle = (title) => {
    if (!title) return "";
    return title.replace(/\s*-\s*#[0-9]+$/g, "").replace(/\s*#\d+$/g, "").trim();
  };

  const groupedServicesByPlace = useMemo(() => {
    const placeMap = new Map();

    filteredServices.forEach((service) => {
      const placeName = service.localityName || service.districtName || "General";
      if (!placeMap.has(placeName)) {
        placeMap.set(placeName, {
          localityName: placeName,
          districtName: service.districtName,
          services: [],
          institutionsMap: new Map(),
        });
      }

      const placeObj = placeMap.get(placeName);
      placeObj.services.push(service);

      const enTitle = service.translations?.en?.title || "";
      const baseTitle = cleanTitle(enTitle);
      const instKey = `${service.categoryKey}::${baseTitle}`;

      if (!placeObj.institutionsMap.has(instKey)) {
        placeObj.institutionsMap.set(instKey, {
          id: `${placeName}::${instKey}`,
          categoryKey: service.categoryKey,
          baseTitleEn: baseTitle,
          localityName: placeName,
          districtName: service.districtName,
          primaryService: service,
          units: [],
        });
      }

      placeObj.institutionsMap.get(instKey).units.push(service);
    });

    return Array.from(placeMap.values()).map((p) => ({
      ...p,
      institutions: Array.from(p.institutionsMap.values()),
    }));
  }, [filteredServices]);

  const flatInstitutions = useMemo(() => {
    const instMap = new Map();
    filteredServices.forEach((service) => {
      const placeName = service.localityName || service.districtName || "General";
      const enTitle = service.translations?.en?.title || "";
      const baseTitle = cleanTitle(enTitle);
      const instKey = `${placeName}::${service.categoryKey}::${baseTitle}`;

      if (!instMap.has(instKey)) {
        instMap.set(instKey, {
          id: instKey,
          categoryKey: service.categoryKey,
          baseTitleEn: baseTitle,
          localityName: placeName,
          districtName: service.districtName,
          primaryService: service,
          units: [],
        });
      }
      instMap.get(instKey).units.push(service);
    });
    return Array.from(instMap.values());
  }, [filteredServices]);

  const visibleInstitutions = useMemo(() => {
    if (groupByPlace) return flatInstitutions;
    return flatInstitutions.slice(0, visibleCount);
  }, [groupByPlace, flatInstitutions, visibleCount]);

  const visibleServicesCount = useMemo(() => {
    return visibleInstitutions.reduce((acc, inst) => acc + inst.units.length, 0);
  }, [visibleInstitutions]);

  const hasMoreServices = !groupByPlace && flatInstitutions.length > visibleCount;
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
  return <div id="dir-app-root" data-theme={currentTheme} style={{ "--gram-bg": `url(${uiBackdrop})` }} className={`gram-root min-h-screen ${isHighContrast ? "bg-black high-contrast" : ""} text-slate-900 font-sans antialiased flex items-stretch justify-center transition-all duration-300 ${isLargeText ? "text-[110%]" : ""}`}>
      <a href="#service-results" className="skip-link">Skip to service results</a>
      <nav className="observatory-nav" aria-label="Primary navigation">
        <div className="brand-mark flex items-center gap-2">
          <img src={graamsevaLogo} alt="GramSeva Logo" className="h-8 w-auto object-contain" />
        </div>
        <div className="nav-links" role="tablist" aria-label="Directory sections">
          <button onClick={() => navigateToTab("services")} className={currentTab === "services" ? "active" : ""} role="tab" aria-selected={currentTab === "services"}>Directory</button>
          <button onClick={() => navigateToTab("map")} className={currentTab === "map" ? "active" : ""} role="tab" aria-selected={currentTab === "map"}>Map Grid</button>
          <button onClick={() => navigateToTab("suggest")} className={currentTab === "suggest" ? "active" : ""} role="tab" aria-selected={currentTab === "suggest"}>Contribute</button>
        </div>
        <button onClick={() => navigateToTab("profile")} className="follow-link flex items-center gap-1.5 cursor-pointer">
          {currentUser ? (
            <>
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentUser.name.split(' ')[0]}</span>
            </>
          ) : (
            <>
              <LogIn className="w-3.5 h-3.5" />
              <span>Profile & Login</span>
            </>
          )}
        </button>
      </nav>
      
      {
    /* Desktop context panel */
  }
      <div className="context-panel command-panel hidden 2xl:flex flex-col max-w-xs mr-6 border border-stone-200/80 p-6 rounded-[32px] space-y-6 shadow-sm animate-soft-rise">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-2xl shadow-md border border-emerald-200/80 shrink-0">
            <img src={graamsevaLogo} alt="GramSeva Logo" className="h-12 w-auto object-contain" />
          </div>
          <div>
            <p className="font-label text-[9px] text-signal-orange font-black uppercase tracking-[0.24em]">Civic OS</p>
            <h1 className="kinetic-title font-classical text-3xl font-bold tracking-tight text-emerald-950">GramSeva</h1>
            <p className="font-label text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Verified local directory</p>
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
            <span>Kozhikode & Azhiyur Panchayat data ready on launch</span>
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
      <div data-theme={currentTheme} className="directory-frame relative w-full max-w-[1600px] h-dvh min-h-[620px] bg-[#101214] lg:h-[calc(100vh-32px)] lg:my-4 lg:rounded-2xl lg:border lg:border-slate-300/70 lg:shadow-2xl flex flex-col overflow-hidden transition-all">
        
        {
    /* Dynamic Mobile Banner Header block */
  }
        <header className="gram-header app-header text-white p-2.5 sm:p-5 lg:p-6 pt-2 sm:pt-6 pb-2.5 sm:pb-5 shrink-0 flex flex-col gap-1 sm:gap-2 relative">
          


          {
    /* Panchayat Branding */
  }
          <div className="flex flex-row items-center justify-between gap-3 mt-0.5 sm:mt-1">
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <div className="bg-white p-1.5 sm:p-2 rounded-2xl shadow-md border border-emerald-200/80 shrink-0">
                <img src={graamsevaLogo} alt="GraamSeva Logo" className="h-9 sm:h-12 w-auto object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="header-title font-classical text-base sm:text-3xl lg:text-4xl font-black text-white tracking-tight truncate leading-tight drop-shadow-sm">
                  {selectedLocality === "all"
                    ? selectedDistrict === "all" ? "Kerala Service Directory" : `${selectedDistrict} Directory`
                    : selectedLocality === "Azhiyur" || selectedLocality.toLowerCase().includes("panchayat")
                      ? `${selectedLocality} Grama Panchayat`
                      : `${selectedLocality} (Azhiyur Panchayat)`}
                </h2>
              </div>
            </div>
            
            {
    /* Horizontal Scroll Wheel Language Selector */
  }
            <div className="shrink-0 max-w-[140px] sm:max-w-[320px]">
              <LanguageWheel compact={true} />
            </div>
          </div>



          <div className="hero-wireframe hidden sm:block">
            <p>
              Verified civic records for <span>health</span>, water, schools, revenue offices, agriculture support, and emergency services.
            </p>
          </div>

          {
    /* Primary search & Location filter row */
  }
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 mt-1 sm:mt-2">
            <div className="relative flex-1 min-w-[220px]">
              <div className={`service-search bg-white flex items-center border rounded-xl shadow-sm ${isSearchFocused ? "is-focused" : ""} ${searchQuery !== settledSearchQuery ? "is-searching" : ""}`}>
                <Search className="w-4 h-4 text-slate-400 ml-2.5 sm:ml-3 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  aria-busy={searchQuery !== settledSearchQuery}
                  aria-label="Search services by name, category, place, contact, or language"
                  placeholder={t.searchPlaceholder || "Search services or speak..."}
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveRecentSearch(searchQuery);
                    }
                  }}
                  className="w-full text-slate-800 placeholder-slate-400 bg-transparent text-xs sm:text-sm py-2 sm:py-2.5 px-2 outline-none border-none leading-none font-semibold min-h-[38px] sm:min-h-[42px]"
                />

                {/* QOL #6: Voice Search Button */}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-1.5 mr-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    isListening
                      ? "bg-rose-500 text-white animate-pulse"
                      : "text-emerald-700 hover:bg-emerald-50 active:scale-95"
                  }`}
                  title={isListening ? "Listening... Speak now" : "Voice Search (Speak in Malayalam, Hindi, or English)"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {searchQuery ? (
                  <button onClick={() => setSearchQuery("")} className="search-clear" aria-label="Clear search">
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="search-shortcut hidden sm:inline" aria-hidden="true"><Keyboard className="w-3.5 h-3.5" /> /</span>
                )}
              </div>

              {/* QOL #5: Search Suggestions & Recent Search History Dropdown */}
              {isSearchFocused && (
                <div className="search-suggestions absolute top-full mt-2 left-0 right-0 z-40 bg-white text-slate-900 border border-stone-200 rounded-xl shadow-xl p-2.5">
                  {searchQuery.trim().length > 0 ? (
                    searchSuggestions.length > 0 ? (
                      <>
                        <div className="px-2 pb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">{ui.searchSuggestions}</div>
                        {searchSuggestions.map((item) => (
                          <button
                            key={item.id}
                            onMouseDown={() => {
                              setSearchQuery(item.label);
                              saveRecentSearch(item.label);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 transition flex items-center justify-between gap-3 cursor-pointer"
                          >
                            <span className="text-xs font-bold truncate text-slate-900">{item.label}</span>
                            <span className="text-[10px] text-emerald-700 font-bold shrink-0">{item.helper}</span>
                          </button>
                        ))}
                      </>
                    ) : null
                  ) : (
                    recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between px-2 pb-1.5 border-b border-stone-100 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            <History className="w-3 h-3 text-emerald-600" /> Recent Searches
                          </span>
                          <button
                            onMouseDown={clearRecentSearches}
                            className="text-[9px] font-bold text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            Clear History
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {recentSearches.map((term, idx) => (
                            <button
                              key={idx}
                              onMouseDown={() => {
                                setSearchQuery(term);
                              }}
                              className="bg-stone-100 hover:bg-emerald-100 text-slate-800 hover:text-emerald-950 border border-stone-200 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>🔍 {term}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* District & Locality Selectors */}
            <div className="flex items-center gap-1.5 shrink-0 w-full md:w-auto overflow-x-auto scrollbar-none py-0.5">
              <div className="flex items-center gap-1 bg-white/10 hover:bg-white/15 border border-white/25 rounded-xl px-2.5 py-2 text-xs text-white transition shrink-0">
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    const dist = e.target.value;
                    setSelectedDistrict(dist);
                    if (dist === "Kozhikode") {
                      setSelectedLocality("Azhiyur");
                    } else if (dist === "all") {
                      setSelectedLocality("all");
                    } else {
                      const firstLoc = LOCALITIES_EN[dist]?.[0] || "all";
                      setSelectedLocality(firstLoc);
                    }
                  }}
                  className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer border-none py-0 pr-1 [&>option]:bg-slate-900 [&>option]:text-white"
                  aria-label="Select District"
                >
                  <option value="all">All Districts</option>
                  {KERALA_DISTRICTS.map((dist) => (
                    <option key={dist.en} value={dist.en}>
                      {dist[language] || dist.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 bg-white/10 hover:bg-white/15 border border-white/25 rounded-xl px-2.5 py-2 text-xs text-white transition shrink-0">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer border-none py-0 pr-1 [&>option]:bg-slate-900 [&>option]:text-white max-w-[170px] truncate"
                  aria-label="Select Locality or Panchayat"
                >
                  <option value="all">All Places in {selectedDistrict === "all" ? "Kerala (941 Panchayats)" : selectedDistrict}</option>
                  {selectedDistrict === "all" ? (
                    KERALA_DISTRICTS_LIST.flatMap((d) =>
                      (KERALA_PANCHAYATS_BY_DISTRICT[d.en] || []).map((p) => (
                        <option key={`${d.en}_${p.en}`} value={p.en}>
                          {p.en}{language === "ml" && p.ml ? ` (${p.ml})` : language === "hi" && p.hi ? ` (${p.hi})` : language === "te" && p.te ? ` (${p.te})` : ""} &middot; {d.en}
                        </option>
                      ))
                    )
                  ) : KERALA_PANCHAYATS_BY_DISTRICT[selectedDistrict] ? (
                    KERALA_PANCHAYATS_BY_DISTRICT[selectedDistrict].map((p) => (
                      <option key={p.en} value={p.en}>
                        {p.en}{language === "ml" && p.ml ? ` (${p.ml})` : language === "hi" && p.hi ? ` (${p.hi})` : language === "te" && p.te ? ` (${p.te})` : ""}
                      </option>
                    ))
                  ) : (
                    (LOCALITIES_EN[selectedDistrict] || []).map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* QOL #5: Popular Quick Topic Chips for Villagers */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1.5 pb-0.5 text-[11px] font-bold">
            <span className="text-[10px] uppercase font-black text-emerald-200/80 shrink-0">Popular:</span>
            {[
              { label: "🌾 Farmer Schemes", query: "Krishi Bhavan" },
              { label: "🪪 Income Cert", query: "Income Certificate" },
              { label: "⚡ KSEB Power", query: "KSEB" },
              { label: "💧 Water Supply", query: "Water Authority" },
              { label: "🏥 Health Center", query: "Health Center" },
              { label: "🚌 Bus Depot", query: "KSRTC" },
              { label: "🏫 Anganwadi", query: "Anganwadi" }
            ].map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchQuery(tag.query);
                  saveRecentSearch(tag.query);
                }}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-2.5 py-1 rounded-full shrink-0 transition cursor-pointer active:scale-95"
              >
                {tag.label}
              </button>
            ))}
          </div>

        </header>

        {
    /* View switcher container */
  }
        <div className={`app-content-shell flex-1 flex flex-col min-h-0 bg-white ${isUiPending ? "is-pending" : ""}`} aria-busy={isUiPending}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentTab}
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.985, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985, y: -8 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="tab-surface flex-1 flex flex-col min-h-0 relative"
            >
          
          {
    /* Tab Content 1: Services Directory List */
  }
          {currentTab === "services" && <>
              {
    /* Category Horizontal Filter Row */
  }
              <div className="category-strip flex items-center justify-between overflow-x-auto gap-2 px-3 sm:px-5 lg:px-6 py-1.5 border-b border-zinc-800/80 scrollbar-none shrink-0 select-none sticky top-0 z-20" role="toolbar" aria-label="Filter services by category">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 shrink-0 pr-1.5 border-r border-zinc-700/60 mr-0.5 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider">
                    <Filter className="w-3 h-3" />
                    <span className="hidden xs:inline">Category</span>
                  </div>
                  {categoryOptions.map((cat) => {
                    const isActive = selectedCategory === cat.key;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => chooseCategory(cat.key)}
                        aria-pressed={isActive}
                        aria-label={`Show ${cat.label} services`}
                        className={`category-pill ${isActive ? "is-active" : ""} flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition whitespace-nowrap border shrink-0 active:scale-95`}
                      >
                        {cat.icon}
                        <span className="font-label text-[11px] whitespace-nowrap">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pl-2 border-l border-zinc-300/80 dark:border-zinc-700/60 ml-auto">
                  <button
                    type="button"
                    onClick={() => setGroupByPlace((value) => !value)}
                    className={`rail-action flex items-center gap-1 shrink-0 ${groupByPlace ? "is-active bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : ""}`}
                    aria-pressed={groupByPlace}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Group by Place</span>
                  </button>
                  <button type="button" onClick={() => setSortByProximity((value) => !value)} className={`rail-action shrink-0 ${sortByProximity ? "is-active" : ""}`} aria-pressed={sortByProximity}>Nearest first</button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedDistrict("Kozhikode");
                      setSelectedLocality("Azhiyur");
                      setSortByProximity(false);
                    }}
                    className="rail-action shrink-0"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {
    /* Dynamic scrollable directory area */
  }
              <div id="service-results" className="service-observatory flex-1 overflow-y-auto px-5 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-24 scrollbar-none" tabIndex={-1}>
                {isUiPending ? (
                  <DirectorySkeleton />
                ) : (
                  <>
                    <div className="service-feed-heading flex justify-between items-end gap-4 px-1 mb-1">
                      <div>
                        <span className="service-feed-kicker">Directory results</span>
                        <h3>Services near {selectedLocality === "all" ? selectedDistrict : selectedLocality}</h3>
                      </div>
                      <span className="service-feed-count">Showing {visibleServicesCount} of {filteredServices.length}</span>
                    </div>

                    <AnimatePresence initial={false} mode="popLayout">
                      {filteredServices.length > 0 ? (
                        groupByPlace ? (
                          groupedServicesByPlace.map((group) => {
                            const isCollapsed = collapsedPlaces[group.localityName];
                            return (
                              <div key={group.localityName} className="place-group bg-emerald-950/5 border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 mb-4 shadow-2xs transition">
                                <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-200/60">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                                      <MapPin className="w-4 h-4 text-emerald-700" />
                                    </div>
                                    <div>
                                      <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                                        <span>{group.localityName}</span>
                                        <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                                          {group.services.length} {group.services.length === 1 ? "person / service" : "people / services"}
                                        </span>
                                      </h4>
                                      <p className="text-[10px] text-slate-500 font-medium">
                                        {group.districtName} District &middot; Kerala
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => togglePlaceCollapse(group.localityName)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1 text-xs font-semibold"
                                    aria-label={`Toggle ${group.localityName}`}
                                  >
                                    <span className="text-[10px] hidden sm:inline">{isCollapsed ? "Expand" : "Collapse"}</span>
                                    {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                  </button>
                                </div>

                                {!isCollapsed && (
                                  <div className="flex flex-col gap-3">
                                    {group.institutions.map((inst, index) => {
                                      const primary = inst.primaryService;
                                      const data = primary.translations[language] || primary.translations["en"] || Object.values(primary.translations)[0];
                                      const displayTitle = cleanTitle(data.title);
                                      const unitCount = inst.units.length;
                                      const isExpanded = expandedSubgroups[inst.id];

                                      const isVerifiedPulse = (() => {
                                        if (!primary.lastVerified) return false;
                                        try {
                                          const verifiedDate = new Date(primary.lastVerified);
                                          const diffTime = Math.abs((new Date()).getTime() - verifiedDate.getTime());
                                          const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
                                          return diffDays <= 30;
                                        } catch (e) {
                                          return false;
                                        }
                                      })();
                                      const verificationScore = getVerificationScore(primary, duplicateCounts);

                                      return (
                                        <motion.div
                                          key={inst.id}
                                          layout={shouldReduceMotion ? false : "position"}
                                          initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
                                          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                                          whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.008 }}
                                          whileTap={shouldReduceMotion ? undefined : { scale: 0.98, y: -1 }}
                                          transition={{ duration: shouldReduceMotion ? 0 : 0.25, delay: shouldReduceMotion ? 0 : Math.min(index * 0.012, 0.08), ease: [0.16, 1, 0.3, 1] }}
                                          className="service-card bg-white border border-stone-200/90 hover:border-emerald-500/60 p-4 sm:p-5 transition-all duration-300 flex flex-col relative rounded-xl shadow-2xs hover:shadow-xl cursor-pointer select-none active:shadow-xs"
                                        >
                                          {primary.isEmergency && <div className="absolute top-0 bottom-0 left-0 w-1 bg-rose-500 rounded-l-xl" />}

                                          <div className="flex flex-row gap-3 sm:gap-4 cursor-pointer" onClick={() => setSelectedDetailService(primary)}>
                                            <div className={`icon-tile w-12 h-12 lg:w-13 lg:h-13 flex items-center justify-center shrink-0 rounded-2xl ${getCategoryColor(primary.categoryKey)}`}>
                                              {getCustomizedIcon(primary)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                              <div className="service-card-head flex flex-col min-[520px]:flex-row min-[520px]:items-start min-[520px]:justify-between gap-2">
                                                <div>
                                                  <h3 className="service-card-title text-[15px] sm:text-base font-extrabold text-slate-900 leading-snug pr-1">
                                                    {displayTitle}
                                                  </h3>
                                                  {unitCount > 1 && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-1">
                                                      🏥 {unitCount} registered units in {inst.localityName}
                                                    </span>
                                                  )}
                                                </div>

                                                {isVerifiedPulse ? (
                                                  <span className="service-status shrink-0 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 flex items-center gap-1 rounded-md">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                    <span>Verified</span>
                                                  </span>
                                                ) : (
                                                  <span className="service-status shrink-0 text-[9px] font-black tracking-tight text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                                    May be outdated
                                                  </span>
                                                )}
                                              </div>

                                              <p className="font-label text-[10px] text-emerald-800 font-bold tracking-wide uppercase mt-1">
                                                {data.category} &middot; {inst.localityName}
                                              </p>

                                              <p className="service-card-description text-xs lg:text-[11px] text-slate-600 leading-relaxed mt-2">
                                                {data.description}
                                              </p>

                                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-semibold mt-2.5">
                                                <div className="flex items-center gap-1">
                                                  <MapPin className="w-3 h-3 text-emerald-600" />
                                                  <span>{getSimulatedDistance(primary)} km &middot; {primary.localityName}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <Clock className="w-3 h-3 text-slate-400" />
                                                  <span className="service-hours">{data.hours}</span>
                                                </div>
                                              </div>

                                              <div className="data-quality-row mt-2" aria-label={`Verification score ${verificationScore} percent`}>
                                                <span>{verificationScore}% verified</span>
                                                <span>{getConfidenceLevel(verificationScore)}</span>
                                                {unitCount > 1 && <span className="text-emerald-700 font-extrabold">{unitCount} posts / units grouped</span>}
                                              </div>
                                            </div>
                                          </div>

                                          <RequiredDocumentsAccordion service={primary} language={language} className="mt-3" />

                                          {unitCount > 1 && (
                                            <div className="mt-3 pt-3 border-t border-stone-200">
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  toggleSubgroup(inst.id);
                                                }}
                                                className="w-full text-left py-1.5 px-3 bg-stone-50 hover:bg-stone-100 text-emerald-800 font-bold text-xs rounded-lg transition flex items-center justify-between cursor-pointer border border-stone-200"
                                              >
                                                <span>{isExpanded ? "Hide registered sub-units" : `View all ${unitCount} registered units & contacts`}</span>
                                                {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-700" /> : <ChevronDown className="w-4 h-4 text-emerald-700" />}
                                              </button>

                                              {isExpanded && (
                                                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto pr-1">
                                                  {inst.units.map((u, uIdx) => {
                                                    const uData = u.translations[language] || u.translations["en"] || Object.values(u.translations)[0];
                                                    return (
                                                      <div
                                                        key={u.id}
                                                        onClick={() => setSelectedDetailService(u)}
                                                        className="p-2.5 bg-stone-50/80 rounded-lg border border-stone-200 hover:border-emerald-500/50 transition cursor-pointer flex items-center justify-between gap-2"
                                                      >
                                                        <div>
                                                          <span className="text-xs font-extrabold text-slate-900 block">{uData.title}</span>
                                                          <span className="text-[10px] text-slate-500 font-mono">ID: {u.id} &middot; {uData.hours}</span>
                                                        </div>
                                                        <button
                                                          type="button"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedDetailService(u);
                                                          }}
                                                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold rounded shadow-2xs transition shrink-0"
                                                        >
                                                          Contact &rarr;
                                                        </button>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </motion.div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="col-span-full flex flex-col gap-3.5">
                            {flatInstitutions.slice(0, visibleCount).map((inst, index) => {
                              const primary = inst.primaryService;
                              const data = primary.translations[language] || primary.translations["en"] || Object.values(primary.translations)[0];
                              const displayTitle = cleanTitle(data.title);
                              const unitCount = inst.units.length;
                              const isExpanded = expandedSubgroups[inst.id];

                              const isVerifiedPulse = (() => {
                                if (!primary.lastVerified) return false;
                                try {
                                  const verifiedDate = new Date(primary.lastVerified);
                                  const diffTime = Math.abs((new Date()).getTime() - verifiedDate.getTime());
                                  const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
                                  return diffDays <= 30;
                                } catch (e) {
                                  return false;
                                }
                              })();
                              const verificationScore = getVerificationScore(primary, duplicateCounts);

                              return (
                                <motion.div
                                  key={inst.id}
                                  layout={shouldReduceMotion ? false : "position"}
                                  initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
                                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                                  whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.008 }}
                                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98, y: -1 }}
                                  transition={{ duration: shouldReduceMotion ? 0 : 0.25, delay: shouldReduceMotion ? 0 : Math.min(index * 0.012, 0.08), ease: [0.16, 1, 0.3, 1] }}
                                  className="service-card bg-white border border-stone-200/90 hover:border-emerald-500/60 p-4 sm:p-5 transition-all duration-300 flex flex-col relative rounded-xl shadow-2xs hover:shadow-xl cursor-pointer select-none active:shadow-xs"
                                >
                                  {primary.isEmergency && <div className="absolute top-0 bottom-0 left-0 w-1 bg-rose-500 rounded-l-xl" />}

                                  <div className="flex flex-row gap-3 sm:gap-4 cursor-pointer" onClick={() => setSelectedDetailService(primary)}>
                                    <div className={`icon-tile w-12 h-12 lg:w-13 lg:h-13 flex items-center justify-center shrink-0 rounded-2xl ${getCategoryColor(primary.categoryKey)}`}>
                                      {getCustomizedIcon(primary)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="service-card-head flex flex-col min-[520px]:flex-row min-[520px]:items-start min-[520px]:justify-between gap-2">
                                        <div>
                                          <h3 className="service-card-title text-[15px] sm:text-base font-extrabold text-slate-900 leading-snug pr-1">
                                            {displayTitle}
                                          </h3>
                                          {unitCount > 1 && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-1">
                                              🏥 {unitCount} registered units in {inst.localityName}
                                            </span>
                                          )}
                                        </div>

                                        {isVerifiedPulse ? (
                                          <span className="service-status shrink-0 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 flex items-center gap-1 rounded-md">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                            <span>Verified</span>
                                          </span>
                                        ) : (
                                          <span className="service-status shrink-0 text-[9px] font-black tracking-tight text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                            May be outdated
                                          </span>
                                        )}
                                      </div>

                                      <p className="font-label text-[10px] text-emerald-800 font-bold tracking-wide uppercase mt-1">
                                        {data.category} &middot; {inst.localityName}
                                      </p>

                                      <p className="service-card-description text-xs lg:text-[11px] text-slate-600 leading-relaxed mt-2">
                                        {data.description}
                                      </p>

                                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-semibold mt-2.5">
                                        <div className="flex items-center gap-1">
                                          <MapPin className="w-3 h-3 text-emerald-600" />
                                          <span>{getSimulatedDistance(primary)} km &middot; {primary.localityName}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Clock className="w-3 h-3 text-slate-400" />
                                          <span className="service-hours">{data.hours}</span>
                                        </div>
                                      </div>

                                      <div className="data-quality-row mt-2" aria-label={`Verification score ${verificationScore} percent`}>
                                        <span>{verificationScore}% verified</span>
                                        <span>{getConfidenceLevel(verificationScore)}</span>
                                        {unitCount > 1 && <span className="text-emerald-700 font-extrabold">{unitCount} posts / units grouped</span>}
                                      </div>
                                    </div>
                                  </div>

                                  <RequiredDocumentsAccordion service={primary} language={language} className="mt-3" />

                                  {unitCount > 1 && (
                                    <div className="mt-3 pt-3 border-t border-stone-200">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleSubgroup(inst.id);
                                        }}
                                        className="w-full text-left py-1.5 px-3 bg-stone-50 hover:bg-stone-100 text-emerald-800 font-bold text-xs rounded-lg transition flex items-center justify-between cursor-pointer border border-stone-200"
                                      >
                                        <span>{isExpanded ? "Hide registered sub-units" : `View all ${unitCount} registered units & contacts`}</span>
                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-700" /> : <ChevronDown className="w-4 h-4 text-emerald-700" />}
                                      </button>

                                      {isExpanded && (
                                        <div className="mt-2 space-y-2 max-h-60 overflow-y-auto pr-1">
                                          {inst.units.map((u, uIdx) => {
                                            const uData = u.translations[language] || u.translations["en"] || Object.values(u.translations)[0];
                                            return (
                                              <div
                                                key={u.id}
                                                onClick={() => setSelectedDetailService(u)}
                                                className="p-2.5 bg-stone-50/80 rounded-lg border border-stone-200 hover:border-emerald-500/50 transition cursor-pointer flex items-center justify-between gap-2"
                                              >
                                                <div>
                                                  <span className="text-xs font-extrabold text-slate-900 block">{uData.title}</span>
                                                  <span className="text-[10px] text-slate-500 font-mono">ID: {u.id} &middot; {uData.hours}</span>
                                                </div>
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedDetailService(u);
                                                  }}
                                                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold rounded shadow-2xs transition shrink-0"
                                                >
                                                  Contact &rarr;
                                                </button>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        )
                      ) : (
                        <div className="text-center py-12 px-4 bg-white border border-stone-200 rounded-2xl col-span-full shadow-2xs">
                          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-600 text-xs font-bold">{t.noServicesFound || "No services found"}</p>
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setSelectedCategory("all");
                              setSelectedDistrict("Kozhikode");
                              setSelectedLocality("Azhiyur");
                            }}
                            className="mt-3 text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest hover:underline"
                          >
                            Reset Local Filters
                          </button>
                        </div>
                      )}
                    </AnimatePresence>

                {hasMoreServices && (
                  <div className="pt-4 pb-6 text-center col-span-full w-full max-w-md mx-auto">
                    <button
                      onClick={() => setVisibleCount((p) => p + 12)}
                      className="w-full py-3 bg-white border border-stone-200 hover:bg-stone-50 text-emerald-800 font-extrabold text-xs uppercase tracking-widest rounded-2xl transition shadow-2xs active:scale-98 cursor-pointer"
                    >
                      Show 12 more services
                    </button>
                    <p className="text-[10px] text-slate-500 font-semibold mt-2">
                      Showing {visibleServicesCount} of {filteredServices.length} services ({visibleInstitutions.length} of {flatInstitutions.length} locations)
                    </p>
                  </div>
                )}
                  </>
                )}
              </div>
            </>}

          {/* Tab Content: Certificate Dependency Resolver (AO* Graph Search) */}
          {currentTab === "resolver" && (
            <Suspense fallback={<DirectorySkeleton />}>
              <CertificateResolver
                language={language}
                selectedDistrict={selectedDistrict === "all" ? "Kozhikode" : selectedDistrict}
                selectedLocality={selectedLocality === "all" ? "Azhiyur" : selectedLocality}
                onSelectPanchayat={(dist, panch) => {
                  setSelectedDistrict(dist);
                  setSelectedLocality(panch);
                }}
              />
            </Suspense>
          )}

          {
    /* Tab Content 2: Full interactive vector map */
  }
          {currentTab === "map" && <Suspense fallback={<MapSkeleton />}>
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
          {currentTab === "suggest" && <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 md:pt-6 pb-24 scrollbar-none bg-white text-slate-900">
              <div className="border-b border-stone-200 pb-3 max-w-5xl mx-auto">
                <h3 className="font-classical text-lg font-black text-slate-900 tracking-wide flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  <span>{t.addServiceTitle || "Suggest Service"}</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Contribute details about essential community assets. Your submissions are cached instantly.
                </p>
              </div>

              <form onSubmit={handleAddService} className="max-w-5xl mx-auto mt-4 grid gap-3.5 text-xs md:grid-cols-2">
                
                <div className="md:col-span-2">
                  <label htmlFor="suggest-service-title" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Service Title *
                  </label>
                  <input
    id="suggest-service-title"
    type="text"
    required
    placeholder="e.g. Primary Health Centre Subcenter"
    value={newTitle}
    onChange={(e) => setNewTitle(e.target.value)}
    className="w-full bg-stone-50 border border-stone-300 text-slate-900 placeholder-slate-400 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:col-span-2">
                  <div>
                    <label htmlFor="suggest-service-category" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
    id="suggest-service-category"
    value={newCategory}
    onChange={(e) => setNewCategory(e.target.value)}
    className="w-full bg-stone-50 border border-stone-300 text-slate-900 rounded-xl px-2 py-2 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
  >
                      <option value="health">{t.health || "Health"}</option>
                      <option value="water">{t.water || "Water"}</option>
                      <option value="agriculture">{t.agriculture || "Agriculture"}</option>
                      <option value="education">{t.education || "Education"}</option>
                      <option value="government">{t.government || "Government"}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="suggest-service-phone" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
    id="suggest-service-phone"
    type="tel"
    required
    placeholder="+91 XXXXX XXXXX"
    value={newPhone}
    onChange={(e) => setNewPhone(e.target.value)}
    className="w-full bg-stone-50 border border-stone-300 text-slate-900 placeholder-slate-400 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
  />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="suggest-service-description" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Description & Service details *
                  </label>
                  <textarea
    id="suggest-service-description"
    required
    rows={2.5}
    placeholder="Describe what help, documents, or aids are provided here..."
    value={newDesc}
    onChange={(e) => setNewDesc(e.target.value)}
    className="w-full bg-stone-50 border border-stone-300 text-slate-900 placeholder-slate-400 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none leading-relaxed transition"
  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:col-span-2">
                  <div>
                    <label htmlFor="suggest-service-hours" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Operating Hours
                    </label>
                    <input
    id="suggest-service-hours"
    type="text"
    placeholder="e.g. 9:00 AM - 4:00 PM"
    value={newHours}
    onChange={(e) => setNewHours(e.target.value)}
    className="w-full bg-stone-50 border border-stone-300 text-slate-900 placeholder-slate-400 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
  />
                  </div>
                  <div>
                    <label htmlFor="suggest-service-contact" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Contact Name
                    </label>
                    <input
    id="suggest-service-contact"
    type="text"
    placeholder="e.g. Sister Lakshmi"
    value={newContact}
    onChange={(e) => setNewContact(e.target.value)}
    className="w-full bg-stone-50 border border-stone-300 text-slate-900 placeholder-slate-400 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
  />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:col-span-2">
                  <div>
                    <label htmlFor="suggest-service-district" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
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
    className="w-full bg-stone-50 border border-stone-300 text-slate-900 rounded-xl px-2 py-2 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
  >
                      {KERALA_DISTRICTS.map((d) => <option key={d.en} value={d.en}>{d.en}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="suggest-service-locality" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Locality
                    </label>
                    <select
    id="suggest-service-locality"
    value={newLocality}
    onChange={(e) => setNewLocality(e.target.value)}
    className="w-full bg-stone-50 border border-stone-300 text-slate-900 rounded-xl px-2 py-2 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
  >
                      {(LOCALITIES_EN[newDistrict] || []).map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="suggest-service-address" className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Landmark / Address
                  </label>
                  <input
    id="suggest-service-address"
    type="text"
    placeholder="e.g. Opposite Local Library block"
    value={newLocation}
    onChange={(e) => setNewLocation(e.target.value)}
    className="w-full bg-stone-50 border border-stone-300 text-slate-900 placeholder-slate-400 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
  />
                </div>

                <div className="flex items-center space-x-2 pt-1 md:col-span-2">
                  <input
    type="checkbox"
    id="mobile-em-chk"
    checked={isEmergencyCheck}
    onChange={(e) => setIsEmergencyCheck(e.target.checked)}
    className="w-4 h-4 bg-stone-100 border-stone-300 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
  />
                  <label htmlFor="mobile-em-chk" className="text-[10px] font-extrabold text-slate-700 select-none cursor-pointer uppercase tracking-wider">
                    Emergency 24/7 Service
                  </label>
                </div>

                <button
    type="submit"
    className="w-full md:max-w-sm bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl transition mt-3 shadow-md uppercase tracking-wider text-[11px] md:col-span-2 cursor-pointer"
  >
                  {t.submitBtn || "Submit to Local Directory"}
                </button>

              </form>
            </div>}

          {
    /* Tab Content 4: Profile / Diagnostic settings */
  }
          {currentTab === "profile" && <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 md:pt-6 pb-24 scrollbar-none bg-white text-slate-900">
              <div className="border-b border-stone-200 pb-3 max-w-5xl mx-auto flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-classical text-lg font-black text-slate-900 tracking-wide flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-700" />
                    <span>Citizen Profile & Directory Settings</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Manage your village account, saved document wallet, local location preferences, and offline data controls.
                  </p>
                </div>

                {currentUser && (
                  <span className="bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold px-2.5 py-1 rounded-full text-[10px] hidden sm:flex items-center gap-1.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    Logged In: {currentUser.name}
                  </span>
                )}
              </div>

              <div className="max-w-5xl mx-auto mt-4 space-y-6">

              {/* 1. CITIZEN ACCOUNT / LOGIN & LOGOUT SECTION */}
              {currentUser ? (
                /* LOGGED IN USER PROFILE CARD WITH LOGOUT BUTTON */
                <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-sm border border-stone-200/90 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-14 h-14 rounded-2xl ${currentUser.avatarColor || "bg-emerald-700"} border-2 border-stone-200 flex items-center justify-center font-black text-2xl text-white shadow-xs shrink-0`}>
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-classical text-lg font-black text-slate-900 tracking-wide">{currentUser.name}</h4>
                          <span className="bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            {currentUser.roleBadge || "Verified Citizen"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>📱 {currentUser.phone}</span>
                          <span>•</span>
                          <span>📍 {currentUser.locality}, {currentUser.district}</span>
                        </p>
                      </div>
                    </div>

                    {/* LOGOUT BUTTON IN PROFILE */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer active:scale-95 shrink-0 self-end sm:self-auto shadow-2xs"
                      title="Log out of GramSeva"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Log Out</span>
                    </button>
                  </div>

                  {/* User Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
                    <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Aadhaar e-KYC</span>
                      <span className="font-extrabold text-slate-900 text-[11px] flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        XXXX {currentUser.aadhaarLast4 || "8912"}
                      </span>
                    </div>
                    <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Ration Card</span>
                      <span className="font-extrabold text-slate-900 text-[11px] mt-0.5 block truncate">{currentUser.rationCard || "Priority BPL"}</span>
                    </div>
                    <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Designation</span>
                      <span className="font-extrabold text-slate-900 text-[11px] mt-0.5 block truncate">{currentUser.role || "Resident"}</span>
                    </div>
                    <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Session</span>
                      <span className="font-extrabold text-emerald-700 text-[11px] mt-0.5 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Verified & Saved
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* LOGGED OUT LOGIN & REGISTRATION CARD - WHITE BACKGROUND */
                <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-sm border border-stone-200">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                        <LogIn className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-classical text-base font-black text-slate-900 tracking-wide">
                          Citizen & Panchayat Login{language === "ml" ? " (പൗര ലോഗിൻ)" : language === "hi" ? " (नागरिक और पंचायत लॉगिन)" : language === "te" ? " (పౌరుల లాగిన్)" : ""}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Log in with your mobile number or Aadhaar card to track certificate applications and saved documents.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Demo One-Click Accounts */}
                  <div className="mb-4 bg-stone-50/80 border border-stone-200 rounded-xl p-3">
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 block mb-2">
                      ⚡ Instant One-Click Login (Select Demo Citizen Profile):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {DEMO_ACCOUNTS.map((acc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickDemoLogin(acc)}
                          className="text-left bg-white hover:bg-emerald-50/70 border border-stone-200 hover:border-emerald-400/80 rounded-lg p-2.5 transition cursor-pointer group active:scale-95 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-900 group-hover:text-emerald-900">{acc.name}</span>
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded uppercase">{acc.roleBadge}</span>
                          </div>
                          <span className="text-[9px] text-slate-500 block mt-0.5">{acc.locality}, {acc.district}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Form */}
                  <div className="bg-stone-50/90 border border-stone-200 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2 flex-wrap gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Or Log In With Custom Mobile / Aadhaar:</span>
                      <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded-lg text-[9px] font-bold">
                        <button
                          type="button"
                          onClick={() => { setLoginMethod("otp"); setOtpSent(false); }}
                          className={`px-2.5 py-1 rounded-md transition cursor-pointer ${loginMethod === "otp" ? "bg-emerald-700 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
                        >
                          Mobile OTP
                        </button>
                        <button
                          type="button"
                          onClick={() => { setLoginMethod("aadhaar"); setOtpSent(false); }}
                          className={`px-2.5 py-1 rounded-md transition cursor-pointer ${loginMethod === "aadhaar" ? "bg-emerald-700 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
                        >
                          Aadhaar e-KYC
                        </button>
                      </div>
                    </div>

                    {loginError && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 text-[10px] p-2 rounded-lg font-bold">
                        ⚠️ {loginError}
                      </div>
                    )}

                    {!otpSent ? (
                      <form onSubmit={handleSendOtp} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] text-slate-600 uppercase font-bold tracking-wider block mb-1">
                              Your Full Name
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Suresh Kumar"
                              value={loginNameInput}
                              onChange={(e) => setLoginNameInput(e.target.value)}
                              className="w-full bg-white border border-stone-300 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-emerald-600"
                            />
                          </div>
                          <div>
                            {loginMethod === "otp" ? (
                              <>
                                <label className="text-[9px] text-slate-600 uppercase font-bold tracking-wider block mb-1">
                                  10-Digit Mobile Number
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <span className="bg-stone-100 border border-stone-300 text-slate-700 text-xs px-2 py-1.5 rounded-lg font-mono">+91</span>
                                  <input
                                    type="tel"
                                    placeholder="94470 12345"
                                    value={loginPhone}
                                    onChange={(e) => setLoginPhone(e.target.value)}
                                    className="w-full bg-white border border-stone-300 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-emerald-600"
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <label className="text-[9px] text-slate-600 uppercase font-bold tracking-wider block mb-1">
                                  12-Digit Aadhaar Number
                                </label>
                                <input
                                  type="text"
                                  placeholder="1234 5678 9012"
                                  value={loginAadhaar}
                                  onChange={(e) => setLoginAadhaar(e.target.value)}
                                  className="w-full bg-white border border-stone-300 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-emerald-600"
                                />
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="submit"
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer active:scale-95 shadow-xs"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Send Demo OTP →</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyAndLogin} className="space-y-3 animate-fade-in">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-[10px] text-emerald-900 flex items-center justify-between">
                          <span>OTP sent to {loginMethod === "otp" ? `+91 ${loginPhone}` : `Aadhaar ending in ${loginAadhaar.slice(-4)}`}.</span>
                          <span className="font-mono bg-emerald-700 text-white px-1.5 py-0.5 rounded font-bold">Demo OTP: 1947</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <label className="text-[9px] text-slate-600 uppercase font-bold tracking-wider block mb-1">
                              Enter 4-Digit OTP Code
                            </label>
                            <input
                              type="text"
                              maxLength={4}
                              placeholder="1947"
                              value={otpInput}
                              onChange={(e) => setOtpInput(e.target.value)}
                              className="w-full bg-white border border-stone-300 focus:border-emerald-600 text-slate-900 font-mono text-center text-base tracking-[0.3em] font-black rounded-lg py-1.5 outline-none shadow-2xs"
                            />
                          </div>
                          <button
                            type="submit"
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer active:scale-95 mt-5 shadow-xs"
                          >
                            <LogIn className="w-4 h-4" />
                            <span>Verify & Log In</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* QOL #1: CITIZEN DOCUMENT WALLET & CERTIFICATE VAULT */}
              <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-emerald-200/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <FolderCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-classical text-base font-black text-slate-900 tracking-wide flex items-center gap-2">
                        <span>Digital Document Wallet & Certificates</span>
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                          {walletDocs.length} Saved
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Quick-access vault for ration cards, income certificates, land deeds, and pension slips for village applications.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Wallet Docs Grid */}
                {walletDocs.length === 0 ? (
                  <div className="bg-white/80 border border-dashed border-stone-300 rounded-xl p-4 text-center">
                    <QrCode className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-slate-700">Your Document Wallet is Empty</p>
                    <p className="text-[10px] text-slate-500 max-w-sm mx-auto mt-0.5">
                      Save required documents directly from any service or certificate resolver tool to access them instantly during office visits.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                    {walletDocs.map((doc, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-stone-200 rounded-xl p-3 flex items-center justify-between gap-2 shadow-2xs hover:border-emerald-500 transition"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <BookmarkCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs font-extrabold text-slate-900 truncate block">{doc}</span>
                            <span className="text-[9px] text-emerald-700 font-bold block">Verified for Panchayat</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
                            title="Print / Export Document Copy"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleWalletDoc(doc)}
                            className="text-[10px] font-extrabold text-rose-600 hover:text-rose-800 px-1.5 py-0.5 rounded hover:bg-rose-50 transition"
                            title="Remove from wallet"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. DIRECTORY SETTINGS BLOCK */}
              <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-4 shadow-2xs">
                
                {
    /* Simulated Offline Switch */
  }
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black text-slate-900 block uppercase tracking-wider">Network Status</span>
                    <span className="text-[9px] text-slate-500 block">Use locally saved directory data</span>
                  </div>
                  <button
    type="button"
    onClick={() => setIsOfflineMode(!isOfflineMode)}
    aria-label="Use locally saved directory data"
    aria-pressed={isOfflineMode}
    className={`p-2 rounded-xl transition cursor-pointer ${isOfflineMode ? "bg-amber-100 border border-amber-300 text-amber-800" : "bg-emerald-100 border border-emerald-300 text-emerald-800"}`}
  >
                    {isOfflineMode ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
                  </button>
                </div>

                {
    /* District and Locality Selection Hub */
  }
                <div className="pt-3 border-t border-stone-200 space-y-3">
                  <span className="text-[10px] font-black text-slate-500 block uppercase tracking-wider">Location Config</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="profile-district" className="text-[9px] text-slate-600 font-bold uppercase tracking-wider block mb-1">District</label>
                      <select
    id="profile-district"
    value={selectedDistrict}
    onChange={(e) => {
      setSelectedDistrict(e.target.value);
      const locals = LOCALITIES_EN[e.target.value] || [];
      setSelectedLocality(locals[0] || "all");
    }}
    className="w-full bg-white border border-stone-300 text-slate-900 rounded-lg p-1.5 text-[10px] outline-none focus:border-emerald-600 transition"
  >
                        <option value="all">All Districts</option>
                        {KERALA_DISTRICTS.map((d) => <option key={d.en} value={d.en}>{d.en}</option>)}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="profile-locality" className="text-[9px] text-slate-600 font-bold uppercase tracking-wider block mb-1">Locality</label>
                      <select
    id="profile-locality"
    value={selectedLocality}
    onChange={(e) => setSelectedLocality(e.target.value)}
    className="w-full bg-white border border-stone-300 text-slate-900 rounded-lg p-1.5 text-[10px] outline-none focus:border-emerald-600 transition"
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
                <div className="pt-3 border-t border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-black text-slate-900 block uppercase tracking-wider">Nearby Services</span>
                      <span className="text-[9px] text-slate-500 block">Sort and filter by approximate distance</span>
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
    className={`p-2 rounded-xl transition cursor-pointer ${isNearMeActive ? "bg-amber-100 border border-amber-300 text-amber-800" : "bg-stone-100 border border-stone-300 text-slate-600"}`}
  >
                      <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: isNearMeActive ? "8s" : "0s" }} />
                    </button>
                  </div>

                  {isNearMeActive && <div className="space-y-2 pt-1 animate-fade-in">
                      <div className="flex justify-between items-center text-[9px] text-slate-600 font-bold uppercase">
                        <span>Search Radius</span>
                        <span className="text-amber-700 font-black">{nearMeDistance} km</span>
                      </div>
                      <input
    type="range"
    min="5"
    max="200"
    step="5"
    value={nearMeDistance}
    onChange={(e) => setNearMeDistance(Number(e.target.value))}
    className="w-full accent-emerald-600 h-1 bg-stone-200 rounded cursor-pointer"
  />
                    </div>}
                </div>

              </div>

              <div className="space-y-4">
                {
    /* Cache status report */
  }
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-[11px] text-slate-600 space-y-2 shadow-2xs">
                  <span className="font-black text-slate-900 block uppercase tracking-wider">Local Data Status</span>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span>Directory records:</span>
                    <span className="text-emerald-700 font-bold">{services.length.toLocaleString("en-IN")} services</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span>Saved in browser:</span>
                    <span className="text-emerald-700 font-bold">ACTIVE</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span>Update mode:</span>
                    <span className="text-slate-500">Manual review</span>
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-[11px] text-slate-600 space-y-3 shadow-2xs">
                  <span className="font-black text-slate-900 block uppercase tracking-wider">{ui.accessibility}</span>
                  <button
    type="button"
    onClick={() => setIsLargeText(!isLargeText)}
    aria-pressed={isLargeText}
    className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 transition cursor-pointer ${isLargeText ? "bg-emerald-100 border-emerald-300 text-emerald-900 font-bold" : "bg-white border-stone-300 text-slate-700"}`}
  >
                    <span className="flex items-center gap-2 font-bold"><Type className="w-4 h-4" />{ui.largeText}</span>
                    <span>{isLargeText ? "On" : "Off"}</span>
                  </button>
                  <button
    type="button"
    onClick={() => setIsHighContrast(!isHighContrast)}
    aria-pressed={isHighContrast}
    className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 transition cursor-pointer ${isHighContrast ? "bg-emerald-100 border-emerald-300 text-emerald-900 font-bold" : "bg-white border-stone-300 text-slate-700"}`}
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
      setSelectedLocality("Azhiyur");
      setIsNearMeActive(false);
      setNearMeDistance(30);
      setSortByProximity(false);
      setIsOfflineMode(false);
      setIsLargeText(false);
      setIsHighContrast(false);
    }}
    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition rounded-xl text-slate-700 text-[10px] font-black uppercase tracking-widest cursor-pointer"
  >
                  Reset App State
                </button>
              </div>

              </div>

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
      className="absolute inset-x-0 bottom-0 max-h-[88%] md:inset-x-auto md:right-0 md:top-0 md:bottom-0 md:h-full md:w-[min(460px,42vw)] md:max-h-none bg-white border-t md:border-t-0 md:border-l border-stone-200 rounded-t-[28px] md:rounded-none shadow-2xl z-50 flex flex-col overflow-hidden text-slate-900 font-sans pb-safe"
    >
                  
                  {
      /* Pull Handle accent */
    }
                  <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto my-2.5 shrink-0 md:hidden" />

                  {
      /* Header Row */
    }
                  <div className="px-5 pt-0 md:pt-5 pb-3 border-b border-stone-200 flex justify-between items-start gap-2 shrink-0">
                    <div className="flex items-start space-x-3 pr-2 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getCategoryColor(selectedDetailService.categoryKey)}`}>
                        {getCustomizedIcon(selectedDetailService)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block leading-none mb-1">
                          {getCategoryName(selectedDetailService.categoryKey)}
                        </span>
                        <h4 id="service-detail-title" className="font-classical text-sm sm:text-base font-black text-slate-900 leading-tight">
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
      className="p-1.5 bg-stone-100 border border-stone-200 text-slate-500 hover:text-slate-900 rounded-lg transition"
    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {
      /* Quick Preview Language Swapper widget (Vernacular helper) */
    }
                  <div className="bg-stone-50 border-b border-stone-200 px-4 py-1.5 shrink-0 flex items-center justify-between gap-2 text-[9px] font-bold text-slate-600 select-none overflow-hidden">
                    <span className="font-label shrink-0">Vernacular Swapper:</span>
                    <div className="shrink-0 max-w-[280px]">
                      <LanguageWheel compact onSelect={(code) => setDetailPreviewLang(code)} />
                    </div>
                  </div>

                  {
      /* Scrollable details view content */
    }
                  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs leading-relaxed">
                    
                    {
      /* Primary specs row */
    }
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-3 bg-stone-50/80 border border-stone-200 p-3 rounded-2xl">
                      <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-0.5">Contact</span>
                        <span className="font-bold text-slate-900 block truncate">{detailData.contactName || "Local Volunteer"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-0.5">Hours</span>
                        <span className="font-bold text-slate-900 block truncate">{detailData.hours}</span>
                      </div>
                      <div className="sm:col-span-2 md:col-span-1 xl:col-span-2 pt-2 border-t border-stone-200">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-0.5">Location</span>
                        <p className="text-[10px] text-slate-700 leading-tight font-medium">{detailData.location}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-0.5">Verification score</span>
                        <span className="font-bold text-slate-900 block">{detailVerificationScore}% - {getConfidenceLevel(detailVerificationScore)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-0.5">Last checked by</span>
                        <span className="font-bold text-slate-900 block">{getLastCheckedBy(selectedDetailService)}</span>
                      </div>
                      {detailDuplicateCount > 1 && <div className="sm:col-span-2 md:col-span-1 xl:col-span-2 rounded-xl border border-amber-300 bg-amber-50 p-2 text-[10px] font-bold text-amber-900">
                        Possible duplicate found in this locality. Verify before publishing changes.
                      </div>}
                    </div>

                    {
      /* Description Text block */
    }
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Description Details</span>
                      <p className="text-slate-700 leading-relaxed font-medium">{detailData.description}</p>
                    </div>

                    <RequiredDocumentsAccordion service={selectedDetailService} language={activeDetailLang} defaultOpen={true} className="mt-2" />

                    {
      /* Direct Telephone Dialer Dial btn */
    }
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">{ui.actions}</span>
                      <div className="grid grid-cols-2 gap-2">
                        <a
      href={`tel:${selectedDetailService.phoneNumber}`}
      className="flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-black py-3 px-4 rounded-xl transition uppercase tracking-wider shadow-sm shrink-0 select-none active:scale-95"
    >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                        <a
      href={`https://wa.me/${selectedDetailService.phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(getServiceShareText(selectedDetailService))}`}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center space-x-2 bg-stone-100 border border-stone-200 hover:bg-stone-200 text-slate-800 text-[11px] font-black py-3 px-4 rounded-xl transition uppercase tracking-wider"
    >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{ui.whatsapp}</span>
                        </a>
                        <button
      onClick={() => copyText(selectedDetailService.phoneNumber, "Phone number copied")}
      className="flex items-center justify-center space-x-2 bg-stone-100 border border-stone-200 hover:bg-stone-200 text-slate-800 text-[11px] font-black py-3 px-4 rounded-xl transition uppercase tracking-wider"
    >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{ui.copyPhone}</span>
                        </button>
                        <button
      onClick={() => copyText(getServiceShareText(selectedDetailService), "Service details copied")}
      className="flex items-center justify-center space-x-2 bg-stone-100 border border-stone-200 hover:bg-stone-200 text-slate-800 text-[11px] font-black py-3 px-4 rounded-xl transition uppercase tracking-wider"
    >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{ui.copyDetails}</span>
                        </button>
                        <button
      onClick={() => shareService(selectedDetailService)}
      className="flex items-center justify-center space-x-2 bg-stone-100 border border-stone-200 hover:bg-stone-200 text-slate-800 text-[11px] font-black py-3 px-4 rounded-xl transition uppercase tracking-wider"
    >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{ui.share}</span>
                        </button>
                      </div>
                      <button
      onClick={() => setReportService(selectedDetailService)}
      className="flex items-center justify-center space-x-2 w-full bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 text-[11px] font-black py-2.5 px-4 rounded-xl transition uppercase tracking-wider"
    >
                        <Flag className="w-3.5 h-3.5" />
                        <span>{ui.reportWrongInfo}</span>
                      </button>
                    </div>

                    <div className="bg-stone-50/80 border border-stone-200 p-3 rounded-2xl space-y-2">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <ListChecks className="w-3.5 h-3.5 text-emerald-600" />
                        {ui.documentChecklist}
                      </span>
                      <div className="space-y-1.5">
                        {getDocumentChecklist(selectedDetailService).map((item) => <label key={item} className="flex items-start gap-2 text-[10.5px] text-slate-700 leading-snug">
                            <input type="checkbox" className="mt-0.5 accent-emerald-600" />
                            <span>{item}</span>
                          </label>)}
                      </div>
                    </div>

                    {
      /* Static Verification Timeline */
    }
                    <div className="space-y-2 pt-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Verification Timeline</span>
                      <div className="border-l border-stone-200 pl-3 ml-1.5 space-y-3.5">
                        {historyLogs.slice(0, 2).map((log, idx) => <div key={idx} className="relative">
                            <span className="absolute -left-[15.5px] top-1 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
                            <p className="text-[10.5px] text-slate-600 font-medium leading-normal">{log}</p>
                          </div>)}
                      </div>
                    </div>

                    {
      /* Community Guidelines Notes */
    }
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl space-y-1 mt-1 select-none">
                      <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider block">Community Guidelines</span>
                      <p className="text-[10px] text-amber-900 leading-normal font-medium">{guidelines}</p>
                    </div>

                  </div>

                </motion.div>
              </>;
  })()}
        </AnimatePresence>

        <AnimatePresence>
          {reportService && (
            <div
              className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 backdrop-blur-xs p-4 flex justify-center items-center min-h-screen my-0 cursor-pointer"
              onClick={() => setReportService(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="report-dialog-title"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md my-auto bg-white border border-stone-200 rounded-2xl shadow-2xl p-4 text-slate-900 cursor-default shrink-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 id="report-dialog-title" className="font-classical text-lg font-black text-slate-900">{ui.reportTitle}</h3>
                    <p className="text-xs text-slate-500 mt-1">{ui.reportHint}</p>
                  </div>
                  <button type="button" aria-label="Close report dialog" onClick={() => setReportService(null)} className="p-1.5 bg-stone-100 border border-stone-200 rounded-lg text-slate-500 hover:text-slate-900 transition cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-3 rounded-xl bg-stone-50 border border-stone-200 p-3 text-xs text-slate-800">
                  {reportService.translations[language]?.title || reportService.translations.en.title}
                </div>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder={ui.reportPlaceholder}
                  className="mt-3 w-full min-h-[110px] bg-white border border-stone-200 text-slate-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 resize-none"
                />
                <button
                  onClick={submitReport}
                  disabled={!reportText.trim()}
                  className="mt-3 w-full bg-emerald-700 disabled:bg-stone-200 disabled:text-slate-400 hover:bg-emerald-800 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  {ui.submitReport}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {
    /* Global Floating Toast for successful directory additions */
  }
        {successToast && <div role="status" aria-live="polite" className="absolute top-20 inset-x-6 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-lg text-center text-[10px] font-extrabold uppercase tracking-widest animate-bounce">
            {successToast}
          </div>}

        {/* Floating Action Button for Service Dashboard View Toggle (List vs Leaflet Map) */}
        {(currentTab === "services" || currentTab === "map") && (
          <motion.button
            type="button"
            initial={shouldReduceMotion ? false : { scale: 0.8, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 10 }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.05, y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
            onClick={() => navigateToTab(currentTab === "services" ? "map" : "services")}
            aria-label={currentTab === "services" ? "Switch to map view" : "Switch to list view"}
            className="fixed sm:absolute bottom-16 sm:bottom-18 right-4 sm:right-6 z-40 bg-emerald-800 hover:bg-emerald-900 text-white font-black px-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl border border-emerald-600/50 flex items-center gap-2 text-xs uppercase tracking-wider backdrop-blur-md cursor-pointer transition-colors active:scale-95"
          >
            {currentTab === "services" ? (
              <>
                <MapIcon className="w-4 h-4 text-emerald-300" />
                <span>Map View</span>
              </>
            ) : (
              <>
                <List className="w-4 h-4 text-emerald-300" />
                <span>List View</span>
              </>
            )}
          </motion.button>
        )}

        {
    /* Static virtual bottom nav tab row (matching screenshots) */
  }
        <div className="bottom-dock app-dock absolute bottom-0 inset-x-0 border-t border-stone-200 flex items-center justify-around z-40 px-1 sm:px-2 select-none pb-safe bg-white/95 backdrop-blur-md" role="tablist" aria-label="Main app tabs">
          {[
    { id: "services", label: ui.services, icon: <Building2 className="w-5 h-5" /> },
    { id: "resolver", label: ui.resolver || "Resolver", icon: <FileCheck2 className="w-5 h-5" /> },
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
      className={`dock-button ${isActive ? "is-active" : ""} relative flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition cursor-pointer select-none active:scale-95 ${isActive ? "text-emerald-700 font-bold" : "text-slate-500 hover:text-slate-800"}`}
    >
                {isActive && (
                  <motion.div
                    layoutId="activeDockTab"
                    className="absolute top-0 w-8 h-0.5 bg-emerald-600 rounded-full shadow-[0_0_8px_rgba(5,150,105,0.4)] lg:hidden"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {tab.icon}
                <span className="font-label text-[8px] sm:text-[9px] font-extrabold tracking-wider uppercase leading-none">{tab.label}</span>
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
