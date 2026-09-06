import React, { useState } from "react";
import {
  Crown,
  FileText,
  TrendingUp,
  Package,
  Building2,
  Printer,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  DollarSign,
  Calendar,
  Sparkles,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { UserRecord } from "@/lib/db";
import { cn, parseCapitalNumber } from "@/lib/utils";

interface PlusBusinessDashboardProps {
  profile: UserRecord;
  onOpenSubscriptionModal: () => void;
}

export function PlusBusinessDashboard({
  profile,
  onOpenSubscriptionModal,
}: PlusBusinessDashboardProps) {
  const [activeTab, setActiveTab] = useState<"dpr" | "ledger" | "mandi" | "footfall">("dpr");

  const isSubscribed = profile.isPlusSubscriber ?? false;
  const capitalNum = parseCapitalNumber(profile.capital);
  const formattedCap = capitalNum.toLocaleString("en-IN");
  const bizName = profile.idea || "Micro Business";
  const loc = profile.location || "Tier-2/3 Market";

  // Daily Ledger State (Simulated Cashbook Entries)
  const [entries, setEntries] = useState<
    Array<{ id: string; type: "income" | "expense"; desc: string; amount: number; time: string }>
  >([
    {
      id: "1",
      type: "income",
      desc: "Daily Shop Sales (UPI + Cash)",
      amount: 3450,
      time: "11:30 AM",
    },
    {
      id: "2",
      type: "expense",
      desc: "Wholesale Inventory Stock Sourcing",
      amount: 1800,
      time: "09:15 AM",
    },
    { id: "3", type: "income", desc: "Bulky Accessories Order", amount: 1200, time: "02:45 PM" },
    {
      id: "4",
      type: "expense",
      desc: "Shop Electricity & Transport Bill",
      amount: 350,
      time: "04:10 PM",
    },
  ]);

  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState<"income" | "expense">("income");

  const totalIncome = entries
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = entries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpense;

  function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!newDesc.trim() || !newAmount || isNaN(Number(newAmount))) {
      toast.error("Please enter a valid description and numeric amount.");
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      type: newType,
      desc: newDesc.trim(),
      amount: Number(newAmount),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setEntries([newEntry, ...entries]);
    setNewDesc("");
    setNewAmount("");
    toast.success(`Entry added: ${newType === "income" ? "+₹" : "-₹"}${newAmount}`);
  }

  function handleDeleteEntry(id: string) {
    setEntries(entries.filter((e) => e.id !== id));
    toast.info("Ledger entry removed.");
  }

  function handlePrintDpr() {
    window.print();
  }

  function handleExportWhatsApp() {
    const text = `*Vyapar-Mitra Plus Bank DPR Summary*\n\nApplicant: ${profile.fullName || "Entrepreneur"}\nBusiness: ${bizName} (${profile.categoryName || "Retail"})\nLocation: ${loc}\nProposed Project Cost: ₹${formattedCap}\nTarget Net Monthly Margin: 35% - 48%\n\nGenerated via Vyapar-Mitra Plus Co-Pilot.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="space-y-6">
      {/* Plus Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-purple-950 to-indigo-950 p-6 text-white shadow-xl border border-purple-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20">
              <Crown size={26} className="fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Vyapar-Mitra Plus Dashboard</h2>
                {isSubscribed ? (
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-0.5 text-[11px] font-black uppercase">
                    PRO MEMBER ({profile.subscriptionPlan})
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-0.5 text-[11px] font-black uppercase">
                    PREVIEW MODE
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-200 mt-1">
                Advanced AI Business Management: Bank Project Reports, Daily Profit Ledger &
                Wholesale Sourcing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSubscribed ? (
              <button
                onClick={onOpenSubscriptionModal}
                className="rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-5 py-3 text-xs font-black text-slate-950 shadow-lg shadow-amber-400/20 hover:scale-105 transition cursor-pointer flex items-center gap-2"
              >
                <Zap size={16} className="fill-slate-950" />
                <span>Get Plus Subscription (₹59/mo)</span>
              </button>
            ) : (
              <button
                onClick={onOpenSubscriptionModal}
                className="rounded-2xl border border-purple-400/40 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
              >
                Manage Subscription
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Plus Dashboard Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200">
        {[
          { id: "dpr", label: "📄 Bank DPR Project Report", icon: FileText },
          { id: "ledger", label: "💵 Daily Profit & Cashbook", icon: TrendingUp },
          { id: "mandi", label: "📦 Wholesale Mandi Directory", icon: Package },
          { id: "footfall", label: "📈 Local Footfall Analytics", icon: Building2 },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={cn(
              "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer shrink-0 border",
              activeTab === t.id
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900",
            )}
          >
            <t.icon size={15} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: BANK DPR PROJECT REPORT GENERATOR */}
      {activeTab === "dpr" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-base font-black text-slate-950">
                Official Bank DPR (Detailed Project Report)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Formatted for PM MUDRA & PMEGP loan application submissions at nationalized banks.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintDpr}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Printer size={14} />
                <span>Print / Download PDF</span>
              </button>
              <button
                onClick={handleExportWhatsApp}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Share2 size={14} />
                <span>Export to WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Printable Official DPR Document Preview */}
          <div className="p-8 bg-white rounded-3xl border border-slate-300 shadow-md text-slate-900 space-y-6 font-sans">
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black uppercase text-slate-950">
                  DETAILED PROJECT REPORT (DPR) FOR BANK CREDIT
                </h2>
                <p className="text-xs text-slate-600 font-semibold">
                  Under PM MUDRA Yojana / PMEGP Credit Subsidy Scheme
                </p>
              </div>
              <span className="rounded-md bg-slate-900 text-white px-3 py-1 text-xs font-black">
                CONFIDENTIAL BANK DOC
              </span>
            </div>

            {/* Applicant Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Applicant Name
                </span>
                <span className="font-extrabold text-slate-900">
                  {profile.fullName || "Entrepreneur"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Proposed Enterprise
                </span>
                <span className="font-extrabold text-slate-900">{bizName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Target District / Location
                </span>
                <span className="font-extrabold text-slate-900">{loc}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Total Project Cost
                </span>
                <span className="font-extrabold text-purple-700">₹{formattedCap}</span>
              </div>
            </div>

            {/* Financial Means & Uses Table */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                1. Means of Finance & Capital Requirement Breakdown
              </h4>
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 font-extrabold text-slate-900">
                    <th className="p-2.5 border border-slate-200">Head of Expenditure</th>
                    <th className="p-2.5 border border-slate-200 text-right">Amount (₹)</th>
                    <th className="p-2.5 border border-slate-200">Remarks / Supplier Note</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2.5 border border-slate-200 font-semibold">
                      Initial Inventory Stock
                    </td>
                    <td className="p-2.5 border border-slate-200 text-right font-bold">
                      ₹{Math.round(capitalNum * 0.5).toLocaleString("en-IN")}
                    </td>
                    <td className="p-2.5 border border-slate-200 text-slate-600">
                      Fast-rotating stock (70% core items)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-slate-200 font-semibold">
                      Shop Premises Setup & Deposit
                    </td>
                    <td className="p-2.5 border border-slate-200 text-right font-bold">
                      ₹{Math.round(capitalNum * 0.2).toLocaleString("en-IN")}
                    </td>
                    <td className="p-2.5 border border-slate-200 text-slate-600">
                      Rented Commercial Premises
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-slate-200 font-semibold">
                      Working Capital Reserve
                    </td>
                    <td className="p-2.5 border border-slate-200 text-right font-bold">
                      ₹{Math.round(capitalNum * 0.3).toLocaleString("en-IN")}
                    </td>
                    <td className="p-2.5 border border-slate-200 text-slate-600">
                      Cashflow reserve for 90 days
                    </td>
                  </tr>
                  <tr className="bg-purple-50 font-black">
                    <td className="p-2.5 border border-slate-200 text-purple-950">
                      TOTAL PROPOSED PROJECT BUDGET
                    </td>
                    <td className="p-2.5 border border-slate-200 text-right text-purple-700">
                      ₹{formattedCap}
                    </td>
                    <td className="p-2.5 border border-slate-200 text-purple-950">
                      100% Eligible under MUDRA Shishu/Kishore
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Projected Profitability & Payback */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                2. Operational Viability & Income Projections
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    Expected Gross Margin
                  </span>
                  <span className="text-base font-black text-slate-900">35% to 48%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    Target Daily Sales Volume
                  </span>
                  <span className="text-base font-black text-slate-900">₹2,500 - ₹4,000 / day</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    Estimated Payback Period
                  </span>
                  <span className="text-base font-black text-emerald-600">4.2 Months</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span>Vyapar-Mitra AI Verification ID: VM-DPR-{Date.now().toString().slice(-6)}</span>
              <span>Official MSME Portal Compliant</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DAILY PROFIT & CASHBOOK LEDGER */}
      {activeTab === "ledger" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                Total Daily Income
              </span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">
                +₹{totalIncome.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Recorded today</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                Total Daily Expenses
              </span>
              <span className="text-2xl font-black text-rose-600 mt-1 block">
                -₹{totalExpense.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Stock & bills paid</span>
            </div>

            <div className="p-5 bg-slate-900 text-white rounded-3xl shadow-md border border-slate-800">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                Net Daily Profit
              </span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">
                ₹{netProfit.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-emerald-300 font-bold">
                {netProfit >= 0 ? "Positive Cashflow 🚀" : "Over-spending alert"}
              </span>
            </div>
          </div>

          {/* Add New Entry Form */}
          <form
            onSubmit={handleAddEntry}
            className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3"
          >
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="h-10 rounded-xl bg-slate-100 border border-slate-200 px-3 text-xs font-bold text-slate-800 outline-none"
            >
              <option value="income">🟢 Income (+)</option>
              <option value="expense">🔴 Expense (-)</option>
            </select>

            <input
              type="text"
              placeholder="Description (e.g. UPI sales, Rent, Stock)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="flex-1 h-10 rounded-xl bg-slate-50 border border-slate-200 px-3.5 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-slate-900"
            />

            <input
              type="number"
              placeholder="Amount (₹)"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="w-32 h-10 rounded-xl bg-slate-50 border border-slate-200 px-3 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900"
            />

            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-slate-950 text-white text-xs font-black hover:bg-slate-800 transition cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>Add Entry</span>
            </button>
          </form>

          {/* Entries Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">
                Today's Daily Ledger Log ({entries.length} Transactions)
              </h4>
            </div>

            <div className="divide-y divide-slate-100">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "size-2.5 rounded-full",
                        entry.type === "income" ? "bg-emerald-500" : "bg-rose-500",
                      )}
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{entry.desc}</h5>
                      <span className="text-[10px] text-slate-400 font-medium">{entry.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "text-sm font-black",
                        entry.type === "income" ? "text-emerald-600" : "text-rose-600",
                      )}
                    >
                      {entry.type === "income" ? "+" : "-"}₹{entry.amount.toLocaleString("en-IN")}
                    </span>

                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-1 text-slate-300 hover:text-rose-600 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WHOLESALE MANDI DIRECTORY */}
      {activeTab === "mandi" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-black text-slate-950">
              Verified Wholesale Sourcing Mandis near {loc}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct APMC markets & wholesale distributors offering 8% to 15% discount margins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: `Regional APMC Wholesale Mandi (${loc})`,
                distance: "3.5 km away",
                discount: "12% below retail",
                items: "Fresh Produce, Pulses, Grains, Grocery stock",
                hack: "Visit between 5:30 AM and 8:00 AM for fresh auction prices.",
              },
              {
                name: "District Electronics Wholesale Hub",
                distance: "7.2 km away",
                discount: "20%-35% margin",
                items: "Mobile Chargers, Tempered Glass, Cables, UPI Soundboxes",
                hack: "Buy minimum 10-unit bundles to get trade invoice pricing.",
              },
              {
                name: "Central Textiles & Garment Mandi",
                distance: "12 km away",
                discount: "30% margin",
                items: "Ready-made garments, Cotton wear, Hosiery",
                hack: "Ask for GST tax credit invoice to claim input credit.",
              },
              {
                name: "State FMCG & Packaging Distributor",
                distance: "5.0 km away",
                discount: "8%-10% margin",
                items: "Packaged snacks, beverages, carry bags, billing rolls",
                hack: "Set up weekly auto-delivery to save transport cost.",
              },
            ].map((m, idx) => (
              <div
                key={idx}
                className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-950">{m.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400">{m.distance}</span>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-black">
                    {m.discount}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  • **Key Items**: {m.items}
                </p>

                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-[11px] text-purple-950 font-semibold">
                  💡 **Profit Hack**: {m.hack}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LOCAL FOOTFALL ANALYTICS */}
      {activeTab === "footfall" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-black text-slate-950">
              Customer Footfall & Traffic Analytics ({loc})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Heatmap analysis of customer walk-in hours and competitor density in your district.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 block uppercase">
                Peak Customer Hours
              </span>
              <span className="text-lg font-black text-slate-900 mt-1 block">
                5:30 PM - 8:30 PM
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Highest walk-in density after office & market hours.
              </p>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 block uppercase">
                Competitor Density
              </span>
              <span className="text-lg font-black text-purple-700 mt-1 block">
                Moderate (2-5 shops)
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Good market volume with scope for digital UPI differentiation.
              </p>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 block uppercase">
                UPI Transaction Share
              </span>
              <span className="text-lg font-black text-emerald-600 mt-1 block">72% Digital</span>
              <p className="text-[11px] text-slate-500 mt-1">
                Customers prefer PhonePe/GooglePay QR soundboxes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
