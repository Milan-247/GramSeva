import { lazy, Suspense, useState, useEffect, useRef, useMemo, useTransition, useCallback, useDeferredValue } from "react";
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
  FolderCheck,
  ShieldAlert
} from "lucide-react";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import uiBackdrop from "./assets/gramseva-bg.svg";
import graamsevaLogo from "./assets/graamseva-logo.svg";
import {
  INITIAL_SERVICES,
  filterServiceObservatoryDataByState,
  KERALA_DISTRICTS,
  AZHIYUR_SUB_LOCALITIES,
  LOCALITIES_EN,
  TAMILNADU_DISTRICTS_LIST,
  TAMILNADU_PANCHAYATS_BY_DISTRICT,
  ANDHRAPRADESH_DISTRICTS_LIST,
  ANDHRAPRADESH_PANCHAYATS_BY_DISTRICT
} from "./data/services";
import { buildPanchayatServices } from "./data/stateServiceGenerators.js";
import {
  KERALA_DISTRICTS_LIST,
  KERALA_PANCHAYATS_BY_DISTRICT
} from "./data/keralaPanchayatsData.js";
import {
  KARNATAKA_DISTRICTS_LIST,
  KARNATAKA_PANCHAYATS_BY_DISTRICT
} from "./data/karnatakaPanchayatsData.js";

import { DirectorySkeleton, MapSkeleton } from "./components/Skeletons.jsx";
import LanguageWheel from "./components/LanguageWheel.jsx";
import RequiredDocumentsAccordion from "./components/RequiredDocumentsAccordion.jsx";
import FirebaseAuthModal from "./components/FirebaseAuthModal.jsx";
import WiseGatekeeperLogin from "./components/WiseGatekeeperLogin.jsx";
import { auth, db, signOut, onAuthStateChanged, doc, setDoc, getDoc } from "./lib/firebase";

import {
  CATEGORY_ALIASES,
  LOCALIZED_STRINGS,
  normalizeSearchText,
  levenshteinDistance,
  getDuplicateKey
} from "./data/searchDictionary.js";
import {
  STATE_WELCOME_GREETINGS,
  getStateWelcomeGreeting
} from "./data/regionalGreetings.js";
import {
  UI_TRANSLATIONS,
  getUiTranslations
} from "./data/uiStrings.js";

const ServiceMap = lazy(() => import("./components/ServiceMap.jsx"));
const CertificateResolver = lazy(() => import("./components/CertificateResolver.jsx"));
const GrievanceTracker = lazy(() => import("./components/GrievanceTracker.jsx"));
const DigitalDocumentWallet = lazy(() => import("./components/DigitalDocumentWallet.jsx"));
const UserProfileHub = lazy(() => import("./components/UserProfileHub.jsx"));
const ServiceContributionHub = lazy(() => import("./components/ServiceContributionHub.jsx"));
const AdminConsole = lazy(() => import("./components/AdminConsole.jsx"));
import AdminLoginModal from "./components/AdminLoginModal.jsx";

