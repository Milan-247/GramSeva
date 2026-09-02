import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FolderCheck,
  ShieldCheck,
  Plus,
  Search,
  Printer,
  Copy,
  Check,
  Trash2,
  Edit3,
  QrCode,
  FileText,
  AlertCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
  Camera,
  Upload,
  Download,
  Share2,
  RefreshCw,
  Landmark,
  Shield,
  FileCheck,
  CreditCard,
  Vote,
  Award,
  Sprout,
  HeartHandshake,
  Car,
  Baby,
  Accessibility,
  ShoppingCart,
  BadgeIndianRupee,
  Fingerprint,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  User,
  CheckCircle2,
  X,
  Maximize2,
  CheckSquare,
  Lock
} from "lucide-react";
import {
  DOCUMENT_CATEGORIES,
  STANDARD_DOCUMENT_TYPES,
  INITIAL_SAMPLE_WALLET_DOCUMENTS
} from "../data/walletDocumentPresets";
import { scanDocumentPhoto, inspectDocumentMismatches, SAMPLE_DOCUMENT_PRESETS } from "../utils/documentOcr";

// Multilingual labels for Document Wallet
const WALLET_TRANSLATIONS = {
  en: {
    title: "Digital Document Wallet & Vault",
    badge: "Encrypted & Offline Cached",
    subtitle: "Secure digital locker for ration cards, income certificates, land deeds, and identity proofs for village counter applications.",
    totalDocs: "Total Documents",
    verified: "e-District Verified",
    permanent: "Permanent Records",
    expiringAlert: "Annual Renewal Needed",
    searchPlaceholder: "Search by title, number, holder, authority, or notes...",
    addDocBtn: "Add Document",
    scanOcrBtn: "Scan & OCR Photo",
    mismatchBtn: "Spelling Check",
    loadSampleBtn: "Sample Packet",
    exportBtn: "Export Backup",
    importBtn: "Import",
    printSlipBtn: "Print Checklist",
    emptyTitle: "Your Document Wallet is Empty",
    emptySub: "Store your Aadhaar, Ration Card, Income Certificate, and Land Tax receipts to access them anytime at the Panchayat office.",
    viewCard: "Digital Slip",
    editDoc: "Edit",
    deleteDoc: "Remove",
    showNo: "Show Number",
    hideNo: "Hide Number",
    copied: "Copied to clipboard!",
    verifiedBadge: "Verified",
    permanentBadge: "Life-long",
    validUntil: "Valid until",
    expired: "Expired / Renewal Needed",
    openPlanner: "Plan Office Route with These Docs",
    modalAddTitle: "Add Document to Wallet",
    modalEditTitle: "Edit Wallet Document",
    docTypeSelect: "Select Standard Document Type",
    customDocOption: "Custom / Other Document",
    docTitle: "Document Title",
    docNumber: "Document / ID Number",
    holderName: "Document Holder Name",
    guardianName: "Guardian / Father / Spouse Name",
    dob: "Date of Birth (DD/MM/YYYY)",
    gender: "Gender",
    address: "Registered Address",
    category: "Category",
    issuingAuthority: "Issuing Authority / Office",
    issueDate: "Date of Issue",
    expiryDate: "Expiry Date (or leave empty if permanent)",
    isPermanentCheck: "Life-long Document (No Expiry Date)",
    notes: "Private Notes & Storage Location",
    notesPlaceholder: "e.g. Original stored in green file at home, needed for PM-Kisan renewal.",
    attachPhoto: "Attach Scanned Photo / PDF (Optional)",
    saveBtn: "Save Document",
    cancelBtn: "Cancel",
    confirmDelete: "Are you sure you want to remove this document from your digital wallet?",
    mismatchTitle: "Cross-Document Spelling & Inconsistency Inspector",
    mismatchSub: "Detects name spelling and Date of Birth differences across your saved documents to prevent rejection at village counters.",
    noMismatches: "All documents show consistent Name and DOB formatting!",
    sampleLoaded: "Sample citizen document packet loaded into your wallet!",
    cardPreviewTitle: "Digital Citizen Verification Slip",
    printAction: "Print / Save PDF",
    closeModal: "Close"
  },
  ml: {
    title: "ഡിജിറ്റൽ രേഖാ വാലറ്റ് & സർട്ടിഫിക്കറ്റ് വോൾട്ട്",
    badge: "സുരക്ഷിത ഓഫ്ലൈൻ ലോക്കർ",
    subtitle: "റേഷൻ കാർഡ്, വരുമാന സർട്ടിഫിക്കറ്റ്, ഭൂനികുതി രസീത്, ആധാർ തുടങ്ങിയ രേഖകൾ സുരക്ഷിതമായി സൂക്ഷിക്കാനുള്ള ഡിജിറ്റൽ ലോക്കർ.",
    totalDocs: "ആകെ രേഖകൾ",
    verified: "സ്ഥിരീകരിച്ച രേഖകൾ",
    permanent: "സ്ഥിരം രേഖകൾ",
    expiringAlert: "പുതുക്കേണ്ടവ",
    searchPlaceholder: "രേഖയുടെ പേര്, നമ്പർ, വില്ലേജ് ഓഫീസ് എന്നിവ തിരയുക...",
    addDocBtn: "രേഖ ചേർക്കുക",
    scanOcrBtn: "സ്കാൻ & OCR",
    mismatchBtn: "പേരിലെ തെറ്റുകൾ",
    loadSampleBtn: "മാതൃകാ രേഖകൾ",
    exportBtn: "ബാക്കപ്പ്",
    importBtn: "ഇംപോർട്ട്",
    printSlipBtn: "പ്രിന്റ് ചെക്ക്‌ലിസ്റ്റ്",
    emptyTitle: "നിങ്ങളുടെ രേഖാ വാലറ്റ് ശൂന്യമാണ്",
    emptySub: "പഞ്ചായത്ത്, വില്ലേജ് ഓഫീസ് ആവശ്യങ്ങൾക്ക് ആധാർ, റേഷൻ കാർഡ്, കരം രസീത് എന്നിവ ഇവിടെ സൂക്ഷിക്കാം.",
    viewCard: "ഡിജിറ്റൽ കാർഡ്",
    editDoc: "മാറ്റം വരുത്തുക",
    deleteDoc: "ഒഴിവാക്കുക",
    showNo: "നമ്പർ കാണിക്കുക",
    hideNo: "നമ്പർ മറയ്ക്കുക",
    copied: "കോപ്പി ചെയ്തു!",
    verifiedBadge: "സ്ഥിരീകരിച്ചു",
    permanentBadge: "സ്ഥിരം രേഖ",
    validUntil: "കാലാവധി:",
    expired: "കാലാവധി കഴിഞ്ഞു",
    openPlanner: "ഈ രേഖകൾ ഉപയോഗിച്ച് അപേക്ഷാ പ്ലാൻ കാണുക",
    modalAddTitle: "പുതിയ രേഖ ചേർക്കുക",
    modalEditTitle: "രേഖയിൽ മാറ്റം വരുത്തുക",
    docTypeSelect: "രേഖയുടെ ഇനം തിരഞ്ഞെടുക്കുക",
    customDocOption: "മറ്റു രേഖകൾ",
    docTitle: "രേഖയുടെ പേര്",
    docNumber: "രേഖാ നമ്പർ",
    holderName: "ഉടമസ്ഥന്റെ പേര്",
    guardianName: "രക്ഷിതാവിന്റെ / പിതാവിന്റെ പേര്",
    dob: "ജനനത്തീയതി (DD/MM/YYYY)",
    gender: "ലിംഗം",
    address: "മേൽവിലാസം",
    category: "വിഭാഗം",
    issuingAuthority: "നൽകിയ ഓഫീസ് / അതോറിറ്റി",
    issueDate: "നൽകിയ തീയതി",
    expiryDate: "കാലാവധി തീയതി",
    isPermanentCheck: "സ്ഥിര രേഖ (കാലാവധി ഇല്ല)",
    notes: "പ്രത്യേക കുറിപ്പുകൾ",
    notesPlaceholder: "ഉദാ: ഒറിജിനൽ വീട്ടിലെ പച്ച ഫയലിൽ സൂക്ഷിച്ചിരിക്കുന്നു.",
    attachPhoto: "ഫോട്ടോ / സ്കാൻ കോപ്പി",
    saveBtn: "സൂക്ഷിക്കുക",
    cancelBtn: "റദ്ദാക്കുക",
    confirmDelete: "ഈ രേഖ വാലറ്റിൽ നിന്ന് നീക്കം ചെയ്യണോ?",
    mismatchTitle: "പേരിലെ തെറ്റുകൾ പരിശോധിക്കുക",
    mismatchSub: "അപേക്ഷകൾ നിരസിക്കപ്പെടാതിരിക്കാൻ ആധാർ, റേഷൻ കാർഡ് എന്നിവയിലെ പേരുകൾ താരതമ്യം ചെയ്യുക.",
    noMismatches: "എല്ലാ രേഖകളിലും പേരുകളും ജനനത്തീയതിയും ശരിയാണ്!",
    sampleLoaded: "മാതൃകാ രേഖകൾ ലോഡ് ചെയ്തു!",
    cardPreviewTitle: "ഡിജിറ്റൽ വെരിഫിക്കേഷൻ സ്ലിപ്പ്",
    printAction: "പ്രിന്റ് / PDF",
    closeModal: "അടയ്ക്കുക"
  },
  hi: {
    title: "डिजिटल दस्तावेज वॉलेट",
    badge: "सुरक्षित व ऑफलाइन लॉकर",
    subtitle: "राशन कार्ड, आय प्रमाण पत्र, भू-लगान रसीद और पहचान पत्रों को पंचायत कार्यों के लिए सुरक्षित रखें।",
    totalDocs: "कुल दस्तावेज",
    verified: "सत्यापित रिकॉर्ड",
    permanent: "स्थायी रिकॉर्ड",
    expiringAlert: "नवीनीकरण योग्य",
    searchPlaceholder: "नाम, संख्या, कार्यालय या नोट खोजें...",
    addDocBtn: "दस्तावेज जोड़ें",
    scanOcrBtn: "स्कैन व OCR",
    mismatchBtn: "स्पेलिंग जांच",
    loadSampleBtn: "सैंपल डेटा",
    exportBtn: "बैकअप",
    importBtn: "इंपोर्ट",
    printSlipBtn: "चेकलिस्ट प्रिंट",
    emptyTitle: "आपका वॉलेट खाली है",
    emptySub: "पंचायत व सेवा केंद्र के लिए आधार, राशन कार्ड और आय प्रमाण पत्र यहां सुरक्षित रखें।",
    viewCard: "डिजिटल कार्ड",
    editDoc: "बदलें",
    deleteDoc: "हटाएं",
    showNo: "नंबर दिखाएं",
    hideNo: "नंबर छुपाएं",
    copied: "कॉपी हो गया!",
    verifiedBadge: "सत्यापित",
    permanentBadge: "स्थायी",
    validUntil: "मान्य तारीख:",
    expired: "समय समाप्त",
    openPlanner: "इन दस्तावेजों से कार्यालय प्लान देखें",
    modalAddTitle: "दस्तावेज जोड़ें",
    modalEditTitle: "दस्तावेज बदलें",
    docTypeSelect: "दस्तावेज का प्रकार चुनें",
    customDocOption: "अन्य दस्तावेज",
    docTitle: "दस्तावेज का नाम",
    docNumber: "आईडी संख्या",
    holderName: "धारक का नाम",
    guardianName: "पिता / अभिभावक का नाम",
    dob: "जन्म तिथि (DD/MM/YYYY)",
    gender: "लिंग",
    address: "पता",
    category: "श्रेणी",
    issuingAuthority: "जारीकर्ता कार्यालय",
    issueDate: "जारी तिथि",
    expiryDate: "समाप्ति तिथि",
    isPermanentCheck: "स्थायी दस्तावेज (कोई समाप्ति नहीं)",
    notes: "नोट्स व रखने का स्थान",
    notesPlaceholder: "उदा: मूल प्रति घर पर फाइल में रखी है।",
    attachPhoto: "फोटो / स्कैन जोड़ें",
    saveBtn: "सहेजें",
    cancelBtn: "रद्द करें",
    confirmDelete: "क्या आप इस दस्तावेज को हटाना चाहते हैं?",
    mismatchTitle: "स्पेलिंग व नाम मिलान जांच",
    mismatchSub: "अस्वीकृति से बचने के लिए आधार और राशन कार्ड में नाम की जांच करें।",
    noMismatches: "सभी दस्तावेजों में नाम व जन्म तिथि सही है!",
    sampleLoaded: "सैंपल दस्तावेज लोड हो गए!",
    cardPreviewTitle: "डिजिटल नागरिक सत्यापन पर्ची",
    printAction: "प्रिंट / PDF",
    closeModal: "बंद करें"
  },
  te: {
    title: "డిజిటల్ పత్రాల వాలెట్",
    badge: "సురక్షిత ఆఫ్లైన్ లాకర్",
    subtitle: "రేషన్ కార్డు, ఆదాయ ధృవీకరణ పత్రం, ఆధార్ మొదలైన పత్రాలను సురక్షితంగా భద్రపరచండి.",
    totalDocs: "మొత్తం పత్రాలు",
    verified: "ధృవీకరించబడినవి",
    permanent: "శాశ్వత పత్రాలు",
    expiringAlert: "పునరుద్ధరణ అవసరం",
    searchPlaceholder: "పేరు, సంఖ్య, అధికారి ద్వారా వెతకండి...",
    addDocBtn: "పత్రం చేర్చండి",
    scanOcrBtn: "స్కాన్ & OCR",
    mismatchBtn: "స్పెల్లింగ్ తనిఖీ",
    loadSampleBtn: "నమూనా పత్రాలు",
    exportBtn: "బ్యాకప్",
    importBtn: "దిగుమతి",
    printSlipBtn: "జాబితా ప్రింట్",
    emptyTitle: "మీ వాలెట్ ఖాళీగా ఉంది",
    emptySub: "పంచాయతీ మరియు సర్కారీ పనులకు ఆధార్, రేషన్ కార్డును ఇక్కడ భద్రపరచండి.",
    viewCard: "డిజిటల్ కార్డు",
    editDoc: "సవరించు",
    deleteDoc: "తొలగించు",
    showNo: "సంఖ్య చూపించు",
    hideNo: "సంఖ్య దాచు",
    copied: "కాపీ చేయబడింది!",
    verifiedBadge: "ధృవీకరించబడింది",
    permanentBadge: "శాశ్వతం",
    validUntil: "చెల్లుబాటు:",
    expired: "గడువు ముగిసింది",
    openPlanner: "ఆఫీస్ ప్లాన్ చూడండి",
    modalAddTitle: "పత్రం జోడించండి",
    modalEditTitle: "పత్రం సవరించండి",
    docTypeSelect: "పత్రం రకం ఎంచుకోండి",
    customDocOption: "ఇతర పత్రాలు",
    docTitle: "పత్రం పేరు",
    docNumber: "పత్రం సంఖ్య",
    holderName: "యజమాని పేరు",
    guardianName: "తండ్రి / సంరక్షకుడి పేరు",
    dob: "పుట్టిన తేదీ",
    gender: "లింగం",
    address: "చిరునామా",
    category: "వర్గం",
    issuingAuthority: "ఇచ్చిన అధికారి / కార్యాలయం",
    issueDate: "ఇచ్చిన తేదీ",
    expiryDate: "ముగింపు తేదీ",
    isPermanentCheck: "శాశ్వత పత్రం",
    notes: "గమనికలు",
    notesPlaceholder: "ఉదా: అసలు కాపీ ఇంట్లో ఉంది.",
    attachPhoto: "ఫోటో జోడించండి",
    saveBtn: "భద్రపరచు",
    cancelBtn: "రద్దు",
    confirmDelete: "ఈ పత్రాన్ని తొలగించాలా?",
    mismatchTitle: "స్పెల్లింగ్ వ్యత్యాసాల తనిఖీ",
    mismatchSub: "దరఖాస్తులు తిరస్కరించబడకుండా ఆధార్, రేషన్ కార్డు పేర్లను సరిచూడండి.",
    noMismatches: "అన్ని పత్రాలలో వివరాలు సరిగ్గా ఉన్నాయి!",
    sampleLoaded: "నమూనా పత్రాలు లోడ్ చేయబడ్డాయి!",
    cardPreviewTitle: "డిజిటల్ ధృవీకరణ రసీదు",
    printAction: "ప్రింట్ / PDF",
    closeModal: "మూసివేయి"
  },
  kn: {
    title: "ಡಿಜಿಟಲ್ ದಾಖಲೆ ವಾಲೆಟ್",
    badge: "ಸುರಕ್ಷಿತ ಆಫ್‌ಲೈನ್ ಲಾಕರ್",
    subtitle: "ಗ್ರಾಮ ಪಂಚಾಯತಿ ಕೆಲಸಗಳಿಗಾಗಿ ಆಧಾರ್, ರೇಷನ್ ಕಾರ್ಡ್, ಆದಾಯ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಇಲ್ಲಿ ಸಂಗ್ರಹಿಸಿ.",
    totalDocs: "ಒಟ್ಟು ದಾಖಲೆಗಳು",
    verified: "ದೃಢೀಕರಿಸಿದ ದಾಖಲೆಗಳು",
    permanent: "ಶಾಶ್ವತ ದಾಖಲೆಗಳು",
    expiringAlert: "ನವೀಕರಣ ಬೇಕಾದವು",
    searchPlaceholder: "ಹೆಸರು, ಸಂಖ್ಯೆ, ಕಚೇರಿ ಮೂಲಕ ಹುಡುಕಿ...",
    addDocBtn: "ದಾಖಲೆ ಸೇರಿಸಿ",
    scanOcrBtn: "ಸ್ಕ್ಯಾನ್ & OCR",
    mismatchBtn: "ಕಾಗುಣಿತ ಪರೀಕ್ಷೆ",
    loadSampleBtn: "ಮಾದರಿ ದಾಖಲೆಗಳು",
    exportBtn: "ಬ್ಯಾಕಪ್",
    importBtn: "ಆಮದು",
    printSlipBtn: "ಚೆಕ್‌ಲಿಸ್ಟ್ ಪ್ರಿಂಟ್",
    emptyTitle: "ನಿಮ್ಮ ವಾಲೆಟ್ ಖಾಲಿಯಾಗಿದೆ",
    emptySub: "ಗ್ರಾಮ ಕಚೇರಿ ಕೆಲಸಗಳಿಗೆ ಆಧಾರ್, ರೇಷನ್ ಕಾರ್ಡ್, ಕಂದಾಯ ರಸೀದಿಯನ್ನು ಇಲ್ಲಿ ಸೇರಿಸಿ.",
    viewCard: "ಡಿಜಿಟಲ್ ಕಾರ್ಡ್",
    editDoc: "ತಿದ್ದುಪಡಿ",
    deleteDoc: "ತೆಗೆದುಹಾಕಿ",
    showNo: "ಸಂಖ್ಯೆ ತೋರಿಸಿ",
    hideNo: "ಸಂಖ್ಯೆ ಮರೆಮಾಡಿ",
    copied: "ನಕಲಿಸಲಾಗಿದೆ!",
    verifiedBadge: "ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    permanentBadge: "ಶಾಶ್ವತ",
    validUntil: "ಮಾನ್ಯತೆಯ ಅವಧಿ:",
    expired: "ಅವಧಿ ಮುಗಿದಿದೆ",
    openPlanner: "ಕಚೇರಿ ಯೋಜನೆ ನೋಡಿ",
    modalAddTitle: "ದಾಖಲೆ ಸೇರಿಸಿ",
    modalEditTitle: "ದಾಖಲೆ ತಿದ್ದುಪಡಿ",
    docTypeSelect: "ದಾಖಲೆಯ ಮಾದರಿ ಆಯ್ಕೆಮಾಡಿ",
    customDocOption: "ಇತರೆ ದಾಖಲೆಗಳು",
    docTitle: "ದಾಖಲೆಯ ಹೆಸರು",
    docNumber: "ದಾಖಲೆ ಸಂಖ್ಯೆ",
    holderName: "ಮಾಲೀಕರ ಹೆಸರು",
    guardianName: "ಪೋಷಕರ / ತಂದೆಯ ಹೆಸರು",
    dob: "ಹುಟ್ಟಿದ ದಿನಾಂಕ",
    gender: "ಲಿಂಗ",
    address: "ವಿಳಾಸ",
    category: "ವರ್ಗ",
    issuingAuthority: "ನೀಡಿದ ಕಚೇರಿ",
    issueDate: "ನೀಡಿದ ದಿನಾಂಕ",
    expiryDate: "ಮುಕ್ತಾಯ ದಿನಾಂಕ",
    isPermanentCheck: "ಶಾಶ್ವತ ದಾಖಲೆ (ಮುಕ್ತಾಯ ದಿನಾಂಕವಿಲ್ಲ)",
    notes: "ಟಿಪ್ಪಣಿಗಳು",
    notesPlaceholder: "ಉದಾ: ಮೂಲ ದಾಖಲೆ ಮನೆಯಲ್ಲಿ ಫೈಲ್‌ನಲ್ಲಿದೆ.",
    attachPhoto: "ಫೋಟೋ ಲಗತ್ತಿಸಿ",
    saveBtn: "ಉಳಿಸಿ",
    cancelBtn: "ರದ್ದುಮಾಡಿ",
    confirmDelete: "ಈ ದಾಖಲೆಯನ್ನು ವಾಲೆಟ್‌ನಿಂದ ತೆಗೆದುಹಾಕಬೇಕೆ?",
    mismatchTitle: "ದಾಖಲೆಗಳ ಕಾಗುಣಿತ ಪರೀಕ್ಷೆ",
    mismatchSub: "ಅರ್ಜಿ ತಿರಸ್ಕೃತವಾಗದಂತೆ ಆಧಾರ್ ಹಾಗೂ ರೇಷನ್ ಕಾರ್ಡ್ ಹೆಸರುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    noMismatches: "ಎಲ್ಲಾ ದಾಖಲೆಗಳಲ್ಲಿ ಹೆಸರು ಮತ್ತು ದಿನಾಂಕಗಳು ಸರಿಯಾಗಿವೆ!",
    sampleLoaded: "ಮಾದರಿ ದಾಖಲೆಗಳು ಲೋಡ್ ಆಗಿದೆ!",
    cardPreviewTitle: "ಡಿಜಿಟಲ್ ನಾಗರಿಕ ಸ್ಲಿಪ್",
    printAction: "ಪ್ರಿಂಟ್ / PDF",
    closeModal: "ಮುಚ್ಚಿ"
  }
};

