/**
 * GramSeva Search Dictionary & Multilingual Alias Engine
 * Optimized for rapid phonetic and substring matching across Malayalam, Kannada, Hindi, Telugu and English.
 */

export const CATEGORY_ALIASES = {
  health: [
    "hospital", "clinic", "doctor", "medical", "ambulance", "phc", "fhc", "health centre", "arogya",
    "ആരോഗ്യം", "ആശുപത്രി", "ഡോക്ടർ", "ആരോഗ്യ കേന്ദ്രം", "ആംബുലൻസ്",
    "ಆರೋಗ್ಯ", "ಆಸ್ಪತ್ರೆ", "ವೈದ್ಯರು",
    "स्वास्थ्य", "अस्पताल", "चिकित्सा", "डॉक्टर", "एम्बुलेंस",
    "వైద్యం", "ఆసుపత్రి", "డాక్టర్", "ఆరోగ్యం"
  ],
  water: [
    "water", "kwa", "jal", "pipe", "connection", "drinking water", "tank", "borewell", "vellam",
    "വെള്ളം", "ജലം", "കുടിവെള്ളം", "പൈപ്പ്", "വാട്ടർ അതോറിറ്റി",
    "ನೀರು", "ಜಲ", "ಕುಡಿಯುವ ನೀರು",
    "पानी", "जल", "पेयजल", "नल", "जल बोर्ड",
    "నీరు", "జలం", "తాగునీరు", "పైపు"
  ],
  agriculture: [
    "krishi", "farm", "farmer", "seed", "soil", "fertilizer", "agriculture", "kisan", "krishi bhavan",
    "കൃഷി", "കർഷകൻ", "കൃഷിഭവൻ", "വിത്ത്", "വളം",
    "ಕೃಷಿ", "ರೈತ", "ಕೃಷಿ ಭವನ", "ಬೀಜ",
    "कृषि", "किसान", "कृषि भवन", "बीज", "उर्वरक",
    "వ్యవసాయం", "రైతు", "విత్తనాలు"
  ],
  education: [
    "school", "college", "teacher", "education", "class", "student", "library", "anganwadi",
    "വിദ്യാഭ്യാസം", "സ്കൂൾ", "കോളേജ്", "അങ്കണവാടി", "ലൈബ്രറി",
    "ಶಾಲೆ", "ಶಿಕ್ಷಣ", "ಕಾಲೇಜು", "ಅಂಗನವಾಡಿ",
    "स्कूल", "शिक्षा", "कॉलेज", "आंगनवाड़ी", "पुस्तकालय",
    "పాఠశాల", "విద్య", "కళాశాల", "అంగన్‌వాడీ"
  ],
  government: [
    "panchayat", "village", "revenue", "registry", "akshaya", "certificate", "office", "ration", "tax", "ward",
    "പഞ്ചായത്ത്", "വില്ലേജ്", "കച്ചേരി", "അക്ഷയ", "റേഷൻ", "സർട്ടിഫിക്കറ്റ്", "നികുതി",
    "ಪಂಚಾಯತ್", "ಕಚೇರಿ", "ಗ್ರಾಮ ಪಂಚಾಯತಿ", "ರೇಷನ್",
    "सरकार", "पंचायत", "प्रमाणपत्र", "राशन", "तहसील", "अक्षय केंद्र",
    "ప్రభుత్వం", "పంచాయతీ", "రేషన్", "సర్టిఫికెట్"
  ]
};

export const LOCALIZED_STRINGS = {
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
    locationHubTitle: "പ്രാദേശിക തിരിച്ചിൽ",
    districtLabel: "ജില്ല തിരഞ്ഞെടുക്കുക",
    localityLabel: "സ്ഥലം തിരഞ്ഞെടുക്കുക",
    allDistricts: "എല്ലാ ജില്ലകളും (കേരളം മുഴുവൻ)",
    allLocalities: "എല്ലാ സ്ഥലങ്ങളും / വില്ലേജുകൾ",
    nearMeBtn: "എന്റെ സമീപത്തുള്ളവ കണ്ടെത്തുക (GPS)",
    nearMeActiveDesc: "നിങ്ങളുടെ സ്ഥാനം: വൈക്കം, കോട്ടയം",
    radiusLabel: "ചുറ്റളവ് പരിധി",
    sortByNearest: "അടുത്തുള്ളവ ആദ്യം കാണിക്കുക"
  },
  hi: {
    locationHubTitle: "स्थान फ़िल्टर केंद्र",
    districtLabel: "जिला चुनें",
    localityLabel: "स्थान / नगर चुनें",
    allDistricts: "सभी जिले",
    allLocalities: "सभी स्थान / गाँव",
    nearMeBtn: "जीपीएस सिमुलेशन / मेरे निकट",
    nearMeActiveDesc: "अनुकरण स्थान: वैकोम, कोट्टायम",
    radiusLabel: "खोज का दायरा",
    sortByNearest: "निकटतम पहले दिखाएं"
  },
  te: {
    locationHubTitle: "ప్రాంతీయ ఫిల్టర్",
    districtLabel: "జిల్లాను ఎంచుకోండి",
    localityLabel: "ప్రాంతం ఎంచుకోండి",
    allDistricts: "అన్ని జిల్లాలు",
    allLocalities: "అన్ని మున్సిపాలిటీలు / గ్రామాలు",
    nearMeBtn: "GPS అనుకరణ / నా దగ్గర",
    nearMeActiveDesc: "స్థానం: వైకోమ్, కొట్టాయం",
    radiusLabel: "శోధన పరిధి",
    sortByNearest: "సమీపంలోనివి ముందుగా"
  },
  kn: {
    locationHubTitle: "ಸ್ಥಳ ಶೋಧನೆ ಕೇಂದ್ರ",
    districtLabel: "ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    localityLabel: "ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    allDistricts: "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು",
    allLocalities: "ಎಲ್ಲಾ ಗ್ರಾಮಗಳು / ಮುನಿಸಿಪಾಲಿಟಿಗಳು",
    nearMeBtn: "ನನ್ನ ಸಮೀಪದ ಸ್ಥಳಗಳು (GPS)",
    nearMeActiveDesc: "ನಿಮ್ಮ ಸ್ಥಳ: ವೈಕಂ, ಕೊಟ್ಟಾಯಂ",
    radiusLabel: "ಹುಡುಕಾಟದ ತ್ರಿಜ್ಯ",
    sortByNearest: "ಹತ್ತಿರದ ಸ್ಥಳಗಳು ಮೊದಲು"
  }
};

/**
 * Fast search text normalizer with Unicode NFKD decomposition
 */
export function normalizeSearchText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Levenshtein distance for fuzzy matching
 */
export function levenshteinDistance(a, b) {
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

/**
 * Generates deduplication key for institutions and services
 */
export function getDuplicateKey(service) {
  const data = service.translations?.en || Object.values(service.translations || {})[0] || {};
  return normalizeSearchText(`${data.title || ""} ${service.localityName || ""} ${service.districtName || ""}`);
}
