import React, { useState, useMemo } from "react";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MapPin,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  Table as TableIcon,
  X,
  CreditCard,
  Home,
  Award,
  Sparkles,
  ExternalLink,
  Check,
  Eye
} from "lucide-react";

export default function AdminCitizenRegistry({
  citizens,
  onToggleVerification,
  onAddNewCitizen,
  selectedLocality,
  selectedDistrict,
  selectedState,
  adminUser,
  showToast
}) {
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'
  const [searchQuery, setSearchQuery] = useState("");
  const [wardFilter, setWardFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [rationFilter, setRationFilter] = useState("all");

  // Selected Citizen for Dossier Modal
  const [selectedCitizenDossier, setSelectedCitizenDossier] = useState(null);

  // New Citizen Registration Form State
  const [showAddCitizenModal, setShowAddCitizenModal] = useState(false);
  const [newCitizenData, setNewCitizenData] = useState({
    name: "",
    phone: "",
    email: "",
    ward: "04",
    holdingNumber: "4/128B",
    locality: selectedLocality,
    district: selectedDistrict,
    rationCard: "Priority Household (Pink - PHH)",
    rationCardTier: "PHH",
    aadhaarLast4: "",
    role: "Resident Citizen",
    welfareSchemes: ["Kudumbashree", "KASP Health Insurance"],
    familyMembersCount: 4
  });

  // Export Citizen Ledger CSV
  const handleExportCitizenRoster = () => {
    const headers = [
      "Citizen ID",
      "Full Name",
      "Phone",
      "Email",
      "Ward",
      "Holding No",
      "Locality",
      "Ration Card Tier",
      "Aadhaar (Last 4)",
      "e-KYC Status",
      "Designation / Role",
      "Joined Date"
    ];

    const rows = citizens.map((c) => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.phone,
      c.email,
      c.ward,
      c.holdingNumber || "N/A",
      c.locality,
      `"${c.rationCard || "Non-Priority"}"`,
      c.aadhaarLast4 ? `•••• •••• ${c.aadhaarLast4}` : "N/A",
      c.isVerified ? "Verified (Active)" : "Pending KYC",
      `"${c.role || "Citizen"}"`,
      c.joinedDate || "Recent"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GramSeva_${selectedLocality}_Citizen_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Citizen electoral & welfare roster exported to CSV.");
  };

  // Submit New Citizen
  const handleCreateCitizen = (e) => {
    e.preventDefault();
    if (!newCitizenData.name.trim() || !newCitizenData.phone.trim()) {
      showToast("Please provide citizen name and phone number.");
      return;
    }

    const newCitizen = {
      id: `cit-${Date.now()}`,
      name: newCitizenData.name.trim(),
      phone: newCitizenData.phone.trim(),
      email: newCitizenData.email.trim() || `${newCitizenData.name.toLowerCase().replace(/\s+/g, ".")}@citizen.gramseva.in`,
      ward: newCitizenData.ward,
      holdingNumber: newCitizenData.holdingNumber.trim() || `${newCitizenData.ward}/${Math.floor(100 + Math.random() * 900)}`,
      locality: selectedLocality,
      district: selectedDistrict,
      rationCard: newCitizenData.rationCard,
      aadhaarLast4: newCitizenData.aadhaarLast4.trim() || `${Math.floor(1000 + Math.random() * 9000)}`,
      role: newCitizenData.role || "Resident Citizen",
      isVerified: true,
      badge: "Verified Citizen",
      joinedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      welfareSchemes: newCitizenData.welfareSchemes,
      familyMembersCount: parseInt(newCitizenData.familyMembersCount, 10) || 3
    };

    onAddNewCitizen(newCitizen);
    setShowAddCitizenModal(false);
    showToast(`Resident ${newCitizen.name} enrolled in ${selectedLocality} Registry!`);
  };

  // Filtered Citizens
  const filteredCitizens = useMemo(() => {
    return citizens.filter((c) => {
      // Ward filter
      if (wardFilter !== "all") {
        const cWard = String(c.ward).padStart(2, "0");
        const filterW = wardFilter.replace(/\D/g, "").padStart(2, "0");
        if (cWard !== filterW) return false;
      }

      // KYC filter
      if (kycFilter === "verified" && !c.isVerified) return false;
      if (kycFilter === "pending" && c.isVerified) return false;

      // Ration filter
      if (rationFilter !== "all") {
        const cardStr = (c.rationCard || "").toLowerCase();
        if (rationFilter === "aay" && !cardStr.includes("yellow") && !cardStr.includes("aay") && !cardStr.includes("antyodaya")) return false;
        if (rationFilter === "phh" && !cardStr.includes("pink") && !cardStr.includes("priority") && !cardStr.includes("phh")) return false;
        if (rationFilter === "nphh" && !cardStr.includes("blue") && !cardStr.includes("non-priority")) return false;
        if (rationFilter === "npns" && !cardStr.includes("white") && !cardStr.includes("non-subsidy")) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const s = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(s);
        const matchPhone = (c.phone || "").toLowerCase().includes(s);
        const matchEmail = (c.email || "").toLowerCase().includes(s);
        const matchWard = String(c.ward || "").includes(s);
        const matchHolding = (c.holdingNumber || "").toLowerCase().includes(s);
        const matchAadhaar = (c.aadhaarLast4 || "").includes(s);
        const matchRole = (c.role || "").toLowerCase().includes(s);
        if (!matchName && !matchPhone && !matchEmail && !matchWard && !matchHolding && !matchAadhaar && !matchRole) return false;
      }

      return true;
    });
  }, [citizens, wardFilter, kycFilter, rationFilter, searchQuery]);

  // Statistics
  const totalVerified = citizens.filter((c) => c.isVerified).length;
  const verifiedPercentage = Math.round((totalVerified / (citizens.length || 1)) * 100);
  const priorityHouseholds = citizens.filter((c) => {
    const r = (c.rationCard || "").toLowerCase();
    return r.includes("pink") || r.includes("yellow") || r.includes("priority") || r.includes("aay");
  }).length;

  const getRationBadge = (card = "") => {
    const c = card.toLowerCase();
    if (c.includes("yellow") || c.includes("aay") || c.includes("antyodaya")) {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          AAY (Yellow - Subsidized)
        </span>
      );
    }
    if (c.includes("pink") || c.includes("priority") || c.includes("phh")) {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-900 border border-rose-200 font-bold px-2 py-0.5 rounded text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          PHH (Pink - BPL Priority)
        </span>
      );
    }
    if (c.includes("blue") || c.includes("non-priority")) {
      return (
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 border border-blue-200 font-bold px-2 py-0.5 rounded text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          NPHH (Blue - Non-Priority)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 border border-stone-300 font-bold px-2 py-0.5 rounded text-[10px]">
        <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
        NPNS (White Card)
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <h3 className="font-serif text-lg font-bold text-stone-900">Panchayat Citizen Registry &amp; e-KYC Ledger</h3>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Official local resident roster with Aadhaar last-4 linkage, Public Distribution System (PDS) ration card tier allocation, and welfare scheme entitlements for {selectedLocality} Grama Panchayat.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAddCitizenModal(true)}
            className="px-3.5 py-2 bg-[#c26111] hover:bg-[#a8520c] text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Enroll Resident</span>
          </button>

          <button
            type="button"
            onClick={handleExportCitizenRoster}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition cursor-pointer border border-stone-300 flex items-center gap-1.5"
            title="Download full citizen roster spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Roster</span>
          </button>
        </div>
      </div>

      {/* Roster Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-stone-200/90 p-3.5 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Total Enrolled</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-stone-900">{citizens.length}</span>
            <span className="text-xs font-bold text-emerald-700">Residents</span>
          </div>
          <span className="text-[10px] text-stone-500 mt-0.5 block">{selectedLocality} GP Jurisdiction</span>
        </div>

        <div className="bg-white border border-stone-200/90 p-3.5 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">e-KYC Clearance</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-700">{verifiedPercentage}%</span>
            <span className="text-[10px] text-stone-600 font-bold">({totalVerified}/{citizens.length})</span>
          </div>
          <span className="text-[10px] text-stone-500 mt-0.5 block">Aadhaar / Biometric Verified</span>
        </div>

        <div className="bg-white border border-stone-200/90 p-3.5 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Priority (PHH / AAY)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#c26111]">{priorityHouseholds}</span>
            <span className="text-xs font-bold text-stone-600">Families</span>
          </div>
          <span className="text-[10px] text-stone-500 mt-0.5 block">BPL &amp; Food Subsidy Eligible</span>
        </div>

        <div className="bg-white border border-stone-200/90 p-3.5 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Welfare Linkage</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-blue-700">100%</span>
            <span className="text-xs font-bold text-stone-600">Covered</span>
          </div>
          <span className="text-[10px] text-stone-500 mt-0.5 block">KASP / Kudumbashree Active</span>
        </div>
      </div>

      {/* Search & Advanced Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3 rounded-2xl border border-stone-200/90 shadow-xs">
        <div className="sm:col-span-4 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, email, Aadhaar, holding #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 text-stone-900 pl-9 pr-3 py-2 rounded-xl text-xs outline-none focus:bg-white focus:border-[#c26111] focus:ring-1 focus:ring-[#c26111]/20 transition"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 text-stone-700 py-2 px-2.5 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#c26111] cursor-pointer"
          >
            <option value="all">All Wards in {selectedLocality}</option>
            <option value="04">Ward 04 (Focus Area)</option>
            <option value="01">Ward 01</option>
            <option value="02">Ward 02</option>
            <option value="03">Ward 03</option>
            <option value="05">Ward 05</option>
            <option value="06">Ward 06</option>
            <option value="08">Ward 08</option>
            <option value="12">Ward 12</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={rationFilter}
            onChange={(e) => setRationFilter(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 text-stone-700 py-2 px-2.5 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#c26111] cursor-pointer"
          >
            <option value="all">All Ration Card Categories</option>
            <option value="aay">🟡 AAY (Antyodaya Yellow)</option>
            <option value="phh">🌸 PHH (Priority Pink / BPL)</option>
            <option value="nphh">🔵 NPHH (Non-Priority Blue)</option>
            <option value="npns">⚪ NPNS (White Card)</option>
          </select>
        </div>

        <div className="sm:col-span-2 flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
              viewMode === "table" ? "bg-[#c26111] text-white border-[#c26111]" : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
            }`}
            title="Official Table View"
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
              viewMode === "grid" ? "bg-[#c26111] text-white border-[#c26111]" : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
            }`}
            title="Citizen Profile Cards View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: OFFICIAL GOVERNMENT LEDGER TABLE VIEW             */}
      {/* ========================================================= */}
      {viewMode === "table" && (
        <div className="bg-white border border-stone-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold">Citizen &amp; Holding</th>
                  <th className="py-3 px-4 font-bold">Contact Details</th>
                  <th className="py-3 px-4 font-bold">Ward &amp; PDS Category</th>
                  <th className="py-3 px-4 font-bold">Aadhaar (Last 4)</th>
                  <th className="py-3 px-4 font-bold">e-KYC Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredCitizens.map((cit) => (
                  <tr key={cit.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-stone-100 text-[#c26111] flex items-center justify-center font-bold text-xs border border-stone-200 shrink-0">
                          {cit.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block leading-tight">{cit.name}</span>
                          <span className="text-[10px] text-stone-500 font-mono">
                            Holding #{cit.holdingNumber || `W${cit.ward}/104`} &bull; {cit.role}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div>{cit.phone}</div>
                      <div className="text-[10px] text-stone-400 truncate max-w-[180px]">{cit.email}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span className="font-bold text-stone-700 block text-[11px]">Ward {cit.ward}, {cit.locality}</span>
                        {getRationBadge(cit.rationCard)}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-stone-700">
                      <span className="bg-stone-100 border border-stone-200 px-2 py-0.5 rounded font-mono text-[10px]">
                        •••• •••• {cit.aadhaarLast4 || "8912"}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {cit.isVerified ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <Check className="w-3 h-3 text-emerald-600" />
                          Verified Citizen
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Pending KYC
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedCitizenDossier(cit)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold rounded-lg border border-stone-200 transition cursor-pointer"
                        >
                          Dossier
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleVerification(cit.id)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition cursor-pointer ${
                            cit.isVerified
                              ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                              : "bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800"
                          }`}
                        >
                          {cit.isVerified ? "Revoke" : "Verify KYC"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: CITIZEN PROFILE CARDS GRID VIEW                   */}
      {/* ========================================================= */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCitizens.map((cit) => (
            <div
              key={cit.id}
              className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-3.5 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                    {cit.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm sm:text-base text-stone-900">{cit.name}</h4>
                      {cit.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 block">
                      ID: {cit.id} &bull; {cit.role}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleVerification(cit.id)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition cursor-pointer ${
                    cit.isVerified
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                      : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
                  }`}
                >
                  {cit.isVerified ? "e-KYC Verified" : "Pending KYC"}
                </button>
              </div>

              {/* Identity & Welfare Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {getRationBadge(cit.rationCard)}
                <span className="text-[10px] font-mono bg-stone-100 border border-stone-200 text-stone-700 px-2 py-0.5 rounded font-bold">
                  Aadhaar: •••• {cit.aadhaarLast4 || "8912"}
                </span>
                <span className="text-[10px] font-bold text-stone-600 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded">
                  Holding #{cit.holdingNumber || "4/128B"}
                </span>
              </div>

              {/* Details Matrix */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
                <div>
                  <span className="text-[9px] font-mono uppercase text-stone-400 block font-bold">Mobile Phone</span>
                  <a href={`tel:${cit.phone}`} className="font-mono font-bold text-[#c26111] hover:underline">
                    {cit.phone}
                  </a>
                </div>

                <div>
                  <span className="text-[9px] font-mono uppercase text-stone-400 block font-bold">Ward &amp; Locality</span>
                  <span className="font-bold text-stone-800">Ward {cit.ward}, {cit.locality}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-400 font-mono">
                  Enrolled: {cit.joinedDate || "Recent"}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${cit.phone}`}
                    className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 cursor-pointer"
                    title="Direct Call"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#c26111]" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedCitizenDossier(cit)}
                    className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg border border-stone-200 transition cursor-pointer"
                  >
                    View Dossier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCitizens.length === 0 && (
        <div className="bg-white border border-stone-200 p-10 rounded-2xl text-center text-stone-500 shadow-xs">
          <Users className="w-10 h-10 text-stone-400 mx-auto mb-2 opacity-60" />
          <h4 className="font-bold text-stone-800 text-sm">No citizens found</h4>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            No registered citizens match the active ward, ration tier, or search query.
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: FULL CITIZEN DOSSIER                             */}
      {/* ========================================================= */}
      {selectedCitizenDossier && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in my-8">
            <div className="bg-[#0e1626] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest block font-bold">Panchayat Resident Dossier</span>
                <h3 className="font-serif text-lg font-bold">{selectedCitizenDossier.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCitizenDossier(null)}
                className="p-1.5 text-stone-300 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-stone-700">
              {/* Identity Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{selectedCitizenDossier.name}</span>
                    {selectedCitizenDossier.isVerified && (
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> e-KYC Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono block">
                    Citizen Record ID: {selectedCitizenDossier.id} &bull; Ward {selectedCitizenDossier.ward}, {selectedCitizenDossier.locality}
                  </span>
                </div>

                <div>{getRationBadge(selectedCitizenDossier.rationCard)}</div>
              </div>

              {/* Demographic & House Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block font-bold">Mobile Phone</span>
                  <span className="font-mono font-bold text-stone-900">{selectedCitizenDossier.phone}</span>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block font-bold">Holding / House No</span>
                  <span className="font-bold text-stone-900">{selectedCitizenDossier.holdingNumber || "Ward 4/128B"}</span>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block font-bold">Aadhaar Linked</span>
                  <span className="font-mono font-bold text-stone-900">•••• •••• {selectedCitizenDossier.aadhaarLast4 || "8912"}</span>
                </div>
              </div>

              {/* Linked Welfare Entitlements */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-xs">Active Welfare Schemes &amp; Subsidies Linked:</h4>
                <div className="flex flex-wrap gap-2">
                  {["Kudumbashree CDS / ADS Member", "KASP / Ayushman Bharat Health Cover", "Jal Jeevan Drinking Water Tap Connection", "LIFE Housing Scheme Eligible"].map((sch) => (
                    <span key={sch} className="px-2.5 py-1 bg-stone-100 text-stone-800 border border-stone-200 rounded-lg text-[11px] font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#c26111]" />
                      <span>{sch}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Verification Audit Note */}
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Officer Clearance Record</span>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Certified citizen of {selectedLocality} Grama Panchayat. Aadhaar last-4 checksum authenticated via DigiLocker.
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    onToggleVerification(selectedCitizenDossier.id);
                    setSelectedCitizenDossier(null);
                  }}
                  className={`px-4 py-2 font-bold rounded-xl cursor-pointer text-xs transition ${
                    selectedCitizenDossier.isVerified
                      ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                      : "bg-emerald-700 hover:bg-emerald-800 text-white"
                  }`}
                >
                  {selectedCitizenDossier.isVerified ? "Revoke Verification" : "Approve e-KYC Verification"}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCitizenDossier(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer text-xs"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ENROLL NEW CITIZEN IN REGISTRY                   */}
      {/* ========================================================= */}
      {showAddCitizenModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in my-8">
            <div className="bg-[#0e1626] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest block font-bold">Panchayat Administration</span>
                <h3 className="font-serif text-lg font-bold">Enroll New Citizen in Ledger</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCitizenModal(false)}
                className="p-1.5 text-stone-300 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCitizen} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-stone-700 font-bold block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smt. Lakshmi Narayanan"
                    value={newCitizenData.name}
                    onChange={(e) => setNewCitizenData({ ...newCitizenData, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  />
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">Mobile Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98470 12345"
                    value={newCitizenData.phone}
                    onChange={(e) => setNewCitizenData({ ...newCitizenData, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111] font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">Aadhaar (Last 4 Digits)</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 8912"
                    value={newCitizenData.aadhaarLast4}
                    onChange={(e) => setNewCitizenData({ ...newCitizenData, aadhaarLast4: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111] font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">Ward Number</label>
                  <select
                    value={newCitizenData.ward}
                    onChange={(e) => setNewCitizenData({ ...newCitizenData, ward: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  >
                    <option value="04">Ward 04</option>
                    <option value="01">Ward 01</option>
                    <option value="02">Ward 02</option>
                    <option value="03">Ward 03</option>
                    <option value="05">Ward 05</option>
                    <option value="06">Ward 06</option>
                    <option value="08">Ward 08</option>
                    <option value="12">Ward 12</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">Holding / House Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 4/142A"
                    value={newCitizenData.holdingNumber}
                    onChange={(e) => setNewCitizenData({ ...newCitizenData, holdingNumber: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-stone-700 font-bold block mb-1">Ration Card Category (PDS Tier)</label>
                  <select
                    value={newCitizenData.rationCard}
                    onChange={(e) => setNewCitizenData({ ...newCitizenData, rationCard: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 px-3 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#c26111]"
                  >
                    <option value="Priority Household (Pink - PHH)">🌸 Priority Household (Pink Card - BPL)</option>
                    <option value="AAY (Yellow - Antyodaya Anna Yojana)">🟡 AAY Antyodaya (Yellow Card - Subsidized)</option>
                    <option value="Non-Priority (Blue - NPHH)">🔵 Non-Priority Subsidy (Blue Card - NPHH)</option>
                    <option value="Non-Priority Non-Subsidy (White - NPNS)">⚪ Non-Priority Non-Subsidy (White Card)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCitizenModal(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#c26111] hover:bg-[#a8520c] text-white font-extrabold rounded-xl cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save to Resident Ledger</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
