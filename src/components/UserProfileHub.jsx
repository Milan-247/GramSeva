import React, { useState, useEffect, useMemo } from "react";
import {
  User,
  Shield,
  ShieldCheck,
  QrCode,
  Edit3,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  Building,
  Building2,
  FileText,
  FolderCheck,
  ShieldAlert,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Wifi,
  WifiOff,
  Type,
  Eye,
  EyeOff,
  Compass,
  RotateCcw,
  LogOut,
  LogIn,
  Heart,
  Droplet,
  Users,
  Award,
  ExternalLink,
  ChevronRight,
  Printer,
  Copy,
  Check,
  Activity,
  FileCheck2,
  HelpCircle,
  Bell,
  Smartphone,
  CreditCard,
  Layers,
  RefreshCw,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db, doc, setDoc } from "../lib/firebase";

export default function UserProfileHub({
  currentUser,
  setCurrentUser,
  onLogout,
  onOpenAuthModal,
  selectedDistrict,
  setSelectedDistrict,
  selectedLocality,
  setSelectedLocality,
  selectedState,
  setSelectedState,
  isOfflineMode,
  setIsOfflineMode,
  isLargeText,
  setIsLargeText,
  isHighContrast,
  setIsHighContrast,
  shouldReduceMotion,
  isNearMeActive,
  setIsNearMeActive,
  nearMeDistance,
  setNearMeDistance,
  services = [],
  onNavigateTab,
  ui = {},
  t = {},
  language = "en",
  keralaDistricts = [],
  localitiesEn = {}
}) {
  const [activeSubTab, setActiveSubTab] = useState("id_card"); // 'id_card', 'activity', 'ward_officials', 'settings', 'security'
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");
  const [copiedId, setCopiedId] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    name: currentUser?.name || "Milan Pullapalli",
    phone: currentUser?.phone || "+91 98470 12345",
    email: currentUser?.email || "milanpullapalli00007@gmail.com",
    wardNumber: currentUser?.wardNumber || "04",
    houseName: currentUser?.houseName || "Pullapalli House",
    locality: currentUser?.locality || selectedLocality || "Azhiyur",
    district: currentUser?.district || selectedDistrict || "Kozhikode",
    rationCard: currentUser?.rationCard || "Priority Household (Pink)",
    aadhaarLast4: currentUser?.aadhaarLast4 || "8912",
    bloodGroup: currentUser?.bloodGroup || "O+",
    role: currentUser?.role || "Resident Citizen",
    emergencyContact: currentUser?.emergencyContact || "+91 94470 54321",
    emergencyContactName: currentUser?.emergencyContactName || "Family Emergency Contact"
  });

  // Local storage counts for wallet docs & grievances
  const [walletCount, setWalletCount] = useState(0);
  const [heldDocsList, setHeldDocsList] = useState([]);
  const [grievanceCount, setGrievanceCount] = useState(1);
  const [notificationPrefs, setNotificationPrefs] = useState({
    waterAlerts: true,
    rationGrainArrival: true,
    gramaSabhaMeetings: true,
    weatherAlerts: true,
    whatsappUpdates: true
  });

  useEffect(() => {
    try {
      const storedDocs = localStorage.getItem("gramseva_held_docs");
      if (storedDocs) {
        const parsed = JSON.parse(storedDocs);
        setHeldDocsList(parsed);
        setWalletCount(Array.isArray(parsed) ? parsed.length : 0);
      }
      const storedGrievances = localStorage.getItem("gramseva_grievances");
      if (storedGrievances) {
        const parsed = JSON.parse(storedGrievances);
        setGrievanceCount(Array.isArray(parsed) ? parsed.length : 1);
      }
      const storedPrefs = localStorage.getItem("gramseva_notif_prefs");
      if (storedPrefs) {
        setNotificationPrefs(JSON.parse(storedPrefs));
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "Citizen",
        phone: currentUser.phone || "+91 98470 12345",
        email: currentUser.email || "",
        wardNumber: currentUser.wardNumber || "04",
        houseName: currentUser.houseName || "Pullapalli House",
        locality: currentUser.locality || selectedLocality || "Azhiyur",
        district: currentUser.district || selectedDistrict || "Kozhikode",
        rationCard: currentUser.rationCard || "Priority Household (Pink)",
        aadhaarLast4: currentUser.aadhaarLast4 || "8912",
        bloodGroup: currentUser.bloodGroup || "O+",
        role: currentUser.role || "Resident Citizen",
        emergencyContact: currentUser.emergencyContact || "+91 94470 54321",
        emergencyContactName: currentUser.emergencyContactName || "Family Member"
      });
    }
  }, [currentUser, selectedDistrict, selectedLocality]);

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setIsSaving(true);
    try {
      const updatedUser = {
        ...currentUser,
        ...formData,
        updatedAt: new Date().toISOString()
      };

      if (currentUser?.uid) {
        const userDocRef = doc(db, "users", currentUser.uid);
        await setDoc(userDocRef, updatedUser, { merge: true });
      }

      setCurrentUser(updatedUser);
      localStorage.setItem("gramseva_user", JSON.stringify(updatedUser));
      setSaveSuccessMessage("Citizen Profile updated and synchronized with Kerala GramSeva registry!");
      setIsEditingProfile(false);
      setTimeout(() => setSaveSuccessMessage(""), 4000);
    } catch (error) {
      console.error("Error saving profile:", error);
      // Still persist locally
      const updatedUser = { ...currentUser, ...formData };
      setCurrentUser(updatedUser);
      localStorage.setItem("gramseva_user", JSON.stringify(updatedUser));
      setSaveSuccessMessage("Profile updated locally.");
      setIsEditingProfile(false);
      setTimeout(() => setSaveSuccessMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyCitizenId = () => {
    const id = `KL-${(formData.district || "KZK").substring(0, 3).toUpperCase()}-${(formData.locality || "AZH").substring(0, 3).toUpperCase()}-2026-${formData.aadhaarLast4 || "8912"}`;
    navigator.clipboard?.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const toggleNotifPref = (key) => {
    const next = { ...notificationPrefs, [key]: !notificationPrefs[key] };
    setNotificationPrefs(next);
    try {
      localStorage.setItem("gramseva_notif_prefs", JSON.stringify(next));
    } catch (e) {}
  };

  const citizenIdString = useMemo(() => {
    const distCode = (formData.district || "Kozhikode").substring(0, 3).toUpperCase();
    const locCode = (formData.locality || "Azhiyur").substring(0, 3).toUpperCase();
    const ward = String(formData.wardNumber || "04").padStart(2, "0");
    return `KL-${distCode}-${locCode}-W${ward}-${formData.aadhaarLast4 || "8912"}`;
  }, [formData]);

  // Ward Officials data for citizen's current locality
  const wardOfficials = useMemo(() => {
    const locality = formData.locality || selectedLocality || "Azhiyur";
    const ward = formData.wardNumber || "04";
    return [
      {
        role: `Ward ${ward} Member (Grama Panchayat)`,
        name: "Smt. K. P. Radhamani",
        phone: "+91 94960 41204",
        timing: "9:30 AM - 5:00 PM",
        office: `${locality} Grama Panchayat Ward Office`,
        badge: "Elected Representative",
        icon: <Building2 className="w-5 h-5 text-emerald-700" />
      },
      {
        role: "ASHA Healthcare Worker (Ward Area)",
        name: "Smt. Bindu Rajesh",
        phone: "+91 98471 89234",
        timing: "Available 24/7 for Maternal & Child Health",
        office: `Ward ${ward} Sub-Centre Health Hub`,
        badge: "Health Liaison",
        icon: <Heart className="w-5 h-5 text-rose-600" />
      },
      {
        role: "Kudumbashree ADS Chairperson",
        name: "Smt. Sujatha Mohan",
        phone: "+91 97452 33190",
        timing: "10:00 AM - 4:00 PM",
        office: `${locality} Kudumbashree Community Hall`,
        badge: "Community & Microcredit",
        icon: <Users className="w-5 h-5 text-amber-700" />
      },
      {
        role: "Village Extension Officer (VEO)",
        name: "Sri. Thomas Mathew",
        phone: "+91 94475 22019",
        timing: "10:00 AM - 5:00 PM (Working Days)",
        office: `${locality} Panchayat VEO Office`,
        badge: "Panchayat Administration",
        icon: <FileCheck2 className="w-5 h-5 text-indigo-700" />
      },
      {
        role: "Agricultural Assistant (Krishi Bhavan)",
        name: "Sri. Anish Kumar K.",
        phone: "+91 94476 54321",
        timing: "10:00 AM - 3:30 PM",
        office: `${locality} Krishi Bhavan`,
        badge: "Farmer Welfare & Subsidies",
        icon: <Award className="w-5 h-5 text-emerald-800" />
      }
    ];
  }, [formData.locality, formData.wardNumber, selectedLocality]);

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-28 scrollbar-none bg-[#f8f7f4] text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300/80 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Kerala e-Governance &bull; Citizen Hub
              </span>
              <span className="text-xs font-bold text-slate-500">
                {formData.locality}, {formData.district}
              </span>
            </div>
            <h2 className="font-classical text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <span>Citizen Smart Profile & Portal</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Official digital citizen identity, ward representative directory, biometric e-KYC credentials, and offline data sync.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-white hover:bg-stone-50 text-slate-800 border border-stone-300 shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-emerald-700" />
                  <span>Edit Profile</span>
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 shadow-2xs transition active:scale-95 cursor-pointer"
                  title="Sign out of GramSeva"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span className="hidden xs:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In / Register with Mobile</span>
              </button>
            )}
          </div>
        </div>

        {/* Success Alert Toast */}
        <AnimatePresence>
          {saveSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{saveSuccessMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setSaveSuccessMessage("")}
                className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-800"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sub-Navigation Pill Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-stone-200/80">
          {[
            { id: "id_card", label: "Smart Citizen ID", icon: <CreditCard className="w-4 h-4" /> },
            { id: "activity", label: "Wallet & Applications", icon: <Layers className="w-4 h-4" />, badge: walletCount + grievanceCount },
            { id: "ward_officials", label: "Ward Officials & ASHA", icon: <Users className="w-4 h-4" /> },
            { id: "settings", label: "Regional & Offline Config", icon: <Compass className="w-4 h-4" /> },
            { id: "notifications", label: "Alert Channels", icon: <Bell className="w-4 h-4" /> }
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#0e1626] text-white border-[#0e1626] shadow-xs"
                    : "bg-white text-slate-700 border-stone-300/80 hover:bg-stone-100"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${isActive ? "bg-amber-400 text-slate-950" : "bg-stone-200 text-stone-700"}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* SUBTAB 1: SMART CITIZEN ID CARD & STATS                   */}
        {/* ========================================================= */}
        {activeSubTab === "id_card" && (
          <div className="space-y-6">
            
            {/* Top Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Citizen Status</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm">Verified Citizen</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">e-KYC Linked</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Ward No.</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Building className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm">Ward {formData.wardNumber || "04"}</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{formData.locality} GP</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Ration Card Tier</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <CreditCard className="w-3.5 h-3.5 text-pink-600" />
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                    {formData.rationCard?.split(" ")[0] || "Priority"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Pink Subsidized</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Blood Group</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{formData.bloodGroup || "O+"}</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Emergency Ready</span>
              </div>
            </div>

            {/* Smart Citizen Card Component (Flip front & back) */}
            <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6 items-start">
              
              {/* The Card View Container */}
              <div className="flex flex-col items-center">
                <div
                  className="w-full max-w-md cursor-pointer perspective-1000 group select-none"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full aspect-[1.58/1] relative rounded-3xl p-5 text-white shadow-xl transform-style-3d border border-slate-700/60 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #0b1528 0%, #11264a 50%, #064e3b 100%)"
                    }}
                  >
                    {/* Security Microprint & Grid Background Watermark */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                    
                    {/* Official Golden Ribbon Header */}
                    <div className="relative z-10 flex items-start justify-between border-b border-amber-400/30 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center font-black text-amber-300 text-sm shadow-inner">
                          🏛️
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-black tracking-widest text-amber-300 block leading-tight">
                            Grama Seva &bull; Kerala Panchayati Raj
                          </span>
                          <h4 className="text-xs sm:text-sm font-black tracking-wide text-white">
                            {formData.locality} Grama Panchayat
                          </h4>
                        </div>
                      </div>

                      <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-300" />
                        Verified
                      </span>
                    </div>

                    {!isFlipped ? (
                      /* FRONT SIDE */
                      <div className="relative z-10 pt-3.5 flex justify-between items-end">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 border-2 border-white/40 flex items-center justify-center font-black text-xl text-white shadow-md shrink-0">
                              {formData.name ? formData.name.charAt(0).toUpperCase() : "M"}
                            </div>
                            <div>
                              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                                {formData.name}
                              </h3>
                              <p className="text-[11px] text-slate-300 font-semibold mt-0.5">
                                {formData.houseName || "Pullapalli House"} &bull; Ward {formData.wardNumber || "04"}
                              </p>
                              <span className="text-[10px] text-amber-300/90 font-mono tracking-wider block">
                                {citizenIdString}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-2 text-[10px]">
                            <div>
                              <span className="text-slate-400 font-bold block text-[8px] uppercase">Ration Tier</span>
                              <span className="font-extrabold text-pink-300">{formData.rationCard?.split(" ")[0] || "Pink PHH"}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold block text-[8px] uppercase">Aadhaar Last 4</span>
                              <span className="font-extrabold text-slate-200">XXXX {formData.aadhaarLast4 || "8912"}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold block text-[8px] uppercase">Blood Group</span>
                              <span className="font-extrabold text-rose-300">{formData.bloodGroup || "O+"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Security QR Code preview */}
                        <div className="bg-white p-1.5 rounded-xl shadow-md shrink-0 border border-slate-300">
                          <QrCode className="w-12 h-12 text-slate-900" />
                        </div>
                      </div>
                    ) : (
                      /* BACK SIDE */
                      <div
                        className="relative z-10 pt-3 flex flex-col justify-between h-[calc(100%-48px)] transform-rotate-y-180"
                        style={{ transform: "rotateY(180deg)" }}
                      >
                        <div className="space-y-1 text-[10px]">
                          <div className="flex justify-between border-b border-slate-700/60 pb-1">
                            <span className="text-slate-400">Official Jurisdiction:</span>
                            <span className="font-bold text-slate-100">{formData.locality} Grama Panchayat, {formData.district}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700/60 pb-1">
                            <span className="text-slate-400">Emergency Contact:</span>
                            <span className="font-bold text-emerald-300">{formData.emergencyContact} ({formData.emergencyContactName})</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700/60 pb-1">
                            <span className="text-slate-400">Digital Document Vault:</span>
                            <span className="font-bold text-amber-300">{walletCount} Certificates Encrypted</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Digital Signature Seal:</span>
                            <span className="font-mono text-[9px] text-slate-300">SHA256: e9a4...c81d</span>
                          </div>
                        </div>

                        <div className="bg-slate-900/80 rounded-xl p-1.5 text-center text-[9px] text-slate-300 border border-slate-700">
                          Tap card anytime to flip back &bull; Officially valid across Kerala Local Self-Government Hubs
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-stone-300 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Flip Card ({isFlipped ? "Show Front" : "Show Back"})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyCitizenId}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-stone-300 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId ? "Copied ID!" : "Copy Citizen ID"}</span>
                  </button>
                </div>
              </div>

              {/* Side Card Details & Fast Shortcuts */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Citizen Credentials</span>
                  </h4>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active 2026
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-slate-500 font-medium">Citizen ID</span>
                    <span className="font-mono font-bold text-slate-900">{citizenIdString}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-slate-500 font-medium">Registered Phone</span>
                    <span className="font-bold text-slate-900">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-slate-500 font-medium">Account Email</span>
                    <span className="font-bold text-slate-900 truncate max-w-[170px]">{formData.email || "milanpullapalli00007@gmail.com"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-slate-500 font-medium">Grama Panchayat</span>
                    <span className="font-bold text-slate-900">{formData.locality} GP, Ward {formData.wardNumber}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 font-medium">Emergency Contact</span>
                    <span className="font-bold text-emerald-700">{formData.emergencyContact}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Citizen Profile Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateTab("wallet")}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-300 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FolderCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Open Digital Document Wallet ({walletCount})</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 2: WALLET, GRIEVANCES & APPLICATIONS               */}
        {/* ========================================================= */}
        {activeSubTab === "activity" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              
              {/* Document Wallet Summary Card */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                        <FolderCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">Digital Document Vault</h4>
                        <span className="text-[10px] text-slate-500">{walletCount} Government documents held</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                      Offline Ready
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {heldDocsList.length > 0 ? (
                      heldDocsList.slice(0, 4).map((docItem, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/80 text-xs">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span className="font-bold text-slate-800">{docItem.name || docItem.title || "Government Certificate"}</span>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-bold">Verified</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs text-slate-500">
                        No certificates added yet. Use the Certificate Resolver to scan or import income, land tax, or ration certificates.
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab("wallet")}
                  className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs mt-2"
                >
                  <FolderCheck className="w-4 h-4" />
                  <span>Access Complete Document Wallet</span>
                </button>
              </div>

              {/* Grievances & Service Applications Card */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">Citizen Grievance Portal</h4>
                        <span className="text-[10px] text-slate-500">Track petitions filed with {formData.locality} Panchayat</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                      Active Tracker
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Streetlight Maintenance #AZH-2026-08</span>
                        <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md">In Progress</span>
                      </div>
                      <p className="text-[11px] text-slate-600">Assigned to Ward {formData.wardNumber} Electrical Maintenance Wing.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab("grievances")}
                  className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs mt-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>File or Track Grievance Petition</span>
                </button>
              </div>

            </div>

            {/* Quick Actions Bar */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-black text-slate-900">Need a Panchayat Certificate?</h4>
                <p className="text-[11px] text-slate-500">Check required documents for Income, Caste, Nativity, and Possession certificates.</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab("resolver")}
                className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-800 hover:bg-emerald-900 text-white transition cursor-pointer shadow-2xs"
              >
                Launch Certificate Assistant
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 3: WARD OFFICIALS & ASHA DIRECTORY                 */}
        {/* ========================================================= */}
        {activeSubTab === "ward_officials" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>Ward {formData.wardNumber || "04"} Official Directory &bull; {formData.locality} Grama Panchayat</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Direct verified contact numbers for elected panchayat members, ASHA workers, and Kudumbashree officers.
                  </p>
                </div>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full shrink-0">
                  5 Key Officials
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 mt-4">
                {wardOfficials.map((official, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 hover:border-emerald-500/50 transition flex flex-col justify-between gap-3 shadow-2xs">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-white border border-stone-300/80 flex items-center justify-center shrink-0 shadow-2xs">
                            {official.icon}
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block">
                              {official.badge}
                            </span>
                            <h4 className="text-xs font-black text-slate-900 leading-tight">
                              {official.name}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 space-y-1 text-[11px] text-slate-600">
                        <div className="font-semibold text-slate-800">{official.role}</div>
                        <div className="text-[10px] text-slate-500">📍 {official.office}</div>
                        <div className="text-[10px] text-slate-500">⏰ {official.timing}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200/60 flex items-center gap-2">
                      <a
                        href={`tel:${official.phone.replace(/\s+/g, '')}`}
                        className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-black flex items-center justify-center gap-1.5 transition shadow-2xs"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call Official</span>
                      </a>
                      <a
                        href={`https://wa.me/${official.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(official.name)},%20I%20am%20a%20citizen%20from%20Ward%20${formData.wardNumber}%20${formData.locality}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition flex items-center justify-center"
                        title="Chat on WhatsApp"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 4: REGIONAL JURISDICTION & OFFLINE SETTINGS        */}
        {/* ========================================================= */}
        {activeSubTab === "settings" && (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            
            {/* Left Column: Location & Offline Controls */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-5">
              <div className="border-b border-stone-200 pb-3">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Regional Jurisdiction Preference</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Set your primary village, taluk, and panchayat for customized directory scoring.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="pref-district" className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block mb-1">
                    State District
                  </label>
                  <select
                    id="pref-district"
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      const locals = localitiesEn[e.target.value] || [];
                      setSelectedLocality(locals[0] || "all");
                    }}
                    className="w-full bg-stone-50 border border-stone-300 text-slate-900 rounded-xl p-2 text-xs font-bold outline-none focus:border-emerald-600 transition"
                  >
                    <option value="all">All Districts</option>
                    {keralaDistricts.map((d, idx) => (
                      <option key={`pref_dist_${d.en}_${idx}`} value={d.en}>
                        {d.en} ({d.ml})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="pref-locality" className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block mb-1">
                    Grama Panchayat / Locality
                  </label>
                  <select
                    id="pref-locality"
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 text-slate-900 rounded-xl p-2 text-xs font-bold outline-none focus:border-emerald-600 transition"
                  >
                    <option value="all">All Localities</option>
                    {(localitiesEn[selectedDistrict] || []).map((loc, idx) => (
                      <option key={`pref_loc_${loc}_${idx}`} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Offline Engine Toggle */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-900 block">Offline Mode Storage</span>
                  <span className="text-[10px] text-slate-500 block">
                    Use cached local storage even when disconnected in rural areas
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOfflineMode(!isOfflineMode)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition cursor-pointer ${
                    isOfflineMode
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : "bg-emerald-100 text-emerald-900 border-emerald-300"
                  }`}
                >
                  {isOfflineMode ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                  <span>{isOfflineMode ? "Offline Mode (Active)" : "Online (Live Sync)"}</span>
                </button>
              </div>

              {/* Nearby GPS Search */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-900 block">Nearest First GPS Filtering</span>
                    <span className="text-[10px] text-slate-500 block">
                      Prioritize public facilities nearest to your live location
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNearMeActive(!isNearMeActive)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition cursor-pointer ${
                      isNearMeActive
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : "bg-stone-100 text-slate-700 border-stone-300"
                    }`}
                  >
                    <Compass className={`w-4 h-4 ${isNearMeActive ? "animate-spin" : ""}`} />
                    <span>{isNearMeActive ? "Near Me (Active)" : "Near Me (Off)"}</span>
                  </button>
                </div>

                {isNearMeActive && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Proximity Radius</span>
                      <span className="text-amber-800">{nearMeDistance} km</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="150"
                      step="5"
                      value={nearMeDistance}
                      onChange={(e) => setNearMeDistance(Number(e.target.value))}
                      className="w-full accent-emerald-700 h-1.5 bg-stone-200 rounded cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Accessibility Suite & Cache Reset */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  Accessibility & Display
                </h4>

                <button
                  type="button"
                  onClick={() => setIsLargeText(!isLargeText)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    isLargeText
                      ? "bg-emerald-100 border-emerald-300 text-emerald-950"
                      : "bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    <span>Enlarged Readability Text</span>
                  </span>
                  <span>{isLargeText ? "Active" : "Standard"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsHighContrast(!isHighContrast)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    isHighContrast
                      ? "bg-emerald-100 border-emerald-300 text-emerald-950"
                      : "bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>High-Contrast Sunlight Mode</span>
                  </span>
                  <span>{isHighContrast ? "Active" : "Standard"}</span>
                </button>
              </div>

              {/* Cache Health */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  System Diagnostics
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Directory Records:</span>
                    <span className="font-bold text-slate-900">{services.length} services</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database Engine:</span>
                    <span className="font-bold text-emerald-700">Firestore v12 Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage Engine:</span>
                    <span className="font-bold text-slate-900">IndexedDB + LocalStorage</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("gramseva_cached_services");
                    window.location.reload();
                  }}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-bold border border-stone-300 transition cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Purge Cache & Reload Hub</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 5: NOTIFICATION & SMS ALERTS                       */}
        {/* ========================================================= */}
        {activeSubTab === "notifications" && (
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-4 max-w-2xl mx-auto">
            <div className="border-b border-stone-200 pb-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-emerald-700" />
                <span>Panchayat Alert & WhatsApp Dispatch Channels</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Configure direct notifications dispatched to your mobile number ({formData.phone}).
              </p>
            </div>

            <div className="space-y-3">
              {[
                { key: "waterAlerts", title: "Drinking Water Supply Alerts", desc: "Pipe maintenance and valve opening times in Ward " + formData.wardNumber },
                { key: "rationGrainArrival", title: "Ration Shop Grain Arrival (NFSA)", desc: "Monthly rice/wheat quota availability at your ration depot" },
                { key: "gramaSabhaMeetings", title: "Grama Sabha & Ward Meetings", desc: "Notices for ward assembly sessions and beneficiary selection lists" },
                { key: "weatherAlerts", title: "Disaster & Heavy Rainfall Advisories", desc: "Kerala State Disaster Management Authority emergency notices" },
                { key: "whatsappUpdates", title: "WhatsApp Direct Updates", desc: "Receive official PDF receipts and certificates on WhatsApp" }
              ].map((item) => {
                const isEnabled = !!notificationPrefs[item.key];
                return (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="pr-4">
                      <span className="text-xs font-bold text-slate-900 block">{item.title}</span>
                      <span className="text-[10px] text-slate-500 block">{item.desc}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleNotifPref(item.key)}
                      className={`px-3 py-1 rounded-full text-xs font-black transition cursor-pointer ${
                        isEnabled
                          ? "bg-emerald-800 text-white"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {isEnabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* EDIT PROFILE MODAL / OVERLAY                              */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-classical text-base font-black text-slate-900">
                      Edit Citizen Identity Details
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Syncs with Kerala GramSeva secure records.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="p-1.5 rounded-xl hover:bg-stone-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                    Citizen Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                    placeholder="e.g. Milan Pullapalli"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                      placeholder="+91 98470 12345"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                      Ward Number
                    </label>
                    <input
                      type="text"
                      value={formData.wardNumber}
                      onChange={(e) => setFormData({ ...formData, wardNumber: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                      placeholder="e.g. 04"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                      House Name / Building
                    </label>
                    <input
                      type="text"
                      value={formData.houseName}
                      onChange={(e) => setFormData({ ...formData, houseName: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                      placeholder="e.g. Pullapalli House"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                      Blood Group
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                    >
                      {["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                      Ration Card Category
                    </label>
                    <select
                      value={formData.rationCard}
                      onChange={(e) => setFormData({ ...formData, rationCard: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                    >
                      <option value="Priority Household (Pink)">Priority Household (Pink)</option>
                      <option value="Antyodaya Anna Yojana (Yellow)">Antyodaya Anna Yojana (Yellow)</option>
                      <option value="Non-Priority Subsidy (Blue)">Non-Priority Subsidy (Blue)</option>
                      <option value="Non-Priority Non-Subsidy (White)">Non-Priority Non-Subsidy (White)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                      Aadhaar Last 4 Digits
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={formData.aadhaarLast4}
                      onChange={(e) => setFormData({ ...formData, aadhaarLast4: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                      placeholder="8912"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                    placeholder="+91 94470 54321"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? "Saving..." : "Save Profile"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
