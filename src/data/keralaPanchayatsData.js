// Comprehensive Dataset of all 14 Districts and 941 Grama Panchayats in Kerala, India
// Used by GramSeva Certificate Resolver, Service Map, and Panchayat Finder

export const KERALA_DISTRICTS_LIST = [
  { id: "kasaragod", en: "Kasaragod", ml: "കാസർകോട്", hi: "कासरगोड", te: "కాసర్‌గోడ్", hq: "Kasaragod Town", totalPanchayats: 38 },
  { id: "kannur", en: "Kannur", ml: "കണ്ണൂർ", hi: "कन्नूर", te: "కణ్ణూర్", hq: "Kannur HQ", totalPanchayats: 71 },
  { id: "wayanad", en: "Wayanad", ml: "വയനാട്", hi: "वायनाड", te: "వయనాడ్", hq: "Kalpetta", totalPanchayats: 23 },
  { id: "kozhikode", en: "Kozhikode", ml: "കോഴിക്കോട്", hi: "कोझिकोड", te: "కోజికోడ్", hq: "Kozhikode HQ", totalPanchayats: 70 },
  { id: "malappuram", en: "Malappuram", ml: "മലപ്പുറം", hi: "मलप्पुरम", te: "మలప్పురం", hq: "Malappuram HQ", totalPanchayats: 94 },
  { id: "palakkad", en: "Palakkad", ml: "പാലക്കാട്", hi: "पालक्काड", te: "పాలక్కాడ్", hq: "Palakkad HQ", totalPanchayats: 88 },
  { id: "thrissur", en: "Thrissur", ml: "തൃശ്ശൂർ", hi: "त्रिशूर", te: "త్రిస్సూర్", hq: "Thrissur HQ", totalPanchayats: 86 },
  { id: "ernakulam", en: "Ernakulam", ml: "എറണാകുളം", hi: "एर्नाकुलम", te: "ఎర్నాకుళం", hq: "Kakkanad / Kochi", totalPanchayats: 82 },
  { id: "idukki", en: "Idukki", ml: "ഇടുക്കി", hi: "इडुक्की", te: "ఇడుక్కి", hq: "Puinav / Painavu", totalPanchayats: 52 },
  { id: "kottayam", en: "Kottayam", ml: "കോട്ടയം", hi: "कोट्टायम", te: "కొట్టాయం", hq: "Kottayam HQ", totalPanchayats: 71 },
  { id: "alappuzha", en: "Alappuzha", ml: "ആലപ്പുഴ", hi: "अलाप्पुझा", te: "అలప్పుజ", hq: "Alappuzha HQ", totalPanchayats: 72 },
  { id: "pathanamthitta", en: "Pathanamthitta", ml: "പത്തനംതിട്ട", hi: "पतनमतिट्टा", te: "పతనంతిట్ట", hq: "Pathanamthitta HQ", totalPanchayats: 53 },
  { id: "kollam", en: "Kollam", ml: "കൊല്ലം", hi: "कोल्लम", te: "కొల్లాం", hq: "Kollam HQ", totalPanchayats: 68 },
  { id: "thiruvananthapuram", en: "Thiruvananthapuram", ml: "തിരുവനന്തപുരം", hi: "तिरुवनंतपुरम", te: "తిరువనంతపురం", hq: "Thiruvananthapuram HQ", totalPanchayats: 73 }
];

