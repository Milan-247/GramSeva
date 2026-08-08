import { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Check, 
  ShieldCheck, 
  HelpCircle,
  MapPin,
  Globe
} from "lucide-react";
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
import GraamSevaSeal from "./GraamSevaSeal";
import {
  KERALA_DISTRICTS_LIST,
  KERALA_PANCHAYATS_BY_DISTRICT,
  KARNATAKA_DISTRICTS_LIST,
  KARNATAKA_PANCHAYATS_BY_DISTRICT,
  TAMILNADU_DISTRICTS_LIST,
  TAMILNADU_PANCHAYATS_BY_DISTRICT,
  ANDHRAPRADESH_DISTRICTS_LIST,
  ANDHRAPRADESH_PANCHAYATS_BY_DISTRICT
} from "../data/services";

const STATE_OPTIONS = [
  { id: "kerala", name: "Kerala", emoji: "🌴" },
  { id: "karnataka", name: "Karnataka", emoji: "🏰" },
  { id: "tamilnadu", name: "Tamil Nadu", emoji: "🛕" },
  { id: "andhra", name: "Andhra Pradesh", emoji: "🌾" }
];

const STATE_MAP = {
  kerala: {
    name: "Kerala",
    districts: KERALA_DISTRICTS_LIST,
    panchayats: KERALA_PANCHAYATS_BY_DISTRICT,
    defaultDistrict: "Kozhikode",
    defaultLocality: "Azhiyur"
  },
  karnataka: {
    name: "Karnataka",
    districts: KARNATAKA_DISTRICTS_LIST,
    panchayats: KARNATAKA_PANCHAYATS_BY_DISTRICT,
    defaultDistrict: "Dakshina Kannada",
    defaultLocality: "Mangaluru"
  },
  tamilnadu: {
    name: "Tamil Nadu",
    districts: TAMILNADU_DISTRICTS_LIST,
    panchayats: TAMILNADU_PANCHAYATS_BY_DISTRICT,
    defaultDistrict: "Chennai",
    defaultLocality: "Tambaram"
  },
  andhra: {
    name: "Andhra Pradesh",
    districts: ANDHRAPRADESH_DISTRICTS_LIST,
    panchayats: ANDHRAPRADESH_PANCHAYATS_BY_DISTRICT,
    defaultDistrict: "Visakhapatnam",
    defaultLocality: "Gajuwaka"
  }
};

