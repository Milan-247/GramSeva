import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Check,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Camera,
  Layers,
  Zap,
  Building2,
  Clock,
  Banknote,
  Search,
  ChevronRight,
  ChevronDown,
  Info,
  RefreshCw,
  Sparkles,
  GitFork,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  Plus,
  Trash2,
  Share2,
  Printer,
  Copy,
  RotateCcw,
  X,
  MapPin,
  HelpCircle,
  ExternalLink,
  FolderCheck,
  Compass,
  Filter,
  CheckSquare,
  Square
} from "lucide-react";
import {
  ANCHOR_DOCUMENTS,
  TARGET_CERTIFICATES,
  STATE_DATASETS,
  getCertificateDetails
} from "../data/certificateGraphData.js";
import { solveCertificateGraph } from "../utils/aoStarSolver.js";
import { scanDocumentPhoto, inspectDocumentMismatches, SAMPLE_DOCUMENT_PRESETS } from "../utils/documentOcr.js";
import {
  KERALA_DISTRICTS_LIST,
  KERALA_PANCHAYATS_BY_DISTRICT,
  getPanchayatInfo
} from "../data/keralaPanchayatsData.js";
import {
  KARNATAKA_DISTRICTS_LIST,
  KARNATAKA_PANCHAYATS_BY_DISTRICT,
  getKarnatakaPanchayatInfo
} from "../data/karnatakaPanchayatsData.js";
import {
  TAMILNADU_DISTRICTS_LIST,
  TAMILNADU_PANCHAYATS_BY_DISTRICT
} from "../data/tamilNaduPanchayatsData.js";
import {
  ANDHRAPRADESH_DISTRICTS_LIST,
  ANDHRAPRADESH_PANCHAYATS_BY_DISTRICT
} from "../data/andhraPradeshPanchayatsData.js";

