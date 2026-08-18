import { KERALA_DISTRICTS_LIST, KERALA_PANCHAYATS_BY_DISTRICT } from "./keralaPanchayatsData.js";
import { KARNATAKA_DISTRICTS_LIST, KARNATAKA_PANCHAYATS_BY_DISTRICT } from "./karnatakaPanchayatsData.js";
import { TAMILNADU_DISTRICTS_LIST, TAMILNADU_PANCHAYATS_BY_DISTRICT } from "./tamilNaduPanchayatsData.js";
import { ANDHRAPRADESH_DISTRICTS_LIST, ANDHRAPRADESH_PANCHAYATS_BY_DISTRICT } from "./andhraPradeshPanchayatsData.js";

export const REPRESENTATIVE_NAMES = [
  { ml: "കെ. വി. സുരേഷ് കുമാർ (സെക്രട്ടറി)", en: "K. V. Suresh Kumar (Secretary)", hi: "के. वी. सुरेश कुमार (सचिव)", te: "కె. వి. సురేష్ కుమార్ (సెక్రటరీ)", kn: "ಕೆ. ವಿ. ಸುರೇಶ್ ಕುಮಾರ್ (ಕಾರ್ಯದರ್ಶಿ)", ta: "கே. வி. சுரேஷ் குமார் (செயலாளர்)" },
  { ml: "ശ്രീമതി അനിത സി. വി. (പ്രസിഡന്റ്)", en: "Smt. Anitha C. V. (President)", hi: "श्रीमती अनीता सी. वी. (अध्यक्ष)", te: "శ్రీమతి అనిత సి. వి. (అధ్యక్షురాలు)", kn: "ಶ್ರೀಮತಿ ಅನಿತಾ ಸಿ. ವಿ. (ಅಧ್ಯಕ್ಷರು)", ta: "திருமதி அனிதா சி. வி. (தலைவர்)" },
  { ml: "എം. രാജേഷ് (ഹെൽത്ത് ഇൻസ്‌പെക്ടർ)", en: "M. Rajesh (Health Inspector)", hi: "एम. राजेश (स्वास्थ्य निरीक्षक)", te: "యం. రాజేష్ (హెల్త్ ఇన్ స్పెక్టర్)", kn: "ಎಂ. ರಾಜೇಶ್ (ಆರೋಗ್ಯ ನಿರೀಕ್ಷಕ)", ta: "எம். ராஜேஷ் (சுகாதார ஆய்வாளர்)" },
  { ml: "കെ. പി. ഫാത്തിമ (കൃഷി ഓഫീസർ)", en: "K. P. Fathima (Agricultural Officer)", hi: "के. पी. फातिमा (कृषि अधिकारी)", te: "కె. పి. ఫాతిమా (వ్యవసాయ అధికారి)", kn: "ಕೆ. ಪಿ. ಫಾತಿಮಾ (ಕೃಷಿ ಅಧಿಕಾರಿ)", ta: "கே. பி. பாத்திமா (வேளாண் அலுவலர்)" },
  { ml: "ആർ. ജയദേവൻ (അസിസ്റ്റന്റ് എഞ്ചിനീയർ)", en: "R. Jayadevan (Assistant Engineer)", hi: "आर. जयदेवन (सहायक अभियंता)", te: "ఆర్. జయదేవన్ (అసిస్టెంట్ ఇంజనీర్)", kn: "ಆರ್. ಜಯದೇವನ್ (ಸಹಾಯಕ ಎಂಜಿನಿಯರ್)", ta: "ஆர். ஜெயதேவன் (உதவி பொறியாளர்)" },
  { ml: "ബി. പ്രകാശ് (സെക്ഷൻ ഓഫീസർ)", en: "B. Prakash (Section Officer)", hi: "बी. प्रकाश (अनुभाग अधिकारी)", te: "బి. ప్రకాష్ (సెక్షన్ ఆఫీసర్)", kn: "ಬಿ. ಪ್ರಕಾಶ್ (ಶಾಖಾಧಿಕಾರಿ)", ta: "பி. பிரகாஷ் (பிரிவு அலுவலர்)" }
];

