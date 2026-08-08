import React, { useState } from "react";
import {
  Building,
  Calculator,
  CheckCircle2,
  CreditCard,
  Download,
  Droplets,
  FileCheck,
  FileText,
  IndianRupee,
  Layers,
  Printer,
  QrCode,
  Receipt,
  ShieldCheck,
  Sparkles,
  Store,
  User,
  X,
  ArrowRight,
  Check,
  Building2,
  BadgeCheck,
  Clock
} from "lucide-react";

export default function TaxPaymentPortal({ user, selectedState = "kerala", districtsList = [], panchayatsByDistrict = {} }) {
  const [activeTab, setActiveTab] = useState("property"); // property, water, trade, professional
  const [paymentStep, setPaymentStep] = useState("calculator"); // calculator, checkout, receipt

  // Common Info
  const [stateName, setStateName] = useState(selectedState);
  const [district, setDistrict] = useState(districtsList[0]?.en || "Kozhikode");
  const [panchayat, setPanchayat] = useState("Azhiyur Grama Panchayat");
  const [assessmentId, setAssessmentId] = useState("PROP-2026-99214");
  const [citizenName, setCitizenName] = useState(user?.displayName || "Suresh Kumar N");
  const [phone, setPhone] = useState(user?.phoneNumber || "+91 98470 12345");
  const [doorNo, setDoorNo] = useState("V/124-A");

  // Property Tax Calculator Inputs
  const [sqft, setSqft] = useState(1450);
  const [usageType, setUsageType] = useState("residential"); // residential, commercial, industrial
  const [structureType, setStructureType] = useState("pucca"); // pucca, tiled, katcha
  const [panchayatGrade, setPanchayatGrade] = useState("special"); // special, grade1, grade2

  // Water Tariff Inputs
  const [meterId, setMeterId] = useState("WTR-8841-KWA");
  const [units, setUnits] = useState(18); // kiloliters
  const [category, setCategory] = useState("domestic"); // domestic, commercial

  // Trade License Inputs
  const [tradeCategory, setTradeCategory] = useState("retail"); // retail, food, manufacturing, it
  const [numEmployees, setNumEmployees] = useState(4);
  const [firmName, setFirmName] = useState("Malabar Traders & General Store");

  // Professional Tax Inputs
  const [halfYearlyIncome, setHalfYearlyIncome] = useState(120000);

  // Payment Checkout State
  const [paymentMethod, setPaymentMethod] = useState("upi"); // upi, card, netbanking
  const [upiApp, setUpiApp] = useState("gpay"); // gpay, phonepe, paytm
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Math Calculations
  const calculatePropertyTax = () => {
    let baseRate = usageType === "commercial" ? 18 : usageType === "industrial" ? 25 : 8; // Rs per sqft
    let structMult = structureType === "pucca" ? 1.2 : structureType === "tiled" ? 1.0 : 0.7;
    let gradeMult = panchayatGrade === "special" ? 1.15 : 1.0;

    const baseTax = Math.round(sqft * baseRate * structMult * gradeMult);
    const libraryCess = Math.round(baseTax * 0.05); // 5% library cess
    const sanitationCess = usageType === "commercial" ? 350 : 150;
    const rebate = Math.round(baseTax * 0.05); // 5% early rebate
    const netTotal = baseTax + libraryCess + sanitationCess - rebate;

    return { baseTax, libraryCess, sanitationCess, rebate, netTotal };
  };

  const calculateWaterCharges = () => {
    let ratePerKl = category === "commercial" ? 25 : 12;
    const baseWater = units * ratePerKl;
    const meterRent = 40;
    const sanitationFee = 50;
    const netTotal = baseWater + meterRent + sanitationFee;
    return { baseWater, meterRent, sanitationFee, netTotal };
  };

  const calculateTradeLicense = () => {
    let baseFee = tradeCategory === "manufacturing" ? 2500 : tradeCategory === "food" ? 1500 : tradeCategory === "it" ? 3000 : 850;
    const empAddon = numEmployees * 100;
    const inspectionFee = 200;
    const netTotal = baseFee + empAddon + inspectionFee;
    return { baseFee, empAddon, inspectionFee, netTotal };
  };

  const calculateProfTax = () => {
    let taxAmount = 0;
    if (halfYearlyIncome > 125000) taxAmount = 1250;
    else if (halfYearlyIncome > 100000) taxAmount = 1000;
    else if (halfYearlyIncome > 75000) taxAmount = 750;
    else if (halfYearlyIncome > 50000) taxAmount = 450;
    else taxAmount = 0;

    const netTotal = taxAmount;
    return { taxAmount, netTotal };
  };

  const getCurrentSummary = () => {
    if (activeTab === "property") {
      const { baseTax, libraryCess, sanitationCess, rebate, netTotal } = calculatePropertyTax();
      return {
        title: "Grama Panchayat Property & Building Tax",
        code: "PROP-TAX-2026",
        amount: netTotal,
        items: [
          { name: `Annual Base Property Tax (${sqft} sq.ft)`, amount: baseTax },
          { name: "Library & Education Cess (5%)", amount: libraryCess },
          { name: "Solid Waste & Sanitation Maintenance", amount: sanitationCess },
          { name: "Early Digital Payment Rebate (-5%)", amount: -rebate, isDiscount: true }
        ]
      };
    } else if (activeTab === "water") {
      const { baseWater, meterRent, sanitationFee, netTotal } = calculateWaterCharges();
      return {
        title: "Panchayat Drinking Water Supply Tariff",
        code: "WTR-BILL-2026",
        amount: netTotal,
        items: [
          { name: `Water Usage (${units} Kiloliters @ ₹12/kL)`, amount: baseWater },
          { name: "Monthly Meter Maintenance Rent", amount: meterRent },
          { name: "Water Quality Testing & Purification Cess", amount: sanitationFee }
        ]
      };
    } else if (activeTab === "trade") {
      const { baseFee, empAddon, inspectionFee, netTotal } = calculateTradeLicense();
      return {
        title: "D&O Commercial Trade License Renewal",
        code: "TRD-LIC-2026",
        amount: netTotal,
        items: [
          { name: `Annual Trade License Fee (${firmName})`, amount: baseFee },
          { name: `Staff Safety Surcharge (${numEmployees} employees)`, amount: empAddon },
          { name: "Panchayat Health Inspection Fee", amount: inspectionFee }
        ]
      };
    } else {
      const { taxAmount, netTotal } = calculateProfTax();
      return {
        title: "Half-Yearly Professional Tax",
        code: "PROF-TAX-2026",
        amount: netTotal,
        items: [
          { name: `Professional Tax Slab (Income ₹${halfYearlyIncome.toLocaleString()})`, amount: taxAmount }
        ]
      };
    }
  };

  const handleProceedToCheckout = () => {
    setPaymentStep("checkout");
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    const summary = getCurrentSummary();

    setTimeout(() => {
      const randomTxnId = "TXN" + Math.floor(10000000 + Math.random() * 90000000);
      const randomRecNo = "REC/" + stateName.substring(0, 3).toUpperCase() + "/2026/" + Math.floor(1000 + Math.random() * 9000);

      const generated = {
        receiptNo: randomRecNo,
        txnId: randomTxnId,
        date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        state: stateName,
        district,
        panchayat,
        doorNo,
        assessmentId,
        citizenName,
        phone,
        title: summary.title,
        items: summary.items,
        totalAmount: summary.amount,
        paymentMethod: paymentMethod === "upi" ? `UPI (${upiApp.toUpperCase()})` : paymentMethod === "card" ? "Debit/Credit Card" : "NetBanking",
        qrData: `GRAMSEVA-VERIFIED|${randomRecNo}|${summary.amount}|${randomTxnId}`
      };

      setReceiptData(generated);
      setIsProcessing(false);
      setPaymentStep("receipt");
    }, 1500);
  };

  const summary = getCurrentSummary();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0e1626] via-[#162238] to-[#1c2b47] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#e07a1e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#c26111]/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <IndianRupee className="w-4 h-4" />
              <span>Unified Grama Panchayat Tax Gateway</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Panchayat Tax &amp; Fee Payment Portal
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Estimate and pay Property Tax, Water Supply Tariffs, Trade Licenses, and Professional Taxes with instant verified digital receipts &amp; 5% digital rebate.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shrink-0 text-center space-y-1 min-w-44">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Early Online Rebate</p>
            <p className="text-2xl font-black text-[#e07a1e]">5% OFF</p>
            <p className="text-[11px] text-stone-300">On all digital tax payments</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-stone-200 rounded-3xl shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="border-b border-stone-200 bg-stone-50 flex items-center overflow-x-auto p-2 gap-2">
          {[
            { id: "property", label: "Property Tax", icon: Building },
            { id: "water", label: "Water Charges", icon: Droplets },
            { id: "trade", label: "Trade License", icon: Store },
            { id: "professional", label: "Professional Tax", icon: Calculator }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setPaymentStep("calculator"); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-200/60 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* STEP 1: Tax Calculator & Estimator */}
        {paymentStep === "calculator" && (
          <div className="p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column: Estimator Controls */}
              <div className="md:col-span-7 space-y-6">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#c26111]" />
                    <span>Calculate Tax &amp; Fee Details</span>
                  </h2>
                  <p className="text-xs text-stone-500">
                    Adjust assessment parameters below to compute state panchayat tariff rates.
                  </p>
                </div>

                {/* Common Citizen & Panchayat Details */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800 border-b border-stone-200 pb-2">
                    <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-[#c26111]" /> Assessment Location</span>
                    <span className="capitalize text-[#c26111] font-extrabold">{stateName}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-0.5">District</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 font-medium text-slate-900 outline-none focus:border-slate-900"
                      >
                        {districtsList.map((d) => {
                          const dName = typeof d === "string" ? d : (d.en || d.id);
                          return <option key={dName} value={dName}>{dName}</option>;
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Grama Panchayat</label>
                      <input
                        type="text"
                        value={panchayat}
                        onChange={(e) => setPanchayat(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 font-medium text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Property / Bill ID</label>
                      <input
                        type="text"
                        value={assessmentId}
                        onChange={(e) => setAssessmentId(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 font-mono text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Door No / Ward</label>
                      <input
                        type="text"
                        value={doorNo}
                        onChange={(e) => setDoorNo(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 font-medium text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Taxpayer Name</label>
                      <input
                        type="text"
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 font-medium text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Specific Tab Inputs */}
                {activeTab === "property" && (
                  <div className="space-y-4 border-t border-stone-100 pt-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                        <span>Plinth Area (Square Feet):</span>
                        <span className="text-[#c26111] font-extrabold">{sqft} sq.ft</span>
                      </div>
                      <input
                        type="range"
                        min={300}
                        max={5000}
                        step={50}
                        value={sqft}
                        onChange={(e) => setSqft(Number(e.target.value))}
                        className="w-full accent-[#c26111] cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Building Usage</label>
                        <select
                          value={usageType}
                          onChange={(e) => setUsageType(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                        >
                          <option value="residential">Residential House</option>
                          <option value="commercial">Commercial Shop / Mall</option>
                          <option value="industrial">Industrial / Factory</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Construction Roof Type</label>
                        <select
                          value={structureType}
                          onChange={(e) => setStructureType(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                        >
                          <option value="pucca">Concrete RCC (Pucca)</option>
                          <option value="tiled">Tile Roof / Semi-Pucca</option>
                          <option value="katcha">Thatched / Katcha</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "water" && (
                  <div className="space-y-4 border-t border-stone-100 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Water Meter No</label>
                        <input
                          type="text"
                          value={meterId}
                          onChange={(e) => setMeterId(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Consumer Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                        >
                          <option value="domestic">Domestic Household</option>
                          <option value="commercial">Commercial Establishment</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                        <span>Monthly Water Usage:</span>
                        <span className="text-[#c26111] font-extrabold">{units} Kiloliters (kL)</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={100}
                        value={units}
                        onChange={(e) => setUnits(Number(e.target.value))}
                        className="w-full accent-[#c26111] cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "trade" && (
                  <div className="space-y-4 border-t border-stone-100 pt-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Firm / Store Name</label>
                      <input
                        type="text"
                        value={firmName}
                        onChange={(e) => setFirmName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Trade Sector</label>
                        <select
                          value={tradeCategory}
                          onChange={(e) => setTradeCategory(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                        >
                          <option value="retail">Retail Store &amp; General Goods</option>
                          <option value="food">Hotel, Restaurant &amp; Bakery</option>
                          <option value="manufacturing">Small Scale Workshop / Factory</option>
                          <option value="it">IT / Professional Office Services</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Staff / Employee Strength</label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={numEmployees}
                          onChange={(e) => setNumEmployees(Number(e.target.value))}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "professional" && (
                  <div className="space-y-4 border-t border-stone-100 pt-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Gross Half-Yearly Income / Revenue (₹)</label>
                      <input
                        type="number"
                        step={5000}
                        value={halfYearlyIncome}
                        onChange={(e) => setHalfYearlyIncome(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-slate-900"
                      />
                      <p className="text-[11px] text-stone-500 mt-1">
                        Professional tax is levied bi-annually per State Panchayat Tax Rules.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Calculated Itemized Invoice */}
              <div className="md:col-span-5 bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">Assessment Bill</p>
                    <h3 className="text-sm font-extrabold text-slate-900">{summary.title}</h3>
                  </div>
                  <Receipt className="w-6 h-6 text-[#c26111]" />
                </div>

                {/* Itemized list */}
                <div className="space-y-2.5 text-xs">
                  {summary.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-stone-600 font-medium">{it.name}</span>
                      <span className={`font-mono font-bold ${it.isDiscount ? "text-[#c26111]" : "text-slate-900"}`}>
                        {it.isDiscount ? `-₹${Math.abs(it.amount)}` : `₹${it.amount}`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-dashed border-stone-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-500">Net Payable Amount</p>
                    <p className="text-2xl font-black text-slate-900">₹{summary.amount.toLocaleString()}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-300">
                    Includes 5% Rebate
                  </span>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-[#0e1626] hover:bg-[#182338] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-98 text-sm"
                >
                  <span>Pay Now via Digital Portal</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Checkout & Payment Method */}
        {paymentStep === "checkout" && (
          <div className="p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
            <button
              onClick={() => setPaymentStep("calculator")}
              className="text-xs font-bold text-stone-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              ← Back to Calculator
            </button>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-slate-900">Select Digital Payment Mode</h2>
              <p className="text-xs text-stone-500">
                Amount to pay: <strong className="text-slate-900 font-mono text-sm">₹{summary.amount.toLocaleString()}</strong> for {summary.title}
              </p>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "upi", label: "UPI / QR Code", icon: QrCode },
                { id: "card", label: "Debit/Credit Card", icon: CreditCard },
                { id: "netbanking", label: "NetBanking", icon: Building }
              ].map((m) => {
                const Icon = m.icon;
                const isSel = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3.5 rounded-2xl border text-center space-y-1.5 transition cursor-pointer ${
                      isSel ? "border-[#0e1626] bg-slate-900/5 ring-2 ring-[#0e1626]/20" : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto ${isSel ? "text-[#0e1626]" : "text-stone-400"}`} />
                    <p className={`text-xs font-bold ${isSel ? "text-slate-900" : "text-stone-600"}`}>{m.label}</p>
                  </button>
                );
              })}
            </div>

            {/* UPI Option Details */}
            {paymentMethod === "upi" && (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center space-y-4">
                <p className="text-xs font-bold text-stone-700">Scan UPI QR Code via Google Pay / PhonePe / Paytm</p>
                <div className="w-40 h-40 bg-white p-2.5 rounded-2xl border border-stone-300 mx-auto shadow-sm flex items-center justify-center relative">
                  <div className="text-center space-y-1">
                    <QrCode className="w-24 h-24 text-slate-900 mx-auto" />
                    <p className="text-[10px] font-bold font-mono text-[#c26111]">UPI ID: gramseva.pay@sbi</p>
                  </div>
                </div>
                <div className="flex justify-center gap-3">
                  {["gpay", "phonepe", "paytm"].map((app) => (
                    <button
                      key={app}
                      onClick={() => setUpiApp(app)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                        upiApp === app ? "bg-slate-900 text-white border-slate-900" : "bg-white text-stone-600 border-stone-200"
                      }`}
                    >
                      {app.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full bg-[#0e1626] hover:bg-[#182338] text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition cursor-pointer active:scale-98 disabled:opacity-50 text-sm"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  <span>Verifying Payment with Bank Gateway...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Authorize &amp; Pay ₹{summary.amount.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3: Printable / Downloadable Official Receipt */}
        {paymentStep === "receipt" && receiptData && (
          <div className="p-6 sm:p-10 space-y-6 max-w-2xl mx-auto">
            {/* Success Banner */}
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-extrabold">Payment Successful!</p>
                <p className="text-xs text-emerald-700">Official Grama Panchayat e-Receipt generated and recorded.</p>
              </div>
            </div>

            {/* Print Area - Official Receipt Document */}
            <div id="printable-receipt" className="bg-white border-2 border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md relative">
              {/* Receipt Header */}
              <div className="text-center space-y-1 pb-4 border-b-2 border-stone-800">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-stone-500">
                  <Building2 className="w-3.5 h-3.5 text-slate-800" />
                  <span>GOVERNMENT OF {receiptData.state.toUpperCase()} • GRAMA PANCHAYAT</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  {receiptData.panchayat}
                </h2>
                <p className="text-xs text-stone-600 font-medium">
                  Official Digital Tax &amp; Fee Payment e-Receipt
                </p>
              </div>

              {/* Receipt Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <p className="text-[10px] font-sans font-bold text-stone-400 uppercase">Receipt No</p>
                  <p className="font-bold text-slate-900">{receiptData.receiptNo}</p>
                </div>
                <div>
                  <p className="text-[10px] font-sans font-bold text-stone-400 uppercase">Transaction ID</p>
                  <p className="font-bold text-slate-900">{receiptData.txnId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-sans font-bold text-stone-400 uppercase">Taxpayer Name</p>
                  <p className="font-bold text-slate-900 font-sans">{receiptData.citizenName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-sans font-bold text-stone-400 uppercase">Assessment / Property ID</p>
                  <p className="font-bold text-slate-900">{receiptData.assessmentId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-sans font-bold text-stone-400 uppercase">Date &amp; Time</p>
                  <p className="font-medium text-slate-800 font-sans">{receiptData.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-sans font-bold text-stone-400 uppercase">Payment Mode</p>
                  <p className="font-medium text-slate-800 font-sans">{receiptData.paymentMethod}</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">Payment Breakdown</p>
                <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
                  {receiptData.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between p-2.5 border-b border-stone-100 last:border-0">
                      <span className="text-stone-700">{it.name}</span>
                      <span className="font-mono font-bold text-slate-900">₹{it.amount}</span>
                    </div>
                  ))}
                  <div className="flex justify-between p-3 bg-[#0e1626] text-white font-bold">
                    <span>TOTAL AMOUNT PAID</span>
                    <span className="font-mono text-sm text-amber-300">₹{receiptData.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Stamp & QR Verification */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <QrCode className="w-14 h-14 text-slate-900 p-1 border border-stone-300 rounded-lg" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-800 flex items-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#c26111]" /> State Portal Verified
                    </p>
                    <p className="text-[10px] text-stone-500 max-w-40 leading-tight">
                      Scan QR code with any official app to verify receipt authenticity.
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="w-24 border-b border-stone-800 ml-auto pb-1" />
                  <p className="text-[10px] font-bold uppercase text-slate-800">Panchayat Secretary</p>
                  <p className="text-[9px] text-stone-400">Digital Seal &amp; Stamp</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setPaymentStep("calculator")}
                className="text-xs font-bold text-stone-600 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-stone-300 cursor-pointer"
              >
                Make Another Payment
              </button>

              <button
                onClick={() => window.print()}
                className="bg-[#0e1626] hover:bg-[#182338] text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print / Download Receipt</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
