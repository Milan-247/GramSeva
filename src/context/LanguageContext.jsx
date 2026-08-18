import { createContext, useContext, useEffect, useState } from "react";
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from "../data/services";
const LanguageContext = createContext(void 0);
function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("village_directory_lang");
      if (saved && (saved === "en" || saved === "hi" || saved === "te" || saved === "ml" || saved === "kn")) {
        return saved;
      }
    }
    return "en";
  });
  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("village_directory_lang", lang);
  };
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS["en"];
  return <LanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>;
}
function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
export {
  LanguageProvider,
  useLanguage
};