// ==========================================
// 1. KERALA TEMPLATES (5 per category = 25 total)
// ==========================================
export const KERALA_TEMPLATES = [
  // Health (5)
  {
    subId: "fhc-1",
    categoryKey: "health",
    catEn: "Health", catMl: "ആരോഗ്യം",
    titleEn: (p) => `${p.en} Govt. Family Health Centre (FHC)`,
    titleMl: (p) => `${p.ml} ഗവ. കുടുംബാരോഗ്യ കേന്ദ്രം (FHC)`,
    descEn: (p) => `Primary family health centre serving ${p.en}. 24/7 OP care, e-Health registration, NCD lifestyle clinic, child vaccination & free medicines.`,
    descMl: (p) => `${p.ml} പഞ്ചായത്തിലെ പ്രാഥമിക ആരോഗ്യ കേന്ദ്രം, അത്യാഹിത വിഭാഗം, ജീവിതശൈലീ രോഗ നിർണയ ക്ലിനിക്ക്, സൗജന്യ മരുന്ന് വിതരണം.`,
    hoursEn: "8:30 AM - 2:30 PM (24/7 Casualty)",
    hoursMl: "രാവിലെ 8:30 - ഉച്ചയ്ക്ക് 2:30 (24 മണിക്കൂർ അത്യാഹിതം)",
    isEmergency: true
  },
  {
    subId: "ayur-2",
    categoryKey: "health",
    catEn: "Health", catMl: "ആരോഗ്യം",
    titleEn: (p) => `Govt. Ayurveda Dispensary - ${p.en}`,
    titleMl: (p) => `ഗവ. ആയുർവേദ ഡിസ്പെൻസറി - ${p.ml}`,
    descEn: (p) => `Traditional Ayurvedic consultation, free herbal medicines, Panchakarma rejuvenation guidance & geriatric care for ${p.en}.`,
    descMl: (p) => `${p.ml} ആയുർവേദ ചികിത്സാലയം, സൗജന്യ ഔഷധ വിതരണം, വാതരോഗ ചികിത്സ, വയോജന ആരോഗ്യ സംരക്ഷണം.`,
    hoursEn: "9:00 AM - 2:00 PM",
    hoursMl: "രാവിലെ 9:00 - ഉച്ചയ്ക്ക് 2:00",
    isEmergency: false
  },
  {
    subId: "homeo-3",
    categoryKey: "health",
    catEn: "Health", catMl: "ആരോഗ്യം",
    titleEn: (p) => `Govt. Homeopathic Dispensary - ${p.en}`,
    titleMl: (p) => `ഗവ. ഹോമിയോപ്പതി ഡിസ്പെൻസറി - ${p.ml}`,
    descEn: (p) => `Free homeopathic consultation, chronic allergy & respiratory wellness, mother-child immunity drive for ${p.en}.`,
    descMl: (p) => `${p.ml} സൗജന്യ ഹോമിയോ ചികിത്സ, പ്രതിരോധ മരുന്നുകൾ, അലർജി-ശ്വാസകോശ രോഗ നിവാരണം.`,
    hoursEn: "9:00 AM - 2:00 PM",
    hoursMl: "രാവിലെ 9:00 - ഉച്ചയ്ക്ക് 2:00",
    isEmergency: false
  },
  {
    subId: "vet-4",
    categoryKey: "health",
    catEn: "Health", catMl: "ആരോഗ്യം",
    titleEn: (p) => `Govt. Veterinary Hospital & Dairy Care - ${p.en}`,
    titleMl: (p) => `ഗവ. വെറ്ററിനറി ഡിസ്പെൻസറി & മൃഗാശുപത്രി - ${p.ml}`,
    descEn: (p) => `Cattle & pet healthcare, artificial insemination, livestock disease vaccination & dairy farmer subsidy desk for ${p.en}.`,
    descMl: (p) => `${p.ml} കന്നുകാലി ചികിത്സ, സൗജന്യ കുത്തിവെപ്പ്, കൃത്രിമ ബീജസങ്കലനം, വളർത്തുമൃഗ ആരോഗ്യ സംരക്ഷണം.`,
    hoursEn: "9:00 AM - 3:00 PM",
    hoursMl: "രാവിലെ 9:00 - വൈകുന്നേരം 3:00",
    isEmergency: false
  },
  {
    subId: "asha-5",
    categoryKey: "health",
    catEn: "Health", catMl: "ആരോഗ്യം",
    titleEn: (p) => `ASHA Worker & Child Health Outreach Unit - ${p.en}`,
    titleMl: (p) => `ആശാ വർക്കർ - മാതൃ-ശിശു സംരക്ഷണ ഹെൽത്ത് സബ് സെന്റർ - ${p.ml}`,
    descEn: (p) => `Pulse Polio, maternal Mathrushree kits, adolescent anemia screening & 108 emergency ambulance dispatch for ${p.en}.`,
    descMl: (p) => `${p.ml} പൾസ് പോളിയോ, ഗർഭിണികൾക്കുള്ള പോഷകാഹാരം, നവജാത ശിശു പരിചരണം, 108 ആംബുലൻസ് ഏകോപനം.`,
    hoursEn: "8:30 AM - 4:00 PM",
    hoursMl: "രാവിലെ 8:30 - വൈകുന്നേരം 4:00",
    isEmergency: true
  },

  // Water (5)
  {
    subId: "kwa-1",
    categoryKey: "water",
    catEn: "Water", catMl: "കുടിവെള്ളം",
    titleEn: (p) => `Kerala Water Authority (KWA) Section - ${p.en}`,
    titleMl: (p) => `കേരള വാട്ടർ അതോറിറ്റി (KWA) സെക്ഷൻ ഓഫീസ് - ${p.ml}`,
    descEn: (p) => `Piped drinking water distribution, Jal Jeevan Mission domestic tap connections & main pipeline repair for ${p.en}.`,
    descMl: (p) => `${p.ml} പഞ്ചായത്തിലെ പൊതു കുടിവെള്ള വിതരണം, ജൽ ജീവൻ മിഷൻ കണക്ഷനുകൾ, പൈപ്പ് ലൈൻ അറ്റകുറ്റപ്പണി.`,
    hoursEn: "9:00 AM - 5:00 PM",
    hoursMl: "രാവിലെ 9:00 - വൈകുന്നേരം 5:00",
    isEmergency: false
  },
  {
    subId: "jalanidhi-2",
    categoryKey: "water",
    catEn: "Water", catMl: "കുടിവെള്ളം",
    titleEn: (p) => `Jalanidhi Grama Panchayat Water Substation - ${p.en}`,
    titleMl: (p) => `ജലനിധി കുടിവെള്ള വിതരണ ഉപകേന്ദ്രം - ${p.ml}`,
    descEn: (p) => `Community participatory drinking water scheme, overhead reservoir pumping & filtration maintenance for ${p.en}.`,
    descMl: (p) => `${p.ml} ജലനിധി ഉപഭോക്തൃ സമിതി കുടിവെള്ള പമ്പിംഗ് സ്റ്റേഷൻ, ഫിൽട്ടറേഷൻ, ശുദ്ധജല വിതരണം.`,
    hoursEn: "6:00 AM - 6:00 PM",
    hoursMl: "രാവിലെ 6:00 - വൈകുന്നേരം 6:00",
    isEmergency: false
  },
  {
    subId: "water-lab-3",
    categoryKey: "water",
    catEn: "Water", catMl: "കുടിവെള്ളം",
    titleEn: (p) => `Panchayat Water Quality Lab & Well Chlorination - ${p.en}`,
    titleMl: (p) => `കുടിവെള്ള ഗുണനിലവാര പരിശോധനാ ലാബ് & കിണർ ക്ലോറിനേഷൻ - ${p.ml}`,
    descEn: (p) => `Free bacteriological & chemical well water testing, seasonal bleaching powder distribution & potability certification.`,
    descMl: (p) => `${p.ml} സൗജന്യ കിണർ വെള്ള പരിശോധന, ക്ലോറിനേഷൻ ഡ്രൈവ്, കുടിവെള്ള ശുദ്ധീകരണ ഗുണനിലവാര സർട്ടിഫിക്കറ്റ്.`,
    hoursEn: "9:30 AM - 4:00 PM",
    hoursMl: "രാവിലെ 9:30 - വൈകുന്നേരം 4:00",
    isEmergency: false
  },
  {
    subId: "ro-kiosk-4",
    categoryKey: "water",
    catEn: "Water", catMl: "കുടിവെള്ളം",
    titleEn: (p) => `Suchitwa Mission Community RO Drinking Water Kiosk - ${p.en}`,
    titleMl: (p) => `ശുചിത്വ മിഷൻ ആർ.ഒ ശുദ്ധജല കിയോസ്ക് - ${p.ml}`,
    descEn: (p) => `24/7 coin and smart card operated pure reverse osmosis mineral drinking water dispensing station for ${p.en}.`,
    descMl: (p) => `${p.ml} 24 മണിക്കൂറും പ്രവർത്തിക്കുന്ന ഓട്ടോമേറ്റഡ് ആർ.ഒ ശുദ്ധജല വിതരണ പ്ലാന്റ്.`,
    hoursEn: "24/7 Open",
    hoursMl: "24 മണിക്കൂറും ലഭ്യമാണ്",
    isEmergency: false
  },
  {
    subId: "tanker-5",
    categoryKey: "water",
    catEn: "Water", catMl: "കുടിവെള്ളം",
    titleEn: (p) => `Emergency Drought Relief & Water Tanker Supply Cell - ${p.en}`,
    titleMl: (p) => `അടിയന്തര കുടിവെള്ള ടാങ്കർ കൺട്രോൾ റൂം - ${p.ml}`,
    descEn: (p) => `Summer drought water tanker dispatch, acute shortage relief helpline & emergency borewell repair squad for ${p.en}.`,
    descMl: (p) => `${p.ml} വരൾച്ച ബാധിത പ്രദേശങ്ങളിൽ ടാങ്കർ ലോറിയിൽ കുടിവെള്ള വിതരണം, അടിയന്തര പൈപ്പ് പൊട്ടൽ കൺട്രോൾ റൂം.`,
    hoursEn: "24/7 Emergency Cell",
    hoursMl: "24 മണിക്കൂർ കൺട്രോൾ റൂം",
    isEmergency: true
  },

  // Education (5)
  {
    subId: "ghss-1",
    categoryKey: "education",
    catEn: "Education", catMl: "വിദ്യാഭ്യാസം",
    titleEn: (p) => `Govt. Higher Secondary School (GHSS) - ${p.en}`,
    titleMl: (p) => `ഗവ. ഹയർ സെക്കൻഡറി സ്‌കൂൾ (GHSS) - ${p.ml}`,
    descEn: (p) => `High School & Plus Two education, smart classrooms, Mid-Day Meal scheme, Vidya Kiranam laptops & scholarship cell.`,
    descMl: (p) => `${p.ml} പൊതുവിദ്യാഭ്യാസ സ്ഥാപനം, ഹൈസ്‌കൂൾ - ഹയർ സെക്കൻഡറി ക്ലാസുകൾ, സൗജന്യ ഉച്ചഭക്ഷണം, സ്കോളർഷിപ്പ്.`,
    hoursEn: "9:00 AM - 4:30 PM",
    hoursMl: "രാവിലെ 9:00 - വൈകുന്നേരം 4:30",
    isEmergency: false
  },
  {
    subId: "glps-2",
    categoryKey: "education",
    catEn: "Education", catMl: "വിദ്യാഭ്യാസം",
    titleEn: (p) => `Govt. Lower / Upper Primary School (GLPS/GUPS) - ${p.en}`,
    titleMl: (p) => `ഗവ. പ്രൈമറി സ്‌കൂൾ (GLPS/GUPS) - ${p.ml}`,
    descEn: (p) => `Classes 1 to 7, foundational literacy, Samagra digital resources, free textbooks & uniforms for ${p.en} children.`,
    descMl: (p) => `${p.ml} പ്രൈമറി വിദ്യാഭ്യാസം, സൗജന്യ പാഠപുസ്തക വിതരണം, യൂണിഫോം, സമഗ്ര ഡിജിറ്റൽ പാഠ്യപദ്ധതി.`,
    hoursEn: "9:30 AM - 4:00 PM",
    hoursMl: "രാവിലെ 9:30 - വൈകുന്നേരം 4:00",
    isEmergency: false
  },
  {
    subId: "anganwadi-3",
    categoryKey: "education",
    catEn: "Education", catMl: "വിദ്യാഭ്യാസം",
    titleEn: (p) => `ICDS Anganwadi Pre-School & Child Nutrition Hub - ${p.en}`,
    titleMl: (p) => `ഐ.സി.ഡി.എസ് അങ്കണവാടി പോഷകാഹാര കേന്ദ്രം - ${p.ml}`,
    descEn: (p) => `Pre-school activity learning, Poshan Abhiyaan hot cooked meals, milk and egg distribution, child growth tracking.`,
    descMl: (p) => `${p.ml} പ്രീ-സ്‌കൂൾ ബാലവിദ്യാഭ്യാസം, കുരുന്നുകൾക്ക് പോഷകാഹാരം, മുട്ട, പാൽ വിതരണം, തൂക്ക പരിശോധന.`,
    hoursEn: "9:00 AM - 3:30 PM",
    hoursMl: "രാവിലെ 9:00 - വൈകുന്നേരം 3:30",
    isEmergency: false
  },
  {
    subId: "library-4",
    categoryKey: "education",
    catEn: "Education", catMl: "വിദ്യാഭ്യാസം",
    titleEn: (p) => `Grama Panchayat Public Library & Digital Reading Room - ${p.en}`,
    titleMl: (p) => `ഗ്രാമപഞ്ചായത്ത് പബ്ലിക് ലൈബ്രറിയും ഡിജിറ്റൽ റീഡിംഗ് റൂമും - ${p.ml}`,
    descEn: (p) => `PSC & competitive exam reference guides, free internet Wi-Fi study desks, career guidance cell & e-newspapers for ${p.en}.`,
    descMl: (p) => `${p.ml} പി.എസ്.സി പരീക്ഷാ സഹായികൾ, സൗജന്യ വൈ-ഫൈ പഠന മുറി, ദിനപത്രങ്ങൾ, റഫറൻസ് ലൈബ്രറി.`,
    hoursEn: "8:00 AM - 7:00 PM",
    hoursMl: "രാവിലെ 8:00 - രാത്രി 7:00",
    isEmergency: false
  },
  {
    subId: "kudumbashree-edu-5",
    categoryKey: "education",
    catEn: "Education", catMl: "വിദ്യാഭ്യാസം",
    titleEn: (p) => `Kudumbashree Balasabha & Skill Training Centre - ${p.en}`,
    titleMl: (p) => `കുടുംബശ്രീ ബാലസഭ & നൈപുണ്യ പരിശീലന കേന്ദ്രം - ${p.ml}`,
    descEn: (p) => `Adolescent personality development, computer coding literacy, career counseling & youth vocational coaching in ${p.en}.`,
    descMl: (p) => `${p.ml} കൗമാര ശാക്തീകരണം, കമ്പ്യൂട്ടർ പരിശീലനം, തൊഴിൽ നൈപുണ്യ വികസനം, ബാലസഭ പ്രവർത്തനങ്ങൾ.`,
    hoursEn: "10:00 AM - 5:00 PM",
    hoursMl: "രാവിലെ 10:00 - വൈകുന്നേരം 5:00",
    isEmergency: false
  },

  // Government (5)
  {
    subId: "panchayat-1",
    categoryKey: "government",
    catEn: "Government", catMl: "തദ്ദേശസ്വയംഭരണം",
    titleEn: (p) => `${p.en} Grama Panchayat Office & Front Desk`,
    titleMl: (p) => `${p.ml} ഗ്രാമപഞ്ചായത്ത് കാര്യാലയം / ഫ്രണ്ട് ഓഫീസ്`,
    descEn: (p) => `Birth/death/marriage registrations, building permits, property tax, trade licenses, social security pensions & Gram Sabha.`,
    descMl: (p) => `${p.ml} സർട്ടിഫിക്കറ്റുകൾ, കെട്ടിട പെർമിറ്റുകൾ, വസ്തു നികുതി, ക്ഷേമ പെൻഷനുകൾ, ഗ്രാമസഭ പരാതി പരിഹാരം.`,
    hoursEn: "10:00 AM - 5:00 PM",
    hoursMl: "രാവിലെ 10:00 - വൈകുന്നേരം 5:00",
    isEmergency: false
  },
  {
    subId: "village-office-2",
    categoryKey: "government",
    catEn: "Government", catMl: "തദ്ദേശസ്വയംഭരണം",
    titleEn: (p) => `Village Revenue Office & Land Records Desk - ${p.en}`,
    titleMl: (p) => `വില്ലേജ് റവന്യൂ ഓഫീസ് (റവന്യൂ & പോക്കുവരവ്) - ${p.ml}`,
    descEn: (p) => `Land tax e-payment, Pokkuvaravu (mutation), Caste, Income, Nativity, Possession certificates & encumbrance verifications.`,
    descMl: (p) => `${p.ml} ഭൂനികുതി, പോക്കുവരവ്, ജാതി-വരുമാന-താമസ സർട്ടിഫിക്കറ്റുകൾ, തണ്ടപ്പേര് പകർപ്പ്, വില്ലേജ് രേഖകൾ.`,
    hoursEn: "10:00 AM - 5:00 PM",
    hoursMl: "രാവിലെ 10:00 - വൈകുന്നേരം 5:00",
    isEmergency: false
  },
  {
    subId: "akshaya-3",
    categoryKey: "government",
    catEn: "Government", catMl: "തദ്ദേശസ്വയംഭരണം",
    titleEn: (p) => `Akshaya e-Kendram Citizen Facilitation Centre - ${p.en}`,
    titleMl: (p) => `അക്ഷയ ഇ-കേന്ദ്രം (ഇ-ഡിസ്ട്രിക്റ്റ് സർവീസ് സെന്റർ) - ${p.ml}`,
    descEn: (p) => `Aadhaar updates, e-District applications, CMDRF relief, ration card corrections, utility bills & motor vehicle tax.`,
    descMl: (p) => `${p.ml} ആധാർ സേവനങ്ങൾ, ഇ-ഡിസ്ട്രിക്റ്റ് അപേക്ഷകൾ, റേഷൻ കാർഡ് തിരുത്തലുകൾ, ഓൺലൈൻ ഫീസ് പേയ്മെന്റുകൾ.`,
    hoursEn: "9:00 AM - 6:00 PM",
    hoursMl: "രാവിലെ 9:00 - വൈകുന്നേരം 6:00",
    isEmergency: false
  },
  {
    subId: "kseb-4",
    categoryKey: "government",
    catEn: "Government", catMl: "തദ്ദേശസ്വയംഭരണം",
    titleEn: (p) => `KSEB Electrical Section Office & Fuse Desk - ${p.en}`,
    titleMl: (p) => `കെ.എസ്.ഇ.ബി (KSEB) സെക്ഷൻ ഓഫീസ് & ഫ്യൂസ് കോൾ സെന്റർ - ${p.ml}`,
    descEn: (p) => `24/7 fuse call desk, new power connections, Soura rooftop solar scheme & power breakdown restoration for ${p.en}.`,
    descMl: (p) => `${p.ml} വൈദ്യുതി വിതരണം, പുതിയ കണക്ഷൻ, സൗര റൂഫ്‌ടോപ്പ് സോളാർ, 24 മണിക്കൂർ ഫ്യൂസ് ഓഫ് പരാതി പരിഹാരം.`,
    hoursEn: "9:00 AM - 5:00 PM (24/7 Fuse Off)",
    hoursMl: "രാവിലെ 9:00 - വൈകുന്നേരം 5:00 (24 മണിക്കൂർ ഫ്യൂസ് കോൾ)",
    isEmergency: true
  },
  {
    subId: "mgnrega-5",
    categoryKey: "government",
    catEn: "Government", catMl: "തദ്ദേശസ്വയംഭരണം",
    titleEn: (p) => `MGNREGA Rural Employment Guarantee Cell - ${p.en}`,
    titleMl: (p) => `തൊഴിലുറപ്പ് പദ്ധതി കാര്യാലയം (MGNREGA) - ${p.ml}`,
    descEn: (p) => `100 days job card issuance, muster roll verification, water conservation canal works & direct wage credit tracking.`,
    descMl: (p) => `${p.ml} തൊഴിലുറപ്പ് കാർഡ് വിതരണം, മസ്റ്റർ റോൾ, നീർത്തട വികസന ജോലികൾ, വേതന ക്രെഡിറ്റ് വിവരങ്ങൾ.`,
    hoursEn: "10:00 AM - 4:30 PM",
    hoursMl: "രാവിലെ 10:00 - വൈകുന്നേരം 4:30",
    isEmergency: false
  },

  // Agriculture (5)
  {
    subId: "krishi-1",
    categoryKey: "agriculture",
    catEn: "Agriculture", catMl: "കൃഷി",
    titleEn: (p) => `${p.en} Krishi Bhavan & Agricultural Office`,
    titleMl: (p) => `${p.ml} കൃഷിഭവൻ കാര്യാലയം`,
    descEn: (p) => `Subsidized quality seeds, organic bio-fertilizers, PM-KISAN, crop loss assistance, Subhiksha Keralam schemes & farming tools.`,
    descMl: (p) => `${p.ml} വിത്ത് വിതരണം, ജൈവവളം, വിള ഇൻഷുറൻസ്, കൃഷി ഉപകരണ സബ്സിഡി, കാർഷിക മാർഗ്ഗനിർദ്ദേശങ്ങൾ.`,
    hoursEn: "10:00 AM - 5:00 PM",
    hoursMl: "രാവിലെ 10:00 - വൈകുന്നേരം 5:00",
    isEmergency: false
  },
  {
    subId: "ration-2",
    categoryKey: "agriculture",
    catEn: "Agriculture", catMl: "കൃഷി",
    titleEn: (p) => `PDS Fair Price Ration Depot No. 1 - ${p.en}`,
    titleMl: (p) => `പൊതുവിതരണ റേഷൻ കട (PDS Depot) - ${p.ml}`,
    descEn: (p) => `Subsidized NFSA rice, wheat, sugar, kerosene, Anna Yojana grain disbursement & e-PoS ration card biometric transactions.`,
    descMl: (p) => `${p.ml} സബ്സിഡി നിരക്കിൽ അരി, ഗോതമ്പ്, പഞ്ചസാര, മണ്ണെണ്ണ, അന്ത്യോദയ അന്നയോജന വിതരണം.`,
    hoursEn: "8:30 AM - 12:30 PM & 4:00 PM - 7:00 PM",
    hoursMl: "രാവിലെ 8:30 - ഉച്ചയ്ക്ക് 12:30 | വൈകുന്നേരം 4:00 - 7:00",
    isEmergency: false
  },
  {
    subId: "milma-3",
    categoryKey: "agriculture",
    catEn: "Agriculture", catMl: "കൃഷി",
    titleEn: (p) => `Milma Primary Dairy Producers Cooperative Society - ${p.en}`,
    titleMl: (p) => `മിൽമ ക്ഷീരോത്പാദക സഹകരണ സംഘം - ${p.ml}`,
    descEn: (p) => `Daily morning & evening dairy milk procurement, subsidized cattle feed, government milk subsidy bonus & veterinary medicines.`,
    descMl: (p) => `${p.ml} പാൽ സംഭരണം, കാലിത്തീറ്റ സബ്സിഡി, പാൽ സബ്സിഡി ബോണസ് വിതരണം, ക്ഷീര കർഷക ക്ഷേമം.`,
    hoursEn: "6:00 AM - 8:30 AM & 4:30 PM - 6:30 PM",
    hoursMl: "രാവിലെ 6:00 - 8:30 | വൈകുന്നേരം 4:30 - 6:30",
    isEmergency: false
  },
  {
    subId: "haritha-4",
    categoryKey: "agriculture",
    catEn: "Agriculture", catMl: "കൃഷി",
    titleEn: (p) => `Haritha Karma Sena Bio-Waste & Organic Compost Hub - ${p.en}`,
    titleMl: (p) => `ഹരിത കർമ്മ സേന കമ്പോസ്റ്റ് നിർമ്മാണ യൂണിറ്റ് - ${p.ml}`,
    descEn: (p) => `Door-to-door plastic waste collection, decentralized organic composting, bio-pest repellent production & green farming support.`,
    descMl: (p) => `${p.ml} അജൈവ മാലിന്യ ശേഖരണം, ജൈവ കമ്പോസ്റ്റ് നിർമ്മാണം, ജൈവ കീടനാശിനി വിതരണം, ഹരിത കൃഷി സഹായം.`,
    hoursEn: "8:30 AM - 3:30 PM",
    hoursMl: "രാവിലെ 8:30 - വൈകുന്നേരം 3:30",
    isEmergency: false
  },
  {
    subId: "vfpck-5",
    categoryKey: "agriculture",
    catEn: "Agriculture", catMl: "കൃഷി",
    titleEn: (p) => `VFPCK Farmer Vegetable & Fruit Procurement Market - ${p.en}`,
    titleMl: (p) => `VFPCK കർഷക വിപണി & സംഭരണ കേന്ദ്രം - ${p.ml}`,
    descEn: (p) => `Direct farmer fruit & vegetable marketing, fair weight assurance, base price protection, cold transport & zero intermediary fees.`,
    descMl: (p) => `${p.ml} പച്ചക്കറി സംഭരണ വിപണി, താങ്ങുവില ഉറപ്പാക്കൽ, തോട്ടവിള സബ്സിഡി, ഇടനിലക്കാരില്ലാത്ത കർഷക വരുമാനം.`,
    hoursEn: "7:00 AM - 2:00 PM",
    hoursMl: "രാവിലെ 7:00 - ഉച്ചയ്ക്ക് 2:00",
    isEmergency: false
  }
];