function DirectoryApp() {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const locStrings = LOCALIZED_STRINGS;
  const ls = locStrings[language] || locStrings.en;
  const ui = getUiTranslations(language);
  const [currentTab, setCurrentTab] = useState("services");
  const currentTheme = "civic-light";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "civic-light");
  }, []);

  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Hidden Panchayat Officer / Admin State
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem("gramseva_admin_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // Hidden Admin Keyboard Shortcut: Ctrl+Shift+A or Cmd+Shift+A or Alt+A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) ||
        (e.altKey && (e.key === "A" || e.key === "a"))
      ) {
        e.preventDefault();
        setShowAdminLoginModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hidden Admin URL Hash trigger: #admin or #officer
  useEffect(() => {
    if (typeof window !== "undefined" && (window.location.hash === "#admin" || window.location.hash === "#officer")) {
      setShowAdminLoginModal(true);
    }
  }, []);

  // Secret Triple-Click on Header Title / Brand to open Officer Gateway
  const headerClicksRef = useRef({ count: 0, timer: null });
  const handleSecretHeaderClick = () => {
    headerClicksRef.current.count += 1;
    if (headerClicksRef.current.count === 1) {
      headerClicksRef.current.timer = setTimeout(() => {
        headerClicksRef.current.count = 0;
      }, 1600);
    } else if (headerClicksRef.current.count >= 3) {
      clearTimeout(headerClicksRef.current.timer);
      headerClicksRef.current.count = 0;
      setShowAdminLoginModal(true);
    }
  };

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

  // QOL #1: Saved Citizen Document Wallet State
  const [walletDocs, setWalletDocs] = useState(() => {
    try {
      const saved = localStorage.getItem("gramseva_held_docs");
      return saved ? JSON.parse(saved) : ["aadhaar", "ration_card", "income_cert"];
    } catch (e) {
      return ["aadhaar", "ration_card"];
    }
  });

  const handleSyncHeldDocs = useCallback((heldList) => {
    setWalletDocs(heldList);
  }, []);

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
  const [selectedState, setSelectedState] = useState(() => {
    try {
      return localStorage.getItem("gramseva_state") || "kerala";
    } catch (e) {
      return "kerala";
    }
  });
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
  const [visiblePlacesCount, setVisiblePlacesCount] = useState(8);
  const [reportService, setReportService] = useState(null);
  const [reportText, setReportText] = useState("");
  const [isLargeText, setIsLargeText] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isUiPending, startUiTransition] = useTransition();

  // User Authentication & Citizen Profile state (Firebase Auth + Firestore)
  const [currentUser, setCurrentUser] = useState(null);
  const [showStartLoginModal, setShowStartLoginModal] = useState(false);
  const [isGuestAllowed, setIsGuestAllowed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            const userObj = {
              uid: fbUser.uid,
              email: fbUser.email,
              name: data.name || fbUser.displayName || "Citizen",
              phone: data.phone || fbUser.phoneNumber || "+91 98470 00000",
              district: data.district || "Kozhikode",
              locality: data.locality || "Azhiyur",
              role: data.role || "Resident / Citizen",
              roleBadge: data.roleBadge || (data.role?.includes("Official") ? "Official" : "Verified Citizen"),
              rationCard: data.rationCard || "Priority BPL",
              avatarColor: data.avatarColor || "bg-emerald-700",
              loggedInAt: new Date().toISOString()
            };
            setCurrentUser(userObj);
            try { localStorage.setItem("gramseva_user", JSON.stringify(userObj)); } catch (e) {}
          } else {
            const newProfile = {
              uid: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split("@")[0] || "Citizen",
              email: fbUser.email || "",
              phone: fbUser.phoneNumber || "+91 98470 00000",
              district: selectedDistrict !== "all" ? selectedDistrict : "Kozhikode",
              locality: selectedLocality !== "all" ? selectedLocality : "Azhiyur",
              role: "Resident / Citizen",
              roleBadge: "Verified Citizen",
              rationCard: "Priority BPL",
              avatarColor: "bg-emerald-700",
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            const userObj = { ...newProfile, loggedInAt: new Date().toISOString() };
            setCurrentUser(userObj);
            try { localStorage.setItem("gramseva_user", JSON.stringify(userObj)); } catch (e) {}
          }
        } catch (err) {
          console.error("Firestore fetch error:", err);
          const userObj = {
            uid: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName || fbUser.email?.split("@")[0] || "Citizen",
            phone: "+91 98470 00000",
            district: selectedDistrict !== "all" ? selectedDistrict : "Kozhikode",
            locality: selectedLocality !== "all" ? selectedLocality : "Azhiyur",
            role: "Resident / Citizen",
            roleBadge: "Verified Citizen",
            rationCard: "Priority BPL",
            avatarColor: "bg-emerald-700",
            loggedInAt: new Date().toISOString()
          };
          setCurrentUser(userObj);
        }
      } else {
        setCurrentUser(null);
        try { localStorage.removeItem("gramseva_user"); } catch (e) {}
      }
    });
    return () => unsubscribe();
  }, [selectedDistrict, selectedLocality]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Firebase SignOut error:", e);
    }
    setCurrentUser(null);
    setIsGuestAllowed(false);
    setCurrentTab("services");
    try { localStorage.removeItem("gramseva_user"); } catch (e) {}
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
    setVisiblePlacesCount(8);
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
    const isSameDistrict = selectedDistrict !== "all" ? service.districtName === selectedDistrict : (service.districtName === "Kozhikode" || service.districtName === "Dakshina Kannada");
    const isSameLocality = selectedLocality !== "all" && service.localityName === selectedLocality;
    if (isSameLocality) {
      return Math.round((0.3 + noise * 1.2) * 10) / 10;
    } else if (isSameDistrict) {
      const idx = Math.abs(hash % 8) + 1.2;
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
        "Kasaragod": 435,
        "Dakshina Kannada": 12,
        "Udupi": 55,
        "Kodagu": 88,
        "Mysuru": 135,
        "Uttara Kannada": 165,
        "Bengaluru Urban": 350,
        "Belagavi": 380,
        "Kalaburagi": 520
      };
      const baseDist = distMapping[service.districtName || ""] || 45;
      return Math.round((baseDist + noise * 8) * 10) / 10;
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

  // Auto-dismiss floating toast notifications after 2.8s
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => {
        setSuccessToast(null);
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [successToast]);
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

  // Ensure that any selected locality across all states has its 5-per-category services available
  useEffect(() => {
    if (selectedLocality === "all" || selectedDistrict === "all") return;

    setServices((prev) => {
      const alreadyHas = prev.some((s) => s.localityName === selectedLocality || s.panchayatName === selectedLocality);
      if (alreadyHas) return prev;

      let distList = [];
      let pncDict = {};
      let stateKey = selectedState;

      if (selectedState === "tamilnadu") {
        distList = TAMILNADU_DISTRICTS_LIST;
        pncDict = TAMILNADU_PANCHAYATS_BY_DISTRICT;
      } else if (selectedState === "karnataka") {
        distList = KARNATAKA_DISTRICTS_LIST;
        pncDict = KARNATAKA_PANCHAYATS_BY_DISTRICT;
      } else if (selectedState === "andhra") {
        distList = ANDHRAPRADESH_DISTRICTS_LIST;
        pncDict = ANDHRAPRADESH_PANCHAYATS_BY_DISTRICT;
      } else {
        distList = KERALA_DISTRICTS_LIST;
        pncDict = KERALA_PANCHAYATS_BY_DISTRICT;
      }

      const distObj = distList.find((d) => d.en === selectedDistrict) || { en: selectedDistrict };
      const pncs = pncDict[selectedDistrict] || [];
      const pncObj = pncs.find((p) => p.en === selectedLocality || p.name === selectedLocality) || { en: selectedLocality };

      const generated = buildPanchayatServices(stateKey, distObj, pncObj, 999);
      return [...prev, ...generated];
    });
  }, [selectedLocality, selectedDistrict, selectedState]);

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

  const handleAddCustomService = (newService) => {
    setServices((prev) => [newService, ...prev]);
    try {
      const existing = JSON.parse(localStorage.getItem("village_custom_services") || "[]");
      const updated = [newService, ...existing.filter((s) => s.id !== newService.id)];
      localStorage.setItem("village_custom_services", JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving custom service", err);
    }
    setSuccessToast("Service contributed & published to directory!");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleDeleteCustomService = (serviceId) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    try {
      const existing = JSON.parse(localStorage.getItem("village_custom_services") || "[]");
      const updated = existing.filter((s) => s.id !== serviceId);
      localStorage.setItem("village_custom_services", JSON.stringify(updated));
    } catch (err) {
      console.error("Error deleting custom service", err);
    }
    setSuccessToast("Service removed from community list.");
    setTimeout(() => setSuccessToast(null), 3000);
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
  const stateServices = useMemo(() => {
    return filterServiceObservatoryDataByState(services, selectedState);
  }, [services, selectedState]);

  const categoryCountsForState = useMemo(() => {
    const counts = { all: stateServices.length, health: 0, education: 0, government: 0, water: 0, agriculture: 0 };
    stateServices.forEach((s) => {
      const catKey = s.categoryKey;
      if (counts[catKey] !== undefined) {
        counts[catKey] += 1;
      }
    });
    return counts;
  }, [stateServices]);

  const categoryCountsInScope = useMemo(() => {
    const counts = { all: 0, health: 0, education: 0, government: 0, water: 0, agriculture: 0 };
    const stateServiceIds = new Set(stateServices.map((s) => s.id));

    services.forEach((service) => {
      if (!stateServiceIds.has(service.id)) return;
      if (selectedDistrict !== "all" && service.districtName !== selectedDistrict) return;
      if (selectedLocality !== "all") {
        if (selectedLocality === "Azhiyur" || selectedLocality.toLowerCase().includes("azhiyur")) {
          const isAzhiyurPanchayat = service.panchayatName === "Azhiyur" || service.localityName === "Azhiyur" || AZHIYUR_SUB_LOCALITIES.some((sub) => sub.en === service.localityName);
          if (!isAzhiyurPanchayat) return;
        } else if (service.localityName !== selectedLocality) {
          return;
        }
      }
      if (isNearMeActive && getSimulatedDistance(service) > nearMeDistance) return;

      counts.all += 1;
      if (counts[service.categoryKey] !== undefined) {
        counts[service.categoryKey] += 1;
      }
    });

    return counts;
  }, [services, stateServices, selectedDistrict, selectedLocality, isNearMeActive, nearMeDistance]);

  const categoryOptions = useMemo(() => {
    return [
      {
        key: "all",
        label: t.allCategories || "All",
        fullName: "All Essential Services",
        count: categoryCountsInScope.all,
        totalCount: categoryCountsForState.all,
        icon: <Building2 className="w-3.5 h-3.5" />,
        activeClasses: "bg-slate-900 text-white border-slate-900 shadow-sm",
        inactiveClasses: "bg-white text-slate-700 border-stone-300/90 hover:bg-stone-100 hover:border-slate-400",
        badgeActive: "bg-amber-400 text-slate-950 font-black",
        badgeInactive: "bg-stone-200 text-stone-700 font-bold",
        description: "Complete public directory across health, education, agriculture, governance, and utilities."
      },
      {
        key: "health",
        label: t.health || "Health",
        fullName: "Health & Medical Facilities",
        count: categoryCountsInScope.health,
        totalCount: categoryCountsForState.health,
        icon: <HeartPulse className="w-3.5 h-3.5" />,
        activeClasses: "bg-rose-700 text-white border-rose-800 shadow-sm shadow-rose-950/20",
        inactiveClasses: "bg-rose-50/70 text-rose-900 border-rose-200 hover:bg-rose-100 hover:border-rose-300",
        badgeActive: "bg-white text-rose-950 font-black",
        badgeInactive: "bg-rose-200/90 text-rose-900 font-bold",
        description: "Primary Health Centres (PHC), Family Health Centres, Taluk Hospitals, Jan Aushadhi & Clinics."
      },
      {
        key: "education",
        label: t.education || "Education",
        fullName: "Education & Academic Institutions",
        count: categoryCountsInScope.education,
        totalCount: categoryCountsForState.education,
        icon: <GraduationCap className="w-3.5 h-3.5" />,
        activeClasses: "bg-indigo-700 text-white border-indigo-800 shadow-sm shadow-indigo-950/20",
        inactiveClasses: "bg-indigo-50/70 text-indigo-900 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300",
        badgeActive: "bg-white text-indigo-950 font-black",
        badgeInactive: "bg-indigo-200/90 text-indigo-900 font-bold",
        description: "Government & Aided Schools, Higher Secondary, Anganwadis, Public Libraries & ITIs."
      },
      {
        key: "agriculture",
        label: t.agriculture || "Agriculture",
        fullName: "Agriculture, Farming & Livestock",
        count: categoryCountsInScope.agriculture,
        totalCount: categoryCountsForState.agriculture,
        icon: <Sprout className="w-3.5 h-3.5" />,
        activeClasses: "bg-emerald-800 text-white border-emerald-900 shadow-sm shadow-emerald-950/20",
        inactiveClasses: "bg-emerald-50/70 text-emerald-950 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300",
        badgeActive: "bg-white text-emerald-950 font-black",
        badgeInactive: "bg-emerald-200/90 text-emerald-950 font-bold",
        description: "Krishi Bhavans, Farmers' Producer Co-ops, Veterinary Hospitals, Soil Testing & Ration Depots."
      },
      {
        key: "government",
        label: t.government || "Government",
        fullName: "Civic & Local Governance",
        count: categoryCountsInScope.government,
        totalCount: categoryCountsForState.government,
        icon: <Shield className="w-3.5 h-3.5" />,
        activeClasses: "bg-amber-800 text-white border-amber-900 shadow-sm shadow-amber-950/20",
        inactiveClasses: "bg-amber-50/70 text-amber-950 border-amber-200 hover:bg-amber-100 hover:border-amber-300",
        badgeActive: "bg-white text-amber-950 font-black",
        badgeInactive: "bg-amber-200/90 text-amber-950 font-bold",
        description: "Gram Panchayat Offices, Village Offices, Akshaya E-Centres, Police Stations & Post Offices."
      },
      {
        key: "water",
        label: t.water || "Water",
        fullName: "Water Supply & Utilities",
        count: categoryCountsInScope.water,
        totalCount: categoryCountsForState.water,
        icon: <Droplet className="w-3.5 h-3.5" />,
        activeClasses: "bg-sky-700 text-white border-sky-800 shadow-sm shadow-sky-950/20",
        inactiveClasses: "bg-sky-50/70 text-sky-950 border-sky-200 hover:bg-sky-100 hover:border-sky-300",
        badgeActive: "bg-white text-sky-950 font-black",
        badgeInactive: "bg-sky-200/90 text-sky-950 font-bold",
        description: "Kerala Water Authority, Jal Jeevan Mission supply lines, pump operators & drinking water schemes."
      }
    ];
  }, [t, categoryCountsInScope, categoryCountsForState]);

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
  const filteredServices = useMemo(() => {
    const stateServiceIds = new Set(stateServices.map((s) => s.id));

    return searchableServices
      .filter(({ service }) => stateServiceIds.has(service.id))
      .map(({ service, searchText, searchTokens }) => ({
        service,
        searchScore: getSearchScore(searchText, searchTokens, normalizedSearchQuery)
      }))
      .filter(({ service, searchScore }) => {
        if (selectedCategory !== "all" && service.categoryKey !== selectedCategory) {
          if (selectedCategory === "agriculture" && service.translations?.en?.category?.toLowerCase() === "ration") {
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
      .map(({ service }) => service);
  }, [stateServices, searchableServices, normalizedSearchQuery, selectedCategory, selectedDistrict, selectedLocality, isNearMeActive, nearMeDistance, sortByProximity]);
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

  const visibleGroupedPlaces = useMemo(() => {
    return groupedServicesByPlace.slice(0, visiblePlacesCount);
  }, [groupedServicesByPlace, visiblePlacesCount]);

  const visibleInstitutions = useMemo(() => {
    if (groupByPlace) {
      return visibleGroupedPlaces.flatMap((g) => g.institutions);
    }
    return flatInstitutions.slice(0, visibleCount);
  }, [groupByPlace, visibleGroupedPlaces, flatInstitutions, visibleCount]);

  const visibleServicesCount = useMemo(() => {
    return visibleInstitutions.reduce((acc, inst) => acc + inst.units.length, 0);
  }, [visibleInstitutions]);

  const hasMorePlaces = groupByPlace && groupedServicesByPlace.length > visiblePlacesCount;
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

  if (!currentUser && !isGuestAllowed && !adminUser) {
    return (
      <>
        <WiseGatekeeperLogin
          onLoginSuccess={() => setIsGuestAllowed(true)}
          onGuestAccess={() => setIsGuestAllowed(true)}
          onOpenAdminLogin={() => setShowAdminLoginModal(true)}
          selectedState={selectedState}
          onStateChange={setSelectedState}
          selectedDistrict={selectedDistrict}
          selectedLocality={selectedLocality}
          setSuccessToast={setSuccessToast}
          districtsList={KERALA_DISTRICTS_LIST}
          panchayatsByDistrict={KERALA_PANCHAYATS_BY_DISTRICT}
        />
        <AdminLoginModal
          isOpen={showAdminLoginModal}
          onClose={() => setShowAdminLoginModal(false)}
          onAdminAuthenticated={(adminData) => {
            setAdminUser(adminData);
            try { localStorage.setItem("gramseva_admin_session", JSON.stringify(adminData)); } catch {}
            setIsGuestAllowed(true);
            setCurrentTab("admin");
            setSuccessToast(`Authorized as ${adminData.name}`);
          }}
          currentLocality={selectedLocality === "all" ? "Azhiyur" : selectedLocality}
          currentDistrict={selectedDistrict === "all" ? "Kozhikode" : selectedDistrict}
          currentState={selectedState}
        />
      </>
    );
  }

  return <div id="dir-app-root" data-theme={currentTheme} style={{ "--gram-bg": `url(${uiBackdrop})` }} className={`gram-root w-full h-screen min-h-screen overflow-hidden ${isHighContrast ? "bg-black high-contrast" : ""} text-slate-900 font-sans antialiased flex flex-col items-stretch transition-all duration-300 ${isLargeText ? "text-[110%]" : ""}`}>
      <a href="#service-results" className="skip-link">Skip to service results</a>

      {/* Main Full-Bleed Application Frame */}
      <div data-theme={currentTheme} className="directory-frame relative w-full h-full min-h-0 bg-[#101214] flex flex-col overflow-hidden transition-all flex-1">
        
        {
    /* Dynamic Mobile Banner Header block */
  }
        <header className="gram-header app-header bg-[#0e1626] text-white p-3 sm:p-5 pt-3 pb-3 shrink-0 flex flex-col gap-2 relative border-b border-slate-800/80">
          
          {/* Panchayat Branding Row */}
          <div className="flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div
                onClick={handleSecretHeaderClick}
                className="flex items-center gap-2 min-w-0 cursor-pointer select-none"
                title="GramSeva Panchayat Hub (Triple-click for Officer Gateway)"
              >
                <h1 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-tight shrink-0">
                  GramSeva
                </h1>
                <span className="text-slate-600 font-light text-lg sm:text-xl hidden xs:inline">|</span>
                <p className="font-serif italic text-sm sm:text-lg text-[#e07a1e] font-normal truncate">
                  {selectedLocality === "all"
                    ? selectedDistrict === "all"
                      ? selectedState === "karnataka"
                        ? "Karnataka Grama Panchayat Directory"
                        : selectedState === "all"
                          ? "Pan-India Directory"
                          : "Kerala Citizen Directory"
                      : `${selectedDistrict} Panchayat Directory`
                    : `${selectedLocality} Grama Panchayat`}
                </p>
              </div>
            </div>
            
            {/* Language Selector & User Account */}
            <div className="shrink-0 flex items-center gap-2">
              <div className="max-w-[130px] sm:max-w-[280px]">
                <LanguageWheel compact={true} />
              </div>
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => navigateToTab("profile")}
                  className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-xs cursor-pointer"
                  title={`Logged in as ${currentUser.name}`}
                >
                  <div className="w-5 h-5 rounded-full bg-[#e07a1e] flex items-center justify-center text-[10px] font-black text-white shrink-0">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "M"}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate text-[11px] font-bold text-slate-100">{currentUser.name}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigateToTab("profile")}
                  className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-xs cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-[#e07a1e] flex items-center justify-center text-[10px] font-black text-white shrink-0">
                    M
                  </div>
                  <span className="hidden sm:inline text-[11px] font-bold text-slate-100">Milan Pullapalli</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub-bar: State Welcome Message Banner */}
          {(() => {
            const greeting = getStateWelcomeGreeting(selectedState, language);
            return (
              <div className="state-welcome-banner bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[#e07a1e] font-serif font-bold text-base shrink-0">§</span>
                  <p className="text-xs sm:text-sm font-medium text-slate-200 tracking-wide truncate">
                    {greeting.text || "Swagatham — welcome to Kerala's GramSeva Citizen Services Hub"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-[10px] uppercase font-mono font-bold tracking-wider bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded">
                  <span>{selectedState === "all" ? "PAN-INDIA" : `${selectedState.toUpperCase()}`}</span>
                </div>
              </div>
            );
          })()}

          {/* Primary search & Location filter row */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 mt-1 sm:mt-2">
            <div className="relative flex-1 min-w-[220px]">
              <div className={`service-search bg-white flex items-center border border-stone-300/90 rounded-xl shadow-2xs ${isSearchFocused ? "is-focused ring-2 ring-amber-500/30 border-amber-500" : ""} ${searchQuery !== settledSearchQuery ? "is-searching" : ""}`}>
                <Search className="w-4 h-4 text-slate-400 ml-2.5 sm:ml-3 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  aria-busy={searchQuery !== settledSearchQuery}
                  aria-label="Search services by name, category, place, contact, or language"
                  placeholder={t.searchPlaceholder || "Search services, contact names, offices..."}
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveRecentSearch(searchQuery);
                    }
                  }}
                  className="w-full text-slate-900 placeholder-slate-400 bg-transparent text-xs sm:text-sm py-2 sm:py-2.5 px-2 outline-none border-none leading-none font-medium min-h-[38px] sm:min-h-[42px]"
                />

                {searchQuery ? (
                  <button onClick={() => setSearchQuery("")} className="search-clear" aria-label="Clear search">
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="search-shortcut hidden sm:inline text-slate-400 text-xs mr-2" aria-hidden="true">⌘K</span>
                )}
              </div>

              {/* Search Suggestions & Recent Search History Dropdown */}
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
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-50 transition flex items-center justify-between gap-3 cursor-pointer"
                          >
                            <span className="text-xs font-bold truncate text-slate-900">{item.label}</span>
                            <span className="text-[10px] text-[#c26111] font-bold shrink-0">{item.helper}</span>
                          </button>
                        ))}
                      </>
                    ) : null
                  ) : (
                    recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between px-2 pb-1.5 border-b border-stone-100 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            <History className="w-3 h-3 text-[#c26111]" /> Recent Searches
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
                              className="bg-stone-100 hover:bg-amber-100 text-slate-800 border border-stone-200 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
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

            {/* State, District & Locality Selectors */}
            <div className="flex items-center gap-1.5 shrink-0 w-full md:w-auto overflow-x-auto scrollbar-none py-0.5">
              {/* State Selector */}
              <div className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs text-white transition shrink-0 shadow-2xs">
                <Landmark className="w-3.5 h-3.5 text-[#e07a1e] shrink-0" />
                <select
                  value={selectedState}
                  onChange={(e) => {
                    const stateVal = e.target.value;
                    setSelectedState(stateVal);
                    try {
                      localStorage.setItem("gramseva_state", stateVal);
                    } catch (err) {}
                    if (stateVal === "kerala") {
                      setSelectedDistrict("Kozhikode");
                      setSelectedLocality("Azhiyur");
                    } else if (stateVal === "karnataka") {
                      setSelectedDistrict("Dakshina Kannada");
                      setSelectedLocality("Mangaluru");
                    } else if (stateVal === "tamilnadu") {
                      setSelectedDistrict("Chennai");
                      setSelectedLocality("all");
                    } else if (stateVal === "andhra") {
                      setSelectedDistrict("Visakhapatnam");
                      setSelectedLocality("all");
                    } else {
                      setSelectedDistrict("all");
                      setSelectedLocality("all");
                    }
                  }}
                  className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer border-none py-0 pr-1 [&_option]:bg-slate-900 [&_option]:text-white [&_optgroup]:bg-slate-900 [&_optgroup]:text-[#e07a1e]"
                  aria-label="Select State"
                >
                  <option value="kerala" className="bg-slate-900 text-white">🌴 Kerala</option>
                  <option value="karnataka" className="bg-slate-900 text-white">🏰 Karnataka</option>
                  <option value="tamilnadu" className="bg-slate-900 text-white">🛕 Tamil Nadu</option>
                  <option value="andhra" className="bg-slate-900 text-white">🌾 Andhra Pradesh</option>
                  <option value="all" className="bg-slate-900 text-white">🇮🇳 All States</option>
                </select>
              </div>

              {/* District Selector */}
              <div className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs text-white transition shrink-0 shadow-2xs">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    const dist = e.target.value;
                    setSelectedDistrict(dist);
                    if (dist === "Kozhikode") {
                      setSelectedLocality("Azhiyur");
                    } else if (dist === "Dakshina Kannada") {
                      setSelectedLocality("Mangaluru");
                    } else if (dist === "Coimbatore") {
                      setSelectedLocality("Pollachi North");
                    } else if (dist === "all") {
                      setSelectedLocality("all");
                    } else {
                      const firstLoc = (KERALA_PANCHAYATS_BY_DISTRICT[dist] || KARNATAKA_PANCHAYATS_BY_DISTRICT[dist] || TAMILNADU_PANCHAYATS_BY_DISTRICT[dist] || ANDHRAPRADESH_PANCHAYATS_BY_DISTRICT[dist])?.[0]?.en || LOCALITIES_EN[dist]?.[0] || "all";
                      setSelectedLocality(firstLoc);
                    }
                  }}
                  className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer border-none py-0 pr-1 [&_option]:bg-slate-900 [&_option]:text-white [&_optgroup]:bg-slate-900 [&_optgroup]:text-[#e07a1e]"
                  aria-label="Select District"
                >
                  <option value="all" className="bg-slate-900 text-white font-bold">
                    {selectedState === "kerala" ? "All Districts in Kerala (14)" : selectedState === "karnataka" ? "All Districts in Karnataka (31)" : selectedState === "tamilnadu" ? "All Districts in Tamil Nadu (37)" : selectedState === "andhra" ? "All Districts in Andhra Pradesh (26)" : "All Districts"}
                  </option>
                  {(selectedState === "kerala" || selectedState === "all") && (
                    <optgroup label="🌴 Kerala Districts (14)" className="bg-slate-900 text-[#e07a1e] font-bold">
                      {KERALA_DISTRICTS_LIST.map((dist) => (
                        <option key={dist.id} value={dist.en} className="bg-slate-900 text-white font-medium">
                          {dist.en} {language === "ml" && dist.ml ? `(${dist.ml})` : ""}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {(selectedState === "karnataka" || selectedState === "all") && (
                    <optgroup label="🏰 Karnataka Districts (31)" className="bg-slate-900 text-[#e07a1e] font-bold">
                      {KARNATAKA_DISTRICTS_LIST.map((dist) => (
                        <option key={dist.id} value={dist.en} className="bg-slate-900 text-white font-medium">
                          {dist.en} ({dist.kn})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {(selectedState === "tamilnadu" || selectedState === "all") && (
                    <optgroup label="🛕 Tamil Nadu Districts (37)" className="bg-slate-900 text-[#e07a1e] font-bold">
                      {TAMILNADU_DISTRICTS_LIST.map((dist) => (
                        <option key={dist.id} value={dist.en} className="bg-slate-900 text-white font-medium">
                          {dist.en} {dist.ta ? `(${dist.ta})` : ""}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {(selectedState === "andhra" || selectedState === "all") && (
                    <optgroup label="🌾 Andhra Pradesh Districts (26)" className="bg-slate-900 text-[#e07a1e] font-bold">
                      {ANDHRAPRADESH_DISTRICTS_LIST.map((dist) => (
                        <option key={dist.id} value={dist.en} className="bg-slate-900 text-white font-medium">
                          {dist.en} {dist.te ? `(${dist.te})` : ""}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Locality Selector */}
              <div className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-2.5 py-2 text-xs text-white transition shrink-0 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-[#e07a1e] shrink-0" />
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer border-none py-0 pr-1 [&_option]:bg-slate-900 [&_option]:text-white [&_optgroup]:bg-slate-900 [&_optgroup]:text-[#e07a1e] max-w-[170px] truncate"
                  aria-label="Select Locality or Panchayat"
                >
                  <option value="all" className="bg-slate-900 text-white font-bold">
                    All Places in {selectedDistrict === "all" ? (selectedState === "kerala" ? "Kerala" : selectedState === "karnataka" ? "Karnataka" : selectedState === "tamilnadu" ? "Tamil Nadu" : selectedState === "andhra" ? "Andhra Pradesh" : "All Districts") : selectedDistrict}
                  </option>
                  {selectedDistrict === "all" ? (
                    <>
                      {(selectedState === "kerala" || selectedState === "all") &&
                        KERALA_DISTRICTS_LIST.flatMap((d) =>
                          (KERALA_PANCHAYATS_BY_DISTRICT[d.en] || []).map((p, idx) => (
                            <option key={`ke_${d.en}_${p.code || p.en}_${idx}`} value={p.en} className="bg-slate-900 text-white">
                              {p.en}{language === "ml" && p.ml ? ` (${p.ml})` : ""} &middot; {d.en} (KL)
                            </option>
                          ))
                        )}
                      {(selectedState === "karnataka" || selectedState === "all") &&
                        KARNATAKA_DISTRICTS_LIST.flatMap((d) =>
                          (KARNATAKA_PANCHAYATS_BY_DISTRICT[d.en] || []).map((p, idx) => (
                            <option key={`ka_${d.en}_${p.code || p.en}_${idx}`} value={p.en} className="bg-slate-900 text-white">
                              {p.en}{p.kn ? ` (${p.kn})` : ""} &middot; {d.en} (KA)
                            </option>
                          ))
                        )}
                      {(selectedState === "tamilnadu" || selectedState === "all") &&
                        TAMILNADU_DISTRICTS_LIST.flatMap((d) =>
                          (TAMILNADU_PANCHAYATS_BY_DISTRICT[d.en] || []).map((p, idx) => (
                            <option key={`tn_${d.en}_${p.code || p.en}_${idx}`} value={p.en} className="bg-slate-900 text-white">
                              {p.en}{p.block ? ` (${p.block})` : p.ta && p.ta !== p.en ? ` (${p.ta})` : ""} &middot; {d.en} (TN)
                            </option>
                          ))
                        )}
                      {(selectedState === "andhra" || selectedState === "all") &&
                        ANDHRAPRADESH_DISTRICTS_LIST.flatMap((d) =>
                          (ANDHRAPRADESH_PANCHAYATS_BY_DISTRICT[d.en] || []).map((p, idx) => (
                            <option key={`ap_${d.en}_${p.code || p.en}_${idx}`} value={p.en} className="bg-slate-900 text-white">
                              {p.en}{p.te ? ` (${p.te})` : ""} &middot; {d.en} (AP)
                            </option>
                          ))
                        )}
                    </>
                  ) : KERALA_PANCHAYATS_BY_DISTRICT[selectedDistrict] ? (
                    KERALA_PANCHAYATS_BY_DISTRICT[selectedDistrict].map((p, idx) => (
                      <option key={`ke_${p.code || p.en}_${idx}`} value={p.en} className="bg-slate-900 text-white">
                        {p.en}{language === "ml" && p.ml ? ` (${p.ml})` : language === "hi" && p.hi ? ` (${p.hi})` : language === "te" && p.te ? ` (${p.te})` : language === "ta" && p.ta ? ` (${p.ta})` : ""}
                      </option>
                    ))
                  ) : KARNATAKA_PANCHAYATS_BY_DISTRICT[selectedDistrict] ? (
                    KARNATAKA_PANCHAYATS_BY_DISTRICT[selectedDistrict].map((p, idx) => (
                      <option key={`ka_${p.code || p.en}_${idx}`} value={p.en} className="bg-slate-900 text-white">
                        {p.en}{p.kn ? ` (${p.kn})` : ""}
                      </option>
                    ))
                  ) : TAMILNADU_PANCHAYATS_BY_DISTRICT[selectedDistrict] ? (
                    TAMILNADU_PANCHAYATS_BY_DISTRICT[selectedDistrict].map((p, idx) => (
                      <option key={`tn_${p.code || p.en}_${idx}`} value={p.en} className="bg-slate-900 text-white">
                        {p.en}{p.block ? ` (${p.block})` : p.ta && p.ta !== p.en ? ` (${p.ta})` : ""}
                      </option>
                    ))
                  ) : ANDHRAPRADESH_PANCHAYATS_BY_DISTRICT[selectedDistrict] ? (
                    ANDHRAPRADESH_PANCHAYATS_BY_DISTRICT[selectedDistrict].map((p, idx) => (
                      <option key={`ap_${p.code || p.en}_${idx}`} value={p.en} className="bg-slate-900 text-white">
                        {p.en}{p.te ? ` (${p.te})` : ""}
                      </option>
                    ))
                  ) : (
                    (LOCALITIES_EN[selectedDistrict] || []).map((loc, idx) => (
                      <option key={`loc_${loc}_${idx}`} value={loc} className="bg-slate-900 text-white">
                        {loc}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Popular Quick Topic Chips for Villagers */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-2 pb-1 text-[11px] font-bold">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase shrink-0 font-bold">POPULAR</span>
            {[
              { label: "Farmer Schemes", query: "Krishi Bhavan" },
              { label: "Income Cert", query: "Income Certificate" },
              { label: "KSEB Power", query: "KSEB" },
              { label: "Water Supply", query: "Water Authority" },
              { label: "Health Center", query: "Health Center" },
              { label: "Bus Depot", query: "KSRTC" },
              { label: "Anganwadi", query: "Anganwadi" }
            ].map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchQuery(tag.query);
                  saveRecentSearch(tag.query);
                }}
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-3 py-1 rounded-lg shrink-0 transition cursor-pointer active:scale-95 text-xs font-medium"
              >
                {tag.label}
              </button>
            ))}
          </div>

        </header>

        {
    /* View switcher container */
  }
        <div className={`app-content-shell flex-1 flex flex-col min-h-0 bg-[#f6f4ee] ${isUiPending ? "is-pending" : ""}`} aria-busy={isUiPending}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentTab}
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.985, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985, y: -8 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="tab-surface flex-1 flex flex-col min-h-0 relative bg-[#f6f4ee]"
            >
          
          {/* Tab Content 1: Services Directory List */}
          {currentTab === "services" && <>
              {/* Category Horizontal Filter Row */}
              <div className="category-strip flex items-center justify-between overflow-x-auto gap-2 px-3 sm:px-5 lg:px-6 py-2.5 border-b border-stone-200/90 bg-[#f4f2ec] scrollbar-none shrink-0 select-none sticky top-0 z-20 shadow-2xs" role="toolbar" aria-label="Filter services by category">
                <div className="flex items-center gap-1.5 shrink-0">
                  {categoryOptions.map((cat) => {
                    const isActive = selectedCategory === cat.key;
                    const hasContent = cat.count > 0;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => chooseCategory(cat.key)}
                        aria-pressed={isActive}
                        aria-label={`Show ${cat.label} services (${cat.count} available in current scope)`}
                        className={`category-pill ${
                          isActive
                            ? cat.activeClasses || "bg-[#0e1626] text-white border-[#0e1626]"
                            : cat.inactiveClasses || "bg-white text-slate-700 border-stone-300/80 hover:bg-stone-100"
                        } flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap border shrink-0 active:scale-95 cursor-pointer shadow-2xs ${
                          !hasContent ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      >
                        <span className="shrink-0">{cat.icon}</span>
                        <span className="font-label text-xs whitespace-nowrap">{cat.label}</span>
                        <span
                          className={`ml-0.5 text-[10px] font-black px-1.5 py-0.2 rounded-full transition-all ${
                            isActive
                              ? cat.badgeActive || "bg-[#e07a1e] text-white"
                              : hasContent
                              ? cat.badgeInactive || "bg-stone-200 text-stone-700"
                              : "bg-stone-200 text-stone-400"
                          }`}
                        >
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pl-2 border-l border-stone-300 ml-auto">
                  <button
                    type="button"
                    onClick={() => setGroupByPlace((value) => !value)}
                    className={`rail-action flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-full text-xs font-bold border transition ${groupByPlace ? "is-active bg-[#0e1626] text-white border-[#0e1626]" : "bg-white text-slate-700 border-stone-300 hover:bg-stone-100"}`}
                    aria-pressed={groupByPlace}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Group by Place</span>
                    <span className="md:hidden">Group</span>
                  </button>
                  <button type="button" onClick={() => setSortByProximity((value) => !value)} className={`rail-action shrink-0 px-2.5 py-1.5 rounded-full text-xs font-bold border transition ${sortByProximity ? "is-active bg-[#0e1626] text-white border-[#0e1626]" : "bg-white text-slate-700 border-stone-300 hover:bg-stone-100"}`} aria-pressed={sortByProximity}>
                    Nearest first
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedDistrict("Kozhikode");
                      setSelectedLocality("Azhiyur");
                      setSortByProximity(false);
                    }}
                    className="rail-action shrink-0 px-2.5 py-1.5 rounded-full text-xs font-bold border border-stone-300 bg-white text-slate-600 hover:bg-stone-100 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Dynamic scrollable directory area */}
              <div id="service-results" className="service-observatory flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-3 pb-24 scrollbar-none" tabIndex={-1}>
                {isUiPending ? (
                  <DirectorySkeleton />
                ) : (
                  <>
                    {/* Active Category Overview Context Banner */}
                    {selectedCategory !== "all" && (() => {
                      const activeCat = categoryOptions.find((c) => c.key === selectedCategory);
                      if (!activeCat) return null;
                      return (
                        <div className="mb-3.5 p-3.5 sm:p-4 rounded-2xl border bg-white border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getCategoryColor(activeCat.key)}`}>
                              {activeCat.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                                  {activeCat.fullName}
                                </h4>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeCat.badgeActive || "bg-slate-900 text-white"}`}>
                                  {activeCat.count} facilities found
                                </span>
                              </div>
                              <p className="text-[11px] sm:text-xs text-slate-600 leading-snug mt-0.5">
                                {activeCat.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => chooseCategory("all")}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-stone-100 hover:bg-stone-200 text-slate-700 border border-stone-300 transition cursor-pointer active:scale-95"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Show All</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="service-feed-heading flex justify-between items-end gap-4 px-1 mb-1">
                      <div>
                        <span className="service-feed-kicker">Directory results</span>
                        <h3>
                          Services in {selectedLocality === "all" ? (selectedDistrict === "all" ? (selectedState === "karnataka" ? "Karnataka" : selectedState === "all" ? "All States (India)" : "Kerala") : `${selectedDistrict} District`) : selectedLocality}
                        </h3>
                      </div>
                      <span className="service-feed-count">Showing {visibleServicesCount} of {filteredServices.length}</span>
                    </div>

                    <AnimatePresence initial={false} mode="popLayout">
                      {filteredServices.length > 0 ? (
                        groupByPlace ? (
                          visibleGroupedPlaces.map((group) => {
                            const isCollapsed = collapsedPlaces[group.localityName];
                            const isKarnataka = KARNATAKA_DISTRICTS_LIST.some((d) => d.en === group.districtName);
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
                                        {group.districtName} District &middot; {isKarnataka ? "Karnataka" : "Kerala"}
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
                                          key={`${inst.id}-${selectedCategory}-${selectedDistrict}-${selectedLocality}-${sortByProximity}`}
                                          layout={shouldReduceMotion ? false : "position"}
                                          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                                          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                                          whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.008 }}
                                          whileTap={shouldReduceMotion ? undefined : { scale: 0.98, y: -1 }}
                                          transition={{ duration: shouldReduceMotion ? 0 : 0.28, delay: shouldReduceMotion ? 0 : Math.min(index * 0.035, 0.28), ease: [0.16, 1, 0.3, 1] }}
                                          style={{ "--card-stagger-index": index }}
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

                                              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    chooseCategory(primary.categoryKey);
                                                  }}
                                                  title={`Filter directory by ${getCategoryName(primary.categoryKey)}`}
                                                  className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border transition cursor-pointer hover:scale-105 active:scale-95 ${
                                                    primary.categoryKey === "health"
                                                      ? "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                                                      : primary.categoryKey === "education"
                                                      ? "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100"
                                                      : primary.categoryKey === "agriculture"
                                                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                                      : primary.categoryKey === "government"
                                                      ? "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
                                                      : primary.categoryKey === "water"
                                                      ? "bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100"
                                                      : "bg-slate-100 text-slate-800 border-stone-300 hover:bg-slate-200"
                                                  }`}
                                                >
                                                  <span>{data.category || getCategoryName(primary.categoryKey)}</span>
                                                </button>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                                  &middot; {inst.localityName}
                                                </span>
                                              </div>

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
                                  key={`${inst.id}-${selectedCategory}-${selectedDistrict}-${selectedLocality}-${sortByProximity}`}
                                  layout={shouldReduceMotion ? false : "position"}
                                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                                  whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.008 }}
                                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98, y: -1 }}
                                  transition={{ duration: shouldReduceMotion ? 0 : 0.28, delay: shouldReduceMotion ? 0 : Math.min(index * 0.035, 0.28), ease: [0.16, 1, 0.3, 1] }}
                                  style={{ "--card-stagger-index": index }}
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

                                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            chooseCategory(primary.categoryKey);
                                          }}
                                          title={`Filter directory by ${getCategoryName(primary.categoryKey)}`}
                                          className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border transition cursor-pointer hover:scale-105 active:scale-95 ${
                                            primary.categoryKey === "health"
                                              ? "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                                              : primary.categoryKey === "education"
                                              ? "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100"
                                              : primary.categoryKey === "agriculture"
                                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                              : primary.categoryKey === "government"
                                              ? "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
                                              : primary.categoryKey === "water"
                                              ? "bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100"
                                              : "bg-slate-100 text-slate-800 border-stone-300 hover:bg-slate-200"
                                          }`}
                                        >
                                          <span>{data.category || getCategoryName(primary.categoryKey)}</span>
                                        </button>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                          &middot; {inst.localityName}
                                        </span>
                                      </div>

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

                {hasMorePlaces && (
                  <div className="pt-4 pb-6 text-center col-span-full w-full max-w-md mx-auto">
                    <button
                      onClick={() => setVisiblePlacesCount((p) => p + 8)}
                      className="w-full py-3 bg-white border border-stone-200 hover:bg-stone-50 text-emerald-800 font-extrabold text-xs uppercase tracking-widest rounded-2xl transition shadow-2xs active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Show 8 more panchayats</span>
                      <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full text-[10px] font-mono">
                        +{Math.min(8, groupedServicesByPlace.length - visiblePlacesCount)} remaining
                      </span>
                    </button>
                    <p className="text-[10px] text-slate-500 font-semibold mt-2">
                      Showing {visibleGroupedPlaces.length} of {groupedServicesByPlace.length} panchayats ({visibleServicesCount} services)
                    </p>
                  </div>
                )}

                {hasMoreServices && (
                  <div className="pt-4 pb-6 text-center col-span-full w-full max-w-md mx-auto">
                    <button
                      onClick={() => setVisibleCount((p) => p + 12)}
                      className="w-full py-3 bg-white border border-stone-200 hover:bg-stone-50 text-emerald-800 font-extrabold text-xs uppercase tracking-widest rounded-2xl transition shadow-2xs active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Show 12 more services</span>
                      <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full text-[10px] font-mono">
                        +{Math.min(12, flatInstitutions.length - visibleCount)} remaining
                      </span>
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
                selectedDistrict={selectedDistrict === "all" ? (selectedState === "karnataka" ? "Dakshina Kannada" : "Kozhikode") : selectedDistrict}
                selectedLocality={selectedLocality === "all" ? (selectedState === "karnataka" ? "Mangaluru" : "Azhiyur") : selectedLocality}
                selectedState={selectedState}
                onSelectPanchayat={(dist, panch) => {
                  setSelectedDistrict(dist);
                  setSelectedLocality(panch);
                }}
              />
            </Suspense>
          )}

          {/* Tab Content: Digital Document Wallet & Certificate Vault */}
          {currentTab === "wallet" && (
            <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 pb-24 bg-stone-50 scrollbar-none">
              <Suspense fallback={<DirectorySkeleton />}>
                <div className="max-w-5xl mx-auto">
                  <DigitalDocumentWallet
                    language={language}
                    currentUser={currentUser}
                    onOpenResolver={() => navigateToTab("resolver")}
                    onSyncHeldDocs={handleSyncHeldDocs}
                  />
                </div>
              </Suspense>
            </div>
          )}

          {/* Tab Content 2: Full interactive vector map */}
          {currentTab === "map" && (
            <div className="flex-1 flex flex-col min-h-0 h-full relative">
              <Suspense fallback={<MapSkeleton />}>
                <ServiceMap
                  services={filteredServices}
                  categoryOptions={categoryOptions}
                  mapCategoryFilter={mapCategoryFilter}
                  setMapCategoryFilter={setMapCategoryFilter}
                  getCategoryName={getCategoryName}
                  setSelectedDetailService={setSelectedDetailService}
                  ui={ui}
                />
              </Suspense>
            </div>
          )}
          {currentTab === "suggest" && (
            <Suspense fallback={<DirectorySkeleton />}>
              <ServiceContributionHub
                services={services}
                onAddService={handleAddCustomService}
                onDeleteCustomService={handleDeleteCustomService}
                activeState={selectedState}
                keralaDistricts={KERALA_DISTRICTS_LIST || KERALA_DISTRICTS}
                localitiesEn={LOCALITIES_EN}
                tamilNaduDistricts={TAMILNADU_DISTRICTS_LIST}
                tamilNaduPanchayats={TAMILNADU_PANCHAYATS_BY_DISTRICT}
                karnatakaDistricts={KARNATAKA_DISTRICTS_LIST}
                karnatakaPanchayats={KARNATAKA_PANCHAYATS_BY_DISTRICT}
                currentUser={currentUser}
                navigateToTab={navigateToTab}
                onSelectDetailService={setSelectedDetailService}
              />
            </Suspense>
          )}

          {/* Tab Content: Grievance Tracker */}
          {currentTab === "grievances" && (
            <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 pb-24 bg-stone-50 scrollbar-none">
              <Suspense fallback={<DirectorySkeleton />}>
                <GrievanceTracker selectedState={selectedState} selectedDistrict={selectedDistrict} selectedLocality={selectedLocality} />
              </Suspense>
            </div>
          )}

          {
    /* Tab Content 4: Profile / Diagnostic settings */
  }
          {currentTab === "profile" && (
            <UserProfileHub
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              onLogout={handleLogout}
              onOpenAuthModal={() => setShowStartLoginModal(true)}
              onOpenAdminLogin={() => setShowAdminLoginModal(true)}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedLocality={selectedLocality}
              setSelectedLocality={setSelectedLocality}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              isOfflineMode={isOfflineMode}
              setIsOfflineMode={setIsOfflineMode}
              isLargeText={isLargeText}
              setIsLargeText={setIsLargeText}
              isHighContrast={isHighContrast}
              setIsHighContrast={setIsHighContrast}
              shouldReduceMotion={shouldReduceMotion}
              isNearMeActive={isNearMeActive}
              setIsNearMeActive={setIsNearMeActive}
              nearMeDistance={nearMeDistance}
              setNearMeDistance={setNearMeDistance}
              services={services}
              onNavigateTab={navigateToTab}
              ui={ui}
              t={t}
              language={language}
              keralaDistricts={KERALA_DISTRICTS_LIST || KERALA_DISTRICTS}
              keralaPanchayats={KERALA_PANCHAYATS_BY_DISTRICT}
              localitiesEn={LOCALITIES_EN}
              tamilNaduDistricts={TAMILNADU_DISTRICTS_LIST}
              tamilNaduPanchayats={TAMILNADU_PANCHAYATS_BY_DISTRICT}
              karnatakaDistricts={KARNATAKA_DISTRICTS_LIST}
              karnatakaPanchayats={KARNATAKA_PANCHAYATS_BY_DISTRICT}
              andhraPradeshDistricts={ANDHRAPRADESH_DISTRICTS_LIST}
              andhraPradeshPanchayats={ANDHRAPRADESH_PANCHAYATS_BY_DISTRICT}
            />
          )}

          {/* Tab Content 5: Restricted Panchayat Officer Admin Console */}
          {currentTab === "admin" && adminUser && (
            <div className="flex-1 min-h-0 h-full overflow-hidden bg-[#faf8f5] flex flex-col">
              <Suspense fallback={<DirectorySkeleton />}>
                <AdminConsole
                  adminUser={adminUser}
                  onExitAdmin={() => {
                    setAdminUser(null);
                    try { localStorage.removeItem("gramseva_admin_session"); } catch {}
                    setCurrentTab("services");
                    setSuccessToast("Admin session locked.");
                  }}
                  onSwitchToCitizenView={() => {
                    setCurrentTab("services");
                    setSuccessToast("Switched to Citizen View. Admin session is active.");
                  }}
                  selectedLocality={selectedLocality === "all" ? "Azhiyur" : selectedLocality}
                  selectedDistrict={selectedDistrict === "all" ? "Kozhikode" : selectedDistrict}
                  selectedState={selectedState}
                  onApproveServiceToLiveDirectory={(newServ) => {
                    setServices((prev) => [newServ, ...prev]);
                  }}
                />
              </Suspense>
            </div>
          )}

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
          <FirebaseAuthModal
            isOpen={showStartLoginModal}
            onClose={() => setShowStartLoginModal(false)}
            selectedDistrict={selectedDistrict}
            selectedLocality={selectedLocality}
            setSuccessToast={setSuccessToast}
            districtsList={KERALA_DISTRICTS_LIST}
            panchayatsByDistrict={KERALA_PANCHAYATS_BY_DISTRICT}
          />
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

        {/* Global Floating Toast for notifications and system alerts */}
        <AnimatePresence>
          {successToast && (
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              role="status"
              aria-live="polite"
              className="absolute top-16 sm:top-20 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-md z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold tracking-wide border border-emerald-600/50 flex items-center justify-between gap-3 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="truncate">{successToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessToast(null)}
                className="p-1 hover:bg-emerald-700 rounded text-emerald-200 hover:text-white cursor-pointer transition shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
            className="fixed sm:absolute bottom-16 sm:bottom-18 right-4 sm:right-6 z-40 bg-[#0e1626] hover:bg-[#182338] text-white font-black px-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl border border-slate-700 flex items-center gap-2 text-xs uppercase tracking-wider backdrop-blur-md cursor-pointer transition-colors active:scale-95"
          >
            {currentTab === "services" ? (
              <>
                <MapIcon className="w-4 h-4 text-amber-400" />
                <span>Map View</span>
              </>
            ) : (
              <>
                <List className="w-4 h-4 text-amber-400" />
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
            { id: "services", label: ui.services || "Services", icon: <Building2 className="w-5 h-5" /> },
            { id: "resolver", label: "Certificates", icon: <FileCheck2 className="w-5 h-5" /> },
            { id: "wallet", label: "Wallet", icon: <FolderCheck className="w-5 h-5" /> },
            { id: "grievances", label: "Grievance", icon: <ShieldAlert className="w-5 h-5" /> },
            { id: "map", label: ui.map || "Map", icon: <Compass className="w-5 h-5" /> },
            { id: "suggest", label: ui.suggest || "Suggest", icon: <Plus className="w-5 h-5" /> },
            { id: "profile", label: ui.profile || "Profile", icon: <User className="w-5 h-5" /> },
            ...(adminUser ? [{ id: "admin", label: "Admin", icon: <ShieldCheck className="w-5 h-5 text-amber-600" /> }] : [])
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
              className={`dock-button ${isActive ? "is-active" : ""} relative flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition cursor-pointer select-none active:scale-95 ${isActive ? "text-[#c26111] font-bold" : "text-slate-500 hover:text-slate-800"}`}
            >
                {isActive && (
                  <motion.div
                    layoutId="activeDockTab"
                    className="absolute top-0 w-8 h-0.5 bg-[#c26111] rounded-full shadow-[0_0_8px_rgba(194,97,17,0.4)] lg:hidden"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {tab.icon}
                <span className="font-label text-[8px] sm:text-[9px] font-extrabold tracking-wider uppercase leading-none">{tab.label}</span>
              </button>;
          })}
        </div>

        {/* Global Admin Login Modal (Hidden Officer Gateway) */}
        <AdminLoginModal
          isOpen={showAdminLoginModal}
          onClose={() => setShowAdminLoginModal(false)}
          onAdminAuthenticated={(adminData) => {
            setAdminUser(adminData);
            try { localStorage.setItem("gramseva_admin_session", JSON.stringify(adminData)); } catch {}
            setIsGuestAllowed(true);
            setCurrentTab("admin");
            setSuccessToast(`Authorized as ${adminData.name}`);
          }}
          currentLocality={selectedLocality === "all" ? "Azhiyur" : selectedLocality}
          currentDistrict={selectedDistrict === "all" ? "Kozhikode" : selectedDistrict}
          currentState={selectedState}
        />

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
