import { useState, useMemo, useEffect } from "react";
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
  ExternalLink
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

// Localized UI strings for Certificate Resolver
const RESOLVER_TRANSLATIONS = {
  ml: {
    title: "സർക്കാർ സർട്ടിഫിക്കറ്റ് അപേക്ഷാ മാർഗ്ഗദർശി & അനായാസ യാത്രാ പ്ലാൻ",
    badge: "അനാവശ്യ ഓഫീസ് കയറിയിറങ്ങൽ ഒഴിവാക്കുന്ന സഹായി",
    subtitle: "നിങ്ങൾക്ക് ഉണ്ടാക്കേണ്ട സർട്ടിഫിക്കറ്റുകളും (ഉദാ: വരുമാനം, ജാതി) കയ്യിലുള്ള ഐഡി കാർഡുകളും (ഉദാ: ആധാർ, റേഷൻ കാർഡ്) തിരഞ്ഞെടുക്കുക. ഏത് ഓഫീസിൽ ആദ്യം പോകണം, ആവശ്യമായ രേഖകൾ, സർക്കാറിലെ ഫീസ് (₹30) എന്നിവ കൃത്യമായി കാണിച്ചുതരും.",
    selectState: "നിങ്ങളുടെ സംസ്ഥാനവും സേവന കേന്ദ്രവും തിരഞ്ഞെടുക്കുക (പോർട്ടൽ):",
    goal: "നിങ്ങളുടെ പ്രധാന മുൻഗണന (ഏതാണ് വേണ്ടത്?):",
    fewestVisits: "🏛️ കുറച്ചു യാത്രകൾ (അനാവശ്യമായി ഓഫീസുകൾ കയറിയിറങ്ങുന്നത് ഒഴിവാക്കുക)",
    fastest: "⚡ അടിയന്തര ആവശ്യം (കുറഞ്ഞ ദിവസങ്ങളിൽ വേഗത്തിൽ ലഭിക്കാൻ)",
    lowestFee: "💰 പണം ലാഭിക്കാം (സർക്കാർ ഫീസ് മാത്രം, ഏജന്റ് ചാർജുകൾ ഇല്ലാതെ)",
    visits: "ഓഫീസ് യാത്രകൾ",
    days: "എടുക്കുന്ന ദിവസങ്ങൾ",
    fee: "സർക്കാർ ഫീസ്",
    tabIntake: "1. 📜 കയ്യിലുള്ളതും വേണ്ടതുമായ രേഖകൾ തിരഞ്ഞെടുക്കുക",
    tabPlan: "2. 🚶 അനായാസ ഓഫീസ് യാത്രാ പ്ലാൻ (Step-by-Step)",
    tabGraph: "3. 🗺️ രേഖകൾ തമ്മിലുള്ള ബന്ധ വിവര മാപ്പ്",
    tabOcr: "4. 🔍 പേര് & സ്പെല്ലിംഗ് തെറ്റ് പരിശോധന",
    targetsTitle: "സ്റ്റെപ്പ് 1A: നിങ്ങൾക്ക് ഉണ്ടാക്കേണ്ട സർട്ടിഫിക്കറ്റുകൾ ഏതെല്ലാം?",
    targetsSub: "നിങ്ങൾക്ക് ലഭിക്കേണ്ട രേഖകളിൽ ടിക് ചെയ്യുക (ഉദാ: വരുമാനം, ജാതി, ഇ.ഡബ്ല്യു.എസ്, ലൈഫ് മിഷൻ ലൈൻഡ്ലെസ്).",
    heldTitle: "സ്റ്റെപ്പ് 1B: നിങ്ങളുടെ പക്കൽ ഇപ്പോൾ ഏതൊക്കെ കാർഡുകളും രേഖകളും ഉണ്ട്?",
    heldSub: "നിങ്ങളുടെ കയ്യിലോ വീട്ടിലോ ഉള്ള ആധാർ, റേഷൻ കാർഡ്, കറന്റ് ബില്ല് എന്നിവ മാർക്ക് ചെയ്യുക.",
    selectAll: "എല്ലാം തിരഞ്ഞെടുക്കുക",
    clearAll: "എല്ലാം ഒഴിവാക്കുക",
    searchTargets: "സർട്ടിഫിക്കറ്റുകൾ തിരയുക (ഉദാ: വരുമാന സർട്ടിഫിക്കറ്റ്, ജാതി, കുടിവെള്ള കിണർ...)",
    searchHeld: "കയ്യിലുള്ള രേഖകൾ തിരയുക (ഉദാ: ആധാർ, റേഷൻ കാർഡ്, എസ്എസ്എൽസി ബുക്ക്...)",
    solveBtn: "ആദ്യം ഏത് ഓഫീസിൽ പോകണമെന്ന് കാണിക്കുക →",
    copiedRoute: "ഓഫീസ് യാത്രാ വിവരം കോപ്പി ചെയ്തു!",
    printPlan: "പ്ലാൻ പ്രിന്റ് ചെയ്യുക / PDF"
  },
  en: {
    title: "Certificate Guide & Office Visit Plan",
    badge: "Plan once. Avoid repeat office visits.",
    subtitle: "Choose the certificates you need and the documents you already have. Get the correct office order, required papers, expected fees, and processing time.",
    selectState: "Select Your State & Service Center Rules:",
    goal: "Your Main Priority:",
    fewestVisits: "🏛️ Minimum Office Trips (Avoid Repeated Visits to Town/Tehsil)",
    fastest: "⚡ Urgent Work / Fastest Certificate (Fewest Days Wait)",
    lowestFee: "💰 Save Money / Lowest Fee (Official Cost Only, No Agent Fees)",
    visits: "Office Visits",
    days: "Days Wait",
    fee: "Govt Fee",
    tabIntake: "1. 📜 Pick Certificates Needed & Your IDs",
    tabPlan: "2. 🚶 Step-by-Step Office Visit Roadmap",
    tabGraph: "3. 🗺️ Certificate Link Map",
    tabOcr: "4. 🔍 Check Name & Spelling Errors",
    targetsTitle: "Step 1A: Which Certificates Do You Need to Make?",
    targetsSub: "Tick the boxes for the certificates you want to apply for (e.g., Income Certificate, Caste, EWS, Landless).",
    heldTitle: "Step 1B: Which ID Cards or Papers Do You Already Have in Hand?",
    heldSub: "Tick the documents currently in your pocket or home (e.g., Aadhaar Card, Ration Card, SSLC Marksheet).",
    selectAll: "Select All",
    clearAll: "Clear All",
    searchTargets: "Search certificates (e.g. Income, Caste, EWS, Landless, Borewell...)",
    searchHeld: "Search your documents (e.g. Aadhaar, Ration Card, Electricity Bill...)",
    solveBtn: "Show Me Which Office to Visit First →",
    copiedRoute: "Application plan copied to clipboard!",
    printPlan: "Print Plan / Save PDF"
  },
  hi: {
    title: "सरकारी प्रमाण पत्र मार्गदर्शक एवं चक्कर बचाओ योजना",
    badge: "बिना भटके सही दफ्तर पहुंचे (गांव वालों के लिए)",
    subtitle: "आपको कौन से प्रमाण पत्र बनवाने हैं और आपके पास कौन से पहचान पत्र हैं, यह चुनें। हम आपको सही कार्यालय, सही क्रम, सटीक सरकारी फीस (जैसे ₹30) और जरूरी कागज बताएंगे।",
    selectState: "अपना राज्य व सेवा केंद्र चुनें (पोर्टल):",
    goal: "आपकी मुख्य प्राथमिकता:",
    fewestVisits: "🏛️ सबसे कम चक्कर (बार-बार तहसील/दफ्तर न जाना पड़े)",
    fastest: "⚡ अर्जेंट / जल्दी चाहिए (कम से कम दिनों में प्रमाण पत्र पाएं)",
    lowestFee: "💰 कम से कम खर्चा (सरकारी फीस बचाएं, दलाल को पैसे न दें)",
    visits: "दफ्तर चक्कर",
    days: "दिन लगेंगे",
    fee: "सरकारी फीस",
    tabIntake: "1. 📜 जरूरी प्रमाण पत्र और पास के पहचान पत्र चुनें",
    tabPlan: "2. 🚶 दफ्तर जाने का आसान रास्ता (स्टेप-बाय-स्टेप)",
    tabGraph: "3. 🗺️ कौन सा कागज किस कागज से बनता है (संबंध नक्शा)",
    tabOcr: "4. 🔍 नाम व स्पेलिंग की गलती जांचें (रिजेक्ट न हो)",
    targetsTitle: "स्टेप 1A: आपको कौन से प्रमाण पत्र बनवाने हैं?",
    targetsSub: "जो प्रमाण पत्र आप बनवाना चाहते हैं उन्हें टिक करें (जैसे: आय प्रमाण पत्र, जाति, ईडब्ल्यूएस, भूमिहीन)।",
    heldTitle: "स्टेप 1B: आपके पास कौन से पहचान पत्र घर/जेब में उपलब्ध हैं?",
    heldSub: "जो पहचान पत्र आपके पास उपलब्ध हैं उन्हें टिक करें (जैसे: आधार कार्ड, राशन कार्ड, बिजली बिल)।",
    selectAll: "सभी चुनें",
    clearAll: "सभी हटाएं",
    searchTargets: "प्रमाण पत्र खोजें (उदा: आय, जाति, ईडब्ल्यूएस, भूमिहीन...)",
    searchHeld: "दस्तावेज खोजें (उदा: आधार, राशन कार्ड, अंकपत्र...)",
    solveBtn: "पहले किस दफ्तर जाना है देखें →",
    copiedRoute: "आवेदन योजना कॉपी हो गई!",
    printPlan: "प्रिंट / पीडीएफ सेव करें"
  },
  te: {
    title: "సర్కారీ సర్టిఫికేట్ గైడ్ & తిరుగుళ్ళు లేని ఆఫీస్ ప్లాన్",
    badge: "గ్రామీణుల కోసం అనవసర ఆఫీస్ తిరుగుళ్ళు లేని సహాయకి",
    subtitle: "మీకు కావలసిన సర్టిఫికేట్లు (ఉదా: ఆదాయ ధృవీకరణ, కులం) మరియు మీ వద్ద ఉన్న గుర్తింపు కార్డులు (ఉదా: ఆధార్, రేషన్ కార్డు) ఎంచుకోండి. ఏ ఆఫీసుకు ముందు వెళ్ళాలి, ఎంత ఫీజు (₹30) అవుతుందో స్పష్టంగా చూపుతాము.",
    selectState: "మీ రాష్ట్రం & మీ సేవ పోర్టల్ ఎంచుకోండి:",
    goal: "మీ ప్రధాన ప్రాధాన్యత:",
    fewestVisits: "🏛️ తక్కువ ఆఫీస్ తిరుగుళ్ళు (పదే పదే ఆఫీస్‌కు తిరగకుండా)",
    fastest: "⚡ అత్యవసర పని / త్వరగా పొందడం (తక్కువ రోజులలో)",
    lowestFee: "💰 తక్కువ ఖర్చు (ప్రభుత్వ నియమిత ఫీజు మాత్రమే, డబ్బు ఆదా)",
    visits: "ఆఫీస్ సందర్శనలు",
    days: "పట్టే రోజులు",
    fee: "ప్రభుత్వ ఫీజు",
    tabIntake: "1. 📜 కావాల్సిన సర్టిఫికేట్లు & ఉన్న ఐడీలు",
    tabPlan: "2. 🚶 ఆఫీస్‌కు వెళ్ళే క్రమబద్ధమైన ప్లాన్",
    tabGraph: "3. 🗺️ సర్టిఫికేట్‌ల సంబంధం మ్యాప్",
    tabOcr: "4. 🔍 పేరు & స్പെల్లింగ్ తప్పులు సరిచూసుకోండి",
    targetsTitle: "స్టెప్ 1A: మీకు ఏ ఏ సర్టిఫికేట్లు కావాలి?",
    targetsSub: "మీకు కావలసిన సర్టిఫికేట్లను ఎంచుకోండి (ఉదా: ఆదాయ ధృవీకరణ, కులం, ఇడబ్ల్యూఎస్).",
    heldTitle: "స్టెప్ 1B: మీ జేబులో / ఇంట్లో ఏ ఏ గుర్తింపు కార్డులు ఉన్నాయి?",
    heldSub: "మీ వద్ద ఉన్న ఆధార్, రేషన్ కార్డులు, కరెంట్ బిల్లులను ఎంచుకోండి.",
    selectAll: "అన్నీ ఎంచుకోండి",
    clearAll: "అన్నీ తొలగించండి",
    searchTargets: "శోధించండి (ఉదా: ఆదాయ ధృవీకరణ, కులం...)",
    searchHeld: "పత్రాలు శోధించండి (ఉదా: ఆధార్, రేషన్...)",
    solveBtn: "ముందు ఏ ఆఫీస్‌కు వెళ్ళాలో చూడండి →",
    copiedRoute: "అప్లికేషన్ ప్లాన్ కాపీ చేయబడింది!",
    printPlan: "ప్రింట్ ప్లాన్ / PDF"
  },
  kn: {
    title: "ಸರ್ಕಾರಿ ಪ್ರಮಾಣಪತ್ರ ಮಾರ್ಗದರ್ಶಿ & ಕಚೇರಿ ಯೋಜನೆ",
    badge: "ಗ್ರಾಮೀಣ ಜನರಿಗಾಗಿ ಅನಗತ್ಯ ಕಚೇರಿ ಅಲೆದಾಟ ತಪ್ಪಿಸುವ ಸಹಾಯಕಿ",
    subtitle: "ನಿಮಗೆ ಬೇಕಾದ ಪ್ರಮಾಣಪತ್ರಗಳು (ಉದಾ: ಆದಾಯ, ಜಾತಿ) ಮತ್ತು ನಿಮ್ಮ ಬಳಿ ಇರುವ ಗುರುತಿನ ಚೀಟಿಗಳನ್ನು (ಉದಾ: ಆಧಾರ್, ರೇಷನ್ ಕಾರ್ಡ್) ಆಯ್ಕೆಮಾಡಿ. ಯಾವ ಕಚೇರಿಗೆ ಮೊದಲು ಹೋಗಬೇಕು ಮತ್ತು ಎಷ್ಟು ಶುಲ್ಕ (₹30) ಎಂಬುದನ್ನು ತೋರಿಸುತ್ತೇವೆ.",
    selectState: "ನಿಮ್ಮ ರಾಜ್ಯ ಮತ್ತು ಸೇವಾ ಕೇಂದ್ರ ಆಯ್ಕೆಮಾಡಿ:",
    goal: "ನಿಮ್ಮ ಮುಖ್ಯ ಗುರಿ:",
    fewestVisits: "🏛️ ಕನಿಷ್ಠ ಕಚೇರಿ ಅಲೆದಾಟ (ಮತ್ತೆ ಮತ್ತೆ ಕಚೇರಿಗೆ ಹೋಗುವುದು ಬೇಡ)",
    fastest: "⚡ ತುರ್ತು ಕೆಲಸ / ಅತಿ ಬೇಗನೆ ಪಡೆಯಲು (ಕಡಿಮೆ ದಿನಗಳಲ್ಲಿ)",
    lowestFee: "💰 ಅತ್ಯಂತ ಕಡಿಮೆ ವೆಚ್ಚ (ಸರ್ಕಾರಿ ಶುಲ್ಕ ಮಾತ್ರ, ಹಣ ಉಳಿಸಿ)",
    visits: "ಕಚೇರಿ ಭೇಟಿಗಳು",
    days: "ಹಿಡಿಯುವ ದಿನಗಳು",
    fee: "ಸರ್ಕಾರಿ ಶುಲ್ಕ",
    tabIntake: "1. 📜 ಬೇಕಾದ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ಇರುವ ಐಡಿಗಳು",
    tabPlan: "2. 🚶 ಕಚೇರಿಗೆ ಹೋಗುವ ಹಂತ-ಹಂತದ ಮಾರ್ಗ",
    tabGraph: "3. 🗺️ ಪ್ರಮಾಣಪತ್ರಗಳ ಲಿಂಕ್ ನಕ್ಷೆ",
    tabOcr: "4. 🔍 ಹೆಸರು ಮತ್ತು ಕಾಗುಣಿತ ತಪ್ಪು ಪರೀಕ್ಷೆ",
    targetsTitle: "ಹಂತ 1A: ನಿಮಗೆ ಯಾವ ಪ್ರಮಾಣಪತ್ರಗಳು ಬೇಕು?",
    targetsSub: "ನಿಮಗೆ ಬೇಕಾದ ಪ್ರಮಾಣಪತ್ರಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ (ಉದಾ: ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ, ಜಾತಿ, ಇಡಬ್ಲ್ಯೂಎಸ್).",
    heldTitle: "ಹಂತ 1B: ನಿಮ್ಮ ಬಳಿ ಯಾವ ಗುರುತಿನ ಚೀಟಿಗಳಿವೆ?",
    heldSub: "ನಿಮ್ಮ ಬಳಿ ಇರುವ ಆಧಾರ್, ರೇಷನ್ ಕಾರ್ಡ್ ಗುರುತು ಹಾಕಿ.",
    selectAll: "ಎಲ್ಲವನ್ನೂ ಆಯ್ಕೆಮಾಡಿ",
    clearAll: "ಎಲ್ಲವನ್ನೂ ತೆರವುಗೊಳಿಸಿ",
    searchTargets: "ಹುಡುಕಿ (ಉದಾ: ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ, ಜಾತಿ...)",
    searchHeld: "ದಾಖಲೆ ಹುಡುಕಿ (ಉದಾ: ಆಧಾರ್, ರೇಷನ್...)",
    solveBtn: "ಮೊದಲು ಯಾವ ಕಚೇರಿಗೆ ಹೋಗಬೇಕು ನೋಡಿ →",
    copiedRoute: "ಅರ್ಜಿ ಯೋಜನೆ ಪ್ರತಿಯನ್ನು ನಕಲಿಸಲಾಗಿದೆ!",
    printPlan: "ಪ್ರಿಂಟ್ ಮಾಡಿ / PDF"
  }
};