// ==========================================
// 2. KARNATAKA TEMPLATES (5 per category = 25 total)
// ==========================================
export const KARNATAKA_TEMPLATES = [
  // Health (5)
  {
    subId: "phc-1",
    categoryKey: "health",
    catEn: "Health", catKn: "ಆರೋಗ್ಯ",
    titleEn: (p) => `${p.en} Primary Health Centre (PHC) & Ayushman Arogya Mandir`,
    titleKn: (p) => `${p.kn || p.en} ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ (PHC)`,
    descEn: (p) => `Primary family health centre serving ${p.en}. 24/7 OP care, Ayushman Bharat Arogya Karnataka e-KYC, free medicines & maternal delivery unit.`,
    descKn: (p) => `${p.kn || p.en} ಪಂಚಾಯತ್ ಉಚಿತ ಆರೋಗ್ಯ ಸೇವೆಗಳು, ತುರ್ತು ಚಿಕಿತ್ಸೆ, ಉಚಿತ ಔಷಧಿ ವಿತರಣೆ ಮತ್ತು ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಕಾರ್ಡ್.`,
    hoursEn: "24/7 OPD & Emergency",
    hoursKn: "24 ಗಂಟೆ ತುರ್ತು ಮತ್ತು ಹೊರರೋಗಿ ವಿಭಾಗ",
    isEmergency: true
  },
  {
    subId: "ayush-2",
    categoryKey: "health",
    catEn: "Health", catKn: "ಆರೋಗ್ಯ",
    titleEn: (p) => `Govt. AYUSH & Ayurvedic Wellness Dispensary - ${p.en}`,
    titleKn: (p) => `ಸರ್ಕಾರಿ ಆಯುಷ್ ಮತ್ತು ಆಯುರ್ವೇದ ಚಿಕಿತ್ಸಾಲಯ - ${p.kn || p.en}`,
    descEn: (p) => `Holistic Ayurveda consultations, joint pain herbal therapy, free Kashaya preparations & wellness advice for ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ಆಯುರ್ವೇದ ಚಿಕಿತ್ಸೆ, ಉಚಿತ ಕಷಾಯ ಹಾಗೂ ಗಿಡಮೂಲಿಕೆ ಔಷಧಿ ವಿತರಣಾ ಕೇಂದ್ರ.`,
    hoursEn: "9:00 AM - 2:30 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 9:00 - ಮಧ್ಯಾಹ್ನ 2:30",
    isEmergency: false
  },
  {
    subId: "namma-3",
    categoryKey: "health",
    catEn: "Health", catKn: "ಆರೋಗ್ಯ",
    titleEn: (p) => `Namma Clinic & Comprehensive Health Centre - ${p.en}`,
    titleKn: (p) => `ನಮ್ಮ ಕ್ಲಿನಿಕ್ ಮತ್ತು ಆರೋಗ್ಯ ಕ್ಷೇಮ ಕೇಂದ್ರ - ${p.kn || p.en}`,
    descEn: (p) => `Free blood & lab testing, diabetes & hypertension clinic, maternal consultation & generic medicine distribution for ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ತಪಾಸಣೆ, ಉಚಿತ ರಕ್ತ ಪರೀಕ್ಷೆ, ಮಧುಮೇಹ ಚಿಕಿತ್ಸೆ ಹಾಗೂ ಮಾತೃ ಆರೋಗ್ಯ ಸಲಹಾ ಕೇಂದ್ರ.`,
    hoursEn: "9:00 AM - 4:30 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 9:00 - ಸಂಜೆ 4:30",
    isEmergency: false
  },
  {
    subId: "vet-4",
    categoryKey: "health",
    catEn: "Health", catKn: "ಆರೋಗ್ಯ",
    titleEn: (p) => `Govt. Veterinary Hospital & Livestock Health Desk - ${p.en}`,
    titleKn: (p) => `ಸರ್ಕಾರಿ ಪಶು ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸಾಲಯ - ${p.kn || p.en}`,
    descEn: (p) => `Cattle vaccination, artificial insemination, KMF dairy farmer incentives & livestock disease prevention for ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ಪಶು ಸಂಗೋಪನೆ, ಉಚಿತ ಲಸಿಕೆ, ಕೃತಕ ಗರ್ಭಧಾರಣೆ ಮತ್ತು ಹಾಲಿನ ಪ್ರೋತ್ಸಾಹಧನ ಸೇವೆ.`,
    hoursEn: "9:00 AM - 4:00 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 9:00 - ಸಂಜೆ 4:00",
    isEmergency: false
  },
  {
    subId: "asha-5",
    categoryKey: "health",
    catEn: "Health", catKn: "ಆರೋಗ್ಯ",
    titleEn: (p) => `ASHA Worker & Mother-Child Health Outreach Unit - ${p.en}`,
    titleKn: (p) => `ಆಶಾ ಕಾರ್ಯಕರ್ತರ ಮತ್ತು ತಾಯಿ-ಮಗು ಆರೋಗ್ಯ ಸೇವಾ ಕೇಂದ್ರ - ${p.kn || p.en}`,
    descEn: (p) => `Pulse polio, maternal nutrition kits, immunisation tracking and 108 emergency ambulance dispatch for ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ಆಶಾ ಸೇವಾ ಕೇಂದ್ರ, ಲಸಿಕಾ ಅಭಿಯಾನ ಮತ್ತು 108 ತುರ್ತು ಆಂಬುಲೆನ್ಸ್ ಮಾರ್ಗದರ್ಶನ.`,
    hoursEn: "8:30 AM - 4:00 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 8:30 - ಸಂಜೆ 4:00",
    isEmergency: true
  },

  // Water (5)
  {
    subId: "water-sub-1",
    categoryKey: "water",
    catEn: "Water", catKn: "ಕುಡಿಯುವ ನೀರು",
    titleEn: (p) => `Grama Panchayat Jal Jeevan Mission Water Substation - ${p.en}`,
    titleKn: (p) => `ಕುಡಿಯುವ ನೀರು ಸರಬರಾಜು ಘಟಕ - ${p.kn || p.en}`,
    descEn: (p) => `Public drinking water distribution, Jal Jeevan Mission tap connections & pipe maintenance for ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ಪಂಚಾಯತ್ ಜಲ ಜೀವನ್ ಮಿಷನ್ ಕುಡಿಯುವ ನೀರಿನ ಪೈಪ್‌ಲೈನ್ ಮತ್ತು ಟ್ಯಾಂಕರ್ ಸೇವೆ.`,
    hoursEn: "6:00 AM - 8:00 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 6:00 - ರಾತ್ರಿ 8:00",
    isEmergency: false
  },
  {
    subId: "rwss-2",
    categoryKey: "water",
    catEn: "Water", catKn: "ಕುಡಿಯುವ ನೀರು",
    titleEn: (p) => `Rural Water Supply & Sanitation (RWSS) Wing - ${p.en}`,
    titleKn: (p) => `ಗ್ರಾಮೀಣ ಕುಡಿಯುವ ನೀರು ಮತ್ತು ನೈರ್ಮಲ್ಯ ವಿಭಾಗ - ${p.kn || p.en}`,
    descEn: (p) => `Water quality laboratory testing, overhead tank chlorination & village drainage sanitation engineering for ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ನೀರಿನ ಗುಣಮಟ್ಟ ಪರೀಕ್ಷೆ, ಟ್ಯಾಂಕ್ ಶುಚಿಗೊಳಿಸುವಿಕೆ ಮತ್ತು ಗ್ರಾಮ ನೈರ್ಮಲ್ಯ ಯೋಜನೆ.`,
    hoursEn: "9:00 AM - 5:00 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 9:00 - ಸಂಜೆ 5:00",
    isEmergency: false
  },
  {
    subId: "ro-plant-3",
    categoryKey: "water",
    catEn: "Water", catKn: "ಕುಡಿಯುವ ನೀರು",
    titleEn: (p) => `Shuddha Kudiyuva Neeru Pure RO Water Unit - ${p.en}`,
    titleKn: (p) => `ಶುದ್ಧ ಕುಡಿಯುವ ನೀರಿನ ಆರ್‌ಒ ಘಟಕ - ${p.kn || p.en}`,
    descEn: (p) => `24/7 coin and smart card operated pure reverse osmosis drinking water dispensing plant for ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} 24 ಗಂಟೆಯು ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಶುದ್ಧ ಆರ್‌ಒ ಕುಡಿಯುವ ನೀರಿನ ಪ್ಲಾಂಟ್.`,
    hoursEn: "24/7 Open",
    hoursKn: "24 ಗಂಟೆ ತೆರೆದಿರುತ್ತದೆ",
    isEmergency: false
  },
  {
    subId: "water-tanker-4",
    categoryKey: "water",
    catEn: "Water", catKn: "ಕುಡಿಯುವ ನೀರು",
    titleEn: (p) => `Emergency Water Tanker & Borewell Repair Cell - ${p.en}`,
    titleKn: (p) => `ತುರ್ತು ನೀರಿನ ಟ್ಯಾಂಕರ್ ಮತ್ತು ಬೋರ್‌ವೆಲ್ ದುರಸ್ತಿ ಕೋಶ - ${p.kn || p.en}`,
    descEn: (p) => `Drought relief drinking water supply helpline, motor pump repair & pipeline leakage breakdown cell.`,
    descKn: (p) => `${p.kn || p.en} ಕುಡಿಯುವ ನೀರಿನ ಟ್ಯಾಂಕರ್ ಸರಬರಾಜು ಮತ್ತು ಪೈಪ್‌ಲೈನ್ ಪಂಪ್ ದುರಸ್ತಿ ಸೇವೆ.`,
    hoursEn: "24/7 Emergency Service",
    hoursKn: "24/7 ತುರ್ತು ಸೇವೆ",
    isEmergency: true
  },
  {
    subId: "watershed-5",
    categoryKey: "water",
    catEn: "Water", catKn: "ಕುಡಿಯುವ ನೀರು",
    titleEn: (p) => `Sujala Watershed & Groundwater Recharge Support Cell - ${p.en}`,
    titleKn: (p) => `ಸುಜಲಾ ಜಲಾನಯನ ಮತ್ತು ಅಂತರ್ಜಲ ಮರುಪೂರಣ ಕೇಂದ್ರ - ${p.kn || p.en}`,
    descEn: (p) => `Rainwater harvesting structures, farm pond desilting, check-dam maintenance & groundwater level monitoring for ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ಮಳೆನೀರು ಕೊಯ್ಲು, ಕೃಷಿ ಹೊಂಡ, ಚೆಕ್ ಡ್ಯಾಂ ನಿರ್ವಹಣೆ ಮತ್ತು ಅಂತರ್ಜಲ ಅಭಿವೃದ್ಧಿ ಕೋಶ.`,
    hoursEn: "9:30 AM - 5:00 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 9:30 - ಸಂಜೆ 5:00",
    isEmergency: false
  },

  // Education (5)
  {
    subId: "ghps-1",
    categoryKey: "education",
    catEn: "Education", catKn: "ಶಿಕ್ಷಣ",
    titleEn: (p) => `Govt. Higher Primary School (GHPS) - ${p.en}`,
    titleKn: (p) => `ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ (GHPS) - ${p.kn || p.en}`,
    descEn: (p) => `Classes 1 to 8, Ksheera Bhagya milk scheme, free uniforms, textbooks & SSP scholarship guidance for ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ಕ್ಷೀರಭಾಗ್ಯ ಯೋಜನೆ, ಉಚಿತ ಪಠ್ಯಪುಸ್ತಕ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನ ಮಾರ್ಗದರ್ಶನ.`,
    hoursEn: "9:30 AM - 4:00 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 9:30 - ಸಂಜೆ 4:00",
    isEmergency: false
  },
  {
    subId: "puc-2",
    categoryKey: "education",
    catEn: "Education", catKn: "ಶಿಕ್ಷಣ",
    titleEn: (p) => `Govt. High School & Junior College Guidance Desk - ${p.en}`,
    titleKn: (p) => `ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ ಮತ್ತು ಪಿಯು ಕಾಲೇಜು ಮಾರ್ಗದರ್ಶನ ಕೇಂದ್ರ - ${p.kn || p.en}`,
    descEn: (p) => `Secondary & PU education (Classes 8-12), State Scholarship Portal (SSP) registration & career counseling.`,
    descKn: (p) => `${p.kn || p.en} ಪ್ರೌಢಶಾಲೆ, ಎಸ್‌ಎಸ್‌ಪಿ ಸ್ಕಾಲರ್‌ಶಿಪ್ ಅರ್ಜಿ ಸಲ್ಲಿಕೆ ಮತ್ತು ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ.`,
    hoursEn: "9:00 AM - 4:30 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 9:00 - ಸಂಜೆ 4:30",
    isEmergency: false
  },
  {
    subId: "anganwadi-3",
    categoryKey: "education",
    catEn: "Education", catKn: "ಶಿಕ್ಷಣ",
    titleEn: (p) => `Anganwadi Centre & Child Growth Monitoring - ${p.en}`,
    titleKn: (p) => `ಅಂಗನವಾಡಿ ಮತ್ತು ಮಕ್ಕಳ ಪೋಷಣಾ ಕೇಂದ್ರ - ${p.kn || p.en}`,
    descEn: (p) => `Poshan Abhiyaan nutritional food distribution, pre-school early education & Matru Vandana scheme for ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ಪೌಷ್ಟಿಕ ಆಹಾರ ವಿತರಣೆ, ಪೂರ್ವ ಪ್ರಾಥಮಿಕ ಶಿಕ್ಷಣ ಮತ್ತು ಮಾತೃ ವಂದನಾ ಯೋಜನೆ.`,
    hoursEn: "9:00 AM - 4:00 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 9:00 - ಸಂಜೆ 4:00",
    isEmergency: false
  },
  {
    subId: "digi-lib-4",
    categoryKey: "education",
    catEn: "Education", catKn: "ಶಿಕ್ಷಣ",
    titleEn: (p) => `Grama Panchayat Digital Library & Computer Centre - ${p.en}`,
    titleKn: (p) => `ಗ್ರಾಮ ಪಂಚಾಯತಿ ಡಿಜಿಟಲ್ ಗ್ರಂಥಾಲಯ - ${p.kn || p.en}`,
    descEn: (p) => `Free Wi-Fi, e-books, competitive examination preparation & digital computer literacy for youth in ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ಉಚಿತ ಡಿಜಿಟಲ್ ಗ್ರಂಥಾಲಯ, ಇ-ಪುಸ್ತಕಗಳು ಮತ್ತು ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆ ತರಬೇತಿ.`,
    hoursEn: "8:00 AM - 8:00 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 8:00 - ರಾತ್ರಿ 8:00",
    isEmergency: false
  },
  {
    subId: "skill-5",
    categoryKey: "education",
    catEn: "Education", catKn: "ಶಿಕ್ಷಣ",
    titleEn: (p) => `Yuva Spandana & Rural Skill Development Desk - ${p.en}`,
    titleKn: (p) => `ಯುವ ಸ್ಪಂದನ ಮತ್ತು ಗ್ರಾಮೀಣ ಕೌಶಲ್ಯ ತರಬೇತಿ ಕೇಂದ್ರ - ${p.kn || p.en}`,
    descEn: (p) => `Kaushalya Karnataka job registrations, vocational craftsmanship coaching & adolescent life-skills training for ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ಕೌಶಲ್ಯ ಕರ್ನಾಟಕ ನೋಂದಣಿ, ವೃತ್ತಿ ತರಬೇತಿ ಹಾಗೂ ಯುವ ಸಬಲೀಕರಣ ಕೇಂದ್ರ.`,
    hoursEn: "9:30 AM - 5:00 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 9:30 - ಸಂಜೆ 5:00",
    isEmergency: false
  },

  // Government (5)
  {
    subId: "grama-one-1",
    categoryKey: "government",
    catEn: "Government", catKn: "ಸರ್ಕಾರಿ ಸೇವೆಗಳು",
    titleEn: (p) => `Grama One / Bapu Seva Kendra - ${p.en}`,
    titleKn: (p) => `ಗ್ರಾಂ ಒನ್ / ಬಾಪು ಸೇವಾ ಕೇಂದ್ರ - ${p.kn || p.en}`,
    descEn: (p) => `Grama One citizen portal, Seva Sindhu certificates, Form 9/11A E-Swathu, RTC Pahani & Gruha Lakshmi scheme for ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ಪಂಚಾಯತ್ ಇ-ಸ್ವತ್ತು ಫಾರ್ಮ್ 9/11A, ಜಾತಿ/ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ, ಪಹಣಿ ಮತ್ತು ಸೇವಾ ಸಿಂಧು ಸೇವೆಗಳು.`,
    hoursEn: "9:00 AM - 6:00 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 9:00 - ಸಂಜೆ 6:00",
    isEmergency: false
  },
  {
    subId: "pdo-office-2",
    categoryKey: "government",
    catEn: "Government", catKn: "ಸರ್ಕಾರಿ ಸೇವೆಗಳು",
    titleEn: (p) => `Office of Panchayat Development Officer (PDO) - ${p.en}`,
    titleKn: (p) => `ಪಂಚಾಯತ್ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ (PDO) ಕಚೇರಿ - ${p.kn || p.en}`,
    descEn: (p) => `Property tax (Form 9/11A), trade licenses, MGNREGA job cards, building construction permits & Gram Sabha.`,
    descKn: (p) => `${p.kn || p.en} ಆಸ್ತಿ ತೆರಿಗೆ ಪಾವತಿ, ವ್ಯಾಪಾರ ಪರವಾನಗಿ, ಉದ್ಯೋಗ ಖಾತ್ರಿ ಕಾರ್ಡ್ ಮತ್ತು ಗ್ರಾಮ ಸಭಾ ಕುಂದುಕೊರತೆಗಳು.`,
    hoursEn: "10:00 AM - 5:30 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 10:00 - ಸಂಜೆ 5:30",
    isEmergency: false
  },
  {
    subId: "nada-kacheri-3",
    categoryKey: "government",
    catEn: "Government", catKn: "ಸರ್ಕಾರಿ ಸೇವೆಗಳು",
    titleEn: (p) => `Nada Kacheri Revenue Inspector Office - ${p.en}`,
    titleKn: (p) => `ನಾಡ ಕಚೇರಿ ಕಂದಾಯ ಕಚೇರಿ - ${p.kn || p.en}`,
    descEn: (p) => `Revenue land records, Caste & Income certificates, Sandhya Suraksha pension, Widow pension & domicile verification.`,
    descKn: (p) => `${p.kn || p.en} ಕಂದಾಯ ದಾಖಲೆಗಳು, ಆಸ್ತಿ ಬದಲಾವಣೆ, ಪಿಂಚಣಿ ಯೋಜನೆಗಳು ಹಾಗೂ ಸ್ಥಳೀಯ ದೃಢೀಕರಣ.`,
    hoursEn: "10:00 AM - 5:30 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 10:00 - ಸಂಜೆ 5:30",
    isEmergency: false
  },
  {
    subId: "escom-4",
    categoryKey: "government",
    catEn: "Government", catKn: "ಸರ್ಕಾರಿ ಸೇವೆಗಳು",
    titleEn: (p) => `Electricity Section Office (ESCOM) - ${p.en}`,
    titleKn: (p) => `ವಿದ್ಯುತ್ ಸರಬರಾಜು ಕಚೇರಿ (ಎಸ್ಕಾಂ) - ${p.kn || p.en}`,
    descEn: (p) => `Gruha Jyothi 200 units free power scheme, new connection processing, transformer repair & power billing.`,
    descKn: (p) => `${p.kn || p.en} ಗೃಹ ಜ್ಯೋತಿ ಉಚಿತ ವಿದ್ಯುತ್ ಯೋಜನೆ, ಹೊಸ ಕನೆಕ್ಷನ್ ಮತ್ತು ವಿದ್ಯುತ್ ದೂರು ಕೇಂದ್ರ.`,
    hoursEn: "24/7 Helpline & Faults",
    hoursKn: "24 ಗಂಟೆ ಸಹಾಯವಾಣಿ ಮತ್ತು ವಿದ್ಯುತ್ ದೂರು",
    isEmergency: true
  },
  {
    subId: "mgnrega-5",
    categoryKey: "government",
    catEn: "Government", catKn: "ಸರ್ಕಾರಿ ಸೇವೆಗಳು",
    titleEn: (p) => `MGNREGA / Kayaka Bandhu Rural Job Scheme - ${p.en}`,
    titleKn: (p) => `ಉದ್ಯೋಗ ಖಾತ್ರಿ ಕೇಂದ್ರ (ನರೇಗಾ) - ${p.kn || p.en}`,
    descEn: (p) => `100 days employment guarantee job cards, pond desilting works, plantation schemes & direct DBT bank wage transfer.`,
    descKn: (p) => `${p.kn || p.en} ಉದ್ಯೋಗ ಖಾತ್ರಿ 100 ದಿನಗಳ ಉದ್ಯೋಗ ಕಾರ್ಡ್, ಕೆರೆ ಹೂಳೆತ್ತುವಿಕೆ ಮತ್ತು ಕೂಲಿ ಜಮಾ ಮಾಹಿತಿ.`,
    hoursEn: "9:30 AM - 5:00 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 9:30 - ಸಂಜೆ 5:00",
    isEmergency: false
  },

  // Agriculture (5)
  {
    subId: "rsk-1",
    categoryKey: "agriculture",
    catEn: "Agriculture", catKn: "ಕೃಷಿ",
    titleEn: (p) => `Raitha Seva Kendra (RSK) - ${p.en}`,
    titleKn: (p) => `ರೈತ ಸೇವಾ ಕೇಂದ್ರ (RSK) - ${p.kn || p.en}`,
    descEn: (p) => `Raitha Samparka Kendra, PM-Kisan FID registration, seed subsidy, crop loss compensation & fertilizer booking.`,
    descKn: (p) => `${p.kn || p.en} ಪಿಎಂ-ಕಿಸಾನ್, ಬೆಳೆ ಪರಿಹಾರ, ರಸಗೊಬ್ಬರ ಸಬ್ಸಿಡಿ ಮತ್ತು ಮಣ್ಣು ಪರೀಕ್ಷೆ ಸೇವೆಗಳು.`,
    hoursEn: "9:00 AM - 5:00 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 9:00 - ಸಂಜೆ 5:00",
    isEmergency: false
  },
  {
    subId: "hopcoms-2",
    categoryKey: "agriculture",
    catEn: "Agriculture", catKn: "ಕೃಷಿ",
    titleEn: (p) => `HOPCOMS Farmer Fruit & Vegetable Procurement Depot - ${p.en}`,
    titleKn: (p) => `ಹಾಪ್‌ಕಾಮ್ಸ್ ತರಕಾರಿ ಹಾಗೂ ಹಣ್ಣುಗಳ ಸಂಗ್ರಹಣಾ ಕೇಂದ್ರ - ${p.kn || p.en}`,
    descEn: (p) => `Direct farm produce buying, fair weight assurance, horticulture crop subsidies & cold chain transport for ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ತೋಟಗಾರಿಕೆ ಬೆಳೆಗಳ ನೇರ ಖರೀದಿ, ನ್ಯಾಯಯುತ ಬೆಲೆ ಹಾಗೂ ಶೀತಲೀಕರಣ ವ್ಯವಸ್ಥೆ.`,
    hoursEn: "7:00 AM - 3:00 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 7:00 - ಮಧ್ಯಾಹ್ನ 3:00",
    isEmergency: false
  },
  {
    subId: "kmf-dairy-3",
    categoryKey: "agriculture",
    catEn: "Agriculture", catKn: "ಕೃಷಿ",
    titleEn: (p) => `KMF Nandini Milk Producers Cooperative Society - ${p.en}`,
    titleKn: (p) => `ಕೆಎಂಎಫ್ ನಂದಿನಿ ಹಾಲಿನ ಉತ್ಪಾದಕರ ಸಹಕಾರ ಸಂಘ - ${p.kn || p.en}`,
    descEn: (p) => `Daily morning & evening dairy milk collection, government milk subsidy disbursement & cattle feed sales.`,
    descKn: (p) => `${p.kn || p.en} ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ ಮತ್ತು ಸಂಜೆ ಹಾಲು ಸಂಗ್ರಹಣೆ, ಸರ್ಕಾರಿ ಪ್ರೋತ್ಸಾಹಧನ ಹಾಗೂ ಜಾನುವಾರು ಆಹಾರ ವಿತರಣೆ.`,
    hoursEn: "6:00 AM - 9:00 AM & 5:00 PM - 7:30 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 6:00 - 9:00 | ಸಂಜೆ 5:00 - 7:30",
    isEmergency: false
  },
  {
    subId: "soil-lab-4",
    categoryKey: "agriculture",
    catEn: "Agriculture", catKn: "ಕೃಷಿ",
    titleEn: (p) => `Soil Health & Agricultural Advisory Extension Centre - ${p.en}`,
    titleKn: (p) => `ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮತ್ತು ಕೃಷಿ ವಿಸ್ತರಣಾ ಕೇಂದ್ರ - ${p.kn || p.en}`,
    descEn: (p) => `Soil nutrient testing, organic farming certification, micro-irrigation subsidy & pest management for ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ಉಚಿತ ಮಣ್ಣು ಪರೀಕ್ಷಾ ಕಾರ್ಡ್, ಸಾವಯವ ಕೃಷಿ ಉತ್ತೇಜನ ಮತ್ತು ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ.`,
    hoursEn: "9:30 AM - 4:30 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 9:30 - ಸಂಜೆ 4:30",
    isEmergency: false
  },
  {
    subId: "custom-hire-5",
    categoryKey: "agriculture",
    catEn: "Agriculture", catKn: "ಕೃಷಿ",
    titleEn: (p) => `Krishi Yantra Dhare Custom Hiring Farm Machinery Centre - ${p.en}`,
    titleKn: (p) => `ಕೃಷಿ ಯಂತ್ರಧಾರೆ ಬಾಡಿಗೆ ಕೇಂದ್ರ - ${p.kn || p.en}`,
    descEn: (p) => `Subsidized rental tractors, paddy transplanters, harvester combine & power tillers for small & marginal farmers in ${p.en}.`,
    descKn: (p) => `${p.kn || p.en} ಬಾಡಿಗೆ ಟ್ರ್ಯಾಕ್ಟರ್, ಭತ್ತ ಕೊಯ್ಲು ಯಂತ್ರ ಹಾಗೂ ಕೃಷಿ ಯಂತ್ರೋಪಕರಣಗಳ ಸೇವಾ ಕೇಂದ್ರ.`,
    hoursEn: "8:00 AM - 6:00 PM",
    hoursKn: "ಬೆಳಿಗ್ಗೆ 8:00 - ಸಂಜೆ 6:00",
    isEmergency: false
  }
];

