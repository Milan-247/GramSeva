import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
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
  Trash2,
  Lock,
  Unlock,
  Upload,
  AlertTriangle,
  Send,
  Sliders,
  Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db, doc, setDoc } from "../lib/firebase";

export const CITIZEN_ROLES = [
  { id: "resident", label: "Resident Citizen", badge: "General Citizen", color: "bg-emerald-100 text-emerald-900 border-emerald-300" },
  { id: "farmer", label: "Farmer / Karshaka Welfare", badge: "Agriculturalist", color: "bg-amber-100 text-amber-900 border-amber-300" },
  { id: "senior", label: "Senior Citizen (Vayomithram)", badge: "Senior Citizen", color: "bg-purple-100 text-purple-900 border-purple-300" },
  { id: "kudumbashree", label: "Kudumbashree ADS Member", badge: "Kudumbashree / SHG", color: "bg-rose-100 text-rose-900 border-rose-300" },
  { id: "ward_rep", label: "Ward Representative / Member", badge: "Panchayat Official", color: "bg-blue-100 text-blue-900 border-blue-300" },
  { id: "volunteer", label: "Youth Volunteer (Sannadha Sena)", badge: "Civic Volunteer", color: "bg-teal-100 text-teal-900 border-teal-300" },
  { id: "student", label: "Student / Scholarship Seeker", badge: "Student / Youth", color: "bg-indigo-100 text-indigo-900 border-indigo-300" }
];

export const STATE_CONFIGS = [
  { id: "kerala", label: "Kerala", shortCode: "KL", script: "കേരളം", primaryLang: "ml", defaultDist: "Kozhikode", defaultLoc: "Azhiyur" },
  { id: "karnataka", label: "Karnataka", shortCode: "KA", script: "ಕರ್ನಾಟಕ", primaryLang: "kn", defaultDist: "Bengaluru Urban", defaultLoc: "Anekal" },
  { id: "tamilnadu", label: "Tamil Nadu", shortCode: "TN", script: "தமிழ்நாடு", primaryLang: "ta", defaultDist: "Coimbatore", defaultLoc: "Pollachi North" },
  { id: "andhrapradesh", label: "Andhra Pradesh", shortCode: "AP", script: "ఆంధ్రప్రదేశ్", primaryLang: "te", defaultDist: "Tirupati", defaultLoc: "Chandragiri" }
];

