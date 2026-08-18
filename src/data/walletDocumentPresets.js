// Digital Document Wallet Presets & Schema for Indian Grama Panchayat & Citizen Services
// Multilingual support: English (en), Malayalam (ml), Hindi (hi), Telugu (te), Kannada (kn)

export const DOCUMENT_CATEGORIES = [
  { id: "all", label: { en: "All Documents", ml: "എല്ലാ രേഖകളും", hi: "सभी दस्तावेज़", te: "అన్ని పత్రాలు", kn: "ಎಲ್ಲಾ ದಾಖಲೆಗಳು" }, icon: "Folder" },
  { id: "identity", label: { en: "Identity & Civil", ml: "തിരിച്ചറിയൽ രേഖകൾ", hi: "पहचान व नागरिक", te: "గుర్తింపు పత్రాలు", kn: "ಗುರುತಿನ ಚೀಟಿಗಳು" }, color: "blue", icon: "Shield" },
  { id: "revenue", label: { en: "Revenue & Land", ml: "റവന്യൂ & ഭൂമി", hi: "राजस्व व भूमि", te: "రెవెన్యూ & భూమి", kn: "ಕಂದಾಯ & ಭೂಮಿ" }, color: "emerald", icon: "Landmark" },
  { id: "welfare", label: { en: "Welfare & Pension", ml: "ക്ഷേമ പദ്ധതികൾ", hi: "कल्याण व पेंशन", te: "సంక్షేమ పథకాలు", kn: "ಯೋಜನೆಗಳು & ಪಿಂಚಣಿ" }, color: "amber", icon: "HeartHandshake" },
  { id: "education", label: { en: "Education & Skills", ml: "വിദ്യാഭ്യാസം", hi: "शिक्षा", te: "విద్య", kn: "ಶಿಕ್ಷಣ" }, color: "purple", icon: "GraduationCap" },
  { id: "custom", label: { en: "Custom / Other", ml: "മറ്റു രേഖകൾ", hi: "अन्य दस्तावेज़", te: "ఇతర పత్రాలు", kn: "ಇತರೆ ದಾಖಲೆಗಳು" }, color: "stone", icon: "FileText" }
];

