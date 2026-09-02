import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  ThumbsUp, 
  Trash2, 
  ExternalLink, 
  Camera, 
  Sparkles, 
  Share2, 
  FileText, 
  ShieldCheck,
  Building2,
  Stethoscope,
  Waves,
  Wheat,
  School,
  Landmark,
  Compass,
  UploadCloud,
  Check,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, increment } from "firebase/firestore";

const STATE_OPTIONS = [
  { id: "kerala", name: "Kerala", defaultDistrict: "Kozhikode", defaultLocality: "Mukkali" },
  { id: "tamilnadu", name: "Tamil Nadu", defaultDistrict: "Chennai", defaultLocality: "Alandur" },
  { id: "karnataka", name: "Karnataka", defaultDistrict: "Bengaluru Urban", defaultLocality: "Anekal" },
  { id: "other", name: "Other / All India", defaultDistrict: "General District", defaultLocality: "Main Ward" }
];

export default function ServiceContributionHub({
  services,
  onAddService,
  onDeleteCustomService,
  activeState = "kerala",
  keralaDistricts = [],
  localitiesEn = {},
  tamilNaduDistricts = [],
  tamilNaduPanchayats = {},
  karnatakaDistricts = [],
  karnatakaPanchayats = {},
  currentUser,
  navigateToTab,
  onSelectDetailService
}) {
  const { language, t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState("form"); // "form" | "community"
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Form State
  const [selectedState, setSelectedState] = useState(activeState || "kerala");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("health");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("Kozhikode");
  const [locality, setLocality] = useState("Mukkali");
  const [isEmergency, setIsEmergency] = useState(false);
  const [hasWheelchairAccess, setHasWheelchairAccess] = useState(false);
  const [hasWhatsApp, setHasWhatsApp] = useState(false);
  const [acceptsUpi, setAcceptsUpi] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [votedServiceIds, setVotedServiceIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gramseva_voted_services") || "[]");
    } catch {
      return [];
    }
  });

  // Dynamic districts based on state
  const availableDistricts = useMemo(() => {
    let list = [];
    if (selectedState === "tamilnadu") {
      list = tamilNaduDistricts.length ? tamilNaduDistricts : ["Chennai", "Coimbatore", "Madurai", "Salem"];
    } else if (selectedState === "karnataka") {
      list = karnatakaDistricts.length ? karnatakaDistricts : ["Bengaluru Urban", "Mysuru", "Dakshina Kannada"];
    } else if (selectedState === "other") {
      list = ["Central District", "North Ward", "South Zone", "East Block"];
    } else {
      list = keralaDistricts.length ? keralaDistricts : ["Kozhikode", "Kannur", "Wayanad", "Ernakulam", "Thiruvananthapuram"];
    }
    return list.map((d) => (typeof d === "string" ? d : d.en || d.name || d.id || "District"));
  }, [selectedState, tamilNaduDistricts, karnatakaDistricts, keralaDistricts]);

  // Update default district on state change
  useEffect(() => {
    if (availableDistricts.length > 0 && !availableDistricts.includes(district)) {
      const firstDist = availableDistricts[0];
      setDistrict(firstDist);
    }
  }, [selectedState, availableDistricts, district]);

  // Dynamic localities
  const availableLocalities = useMemo(() => {
    let list = [];
    if (selectedState === "tamilnadu") {
      list = tamilNaduPanchayats[district] || ["Town Center", "Gram Panchayat Office", "Taluk Ward 1"];
    } else if (selectedState === "karnataka") {
      list = karnatakaPanchayats[district] || ["Main Bazaar", "Grama Panchayat", "Ward 1"];
    } else if (selectedState === "other") {
      list = ["Main Town", "Sector 1", "Civic Center"];
    } else {
      list = localitiesEn[district] || ["Mukkali", "Azhiyur", "Kalleri", "Panchayat Center"];
    }
    return list.map((loc) =>
      typeof loc === "string" ? loc : loc.en || loc.name || loc.ml || loc.kn || loc.ta || loc.te || "Panchayat Center"
    );
  }, [selectedState, district, tamilNaduPanchayats, karnatakaPanchayats, localitiesEn]);

  // Update default locality on district change
  useEffect(() => {
    if (availableLocalities.length > 0 && !availableLocalities.includes(locality)) {
      setLocality(availableLocalities[0]);
    }
  }, [availableLocalities, locality]);

  // Custom / Community services list
  const customServices = useMemo(() => {
    return services.filter(s => s.id?.startsWith("custom-serv-") || s.isCommunityContributed);
  }, [services]);

  // Filtered community list
  const filteredCustomServices = useMemo(() => {
    return customServices.filter(service => {
      if (categoryFilter !== "all" && service.categoryKey !== categoryFilter) return false;
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const titleStr = (service.translations?.[language]?.title || service.translations?.en?.title || "").toLowerCase();
      const descStr = (service.translations?.[language]?.description || service.translations?.en?.description || "").toLowerCase();
      const locStr = (service.localityName || "").toLowerCase();
      const distStr = (service.districtName || "").toLowerCase();
      return titleStr.includes(query) || descStr.includes(query) || locStr.includes(query) || distStr.includes(query);
    });
  }, [customServices, categoryFilter, searchQuery, language]);

  // Handle Photo Upload
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image is larger than 2MB. Please choose a smaller photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setPhotoPreview(uploadEvent.target?.result);
    };
    reader.readAsDataURL(file);
  };

  // Upvote / Endorse
  const handleToggleVote = (serviceId) => {
    const isVoted = votedServiceIds.includes(serviceId);
    let updated;
    if (isVoted) {
      updated = votedServiceIds.filter(id => id !== serviceId);
    } else {
      updated = [...votedServiceIds, serviceId];
    }
    setVotedServiceIds(updated);
    localStorage.setItem("gramseva_voted_services", JSON.stringify(updated));
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !phoneNumber.trim()) {
      alert("Please provide at least a service title and contact phone number.");
      return;
    }

    setIsSubmitting(true);
    const newId = `custom-serv-${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];

    const serviceTranslationObj = {
      title: title.trim(),
      description: description.trim() || "Community verified local public service and utility desk.",
      location: address.trim() || `${locality}, ${district}`,
      hours: operatingHours.trim() || "9:00 AM - 5:00 PM (Working Days)",
      contact: contactName.trim() || "Local Duty Desk"
    };

    const newService = {
      id: newId,
      categoryKey: category,
      phoneNumber: phoneNumber.trim(),
      lastVerified: today,
      isEmergency,
      hasWheelchairAccess,
      hasWhatsApp,
      acceptsUpi,
      districtName: district,
      localityName: locality,
      stateKey: selectedState,
      isCommunityContributed: true,
      contributedBy: currentUser?.name || "Local Resident",
      endorsementsCount: 1,
      photoUrl: photoPreview || null,
      verificationStatus: "community_verified", // "community_verified" | "pending_audit"
      translations: {
        en: serviceTranslationObj,
        ml: { ...serviceTranslationObj, title: `${title.trim()} (സന്നദ്ധസേവന സമർപ്പണം)` },
        hi: { ...serviceTranslationObj, title: `${title.trim()} (नागरिक योगदान)` },
        te: { ...serviceTranslationObj, title: `${title.trim()} (పౌర సహకారం)` },
        kn: { ...serviceTranslationObj, title: `${title.trim()} (ನಾಗರಿಕ ಸೇವೆ)` },
        ta: { ...serviceTranslationObj, title: `${title.trim()} (குடிமக்கள் சேவை)` }
      }
    };

    try {
      // 1. Call parent handler to update React state & localStorage
      if (onAddService) {
        onAddService(newService);
      }

      // 2. Optionally sync to Firestore if db is active
      if (db) {
        try {
          const suggestionsCol = collection(db, "service_suggestions");
          await addDoc(suggestionsCol, {
            ...newService,
            createdAt: new Date().toISOString()
          });
        } catch (dbErr) {
          console.warn("Firestore sync skipped (offline or permissions):", dbErr);
        }
      }

      // Reset form
      setTitle("");
      setDescription("");
      setPhoneNumber("");
      setContactName("");
      setOperatingHours("");
      setAddress("");
      setIsEmergency(false);
      setHasWheelchairAccess(false);
      setHasWhatsApp(false);
      setAcceptsUpi(false);
      setPhotoPreview(null);

      // Auto-vote own created service
      const updatedVotes = [...votedServiceIds, newId];
      setVotedServiceIds(updatedVotes);
      localStorage.setItem("gramseva_voted_services", JSON.stringify(updatedVotes));

      setFeedbackMessage({
        type: "success",
        text: "Service suggested and published to directory & map!"
      });

      // Switch to community tab to show their added entry
      setTimeout(() => {
        setActiveSubTab("community");
        setFeedbackMessage(null);
      }, 1800);
    } catch (err) {
      console.error("Error submitting service:", err);
      setFeedbackMessage({
        type: "error",
        text: "Could not save service. Saved to local session cache."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryDetails = (catKey) => {
    switch (catKey) {
      case "health":
        return { label: t?.health || "Health", icon: <Stethoscope className="w-4 h-4" />, color: "bg-rose-50 text-rose-700 border-rose-200" };
      case "water":
        return { label: t?.water || "Water", icon: <Waves className="w-4 h-4" />, color: "bg-cyan-50 text-cyan-700 border-cyan-200" };
      case "agriculture":
        return { label: t?.agriculture || "Agriculture", icon: <Wheat className="w-4 h-4" />, color: "bg-amber-50 text-amber-800 border-amber-200" };
      case "education":
        return { label: t?.education || "Education", icon: <School className="w-4 h-4" />, color: "bg-purple-50 text-purple-700 border-purple-200" };
      default:
        return { label: t?.government || "Government", icon: <Landmark className="w-4 h-4" />, color: "bg-emerald-50 text-emerald-800 border-emerald-200" };
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-stone-50 overflow-y-auto pb-24">
      {/* Top Header Banner */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-8 py-5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Citizen Contribution & Verification Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{t?.addServiceTitle || "Suggest & Add Community Services"}</span>
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl mt-1">
              Help build a verified local directory for your Panchayat. Submissions are instantly stored, accessible offline, and searchable on the live map.
            </p>
          </div>

          {/* Sub-tab Navigation Switcher */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-300 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveSubTab("form")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeSubTab === "form"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Contribute Service</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("community")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeSubTab === "community"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Community List ({customServices.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-6">
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold ${
              feedbackMessage.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                : "bg-rose-50 text-rose-900 border-rose-300"
            }`}
          >
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </motion.div>
        )}

        {/* Tab 1: Contribution Form */}
        {activeSubTab === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 shadow-xs">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* 1. Jurisdiction / State Selector */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    1. Select State & Region *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STATE_OPTIONS.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedState(st.id)}
                        className={`p-2.5 rounded-xl border text-xs font-black text-center transition cursor-pointer ${
                          selectedState === st.id
                            ? "bg-emerald-800 text-white border-emerald-900 shadow-2xs"
                            : "bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        {st.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Service Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="serv-title" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                      Service / Office Title *
                    </label>
                    <input
                      id="serv-title"
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Community Health Sub-Centre / Krishi Bhavan"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="serv-category" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                      Category *
                    </label>
                    <select
                      id="serv-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-none transition"
                    >
                      <option value="health">🏥 Health & Hospitals</option>
                      <option value="water">💧 Water & Sanitation</option>
                      <option value="agriculture">🌾 Agriculture & Krishi</option>
                      <option value="education">🏫 Education & Schools</option>
                      <option value="government">🏛️ Local Govt & Panchayat</option>
                    </select>
                  </div>
                </div>

                {/* 3. District & Locality Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="serv-district" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                      District / Region *
                    </label>
                    <select
                      id="serv-district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-none transition"
                    >
                      {availableDistricts.map((d, i) => (
                        <option key={`dist_${d}_${i}`} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="serv-locality" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                      Panchayat / Locality / Ward *
                    </label>
                    <select
                      id="serv-locality"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-none transition"
                    >
                      {availableLocalities.map((loc, i) => (
                        <option key={`loc_${loc}_${i}`} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Phone, Contact & Operating Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="serv-phone" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      id="serv-phone"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98470 12345 / 0496 250123"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 outline-none transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="serv-contact" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                      Contact Person / Officer
                    </label>
                    <input
                      id="serv-contact"
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Village Officer / Dr. Suresh"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 outline-none transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="serv-hours" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                      Working Hours
                    </label>
                    <input
                      id="serv-hours"
                      type="text"
                      value={operatingHours}
                      onChange={(e) => setOperatingHours(e.target.value)}
                      placeholder="e.g. 9:00 AM - 4:30 PM"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 outline-none transition"
                    />
                  </div>
                </div>

                {/* 5. Address / Landmark & Description */}
                <div>
                  <label htmlFor="serv-address" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Landmark / Full Street Address
                  </label>
                  <input
                    id="serv-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Near Old Bus Stand, Opp. Cooperative Bank"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="serv-desc" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Description of Services & Available Facilities
                  </label>
                  <textarea
                    id="serv-desc"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide helpful details for citizens: which certificates, medical tests, schemes, or applications are handled here..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 outline-none resize-none transition"
                  />
                </div>

                {/* 6. Special Feature Badges */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <span className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                    Additional Facility Amenities
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isEmergency}
                        onChange={(e) => setIsEmergency(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-600 border-stone-300 focus:ring-rose-500"
                      />
                      <span className="font-bold text-slate-800">🚨 24/7 Emergency Service</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasWheelchairAccess}
                        onChange={(e) => setHasWheelchairAccess(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 border-stone-300 focus:ring-emerald-500"
                      />
                      <span className="font-bold text-slate-800">♿ Wheelchair Accessible</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasWhatsApp}
                        onChange={(e) => setHasWhatsApp(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 border-stone-300 focus:ring-emerald-500"
                      />
                      <span className="font-bold text-slate-800">💬 Official WhatsApp Helpline</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={acceptsUpi}
                        onChange={(e) => setAcceptsUpi(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 border-stone-300 focus:ring-emerald-500"
                      />
                      <span className="font-bold text-slate-800">📱 UPI / QR Payments Supported</span>
                    </label>
                  </div>
                </div>

                {/* 7. Image / Visiting Card Upload */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Optional Photo / Office Nameboard
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer transition">
                      <Camera className="w-4 h-4 text-emerald-700" />
                      <span>{photoPreview ? "Change Photo" : "Upload Picture"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                    {photoPreview && (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-12 h-12 object-cover rounded-xl border border-stone-300 shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setPhotoPreview(null)}
                          className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Saving & Publishing...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Publish Service to Directory</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Guidelines Column */}
            <div className="space-y-5">
              <div className="bg-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-900 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-black tracking-wide">Community Governance Standards</h3>
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  GramSeva operates on trusted peer verification. When you contribute an office or emergency desk:
                </p>
                <ul className="text-xs text-emerald-100/80 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>It is immediately cached offline on your device and rendered on the map.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Other residents in your ward can review and endorse the contact.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Panchayat officials can audit community submissions for official verification.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-slate-500" />
                  <span>Recent Contributed Services</span>
                </h4>
                {customServices.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">
                    No custom services contributed yet. Be the first to suggest a local health center, water desk, or school!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {customServices.slice(0, 3).map((item) => {
                      const tr = item.translations?.[language] || item.translations?.en || {};
                      return (
                        <div key={item.id} className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{tr.title}</p>
                            <p className="text-[10px] text-slate-500">{item.localityName}, {item.districtName}</p>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full shrink-0">
                            Added
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Community Submissions & Verification View */}
        {activeSubTab === "community" && (
          <div className="space-y-4">
            {/* Search and Category Filter Strip */}
            <div className="bg-white border border-stone-200 rounded-2xl p-3.5 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search community submissions by title, locality or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-600 transition"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                {["all", "health", "government", "water", "agriculture", "education"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition capitalize shrink-0 cursor-pointer ${
                      categoryFilter === cat
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {cat === "all" ? "All Categories" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List Grid */}
            {filteredCustomServices.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <Building2 className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">No community suggestions found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery ? "No matching services found for your search query." : "You haven't contributed any custom services yet."}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("form")}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition cursor-pointer"
                >
                  + Add the First Service
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCustomServices.map((service) => {
                  const tr = service.translations?.[language] || service.translations?.en || {};
                  const catConfig = getCategoryDetails(service.categoryKey);
                  const isVoted = votedServiceIds.includes(service.id);
                  const totalVotes = (service.endorsementsCount || 1) + (isVoted ? 1 : 0);

                  return (
                    <div
                      key={service.id}
                      className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className={`p-2 rounded-xl ${catConfig.color}`}>
                              {catConfig.icon}
                            </span>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                {catConfig.label}
                              </span>
                              <h3 className="text-sm font-black text-slate-900 leading-tight">
                                {tr.title}
                              </h3>
                            </div>
                          </div>

                          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Community Verified</span>
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {tr.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{service.localityName || tr.location}, {service.districtName}</span>
                          </div>

                          <div className="flex items-center gap-1.5 truncate">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-mono">{service.phoneNumber}</span>
                          </div>

                          {tr.hours && (
                            <div className="flex items-center gap-1.5 truncate col-span-2">
                              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{tr.hours}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                        {/* Upvote Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleVote(service.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            isVoted
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                              : "bg-stone-50 text-slate-600 border border-stone-200 hover:bg-stone-100"
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${isVoted ? "text-emerald-700 fill-emerald-600" : "text-slate-400"}`} />
                          <span>{totalVotes} Endorsements</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {onSelectDetailService && (
                            <button
                              type="button"
                              onClick={() => onSelectDetailService(service)}
                              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          {onDeleteCustomService && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to remove this community contribution?")) {
                                  onDeleteCustomService(service.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete Service"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
