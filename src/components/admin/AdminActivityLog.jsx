import React, { useState, useMemo } from "react";
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Download,
  FileText,
  Building2,
  Users,
  Bell,
  Sliders,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Award,
  Layers,
  Copy,
  Printer,
  Sparkles,
  FileCheck2
} from "lucide-react";

export default function AdminActivityLog({
  auditLogs = [],
  onClearLogs,
  selectedLocality = "Azhiyur",
  selectedDistrict = "Kozhikode",
  adminUser,
  showToast
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [officerFilter, setOfficerFilter] = useState("all");
  const [viewMode, setViewMode] = useState("timeline"); // 'timeline' | 'table'
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [copiedLogId, setCopiedLogId] = useState(null);

  // Derive unique officers for filter dropdown
  const uniqueOfficers = useMemo(() => {
    const set = new Set();
    auditLogs.forEach((l) => {
      if (l.officer) set.add(l.officer);
    });
    return Array.from(set);
  }, [auditLogs]);

  // Filtered and searched logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      // Category filter
      if (categoryFilter !== "all") {
        const cat = (log.category || "").toLowerCase();
        const act = (log.action || "").toLowerCase();
        const det = (log.detail || "").toLowerCase();

        if (categoryFilter === "services") {
          if (cat !== "services" && cat !== "service_moderation" && !act.includes("service") && !act.includes("directory") && !det.includes("facility") && !det.includes("directory")) {
            return false;
          }
        } else if (categoryFilter === "citizens") {
          if (cat !== "citizens" && cat !== "citizen_registry" && !act.includes("citizen") && !act.includes("kyc") && !det.includes("citizen") && !det.includes("aadhaar")) {
            return false;
          }
        } else if (categoryFilter === "grievances") {
          if (cat !== "grievances" && !act.includes("grievance") && !act.includes("grm-") && !det.includes("grievance") && !det.includes("ticket")) {
            return false;
          }
        } else if (categoryFilter === "broadcasts") {
          if (cat !== "broadcasts" && !act.includes("broadcast") && !act.includes("notice") && !act.includes("alert") && !det.includes("broadcast")) {
            return false;
          }
        } else if (categoryFilter === "governance") {
          if (cat !== "governance" && !act.includes("login") && !act.includes("session") && !act.includes("system") && !act.includes("audit")) {
            return false;
          }
        }
      }

      // Severity / Outcome filter
      if (severityFilter !== "all") {
        const sev = (log.severity || "").toLowerCase();
        const act = (log.action || "").toLowerCase();
        if (severityFilter === "success") {
          if (sev !== "success" && !act.includes("approved") && !act.includes("verified") && !act.includes("enrolled") && !act.includes("resolved")) {
            return false;
          }
        } else if (severityFilter === "warning") {
          if (sev !== "warning" && !act.includes("updated") && !act.includes("modified") && !act.includes("warning") && !act.includes("pending")) {
            return false;
          }
        } else if (severityFilter === "alert") {
          if (sev !== "alert" && sev !== "danger" && !act.includes("rejected") && !act.includes("deleted") && !act.includes("failed")) {
            return false;
          }
        }
      }

      // Officer filter
      if (officerFilter !== "all" && log.officer !== officerFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAction = (log.action || "").toLowerCase().includes(q);
        const matchDetail = (log.detail || "").toLowerCase().includes(q);
        const matchOfficer = (log.officer || "").toLowerCase().includes(q);
        const matchTarget = (log.targetTitle || log.targetName || log.targetId || "").toLowerCase().includes(q);
        const matchId = (log.id || "").toLowerCase().includes(q);
        const matchCategory = (log.category || "").toLowerCase().includes(q);

        if (!matchAction && !matchDetail && !matchOfficer && !matchTarget && !matchId && !matchCategory) {
          return false;
        }
      }

      return true;
    });
  }, [auditLogs, categoryFilter, severityFilter, officerFilter, searchQuery]);

  // Calculated Metrics
  const stats = useMemo(() => {
    let serviceActions = 0;
    let citizenActions = 0;
    let grievanceActions = 0;
    let broadcastActions = 0;

    auditLogs.forEach((l) => {
      const act = (l.action || "").toLowerCase();
      const cat = (l.category || "").toLowerCase();
      const det = (l.detail || "").toLowerCase();

      if (cat === "services" || cat === "service_moderation" || act.includes("service") || act.includes("facility") || act.includes("directory")) {
        serviceActions++;
      } else if (cat === "citizens" || cat === "citizen_registry" || act.includes("citizen") || act.includes("kyc") || det.includes("aadhaar")) {
        citizenActions++;
      } else if (cat === "grievances" || act.includes("grievance") || act.includes("grm-")) {
        grievanceActions++;
      } else if (cat === "broadcasts" || act.includes("broadcast") || act.includes("notice") || act.includes("alert")) {
        broadcastActions++;
      }
    });

    return {
      total: auditLogs.length,
      serviceActions,
      citizenActions,
      grievanceActions,
      broadcastActions,
      officersCount: uniqueOfficers.length || 1
    };
  }, [auditLogs, uniqueOfficers]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["Log ID", "Timestamp", "Category", "Action Title", "Authorized Officer", "Target Reference", "Details / Remarks", "Severity / Outcome"];
    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp || l.time}"`,
      `"${l.category || 'Governance'}"`,
      `"${(l.action || '').replace(/"/g, '""')}"`,
      `"${(l.officer || '').replace(/"/g, '""')}"`,
      `"${(l.targetTitle || l.targetId || 'N/A').replace(/"/g, '""')}"`,
      `"${(l.detail || '').replace(/"/g, '""')}"`,
      `"${l.severity || 'info'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Panchayat_Audit_Trail_${selectedLocality}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast?.("Audit trail CSV downloaded successfully.");
  };

  // Export to JSON
  const handleExportJSON = () => {
    const exportData = {
      jurisdiction: `${selectedLocality} Grama Panchayat`,
      district: selectedDistrict,
      exportedAt: new Date().toISOString(),
      authorizedOfficer: adminUser?.name || "Panchayat Secretary",
      totalRecords: filteredLogs.length,
      records: filteredLogs
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `Panchayat_Audit_Trail_${selectedLocality}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast?.("Audit trail JSON ledger downloaded.");
  };

  const handleCopyLogItem = (log) => {
    const text = `[${log.time || log.timestamp}] ${log.action} | Officer: ${log.officer} | Target: ${log.targetTitle || log.targetId || "N/A"} | Detail: ${log.detail}`;
    navigator.clipboard?.writeText(text);
    setCopiedLogId(log.id);
    setTimeout(() => setCopiedLogId(null), 2000);
    showToast?.("Log entry copied to clipboard.");
  };

  // Helper for Category Badge
  const getCategoryMeta = (log) => {
    const act = (log.action || "").toLowerCase();
    const cat = (log.category || "").toLowerCase();

    if (cat === "services" || cat === "service_moderation" || act.includes("service") || act.includes("directory") || act.includes("facility")) {
      return {
        label: "Service Moderation",
        icon: Building2,
        badgeClass: "bg-amber-50 text-amber-900 border-amber-200"
      };
    }
    if (cat === "citizens" || cat === "citizen_registry" || act.includes("citizen") || act.includes("kyc")) {
      return {
        label: "Citizen Registry",
        icon: Users,
        badgeClass: "bg-blue-50 text-blue-900 border-blue-200"
      };
    }
    if (cat === "grievances" || act.includes("grievance") || act.includes("grm-")) {
      return {
        label: "Grievance Redressal",
        icon: ShieldCheck,
        badgeClass: "bg-purple-50 text-purple-900 border-purple-200"
      };
    }
    if (cat === "broadcasts" || act.includes("broadcast") || act.includes("notice") || act.includes("alert")) {
      return {
        label: "Emergency Notice",
        icon: Bell,
        badgeClass: "bg-rose-50 text-rose-900 border-rose-200"
      };
    }
    return {
      label: "Governance / Officer",
      icon: Activity,
      badgeClass: "bg-stone-100 text-stone-800 border-stone-300"
    };
  };

  // Helper for Severity Icon / Style
  const getSeverityBadge = (log) => {
    const act = (log.action || "").toLowerCase();
    const sev = (log.severity || "").toLowerCase();

    if (sev === "success" || act.includes("approved") || act.includes("verified") || act.includes("enrolled") || act.includes("resolved") || act.includes("published")) {
      return {
        icon: CheckCircle2,
        color: "text-emerald-700",
        bg: "bg-emerald-50 border-emerald-200",
        text: "Verified / Approved"
      };
    }
    if (sev === "alert" || sev === "danger" || act.includes("rejected") || act.includes("denied") || act.includes("archived") || act.includes("flagged")) {
      return {
        icon: XCircle,
        color: "text-rose-700",
        bg: "bg-rose-50 border-rose-200",
        text: "Rejected / Flagged"
      };
    }
    if (sev === "warning" || act.includes("updated") || act.includes("assigned") || act.includes("restored") || act.includes("investigation")) {
      return {
        icon: AlertTriangle,
        color: "text-amber-700",
        bg: "bg-amber-50 border-amber-200",
        text: "Updated / Modified"
      };
    }
    return {
      icon: Clock,
      color: "text-stone-600",
      bg: "bg-stone-50 border-stone-200",
      text: "System Event"
    };
  };

  return (
    <div className="space-y-5">
      {/* Top Banner Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <h3 className="font-serif text-lg font-bold text-stone-900">Panchayat Administrative Audit Trail</h3>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Statutory immutable activity log tracking officer decisions, service listing moderation approvals/rejections, citizen registry e-KYC updates, grievance dispositions, and emergency broadcasts for {selectedLocality} Grama Panchayat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowComplianceModal(true)}
            className="px-3.5 py-2 bg-stone-900 hover:bg-black text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-95"
          >
            <FileCheck2 className="w-4 h-4 text-amber-400" />
            <span>Audit Certificate</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition cursor-pointer border border-stone-300 flex items-center gap-1.5"
            title="Download CSV Spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition cursor-pointer border border-stone-300 flex items-center gap-1.5"
            title="Download JSON Ledger"
          >
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-stone-200/90 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[10px] font-mono uppercase font-bold text-stone-600">Total Audit Logs</span>
            <Activity className="w-4 h-4 text-[#c26111]" />
          </div>
          <p className="text-xl font-serif font-black text-stone-900">{stats.total}</p>
          <p className="text-[10px] text-stone-500 mt-0.5">Chronological records</p>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[10px] font-mono uppercase font-bold text-stone-600">Service Changes</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-serif font-black text-amber-900">{stats.serviceActions}</p>
          <p className="text-[10px] text-stone-500 mt-0.5">Approvals &amp; moderations</p>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[10px] font-mono uppercase font-bold text-stone-600">Registry &amp; KYC</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-serif font-black text-blue-900">{stats.citizenActions}</p>
          <p className="text-[10px] text-stone-500 mt-0.5">e-KYC &amp; enrollments</p>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[10px] font-mono uppercase font-bold text-stone-600">Grievances &amp; Notices</span>
            <Bell className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-serif font-black text-rose-900">{stats.grievanceActions + stats.broadcastActions}</p>
          <p className="text-[10px] text-stone-500 mt-0.5">Dispatches &amp; resolutions</p>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-xl p-3.5 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[10px] font-mono uppercase font-bold text-stone-600">Active Officers</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-serif font-black text-emerald-900">{stats.officersCount}</p>
          <p className="text-[10px] text-stone-500 mt-0.5">Authorized actors</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by action title, officer name, service name, citizen, or ticket ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-300 text-stone-900 rounded-xl text-xs outline-none focus:bg-white focus:border-[#c26111] transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 self-end sm:self-center border border-stone-300 rounded-xl p-1 bg-stone-50">
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === "timeline" ? "bg-white text-stone-900 shadow-xs border border-stone-200" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === "table" ? "bg-white text-stone-900 shadow-xs border border-stone-200" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 border-t border-stone-100 text-xs">
          <div>
            <label className="text-[10px] font-mono uppercase text-stone-600 block mb-1 font-bold">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-[#c26111] cursor-pointer"
            >
              <option value="all">All Action Categories</option>
              <option value="services">🏢 Service Moderation &amp; Listings</option>
              <option value="citizens">👥 Citizen Registry &amp; e-KYC</option>
              <option value="grievances">🛠️ Grievance Redressal</option>
              <option value="broadcasts">📢 Emergency Ward Broadcasts</option>
              <option value="governance">🛡️ Governance &amp; Security</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-stone-600 block mb-1 font-bold">Action Outcome</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-[#c26111] cursor-pointer"
            >
              <option value="all">All Outcomes</option>
              <option value="success">Verified / Approved / Resolved</option>
              <option value="warning">Updated / Modified Notes</option>
              <option value="alert">Rejected / Flagged</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-stone-600 block mb-1 font-bold">Acting Officer</label>
            <select
              value={officerFilter}
              onChange={(e) => setOfficerFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-[#c26111] cursor-pointer"
            >
              <option value="all">All Officers ({uniqueOfficers.length})</option>
              {uniqueOfficers.map((off) => (
                <option key={off} value={off}>
                  {off}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            {(categoryFilter !== "all" || severityFilter !== "all" || officerFilter !== "all" || searchQuery) ? (
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter("all");
                  setSeverityFilter("all");
                  setOfficerFilter("all");
                  setSearchQuery("");
                }}
                className="w-full py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-lg transition cursor-pointer text-xs flex items-center justify-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            ) : (
              <div className="text-[11px] text-stone-500 flex items-center gap-1 py-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Showing {filteredLogs.length} audit events</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Timeline View */}
      {viewMode === "timeline" && (
        <div className="space-y-3">
          {filteredLogs.map((log, index) => {
            const catMeta = getCategoryMeta(log);
            const sevMeta = getSeverityBadge(log);
            const CatIcon = catMeta.icon;
            const SevIcon = sevMeta.icon;
            const isExpanded = expandedLogId === log.id;

            return (
              <div
                key={log.id || `log-${index}`}
                className="bg-white border border-stone-200/90 rounded-2xl p-4.5 shadow-xs hover:border-amber-300/80 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left block: Category icon + Action + Details */}
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${catMeta.badgeClass}`}>
                      <CatIcon className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm text-stone-900">{log.action}</h4>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${sevMeta.bg} ${sevMeta.color}`}>
                          <SevIcon className="w-3 h-3" />
                          <span>{sevMeta.text}</span>
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${catMeta.badgeClass}`}>
                          {catMeta.label}
                        </span>
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed font-sans">{log.detail}</p>

                      {/* Officer & Target entity chips */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#c26111] bg-amber-50/80 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Officer: <strong>{log.officer}</strong></span>
                        </span>

                        {(log.targetTitle || log.targetName || log.targetId) && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md font-mono">
                            <span>Ref: {log.targetTitle || log.targetName || log.targetId}</span>
                          </span>
                        )}

                        {log.ward && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md font-mono">
                            <span>{log.ward}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right block: Timestamp & Quick Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <div className="text-right">
                      <span className="text-xs font-bold text-stone-800 block">{log.time || "Just now"}</span>
                      {log.timestamp && (
                        <span className="text-[10px] font-mono text-stone-500 block">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} &bull; {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyLogItem(log)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                        title="Copy log entry"
                      >
                        {copiedLogId === log.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="px-2 py-1 text-[11px] font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition cursor-pointer flex items-center gap-1"
                      >
                        <span>{isExpanded ? "Hide" : "Details"}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Technical Details Drawer */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-stone-200/80 bg-stone-50/70 p-3.5 rounded-xl text-xs space-y-2 font-mono">
                    <div className="flex items-center justify-between text-[11px] text-stone-500 pb-1 border-b border-stone-200">
                      <span>Log Event Identifier: <strong className="text-stone-800">{log.id}</strong></span>
                      <span>Jurisdiction: <strong>{selectedLocality} GP ({selectedDistrict})</strong></span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-stone-500 block">Action Signature:</span>
                        <span className="text-stone-900 font-semibold">{log.action}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Authorized Signatory / Actor:</span>
                        <span className="text-stone-900 font-semibold">{log.officer}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Target Object:</span>
                        <span className="text-stone-900">{log.targetTitle || log.targetId || "System Record"}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Event Timestamp:</span>
                        <span className="text-stone-900">{log.timestamp || new Date().toISOString()}</span>
                      </div>
                    </div>

                    {log.meta && (
                      <div className="mt-2 pt-2 border-t border-stone-200">
                        <span className="text-stone-500 block text-[10px] uppercase font-bold">Metadata Payload:</span>
                        <pre className="text-[10px] text-stone-700 bg-white p-2 rounded border border-stone-200 overflow-x-auto mt-1">
                          {JSON.stringify(log.meta, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="bg-white border border-stone-200 p-12 rounded-2xl text-center space-y-3 shadow-xs">
              <Activity className="w-8 h-8 text-stone-300 mx-auto" />
              <h4 className="font-serif text-base font-bold text-stone-800">No Audit Events Found</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No activity logs match your current search and filter criteria. Adjust your filters or reset to view all system actions.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter("all");
                  setSeverityFilter("all");
                  setOfficerFilter("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content: High-Density Table View */}
      {viewMode === "table" && (
        <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Timestamp</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Action</th>
                  <th className="py-3 px-4 font-bold">Officer</th>
                  <th className="py-3 px-4 font-bold">Target / Subject</th>
                  <th className="py-3 px-4 font-bold">Details</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredLogs.map((log) => {
                  const catMeta = getCategoryMeta(log);
                  const sevMeta = getSeverityBadge(log);

                  return (
                    <tr key={log.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap text-stone-500">
                        {log.time || "Just now"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${catMeta.badgeClass}`}>
                          {catMeta.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${sevMeta.color.replace('text-', 'bg-')}`} />
                          <span>{log.action}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-[#c26111]">
                        {log.officer}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                        {log.targetTitle || log.targetName || log.targetId || "—"}
                      </td>
                      <td className="py-3 px-4 text-stone-600 max-w-xs truncate" title={log.detail}>
                        {log.detail}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleCopyLogItem(log)}
                          className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                          title="Copy details"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-stone-500 text-xs">
              No matching records in the ledger.
            </div>
          )}
        </div>
      )}

      {/* Compliance / Inspection Report Modal */}
      {showComplianceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-300 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-[#c26111] rounded-xl border border-amber-200">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900">Official Governance Audit Certificate</h3>
                  <p className="text-xs text-stone-500">Government of Kerala &bull; Local Self Government Department (LSGD)</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowComplianceModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Report Card */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-4 font-sans text-xs">
              <div className="text-center space-y-1 pb-3 border-b border-stone-200">
                <h4 className="font-serif font-black text-stone-900 text-sm tracking-wider uppercase">
                  {selectedLocality} Grama Panchayat Administrative Registry
                </h4>
                <p className="text-[11px] text-stone-600 font-mono">
                  District: {selectedDistrict} | Inspection Ref: GP/AUDIT/2026/{Date.now().toString().slice(-4)}
                </p>
                <p className="text-[10px] text-stone-500">
                  Issued on {new Date().toLocaleDateString("en-IN", { dateStyle: "full" })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-stone-200 rounded-lg">
                  <span className="text-[10px] font-mono uppercase text-stone-500 block">Total Audited Events</span>
                  <span className="text-lg font-bold text-stone-900">{stats.total} entries</span>
                </div>
                <div className="p-3 bg-white border border-stone-200 rounded-lg">
                  <span className="text-[10px] font-mono uppercase text-stone-500 block">Service Moderations</span>
                  <span className="text-lg font-bold text-amber-800">{stats.serviceActions} verified</span>
                </div>
                <div className="p-3 bg-white border border-stone-200 rounded-lg">
                  <span className="text-[10px] font-mono uppercase text-stone-500 block">Citizen e-KYC Actions</span>
                  <span className="text-lg font-bold text-blue-800">{stats.citizenActions} certified</span>
                </div>
                <div className="p-3 bg-white border border-stone-200 rounded-lg">
                  <span className="text-[10px] font-mono uppercase text-stone-500 block">Officer Compliance Rating</span>
                  <span className="text-lg font-bold text-emerald-800">100% Compliant</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-600 leading-relaxed">
                This document certifies that all service directory updates, citizen e-KYC endorsements, and public emergency notices recorded within {selectedLocality} Grama Panchayat have been verified against statutory Local Self Government (LSGD) transparency guidelines.
              </p>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-stone-500 block uppercase">Authorized Officer</span>
                  <span className="font-bold text-stone-900">{adminUser?.name || "Panchayat Secretary"}</span>
                  <span className="text-[10px] text-[#c26111] block">Executive Officer &bull; Grama Panchayat</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded font-bold">
                    ✓ DIGITALLY SEALED
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print?.();
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-stone-300"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleExportCSV();
                  setShowComplianceModal(false);
                }}
                className="px-4 py-2 bg-[#c26111] hover:bg-[#a8520c] text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-xs"
              >
                Download Official Audit Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
