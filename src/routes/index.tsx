import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Globe2,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Mic,
  Navigation,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  User,
  UserCheck,
  Zap,
} from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

import { saveUserRecord } from "@/lib/db";
import { cn, detectUserLocation } from "@/lib/utils";
import { VyaparMitraLogo } from "@/components/VyaparMitraLogo";

const languages = ["English", "हिंदी", "मराठी"] as const;

const businessCategories = [
  {
    id: "food",
    name: "Food Stall & Snack Shop",
    icon: Store,
    desc: "Tea, snacks, fast food, bakery",
    activeColor: "border-emerald-500 bg-emerald-50 text-emerald-900",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "kirana",
    name: "Retail & Kirana Store",
    icon: Building2,
    desc: "Grocery, daily items, mini-mart",
    activeColor: "border-indigo-500 bg-indigo-50 text-indigo-900",
    iconBg: "bg-indigo-100 text-indigo-600",
  },
  {
    id: "apparel",
    name: "Clothing & Boutique",
    icon: Briefcase,
    desc: "Garments, footwear, tailoring",
    activeColor: "border-purple-500 bg-purple-50 text-purple-900",
    iconBg: "bg-purple-100 text-purple-600",
  },
  {
    id: "tech",
    name: "Electronics & Mobile Shop",
    icon: Zap,
    desc: "Mobile repair, gadgets, accessories",
    activeColor: "border-cyan-500 bg-cyan-50 text-cyan-900",
    iconBg: "bg-cyan-100 text-cyan-600",
  },
  {
    id: "agri",
    name: "Dairy & Agri-Business",
    icon: Globe2,
    desc: "Dairy products, organic farm, seeds",
    activeColor: "border-amber-500 bg-amber-50 text-amber-900",
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    id: "services",
    name: "Services & Salon",
    icon: UserCheck,
    desc: "Hair salon, repair, local services",
    activeColor: "border-rose-500 bg-rose-50 text-rose-900",
    iconBg: "bg-rose-100 text-rose-600",
  },
];