// ==========================================
// 3. TAMIL NADU TEMPLATES (5 per category = 25 total)
// ==========================================
export const TAMILNADU_TEMPLATES = [
  // Health (5)
  {
    subId: "phc-1",
    categoryKey: "health",
    catEn: "Health", catTa: "சுகாதாரம்",
    titleEn: (p) => `${p.en} Primary Health Centre (PHC) & Makkalai Thedi Maruthuvam`,
    titleTa: (p) => `${p.ta || p.en} அரசு ஆரம்ப சுகாதார நிலையம் (PHC)`,
    descEn: (p) => `Primary family health centre serving ${p.en}. 24/7 OP care, Makkalai Thedi Maruthuvam doorstep screening, CMCHIS insurance & free medicines.`,
    descTa: (p) => `${p.ta || p.en} மக்களைத் தேடி மருத்துவம், 24 மணி நேர அவசர சிகிச்சை, முதலமைச்சரின் விரிவான மருத்துவக் காப்பீடு மற்றும் இலவச மருந்தகம்.`,
    hoursEn: "24/7 OPD & Emergency",
    hoursTa: "24 மணி நேர அவசர சிகிச்சை மற்றும் புறநோயாளிகள் பிரிவு",
    isEmergency: true
  },
  {
    subId: "siddha-2",
    categoryKey: "health",
    catEn: "Health", catTa: "சுகாதாரம்",
    titleEn: (p) => `Govt. Siddha & AYUSH Wellness Dispensary - ${p.en}`,
    titleTa: (p) => `அரசு சித்த மருத்துவமனை மற்றும் நல்வாழ்வு மையம் - ${p.ta || p.en}`,
    descEn: (p) => `Traditional Siddha medicine consultations, Nilavembu Kashayam, Varma therapy guidance & herbal formulations for ${p.en}.`,
    descTa: (p) => `${p.ta || p.en} பாரம்பரிய சித்த மருத்துவம், நிலவேம்பு குடிநீர், வர்ம சிகிச்சை ஆலோசனை மற்றும் மூலிகை மருந்துகள்.`,
    hoursEn: "9:00 AM - 2:00 PM",
    hoursTa: "காலை 9:00 - மதியம் 2:00",
    isEmergency: false
  },
  {
    subId: "hwc-3",
    categoryKey: "health",
    catEn: "Health", catTa: "சுகாதாரம்",
    titleEn: (p) => `Health & Wellness Sub-Centre (HWC) - ${p.en}`,
    titleTa: (p) => `சுகாதார மற்றும் நல்வாழ்வு துணை மையம் - ${p.ta || p.en}`,
    descEn: (p) => `Non-communicable diseases (BP & Diabetes) monitoring, adolescent wellness, maternal health care & basic lab testing for ${p.en}.`,
    descTa: (p) => `${p.ta || p.en} இரத்த அழுத்த-சர்க்கரை நோய் பரிசோதனை, தாய்-சேய் நலம் மற்றும் அடிப்படை ஆய்வக பரிசோதனை.`,
    hoursEn: "9:00 AM - 4:00 PM",
    hoursTa: "காலை 9:00 - மாலை 4:00",
    isEmergency: false
  },
  {
    subId: "vet-4",
    categoryKey: "health",
    catEn: "Health", catTa: "சுகாதாரம்",
    titleEn: (p) => `Govt. Veterinary Dispensary & Livestock Hospital - ${p.en}`,
    titleTa: (p) => `அரசு கால்நடை மருந்தகம் & மருத்துவமனை - ${p.ta || p.en}`,
    descEn: (p) => `Livestock vaccination, artificial insemination, Aavin dairy cattle healthcare & free deworming camps for ${p.en}.`,
    descTa: (p) => `${p.ta || p.en} கால்நடை தடுப்பூசி, செயற்கை முறை கருவூட்டல், ஆவின் பால் பண்ணையாளர் கால்நடை மருத்துவ முகாம்.`,
    hoursEn: "8:30 AM - 3:30 PM",
    hoursTa: "காலை 8:30 - மாலை 3:30",
    isEmergency: false
  },
  {
    subId: "vhn-5",
    categoryKey: "health",
    catEn: "Health", catTa: "சுகாதாரம்",
    titleEn: (p) => `Village Health Nurse (VHN) & Child Nutrition Unit - ${p.en}`,
    titleTa: (p) => `கிராம சுகாதார செவிலியர் (VHN) தாய்-சேய் நல மையம் - ${p.ta || p.en}`,
    descEn: (p) => `Dr. Muthulakshmi Reddy Maternity Scheme financial aid, immunisation drives & 108 emergency ambulance dispatch for ${p.en}.`,
    descTa: (p) => `${p.ta || p.en} டாக்டர் முத்துலட்சுமி ரெட்டி மகப்பேறு உதவித் திட்டம், குழந்தைகள் தடுப்பூசி மற்றும் 108 அவசர ஊர்தி சேவை.`,
    hoursEn: "8:30 AM - 4:30 PM",
    hoursTa: "காலை 8:30 - மாலை 4:30",
    isEmergency: true
  },

  // Water (5)
  {
    subId: "twad-1",
    categoryKey: "water",
    catEn: "Water", catTa: "குடிநீர்",
    titleEn: (p) => `TWAD Board / Panchayat Water Supply Station - ${p.en}`,
    titleTa: (p) => `ஊராட்சி குடிநீர் விநியோக நிலையம் (TWAD) - ${p.ta || p.en}`,
    descEn: (p) => `Piped drinking water distribution, Jal Jeevan Mission household tap connections & main pipeline repair for ${p.en}.`,
    descTa: (p) => `${p.ta || p.en} குடிநீர் விநியோகம், ஜல் ஜீவன் மிஷன் குழாய் இணைப்புகள் மற்றும் பைப்லைன் பராமரிப்பு.`,
    hoursEn: "6:00 AM - 6:00 PM",
    hoursTa: "காலை 6:00 - மாலை 6:00",
    isEmergency: false
  },
  {
    subId: "amma-water-2",
    categoryKey: "water",
    catEn: "Water", catTa: "குடிநீர்",
    titleEn: (p) => `Amma Kudineer / Reverse Osmosis Community RO Plant - ${p.en}`,
    titleTa: (p) => `அம்மா பாதுகாக்கப்பட்ட ஆர்.ஓ குடிநீர் ஆலை - ${p.ta || p.en}`,
    descEn: (p) => `24/7 reverse osmosis mineral drinking water dispensing kiosk for villagers in ${p.en}.`,
    descTa: (p) => `${p.ta || p.en} 24 மணி நேரமும் செயல்படும் சுத்திகரிக்கப்பட்ட ஆர்.ஓ குடிநீர் ஆலை.`,
    hoursEn: "24/7 Open",
    hoursTa: "24 மணி நேரமும் திறந்திருக்கும்",
    isEmergency: false
  },
  {
    subId: "water-lab-3",
    categoryKey: "water",
    catEn: "Water", catTa: "குடிநீர்",
    titleEn: (p) => `Water Quality Testing Lab & Well Chlorination Unit - ${p.en}`,
    titleTa: (p) => `குடிநீர் தர பரிசோதனை & குளோரினேஷன் மையம் - ${p.ta || p.en}`,
    descEn: (p) => `Free water quality testing (fluoride, TDS, microbial), overhead tank bleaching chlorination & potability certification.`,
    descTa: (p) => `${p.ta || p.en} குடிநீர் பரிசோதனை, மேல்நிலை நீர்த்தேக்க தொட்டி குளோரினேஷன் மற்றும் தூய்மைச் சான்றிதழ்.`,
    hoursEn: "9:00 AM - 5:00 PM",
    hoursTa: "காலை 9:00 - மாலை 5:00",
    isEmergency: false
  },
  {
    subId: "tanker-4",
    categoryKey: "water",
    catEn: "Water", catTa: "குடிநீர்",
    titleEn: (p) => `Emergency Drought Relief Water Tanker & Borewell Wing - ${p.en}`,
    titleTa: (p) => `அவசர கால குடிநீர் லாரி விநியோக பிரிவு - ${p.ta || p.en}`,
    descEn: (p) => `Summer drought water lorry relief dispatch, motor pump breakdown replacement & emergency water hotline for ${p.en}.`,
    descTa: (p) => `${p.ta || p.en} கோடை கால குடிநீர் லாரி விநியோகம், ஆழ்துளை கிணறு மோட்டார் பழுது நீக்கும் அவசர உதவி மையம்.`,
    hoursEn: "24/7 Emergency Wing",
    hoursTa: "24 மணி நேர அவசர பிரிவு",
    isEmergency: true
  },
  {
    subId: "oorani-5",
    categoryKey: "water",
    catEn: "Water", catTa: "குடிநீர்",
    titleEn: (p) => `Oorani & Waterbody Rejuvenation Groundwater Recharge Unit - ${p.en}`,
    titleTa: (p) => `ஊரணி மற்றும் ஏரி தூர்வாருதல் நீர் பாதுகாப்பு பிரிவு - ${p.ta || p.en}`,
    descEn: (p) => `Kudimaramathu waterbody desilting, rainwater harvesting trenches & village pond conservation in ${p.en}.`,
    descTa: (p) => `${p.ta || p.en} குடிமராமத்து நீர்நிலை தூர்வாருதல், மழைநீர் சேகரிப்பு மற்றும் நிலத்தடி நீர் மேம்பாட்டு பிரிவு.`,
    hoursEn: "9:00 AM - 5:00 PM",
    hoursTa: "காலை 9:00 - மாலை 5:00",
    isEmergency: false
  },

  // Education (5)
  {
    subId: "ghss-1",
    categoryKey: "education",
    catEn: "Education", catTa: "கல்வி",
    titleEn: (p) => `Govt. Higher Secondary School (GHSS) & Naan Mudhalvan Desk - ${p.en}`,
    titleTa: (p) => `அரசு மேல்நிலைப் பள்ளி (GHSS) - ${p.ta || p.en}`,
    descEn: (p) => `High School & Higher Secondary education (Classes 6-12), Naan Mudhalvan skill training, free laptops & mid-day meal scheme.`,
    descTa: (p) => `${p.ta || p.en} உயர்நிலை மற்றும் மேல்நிலைக் கல்வி, நான் முதல்வன் திட்டம், இலவச மடிக்கணினி மற்றும் சத்துணவு திட்டம்.`,
    hoursEn: "9:00 AM - 4:30 PM",
    hoursTa: "காலை 9:00 - மாலை 4:30",
    isEmergency: false
  },
  {
    subId: "primary-school-2",
    categoryKey: "education",
    catEn: "Education", catTa: "கல்வி",
    titleEn: (p) => `Govt. Primary / Middle School & Ennum Ezhuthum Hub - ${p.en}`,
    titleTa: (p) => `அரசு தொடக்க / நடுநிலைப் பள்ளி - ${p.ta || p.en}`,
    descEn: (p) => `Classes 1 to 8, Ennum Ezhuthum foundational literacy, free textbooks, bags, uniforms & Chief Minister's Breakfast Scheme.`,
    descTa: (p) => `${p.ta || p.en} எண்ணும் எழுத்தும் திட்டம், முதலமைச்சரின் காலை உணவுத் திட்டம், இலவச சீருடை மற்றும் பாடநூல்கள்.`,
    hoursEn: "9:00 AM - 4:00 PM",
    hoursTa: "காலை 9:00 - மாலை 4:00",
    isEmergency: false
  },
  {
    subId: "anganwadi-3",
    categoryKey: "education",
    catEn: "Education", catTa: "கல்வி",
    titleEn: (p) => `ICDS Anganwadi Child Nutrition & Pre-School Centre - ${p.en}`,
    titleTa: (p) => `அங்கன்வாடி குழந்தைகள் சத்துணவு மையம் - ${p.ta || p.en}`,
    descEn: (p) => `Pre-school activity learning, nutritious boiled eggs & hot cooked meals, child growth tracking for ${p.en}.`,
    descTa: (p) => `${p.ta || p.en} முன்பருவ கல்வி, முட்டை மற்றும் ஊட்டச்சத்து உணவு விநியோகம், குழந்தைகள் வளர்ச்சி கண்காணிப்பு.`,
    hoursEn: "9:00 AM - 3:30 PM",
    hoursTa: "காலை 9:00 - மாலை 3:30",
    isEmergency: false
  },
  {
    subId: "library-4",
    categoryKey: "education",
    catEn: "Education", catTa: "கல்வி",
    titleEn: (p) => `Village Public Library & Reading Room - ${p.en}`,
    titleTa: (p) => `கிராம பொது நூலகம் மற்றும் அறிவுசார் மையம் - ${p.ta || p.en}`,
    descEn: (p) => `TNPSC, UPSC & competitive exam preparation books, daily Tamil & English newspapers, e-library & study room for youth.`,
    descTa: (p) => `${p.ta || p.en} டி.என்.பி.எஸ்.சி போட்டித் தேர்வு நூல்கள், நாளிதழ்கள் மற்றும் பொது அறிவு வாசகர் மையம்.`,
    hoursEn: "8:00 AM - 7:00 PM",
    hoursTa: "காலை 8:00 - இரவு 7:00",
    isEmergency: false
  },
  {
    subId: "pudhumai-penn-5",
    categoryKey: "education",
    catEn: "Education", catTa: "கல்வி",
    titleEn: (p) => `Pudhumai Penn & Tamil Pudhalvan Higher Edu Guidance Desk - ${p.en}`,
    titleTa: (p) => `புதுமைப் பெண் & தமிழ் புதல்வன் உயர்கல்வி வழிகாட்டல் மையம் - ${p.ta || p.en}`,
    descEn: (p) => `Moovalur Ramamirtham Pudhumai Penn Rs. 1000/month scholarship facilitation & college admission counseling for ${p.en}.`,
    descTa: (p) => `${p.ta || p.en} புதுமைப் பெண் மற்றும் தமிழ் புதல்வன் திட்ட உதவித்தொகை விண்ணப்பம், கல்லூரி வழிகாட்டல்.`,
    hoursEn: "9:30 AM - 5:00 PM",
    hoursTa: "காலை 9:30 - மாலை 5:00",
    isEmergency: false
  },

  // Government (5)
  {
    subId: "panchayat-1",
    categoryKey: "government",
    catEn: "Government", catTa: "அரசு சேவைகள்",
    titleEn: (p) => `${p.en} Village Panchayat Office & Grama Sabha Secretariate`,
    titleTa: (p) => `${p.ta || p.en} கிராம ஊராட்சி மன்ற அலுவலகம்`,
    descEn: (p) => `Birth/death registrations, house tax, building approvals, water tap applications, street light maintenance & Gram Sabha meetings.`,
    descTa: (p) => `${p.ta || p.en} பிறப்பு/இறப்பு சான்றிதழ், சொத்து வரி, குடிநீர் இணைப்பு, கிராம சபை கூட்டம் மற்றும் மக்கள் குறைதீர்ப்பு.`,
    hoursEn: "10:00 AM - 5:30 PM",
    hoursTa: "காலை 10:00 - மாலை 5:30",
    isEmergency: false
  },
  {
    subId: "e-seva-2",
    categoryKey: "government",
    catEn: "Government", catTa: "அரசு சேவைகள்",
    titleEn: (p) => `Arasu e-Seva Centre / TNeGA Digital Service Desk - ${p.en}`,
    titleTa: (p) => `அரசு இ-சேவை மையம் (TNeGA) - ${p.ta || p.en}`,
    descEn: (p) => `Community, Income, Nativity, First Graduate certificates, Patta/Chitta downloads, Aadhaar services & Kalaignar Magalir Urimai.`,
    descTa: (p) => `${p.ta || p.en} சாதி, வருமானம், இருப்பிட சான்றிதழ்கள், பட்டா சிட்டா நகல், ஆதார் சேவைகள் மற்றும் மகளிர் உரிமைத் தொகை.`,
    hoursEn: "9:00 AM - 6:00 PM",
    hoursTa: "காலை 9:00 - மாலை 6:00",
    isEmergency: false
  },
  {
    subId: "vao-3",
    categoryKey: "government",
    catEn: "Government", catTa: "அரசு சேவைகள்",
    titleEn: (p) => `Village Administrative Officer (VAO) Office - ${p.en}`,
    titleTa: (p) => `கிராம நிர்வாக அலுவலர் (VAO) அலுவலகம் - ${p.ta || p.en}`,
    descEn: (p) => `Land mutation verification, Adangal crop register, Old Age Pension (OAP), legal heir verification & revenue inquiry in ${p.en}.`,
    descTa: (p) => `${p.ta || p.en} அடங்கல், நில அளவீடு, முதியோர் உதவித்தொகை (OAP), வாரிசு சான்றிதழ் மற்றும் வருவாய் ஆவணங்கள்.`,
    hoursEn: "10:00 AM - 5:00 PM",
    hoursTa: "காலை 10:00 - மாலை 5:00",
    isEmergency: false
  },
  {
    subId: "tangedco-4",
    categoryKey: "government",
    catEn: "Government", catTa: "அரசு சேவைகள்",
    titleEn: (p) => `TANGEDCO (EB) Electrical Section Office & Fuse Desk - ${p.en}`,
    titleTa: (p) => `தமிழ்நாடு மின்வாரியம் (TANGEDCO / EB) பிரிவு அலுவலகம் - ${p.ta || p.en}`,
    descEn: (p) => `100 units free power scheme, agricultural free electricity connection, transformer repairs & 24/7 Fuse Off Call desk.`,
    descTa: (p) => `${p.ta || p.en} 100 யூனிட் இலவச மின்சாரம், விவசாய மின் இணைப்பு, மின்தடை புகார் மற்றும் 24 மணி நேர ஃபியூஸ் ஆஃப் கால் பிரிவு.`,
    hoursEn: "24/7 Fuse Call & Service",
    hoursTa: "24 மணி நேர மின்தடை புகார் பிரிவு",
    isEmergency: true
  },
  {
    subId: "mgnrega-5",
    categoryKey: "government",
    catEn: "Government", catTa: "அரசு சேவைகள்",
    titleEn: (p) => `100-Day Work MGNREGA Rural Employment Guarantee Cell - ${p.en}`,
    titleTa: (p) => `100 நாள் வேலை திட்ட அலுவலகம் (MGNREGA) - ${p.ta || p.en}`,
    descEn: (p) => `100-day job cards issuance, muster roll audit, lake desilting works & direct bank account DBT wage credits tracking.`,
    descTa: (p) => `${p.ta || p.en} 100 நாள் வேலை அட்டை, ஏரி-குளம் தூர்வாருதல் பணி மற்றும் வங்கி கணக்கில் ஊதியம் வரவு தகவல்.`,
    hoursEn: "9:30 AM - 5:00 PM",
    hoursTa: "காலை 9:30 - மாலை 5:00",
    isEmergency: false
  },

  // Agriculture (5)
  {
    subId: "agri-ext-1",
    categoryKey: "agriculture",
    catEn: "Agriculture", catTa: "வேளாண்மை",
    titleEn: (p) => `Agriculture Extension Centre & Uzhavar Sevai Maiyam - ${p.en}`,
    titleTa: (p) => `வேளாண்மை விரிவாக்க மையம் & உழவர் சேவை மையம் - ${p.ta || p.en}`,
    descEn: (p) => `Certified subsidized paddy & pulse seeds, bio-fertilizers, PM-KISAN, crop insurance (PMFBY), Uzhavan mobile app guidance.`,
    descTa: (p) => `${p.ta || p.en} மானிய விலை விதைகள், உயிர் உரங்கள், உழவன் செயலி பதிவு, பயிர் காப்பீடு மற்றும் பி.எம்-கிசான்.`,
    hoursEn: "9:00 AM - 5:00 PM",
    hoursTa: "காலை 9:00 - மாலை 5:00",
    isEmergency: false
  },
  {
    subId: "ration-2",
    categoryKey: "agriculture",
    catEn: "Agriculture", catTa: "வேளாண்மை",
    titleEn: (p) => `TN Civil Supplies Fair Price Ration Shop - ${p.en}`,
    titleTa: (p) => `நியாய விலை அங்காடி (ரேஷன் கடை) - ${p.ta || p.en}`,
    descEn: (p) => `Free Universal PDS rice, subsidized sugar, fortified palm oil, toor dal, Pongal gift hamper & Smart Ration Card services.`,
    descTa: (p) => `${p.ta || p.en} இலவச அரிசி, மானிய சர்க்கரை, துவரம்பருப்பு, பாமாயில் மற்றும் பொங்கல் பரிசு தொகுப்பு விநியோகம்.`,
    hoursEn: "8:30 AM - 12:30 PM & 3:30 PM - 6:30 PM",
    hoursTa: "காலை 8:30 - மதியம் 12:30 | பிற்பகல் 3:30 - மாலை 6:30",
    isEmergency: false
  },
  {
    subId: "aavin-3",
    categoryKey: "agriculture",
    catEn: "Agriculture", catTa: "வேளாண்மை",
    titleEn: (p) => `Aavin Primary Milk Producers Cooperative Society - ${p.en}`,
    titleTa: (p) => `ஆவின் பால் உற்பத்தியாளர்கள் கூட்டுறவு சங்கம் - ${p.ta || p.en}`,
    descEn: (p) => `Daily morning & evening dairy milk procurement, fair fat/SNF testing, subsidized cattle feed & dairy farmer incentives.`,
    descTa: (p) => `${p.ta || p.en} பால் கொள்முதல், கொழுப்புச் சத்து பரிசோதனை, மானிய மாட்டுத் தீவனம் மற்றும் பால் ஊக்கத்தொகை.`,
    hoursEn: "6:00 AM - 8:30 AM & 4:30 PM - 6:30 PM",
    hoursTa: "காலை 6:00 - 8:30 | மாலை 4:30 - 6:30",
    isEmergency: false
  },
  {
    subId: "uzhavar-sandhai-4",
    categoryKey: "agriculture",
    catEn: "Agriculture", catTa: "வேளாண்மை",
    titleEn: (p) => `Uzhavar Sandhai Direct Farmer Vegetable Procurement Market - ${p.en}`,
    titleTa: (p) => `உழவர் சந்தை நேரடி காய்கறி கொள்முதல் மையம் - ${p.ta || p.en}`,
    descEn: (p) => `Direct farmer-to-consumer vegetable marketing, zero middleman charges, electronic weighing scale & cold storage transport.`,
    descTa: (p) => `${p.ta || p.en} இடைத்தரகர்கள் இல்லாத நேரடி காய்கறி சந்தை, மின்னணு எடை இயந்திரம் மற்றும் விவசாயி நேரடி வருவாய்.`,
    hoursEn: "6:00 AM - 1:00 PM",
    hoursTa: "காலை 6:00 - மதியம் 1:00",
    isEmergency: false
  },
  {
    subId: "horticulture-5",
    categoryKey: "agriculture",
    catEn: "Agriculture", catTa: "வேளாண்மை",
    titleEn: (p) => `Horticulture Department Nursery & Micro-Irrigation Hub - ${p.en}`,
    titleTa: (p) => `தோட்டக்கலைத் துறை நாற்றுப்பண்ணை & சொட்டுநீர் பாசன மையம் - ${p.ta || p.en}`,
    descEn: (p) => `100% drip irrigation subsidy for small farmers, hybrid fruit & vegetable saplings, polyhouse subsidy & organic inputs.`,
    descTa: (p) => `${p.ta || p.en} 100% சொட்டுநீர் பாசன மானியம், பழக்கன்றுகள், காய்கறி நாற்றுகள் மற்றும் பசுமைக்குடில் திட்டம்.`,
    hoursEn: "9:00 AM - 5:00 PM",
    hoursTa: "காலை 9:00 - மாலை 5:00",
    isEmergency: false
  }
];