// Category icon component map
const ICON_MAP = {
  Fingerprint,
  ShoppingCart,
  BadgeIndianRupee,
  ShieldCheck,
  FileCheck,
  Vote,
  CreditCard,
  Award,
  Sprout,
  HeartHandshake,
  Car,
  Baby,
  Accessibility,
  Folder: FileText,
  Shield,
  Landmark,
  GraduationCap: Award,
  FileText
};

export default function DigitalDocumentWallet({
  language = "en",
  currentUser = null,
  onOpenResolver = null,
  onSyncHeldDocs = null,
  className = ""
}) {
  const currentLang = WALLET_TRANSLATIONS[language] ? language : "en";
  const t = WALLET_TRANSLATIONS[currentLang];

  // Wallet documents state persisted in localStorage & optionally synced to user
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem("gramseva_digital_wallet_docs_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_SAMPLE_WALLET_DOCUMENTS;
    } catch (e) {
      return INITIAL_SAMPLE_WALLET_DOCUMENTS;
    }
  });

  // Category and search state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [revealedNumbers, setRevealedNumbers] = useState({});
  const [copyToast, setCopyToast] = useState("");

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [isMismatchModalOpen, setIsMismatchModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  // Form State for Add / Edit
  const [formType, setFormType] = useState("aadhaar");
  const [formTitle, setFormTitle] = useState("");
  const [formNumber, setFormNumber] = useState("");
  const [formHolder, setFormHolder] = useState("");
  const [formGuardian, setFormGuardian] = useState("");
  const [formDob, setFormDob] = useState("");
  const [formGender, setFormGender] = useState("Male");
  const [formAddress, setFormAddress] = useState("");
  const [formCategory, setFormCategory] = useState("identity");
  const [formAuthority, setFormAuthority] = useState("");
  const [formIssueDate, setFormIssueDate] = useState("");
  const [formExpiryDate, setFormExpiryDate] = useState("");
  const [formIsPermanent, setFormIsPermanent] = useState(true);
  const [formNotes, setFormNotes] = useState("");
  const [formFileUrl, setFormFileUrl] = useState(null);
  const fileInputRef = useRef(null);
  const importFileRef = useRef(null);

  const onSyncHeldDocsRef = useRef(onSyncHeldDocs);
  useEffect(() => {
    onSyncHeldDocsRef.current = onSyncHeldDocs;
  }, [onSyncHeldDocs]);

  // Close modals on Escape & lock scroll
  const isAnyModalOpen = isAddEditModalOpen || previewDoc || isOcrModalOpen || isMismatchModalOpen;
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsAddEditModalOpen(false);
        setPreviewDoc(null);
        setIsOcrModalOpen(false);
        setIsMismatchModalOpen(false);
      }
    };
    if (isAnyModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isAnyModalOpen]);

  // Persist documents on change and sync with backward-compatible held doc IDs
  useEffect(() => {
    try {
      localStorage.setItem("gramseva_digital_wallet_docs_v2", JSON.stringify(documents));
      const typeIds = documents.map((d) => d.typeId || d.id);
      localStorage.setItem("gramseva_held_docs", JSON.stringify(typeIds));
      if (onSyncHeldDocsRef.current) {
        onSyncHeldDocsRef.current(typeIds);
      }
    } catch (e) {
      console.error("Failed to save wallet documents:", e);
    }
  }, [documents]);

  // Handle Preset selection change in Add Modal
  const handlePresetSelect = (presetId) => {
    setFormType(presetId);
    if (presetId === "custom") {
      setFormCategory("custom");
      setFormIsPermanent(true);
      return;
    }
    const preset = STANDARD_DOCUMENT_TYPES.find((p) => p.id === presetId);
    if (preset) {
      setFormTitle(preset.name[language] || preset.name.en);
      setFormCategory(preset.category);
      setFormAuthority(preset.issuingAuthority[language] || preset.issuingAuthority.en);
      setFormIsPermanent(preset.isPermanent);
      if (preset.isPermanent) {
        setFormExpiryDate("");
      }
    }
  };

  // Open modal for Adding new Document
  const handleOpenAddModal = () => {
    setEditingDoc(null);
    handlePresetSelect("aadhaar");
    setFormTitle(STANDARD_DOCUMENT_TYPES[0].name[language] || STANDARD_DOCUMENT_TYPES[0].name.en);
    setFormNumber("");
    setFormHolder(currentUser?.name || "Rajesh V");
    setFormGuardian("Vasudevan Nambiar");
    setFormDob("14/08/1992");
    setFormGender("Male");
    setFormAddress(currentUser ? `${currentUser.locality}, ${currentUser.district}, Kerala` : "Ward 4, Azhiyur Grama Panchayat, Kozhikode");
    setFormAuthority(STANDARD_DOCUMENT_TYPES[0].issuingAuthority[language] || STANDARD_DOCUMENT_TYPES[0].issuingAuthority.en);
    setFormIssueDate(new Date().toISOString().slice(0, 10));
    setFormExpiryDate("");
    setFormIsPermanent(true);
    setFormNotes("");
    setFormFileUrl(null);
    setIsAddEditModalOpen(true);
  };

  // Open modal for Editing existing Document
  const handleOpenEditModal = (doc) => {
    setEditingDoc(doc);
    setFormType(doc.typeId || "custom");
    setFormTitle(doc.title || "");
    setFormNumber(doc.documentNumber || "");
    setFormHolder(doc.holderName || "");
    setFormGuardian(doc.guardianName || "");
    setFormDob(doc.dob || "");
    setFormGender(doc.gender || "Male");
    setFormAddress(doc.address || "");
    setFormCategory(doc.category || "identity");
    setFormAuthority(doc.issuingAuthority || "");
    setFormIssueDate(doc.issueDate || "");
    setFormExpiryDate(doc.expiryDate === "Permanent" ? "" : doc.expiryDate || "");
    setFormIsPermanent(doc.isPermanent !== false && (doc.expiryDate === "Permanent" || !doc.expiryDate));
    setFormNotes(doc.notes || "");
    setFormFileUrl(doc.fileUrl || null);
    setIsAddEditModalOpen(true);
  };

  // Save Document handler
  const handleSaveDocument = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formNumber.trim()) {
      alert("Please provide at least a Document Title and Document/ID Number.");
      return;
    }

    const newDocObj = {
      id: editingDoc ? editingDoc.id : `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      typeId: formType,
      title: formTitle.trim(),
      documentNumber: formNumber.trim(),
      holderName: formHolder.trim() || currentUser?.name || "Citizen",
      guardianName: formGuardian.trim() || "",
      dob: formDob.trim() || "14/08/1992",
      gender: formGender || "Male",
      address: formAddress.trim() || "",
      category: formCategory,
      issueDate: formIssueDate || "01/01/2024",
      expiryDate: formIsPermanent ? "Permanent" : (formExpiryDate || "Valid"),
      isPermanent: formIsPermanent,
      issuingAuthority: formAuthority.trim() || "Government Authority",
      status: "verified",
      verificationId: `VER-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: formNotes.trim(),
      tags: formIsPermanent ? ["Permanent Record", "Verified"] : ["Annual Validity", "Verified"],
      fileUrl: formFileUrl
    };

    if (editingDoc) {
      setDocuments((prev) => prev.map((d) => (d.id === editingDoc.id ? newDocObj : d)));
    } else {
      setDocuments((prev) => [newDocObj, ...prev]);
    }

    setIsAddEditModalOpen(false);
    showToast("Document saved to your Digital Wallet!");
  };

  // Delete Document handler
  const handleDeleteDocument = (docId) => {
    if (window.confirm(t.confirmDelete)) {
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      if (previewDoc && previewDoc.id === docId) {
        setPreviewDoc(null);
      }
      showToast("Document removed from wallet.");
    }
  };

  // Toggle Number Visibility
  const toggleNumberVisibility = (docId) => {
    setRevealedNumbers((prev) => ({ ...prev, [docId]: !prev[docId] }));
  };

  // Copy text to clipboard with feedback
  const handleCopyText = (text, label = "Document Number") => {
    if (!text) return;
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      }
      showToast(`${label} copied!`);
    } catch (e) {
      showToast(`${label} copied!`);
    }
  };

  // Toast banner helper
  const showToast = (msg) => {
    setCopyToast(msg);
    setTimeout(() => {
      setCopyToast("");
    }, 2800);
  };

  // File Upload handler (converts attached image to Base64 preview)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormFileUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Load Sample Citizen Family Packet
  const handleLoadSamplePacket = () => {
    setDocuments(INITIAL_SAMPLE_WALLET_DOCUMENTS);
    showToast(t.sampleLoaded);
  };

  // Export Wallet as JSON
  const handleExportWallet = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(documents, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `gramseva_digital_wallet_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Wallet backup exported successfully!");
    } catch (err) {
      alert("Export failed: " + err.message);
    }
  };

  // Import Wallet from JSON
  const handleImportWallet = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setDocuments(imported);
          showToast(`Imported ${imported.length} documents into your wallet!`);
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Error parsing backup JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Print Master Checklist
  const handlePrintMasterChecklist = () => {
    window.print();
  };

  // OCR Scan Preset Handler
  const handleRunOcrPreset = async (preset) => {
    setIsScanning(true);
    setOcrResult(null);
    setTimeout(() => {
      setOcrResult(preset);
      setIsScanning(false);
    }, 600);
  };

  const handleImportOcrResult = () => {
    if (!ocrResult) return;
    const extracted = ocrResult.extractedData;
    const matchedType = STANDARD_DOCUMENT_TYPES.find((s) => s.id === ocrResult.documentTypeId) || STANDARD_DOCUMENT_TYPES[0];

    const newDoc = {
      id: `doc_ocr_${Date.now()}`,
      typeId: ocrResult.documentTypeId,
      title: `${matchedType.name[language] || matchedType.name.en} (Scanned)`,
      documentNumber: extracted.documentNumber || "XXXX-XXXX-XXXX",
      holderName: extracted.name || "Rajesh V",
      guardianName: extracted.fatherName || "Vasudevan Nambiar",
      dob: extracted.dob || "14/08/1992",
      gender: extracted.gender || "Male",
      address: extracted.address || "Azhiyur, Kozhikode",
      category: matchedType.category || "identity",
      issueDate: new Date().toISOString().slice(0, 10),
      expiryDate: matchedType.isPermanent ? "Permanent" : "Valid for 1 Year",
      isPermanent: matchedType.isPermanent,
      issuingAuthority: matchedType.issuingAuthority[language] || matchedType.issuingAuthority.en,
      status: "verified",
      verificationId: `OCR-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: `Scanned via GramSeva OCR engine with ${extracted.confidence}% confidence.`,
      tags: ["OCR Extracted", "Verified"],
      fileUrl: ocrResult.previewUrl || null
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setIsOcrModalOpen(false);
    setOcrResult(null);
    showToast("Scanned document imported into Digital Wallet!");
  };

  // Mismatch report calculation
  const mismatchReport = useMemo(() => {
    const formattedDocs = documents.map((d) => ({
      id: d.id,
      documentTypeId: d.typeId || "custom",
      fileName: d.title,
      extractedData: {
        name: d.holderName,
        dob: d.dob,
        documentNumber: d.documentNumber,
        fatherName: d.guardianName,
        address: d.address
      }
    }));
    return inspectDocumentMismatches(formattedDocs);
  }, [documents]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const titleMatch = doc.title?.toLowerCase().includes(q);
      const numberMatch = doc.documentNumber?.toLowerCase().includes(q);
      const holderMatch = doc.holderName?.toLowerCase().includes(q);
      const authorityMatch = doc.issuingAuthority?.toLowerCase().includes(q);
      const notesMatch = doc.notes?.toLowerCase().includes(q);

      return titleMatch || numberMatch || holderMatch || authorityMatch || notesMatch;
    });
  }, [documents, selectedCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = documents.length;
    const verified = documents.filter((d) => d.status === "verified").length;
    const permanent = documents.filter((d) => d.isPermanent || d.expiryDate === "Permanent").length;
    const expiring = documents.filter((d) => !d.isPermanent && d.expiryDate !== "Permanent").length;
    return { total, verified, permanent, expiring };
  }, [documents]);

  // Mask number helper
  const renderMaskedNumber = (doc) => {
    const raw = doc.documentNumber || "";
    if (revealedNumbers[doc.id]) {
      return raw;
    }
    if (raw.length <= 4) return "••••";
    const lastFour = raw.slice(-4);
    const maskedPrefix = raw.slice(0, -4).replace(/[a-zA-Z0-9]/g, "•");
    return `${maskedPrefix}${lastFour}`;
  };

  // Get Category Icon Component
  const getCategoryIcon = (category) => {
    const cat = DOCUMENT_CATEGORIES.find((c) => c.id === category);
    const IconComponent = cat?.icon && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : FileText;
    return <IconComponent className="w-3.5 h-3.5" />;
  };

  return (
    <div className={`digital-wallet-root flex-1 flex flex-col min-h-0 bg-stone-50 text-slate-900 pb-28 ${className}`}>
      {/* Toast Notification */}
      {copyToast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* 1. Refined Clean Header Bar */}
      <div className="bg-white border-b border-stone-200/90 shadow-2xs print:bg-white print:border-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-200/80 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  {t.badge}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  DigiLocker & Panchayat Sync
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-classical mt-0.5">
                {t.title}
              </h1>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed mt-0.5">
                {t.subtitle}
              </p>
            </div>

            {/* Top Primary Actions */}
            <div className="flex items-center flex-wrap gap-2 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{t.addDocBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOcrResult(null);
                  setIsOcrModalOpen(true);
                }}
                className="bg-white hover:bg-stone-100 text-slate-800 font-bold text-xs px-3 py-2 rounded-xl border border-stone-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.scanOcrBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMismatchModalOpen(true)}
                className={`text-xs font-bold px-3 py-2 rounded-xl border transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  mismatchReport.hasMismatches
                    ? "bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-400"
                    : "bg-white hover:bg-stone-100 border-stone-200 text-slate-800"
                }`}
                title="Inspect cross-document spelling and date of birth consistency"
              >
                <AlertCircle className={`w-3.5 h-3.5 ${mismatchReport.hasMismatches ? "text-amber-600 animate-pulse" : "text-slate-500"}`} />
                <span>{t.mismatchBtn}</span>
                {mismatchReport.hasMismatches && (
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 w-full space-y-4">
        {/* 2. Key Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-stone-200/90 p-3.5 rounded-2xl shadow-2xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              {t.totalDocs}
            </span>
            <span className="text-xl font-black text-slate-900 block mt-0.5 font-classical">
              {stats.total} Records
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Encrypted in local locker
            </span>
          </div>

          <div className="bg-white border border-stone-200/90 p-3.5 rounded-2xl shadow-2xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              {t.verified}
            </span>
            <span className="text-xl font-black text-emerald-800 block mt-0.5 font-classical">
              {stats.verified} Verified
            </span>
            <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
              Active for e-District
            </span>
          </div>

          <div className="bg-white border border-stone-200/90 p-3.5 rounded-2xl shadow-2xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              {t.permanent}
            </span>
            <span className="text-xl font-black text-slate-800 block mt-0.5 font-classical">
              {stats.permanent} Life-long
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              No expiry renewals
            </span>
          </div>

          <div className="bg-white border border-stone-200/90 p-3.5 rounded-2xl shadow-2xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              {t.expiringAlert}
            </span>
            <span className="text-xl font-black text-amber-800 block mt-0.5 font-classical">
              {stats.expiring} Periodic
            </span>
            <span className="text-[10px] font-bold text-amber-700 block mt-0.5">
              Income / Tax receipts
            </span>
          </div>
        </div>

        {/* 3. Toolbar & Filters */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:border-emerald-600 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Secondary Utilities */}
            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              <button
                type="button"
                onClick={handlePrintMasterChecklist}
                className="bg-stone-50 hover:bg-stone-100 border border-stone-200 text-slate-700 font-bold text-xs px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Print master wallet document checklist"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">{t.printSlipBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleExportWallet}
                className="bg-stone-50 hover:bg-stone-100 border border-stone-200 text-slate-700 font-bold text-xs px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Export JSON backup of wallet"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">{t.exportBtn}</span>
              </button>

              <label
                className="bg-stone-50 hover:bg-stone-100 border border-stone-200 text-slate-700 font-bold text-xs px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Import JSON backup"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">{t.importBtn}</span>
                <input
                  ref={importFileRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportWallet}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleLoadSamplePacket}
                className="bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 font-bold text-xs px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Load realistic sample citizen family packet"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.loadSampleBtn}</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {DOCUMENT_CATEGORIES.map((cat) => {
              const count = cat.id === "all"
                ? documents.length
                : documents.filter((d) => d.category === cat.id).length;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white font-black shadow-2xs"
                      : "bg-stone-100 hover:bg-stone-200 text-slate-700"
                  }`}
                >
                  <span>{cat.label[language] || cat.label.en}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-stone-200 text-slate-700"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Document Cards Grid */}
        <div className="min-h-[260px]">
          {filteredDocuments.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-8 text-center max-w-md mx-auto my-6 space-y-3 shadow-2xs">
              <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                <FolderCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-classical text-base font-black text-slate-900">
                  {t.emptyTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {t.emptySub}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addDocBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={handleLoadSamplePacket}
                  className="bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer border border-stone-200"
                >
                  {t.loadSampleBtn}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDocuments.map((doc) => {
                const isRevealed = revealedNumbers[doc.id];
                const isPermanent = doc.isPermanent || doc.expiryDate === "Permanent";

                return (
                  <div
                    key={doc.id}
                    className="bg-white border border-stone-200/90 hover:border-emerald-400 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                  >
                    {/* Header Row */}
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            doc.category === "identity" ? "bg-blue-50 text-blue-800 border border-blue-200" :
                            doc.category === "revenue" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                            doc.category === "welfare" ? "bg-amber-50 text-amber-800 border border-amber-200" :
                            doc.category === "education" ? "bg-purple-50 text-purple-800 border border-purple-200" :
                            "bg-stone-100 text-slate-700 border border-stone-200"
                          }`}>
                            {getCategoryIcon(doc.category)}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                              {doc.issuingAuthority || "Government Authority"}
                            </span>
                            <h4 className="font-classical text-sm font-black text-slate-900 truncate leading-tight" title={doc.title}>
                              {doc.title}
                            </h4>
                          </div>
                        </div>

                        {/* Verified Badge */}
                        <span className="shrink-0 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>{t.verifiedBadge}</span>
                        </span>
                      </div>

                      {/* Document Number Box */}
                      <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                            Document / ID Number
                          </span>
                          <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 tracking-wide block truncate mt-0.5">
                            {renderMaskedNumber(doc)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleNumberVisibility(doc.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-stone-200 rounded-lg transition cursor-pointer"
                            title={isRevealed ? t.hideNo : t.showNo}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyText(doc.documentNumber, doc.title)}
                            className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            title="Copy Document Number"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Holder & Validity Details */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Holder</span>
                          <span className="font-bold text-slate-800 truncate block text-[11px] mt-0.5">{doc.holderName || "Citizen"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Validity</span>
                          <span className={`font-bold block text-[11px] truncate mt-0.5 ${
                            isPermanent ? "text-emerald-800" : "text-amber-800"
                          }`}>
                            {isPermanent ? t.permanentBadge : `${t.validUntil} ${doc.expiryDate}`}
                          </span>
                        </div>
                      </div>

                      {/* Attached Photo Thumbnail (if available) */}
                      {doc.fileUrl && (
                        <div className="rounded-xl overflow-hidden border border-stone-200 relative max-h-24 bg-stone-100">
                          <img src={doc.fileUrl} alt={doc.title} className="w-full h-24 object-cover" />
                          <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Attached Scanned Copy
                          </div>
                        </div>
                      )}

                      {/* Remarks / Private Notes */}
                      {doc.notes && (
                        <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-2 text-[11px] text-amber-900 leading-snug">
                          <span className="font-black text-amber-800 mr-1">Note:</span>
                          {doc.notes}
                        </div>
                      )}
                    </div>

                    {/* Card Bottom Actions */}
                    <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-[11px] px-2.5 py-1.5 rounded-lg border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{t.viewCard}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewDoc(doc);
                            setTimeout(() => window.print(), 300);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                          title="Print Official Slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(doc)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                          title={t.editDoc}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title={t.deleteDoc}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Zero-Turnaround Certificate Navigator Banner */}
        {onOpenResolver && (
          <div className="p-4 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-200" />
              </div>
              <div>
                <h4 className="font-classical text-xs font-black text-slate-900">
                  Applying for Certificates & Land Papers?
                </h4>
                <p className="text-[11px] text-slate-600 font-medium">
                  Your saved wallet documents ({documents.length} held) are automatically synchronized with the Zero-Turnaround Office Navigator.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenResolver}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer active:scale-95"
            >
              <span>{t.openPlanner}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PORTAL MODAL 1: ADD / EDIT DOCUMENT MODAL */}
      {/* ========================================================================= */}
      {isAddEditModalOpen && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-soft-rise">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                  <FolderCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-classical text-base font-black text-slate-900">
                    {editingDoc ? t.modalEditTitle : t.modalAddTitle}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Store details securely in your offline-first GramSeva locker
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveDocument} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Preset Selector */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                  {t.docTypeSelect}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STANDARD_DOCUMENT_TYPES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`p-2 rounded-xl text-left border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        formType === preset.id
                          ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-400"
                          : "bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${formType === preset.id ? "bg-emerald-700" : "bg-slate-300"}`} />
                      <span className="truncate">{preset.name[language] || preset.name.en}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handlePresetSelect("custom")}
                    className={`p-2 rounded-xl text-left border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      formType === "custom"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-400"
                        : "bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                    <span>{t.customDocOption}</span>
                  </button>
                </div>
              </div>

              {/* Title and ID Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                    {t.docTitle} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Aadhaar Card"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                    {t.docNumber} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    placeholder="e.g. 7821 4590 1284"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              {/* Holder Name & Guardian */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                    {t.holderName}
                  </label>
                  <input
                    type="text"
                    value={formHolder}
                    onChange={(e) => setFormHolder(e.target.value)}
                    placeholder="e.g. Rajesh V"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                    {t.guardianName}
                  </label>
                  <input
                    type="text"
                    value={formGuardian}
                    onChange={(e) => setFormGuardian(e.target.value)}
                    placeholder="e.g. Father / Guardian name"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              {/* DOB, Gender & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                    {t.dob}
                  </label>
                  <input
                    type="text"
                    value={formDob}
                    onChange={(e) => setFormDob(e.target.value)}
                    placeholder="14/08/1992"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                    {t.gender}
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                    {t.category}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                  >
                    {DOCUMENT_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label[language] || cat.label.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Authority & Registered Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                    {t.issuingAuthority}
                  </label>
                  <input
                    type="text"
                    value={formAuthority}
                    onChange={(e) => setFormAuthority(e.target.value)}
                    placeholder="e.g. Village Office Azhiyur"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                    {t.address}
                  </label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="Door No, Ward, Village"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              {/* Issue Date & Validity */}
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                    Validity & Expiry Rules
                  </span>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPermanent}
                      onChange={(e) => setFormIsPermanent(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{t.isPermanentCheck}</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {t.issueDate}
                    </label>
                    <input
                      type="text"
                      value={formIssueDate}
                      onChange={(e) => setFormIssueDate(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium"
                    />
                  </div>

                  {!formIsPermanent && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        {t.expiryDate}
                      </label>
                      <input
                        type="text"
                        value={formExpiryDate}
                        onChange={(e) => setFormExpiryDate(e.target.value)}
                        placeholder="DD/MM/YYYY"
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Private Remarks / Storage Notes */}
              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                  {t.notes}
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder={t.notesPlaceholder}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 transition"
                />
              </div>

              {/* Image / Scanned File Attachment */}
              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                  {t.attachPhoto}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-stone-100 hover:bg-stone-200 border border-stone-300 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {formFileUrl && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Image Attached
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormFileUrl(null)}
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                >
                  {t.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* PORTAL MODAL 2: DIGITAL CITIZEN SMART CARD & PRINTABLE SLIP PREVIEW */}
      {/* ========================================================================= */}
      {previewDoc && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-soft-rise">
            {/* Header */}
            <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-classical text-base font-black text-slate-900">
                  {t.cardPreviewTitle}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.printAction}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Digital Card Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* SKEUOMORPHIC GOVERNMENT CITIZEN SMART CARD */}
              <div className="relative bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-lg border border-slate-700 overflow-hidden">
                <div className="relative z-10 space-y-4">
                  {/* Card Top Title & State Crest */}
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block">
                          Government of India / State Civic Record
                        </span>
                        <h4 className="font-classical text-sm sm:text-base font-black text-white leading-tight">
                          {previewDoc.title}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-md block">
                        Verified Vault Record
                      </span>
                    </div>
                  </div>

                  {/* Card Center: QR & Details */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                          Full Name / Holder
                        </span>
                        <span className="text-sm font-black text-white tracking-wide block">
                          {previewDoc.holderName || "Rajesh V"}
                        </span>
                      </div>

                      {previewDoc.guardianName && (
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                            Father / Guardian
                          </span>
                          <span className="text-xs font-bold text-slate-200 block">
                            {previewDoc.guardianName}
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                            DOB
                          </span>
                          <span className="font-bold text-slate-200">{previewDoc.dob || "14/08/1992"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                            Gender
                          </span>
                          <span className="font-bold text-slate-200">{previewDoc.gender || "Male"}</span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Simulation */}
                    <div className="bg-white p-2 rounded-2xl shadow-inner border border-stone-300 shrink-0 text-center">
                      <QrCode className="w-16 h-16 text-slate-900 mx-auto" />
                      <span className="text-[8px] font-mono font-bold text-slate-700 block mt-0.5">
                        {previewDoc.verificationId || "VER-819204"}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom: Document Number */}
                  <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        Official Document ID
                      </span>
                      <span className="font-mono text-sm sm:text-base font-black text-emerald-400 tracking-wider">
                        {previewDoc.documentNumber}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 block">Issuing Authority</span>
                      <span className="text-[10px] font-bold text-slate-200 block truncate max-w-[160px]">
                        {previewDoc.issuingAuthority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* OFFICIAL RECEIPT TABLE SLIP */}
              <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50 space-y-3 text-xs text-slate-800">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="font-black text-slate-900 uppercase text-[10px] tracking-wider">
                    Panchayat Counter Verification Receipt
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Generated: {new Date().toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Document Title:</span>
                    <span className="font-bold">{previewDoc.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Category:</span>
                    <span className="font-bold uppercase">{previewDoc.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Holder Name:</span>
                    <span className="font-bold">{previewDoc.holderName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">DOB / Age Proof:</span>
                    <span className="font-bold">{previewDoc.dob}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 text-[10px] block">Address / Village Locality:</span>
                    <span className="font-bold">{previewDoc.address || "Azhiyur Grama Panchayat, Kozhikode, Kerala"}</span>
                  </div>
                </div>

                {previewDoc.notes && (
                  <div className="bg-white border border-stone-200 rounded-xl p-2.5 text-[11px] text-slate-700">
                    <span className="font-bold text-slate-900 mr-1">Citizen File Remarks:</span>
                    {previewDoc.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => handleCopyText(`${previewDoc.title}: ${previewDoc.documentNumber} (${previewDoc.holderName})`, previewDoc.title)}
                className="bg-white border border-stone-300 hover:bg-stone-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                {t.closeModal}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* PORTAL MODAL 3: OCR CAMERA & PHOTO SCANNER */}
      {/* ========================================================================= */}
      {isOcrModalOpen && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-soft-rise">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-classical text-base font-black text-slate-900">
                    {t.scanOcrBtn}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Extracts Name, DOB, and ID Numbers automatically from photographed cards
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOcrModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block mb-2">
                  1. Try Instant OCR Presets or Upload Your Card
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_DOCUMENT_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleRunOcrPreset(preset)}
                      className={`p-2.5 rounded-2xl border text-left text-xs font-bold transition flex flex-col items-center text-center gap-1.5 cursor-pointer ${
                        ocrResult?.id === preset.id
                          ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400"
                          : "bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100"
                      }`}
                    >
                      <img src={preset.previewUrl} alt={preset.fileName} className="w-full h-14 object-cover rounded-lg" />
                      <span className="capitalize">{preset.documentTypeId.replace("_", " ")}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* OCR Scanning state */}
              {isScanning && (
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-2 animate-pulse">
                  <RefreshCw className="w-6 h-6 text-emerald-700 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-800">Analyzing document geometry & running optical character recognition...</p>
                </div>
              )}

              {/* OCR Result View */}
              {ocrResult && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-950 uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      Extraction Completed ({ocrResult.extractedData.confidence}% Confidence)
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-200">
                      Ready to Import
                    </span>
                  </div>

                  <div className="bg-white border border-emerald-200 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs text-slate-800">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Extracted Name</span>
                      <span className="font-black text-slate-900">{ocrResult.extractedData.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Extracted DOB</span>
                      <span className="font-bold text-slate-900">{ocrResult.extractedData.dob}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Document ID</span>
                      <span className="font-mono font-bold text-emerald-800">{ocrResult.extractedData.documentNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Gender</span>
                      <span className="font-bold text-slate-900">{ocrResult.extractedData.gender || "Male"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 block">Address</span>
                      <span className="font-medium text-slate-700">{ocrResult.extractedData.address}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleImportOcrResult}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Import Directly Into Digital Wallet</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsOcrModalOpen(false)}
                className="bg-stone-200 hover:bg-stone-300 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                {t.closeModal}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* PORTAL MODAL 4: CROSS-DOCUMENT SPELLING & MISMATCH INSPECTOR */}
      {/* ========================================================================= */}
      {isMismatchModalOpen && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-soft-rise">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-classical text-base font-black text-slate-900">
                    {t.mismatchTitle}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {t.mismatchSub}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMismatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {mismatchReport.hasMismatches ? (
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-classical text-sm font-black text-amber-950">
                        Potential Counter Inconsistency Detected
                      </h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        {mismatchReport.summary}
                      </p>
                    </div>
                  </div>

                  {mismatchReport.issues.map((issue) => (
                    <div key={issue.id} className="bg-white border border-amber-200 rounded-2xl p-4 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-amber-900 uppercase tracking-wider">
                          {issue.title}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                          Action Required
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {issue.description}
                      </p>
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[11px] text-slate-800">
                        <span className="font-bold text-emerald-800 mr-1">Recommended Solution:</span>
                        {issue.remedy}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                  <ShieldCheck className="w-10 h-10 text-emerald-700 mx-auto" />
                  <h4 className="font-classical text-base font-black text-emerald-950">
                    {t.noMismatches}
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Holder names and date of birth match across your saved records, ensuring smooth zero-turnaround processing at village counters.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsMismatchModalOpen(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                {t.closeModal}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
