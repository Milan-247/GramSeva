import React, { useState, useEffect } from "react";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Info,
  Layers,
  Sparkles
} from "lucide-react";

// Pre-defined specific government schemes & registration document checklists
const SPECIFIC_SCHEMES_DOCS = {
  // Akshaya / E-District Certificates & Schemes
  income_cert: {
    id: "income_cert",
    names: {
      ml: "വരുമാന സർട്ടിഫിക്കറ്റ് (Income Certificate)",
      en: "Income Certificate Application",
      hi: "आय प्रमाण पत्र",
      te: "ఆదాయ ధృవీకరణ పత్రం",
      kn: "ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ"
    },
    docs: {
      ml: [
        { id: "adh", name: "അപേക്ഷകന്റെ ആധാർ കാർഡ്", note: "തിരിച്ചറിയൽ തെളിവ്" },
        { id: "rat", name: "റേഷൻ കാർഡ് പകർപ്പ്", note: "കുടുംബാംഗങ്ങളുടെ വിവരങ്ങൾക്ക്" },
        { id: "sal", name: "ശമ്പള സർട്ടിഫിക്കറ്റ് / പെൻഷൻ സ്ലിപ്പ്", note: "തൊഴിലുടമ നൽകിയത് (ലഭ്യമെങ്കിൽ)" },
        { id: "tax", name: "കരം അടച്ച രസീത് (വസ്തു നികുതി)", note: "ഭൂമി വരുമാന വിവരങ്ങൾക്ക്" },
        { id: "aff", name: "സ്വയം സാക്ഷ്യപ്പെടുത്തിയ സത്യവാങ്മൂലം", note: "അക്ഷയയിൽ നിന്നും ലഭ്യമാണ്" }
      ],
      en: [
        { id: "adh", name: "Applicant's Aadhaar Card", note: "Identity and address proof" },
        { id: "rat", name: "Ration Card Copy", note: "For family details verification" },
        { id: "sal", name: "Salary Certificate / Pension Slip", note: "Issued by employer (if employed)" },
        { id: "tax", name: "Land Tax Receipt (Karam Receipt)", note: "For agricultural or property income" },
        { id: "aff", name: "Self-Declaration Affidavit", note: "Available at Akshaya center" }
      ],
      hi: [
        { id: "adh", name: "आवेदक का आधार कार्ड", note: "पहचान पत्र" },
        { id: "rat", name: "राशन कार्ड की प्रति", note: "परिवार विवरण हेतु" },
        { id: "sal", name: "वेतन प्रमाण पत्र / पेंशन पर्ची", note: "यदि कार्यरत हों" },
        { id: "tax", name: "भूमि कर रसीद", note: "कृषि आय के लिए" },
        { id: "aff", name: "स्व-घोषणा पत्र", note: "अक्षय केंद्र पर उपलब्ध" }
      ],
      te: [
        { id: "adh", name: "దరఖాస్తుదారు ఆధార్ కార్డ్", note: "గుర్తింపు కోసం" },
        { id: "rat", name: "రేషన్ కార్డ్ కాపీ", note: "కుటుంబ వివరాల నిరూపణకు" },
        { id: "sal", name: "జీతపు సర్టిఫికేట్ / పెన్షన్ స్లిప్", note: "ఉద్యోగులకు" },
        { id: "tax", name: "భూమి పన్ను రసీదు", note: "ఆస్తి ఆదాయం కోసం" },
        { id: "aff", name: "స్వయం అఫిడవిట్", note: "అక్షయ కేంద్రంలో లభించును" }
      ],
      kn: [
        { id: "adh", name: "ಅರ್ಜಿದಾರರ ಆಧಾರ್ ಕಾರ್ಡ್", note: "ಗುರುತಿನ ಸಾಕ್ಷಿ" },
        { id: "rat", name: "ರೇಷನ್ ಕಾರ್ಡ್ ನಕಲು", note: "ಕುಟುಂಬದ ವಿವರಕ್ಕಾಗಿ" },
        { id: "sal", name: "ವೇತನ ಪ್ರಮಾಣಪತ್ರ / ಪಿಂಚಣಿ ಪತ್ರ", note: "ಉದ್ಯೋಗಿಗಳಿಗೆ" },
        { id: "tax", name: "ಜಮೀನು ತೆರಿಗೆ ರಸೀದಿ", note: "ಆಸ್ತಿ ಆದಾಯಕ್ಕಾಗಿ" },
        { id: "aff", name: "ಸ್ವಯಂ ಘೋಷಣಾ ಪತ್ರ", note: "ಅಕ್ಷಯ ಕೇಂದ್ರದಲ್ಲಿ ಲಭ್ಯ" }
      ]
    }
  },
  life_mission: {
    id: "life_mission",
    names: {
      ml: "ലൈഫ് മിഷൻ ഭവന പദ്ധതി (Life Mission Housing)",
      en: "Life Mission Housing Scheme Registration",
      hi: "लाइफ मिशन आवास योजना",
      te: "లైఫ్ మిషన్ గృహ నిర్మాణ పథకం",
      kn: "ಲೈಫ್ ಮಿಷನ್ ವಸತಿ ಯೋಜನೆ"
    },
    docs: {
      ml: [
        { id: "rat", name: "മുൻഗണനാ റേഷൻ കാർഡ് (BPL / AAY)", note: "പ്രധാന യോഗ്യതാ രേഖ" },
        { id: "adh", name: "കുടുംബാംഗങ്ങൾ എല്ലാവരുടെയും ആധാർ", note: "എല്ലാ അംഗങ്ങളുടെയും പകർപ്പ്" },
        { id: "lan", name: "ഭൂമിയുടെ ആധാരവും കരം രസീതും", note: "സ്വന്തമായി ഭൂമിയുള്ളവർക്ക്" },
        { id: "dis", name: "വികലാംഗത്വം / മാരകരോഗ സർട്ടിഫിക്കറ്റ്", note: "മുൻഗണന ലഭിക്കുന്നതിന് (ലഭ്യമെങ്കിൽ)" },
        { id: "ban", name: "ബാങ്ക് പാസ്ബുക്ക് ആദ്യ പേജ് പകർപ്പ്", note: "അക്കൗണ്ട് നമ്പർ & IFSC തെളിവിന്" }
      ],
      en: [
        { id: "rat", name: "Priority Ration Card (BPL / Pink / Yellow Card)", note: "Primary eligibility criteria" },
        { id: "adh", name: "Aadhaar Cards of All Family Members", note: "Photocopies required" },
        { id: "lan", name: "Land Title Deed (Deed Copy) & Tax Receipt", note: "For land-owning beneficiaries" },
        { id: "dis", name: "Disability / Medical Certificate", note: "For special priority quota (if applicable)" },
        { id: "ban", name: "Bank Passbook First Page Copy", note: "Showing Account No & IFSC" }
      ],
      hi: [
        { id: "rat", name: "प्राथमिकता राशन कार्ड (BPL)", note: "पात्रता हेतु" },
        { id: "adh", name: "परिवार के सभी सदस्यों का आधार", note: "फोटोकॉपी" },
        { id: "lan", name: "भूमि दस्तावेज व कर रसीद", note: "भूमि मालिकों के लिए" },
        { id: "dis", name: "दिव्यांगता / बीमारी प्रमाण पत्र", note: "विशेष प्राथमिकता हेतु" },
        { id: "ban", name: "बैंक पासबुक प्रथम पृष्ठ", note: "आईएफएससी कोड हेतु" }
      ],
      te: [
        { id: "rat", name: "BPL / గులాబీ రేషన్ కార్డ్", note: "అర్హత నిరూపణకు" },
        { id: "adh", name: "కుటుంబ సభ్యులందరి ఆధార్ కార్డులు", note: "కాపీలు" },
        { id: "lan", name: "స్థల పట్టా పత్రాలు & పన్ను రసీదు", note: "స్థలం ఉన్న వారికి" },
        { id: "dis", name: "దివ్యాంగుల / వైద్య ధృవీకరణ పత్రం", note: "ప్రత్యేక ప్రాధాన్యతకు" },
        { id: "ban", name: "బ్యాంక్ పాస్‌బుక్ మొదటి పేజీ కాపీ", note: "ఖాతా నంబర్ కోసం" }
      ],
      kn: [
        { id: "rat", name: "BPL ರೇಷನ್ ಕಾರ್ಡ್", note: "ಅರ್ಹತೆಯ ಸಾಕ್ಷಿ" },
        { id: "adh", name: "ಕುಟುಂಬದ ಎಲ್ಲಾ ಸದಸ್ಯರ ಆಧಾರ್ ಕಾರ್ಡ್", note: "ನಕಲು ಪ್ರತಿ" },
        { id: "lan", name: "ಜಾಗದ ಪತ್ರ ಮತ್ತು ತೆರಿಗೆ ರಸೀದಿ", note: "ಜಾಗ ಇರುವವರಿಗೆ" },
        { id: "dis", name: "ಅಂಗವಿಕಲತೆ / ವೈದ್ಯಕೀಯ ಪ್ರಮಾಣಪತ್ರ", note: "ವಿಶೇಷ ಆದ್ಯತೆಗೆ" },
        { id: "ban", name: "ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ ಮೊದಲ ಪುಟ", note: "ಖಾತೆ ಸಂಖ್ಯೆಗೆ" }
      ]
    }
  },
  pm_kisan: {
    id: "pm_kisan",
    names: {
      ml: "പി.എം. കിസാൻ സമ്മാൻ നിധി (PM-KISAN Scheme)",
      en: "PM-KISAN Farmer Assistance Registration",
      hi: "पीएम किसान सम्मान निधि",
      te: "పిఎం కిసాన్ సమ్మాన్ నిధి",
      kn: "ಪಿಎಂ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ"
    },
    docs: {
      ml: [
        { id: "tax", name: "കർഷകന്റെ പേരിൽ കരം അടച്ച രസീത് (ലേറ്റസ്റ്റ്)", note: "തണ്ടപ്പേര് വ്യക്തമായിരിക്കണം" },
        { id: "adh", name: "ആധാർ കാർഡ് (മൊബൈൽ ലിങ്ക് ചെയ്തത്)", note: "e-KYC പൂർത്തിയാക്കുവാൻ" },
        { id: "ban", name: "ആധാറുമായി ലിങ്ക് ചെയ്ത ബാങ്ക് പാസ്ബുക്ക്", note: "DBT പണമിടപാടിന്" },
        { id: "enc", name: "വസ്തുവിന്റെ കുടിശ്ശികയില്ലാത്ത സർട്ടിഫിക്കറ്റ് (EC)", note: "ആവശ്യമെങ്കിൽ" }
      ],
      en: [
        { id: "tax", name: "Latest Land Tax Receipt in Farmer's Name", note: "Showing Thandaper & Survey No." },
        { id: "adh", name: "Aadhaar Card (Aadhaar-Mobile Linked)", note: "Mandatory for e-KYC verification" },
        { id: "ban", name: "Bank Passbook Linked with Aadhaar (NPCI active)", note: "For direct financial transfer" },
        { id: "enc", name: "Encumbrance Certificate / Ownership Proof", note: "If requested by Agriculture Officer" }
      ],
      hi: [
        { id: "tax", name: "किसान के नाम पर नवीनतम भूमि कर रसीद", note: "खसरा/खाता नंबर सहित" },
        { id: "adh", name: "आधार कार्ड (मोबाइल से लिंक)", note: "e-KYC के लिए" },
        { id: "ban", name: "आधार से जुड़ा बैंक खाता", note: "प्रत्यक्ष लाभ अंतरण हेतु" },
        { id: "enc", name: "स्वामित्व प्रमाण पत्र", note: "आवश्यकतानुसार" }
      ],
      te: [
        { id: "tax", name: "రైతు పేరిట ఉన్న భూమి పన్ను రసీదు", note: "సర్వే నంబర్‌తో" },
        { id: "adh", name: "ఆధార్ కార్డ్ (మొబైల్‌తో లింక్)", note: "e-KYC కోసం" },
        { id: "ban", name: "ఆధార్ లింక్ అయిన బ్యాంక్ ఖాతా", note: "నేరుగా డబ్బు జమకు" },
        { id: "enc", name: "యాజమాన్య ధృవీకరణ పత్రం", note: "అవసరమైతే" }
      ],
      kn: [
        { id: "tax", name: "ರೈತರ ಹೆಸರಿನಲ್ಲಿರುವ ತೆರಿಗೆ ರಸೀದಿ", note: "ಸರ್ವೆ ಸಂಖ್ಯೆಯೊಂದಿಗೆ" },
        { id: "adh", name: "ಆಧಾರ್ ಕಾರ್ಡ್ (ಮೊಬೈಲ್ ಲಿಂಕ್)", note: "e-KYC ಗಾಗಿ" },
        { id: "ban", name: "ಆಧಾರ್ ಲಿಂಕ್ ಆದ ಬ್ಯಾಂಕ್ ಖಾತೆ", note: "ನೇರ ಹಣ ವರ್ಗಾವಣೆಗೆ" },
        { id: "enc", name: "ಹಕ್ಕುಪತ್ರ / ಮಾಲೀಕತ್ವದ ಸಾಕ್ಷಿ", note: "ಅಗತ್ಯವಿದ್ದರೆ" }
      ]
    }
  },
  karunya_health: {
    id: "karunya_health",
    names: {
      ml: "കാരുണ്യ ഇൻഷുറൻസ് (KASP / Karunya Benevolent Scheme)",
      en: "Karunya Health Insurance (KASP) Claim",
      hi: "कारुण्या स्वास्थ्य बीमा योजना",
      te: "కారుణ్య ఆరోగ్య బీమా పథకం",
      kn: "ಕಾರುಣ್ಯ ಆರೋಗ್ಯ ವಿಮೆ ಯೋಜನೆ"
    },
    docs: {
      ml: [
        { id: "kas", name: "കാരുണ്യ ഇൻഷുറൻസ് കാർഡ് / റേഷൻ കാർഡ്", note: "ബിപിഎൽ റേഷൻ കാർഡ് യോഗ്യത" },
        { id: "adh", name: "രോഗിയുടെ ആധാർ കാർഡ്", note: "തിരിച്ചറിയൽ രേഖ" },
        { id: "est", name: "ആശുപത്രിയിൽ നിന്നുള്ള ചികിത്സാ എസ്റ്റിമേറ്റ്", note: "ഡോക്ടർ സാക്ഷ്യപ്പെടുത്തിയത്" },
        { id: "inc", name: "വരുമാന സർട്ടിഫിക്കറ്റ് (വില്ലേജ് ഓഫീസിൽ നിന്ന്)", note: "എപിഎൽ കാർഡുകാർക്ക് തുക ലഭിക്കാൻ" },
        { id: "pho", name: "രോഗിയുടെ പാസ്‌പോർട്ട് ഫോട്ടോ", note: "ഹെൽത്ത് ഡെസ്കിൽ നൽകാൻ" }
      ],
      en: [
        { id: "kas", name: "Karunya / KASP Health Card or Ration Card", note: "BPL Ration Card proof" },
        { id: "adh", name: "Patient's Aadhaar Card", note: "Identity verification" },
        { id: "est", name: "Hospital Treatment Cost Estimate", note: "Signed by attending Doctor / Superintendent" },
        { id: "inc", name: "Income Certificate (from Village Office)", note: "For APL cardholders applying under Karunya Benevolent Fund" },
        { id: "pho", name: "Passport size Photograph of Patient", note: "For Arogyamitra hospital counter" }
      ],
      hi: [
        { id: "kas", name: "कारुण्या स्वास्थ्य कार्ड / राशन कार्ड", note: "बीपीएल श्रेणी" },
        { id: "adh", name: "रोगी का आधार कार्ड", note: "पहचान हेतु" },
        { id: "est", name: "अस्पताल इलाज का अनुमानित खर्च", note: "डॉक्टर द्वारा हस्ताक्षरित" },
        { id: "inc", name: "आय प्रमाण पत्र", note: "एपीएल श्रेणी के लिए" },
        { id: "pho", name: "रोगी की पासपोर्ट फोटो", note: "अस्पताल काउंटर हेतु" }
      ],
      te: [
        { id: "kas", name: "కారుణ్య హెల్త్ కార్డ్ / రేషన్ కార్డ్", note: "BPL అర్హత" },
        { id: "adh", name: "రోగి ఆధార్ కార్డ్", note: "గుర్తింపు కోసం" },
        { id: "est", name: "ఆసుపత్రి వైద్య ఖర్చుల అంచనా పత్రం", note: "వైద్యుల సంతకంతో" },
        { id: "inc", name: "ఆదాయ సర్టిఫికేట్", note: "APL కుటుంబాలకు" },
        { id: "pho", name: "రోగి ఫోటో", note: "ఆరోగ్యమిత్ర కౌంటర్ కోసం" }
      ],
      kn: [
        { id: "kas", name: "ಕಾರುಣ್ಯ ಹೆಲ್ತ್ ಕಾರ್ಡ್ / ರೇಷನ್ ಕಾರ್ಡ್", note: "BPL ಅರ್ಹತೆ" },
        { id: "adh", name: "ರೋಗಿಯ ಆಧಾರ್ ಕಾರ್ಡ್", note: "ಗುರುತಿನ ಸಾಕ್ಷಿ" },
        { id: "est", name: "ಆಸ್ಪತ್ರೆ ಚಿಕಿತ್ಸಾ ವೆಚ್ಚದ ಅಂದಾಜು ಪತ್ರ", note: "ವೈದ್ಯರ ಸಹಿಯೊಂದಿಗೆ" },
        { id: "inc", name: "ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ", note: "APL ಕಾರ್ಡುದಾರರಿಗೆ" },
        { id: "pho", name: "ರೋಗಿಯ ಫೋಟೋ", note: "ಆರೋಗ್ಯ ಮಿತ್ರ ಕೌಂಟರ್‌ಗೆ" }
      ]
    }
  },
  building_permit: {
    id: "building_permit",
    names: {
      ml: "കെട്ടിട നിർമ്മാണ പെർമിറ്റ് (Building Permit)",
      en: "Grama Panchayat Building Permit Application",
      hi: "भवन निर्माण अनुमति पत्र",
      te: "భవన నిర్మాణ అనుమతి పత్రం",
      kn: "ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಅನುಮತಿ"
    },
    docs: {
      ml: [
        { id: "plan", name: "അംഗീകൃത ആർക്കിടെക്റ്റ് പ്ലാനും വരയും", note: "തയ്യറാക്കിയ 3 സെറ്റ് പ്ലാൻ" },
        { id: "pos", name: "ഭൂമിയുടെ കൈവശാവകാശ സർട്ടിഫിക്കറ്റ് (Possession Cert)", note: "വില്ലേജ് ഓഫീസിൽ നിന്ന്" },
        { id: "tax", name: "കരം അടച്ച രസീത് (നടപ്പു വർഷം)", note: "വസ്തു കരമടച്ച വിവരങ്ങൾ" },
        { id: "adh", name: "ഉടമസ്ഥന്റെ ആധാർ പകർപ്പ്", note: "അപേക്ഷകന്റെ ഐഡി" },
        { id: "noc", name: "NOC സർട്ടിഫിക്കറ്റ് (റോഡ് / ഫയർ / മാരിടൈം)", note: "ആവശ്യമുള്ള മേഖലകളിൽ മാത്രം" }
      ],
      en: [
        { id: "plan", name: "Architect / Engineer Approved Blueprint Plan", note: "3 signed sets of site & building plans" },
        { id: "pos", name: "Land Possession Certificate", note: "Issued by Village Office" },
        { id: "tax", name: "Latest Land Tax Receipt", note: "Proof of current year tax payment" },
        { id: "adh", name: "Owner's Aadhaar Card Copy", note: "Identity proof" },
        { id: "noc", name: "NOC from Fire / Pollution / Highway authority", note: "Required for commercial or multi-storey" }
      ],
      hi: [
        { id: "plan", name: "स्वीकृत आर्किटेक्ट ब्लूप्रिंट योजना", note: "3 सेट" },
        { id: "pos", name: "भूमि कब्जा प्रमाण पत्र", note: "विलेज ऑफिस से" },
        { id: "tax", name: "नवीनतम भूमि कर रसीद", note: "चालू वर्ष" },
        { id: "adh", name: "मालिक का आधार कार्ड", note: "पहचान पत्र" },
        { id: "noc", name: "एनओसी प्रमाण पत्र", note: "आवश्यकतानुसार" }
      ],
      te: [
        { id: "plan", name: "ఆర్కిటెక్ట్ అనుమతించిన ప్లాన్ ప్రతులు", note: "3 సెట్లు" },
        { id: "pos", name: "స్థల స్వాధీన పత్రం (Possession Cert)", note: "విలేజ్ ఆఫీస్ నుండి" },
        { id: "tax", name: "భూమి పన్ను రసీదు", note: "ప్రస్తుత సంవత్సరం" },
        { id: "adh", name: "యజమాని ఆధార్ కార్డ్", note: "గుర్తింపు కోసం" },
        { id: "noc", name: "NOC పత్రం", note: "అవసరమైనచోట" }
      ],
      kn: [
        { id: "plan", name: "ಆರ್ಕಿಟೆಕ್ಟ್ ಅನುಮೋದಿತ ಕಟ್ಟಡ ನಕ್ಷೆ", note: "3 ಪ್ರತಿಗಳು" },
        { id: "pos", name: "ಜಮೀನು ಸ್ವಾಧೀನ ಪ್ರಮಾಣಪತ್ರ", note: "ವಿಲೇಜ್ ಆಫೀಸ್‌ನಿಂದ" },
        { id: "tax", name: "ಜಮೀನು ತೆರಿಗೆ ರಸೀದಿ", note: "ಚಾಲ್ತಿ ವರ್ಷ" },
        { id: "adh", name: "ಮಾಲೀಕರ ಆಧಾರ್ ಕಾರ್ಡ್", note: "ಗುರುತಿನ ಸಾಕ್ಷಿ" },
        { id: "noc", name: "NOC ಪ್ರಮಾಣಪತ್ರ", note: "ಅಗತ್ಯವಿದ್ದರೆ" }
      ]
    }
  }
};

