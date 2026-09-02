import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Users,
  Building2,
  FileCheck2,
  FileText,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Send,
  Download,
  Upload,
  LogOut,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Sparkles,
  Award,
  Bell,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  Activity,
  Sliders,
  Share2,
  AlertCircle
} from "lucide-react";
import AdminModerationQueue from "./admin/AdminModerationQueue";
import AdminCitizenRegistry from "./admin/AdminCitizenRegistry";
import AdminActivityLog from "./admin/AdminActivityLog";

const INITIAL_ADMIN_GRIEVANCES = [
  {
    id: "GRM-KER-2026-9041",
    ticketId: "GRM-KER-2026-9041",
    category: "Streetlight Breakdown",
    title: "LED Streetlight on Ward 4 Main Junction non-functional",
    description: "The main LED pole light at Azhiyur High School Junction has been flickering and completely turned off for 3 days, causing visibility issues for evening commuters.",
    state: "kerala",
    district: "Kozhikode",
    panchayat: "Azhiyur",
    ward: "Ward 4",
    landmark: "Near Azhiyur High School Main Gate",
    citizenName: "Ramesh Kumar V",
    phone: "+91 98470 12345",
    priority: "Urgent",
    status: "Field Action",
    officerName: "Shri. Suresh Babu (Assistant Engineer, KSEB)",
    officerNotes: "Technician inspected junction. Replacement 90W driver ordered from depot.",
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "GRM-KAR-2026-8812",
    ticketId: "GRM-KAR-2026-8812",
    category: "Water Pipeline Leakage",
    title: "Major clean water pipe burst near Panchayat Office Road",
    description: "Drinking water is leaking profusely onto the tar road since morning 7 AM. Waste of clean water supply.",
    state: "kerala",
    district: "Kozhikode",
    panchayat: "Azhiyur",
    ward: "Ward 12",
    landmark: "Opposite Grama Panchayat Office Bus Stand",
    citizenName: "Anitha Shetty",
    phone: "+91 99001 88234",
    priority: "Emergency Sanitation",
    status: "Resolved",
    officerName: "Smt. Kavitha (Jal Jeevan Mission Overseer)",
    officerNotes: "Main isolation valve shut; high-pressure collar welded and certified intact.",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: "GRM-TN-2026-7731",
    ticketId: "GRM-TN-2026-7731",
    category: "Garbage & Sanitation",
    title: "Uncollected organic waste near Market Road",
    description: "Market vegetable waste accumulating near the public bin causing foul smell and health hazard.",
    state: "kerala",
    district: "Kozhikode",
    panchayat: "Azhiyur",
    ward: "Ward 8",
    landmark: "Daily Farmer Market Block B",
    citizenName: "M. Selvam",
    phone: "+91 94432 55123",
    priority: "Normal",
    status: "Under Review",
    officerName: "Thiru. Arumugam (Health Inspector)",
    officerNotes: "Sanitation truck route rescheduled for 2 PM clearance.",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "GRM-KER-2026-6102",
    ticketId: "GRM-KER-2026-6102",
    category: "Potholes & Road Repair",
    title: "Severe deep crater on Azhiyur-Chorode Link Road",
    description: "Monsoon rains created a 2-foot trench in front of Primary Health Sub-Centre. Two-wheelers slipping constantly.",
    state: "kerala",
    district: "Kozhikode",
    panchayat: "Azhiyur",
    ward: "Ward 3",
    landmark: "50m before PHC Sub-Centre gate",
    citizenName: "Fathima Noor",
    phone: "+91 97440 67890",
    priority: "Urgent",
    status: "Submitted",
    officerName: "Unassigned",
    officerNotes: "Awaiting site inspection allocation.",
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 14).toISOString()
  },
  {
    id: "GRM-KER-2026-5590",
    ticketId: "GRM-KER-2026-5590",
    category: "Drainage Blockage",
    title: "Culvert blocked by plastic waste causing waterlogging",
    description: "Stormwater drain overflowing onto pedestrian path near Anganwadi No. 4.",
    state: "kerala",
    district: "Kozhikode",
    panchayat: "Azhiyur",
    ward: "Ward 4",
    landmark: "Behind Anganwadi No. 4 Compound",
    citizenName: "Vijayan K. P.",
    phone: "+91 94471 22334",
    priority: "Normal",
    status: "Field Action",
    officerName: "Smt. Sujatha Mohan (Kudumbashree CDS / VEO)",
    officerNotes: "Haritha Karma Sena deployed for desilting and plastic extraction.",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

const INITIAL_COMMUNITY_SUBMISSIONS = [
  {
    id: "sub-101",
    title: "Jan Aushadhi Medical Store - Azhiyur Junction",
    category: "health",
    categoryLabel: "Primary Health & Medicine",
    contactName: "Pradeep Kumar (Pharmacist)",
    phone: "+91 94470 88991",
    hours: "8:00 AM - 9:00 PM (All Days)",
    address: "Shop No. 12, Municipal Commercial Complex, Azhiyur",
    ward: "Ward 4",
    isEmergency: true,
    hasWheelchairAccess: true,
    submittedBy: "Volunteer Ramesh",
    submittedAt: new Date(Date.nowPage ? Date.now() - 3600000 * 18 : Date.now() - 3600000 * 18).toISOString(),
    status: "pending_review",
    verifiedConfidence: 94
  },
  {
    id: "sub-102",
    title: "Ward 6 Farmer Irrigation Pump Support Centre",
    category: "agriculture",
    categoryLabel: "Agriculture & Water",
    contactName: "Balan Karshaka Samithi",
    phone: "+91 98471 00223",
    hours: "6:00 AM - 6:00 PM",
    address: "Near Vengalam Canal Bridge, Ward 6",
    ward: "Ward 6",
    isEmergency: false,
    hasWheelchairAccess: false,
    submittedBy: "Balan K.",
    submittedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    status: "pending_review",
    verifiedConfidence: 89
  },
  {
    id: "sub-103",
    title: "Kudumbashree Sanjeevani Ayurvedic Herb Garden & Nursery",
    category: "agriculture",
    categoryLabel: "Agriculture & Water",
    contactName: "Smt. Shailaja Teacher",
    phone: "+91 97450 11223",
    hours: "8:30 AM - 5:30 PM",
    address: "Near Govt Mappila LP School, Ward 4",
    ward: "Ward 4",
    isEmergency: false,
    hasWheelchairAccess: true,
    submittedBy: "Kudumbashree Ward 4 ADS",
    submittedAt: new Date(Date.now() - 3600000 * 45).toISOString(),
    status: "pending_review",
    verifiedConfidence: 96
  }
];

const INITIAL_CITIZENS_ROSTER = [
  {
    id: "cit-1",
    name: "Milan Pullapalli",
    phone: "+91 98470 12345",
    email: "milanpullapalli00007@gmail.com",
    ward: "04",
    holdingNumber: "4/128B",
    locality: "Azhiyur",
    district: "Kozhikode",
    rationCard: "Priority Household (Pink - PHH)",
    aadhaarLast4: "8912",
    role: "Resident Citizen",
    isVerified: true,
    badge: "Verified Citizen",
    joinedDate: "12 Jan 2026"
  },
  {
    id: "cit-2",
    name: "Smt. K. P. Radhamani",
    phone: "+91 94960 41204",
    email: "radhamani.ward4@azhiyur.gov.in",
    ward: "04",
    holdingNumber: "4/014",
    locality: "Azhiyur",
    district: "Kozhikode",
    rationCard: "Non-Priority (Blue - NPHH)",
    aadhaarLast4: "4421",
    role: "Ward Representative / Member",
    isVerified: true,
    badge: "Elected Representative",
    joinedDate: "05 Nov 2025"
  },
  {
    id: "cit-3",
    name: "Smt. Bindu Rajesh",
    phone: "+91 98471 89234",
    email: "bindu.asha@keralahealth.gov.in",
    ward: "04",
    holdingNumber: "4/092",
    locality: "Azhiyur",
    district: "Kozhikode",
    rationCard: "Priority (Pink - PHH)",
    aadhaarLast4: "7730",
    role: "ASHA Health Worker",
    isVerified: true,
    badge: "Public Health Liaison",
    joinedDate: "18 Aug 2025"
  },
  {
    id: "cit-4",
    name: "Ramesh Kumar V",
    phone: "+91 98470 54321",
    email: "ramesh.k@gmail.com",
    ward: "04",
    holdingNumber: "4/210",
    locality: "Azhiyur",
    district: "Kozhikode",
    rationCard: "AAY (Yellow - Antyodaya)",
    aadhaarLast4: "3319",
    role: "Resident Citizen",
    isVerified: true,
    badge: "Verified Citizen",
    joinedDate: "20 Feb 2026"
  },
  {
    id: "cit-5",
    name: "Smt. Sujatha Mohan",
    phone: "+91 97452 33190",
    email: "sujatha.kudumbashree@azhiyur.org",
    ward: "04",
    holdingNumber: "4/055",
    locality: "Azhiyur",
    district: "Kozhikode",
    rationCard: "Priority (Pink - PHH)",
    aadhaarLast4: "9102",
    role: "Kudumbashree ADS Chairperson",
    isVerified: true,
    badge: "SHG Leader",
    joinedDate: "10 Oct 2025"
  }
];

const INITIAL_BROADCASTS = [
  {
    id: "bc-1",
    title: "KWA Drinking Water Pipeline Maintenance",
    message: "Scheduled pipeline replacement on Ward 4 & Ward 5 road from 8:00 AM to 4:00 PM tomorrow. Please store adequate drinking water.",
    severity: "warning",
    ward: "Ward 4 & 5",
    panchayat: "Azhiyur",
    active: true,
    postedBy: "Panchayat Secretary",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "bc-2",
    title: "Free Anti-Rabies Animal Vaccination Camp",
    message: "Veterinary Hospital Azhiyur is hosting a free pet vaccination drive at Kudumbashree Hall, Ward 4 on Saturday morning 9 AM - 1 PM.",
    severity: "info",
    ward: "All Wards",
    panchayat: "Azhiyur",
    active: true,
    postedBy: "Veterinary Department",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const INITIAL_ADMIN_AUDIT_LOGS = [
  {
    id: "LOG-2026-904101",
    timestamp: new Date(Date.now() - 3600000 * 0.4).toISOString(),
    time: "24 mins ago",
    action: "Officer Administrative Session Initialized",
    category: "governance",
    severity: "info",
    officer: "Panchayat Secretary (Executive Officer)",
    targetId: "AUTH-PASS-2026",
    targetTitle: "Master Security Gateway",
    ward: "All Wards",
    detail: "Authorized admin session established with full audit tracking privileges."
  },
  {
    id: "LOG-2026-904102",
    timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    time: "2 hours ago",
    action: "Community Service Listing Approved & Published",
    category: "services",
    severity: "success",
    officer: "Shri. Suresh Babu (Executive Officer)",
    targetId: "sub-101",
    targetTitle: "Kudumbashree Sanjeevani Ayurvedic Clinic",
    ward: "Ward 04",
    detail: "Approved community facility listing with 98% verification confidence and published live to citizen directory.",
    meta: {
      category: "ayurveda_health",
      phone: "+91 94471 88990",
      confidence: 98
    }
  },
  {
    id: "LOG-2026-904103",
    timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(),
    time: "3 hours ago",
    action: "Citizen e-KYC Verification Endorsed",
    category: "citizens",
    severity: "success",
    officer: "Smt. Sujatha Mohan (VEO)",
    targetId: "cit-1",
    targetTitle: "Milan Pullapalli",
    ward: "Ward 04",
    detail: "Confirmed resident identity and holding number 4/128B against Electoral and PDS Ration Card databases (Aadhaar: ****-****-8912).",
    meta: {
      aadhaarLast4: "8912",
      rationCard: "Priority Household (Pink - PHH)"
    }
  },
  {
    id: "LOG-2026-904104",
    timestamp: new Date(Date.now() - 3600000 * 5.2).toISOString(),
    time: "5 hours ago",
    action: "Emergency Notice Broadcast Dispatched",
    category: "broadcasts",
    severity: "warning",
    officer: "Panchayat Secretary",
    targetId: "bc-1",
    targetTitle: "KWA Drinking Water Pipeline Maintenance",
    ward: "Ward 4 & 5",
    detail: "Public alert dispatched live to citizen app for scheduled pipeline shutdown tomorrow."
  },
  {
    id: "LOG-2026-904105",
    timestamp: new Date(Date.now() - 3600000 * 12.0).toISOString(),
    time: "12 hours ago",
    action: "Grievance Status Advanced [GRM-KER-2026-9041]",
    category: "grievances",
    severity: "warning",
    officer: "Shri. Suresh Babu (Assistant Engineer, KSEB)",
    targetId: "GRM-KER-2026-9041",
    targetTitle: "LED Streetlight on Ward 4 Main Junction non-functional",
    ward: "Ward 04",
    detail: "Complaint escalated to Field Action. Replacement 90W driver ordered from electrical depot."
  },
  {
    id: "LOG-2026-904106",
    timestamp: new Date(Date.now() - 3600000 * 24.5).toISOString(),
    time: "1 day ago",
    action: "Grievance Resolved [GRM-KAR-2026-8812]",
    category: "grievances",
    severity: "success",
    officer: "Smt. Kavitha (Jal Jeevan Mission Overseer)",
    targetId: "GRM-KAR-2026-8812",
    targetTitle: "Major clean water pipe burst near Panchayat Office Road",
    ward: "Ward 12",
    detail: "Main isolation valve shut; high-pressure collar welded and certified intact."
  },
  {
    id: "LOG-2026-904107",
    timestamp: new Date(Date.now() - 3600000 * 36.0).toISOString(),
    time: "1 day ago",
    action: "New Resident Citizen Enrolled",
    category: "citizens",
    severity: "success",
    officer: "Panchayat Secretary",
    targetId: "cit-4",
    targetTitle: "Ramesh Kumar V",
    ward: "Ward 04",
    detail: "Enrolled citizen into local ward ledger (Holding: 4/210, Ration: AAY Yellow, Aadhaar: ****-****-5510)."
  }
];

export default function AdminConsole({
  adminUser,
  onExitAdmin,
  onSwitchToCitizenView,
  selectedLocality = "Azhiyur",
  selectedDistrict = "Kozhikode",
  selectedState = "kerala",
  onApproveServiceToLiveDirectory,
  onUpdateGrievanceStatus
}) {
  const [activeTab, setActiveTab] = useState("grievances"); // 'grievances' | 'services' | 'citizens' | 'broadcasts' | 'audit'

  // Grievances State
  const [grievances, setGrievances] = useState(() => {
    try {
      const saved = localStorage.getItem("gramseva_admin_grievances");
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_GRIEVANCES;
    } catch {
      return INITIAL_ADMIN_GRIEVANCES;
    }
  });
  const [grievanceFilterStatus, setGrievanceFilterStatus] = useState("all");
  const [grievanceFilterWard, setGrievanceFilterWard] = useState("all");
  const [grievanceSearch, setGrievanceSearch] = useState("");
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [officerNoteInput, setOfficerNoteInput] = useState("");
  const [assignedOfficerInput, setAssignedOfficerInput] = useState("");

  // Directory Submissions State
  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem("gramseva_admin_submissions");
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_SUBMISSIONS;
    } catch {
      return INITIAL_COMMUNITY_SUBMISSIONS;
    }
  });

  // Citizen Registry State
  const [citizens, setCitizens] = useState(() => {
    try {
      const saved = localStorage.getItem("gramseva_admin_citizens");
      return saved ? JSON.parse(saved) : INITIAL_CITIZENS_ROSTER;
    } catch {
      return INITIAL_CITIZENS_ROSTER;
    }
  });

  // Broadcasts State
  const [broadcasts, setBroadcasts] = useState(() => {
    try {
      const saved = localStorage.getItem("gramseva_admin_broadcasts");
      return saved ? JSON.parse(saved) : INITIAL_BROADCASTS;
    } catch {
      return INITIAL_BROADCASTS;
    }
  });
  const [newBcTitle, setNewBcTitle] = useState("");
  const [newBcMessage, setNewBcMessage] = useState("");
  const [newBcSeverity, setNewBcSeverity] = useState("warning");
  const [newBcWard, setNewBcWard] = useState("All Wards");
  const [isCreatingBroadcast, setIsCreatingBroadcast] = useState(false);

  // Administrative Audit Log State
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem("gramseva_admin_audit_logs");
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_AUDIT_LOGS;
    } catch {
      return INITIAL_ADMIN_AUDIT_LOGS;
    }
  });

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const addAuditLog = (action, detail, options = {}) => {
    const newLog = {
      id: `LOG-2026-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      time: "Just now",
      action,
      category: options.category || "governance",
      severity: options.severity || "info",
      officer: options.officer || adminUser?.name || "Panchayat Secretary (Executive Officer)",
      targetId: options.targetId || null,
      targetTitle: options.targetTitle || options.targetName || null,
      ward: options.ward || null,
      detail: typeof detail === "string" ? detail : JSON.stringify(detail),
      meta: options.meta || null
    };
    const updated = [newLog, ...auditLogs].slice(0, 100);
    setAuditLogs(updated);
    try {
      localStorage.setItem("gramseva_admin_audit_logs", JSON.stringify(updated));
    } catch {}
  };

  const handleClearAuditLogs = () => {
    setAuditLogs([]);
    try {
      localStorage.removeItem("gramseva_admin_audit_logs");
    } catch {}
    showToast("Audit logs cleared.");
  };

  // Sync helpers
  const saveGrievances = (updated) => {
    setGrievances(updated);
    try {
      localStorage.setItem("gramseva_admin_grievances", JSON.stringify(updated));
      localStorage.setItem("gramseva_grievances", JSON.stringify(updated));
    } catch {}
  };

  const saveSubmissions = (updated) => {
    setSubmissions(updated);
    try {
      localStorage.setItem("gramseva_admin_submissions", JSON.stringify(updated));
    } catch {}
  };

  const saveCitizens = (updated) => {
    setCitizens(updated);
    try {
      localStorage.setItem("gramseva_admin_citizens", JSON.stringify(updated));
    } catch {}
  };

  const saveBroadcasts = (updated) => {
    setBroadcasts(updated);
    try {
      localStorage.setItem("gramseva_admin_broadcasts", JSON.stringify(updated));
    } catch {}
  };

  // Handler: Update Grievance Status
  const handleUpdateGrievanceStatus = (ticketId, nextStatus) => {
    let targetG = null;
    const updated = grievances.map((g) => {
      if (g.ticketId === ticketId || g.id === ticketId) {
        targetG = g;
        return {
          ...g,
          status: nextStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return g;
    });
    saveGrievances(updated);
    addAuditLog(
      `Grievance Status Advanced [${ticketId}]`,
      `Status changed to '${nextStatus}'. Action logged for citizen ${targetG?.citizenName || "Resident"} in ${targetG?.ward || "Ward 04"}.`,
      {
        category: "grievances",
        severity: nextStatus === "Resolved" ? "success" : "warning",
        targetId: ticketId,
        targetTitle: targetG?.title || "Grievance Ticket",
        ward: targetG?.ward || "Ward 04",
        meta: { previousStatus: targetG?.status, nextStatus, priority: targetG?.priority }
      }
    );
    showToast(`Grievance ${ticketId} status changed to ${nextStatus}.`);
    onUpdateGrievanceStatus?.(ticketId, nextStatus);
  };

  // Handler: Save Officer Details for Grievance
  const handleSaveOfficerDetails = (ticketId) => {
    let targetG = null;
    const updated = grievances.map((g) => {
      if (g.ticketId === ticketId || g.id === ticketId) {
        targetG = g;
        return {
          ...g,
          officerName: assignedOfficerInput.trim() || g.officerName,
          officerNotes: officerNoteInput.trim() || g.officerNotes,
          updatedAt: new Date().toISOString()
        };
      }
      return g;
    });
    saveGrievances(updated);
    addAuditLog(
      `Departmental Note & Action Logged [${ticketId}]`,
      `Officer: ${assignedOfficerInput || targetG?.officerName || "Assigned"} | Remarks: "${officerNoteInput.slice(0, 90)}"`,
      {
        category: "grievances",
        severity: "info",
        targetId: ticketId,
        targetTitle: targetG?.title || "Grievance Record",
        ward: targetG?.ward || "Ward 04",
        meta: { assignedOfficer: assignedOfficerInput, remarks: officerNoteInput }
      }
    );
    showToast("Department action notes saved and logged in public timeline.");
    setSelectedGrievance((prev) => (prev ? { ...prev, officerName: assignedOfficerInput || prev.officerName, officerNotes: officerNoteInput || prev.officerNotes } : null));
  };

  // Handler: Approve Directory Submission
  const handleApproveSubmission = (sub) => {
    const nextSubmissions = submissions.map((s) => (s.id === sub.id ? { ...sub, status: "approved" } : s));
    saveSubmissions(nextSubmissions);

    const formattedService = {
      id: `service_custom_${Date.now()}`,
      categoryKey: sub.category || "health",
      isEmergency: sub.isEmergency || false,
      isCommunitySubmitted: true,
      isVerified: true,
      phoneNumber: sub.phone,
      verifiedConfidence: sub.verifiedConfidence || 99,
      lastCheckedTimestamp: new Date().toISOString(),
      localityName: selectedLocality,
      districtName: selectedDistrict,
      stateId: selectedState,
      translations: {
        en: {
          title: sub.title,
          category: sub.categoryLabel || "Essential Service",
          location: sub.address || `${selectedLocality} Ward ${sub.ward || "04"}`,
          hours: sub.hours || "Standard Hours",
          contactName: sub.contactName || "Officer in Charge",
          description: `Approved by Panchayat Administrative Console. Official community verified facility in Ward ${sub.ward || "04"}.`,
          volunteerNotesDetail: `Direct verification confirmed by ${adminUser?.name || "Panchayat Secretary"} on ${new Date().toLocaleDateString()}.`
        }
      }
    };

    onApproveServiceToLiveDirectory?.(formattedService);
    addAuditLog(
      `Community Service Listing Approved & Published`,
      `Published "${sub.title}" (${sub.categoryLabel || "Essential Service"}) directly to live citizen directory with ${sub.verifiedConfidence || 99}% verification score. Contact: ${sub.phone || "N/A"}.`,
      {
        category: "services",
        severity: "success",
        targetId: sub.id,
        targetTitle: sub.title,
        ward: `Ward ${sub.ward || "04"}`,
        meta: {
          category: sub.category,
          categoryLabel: sub.categoryLabel,
          phone: sub.phone,
          confidence: sub.verifiedConfidence || 99,
          hours: sub.hours
        }
      }
    );
    showToast(`"${sub.title}" approved and published to live Citizen Directory!`);
  };

  // Handler: Reject Directory Submission
  const handleRejectSubmission = (subId, title, reason, note) => {
    const nextSubmissions = submissions.map((s) => {
      if (s.id === subId) {
        return {
          ...s,
          status: "rejected",
          rejectionReason: reason || "Unverified details",
          rejectionNote: note || ""
        };
      }
      return s;
    });
    saveSubmissions(nextSubmissions);
    addAuditLog(
      `Community Service Listing Rejected`,
      `Rejected listing "${title}". Official Reason: "${reason || "Unverified details"}". ${note ? `Notes: ${note}` : ""}`,
      {
        category: "services",
        severity: "alert",
        targetId: subId,
        targetTitle: title,
        meta: { reason, note }
      }
    );
    showToast(`Submission "${title}" rejected.`);
  };

  // Handler: Restore Directory Submission
  const handleRestoreSubmission = (subId) => {
    let targetSub = null;
    const updated = submissions.map((s) => {
      if (s.id === subId) {
        targetSub = s;
        return { ...s, status: "pending_review", rejectionReason: null, rejectionNote: null };
      }
      return s;
    });
    saveSubmissions(updated);
    addAuditLog(
      `Directory Submission Restored to Review Queue`,
      `Restored submission "${targetSub?.title || subId}" to pending moderation queue for re-verification.`,
      {
        category: "services",
        severity: "warning",
        targetId: subId,
        targetTitle: targetSub?.title || subId
      }
    );
    showToast("Submission restored to pending review queue.");
  };

  // Handler: Add Official Facility directly
  const handleAddOfficialFacility = (newEntry) => {
    saveSubmissions([newEntry, ...submissions]);
    handleApproveSubmission(newEntry);
    addAuditLog(
      `Official Government Facility Registered`,
      `Enrolled and published public amenity "${newEntry.title}" in ${newEntry.ward} by ${adminUser?.name || "Officer"}.`,
      {
        category: "services",
        severity: "success",
        targetId: newEntry.id,
        targetTitle: newEntry.title,
        ward: newEntry.ward,
        meta: newEntry
      }
    );
    showToast(`"${newEntry.title}" registered and published live!`);
  };

  // Handler: Toggle Citizen Verification
  const handleToggleCitizenVerification = (citizenId) => {
    let targetCitizen = null;
    let nextVerified = false;
    const updated = citizens.map((c) => {
      if (c.id === citizenId) {
        targetCitizen = c;
        nextVerified = !c.isVerified;
        return {
          ...c,
          isVerified: nextVerified,
          badge: nextVerified ? "Verified Citizen" : "Verification Pending"
        };
      }
      return c;
    });
    saveCitizens(updated);
    addAuditLog(
      `Citizen e-KYC Status ${nextVerified ? "Verified & Endorsed" : "Revoked to Pending"}`,
      `Resident ${targetCitizen?.name || "Citizen"} (Holding ${targetCitizen?.holdingNumber || "N/A"}, Ward ${targetCitizen?.ward || "04"}) e-KYC verified status changed to ${nextVerified ? "CONFIRMED" : "PENDING"} by ${adminUser?.name || "Officer"}.`,
      {
        category: "citizens",
        severity: nextVerified ? "success" : "warning",
        targetId: citizenId,
        targetTitle: targetCitizen?.name || "Citizen",
        ward: `Ward ${targetCitizen?.ward || "04"}`,
        meta: {
          isVerified: nextVerified,
          aadhaarLast4: targetCitizen?.aadhaarLast4,
          rationCard: targetCitizen?.rationCard,
          holdingNumber: targetCitizen?.holdingNumber
        }
      }
    );
    showToast("Citizen verification status updated.");
  };

  // Handler: Add New Citizen
  const handleAddNewCitizen = (newCitizen) => {
    const updated = [newCitizen, ...citizens];
    saveCitizens(updated);
    addAuditLog(
      `New Resident Citizen Enrolled`,
      `Enrolled resident ${newCitizen.name} in Ward ${newCitizen.ward} (Holding: ${newCitizen.holdingNumber}, PDS Tier: ${newCitizen.rationCardTier || newCitizen.rationCard}, Aadhaar: ****-****-${newCitizen.aadhaarLast4}).`,
      {
        category: "citizens",
        severity: "success",
        targetId: newCitizen.id,
        targetTitle: newCitizen.name,
        ward: `Ward ${newCitizen.ward}`,
        meta: newCitizen
      }
    );
  };

  // Handler: Dispatch New Broadcast
  const handleDispatchBroadcast = (e) => {
    e?.preventDefault();
    if (!newBcTitle.trim() || !newBcMessage.trim()) {
      showToast("Please enter broadcast title and message.");
      return;
    }

    const newBc = {
      id: `bc-${Date.now()}`,
      title: newBcTitle.trim(),
      message: newBcMessage.trim(),
      severity: newBcSeverity,
      ward: newBcWard,
      panchayat: selectedLocality,
      active: true,
      postedBy: adminUser?.name || "Panchayat Administrator",
      createdAt: new Date().toISOString()
    };

    const updated = [newBc, ...broadcasts];
    saveBroadcasts(updated);
    addAuditLog(
      `Emergency Notice Broadcast Dispatched [${newBcSeverity.toUpperCase()}]`,
      `"${newBc.title}" broadcasted live to ${newBcWard}. Detail: "${newBc.message.slice(0, 100)}..."`,
      {
        category: "broadcasts",
        severity: newBcSeverity === "urgent" ? "alert" : "warning",
        targetId: newBc.id,
        targetTitle: newBc.title,
        ward: newBcWard,
        meta: newBc
      }
    );
    showToast(`Emergency alert dispatched live to all citizens in ${selectedLocality}!`);
    setNewBcTitle("");
    setNewBcMessage("");
    setIsCreatingBroadcast(false);
  };

  // Handler: Toggle Broadcast Status
  const handleToggleBroadcastActive = (bcId) => {
    let targetBc = null;
    let nextActive = false;
    const updated = broadcasts.map((b) => {
      if (b.id === bcId) {
        targetBc = b;
        nextActive = !b.active;
        return { ...b, active: nextActive };
      }
      return b;
    });
    saveBroadcasts(updated);
    addAuditLog(
      `Emergency Broadcast Notice ${nextActive ? "Re-Activated" : "Archived"}`,
      `Notice "${targetBc?.title || bcId}" for ${targetBc?.ward || "All Wards"} was moved to ${nextActive ? "Active Broadcast" : "Archived"}.`,
      {
        category: "broadcasts",
        severity: "info",
        targetId: bcId,
        targetTitle: targetBc?.title || "Notice",
        ward: targetBc?.ward
      }
    );
    showToast("Broadcast status toggled.");
  };

  // Handler: Export System Snapshot JSON
  const handleExportSystemData = () => {
    const fullSnapshot = {
      panchayat: selectedLocality,
      district: selectedDistrict,
      state: selectedState,
      exportedAt: new Date().toISOString(),
      officer: adminUser,
      grievances,
      submissions,
      citizens,
      broadcasts,
      auditLogs
    };

    const blob = new Blob([JSON.stringify(fullSnapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GramSeva_${selectedLocality}_Panchayat_Admin_Snapshot_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addAuditLog("Panchayat Database Snapshot Exported", "Complete JSON export downloaded");
    showToast("Panchayat data snapshot exported successfully.");
  };

  // Filtered Grievances
  const filteredGrievances = useMemo(() => {
    return grievances.filter((g) => {
      const matchStatus = grievanceFilterStatus === "all" || g.status.toLowerCase().replace(/\s+/g, "_") === grievanceFilterStatus.toLowerCase().replace(/\s+/g, "_") || (grievanceFilterStatus === "pending" && g.status !== "Resolved");
      const matchWard = grievanceFilterWard === "all" || g.ward.toLowerCase() === grievanceFilterWard.toLowerCase();
      const matchSearch = !grievanceSearch.trim() || (
        g.title.toLowerCase().includes(grievanceSearch.toLowerCase()) ||
        g.ticketId.toLowerCase().includes(grievanceSearch.toLowerCase()) ||
        g.category.toLowerCase().includes(grievanceSearch.toLowerCase()) ||
        (g.citizenName && g.citizenName.toLowerCase().includes(grievanceSearch.toLowerCase()))
      );
      return matchStatus && matchWard && matchSearch;
    });
  }, [grievances, grievanceFilterStatus, grievanceFilterWard, grievanceSearch]);

  // Metrics
  const unresolvedGrievancesCount = grievances.filter((g) => g.status !== "Resolved").length;
  const urgentGrievancesCount地理 = grievances.filter((g) => g.priority === "Urgent" || g.priority.includes("Emergency")).length;
  const pendingSubmissionsCount = submissions.filter((s) => !s.status || s.status === "pending_review").length;
  const activeBroadcastsCount = broadcasts.filter((b) => b.active).length;

  return (
    <div className="flex-1 min-h-0 h-full overflow-y-auto px-3 sm:px-6 lg:px-8 pt-4 pb-48 scrollbar-none bg-[#faf8f5] text-stone-900 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ========================================================= */}
        {/* EXECUTIVE CIVIC HEADER BANNER                             */}
        {/* ========================================================= */}
        <div className="bg-[#0e1626] text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c26111]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#c26111]/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner shrink-0 mt-0.5">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold bg-[#c26111]/30 border border-amber-400/40 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Panchayat Officer Administration Portal
                  </span>
                  <span className="text-[10px] font-mono text-stone-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                    Jurisdiction: {selectedLocality} GP ({selectedDistrict})
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {selectedLocality} Grama Panchayat Administration
                </h1>
                <p className="text-xs text-stone-300">
                  Officer in Charge: <strong className="text-amber-300 font-bold">{adminUser?.name || "Executive Officer"}</strong> ({adminUser?.role || "Panchayat Secretary"})
                </p>
              </div>
            </div>

            {/* Quick Action Switchers */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onSwitchToCitizenView}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold bg-[#c26111] hover:bg-[#a8520c] text-white transition active:scale-95 cursor-pointer shadow-md"
                title="View app from a citizen's perspective without logging out"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Citizen View &rarr;</span>
              </button>

              <button
                type="button"
                onClick={handleExportSystemData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition active:scale-95 cursor-pointer"
                title="Download JSON snapshot of all records"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Export Snapshot</span>
              </button>

              <button
                type="button"
                onClick={onExitAdmin}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 transition active:scale-95 cursor-pointer"
                title="Log out of Admin Mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock Console</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-white/10">
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <span className="text-[10px] font-mono text-stone-300 uppercase tracking-wider block font-semibold">Unresolved Complaints</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-amber-300">{unresolvedGrievancesCount}</span>
                <span className="text-[10px] font-bold text-rose-300">({urgentGrievancesCount地理} Urgent)</span>
              </div>
              <span className="text-[10px] text-stone-400 mt-0.5 block">{grievances.length} Total Logged</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <span className="text-[10px] font-mono text-stone-300 uppercase tracking-wider block font-semibold">Directory Moderation</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-emerald-300">{pendingSubmissionsCount}</span>
                <span className="text-[10px] text-stone-300">Pending Review</span>
              </div>
              <span className="text-[10px] text-stone-400 mt-0.5 block">Volunteer Submissions</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <span className="text-[10px] font-mono text-stone-300 uppercase tracking-wider block font-semibold">Registered Citizens</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-white">{citizens.length}</span>
                <span className="text-[10px] text-emerald-300 font-bold">100% e-KYC</span>
              </div>
              <span className="text-[10px] text-stone-400 mt-0.5 block">Ward 4 Focus</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
              <span className="text-[10px] font-mono text-stone-300 uppercase tracking-wider block font-semibold">Active Broadcasts</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-amber-200">{activeBroadcastsCount}</span>
                <span className="text-[10px] text-stone-300">Dispatched</span>
              </div>
              <span className="text-[10px] text-stone-400 mt-0.5 block">Live in Citizen App</span>
            </div>
          </div>
        </div>

        {/* Global Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-2xl bg-emerald-800 text-white text-xs font-extrabold flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{toastMessage}</span>
              </div>
              <button type="button" onClick={() => setToastMessage("")} className="p-1 hover:bg-emerald-700 rounded-lg cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* ADMIN SUB-TABS NAVIGATION STRIP                           */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-stone-200">
          {[
            { id: "grievances", label: "Grievance Resolution Desk", icon: <ShieldAlert className="w-4 h-4" />, badge: unresolvedGrievancesCount },
            { id: "services", label: "Directory Moderation Queue", icon: <Building2 className="w-4 h-4" />, badge: pendingSubmissionsCount },
            { id: "citizens", label: "Citizen Registry & e-KYC", icon: <Users className="w-4 h-4" />, badge: citizens.length },
            { id: "broadcasts", label: "Emergency Alert Dispatcher", icon: <Bell className="w-4 h-4" />, badge: activeBroadcastsCount },
            { id: "audit", label: "Audit Logs & Governance", icon: <FileText className="w-4 h-4" /> }
          ].map((tab) => {
            const isActive做到 = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap border shrink-0 cursor-pointer ${
                  isActive做到
                    ? "bg-[#c26111] text-white border-[#c26111] shadow-xs"
                    : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${isActive做到 ? "bg-white/20 text-white" : "bg-stone-100 text-[#c26111]"}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: GRIEVANCE RESOLUTION DESK                          */}
        {/* ========================================================= */}
        {activeTab === "grievances" && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-xs">
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search complaints by ID, title, citizen, phone..."
                  value={grievanceSearch}
                  onChange={(e) => setGrievanceSearch(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 pl-9 pr-3 py-2 rounded-xl text-xs outline-none focus:bg-white focus:border-[#c26111] focus:ring-1 focus:ring-[#c26111]/20 transition"
                />
              </div>

              <div className="sm:col-span-4 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <select
                  value={grievanceFilterStatus}
                  onChange={(e) => setGrievanceFilterStatus(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-700 py-2 px-2.5 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#c26111] cursor-pointer"
                >
                  <option value="all">All Statuses ({grievances.length})</option>
                  <option value="pending">Unresolved Only ({unresolvedGrievancesCount})</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="field_action">Field Action</option>
                  <option value="resolved">Resolved &amp; Closed</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={grievanceFilterWard}
                  onChange={(e) => setGrievanceFilterWard(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-700 py-2 px-2.5 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#c26111] cursor-pointer"
                >
                  <option value="all">All Wards in {selectedLocality}</option>
                  <option value="Ward 4">Ward 4 (Azhiyur Center)</option>
                  <option value="Ward 3">Ward 3</option>
                  <option value="Ward 8">Ward 8</option>
                  <option value="Ward 12">Ward 12</option>
                </select>
              </div>
            </div>

            {/* Grievances List */}
            <div className="space-y-3">
              {filteredGrievances.map((item) => {
                const isSelected = selectedGrievance?.ticketId === item.ticketId;
                const isResolved = item.status === "Resolved";
                const isUrgent = item.priority === "Urgent" || item.priority.includes("Emergency");

                return (
                  <div
                    key={item.ticketId}
                    className={`bg-white border rounded-2xl p-5 shadow-xs transition ${
                      isSelected ? "border-[#c26111] ring-1 ring-[#c26111]/30" : "border-stone-200/90 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                            {item.ticketId}
                          </span>
                          <span className="text-[10px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                            {item.ward} &bull; {item.panchayat}
                          </span>
                          <span className="text-[10px] font-semibold text-stone-500">
                            {item.category}
                          </span>
                          {isUrgent && (
                            <span className="text-[9px] font-black text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Urgent Severity
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-stone-500">
                          <span>Citizen: <strong className="text-stone-800">{item.citizenName}</strong> ({item.phone})</span>
                          <span>Landmark: <span className="text-stone-700">{item.landmark}</span></span>
                          <span>Assigned Officer: <strong className="text-[#c26111]">{item.officerName || "Unassigned"}</strong></span>
                        </div>

                        {item.officerNotes && (
                          <div className="bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-xl text-xs text-amber-950 mt-2 flex items-start gap-2">
                            <FileText className="w-3.5 h-3.5 text-[#c26111] shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] font-mono uppercase text-amber-800 block font-bold">Officer Action Remarks:</span>
                              <p className="text-amber-900 font-medium">{item.officerNotes}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Status Control Actions */}
                      <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 shrink-0">
                        {/* Status Badge */}
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                            isResolved
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : item.status === "Field Action"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {item.status}
                        </span>

                        {/* Quick Status Buttons */}
                        <div className="flex items-center gap-1.5 pt-1">
                          {item.status !== "Resolved" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpdateGrievanceStatus(item.ticketId, "Field Action")}
                                className="px-2.5 py-1 text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg transition cursor-pointer"
                              >
                                Mark Field Action
                              </button>

                              <button
                                type="button"
                                onClick={() => handleUpdateGrievanceStatus(item.ticketId, "Resolved")}
                                className="px-2.5 py-1 text-[10px] font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition cursor-pointer flex items-center gap-1 shadow-xs"
                              >
                                <Check className="w-3 h-3" />
                                <span>Resolve</span>
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUpdateGrievanceStatus(item.ticketId, "Under Review")}
                              className="px-2.5 py-1 text-[10px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-lg transition cursor-pointer"
                            >
                              Re-open Ticket
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedGrievance(isSelected ? null : item);
                              setOfficerNoteInput(item.officerNotes || "");
                              setAssignedOfficerInput(item.officerName || "");
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 rounded-lg transition cursor-pointer"
                          >
                            {isSelected ? "Close" : "Assign / Remarks"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Officer Edit Panel */}
                    {isSelected && (
                      <div className="mt-4 pt-3.5 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-12 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                        <div className="sm:col-span-4">
                          <label className="text-[10px] font-mono uppercase text-stone-600 block mb-1 font-bold">
                            Assign Responsible Officer / Engineer
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Shri. Suresh Babu (AE, KSEB)"
                            value={assignedOfficerInput}
                            onChange={(e) => setAssignedOfficerInput(e.target.value)}
                            className="w-full bg-white border border-stone-300 text-stone-900 px-3 py-2 rounded-lg text-xs outline-none focus:border-[#c26111]"
                          />
                        </div>

                        <div className="sm:col-span-6">
                          <label className="text-[10px] font-mono uppercase text-stone-600 block mb-1 font-bold">
                            Official Action Remarks / Department Resolution Note
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Technician dispatched; site work completed"
                            value={officerNoteInput}
                            onChange={(e) => setOfficerNoteInput(e.target.value)}
                            className="w-full bg-white border border-stone-300 text-stone-900 px-3 py-2 rounded-lg text-xs outline-none focus:border-[#c26111]"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-end">
                          <button
                            type="button"
                            onClick={() => handleSaveOfficerDetails(item.ticketId)}
                            className="w-full py-2 bg-[#c26111] hover:bg-[#a8520c] text-white font-extrabold text-xs rounded-lg transition cursor-pointer shadow-xs"
                          >
                            Save Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredGrievances.length === 0 && (
                <div className="bg-white border border-stone-200 p-8 rounded-2xl text-center text-stone-500 text-xs shadow-xs">
                  No grievances found matching the current search filters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: COMMUNITY DIRECTORY MODERATION QUEUE               */}
        {/* ========================================================= */}
        {activeTab === "services" && (
          <AdminModerationQueue
            submissions={submissions}
            onApprove={handleApproveSubmission}
            onReject={handleRejectSubmission}
            onRestore={handleRestoreSubmission}
            onAddOfficialFacility={handleAddOfficialFacility}
            selectedLocality={selectedLocality}
            selectedDistrict={selectedDistrict}
            selectedState={selectedState数字}
            adminUser={adminUser}
            showToast={showToast}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 3: CITIZEN REGISTRY & e-KYC LEDGER                    */}
        {/* ========================================================= */}
        {activeTab === "citizens" && (
          <AdminCitizenRegistry
            citizens={citizens}
            onToggleVerification={handleToggleCitizenVerification}
            onAddNewCitizen={handleAddNewCitizen}
            selectedLocality={selectedLocality}
            selectedDistrict={selectedDistrict}
            selectedState={selectedState数字}
            adminUser={adminUser}
            showToast={showToast}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 4: EMERGENCY ALERT & WARD NOTICE DISPATCHER           */}
        {/* ========================================================= */}
        {activeTab === "broadcasts" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">Emergency Civic Broadcasts</h3>
                <p className="text-xs text-stone-500">
                  Dispatched notices appear live in the emergency notification banner for all citizens in {selectedLocality}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreatingBroadcast(!isCreatingBroadcast)}
                className="px-4 py-2.5 bg-[#c26111] hover:bg-[#a8520c] text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{isCreatingBroadcast ? "Close Form" : "Dispatch New Notice"}</span>
              </button>
            </div>

            {/* Broadcast Creation Form */}
            {isCreatingBroadcast && (
              <form onSubmit={handleDispatchBroadcast} className="bg-white border border-amber-300 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                  <Bell className="w-4 h-4 text-[#c26111]" />
                  <h4 className="font-bold text-sm text-stone-900">Compose Emergency Public Announcement</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-mono uppercase text-stone-600 block mb-1 font-bold">
                      Notice Headline
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. KWA Drinking Water Supply Shutdown"
                      value={newBcTitle}
                      onChange={(e) => setNewBcTitle(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:bg-white focus:border-[#c26111]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-stone-600 block mb-1 font-bold">
                      Target Area / Ward
                    </label>
                    <select
                      value={newBcWard}
                      onChange={(e) => setNewBcWard(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3 py-2.5 rounded-xl text-xs outline-none focus:bg-white focus:border-[#c26111] cursor-pointer"
                    >
                      <option value="All Wards">All Wards (Entire Panchayat)</option>
                      <option value="Ward 4">Ward 4 Only</option>
                      <option value="Ward 4 & 5">Ward 4 &amp; 5</option>
                      <option value="Ward 1 to 6">Ward 1 to 6 (North Zone)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-stone-600 block mb-1 font-bold">
                    Announcement Message Body
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide specific instructions, timing, affected roads, or contact helpline..."
                    value={newBcMessage}
                    onChange={(e) => setNewBcMessage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:bg-white focus:border-[#c26111] resize-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-stone-600 font-bold">Severity:</span>
                    {["warning", "urgent", "info"].map((sev) => (
                      <label key={sev} className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                        <input
                          type="radio"
                          name="severity"
                          value={sev}
                          checked={newBcSeverity === sev}
                          onChange={(e) => setNewBcSeverity(e.target.value)}
                          className="accent-[#c26111]"
                        />
                        <span className="capitalize">{sev}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#c26111] hover:bg-[#a8520c] text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Broadcast Instantly &rarr;</span>
                  </button>
                </div>
              </form>
            )}

            {/* Existing Broadcasts List */}
            <div className="space-y-3">
              {broadcasts.map((bc) => (
                <div
                  key={bc.id}
                  className={`bg-white border rounded-2xl p-4 space-y-2 transition shadow-xs ${
                    bc.active ? "border-amber-300" : "border-stone-200 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            bc.severity === "urgent"
                              ? "bg-rose-50 text-rose-800 border border-rose-200"
                              : bc.severity === "warning"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {bc.severity} Notice
                        </span>
                        <span className="text-[10px] font-mono text-stone-500">
                          {bc.ward} &bull; {bc.panchayat}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-stone-900">{bc.title}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">{bc.message}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleBroadcastActive(bc.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          bc.active
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                            : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
                        }`}
                      >
                        {bc.active ? "Active Broadcast" : "Archived"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: AUDIT LOGS & GOVERNANCE COMPLIANCE                  */}
        {/* ========================================================= */}
        {activeTab === "audit" && (
          <AdminActivityLog
            auditLogs={auditLogs}
            onClearLogs={handleClearAuditLogs}
            selectedLocality={selectedLocality}
            selectedDistrict={selectedDistrict}
            adminUser={adminUser}
            showToast={showToast}
          />
        )}

        {/* ========================================================= */}
        {/* OFFICIAL PANCHAYAT ADMINISTRATION CONSOLE FOOTER          */}
        {/* ========================================================= */}
        <div className="mt-12 pt-6 pb-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 select-none">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c26111] shrink-0" />
            <span>GramSeva Panchayat Officer Portal &bull; {selectedLocality} Grama Panchayat ({selectedDistrict})</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSwitchToCitizenView}
              className="text-[#c26111] hover:text-[#a8520c] font-bold hover:underline cursor-pointer transition"
            >
              Citizen View &rarr;
            </button>
            <span className="text-stone-300">&bull;</span>
            <button
              type="button"
              onClick={onExitAdmin}
              className="text-rose-700 hover:text-rose-800 font-bold hover:underline cursor-pointer transition"
            >
              Lock Admin Session
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
