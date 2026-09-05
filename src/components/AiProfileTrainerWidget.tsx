import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Building2,
  TrendingUp,
  ShieldAlert,
  Users,
  FileCheck,
  ChevronRight,
  BrainCircuit,
  RotateCcw,
  Check,
  ArrowRight,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { UserRecord, saveUserRecord } from "@/lib/db";
import { cn } from "@/lib/utils";

interface AiProfileTrainerWidgetProps {
  profile: UserRecord;
  onProfileUpdate: (updated: UserRecord) => void;
  className?: string;
}

export function AiProfileTrainerWidget({
  profile,
  onProfileUpdate,
  className,
}: AiProfileTrainerWidgetProps) {
  // Step state (0 to 4 for 5 questions)
  const [currentStep, setCurrentStep] = useState(0);

  // Form selections
  const [premisesType, setPremisesType] = useState<string>(
    profile.premisesType || "Rented Commercial Shop",
  );
  const [monthlyGoal, setMonthlyGoal] = useState<string>(profile.monthlyGoal || "₹50,000 / month");
  const [mainChallenge, setMainChallenge] = useState<string>(
    profile.mainChallenge || "Customer Footfall",
  );
  const [competitorCount, setCompetitorCount] = useState<string>(
    profile.competitorCount || "Moderate (2-5 shops)",
  );
  const [hasGstOrUdyam, setHasGstOrUdyam] = useState<string>(
    profile.hasGstOrUdyam || "Udyam MSME + UPI Active",
  );

  const [isSaving, setIsSaving] = useState(false);

  // Compute completeness level (base 40% + 12% per answered question)
  const answeredCount = [
    premisesType,
    monthlyGoal,
    mainChallenge,
    competitorCount,
    hasGstOrUdyam,
  ].filter(Boolean).length;
  const trainingScore = Math.min(100, 40 + answeredCount * 12);

  const questions = [
    {
      id: "premises",
      title: "1. What is your operating premises type?",
      icon: Building2,
      subtitle: "Helps AI calculate exact monthly rent, electricity & overhead economics.",
      options: [
        { label: "🏪 Rented Commercial Shop", val: "Rented Commercial Shop" },
        { label: "🛺 Food Stall / Mobile Pushcart", val: "Food Stall / Mobile Pushcart" },
        { label: "🏡 Home-Based Setup", val: "Home-Based Setup" },
        { label: "🏬 Mall Kiosk / Market Counter", val: "Mall Kiosk / Market Counter" },
      ],
      current: premisesType,
      setter: setPremisesType,
    },
    {
      id: "goal",
      title: "2. What is your target monthly net profit goal?",
      icon: TrendingUp,
      subtitle: "Helps AI compute daily item sales volume needed to reach your income goal.",
      options: [
        { label: "🎯 ₹25,000 / month", val: "₹25,000 / month" },
        { label: "🚀 ₹50,000 / month", val: "₹50,000 / month" },
        { label: "🏆 ₹100,000+ / month", val: "₹100,000+ / month" },
        { label: "🌱 ₹15,000 / month (Side Income)", val: "₹15,000 / month" },
      ],
      current: monthlyGoal,
      setter: setMonthlyGoal,
    },
    {
      id: "challenge",
      title: "3. What is your biggest daily business bottleneck?",
      icon: ShieldAlert,
      subtitle: "AI will prioritize recommendations to solve your top friction point first.",
      options: [
        { label: "📢 Customer Footfall & Marketing", val: "Customer Footfall" },
        { label: "📦 Wholesale Supplier Pricing", val: "Wholesale Sourcing" },
        { label: "🏛️ Getting Govt Bank Loans / Subsidy", val: "Bank Loans & Subsidy" },
        { label: "💵 Managing Daily Cashflow", val: "Cashflow Management" },
      ],
      current: mainChallenge,
      setter: setMainChallenge,
    },
    {
      id: "competitors",
      title: "4. How many direct competitors operate within 1-2 km?",
      icon: Users,
      subtitle: "Helps AI gauge pricing pressure and differentiation strategy.",
      options: [
        { label: "🟢 Low (0-1 similar shop)", val: "Low (0-1 shop)" },
        { label: "🟡 Moderate (2-5 similar shops)", val: "Moderate (2-5 shops)" },
        { label: "🔴 High Density (6+ competitors)", val: "High Density (6+ shops)" },
      ],
      current: competitorCount,
      setter: setCompetitorCount,
    },
    {
      id: "compliance",
      title: "5. What digital & legal registrations do you have active?",
      icon: FileCheck,
      subtitle: "Helps AI suggest exact missing schemes & licenses (FSSAI, Udyam, GST).",
      options: [
        { label: "✅ Udyam MSME + Active UPI QR", val: "Udyam MSME + UPI Active" },
        { label: "🥗 FSSAI Food License + Udyam", val: "FSSAI + Udyam MSME" },
        { label: "🧾 Full GSTIN Registration", val: "GST Registered" },
        { label: "🐣 None Yet (Starting Fresh)", val: "None (Starting Fresh)" },
      ],
      current: hasGstOrUdyam,
      setter: setHasGstOrUdyam,
    },
  ];

  async function handleSaveTraining() {
    setIsSaving(true);
    const updatedRecord: UserRecord = {
      ...profile,
      premisesType,
      monthlyGoal,
      mainChallenge,
      competitorCount,
      hasGstOrUdyam,
      aiTrainingLevel: trainingScore,
    };

    try {
      await saveUserRecord(updatedRecord);
      onProfileUpdate(updatedRecord);
      toast.success("AI Profile Trained Successfully!", {
        description: `AI score updated to ${trainingScore}%. Your AI Co-Pilot now uses your exact operational details.`,
      });
    } catch (err) {
      toast.error("Failed to save AI training data.");
    } finally {
      setIsSaving(false);
    }
  }

  const q = questions[currentStep] || questions[0];
  const Icon = q.icon;

  return (
    <div
      className={cn(
        "rounded-3xl border border-purple-200/90 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-6 text-white shadow-xl shadow-purple-950/20",
        className,
      )}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-800/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 shadow-inner">
            <BrainCircuit size={24} className="animate-pulse text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-tight text-white">
                AI Profile Trainer & Questionnaire
              </h3>
              <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-300 border border-amber-400/30">
                ⚡ {trainingScore}% Trained
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-0.5">
              Answer 5 quick operational questions to train your AI Co-Pilot for better advice.
            </p>
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {questions.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentStep(idx)}
              className={cn(
                "h-2.5 rounded-full transition-all cursor-pointer",
                currentStep === idx
                  ? "w-7 bg-amber-400"
                  : idx < currentStep
                    ? "w-2.5 bg-emerald-400"
                    : "w-2.5 bg-purple-900",
              )}
              title={`Question ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Main Question Display Box */}
      <div className="mt-6 rounded-2xl border border-purple-800/70 bg-purple-900/30 p-5 backdrop-blur-xs">
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-purple-500/30 text-purple-300 mt-0.5">
            <Icon size={18} />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300">
              Question {currentStep + 1} of {questions.length}
            </span>
            <h4 className="text-sm font-extrabold text-white mt-0.5">{q.title}</h4>
            <p className="text-xs text-purple-200/80 mt-1">{q.subtitle}</p>
          </div>
        </div>

        {/* Options Chips Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt) => {
            const isSelected = q.current === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => q.setter(opt.val)}
                className={cn(
                  "flex items-center justify-between rounded-xl border p-3 text-left text-xs font-bold transition cursor-pointer",
                  isSelected
                    ? "border-amber-400 bg-amber-400/15 text-amber-200 shadow-md shadow-amber-400/10"
                    : "border-purple-800/80 bg-slate-900/60 text-slate-300 hover:border-purple-500 hover:bg-purple-900/40",
                )}
              >
                <span>{opt.label}</span>
                {isSelected && <CheckCircle2 size={16} className="text-amber-300 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trained Summary Tags Bar */}
      <div className="mt-5 pt-4 border-t border-purple-800/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-xs text-purple-300 font-bold mr-1">Trained Context:</span>
          {premisesType && (
            <span className="rounded-lg bg-purple-900/80 border border-purple-700/60 px-2 py-0.5 text-purple-200">
              🏬 {premisesType}
            </span>
          )}
          {monthlyGoal && (
            <span className="rounded-lg bg-purple-900/80 border border-purple-700/60 px-2 py-0.5 text-emerald-300">
              🎯 {monthlyGoal}
            </span>
          )}
          {mainChallenge && (
            <span className="rounded-lg bg-purple-900/80 border border-purple-700/60 px-2 py-0.5 text-amber-300">
              ⚠️ {mainChallenge}
            </span>
          )}
        </div>

        {/* Navigation & Save Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="rounded-xl border border-purple-700 bg-purple-950/80 px-3 py-2 text-xs font-bold text-purple-200 hover:bg-purple-900 transition cursor-pointer"
            >
              Previous
            </button>
          )}

          {currentStep < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="flex items-center gap-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold px-4 py-2 transition cursor-pointer shadow-md"
            >
              <span>Next Question</span>
              <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveTraining}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black px-5 py-2 transition cursor-pointer shadow-lg shadow-amber-400/20"
            >
              <Sparkles size={15} />
              <span>{isSaving ? "Saving to Database..." : "Save Answers & Train AI"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