const RESOLVER_STEP_LABELS = {
  en: { intake: "Certificates & IDs", plan: "Office Visit Plan", graph: "Certificate Map", ocr: "Name Check" },
  ml: { intake: "സർട്ടിഫിക്കറ്റുകളും ഐഡികളും", plan: "ഓഫീസ് സന്ദർശന പ്ലാൻ", graph: "സർട്ടിഫിക്കറ്റ് മാപ്പ്", ocr: "പേര് പരിശോധന" },
  hi: { intake: "प्रमाणपत्र और आईडी", plan: "कार्यालय यात्रा योजना", graph: "प्रमाणपत्र मानचित्र", ocr: "नाम जांच" },
  te: { intake: "సర్టిఫికెట్లు & ఐడీలు", plan: "ఆఫీస్ విజిట్ ప్లాన్", graph: "సర్టిఫికేట్ మ్యాప్", ocr: "పేరు తనిఖీ" },
  kn: { intake: "ಪ್ರಮಾಣಪತ್ರ & ಐಡಿಗಳು", plan: "ಕಚೇರಿ ಭೇಟಿ ಯೋಜನೆ", graph: "ಪ್ರಮಾಣಪತ್ರ ನಕ್ಷೆ", ocr: "ಹೆಸರು ಪರಿಶೀಲನೆ" }
};

