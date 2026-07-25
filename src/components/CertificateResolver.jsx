import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Check,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Camera,
  Layers,
  Zap,
  Building2,
  Clock,
  Banknote,
  Search,
  ChevronRight,
  ChevronDown,
  Info,
  RefreshCw,
  Sparkles,
  GitFork,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  Plus,
  Trash2,
  Share2,
  Printer
} from "lucide-react";
import { ANCHOR_DOCUMENTS, TARGET_CERTIFICATES, STATE_DATASETS } from "../data/certificateGraphData.js";
import { solveCertificateGraph } from "../utils/aoStarSolver.js";
import { scanDocumentPhoto, inspectDocumentMismatches, SAMPLE_DOCUMENT_PRESETS } from "../utils/documentOcr.js";

export default function CertificateResolver({ language = "en" }) {
  // State variables
  const [selectedState, setSelectedState] = useState("kerala");
  const [objective, setObjective] = useState("fewest_visits"); // fewest_visits | fastest | lowest_fee
  const [targetIds, setTargetIds] = useState(["income_cert", "obc_ncl_cert"]);
  const [heldDocIds, setHeldDocIds] = useState(["aadhaar", "ration_card", "sslc_marksheet", "electricity_bill"]);
  
  // Internal active view: 'intake' | 'plan' | 'graph' | 'ocr'
  const [activeSubTab, setActiveSubTab] = useState("plan");
  
  // OCR Scanned documents & inspection state
  const [scannedDocs, setScannedDocs] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanDocType, setScanDocType] = useState("aadhaar");
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [editingDocId, setEditingDocId] = useState(null);

  // Load Preset Sample Document
  const handleLoadPreset = (preset) => {
    // Avoid duplicate preset IDs
    const newDoc = { ...preset, id: `${preset.id}_${Date.now()}` };
    setScannedDocs((prev) => [...prev, newDoc]);
    if (!heldDocIds.includes(preset.documentTypeId)) {
      setHeldDocIds((prev) => [...prev, preset.documentTypeId]);
    }
  };

  // Update Extracted Field in Scanned Doc
  const handleUpdateExtractedField = (docId, fieldKey, newValue) => {
    setScannedDocs((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            extractedData: {
              ...doc.extractedData,
              [fieldKey]: newValue
            }
          };
        }
        return doc;
      })
    );
  };

  // Expanded alternative routes UI state
  const [expandedStepRoute, setExpandedStepRoute] = useState(null);

  // Search/Filter in Target Certs
  const [targetSearchQuery, setTargetSearchQuery] = useState("");
  const [targetCategoryFilter, setTargetCategoryFilter] = useState("all");

  // Search/Filter in Held Docs
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [docCategoryFilter, setDocCategoryFilter] = useState("all");

  // Compute graph solution using AO* algorithm
  const solverResult = useMemo(() => {
    return solveCertificateGraph({
      targetIds,
      heldDocIds,
      stateKey: selectedState,
      objective
    });
  }, [targetIds, heldDocIds, selectedState, objective]);

  // Inspect Mismatches across scanned documents
  const mismatchReport = useMemo(() => {
    return inspectDocumentMismatches(scannedDocs);
  }, [scannedDocs]);

  // Toggle Target Certificate
  const toggleTarget = (id) => {
    setTargetIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // Toggle Held Document
  const toggleHeldDoc = (id) => {
    setHeldDocIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  // Handle Photo File Scan
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const scanned = await scanDocumentPhoto(file, scanDocType);
      setScannedDocs((prev) => [...prev, scanned]);
      
      // Also auto-check the held document
      if (!heldDocIds.includes(scanDocType)) {
        setHeldDocIds((prev) => [...prev, scanDocType]);
      }
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  // Remove Scanned Doc
  const removeScannedDoc = (id) => {
    setScannedDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const currentState = STATE_DATASETS[selectedState] || STATE_DATASETS.kerala;

  // Filtered Target Certificates list
  const filteredTargetCerts = TARGET_CERTIFICATES.filter((cert) => {
    const matchesSearch = cert.name.toLowerCase().includes(targetSearchQuery.toLowerCase()) ||
                          cert.desc.toLowerCase().includes(targetSearchQuery.toLowerCase());
    const matchesCat = targetCategoryFilter === "all" || cert.category === targetCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Held Docs list
  const filteredAnchorDocs = ANCHOR_DOCUMENTS.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
                          doc.desc.toLowerCase().includes(docSearchQuery.toLowerCase());
    const matchesCat = docCategoryFilter === "all" || doc.category === docCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white text-slate-900 overflow-y-auto scrollbar-none pb-24">
      {/* Top Banner / Hero Controls */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white p-4 sm:p-6 lg:p-8 border-b border-emerald-800/50 shadow-md">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <GitFork className="w-3 h-3" /> AO* Graph Solver
                </span>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  Joint Dependency Engine
                </span>
              </div>
              <h2 className="font-classical text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mt-1">
                Certificate Dependency Resolver
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
                Finds the true shortest route, minimum office visits, and exact prerequisite order for government certificates across Indian states. Eliminates duplicate applications.
              </p>
            </div>

            {/* State Selector */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shrink-0 space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300 block">
                Select State Ruleset
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-slate-900 border border-emerald-500/40 text-white font-bold rounded-xl px-3 py-1.5 text-xs outline-none focus:border-emerald-400 transition"
              >
                <option value="kerala">🌴 Kerala (e-District / Akshaya)</option>
                <option value="karnataka">🏰 Karnataka (Seva Sindhu / Nada Kacheri)</option>
                <option value="tamilnadu">🏛️ Tamil Nadu (e-Sevai / TNeGA)</option>
                <option value="pan_india">🌾 Pan-India (National e-District / Tehsil)</option>
              </select>
              <span className="text-[9px] text-emerald-300 block font-medium">
                {currentState.portalName}
              </span>
            </div>
          </div>

          {/* Strategy Objective Pills & Quick Summary Bar */}
          <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
                Optimization Goal:
              </span>
              {[
                { id: "fewest_visits", label: "🏛️ Fewest Office Visits", icon: <Building2 className="w-3.5 h-3.5" /> },
                { id: "fastest", label: "⚡ Fastest Processing", icon: <Zap className="w-3.5 h-3.5" /> },
                { id: "lowest_fee", label: "💰 Lowest Official Fee", icon: <Banknote className="w-3.5 h-3.5" /> }
              ].map((opt) => {
                const isActive = objective === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setObjective(opt.id)}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition flex items-center gap-1.5 cursor-pointer border ${
                      isActive
                        ? "bg-emerald-500 text-slate-950 border-emerald-300 shadow-md font-black scale-105"
                        : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Metric pill summary */}
            <div className="flex items-center gap-3 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px]">
              <div className="flex items-center gap-1 text-emerald-400 font-black">
                <Building2 className="w-3.5 h-3.5" />
                <span>{solverResult.totalVisits} Visits</span>
              </div>
              <div className="w-px h-3 bg-slate-700" />
              <div className="flex items-center gap-1 text-amber-300 font-black">
                <Clock className="w-3.5 h-3.5" />
                <span>~{solverResult.totalDays} Days</span>
              </div>
              <div className="w-px h-3 bg-slate-700" />
              <div className="flex items-center gap-1 text-teal-300 font-black">
                <Banknote className="w-3.5 h-3.5" />
                <span>₹{solverResult.totalFee} Fee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto scrollbar-none mb-4 select-none">
          {[
            { id: "intake", label: "1. Target & Held Docs", icon: <CheckCircle2 className="w-4 h-4" />, count: targetIds.length },
            { id: "plan", label: "2. Optimal Plan (AO*)", icon: <Zap className="w-4 h-4" />, highlight: solverResult.savedVisits > 0 },
            { id: "graph", label: "3. Dependency Map", icon: <GitFork className="w-4 h-4" /> },
            { id: "ocr", label: "4. Document OCR & Scan", icon: <Camera className="w-4 h-4" />, badge: mismatchReport.hasMismatches ? "Mismatch" : null }
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? "bg-emerald-700 text-white border-emerald-800 shadow-sm font-black"
                    : "bg-stone-100 hover:bg-stone-200 text-slate-700 border-stone-200"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? "bg-emerald-900 text-white" : "bg-stone-300 text-slate-800"}`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-500 text-slate-950 uppercase animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SUB-TAB 1: INTAKE & SELECTION */}
        {activeSubTab === "intake" && (
          <div className="space-y-6 animate-fade-in">
            {/* Target Certificates Selector */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-emerald-700" />
                    Target Certificates You Want to Obtain ({TARGET_CERTIFICATES.length} Total)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select all certificates you need. The solver will calculate joint prerequisites so you don't collect the same document twice.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0 self-start sm:self-auto">
                  {targetIds.length} Selected
                </span>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search target certificates (e.g. Income, Caste, FSSAI, License...)"
                    value={targetSearchQuery}
                    onChange={(e) => setTargetSearchQuery(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-600"
                  />
                </div>

                <select
                  value={targetCategoryFilter}
                  onChange={(e) => setTargetCategoryFilter(e.target.value)}
                  className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold outline-none focus:border-emerald-600"
                >
                  <option value="all">All Certificate Categories</option>
                  <option value="revenue">Revenue & Income</option>
                  <option value="civil">Civil & Vital Records</option>
                  <option value="education">Education & Employment</option>
                  <option value="business">Business & Commerce</option>
                  <option value="transport">Transport & RTO</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {filteredTargetCerts.map((cert) => {
                  const isChecked = targetIds.includes(cert.id);
                  return (
                    <label
                      key={cert.id}
                      onClick={() => toggleTarget(cert.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition select-none flex items-start gap-3 ${
                        isChecked
                          ? "bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/50 shadow-xs"
                          : "bg-white border-stone-200 hover:border-stone-300 text-slate-800"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 accent-emerald-700 rounded cursor-pointer shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-extrabold text-slate-900 block leading-tight">
                          {cert.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block leading-normal mt-0.5">
                          {cert.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Possessed / Held Documents Checklist */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    Documents You Already Possess
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Check the documents, ID cards, and tax receipts you currently hold in hand or in DigiLocker.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 bg-stone-200 px-2.5 py-1 rounded-full border border-stone-300">
                    {heldDocIds.length} Held
                  </span>
                  <button
                    onClick={() => setActiveSubTab("plan")}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    Solve Plan <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search documents (e.g. Aadhaar, Ration Card, Salary...)"
                    value={docSearchQuery}
                    onChange={(e) => setDocSearchQuery(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-600"
                  />
                </div>

                <select
                  value={docCategoryFilter}
                  onChange={(e) => setDocCategoryFilter(e.target.value)}
                  className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold outline-none focus:border-emerald-600"
                >
                  <option value="all">All Categories</option>
                  <option value="identity">Identity & Digital ID</option>
                  <option value="residence">Residence & Utility</option>
                  <option value="income">Income & Taxes</option>
                  <option value="education">Education & Birth</option>
                  <option value="family">Family & Land</option>
                </select>
              </div>

              {/* Document List Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {filteredAnchorDocs.map((doc) => {
                  const isPossessed = heldDocIds.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleHeldDoc(doc.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition select-none flex items-start gap-2.5 ${
                        isPossessed
                          ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-medium"
                          : "bg-white border-stone-200 hover:border-stone-300 text-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isPossessed}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 accent-emerald-700 rounded cursor-pointer shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-extrabold text-slate-900 truncate">
                            {doc.name}
                          </span>
                          {doc.anchor && (
                            <span className="text-[9px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300 shrink-0">
                              Anchor
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                          {doc.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: OPTIMAL PLAN (AO* SOLUTION) */}
        {activeSubTab === "plan" && (
          <div className="space-y-6 animate-fade-in">
            {/* Redundancy Savings Banner */}
            {solverResult.redundancySavings && (
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-300 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 sm:mt-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block">
                      AO* Joint Dependency Optimizer Active
                    </span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5 leading-relaxed">
                      {solverResult.redundancySavings}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => setActiveSubTab("graph")}
                    className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-slate-800 text-xs font-extrabold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <GitFork className="w-3.5 h-3.5 text-emerald-700" /> View Graph Map
                  </button>
                </div>
              </div>
            )}

            {/* Execution Steps Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-700" />
                  Step-By-Step Execution Route ({solverResult.executionSteps.length} Steps)
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {currentState.stateName} &middot; {currentState.portalName}
                </span>
              </div>

              {solverResult.executionSteps.length === 0 ? (
                <div className="bg-stone-50 border border-dashed border-stone-300 rounded-2xl p-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-slate-800 text-base">You already hold all required certificates!</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Select additional target certificates in Tab 1 if you wish to compute a new application plan.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {solverResult.executionSteps.map((step) => {
                    const isExpanded = expandedStepRoute === step.nodeId;
                    const altRoutes = currentState.routes[step.nodeId] || [];

                    return (
                      <div
                        key={step.nodeId}
                        className={`border rounded-2xl p-4 sm:p-5 transition shadow-2xs ${
                          step.isTarget
                            ? "bg-white border-emerald-300 ring-1 ring-emerald-500/20"
                            : "bg-stone-50 border-stone-200"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            {/* Step Number Badge */}
                            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                              {step.stepNumber}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                                  {step.office}
                                </span>
                                {step.isTarget && (
                                  <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded border border-amber-300">
                                    Final Target Cert
                                  </span>
                                )}
                              </div>

                              <h4 className="font-classical text-base font-black text-slate-900 mt-1">
                                Obtain {step.title}
                              </h4>

                              <p className="text-xs font-semibold text-emerald-700 mt-0.5 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Chosen Route: {step.routeLabel}
                              </p>
                            </div>
                          </div>

                          {/* Step Metrics */}
                          <div className="flex items-center gap-2 text-xs font-extrabold bg-stone-100 p-2 rounded-xl border border-stone-200 shrink-0 self-start">
                            <span className="text-slate-700 flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-slate-500" /> {step.visits} Visit
                            </span>
                            <span className="text-stone-300">•</span>
                            <span className="text-slate-700 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" /> ~{step.days} Days
                            </span>
                            <span className="text-stone-300">•</span>
                            <span className="text-slate-700 flex items-center gap-1">
                              <Banknote className="w-3.5 h-3.5 text-slate-500" /> ₹{step.fee}
                            </span>
                          </div>
                        </div>

                        {/* Required Prerequisites for this step */}
                        <div className="mt-3 pt-3 border-t border-stone-200 space-y-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                            Prerequisite Checklist for this Step:
                          </span>

                          <div className="flex flex-wrap gap-1.5">
                            {step.prerequisites.map((pId) => {
                              const isHeld = step.heldPrereqs.includes(pId);
                              const anchor = ANCHOR_DOCUMENTS.find((a) => a.id === pId);
                              const pName = anchor ? anchor.name : (currentState.nodes[pId]?.name || pId);

                              return (
                                <span
                                  key={pId}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
                                    isHeld
                                      ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                      : "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                                  }`}
                                >
                                  {isHeld ? (
                                    <Check className="w-3 h-3 text-emerald-700" />
                                  ) : (
                                    <AlertTriangle className="w-3 h-3 text-amber-700" />
                                  )}
                                  <span>{pName}</span>
                                  {isHeld && <span className="text-[9px] font-black text-emerald-700">(Possessed)</span>}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Rejection Risk Tip */}
                        {step.tips && (
                          <div className="mt-3 bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-extrabold block text-[10px] uppercase tracking-wider text-amber-800">
                                Counter Prevention Tip
                              </span>
                              <p className="text-xs leading-normal">{step.tips}</p>
                            </div>
                          </div>
                        )}

                        {/* Alternative Routes Accordion */}
                        {altRoutes.length > 1 && (
                          <div className="mt-3">
                            <button
                              onClick={() => setExpandedStepRoute(isExpanded ? null : step.nodeId)}
                              className="text-xs font-extrabold text-slate-600 hover:text-emerald-700 transition flex items-center gap-1 cursor-pointer"
                            >
                              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                              <span>Why this route? View {altRoutes.length - 1} Alternative Route(s)</span>
                            </button>

                            {isExpanded && (
                              <div className="mt-2 space-y-2 pl-4 border-l-2 border-stone-300 animate-fade-in">
                                {altRoutes.map((alt) => {
                                  const isSelected = alt.id === step.routeLabel || alt.label === step.routeLabel;
                                  return (
                                    <div
                                      key={alt.id}
                                      className={`p-2.5 rounded-xl text-xs border ${
                                        isSelected
                                          ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                                          : "bg-white border-stone-200 text-slate-700"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-black text-slate-900">{alt.label}</span>
                                        {isSelected && (
                                          <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-200 px-1.5 py-0.2 rounded">
                                            Picked by Solver
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-slate-500 mt-1">
                                        Office: {alt.office} &middot; {alt.visits} Visit &middot; ~{alt.days} Days &middot; ₹{alt.fee}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUB-TAB 3: DEPENDENCY MAP */}
        {activeSubTab === "graph" && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <GitFork className="w-4 h-4 text-emerald-700" />
                  Interactive AND/OR Certificate Dependency Map
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual breakdown of Target Nodes (Certificates), OR Branches (Alternative Routes), and AND Branches (Prerequisite Documents).
                </p>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-2 text-xs border-b border-stone-200 pb-3">
                <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Possessed / Held Document
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 font-extrabold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-700" /> Target Certificate
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-stone-300 text-slate-800 font-extrabold flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-600" /> Intermediate Office Visit
                </span>
              </div>

              {/* Interactive Tree Rendering */}
              <div className="space-y-4 pt-2">
                {targetIds.map((tId) => {
                  const targetInfo = TARGET_CERTIFICATES.find((t) => t.id === tId) || { name: tId };
                  const chosenRoute = solverResult.chosenRoutes[tId];

                  return (
                    <div key={tId} className="border border-stone-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-amber-100 text-amber-900 rounded-lg border border-amber-300">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-amber-800 block">Target Certificate</span>
                            <h4 className="font-classical text-base font-black text-slate-900">{targetInfo.name}</h4>
                          </div>
                        </div>

                        {chosenRoute && (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Route: {chosenRoute.label}
                          </span>
                        )}
                      </div>

                      {/* Prerequisites Branches */}
                      {chosenRoute && (
                        <div className="pl-4 border-l-2 border-emerald-500 space-y-2">
                          <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
                            AND Branch Prerequisites:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {chosenRoute.prerequisites.map((pId) => {
                              const isHeld = heldDocIds.includes(pId);
                              const anchor = ANCHOR_DOCUMENTS.find((a) => a.id === pId);
                              const pName = anchor ? anchor.name : (currentState.nodes[pId]?.name || pId);

                              return (
                                <div
                                  key={pId}
                                  className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                                    isHeld
                                      ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                                      : "bg-slate-50 border-stone-200 text-slate-800"
                                  }`}
                                >
                                  {isHeld ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                  ) : (
                                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  )}
                                  <span className="truncate">{pName}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 4: OCR INTAKE & MISMATCH INSPECTOR */}
        {activeSubTab === "ocr" && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Presets Bar */}
            <div className="bg-emerald-900/5 border border-emerald-300/60 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  Quick Test: Load Sample Scanned Documents
                </span>
                <span className="text-[10px] text-slate-500 font-semibold hidden sm:inline">
                  Click any preset to simulate OCR text extraction & bounding box alignment
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {SAMPLE_DOCUMENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleLoadPreset(preset)}
                    className="bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-2xs cursor-pointer active:scale-95"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>+ Load {preset.documentTypeId.replace("_", " ").toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* OCR Document Scanner Controls */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    Document Photo Intake & Spelling Inspector
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Photograph physical documents (Aadhaar, PAN, Ration Card). OCR extracts Name, DOB, & Address to catch spelling discrepancies before counter rejection!
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      showBoundingBoxes
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-stone-200 text-slate-700 border border-stone-300"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{showBoundingBoxes ? "Hide Boxes" : "Show OCR Boxes"}</span>
                  </button>

                  <select
                    value={scanDocType}
                    onChange={(e) => setScanDocType(e.target.value)}
                    className="bg-white border border-stone-300 text-slate-800 font-bold rounded-xl px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
                  >
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="ration_card">Ration Card</option>
                    <option value="pan_card">PAN Card</option>
                    <option value="sslc_marksheet">10th / SSLC Marksheet</option>
                  </select>

                  <label className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Camera / Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Scanned Documents Grid */}
              {isScanning && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center text-xs text-emerald-900 font-bold animate-pulse flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                  Running Intelligent OCR Extraction... Identifying Name, DOB, & Document ID
                </div>
              )}

              {scannedDocs.length === 0 ? (
                <div className="bg-white border border-dashed border-stone-300 rounded-xl p-8 text-center text-xs text-slate-500 space-y-2">
                  <Camera className="w-10 h-10 text-slate-300 mx-auto" />
                  <span className="font-black text-slate-800 text-sm block">No Document Photos Scanned Yet</span>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Click <strong>Camera / Upload</strong> above or pick a sample preset to test automatic text extraction & cross-document spelling validation.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {scannedDocs.map((doc) => {
                    const isHeld = heldDocIds.includes(doc.documentTypeId);
                    const isEditing = editingDocId === doc.id;

                    return (
                      <div key={doc.id} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs space-y-3">
                        {/* Header Badge & Actions */}
                        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                              {doc.documentTypeId.replace("_", " ").toUpperCase()}
                            </span>
                            {doc.extractedData?.confidence && (
                              <span className="text-[10px] font-extrabold text-slate-500">
                                {doc.extractedData.confidence}% OCR Confidence
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingDocId(isEditing ? null : doc.id)}
                              className="text-xs font-bold text-slate-600 hover:text-emerald-700 px-2 py-1 rounded bg-stone-100 hover:bg-emerald-50 transition cursor-pointer"
                            >
                              {isEditing ? "Save" : "Edit Fields"}
                            </button>
                            <button
                              onClick={() => removeScannedDoc(doc.id)}
                              className="text-slate-400 hover:text-red-600 transition p-1 cursor-pointer"
                              title="Remove Scanned Card"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Image Preview with OCR Bounding Boxes */}
                        <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 h-44 flex items-center justify-center group">
                          {doc.previewUrl && (
                            <img
                              src={doc.previewUrl}
                              alt="Scanned Document"
                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                            />
                          )}

                          {/* OCR Visual Bounding Boxes Overlay */}
                          {showBoundingBoxes && doc.extractedData?.boundingBoxes?.map((b, idx) => (
                            <div
                              key={idx}
                              style={{
                                top: b.box.top,
                                left: b.box.left,
                                width: b.box.width,
                                height: b.box.height
                              }}
                              className="absolute border-2 border-emerald-400 bg-emerald-500/20 backdrop-blur-[1px] rounded shadow-xs flex items-start p-0.5 pointer-events-none animate-pulse"
                            >
                              <span className="bg-emerald-800 text-white font-mono text-[8px] font-black uppercase px-1 rounded -mt-3.5 shadow-xs">
                                {b.label}: {b.text}
                              </span>
                            </div>
                          ))}

                          <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs font-mono">
                            {doc.fileName} &middot; {doc.scannedAt}
                          </div>
                        </div>

                        {/* Extracted Details & Editor */}
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-2">
                          <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                            <span className="text-[10px] font-black uppercase text-slate-500">
                              Extracted Document Metadata
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              OCR Verified
                            </span>
                          </div>

                          <div className="space-y-2">
                            {/* Full Name Field */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase block">Name</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={doc.extractedData.name}
                                  onChange={(e) => handleUpdateExtractedField(doc.id, "name", e.target.value)}
                                  className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                                />
                              ) : (
                                <span className="font-extrabold text-slate-900 text-sm block">
                                  {doc.extractedData.name}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              {/* DOB Field */}
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase block">DOB</label>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={doc.extractedData.dob}
                                    onChange={(e) => handleUpdateExtractedField(doc.id, "dob", e.target.value)}
                                    className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                                  />
                                ) : (
                                  <span className="font-bold text-slate-800 block">
                                    {doc.extractedData.dob}
                                  </span>
                                )}
                              </div>

                              {/* Document ID Number */}
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase block">Doc Number</label>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={doc.extractedData.documentNumber}
                                    onChange={(e) => handleUpdateExtractedField(doc.id, "documentNumber", e.target.value)}
                                    className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs font-mono font-bold text-slate-900 outline-none focus:border-emerald-600"
                                  />
                                ) : (
                                  <span className="font-mono font-bold text-slate-800 block">
                                    {doc.extractedData.documentNumber}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Address Field */}
                            {doc.extractedData.address && (
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase block">Extracted Address</label>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={doc.extractedData.address}
                                    onChange={(e) => handleUpdateExtractedField(doc.id, "address", e.target.value)}
                                    className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs text-slate-900 outline-none focus:border-emerald-600"
                                  />
                                ) : (
                                  <span className="text-slate-600 block text-[11px] leading-tight">
                                    {doc.extractedData.address}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Auto Sync to Dependency Graph */}
                          <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">
                              Status in Application Plan:
                            </span>

                            <button
                              onClick={() => toggleHeldDoc(doc.documentTypeId)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                isHeld
                                  ? "bg-emerald-600 text-white"
                                  : "bg-stone-200 hover:bg-stone-300 text-slate-800"
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isHeld ? "Marked Held in Graph" : "Confirm & Add to Graph"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mismatch Inspector Report Card */}
            <div className={`border rounded-2xl p-4 sm:p-6 shadow-2xs space-y-3 ${
              mismatchReport.hasMismatches
                ? "bg-amber-50/80 border-amber-300"
                : "bg-emerald-50/80 border-emerald-300"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {mismatchReport.hasMismatches ? (
                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  )}
                  <div>
                    <h4 className="font-classical text-base font-black text-slate-900">
                      Cross-Document Spelling & Mismatch Inspector
                    </h4>
                    <span className="text-xs text-slate-600 font-medium">{mismatchReport.summary}</span>
                  </div>
                </div>
              </div>

              {mismatchReport.issues.map((issue) => (
                <div key={issue.id} className="bg-white border border-amber-200 p-3.5 rounded-xl text-xs space-y-2 text-slate-800 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-900 uppercase text-[10px] tracking-wider flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700" /> {issue.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-100 text-red-800 border border-red-300">
                      Rejection Risk
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900">{issue.description}</p>
                  <p className="text-[11px] text-red-700 font-semibold">{issue.rejectionRisk}</p>

                  <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                    <strong>Recommended Action:</strong> {issue.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
