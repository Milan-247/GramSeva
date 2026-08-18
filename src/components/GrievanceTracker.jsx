import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  MapPin,
  MessageSquare,
  PlusCircle,
  Search,
  ShieldAlert,
  Sparkles,
  Upload,
  UserCheck,
  X,
  Camera,
  Copy,
  Check,
  ChevronRight,
  ArrowUpRight,
  Send,
  Building2,
  RefreshCw
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc, serverTimestamp } from "firebase/firestore";

const SAMPLE_GRIEVANCES = [
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
    status: "Field Verification",
    photoUrl: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=500&auto=format&fit=crop&q=60",
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    officerName: "Shri. Suresh Babu (Panchayat Executive Engineer)",
    timeline: [
      { status: "Submitted", time: "28 hours ago", note: "Complaint logged by citizen via GramSeva Portal.", done: true },
      { status: "Assigned to Panchayat Secretary", time: "22 hours ago", note: "Assigned to Ward 4 Electrical Overseer.", done: true },
      { status: "Field Verification", time: "4 hours ago", note: "Technician inspected site. Replacement LED driver ordered.", done: true, current: true },
      { status: "Resolved & Closed", time: "Pending", note: "Work estimated completion within 24 hours.", done: false }
    ]
  },
  {
    id: "GRM-KAR-2026-8812",
    ticketId: "GRM-KAR-2026-8812",
    category: "Water Pipeline Leakage",
    title: "Major clean water pipe burst near Panchayat Office Road",
    description: "Drinking water is leaking profusely onto the tar road since morning 7 AM. Waste of clean water supply.",
    state: "karnataka",
    district: "Dakshina Kannada",
    panchayat: "Mangaluru Rural",
    ward: "Ward 12",
    landmark: "Opposite Grama Panchayat Office Bus Stand",
    citizenName: "Anitha Shetty",
    phone: "+91 99001 88234",
    priority: "Emergency Sanitation",
    status: "Resolved",
    photoUrl: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=500&auto=format&fit=crop&q=60",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    officerName: "Smt. Kavitha (Jal Jeevan Mission Overseer)",
    timeline: [
      { status: "Submitted", time: "3 days ago", note: "Emergency complaint submitted.", done: true },
      { status: "Assigned to Panchayat Secretary", time: "2 days ago", note: "Water supply valve temporarily shut for repair.", done: true },
      { status: "Field Verification", time: "1 day ago", note: "Pipe joint welded and reinforced.", done: true },
      { status: "Resolved & Closed", time: "12 hours ago", note: "Water supply restored and pressure tested OK.", done: true, current: true }
    ]
  },
  {
    id: "GRM-TN-2026-7731",
    ticketId: "GRM-TN-2026-7731",
    category: "Garbage & Sanitation",
    title: "Uncollected organic waste near Pollachi Market Road",
    description: "Market vegetable waste accumulating near the public bin causing foul smell and health hazard.",
    state: "tamilnadu",
    district: "Coimbatore",
    panchayat: "Pollachi North",
    ward: "Ward 8",
    landmark: "Pollachi Daily Farmer Market Block B",
    citizenName: "M. Selvam",
    phone: "+91 94432 55123",
    priority: "Normal",
    status: "Under Review",
    photoUrl: "",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    officerName: "Thiru. Arumugam (Health Inspector)",
    timeline: [
      { status: "Submitted", time: "6 hours ago", note: "Complaint logged by resident.", done: true },
      { status: "Under Review", time: "2 hours ago", note: "Sanitation vehicle route scheduled.", done: true, current: true },
      { status: "Field Action", time: "Pending", note: "Clean-up team dispatching in next batch.", done: false },
      { status: "Resolved & Closed", time: "Pending", note: "Pending citizen confirmation.", done: false }
    ]
  }
];

const CATEGORIES = [
  "Streetlight Breakdown",
  "Water Pipeline Leakage",
  "Garbage & Sanitation",
  "Potholes & Road Repair",
  "Drainage Blockage",
  "Illegal Encroachment",
  "Public Health & Stray Animals",
  "Trade License / Fee Query",
  "Other Local Governance Issue"
];