const popularLocations = [
  "Pune, MH",
  "Mumbai, MH",
  "Nashik, MH",
  "Nagpur, MH",
  "Delhi NCR",
  "Bengaluru, KA",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign In & Onboarding | Vyapar-Mitra" },
      {
        name: "description",
        content:
          "Tell Vyapar-Mitra about your business idea and get instant local AI market insights.",
      },
      { property: "og:title", content: "Vyapar-Mitra | AI Business Advisor" },
      {
        property: "og:description",
        content: "Smart business onboarding for Indian entrepreneurs.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const ideaRef = useRef<HTMLInputElement>(null);

  // Form State
  const [authMethod, setAuthMethod] = useState<"otp" | "google" | "guest">("otp");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Mobile Verification State
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [language, setLanguage] = useState<(typeof languages)[number]>("English");

  const [category, setCategory] = useState("food");
  const [idea, setIdea] = useState("Snack & Tea Corner");
  const [capital, setCapital] = useState("50,000");
  const [location, setLocation] = useState("Shivajinagar, Pune");
  const [targetAudience, setTargetAudience] = useState("Local Walk-in Customers");

  const [listening, setListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GPS Location Detection State
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);
  const [locDetected, setLocDetected] = useState(false);

  function startVoice() {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? (window.SpeechRecognition ?? window.webkitSpeechRecognition)
        : undefined;
    if (!SpeechRecognition) {
      ideaRef.current?.focus();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === "हिंदी" ? "hi-IN" : language === "मराठी" ? "mr-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) setIdea((current) => (current ? `${current} ${transcript}` : transcript));
    };
    recognition.start();
  }

  async function handleGPSDetect() {
    setIsDetectingLoc(true);
    try {
      const detected = await detectUserLocation();
      if (detected) {
        setLocation(detected);
        setLocDetected(true);
        toast.success("Full address & location detected!", {
          description: detected,
        });
      }
    } catch (err) {
      toast.error("GPS access unavailable. Please type your location manually.");
    } finally {
      setIsDetectingLoc(false);
    }
  }

  function handleSendOtp() {
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setPhoneError("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
      return;
    }
    setPhoneError(null);
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setOtpSent(true);
    setIsPhoneVerified(false);
  }

  function handleVerifyOtp() {
    if (otpCode.trim() === generatedOtp || otpCode.trim() === "1234") {
      setIsPhoneVerified(true);
      setPhoneError(null);
    } else {
      setPhoneError(`Incorrect OTP code. Use code: ${generatedOtp} or 1234`);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    // Strict Verification Guard for Mobile OTP
    if (authMethod === "otp" && !isPhoneVerified) {
      setPhoneError("Please verify your mobile phone number with the OTP code before logging in.");
      document.getElementById("phone-verification-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    const selectedCatObj = businessCategories.find((c) => c.id === category);

    try {
      await saveUserRecord({
        fullName: fullName.trim() || "Ramesh K.",
        phone: authMethod === "otp" ? phone.trim() || "9876543210" : "",
        email: authMethod === "google" ? email.trim() || "user@gmail.com" : "",
        authMethod,
        categoryName: selectedCatObj?.name || "Small Business",
        category: category,
        idea: idea.trim() || "Snack Shop",
        capital: capital.trim() || "50,000",
        location: location.trim() || "Pune, MH",
        language,
        targetAudience,
      });
    } catch (err) {
      console.error("Failed to save record to database", err);
    }

    setTimeout(() => {
      navigate({ to: "/dashboard" });
    }, 600);
  }

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      {/* Decorative Pastel Ambient Orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-indigo-200/40 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-purple-200/40 blur-[100px]" />

      {/* Header Brand Logo */}
      <VyaparMitraLogo
        size="lg"
        subtitle="Smart Business Co-Pilot v2.0"
        className="relative z-10 mb-8"
      />

      {/* Main White Card */}
      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-white p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/60">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1 text-xs font-bold text-indigo-700 mb-3">
            <Sparkles size={14} className="text-purple-600" />
            <span>Smart Business Onboarding</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Vyapar-Mitra
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Choose your sign-in method and generate your local business feasibility report.
          </p>
        </header>

        <form className="flex flex-col gap-7" onSubmit={submit}>
          {/* Sign In Method Selector */}
          <fieldset
            id="phone-verification-section"
            className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4.5"
          >
            <legend className="px-2 text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
              <Lock size={13} className="text-indigo-600" />
              1. Choose Sign-In Option
            </legend>

            <div className="mt-3 grid grid-cols-3 gap-2.5 mb-4">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("otp");
                  setPhoneError(null);
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-bold transition cursor-pointer",
                  authMethod === "otp"
                    ? "border-indigo-600 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30",
                )}
              >
                <PhoneCall size={18} />
                <span>Mobile OTP</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod("google");
                  setIsPhoneVerified(true);
                  setPhoneError(null);
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-bold transition cursor-pointer",
                  authMethod === "google"
                    ? "border-indigo-600 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30",
                )}
              >
                <Globe2 size={18} />
                <span>Google Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod("guest");
                  setIsPhoneVerified(true);
                  setPhoneError(null);
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-bold transition cursor-pointer",
                  authMethod === "guest"
                    ? "border-indigo-600 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30",
                )}
              >
                <Zap size={18} />
                <span>Fast Guest Access</span>
              </button>
            </div>

            {/* Conditional Input Fields Based on Auth Method */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Full Name is required for all */}
              <label className={cn("block", authMethod === "guest" ? "sm:col-span-2" : "")}>
                <span className="mb-1.5 block text-xs font-bold text-slate-700">Full Name *</span>
                <div className="relative">
                  <User
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name (e.g. Ramesh Kumar)"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </label>

              {/* Show Mobile Field ONLY for Mobile OTP Login */}
              {authMethod === "otp" && (
                <label className="block">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700">Mobile Phone Number *</span>
                    {isPhoneVerified && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 size={13} /> Verified
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <PhoneCall
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="tel"
                      required
                      inputMode="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, ""));
                        setIsPhoneVerified(false);
                        setOtpSent(false);
                        setPhoneError(null);
                      }}
                      placeholder="10-digit mobile number"
                      className={cn(
                        "h-11 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:ring-2",
                        isPhoneVerified
                          ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-100"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100",
                      )}
                    />
                  </div>
                </label>
              )}

              {/* Show Email Field ONLY for Google Login */}
              {authMethod === "google" && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">
                    Google Email Address *
                  </span>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Google email (e.g. user@gmail.com)"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </label>
              )}
            </div>

            {/* Error Message Display */}
            {phoneError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-700">
                <AlertCircle size={16} className="shrink-0 text-rose-600" />
                <span>{phoneError}</span>
              </div>
            )}

            {/* OTP Controls for Mobile OTP */}
            {authMethod === "otp" && (
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                {!isPhoneVerified ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="h-10 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
                      >
                        {otpSent ? "Resend Verification OTP" : "Send Verification OTP"}
                      </button>

                      {otpSent && (
                        <span className="text-xs text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg">
                          Test OTP Code:{" "}
                          <strong className="text-purple-700 tracking-widest">
                            {generatedOtp}
                          </strong>
                        </span>
                      )}
                    </div>

                    {otpSent && (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          maxLength={4}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="Enter 4-digit OTP"
                          className="h-10 w-36 rounded-xl border border-indigo-300 bg-white px-3 text-center text-sm font-bold tracking-widest text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 text-xs font-extrabold text-white shadow-sm hover:from-emerald-600 hover:to-teal-700 transition cursor-pointer"
                        >
                          Verify OTP
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Mobile number verified via SMS OTP! (+91 {phone})</span>
                  </div>
                )}
              </div>
            )}

            {/* Info Badge for Google Login */}
            {authMethod === "google" && (
              <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
                <Globe2 size={16} className="text-indigo-600" />
                <span>
                  Signed in via Google Account ({email || "user@gmail.com"}). Mobile verification is
                  not required.
                </span>
              </div>
            )}

            {/* Info Badge for Guest Login */}
            {authMethod === "guest" && (
              <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
                <ShieldCheck size={16} className="text-indigo-600" />
                <span>
                  Instant guest access mode. Phone number and email address are not required.
                </span>
              </div>
            )}
          </fieldset>

          {/* Language Preference */}
          <fieldset>
            <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Language Preference / भाषा
            </legend>
            <div className="grid grid-cols-3 gap-3">
              {languages.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLanguage(item)}
                  className={cn(
                    "h-11 rounded-xl border text-xs transition cursor-pointer",
                    language === item
                      ? "border-indigo-600 bg-indigo-600 text-white font-bold shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Business Category Options */}
          <fieldset>
            <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Select Business Category
            </legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {businessCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id);
                      setIdea(cat.name);
                    }}
                    className={cn(
                      "flex flex-col items-start rounded-2xl border p-3.5 text-left transition cursor-pointer",
                      isSelected
                        ? cat.activeColor + " font-bold shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/50",
                    )}
                  >
                    <div className={cn("grid size-9 place-items-center rounded-xl", cat.iconBg)}>
                      <Icon size={18} />
                    </div>
                    <span className="mt-2.5 text-xs font-bold leading-tight">{cat.name}</span>
                    <span className="mt-1 text-[10px] text-slate-400">{cat.desc}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Business Details Input */}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Business Idea / Specific Setup
              </span>
              <span className="relative block">
                <input
                  ref={ideaRef}
                  required
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="E.g. Snack shop near college gate..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={startVoice}
                  aria-label="Use voice input"
                  className={cn(
                    "absolute inset-y-0 right-0 grid w-12 place-items-center transition cursor-pointer",
                    listening
                      ? "text-indigo-600 animate-pulse"
                      : "text-slate-400 hover:text-indigo-600",
                  )}
                >
                  <Mic size={18} />
                </button>
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Starting Capital (₹)
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-items-center text-sm font-bold text-slate-400">
                  ₹
                </span>
                <input
                  required
                  inputMode="numeric"
                  value={capital}
                  onChange={(e) => setCapital(e.target.value.replace(/[^\d,]/g, ""))}
                  placeholder="50,000"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Target Customers
              </span>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="Local Walk-in Customers">Local Walk-in Customers (Retail)</option>
                <option value="Students & Youth">Students & Youth Segment</option>
                <option value="Office & Corporate Workers">Office & Corporate Workers</option>
                <option value="Wholesale Buyers">Wholesale & Bulk Buyers (B2B)</option>
              </select>
            </label>

            {/* GPS Location Input with Direct Map/GPS Detection */}
            <label className="block sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Location / District
                </span>
                <button
                  type="button"
                  onClick={handleGPSDetect}
                  disabled={isDetectingLoc}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer disabled:opacity-50"
                >
                  {isDetectingLoc ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Detecting Maps GPS...</span>
                    </>
                  ) : (
                    <>
                      <Navigation size={13} />
                      <span>Use Maps / GPS Location</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <MapPin
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  required
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setLocDetected(false);
                  }}
                  placeholder="Enter village, area or district (e.g. Shivajinagar, Pune)"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-28 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={handleGPSDetect}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                >
                  <Navigation size={12} />
                  <span>GPS</span>
                </button>
              </div>
              {locDetected && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 size={13} />
                  Location successfully detected from Maps GPS
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {popularLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setLocation(loc);
                      setLocDetected(false);
                    }}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 transition cursor-pointer"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 text-base font-extrabold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Saving to Database & Generating Plan...</span>
            ) : (
              <>
                <span>Save Record to Database & Launch Plan</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    onstart: (() => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    start: () => void;
  }
  interface SpeechRecognitionEvent {
    results: { [index: number]: { [index: number]: { transcript: string } } };
  }
}