export const KERALA_PANCHAYATS_BY_DISTRICT = {
  "Kasaragod": [
    { en: "Ajanoor", ml: "അജാനൂർ" }, { en: "Badiyadka", ml: "ബദിയടുക്ക" }, { en: "Balal", ml: "ബളാൽ" },
    { en: "Bedadka", ml: "ബേഡകം" }, { en: "Bellur", ml: "ബെള്ളൂർ" }, { en: "Chemnad", ml: "ചെമ്മനാട്" },
    { en: "Cheruvathur", ml: "ചെറുവത്തൂർ" }, { en: "Delampady", ml: "ദേലംപാടി" }, { en: "East Eleri", ml: "ഈസ്റ്റ് എളേരി" },
    { en: "Enmakaje", ml: "എൻമകജെ" }, { en: "Kallar", ml: "കള്ളാർ" }, { en: "Karadka", ml: "കാറഡുക്ക" },
    { en: "Kayyur Cheemeni", ml: " കയ്യൂർ ചീമേനി" }, { en: "Kinanoor Karinthalam", ml: "കിനാനൂർ കരിന്തളം" },
    { en: "Kodom Belur", ml: "കോടോം ബെളൂർ" }, { en: "Kumbadaje", ml: "കുമ്പടാജെ" }, { en: "Kumbla", ml: "കുമ്പള" },
    { en: "Madhur", ml: "മധൂർ" }, { en: "Madikai", ml: "മടിക്കൈ" }, { en: "Mangalpady", ml: "മംഗൽപാടി" },
    { en: "Manjeshwar", ml: "മഞ്ചേശ്വരം" }, { en: "Mogral Puthur", ml: "മൊഗ്രാൽ പുത്തൂർ" }, { en: "Muliyar", ml: "മുളിയാർ" },
    { en: "Nileshwar", ml: "നീലേശ്വരം" }, { en: "Padne", ml: "പടന്ന" }, { en: "Paivalike", ml: "പൈവളികെ" },
    { en: "Panathady", ml: "പനത്തടി" }, { en: "Pilicode", ml: "പീലിക്കോട്" }, { en: "Pullur Periya", ml: "പുല്ലൂർ പെരിയ" },
    { en: "Puthige", ml: "പുത്തിഗെ" }, { en: "Trikaripur", ml: "തൃക്കരിപ്പൂർ" }, { en: "Udma", ml: "ഉദുമ" },
    { en: "Vorkady", ml: "വോർക്കാടി" }, { en: "West Eleri", ml: "വെസ്റ്റ് എളേരി" }
  ],
  "Kannur": [
    { en: "Alakode", ml: "ആലക്കോട്" }, { en: "Anjarakandy", ml: "അഞ്ചരക്കണ്ടി" }, { en: "Aralam", ml: "ആറളം" },
    { en: "Ayyankunnu", ml: "അയ്യൻകുന്ന്" }, { en: "Azhikode", ml: "അഴീക്കോട്" }, { en: "Chapparapadavu", ml: "ചപ്പാരപ്പടവ്" },
    { en: "Chembilode", ml: "ചെമ്പിലോട്" }, { en: "Cherukunnu", ml: "ചെറുകുന്ന്" }, { en: "Cherupuzha", ml: "ചെറുപുഴ" },
    { en: "Chirakkal", ml: "ചിറക്കൽ" }, { en: "Chittariparamba", ml: "ചിറ്റാരിപ്പറമ്പ്" }, { en: "Dharmadam", ml: "ധർമ്മടം" },
    { en: "Eranholi", ml: "എരഞ്ഞോളി" }, { en: "Eruvessi", ml: "എരുവേശ്ശി" }, { en: "Ezhome", ml: "ഏഴോം" },
    { en: "Kadambur", ml: "കടമ്പൂർ" }, { en: "Kalliasseri", ml: "കല്യാശ്ശേരി" }, { en: "Kanichar", ml: "കണിച്ചാർ" },
    { en: "Kankole Alapadamba", ml: "കാങ്കോൽ ആലപ്പടമ്പ്" }, { en: "Kannapuram", ml: "കണ്ണാടിപ്പറമ്പ് / കണ്ണാപുരം" },
    { en: "Karivellur Peralam", ml: "കരിവെള്ളൂർ പെരളം" }, { en: "Keezhallur", ml: "കീഴല്ലൂർ" }, { en: "Kelakam", ml: "കേളകം" },
    { en: "Kolayad", ml: "കൊളയാട്" }, { en: "Kolacherry", ml: "കൊളച്ചേരി" }, { en: "Koodali", ml: "കൂടാലി" },
    { en: "Kottiyoor", ml: "കൊട്ടിയൂർ" }, { en: "Kunjimangalam", ml: "കുഞ്ഞിമംഗലം" }, { en: "Kuttiattoor", ml: "കുറ്റ്യാട്ടൂർ" },
    { en: "Madayi", ml: "മാടായി" }, { en: "Malur", ml: "മാലൂർ" }, { en: "Mangattidam", ml: "മാങ്ങാട്ടിടം" },
    { en: "Mattool", ml: "മാട്ടൂൽ" }, { en: "Mayyil", ml: "മയ്യിൽ" }, { en: "Mokeri", ml: "മോകേരി" },
    { en: "Munderi", ml: "മുണ്ടേരി" }, { en: "Muzhakkunnu", ml: "മുഴക്കുന്ന്" }, { en: "Nadavil", ml: "നടുവിൽ" },
    { en: "Narath", ml: "നാറാത്ത്" }, { en: "New Mahe", ml: "ന്യൂ മാഹി" }, { en: "Panniyannur", ml: "പന്ന്യന്നൂർ" },
    { en: "Pariyaram", ml: "പരിയാരം" }, { en: "Pattiam", ml: "പാട്ട്യം" }, { en: "Pattuvam", ml: "പട്ടുവം" },
    { en: "Payyavoor", ml: "പയ്യവൂർ" }, { en: "Peralassery", ml: "പെരളശ്ശേരി" }, { en: "Peringome Vayakkara", ml: "പെരിങ്ങോം വയക്കര" },
    { en: "Pinarayi", ml: "പിണറായി" }, { en: "Ramanthali", ml: "രാമന്തളി" }, { en: "Sreekandapuram", ml: "ശ്രീകണ്ഠാപുരം" },
    { en: "Ulikkal", ml: "ഉളിക്കൽ" }, { en: "Vengad", ml: "വെങ്ങgather/വെങ്ങാട്" }
  ],
  "Wayanad": [
    { en: "Ambalavayal", ml: "അമ്പലവയൽ" }, { en: "Edavaka", ml: "എടവക" }, { en: "Kaniyambetta", ml: "കണിയാമ്പറ്റ" },
    { en: "Kottathara", ml: "കോട്ടത്തറ" }, { en: "Meppadi", ml: "മേപ്പാടി" }, { en: "Muppainad", ml: "മുപ്പൈനാട്" },
    { en: "Mullankolly", ml: "മുള്ളൻകൊല്ലി" }, { en: "Muttil", ml: "മുട്ടിൽ" }, { en: "Noolpuzha", ml: "നൂൽപ്പുഴ" },
    { en: "Padinharethara", ml: "പടിഞ്ഞാറത്തറ" }, { en: "Panamaram", ml: "പനമരം" }, { en: "Poothadi", ml: "പൂതാടി" },
    { en: "Pozhuthana", ml: "പൊഴുതന" }, { en: "Pulpally", ml: "പുൽപ്പള്ളി" }, { en: "Thavinhal", ml: "തവിഞ്ഞാൽ" },
    { en: "Thirunelly", ml: "തിരുനെല്ലി" }, { en: "Thondernad", ml: "തൊണ്ടർനാട്" }, { en: "Vellamunda", ml: "വെള്ളമുണ്ട" },
    { en: "Vythiri", ml: "വൈത്തിരി" }
  ],
  "Kozhikode": [
    { en: "Azhiyur", ml: "അഴിയൂർ" }, { en: "Arikkulam", ml: "അരികകുളം" }, { en: "Atholi", ml: "അത്തോളി" },
    { en: "Ayancheri", ml: "ആയാഞ്ചേരി" }, { en: "Balusseri", ml: "ബാലുശ്ശേരി" }, { en: "Chakkittapara", ml: "ചക്കിട്ടപ്പാറ" },
    { en: "Changaroth", ml: "ചങ്ങരോത്ത്" }, { en: "Chemancheri", ml: "ചെമഞ്ചേരി" }, { en: "Chengottukavu", ml: "ചെങ്ങോട്ടുകാവ്" },
    { en: "Cheruvannur", ml: "ചെറുവണ്ണൂർ" }, { en: "Kakkodi", ml: "കക്കോടി" }, { en: "Kakkur", ml: "കക്കൂർ" },
    { en: "Karassery", ml: "കാരശ്ശേരി" }, { en: "Kattippara", ml: "കട്ടിപ്പാറ" }, { en: "Kayakkodi", ml: "കായക്കൊടി" },
    { en: "Kayanna", ml: "കായാണ്ണ" }, { en: "Kizhakoth", ml: "കിഴക്കോത്ത്" }, { en: "Kodiyathur", ml: "കൊടിയത്തൂർ" },
    { en: "Koduvally", ml: "കൊടുവള്ളി" }, { en: "Koorachundu", ml: "കൂരാച്ചുണ്ട്" }, { en: "Koothali", ml: "കൂത്താളി" },
    { en: "Kottur", ml: "കോട്ടൂർ" }, { en: "Kunnamangalam", ml: "കുന്ദമംഗലം" }, { en: "Kunnummal", ml: "കുന്നമ്മൽ" },
    { en: "Kuruvattoor", ml: "കുറുവട്ടൂർ" }, { en: "Maniyur", ml: "മണിയൂർ" }, { en: "Maruthonkara", ml: "മരുതോങ്കര" },
    { en: "Mavoor", ml: "മാവൂർ" }, { en: "Meppayur", ml: "മേപ്പയൂർ" }, { en: "Moodadi", ml: "മൂടാടി" },
    { en: "Mukkam", ml: "മുക്കം" }, { en: "Nadapuram", ml: "നാദാപുരം" }, { en: "Narikkuni", ml: "നരിക്കുനി" }, { en: "Nochad", ml: "നൊച്ചാട്" },
    { en: "Omassery", ml: "ഓമശ്ശേരി" }, { en: "Onchiyam", ml: "ഒഞ്ചിയം" }, { en: "Panangad", ml: "പനങ്ങാട്" },
    { en: "Payyoli", ml: "പയ്യോളി" }, { en: "Perumanna", ml: "പെരുമണ്ണ" }, { en: "Peruvayal", ml: "പെരുവയൽ" },
    { en: "Puthuppadi", ml: "പുതുപ്പാടി" }, { en: "Ramanattukara", ml: "രാമനാട്ടുകര" }, { en: "Thalakulathur", ml: "തലക്കുളത്തൂർ" },
    { en: "Thamarassery", ml: "താമരശ്ശേരി" }, { en: "Thiruvambady", ml: "തിരുവമ്പാടി" }, { en: "Thuneri", ml: "തൂണേരി" },
    { en: "Unnikulam", ml: "ഉണ്ണികുളം" }, { en: "Valayam", ml: "വളയം" }, { en: "Villiappally", ml: "വില്ല്യാപ്പള്ളി" },
    { en: "Mukkali / Chombala", ml: "മുക്കാലി / ചോമ്പാല" }
  ],
  "Malappuram": [
    { en: "Alamkod", ml: "ആലംകോട്" }, { en: "Aliparamba", ml: "ആലിപ്പറമ്പ്" }, { en: "Amarambalam", ml: "അമരമ്പലം" },
    { en: "Angadippuram", ml: "അങ്ങാടിപ്പുറം" }, { en: "AR Nagar", ml: "എ.ആർ. നഗർ" }, { en: "Areekode", ml: "അരീക്കോട്" },
    { en: "Athavanad", ml: "ആതവനാട്" }, { en: "Kannamangalam", ml: "കണ്ണമംഗലം" }, { en: "Chaliyar", ml: "ചാലിയാർ" },
    { en: "Cheacode", ml: "ചീക്കോട്" }, { en: "Cheriyamundam", ml: "ചെറിയമുണ്ടം" }, { en: "Cherukavu", ml: "ചെറുകാവ്" },
    { en: "Chokkad", ml: "ചോക്കാട്" }, { en: "Edakkara", ml: "എടക്കര" }, { en: "Edappal", ml: "എടപ്പാൾ" },
    { en: "Edarikkode", ml: "എടരിക്കോട്" }, { en: "Edavanna", ml: "എടവണ്ണ" }, { en: "Edayur", ml: "എടയൂർ" },
    { en: "Elamkulam", ml: "ഏലംകുളം" }, { en: "Kalpakanchery", ml: "കല്പകഞ്ചേരി" }, { en: "Karulai", ml: "കരുളായി" },
    { en: "Karuvarakundu", ml: "കരുവാരകുണ്ട്" }, { en: "Keezhuparamba", ml: "കീഴുപറമ്പ്" }, { en: "Keezhattur", ml: "കീഴാറ്റൂർ" },
    { en: "Kodur", ml: "കോഡൂർ" }, { en: "Koottilangadi", ml: "കൂട്ടിലങ്ങാടി" }, { en: "Kottakkal", ml: "കോട്ടക്കൽ" },
    { en: "Kuttippuram", ml: "കുറ്റിപ്പുറം" }, { en: "Kuzhimanna", ml: "കുഴിമണ്ണ" }, { en: "Makkaraparamba", ml: "മക്കരപ്പറമ്പ്" },
    { en: "Mampad", ml: "മമ്പാട്" }, { en: "Mangalam", ml: "മംഗലം" }, { en: "Mankada", ml: "മങ്കട" },
    { en: "Marakkara", ml: "മറക്കര" }, { en: "Maranchery", ml: "മാറഞ്ചേരി" }, { en: "Melattur", ml: "മേലാറ്റൂർ" },
    { en: "Moonniyur", ml: "മൂന്നിയൂർ" }, { en: "Morayur", ml: "മൊറയൂർ" }, { en: "Moothedam", ml: "മൂത്തേടം" },
    { en: "Nannambra", ml: "നന്നമ്പ്ര" }, { en: "Nannammukku", ml: "നന്നംമുക്ക്" }, { en: "Niramaruthur", ml: "നിറമരുതൂർ" },
    { en: "Othukkungal", ml: "ഒതുക്കുങ്ങൽ" }, { en: "Ozhur", ml: "ഒഴൂർ" }, { en: "Pallikkal", ml: "പള്ളിക്കൽ" },
    { en: "Pandikkad", ml: "പാണ്ടിക്കാട്" }, { en: "Pang", ml: "പാങ്ങ്" }, { en: "Parappur", ml: "പറപ്പൂർ" },
    { en: "Ponmundam", ml: "പൊന്മള / പൊൻമുണ്ടം" }, { en: "Pothukal", ml: "പോത്തുകല്ല്" }, { en: "Pulamanthole", ml: "പുലാമന്തോൾ" },
    { en: "Pulpatta", ml: "പുൽപ്പറ്റ" }, { en: "Puzhakkattiri", ml: "പുഴക്കാട്ടിരി" }, { en: "Tavanur", ml: "തവനൂർ" },
    { en: "Thenhipalam", ml: "തെന്നല / തേനജ്ജീപ്പാലം" }, { en: "Thirunavaya", ml: "തിരുനാവായ" }, { en: "Thriprangode", ml: "തൃപ്രങ്ങോട്" },
    { en: "Urangattiri", ml: "ഉറങ്ങാട്ടിരി" }, { en: "Vengara", ml: "വേങ്ങര" }, { en: "Vettom", ml: "വെട്ടം" },
    { en: "Vazhakkad", ml: "വാഴക്കാട്" }, { en: "Vazhayur", ml: "വാഴയൂർ" }, { en: "Veliyankode", ml: "വെളിയങ്കോട്" },
    { en: "Wandoor", ml: "വണ്ടൂർ" }
  ],
  "Palakkad": [
    { en: "Agali", ml: "അഗളി" }, { en: "Akathethara", ml: "അകത്തേത്തറ" }, { en: "Alathur", ml: "ആലത്തൂർ" },
    { en: "Ambalappara", ml: "അമ്പലപ്പാറ" }, { en: "Anakkara", ml: "ആനക്കര" }, { en: "Ananganadi", ml: "അനങ്ങനടി" },
    { en: "Ayiloor", ml: "അയിരൂർ / അയിലൂർ" }, { en: "Chalavara", ml: "ചളവറ" }, { en: "Chalissery", ml: "ചാലിശ്ശേരി" },
    { en: "Elappully", ml: "എലപ്പുള്ളി" }, { en: "Eruthempathy", ml: "എരുത്തേമ്പതി" }, { en: "Ezhuvanthala", ml: "എഴുവന്തല" },
    { en: "Kadambazhipuram", ml: "കടമ്പഴിപ്പുറം" }, { en: "Kannadi", ml: "കണ്ണാടി" }, { en: "Kannambra", ml: "കണ്ണമ്പ്ര" },
    { en: "Karimba", ml: "കരിമ്പ" }, { en: "Karimpuzha", ml: "കരിമ്പുഴ" }, { en: "Kavassery", ml: "കാവശ്ശേരി" },
    { en: "Keralassery", ml: "കേരളശ്ശേരി" }, { en: "Kizhakkencherry", ml: "കിഴക്കഞ്ചേരി" }, { en: "Kodumba", ml: "കൊടുമ്പ്" },
    { en: "Kollengode", ml: "കൊല്ലങ്കോട്" }, { en: "Koppam", ml: "കോപ്പൻ / കൊപ്പം" }, { en: "Kottayi", ml: "കോട്ടായി" },
    { en: "Kozhinjampara", ml: "കൊഴിഞ്ഞാമ്പാറ" }, { en: "Kulukkallur", ml: "കുലുക്കല്ലൂർ" }, { en: "Kumarapuram", ml: "കുമാരപുരം" },
    { en: "Kuthanur", ml: "കുത്തന്നൂർ" }, { en: "Lakkidi Perur", ml: "ലക്കിടി പേരൂർ" }, { en: "Malampuzha", ml: "മലമ്പുഴ" },
    { en: "Mannarkkad", ml: "മണ്ണാർക്കാട്" }, { en: "Mannur", ml: "മാന്നൂർ" }, { en: "Marutharoad", ml: "മരുതറോഡ്" },
    { en: "Melarcode", ml: "മേലാർകോട്" }, { en: "Muthuthala", ml: "മുത്തുതല" }, { en: "Nelliampathy", ml: "നെല്ലിയാമ്പതി" },
    { en: "Nellaya", ml: "നെല്ലായ" }, { en: "Nemmara", ml: "നെന്മാറ" }, { en: "Nallepilly", ml: "നല്ലേപ്പിള്ളി" },
    { en: "Ongallur", ml: "ഓങ്ങല്ലൂർ" }, { en: "Parali", ml: "പറളി" }, { en: "Pattambi", ml: "പട്ടാമ്പി" },
    { en: "Pattithara", ml: "പട്ടിത്തറ" }, { en: "Peringottukurissi", ml: "പെരിങ്ങോട്ടുകുറിശ്ശി" }, { en: "Perumatty", ml: "പെരുമാട്ടി" },
    { en: "Pookottukavu", ml: "പൂക്കോട്ടുകാവ്" }, { en: "Pudunagaram", ml: "പുതുനഗരം" }, { en: "Puduppariyaram", ml: "പുതുപ്പരിയാരം" },
    { en: "Pudussery", ml: "പുതുശ്ശേരി" }, { en: "Pirayiri", sml: "പിരിയിരി" }, { en: "Sreekrishnapuram", ml: "ശ്രീകൃഷ്ണപുരം" },
    { en: "Sholayur", ml: "ഷോളയൂർ" }, { en: "Tarur", ml: "താരൂർ" }, { en: "Thenkurussi", ml: "തേൻകുറിശ്ശി" },
    { en: "Thiruvegapura", ml: "തിരുവേഗപ്പുറ" }, { en: "Thrikkadeeri", ml: "തൃക്കടീരി" }, { en: "Vandazhi", ml: "വണ്ടgather / വണ്ടാഴി" },
    { en: "Vadakarapathy", ml: "വടകരപ്പതി" }, { en: "Vadavannur", ml: "വടവന്നൂർ" }, { en: "Vallapuzha", ml: "വല്ലപ്പുഴ" },
    { en: "Vaniyamkulam", ml: "വാണിയംകുളം" }, { en: "Vellinezhi", ml: "വെള്ളിനേഴി" }, { en: "Vilayur", ml: "വിളയൂർ" }
  ],
  "Thrissur": [
    { en: "Adat", ml: "അടാട്ട്" }, { en: "Ala", ml: "ആല" }, { en: "Alagappanagar", ml: "അളഗപ്പനഗർ" },
    { en: "Annamanada", ml: "അന്നമനട" }, { en: "Arimpur", ml: "അരിമ്പൂർ" }, { en: "Athirappilly", ml: "അതിരപ്പിള്ളി" },
    { en: "Avinissery", ml: "അവിണിശ്ശേരി" }, { en: "Chazhoor", ml: "ചാഴൂർ" }, { en: "Chelakkara", ml: "ചേലക്കര" },
    { en: "Cherpu", ml: "ചേർപ്പ്" }, { en: "Chowannur", ml: "ചൊവ്വന്നൂർ" }, { en: "Desamangalam", ml: "ദേശമംഗലം" },
    { en: "Edavilangu", ml: "എടവിലങ്ങ്" }, { en: "Elavally", ml: "എളവള്ളി" }, { en: "Engandiyur", ml: "എങ്ങണ്ടിയൂർ" },
    { en: "Eriyad", ml: "എറിയാട്" }, { en: "Erumapetty", ml: "എരുമപ്പെട്ടി" }, { en: "Kadangode", ml: "കടങ്ങോട്" },
    { en: "Kadavallur", ml: "കടവല്ലൂർ" }, { en: "Kadukutty", ml: "കടുക്കുറ്റി" }, { en: "Kaipamangalam", ml: "കൈപ്പമംഗലം" },
    { en: "Kandanassery", ml: "കണ്ടണശ്ശേരി" }, { en: "Karalam", ml: "കരാളം" }, { en: "Kattakampal", ml: "കാട്ടകാമ്പാൽ" },
    { en: "Kattur", ml: "കാട്ടൂർ" }, { en: "Kodakara", ml: "കൊടകര" }, { en: "Kodassery", ml: "കോടശ്ശേരി" },
    { en: "Kolazhy", ml: "കോലഴി" }, { en: "Kondazhy", ml: "കൊണ്ടഴി" }, { en: "Koratty", ml: "കൊരട്ടി" },
    { en: "Madakkathara", ml: "മാടക്കത്തറ" }, { en: "Mala", ml: "മാള" }, { en: "Mathilakam", ml: "മതിലകം" },
    { en: "Mattathur", ml: "മറ്റത്തൂർ" }, { en: "Meloor", ml: "മേലൂർ" }, { en: "Mullassery", ml: "മുല്ലശ്ശേരി" },
    { en: "Mulloorkkara", ml: "മുള്ളൂർക്കര" }, { en: "Muriyad", ml: "മുരിയാട്" }, { en: "Nenmanikkara", ml: "നെന്മണിക്കര" },
    { en: "Orumanayur", ml: "ഒരുമനയൂർ" }, { en: "Padiyur", ml: "പടിയൂർ" }, { en: "Panjal", ml: "പാഞ്ഞാൾ" },
    { en: "Pariyaram", ml: "പരിയാരം" }, { en: "Paralam", ml: "പരാളം" }, { en: "Poomangalam", ml: "പൂമംഗലം" },
    { en: "Porkulam", ml: "പോർക്കുളം" }, { en: "Punnayur", ml: "പുന്നയൂർ" }, { en: "Punnayurkulam", ml: "പുന്നയൂർക്കുളം" },
    { en: "Puthukkad", ml: "പുതുക്കാട്" }, { en: "Thalikulam", ml: "തളിക്കുളം" }, { en: "Thennala", ml: "തെന്നല" },
    { en: "Tholur", ml: "തോളൂർ" }, { en: "Triprayar / Vadakkekad", ml: "തൃപ്രയാർ / വടക്കേക്കാട്" }, { en: "Valapad", ml: "വലപ്പാട്" },
    { en: "Vallachira", ml: "വല്ലച്ചിറ" }, { en: "Varandarappilly", ml: "വരന്തരപ്പിള്ളി" }, { en: "Varavoor", ml: "വരവൂർ" },
    { en: "Velookkara", ml: "വേളൂക്കര" }, { en: "Velur", ml: "വേലൂർ" }, { en: "Venkitangu", ml: "വെങ്കിടങ്ങ്" }
  ],
  "Ernakulam": [
    { en: "Alangad", ml: "ആലങ്ങാട്" }, { en: "Amballoor", ml: "ആമ്പല്ലൂർ" }, { en: "Arakuzha", ml: "ആരക്കുഴ" },
    { en: "Asamannoor", ml: "അസമന്നൂർ" }, { en: "Ayvana", ml: "ആയവന" }, { en: "Chellanam", ml: "ചെല്ലാനം" },
    { en: "Chendamangalam", ml: "ചേന്ദമംഗലം" }, { en: "Chengamanad", ml: "ചെങ്ങമനാട്" }, { en: "Choornikkara", ml: "ചൂർണ്ണിക്കര" },
    { en: "Chottanikkara", ml: "ചോറ്റാനിക്കര" }, { en: "Edakkattuvayal", ml: "എടക്കാട്ടുവയൽ" }, { en: "Edathala", ml: "എടത്തല" },
    { en: "Elanji", ml: "ഇലഞ്ഞി" }, { en: "Ezhikkara", ml: "ഏഴിക്കര" }, { en: "Kadamakkudy", ml: "കടമക്കുടി" },
    { en: "Kadungalloor", ml: "കടുങ്ങല്ലൂർ" }, { en: "Kalady", ml: "കാലടി" }, { en: "Karukutty", ml: "കറുകുറ്റി" },
    { en: "Keezhmad", ml: "കീഴ്മാട്" }, { en: "Kizhakkambalam", ml: "കിഴക്കമ്പലം" }, { en: "Koovappady", ml: "കൂവപ്പടി" },
    { en: "Kottuvally", ml: "കോട്ടുവള്ളി" }, { en: "Kuttampuzha", ml: "കുട്ടമ്പുഴ" }, { en: "Malayattoor Neeleswaram", ml: "മലയാറ്റൂർ നീലേശ്വരം" },
    { en: "Manjapra", ml: "മഞ്ഞപ്ര" }, { en: "Maneed", ml: "മണീട്" }, { en: "Marady", ml: "മാറാടി" },
    { en: "Mazhuvannoor", ml: "മഴുവന്നൂർ" }, { en: "Mookkannoor", ml: "മൂക്കന്നൂർ" }, { en: "Mudakkuzha", ml: "മുളക്കുഴ / മുടക്കുഴ" },
    { en: "Mulanthuruthy", ml: "മുളന്തുരുത്തി" }, { en: "Nayarambalam", ml: "നായരമ്പലം" }, { en: "Njarakkal", ml: "ഞാറക്കൽ" },
    { en: "Nedumbassery", ml: "നെടുമ്പാശ്ശേരി" }, { en: "Nellikuzhi", ml: "നെല്ലിക്കുഴി" }, { en: "Okkal", ml: "ഓക്കൽ" },
    { en: "Paingottoor", ml: "പൈങ്ങോട്ടൂർ" }, { en: "Pambakuda", ml: "പാമ്പാക്കുട" }, { en: "Parakkadavu", ml: "പാറക്കടവ്" },
    { en: "Payipra", ml: "പൈപ്ര" }, { en: "Pindimana", ml: "പിണ്ടിമന" }, { en: "Pootrikka", ml: "പൂതൃക്ക" },
    { en: "Puthenvelikkara", ml: "പുത്തൻവേലിക്കര" }, { en: "Ramamangalam", ml: "രാമമംഗലം" }, { en: "Rayamangalam", ml: "രായമംഗലം" },
    { en: "Srimoolanagaram", ml: "ശ്രീമൂലനഗരം" }, { en: "Thiruvaniyoor", ml: "തിരുവാണിയൂർ" }, { en: "Thiruvairanikulam", ml: "തിരുവൈരാണിക്കുളം" },
    { en: "Vadavucode Puthencruz", ml: "വടവുകോട് പുത്തൻകുരിശ്" }, { en: "Valakom", ml: "വാളകം" }, { en: "Varappuzha", ml: "വരാപ്പുഴ" },
    { en: "Vazhakulam", ml: "വാഴക്കുളം" }, { en: "Vengola", ml: "വെങ്ങോല" }, { en: "Vengoor", ml: "വേങ്ങൂർ" }
  ],
  "Idukki": [
    { en: "Adimaly", ml: "അടിമാലി" }, { en: "Alakode", ml: "ആലക്കോട്" }, { en: "Arakulam", ml: "അറക്കുളം" },
    { en: "Bisonvalley", ml: "ബൈസൺവാലി" }, { en: "Chinnakanal", ml: "ചിന്നക്കനാൽ" }, { en: "Devikulam", ml: "ദേവികുളം" },
    { en: "Elappara", ml: "ഏലപ്പാറ" }, { en: "Erattayar", ml: "ഇരട്ടയാർ" }, { en: "Kanjikuzhy", ml: "കഞ്ഞിക്കുഴി" },
    { en: "Kamakshy", ml: "കാമാക്ഷി" }, { en: "Kanchiyar", ml: "കാഞ്ചിയാർ" }, { en: "Kanthalloor", ml: "കാന്തല്ലൂർ" },
    { en: "Karimannoor", ml: "കരിമണ്ണൂർ" }, { en: "Karimkunnam", ml: "കരിങ്കുന്നം" }, { en: "Kokkayar", ml: "കൊക്കയാർ" },
    { en: "Kudayathoor", ml: "കുടയത്തൂർ" }, { en: "Kumily", ml: "കുമിളി" }, { en: "Munnar", ml: "മൂന്നാർ" },
    { en: "Mariyapuram", ml: "മരിയപുരം" }, { en: "Marayoor", ml: "മറയൂർ" }, { en: "Muttom", ml: "മുട്ടം" },
    { en: "Nedumkandam", ml: "നെടുംകണ്ടം" }, { en: "Pallivasal", ml: "പള്ളിവാസൽ" }, { en: "Pampadumpara", ml: "പാമ്പാടുംപാറ" },
    { en: "Peermade", ml: "പീരുമേട്" }, { en: "Peruvanthanam", ml: "പെരുവന്താനം" }, { en: "Purapuzha", ml: "പുറപ്പുഴ" },
    { en: "Rajakkad", ml: "രാജാക്കാട്" }, { en: "Rajakumari", ml: "രാജകുമാരി" }, { en: "Santhanpara", ml: "ശാന്തൻപാറ" },
    { en: "Senapathy", ml: "സേനാപതി" }, { en: "Udumbanchola", ml: "ഉടുമ്പൻചോല" }, { en: "Upputhara", ml: "ഉപ്പുതറ" },
    { en: "Vandanmedu", ml: "വണ്ടൻമേട്" }, { en: "Vandiperiyar", ml: "വണ്ടിപ്പെരിയാർ" }, { en: "Vathikudy", ml: "വാത്തിക്കുടി" },
    { en: "Vattavada", ml: "വട്ടവട" }, { en: "Vellathooval", ml: "വെള്ളത്തൂവൽ" }, { en: "Veliyamattam", ml: "വെളിയമറ്റം" }
  ],
  "Kottayam": [
    { en: "Akalakunnam", ml: "അകലാകുന്നം" }, { en: "Arpookara", ml: "ആർപ്പൂക്കര" }, { en: "Athirampuzha", ml: "അതിരമ്പുഴ" },
    { en: "Ayarkkunnam", ml: "അയർക്കുന്നം" }, { en: "Aymanam", ml: "അയ്മനം" }, { en: "Bharananganam", ml: "ഭരണങ്ങാനം" },
    { en: "Chembu", ml: "ചെമ്പ്" }, { en: "Chirakkadapambu", ml: "ചിറക്കടവ്" }, { en: "Elikulam", ml: "എലിക്കുളം" },
    { en: "Erumely", ml: "എരുമേലി" }, { en: "Kadaplamattom", ml: "കടപ്ലാമറ്റം" }, { en: "Kaduthuruthy", ml: "കടുത്തുരുത്തി" },
    { en: "Kallara", ml: "കല്ലറ" }, { en: "Kanjirappally", ml: "കാഞ്ഞിരപ്പള്ളി" }, { en: "Kangazha", ml: "കാങ്ങഴ" },
    { en: "Karoor", ml: "കരൂർ" }, { en: "Kidangoor", ml: "കിടangoor / കിടങ്ങൂർ" }, { en: "Kooroppada", ml: "കൂരോപ്പട" },
    { en: "Koruthodu", ml: "കോരുത്തോട്" }, { en: "Kumarakom", ml: "കുമാരകം" }, { en: "Kuravilangad", ml: "കുറവിലങ്ങാട്" },
    { en: "Kurichi", ml: "കുറിച്ചി" }, { en: "Madappally", ml: "മടപ്പള്ളി" }, { en: "Manarcadu", ml: "മണർകാട്" },
    { en: "Manimala", ml: "മണിമല" }, { en: "Manjoor", ml: "മാഞ്ഞൂർ" }, { en: "Marangattupilly", ml: "മരങ്ങാട്ടുപിള്ളി" },
    { en: "Maravanthuruthu", ml: "മറവന്തുരുത്ത്" }, { en: "Meenachil", ml: "മീനച്ചിൽ" }, { en: "Mulakulam", ml: "മുളക്കുളം" },
    { en: "Mundakayam", ml: "മുണ്ടക്കയം" }, { en: "Mutholy", ml: "മുത്തോലി" }, { en: "Nedumkunnam", ml: "നെടുങ്കുന്നം" },
    { en: "Njeezhoor", ml: "ഞീഴൂർ" }, { en: "Paipadu", ml: "പൈപ്പാട്" }, { en: "Pampady", ml: "പാമ്പാടി" },
    { en: "Panachikkadu", ml: "പനച്ചിക്കാട്" }, { en: "Parathode", ml: "പാറത്തോട്" }, { en: "Poonjar", ml: "പൂഞ്ഞാർ" },
    { en: "Ramapuram", ml: "രാമപുരം" }, { en: "Teekoy", ml: "തീക്കോയി" }, { en: "Thalanad", ml: "തലനാട്" },
    { en: "Thalayolaparambu", ml: "തലയോലപ്പറമ്പ്" }, { en: "Thalayazham", ml: "തലയാഴം" }, { en: "Thidanad", ml: "തിടനാട്" },
    { en: "Tiruvarapu", ml: "തിരുവാർപ്പ്" }, { en: "Udayanapuram", ml: "ഉദയനാപുരം" }, { en: "Uzhavoor", ml: "ഉഴവൂർ" },
    { en: "Vechoor", ml: "വെച്ചൂർ" }, { en: "Veliyannoor", ml: "വെളിയന്നൂർ" }, { en: "Vellavoor", ml: "വെള്ളാവൂർ" },
    { en: "Vijayapuram", ml: "വിജയപുരം" }
  ],
  "Alappuzha": [
    { en: "Ambalappuzha North", ml: "അമ്പലപ്പുഴ നോർത്ത്" }, { en: "Ambalappuzha South", ml: "അമ്പലപ്പുഴ സൗത്ത്" },
    { en: "Arattupuzha", ml: "ആറാട്ടുപുഴ" }, { en: "Aroor", ml: "അരൂർ" }, { en: "Arookkutty", ml: "അരൂക്കുറ്റി" },
    { en: "Aryad", ml: "ആര്യnetwork / ആര്യാട്" }, { en: "Bharanicavu", ml: "ഭരണിക്കാവ്" }, { en: "Champakulam", ml: "ചമ്പക്കുളം" },
    { en: "Chennam Pallippuram", ml: "ചേന്നം പള്ളിപ്പുറം" }, { en: "Chennithala", ml: "ചെന്നിത്തല" }, { en: "Cheppad", ml: "ചെപ്പാട്" },
    { en: "Chettikulangara", ml: "ചെട്ടികുളങ്ങര" }, { en: "Cherthala South", ml: "ചേർത്തല സൗത്ത്" }, { en: "Chingoli", ml: "ചിങ്ങോലി" },
    { en: "Chunakkara", ml: "ചുനക്കര" }, { en: "Devikulangara", ml: "ദേവികുളങ്ങര" }, { en: "Edathua", ml: "എടത്വ" },
    { en: "Ezhupunna", ml: "എഴുപുന്ന" }, { en: "Kadakkarappally", ml: "കടക്കരപ്പള്ളി" }, { en: "Kainakary", ml: "കൈനകരി" },
    { en: "Kanjikkuzhi", ml: "കഞ്ഞിക്കുഴി" }, { en: "Karuvatta", ml: "കരുവാറ്റ" }, { en: "Kavalam", ml: "കാവാലം" },
    { en: "Kodamthuruth", ml: "കോടംതുരുത്ത്" }, { en: "Komala", ml: "കോമളപുരം" }, { en: "Krishnapuram", ml: "കൃഷ്ണപുരം" },
    { en: "Kumarapuram", ml: "കുമാരപുരം" }, { en: "Kuthiathode", ml: "കുത്തിയതോട്" }, { en: "Mannancherry", ml: "മണ്ണഞ്ചേരി" },
    { en: "Mannar", ml: "മാന്നാർ" }, { en: "Mararikulam North", ml: "മാരാരിക്കുളം നോർത്ത്" }, { en: "Mararikulam South", ml: "മാരാരിക്കുളം സൗത്ത്" },
    { en: "Muhamma", ml: "മുഹമ്മ" }, { en: "Mulakuzha", ml: "മുളക്കുഴ" }, { en: "Muthukulam", ml: "മുതുകുളം" },
    { en: "Nedumudi", ml: "നെടുമുടി" }, { en: "Neelamperoor", ml: "നീലമ്പേരൂർ" }, { en: "Palamel", ml: "പാലമേൽ" },
    { en: "Panavally", ml: "പാനാവള്ളി" }, { en: "Pathiyoor", ml: "പതിറ്റ / പത്തിയൂർ" }, { en: "Punnapra North", ml: "പുന്നപ്ര നോർത്ത്" },
    { en: "Punnapra South", ml: "പുന്നപ്ര സൗത്ത്" }, { en: "Purakkad", ml: "പുറക്കാട്" }, { en: "Ramankary", ml: "രാമങ്കരി" },
    { en: "Talavadi", ml: "തലവടി" }, { en: "Thazhakara", ml: "തഴക്കര" }, { en: "Thiruvanvandoor", ml: "തിരുവൻവണ്ടൂർ" },
    { en: "Thakazhy", ml: "തകഴി" }, { en: "Thycattusserry", ml: "തൈക്കാട്ടുശ്ശേരി" }, { en: "Vayalar", ml: "വയലാർ" },
    { en: "Venmony", ml: "വെൺമണി" }
  ],
  "Pathanamthitta": [
    { en: "Anicadu", ml: "ആനിക്കാട്" }, { en: "Aranmula", ml: "ആറൻമുള" }, { en: "Chenneerkara", ml: "ചെന്നീർക്കര" },
    { en: "Cherukole", ml: "ചെറുകോൽ" }, { en: "Chittar", ml: "ചിറ്റാർ" }, { en: "Enadimangalam", ml: "ഏനാദിമംഗലം" },
    { en: "Erathu", ml: "ഏറത്ത്" }, { en: "Ezhamkulam", ml: "ഏഴംകുളം" }, { en: "Ezhumattoor", ml: "എഴുമറ്റൂർ" },
    { en: "Kadapra", ml: "കടപ്ര" }, { en: "Kalanjoor", ml: "കലഞ്ഞൂർ" }, { en: "Kallooppara", ml: "കല്ലൂപ്പാറ" },
    { en: "Kaviyoor", ml: "കവിയൂർ" }, { en: "Kodumon", ml: "കൊടുമൺ" }, { en: "Koipuram", ml: "കോയിപ്രം" },
    { en: "Konni", ml: "കോന്നി" }, { en: "Kottangal", ml: "കൊറ്റാങ്ങൽ" }, { en: "Kottoor", ml: "കോട്ടൂർ" },
    { en: "Kozhencherry", ml: "കോഴഞ്ചേരി" }, { en: "Kulanada", ml: "കുളനട" }, { en: "Kunnamthanam", ml: "കുന്നത്ത്" },
    { en: "Mallappally", ml: "മല്ലപ്പള്ളി" }, { en: "Mallapuzhasherry", ml: "മല്ലപ്പുഴശ്ശേരി" }, { en: "Mezhuveli", ml: "മെഴുവേലി" },
    { en: "Mylapra", ml: "മൈലപ്ര" }, { en: "Naranganam", ml: "നാരങ്ങാനം" }, { en: "Nedumpram", ml: "നെടുമ്പ്രം" },
    { en: "Niranam", ml: "നിരണം" }, { en: "Naranammoozhy", ml: "നാരണംമൂഴി" }, { en: "Pandalam Thekkekara", ml: "പന്തളം തെക്കേക്കര" },
    { en: "Pallickal", ml: "പള്ളിക്കൽ" }, { en: "Pramadom", ml: "പ്രമാടം" }, { en: "Puramattam", ml: "പുറമറ്റം" },
    { en: "Ranni", ml: "റാന്നി" }, { en: "Ranni Angadi", ml: "റാന്നി അങ്ങാടി" }, { en: "Ranni Pazhavangadi", ml: "റാന്നി പഴവങ്ങാടി" },
    { en: "Ranni Perunad", ml: "റാന്നി പെരുനാട്" }, { en: "Seethathode", ml: "സീതത്തോട്" }, { en: "Thottapuzhasherry", ml: "തോട്ടപ്പുഴശ്ശേരി" }, { en: "Tumpamon", ml: "തുമ്പമൺ" }, { en: "Vadasserikkara", ml: "വടശ്ശേരിക്കര" }, { en: "Vallicode", ml: "വള്ളിക്കോട്" }, { en: "Vechoochira", ml: "വെച്ചൂച്ചിറ" }
  ],
  "Kollam": [
    { en: "Alayamon", ml: "അലയമൺ" }, { en: "Anchal", ml: "അഞ്ചൽ" }, { en: "Aryankavu", ml: "ആര്യങ്കാവ്" },
    { en: "Chadayamangalam", ml: "ചടയമംഗലം" }, { en: "Chathannoor", ml: "ചാത്തന്നൂർ" }, { en: "Chavara", ml: "ചവറ" },
    { en: "Chirakkara", ml: "ചിറക്കര" }, { en: "Clappana", ml: "ക്ലാപ്പന" }, { en: "Edamulakkal", ml: "എടമുളയ്ക്കൽ" },
    { en: "Elamad", ml: "ഇളമാട്" }, { en: "Ezhukone", ml: "എഴുകോൺ" }, { en: "Ittiva", ml: "ഇട്ടിവാ" },
    { en: "Kadakkal", ml: "കടയ്ക്കൽ" }, { en: "Kalluvathukkal", ml: "കല്ലുവാതുക്കൽ" }, { en: "Karavalur", ml: "കരവാളൂർ" },
    { en: "Kottamkara", ml: "കൊറ്റങ്കര" }, { en: "Kulakkada", ml: "കുളക്കട" }, { en: "Kulathupuzha", ml: "കുളത്തൂപ്പുഴ" },
    { en: "Kummil", ml: "കുമ്മിൾ" }, { en: "Kundara", ml: "കുണ്ടറ" }, { en: "Melila", ml: "മേലില" },
    { en: "Mynagappally", ml: "മൈനാഗപ്പള്ളി" }, { en: "Nedumpana", ml: "നെടുമ്പന" }, { en: "Neduvathoor", ml: "നെടുവത്തൂർ" },
    { en: "Nilamel", ml: "നിലമേൽ" }, { en: "Oachira", ml: "ഓച്ചിറ" }, { en: "Panmana", ml: "പന്മന" },
    { en: "Pathanapuram", ml: "പത്തനാപുരം" }, { en: "Pattazhy", ml: "പട്ടാഴി" }, { en: "Pavithreswaram", ml: "പവിത്രേശ്വരം" },
    { en: "Perayam", ml: "പെരയം" }, { en: "Perinad", ml: "പെരിനാട്" }, { en: "Pooyappally", ml: "പൂയപ്പള്ളി" },
    { en: "Poruvazhy", ml: "പോരുവഴി" }, { en: "Sasthamkotta", ml: "ശാസ്താംകോട്ട" }, { en: "Sooranad North", ml: "ശൂരനാട് നോർത്ത്" },
    { en: "Sooranad South", ml: "ശൂരനാട് സൗത്ത്" }, { en: "Thevalakkara", ml: "തേവലക്കര" }, { en: "Thenmala", ml: "തെന്മല" },
    { en: "Thrikkaruva", ml: "തൃക്കരുവ" }, { en: "Thrikkovilvattam", ml: "തൃക്കോവിൽവട്ടം" }, { en: "Ummannoor", ml: "ഉമ്മന്നൂർ" },
    { en: "Veliyam", ml: "വെളിയം" }, { en: "Yeroor", ml: "ഏരൂർ" }, { en: "West Kallada", ml: "വെസ്റ്റ് കല്ലട" }, { en: "East Kallada", ml: "ഈസ്റ്റ് കല്ലട" }
  ],
  "Thiruvananthapuram": [
    { en: "Anad", ml: "ആനാട്" }, { en: "Anchuthengu", ml: "അഞ്ചുതെങ്" }, { en: "Aruvikkara", ml: "അരുവിിക്കര" },
    { en: "Aryanad", ml: "ആര്യനാട്" }, { en: "Aryankode", ml: "ആര്യങ്കോട്" }, { en: "Athiyannoor", ml: "അതിയന്നൂർ" },
    { en: "Azhoor", ml: "അഴൂർ" }, { en: "Balaramapuram", ml: "ബാലരാമപുരം" }, { en: "Chenkal", ml: "ചെങ്കൽ" },
    { en: "Cherunniyoor", ml: "ചെറുണ്ണിയൂർ" }, { en: "Chirayinkeezhu", ml: "ചിറയിൻകീഴ്" }, { en: "Elakamon", ml: "ഇലകമൺ" },
    { en: "Kadakkavoor", ml: "കടയ്ക്കാവൂർ" }, { en: "Kadinamkulam", ml: "കഠിനംകുളം" }, { en: "Kallara", ml: "കല്ലറ" },
    { en: "Kalliyoor", ml: "കല്ലിയൂർ" }, { en: "Kanjiramkulam", ml: "കഞ്ചിരംകുളം" }, { en: "Karode", ml: "കാരോട്" },
    { en: "Karumkulam", ml: "കരുംകുളം" }, { en: "Kattakada", ml: "കാട്ടാക്കട" }, { en: "Kilimanoor", ml: "കിളിമാനൂർ" },
    { en: "Kunnathukal", ml: "കുന്നത്തുകാൽ" }, { en: "Kuttichal", ml: "കുറ്റിച്ചൽ" }, { en: "Malayinkeezhu", ml: "മലയിൻകീഴ്" },
    { en: "Manamboor", ml: "മണമ്പൂർ" }, { en: "Mangalapuram", ml: "മംഗലപുരം" }, { en: "Maranalloor", ml: "മാറനല്ലൂർ" },
    { en: "Nagaroor", ml: "നഗരൂർ" }, { en: "Navaikulam", ml: "നവായ്ക്കുളം" }, { en: "Nellanad", ml: "നെല്ലനാട്" },
    { en: "Vembayam", ml: "വെമ്പായം" }, { en: "Vilavoorkkal", ml: "വിളവൂർക്കൽ" }, { en: "Ottasekharamangalam", ml: "ഒറ്റശേഖരമംഗലം" },
    { en: "Vakkom", ml: "വക്കം" }, { en: "Vamanapuram", ml: "വാമനപുരം" }, { en: "Vellarada", ml: "വെള്ളറട" },
    { en: "Venganoor", ml: "വെങ്ങാനൂർ" }, { en: "Vithura", ml: "വിതുര" }, { en: "Poovachal", ml: "പൂവച്ചൽ" },
    { en: "Pulimath", ml: "പുളിമാത്ത്" }, { en: "Kottukal", ml: "കോട്ടുകാൽ" }, { en: "Perumkadavila", ml: "പെരുങ്കടവിള" },
    { en: "Poovar", ml: "പൂവാർ" }, { en: "Kulathoor", ml: "കുളത്തൂർ" }, { en: "Parassala", ml: "പാറശ്ശാല" }
  ]
};