// ==========================================
// 4. ANDHRA PRADESH TEMPLATES (5 per category = 25 total)
// ==========================================
export const ANDHRAPRADESH_TEMPLATES = [
  // Health (5)
  {
    subId: "phc-1",
    categoryKey: "health",
    catEn: "Health", catTe: "ఆరోగ్యం",
    titleEn: (p) => `${p.en} Primary Health Centre (PHC) & YSR Health Clinic`,
    titleTe: (p) => `${p.te || p.en} ప్రాథమిక ఆరోగ్య కేంద్రం (PHC)`,
    descEn: (p) => `24/7 casualty & outpatient care, Dr. YSR Aarogyasri health scheme, maternal delivery services & free essential medicines for ${p.en}.`,
    descTe: (p) => `${p.te || p.en} డా. వైఎస్సార్ ఆరోగ్యశ్రీ సేవలు, 24 గంటల ప్రసవ సేవలు, ఉచిత మందులు మరియు వైద్య పరీక్షలు.`,
    hoursEn: "24/7 OPD & Emergency",
    hoursTe: "24 గంటలు అందుబాటులో ఉంటుంది",
    isEmergency: true
  },
  {
    subId: "ayush-2",
    categoryKey: "health",
    catEn: "Health", catTe: "ఆరోగ్యం",
    titleEn: (p) => `Govt. AYUSH & Ayurvedic Wellness Dispensary - ${p.en}`,
    titleTe: (p) => `ప్రభుత్వ ఆయుష్ మరియు ఆయుర్వేద వైద్యశాల - ${p.te || p.en}`,
    descEn: (p) => `Traditional Ayurvedic herbal consultation, joint care remedies, wellness rasayana & lifestyle therapy in ${p.en}.`,
    descTe: (p) => `${p.te || p.en} ఆయుర్వేద చికిత్స, మూలికా ఔషధాలు, వృద్ధుల ఆరోగ్య సంరక్షణ మరియు జీవనశైలి మార్గదర్శనం.`,
    hoursEn: "9:00 AM - 2:00 PM",
    hoursTe: "ఉదయం 9:00 - మధ్యాహ్నం 2:00",
    isEmergency: false
  },
  {
    subId: "tele-clinic-3",
    categoryKey: "health",
    catEn: "Health", catTe: "ఆరోగ్యం",
    titleEn: (p) => `Village Health Clinic & Telemedicine Diagnostic Centre - ${p.en}`,
    titleTe: (p) => `గ్రామ ఆరోగ్య క్లినిక్ మరియు టెలిమెడిసిన్ కేంద్రం - ${p.te || p.en}`,
    descEn: (p) => `Specialist tele-consultation with district hospital doctors, free 14 diagnostic lab tests, BP & sugar monitoring.`,
    descTe: (p) => `${p.te || p.en} టెలిమెడిసిన్ ద్వారా నిపుణుల వైద్య సలహాలు, 14 రకాల ఉచిత రక్త పరీక్షలు மற்றும் బీపీ-షుగర్ నియంత్రణ.`,
    hoursEn: "9:00 AM - 4:30 PM",
    hoursTe: "ఉదయం 9:00 - సాయంత్రం 4:30",
    isEmergency: false
  },
  {
    subId: "vet-4",
    categoryKey: "health",
    catEn: "Health", catTe: "ఆరోగ్యం",
    titleEn: (p) => `Govt. Veterinary Dispensary & Animal Healthcare Centre - ${p.en}`,
    titleTe: (p) => `ప్రభుత్వ పశు వైద్యశాల - ${p.te || p.en}`,
    descEn: (p) => `Cattle vaccination, artificial insemination, Vijaya Dairy farmer veterinary camps & livestock disease protection.`,
    descTe: (p) => `${p.te || p.en} పశువుల వ్యాధి నిరోధక టీకాలు, కృత్రిమ గర్భధారణ, ఉచిత నట్టల నివారణ మందులు.`,
    hoursEn: "8:30 AM - 3:30 PM",
    hoursTe: "ఉదయం 8:30 - సాయంత్రం 3:30",
    isEmergency: false
  },
  {
    subId: "anm-asha-5",
    categoryKey: "health",
    catEn: "Health", catTe: "ఆరోగ్యం",
    titleEn: (p) => `ANM & ASHA Mother-Child Health Outreach Unit - ${p.en}`,
    titleTe: (p) => `ఏఎన్ఎం మరియు ఆశా మాతా శిశు సంరక్షణ కేంద్రం - ${p.te || p.en}`,
    descEn: (p) => `YSR Sampoorna Poshana nutrition kits, pregnant mother tracking, child immunisation & 108/104 emergency ambulance coordination.`,
    descTe: (p) => `${p.te || p.en} వైఎస్సార్ సంపూర్ణ పోషణ కిట్లు, గర్భిణుల సంరక్షణ, పిల్లల టీకాలు మరియు 108 అంబులెన్స్ సేవలు.`,
    hoursEn: "8:30 AM - 4:00 PM",
    hoursTe: "ఉదయం 8:30 - సాయంత్రం 4:00",
    isEmergency: true
  },

  // Water (5)
  {
    subId: "rwss-1",
    categoryKey: "water",
    catEn: "Water", catTe: "మంచినీరు",
    titleEn: (p) => `Rural Water Supply & Sanitation (RWSS) Section - ${p.en}`,
    titleTe: (p) => `గ్రామీణ నీటి సరఫరా విభాగం (RWSS) - ${p.te || p.en}`,
    descEn: (p) => `Public drinking water supply distribution, Jal Jeevan Mission tap connections & main pipe repairs for ${p.en}.`,
    descTe: (p) => `${p.te || p.en} తాగునీటి సరఫరా, జల్ జీవన్ మిషన్ కుళాయి కనెక్షన్లు మరియు పైప్‌లైన్ మరమ్మతులు.`,
    hoursEn: "6:00 AM - 6:00 PM",
    hoursTe: "ఉదయం 6:00 - సాయంత్రం 6:00",
    isEmergency: false
  },
  {
    subId: "ro-plant-2",
    categoryKey: "water",
    catEn: "Water", catTe: "మంచినీరు",
    titleEn: (p) => `Community RO Safe Drinking Water Dispensing Plant - ${p.en}`,
    titleTe: (p) => `సురక్షిత ఆర్.ఓ త్రాగునీటి శుద్ధి ప్లాంట్ - ${p.te || p.en}`,
    descEn: (p) => `24/7 coin and smart card operated pure reverse osmosis mineral drinking water dispensing plant for ${p.en}.`,
    descTe: (p) => `${p.te || p.en} 24 గంటలు అందుబాటులో ఉండే స్వచ్ఛమైన ఆర్.ఓ మినరల్ వాటర్ ప్లాంట్.`,
    hoursEn: "24/7 Open",
    hoursTe: "24 గంటలు తెరిచి ఉంటుంది",
    isEmergency: false
  },
  {
    subId: "water-lab-3",
    categoryKey: "water",
    catEn: "Water", catTe: "మంచినీరు",
    titleEn: (p) => `Panchayat Water Quality Testing & Well Chlorination Cell - ${p.en}`,
    titleTe: (p) => `త్రాగునీటి నాణ్యతా పరీక్ష మరియు క్లోరినేషన్ కేంద్రం - ${p.te || p.en}`,
    descEn: (p) => `Drinking water fluoride & bacterial contamination testing, overhead tank sanitation & chlorination for ${p.en}.`,
    descTe: (p) => `${p.te || p.en} ఫ్లోరైడ్ మరియు బ్యాక్టీరియా పరీక్షలు, ఓవర్‌హెడ్ ట్యాంక్ క్లోరినేషన్ మరియు స్వచ్ఛతా సర్టిఫికేట్.`,
    hoursEn: "9:00 AM - 5:00 PM",
    hoursTe: "ఉదయం 9:00 - సాయంత్రం 5:00",
    isEmergency: false
  },
  {
    subId: "tanker-4",
    categoryKey: "water",
    catEn: "Water", catTe: "మంచినీరు",
    titleEn: (p) => `Emergency Drought Relief Water Tanker Desk - ${p.en}`,
    titleTe: (p) => `అత్యవసర త్రాగునీటి ట్యాంకర్ సేవా విభాగం - ${p.te || p.en}`,
    descEn: (p) => `Summer drought drinking water tanker delivery, borewell motor repair squad & emergency drinking water hotline.`,
    descTe: (p) => `${p.te || p.en} ఎండకాలం అత్యవసర వాటర్ ట్యాంకర్ సరఫరా మరియు బోరు మోటార్ల మరమ్మతు హెల్ప్‌లైన్.`,
    hoursEn: "24/7 Emergency Wing",
    hoursTe: "24 గంటల అత్యవసర సేవ",
    isEmergency: true
  },
  {
    subId: "neeru-chettu-5",
    categoryKey: "water",
    catEn: "Water", catTe: "మంచినీరు",
    titleEn: (p) => `Neeru-Chettu Groundwater Recharge & Pond Rejuvenation Unit - ${p.en}`,
    titleTe: (p) => `నీరు-చెట్టు భూగర్భ జలాల పునరుజ్జీవన కేంద్రం - ${p.te || p.en}`,
    descEn: (p) => `Check-dam desilting, farm pond rainwater harvesting trenches & village waterbody conservation in ${p.en}.`,
    descTe: (p) => `${p.te || p.en} చెక్ డ్యాంల పూడికతీత, ఇంకుడు గుంతలు మరియు గ్రామ చెరువుల సంరక్షణ విభాగం.`,
    hoursEn: "9:00 AM - 5:00 PM",
    hoursTe: "ఉదయం 9:00 - సాయంత్రం 5:00",
    isEmergency: false
  },

  // Education (5)
  {
    subId: "zphs-1",
    categoryKey: "education",
    catEn: "Education", catTe: "విద్య",
    titleEn: (p) => `Zilla Parishad High School (ZPHS) & Mana Badi Nadu-Nedu Desk - ${p.en}`,
    titleTe: (p) => `జిల్లా పరిషత్ ఉన్నత పాఠశాల (ZPHS) - ${p.te || p.en}`,
    descEn: (p) => `Classes 6 to 10 English medium, interactive flat panels, Jagananna Gorumudda mid-day meal & digital education.`,
    descTe: (p) => `${p.te || p.en} ఇంగ్లీష్ మీడియం బోధన, డిజిటల్ తరగతి గదులు, జగనన్న గోరుముద్ద మధ్యాహ్న భోజన పథకం.`,
    hoursEn: "9:00 AM - 4:30 PM",
    hoursTe: "ఉదయం 9:00 - సాయంత్రం 4:30",
    isEmergency: false
  },
  {
    subId: "mpps-2",
    categoryKey: "education",
    catEn: "Education", catTe: "విద్య",
    titleEn: (p) => `Mandal Parishad Primary School (MPPS) & Vidya Kanuka - ${p.en}`,
    titleTe: (p) => `మండల పరిషత్ ప్రాథమిక పాఠశాల (MPPS) - ${p.te || p.en}`,
    descEn: (p) => `Classes 1 to 5, foundational bilingual learning, Jagananna Vidya Kanuka kits (school bag, books, uniforms & shoes).`,
    descTe: (p) => `${p.te || p.en} ప్రాథమిక విద్య, జగనన్న విద్యా కానుక కిట్లు (యూనిఫాం, పుస్తకాలు, బ్యాగు, బూట్లు).`,
    hoursEn: "9:00 AM - 4:00 PM",
    hoursTe: "ఉదయం 9:00 - సాయంత్రం 4:00",
    isEmergency: false
  },
  {
    subId: "anganwadi-3",
    categoryKey: "education",
    catEn: "Education", catTe: "విద్య",
    titleEn: (p) => `YSR Sampoorna Poshana Anganwadi Centre - ${p.en}`,
    titleTe: (p) => `వైఎస్సార్ సంపూర్ణ పోషణ అంగన్‌వాడీ కేంద్రం - ${p.te || p.en}`,
    descEn: (p) => `Early childhood education, daily eggs, milk, fortified nutritional meals for toddlers & pregnant mothers in ${p.en}.`,
    descTe: (p) => `${p.te || p.en} పూర్వ ప్రాథమిక విద్య, పౌష్టికాహారం, పాలు, గుడ్ల పంపిణీ మరియు పిల్లల బరువు నమోదు.`,
    hoursEn: "9:00 AM - 3:30 PM",
    hoursTe: "ఉదయం 9:00 - సాయంత్రం 3:30",
    isEmergency: false
  },
  {
    subId: "library-4",
    categoryKey: "education",
    catEn: "Education", catTe: "విద్య",
    titleEn: (p) => `Grama Panchayat Public Library & Career Study Hall - ${p.en}`,
    titleTe: (p) => `గ్రామ పంచాయతీ గ్రంథాలయం & స్టడీ సెంటర్ - ${p.te || p.en}`,
    descEn: (p) => `APPSC, Police, DSC & competitive examination preparation books, Telugu/English dailies & free study room.`,
    descTe: (p) => `${p.te || p.en} పోటీ పరీక్షల పుస్తకాలు, దినపత్రికలు, ఉచిత స్టడీ రూమ్ మరియు ఇంటర్నెట్ వసతి.`,
    hoursEn: "8:00 AM - 7:00 PM",
    hoursTe: "ఉదయం 8:00 - రాత్రి 7:00",
    isEmergency: false
  },
  {
    subId: "vidya-deevena-5",
    categoryKey: "education",
    catEn: "Education", catTe: "విద్య",
    titleEn: (p) => `Jagananna Vidya Deevena & Higher Education Desk - ${p.en}`,
    titleTe: (p) => `జగనన్న విద్యా దీవెన & ఉన్నత విద్యా సలహా కేంద్రం - ${p.te || p.en}`,
    descEn: (p) => `100% full fee reimbursement assistance, Vasathi Deevena accommodation support & college admissions guidance in ${p.en}.`,
    descTe: (p) => `${p.te || p.en} పూర్తి ఫీజు రీయింబర్స్‌మెంట్, వసతి దీవెన దరఖాస్తు సహాయం మరియు ఉన్నత విద్యా మార్గదర్శనం.`,
    hoursEn: "9:30 AM - 5:00 PM",
    hoursTe: "ఉదయం 9:30 - సాయంత్రం 5:00",
    isEmergency: false
  },

  // Government (5)
  {
    subId: "sachivalayam-1",
    categoryKey: "government",
    catEn: "Government", catTe: "ప్రభుత్వ సేవలు",
    titleEn: (p) => `${p.en} Grama Sachivalayam (Village Secretariat)`,
    titleTe: (p) => `${p.te || p.en} గ్రామ సచివాలయం`,
    descEn: (p) => `One-stop delivery of 500+ government services, birth/death/caste/income certificates, Navaratnalu schemes & grievance desk.`,
    descTe: (p) => `${p.te || p.en} నవరత్నాలు పథకాలు, కుల, ఆదాయ, జనన ధృవీకరణ పత్రాలు మరియు ప్రజా సమస్యల పరిష్కార వేదిక.`,
    hoursEn: "10:00 AM - 5:30 PM",
    hoursTe: "ఉదయం 10:00 - సాయంత్రం 5:30",
    isEmergency: false
  },
  {
    subId: "vro-2",
    categoryKey: "government",
    catEn: "Government", catTe: "ప్రభుత్వ సేవలు",
    titleEn: (p) => `Village Revenue Officer (VRO) Land Records Desk - ${p.en}`,
    titleTe: (p) => `గ్రామ రెవెన్యూ అధికారి (VRO) కార్యాలయం - ${p.te || p.en}`,
    descEn: (p) => `Meebhoomi 1B/Adangal copies, land mutation verification, Pattadar Passbook services & revenue dispute inquiries.`,
    descTe: (p) => `${p.te || p.en} మీభూమి అడంగల్, 1B రికార్డులు, పట్టాదారు పాసుపుస్తకాలు, భూమి మ్యుటేషన్ మరియు సర్వే సేవలు.`,
    hoursEn: "10:00 AM - 5:00 PM",
    hoursTe: "ఉదయం 10:00 - సాయంత్రం 5:00",
    isEmergency: false
  },
  {
    subId: "discom-3",
    categoryKey: "government",
    catEn: "Government", catTe: "ప్రభుత్వ సేవలు",
    titleEn: (p) => `Electricity Section Office (DISCOM) & 24/7 Power Desk - ${p.en}`,
    titleTe: (p) => `విద్యుత్ సరఫరా సెక్షన్ కార్యాలయం (డిస్కం) - ${p.te || p.en}`,
    descEn: (p) => `9 hours free daytime agricultural power, new domestic electrical connections & 24/7 Fuse Off Call desk.`,
    descTe: (p) => `${p.te || p.en} వ్యవసాయానికి 9 గంటల ఉచిత విద్యుత్, కొత్త కనెక్షన్లు మరియు 24 గంటల విద్యుత్ సమస్యల హెల్ప్‌లైన్.`,
    hoursEn: "24/7 Fuse Call & Service",
    hoursTe: "24 గంటల విద్యుత్ హెల్ప్‌లైన్",
    isEmergency: true
  },
  {
    subId: "pension-4",
    categoryKey: "government",
    catEn: "Government", catTe: "ప్రభుత్వ సేవలు",
    titleEn: (p) => `YSR Pension Kanuka Citizen Welfare Desk - ${p.en}`,
    titleTe: (p) => `వైఎస్సార్ పెన్షన్ కానుక పంపిణీ కేంద్రం - ${p.te || p.en}`,
    descEn: (p) => `Doorstep monthly pension disbursement (Old Age, Widow, Divyang), pension verification & welfare grievance desk in ${p.en}.`,
    descTe: (p) => `${p.te || p.en} ఒకటవ తేదీనే ఇంటి వద్దకే వృద్ధాప్య, వితంతు, దివ్యాంగుల పింఛన్ పంపిణీ మరియు సంక్షేమ సేవలు.`,
    hoursEn: "9:00 AM - 5:00 PM",
    hoursTe: "ఉదయం 9:00 - సాయంత్రం 5:00",
    isEmergency: false
  },
  {
    subId: "mgnrega-5",
    categoryKey: "government",
    catEn: "Government", catTe: "ప్రభుత్వ సేవలు",
    titleEn: (p) => `MGNREGA Rural Employment Guarantee Scheme Desk - ${p.en}`,
    titleTe: (p) => `ఉపాధి హామీ పథకం కార్యాలయం (MGNREGA) - ${p.te || p.en}`,
    descEn: (p) => `100 days job cards issuance, canal desilting works, farm ponds excavation & direct bank DBT wage transfer tracking.`,
    descTe: (p) => `${p.te || p.en} ఉపాధి హామీ జాబ్ కార్డులు, చెరువుల పూడికతీత, ఫారమ్ పాండ్స్ మరియు వేతన సమాచారం.`,
    hoursEn: "9:30 AM - 5:00 PM",
    hoursTe: "ఉదయం 9:30 - సాయంత్రం 5:00",
    isEmergency: false
  },

  // Agriculture (5)
  {
    subId: "rbk-1",
    categoryKey: "agriculture",
    catEn: "Agriculture", catTe: "వ్యవసాయం",
    titleEn: (p) => `Rythu Bharosa Kendra (RBK) - ${p.en}`,
    titleTe: (p) => `రైతు భరోసా కేంద్రం (RBK) - ${p.te || p.en}`,
    descEn: (p) => `Certified subsidized seeds, fertilizers, Dr. YSR Rythu Bharosa financial aid, e-Crop booking & soil health cards.`,
    descTe: (p) => `${p.te || p.en} నాణ్యమైన విత్తనాలు, ఎరువులు, ఈ-క్రాప్ బుకింగ్, మట్టి పరీక్షలు మరియు రైతు భరోసా సాయం.`,
    hoursEn: "9:00 AM - 5:00 PM",
    hoursTe: "ఉదయం 9:00 - సాయంత్రం 5:00",
    isEmergency: false
  },
  {
    subId: "ration-2",
    categoryKey: "agriculture",
    catEn: "Agriculture", catTe: "వ్యవసాయం",
    titleEn: (p) => `PDS Fair Price Doorstep Mobile Dispensing Depot - ${p.en}`,
    titleTe: (p) => `ప్రజా పంపిణీ వ్యవస్థ (రేషన్ పంపిణీ వాహనం & దుకాణం) - ${p.te || p.en}`,
    descEn: (p) => `Free quality sortex rice, red gram, sugar doorstep delivery via Mobile Dispensing Units (MDU) & biometric e-PoS.`,
    descTe: (p) => `${p.te || p.en} నాణ్యమైన బియ్యం, కందిపప్పు, చక్కెర ఇంటి వద్దకే మొబైల్ రేషన్ వాహనం ద్వారా పంపిణీ.`,
    hoursEn: "8:00 AM - 1:00 PM & 3:00 PM - 6:30 PM",
    hoursTe: "ఉదయం 8:00 - మధ్యాహ్నం 1:00 | మధ్యాహ్నం 3:00 - సాయంత్రం 6:30",
    isEmergency: false
  },
  {
    subId: "dairy-3",
    categoryKey: "agriculture",
    catEn: "Agriculture", catTe: "వ్యవసాయం",
    titleEn: (p) => `APDDCF / Vijaya Dairy Milk Procurement Centre - ${p.en}`,
    titleTe: (p) => `విజయ డైరీ పాల సేకరణ కేంద్రం - ${p.te || p.en}`,
    descEn: (p) => `Daily morning & evening dairy milk procurement, computerized fat testing, dairy animal feed & bonus incentives.`,
    descTe: (p) => `${p.te || p.en} ఉదయం, సాయంత్రం పాల సేకరణ, పారదర్శక వెన్న శాతం పరీక్ష మరియు పాడి రైతులకు ప్రోత్సాహకాలు.`,
    hoursEn: "6:00 AM - 8:30 AM & 5:00 PM - 7:00 PM",
    hoursTe: "ఉదయం 6:00 - 8:30 | సాయంత్రం 5:00 - 7:00",
    isEmergency: false
  },
  {
    subId: "amul-rbk-4",
    categoryKey: "agriculture",
    catEn: "Agriculture", catTe: "వ్యవసాయం",
    titleEn: (p) => `Rythu Bharosa Commodity & Produce Collection Hub - ${p.en}`,
    titleTe: (p) => `రైతు భరోసా వ్యవసాయ ఉత్పత్తుల సేకరణ కేంద్రం - ${p.te || p.en}`,
    descEn: (p) => `Direct MSP farm produce procurement (Paddy, Maize, Groundnut), electronic weighing & minimum support price guarantees.`,
    descTe: (p) => `${p.te || p.en} మద్దతు ధరకు ధాన్యం, మొక్కజొన్న సేకరణ, ఎలక్ట్రానిక్ కాటా మరియు ఖాతాలో నేరుగా నగదు జమ.`,
    hoursEn: "7:30 AM - 3:30 PM",
    hoursTe: "ఉదయం 7:30 - మధ్యాహ్నం 3:30",
    isEmergency: false
  },
  {
    subId: "yantra-seva-5",
    categoryKey: "agriculture",
    catEn: "Agriculture", catTe: "వ్యవసాయం",
    titleEn: (p) => `YSR Yantra Seva Custom Hiring Centre - ${p.en}`,
    titleTe: (p) => `వైఎస్సార్ యంత్ర సేవా కేంద్రం - ${p.te || p.en}`,
    descEn: (p) => `Subsidized rental tractors, combine harvesters, drone spraying units & modern farm mechanization equipment for ${p.en}.`,
    descTe: (p) => `${p.te || p.en} అద్దె ప్రాతిపదికన ట్రాక్టర్లు, వరి కోత యంత్రాలు, డ్రోన్ స్ప్రేయింగ్ మరియు ఆధునిక వ్యవసాయ పరికరాలు.`,
    hoursEn: "8:00 AM - 6:00 PM",
    hoursTe: "ఉదయం 8:00 - సాయంత్రం 6:00",
    isEmergency: false
  }
];

