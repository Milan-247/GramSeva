import { useState } from "react";
import { motion } from "motion/react";
import { X, LogIn, UserPlus, Mail, Lock, User, Phone, MapPin, Building2, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  doc,
  setDoc,
  getDoc
} from "../lib/firebase";
import graamsevaLogo from "../assets/graamseva-logo.svg";

export default function FirebaseAuthModal({
  isOpen,
  onClose,
  selectedDistrict = "Kozhikode",
  selectedLocality = "Azhiyur",
  setSuccessToast,
  districtsList = [],
  panchayatsByDistrict = {}
}) {
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regDistrict, setRegDistrict] = useState(selectedDistrict !== "all" ? selectedDistrict : "Kozhikode");
  const [regLocality, setRegLocality] = useState(selectedLocality !== "all" ? selectedLocality : "Azhiyur");
  const [regRole, setRegRole] = useState("Resident / Citizen");

  if (!isOpen) return null;

  const getReadableAuthError = (err) => {
    const code = err?.code || "";
    if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
      return "Invalid email or password. Please check your credentials and try again.";
    }
    if (code === "auth/email-already-in-use") {
      return "An account with this email address already exists. Please log in instead.";
    }
    if (code === "auth/weak-password") {
      return "Password should be at least 6 characters long.";
    }
    if (code === "auth/invalid-email") {
      return "Please enter a valid email address.";
    }
    if (code === "auth/popup-closed-by-user") {
      return "Google Sign-In popup was closed before completing.";
    }
    return err?.message || "Authentication failed. Please try again.";
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError("Please fill in both email and password.");
      return;
    }
    setAuthError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      setSuccessToast?.("Logged in successfully!");
      setTimeout(() => setSuccessToast?.(""), 3500);
      onClose();
    } catch (err) {
      console.error("Firebase Login Error:", err);
      setAuthError(getReadableAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setAuthError("Please fill in all required fields (Name, Email, Password).");
      return;
    }
    if (regPassword.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      return;
    }
    setAuthError("");
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, regEmail.trim(), regPassword);
      const user = res.user;

      // Save user profile in Firestore
      const userProfile = {
        uid: user.uid,
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim() ? `+91 ${regPhone.trim()}` : "+91 98470 00000",
        district: regDistrict || "Kozhikode",
        locality: regLocality || "Azhiyur",
        role: regRole,
        roleBadge: regRole.includes("Official") ? "Official" : "Verified Citizen",
        rationCard: "Priority BPL",
        avatarColor: "bg-emerald-700",
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, "users", user.uid), userProfile);

      setSuccessToast?.(`Welcome to GramSeva, ${regName.trim()}!`);
      setTimeout(() => setSuccessToast?.(""), 3500);
      onClose();
    } catch (err) {
      console.error("Firebase Register Error:", err);
      setAuthError(getReadableAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      // Check if profile exists, if not create one
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const userProfile = {
          uid: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "Citizen",
          email: user.email || "",
          phone: user.phoneNumber || "+91 98470 00000",
          district: selectedDistrict !== "all" ? selectedDistrict : "Kozhikode",
          locality: selectedLocality !== "all" ? selectedLocality : "Azhiyur",
          role: "Resident / Citizen",
          roleBadge: "Verified Citizen",
          rationCard: "Priority BPL",
          avatarColor: "bg-emerald-700",
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, userProfile);
      }

      setSuccessToast?.(`Signed in with Google as ${user.displayName || user.email}!`);
      setTimeout(() => setSuccessToast?.(""), 3500);
      onClose();
    } catch (err) {
      if (err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request") {
        console.log("Google Sign-In popup closed by user.");
        setAuthError("Sign-in popup was closed before completing.");
      } else {
        console.error("Google Sign-In Error:", err);
        setAuthError(getReadableAuthError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-3 sm:p-5 flex justify-center items-center min-h-screen my-0 cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="firebase-login-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 my-auto relative shrink-0 cursor-default"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-2xl shadow-md border border-emerald-200 shrink-0">
                <img src={graamsevaLogo} alt="GramSeva" className="h-8 w-auto object-contain" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block">
                  GramSeva Citizen Portal
                </span>
                <h3 id="firebase-login-title" className="font-classical text-lg sm:text-xl font-black text-white leading-tight">
                  {authMode === "login" ? "Account Sign In" : "Register Citizen Account"}
                </h3>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-emerald-100/90 mt-2 font-medium relative z-10">
            Authenticated securely via Firebase. Access saved certificates, local Panchayat status, and official services.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-100/80 p-1.5 gap-1">
          <button
            type="button"
            onClick={() => { setAuthMode("login"); setAuthError(""); }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              authMode === "login" ? "bg-white text-emerald-900 shadow-sm border border-stone-200/80" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode("register"); setAuthError(""); }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              authMode === "register" ? "bg-white text-emerald-900 shadow-sm border border-stone-200/80" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Citizen Signup</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authMode === "login" ? (
            /* LOGIN FORM */
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. citizen@gramseva.in"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-white border border-stone-300 focus:border-emerald-600 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs font-medium outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-white border border-stone-300 focus:border-emerald-600 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs font-medium outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-xs disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In with Firebase</span>
                  </>
                )}
              </button>

              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <span className="relative bg-white px-2.5 text-[10px] uppercase font-black text-slate-400">
                  Or continue with
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-300 text-slate-800 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2.5 transition cursor-pointer active:scale-95 shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google Sign-In</span>
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleEmailRegister} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh K. Nambiar"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-white border border-stone-300 focus:border-emerald-600 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs font-medium outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="citizen@gramseva.in"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-white border border-stone-300 focus:border-emerald-600 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs font-medium outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block mb-1">
                    Password * (6+ chars)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-white border border-stone-300 focus:border-emerald-600 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs font-medium outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block mb-1">
                  10-Digit Mobile Phone
                </label>
                <div className="relative flex items-center gap-1">
                  <span className="bg-stone-100 border border-stone-300 text-slate-700 text-xs px-2 py-2 rounded-xl font-mono shrink-0">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="94470 12345"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-white border border-stone-300 focus:border-emerald-600 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block mb-1">
                    District
                  </label>
                  <select
                    value={regDistrict}
                    onChange={(e) => {
                      const newDist = e.target.value;
                      setRegDistrict(newDist);
                      const panchs = panchayatsByDistrict[newDist];
                      if (panchs && panchs.length > 0) {
                        const firstPName = typeof panchs[0] === "string" ? panchs[0] : panchs[0].en;
                        setRegLocality(firstPName);
                      }
                    }}
                    className="w-full bg-white border border-stone-300 text-slate-900 rounded-xl px-2.5 py-2 text-xs font-medium outline-none focus:border-emerald-600"
                  >
                    {districtsList.map((d, idx) => {
                      const distName = typeof d === "string" ? d : (d.en || d.id);
                      const distKey = typeof d === "string" ? d : (d.id || d.en);
                      return (
                        <option key={`dist_${distKey}_${idx}`} value={distName}>
                          {distName} {typeof d === "object" && d.ml ? `(${d.ml})` : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block mb-1">
                    Locality / Panchayat
                  </label>
                  <select
                    value={regLocality}
                    onChange={(e) => setRegLocality(e.target.value)}
                    className="w-full bg-white border border-stone-300 text-slate-900 rounded-xl px-2.5 py-2 text-xs font-medium outline-none focus:border-emerald-600"
                  >
                    {(panchayatsByDistrict[regDistrict] || [{ en: "Azhiyur", ml: "അഴിയൂർ" }]).map((p, idx) => {
                      const pName = typeof p === "string" ? p : (p.en || p.ml);
                      const pCode = typeof p === "object" && p.code ? p.code : (p.en || p.ml || pName);
                      return (
                        <option key={`p_${pCode}_${idx}`} value={pName}>
                          {pName} {typeof p === "object" && p.block ? `(${p.block})` : typeof p === "object" && p.ml ? `(${p.ml})` : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block mb-1">
                  Citizen / Official Role
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full bg-white border border-stone-300 text-slate-900 rounded-xl px-2.5 py-2 text-xs font-medium outline-none focus:border-emerald-600"
                >
                  <option value="Resident / Citizen">Resident / Citizen</option>
                  <option value="Resident / Farmer">Resident / Farmer</option>
                  <option value="Panchayat Official / Member">Panchayat Official / Member</option>
                  <option value="Asha Worker / Health Volunteer">Asha Worker / Health Volunteer</option>
                  <option value="Kudumbashree / SHG Leader">Kudumbashree / SHG Leader</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-xs disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Firebase Account</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-100 border-t border-stone-200 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Firebase Protected Auth
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-emerald-800 hover:text-emerald-950 font-black cursor-pointer uppercase tracking-wider text-[10px]"
          >
            Explore as Guest &rarr;
          </button>
        </div>
      </motion.div>
    </div>
  );
}