// General Category Fallback Document Lists
const CATEGORY_DOCUMENTS = {
  government: {
    ml: [
      { id: "adh", name: "ആധാർ കാർഡ് (അസലും 1 പകർപ്പും)", note: "മൊബൈൽ നമ്പർ ലിങ്ക് ചെയ്തതായിരിക്കണം" },
      { id: "rat", name: "റേഷൻ കാർഡ് / വോട്ടർ ഐഡി", note: "മേൽവിലാസ തെളിവിനായി" },
      { id: "pho", name: "പാസ്‌പോർട്ട് സൈസ് ഫോട്ടോ (2 എണ്ണം)", note: "സമീപകാലത്തെടുത്തത്" },
      { id: "mob", name: "സജീവമായ മൊബൈൽ ഫോൺ നമ്പർ", note: "OTP സ്കാൻ സേവനങ്ങൾക്കായി" },
      { id: "tax", name: "കരം അടച്ച രസീത് / മുൻ സർട്ടിഫിക്കറ്റ്", note: "വില്ലേജ്/ഭൂമി അപേക്ഷകൾക്ക് മാത്രം" }
    ],
    en: [
      { id: "adh", name: "Aadhaar Card (Original & 1 Photocopy)", note: "Mobile number should be linked" },
      { id: "rat", name: "Ration Card / Voter ID Card", note: "Required as proof of address" },
      { id: "pho", name: "Passport Size Photographs (2 copies)", note: "Recent color photograph" },
      { id: "mob", name: "Active Mobile Phone Number", note: "Needed for OTP & SMS verification" },
      { id: "tax", name: "Land Tax Receipt / Previous Certificate", note: "For land or revenue applications" }
    ],
    hi: [
      { id: "adh", name: "आधार कार्ड (मूल और 1 फोटोकॉपी)", note: "मोबाइल नंबर से लिंक होना चाहिए" },
      { id: "rat", name: "राशन कार्ड / मतदाता पहचान पत्र", note: "पते के प्रमाण के रूप में" },
      { id: "pho", name: "पासपोर्ट आकार का फोटो (2 प्रतियां)", note: "हाल ही में लिया गया" },
      { id: "mob", name: "सक्रिय मोबाइल फोन नंबर", note: "ओटीपी और स्थिति के लिए" },
      { id: "tax", name: "भूमि कर रसीद / पिछला प्रमाण पत्र", note: "राजस्व सेवाओं के लिए" }
    ],
    te: [
      { id: "adh", name: "ఆధార్ కార్డ్ (ఒరిజినల్ & 1 ఫోటోకాపీ)", note: "మొబైల్ నంబర్ లింక్ చేయబడి ఉండాలి" },
      { id: "rat", name: "రేషన్ కార్డ్ / ఓటర్ ఐడి కార్డ్", note: "చిరునామా రుజువుగా" },
      { id: "pho", name: "పాస్‌పోర్ట్ సైజ్ ఫోటోలు (2 కాపీలు)", note: "ఇటీవలి ఫోటో" },
      { id: "mob", name: "యాక్టివ్ మొబైల్ నంబర్", note: "OTP మరియు SMS కోసం" },
      { id: "tax", name: "భూమి పన్ను రసీదు / పాత సర్టిఫికేట్", note: "భూమి లేదా రెవెన్యూ దరఖాస్తులకు" }
    ],
    kn: [
      { id: "adh", name: "ಆಧಾರ್ ಕಾರ್ಡ್ (ಅಸಲು ಮತ್ತು 1 ನಕಲು)", note: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಲಿಂಕ್ ಆಗಿರಬೇಕು" },
      { id: "rat", name: "ರೇಷನ್ ಕಾರ್ಡ್ / ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ", note: "ವಿಳಾಸದ ಸಾಕ್ಷಿಯಾಗಿ" },
      { id: "pho", name: "ಪಾಸ್‌ಪೋರ್ಟ್ ಅಳತೆಯ ಭಾವಚಿತ್ರಗಳು (2 ಪ್ರತಿ)", note: "ಇತ್ತೀಚಿನ ಫೋಟೋ" },
      { id: "mob", name: "ಸಕ್ರಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", note: "OTP ಮತ್ತು SMS ಗಾಗಿ" },
      { id: "tax", name: "ಭೂಮಿ ತೆರಿಗೆ ರಸೀದಿ / ಹಳೆಯ ಪ್ರಮಾಣಪತ್ರ", note: "ಕಂದಾಯ ಅರ್ಜಿಗಳಿಗಾಗಿ" }
    ]
  },
  health: {
    ml: [
      { id: "adh", name: "രോഗിയുടെ ആധാർ കാർഡ് / തികച്ചും ഔദ്യോഗിക ഐഡി", note: "തിരിച്ചറിയൽ തെളിവിനായി" },
      { id: "abh", name: "ABHA (ആയുഷ്മാൻ ഭാരത് ഡിജിറ്റൽ ഹെൽത്ത്) ഐഡി", note: "ലഭ്യമെങ്കിൽ" },
      { id: "kas", name: "റേഷൻ കാർഡ് (കാരുണ്യ / KASP ഇൻഷുറൻസിന്)", note: "ബിപിഎൽ ഇൻഷുറൻസ് ആനുകൂല്യങ്ങൾക്ക്" },
      { id: "pre", name: "മുൻകാല മെഡിക്കൽ രേഖകളും കുറിപ്പടികളും", note: "മുൻ പരിശോധനാ വിവരങ്ങൾക്ക്" },
      { id: "imm", name: "പ്രതിരോധ കുത്തിവയ്പ്പ് കാർഡ്", note: "കുട്ടികളുടെയും ഗർഭിണികളുടെയും ചികിത്സയ്ക്ക്" }
    ],
    en: [
      { id: "adh", name: "Patient Aadhaar Card / Govt Photo ID", note: "Required for identity verification" },
      { id: "abh", name: "ABHA (Ayushman Bharat Health Account) ID", note: "If registered" },
      { id: "kas", name: "Ration Card (For Karunya / KASP Insurance)", note: "For subsidized treatment benefits" },
      { id: "pre", name: "Previous Prescriptions & Diagnostic Reports", note: "For medical history reference" },
      { id: "imm", name: "Child Immunization / Maternity Card", note: "For pediatric or maternal care" }
    ],
    hi: [
      { id: "adh", name: "रोगी का आधार कार्ड / सरकारी फोटो आईडी", note: "पहचान पत्र" },
      { id: "abh", name: "आभा (ABHA) स्वास्थ्य आईडी कार्ड", note: "यदि उपलब्ध हो" },
      { id: "kas", name: "राशन कार्ड (कारुण्या / केएएसपी बीमा हेतु)", note: "सब्सिडी उपचार के लिए" },
      { id: "pre", name: "पुराने पर्चे और मेडिकल रिपोर्ट", note: "इतिहास के लिए" },
      { id: "imm", name: "बाल टीकाकरण / मातृ स्वास्थ्य कार्ड", note: "बच्चों के उपचार के लिए" }
    ],
    te: [
      { id: "adh", name: "రోగి ఆధార్ కార్డ్ / ప్రభుత్వ ఫోటో ఐడి", note: "గుర్తింపు కోసం" },
      { id: "abh", name: "ABHA హెల్త్ ఐడి నంబర్", note: "అందుబాటులో ఉంటే" },
      { id: "kas", name: "రేషన్ కార్డ్ (ఆరోగ్య బీమా కోసం)", note: "రాయితీ చికిత్స ప్రయోజనాలకు" },
      { id: "pre", name: "పాత వైద్య ప్రిస్క్రిప్షన్లు & రిపోర్టులు", note: "వైద్య సమాచారం కోసం" },
      { id: "imm", name: "పిల్లల వ్యాక్సిన్ / మాతృ సంరక్షణ కార్డ్", note: "చిన్నారుల సంరక్షణకు" }
    ],
    kn: [
      { id: "adh", name: "ರೋಗಿಯ ಆಧಾರ್ ಕಾರ್ಡ್ / ಸರ್ಕಾರಿ ಗುರುತಿನ ಚೀಟಿ", note: "ಗುರುತಿನ ಸಾಕ್ಷಿ" },
      { id: "abh", name: "ABHA ಹೆಲ್ತ್ ಐಡಿ ಕಾರ್ಡ್", note: "ಲಭ್ಯವಿದ್ದರೆ" },
      { id: "kas", name: "ರೇಷನ್ ಕಾರ್ಡ್ (ಆರೋಗ್ಯ ವಿಮೆಗೆ)", note: "ಉಚಿತ/ರಿಯಾಯಿತಿ ಚಿಕಿತ್ಸೆಗೆ" },
      { id: "pre", name: "ಹಳೆಯ ವೈದ್ಯಕೀಯ ಚೀಟಿಗಳು ಮತ್ತು ವರದಿಗಳು", note: "ಚಿಕಿತ್ಸಾ ವಿವರಗಳಿಗಾಗಿ" },
      { id: "imm", name: "ಮಕ್ಕಳ ಲಸಿಕೆ/ತಾಯಂದಿರ ಕಾರ್ಡ್", note: "ಮಕ್ಕಳ ಆರೈಕೆಗೆ" }
    ]
  },
  water: {
    ml: [
      { id: "tax", name: "കെട്ടിട / വസ്തു നികുതി രസീത് (ലേറ്റസ്റ്റ്)", note: "വസ്തുവിന്റെ ഉടമസ്ഥാവകാശ തെളിവ്" },
      { id: "adh", name: "അപേക്ഷകന്റെ ആധാർ കാർഡ് / വോട്ടർ ഐഡി", note: "തിരിച്ചറിയൽ രേഖ" },
      { id: "pla", name: "അംഗീകൃത പ്ലാൻ / ബിൽഡിംഗ് പെർമിറ്റ്", note: "പുതിയ വാട്ടർ കണക്ഷന് മാത്രം" },
      { id: "con", name: "മുൻ കൺസ്യൂമർ നമ്പർ / വാട്ടർ ബിൽ പകർപ്പ്", note: "പരാതികൾക്കും ബിൽ പേയ്‌മെന്റിനും" }
    ],
    en: [
      { id: "tax", name: "Latest Property Tax Receipt", note: "Proof of ownership or tenancy" },
      { id: "adh", name: "Applicant Aadhaar Card / Voter ID", note: "Identity verification proof" },
      { id: "pla", name: "Approved Building Construction Plan", note: "Required for new water connections" },
      { id: "con", name: "Water Consumer ID / Previous Bill Copy", note: "For tariff or connection queries" }
    ],
    hi: [
      { id: "tax", name: "संपत्ति कर की नवीनतम रसीद", note: "स्वामित्व का प्रमाण" },
      { id: "adh", name: "आवेदक का आधार कार्ड / वोटर आईडी", note: "पहचान प्रमाण" },
      { id: "pla", name: "स्वीकृत भवन निर्माण योजना", note: "नए जल कनेक्शन हेतु" },
      { id: "con", name: "जल उपभोक्ता आईडी / पिछला बिल", note: "बिल संबंधी कार्य के लिए" }
    ],
    te: [
      { id: "tax", name: "ఇంటి పన్ను రసీదు", note: "యాజమాన్య నిరూపణ" },
      { id: "adh", name: "దరఖాస్తుదారు ఆధార్ / ఓటర్ ఐడి", note: "గుర్తింపు కోసం" },
      { id: "pla", name: "అనుమతించబడిన భవన నిర్మాణ ప్లాన్", note: "కొత్త వాటర్ కనెక్షన్ కోసం" },
      { id: "con", name: "వాటర్ కన్స్యూమర్ ఐడి / పాత బిల్లు", note: "బిల్లు లేదా ఫిర్యాదుల కోసం" }
    ],
    kn: [
      { id: "tax", name: "ಆಸ್ತಿ ತೆರಿಗೆ ಪಾವತಿ ರಸೀದಿ", note: "ಮಾಲೀಕತ್ವದ ಸಾಕ್ಷಿ" },
      { id: "adh", name: "ಅರ್ಜಿದಾರರ ಆಧಾರ್ ಕಾರ್ಡ್", note: "ಗುರುತಿನ ಸಾಕ್ಷಿ" },
      { id: "pla", name: "ಅನುಮೋದಿತ ಕಟ್ಟಡ ಯೋಜನೆ", note: "ಹೊಸ ನೀರು ಸಂಪರ್ಕಕ್ಕಾಗಿ" },
      { id: "con", name: "ಗ್ರಾಹಕ ಐಡಿ / ಹಳೆಯ ನೀರಿನ ಬಿಲ್ಲು", note: "ಬಿಲ್ ಪಾವತಿಗಾಗಿ" }
    ]
  },
  agriculture: {
    ml: [
      { id: "tax", name: "ഭൂനികുതി രസീത് (കരം അടച്ച രസീത്)", note: "തണ്ടപ്പേര് നമ്പർ വ്യക്തമായിരിക്കണം" },
      { id: "pas", name: "ബാങ്ക് പാസ്ബുക്ക് പകർപ്പ് (IFSC സഹായത്തോടെ)", note: "സബ്‌സിഡി ബാങ്ക് ട്രാൻസ്ഫറിനായി" },
      { id: "adh", name: "കർഷകന്റെ ആധാർ കാർഡ്", note: "നേരിട്ടുള്ള ആനുകൂല്യങ്ങൾക്ക്" },
      { id: "kri", name: "കൃഷി കാർഡ് / ഫാർമർ രജിസ്ട്രേഷൻ ഐഡി", note: "കൃഷി ഭവൻ രജിസ്ട്രേഷൻ" },
      { id: "soi", name: "മണ്ണ് പരിശോധനാ റിപ്പോർട്ട് / പാട്ടക്കരാർ", note: "പാട്ടക്കർഷകർക്കും വളം സബ്‌സിഡിക്കും" }
    ],
    en: [
      { id: "tax", name: "Land Tax Receipt (Karam Adacha Receipt)", note: "Showing Thandaper number clearly" },
      { id: "pas", name: "Bank Account Passbook Copy", note: "Showing Account No & IFSC for Direct Benefit Transfer" },
      { id: "adh", name: "Farmer's Aadhaar Card", note: "Identity verification" },
      { id: "kri", name: "Krishi Card / Farmer Registration ID", note: "Krishi Bhavan registration" },
      { id: "soi", name: "Soil Test Report / Lease Agreement", note: "For tenant farmers or fertilizer subsidy" }
    ],
    hi: [
      { id: "tax", name: "भूमि कर रसीद", note: "ठंडपेर नंबर के साथ" },
      { id: "pas", name: "बैंक पासबुक की प्रति (IFSC सहित)", note: "सब्सिडी खाते में जमा हेतु" },
      { id: "adh", name: "किसान का आधार कार्ड", note: "पहचान सत्यापन" },
      { id: "kri", name: "कृषि कार्ड / किसान पंजीकरण आईडी", note: "कृषि भवन पंजीयन" },
      { id: "soi", name: "मृदा परीक्षण रिपोर्ट / पट्टा समझौता", note: "उर्वरक सब्सिडी हेतु" }
    ],
    te: [
      { id: "tax", name: "భూమి పన్ను రసీదు", note: "ఖాతా లేదా పాస్‌బుక్ వివరాలు" },
      { id: "pas", name: "బ్యాంక్ పాస్‌బుక్ కాపీ (IFSC సాయంతో)", note: "సబ్సిడీ జమ కోసం" },
      { id: "adh", name: "రైతు ఆధార్ కార్డ్", note: "గుర్తింపు కోసం" },
      { id: "kri", name: "కృషి కార్డ్ / రైతు నమోదు ఐడి", note: "రైతు సంక్షేమ పథకాలకు" },
      { id: "soi", name: "నేల పరీక్ష నివేదిక / కౌలు ఒప్పందం", note: "కౌలు రైతులకు" }
    ],
    kn: [
      { id: "tax", name: "ಜಮೀನು ತೆರಿಗೆ ರಸೀದಿ", note: "ಖಾತಾ ಸಂಖ್ಯೆಯೊಂದಿಗೆ" },
      { id: "pas", name: "ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ ಪ್ರತಿಯು (IFSC ಯೊಂದಿಗೆ)", note: "ಸಬ್ಸಿಡಿ ವರ್ಗಾವಣೆಗೆ" },
      { id: "adh", name: "ರೈತರ ಆಧಾರ್ ಕಾರ್ಡ್", note: "ಗುರುತಿನ ಸಾಕ್ಷಿ" },
      { id: "kri", name: "ಕೃಷಿ ಕಾರ್ಡ್ / ರೈತ ನೋಂದಣಿ ಐಡಿ", note: "ಕೃಷಿ ಇಲಾಖೆ ನೋಂದಣಿ" },
      { id: "soi", name: "ಮಣ್ಣು ಪರೀಕ್ಷೆ ವರದಿ / ಬಾಡಿಗೆ ಕರಾರು", note: "ಸೊಸೈಟಿ ರಸಗೊಬ್ಬರಕ್ಕಾಗಿ" }
    ]
  },
  education: {
    ml: [
      { id: "bir", name: "കുട്ടിയുടെ ജനന സർട്ടിഫിക്കറ്റ്", note: "അഡ്മിഷൻ സമയത്ത് പ്രധാനം" },
      { id: "adh", name: "വിദ്യാർത്ഥിയുടെയും രക്ഷിതാവിന്റെയും ആധാർ", note: "ഐഡി തെളിവിനായി" },
      { id: "tc", name: "ട്രാൻസ്ഫർ സർട്ടിഫിക്കറ്റ് (TC) & മാർക്ക് ലിസ്റ്റ്", note: "ഉപരിപഠനത്തിനും ട്രാൻസ്ഫറിനും" },
      { id: "rat", name: "റേഷൻ കാർഡ് / വരുമാന സർട്ടിഫിക്കറ്റ്", note: "സ്കോളർഷിപ്പ് ആനുകൂല്യങ്ങൾക്ക്" },
      { id: "pho", name: "പാസ്‌പോർട്ട് സൈസ് ഫോട്ടോ (3 എണ്ണം)", note: "സ്കൂൾ രജിസ്റ്ററിനായി" }
    ],
    en: [
      { id: "bir", name: "Student's Birth Certificate", note: "Essential for new admissions" },
      { id: "adh", name: "Aadhaar Card (Student & Parent/Guardian)", note: "Identity proof" },
      { id: "tc", name: "Transfer Certificate (TC) & Previous Progress Card", note: "For school/college transfers" },
      { id: "rat", name: "Ration Card / Income Certificate", note: "For scholarship eligibility" },
      { id: "pho", name: "Passport Size Photographs (3 copies)", note: "Recent color photos" }
    ],
    hi: [
      { id: "bir", name: "छात्र का जन्म प्रमाण पत्र", note: "प्रवेश के लिए आवश्यक" },
      { id: "adh", name: "छात्र और अभिभावक का आधार कार्ड", note: "पहचान पत्र" },
      { id: "tc", name: "स्थानांतरण प्रमाण पत्र (टीसी) व अंकसूची", note: "अगली कक्षा में प्रवेश हेतु" },
      { id: "rat", name: "राशन कार्ड / आय प्रमाण पत्र", note: "छात्रवृत्ति लाभ के लिए" },
      { id: "pho", name: "पासपोर्ट फोटो (3 प्रति)", note: "स्कूल रिकॉर्ड हेतु" }
    ],
    te: [
      { id: "bir", name: "విద్యార్థి జనన ధృవీకరణ పత్రం", note: "ప్రవేశాల కోసం" },
      { id: "adh", name: "విద్యార్థి & తల్లిదండ్రుల ఆధార్ కార్డ్", note: "గుర్తింపు కోసం" },
      { id: "tc", name: "బదిలీ పత్రం (TC) & మార్కుల జాబితా", note: "పై చదువుల కోసం" },
      { id: "rat", name: "రేషన్ కార్డ్ / ఆదాయ ధృవీకరణ పత్రం", note: "స్కాలర్‌షిప్‌ల కోసం" },
      { id: "pho", name: "పాస్‌పోర్ట్ ఫోటోలు (3 కాపీలు)", note: "రికార్డుల కోసం" }
    ],
    kn: [
      { id: "bir", name: "ವಿದ್ಯಾರ್ಥಿಯ જન્મ ಪ್ರಮಾಣಪತ್ರ", note: "ದಾಖಲಾತಿಗಾಗಿ" },
      { id: "adh", name: "ವಿದ್ಯಾರ್ಥಿ ಮತ್ತು ಪೋಷಕರ ಆಧಾರ್ ಕಾರ್ಡ್", note: "ಗುರುತಿನ ಸಾಕ್ಷಿ" },
      { id: "tc", name: "ವರ್ಗಾವಣೆ ಪ್ರಮಾಣಪತ್ರ (TC) & ಅಂಕಪಟ್ಟಿ", note: "ಉನ್ನತ ಶಿಕ್ಷಣಕ್ಕೆ" },
      { id: "rat", name: "ರೇಷನ್ ಕಾರ್ಡ್ / ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ", note: "ಶಿಷ್ಯವೇತನಕ್ಕಾಗಿ" },
      { id: "pho", name: "ಪಾಸ್‌ಪೋರ್ಟ್ ಫೋಟೋಗಳು (3 ಪ್ರತಿ)", note: "ಶಾಲಾ ದಾಖಲೆಗೆ" }
    ]
  },
  emergency: {
    ml: [
      { id: "adh", name: "സർക്കാർ തിരിച്ചറിയൽ കാർഡ് (ആധാർ / ഡ്രൈവിംഗ് ലൈസൻസ്)", note: "അത്യാവശ്യ സമയത്ത്" },
      { id: "com", name: "എഴുതി തയ്യാറാക്കിയ പരാതി / സംഭവ വിവരണം", note: "പോലീസ് കൺട്രോൾ / ഫയർ സ്റ്റേഷനിൽ" },
      { id: "rc", name: "വാഹന ആർ.സി ബുക്ക് & ഇൻഷുറൻസ്", note: "റോഡ് അപകടക്കേസുകളിൽ" },
      { id: "loc", name: "കൃത്യമായ സ്ഥല വിവരവും ലാൻഡ്മാർക്കും", note: "അടിയന്തിര സഹായത്തിനായി" }
    ],
    en: [
      { id: "adh", name: "Govt Photo ID (Aadhaar / Driver's License / Voter ID)", note: "For emergency verification" },
      { id: "com", name: "Written Statement / Incident Complaint Copy", note: "For police or fire station logging" },
      { id: "rc", name: "Vehicle RC Book & Insurance Papers", note: "Required in traffic or accident incidents" },
      { id: "loc", name: "Exact Location Landmark or GPS Coordinates", note: "For emergency dispatch" }
    ],
    hi: [
      { id: "adh", name: "सरकारी फोटो आईडी (आधार / ड्राइविंग लाइसेंस)", note: "सत्यापन हेतु" },
      { id: "com", name: "लिखित शिकायत / घटना विवरण", note: "पुलिस या दमकल केंद्र हेतु" },
      { id: "rc", name: "वाहन आरसी और बीमा दस्तावेज", note: "सड़क दुर्घटना मामलों में" },
      { id: "loc", name: "सटीक स्थान और लैंडमार्क", note: "तत्काल सहायता हेतु" }
    ],
    te: [
      { id: "adh", name: "ప్రభుత్వ ఐడి (ఆధార్ / డ్రైవింగ్ లైసెన్స్)", note: "అత్యవసర నిరూపణకు" },
      { id: "com", name: "రాతపూర్వక ఫిర్యాదు / సంఘటన వివరాలు", note: "పోలీసు స్టేషన్ వివరాలకు" },
      { id: "rc", name: "వాహన RC & ఇన్సూరెన్స్ కాపీలు", note: "ప్రమాదాల కేసుల్లో" },
      { id: "loc", name: "ఖచ్చితమైన ప్రదేశం మరియు సమీప ల్యాండ్‌మార్క్", note: "సహాయం కోసం" }
    ],
    kn: [
      { id: "adh", name: "ಸರ್ಕಾರಿ ಗುರುತಿನ ಚೀಟಿ (ಆಧಾರ್ / ಚಾಲನಾ ಪರವಾನಗಿ)", note: "ತುರ್ತು ಪರಿಶೀಲನೆಗೆ" },
      { id: "com", name: "ಬರಹರೂಪದ ದೂರು / ಘಟನೆಯ ವಿವರ", note: "ಪೋಲಿಸ್/ಅಗ್ನಿಶಾಮಕ ಠಾಣೆಗೆ" },
      { id: "rc", name: "ವಾಹನದ RC ಬುಕ್ ಮತ್ತು ವಿಮೆ ಕಾಗದಗಳು", note: "ಅಪಘಾತ ಪ್ರಕರಣಗಳಲ್ಲಿ" },
      { id: "loc", name: "ನಿಖರವಾದ ಸ್ಥಳ ಮತ್ತು ಲ್ಯಾಂಡ್‌ಮಾರ್ಕ್", note: "ತ್ವರಿತ ನೆರವಿಗೆ" }
    ]
  }
};

export function getApplicableSchemesForService(service) {
  if (!service) return [];
  const catKey = service.categoryKey || "government";

  // Match schemes depending on category or title
  if (catKey === "government") {
    return [
      { id: "general", label: "General Verification Documents" },
      SPECIFIC_SCHEMES_DOCS.income_cert,
      SPECIFIC_SCHEMES_DOCS.life_mission,
      SPECIFIC_SCHEMES_DOCS.building_permit
    ];
  } else if (catKey === "agriculture") {
    return [
      { id: "general", label: "General Farmer Registration" },
      SPECIFIC_SCHEMES_DOCS.pm_kisan
    ];
  } else if (catKey === "health") {
    return [
      { id: "general", label: "General Outpatient / Emergency" },
      SPECIFIC_SCHEMES_DOCS.karunya_health
    ];
  }
  return [{ id: "general", label: "General Category Requirements" }];
}

export function getRequiredDocumentsForService(service, lang = "en", schemeId = "general") {
  if (!service) return [];
  const language = lang || "en";

  // If a specific scheme is selected from drill-down
  if (schemeId && schemeId !== "general" && SPECIFIC_SCHEMES_DOCS[schemeId]) {
    const scheme = SPECIFIC_SCHEMES_DOCS[schemeId];
    const docs = scheme.docs[language] || scheme.docs.en || scheme.docs.ml;
    return docs;
  }

  // Check if custom requiredDocuments exist on the service object
  if (Array.isArray(service.requiredDocuments) && service.requiredDocuments.length > 0) {
    return service.requiredDocuments.map((doc, idx) => {
      if (typeof doc === "string") {
        return { id: `custom-${idx}`, name: doc, note: "" };
      }
      return {
        id: doc.id || `custom-${idx}`,
        name: doc[language] || doc.name || doc.en || "Document",
        note: doc.note || doc[`note_${language}`] || ""
      };
    });
  }

  // Fallback to category based documents
  const catKey = service.categoryKey || "government";
  const catDocsMap = CATEGORY_DOCUMENTS[catKey] || CATEGORY_DOCUMENTS.government;
  const docsList = catDocsMap[language] || catDocsMap.en || CATEGORY_DOCUMENTS.government.en;

  return docsList;
}

export default function RequiredDocumentsAccordion({
  service,
  language = "en",
  defaultOpen = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [selectedSchemeId, setSelectedSchemeId] = useState("general");
  const [checkedItems, setCheckedItems] = useState({});
  const [copied, setCopied] = useState(false);

  const availableSchemes = getApplicableSchemesForService(service);
  const docList = getRequiredDocumentsForService(service, language, selectedSchemeId);
  const serviceId = service?.id || "unknown";
  const storageKey = `gramseva_docs_${serviceId}_${selectedSchemeId}`;

  // Load checked state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      } else {
        setCheckedItems({});
      }
    } catch (e) {
      setCheckedItems({});
    }
  }, [storageKey, selectedSchemeId]);

  // Save checked state
  const toggleCheck = (docId) => {
    const updated = {
      ...checkedItems,
      [docId]: !checkedItems[docId]
    };
    setCheckedItems(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const resetAll = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      // ignore
    }
  };

  const selectAll = () => {
    const allChecked = {};
    docList.forEach((d) => {
      allChecked[d.id] = true;
    });
    setCheckedItems(allChecked);
    try {
      localStorage.setItem(storageKey, JSON.stringify(allChecked));
    } catch (e) {
      // ignore
    }
  };

  const totalDocs = docList.length;
  const checkedCount = docList.filter((d) => checkedItems[d.id]).length;
  const progressPercent = totalDocs > 0 ? Math.round((checkedCount / totalDocs) * 100) : 0;

  // Localized headers & labels
  const UI_LABELS = {
    ml: {
      title: "ആവശ്യമായ രേഖകൾ (Required Documents)",
      subtitle: "ഓഫീസിൽ പോകുന്നതിനു മുൻപുള്ള ചെക്ക്‌ലിസ്റ്റ്",
      drilldownLabel: "നിർദ്ദിഷ്ട പദ്ധതി / സേവനം തിരഞ്ഞെടുക്കുക:",
      readyCount: `${checkedCount}/${totalDocs} രേഖകൾ തയ്യാർ`,
      allReady: "എല്ലാ രേഖകളും തയ്യാറാണ്!",
      copyList: "ചെക്ക്‌ലിസ്റ്റ് കോപ്പി ചെയ്യുക",
      copiedMsg: "കോപ്പി ചെയ്തു!",
      resetBtn: "വീണ്ടും തുടങ്ങുക",
      selectAllBtn: "എല്ലാം ടിക്ക് ചെയ്യുക",
      disclaimer: "ഓഫീസിൽ പോകുമ്പോൾ അസൽ രേഖകളും സാക്ഷ്യപ്പെടുത്തിയ കോപ്പികളും കരുതുവാൻ ശ്രദ്ധിക്കുക."
    },
    en: {
      title: "Required Documents Checklist",
      subtitle: "Essential documents needed before visiting",
      drilldownLabel: "Drill-down Scheme or Service Type:",
      readyCount: `${checkedCount} of ${totalDocs} ready`,
      allReady: "All documents gathered!",
      copyList: "Copy checklist",
      copiedMsg: "Copied!",
      resetBtn: "Reset",
      selectAllBtn: "Check All",
      disclaimer: "Always bring original documents along with self-attested photocopies."
    },
    hi: {
      title: "आवश्यक दस्तावेज (Required Documents)",
      subtitle: "कार्यालय जाने से पहले चेकलिस्ट",
      drilldownLabel: "विशिष्ट योजना या पंजीकरण चुनें:",
      readyCount: `${totalDocs} में से ${checkedCount} तैयार`,
      allReady: "सभी दस्तावेज तैयार हैं!",
      copyList: "कॉपी करें",
      copiedMsg: "कॉपी हो गया!",
      resetBtn: "रीसेट",
      selectAllBtn: "सभी चुनें",
      disclaimer: "मूल दस्तावेजों के साथ स्व-सत्यापित प्रतियां साथ रखें।"
    },
    te: {
      title: "కావలసిన పత్రాలు (Required Documents)",
      subtitle: "కార్యాలయానికి వెళ్లేముందు చెక్‌లిస్ట్",
      drilldownLabel: "నిర్దిష్ట పథకం లేదా నమోదును ఎంచుకోండి:",
      readyCount: `${totalDocs} లో ${checkedCount} సిద్ధంగా ఉన్నాయి`,
      allReady: "అన్ని పత్రాలు సిద్ధంగా ఉన్నాయి!",
      copyList: "కాపీ చెక్‌లిస్ట్",
      copiedMsg: "కాపీ అయింది!",
      resetBtn: "రీసెట్",
      selectAllBtn: "అన్నీ ఎంచుకోండి",
      disclaimer: "ఒరిజినల్ పత్రాలతో పాటు ఫోటోకాపీలను కూడా తీసుకువెళ్లండి."
    },
    kn: {
      title: "ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು (Required Documents)",
      subtitle: "ಕಚೇರಿಗೆ ಭೇಟಿ ನೀಡುವ ಮುನ್ನ ಪರಿಶೀಲಿಸಿ",
      drilldownLabel: "ನಿರ್ದಿಷ್ಟ ಯೋಜನೆ ಅಥವಾ ನೋಂದಣಿ ಆಯ್ಕೆಮಾಡಿ:",
      readyCount: `${totalDocs} ರಲ್ಲಿ ${checkedCount} ಸಿದ್ಧವಾಗಿದೆ`,
      allReady: "ಎಲ್ಲಾ ದಾಖಲೆಗಳು ಸಿದ್ಧವಾಗಿವೆ!",
      copyList: "ಕಾಪಿ ಮಾಡಿ",
      copiedMsg: "ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!",
      resetBtn: "ರೀಸೆಟ್",
      selectAllBtn: "ಎಲ್ಲಾ ಆಯ್ಕೆಮಾಡಿ",
      disclaimer: "ಅಸಲು ದಾಖಲೆಗಳ ಜೊತೆಗೆ ಛಾಯಾಪ್ರತಿಯನ್ನೂ ಕೊಂಡೊಯ್ಯಿರಿ."
    }
  };

  const label = UI_LABELS[language] || UI_LABELS.en;

  const activeSchemeObj = availableSchemes.find((s) => s.id === selectedSchemeId);
  const activeSchemeTitle = activeSchemeObj?.names?.[language] || activeSchemeObj?.names?.en || activeSchemeObj?.label || "General";

  const handleCopyText = (e) => {
    e.stopPropagation();
    const serviceTitle = service?.translations?.[language]?.title || service?.translations?.en?.title || "Service";
    const textLines = [
      `📋 Required Documents for ${serviceTitle} (${activeSchemeTitle}):`,
      ...docList.map((d) => `${checkedItems[d.id] ? "✅" : "⬜"} ${d.name}${d.note ? ` (${d.note})` : ""}`),
      `\n📌 Note: ${label.disclaimer}`
    ];
    navigator.clipboard.writeText(textLines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`required-docs-accordion bg-stone-50/95 border border-stone-200/90 rounded-xl overflow-hidden transition-all duration-200 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Accordion Header / Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full text-left p-3 flex items-center justify-between gap-2.5 hover:bg-stone-100/80 transition cursor-pointer select-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${checkedCount === totalDocs && totalDocs > 0 ? "bg-emerald-100 text-emerald-800" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
            <FileText className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                {label.title}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${checkedCount === totalDocs && totalDocs > 0 ? "bg-emerald-100 text-emerald-900 border-emerald-300" : "bg-amber-50 text-amber-900 border-amber-200"}`}>
                {label.readyCount}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              {label.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="px-3 pb-3 pt-2 border-t border-stone-200/70 bg-white/70">
          {/* Scheme / Registration Drill-down Selector */}
          {availableSchemes.length > 1 && (
            <div className="mb-2.5 p-2 bg-emerald-50/70 border border-emerald-200/80 rounded-lg">
              <label className="block text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{label.drilldownLabel}</span>
              </label>
              <select
                value={selectedSchemeId}
                onChange={(e) => setSelectedSchemeId(e.target.value)}
                className="w-full bg-white text-slate-800 border border-emerald-300 rounded-md px-2 py-1 text-xs font-bold outline-none cursor-pointer shadow-2xs focus:ring-1 focus:ring-emerald-500"
              >
                {availableSchemes.map((s) => {
                  const sName = s.names?.[language] || s.names?.en || s.label || s.id;
                  return (
                    <option key={s.id} value={s.id}>
                      {sName}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Progress bar */}
          <div className="mb-2.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1">
              <span>Progress ({activeSchemeTitle})</span>
              <span className={progressPercent === 100 ? "text-emerald-700 font-extrabold" : "text-slate-500"}>
                {progressPercent === 100 ? label.allReady : `${progressPercent}%`}
              </span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${progressPercent === 100 ? "bg-emerald-600" : "bg-emerald-500"}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Document Checklist Items */}
          <div className="space-y-1.5 my-2 max-h-64 overflow-y-auto pr-0.5">
            {docList.map((doc) => {
              const isChecked = !!checkedItems[doc.id];
              return (
                <div
                  key={doc.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCheck(doc.id);
                  }}
                  className={`flex items-start gap-2.5 p-2 rounded-lg border transition cursor-pointer select-none ${
                    isChecked
                      ? "bg-emerald-50/80 border-emerald-200/90 text-slate-900"
                      : "bg-white border-stone-200/80 hover:border-emerald-300 text-slate-700"
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCheck(doc.id);
                    }}
                    className="mt-0.5 text-emerald-700 shrink-0 focus:outline-none"
                    aria-label={`Mark ${doc.name}`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs font-bold leading-tight block ${
                        isChecked ? "line-through text-slate-500" : "text-slate-900"
                      }`}
                    >
                      {doc.name}
                    </span>
                    {doc.note && (
                      <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                        {doc.note}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-200/60 text-[10px]">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  selectAll();
                }}
                className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-slate-700 font-extrabold rounded-md transition"
              >
                {label.selectAllBtn}
              </button>
              {checkedCount > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetAll();
                  }}
                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-md transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{label.resetBtn}</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopyText}
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-md transition flex items-center gap-1 shadow-2xs"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? label.copiedMsg : label.copyList}</span>
            </button>
          </div>

          {/* Disclaimer note */}
          <div className="mt-2 text-[9px] text-slate-500 flex items-start gap-1 bg-amber-50/60 p-1.5 rounded border border-amber-200/60">
            <Info className="w-3 h-3 text-amber-700 shrink-0 mt-0.5" />
            <span>{label.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
}
