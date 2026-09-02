import React, { useState, useMemo } from "react";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Plus,
  Phone,
  MapPin,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Tag,
  Download,
  RotateCcw,
  Sparkles,
  Edit3
} from "lucide-react";

export default function AdminModerationQueue({
  submissions,
  onApprove,
  onReject,
  onRestore,
  onAddOfficialFacility,
  selectedLocality,
  selectedDistrict,
  selectedState,
  adminUser,
  showToast
}) {
  const [subTab, setSubTab] = useState("pending"); // 'pending' | 'approved' | 'rejected'
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [wardFilter, setWardFilter] = useState("all");

  // Modal States
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [rejectingSubmission, setRejectingSubmission] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("Incomplete details");
  const [rejectionNote, setRejectionNote] = useState("");
  const [showAddFacilityModal, setShowAddFacilityModal] = useState(false);

  // New Official Facility Form State
  const [newFacility, setNewFacility] = useState({
    title: "",
    category: "health",
    categoryLabel: "Primary Health & Medicine",
    contactName: "",
    phone: "",
    hours: "9:00 AM - 5:00 PM (Mon-Sat)",
    address: "",
    ward: "Ward 4",
    isEmergency: false,
    hasWheelchairAccess: true,
    description: "",
    confidenceScore: 99
  });

  // Edit Submission Form State
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "health",
    categoryLabel: "",
    contactName: "",
    phone: "",
    hours: "",
    address: "",
    ward: "Ward 4",
    isEmergency: false,
    hasWheelchairAccess: true,
    officerVerificationNote: ""
  });

  // Open Edit Modal
  const handleOpenEditModal = (sub) => {
    setEditingSubmission(sub);
    setEditFormData({
      title: sub.title || "",
      category: sub.category || "health",
      categoryLabel: sub.categoryLabel || "Health & Pharmacy",
      contactName: sub.contactName || "",
      phone: sub.phone || "",
      hours: sub.hours || "9:00 AM - 6:00 PM",
      address: sub.address || "",
      ward: sub.ward || "Ward 4",
      isEmergency: !!sub.isEmergency,
      hasWheelchairAccess: !!sub.hasWheelchairAccess,
      officerVerificationNote: `Directly verified on-site by ${adminUser?.name || "Panchayat Secretary"}.`
    });
  };

  // Submit Edited Approval
  const handleSaveEditedApproval = (e) => {
    e.preventDefault();
    if (!editingSubmission) return;

    const modifiedSub = {
      ...editingSubmission,
      ...editFormData,
      verifiedConfidence: 99
    };

    onApprove(modifiedSub);
    setEditingSubmission(null);
  };

  // Confirm Rejection
  const handleConfirmRejection = () => {
    if (!rejectingSubmission) return;
    onReject(rejectingSubmission.id, rejectingSubmission.title, rejectionReason, rejectionNote);
    setRejectingSubmission(null);
    setRejectionNote("");
  };

  // Submit New Official Facility
  const handleCreateOfficialFacility = (e) => {
    e.preventDefault();
    if (!newFacility.title.trim() || !newFacility.phone.trim()) {
      showToast("Please enter a facility title and verified phone number.");
      return;
    }

    const officialEntry = {
      id: `official_fac_${Date.now()}`,
      title: newFacility.title.trim(),
      category: newFacility.category,
      categoryLabel: newFacility.categoryLabel || "Government Service",
      contactName: newFacility.contactName.trim() || "Duty Officer",
      phone: newFacility.phone.trim(),
      hours: newFacility.hours.trim(),
      address: newFacility.address.trim() || `${selectedLocality} Grama Panchayat`,
      ward: newFacility.ward,
      isEmergency: newFacility.isEmergency,
      hasWheelchairAccess: newFacility.hasWheelchairAccess,
      submittedBy: `${adminUser?.name || "Officer"} (Official Panchayat Entry)`,
      submittedAt: new Date().toISOString(),
      status: "approved",
      verifiedConfidence: 99,
      isOfficialGovernment: true
    };

    onAddOfficialFacility(officialEntry);
    setShowAddFacilityModal(false);
    setNewFacility({
      title: "",
      category: "health",
      categoryLabel: "Primary Health & Medicine",
      contactName: "",
      phone: "",
      hours: "9:00 AM - 5:00 PM (Mon-Sat)",
      address: "",
      ward: "Ward 4",
      isEmergency: false,
      hasWheelchairAccess: true,
      description: "",
      confidenceScore: 99
    });
  };

  // Export Moderation Queue CSV
  const handleExportModerationCSV = () => {
    const rows = [
      ["ID", "Title", "Category", "Contact Name", "Phone", "Ward", "Address", "Status", "Submitted By", "Submitted At"]
    ];
    submissions.forEach((s) => {
      rows.push([
        s.id,
        `"${s.title.replace(/"/g, '""')}"`,
        s.categoryLabel || s.category,
        `"${(s.contactName || "").replace(/"/g, '""')}"`,
        s.phone || "",
        s.ward || "",
        `"${(s.address || "").replace(/"/g, '""')}"`,
        s.status || "pending_review",
        `"${(s.submittedBy || "").replace(/"/g, '""')}"`,
        s.submittedAt || ""
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link罕 = document.createElement("a");
    link罕.setAttribute("href", encodedUri);
    link罕.setAttribute("download", `GramSeva_${selectedLocality}_Directory_Moderation_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link罕);
    link罕.click();
    document.body.removeChild(link罕);
    showToast("Directory moderation records exported to CSV.");
  };

  // Filtered Submissions
  const filteredSubmissions紧 = useMemo(() => {
    return submissions.filter((sub) => {
      // Tab filter
      if (subTab === "pending" && sub.status && sub.status !== "pending_review") return false;
      if (subTab === "approved" && sub.status !== "approved") return false;
      if (subTab === "rejected" && sub.status !== "rejected") return false;

      // Category filter
      if (categoryFilter !== "all" && sub.category !== categoryFilter) return false;

      // Ward filter
      if (wardFilter !== "all" && sub.ward !== wardFilter) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = sub.title.toLowerCase().includes(q);
        const matchContact = (sub.contactName || "").toLowerCase().includes(q);
        const matchPhone = (sub.phone || "").toLowerCase().includes(q);
        const matchAddress的的 = (sub.address || "").toLowerCase().includes(q);
        const matchBy = (sub.submittedBy || "").toLowerCase().includes(q);
        if (!matchTitle && !matchContact && !matchPhone && !matchAddress的的 && !matchBy) return false;
      }

      return true;
    });
  }, [submissions, subTab, categoryFilter, wardFilter, searchQuery]);

  const pendingCount = submissions.filter((s) => !s.status || s.status === "pending_review").length;
  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const rejectedCount = submissions.filter((s) => s.status === "rejected").length;

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c26111]" />
            <h3 className="font-serif text-lg font-bold text-stone-900">Community Directory Moderation Queue</h3>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Review and inspect public utility, healthcare, emergency, and agricultural entries submitted by local residents and Grama Volunteers before publishing them live to the Citizen Directory.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAddFacilityModal(true)}
            className="px-3.5 py-2 bg-[#c26111] hover:bg-[#a8520c] text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Register Official Facility</span>
          </button>

          <button
            type="button"
            onClick={handleExportModerationCSV}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition cursor-pointer border border-stone-300 flex items-center gap-1.5"
            title="Download CSV report of moderation queue"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Moderation Stage Tabs & Filtering Bar */}
      <div className="space-y-3">
        {/* Status Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          {[
            { id: "pending", label: "Pending Review", count: pendingCount, icon: <Clock className="w-3.5 h-3.5" />, color: "text-[#c26111]" },
            { id: "approved", label: "Verified & Live", count: approvedCount, icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "text-emerald-600" },
            { id: "rejected", label: "Rejected / Archived", count: rejectedCount, icon: <XCircle className="w-3.5 h-3.5" />, color: "text-rose-600" }
          ].map((tab) => {
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isActive
                    ? "bg-[#c26111] text-white border-[#c26111] shadow-xs"
                    : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Filters Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by facility name, contact person, phone, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 pl-9 pr-3 py-2 rounded-xl text-xs outline-none focus:bg-white focus:border-[#c26111] focus:ring-1 focus:ring-[#c26111]/20 transition"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 text-stone-700 py-2 px-2.5 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#c26111] cursor-pointer"
            >
              <option value="all">All Service Categories</option>
              <option value="health">Health &amp; Pharmacy</option>
              <option value="agriculture">Agriculture &amp; Water</option>
              <option value="utilities">Public Utilities &amp; Power</option>
              <option value="transport">Transport &amp; Auto Stand</option>
              <option value="education">Education &amp; Library</option>
              <option value="emergency">Emergency &amp; Rescue</option>
              <option value="governance">Grama Panchayat Offices</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 text-stone-700 py-2 px-2.5 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#c26111] cursor-pointer"
            >
              <option value="all">All Wards in {selectedLocality}</option>
              <option value="Ward 4">Ward 4 (Focus Area)</option>
              <option value="Ward 1">Ward 1</option>
              <option value="Ward 2">Ward 2</option>
              <option value="Ward 3">Ward 3</option>
              <option value="Ward 5">Ward 5</option>
              <option value="Ward 6">Ward 6</option>
              <option value="Ward 8">Ward 8</option>
              <option value="Ward 12">Ward 12</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Roster */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSubmissions紧.map((sub) => {
          const isPending = !sub.status || sub.status === "pending_review";
          const isApproved = sub.status === "approved";
          const isRejected = sub.status === "rejected";

          return (
            <div
              key={sub.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs transition hover:shadow-sm ${
                isPending ? "border-amber-200/90" : isApproved ? "border-emerald-200/90" : "border-rose-200/90 opacity-80"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Main Information */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                      {sub.categoryLabel || sub.category}
                    </span>

                    <span className="text-[10px] font-bold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md font-mono">
                      {sub.ward || "Ward 4"} &bull; {selectedLocality}
                    </span>

                    {sub.isEmergency && (
                      <span className="text-[9px] font-black text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Emergency 24/7
                      </span>
                    )}

                    {sub.hasWheelchairAccess && (
                      <span className="text-[9px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                        PwD Wheelchair Accessible
                      </span>
                    )}

                    {isApproved && (
                      <span className="text-[9px] font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Live in Directory
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-snug">
                    {sub.title}
                  </h4>

                  <p className="text-xs text-stone-600 flex items-start gap-1.5 max-w-2xl">
                    <MapPin className="w-3.5 h-3.5 text-[#c26111] shrink-0 mt-0.5" />
                    <span>{sub.address || `${selectedLocality} Grama Panchayat Road`}</span>
                  </p>

                  {/* Submission Audit Metadata */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-500 pt-1">
                    <span>Submitted by: <strong className="text-stone-700">{sub.submittedBy || "Citizen Volunteer"}</strong></span>
                    <span>Submitted at: <span className="font-mono text-stone-600">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : "Recent"}</span></span>
                    {sub.verifiedConfidence && (
                      <span className="text-emerald-700 font-bold">Officer Confidence: {sub.verifiedConfidence}%</span>
                    )}
                  </div>

                  {sub.rejectionReason && (
                    <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-xs text-rose-900 mt-2 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Rejection Reason: {sub.rejectionReason}</span>
                        {sub.rejectionNote && <p className="text-rose-700 text-[11px]">{sub.rejectionNote}</p>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact & Operating Details Block */}
                <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl min-w-[240px] space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">Contact Person:</span>
                    <strong className="text-stone-800">{sub.contactName || "Officer in Charge"}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">Phone Number:</span>
                    <a
                      href={`tel:${sub.phone}`}
                      className="font-mono font-bold text-[#c26111] hover:underline inline-flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{sub.phone}</span>
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-stone-400 font-bold">Operating Hours:</span>
                    <span className="text-stone-700 font-medium">{sub.hours || "9 AM - 6 PM"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-3 mt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${sub.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition cursor-pointer border border-stone-200"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#c26111]" />
                    <span>Call to Verify</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(sub)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition cursor-pointer border border-stone-200"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                    <span>Edit / Corrections</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {isPending && (
                    <>
                      <button
                        type="button"
                        onClick={() => onApprove(sub)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Quick Approve &amp; Publish</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRejectingSubmission(sub)}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {isApproved && (
                    <button
                      type="button"
                      onClick={() => setRejectingSubmission(sub)}
                      className="px-3.5 py-1.5 bg-stone-100 hover:bg-rose-50 text-rose-700 border border-stone-200 hover:border-rose-200 font-bold text-xs rounded-lg transition cursor-pointer"
                    >
                      Revoke Verification
                    </button>
                  )}

                  {isRejected && (
                    <button
                      type="button"
                      onClick={() => onRestore(sub.id)}
                      className="px-3.5 py-1.5 bg-stone-100 hover:bg-amber-50 text-[#c26111] border border-stone-200 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore to Pending Queue</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredSubmissions紧.length === 0 && (
          <div className="bg-white border border-stone-200 p-10 rounded-2xl text-center text-stone-500 shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-80" />
            <h4 className="font-bold text-stone-800 text-sm">No submissions in this queue</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              All community facility records for the selected filters have been moderated and updated.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: EDIT & APPROVE FACILITY DETAILS                  */}
      {/* ========================================================= */}
      {editingSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in my-8">
            <div className="bg-[#0e1626] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest block font-bold">Official Verification Desk</span>
                <h3 className="font-serif text-lg font-bold">Edit &amp; Approve Facility</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSubmission(null)}
                className="p-1.5 text-stone-300 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedApproval} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-stone-700 font-bold block mb-1">Facility Name / Title</label>
                  <input
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  />
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">Service Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      const labelMap = {
                        health: "Primary Health & Medicine",
                        agriculture: "Agriculture & Water",
                        utilities: "Public Utilities & Power",
                        transport: "Transport & Commute",
                        education: "Education & Library",
                        emergency: "Emergency & Rescue"
                      };
                      setEditFormData({
                        ...editFormData,
                        category: selectedVal,
                        categoryLabel: labelMap[selectedVal] || "Essential Service"
                      });
                    }}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  >
                    <option value="health">Health &amp; Pharmacy</option>
                    <option value="agriculture">Agriculture &amp; Water</option>
                    <option value="utilities">Public Utilities &amp; Power</option>
                    <option value="transport">Transport &amp; Auto Stand</option>
                    <option value="education">Education &amp; Library</option>
                    <option value="emergency">Emergency &amp; Rescue</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">Assigned Ward</label>
                  <select
                    value={editFormData.ward}
                    onChange={(e) => setEditFormData({ ...editFormData, ward: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  >
                    <option value="Ward 4">Ward 4</option>
                    <option value="Ward 1">Ward 1</option>
                    <option value="Ward 2">Ward 2</option>
                    <option value="Ward 3">Ward 3</option>
                    <option value="Ward 5">Ward 5</option>
                    <option value="Ward 6">Ward 6</option>
                    <option value="Ward 8">Ward 8</option>
                    <option value="Ward 12">Ward 12</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    value={editFormData.contactName}
                    onChange={(e) => setEditFormData({ ...editFormData, contactName: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  />
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">Direct Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111] font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-stone-700 font-bold block mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={editFormData.hours}
                    onChange={(e) => setEditFormData({ ...editFormData, hours: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-stone-700 font-bold block mb-1">Address &amp; Landmark</label>
                  <input
                    type="text"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-stone-700 font-bold block mb-1">Official Officer Verification Note</label>
                  <textarea
                    rows={2}
                    value={editFormData.officerVerificationNote}
                    onChange={(e) => setEditFormData({ ...editFormData, officerVerificationNote: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111] resize-none"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.isEmergency}
                      onChange={(e) => setEditFormData({ ...editFormData, isEmergency: e.target.checked })}
                      className="rounded accent-[#c26111] w-4 h-4"
                    />
                    <span className="font-bold text-stone-800">24/7 Emergency Service Facility</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.hasWheelchairAccess}
                      onChange={(e) => setEditFormData({ ...editFormData, hasWheelchairAccess: e.target.checked })}
                      className="rounded accent-[#c26111] w-4 h-4"
                    />
                    <span className="font-bold text-stone-800">Wheelchair / PwD Accessible</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingSubmission(null)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve &amp; Publish to Directory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: REJECT WITH STRUCTURED REASON                    */}
      {/* ========================================================= */}
      {rejectingSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-stone-900">Reject Directory Submission</h3>
                <p className="text-xs text-stone-500">{rejectingSubmission.title}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-bold block mb-1">Standard Rejection Category</label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3 py-2.5 rounded-xl outline-none focus:border-[#c26111]"
                >
                  <option value="Duplicate facility listing already exists">Duplicate facility listing already exists</option>
                  <option value="Invalid or unreachable phone number">Invalid or unreachable phone number</option>
                  <option value="Facility located outside Grama Panchayat jurisdiction">Facility located outside Grama Panchayat jurisdiction</option>
                  <option value="Incomplete details or unverifiable location">Incomplete details or unverifiable location</option>
                  <option value="Commercial advertisement without trade permit">Commercial advertisement without trade permit</option>
                </select>
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">Internal Feedback Note</label>
                <textarea
                  rows={2}
                  placeholder="Optional internal remarks for audit trail..."
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2 rounded-xl outline-none focus:border-[#c26111] resize-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingSubmission(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ADD NEW OFFICIAL PANCHAYAT FACILITY             */}
      {/* ========================================================= */}
      {showAddFacilityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in my-8">
            <div className="bg-[#0e1626] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest block font-bold">Panchayat Administration</span>
                <h3 className="font-serif text-lg font-bold">Register Official Government Facility</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddFacilityModal(false)}
                className="p-1.5 text-stone-300 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOfficialFacility} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-stone-700 font-bold block mb-1">Official Facility Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Family Health Centre (FHC) Azhiyur"
                    value={newFacility.title}
                    onChange={(e) => setNewFacility({ ...newFacility, title: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  />
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">Service Category</label>
                  <select
                    value={newFacility.category}
                    onChange={(e) => {
                      const sel = e.target.value;
                      const catLabels = {
                        health: "Primary Health & Medicine",
                        agriculture: "Agriculture & Water",
                        utilities: "Public Utilities & Power",
                        transport: "Transport & Commute",
                        education: "Education & Library",
                        emergency: "Emergency & Rescue",
                        governance: "Grama Panchayat Office"
                      };
                      setNewFacility({
                        ...newFacility,
                        category: sel,
                        categoryLabel: catLabels[sel] || "Essential Service"
                      });
                    }}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  >
                    <option value="health">Health &amp; Pharmacy</option>
                    <option value="agriculture">Agriculture &amp; Krishi Bhavan</option>
                    <option value="utilities">KSEB / KWA Water Utilities</option>
                    <option value="transport">Public Transport / Auto Stand</option>
                    <option value="education">School / Anganwadi / Library</option>
                    <option value="emergency">Emergency / Fire / Police</option>
                    <option value="governance">Grama Panchayat Official Office</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">Panchayat Ward</label>
                  <select
                    value={newFacility.ward}
                    onChange={(e) => setNewFacility({ ...newFacility, ward: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  >
                    <option value="Ward 4">Ward 4 (Azhiyur Center)</option>
                    <option value="Ward 1">Ward 1</option>
                    <option value="Ward 2">Ward 2</option>
                    <option value="Ward 3">Ward 3</option>
                    <option value="Ward 5">Ward 5</option>
                    <option value="Ward 6">Ward 6</option>
                    <option value="Ward 8">Ward 8</option>
                    <option value="Ward 12">Ward 12</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">Designated Officer / Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Maya R (Medical Officer)"
                    value={newFacility.contactName}
                    onChange={(e) => setNewFacility({ ...newFacility, contactName: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  />
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">Official Helpline / Landline Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 496 2501234"
                    value={newFacility.phone}
                    onChange={(e) => setNewFacility({ ...newFacility, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111] font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-stone-700 font-bold block mb-1">Office Hours</label>
                  <input
                    type="text"
                    placeholder="e.g. 9:00 AM - 5:00 PM (Monday to Saturday)"
                    value={newFacility.hours}
                    onChange={(e) => setNewFacility({ ...newFacility, hours: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-stone-700 font-bold block mb-1">Complete Location / Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Azhiyur Railway Station Road, Ward 4"
                    value={newFacility.address}
                    onChange={(e) => setNewFacility({ ...newFacility, address: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newFacility.isEmergency}
                      onChange={(e) => setNewFacility({ ...newFacility, isEmergency: e.target.checked })}
                      className="rounded accent-[#c26111] w-4 h-4"
                    />
                    <span className="font-bold text-stone-800">Mark as 24/7 Emergency Facility</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newFacility.hasWheelchairAccess}
                      onChange={(e) => setNewFacility({ ...newFacility, hasWheelchairAccess: e.target.checked })}
                      className="rounded accent-[#c26111] w-4 h-4"
                    />
                    <span className="font-bold text-stone-800">Barrier-Free Ramp (PwD Access)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddFacilityModal(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#c26111] hover:bg-[#a8520c] text-white font-extrabold rounded-xl cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Directly to Citizen Directory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