// Localized UI strings for Certificate Resolver
const RESOLVER_TRANSLATIONS = {
  ml: {
    title: "സർട്ടിഫിക്കറ്റ് ഗൈഡ് & അനായാസ യാത്രാ പ്ലാൻ",
    badge: "ഓഫീസ് കയറിയിറങ്ങൽ ഒഴിവാക്കുന്ന സഹായി",
    subtitle: "നിങ്ങൾക്ക് ഉണ്ടാക്കേണ്ട സർട്ടിഫിക്കറ്റുകളും കയ്യിലുള്ള ഐഡി കാർഡുകളും തിരഞ്ഞെടുക്കുക. ഏത് ഓഫീസിൽ ആദ്യം പോകണം, ആവശ്യമായ രേഖകൾ, ഫീസ് എന്നിവ കൃത്യമായി കാണിക്കും.",
    selectState: "സംസ്ഥാനം & പോർട്ടൽ:",
    goal: "മുൻഗണന:",
    fewestVisits: "കുറച്ചു യാത്രകൾ",
    fastest: "വേഗത്തിൽ ലഭിക്കാൻ",
    lowestFee: "കുറഞ്ഞ ഫീസ്",
    visits: "യാത്രകൾ",
    days: "ദിവസങ്ങൾ",
    fee: "ഫീസ്",
    tabIntake: "രേഖകൾ തിരഞ്ഞെടുക്കുക",
    tabPlan: "ഓഫീസ് യാത്രാ പ്ലാൻ",
    tabGraph: "ബന്ധ വിവര മാപ്പ്",
    tabOcr: "സ്പെല്ലിംഗ് പരിശോധന",
    targetsTitle: "ഉണ്ടാക്കേണ്ട സർട്ടിഫിക്കറ്റുകൾ",
    targetsSub: "നിങ്ങൾക്ക് ലഭിക്കേണ്ട രേഖകളിൽ ടിക് ചെയ്യുക",
    heldTitle: "കയ്യിലുള്ള രേഖകൾ & ഐഡി കാർഡുകൾ",
    heldSub: "നിങ്ങളുടെ കയ്യിലുള്ള രേഖകൾ മാർക്ക് ചെയ്യുക",
    selectAll: "എല്ലാം തിരഞ്ഞെടുക്കുക",
    clearAll: "എല്ലാം ഒഴിവാക്കുക",
    searchTargets: "സർട്ടിഫിക്കറ്റുകൾ തിരയുക...",
    searchHeld: "രേഖകൾ തിരയുക...",
    solveBtn: "യാത്രാ പ്ലാൻ കാണുക",
    copiedRoute: "യാത്രാ വിവരം കോപ്പി ചെയ്തു!",
    printPlan: "പ്രിന്റ് / PDF"
  },
  en: {
    title: "Certificate & Service Navigator",
    badge: "Zero Wasted Trips Guide",
    subtitle: "Select the certificates you need and the IDs you hold. We calculate the optimal office visit sequence, official fees, and prerequisite documents.",
    selectState: "State & Rules:",
    goal: "Priority:",
    fewestVisits: "Fewest Visits",
    fastest: "Fastest Processing",
    lowestFee: "Lowest Fee",
    visits: "Visits",
    days: "Days",
    fee: "Fee",
    tabIntake: "Select Documents",
    tabPlan: "Office Roadmap",
    tabGraph: "Dependency Map",
    tabOcr: "Spelling & OCR",
    targetsTitle: "Certificates to Apply For",
    targetsSub: "Select the target certificates you need to obtain",
    heldTitle: "Documents Already in Hand",
    heldSub: "Select ID cards and proofs you already possess",
    selectAll: "Select All",
    clearAll: "Clear All",
    searchTargets: "Search certificates...",
    searchHeld: "Search your IDs...",
    solveBtn: "View Office Roadmap",
    copiedRoute: "Application plan copied to clipboard!",
    printPlan: "Print / Save PDF"
  },
  hi: {
    title: "सरकारी प्रमाण पत्र मार्गदर्शक",
    badge: "चक्कर बचाओ योजना",
    subtitle: "आवश्यक प्रमाण पत्र और उपलब्ध पहचान पत्र चुनें। हम आपको सही कार्यालय, सही क्रम, और सरकारी फीस बताएंगे।",
    selectState: "राज्य व सेवा केंद्र:",
    goal: "प्राथमिकता:",
    fewestVisits: "सबसे कम चक्कर",
    fastest: "जल्दी चाहिए",
    lowestFee: "कम खर्चा",
    visits: "चक्कर",
    days: "दिन",
    fee: "फीस",
    tabIntake: "दस्तावेज चुनें",
    tabPlan: "दफ्तर यात्रा प्लान",
    tabGraph: "संबंध नक्शा",
    tabOcr: "स्पेलिंग जांच",
    targetsTitle: "आवश्यक प्रमाण पत्र",
    targetsSub: "जो प्रमाण पत्र बनवाना चाहते हैं उन्हें चुनें",
    heldTitle: "उपलब्ध पहचान पत्र",
    heldSub: "जो पहचान पत्र आपके पास हैं उन्हें चुनें",
    selectAll: "सभी चुनें",
    clearAll: "सभी हटाएं",
    searchTargets: "प्रमाण पत्र खोजें...",
    searchHeld: "पहचान पत्र खोजें...",
    solveBtn: "दफ्तर प्लान देखें",
    copiedRoute: "योजना कॉपी हो गई!",
    printPlan: "प्रिंट / PDF"
  },
  te: {
    title: "సర్కారీ సర్టిఫికేట్ గైడ్",
    badge: "ఆఫీస్ తిరుగుళ్ళు లేని సహాయకి",
    subtitle: "కావలసిన సర్టిఫికేట్లు మరియు మీ వద్ద ఉన్న ఐడీలు ఎంచుకోండి. ఏ ఆఫీసుకు ముందు వెళ్ళాలో స్పష్టంగా చూపుతాము.",
    selectState: "రాష్ట్రం & పోర్టల్:",
    goal: "ప్రాధాన్యత:",
    fewestVisits: "తక్కువ తిరుగుళ్ళు",
    fastest: "త్వరగా పొందడం",
    lowestFee: "తక్కువ ఖర్చు",
    visits: "సందర్శనలు",
    days: "రోజులు",
    fee: "ఫీజు",
    tabIntake: "పత్రాలు ఎంచుకోండి",
    tabPlan: "ఆఫీస్ ప్లాన్",
    tabGraph: "సంబంధం మ్యాప్",
    tabOcr: "స్పెల్లింగ్ తనిఖీ",
    targetsTitle: "కావలసిన సర్టిఫికేట్లు",
    targetsSub: "మీకు కావలసిన సర్టిఫికేట్లను ఎంచుకోండి",
    heldTitle: "ఉన్న గుర్తింపు కార్డులు",
    heldSub: "మీ వద్ద ఉన్న గుర్తింపు కార్డులను ఎంచుకోండి",
    selectAll: "అన్నీ ఎంచుకోండి",
    clearAll: "అన్నీ తొలగించండి",
    searchTargets: "శోధించండి...",
    searchHeld: "పత్రాలు శోధించండి...",
    solveBtn: "ఆఫీస్ ప్లాన్ చూడండి",
    copiedRoute: "ప్లాన్ కాపీ చేయబడింది!",
    printPlan: "ప్రింట్ / PDF"
  },
  kn: {
    title: "ಸರ್ಕಾರಿ ಪ್ರಮಾಣಪತ್ರ ಮಾರ್ಗದರ್ಶಿ",
    badge: "ಕಚೇರಿ ಅಲೆದಾಟ ತಪ್ಪಿಸುವ ಸಹಾಯಕಿ",
    subtitle: "ನಿಮಗೆ ಬೇಕಾದ ಪ್ರಮಾಣಪತ್ರಗಳು ಮತ್ತು ನಿಮ್ಮ ಬಳಿ ಇರುವ ಗುರುತಿನ ಚೀಟಿಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಸರಿಯಾದ ಕಚೇರಿ ಕ್ರಮ ತಿಳಿಯಿರಿ.",
    selectState: "ರಾಜ್ಯ ಮತ್ತು ಸೇವಾ ಕೇಂದ್ರ:",
    goal: "ಗುರಿ:",
    fewestVisits: "ಕನಿಷ್ಠ ಅಲೆದಾಟ",
    fastest: "ಬೇಗನೆ ಪಡೆಯಲು",
    lowestFee: "ಕಡಿಮೆ ಶುಲ್ಕ",
    visits: "ಭೇಟಿಗಳು",
    days: "ದಿನಗಳು",
    fee: "ಶುಲ್ಕ",
    tabIntake: "ದಾಖಲೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    tabPlan: "ಕಚೇರಿ ಯೋಜನೆ",
    tabGraph: "ಲಿಂಕ್ ನಕ್ಷೆ",
    tabOcr: "ಕಾಗುಣಿತ ಪರೀಕ್ಷೆ",
    targetsTitle: "ಬೇಕಾದ ಪ್ರಮಾಣಪತ್ರಗಳು",
    targetsSub: "ನಿಮಗೆ ಬೇಕಾದ ಪ್ರಮಾಣಪತ್ರಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    heldTitle: "ಇರುವ ಗುರುತಿನ ಚೀಟಿಗಳು",
    heldSub: "ನಿಮ್ಮ ಬಳಿ ಇರುವ ದಾಖಲೆಗಳನ್ನು ಗುರುತು ಹಾಕಿ",
    selectAll: "ಎಲ್ಲವನ್ನೂ ಆಯ್ಕೆಮಾಡಿ",
    clearAll: "ಎಲ್ಲವನ್ನೂ ತೆರವುಗೊಳಿಸಿ",
    searchTargets: "ಹುಡುಕಿ...",
    searchHeld: "ದಾಖಲೆ ಹುಡುಕಿ...",
    solveBtn: "ಕಚೇರಿ ಯೋಜನೆ ನೋಡಿ",
    copiedRoute: "ಯೋಜನೆ ನಕಲಿಸಲಾಗಿದೆ!",
    printPlan: "ಪ್ರಿಂಟ್ / PDF"
  }
};

