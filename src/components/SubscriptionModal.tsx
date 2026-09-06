import React, { useState } from "react";
import {
  Crown,
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  X,
  FileText,
  TrendingUp,
  Building2,
  Package,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { UserRecord, saveUserRecord } from "@/lib/db";
import { cn } from "@/lib/utils";

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  profile: UserRecord;
  onProfileUpdate: (updated: UserRecord) => void;
}

export function SubscriptionModal({
  open,
  onClose,
  profile,
  onProfileUpdate,
}: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"Monthly" | "Quarterly" | "Yearly">("Yearly");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!open) return null;

  const isSubscribed = profile.isPlusSubscriber ?? false;
  const currentPlan = profile.subscriptionPlan || "Free";

  const plans = [
    {
      id: "Monthly" as const,
      name: "1 Month Plan",
      price: 59,
      durationLabel: "/ month",
      savings: null,
      badge: "Flexible",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
      description: "Great for testing premium tools and creating your initial business plan.",
    },
    {
      id: "Quarterly" as const,
      name: "3 Months Plan",
      price: 149,
      durationLabel: "/ 3 months",
      pricePerMonth: "₹49.6/mo",
      savings: "Save 15%",
      badge: "Popular",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
      description:
        "Perfect for active shop setup, loan applications, and initial supplier sourcing.",
    },
    {
      id: "Yearly" as const,
      name: "1 Year Plan",
      price: 399,
      durationLabel: "/ year",
      pricePerMonth: "₹33.2/mo",
      savings: "🔥 Save 44%",
      badge: "BEST VALUE",
      badgeColor: "bg-amber-400 text-slate-950 font-black border-amber-300 shadow-sm",
      description:
        "Complete year-round business co-pilot, bank project reports & daily profit ledger.",
    },
  ];

  const features = [
    {
      icon: FileText,
      title: "1-Click Bank DPR Project Report Generator",
      desc: "Instant official project reports formatted for PM MUDRA & PMEGP loan approvals with downloadable PDF.",
    },
    {
      icon: TrendingUp,
      title: "Daily Profit & Expense Cashbook Ledger",
      desc: "Track daily shop sales, itemized expenses, cash vs UPI balance, and real-time net margin alerts.",
    },
    {
      icon: Package,
      title: "APMC Mandi & Direct Sourcing Directory",
      desc: "Access verified wholesale suppliers, regional mandis, and bulk pricing benchmarks near your district.",
    },
    {
      icon: Building2,
      title: "Competitor & Footfall Risk Heatmap",
      desc: "Local customer traffic analysis, peak operating hours, and competitor density intelligence.",
    },
    {
      icon: Zap,
      title: "Priority 24/7 AI Co-Pilot & WhatsApp Export",
      desc: "Zero waiting time AI advisory + instant 1-click export of business plans & reports to WhatsApp.",
    },
  ];

  async function handleActivateSubscription(planId: "Monthly" | "Quarterly" | "Yearly") {
    setIsProcessing(true);
    const planObj = plans.find((p) => p.id === planId)!;

    const startDate = new Date();
    const expiryDate = new Date();
    if (planId === "Monthly") expiryDate.setMonth(expiryDate.getMonth() + 1);
    if (planId === "Quarterly") expiryDate.setMonth(expiryDate.getMonth() + 3);
    if (planId === "Yearly") expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const updatedProfile: UserRecord = {
      ...profile,
      isPlusSubscriber: true,
      subscriptionPlan: planId,
      subscriptionPrice: planObj.price,
      subscriptionStartDate: startDate.toISOString(),
      subscriptionExpiryDate: expiryDate.toISOString(),
    };

    try {
      await saveUserRecord(updatedProfile);
      onProfileUpdate(updatedProfile);
      toast.success(`🎉 Subscribed to Vyapar-Mitra Plus (${planObj.name})!`, {
        description: `Your subscription is active until ${expiryDate.toLocaleDateString("en-IN")}. All premium business management tools are unlocked!`,
      });
      onClose();
    } catch (err) {
      toast.error("Failed to activate subscription. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleCancelSubscription() {
    setIsProcessing(true);
    const updatedProfile: UserRecord = {
      ...profile,
      isPlusSubscriber: false,
      subscriptionPlan: "Free",
      subscriptionPrice: 0,
    };

    try {
      await saveUserRecord(updatedProfile);
      onProfileUpdate(updatedProfile);
      toast.info("Subscription cancelled. Returned to Free tier.");
    } catch (err) {
      toast.error("Failed to update subscription status.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200">
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-950 via-purple-950 to-indigo-950 text-white p-6 rounded-t-3xl border-b border-purple-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20">
              <Crown size={24} className="fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white">Vyapar-Mitra Plus</h2>
                {isSubscribed && (
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-black uppercase">
                    Active Plan: {currentPlan}
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-200 mt-0.5">
                Unlock Complete AI Business Management, Bank DPR Reports & Cashbook Ledger
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-8">
          {/* Active Subscription Status Banner if Subscribed */}
          {isSubscribed && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-emerald-600 text-white">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-950">
                    You are a Vyapar-Mitra Plus Member ({profile.subscriptionPlan} Plan)
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium">
                    Valid until:{" "}
                    {profile.subscriptionExpiryDate
                      ? new Date(profile.subscriptionExpiryDate).toLocaleDateString("en-IN")
                      : "Active"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelSubscription}
                disabled={isProcessing}
                className="text-xs font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer"
              >
                Switch to Free Tier
              </button>
            </div>
          )}

          {/* Pricing Plans Grid */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              Select Subscription Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((p) => {
                const isSelected = selectedPlan === p.id;
                const isCurrentActive = isSubscribed && currentPlan === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={cn(
                      "relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between",
                      isSelected
                        ? "border-purple-600 bg-purple-50/40 shadow-lg shadow-purple-600/10 scale-[1.02]"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60",
                    )}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border",
                          p.badgeColor,
                        )}
                      >
                        {p.badge}
                      </span>
                      {p.savings && (
                        <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                          {p.savings}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{p.name}</h4>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-950">₹{p.price}</span>
                        <span className="text-xs font-bold text-slate-500">{p.durationLabel}</span>
                      </div>
                      {p.pricePerMonth && (
                        <p className="text-[11px] font-bold text-purple-700 mt-0.5">
                          Effective: {p.pricePerMonth}
                        </p>
                      )}
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.description}</p>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivateSubscription(p.id);
                      }}
                      className={cn(
                        "mt-5 w-full rounded-xl py-2.5 text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md",
                        isCurrentActive
                          ? "bg-emerald-600 text-white cursor-default"
                          : p.id === "Yearly"
                            ? "bg-slate-950 text-white hover:bg-slate-800"
                            : "bg-purple-600 text-white hover:bg-purple-700",
                      )}
                    >
                      {isCurrentActive ? (
                        <>
                          <Check size={14} /> Active Plan
                        </>
                      ) : (
                        <>
                          <Zap size={14} className="fill-current text-amber-300" />
                          <span>Subscribe for ₹{p.price}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Premium Features Included */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
              What You Get in Vyapar-Mitra Plus
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3.5"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
                    <f.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-950">{f.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee Footer */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} className="text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white">Instant UPI & Card Activation</p>
                <p className="text-[11px] text-slate-400">
                  Cancel or change your plan anytime from your dashboard.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleActivateSubscription(selectedPlan)}
              disabled={isProcessing}
              className="shrink-0 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2.5 text-xs font-black text-slate-950 hover:scale-105 transition cursor-pointer"
            >
              Get Plus Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