export default function CertificateResolver({
  language = "en",
  selectedDistrict: propDistrict = "Kozhikode",
  selectedLocality: propLocality = "Azhiyur",
  onSelectPanchayat
}) {
  const currentLang = RESOLVER_TRANSLATIONS[language] ? language : "en";
  const t = RESOLVER_TRANSLATIONS[currentLang];

  // Panchayat & District Selection State (defaults to Kozhikode & Azhiyur, supports all 941 Grama Panchayats in Kerala)
  const [selectedDistrictName, setSelectedDistrictName] = useState(() => propDistrict || "Kozhikode");
  const [selectedPanchayatName, setSelectedPanchayatName] = useState(() => propLocality || "Azhiyur");
  const [panchayatSearch, setPanchayatSearch] = useState("");

  // Sync when prop changes
  useEffect(() => {
    if (propDistrict && propDistrict !== "all") {
      setSelectedDistrictName(propDistrict);
    }
    if (propLocality && propLocality !== "all") {
      setSelectedPanchayatName(propLocality);
    }
  }, [propDistrict, propLocality]);

  // State variables initialized with localStorage persistence
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

  // Procedure Modal state for viewing What, Where & How to get
  const [selectedCertForModal, setSelectedCertForModal] = useState(null);

  // Close procedure modal on Escape key and lock background scroll when active
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

  // Internal active view: 'intake' | 'plan' | 'graph' | 'ocr'
  const [activeSubTab, setActiveSubTab] = useState("plan");
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

  // Load Preset Sample Document
  const handleLoadPreset = (preset) => {
    const newDoc = { ...preset, id: `${preset.id}_${Date.now()}` };
    setScannedDocs((prev) => [...prev, newDoc]);
    if (!heldDocIds.includes(preset.documentTypeId)) {
      setHeldDocIds((prev) => [...prev, preset.documentTypeId]);
    }
  };

  // Update Extracted Field in Scanned Doc
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

  // AO* Solver computation memoized
  const solverResult = useMemo(() => {
    return solveCertificateGraph({
      targetIds,
      targetCertIds: targetIds,
      heldDocIds,
      stateKey: selectedState,
      objective
    });
  }, [targetIds, heldDocIds, selectedState, objective]);

  // Inspect Mismatches across scanned documents
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
        // When user adds a target goal, remove it from held documents
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
        // When user marks a document as already possessed, remove it from target goals
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

  // Share & Print handlers
  const handleSharePlan = () => {
    const targetNames = targetIds
      .map((id) => TARGET_CERTIFICATES.find((t) => t.id === id)?.name || id)
      .join(", ");
    
    const summaryText = `🌾 GramSeva Certificate Plan (${selectedState.toUpperCase()}):\nTargets: ${targetNames}\nVisits Required: ${solverResult.totalVisits}\nEstimated Days: ~${solverResult.totalDays}\nTotal Fees: ₹${solverResult.totalFee}\nSteps:\n` +
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

  // Handle Photo File Scan
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

  // Remove Scanned Doc
  const removeScannedDoc = (id) => {
    setScannedDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const currentState = STATE_DATASETS[selectedState] || STATE_DATASETS.kerala;

  // Filtered Target Certificates list
  const filteredTargetCerts = TARGET_CERTIFICATES.filter((cert) => {
    const matchesSearch = cert.name.toLowerCase().includes(targetSearchQuery.toLowerCase()) ||
                          cert.desc.toLowerCase().includes(targetSearchQuery.toLowerCase());
    const matchesCat = targetCategoryFilter === "all" || cert.category === targetCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Held Docs list
  const filteredAnchorDocs = ANCHOR_DOCUMENTS.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
                          doc.desc.toLowerCase().includes(docSearchQuery.toLowerCase());
    const matchesCat = docCategoryFilter === "all" || doc.category === docCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Certificate Modal details memoized
  const modalCertDetails = useMemo(() => {
    if (!selectedCertForModal) return null;
    return getCertificateDetails(selectedCertForModal, selectedState);
  }, [selectedCertForModal, selectedState]);

  return (
    <div className="certificate-resolver flex-1 flex flex-col min-h-0 bg-slate-50 text-slate-900 overflow-y-auto scrollbar-none pb-24">
      {/* Top Banner / Hero Controls */}
      <div className="resolver-hero text-white p-4 sm:p-6 lg:p-8 border-b border-emerald-800/50 print:bg-white print:text-black">
        <div className="max-w-7xl mx-auto">
          <div className="resolver-hero-layout grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] lg:items-center">
            <div className="resolver-hero-copy min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <GitFork className="w-3 h-3" /> {t.badge}
                </span>
              </div>
              <h2 className="font-classical text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mt-2 leading-tight print:text-slate-900">
                {t.title}
              </h2>
              <p className="text-sm text-emerald-50/85 max-w-2xl mt-2 leading-relaxed print:text-slate-600">
                {t.subtitle}
              </p>
            </div>

            {/* State & Panchayat Location Selector */}
            <div className="resolver-location-panel w-full min-w-0 p-4 rounded-2xl border border-white/15 space-y-3 print:hidden">
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-50/75 block mb-1.5">
                  {t.selectState}
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="resolver-select w-full min-w-0 bg-slate-950 border border-emerald-400/40 text-white font-bold rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/25 transition"
                >
                  <option value="kerala">🌴 Kerala — Akshaya & Panchayat{language === "ml" ? " (അക്ഷയ കേന്ദ്രം)" : ""}</option>
                  <option value="karnataka">🏰 Karnataka — Nada Kacheri & Grama One (ನಾಡ ಕಚೇರಿ)</option>
                  <option value="tamilnadu">🏛️ Tamil Nadu — e-Sevai & Taluk Office{language === "ta" ? " (இ-சேவை)" : ""}</option>
                  <option value="pan_india">🌾 Other States — Tehsil & Jan Seva Kendra{language === "hi" ? " (तहसील / जन सेवा केंद्र)" : ""}</option>
                </select>
              </div>

              {selectedState === "kerala" && (
                <div className="resolver-kerala-fields pt-3 border-t border-white/10">
                  <div className="resolver-kerala-heading flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" /> Select Grama Panchayat (Kerala)
                    </span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">
                      941 Panchayats
                    </span>
                  </div>

                  {/* District Dropdown */}
                  <div>
                    <label className="text-[10px] font-bold text-emerald-50/70 block mb-1">District (14 Districts):</label>
                    <select
                      value={selectedDistrictName}
                      onChange={(e) => {
                        const newDist = e.target.value;
                        setSelectedDistrictName(newDist);
                        const firstP = KERALA_PANCHAYATS_BY_DISTRICT[newDist]?.[0]?.en || "Azhiyur";
                        setSelectedPanchayatName(firstP);
                        if (onSelectPanchayat) onSelectPanchayat(newDist, firstP);
                      }}
                      className="resolver-select w-full min-w-0 bg-slate-950 border border-emerald-400/30 text-white font-bold rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/25"
                    >
                      {KERALA_DISTRICTS_LIST.map((dist) => (
                        <option key={dist.id} value={dist.en}>
                          {currentLang === "ml" ? `${dist.ml} (${dist.en})` : dist.en} &middot; {dist.totalPanchayats} Panchayats
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Panchayat Dropdown */}
                  <div>
                    <label className="text-[10px] font-bold text-emerald-50/70 block mb-1">Grama Panchayat:</label>
                    <select
                      value={selectedPanchayatName}
                      onChange={(e) => {
                        const pName = e.target.value;
                        setSelectedPanchayatName(pName);
                        if (onSelectPanchayat) onSelectPanchayat(selectedDistrictName, pName);
                      }}
                      className="resolver-select w-full min-w-0 bg-slate-950 border border-emerald-400/30 text-emerald-200 font-extrabold rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/25"
                    >
                      {(KERALA_PANCHAYATS_BY_DISTRICT[selectedDistrictName] || []).map((p) => (
                        <option key={p.en} value={p.en}>
                          {currentLang === "ml" ? `${p.ml} (${p.en})` : p.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <span className="text-[10px] text-emerald-200/80 block font-semibold">
                {currentState.portalName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <div className="resolver-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 w-full">
        {/* Navigation Sub-Tabs */}
        <div className="resolver-tabs grid grid-cols-2 lg:grid-cols-4 gap-2 border-b border-slate-200 pb-3 mb-4 select-none print:hidden" role="tablist" aria-label="Certificate planning steps">
          {[
            { id: "intake", label: t.tabIntake, icon: <CheckCircle2 className="w-4 h-4 shrink-0" />, count: targetIds.length },
            { id: "plan", label: t.tabPlan, icon: <Zap className="w-4 h-4 shrink-0" />, highlight: solverResult.savedVisits > 0 },
            { id: "graph", label: t.tabGraph, icon: <GitFork className="w-4 h-4 shrink-0" /> },
            { id: "ocr", label: t.tabOcr, icon: <Camera className="w-4 h-4 shrink-0" />, badge: mismatchReport.hasMismatches ? "Mismatch" : null }
          ].map((tab, tabIndex) => {
            const isActive = activeSubTab === tab.id;
            const tabLabel = RESOLVER_STEP_LABELS[currentLang]?.[tab.id] || tab.label.split(" ").slice(2).join(" ") || tab.label;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                role="tab"
                aria-selected={isActive}
                title={tab.label}
                className={`resolver-tab flex items-center justify-start gap-2.5 px-3 py-3 rounded-xl text-xs font-bold transition cursor-pointer border text-left w-full min-h-[58px] min-w-0 ${
                  isActive
                    ? "is-active bg-emerald-50 text-emerald-950 border-emerald-600 shadow-sm font-black"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <span className={`resolver-tab-icon w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {tab.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[9px] uppercase tracking-wider mb-0.5 ${isActive ? "text-emerald-700" : "text-slate-400"}`}>Step {tabIndex + 1}</span>
                  <span className="resolver-tab-label block whitespace-normal leading-snug">{tabLabel}</span>
                </span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] shrink-0 ${isActive ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-500 text-slate-950 uppercase animate-pulse shrink-0">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SUB-TAB 1: INTAKE & SELECTION */}
        {activeSubTab === "intake" && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick 2-Step Guidance Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-700 text-white shrink-0 mt-0.5 sm:mt-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                    How This Certificate Guide Works (2 Simple Steps)
                  </h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
                    <strong>1. Tick your boxes:</strong> Select the certificates you need in <strong>Step 1A</strong>, and tick the ID cards you already have in <strong>Step 1B</strong>.<br />
                    <strong>2. Get your travel roadmap:</strong> Click <strong>"2. Step-by-Step Office Visit Plan"</strong> to see which office to visit first, exact prerequisites, official fees (e.g. ₹30), and how to avoid extra trips!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSubTab("plan")}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5 self-end sm:self-auto"
              >
                <span>Go to Visit Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Target Certificates Selector */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-emerald-700" />
                    {t.targetsTitle} ({TARGET_CERTIFICATES.length} Total)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t.targetsSub}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={selectAllTargets}
                    className="text-[10px] font-bold text-emerald-800 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 transition cursor-pointer"
                  >
                    {t.selectAll}
                  </button>
                  <button
                    onClick={clearAllTargets}
                    className="text-[10px] font-bold text-slate-600 hover:bg-stone-200 px-2.5 py-1 rounded-lg border border-stone-300 transition cursor-pointer"
                  >
                    {t.clearAll}
                  </button>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                    {targetIds.length} Selected
                  </span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t.searchTargets}
                    value={targetSearchQuery}
                    onChange={(e) => setTargetSearchQuery(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-600"
                  />
                </div>

                <select
                  value={targetCategoryFilter}
                  onChange={(e) => setTargetCategoryFilter(e.target.value)}
                  className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold outline-none focus:border-emerald-600"
                >
                  <option value="all">📋 All Certificate Types{language === "ml" ? " (എല്ലാ സർട്ടിഫിക്കറ്റുകളും)" : language === "hi" ? " (सभी प्रमाण पत्र)" : language === "te" ? " (అన్ని ధృవీకరణ పత్రాలు)" : ""}</option>
                  <option value="obscure">⭐ Special Papers (Landless, Borewell, Pension, Fire NOC...)</option>
                  <option value="revenue">🌾 Income, Land & Caste Papers{language === "ml" ? " (വരുമാനം, വില്ലേജ് രേഖകൾ)" : language === "hi" ? " (आय, भूमि और जाति दस्तावेज)" : language === "te" ? " (ఆదాయ, భూమి మరియు కుల పత్రాలు)" : ""}</option>
                  <option value="vital">👶 Birth, Marriage & Death Certificates{language === "ml" ? " (ജനനം, മരണം, വിവാഹം)" : language === "hi" ? " (जन्म, विवाह और मृत्यु प्रमाण पत्र)" : language === "te" ? " (జనన, వివాహ మరియు మరణ ధృవీకరణ పత్రాలు)" : ""}</option>
                  <option value="education">🎓 School, Marksheet & Job Papers{language === "ml" ? " (വിദ്യാഭ്യാസം, പഠനം)" : language === "hi" ? " (स्कूल, मार्कशीट और नौकरी के कागजात)" : language === "te" ? " (పాఠశాల, మార్కుల జాబితా మరియు ఉద్యోగ పత్రాలు)" : ""}</option>
                  <option value="business">🏪 Shop, License & Business Permits{language === "ml" ? " (കച്ചവടം, ലൈസൻസ്)" : language === "hi" ? " (दुकान, लाइसेंस और व्यापार परमिट)" : language === "te" ? " (దుకాణం, లైసెన్స్ మరియు వ్యాపార అనుమతులు)" : ""}</option>
                  <option value="transport">🚗 Driving License & Vehicle Papers{language === "ml" ? " (ഡ്രൈവിംഗ്, വാഹനം)" : language === "hi" ? " (ड्राइविंग लाइसेंस और वाहन दस्तावेज)" : language === "te" ? " (డ్రైవింగ్ లైసెన్స్ మరియు వాహన పత్రాలు)" : ""}</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {filteredTargetCerts.map((cert) => {
                  const isChecked = targetIds.includes(cert.id);
                  return (
                    <div
                      key={cert.id}
                      className={`p-3 rounded-xl border text-xs transition select-none flex flex-col justify-between gap-2.5 ${
                        isChecked
                          ? "bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/50 shadow-xs"
                          : "bg-white border-stone-200 hover:border-stone-300 text-slate-800"
                      }`}
                    >
                      <div className="flex items-start gap-2.5 cursor-pointer" onClick={() => toggleTarget(cert.id)}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 w-4 h-4 accent-emerald-700 rounded cursor-pointer shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-extrabold text-slate-900 block leading-tight">
                              {cert.name}
                            </span>
                            <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded shrink-0 ${
                              cert.category === "obscure"
                                ? "bg-purple-100 text-purple-900 border border-purple-300"
                                : "bg-stone-100 text-slate-700"
                            }`}>
                              {cert.category}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block leading-normal mt-0.5">
                            {cert.desc}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCertForModal(cert.id);
                        }}
                        className="w-full text-[10px] font-bold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 border border-emerald-300/80 rounded-lg py-1 px-2 flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <Info className="w-3 h-3 text-emerald-700" />
                        <span>What, Where & How to Get</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Possessed / Held Documents Checklist */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    {t.heldTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t.heldSub}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAllHeld}
                    className="text-[10px] font-bold text-emerald-800 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 transition cursor-pointer"
                  >
                    {t.selectAll}
                  </button>
                  <button
                    onClick={clearAllHeld}
                    className="text-[10px] font-bold text-slate-600 hover:bg-stone-200 px-2.5 py-1 rounded-lg border border-stone-300 transition cursor-pointer"
                  >
                    {t.clearAll}
                  </button>
                  <span className="text-xs font-bold text-slate-700 bg-stone-200 px-2.5 py-1 rounded-full border border-stone-300">
                    {heldDocIds.length} Held
                  </span>
                  <button
                    onClick={() => setActiveSubTab("plan")}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    {t.solveBtn} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t.searchHeld}
                    value={docSearchQuery}
                    onChange={(e) => setDocSearchQuery(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-600"
                  />
                </div>

                <select
                  value={docCategoryFilter}
                  onChange={(e) => setDocCategoryFilter(e.target.value)}
                  className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold outline-none focus:border-emerald-600"
                >
                  <option value="all">📋 All ID Cards & Papers{language === "ml" ? " (എല്ലാ തിരിച്ചറിയൽ രേഖകളും)" : language === "hi" ? " (सभी पहचान पत्र)" : language === "te" ? " (అన్ని గుర్తింపు కార్డులు)" : ""}</option>
                  <option value="identity">🪪 Aadhaar, Voter ID & PAN Cards{language === "ml" ? " (ആധാർ, വോട്ടർ ഐഡി, പാൻ)" : language === "hi" ? " (आधार, वोटर आईडी और पैन कार्ड)" : language === "te" ? " (ఆధార్, ఓటర్ ఐడి మరియు పాన్ కార్డులు)" : ""}</option>
                  <option value="residence">🏠 Ration Card, Current & Water Bills{language === "ml" ? " (റേഷൻ കാർഡ്, കറന്റ് ബില്ല്)" : language === "hi" ? " (राशन कार्ड, बिजली और पानी के बिल)" : language === "te" ? " (రేషన్ కార్డ్, విద్యుత్ మరియు నీటి బిల్లులు)" : ""}</option>
                  <option value="income">💼 Salary Slips & Tax Receipts{language === "ml" ? " (ശമ്പള സർട്ടിഫിക്കറ്റ്, നികുതി)" : language === "hi" ? " (वेतन पर्ची और कर रसीदें)" : language === "te" ? " (వేతన రశీదులు మరియు పన్ను రశీదులు)" : ""}</option>
                  <option value="education">📜 10th / SSLC Marksheet & School Books{language === "ml" ? " (എസ്.എസ്.എൽ.സി ബുക്ക്)" : language === "hi" ? " (10वीं / एसएसएलसी मार्कशीट)" : language === "te" ? " (10వ తరగతి / మార్కుల జాబితా)" : ""}</option>
                  <option value="family">👨‍👩‍👧 Family Tree & Land Deeds{language === "ml" ? " (കുടുംബ രേഖകൾ, ആധാരം)" : language === "hi" ? " (पारिवारिक दस्तावेज और भूमि विलेख)" : language === "te" ? " (కుటుంబ వివరాలు మరియు భూమి దస్తావేజులు)" : ""}</option>
                </select>
              </div>

              {/* Document List Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {filteredAnchorDocs.map((doc) => {
                  const isPossessed = heldDocIds.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleHeldDoc(doc.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition select-none flex items-start gap-2.5 ${
                        isPossessed
                          ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-medium"
                          : "bg-white border-stone-200 hover:border-stone-300 text-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isPossessed}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 accent-emerald-700 rounded cursor-pointer shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-extrabold text-slate-900 truncate">
                            {doc.name}
                          </span>
                          {doc.anchor && (
                            <span className="text-[9px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300 shrink-0">
                              Anchor
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                          {doc.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: OPTIMAL PLAN (AO* SOLUTION) */}
        {activeSubTab === "plan" && (
          <div className="space-y-5 animate-fade-in">
            {/* Explanatory Roadmap Banner */}
            <div className="resolver-plan-intro bg-emerald-950 text-white rounded-2xl p-4 sm:p-5 shadow-xs border border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 border border-emerald-500/60 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-emerald-100" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Your office visit sequence</span>
                  <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
                    Complete each application in the right order
                  </h3>
                  <p className="text-xs text-emerald-100/85 leading-relaxed max-w-3xl mt-1">
                    Finish local Panchayat documents first, then move to the next authority. Shared documents are reused across every selected certificate.
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setActiveSubTab("intake")} className="shrink-0 self-end sm:self-auto px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-extrabold text-white transition cursor-pointer flex items-center gap-1.5">
                Edit documents <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Plan Metrics Summary Grid */}
            <div className="resolver-metrics grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="resolver-metric-card bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <span className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0"><Building2 className="w-4 h-4" /></span>
                <div className="min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Office visits</span>
                  <span className="text-lg font-black text-slate-950 block leading-tight mt-0.5">{solverResult.totalVisits}</span>
                  {solverResult.savedVisits > 0 && <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">{solverResult.savedVisits} visit(s) saved</span>}
                </div>
              </div>

              <div className="resolver-metric-card bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <span className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0"><Clock className="w-4 h-4" /></span>
                <div className="min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Processing time</span>
                  <span className="text-lg font-black text-slate-950 block leading-tight mt-0.5">~{solverResult.totalDays} days</span>
                  <span className="text-[10px] font-medium text-slate-500 block mt-0.5">Expected timeline</span>
                </div>
              </div>

              <div className="resolver-metric-card bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <span className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0"><Banknote className="w-4 h-4" /></span>
                <div className="min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Government fees</span>
                  <span className="text-lg font-black text-slate-950 block leading-tight mt-0.5">₹{solverResult.totalFee}</span>
                  {solverResult.savedFees > 0 && <span className="text-[10px] font-bold text-amber-700 block mt-0.5">₹{solverResult.savedFees} saved</span>}
                </div>
              </div>

              <div className="resolver-metric-card bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                <span className="w-9 h-9 rounded-lg bg-violet-100 text-violet-800 flex items-center justify-center shrink-0"><FileCheck2 className="w-4 h-4" /></span>
                <div className="min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Certificates</span>
                  <span className="text-lg font-black text-slate-950 block leading-tight mt-0.5">{targetIds.length}</span>
                  <button onClick={() => setActiveSubTab("intake")} className="text-[10px] font-bold text-emerald-700 hover:underline block mt-0.5 cursor-pointer">Edit selection</button>
                </div>
              </div>
            </div>

            {/* Optimization Strategy & Redundancy Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-300/80 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-700 text-white shrink-0 mt-0.5 sm:mt-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900 block">
                      AO* Joint Dependency Optimizer Active
                    </span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5 leading-relaxed">
                      {solverResult.redundancySavings}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSubTab("graph")}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-slate-800 text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0 self-end sm:self-auto"
                >
                  <GitFork className="w-3.5 h-3.5 text-emerald-700" /> View Graph Map
                </button>
              </div>

              {/* Optimization Strategy Selector */}
              <div className="pt-2 border-t border-emerald-200/80 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 shrink-0">
                  Optimization Priority:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "fewest_visits", label: "Fewest Office Visits", icon: "🚀" },
                    { id: "fastest", label: "Fastest Processing Time", icon: "⚡" },
                    { id: "lowest_fee", label: "Lowest Government Fee", icon: "💰" }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setObjective(opt.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                        objective === opt.id
                          ? "bg-emerald-800 text-white border-emerald-900 shadow-2xs"
                          : "bg-white text-slate-700 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Execution Steps Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-700" />
                  Step-By-Step Execution Route ({solverResult.executionSteps.length} Steps)
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {currentState.stateName} &middot; {currentState.portalName}
                </span>
              </div>

              {targetIds.length === 0 ? (
                <div className="bg-stone-50 border border-dashed border-stone-300 rounded-2xl p-8 text-center space-y-3">
                  <FileCheck2 className="w-10 h-10 text-emerald-700 mx-auto" />
                  <h4 className="font-black text-slate-900 text-base">No Target Certificates Selected</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Select one or more certificates in <strong>Tab 1: Target Selection</strong> to generate your optimal step-by-step route plan.
                  </p>
                  <button
                    onClick={() => setActiveSubTab("intake")}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                  >
                    Select Certificates <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : solverResult.executionSteps.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-slate-900 text-base">You Already Hold All Required Documents!</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Based on your possessed documents selection, you already hold all prerequisite and target certificates needed.
                  </p>
                  <button
                    onClick={() => setActiveSubTab("intake")}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                  >
                    Add More Target Goals <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {solverResult.executionSteps.map((step) => {
                    const isExpanded = expandedStepRoute === step.nodeId;
                    const altRoutes = currentState.routes[step.nodeId] || [];

                    return (
                      <div
                        key={step.nodeId}
                        className={`border rounded-2xl p-4 sm:p-5 transition shadow-2xs ${
                          step.isTarget
                            ? "bg-white border-emerald-300 ring-1 ring-emerald-500/20"
                            : "bg-stone-50 border-stone-200"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            {/* Step Number Badge */}
                            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                              {step.stepNumber}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                                  {step.office}
                                </span>
                                {step.isTarget && (
                                  <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                                    Target Certificate Goal
                                  </span>
                                )}
                              </div>

                              <h4 className="font-classical text-base font-black text-slate-900 mt-1">
                                {step.title}
                              </h4>

                              <p className="text-xs text-slate-600 mt-0.5">
                                Selected Route: <strong className="text-slate-900">{step.routeLabel}</strong>
                              </p>
                            </div>
                          </div>

                          {/* Quick Metrics & Procedure Button */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <div className="text-right text-xs bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
                              <span className="font-extrabold text-slate-900 block">{step.visits} Visit &middot; ~{step.days} Days</span>
                              <span className="text-[10px] text-emerald-800 font-bold block">Fee: ₹{step.fee}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedCertForModal(step.nodeId)}
                              className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 rounded-xl px-3 py-2 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                            >
                              <Info className="w-3.5 h-3.5 text-emerald-700" />
                              <span className="hidden sm:inline">What, Where & How</span>
                            </button>
                          </div>
                        </div>

                        {/* Prerequisites Breakdown */}
                        <div className="mt-4 pt-3 border-t border-stone-200">
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
                                      ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                      : "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                                  }`}
                                >
                                  {isHeld ? (
                                    <Check className="w-3 h-3 text-emerald-700" />
                                  ) : (
                                    <AlertTriangle className="w-3 h-3 text-amber-700" />
                                  )}
                                  <span>{pName}</span>
                                  {isHeld && <span className="text-[9px] font-black text-emerald-700">(Possessed)</span>}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Rejection Risk Tip */}
                        {step.tips && (
                          <div className="mt-3 bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-extrabold block text-[10px] uppercase tracking-wider text-amber-800">
                                Counter Prevention Tip
                              </span>
                              <p className="text-xs leading-normal">{step.tips}</p>
                            </div>
                          </div>
                        )}

                        {/* Alternative Routes Accordion */}
                        {altRoutes.length > 1 && (
                          <div className="mt-3">
                            <button
                              onClick={() => setExpandedStepRoute(isExpanded ? null : step.nodeId)}
                              className="text-xs font-extrabold text-slate-600 hover:text-emerald-700 transition flex items-center gap-1 cursor-pointer"
                            >
                              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                              <span>Why this route? View {altRoutes.length - 1} Alternative Route(s)</span>
                            </button>

                            {isExpanded && (
                              <div className="mt-2 space-y-2 pl-4 border-l-2 border-stone-300 animate-fade-in">
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
                                          <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-200 px-1.5 py-0.2 rounded">
                                            Picked by Solver
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-slate-500 mt-1">
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

        {/* SUB-TAB 3: DEPENDENCY MAP */}
        {activeSubTab === "graph" && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <GitFork className="w-4 h-4 text-emerald-700" />
                  Interactive AND/OR Certificate Dependency Map
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual breakdown of Target Nodes (Certificates), OR Branches (Alternative Routes), and AND Branches (Prerequisite Documents).
                </p>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-2 text-xs border-b border-stone-200 pb-3">
                <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Possessed / Held Document
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 font-extrabold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-700" /> Target Certificate
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-stone-300 text-slate-800 font-extrabold flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-600" /> Intermediate Office Visit
                </span>
              </div>

              {/* Interactive Tree Rendering */}
              <div className="space-y-4 pt-2">
                {targetIds.map((tId) => {
                  const targetInfo = TARGET_CERTIFICATES.find((t) => t.id === tId) || { name: tId };
                  const chosenRoute = solverResult.chosenRoutes[tId];

                  return (
                    <div key={tId} className="border border-stone-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-amber-100 text-amber-900 rounded-lg border border-amber-300">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-amber-800 block">Target Certificate</span>
                            <h4 className="font-classical text-base font-black text-slate-900">{targetInfo.name}</h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {chosenRoute && (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              Route: {chosenRoute.label}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedCertForModal(tId)}
                            className="p-1.5 bg-stone-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 rounded-lg border border-stone-300 transition cursor-pointer"
                            title="View What, Where & How to get"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Prerequisites Branches */}
                      {chosenRoute && (
                        <div className="pl-4 border-l-2 border-emerald-500 space-y-2">
                          <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
                            AND Branch Prerequisites:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                                      ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold hover:bg-emerald-100"
                                      : "bg-slate-50 border-stone-200 text-slate-800 hover:bg-slate-100"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {isHeld ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                    ) : (
                                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    )}
                                    <span className="truncate">{pName}</span>
                                  </div>
                                  <Info className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-700 shrink-0" />
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

        {/* SUB-TAB 4: OCR INTAKE & MISMATCH INSPECTOR */}
        {activeSubTab === "ocr" && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Presets Bar */}
            <div className="bg-emerald-900/5 border border-emerald-300/60 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  Quick Test: Load Sample Scanned Documents
                </span>
                <span className="text-[10px] text-slate-500 font-semibold hidden sm:inline">
                  Click any preset to simulate OCR text extraction & bounding box alignment
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {SAMPLE_DOCUMENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleLoadPreset(preset)}
                    className="bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-2xs cursor-pointer active:scale-95"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>+ Load {preset.documentTypeId.replace("_", " ").toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* OCR Document Scanner Controls */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    Document Photo Intake & Spelling Inspector
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Photograph physical documents (Aadhaar, PAN, Ration Card). OCR extracts Name, DOB, & Address to catch spelling discrepancies before counter rejection!
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      showBoundingBoxes
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-stone-200 text-slate-700 border border-stone-300"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{showBoundingBoxes ? "Hide Boxes" : "Show OCR Boxes"}</span>
                  </button>

                  <select
                    value={scanDocType}
                    onChange={(e) => setScanDocType(e.target.value)}
                    className="bg-white border border-stone-300 text-slate-800 font-bold rounded-xl px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
                  >
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="ration_card">Ration Card</option>
                    <option value="pan_card">PAN Card</option>
                    <option value="sslc_marksheet">10th / SSLC Marksheet</option>
                  </select>

                  <label className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Camera / Upload</span>
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

              {/* Scanned Documents Grid */}
              {isScanning && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center text-xs text-emerald-900 font-bold animate-pulse flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                  Running Intelligent OCR Extraction... Identifying Name, DOB, & Document ID
                </div>
              )}

              {scannedDocs.length === 0 ? (
                <div className="bg-white border border-dashed border-stone-300 rounded-xl p-8 text-center text-xs text-slate-500 space-y-2">
                  <Camera className="w-10 h-10 text-slate-300 mx-auto" />
                  <span className="font-black text-slate-800 text-sm block">No Document Photos Scanned Yet</span>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Click <strong>Camera / Upload</strong> above or pick a sample preset to test automatic text extraction & cross-document spelling validation.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {scannedDocs.map((doc) => {
                    const isHeld = heldDocIds.includes(doc.documentTypeId);
                    const isEditing = editingDocId === doc.id;

                    return (
                      <div key={doc.id} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs space-y-3">
                        {/* Header Badge & Actions */}
                        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                              {doc.documentTypeId.replace("_", " ").toUpperCase()}
                            </span>
                            {doc.extractedData?.confidence && (
                              <span className="text-[10px] font-extrabold text-slate-500">
                                {doc.extractedData.confidence}% OCR Confidence
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingDocId(isEditing ? null : doc.id)}
                              className="text-xs font-bold text-slate-600 hover:text-emerald-700 px-2 py-1 rounded bg-stone-100 hover:bg-emerald-50 transition cursor-pointer"
                            >
                              {isEditing ? "Save" : "Edit Fields"}
                            </button>
                            <button
                              onClick={() => removeScannedDoc(doc.id)}
                              className="text-slate-400 hover:text-red-600 p-1 rounded transition cursor-pointer"
                              title="Delete Scan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* OCR Image Canvas with Bounding Boxes */}
                        <div className="relative overflow-hidden rounded-xl bg-slate-950 border border-stone-200 h-44 flex items-center justify-center">
                          <img
                            src={doc.photoUrl}
                            alt="Scanned Document"
                            className="w-full h-full object-cover opacity-85"
                          />

                          {/* Render Bounding Boxes Overlay */}
                          {showBoundingBoxes && doc.boundingBoxes && (
                            <div className="absolute inset-0 pointer-events-none">
                              {doc.boundingBoxes.map((box, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    left: box.left,
                                    top: box.top,
                                    width: box.width,
                                    height: box.height
                                  }}
                                  className="absolute border-2 border-emerald-400 bg-emerald-400/10 rounded backdrop-blur-[0.5px] animate-pulse flex items-start justify-start p-0.5"
                                >
                                  <span className="text-[8px] font-black uppercase bg-emerald-900 text-white px-1 py-0.2 rounded opacity-90">
                                    {box.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Extracted Key-Value Form */}
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2 text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            {/* Full Name Field */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase block">Extracted Name</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={doc.extractedData.fullName}
                                  onChange={(e) => handleUpdateExtractedField(doc.id, "fullName", e.target.value)}
                                  className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs text-slate-900 font-bold outline-none focus:border-emerald-600"
                                />
                              ) : (
                                <span className="font-extrabold text-slate-900 block">
                                  {doc.extractedData.fullName}
                                </span>
                              )}
                            </div>

                            {/* DOB Field */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase block">Extracted DOB</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={doc.extractedData.dob}
                                  onChange={(e) => handleUpdateExtractedField(doc.id, "dob", e.target.value)}
                                  className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs text-slate-900 font-bold outline-none focus:border-emerald-600"
                                />
                              ) : (
                                <span className="font-bold text-slate-800 block">
                                  {doc.extractedData.dob}
                                </span>
                              )}
                            </div>

                            {/* Father Name Field */}
                            {doc.extractedData.fatherName && (
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase block">Father Name</label>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={doc.extractedData.fatherName}
                                    onChange={(e) => handleUpdateExtractedField(doc.id, "fatherName", e.target.value)}
                                    className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs text-slate-900 outline-none focus:border-emerald-600"
                                  />
                                ) : (
                                  <span className="font-semibold text-slate-800 block">
                                    {doc.extractedData.fatherName}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Document ID Number */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase block">Document Number</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={doc.extractedData.documentNumber}
                                  onChange={(e) => handleUpdateExtractedField(doc.id, "documentNumber", e.target.value)}
                                  className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs font-mono text-slate-900 outline-none focus:border-emerald-600"
                                />
                              ) : (
                                <span className="font-mono font-bold text-slate-800 block">
                                  {doc.extractedData.documentNumber}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Address Field */}
                          {doc.extractedData.address && (
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase block">Extracted Address</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={doc.extractedData.address}
                                  onChange={(e) => handleUpdateExtractedField(doc.id, "address", e.target.value)}
                                  className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs text-slate-900 outline-none focus:border-emerald-600"
                                />
                              ) : (
                                <span className="text-slate-600 block text-[11px] leading-tight">
                                  {doc.extractedData.address}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Auto Sync to Dependency Graph */}
                          <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">
                              Status in Application Plan:
                            </span>

                            <button
                              onClick={() => toggleHeldDoc(doc.documentTypeId)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                isHeld
                                  ? "bg-emerald-600 text-white"
                                  : "bg-stone-200 hover:bg-stone-300 text-slate-800"
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isHeld ? "Marked Held in Graph" : "Confirm & Add to Graph"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mismatch Inspector Report Card */}
            <div className={`border rounded-2xl p-4 sm:p-6 shadow-2xs space-y-3 ${
              mismatchReport.hasMismatches
                ? "bg-amber-50/80 border-amber-300"
                : "bg-emerald-50/80 border-emerald-300"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {mismatchReport.hasMismatches ? (
                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  )}
                  <div>
                    <h4 className="font-classical text-base font-black text-slate-900">
                      Cross-Document Spelling & Mismatch Inspector
                    </h4>
                    <span className="text-xs text-slate-600 font-medium">{mismatchReport.summary}</span>
                  </div>
                </div>
              </div>

              {mismatchReport.issues.map((issue) => (
                <div key={issue.id} className="bg-white border border-amber-200 p-3.5 rounded-xl text-xs space-y-2 text-slate-800 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-900 uppercase text-[10px] tracking-wider flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700" /> {issue.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-100 text-red-800 border border-red-300">
                      Rejection Risk
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900">{issue.description}</p>
                  <p className="text-[11px] text-red-700 font-semibold">{issue.rejectionRisk}</p>

                  <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                    <strong>Recommended Action:</strong> {issue.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL / SLIDE-OVER: Comprehensive What, Where & How Procedure Guide */}
      <AnimatePresence>
        {selectedCertForModal && modalCertDetails && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex items-center justify-center animate-fade-in transition-opacity cursor-pointer overflow-hidden"
            onClick={() => setSelectedCertForModal(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-stone-200 rounded-2xl shadow-2xl w-full max-w-xl max-h-[calc(100%-1rem)] sm:max-h-[calc(100%-2rem)] flex flex-col overflow-hidden text-slate-900 relative cursor-default shrink-0 my-auto"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white px-3.5 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 shrink-0 border-b border-emerald-800/50">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-emerald-300 font-bold uppercase tracking-wider mb-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-black">
                      {modalCertDetails.category}
                    </span>
                    <span>•</span>
                    <span>{currentState.stateName} Service</span>
                  </div>
                  <h3 id="modal-title" className="font-classical text-base sm:text-lg font-black text-white leading-tight truncate">
                    {modalCertDetails.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCertForModal(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition cursor-pointer shrink-0 border border-white/10"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Metrics Bar */}
              <div className="bg-stone-100 border-b border-stone-200 px-3 py-2 grid grid-cols-4 gap-1.5 text-center text-xs shrink-0">
                <div className="bg-white px-1.5 py-1.5 rounded-lg border border-stone-200 min-w-0">
                  <span className="text-[8px] font-bold text-slate-400 uppercase block truncate">Authority</span>
                  <span className="font-extrabold text-emerald-950 text-[11px] truncate block" title={modalCertDetails.authority}>{modalCertDetails.authority}</span>
                </div>
                <div className="bg-white px-1.5 py-1.5 rounded-lg border border-stone-200 min-w-0">
                  <span className="text-[8px] font-bold text-slate-400 uppercase block truncate">Visits</span>
                  <span className="font-extrabold text-slate-900 text-[11px] block">{modalCertDetails.visits} Visit(s)</span>
                </div>
                <div className="bg-white px-1.5 py-1.5 rounded-lg border border-stone-200 min-w-0">
                  <span className="text-[8px] font-bold text-slate-400 uppercase block truncate">Timeline</span>
                  <span className="font-extrabold text-slate-900 text-[11px] block">~{modalCertDetails.days} Days</span>
                </div>
                <div className="bg-white px-1.5 py-1.5 rounded-lg border border-stone-200 min-w-0">
                  <span className="text-[8px] font-bold text-slate-400 uppercase block truncate">Fee</span>
                  <span className="font-extrabold text-emerald-800 text-[11px] block">₹{modalCertDetails.fee}</span>
                </div>
              </div>

              {/* Modal Body Scrollable Content */}
              <div className="p-3.5 sm:p-5 overflow-y-auto min-h-0 space-y-4 flex-1 text-xs scrollbar-thin">
                {/* 1. WHAT IS REQUIRED */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-stone-200 pb-1">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                    1. What is Required?
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {modalCertDetails.whatRequired.map((req, idx) => {
                      const isHeld = heldDocIds.some((hId) => {
                        const anchor = ANCHOR_DOCUMENTS.find((a) => a.id === hId);
                        return anchor && req.toLowerCase().includes(anchor.name.toLowerCase().split(" ")[0]);
                      });

                      return (
                        <div
                          key={idx}
                          className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between gap-2 text-[11px] ${
                            isHeld
                              ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
                              : "bg-stone-50 border-stone-200 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            {isHeld ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            ) : (
                              <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                            <span className="truncate">{req}</span>
                          </div>

                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded shrink-0 ${
                            isHeld ? "bg-emerald-200 text-emerald-900" : "bg-amber-100 text-amber-900"
                          }`}>
                            {isHeld ? "Held" : "Needed"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. WHERE TO GET IT */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-stone-200 pb-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                    2. Where to Get It
                  </h4>

                  <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl space-y-1.5 text-slate-800">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <div className="text-[11px]">
                        <span className="font-extrabold text-slate-900">Office / Counter: </span>
                        <span className="text-slate-700 font-medium">{modalCertDetails.whereToGet}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-emerald-200 text-[10px] font-bold text-emerald-950">
                      <span>Portal: {currentState.portalName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white text-[8px] uppercase font-black">
                        Digital Signed
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. HOW TO GET IT */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-stone-200 pb-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-700" />
                    3. How to Apply
                  </h4>

                  <div className="space-y-1.5">
                    {modalCertDetails.howToGet.map((stepStr, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-stone-200 p-2.5 rounded-lg flex items-start gap-2.5 shadow-2xs"
                      >
                        <div className="w-5 h-5 rounded bg-emerald-700 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-[11px] text-slate-800 leading-snug font-medium">
                          {stepStr.replace(/^\d+\.\s*/, "")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. PRO TIP */}
                {modalCertDetails.tips && (
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl space-y-0.5 text-amber-900">
                    <span className="font-black text-[9px] uppercase tracking-wider text-amber-800 flex items-center gap-1">
                      <Info className="w-3 h-3 text-amber-700" /> Pro Tip:
                    </span>
                    <p className="text-[11px] font-semibold leading-snug">
                      {modalCertDetails.tips}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="bg-stone-100 border-t border-stone-200 px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    toggleTarget(modalCertDetails.certId);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    targetIds.includes(modalCertDetails.certId)
                      ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                      : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>
                    {targetIds.includes(modalCertDetails.certId)
                      ? "Remove Goal"
                      : "+ Add to My Plan"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCertForModal(null)}
                  className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 active:bg-stone-400 text-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