/**
 * Generates the 25 services (5 in each category) for a given Panchayat.
 */
export function buildPanchayatServices(stateKey, distObj, pncObj, pncIdx) {
  const pncEn = typeof pncObj === "string" ? pncObj : (pncObj.en || pncObj.name);
  const pncMl = typeof pncObj === "object" && pncObj.ml ? pncObj.ml : pncEn;
  const pncKn = typeof pncObj === "object" && pncObj.kn ? pncObj.kn : pncEn;
  const pncTa = typeof pncObj === "object" && pncObj.ta ? pncObj.ta : pncEn;
  const pncTe = typeof pncObj === "object" && pncObj.te ? pncObj.te : pncEn;
  const pncCode = typeof pncObj === "object" && pncObj.code ? pncObj.code : (pncEn.toLowerCase().replace(/[^a-z0-9]/g, "-"));

  const distEn = typeof distObj === "string" ? distObj : (distObj.en || distObj.name);
  const distMl = typeof distObj === "object" && distObj.ml ? distObj.ml : distEn;
  const distKn = typeof distObj === "object" && distObj.kn ? distObj.kn : distEn;
  const distTa = typeof distObj === "object" && distObj.ta ? distObj.ta : distEn;
  const distTe = typeof distObj === "object" && distObj.te ? distObj.te : distEn;

  const normalizedState = (stateKey || "kerala").toLowerCase();
  let templates = KERALA_TEMPLATES;
  let idPrefix = "ke";
  let stateNameEn = "Kerala";

  if (normalizedState.includes("karn")) {
    templates = KARNATAKA_TEMPLATES;
    idPrefix = "kar";
    stateNameEn = "Karnataka";
  } else if (normalizedState.includes("tamil") || normalizedState === "tn") {
    templates = TAMILNADU_TEMPLATES;
    idPrefix = "tn";
    stateNameEn = "Tamil Nadu";
  } else if (normalizedState.includes("andhra") || normalizedState === "ap") {
    templates = ANDHRAPRADESH_TEMPLATES;
    idPrefix = "ap";
    stateNameEn = "Andhra Pradesh";
  }

  const pncContext = {
    en: pncEn,
    ml: pncMl,
    kn: pncKn,
    ta: pncTa,
    te: pncTe,
    code: pncCode,
    district: distEn
  };

  return templates.map((tmpl, tmplIdx) => {
    const contactObj = REPRESENTATIVE_NAMES[(pncIdx + tmplIdx) % REPRESENTATIVE_NAMES.length];
    const phoneDigitA = (pncIdx * 7 + tmplIdx * 3) % 10;
    const phoneDigitRest = Math.floor((pncIdx * 1973 + tmplIdx * 883) % 90000 + 10000);
    
    let phoneNumber = `+91 9447${phoneDigitA} ${phoneDigitRest}`;
    if (idPrefix === "kar") phoneNumber = `+91 9480${phoneDigitA} ${phoneDigitRest}`;
    if (idPrefix === "tn") phoneNumber = `+91 9443${phoneDigitA} ${phoneDigitRest}`;
    if (idPrefix === "ap") phoneNumber = `+91 9440${phoneDigitA} ${phoneDigitRest}`;

    const logDay = 1 + ((pncIdx + tmplIdx) % 28);
    const lastVerified = `2026-06-${logDay.toString().padStart(2, "0")}`;

    const titleEn = tmpl.titleEn(pncContext);
    const descEn = tmpl.descEn(pncContext);
    const hoursEn = tmpl.hoursEn;

    const titleNative = tmpl.titleMl ? tmpl.titleMl(pncContext) :
      tmpl.titleKn ? tmpl.titleKn(pncContext) :
      tmpl.titleTa ? tmpl.titleTa(pncContext) :
      tmpl.titleTe ? tmpl.titleTe(pncContext) : titleEn;

    const descNative = tmpl.descMl ? tmpl.descMl(pncContext) :
      tmpl.descKn ? tmpl.descKn(pncContext) :
      tmpl.descTa ? tmpl.descTa(pncContext) :
      tmpl.descTe ? tmpl.descTe(pncContext) : descEn;

    const hoursNative = tmpl.hoursMl || tmpl.hoursKn || tmpl.hoursTa || tmpl.hoursTe || hoursEn;

    return {
      id: `${idPrefix}-pnc-${pncCode}-${tmpl.subId}`,
      categoryKey: tmpl.categoryKey,
      phoneNumber,
      lastVerified,
      isEmergency: tmpl.isEmergency,
      districtName: distEn,
      panchayatName: pncEn,
      localityName: pncEn,
      translations: {
        en: {
          title: titleEn,
          description: descEn,
          category: tmpl.catEn,
          location: `${pncEn}, ${distEn} District, ${stateNameEn}`,
          hours: hoursEn,
          contactName: contactObj.en
        },
        ml: {
          title: tmpl.titleMl ? tmpl.titleMl(pncContext) : titleEn,
          description: tmpl.descMl ? tmpl.descMl(pncContext) : descEn,
          category: tmpl.catMl || tmpl.catEn,
          location: `${pncMl}, ${distMl} ജില്ല, കേരളം`,
          hours: tmpl.hoursMl || hoursEn,
          contactName: contactObj.ml
        },
        kn: {
          title: tmpl.titleKn ? tmpl.titleKn(pncContext) : titleEn,
          description: tmpl.descKn ? tmpl.descKn(pncContext) : descEn,
          category: tmpl.catKn || tmpl.catEn,
          location: `${pncKn}, ${distKn} ಜಿಲ್ಲೆ, ಕರ್ನಾಟಕ`,
          hours: tmpl.hoursKn || hoursEn,
          contactName: contactObj.kn
        },
        ta: {
          title: tmpl.titleTa ? tmpl.titleTa(pncContext) : titleEn,
          description: tmpl.descTa ? tmpl.descTa(pncContext) : descEn,
          category: tmpl.catTa || tmpl.catEn,
          location: `${pncTa}, ${distTa} மாவட்டம், தமிழ்நாடு`,
          hours: tmpl.hoursTa || hoursEn,
          contactName: contactObj.ta
        },
        te: {
          title: tmpl.titleTe ? tmpl.titleTe(pncContext) : titleEn,
          description: tmpl.descTe ? tmpl.descTe(pncContext) : descEn,
          category: tmpl.catTe || tmpl.catEn,
          location: `${pncTe}, ${distTe} జిల్లా, ఆంధ్రప్రదేశ్`,
          hours: tmpl.hoursTe || hoursEn,
          contactName: contactObj.te
        },
        hi: {
          title: titleEn,
          description: descEn,
          category: tmpl.catEn,
          location: `${pncEn}, ${distEn}, ${stateNameEn}`,
          hours: hoursEn,
          contactName: contactObj.hi
        }
      }
    };
  });
}