// Popular Quick-Pick Bundles for Faster Citizen Workflow
const QUICK_PRESETS = [
  {
    id: "student",
    label: "🎓 Student & Scholarship",
    targets: ["income_cert", "caste_cert", "nativity_cert"],
    desc: "Income, Community, & Nativity for admissions & state fee waivers"
  },
  {
    id: "farmer",
    label: "🌾 Farmer & Agriculture",
    targets: ["farmer_cert", "income_cert", "possession_valuation_cert"],
    desc: "PM-Kisan, subsidized power, agricultural loans & valuation"
  },
  {
    id: "housing",
    label: "🏠 Housing (LIFE / PMAY)",
    targets: ["landless_cert", "income_cert", "bpl_cert"],
    desc: "Landless certificate & BPL papers for government housing schemes"
  },
  {
    id: "business",
    label: "🏪 Business & Shop",
    targets: ["trade_license", "fssai_license", "udyam_msme_cert"],
    desc: "Municipal trade license, FSSAI registration & MSME certificate"
  },
  {
    id: "vital",
    label: "👶 Family & Vital Records",
    targets: ["birth_cert", "legal_heir_cert", "family_membership_cert"],
    desc: "Birth certificate, Legal Heir & family relationship records"
  }
];

export default function CertificateResolver({
  language = "en",
  selectedDistrict: propDistrict = "Kozhikode",
  selectedLocality: propLocality = "Azhiyur",
  selectedState: propState,
  onSelectPanchayat
}) {
  const currentLang = RESOLVER_TRANSLATIONS[language] ? language : "en";
  const t = RESOLVER_TRANSLATIONS[currentLang];

  // Location Selection State
  const [selectedDistrictName, setSelectedDistrictName] = useState(() => propDistrict || "Kozhikode");
  const [selectedPanchayatName, setSelectedPanchayatName] = useState(() => propLocality || "Azhiyur");

  // Sync when prop changes
  useEffect(() => {
    if (propDistrict && propDistrict !== "all") {
      setSelectedDistrictName(propDistrict);
    }
    if (propLocality && propLocality !== "all") {
      setSelectedPanchayatName(propLocality);
    }
    if (propState && (propState === "kerala" || propState === "karnataka" || propState === "tamilnadu" || propState === "andhrapradesh")) {
      setSelectedState(propState);
    }
  }, [propDistrict, propLocality, propState]);

  // State variables with localStorage persistence
  const [selectedState, setSelectedState] = useState(() => {
    return localStorage.getItem("gramseva_cert_state") || "kerala";
  });
  const [objective, setObjective] = useState(() => {
    return localStorage.getItem("gramseva_cert_objective") || "fewest_visits";
  });
  const [targetIds, setTargetIds] = useState(() => {
    try {
      const saved = localStorage.getItem("gramseva_cert_targets");
      return saved ? JSON.parse(saved) : ["income_cert", "landless_cert"];
    } catch (e) {
      return ["income_cert", "landless_cert"];
    }
  });
  const [heldDocIds, setHeldDocIds] = useState(() => {
    try {
      const saved = localStorage.getItem("gramseva_cert_held");
      return saved ? JSON.parse(saved) : ["aadhaar", "ration_card", "sslc_marksheet", "electricity_bill"];
    } catch (e) {
      return ["aadhaar", "ration_card", "sslc_marksheet", "electricity_bill"];
    }
  });

  // Procedure Modal state
  const [selectedCertForModal, setSelectedCertForModal] = useState(null);

  // Active view: 'intake' | 'plan' | 'graph' | 'ocr'
  const [activeSubTab, setActiveSubTab] = useState("plan");
  // Intake view mode: 'targets' | 'held' | 'both'
  const [intakeViewMode, setIntakeViewMode] = useState("targets");
  const [copiedLink, setCopiedLink] = useState(false);

  // Search & Filters state
  const [targetSearchQuery, setTargetSearchQuery] = useState("");
  const [targetCategoryFilter, setTargetCategoryFilter] = useState("all");
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [docCategoryFilter, setDocCategoryFilter] = useState("all");
  const [expandedStepRoute, setExpandedStepRoute] = useState(null);

  // OCR Scanned documents & inspection state
  const [scannedDocs, setScannedDocs] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanDocType, setScanDocType] = useState("aadhaar");
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [editingDocId, setEditingDocId] = useState(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedCertForModal(null);
      }
    };
    if (selectedCertForModal) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedCertForModal]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("gramseva_cert_state", selectedState);
  }, [selectedState]);

  useEffect(() => {
    localStorage.setItem("gramseva_cert_objective", objective);
  }, [objective]);

  useEffect(() => {
    localStorage.setItem("gramseva_cert_targets", JSON.stringify(targetIds));
  }, [targetIds]);

  useEffect(() => {
    localStorage.setItem("gramseva_cert_held", JSON.stringify(heldDocIds));
  }, [heldDocIds]);

  // Load Preset Sample Document
  const handleLoadPreset = (preset) => {
    const newDoc = { ...preset, id: `${preset.id}_${Date.now()}` };
    setScannedDocs((prev) => [...prev, newDoc]);
    if (!heldDocIds.includes(preset.documentTypeId)) {
      setHeldDocIds((prev) => [...prev, preset.documentTypeId]);
    }
  };

  // Sync documents directly from Digital Document Wallet
  const handleSyncFromWallet = () => {
    try {
      const savedDocs = localStorage.getItem("gramseva_digital_wallet_docs_v2");
      if (savedDocs) {
        const parsed = JSON.parse(savedDocs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const typeIds = parsed.map((d) => d.typeId || d.id);
          const combined = Array.from(new Set([...heldDocIds, ...typeIds]));
          setHeldDocIds(combined);
          localStorage.setItem("gramseva_cert_held", JSON.stringify(combined));
          return;
        }
      }
      const legacy = localStorage.getItem("gramseva_held_docs");
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        const combined = Array.from(new Set([...heldDocIds, ...parsedLegacy]));
        setHeldDocIds(combined);
        localStorage.setItem("gramseva_cert_held", JSON.stringify(combined));
      }
    } catch (e) {
      console.error("Failed to sync from wallet", e);
    }
  };

  const handleUpdateExtractedField = (docId, fieldKey, newValue) => {
    setScannedDocs((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            extractedData: {
              ...doc.extractedData,
              [fieldKey]: newValue
            }
          };
        }
        return doc;
      })
    );
  };

  // AO* Solver computation
  const solverResult = useMemo(() => {
    return solveCertificateGraph({
      targetIds,
      targetCertIds: targetIds,
      heldDocIds,
      stateKey: selectedState,
      objective
    });
  }, [targetIds, heldDocIds, selectedState, objective]);

  // Inspect Mismatches
  const mismatchReport = useMemo(() => {
    return inspectDocumentMismatches(scannedDocs);
  }, [scannedDocs]);

  // Toggle Target Certificate
  const toggleTarget = (id) => {
    setTargetIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter((t) => t !== id);
      } else {
        setHeldDocIds((held) => held.filter((h) => h !== id));
        return [...prev, id];
      }
    });
  };

  const selectAllTargets = () => {
    const allIds = TARGET_CERTIFICATES.map((t) => t.id);
    setTargetIds(allIds);
    setHeldDocIds((held) => held.filter((h) => !allIds.includes(h)));
  };

  const clearAllTargets = () => {
    setTargetIds([]);
  };

  // Toggle Held Document
  const toggleHeldDoc = (id) => {
    setHeldDocIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter((d) => d !== id);
      } else {
        setTargetIds((targets) => targets.filter((t) => t !== id));
        return [...prev, id];
      }
    });
  };

  const selectAllHeld = () => {
    const allIds = ANCHOR_DOCUMENTS.map((d) => d.id);
    setHeldDocIds(allIds);
  };

  const clearAllHeld = () => {
    setHeldDocIds([]);
  };

  const applyPresetBundle = (preset) => {
    setTargetIds((prev) => Array.from(new Set([...prev, ...preset.targets])));
    setHeldDocIds((held) => held.filter((h) => !preset.targets.includes(h)));
  };

  const handleSharePlan = () => {
    const targetNames = targetIds
      .map((id) => TARGET_CERTIFICATES.find((t) => t.id === id)?.name || id)
      .join(", ");
    
    const summaryText = `🌾 GramSeva Certificate Roadmap (${selectedState.toUpperCase()}):\nTargets: ${targetNames}\nVisits Required: ${solverResult.totalVisits}\nEstimated Days: ~${solverResult.totalDays}\nTotal Official Fees: ₹${solverResult.totalFee}\nSteps:\n` +
      solverResult.executionSteps.map((s, idx) => `${idx + 1}. ${s.title} (${s.office})`).join("\n");

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handlePrintPlan = () => {
    window.print();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const scanned = await scanDocumentPhoto(file, scanDocType);
      setScannedDocs((prev) => [...prev, scanned]);
      
      if (!heldDocIds.includes(scanDocType)) {
        setHeldDocIds((prev) => [...prev, scanDocType]);
      }
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  const removeScannedDoc = (id) => {
    setScannedDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const currentState = STATE_DATASETS[selectedState] || STATE_DATASETS.kerala;

  // Filtered Target Certificates list
  const filteredTargetCerts = useMemo(() => {
    return TARGET_CERTIFICATES.filter((cert) => {
      const q = targetSearchQuery.toLowerCase();
      const matchesSearch = !q || cert.name.toLowerCase().includes(q) || cert.desc.toLowerCase().includes(q);
      const matchesCat = targetCategoryFilter === "all" || cert.category === targetCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [targetSearchQuery, targetCategoryFilter]);

  // Filtered Held Docs list
  const filteredAnchorDocs = useMemo(() => {
    return ANCHOR_DOCUMENTS.filter((doc) => {
      const q = docSearchQuery.toLowerCase();
      const matchesSearch = !q || doc.name.toLowerCase().includes(q) || doc.desc.toLowerCase().includes(q);
      const matchesCat = docCategoryFilter === "all" || doc.category === docCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [docSearchQuery, docCategoryFilter]);

  // Certificate Modal details memoized
  const modalCertDetails = useMemo(() => {
    if (!selectedCertForModal) return null;
    return getCertificateDetails(selectedCertForModal, selectedState);
  }, [selectedCertForModal, selectedState]);

  // Target Categories list for clean chip filtering
  const targetCategories = [
    { id: "all", label: "All Papers" },
    { id: "revenue", label: "Income & Land" },
    { id: "residence", label: "Residence & Domicile" },
    { id: "obscure", label: "Special Schemes" },
    { id: "vital", label: "Birth & Family" },
    { id: "education", label: "Education" },
    { id: "business", label: "Business & Trade" }
  ];

  // Held Categories list for clean chip filtering
  const heldCategories = [
    { id: "all", label: "All IDs" },
    { id: "identity", label: "Aadhaar & PAN" },
    { id: "residence", label: "Ration & Bills" },
    { id: "income", label: "Salary & Tax" },
    { id: "education", label: "School & SSLC" },
    { id: "property", label: "Land & Deeds" }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-stone-50 text-slate-900 overflow-y-auto scrollbar-none pb-28">
      {/* Top Refined Header Bar */}
      <div className="bg-white border-b border-stone-200/90 shadow-2xs print:bg-white print:border-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-200/80">
                  {t.badge}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {currentState.portalName}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-classical mt-0.5">
                {t.title}
              </h1>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed mt-0.5">
                {t.subtitle}
              </p>
            </div>

            {/* Compact State & Panchayat Switcher */}
            <div className="flex items-center gap-2 bg-stone-100/90 p-1.5 rounded-xl border border-stone-200/80 shrink-0 self-start md:self-auto">
              <div className="flex items-center gap-1 text-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 ml-1 shrink-0" />
                <select
                  value={selectedState}
                  onChange={(e) => {
                    const st = e.target.value;
                    setSelectedState(st);
                    if (st === "karnataka") {
                      setSelectedDistrictName("Dakshina Kannada");
                      setSelectedPanchayatName("Mangaluru");
                      if (onSelectPanchayat) onSelectPanchayat("Dakshina Kannada", "Mangaluru");
                    } else if (st === "tamilnadu") {
                      setSelectedDistrictName("Coimbatore");
                      setSelectedPanchayatName("Pollachi North");
                      if (onSelectPanchayat) onSelectPanchayat("Coimbatore", "Pollachi North");
                    } else if (st === "andhrapradesh") {
                      setSelectedDistrictName("Tirupati");
                      setSelectedPanchayatName("Chandragiri");
                      if (onSelectPanchayat) onSelectPanchayat("Tirupati", "Chandragiri");
                    } else if (st === "kerala") {
                      setSelectedDistrictName("Kozhikode");
                      setSelectedPanchayatName("Azhiyur");
                      if (onSelectPanchayat) onSelectPanchayat("Kozhikode", "Azhiyur");
                    }
                  }}
                  className="bg-white border border-stone-200 text-slate-800 font-bold rounded-lg px-2 py-1 text-xs outline-none focus:border-emerald-600 shadow-2xs"
                >
                  <option value="kerala">🌴 Kerala</option>
                  <option value="karnataka">🏰 Karnataka</option>
                  <option value="tamilnadu">🏛️ Tamil Nadu</option>
                  <option value="andhrapradesh">🌊 Andhra Pradesh</option>
                  <option value="pan_india">🌾 Other States</option>
                </select>

                {selectedState === "kerala" && (
                  <select
                    value={selectedDistrictName}
                    onChange={(e) => {
                      const newDist = e.target.value;
                      setSelectedDistrictName(newDist);
                      const firstP = KERALA_PANCHAYATS_BY_DISTRICT[newDist]?.[0]?.en || "Azhiyur";
                      setSelectedPanchayatName(firstP);
                      if (onSelectPanchayat) onSelectPanchayat(newDist, firstP);
                    }}
                    className="bg-white border border-stone-200 text-slate-800 font-semibold rounded-lg px-2 py-1 text-xs outline-none focus:border-emerald-600 shadow-2xs max-w-[120px] truncate"
                  >
                    {KERALA_DISTRICTS_LIST.map((dist) => (
                      <option key={dist.id} value={dist.en}>
                        {dist.en}
                      </option>
                    ))}
                  </select>
                )}

                {selectedState === "karnataka" && (
                  <select
                    value={selectedDistrictName}
                    onChange={(e) => {
                      const newDist = e.target.value;
                      setSelectedDistrictName(newDist);
                      const firstP = KARNATAKA_PANCHAYATS_BY_DISTRICT[newDist]?.[0]?.en || "Mangaluru";
                      setSelectedPanchayatName(firstP);
                      if (onSelectPanchayat) onSelectPanchayat(newDist, firstP);
                    }}
                    className="bg-white border border-stone-200 text-slate-800 font-semibold rounded-lg px-2 py-1 text-xs outline-none focus:border-emerald-600 shadow-2xs max-w-[120px] truncate"
                  >
                    {KARNATAKA_DISTRICTS_LIST.map((dist) => (
                      <option key={dist.id} value={dist.en}>
                        {dist.en}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 w-full space-y-4">
        {/* Streamlined Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-2xl border border-stone-300/80 select-none print:hidden overflow-x-auto scrollbar-none">
          {[
            {
              id: "intake",
              label: t.tabIntake,
              icon: <CheckSquare className="w-4 h-4" />,
              badge: `${targetIds.length} Needed`
            },
            {
              id: "plan",
              label: t.tabPlan,
              icon: <Zap className="w-4 h-4" />,
              badge: solverResult.totalVisits ? `${solverResult.totalVisits} Visits` : null
            },
            {
              id: "graph",
              label: t.tabGraph,
              icon: <GitFork className="w-4 h-4" />
            },
            {
              id: "ocr",
              label: t.tabOcr,
              icon: <Camera className="w-4 h-4" />,
              alert: mismatchReport.hasMismatches
            }
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-white text-emerald-950 shadow-xs border border-stone-200/80 font-black"
                    : "text-slate-600 hover:text-slate-900 hover:bg-stone-200/50"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                    isActive ? "bg-emerald-100 text-emerald-900" : "bg-stone-300 text-slate-700"
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {tab.alert && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* SUB-TAB 1: CLEAN DECLUTTERED DOCUMENT INTAKE */}
        {/* ========================================================= */}
        {activeSubTab === "intake" && (
          <div className="space-y-4 animate-fade-in">
            {/* Quick Popular Bundles (1-Click selection) */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Quick Preset Bundles
                </span>
                <span className="text-[11px] text-slate-500">
                  Click to add common certificate combinations
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
                {QUICK_PRESETS.map((p) => {
                  const allActive = p.targets.every((tId) => targetIds.includes(tId));
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPresetBundle(p)}
                      title={p.desc}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                        allActive
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                          : "bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100"
                      }`}
                    >
                      <span>{p.label}</span>
                      {allActive && <Check className="w-3 h-3 text-emerald-700" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* View Switcher: Needed vs Held vs Both */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl border border-stone-300/80 w-fit">
                <button
                  type="button"
                  onClick={() => setIntakeViewMode("targets")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    intakeViewMode === "targets"
                      ? "bg-white text-emerald-950 shadow-2xs font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Certificates to Apply For ({targetIds.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIntakeViewMode("held")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    intakeViewMode === "held"
                      ? "bg-white text-emerald-950 shadow-2xs font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>IDs in Hand ({heldDocIds.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIntakeViewMode("both")}
                  className={`hidden md:flex px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer items-center gap-1.5 ${
                    intakeViewMode === "both"
                      ? "bg-white text-emerald-950 shadow-2xs font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>Side-by-Side</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncFromWallet}
                  className="text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Import documents from your Digital Wallet"
                >
                  <FolderCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Sync from Wallet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("plan")}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-3.5 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>{t.solveBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main Selection Area */}
            <div className={`grid gap-4 ${intakeViewMode === "both" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
              {/* PANEL A: TARGET CERTIFICATES */}
              {(intakeViewMode === "targets" || intakeViewMode === "both") && (
                <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200/80 pb-2.5">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <FileCheck2 className="w-4 h-4 text-emerald-700" />
                        {t.targetsTitle}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {t.targetsSub} ({filteredTargetCerts.length} items)
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={selectAllTargets}
                        className="text-[10px] font-bold text-emerald-800 hover:bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300 transition cursor-pointer"
                      >
                        {t.selectAll}
                      </button>
                      <button
                        type="button"
                        onClick={clearAllTargets}
                        className="text-[10px] font-bold text-slate-600 hover:bg-stone-100 px-2 py-0.5 rounded-md border border-stone-300 transition cursor-pointer"
                      >
                        {t.clearAll}
                      </button>
                    </div>
                  </div>

                  {/* Search & Category Filter Pills */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder={t.searchTargets}
                        value={targetSearchQuery}
                        onChange={(e) => setTargetSearchQuery(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-600 focus:bg-white transition"
                      />
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
                      {targetCategories.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setTargetCategoryFilter(c.id)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                            targetCategoryFilter === c.id
                              ? "bg-slate-900 text-white font-extrabold"
                              : "bg-stone-100 hover:bg-stone-200 text-slate-600"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
                    {filteredTargetCerts.map((cert) => {
                      const isSelected = targetIds.includes(cert.id);
                      return (
                        <div
                          key={cert.id}
                          onClick={() => toggleTarget(cert.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition select-none flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? "bg-emerald-50/90 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400/40 shadow-2xs"
                              : "bg-white border-stone-200 hover:border-stone-300 text-slate-800"
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="pt-0.5 shrink-0">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-emerald-700" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="font-extrabold text-slate-900 block leading-tight">
                                {cert.name}
                              </span>
                              <span className="text-[11px] text-slate-500 block leading-snug line-clamp-1 mt-0.5">
                                {cert.desc}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCertForModal(cert.id);
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-emerald-800 hover:bg-emerald-100 transition cursor-pointer shrink-0"
                              title="View full application guide"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PANEL B: HELD / POSSESSED DOCUMENTS */}
              {(intakeViewMode === "held" || intakeViewMode === "both") && (
                <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200/80 pb-2.5">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        {t.heldTitle}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {t.heldSub} ({filteredAnchorDocs.length} items)
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={selectAllHeld}
                        className="text-[10px] font-bold text-emerald-800 hover:bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300 transition cursor-pointer"
                      >
                        {t.selectAll}
                      </button>
                      <button
                        type="button"
                        onClick={clearAllHeld}
                        className="text-[10px] font-bold text-slate-600 hover:bg-stone-100 px-2 py-0.5 rounded-md border border-stone-300 transition cursor-pointer"
                      >
                        {t.clearAll}
                      </button>
                    </div>
                  </div>

                  {/* Search & Category Filter Pills */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder={t.searchHeld}
                        value={docSearchQuery}
                        onChange={(e) => setDocSearchQuery(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-600 focus:bg-white transition"
                      />
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
                      {heldCategories.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setDocCategoryFilter(c.id)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                            docCategoryFilter === c.id
                              ? "bg-slate-900 text-white font-extrabold"
                              : "bg-stone-100 hover:bg-stone-200 text-slate-600"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
                    {filteredAnchorDocs.map((doc) => {
                      const isHeld = heldDocIds.includes(doc.id);
                      return (
                        <div
                          key={doc.id}
                          onClick={() => toggleHeldDoc(doc.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition select-none flex items-start gap-2.5 ${
                            isHeld
                              ? "bg-emerald-50/90 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400/40 shadow-2xs font-semibold"
                              : "bg-white border-stone-200 hover:border-stone-300 text-slate-700"
                          }`}
                        >
                          <div className="pt-0.5 shrink-0">
                            {isHeld ? (
                              <CheckSquare className="w-4 h-4 text-emerald-700" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-extrabold text-slate-900 block truncate">
                                {doc.name}
                              </span>
                              {doc.anchor && (
                                <span className="text-[8px] font-extrabold uppercase text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200 shrink-0">
                                  Anchor
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block leading-snug line-clamp-1 mt-0.5">
                              {doc.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUB-TAB 2: CLEAN STEP-BY-STEP OFFICE ROADMAP */}
        {/* ========================================================= */}
        {activeSubTab === "plan" && (
          <div className="space-y-4 animate-fade-in">
            {/* Key Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-stone-200/90 p-3.5 rounded-2xl shadow-2xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Total Office Visits</span>
                <span className="text-xl font-black text-slate-900 block mt-0.5 font-classical">{solverResult.totalVisits} Visit(s)</span>
                {solverResult.savedVisits > 0 ? (
                  <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                    Saved {solverResult.savedVisits} extra trip(s)
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 block mt-0.5">Direct visit path</span>
                )}
              </div>

              <div className="bg-white border border-stone-200/90 p-3.5 rounded-2xl shadow-2xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Processing Time</span>
                <span className="text-xl font-black text-slate-900 block mt-0.5 font-classical">~{solverResult.totalDays} Days</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">e-District timeline</span>
              </div>

              <div className="bg-white border border-stone-200/90 p-3.5 rounded-2xl shadow-2xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Official Govt Fee</span>
                <span className="text-xl font-black text-emerald-800 block mt-0.5 font-classical">₹{solverResult.totalFee}</span>
                {solverResult.savedFees > 0 ? (
                  <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                    Saved ₹{solverResult.savedFees}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 block mt-0.5">Zero agent charges</span>
                )}
              </div>

              <div className="bg-white border border-stone-200/90 p-3.5 rounded-2xl shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Target Goals</span>
                  <span className="text-xl font-black text-slate-900 block mt-0.5 font-classical">{targetIds.length} Goal(s)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("intake")}
                  className="text-[10px] font-bold text-emerald-800 hover:underline block mt-1 cursor-pointer text-left"
                >
                  Edit selection →
                </button>
              </div>
            </div>

            {/* Strategy & Optimization Bar */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 shrink-0">
                  Optimization Priority:
                </span>
                <div className="flex items-center gap-1.5">
                  {[
                    { id: "fewest_visits", label: t.fewestVisits },
                    { id: "fastest", label: t.fastest },
                    { id: "lowest_fee", label: t.lowestFee }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setObjective(opt.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                        objective === opt.id
                          ? "bg-slate-900 text-white border-slate-900 font-extrabold shadow-2xs"
                          : "bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSharePlan}
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title="Copy Plan Summary"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? "Copied!" : "Share"}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintPlan}
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title="Print Application Roadmap"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Execution Steps Timeline */}
            <div className="space-y-3">
              {targetIds.length === 0 ? (
                <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-8 text-center space-y-3">
                  <FileCheck2 className="w-10 h-10 text-emerald-700 mx-auto" />
                  <h4 className="font-black text-slate-900 text-base">No Target Certificates Selected</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Pick one or more certificates in <strong>Tab 1: Select Documents</strong> to generate your step-by-step visit plan.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab("intake")}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                  >
                    Select Certificates <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : solverResult.executionSteps.length === 0 ? (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                  <h4 className="font-black text-slate-900 text-base">You Already Hold All Required Documents!</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Based on your possessed documents selection, you already have all prerequisite and target certificates needed.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab("intake")}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                  >
                    Add More Target Goals <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {solverResult.executionSteps.map((step) => {
                    const isExpanded = expandedStepRoute === step.nodeId;
                    const altRoutes = currentState.routes[step.nodeId] || [];

                    return (
                      <div
                        key={step.nodeId}
                        className={`bg-white border rounded-2xl p-4 sm:p-5 transition shadow-2xs ${
                          step.isTarget
                            ? "border-emerald-300 ring-1 ring-emerald-500/20"
                            : "border-stone-200/90"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            {/* Step Number Badge */}
                            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs font-classical">
                              {step.stepNumber}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-black uppercase text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                  {step.office}
                                </span>
                                {step.isTarget && (
                                  <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    Target Goal
                                  </span>
                                )}
                              </div>

                              <h4 className="font-classical text-base font-black text-slate-900 mt-1">
                                {step.title}
                              </h4>

                              <p className="text-xs text-slate-600 mt-0.5">
                                Route: <strong className="text-slate-900">{step.routeLabel}</strong>
                              </p>
                            </div>
                          </div>

                          {/* Quick Metrics & Info Button */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <div className="text-right text-xs bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                              <span className="font-extrabold text-slate-900 block">{step.visits} Visit &middot; ~{step.days} Days</span>
                              <span className="text-[10px] text-emerald-800 font-bold block">Fee: ₹{step.fee}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedCertForModal(step.nodeId)}
                              className="text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl px-3 py-2 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                            >
                              <Info className="w-3.5 h-3.5 text-emerald-700" />
                              <span className="hidden sm:inline">Details</span>
                            </button>
                          </div>
                        </div>

                        {/* Prerequisites Breakdown */}
                        <div className="mt-3 pt-3 border-t border-stone-100">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                            Prerequisites Required Before Visit:
                          </span>

                          <div className="flex flex-wrap gap-1.5">
                            {step.prerequisites.map((pId) => {
                              const isHeld = heldDocIds.includes(pId);
                              const anchor = ANCHOR_DOCUMENTS.find((a) => a.id === pId);
                              const pName = anchor ? anchor.name : (currentState.nodes[pId]?.name || pId);

                              return (
                                <span
                                  key={pId}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${
                                    isHeld
                                      ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                                      : "bg-amber-50 text-amber-900 border-amber-200"
                                  }`}
                                >
                                  {isHeld ? (
                                    <Check className="w-3 h-3 text-emerald-700" />
                                  ) : (
                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                  )}
                                  <span>{pName}</span>
                                  {isHeld && <span className="text-[9px] text-emerald-700">(Held)</span>}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Counter Prevention Tip */}
                        {step.tips && (
                          <div className="mt-3 bg-amber-50/80 border border-amber-200/90 p-2.5 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <p className="text-xs leading-snug">{step.tips}</p>
                          </div>
                        )}

                        {/* Alternative Routes Accordion */}
                        {altRoutes.length > 1 && (
                          <div className="mt-2.5 pt-2 border-t border-stone-100">
                            <button
                              type="button"
                              onClick={() => setExpandedStepRoute(isExpanded ? null : step.nodeId)}
                              className="text-xs font-bold text-slate-600 hover:text-emerald-700 transition flex items-center gap-1 cursor-pointer"
                            >
                              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                              <span>Why this route? View {altRoutes.length - 1} Alternative Route(s)</span>
                            </button>

                            {isExpanded && (
                              <div className="mt-2 space-y-2 pl-3 border-l-2 border-stone-200 animate-fade-in">
                                {altRoutes.map((alt) => {
                                  const isSelected = alt.id === step.routeLabel || alt.label === step.routeLabel;
                                  return (
                                    <div
                                      key={alt.id}
                                      className={`p-2.5 rounded-xl text-xs border ${
                                        isSelected
                                          ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                                          : "bg-white border-stone-200 text-slate-700"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-black text-slate-900">{alt.label}</span>
                                        {isSelected && (
                                          <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                                            Recommended
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-slate-500 mt-0.5">
                                        Office: {alt.office} &middot; {alt.visits} Visit &middot; ~{alt.days} Days &middot; ₹{alt.fee}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUB-TAB 3: DEPENDENCY GRAPH MAP */}
        {/* ========================================================= */}
        {activeSubTab === "graph" && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <GitFork className="w-4 h-4 text-emerald-700" />
                    Interactive Certificate Dependency Map
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Visual breakdown of target goals and prerequisite document trees.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-bold">
                    Held ID
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold">
                    Target Goal
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {targetIds.map((tId) => {
                  const targetInfo = TARGET_CERTIFICATES.find((t) => t.id === tId) || { name: tId };
                  const chosenRoute = solverResult.chosenRoutes[tId];

                  return (
                    <div key={tId} className="border border-stone-200 rounded-xl p-3.5 bg-stone-50/50 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-lg bg-amber-100 text-amber-900">
                            <Zap className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase text-amber-800 block">Target Goal</span>
                            <h4 className="font-classical text-sm font-black text-slate-900">{targetInfo.name}</h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {chosenRoute && (
                            <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              {chosenRoute.label}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedCertForModal(tId)}
                            className="p-1 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-900 rounded-lg border border-stone-200 transition cursor-pointer"
                            title="View procedure"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Prerequisites Branches */}
                      {chosenRoute && (
                        <div className="pl-3 border-l-2 border-emerald-500 space-y-1.5">
                          <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
                            Prerequisites:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {chosenRoute.prerequisites.map((pId) => {
                              const isHeld = heldDocIds.includes(pId);
                              const anchor = ANCHOR_DOCUMENTS.find((a) => a.id === pId);
                              const pName = anchor ? anchor.name : (currentState.nodes[pId]?.name || pId);

                              return (
                                <div
                                  key={pId}
                                  onClick={() => setSelectedCertForModal(pId)}
                                  className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-2 cursor-pointer transition ${
                                    isHeld
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-950 font-bold"
                                      : "bg-white border-stone-200 text-slate-800"
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    {isHeld ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                    ) : (
                                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    )}
                                    <span className="truncate">{pName}</span>
                                  </div>
                                  <Info className="w-3 h-3 text-slate-400 shrink-0" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUB-TAB 4: OCR INTAKE & SPELLING INSPECTOR */}
        {/* ========================================================= */}
        {activeSubTab === "ocr" && (
          <div className="space-y-4 animate-fade-in">
            {/* Presets Bar */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  Simulate Document Scanning
                </span>
                <span className="text-[11px] text-slate-500">
                  Test automatic OCR text extraction & spelling validation
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
                {SAMPLE_DOCUMENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleLoadPreset(preset)}
                    className="bg-stone-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 border border-stone-200 hover:border-emerald-300 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>+ Load {preset.documentTypeId.replace("_", " ").toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scanner Upload Control */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    Document Photo Intake & Discrepancy Check
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Extract Name, DOB, & Address to catch spelling discrepancies across documents.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={scanDocType}
                    onChange={(e) => setScanDocType(e.target.value)}
                    className="bg-stone-50 border border-stone-200 text-slate-800 font-bold rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-emerald-600"
                  >
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="ration_card">Ration Card</option>
                    <option value="pan_card">PAN Card</option>
                    <option value="sslc_marksheet">10th / SSLC Marksheet</option>
                  </select>

                  <label className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Scan</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Scanned Docs Grid */}
              {isScanning && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-xs text-emerald-900 font-bold animate-pulse flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                  Extracting Name, DOB & Document Details...
                </div>
              )}

              {scannedDocs.length === 0 ? (
                <div className="bg-stone-50 border border-dashed border-stone-200 rounded-xl p-6 text-center text-xs text-slate-500 space-y-1.5">
                  <Camera className="w-8 h-8 text-slate-300 mx-auto" />
                  <span className="font-black text-slate-800 text-xs block">No Document Photos Scanned</span>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Click <strong>Upload Scan</strong> or pick a sample preset above to test spelling discrepancy detection.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scannedDocs.map((doc) => {
                    const isHeld = heldDocIds.includes(doc.documentTypeId);
                    return (
                      <div key={doc.id} className="border border-stone-200 rounded-xl p-3 bg-stone-50/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                            {doc.documentTypeId.replace("_", " ").toUpperCase()}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeScannedDoc(doc.id)}
                            className="text-slate-400 hover:text-red-600 p-1 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-xs space-y-1 text-slate-700 bg-white p-2.5 rounded-lg border border-stone-200">
                          <div><strong>Name:</strong> {doc.extractedData.name}</div>
                          <div><strong>DOB:</strong> {doc.extractedData.dob}</div>
                          <div><strong>Number:</strong> <span className="font-mono">{doc.extractedData.documentNumber}</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Discrepancy Report */}
            {scannedDocs.length > 0 && (
              <div className={`border rounded-2xl p-4 shadow-2xs space-y-2.5 ${
                mismatchReport.hasMismatches ? "bg-amber-50/80 border-amber-200" : "bg-emerald-50/80 border-emerald-200"
              }`}>
                <div className="flex items-center gap-2">
                  {mismatchReport.hasMismatches ? (
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  )}
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                    {mismatchReport.hasMismatches ? "Spelling Discrepancies Found" : "All Documents Match Perfectly"}
                  </h4>
                </div>
                <p className="text-xs text-slate-700">{mismatchReport.summary}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* PROCEDURE MODAL (Rendered via React Portal) */}
      {/* ========================================================= */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedCertForModal && modalCertDetails && (
            <div
              className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 flex items-center justify-center cursor-pointer"
              onClick={() => setSelectedCertForModal(null)}
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border border-stone-200 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden text-slate-900 relative cursor-default shrink-0"
              >
                {/* Pinned Header */}
                <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between gap-3 shrink-0 border-b border-slate-800">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                      {modalCertDetails.category} &middot; {currentState.stateName}
                    </span>
                    <h3 className="font-classical text-base font-black text-white leading-tight truncate mt-0.5">
                      {modalCertDetails.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCertForModal(null)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Info Bar */}
                <div className="bg-stone-100 border-b border-stone-200 px-3 py-2 grid grid-cols-4 gap-2 text-center text-xs shrink-0">
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-stone-200 truncate">
                    <span className="text-[8px] font-bold text-slate-400 uppercase block">Office</span>
                    <span className="font-extrabold text-slate-900 text-[11px] truncate block">{modalCertDetails.authority}</span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-stone-200">
                    <span className="text-[8px] font-bold text-slate-400 uppercase block">Visits</span>
                    <span className="font-extrabold text-slate-900 text-[11px] block">{modalCertDetails.visits}</span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-stone-200">
                    <span className="text-[8px] font-bold text-slate-400 uppercase block">Timeline</span>
                    <span className="font-extrabold text-slate-900 text-[11px] block">~{modalCertDetails.days}d</span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-stone-200">
                    <span className="text-[8px] font-bold text-slate-400 uppercase block">Fee</span>
                    <span className="font-extrabold text-emerald-800 text-[11px] block">₹{modalCertDetails.fee}</span>
                  </div>
                </div>

                {/* Scrollable Body */}
                <div className="p-4 overflow-y-auto min-h-0 space-y-3.5 flex-1 text-xs scrollbar-thin">
                  {/* 1. What is required */}
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-stone-100 pb-1 mb-1.5 flex items-center gap-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                      1. Required Documents
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {modalCertDetails.whatRequired.map((req, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-slate-800 text-[11px] flex items-center gap-1.5 truncate"
                        >
                          <Check className="w-3 h-3 text-emerald-700 shrink-0" />
                          <span className="truncate">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Where to get */}
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-stone-100 pb-1 mb-1.5 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                      2. Office & Counter
                    </h4>
                    <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 rounded-xl text-[11px] text-slate-800">
                      <strong>Office: </strong>{modalCertDetails.whereToGet}
                    </div>
                  </div>

                  {/* 3. How to apply */}
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-stone-100 pb-1 mb-1.5 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-700" />
                      3. Application Steps
                    </h4>
                    <div className="space-y-1.5">
                      {modalCertDetails.howToGet.map((stepStr, idx) => (
                        <div key={idx} className="bg-stone-50 border border-stone-200 p-2 rounded-lg text-[11px] text-slate-800 flex items-start gap-2">
                          <span className="w-4 h-4 rounded bg-slate-900 text-white font-black text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{stepStr.replace(/^\d+\.\s*/, "")}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Tips */}
                  {modalCertDetails.tips && (
                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-900">
                      <strong>Pro Tip: </strong>{modalCertDetails.tips}
                    </div>
                  )}
                </div>

                {/* Pinned Footer */}
                <div className="bg-stone-100 border-t border-stone-200 px-4 py-3 flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      toggleTarget(modalCertDetails.certId);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      targetIds.includes(modalCertDetails.certId)
                        ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                        : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                    }`}
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>
                      {targetIds.includes(modalCertDetails.certId) ? "Remove Goal" : "+ Add to My Goals"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCertForModal(null)}
                    className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-slate-800 text-xs font-bold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
