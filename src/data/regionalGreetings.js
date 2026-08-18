/**
 * Multilingual regional state welcome banners and metadata
 */

export const STATE_WELCOME_GREETINGS = {
  kerala: {
    emoji: "🌴",
    en: "Swagatham! Welcome to Kerala's GramSeva Citizen Services Hub",
    ml: "സ്വാഗതം! കേരള ഗ്രാമസേവ പൗരസേവന കേന്ദ്രത്തിലേക്ക് സ്വാഗതം",
    hi: "स्वागतम्! केरल ग्राम सेवा नागरिक सेवा केंद्र में आपका स्वागत है",
    kn: "ಸ್ವಾಗತ! ಕೇರಳ ಗ್ರಾಮ ಸೇವಾ ನಾಗರಿಕ ಸೇವಾ ಕೇಂದ್ರಕ್ಕೆ ಸ್ವಾಗತ",
    te: "స్వాగతం! కేరళ గ్రామ సేవా పౌర సేవల కేంద్రానికి స్వాగతం"
  },
  karnataka: {
    emoji: "🏰",
    en: "Suswagatha! Welcome to Karnataka Grama Seva e-Governance Portal",
    ml: "സുസ്വാഗതം! കർണാടക ഗ്രാമസേവ ഇ-ഗവേണൻസ് പോർട്ടലിലേക്ക് സ്വാഗതം",
    hi: "सुस्वागतम्! कर्नाटक ग्राम सेवा ई-गवर्नेंस पोर्टल में आपका स्वागत है",
    kn: "ಸುಸ್ವಾಗತ! ಕರ್ನಾಟಕ ಗ್ರಾಮ ಸೇವಾ ಇ-ಆಡಳಿತ ಪೋರ್ಟಲ್‌ಗೆ ಸುಸ್ವಾಗತ",
    te: "సుస్వాగతం! కర్ణాటక గ్రామ సేవా ఈ-గవర్నెన్స్ పోర్టల్‌కు స్వాగతం"
  },
  tamilnadu: {
    emoji: "🛕",
    en: "Vanakkam! Welcome to Tamil Nadu e-Sevai Rural Governance Hub",
    ml: "വണക്കം! തമിഴ്‌നാട് ഇ-സേവൈ ഗ്രാമീണ ഭരണ കേന്ദ്രത്തിലേക്ക് സ്വാഗതം",
    hi: "வணக்கம்! तमिलनाडु ई-सेवै ग्रामीण शासन पोर्टल में आपका स्वागत है",
    kn: "வணக்கம்! ತಮಿಳುನಾಡು ಇ-ಸೇವೆ ಗ್ರಾಮೀಣ ಆಡಳಿತ ಕೇಂದ್ರಕ್ಕೆ ಸುಸ್ವಾಗತ",
    te: "வணக்கம்! తమిళనాడు ఈ-సేవై గ్రామీణ పాలన కేంద్రానికి స్వాగతం"
  },
  andhra: {
    emoji: "🌾",
    en: "Namaskaram! Welcome to Andhra Pradesh Grama Sachivalayam Portal",
    ml: "നമസ്കാരം! ആന്ധ്രാപ്രദേശ് ഗ്രാമ സചിവാലയം പൗരകേന്ദ്രത്തിലേക്ക് സ്വാഗതം",
    hi: "नमस्कारम्! आंध्र प्रदेश ग्राम सचिवालयम नागरिक पोर्टल में आपका स्वागत है",
    kn: "ನಮಸ್ಕಾರಂ! ಆಂಧ್ರ ಪ್ರದೇಶ ಗ್ರಾಮ ಸಚಿವಾಲಯಂ ನಾಗರಿಕ ಪೋರ್ಟಲ್‌ಗೆ ಸುಸ್ವಾಗತ",
    te: "నమస్కారం! ఆంధ్రప్రదేశ్ గ్రామ సచివాలయం పౌర సేవల పోర్టల్‌కు స్వాగతం"
  },
  all: {
    emoji: "🇮🇳",
    en: "Namaste! Welcome to Pan-India GramSeva Rural Citizen Portal",
    ml: "നമസ്തേ! ഭാരതീയ ഗ്രാമസേവ ഗ്രാമീണ പൗരസേവന കേന്ദ്രത്തിലേക്ക് സ്വാഗതം",
    hi: "नमस्ते! ऑल-इंडिया ग्राम सेवा ग्रामीण नागरिक पोर्टल में आपका स्वागत है",
    kn: "നമസ്ത്തെ! ಭಾರತೀಯ ಗ್ರಾಮ ಸೇವಾ ಗ್ರಾಮೀಣ ನಾಗರಿಕ ಪೋರ್ಟಲ್‌ಗೆ ಸುಸ್ವಾಗತ",
    te: "నమస్తే! భారతీయ గ్రామ సేవా గ్రామీణ పౌర సేవల పోర్టల్‌కు స్వాగతం"
  }
};

export const getStateWelcomeGreeting = (stateId, language = "en") => {
  const stateKey = String(stateId || "all").toLowerCase().trim();
  const stateData = STATE_WELCOME_GREETINGS[stateKey] || STATE_WELCOME_GREETINGS.all;
  return {
    text: stateData[language] || stateData.en || STATE_WELCOME_GREETINGS.all.en,
    emoji: stateData.emoji || "🇮🇳"
  };
};
