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
      title: "What is your operating premises type?",
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
      title: "What is your target monthly net profit goal?",
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
      title: "What is your biggest daily business bottleneck?",
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
      title: "How many direct competitors operate within 1-2 km?",
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
      title: "What digital & legal registrations do you have active?",
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

  const q = (questions[currentStep] ?? questions[0])!;
  const Icon = q.icon;

  return (
    <section
      className={cn(
        "dashboard-card p-6 border border-purple-200/80 bg-gradient-to-br from-purple-50/40 via-white to-slate-50 shadow-md flex flex-col justify-between rounded-3xl",
        className,
      )}
    >
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
              <BrainCircuit size={18} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                AI Profile & Operations Trainer
              </h2>
              <p className="text-[11px] text-purple-700 font-bold">
                Answer 5 questions to customize your AI Co-Pilot
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full shrink-0">
            ⚡ {trainingScore}% Trained
          </span>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-1.5 mb-4">
          {questions.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentStep(idx)}
              className={cn(
                "h-2 rounded-full transition-all cursor-pointer",
                currentStep === idx
                  ? "w-6 bg-purple-600"
                  : idx < currentStep
                    ? "w-2 bg-emerald-500"
                    : "w-2 bg-slate-200",
              )}
              title={`Question ${idx + 1}`}
            />
          ))}
        </div>

        {/* Main Question Box */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                Question {currentStep + 1} of {questions.length}
              </span>
            </div>
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 mt-1">
              <Icon size={15} className="text-purple-600 shrink-0" />
              <span>{q.title}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{q.subtitle}</p>
          </div>

          {/* Options Chips Grid */}
          <div className="space-y-2 pt-1">
            {q.options.map((opt) => {
              const isSelected = q.current === opt.val;
              return (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => q.setter(opt.val)}
                  className={cn(
                    "w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-left",
                    isSelected
                      ? "border-purple-500 bg-purple-50 text-purple-900 shadow-xs"
                      : "border-slate-200/90 bg-white text-slate-800 hover:border-purple-300 hover:bg-purple-50/50",
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected ? (
                    <CheckCircle2 size={15} className="text-purple-600 shrink-0" />
                  ) : (
                    <ChevronRight size={14} className="text-slate-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Navigation & Save */}
      <div className="mt-5 pt-3 border-t border-purple-100 flex items-center justify-between gap-2">
        <div className="text-[10px] font-bold text-slate-500 truncate max-w-[50%]">
          {q.current ? (
            <span className="text-emerald-700 font-extrabold flex items-center gap-1">
              <CheckCircle2 size={12} /> {q.current}
            </span>
          ) : (
            "Select an option to train AI"
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Back
            </button>
          )}

          {currentStep < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="flex items-center gap-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold px-3.5 py-1.5 transition cursor-pointer shadow-xs"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveTraining}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 text-white text-xs font-black px-4 py-1.5 transition cursor-pointer shadow-md shadow-purple-500/20 hover:opacity-95"
            >
              <Sparkles size={14} />
              <span>{isSaving ? "Saving..." : "Save & Train AI"}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