export const STANDARD_DOCUMENT_TYPES = [
  {
    id: "aadhaar",
    category: "identity",
    name: {
      en: "Aadhaar Card (UIDAI)",
      ml: "ആധാർ കാർഡ്",
      hi: "आधार कार्ड",
      te: "ఆధార్ కార్డు",
      kn: "ಆಧಾರ್ ಕಾರ್ಡ್"
    },
    issuingAuthority: {
      en: "Unique Identification Authority of India (UIDAI)",
      ml: "യുണീക്ക് ഐഡന്റിഫിക്കേഷൻ അതോറിറ്റി ഓഫ് ഇന്ത്യ (UIDAI)",
      hi: "भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI)",
      te: "భారత విశిష్ట గుర్తింపు ప్రాధికార సంస్థ",
      kn: "ಭಾರತೀಯ ವಿಶಿಷ್ಟ ಗುರುತು ಪ್ರಾಧಿಕಾರ"
    },
    defaultValidity: "Permanent (Life-long)",
    isPermanent: true,
    formatHint: "12 digits (e.g. 7821 4590 1284)",
    sampleNumber: "7821 4590 1284",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    iconName: "Fingerprint",
    accentGradient: "from-blue-600 to-indigo-700",
    description: "Universal primary identification for all government schemes, DBT transfers, and village certificates."
  },
  {
    id: "ration_card",
    category: "welfare",
    name: {
      en: "Smart Ration Card (NFSA/PDS)",
      ml: "റേഷൻ കാർഡ് (BPL/AAY)",
      hi: "राशन कार्ड (NFSA)",
      te: "రేషన్ కార్డు",
      kn: "ರೇಷನ್ ಕಾರ್ಡ್"
    },
    issuingAuthority: {
      en: "Dept of Food & Civil Supplies",
      ml: "സിവിൽ സപ്ലൈസ് വകുപ്പ്",
      hi: "खाद्य एवं नागरिक आपूर्ति विभाग",
      te: "పౌరసరఫరాల శాఖ",
      kn: "ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಇಲಾಖೆ"
    },
    defaultValidity: "Permanent (Subject to Annual PDS Verification)",
    isPermanent: true,
    formatHint: "e.g. KL-18-RC-98124",
    sampleNumber: "KL-18-RC-98124",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    iconName: "ShoppingCart",
    accentGradient: "from-amber-600 to-orange-700",
    description: "Essential family proof for subsidised rations, healthcare coverage, and government welfare quotas."
  },
  {
    id: "income_cert",
    category: "revenue",
    name: {
      en: "e-District Income Certificate",
      ml: "വരുമാന സർട്ടിഫിക്കറ്റ്",
      hi: "आय प्रमाण पत्र",
      te: "ఆదాయ ధృవీకరణ పత్రం",
      kn: "ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ"
    },
    issuingAuthority: {
      en: "Revenue Department / Village Office",
      ml: "റവന്യൂ വകുപ്പ് / വില്ലേജ് ഓഫീസ്",
      hi: "राजस्व विभाग / ग्राम कार्यालय",
      te: "రెవెన్యూ శాఖ / గ్రామ సచివాలయం",
      kn: "ಕಂದಾಯ ಇಲಾಖೆ / ಗ್ರಾಮ ಕಚೇರಿ"
    },
    defaultValidity: "1 Year from Date of Issue",
    isPermanent: false,
    formatHint: "e.g. KL-REV-2025-91283",
    sampleNumber: "KL-REV-2025-91283",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    iconName: "BadgeIndianRupee",
    accentGradient: "from-emerald-600 to-teal-800",
    description: "Crucial for educational fee concessions, scholarships, medical assistance, and housing schemes."
  },
  {
    id: "caste_cert",
    category: "revenue",
    name: {
      en: "Caste / Community Certificate",
      ml: "ജാതി / കമ്മ്യൂണിറ്റി സർട്ടിഫിക്കറ്റ്",
      hi: "जाति प्रमाण पत्र",
      te: "కుల ధృవీకరణ పత్రం",
      kn: "ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ"
    },
    issuingAuthority: {
      en: "Tahsildar / Taluk Revenue Office",
      ml: "തഹസിൽദാർ / താലൂക്ക് റവന്യൂ ഓഫീസ്",
      hi: "तहसीलदार / राजस्व कार्यालय",
      te: "తహసీల్దార్ కార్యాలయం",
      kn: "ತಹಶೀಲ್ದಾರ್ ಕಚೇರಿ"
    },
    defaultValidity: "3 Years / Permanent for SC/ST",
    isPermanent: true,
    formatHint: "e.g. KL-CST-2024-44120",
    sampleNumber: "KL-CST-2024-44120",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    iconName: "ShieldCheck",
    accentGradient: "from-purple-600 to-indigo-800",
    description: "Required for reservation in education, recruitment, and targeted welfare initiatives."
  },
  {
    id: "land_tax_receipt",
    category: "revenue",
    name: {
      en: "Land Tax Receipt (Karam / Patta)",
      ml: "ഭൂനികുതി രസീത് (കരം അടച്ചത്)",
      hi: "भूमि कर रसीद (लगान)",
      te: "భూమి పన్ను రసీదు",
      kn: "ಜಮೀನು ತೆರಿಗೆ ರಸೀದಿ"
    },
    issuingAuthority: {
      en: "Village Revenue Officer (VRO)",
      ml: "വില്ലേജ് ഓഫീസർ / റവന്യൂ ഭവൻ",
      hi: "ग्राम राजस्व अधिकारी",
      te: "గ్రామ రెవెన్యూ అధికారి",
      kn: "ಗ್ರಾಮ ಲೆಕ್ಕಿಗ / ಕಂದಾಯ ಇಲಾಖೆ"
    },
    defaultValidity: "Financial Year (Annual Payment)",
    isPermanent: false,
    formatHint: "Thandapper No. (e.g. TP-4921 / 2024-25)",
    sampleNumber: "TP-4921 / 2024-25",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    iconName: "FileCheck",
    accentGradient: "from-emerald-700 to-green-900",
    description: "Proof of land possession and up-to-date revenue tax compliance."
  },
  {
    id: "voter_id",
    category: "identity",
    name: {
      en: "Voter ID Card (EPIC)",
      ml: "വോട്ടർ ഐഡി കാർഡ് (EPIC)",
      hi: "मतदाता पहचान पत्र (EPIC)",
      te: "ఓటరు గుర్తింపు కార్డు",
      kn: "ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ"
    },
    issuingAuthority: {
      en: "Election Commission of India (ECI)",
      ml: "ഇലക്ഷൻ കമ്മീഷൻ ഓഫ് ഇന്ത്യ",
      hi: "भारत निर्वाचन आयोग",
      te: "భారత ఎన్నికల సంఘం",
      kn: "ಭಾರತೀಯ ಚುನಾವಣಾ ಆಯೋಗ"
    },
    defaultValidity: "Permanent (Life-long)",
    isPermanent: true,
    formatHint: "e.g. ZKL1849201",
    sampleNumber: "ZKL1849201",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    iconName: "Vote",
    accentGradient: "from-cyan-700 to-blue-800",
    description: "Electoral photo identity card confirming citizenship and constituency voting rights."
  },
  {
    id: "pan_card",
    category: "identity",
    name: {
      en: "PAN Card (Income Tax)",
      ml: "പാൻ കാർഡ് (PAN Card)",
      hi: "पैन कार्ड",
      te: "పాన్ కార్డు",
      kn: "ಪ್ಯಾನ್ ಕಾರ್ಡ್"
    },
    issuingAuthority: {
      en: "Income Tax Department of India",
      ml: "ആദായ നികുതി വകുപ്പ്",
      hi: "आयकर विभाग",
      te: "ఆదాయపు పన్ను శాఖ",
      kn: "ಆದಾಯ ತೆರಿಗೆ ಇಲಾಖೆ"
    },
    defaultValidity: "Permanent (Life-long)",
    isPermanent: true,
    formatHint: "10 Characters (e.g. ABCDE1234F)",
    sampleNumber: "ABCDE1234F",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    iconName: "CreditCard",
    accentGradient: "from-blue-800 to-indigo-950",
    description: "Permanent account number for banking, tax returns, property transactions, and subsidies."
  },
  {
    id: "sslc_marksheet",
    category: "education",
    name: {
      en: "10th / SSLC Certificate",
      ml: "എസ്.എസ്.എൽ.സി സർട്ടിഫിക്കറ്റ്",
      hi: "10वीं / मैट्रिक प्रमाण पत्र",
      te: "10వ తరగతి సర్టిఫికేట్",
      kn: "10ನೇ ತರಗತಿ / ಎಸ್ಎಸ್ಎಲ್ಸಿ ಪ್ರಮಾಣಪತ್ರ"
    },
    issuingAuthority: {
      en: "State Board of Public Examinations",
      ml: "പരീക്ഷാ ഭവൻ / വിദ്യാഭ്യാസ വകുപ്പ്",
      hi: "राज्य शिक्षा बोर्ड",
      te: "సెకండరీ బోర్డ్ ఆఫ్ ఎడ్యుకేషన్",
      kn: "ಕರ್ನಾಟಕ ಪ್ರೌಢಶಿಕ್ಷಣ ಪರೀಕ್ಷಾ ಮಂಡಳಿ"
    },
    defaultValidity: "Permanent (Life-long)",
    isPermanent: true,
    formatHint: "Register No. (e.g. KL-SSLC-2008-89214)",
    sampleNumber: "KL-SSLC-2008-89214",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    iconName: "Award",
    accentGradient: "from-violet-700 to-purple-900",
    description: "Primary government age and date of birth proof across public service departments."
  },
  {
    id: "kisan_passbook",
    category: "welfare",
    name: {
      en: "PM-KISAN / Farmer Passbook",
      ml: "കർഷക ഐഡി / പി.എം കിസാൻ പാസ്ബുക്ക്",
      hi: "पीएम किसान / किसान क्रेडिट कार्ड",
      te: "రైతు గుర్తింపు కార్డు / పాసుబుక్",
      kn: "ರೈತ ಗುರುತಿನ ಚೀಟಿ / ಪಾಸ್‌ಬುಕ್"
    },
    issuingAuthority: {
      en: "Agriculture Dept & Krishi Bhavan",
      ml: "കൃഷി ഭവൻ / കൃഷി വകുപ്പ്",
      hi: "कृषि विभाग / कृषि विज्ञान केंद्र",
      te: "వ్యవసాయ శాఖ / రైతు భరోసా కేంద్రం",
      kn: "ಕೃಷಿ ಇಲಾಖೆ / ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ"
    },
    defaultValidity: "Active (Annual e-KYC required)",
    isPermanent: false,
    formatHint: "e.g. PMK-KL-9201948",
    sampleNumber: "PMK-KL-9201948",
    badgeColor: "bg-lime-100 text-lime-800 border-lime-200",
    iconName: "Sprout",
    accentGradient: "from-green-600 to-emerald-800",
    description: "Access to agricultural subsidies, crop insurance claim settlements, and fertilizer concessions."
  },
  {
    id: "pension_slip",
    category: "welfare",
    name: {
      en: "Social Security Pension Passbook",
      ml: "ക്ഷേമ പെൻഷൻ പാസ്ബുക്ക് (സേവന)",
      hi: "सामाजिक सुरक्षा पेंशन पासबुक",
      te: "సామాజిక భద్రతా పింఛను పాస్ బుక్",
      kn: "ಸಾಮಾಜಿಕ ಭದ್ರತಾ ಪಿಂಚಣಿ ಪುಸ್ತಕ"
    },
    issuingAuthority: {
      en: "Local Self Government / Sevana DBT",
      ml: "ഗ്രാമപഞ്ചായത്ത് / സേവന പെൻഷൻ പോർട്ടൽ",
      hi: "ग्राम पंचायत / पेंशन विभाग",
      te: "గ్రామ పంచాయతీ / వైఎస్సార్ పింఛను కానుక",
      kn: "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ / ಸೇವಾ ಸಿಂಧು"
    },
    defaultValidity: "Active (Annual Life Certificate / Mustering Required)",
    isPermanent: false,
    formatHint: "e.g. SVN-PPO-389104",
    sampleNumber: "SVN-PPO-389104",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    iconName: "HeartHandshake",
    accentGradient: "from-amber-700 to-yellow-800",
    description: "Old Age, Widow, Disability, or Agricultural Worker direct benefit transfer account."
  },
  {
    id: "driving_license",
    category: "identity",
    name: {
      en: "Driving License (Motor Vehicles Dept)",
      ml: "ഡ്രൈവിംഗ് ലൈസൻസ് (MVD)",
      hi: "ड्राइविंग लाइसेंस (परिवहन विभाग)",
      te: "డ్రైవింగ్ లైసెన్స్",
      kn: "ಚಾಲನಾ ಪರವಾನಗಿ"
    },
    issuingAuthority: {
      en: "Motor Vehicles Department (RTO)",
      ml: "മോട്ടോർ വാഹന വകുപ്പ് (RTO)",
      hi: "परिवहन विभाग (RTO)",
      te: "రవాణా శాఖ (RTO)",
      kn: "ಸಾರಿಗೆ ಇಲಾಖೆ (RTO)"
    },
    defaultValidity: "20 Years or Age 50",
    isPermanent: false,
    formatHint: "e.g. KL-18-2015004921",
    sampleNumber: "KL-18-2015004921",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    iconName: "Car",
    accentGradient: "from-slate-700 to-slate-900",
    description: "Official vehicular license and secondary identity card for public services."
  },
  {
    id: "birth_cert",
    category: "identity",
    name: {
      en: "Birth Certificate (CRSBND)",
      ml: "ജനന സർട്ടിഫിക്കറ്റ്",
      hi: "जन्म प्रमाण पत्र",
      te: "జనన ధృవీకరణ పత్రం",
      kn: "ಜನನ ಪ್ರಮಾಣಪತ್ರ"
    },
    issuingAuthority: {
      en: "Registrar of Births & Deaths (Grama Panchayat / Municipality)",
      ml: "ജനന-മരണ രജിസ്ട്രാർ (ഗ്രാമപഞ്ചായത്ത്)",
      hi: "जन्म एवं मृत्यु रजिस्ट्रार (ग्राम पंचायत)",
      te: "జనన మరణాల రిజిస్ట్రార్",
      kn: "ಜನನ ಮತ್ತು ಮರಣಗಳ ನೋಂದಣಾಧಿಕಾರಿ"
    },
    defaultValidity: "Permanent (Life-long)",
    isPermanent: true,
    formatHint: "e.g. B-2021-94812",
    sampleNumber: "B-2021-94812",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    iconName: "Baby",
    accentGradient: "from-teal-600 to-cyan-800",
    description: "Vital registration record mandatory for passport, school admissions, and Aadhaar enrollment."
  },
  {
    id: "udid_card",
    category: "identity",
    name: {
      en: "Unique Disability ID (UDID)",
      ml: "യു.ഡി.ഐ.ഡി കാർഡ് (ഭിന്നശേഷി)",
      hi: "विशिष्ट दिव्यांगता पहचान पत्र (UDID)",
      te: "దివ్యాంగుల గుర్తింపు కార్డు (UDID)",
      kn: "ವಿಶಿಷ್ಟ ವಿಕಲಾಂಗತಾ ಗುರುತಿನ ಚೀಟಿ"
    },
    issuingAuthority: {
      en: "Dept of Empowerment of Persons with Disabilities",
      ml: "സാമൂഹ്യനീതി വകുപ്പ് / മെഡിക്കൽ ബോർഡ്",
      hi: "सामाजिक न्याय एवं अधिकारिता मंत्रालय",
      te: "సాంఘిక సంక్షేమ శాఖ",
      kn: "ವಿಕಲಚೇತನರ ಸಬಲೀಕರಣ ಇಲಾಖೆ"
    },
    defaultValidity: "Permanent / Periodic Medical Review",
    isPermanent: true,
    formatHint: "e.g. KL183011994002914",
    sampleNumber: "KL183011994002914",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    iconName: "Accessibility",
    accentGradient: "from-rose-600 to-red-800",
    description: "National card ensuring assistive aids, transport concessions, and disability pension quotas."
  }
];

