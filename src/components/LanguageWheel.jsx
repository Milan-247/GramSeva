import React, { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

/**
 * Horizontal Scroll Wheel Language Selector with smooth transitions, 
 * spring animated indicators, snap scrolling, and mouse wheel/chevron support.
 */
export default function LanguageWheel({ className = "", compact = false, onSelect }) {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const scrollContainerRef = useRef(null);
  const activeItemRef = useRef(null);

  // Auto-scroll active item to center of wheel when selection changes
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [language]);

  const handleSelect = (code) => {
    setLanguage(code);
    if (onSelect) onSelect(code);
  };

  // Convert vertical mouse scroll into smooth horizontal scroll
  const handleWheel = (e) => {
    if (scrollContainerRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scrollContainerRef.current.scrollLeft += e.deltaY * 0.8;
      }
    }
  };

  const handlePrev = () => {
    const currentIndex = supportedLanguages.findIndex((l) => l.code === language);
    const prevIndex = (currentIndex - 1 + supportedLanguages.length) % supportedLanguages.length;
    handleSelect(supportedLanguages[prevIndex].code);
  };

  const handleNext = () => {
    const currentIndex = supportedLanguages.findIndex((l) => l.code === language);
    const nextIndex = (currentIndex + 1) % supportedLanguages.length;
    handleSelect(supportedLanguages[nextIndex].code);
  };

  return (
    <div className={`relative flex items-center bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 p-1 shadow-inner max-w-full overflow-hidden group ${className}`}>
      {/* Left scroll button */}
      <button
        type="button"
        onClick={handlePrev}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-xl text-emerald-200/80 hover:text-white hover:bg-white/15 active:scale-95 transition z-20"
        title="Previous Language"
        aria-label="Previous Language"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Wheel Edge Fade Masks for continuous wheel depth */}
      <div className="pointer-events-none absolute left-7 inset-y-0 w-5 bg-gradient-to-r from-emerald-950/90 via-emerald-950/40 to-transparent z-10" />
      <div className="pointer-events-none absolute right-7 inset-y-0 w-5 bg-gradient-to-l from-emerald-950/90 via-emerald-950/40 to-transparent z-10" />

      {/* Horizontal Scroll Wheel Container */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none snap-x snap-mandatory py-0.5 px-2 select-none scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {supportedLanguages.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              type="button"
              key={lang.code}
              ref={isActive ? activeItemRef : null}
              onClick={() => handleSelect(lang.code)}
              aria-selected={isActive}
              role="tab"
              className={`relative shrink-0 snap-center flex items-center gap-1.5 ${
                compact ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-xs sm:text-sm"
              } rounded-xl font-bold transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                isActive
                  ? "text-white font-black scale-105 shadow-md"
                  : "text-emerald-100/70 hover:text-white hover:scale-100 opacity-75 hover:opacity-100"
              }`}
            >
              {/* Smooth spring animated active background indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeLanguageWheelIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 rounded-xl shadow-lg border border-emerald-300/40"
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}

              <span className="relative z-10 text-sm leading-none">{lang.flag}</span>
              <span className="relative z-10 font-sans tracking-tight whitespace-nowrap">{lang.nativeName}</span>
              <span
                className={`relative z-10 text-[9px] font-mono font-bold uppercase px-1 py-0.5 rounded ${
                  isActive ? "bg-black/30 text-emerald-100" : "bg-white/10 text-emerald-300/80"
                }`}
              >
                {lang.code}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right scroll button */}
      <button
        type="button"
        onClick={handleNext}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-xl text-emerald-200/80 hover:text-white hover:bg-white/15 active:scale-95 transition z-20"
        title="Next Language"
        aria-label="Next Language"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
