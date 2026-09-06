import React, { useState } from "react";
import {
  Crown,
  MessageSquare,
  Megaphone,
  Package,
  Volume2,
  Plus,
  Trash2,
  CheckCircle2,
  Send,
  Zap,
  Share2,
  Bot,
  ShoppingCart,
  Receipt,
  Smartphone,
  Play,
  Copy,
  Clock,
  Building2,
  Tag,
  Users,
  Check,
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
  const [activeTab, setActiveTab] = useState<
    "whatsapp-bot" | "marketing-bot" | "rfq-dispatcher" | "soundbox-billing"
  >("whatsapp-bot");

  const isSubscribed = profile.isPlusSubscriber ?? false;
  const bizName = profile.idea || "Micro Business";
  const loc = profile.location || "Tier-2/3 Market";

  // --- TAB 1: WHATSAPP BOT ORDER MANAGER STATE ---
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [orders, setOrders] = useState<
    Array<{
      id: string;
      customerName: string;
      phone: string;
      items: string;
      amount: number;
      status: "Pending" | "Accepted" | "Dispatched" | "Delivered";
      time: string;
    }>
  >([
    {
      id: "ORD-9021",
      customerName: "Suresh Kumar",
      phone: "+91 98765 43210",
      items: "2x Grocery Stock Pack, 1x Mustard Oil (1L)",
      amount: 850,
      status: "Pending",
      time: "10 min ago",
    },
    {
      id: "ORD-9020",
      customerName: "Priya Sharma",
      phone: "+91 98123 76543",
      items: "1x Fast-Charging USB-C Cable, 1x Tempered Glass",
      amount: 420,
      status: "Accepted",
      time: "35 min ago",
    },
    {
      id: "ORD-9019",
      customerName: "Ramesh Patel",
      phone: "+91 99887 11223",
      items: "5x Wholesale Cotton Towels",
      amount: 1250,
      status: "Dispatched",
      time: "2 hours ago",
    },
  ]);

  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustItems, setNewCustItems] = useState("");
  const [newCustAmount, setNewCustAmount] = useState("");

  function handleAddOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!newCustName.trim() || !newCustItems.trim() || !newCustAmount) {
      toast.error("Please fill in customer name, items, and total order amount.");
      return;
    }
    const newOrd = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newCustName.trim(),
      phone: newCustPhone.trim() || "+91 98000 00000",
      items: newCustItems.trim(),
      amount: Number(newCustAmount),
      status: "Pending" as const,
      time: "Just now",
    };
    setOrders([newOrd, ...orders]);
    setNewCustName("");
    setNewCustPhone("");
    setNewCustItems("");
    setNewCustAmount("");
    toast.success(`WhatsApp Order ${newOrd.id} created successfully!`);
  }

  function handleUpdateOrderStatus(id: string, status: "Accepted" | "Dispatched" | "Delivered") {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success(`Order ${id} status updated to '${status}'.`);
  }

  function handleShareCatalog() {
    const text = `*${bizName} - Official Digital Catalog & WhatsApp Ordering*\n\nHi! You can order directly via WhatsApp or view our latest product catalog.\nLocation: ${loc}\n\nPowered by Vyapar-Mitra Plus Bot. Reply 'MENU' for instant product list!`;
    navigator.clipboard?.writeText(text);
    toast.success("WhatsApp Digital Catalog text copied to clipboard!");
  }

  // --- TAB 2: MARKETING & FESTIVAL BROADCAST BOT STATE ---
  const festivalTemplates = [
    {
      id: "diwali",
      title: "🪔 Festive Special Offer",
      message: `Greetings from ${bizName}! Celebrate this festive season with exclusive 15% OFF on all items. Show this message at checkout or reply 'ORDER' to get home delivery! Offer valid till Sunday.`,
    },
    {
      id: "clearance",
      title: "⚡ Flash Clearance Sale",
      message: `Special Alert from ${bizName}! Limited stock clearance sale in ${loc}. Buy 2 items & get 1 item FREE today! Reply 'CATALOG' to view items on WhatsApp.`,
    },
    {
      id: "welcome",
      title: "🎁 New Customer Discount",
      message: `Welcome to ${bizName}! Get flat ₹50 OFF on your first purchase above ₹300. Use code VM50 on WhatsApp order or show at store.`,
    },
    {
      id: "weekend",
      title: "🌾 Weekend Super Saver",
      message: `Weekend Savings at ${bizName}! Fresh wholesale stock arriving today. Free home delivery on orders above ₹500. Reply to order now!`,
    },
  ];

  const defaultTemplate = festivalTemplates[0];
  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate.id);
  const [broadcastMsg, setBroadcastMsg] = useState(defaultTemplate.message);
  const [targetAudience, setTargetAudience] = useState("all");

  function handleTemplateSelect(tId: string) {
    const tmpl = festivalTemplates.find((t) => t.id === tId);
    if (tmpl) {
      setSelectedTemplate(tId);
      setBroadcastMsg(tmpl.message.replace(`${bizName}`, profile.idea || "our store"));
    }
  }

  function handleSendBroadcast() {
    if (!broadcastMsg.trim()) {
      toast.error("Please enter a valid message for the WhatsApp broadcast.");
      return;
    }
    const audienceCount = targetAudience === "all" ? 184 : targetAudience === "repeat" ? 62 : 45;
    toast.success(
      `📢 Broadcast successfully queued! WhatsApp Bot is dispatching messages to ${audienceCount} customers.`,
    );
  }

  // --- TAB 3: BULK WHOLESALE MANDI RFQ DISPATCHER STATE ---
  const [rfqItem, setRfqItem] = useState("Bulk Inventory Stock");
  const [rfqQty, setRfqQty] = useState("50 Units");
  const [rfqNotes, setRfqNotes] = useState(
    "Need fast delivery with wholesale trade discount invoice.",
  );
  const [rfqList, setRfqList] = useState([
    {
      id: "RFQ-401",
      item: "50kg Premium Atta & Rice Bags",
      mandi: `Regional APMC Mandi (${loc})`,
      status: "3 Quotes Received",
      bestPrice: "₹1,850 / bag (Save 14%)",
    },
    {
      id: "RFQ-402",
      item: "20x Fast Charging USB-C Cables & Chargers",
      mandi: "District Wholesale Electronics Hub",
      status: "2 Quotes Received",
      bestPrice: "₹85 / unit (Save 25%)",
    },
  ]);

  function handleDispatchRfq(e: React.FormEvent) {
    e.preventDefault();
    if (!rfqItem.trim() || !rfqQty.trim()) {
      toast.error("Please enter required item and quantity.");
      return;
    }
    const newRfq = {
      id: `RFQ-${Math.floor(100 + Math.random() * 900)}`,
      item: `${rfqQty} - ${rfqItem}`,
      mandi: `District Mandi Network (${loc})`,
      status: "Dispatched to 5 Vendors",
      bestPrice: "Awaiting supplier responses...",
    };
    setRfqList([newRfq, ...rfqList]);
    setRfqItem("");
    setRfqQty("");
    toast.success(`RFQ ${newRfq.id} dispatched to 5 wholesale vendors via WhatsApp API!`);
  }

  // --- TAB 4: AUTOMATED UPI SOUNDBOX & SMS BILLING STATE ---
  const [billCustMobile, setBillCustMobile] = useState("");
  const [billItem, setBillItem] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [recentBills, setRecentBills] = useState([
    {
      id: "BILL-701",
      mobile: "+91 98765 12345",
      items: "General Grocery & Snacks",
      amount: 320,
      paymentMethod: "PhonePe UPI",
      time: "12:15 PM",
      status: "SMS Sent",
    },
    {
      id: "BILL-700",
      mobile: "+91 99112 23344",
      items: "Mobile Accessories Kit",
      amount: 650,
      paymentMethod: "GooglePay QR",
      time: "11:40 AM",
      status: "SMS Sent",
    },
  ]);

  function handleGenerateBill(e: React.FormEvent) {
    e.preventDefault();
    if (!billAmount || isNaN(Number(billAmount))) {
      toast.error("Please enter a valid numeric bill amount.");
      return;
    }
    const newBill = {
      id: `BILL-${Math.floor(700 + Math.random() * 300)}`,
      mobile: billCustMobile.trim() || "+91 98000 00000",
      items: billItem.trim() || "Retail Goods Purchase",
      amount: Number(billAmount),
      paymentMethod: "UPI Soundbox QR",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "SMS Sent",
    };
    setRecentBills([newBill, ...recentBills]);
    toast.success(
      `Digital Bill ${newBill.id} generated! Instant SMS receipt dispatched to ${newBill.mobile}.`,
    );
    playAudioSoundbox(Number(billAmount));
    setBillCustMobile("");
    setBillItem("");
    setBillAmount("");
  }

  function playAudioSoundbox(amount: number) {
    if ("speechSynthesis" in window) {
      const text = `Vyapar-Mitra Payment Alert: ${amount} Rupees Received on PhonePe UPI!`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      toast.info(`🔊 Speaker Alert: "₹${amount} Received on PhonePe UPI"`);
    } else {
      toast.info(`🔊 Simulated Speaker: "₹${amount} Received on UPI"`);
    }
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
                Operational Automation Services: WhatsApp Order Bot, Customer Marketing Broadcasts,
                Mandi RFQs & UPI Soundbox Billing
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
                <span>Upgrade to Plus (₹59/mo)</span>
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

      {/* Free Tier Notice Banner */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>
            <strong>Free Business Advisory Included</strong>: AI Advisory, Bank DPR Reports, Unit
            Economics & Govt Loan Schemes are <strong>100% FREE</strong> for all users. Plus
            subscription only powers external messaging & automation.
          </span>
        </div>
      </div>

      {/* Operational Automation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200">
        {[
          { id: "whatsapp-bot", label: "📲 WhatsApp Order Bot", icon: MessageSquare },
          { id: "marketing-bot", label: "📢 Festival Broadcast Bot", icon: Megaphone },
          { id: "rfq-dispatcher", label: "📦 Wholesale Mandi RFQs", icon: Package },
          { id: "soundbox-billing", label: "🔊 UPI Soundbox & SMS Billing", icon: Volume2 },
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

      {/* TAB 1: WHATSAPP BOT ORDER MANAGER */}
      {activeTab === "whatsapp-bot" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                <Bot className="text-emerald-600" size={20} />
                WhatsApp Bot Storefront & Order Manager
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated order collection, instant digital catalog responses, and order status
                updates on WhatsApp.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareCatalog}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Share2 size={14} />
                <span>Share WhatsApp Catalog Text</span>
              </button>
              <button
                onClick={() => {
                  setAutoReplyEnabled(!autoReplyEnabled);
                  toast.info(
                    `WhatsApp Auto-Reply is now ${!autoReplyEnabled ? "ENABLED 🟢" : "DISABLED 🔴"}`,
                  );
                }}
                className={cn(
                  "rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs",
                  autoReplyEnabled
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300",
                )}
              >
                <Zap size={14} />
                <span>{autoReplyEnabled ? "Auto-Reply Active" : "Auto-Reply Off"}</span>
              </button>
            </div>
          </div>

          {/* Quick Create Simulated WhatsApp Order Form */}
          <form
            onSubmit={handleAddOrder}
            className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4"
          >
            <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
              <Plus size={14} className="text-purple-600" />
              Simulate New WhatsApp Customer Order
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Customer Name (e.g. Suresh)"
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 border border-slate-200 px-3 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-slate-900"
              />
              <input
                type="text"
                placeholder="WhatsApp Phone Number"
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 border border-slate-200 px-3 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-slate-900"
              />
              <input
                type="text"
                placeholder="Ordered Items & Quantities"
                value={newCustItems}
                onChange={(e) => setNewCustItems(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 border border-slate-200 px-3 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-slate-900"
              />
              <input
                type="number"
                placeholder="Amount (₹)"
                value={newCustAmount}
                onChange={(e) => setNewCustAmount(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 border border-slate-200 px-3 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send size={14} />
              <span>Add WhatsApp Order</span>
            </button>
          </form>

          {/* Orders Log Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">
                Live WhatsApp Orders Queue ({orders.length})
              </h4>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Connected to WhatsApp Business API
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-950">{ord.id}</span>
                      <span className="text-xs font-bold text-slate-800">• {ord.customerName}</span>
                      <span className="text-[11px] text-slate-400 font-medium">({ord.phone})</span>
                      <span className="text-[10px] text-slate-400 font-medium ml-1">
                        ({ord.time})
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">📦 Items: {ord.items}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-sm font-black text-slate-900">
                      ₹{ord.amount.toLocaleString("en-IN")}
                    </span>

                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase",
                        ord.status === "Pending" && "bg-amber-100 text-amber-800",
                        ord.status === "Accepted" && "bg-blue-100 text-blue-800",
                        ord.status === "Dispatched" && "bg-purple-100 text-purple-800",
                        ord.status === "Delivered" && "bg-emerald-100 text-emerald-800",
                      )}
                    >
                      {ord.status}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {ord.status === "Pending" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, "Accepted")}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition cursor-pointer"
                        >
                          Accept
                        </button>
                      )}
                      {ord.status === "Accepted" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, "Dispatched")}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[11px] font-bold hover:bg-purple-700 transition cursor-pointer"
                        >
                          Dispatch
                        </button>
                      )}
                      {ord.status === "Dispatched" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, "Delivered")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition cursor-pointer"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMER MARKETING & FESTIVAL BROADCAST BOT */}
      {activeTab === "marketing-bot" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
              <Megaphone className="text-purple-600" size={20} />
              Automated Customer Marketing & Festive Broadcast Bot
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Send festive greetings, discount flyers, and promotional offers directly to saved
              WhatsApp contacts in 1-click.
            </p>
          </div>

          {/* Festival & Event Templates Selector */}
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
              Select Festival / Offer Template:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {festivalTemplates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleTemplateSelect(tmpl.id)}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2",
                    selectedTemplate === tmpl.id
                      ? "bg-purple-900 text-white border-purple-900 shadow-md"
                      : "bg-white text-slate-900 border-slate-200 hover:border-purple-300",
                  )}
                >
                  <div>
                    <h5 className="text-xs font-black">{tmpl.title}</h5>
                    <p
                      className={cn(
                        "text-[11px] mt-1 line-clamp-2",
                        selectedTemplate === tmpl.id ? "text-purple-200" : "text-slate-500",
                      )}
                    >
                      {tmpl.message}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-extrabold uppercase",
                      selectedTemplate === tmpl.id ? "text-amber-300" : "text-purple-600",
                    )}
                  >
                    {selectedTemplate === tmpl.id ? "Selected ✓" : "Use Template →"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Broadcast Composer */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">
                Broadcast Message Preview & Target Audience
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Target Audience:</span>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="h-9 rounded-xl bg-slate-100 border border-slate-200 px-3 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="all">All Saved Contacts (184)</option>
                  <option value="repeat">Repeat Buyers (62)</option>
                  <option value="inactive">Dormant (30+ days inactive - 45)</option>
                </select>
              </div>
            </div>

            <textarea
              rows={4}
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-slate-900"
              placeholder="Write custom marketing message..."
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Users size={15} className="text-purple-600" />
                <span>
                  Ready to send to{" "}
                  <strong>
                    {targetAudience === "all" ? 184 : targetAudience === "repeat" ? 62 : 45}
                  </strong>{" "}
                  verified WhatsApp numbers.
                </span>
              </div>
              <button
                onClick={handleSendBroadcast}
                className="h-11 px-6 rounded-2xl bg-purple-900 text-white text-xs font-black hover:bg-purple-800 transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Send size={15} />
                <span>Dispatch Broadcast via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BULK WHOLESALE MANDI RFQ DISPATCHER */}
      {activeTab === "rfq-dispatcher" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
              <Package className="text-amber-600" size={20} />
              Bulk Wholesale Mandi RFQ Dispatcher
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Send single-click bulk price inquiries (RFQ) to regional APMC mandi wholesalers & get
              competitive discount quotes.
            </p>
          </div>

          {/* New RFQ Dispatch Form */}
          <form
            onSubmit={handleDispatchRfq}
            className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4"
          >
            <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
              <Plus size={14} className="text-amber-600" />
              Create New Mandi Wholesale Price RFQ
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Stock Item Required (e.g. Rice, Packaging Boxes, Cable)"
                value={rfqItem}
                onChange={(e) => setRfqItem(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 border border-slate-200 px-3.5 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-slate-900"
              />
              <input
                type="text"
                placeholder="Quantity Required (e.g. 50 kg, 100 units)"
                value={rfqQty}
                onChange={(e) => setRfqQty(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 border border-slate-200 px-3.5 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-slate-900"
              />
              <input
                type="text"
                placeholder="Specific Requirements / Delivery Date"
                value={rfqNotes}
                onChange={(e) => setRfqNotes(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 border border-slate-200 px-3.5 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-slate-900"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send size={14} />
              <span>Dispatch RFQ to 5 Local Mandi Wholesalers</span>
            </button>
          </form>

          {/* Active RFQ Requests Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">
                Wholesale RFQs & Price Comparisons ({rfqList.length})
              </h4>
            </div>

            <div className="divide-y divide-slate-100">
              {rfqList.map((rfq) => (
                <div
                  key={rfq.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-950">{rfq.id}</span>
                      <span className="text-xs font-bold text-slate-800">• {rfq.item}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Mandi Hub: {rfq.mandi}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      🏷️ {rfq.bestPrice}
                    </span>
                    <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
                      {rfq.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUTOMATED UPI SOUNDBOX & SMS BILLING */}
      {activeTab === "soundbox-billing" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
              <Volume2 className="text-blue-600" size={20} />
              Automated UPI Soundbox & Instant SMS Billing Terminal
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate instant digital bill receipts sent via SMS to customer phones, with audio
              speaker transaction notifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick POS Terminal Form */}
            <form
              onSubmit={handleGenerateBill}
              className="md:col-span-2 p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4"
            >
              <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt size={15} className="text-blue-600" />
                Quick Digital Bill Generator
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 mb-1 block">
                    Customer Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={billCustMobile}
                    onChange={(e) => setBillCustMobile(e.target.value)}
                    className="w-full h-10 rounded-xl bg-slate-50 border border-slate-200 px-3 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 mb-1 block">
                    Total Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount (e.g. 250)"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="w-full h-10 rounded-xl bg-slate-50 border border-slate-200 px-3 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 mb-1 block">
                  Items / Note Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2x Snacks, 1x Tea Packet"
                  value={billItem}
                  onChange={(e) => setBillItem(e.target.value)}
                  className="w-full h-10 rounded-xl bg-slate-50 border border-slate-200 px-3.5 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-2xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Smartphone size={15} />
                  <span>Generate & Send SMS Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => playAudioSoundbox(Number(billAmount) || 250)}
                  className="h-11 px-4 rounded-2xl border border-blue-200 bg-blue-50 text-blue-900 text-xs font-bold hover:bg-blue-100 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Play size={14} className="fill-blue-900" />
                  <span>Test Speaker</span>
                </button>
              </div>
            </form>

            {/* Simulated UPI Soundbox Hardware Widget */}
            <div className="p-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl border border-slate-800 shadow-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="text-emerald-400 animate-pulse" size={20} />
                    <h4 className="text-xs font-black uppercase text-white">UPI Soundbox Pro</h4>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 text-[10px] font-black">
                    ONLINE 🟢
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Connected to PhonePe & GooglePay Merchant QR. Instant voice alerts in
                  English/Hindi.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400 text-[10px] font-bold uppercase">
                  <span>Last Voice Alert</span>
                  <span>Just now</span>
                </div>
                <div className="text-emerald-300 font-extrabold text-sm flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  <span>"₹{billAmount || 250} Received on PhonePe UPI"</span>
                </div>
              </div>

              <button
                onClick={() => playAudioSoundbox(Number(billAmount) || 250)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black hover:bg-emerald-400 transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Play size={14} className="fill-slate-950" />
                <span>Play Soundbox Voice Alert</span>
              </button>
            </div>
          </div>

          {/* Recent Digital Receipts Log */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">
                Recent Digital SMS Receipts ({recentBills.length})
              </h4>
            </div>

            <div className="divide-y divide-slate-100">
              {recentBills.map((b) => (
                <div
                  key={b.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-950">{b.id}</span>
                      <span className="text-xs font-bold text-slate-800">• {b.mobile}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({b.time})</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{b.items}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-emerald-600">
                      +₹{b.amount.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