export default function WiseGatekeeperLogin({
  onLoginSuccess,
  onGuestAccess,
  selectedState = "kerala",
  onStateChange,
  selectedDistrict = "Kozhikode",
  selectedLocality = "Azhiyur",
  setSuccessToast,
  districtsList = [],
  panchayatsByDistrict = {}
}) {
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // State selection option
  const [currentState, setCurrentState] = useState(
    selectedState && selectedState !== "all" ? selectedState : "kerala"
  );

  // Active district/panchayat lists based on selectedState
  const activeDistricts = STATE_MAP[currentState]?.districts || districtsList || KERALA_DISTRICTS_LIST;
  const activePanchayats = STATE_MAP[currentState]?.panchayats || panchayatsByDistrict || KERALA_PANCHAYATS_BY_DISTRICT;

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Extra fields for register
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState(
    selectedDistrict !== "all" ? selectedDistrict : STATE_MAP[currentState]?.defaultDistrict || "Kozhikode"
  );
  const [locality, setLocality] = useState(
    selectedLocality !== "all" ? selectedLocality : STATE_MAP[currentState]?.defaultLocality || "Azhiyur"
  );
  const [role, setRole] = useState("Resident / Citizen");

  const handleStateSelect = (stateId) => {
    setCurrentState(stateId);
    onStateChange?.(stateId);
    const config = STATE_MAP[stateId];
    if (config) {
      setDistrict(config.defaultDistrict);
      setLocality(config.defaultLocality);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAuthError("Please fill in both email and password.");
      return;
    }
    setAuthError("");
    setLoading(true);

    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        onStateChange?.(currentState);
        setSuccessToast?.("Welcome back! Authenticated with Firebase.");
        setTimeout(() => setSuccessToast?.(""), 3500);
        onLoginSuccess?.();
      } else {
        if (!fullName.trim()) {
          setAuthError("Please enter your full name.");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setAuthError("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }

        const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = res.user;

        const userProfile = {
          uid: user.uid,
          name: fullName.trim(),
          email: user.email || email.trim(),
          phone: phone.trim() ? `+91 ${phone.trim()}` : "+91 98470 00000",
          state: currentState,
          stateName: STATE_MAP[currentState]?.name || "Kerala",
          district: district || STATE_MAP[currentState]?.defaultDistrict || "Kozhikode",
          locality: locality || STATE_MAP[currentState]?.defaultLocality || "Azhiyur",
          role: role,
          roleBadge: role.includes("Official") ? "Official" : "Verified Citizen",
          rationCard: "Priority BPL",
          avatarColor: "bg-emerald-700",
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, "users", user.uid), userProfile);
        onStateChange?.(currentState);
        setSuccessToast?.(`Account created! Welcome, ${fullName.trim()}.`);
        setTimeout(() => setSuccessToast?.(""), 3500);
        onLoginSuccess?.();
      }
    } catch (err) {
      console.error("Firebase Auth Error:", err);
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

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const userProfile = {
          uid: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "Citizen",
          email: user.email || "",
          phone: user.phoneNumber || "+91 98470 00000",
          state: currentState,
          stateName: STATE_MAP[currentState]?.name || "Kerala",
          district: district || STATE_MAP[currentState]?.defaultDistrict || "Kozhikode",
          locality: locality || STATE_MAP[currentState]?.defaultLocality || "Azhiyur",
          role: "Resident / Citizen",
          roleBadge: "Verified Citizen",
          rationCard: "Priority BPL",
          avatarColor: "bg-emerald-700",
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, userProfile);
      }

      onStateChange?.(currentState);
      setSuccessToast?.(`Signed in with Google as ${user.displayName || user.email}!`);
      setTimeout(() => setSuccessToast?.(""), 3500);
      onLoginSuccess?.();
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
    <div className="fixed inset-0 z-[100] w-full h-full bg-[#131b2e] flex items-center justify-center overflow-y-auto">
      <div className="w-full h-full min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
        
        {/* LEFT COLUMN: Deep Navy Registry Canvas (Reference Design) */}
        <div className="lg:col-span-5 xl:col-span-5 bg-[#131b2e] text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden min-h-[220px] sm:min-h-[280px] lg:min-h-screen shrink-0 border-r border-slate-800/60">
          
          {/* Top Pill Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 border border-slate-700/80 bg-slate-900/50 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono tracking-widest text-slate-300 uppercase font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>GRAMA PANCHAYAT CIVIC OS</span>
            </div>

            {/* Mobile Guest Shortcut Button */}
            <button
              type="button"
              onClick={onGuestAccess}
              className="lg:hidden text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full font-bold transition active:scale-95 border border-slate-700 cursor-pointer"
            >
              Skip as Guest
            </button>
          </div>

          {/* Headline & Story */}
          <div className="relative z-10 space-y-4 my-6 sm:my-8 lg:my-0">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] font-serif">
              GramSeva <br />
              <span className="italic font-normal text-slate-200">registry of record.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md font-sans leading-relaxed">
              India&apos;s unified ledger for Grama Panchayat services — certificates, permits, tax records and a verified digital wallet for every citizen document.
            </p>

            {/* Section List (§1, §2, §3) */}
            <div className="hidden sm:block space-y-3 border-t border-slate-800/80 pt-6 mt-6">
              <div className="flex items-center text-xs sm:text-sm text-slate-200">
                <span className="text-amber-500 font-serif font-bold w-8 text-sm">§1</span>
                <span>Fast-track certificates &amp; building permits</span>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-slate-200 border-t border-slate-800/50 pt-3">
                <span className="text-amber-500 font-serif font-bold w-8 text-sm">§2</span>
                <span>Instant access across states &amp; panchayats</span>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-slate-200 border-t border-slate-800/50 pt-3">
                <span className="text-amber-500 font-serif font-bold w-8 text-sm">§3</span>
                <span>Encrypted digital vault for citizen records</span>
              </div>
            </div>
          </div>

          {/* Circular Badge Seal (Reference Design) */}
          <div className="hidden lg:flex justify-end my-2">
            <div className="p-1.5 rounded-full border border-slate-700/80 bg-slate-900/40 backdrop-blur-xs">
              <GraamSevaSeal className="w-24 h-24 filter drop-shadow-lg" showText={true} />
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="relative z-10 text-[11px] font-mono text-slate-400 pt-3 sm:pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span>GramSeva • Citizen Portal</span>
            <button
              type="button"
              onClick={onGuestAccess}
              className="text-slate-200 hover:text-white underline font-semibold cursor-pointer"
            >
              Explore as Guest →
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Warm Off-White Form (Reference Design) */}
        <div className="lg:col-span-7 xl:col-span-7 bg-[#f7f5ed] p-5 sm:p-10 lg:p-16 flex flex-col justify-between relative overflow-y-auto">
          
          {/* Centered Form Wrapper */}
          <div className="max-w-md w-full mx-auto space-y-6 sm:space-y-8 my-auto py-2 sm:py-6">
            
            {/* Header / Logo */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={graamsevaLogo} alt="GramSeva Logo" className="h-10 sm:h-12 w-auto object-contain shrink-0" />
                <div>
                  <div className="font-serif font-bold text-2xl text-slate-900 leading-none">GramSeva</div>
                  <div className="text-[9px] font-mono tracking-widest text-slate-500 uppercase font-semibold mt-1">DIGITAL GOVERNANCE REGISTRY</div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-serif italic font-normal text-slate-900 tracking-tight">
                  {authMode === "login" ? "Welcome back." : "Create account."}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1.5">
                  {authMode === "login" ? (
                    <>
                      New to GramSeva?{" "}
                      <button
                        type="button"
                        onClick={() => { setAuthMode("register"); setAuthError(""); }}
                        className="font-bold text-[#e07a1e] hover:underline cursor-pointer"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => { setAuthMode("login"); setAuthError(""); }}
                        className="font-bold text-[#e07a1e] hover:underline cursor-pointer"
                      >
                        Log in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>

            {authError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl font-medium flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {authMode === "register" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 uppercase">
                      FULL NAME
                    </label>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">ENTRY 00</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh K. Nambiar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-transparent border-b border-stone-300 focus:border-slate-900 text-slate-900 py-2.5 text-sm outline-none transition"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 uppercase">
                    EMAIL ADDRESS
                  </label>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">ENTRY 01</span>
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-stone-300 focus:border-slate-900 text-slate-900 py-2.5 text-sm outline-none transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 uppercase">
                    PASSWORD
                  </label>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">ENTRY 02</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-stone-300 focus:border-slate-900 text-slate-900 py-2.5 text-sm outline-none transition pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authMode === "register" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 uppercase block mb-1">
                      STATE
                    </label>
                    <select
                      value={currentState}
                      onChange={(e) => handleStateSelect(e.target.value)}
                      className="w-full bg-transparent border-b border-stone-300 text-slate-900 py-2 text-xs font-bold outline-none focus:border-slate-900 cursor-pointer"
                    >
                      {STATE_OPTIONS.map((st) => (
                        <option key={st.id} value={st.id} className="bg-white text-slate-900">
                          {st.emoji} {st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 uppercase block mb-1">
                      DISTRICT
                    </label>
                    <select
                      value={district}
                      onChange={(e) => {
                        const newDist = e.target.value;
                        setDistrict(newDist);
                        const panchs = activePanchayats[newDist];
                        if (panchs && panchs.length > 0) {
                          const firstPName = typeof panchs[0] === "string" ? panchs[0] : (panchs[0].en || panchs[0].ml);
                          setLocality(firstPName);
                        }
                      }}
                      className="w-full bg-transparent border-b border-stone-300 text-slate-900 py-2 text-xs font-medium outline-none focus:border-slate-900 cursor-pointer"
                    >
                      {activeDistricts.map((d) => {
                        const distName = typeof d === "string" ? d : (d.en || d.id);
                        const distKey = typeof d === "string" ? d : (d.id || d.en);
                        return (
                          <option key={distKey} value={distName} className="bg-white text-slate-900">
                            {distName} {typeof d === "object" && d.ml ? `(${d.ml})` : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 uppercase block mb-1">
                      PANCHAYAT
                    </label>
                    <select
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full bg-transparent border-b border-stone-300 text-slate-900 py-2 text-xs font-medium outline-none focus:border-slate-900 cursor-pointer"
                    >
                      {(activePanchayats[district] || [{ en: locality, ml: locality }]).map((p) => {
                        const pName = typeof p === "string" ? p : (p.en || p.ml);
                        const pKey = typeof p === "string" ? p : (p.en || p.ml);
                        return (
                          <option key={pKey} value={pName} className="bg-white text-slate-900">
                            {pName} {typeof p === "object" && p.ml ? `(${p.ml})` : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              )}

              {/* Primary Action Button: Warm Amber/Orange #e07a1e as shown in reference design */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e07a1e] hover:bg-[#cf6d16] text-white font-semibold py-3.5 rounded-lg text-sm sm:text-base transition cursor-pointer active:scale-98 shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{authMode === "login" ? "Log in →" : "Create Account →"}</span>
                )}
              </button>

              {/* Checkbox and Trouble Logging In */}
              {authMode === "login" && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer select-none">
                    <div 
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                        rememberMe ? "bg-[#e07a1e] border-[#e07a1e] text-white" : "border-stone-400 bg-white"
                      }`}
                    >
                      {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setAuthError("Contact local Grama Panchayat administrator or use Google Sign-In.")}
                    className="text-slate-600 underline hover:text-slate-900 cursor-pointer"
                  >
                    Trouble logging in?
                  </button>
                </div>
              )}
            </form>

            {/* Social Logins Divider */}
            <div className="space-y-4 pt-2">
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-300"></div>
                </div>
                <div className="relative inline-block bg-[#f7f5ed] px-3 text-[10px] font-mono tracking-widest text-slate-500 uppercase font-semibold">
                  OR CONTINUE WITH
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white border border-stone-300 hover:bg-stone-100 text-slate-800 font-bold py-3 rounded-lg flex items-center justify-center gap-3 transition cursor-pointer active:scale-98 shadow-2xs"
                title="Sign in with Google"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                <span className="text-xs sm:text-sm font-semibold text-slate-800">Continue with Google</span>
              </button>
            </div>

          </div>

          {/* Footer Terms */}
          <div className="pt-6 text-center text-[11px] text-slate-500 font-medium">
            By continuing, you agree to GramSeva&apos;s Terms of Service and Privacy Policy. Protected by Firebase Auth.
          </div>

        </div>

      </div>
    </div>
  );
}