const SAMPLE_PHOTO_PRESETS = [
  { name: "Broken Streetlight", url: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=500&auto=format&fit=crop&q=60" },
  { name: "Water Leakage", url: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=500&auto=format&fit=crop&q=60" },
  { name: "Damaged Road", url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=60" },
  { name: "Overflowing Bin", url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop&q=60" }
];

export default function GrievanceTracker({ user, selectedState = "kerala", districtsList = [], panchayatsByDistrict = {} }) {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [copiedId, setCopiedId] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterState, setFilterState] = useState("all");

  // Form State
  const [category, setCategory] = useState("Streetlight Breakdown");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formState, setFormState] = useState(selectedState);
  const [district, setDistrict] = useState(districtsList[0]?.en || "Kozhikode");
  const [panchayat, setPanchayat] = useState("Azhiyur");
  const [ward, setWard] = useState("Ward 1");
  const [landmark, setLandmark] = useState("");
  const [citizenName, setCitizenName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [priority, setPriority] = useState("Normal");
  const [photoUrl, setPhotoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Load Grievances from Firestore or LocalStorage
  const loadGrievances = async () => {
    setLoading(true);
    try {
      const localSaved = localStorage.getItem("gramseva_grievances");
      let localList = localSaved ? JSON.parse(localSaved) : [];
      
      let firestoreList = [];
      if (db) {
        try {
          const q = query(collection(db, "grievances"), orderBy("createdAt", "desc"));
          const snapshot = await getDocs(q);
          firestoreList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) {
          console.warn("Firestore grievances query fallback:", e);
        }
      }

      const combined = [...firestoreList, ...localList, ...SAMPLE_GRIEVANCES];
      // Deduplicate by ticketId
      const uniqueMap = new Map();
      combined.forEach(item => {
        if (!uniqueMap.has(item.ticketId || item.id)) {
          uniqueMap.set(item.ticketId || item.id, item);
        }
      });
      setGrievances(Array.from(uniqueMap.values()));
    } catch (err) {
      console.error("Failed loading grievances:", err);
      setGrievances(SAMPLE_GRIEVANCES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrievances();
  }, []);

  // Sync state/district selection
  useEffect(() => {
    if (districtsList && districtsList.length > 0) {
      const firstDist = typeof districtsList[0] === "string" ? districtsList[0] : (districtsList[0].en || districtsList[0].id);
      setDistrict(firstDist);
      const panchs = panchayatsByDistrict[firstDist];
      if (panchs && panchs.length > 0) {
        setPanchayat(typeof panchs[0] === "string" ? panchs[0] : panchs[0].en);
      }
    }
  }, [formState, districtsList, panchayatsByDistrict]);

  const handleDistrictChange = (dName) => {
    setDistrict(dName);
    const panchs = panchayatsByDistrict[dName];
    if (panchs && panchs.length > 0) {
      setPanchayat(typeof panchs[0] === "string" ? panchs[0] : panchs[0].en);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    const stCode = formState.substring(0, 3).toUpperCase();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newTicketId = `GRM-${stCode}-2026-${randNum}`;

    const newGrievance = {
      ticketId: newTicketId,
      category,
      title,
      description,
      state: formState,
      district,
      panchayat,
      ward,
      landmark,
      citizenName: citizenName || "Anonymous Resident",
      phone: phone || "Not Provided",
      priority,
      status: "Submitted",
      photoUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      officerName: "Panchayat Helpdesk Officer",
      timeline: [
        { status: "Submitted", time: "Just now", note: "Grievance registered in GramSeva Citizen Portal.", done: true, current: true },
        { status: "Assigned to Panchayat Secretary", time: "Pending", note: "Awaiting administrative routing to Ward Engineer.", done: false },
        { status: "Field Verification", time: "Pending", note: "Site visit and inspection by duty officer.", done: false },
        { status: "Resolved & Closed", time: "Pending", note: "Confirmation by resident.", done: false }
      ]
    };

    try {
      if (db) {
        try {
          await addDoc(collection(db, "grievances"), {
            ...newGrievance,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } catch (fErr) {
          console.warn("Saved locally due to Firestore permission/network:", fErr);
        }
      }

      // Save locally
      const existing = JSON.parse(localStorage.getItem("gramseva_grievances") || "[]");
      localStorage.setItem("gramseva_grievances", JSON.stringify([newGrievance, ...existing]));

      setGrievances(prev => [newGrievance, ...prev]);
      setSubmitSuccess(`Ticket created! ID: ${newTicketId}`);
      setShowModal(false);

      // Reset form
      setTitle("");
      setDescription("");
      setLandmark("");
      setPhotoUrl("");
      setTimeout(() => setSubmitSuccess(""), 6000);
    } catch (err) {
      console.error("Grievance submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyTicket = (ticketId) => {
    navigator.clipboard.writeText(ticketId);
    setCopiedId(ticketId);
    setTimeout(() => setCopiedId(""), 2000);
  };

  const filteredGrievances = grievances.filter((g) => {
    const matchesSearch =
      g.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.panchayat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || g.status?.toLowerCase().replace(/\s+/g, "") === filterStatus.toLowerCase().replace(/\s+/g, "");
    const matchesState = filterState === "all" || g.state?.toLowerCase() === filterState.toLowerCase();

    return matchesSearch && matchesStatus && matchesState;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Resolved":
      case "Resolved & Closed":
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Resolved</span>;
      case "Field Verification":
      case "Field Action":
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Field Inspection</span>;
      case "Under Review":
      case "Assigned to Panchayat Secretary":
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Under Review</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Submitted</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0e1626] via-[#162238] to-[#1c2b47] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#e07a1e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#c26111]/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Grama Panchayat Grievance &amp; Redressal Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Real-time Citizen Grievance Tracker
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Lodge public infrastructure issues (streetlights, water leaks, garbage, road repairs) directly to your Ward Secretary. Track live inspection steps and officer updates in real time.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#c26111] hover:bg-[#a8520c] text-white font-extrabold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 transition transform active:scale-95 shadow-lg cursor-pointer text-sm"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Lodge New Complaint</span>
            </button>
            <button
              onClick={loadGrievances}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-4 py-3 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer text-xs sm:text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Tickets</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{submitSuccess}</span>
          </div>
          <button onClick={() => setSubmitSuccess("")} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Controls & Filter Toolbar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Ticket ID (e.g., GRM-KER-2026), category, or panchayat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm font-medium outline-none focus:border-slate-900 focus:bg-white transition"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1 text-xs font-medium">
            <span className="text-stone-500 px-2 flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> State:</span>
            {["all", "kerala", "karnataka", "tamilnadu", "andhrapradesh"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterState(s)}
                className={`px-2.5 py-1 rounded-lg transition capitalize cursor-pointer ${
                  filterState === s ? "bg-white text-slate-900 font-bold shadow-xs" : "text-stone-600 hover:text-slate-900"
                }`}
              >
                {s === "all" ? "All" : s === "tamilnadu" ? "TN" : s === "andhrapradesh" ? "AP" : s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1 text-xs font-medium">
            <span className="text-stone-500 px-2">Status:</span>
            {["all", "submitted", "underreview", "resolved"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg transition capitalize cursor-pointer ${
                  filterStatus === st ? "bg-white text-slate-900 font-bold shadow-xs" : "text-stone-600 hover:text-slate-900"
                }`}
              >
                {st === "all" ? "All" : st === "underreview" ? "Active" : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Ticket List + Selected Timeline View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
            <span>Logged Complaints ({filteredGrievances.length})</span>
            <span>Click to View Live Timeline</span>
          </div>

          {loading ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center text-stone-500 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
              <p className="text-xs font-medium">Loading citizen grievances...</p>
            </div>
          ) : filteredGrievances.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center space-y-3">
              <ShieldAlert className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-sm font-semibold text-stone-700">No grievances found matching filters</p>
              <button
                onClick={() => { setSearchQuery(""); setFilterStatus("all"); setFilterState("all"); }}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Clear search filters
              </button>
            </div>
          ) : (
            filteredGrievances.map((g) => {
              const isSelected = selectedGrievance?.ticketId === g.ticketId;
              return (
                <div
                  key={g.ticketId || g.id}
                  onClick={() => setSelectedGrievance(g)}
                  className={`bg-white border rounded-2xl p-4 transition cursor-pointer relative ${
                    isSelected
                      ? "border-emerald-600 ring-2 ring-emerald-600/20 shadow-md bg-emerald-50/20"
                      : "border-stone-200 hover:border-stone-300 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200 flex items-center gap-1">
                          {g.ticketId}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCopyTicket(g.ticketId); }}
                            className="text-stone-400 hover:text-slate-900 cursor-pointer ml-1"
                            title="Copy Ticket ID"
                          >
                            {copiedId === g.ticketId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </span>
                        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                          {g.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {g.title}
                      </h3>
                    </div>
                    {getStatusBadge(g.status)}
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">
                    {g.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="font-medium text-slate-700">{g.panchayat || "Grama Panchayat"}</span>
                      <span className="text-stone-400">• {g.district}</span>
                    </div>
                    <span className="text-stone-400 text-[11px] font-mono">
                      {new Date(g.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Ticket Timeline & Officer Notes */}
        <div className="lg:col-span-5 sticky top-6">
          {selectedGrievance ? (
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-md space-y-6">
              {/* Ticket Header */}
              <div className="space-y-3 pb-4 border-b border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg">
                    {selectedGrievance.ticketId}
                  </span>
                  {getStatusBadge(selectedGrievance.status)}
                </div>

                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedGrievance.title}
                </h2>

                <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 space-y-1.5 text-xs">
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {selectedGrievance.description}
                  </p>
                  <div className="pt-2 border-t border-stone-200 flex flex-wrap gap-x-4 gap-y-1 text-stone-500">
                    <span><strong>State:</strong> <span className="capitalize">{selectedGrievance.state}</span></span>
                    <span><strong>Panchayat:</strong> {selectedGrievance.panchayat}</span>
                    <span><strong>Ward:</strong> {selectedGrievance.ward}</span>
                    {selectedGrievance.landmark && <span><strong>Landmark:</strong> {selectedGrievance.landmark}</span>}
                  </div>
                </div>

                {selectedGrievance.photoUrl && (
                  <div className="rounded-xl overflow-hidden border border-stone-200 aspect-video max-h-48 relative">
                    <img src={selectedGrievance.photoUrl} alt="Complaint evidence" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                      Attached Evidence Photo
                    </span>
                  </div>
                )}
              </div>

              {/* Timeline Steps */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Live Resolution Timeline</span>
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {(selectedGrievance.timeline || []).map((step, idx) => (
                    <div key={idx} className="relative group">
                      {/* Node Dot */}
                      <span
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition ${
                          step.done
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                            : "bg-white border-stone-300 text-stone-400"
                        }`}
                      >
                        {step.done ? "✓" : idx + 1}
                      </span>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold ${step.done ? "text-slate-900" : "text-stone-400"}`}>
                            {step.status}
                          </h4>
                          <span className="text-[10px] font-mono text-stone-400">{step.time}</span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed font-normal bg-stone-50 p-2 rounded-lg border border-stone-100">
                          {step.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duty Officer Info */}
              {selectedGrievance.officerName && (
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <p className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">Assigned Duty Officer</p>
                    <p className="font-bold text-slate-900">{selectedGrievance.officerName}</p>
                    <p className="text-stone-500 text-[11px]">Local Grama Panchayat Health &amp; Works Division</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-stone-50 border border-dashed border-stone-300 rounded-3xl p-8 text-center space-y-3">
              <FileText className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Select a Grievance Ticket</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Click any complaint on the left to inspect its real-time field status, technician notes, and evidence photos.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Grievance Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-slate-900 transition p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-extrabold uppercase tracking-wider">
                <PlusCircle className="w-4 h-4" />
                <span>Grama Panchayat Redressal</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Lodge Public Complaint
              </h2>
              <p className="text-xs text-stone-500">
                Your report will be automatically dispatched to your selected Grama Panchayat Secretary &amp; Ward Engineer.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* State, District, Panchayat */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                  <select
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-900 capitalize outline-none focus:border-slate-900"
                  >
                    <option value="kerala">Kerala</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="tamilnadu">Tamil Nadu</option>
                    <option value="andhrapradesh">Andhra Pradesh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District *</label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                  >
                    {districtsList.map((d, idx) => {
                      const dName = typeof d === "string" ? d : (d.en || d.id);
                      return <option key={`dist_${dName}_${idx}`} value={dName}>{dName}</option>;
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Panchayat *</label>
                  <select
                    value={panchayat}
                    onChange={(e) => setPanchayat(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                  >
                    {(panchayatsByDistrict[district] || [{ en: "Azhiyur" }]).map((p, idx) => {
                      const pName = typeof p === "string" ? p : p.en;
                      const pCode = typeof p === "object" && p.code ? p.code : pName;
                      return (
                        <option key={`p_${pCode}_${idx}`} value={pName}>
                          {pName} {typeof p === "object" && p.block ? `(${p.block})` : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Complaint Summary / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Streetlight pole damaged near High School entrance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the exact location, duration of issue, and any risk factors..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>

              {/* Ward & Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ward Number</label>
                  <input
                    type="text"
                    placeholder="e.g. Ward 4"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Landmark / House No</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Ration Shop No 12"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              {/* Citizen Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="Citizen Name"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (SMS updates)</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              {/* Evidence Photo Pickers */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Evidence Photo (Optional)</label>
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="Paste image URL or pick sample photo below..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-slate-900"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-stone-400">Quick Samples:</span>
                    {SAMPLE_PHOTO_PRESETS.map((p, idx) => (
                      <button
                        type="button"
                        key={`preset_${p.name}_${idx}`}
                        onClick={() => setPhotoUrl(p.url)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-md border transition cursor-pointer ${
                          photoUrl === p.url ? "bg-emerald-600 text-white border-emerald-600" : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-98 disabled:opacity-50 text-sm"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Registering Complaint...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Grievance to Panchayat</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