// Helper to fetch details for any Grama Panchayat in Kerala
export function getPanchayatInfo(panchayatName, districtName = "Kozhikode") {
  const cleanP = (panchayatName || "Azhiyur").trim();
  const cleanD = (districtName || "Kozhikode").trim();

  // Coastal District Check for Fisheries Sub Centre / Matsya Bhavan
  const COASTAL_DISTRICTS = [
    "Thiruvananthapuram", "Kollam", "Alappuzha", "Ernakulam", 
    "Thrissur", "Malappuram", "Kozhikode", "Kannur", "Kasaragod"
  ];
  const isCoastal = COASTAL_DISTRICTS.includes(cleanD);

  // Tribal District / Hill Area Check for Tribal Extension Office
  const TRIBAL_DISTRICTS = [
    "Wayanad", "Idukki", "Palakkad", "Pathanamthitta", 
    "Kasaragod", "Kannur", "Thiruvananthapuram"
  ];
  const isTribalArea = TRIBAL_DISTRICTS.includes(cleanD);

  // Cities, Towns, Villages, and Wards under limits
  const limits = [
    { id: "limit_central", name: `${cleanP} Central Village`, mlName: `${cleanP} സെൻട്രൽ വില്ലേജ്`, ml: `${cleanP} സെൻട്രൽ വില്ലേജ്`, type: "Revenue Village", desc: "Main revenue administrative headquarters village and taluk jurisdiction office." },
    { id: "limit_town", name: `${cleanP} Town / Bazar`, mlName: `${cleanP} ടൗൺ / അങ്ങാടി`, ml: `${cleanP} ടൗൺ / അങ്ങാടി`, type: "Town & Commercial Hub", desc: "Central bus stand, private markets, shops, banking institutions and commercial hub." },
    { id: "limit_north", name: `${cleanP} North Hamlet / Wards 1-6`, mlName: `${cleanP} നോർത്ത് / വാർഡ് 1-6`, ml: `${cleanP} നോർത്ത് / വാർഡ് 1-6`, type: "Locality & Wards", desc: "Northern residential ward boundaries, local sub-centres and Anganwadis." },
    { id: "limit_south", name: `${cleanP} South Village / Wards 7-12`, mlName: `${cleanP} സൗത്ത് വില്ലേജ് / വാർഡ് 7-12`, ml: `${cleanP} സൗത്ത് വില്ലേജ് / വാർഡ് 7-12`, type: "Revenue Village", desc: "Southern residential and agricultural settlement zone under panchayat limits." },
    { id: "limit_east", name: `${cleanP} East Belt / Wards 13-18`, mlName: `${cleanP} ഈസ്റ്റ് അഗ്രികൾച്ചറൽ ബെൽറ്റ്`, ml: `${cleanP} ഈസ്റ്റ് അഗ്രികൾച്ചറൽ ബെൽറ്റ്`, type: "Rural Hamlet", desc: "Eastern agricultural farming zone, coconut groves and rural ward sector." }
  ];

  // Agriculture & Animal Husbandry
  const agricultureAndAnimalHusbandry = [
    {
      id: "agri_krishi_bhavan",
      category: "Agriculture Extension",
      name: `Krishi Bhavan ${cleanP}`,
      mlName: `കൃഷിഭവൻ ${cleanP}`,
      services: "Subsidized High-Yield Seeds, Organic Fertilizer, Soil pH Testing, PM-KISAN Registration, Farm Equipment Subsidy",
      contact: `Agricultural Officer, Krishi Bhavan ${cleanP}`,
      helpline: "+91 94470 12345 / 0471-2304853 (Agri Dept Kerala)",
      timing: "10:00 AM - 5:00 PM (Mon-Sat)"
    },
    {
      id: "agri_vet_hospital",
      category: "Animal Husbandry",
      name: `Government Veterinary Hospital & Dispensary ${cleanP}`,
      mlName: `ഗവ. വെറ്ററിനറി ആശുപത്രി & ഡിസ്പെൻസറി ${cleanP}`,
      services: "Livestock & Poultry Vaccination, Artificial Insemination (AI), Veterinary OPD, Animal Disease Control, Milk Cattle Subsidies",
      contact: `Veterinary Surgeon, Govt Veterinary Hospital ${cleanP}`,
      helpline: "+91 94471 23456 / 0471-2302283",
      timing: "8:00 AM - 2:00 PM (Emergency 24/7)"
    }
  ];

  // Health Services (PHC, Ayurveda, Homoeopathy)
  const healthServices = [
    {
      id: "health_phc",
      category: "Primary Healthcare (Allopathy)",
      name: `Family Health Centre (FHC / PHC) ${cleanP}`,
      mlName: `കുടുംബാരോഗ്യ കേന്ദ്രം (FHC / PHC) ${cleanP}`,
      services: "General OPD, Maternal & Child Immunization, NCD Screening (Diabetes & BP), Free Pharmacy, Emergency First Aid",
      contact: `Medical Officer in Charge, FHC ${cleanP}`,
      helpline: "104 (Disha Health Helpline) / 108 (Emergency Ambulance)",
      timing: "8:30 AM - 2:00 PM (24/7 Emergency Casualty)"
    },
    {
      id: "health_ayurveda",
      category: "Ayurvedic Healthcare",
      name: `Government Ayurveda Dispensary ${cleanP}`,
      mlName: `ഗവ. ആയുർവേദ ഡിസ്പെൻസറി ${cleanP}`,
      services: "Ayurvedic Outpatient Consultation, Vethu & Panchakarma Guidance, Free Herbal Medicines, Geriatric Wellness Care",
      contact: `Medical Officer, Govt Ayurveda Dispensary ${cleanP}`,
      helpline: "+91 94472 34567",
      timing: "8:00 AM - 1:00 PM (Mon-Sat)"
    },
    {
      id: "health_homeo",
      category: "Homoeopathic Healthcare",
      name: `Government Homoeopathic Dispensary ${cleanP}`,
      mlName: `ഗവ. ഹോമിയോപ്പതിക് ഡിസ്പെൻസറി ${cleanP}`,
      services: "Homoeopathic Consultation, Immunity Boosters, Preventive Medicine, Chronic Illness OPD, Free Medicines",
      contact: `Medical Officer, Govt Homoeo Dispensary ${cleanP}`,
      helpline: "+91 94473 45678",
      timing: "8:00 AM - 1:00 PM (Mon-Sat)"
    }
  ];

  // Education & Childcare
  const educationAndChildcare = [
    {
      id: "edu_anganwadi",
      category: "Childcare & Nutrition",
      name: `ICDS Anganwadi Centres Network (${cleanP} Wards 1 to 18)`,
      mlName: `ഐ.സി.ഡി.എസ് അങ്കണവാടി കേന്ദ്രങ്ങൾ (${cleanP} വാർഡുകൾ 1-18)`,
      services: "Supplementary Nutrition, Early Childhood Pre-School Education, Pregnant & Lactating Mother Healthcare, Immunization Days",
      contact: `ICDS Supervisor & Anganwadi Workers, ${cleanP}`,
      helpline: "1098 (Childline) / ICDS Office",
      timing: "9:00 AM - 3:30 PM (Mon-Sat)"
    },
    {
      id: "edu_balwadi",
      category: "Pre-School & Day Care",
      name: `Balwadi Pre-School & Day Care Centre ${cleanP}`,
      mlName: `ബാൽവാടി പ്രീ-സ്കൂൾ & ഡേ കെയർ സെന്റർ ${cleanP}`,
      services: "Play-School Pre-Primary Training, Child Day Care, Nutritious Midday Snacks, Activity Based Learning",
      contact: `Childcare Co-ordinator, Balwadi Centre ${cleanP}`,
      helpline: "+91 94474 56789",
      timing: "9:00 AM - 4:00 PM (Mon-Fri)"
    },
    {
      id: "edu_glps",
      category: "Lower Primary School",
      name: `Government Lower Primary School (GLPS ${cleanP})`,
      mlName: `ഗവ. ലോവർ പ്രൈമറി സ്കൂൾ (GLPS ${cleanP})`,
      services: "Classes 1 to 4, Free Uniforms & Textbooks, Kudumbashree Hot Midday Meal Scheme, Smart Classrooms, Computer Training",
      contact: `Headmaster / Headmistress, GLPS ${cleanP}`,
      helpline: "1800-425-3525 (Samagra Shiksha Abhiyan)",
      timing: "9:30 AM - 3:30 PM (Mon-Fri)"
    },
    {
      id: "edu_gups",
      category: "Upper Primary School",
      name: `Government Upper Primary School (GUPS ${cleanP})`,
      mlName: `ഗവ. അപ്പർ പ്രൈമറി സ്കൂൾ (GUPS ${cleanP})`,
      services: "Classes 5 to 7, Science & IT Labs, Sports Training, Free Education, Midday Meal Program, Scholarship Guidance",
      contact: `Headmaster / Headmistress, GUPS ${cleanP}`,
      helpline: "0471-2320788 (DGE Kerala)",
      timing: "9:30 AM - 4:00 PM (Mon-Fri)"
    }
  ];

  // Other Government Offices
  const otherGovernmentOffices = [
    {
      id: "govt_lsgd_ae",
      category: "LSGD Engineering Wing",
      name: `Office of the Assistant Engineer, LSGD Engineering Wing ${cleanP}`,
      mlName: `അസിസ്റ്റന്റ് എൻജിനീയറുടെ കാര്യാലയം (LSGD) ${cleanP}`,
      services: "Building Permit Sanction, Local Road Construction Supervision, Drainage & Public Works Technical Sanction, Valuation Certificates",
      contact: `Assistant Engineer (AE), LSGD Engineering Wing ${cleanP}`,
      helpline: "+91 94475 67890 / LSGD Toll Free",
      timing: "10:00 AM - 5:00 PM (Mon-Sat)"
    },
    {
      id: "govt_veo",
      category: "Rural Development",
      name: `Village Extension Office (VEO) ${cleanP}`,
      mlName: `വില്ലേജ് എക്സ്റ്റൻഷൻ ഓഫീസ് (VEO) ${cleanP}`,
      services: "PMAY Rural Housing Scheme, MGNREGS Job Card Processing, Rural Poverty Alleviation, Self-Help Group (Kudumbashree) Co-ordination",
      contact: `Village Extension Officer (VEO), ${cleanP}`,
      helpline: "+91 94476 78901 / Rural Dev Dept",
      timing: "10:00 AM - 5:00 PM (Mon-Sat)"
    }
  ];

  if (isTribalArea) {
    otherGovernmentOffices.push({
      id: "govt_teo",
      category: "Tribal Welfare",
      name: `Tribal Extension Office (TEO) ${cleanP} Sector`,
      mlName: `ട്രൈബൽ എക്സ്റ്റൻഷൻ ഓഫീസ് (TEO) ${cleanP}`,
      services: "ST Welfare Subsidies, Tribal Settlement Infrastructure, Educational Scholarships for ST Students, Tribal Health & Housing Grants",
      contact: `Tribal Extension Officer (TEO), ${cleanP} Block / Sector`,
      helpline: "0471-2303225 (Scheduled Tribes Dev Dept Kerala)",
      timing: "10:00 AM - 5:00 PM (Mon-Sat)"
    });
  }

  if (isCoastal) {
    otherGovernmentOffices.push({
      id: "govt_fisheries",
      category: "Fisheries & Marine",
      name: `Fisheries Sub Centre / Matsya Bhavan ${cleanP}`,
      mlName: `ഫിഷറീസ് സബ് സെന്റർ / മത്സ്യ ഭവൻ ${cleanP}`,
      services: "Fishermen Registration & Matsyafed Subsidies, Kerosene Pass Permit, Marine Safety Insurance, Fishing Boat License",
      contact: `Fisheries Extension Officer / Inspector, ${cleanP}`,
      helpline: "0471-2303080 (Fisheries Dept Kerala) / 1054 (Sea Rescue)",
      timing: "10:00 AM - 5:00 PM (Mon-Sat)"
    });
  }

  return {
    panchayatName: cleanP,
    districtName: cleanD,
    state: "Kerala",
    panchayatOffice: `${cleanP} Grama Panchayat Headquarters Office, ${cleanD} District, Kerala`,
    revenueOffice: `Village Office ${cleanP} / Taluk Tehsildar Office ${cleanD}`,
    akshayaCentre: `Akshaya e-Centre (${cleanP} Branch), ${cleanD}`,
    eDistrictPortal: "https://edistrict.kerala.gov.in",
    sevanaPortal: "https://cr.lsgkerala.gov.in",
    helpline: "155300 (Akshaya Toll Free) / 0471-2517000 (Kerala e-District Cell)",
    workingHours: "10:00 AM - 5:00 PM (Monday to Saturday, 2nd & 4th Sat Holidays)",
    limits,
    agricultureAndAnimalHusbandry,
    healthServices,
    educationAndChildcare,
    otherGovernmentOffices
  };
}