export const INITIAL_SAMPLE_WALLET_DOCUMENTS = [
  {
    id: "doc_sample_aadhaar",
    typeId: "aadhaar",
    title: "Aadhaar Card (UIDAI)",
    documentNumber: "7821 4590 1284",
    holderName: "Rajesh V",
    guardianName: "Vasudevan Nambiar (Father)",
    dob: "14/08/1992",
    gender: "Male",
    address: "Door 12/420, Ward 4, Azhiyur Grama Panchayat, Kozhikode, Kerala - 673309",
    category: "identity",
    issueDate: "12/03/2016",
    expiryDate: "Permanent",
    isPermanent: true,
    issuingAuthority: "Unique Identification Authority of India (UIDAI)",
    status: "verified",
    verificationId: "UIDAI-AUTH-91824701",
    notes: "Physical card stored in green locker at home. Mobile OTP linked to +91 98470 00000.",
    tags: ["Primary ID", "e-KYC Ready", "Bank Linked"],
    fileUrl: null
  },
  {
    id: "doc_sample_ration",
    typeId: "ration_card",
    title: "Smart Priority Ration Card (BPL / Pink)",
    documentNumber: "KL-18-RC-98124",
    holderName: "Rajesh V",
    guardianName: "Vasudevan Nambiar (Father)",
    dob: "14/08/1992",
    gender: "Male",
    address: "12/420, Azhiyur Grama Panchayat, Kozhikode",
    category: "welfare",
    issueDate: "05/01/2021",
    expiryDate: "Permanent",
    isPermanent: true,
    issuingAuthority: "Civil Supplies Department, Govt of Kerala",
    status: "verified",
    verificationId: "NFSA-PDS-KL-49120",
    notes: "Ration Shop (ARD) No. 42, Azhiyur Junction. 4 Family members enrolled.",
    tags: ["BPL Quota", "NFSA Subsidized", "Health Card Linked"],
    fileUrl: null
  },
  {
    id: "doc_sample_income",
    typeId: "income_cert",
    title: "e-District Income Certificate (₹45,000 p.a.)",
    documentNumber: "KL-REV-2025-91283",
    holderName: "Rajesh V",
    guardianName: "Vasudevan Nambiar",
    dob: "14/08/1992",
    gender: "Male",
    address: "Ward 4, Azhiyur, Kozhikode",
    category: "revenue",
    issueDate: "10/01/2025",
    expiryDate: "09/01/2026",
    isPermanent: false,
    issuingAuthority: "Village Office Azhiyur, Revenue Dept",
    status: "verified",
    verificationId: "EDIST-REV-KL-2025-019",
    notes: "Applied for sister's higher education scholarship and village housing subsidy. Valid for 1 year.",
    tags: ["Annual Renewal", "e-District Signed", "Valid"],
    fileUrl: null
  },
  {
    id: "doc_sample_land_tax",
    typeId: "land_tax_receipt",
    title: "Land Tax Receipt (Thandapper 4921)",
    documentNumber: "TP-4921 / 2024-25",
    holderName: "Rajesh V",
    guardianName: "Vasudevan Nambiar",
    dob: "14/08/1992",
    gender: "Male",
    address: "Resurvey Block 14, Re-Sy No. 112/4, Azhiyur Village (12.5 Cents)",
    category: "revenue",
    issueDate: "22/04/2024",
    expiryDate: "31/03/2025",
    isPermanent: false,
    issuingAuthority: "Village Revenue Officer (VRO), Azhiyur",
    status: "verified",
    verificationId: "ILRMS-TAX-2024-8192",
    notes: "Paid online via e-Treasury / ILRMS portal. ₹145 paid for current assessment year.",
    tags: ["Property Proof", "Re-Survey Verified", "Annual Tax"],
    fileUrl: null
  }
];