export default function UserProfileHub({
  currentUser,
  setCurrentUser,
  onLogout,
  onOpenAuthModal,
  onOpenAdminLogin,
  selectedDistrict = "Kozhikode",
  setSelectedDistrict,
  selectedLocality = "Azhiyur",
  setSelectedLocality,
  selectedState = "kerala",
  setSelectedState,
  isOfflineMode = false,
  setIsOfflineMode,
  isLargeText = false,
  setIsLargeText,
  isHighContrast = false,
  setIsHighContrast,
  shouldReduceMotion = false,
  isNearMeActive = false,
  setIsNearMeActive,
  nearMeDistance = 25,
  setNearMeDistance,
  services = [],
  onNavigateTab,
  ui = {},
  t = {},
  language = "en",
  keralaDistricts = [],
  keralaPanchayats = {},
  localitiesEn = {},
  tamilNaduDistricts = [],
  tamilNaduPanchayats = {},
  karnatakaDistricts = [],
  karnatakaPanchayats = {},
  andhraPradeshDistricts = [],
  andhraPradeshPanchayats = {}
}) {
  const [activeSubTab, setActiveSubTab] = useState("id_card"); // 'id_card', 'activity', 'ward_officials', 'settings', 'notifications', 'security'
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showIceModal, setShowIceModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");
  const [copiedId, setCopiedId] = useState(false);
  const [isBiometricLocked, setIsBiometricLocked] = useState(false);
  const [browserNotifStatus, setBrowserNotifStatus] = useState("default"); // 'default', 'granted', 'denied'
  const [testNotifSent, setTestNotifSent] = useState(false);
  const fileInputRef = useRef(null);

  // Edit form state
  const [formData, setFormData] = useState({
    name: currentUser?.name || "Milan Pullapalli",
    phone: currentUser?.phone || "+91 98470 12345",
    email: currentUser?.email || "milanpullapalli00007@gmail.com",
    state: currentUser?.state || selectedState || "kerala",
    district: currentUser?.district || selectedDistrict || "Kozhikode",
    locality: currentUser?.locality || selectedLocality || "Azhiyur",
    wardNumber: currentUser?.wardNumber || "04",
    houseName: currentUser?.houseName || "Pullapalli House",
    rationCard: currentUser?.rationCard || "Priority Household (Pink)",
    aadhaarLast4: currentUser?.aadhaarLast4 || "8912",
    bloodGroup: currentUser?.bloodGroup || "O+",
    role: currentUser?.role || "resident",
    emergencyContact: currentUser?.emergencyContact || "+91 94470 54321",
    emergencyContactName: currentUser?.emergencyContactName || "Family Member",
    medicalNotes: currentUser?.medicalNotes || "No known severe drug allergies &bull; Regular BP checked"
  });

  // Local storage lists for wallet docs & grievances & custom services
  const [heldDocsList, setHeldDocsList] = useState([]);
  const [grievancesList, setGrievancesList] = useState([]);
  const [customServicesList, setCustomServicesList] = useState([]);

  // Notification Preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    waterAlerts: true,
    rationGrainArrival: true,
    gramaSabhaMeetings: true,
    weatherAlerts: true,
    whatsappUpdates: true,
    grievanceStatusChange: true
  });

  // Load existing records from localStorage
  useEffect(() => {
    try {
      const storedDocs = localStorage.getItem("gramseva_held_docs");
      if (storedDocs) {
        const parsed = JSON.parse(storedDocs);
        setHeldDocsList(Array.isArray(parsed) ? parsed : []);
      }
      const storedGrievances = localStorage.getItem("gramseva_grievances");
      if (storedGrievances) {
        const parsed = JSON.parse(storedGrievances);
        setGrievancesList(Array.isArray(parsed) ? parsed : []);
      }
      const storedCustomServices = localStorage.getItem("gramseva_custom_services");
      if (storedCustomServices) {
        const parsed = JSON.parse(storedCustomServices);
        setCustomServicesList(Array.isArray(parsed) ? parsed : []);
      }
      const storedPrefs = localStorage.getItem("gramseva_notif_prefs");
      if (storedPrefs) {
        setNotificationPrefs(JSON.parse(storedPrefs));
      }
      const storedLock = localStorage.getItem("gramseva_biometric_lock");
      if (storedLock) {
        setIsBiometricLocked(storedLock === "true");
      }
      if ("Notification" in window) {
        setBrowserNotifStatus(Notification.permission);
      }
    } catch (e) {
      console.error("Local storage load error:", e);
    }
  }, []);

  // Synchronize when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        phone: currentUser.phone || prev.phone,
        email: currentUser.email || prev.email,
        state: currentUser.state || selectedState || prev.state,
        district: currentUser.district || selectedDistrict || prev.district,
        locality: currentUser.locality || selectedLocality || prev.locality,
        wardNumber: currentUser.wardNumber || prev.wardNumber,
        houseName: currentUser.houseName || prev.houseName,
        rationCard: currentUser.rationCard || prev.rationCard,
        aadhaarLast4: currentUser.aadhaarLast4 || prev.aadhaarLast4,
        bloodGroup: currentUser.bloodGroup || prev.bloodGroup,
        role: currentUser.role || prev.role,
        emergencyContact: currentUser.emergencyContact || prev.emergencyContact,
        emergencyContactName: currentUser.emergencyContactName || prev.emergencyContactName,
        medicalNotes: currentUser.medicalNotes || prev.medicalNotes
      }));
    }
  }, [currentUser, selectedState, selectedDistrict, selectedLocality]);

  // Dynamic District Options for current state
  const stateDistrictOptions = useMemo(() => {
    const st = formData.state || selectedState || "kerala";
    let list = [];
    if (st === "tamilnadu") {
      list = tamilNaduDistricts && tamilNaduDistricts.length ? tamilNaduDistricts : ["Coimbatore", "Chennai", "Madurai", "Salem"];
    } else if (st === "karnataka") {
      list = karnatakaDistricts && karnatakaDistricts.length ? karnatakaDistricts : ["Bengaluru Urban", "Mysuru", "Dakshina Kannada", "Dharwad"];
    } else if (st === "andhrapradesh") {
      list = andhraPradeshDistricts && andhraPradeshDistricts.length ? andhraPradeshDistricts : ["Tirupati", "Visakhapatnam", "Guntur", "Krishna"];
    } else {
      list = keralaDistricts && keralaDistricts.length ? keralaDistricts : ["Kozhikode", "Kannur", "Wayanad", "Ernakulam", "Thiruvananthapuram"];
    }
    return list.map((d) => (typeof d === "string" ? d : d.en || d.name || d.id || "District"));
  }, [formData.state, selectedState, keralaDistricts, tamilNaduDistricts, karnatakaDistricts, andhraPradeshDistricts]);

  // Dynamic Locality Options for current district
  const stateLocalityOptions = useMemo(() => {
    const st = formData.state || selectedState || "kerala";
    const dist = formData.district || selectedDistrict || "Kozhikode";
    let list = [];
    if (st === "tamilnadu") {
      list = tamilNaduPanchayats[dist] || ["Pollachi North", "Anaimalai", "Kinathukadavu", "Valparai"];
    } else if (st === "karnataka") {
      list = karnatakaPanchayats[dist] || ["Anekal", "Attibele", "Dommasandra", "Sarjapura"];
    } else if (st === "andhrapradesh") {
      list = andhraPradeshPanchayats[dist] || ["Chandragiri", "Pakala", "Ramachandrapuram", "Yerpedu"];
    } else {
      list = localitiesEn[dist] || (keralaPanchayats[dist] ? keralaPanchayats[dist] : ["Azhiyur", "Mukkali", "Chorode", "Onchiyam"]);
    }
    return list.map((loc) => (typeof loc === "string" ? loc : loc.en || loc.name || loc.ml || loc.kn || loc.ta || loc.te || "Locality"));
  }, [formData.state, formData.district, selectedState, selectedDistrict, tamilNaduPanchayats, karnatakaPanchayats, andhraPradeshPanchayats, localitiesEn, keralaPanchayats]);

  // Generated unique Citizen Registration ID
  const citizenIdString = useMemo(() => {
    const stObj = STATE_CONFIGS.find((s) => s.id === (formData.state || selectedState)) || STATE_CONFIGS[0];
    const distCode = String(formData.district || "KZK").substring(0, 3).toUpperCase();
    const locCode = String(formData.locality || "AZH").substring(0, 3).toUpperCase();
    const ward = String(formData.wardNumber || "04").padStart(2, "0");
    const aadh = String(formData.aadhaarLast4 || "8912");
    return `${stObj.shortCode}-${distCode}-${locCode}-W${ward}-${aadh}`;
  }, [formData, selectedState]);

  // Save profile changes
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

      // Synchronize state and locality globally
      if (setSelectedState && formData.state) setSelectedState(formData.state);
      if (setSelectedDistrict && formData.district) setSelectedDistrict(formData.district);
      if (setSelectedLocality && formData.locality) setSelectedLocality(formData.locality);

      setSaveSuccessMessage("Citizen Profile updated & synchronized across Panchayati Raj registry!");
      setIsEditingProfile(false);
      setTimeout(() => setSaveSuccessMessage(""), 4000);
    } catch (error) {
      console.error("Error saving profile:", error);
      const updatedUser = { ...currentUser, ...formData };
      setCurrentUser(updatedUser);
      localStorage.setItem("gramseva_user", JSON.stringify(updatedUser));
      setSaveSuccessMessage("Profile updated locally in device storage.");
      setIsEditingProfile(false);
      setTimeout(() => setSaveSuccessMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Copy Citizen ID
  const handleCopyCitizenId = () => {
    navigator.clipboard?.writeText(citizenIdString);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  // Print Citizen Pass / Card
  const handlePrintCard = () => {
    window.print();
  };

  // Share Citizen Identity via Web Share or WhatsApp
  const handleShareIdentity = () => {
    const shareText = `*Grama Seva Citizen Identity Card*\nName: ${formData.name}\nCitizen ID: ${citizenIdString}\nPanchayat: ${formData.locality} GP, Ward ${formData.wardNumber}\nState: ${formData.state.toUpperCase()}\nEmergency Contact: ${formData.emergencyContact}\nBlood Group: ${formData.bloodGroup}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${formData.name} - Grama Seva Citizen Pass`,
          text: shareText
        })
        .catch(() => {});
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, "_blank");
    }
  };

  // Request browser push notification permission
  const handleRequestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("Push notifications are not supported in this browser.");
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setBrowserNotifStatus(perm);
      if (perm === "granted") {
        new Notification("GramSeva Citizen Alert System", {
          body: `Notifications active for ${formData.locality} Grama Panchayat Ward ${formData.wardNumber}.`,
          icon: "/favicon.ico"
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Send a test local notification
  const handleTriggerTestAlert = () => {
    setTestNotifSent(true);
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Panchayat Notice (Ward " + formData.wardNumber + ")", {
        body: "Monthly Grama Sabha meeting scheduled for Sunday at Kudumbashree Hall.",
        icon: "/favicon.ico"
      });
    }
    setTimeout(() => setTestNotifSent(false), 3000);
  };

  // Toggle notification preference
  const toggleNotifPref = (key) => {
    const next = { ...notificationPrefs, [key]: !notificationPrefs[key] };
    setNotificationPrefs(next);
    try {
      localStorage.setItem("gramseva_notif_prefs", JSON.stringify(next));
    } catch (e) {}
  };

  // Toggle biometric lock simulation
  const toggleBiometricLock = () => {
    const nextVal = !isBiometricLocked;
    setIsBiometricLocked(nextVal);
    try {
      localStorage.setItem("gramseva_biometric_lock", String(nextVal));
    } catch (e) {}
  };

  // Export Citizen Profile JSON
  const handleExportProfile = () => {
    const dataObj = {
      user: currentUser || formData,
      heldDocs: heldDocsList,
      grievances: grievancesList,
      customServices: customServicesList,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GramSeva_Citizen_Profile_${citizenIdString}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Citizen Profile JSON
  const handleImportProfile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.user) {
          setFormData(parsed.user);
          setCurrentUser(parsed.user);
          localStorage.setItem("gramseva_user", JSON.stringify(parsed.user));
          setSaveSuccessMessage("Citizen profile restored successfully from JSON backup!");
          setTimeout(() => setSaveSuccessMessage(""), 4000);
        }
      } catch (err) {
        alert("Invalid JSON profile file format.");
      }
    };
    reader.readAsText(file);
  };

  // Current Role Object
  const currentRoleObj = useMemo(() => {
    return CITIZEN_ROLES.find((r) => r.id === formData.role) || CITIZEN_ROLES[0];
  }, [formData.role]);

  // Dynamic Ward Officials data based on selected state, district, and locality
  const dynamicWardOfficials = useMemo(() => {
    const st = formData.state || selectedState || "kerala";
    const loc = formData.locality || selectedLocality || "Azhiyur";
    const ward = formData.wardNumber || "04";

    if (st === "karnataka") {
      return [
        {
          role: `Ward ${ward} Grama Panchayat Adhyaksha`,
          name: "Sri. Suresh Gowda",
          phone: "+91 98450 11223",
          timing: "9:30 AM - 5:00 PM",
          office: `${loc} Grama Panchayat Office`,
          badge: "Elected Adhyaksha",
          icon: <Building2 className="w-5 h-5 text-emerald-700" />
        },
        {
          role: "Panchayat Development Officer (PDO)",
          name: "Smt. Manjula R.",
          phone: "+91 94480 33445",
          timing: "10:00 AM - 5:30 PM",
          office: `${loc} GP Administrative Block`,
          badge: "Rural Development Officer",
          icon: <FileCheck2 className="w-5 h-5 text-indigo-700" />
        },
        {
          role: "ASHA Health Worker (Ward Liaison)",
          name: "Smt. Shailaja K.",
          phone: "+91 97410 88990",
          timing: "24/7 Maternal & Child Primary Care",
          office: `Ward ${ward} Health Wellness Clinic`,
          badge: "Community Health",
          icon: <Heart className="w-5 h-5 text-rose-600" />
        },
        {
          role: "Village Accountant (Revenue)",
          name: "Sri. Basavaraj Patil",
          phone: "+91 94800 55667",
          timing: "10:00 AM - 4:00 PM (Working Days)",
          office: `${loc} Nada Kacheri`,
          badge: "Land Records & RTC",
          icon: <FileText className="w-5 h-5 text-amber-700" />
        },
        {
          role: "Stree Shakthi SHG Federation Leader",
          name: "Smt. Lakshmi Bai",
          phone: "+91 96320 44556",
          timing: "10:30 AM - 4:00 PM",
          office: `${loc} Community Hall`,
          badge: "Women Self-Help",
          icon: <Users className="w-5 h-5 text-pink-700" />
        }
      ];
    }

    if (st === "tamilnadu") {
      return [
        {
          role: `Village Panchayat President (Ward ${ward})`,
          name: "Thiru. S. Arumugam",
          phone: "+91 94430 77889",
          timing: "9:30 AM - 5:00 PM",
          office: `${loc} Panchayat Union Office`,
          badge: "Panchayat President",
          icon: <Building2 className="w-5 h-5 text-emerald-700" />
        },
        {
          role: "Village Administrative Officer (VAO)",
          name: "Thiru. K. Senthil Kumar",
          phone: "+91 94440 22334",
          timing: "10:00 AM - 5:00 PM",
          office: `${loc} VAO Office`,
          badge: "Revenue & Patta Services",
          icon: <FileCheck2 className="w-5 h-5 text-indigo-700" />
        },
        {
          role: "Village Health Nurse / ASHA",
          name: "Tmt. Revathi M.",
          phone: "+91 98420 55667",
          timing: "24/7 Primary Care & Immunization",
          office: `Ward ${ward} Health Sub-Centre`,
          badge: "Public Healthcare",
          icon: <Heart className="w-5 h-5 text-rose-600" />
        },
        {
          role: "Panchayat Secretary (Executive)",
          name: "Thiru. M. Jayakumar",
          phone: "+91 94420 99001",
          timing: "10:00 AM - 4:30 PM",
          office: `${loc} Village Panchayat Secretariat`,
          badge: "Panchayat Administration",
          icon: <Award className="w-5 h-5 text-amber-700" />
        },
        {
          role: "Mahalir Thittam Coordinator",
          name: "Tmt. Geetha V.",
          phone: "+91 97890 33445",
          timing: "10:00 AM - 4:00 PM",
          office: `${loc} Self-Help Federation`,
          badge: "Women Microcredit",
          icon: <Users className="w-5 h-5 text-pink-700" />
        }
      ];
    }

    if (st === "andhrapradesh") {
      return [
        {
          role: `Ward ${ward} Grama Sachivalayam Incharge`,
          name: "Sri. K. Ramesh Babu",
          phone: "+91 98490 22331",
          timing: "9:30 AM - 5:00 PM",
          office: `${loc} Grama Sachivalayam Office`,
          badge: "Village Secretariat",
          icon: <Building2 className="w-5 h-5 text-emerald-700" />
        },
        {
          role: "Village Revenue Officer (VRO)",
          name: "Sri. N. Venkat Rao",
          phone: "+91 94400 44552",
          timing: "10:00 AM - 5:00 PM",
          office: `${loc} Revenue Section`,
          badge: "Adangal & 1B Records",
          icon: <FileCheck2 className="w-5 h-5 text-indigo-700" />
        },
        {
          role: "ANM / Health Secretary",
          name: "Smt. P. Kumari",
          phone: "+91 98480 66773",
          timing: "24/7 Primary Healthcare & Aarogyasri",
          office: `Ward ${ward} YSR Village Clinic`,
          badge: "Health & Aarogyasri",
          icon: <Heart className="w-5 h-5 text-rose-600" />
        },
        {
          role: "Village Agriculture Assistant (Rythu Bharosa)",
          name: "Sri. B. Srinivasulu",
          phone: "+91 94900 88994",
          timing: "10:00 AM - 4:00 PM",
          office: `${loc} Rythu Bharosa Kendram (RBK)`,
          badge: "Farmer Welfare",
          icon: <Award className="w-5 h-5 text-emerald-800" />
        },
        {
          role: "Mahila Police & Women Protection Secretary",
          name: "Smt. T. Vijaya",
          phone: "+91 96180 11225",
          timing: "24/7 Disha Emergency & Women Welfare",
          office: `${loc} Grama Sachivalayam`,
          badge: "Women & Child Safety",
          icon: <Users className="w-5 h-5 text-teal-700" />
        }
      ];
    }

    // Default Kerala
    return [
      {
        role: `Ward ${ward} Member (Grama Panchayat)`,
        name: "Smt. K. P. Radhamani",
        phone: "+91 94960 41204",
        timing: "9:30 AM - 5:00 PM",
        office: `${loc} Grama Panchayat Ward Office`,
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
        office: `${loc} Kudumbashree Community Hall`,
        badge: "Community & Microcredit",
        icon: <Users className="w-5 h-5 text-amber-700" />
      },
      {
        role: "Village Extension Officer (VEO)",
        name: "Sri. Thomas Mathew",
        phone: "+91 94475 22019",
        timing: "10:00 AM - 5:00 PM (Working Days)",
        office: `${loc} Panchayat VEO Office`,
        badge: "Panchayat Administration",
        icon: <FileCheck2 className="w-5 h-5 text-indigo-700" />
      },
      {
        role: "Agricultural Assistant (Krishi Bhavan)",
        name: "Sri. Anish Kumar K.",
        phone: "+91 94476 54321",
        timing: "10:00 AM - 3:30 PM",
        office: `${loc} Krishi Bhavan`,
        badge: "Farmer Welfare & Subsidies",
        icon: <Award className="w-5 h-5 text-emerald-800" />
      }
    ];
  }, [formData.state, formData.locality, formData.wardNumber, selectedState, selectedLocality]);

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-28 scrollbar-none bg-[#f8f7f4] text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* ========================================================= */}
        {/* TOP HEADER & FAST IDENTITY QUICK-BAR                      */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-600 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white shrink-0">
              {formData.name ? formData.name.charAt(0).toUpperCase() : "M"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300/80 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  e-Governance Verified Citizen
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${currentRoleObj.color}`}>
                  {currentRoleObj.label}
                </span>
              </div>
              <h2 className="font-classical text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                <span>{formData.name}</span>
                <span className="text-xs font-mono font-bold text-slate-500 bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200">
                  {citizenIdString}
                </span>
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {formData.locality} Grama Panchayat &bull; Ward {formData.wardNumber} &bull; {formData.district}, {formData.state?.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowIceModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 shadow-2xs transition active:scale-95 cursor-pointer"
              title="Open Emergency In-Case-Of-Emergency Medical Card"
            >
              <Heart className="w-4 h-4 text-rose-600 fill-rose-100 animate-pulse" />
              <span>Emergency ICE Card</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditingProfile(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-white hover:bg-stone-50 text-slate-800 border border-stone-300 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-emerald-700" />
              <span>Edit Profile</span>
            </button>

            {currentUser ? (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-stone-100 hover:bg-stone-200 text-slate-700 border border-stone-300 shadow-2xs transition active:scale-95 cursor-pointer"
                title="Sign out of GramSeva session"
              >
                <LogOut className="w-4 h-4 text-stone-600" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In with Mobile</span>
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
                className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* SUB-NAVIGATION TAB STRIP                                  */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-stone-200/80">
          {[
            { id: "id_card", label: "Smart Citizen ID", icon: <CreditCard className="w-4 h-4" /> },
            {
              id: "activity",
              label: "Applications & Activity",
              icon: <Layers className="w-4 h-4" />,
              badge: heldDocsList.length + grievancesList.length + customServicesList.length
            },
            { id: "ward_officials", label: "Ward Directory & ASHA", icon: <Users className="w-4 h-4" /> },
            { id: "settings", label: "Jurisdiction & Offline", icon: <Compass className="w-4 h-4" /> },
            { id: "notifications", label: "Alert Channels", icon: <Bell className="w-4 h-4" /> },
            { id: "security", label: "Security & Backup", icon: <Lock className="w-4 h-4" /> }
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
                {tab.badge !== undefined && tab.badge > 0 && (
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
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm">Verified Resident</span>
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
                <span className="text-[10px] text-slate-500 mt-0.5 block">{formData.rationCard?.split("(")[1]?.replace(")", "") || "Subsidized"}</span>
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
                            Grama Seva &bull; Panchayati Raj Citizen Pass
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
                            <span className="font-bold text-slate-100">{formData.locality} GP, {formData.district} ({formData.state?.toUpperCase()})</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700/60 pb-1">
                            <span className="text-slate-400">Emergency Contact:</span>
                            <span className="font-bold text-emerald-300">{formData.emergencyContact} ({formData.emergencyContactName})</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700/60 pb-1">
                            <span className="text-slate-400">Digital Document Vault:</span>
                            <span className="font-bold text-amber-300">{heldDocsList.length} Certificates Stored</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Digital Seal Hash:</span>
                            <span className="font-mono text-[9px] text-slate-300">SHA256: e9a4...c81d &bull; 2026</span>
                          </div>
                        </div>

                        <div className="bg-slate-900/80 rounded-xl p-1.5 text-center text-[9px] text-slate-300 border border-slate-700">
                          Tap card anytime to flip back &bull; Officially valid across Panchayati Raj local governance desks
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Card Control Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
                  <button
                    type="button"
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-stone-300 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Flip ({isFlipped ? "Front" : "Back"})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyCitizenId}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-stone-300 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId ? "Copied!" : "Copy ID"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareIdentity}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-stone-300 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Share Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintCard}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-stone-300 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-700" />
                    <span>Print Card</span>
                  </button>
                </div>
              </div>

              {/* Side Card Details & Fast Shortcuts */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Citizen Verification Snapshot</span>
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
                    <span className="text-slate-500 font-medium">Registered Mobile</span>
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
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile & Ward Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateTab("wallet")}
                    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-300 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FolderCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Open Digital Document Wallet ({heldDocsList.length})</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 2: APPLICATIONS, WALLET & ACTIVITY TRACKER         */}
        {/* ========================================================= */}
        {activeSubTab === "activity" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              
              {/* Document Vault Summary Card */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                        <FolderCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Document Vault</h4>
                        <span className="text-[10px] text-slate-500">{heldDocsList.length} Certificates Held</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                      Offline Ready
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {heldDocsList.length > 0 ? (
                      heldDocsList.slice(0, 3).map((docItem, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/80 text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span className="font-bold text-slate-800 truncate">{docItem.name || docItem.title || "Government Certificate"}</span>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-bold shrink-0">Verified</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs text-slate-500">
                        No certificates stored yet. Use the Certificate Assistant to resolve requirements.
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab("wallet")}
                  className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs mt-2"
                >
                  <FolderCheck className="w-4 h-4" />
                  <span>Access Wallet</span>
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
                        <h4 className="text-xs font-black text-slate-900">Grievance Petitions</h4>
                        <span className="text-[10px] text-slate-500">{grievancesList.length || 1} Registered Cases</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate">Streetlight Maintenance</span>
                        <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md shrink-0">In Progress</span>
                      </div>
                      <p className="text-[10px] text-slate-600">Assigned to Ward {formData.wardNumber} Electrical Maintenance Wing.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab("grievances")}
                  className="w-full py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs mt-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Grievance Tracker</span>
                </button>
              </div>

              {/* Community Contributed Services Card */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Service Suggestions</h4>
                        <span className="text-[10px] text-slate-500">{customServicesList.length} Crowd Contributions</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                      Civic Score: 120
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {customServicesList.length > 0 ? (
                      customServicesList.slice(0, 2).map((srv, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs flex justify-between items-center">
                          <span className="font-bold text-slate-800 truncate">{srv.name}</span>
                          <span className="text-[9px] font-black bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded">Published</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs text-slate-500">
                        Suggest essential local assets (water points, subcenters, Krishi Bhavan desks).
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab("suggest")}
                  className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs mt-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Suggest Service</span>
                </button>
              </div>

            </div>

            {/* Quick Actions Bar */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-black text-slate-900">Applying for Government Certificates?</h4>
                <p className="text-[11px] text-slate-500">Discover required document chains for Income, Nativity, Possession, and Caste certificates.</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab("resolver")}
                className="px-4 py-2 rounded-xl text-xs font-black bg-[#0e1626] hover:bg-slate-800 text-white transition cursor-pointer shadow-2xs"
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
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
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
                  {dynamicWardOfficials.length} Verified Contacts
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 mt-4">
                {dynamicWardOfficials.map((official, idx) => (
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
                        href={`https://wa.me/${official.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(official.name)},%20I%20am%20${encodeURIComponent(formData.name)}%20from%20Ward%20${formData.wardNumber}%20${formData.locality}.`}
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
                  Set your primary state, district, and panchayat for directory scoring.
                </p>
              </div>

              {/* State Selector */}
              <div>
                <label className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block mb-1.5">
                  Primary State / Region
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STATE_CONFIGS.map((st) => {
                    const isSelected = (formData.state || selectedState) === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            state: st.id,
                            district: st.defaultDist,
                            locality: st.defaultLoc
                          });
                          if (setSelectedState) setSelectedState(st.id);
                          if (setSelectedDistrict) setSelectedDistrict(st.defaultDist);
                          if (setSelectedLocality) setSelectedLocality(st.defaultLoc);
                        }}
                        className={`p-2 rounded-xl text-xs font-bold border transition text-left cursor-pointer ${
                          isSelected
                            ? "bg-emerald-800 text-white border-emerald-800 shadow-2xs"
                            : "bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black">{st.label}</span>
                          <span className="text-[9px] opacity-75">{st.shortCode}</span>
                        </div>
                        <span className={`text-[10px] block mt-0.5 ${isSelected ? "text-emerald-200" : "text-slate-400"}`}>
                          {st.script}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="pref-district" className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block mb-1">
                    State District
                  </label>
                  <select
                    id="pref-district"
                    value={formData.district || selectedDistrict}
                    onChange={(e) => {
                      const newDist = e.target.value;
                      setFormData({ ...formData, district: newDist });
                      if (setSelectedDistrict) setSelectedDistrict(newDist);
                    }}
                    className="w-full bg-stone-50 border border-stone-300 text-slate-900 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-emerald-600 transition"
                  >
                    {stateDistrictOptions.map((d, idx) => (
                      <option key={`pref_dist_${d}_${idx}`} value={d}>
                        {d}
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
                    value={formData.locality || selectedLocality}
                    onChange={(e) => {
                      const newLoc = e.target.value;
                      setFormData({ ...formData, locality: newLoc });
                      if (setSelectedLocality) setSelectedLocality(newLoc);
                    }}
                    className="w-full bg-stone-50 border border-stone-300 text-slate-900 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-emerald-600 transition"
                  >
                    {stateLocalityOptions.map((loc, idx) => (
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

              {/* Cache Diagnostics & Sync */}
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
                    <span>Cached Certificates:</span>
                    <span className="font-bold text-slate-900">{heldDocsList.length} documents</span>
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
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-2xs space-y-5 max-w-3xl mx-auto">
            <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-emerald-700" />
                  <span>Panchayat Alert & Notification Channels</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Configure direct notifications dispatched to your mobile number ({formData.phone}).
                </p>
              </div>

              <div className="flex items-center gap-2">
                {browserNotifStatus !== "granted" ? (
                  <button
                    type="button"
                    onClick={handleRequestNotificationPermission}
                    className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-800 hover:bg-emerald-900 text-white transition cursor-pointer shadow-2xs"
                  >
                    Enable Browser Push
                  </button>
                ) : (
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-300">
                    Push Enabled
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleTriggerTestAlert}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-slate-700 border border-stone-300 transition cursor-pointer"
                >
                  {testNotifSent ? "Alert Sent!" : "Test Alert"}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: "waterAlerts", title: "Drinking Water Supply Alerts", desc: `Pipe maintenance and valve timings in Ward ${formData.wardNumber}` },
                { key: "rationGrainArrival", title: "Ration Shop Grain Arrival (NFSA)", desc: "Monthly rice/wheat quota availability at your nearest depot" },
                { key: "gramaSabhaMeetings", title: "Grama Sabha & Ward Assembly", desc: "Notices for ward assembly sessions and beneficiary selection lists" },
                { key: "weatherAlerts", title: "Disaster & Heavy Rainfall Advisories", desc: "State Disaster Management Authority emergency notices" },
                { key: "grievanceStatusChange", title: "Grievance Status Updates", desc: "Instant SMS when your filed petition is assigned or resolved" },
                { key: "whatsappUpdates", title: "WhatsApp Direct Document Delivery", desc: "Receive official PDF receipts and certificates on WhatsApp" }
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

        {/* ========================================================= */}
        {/* SUBTAB 6: SECURITY, BIOMETRIC LOCK & DATA BACKUP          */}
        {/* ========================================================= */}
        {activeSubTab === "security" && (
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            
            {/* Security Settings Card */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Citizen Privacy & Vault Security</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Configure biometric authentication & local credential protection.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Biometric / PIN Vault Lock</span>
                  <span className="text-[10px] text-slate-500 block">
                    Require confirmation before opening government certificates
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleBiometricLock}
                  className={`px-3 py-1 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                    isBiometricLocked
                      ? "bg-emerald-800 text-white"
                      : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {isBiometricLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <span>{isBiometricLocked ? "Locked" : "Unlocked"}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-xs font-bold text-slate-900 block">Data Privacy Guarantee</span>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Your citizen identity, Aadhaar last-4, and document scans are stored strictly in your browser's private local vault and encrypted in Firebase Firestore.
                </p>
              </div>
            </div>

            {/* Profile Backup & Restore Card */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="border-b border-stone-200 pb-3">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-indigo-700" />
                    <span>Backup & Restore Profile</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Export your credentials as JSON or restore on another device.
                  </p>
                </div>

                <div className="space-y-2 mt-3">
                  <button
                    type="button"
                    onClick={handleExportProfile}
                    className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Citizen Backup (JSON)</span>
                  </button>

                  <input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleImportProfile}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 border border-stone-300 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Restore Profile from Backup (JSON)</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to reset all profile data on this device?")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="w-full py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Local Device Data</span>
                </button>
              </div>
            </div>

            {/* Restricted Officer Gateway Entry */}
            <div className="md:col-span-2 pt-2 text-center">
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-stone-400" />
                <span>Panchayat Administrative Gateway &bull; Officer Console Login</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* EMERGENCY IN-CASE-OF-EMERGENCY (ICE) MODAL                */}
      {/* ========================================================= */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {showIceModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs overscroll-contain">
              <div 
                className="absolute inset-0" 
                onClick={() => setShowIceModal(false)} 
                aria-hidden="true" 
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 flex flex-col max-h-[85vh] overflow-hidden my-auto"
              >
                {/* Header - Pinned at top */}
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-rose-200 bg-rose-50/60 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                      <Heart className="w-5 h-5 fill-rose-600 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-classical text-base font-black text-rose-950">
                        Emergency ICE Medical Pass
                      </h3>
                      <p className="text-[10px] text-rose-700">
                        In-Case-of-Emergency First Responder Card
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowIceModal(false)}
                    className="p-1.5 rounded-xl hover:bg-rose-100 text-slate-500 cursor-pointer transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body - Scrollable content */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain">
                  {/* Big Red Blood Group Badge */}
                  <div className="bg-gradient-to-br from-rose-600 to-red-700 text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-rose-200">
                        Citizen Blood Type
                      </span>
                      <div className="text-3xl font-black">{formData.bloodGroup || "O+"}</div>
                      <span className="text-[11px] text-rose-100 font-semibold">{formData.name}</span>
                    </div>
                    <div className="bg-white/20 p-2 rounded-xl text-center backdrop-blur-xs">
                      <span className="text-[9px] block text-rose-100 font-bold">Aadhaar Last 4</span>
                      <span className="text-sm font-mono font-bold text-white">XXXX {formData.aadhaarLast4 || "8912"}</span>
                    </div>
                  </div>

                  {/* Emergency Contacts */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">
                      Primary Emergency Contact
                    </span>
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-slate-900 block">{formData.emergencyContactName || "Family Emergency Contact"}</span>
                        <span className="text-xs font-bold text-rose-700">{formData.emergencyContact}</span>
                      </div>
                      <a
                        href={`tel:${formData.emergencyContact?.replace(/\s+/g, '')}`}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-lg flex items-center gap-1 shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Now</span>
                      </a>
                    </div>
                  </div>

                  {/* Medical Notes & Allergies */}
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">
                      Allergies & Medical Conditions
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      {formData.medicalNotes || "No critical drug allergies reported."}
                    </p>
                  </div>

                  {/* Fast National Emergency Numbers */}
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1.5">
                      1-Tap Government Emergency Helplines
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <a
                        href="tel:108"
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 font-black flex flex-col items-center"
                      >
                        <span>🚑 108</span>
                        <span className="text-[9px] text-emerald-800">Ambulance</span>
                      </a>
                      <a
                        href="tel:112"
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-950 font-black flex flex-col items-center"
                      >
                        <span>🚓 112</span>
                        <span className="text-[9px] text-blue-800">National SOS</span>
                      </a>
                      <a
                        href="tel:1098"
                        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-black flex flex-col items-center"
                      >
                        <span>👶 1098</span>
                        <span className="text-[9px] text-amber-800">Childline</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Footer - Pinned at bottom */}
                <div className="px-5 sm:px-6 py-3.5 border-t border-rose-100 bg-stone-50/90 flex items-center justify-end shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowIceModal(false)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black cursor-pointer transition"
                  >
                    Close Emergency Pass
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ========================================================= */}
      {/* EDIT PROFILE MODAL / OVERLAY                              */}
      {/* ========================================================= */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isEditingProfile && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs overscroll-contain">
              <div 
                className="absolute inset-0" 
                onClick={() => setIsEditingProfile(false)} 
                aria-hidden="true" 
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 flex flex-col max-h-[85vh] overflow-hidden my-auto"
              >
                {/* Header - Pinned at top */}
                <div className="px-5 sm:px-6 py-4 border-b border-stone-200 flex items-center justify-between shrink-0 bg-stone-50/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-classical text-base font-black text-slate-900">
                        Edit Citizen Identity Details
                      </h3>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Syncs with GramSeva registry & cloud database.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="p-1.5 rounded-xl hover:bg-stone-100 text-slate-500 cursor-pointer transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form - with scrollable fields & pinned footer */}
                <form onSubmit={handleSaveProfile} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                  {/* Scrollable Form Body */}
                  <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain text-xs">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                        Citizen Full Name *
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
                          Mobile Number *
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
                          Citizen Category / Role
                        </label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                        >
                          {CITIZEN_ROLES.map((r) => (
                            <option key={r.id} value={r.id}>{r.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                          State
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) => {
                            const newSt = e.target.value;
                            const stObj = STATE_CONFIGS.find((s) => s.id === newSt) || STATE_CONFIGS[0];
                            setFormData({
                              ...formData,
                              state: newSt,
                              district: stObj.defaultDist,
                              locality: stObj.defaultLoc
                            });
                          }}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                        >
                          {STATE_CONFIGS.map((s) => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                          District
                        </label>
                        <select
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                        >
                          {stateDistrictOptions.map((d, idx) => (
                            <option key={`edit_dist_${d}_${idx}`} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                          Panchayat / Locality
                        </label>
                        <select
                          value={formData.locality}
                          onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                        >
                          {stateLocalityOptions.map((loc, idx) => (
                            <option key={`edit_loc_${loc}_${idx}`} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                          House Name / Number
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

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                          Ration Card
                        </label>
                        <select
                          value={formData.rationCard}
                          onChange={(e) => setFormData({ ...formData, rationCard: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                        >
                          <option value="Priority Household (Pink)">Priority (Pink)</option>
                          <option value="Antyodaya Anna Yojana (Yellow)">AAY (Yellow)</option>
                          <option value="Non-Priority Subsidy (Blue)">Non-Priority (Blue)</option>
                          <option value="Non-Priority Non-Subsidy (White)">General (White)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                          Aadhaar Last 4
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={formData.aadhaarLast4}
                          onChange={(e) => setFormData({ ...formData, aadhaarLast4: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                          placeholder="8912"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                          Blood Group
                        </label>
                        <select
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
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
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          value={formData.emergencyContactName}
                          onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                          placeholder="e.g. Brother / Spouse"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                          Emergency Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.emergencyContact}
                          onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                          placeholder="+91 94470 54321"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                        Emergency Medical Notes & Allergies (for ICE Card)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.medicalNotes}
                        onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600 resize-none"
                        placeholder="e.g. Penicillin allergy, Diabetic, Hypertension, etc."
                      />
                    </div>
                  </div>

                  {/* Pinned Footer - Always reachable and never clipped */}
                  <div className="px-5 sm:px-6 py-3.5 border-t border-stone-200 bg-stone-50/90 flex items-center justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-slate-700 cursor-pointer transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? "Saving..." : "Save Profile"}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}
