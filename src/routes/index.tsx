import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  ChevronRight,
  CircleGauge,
  FileCheck2,
  Gauge,
  LayoutDashboard,
  Lightbulb,
  MapPin,
  Menu,
  Mic,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vyapar-Mitra | AI Business Advisor" },
      { name: "description", content: "Business viability, cashflow insights, and government scheme guidance for Indian entrepreneurs." },
      { property: "og:title", content: "Vyapar-Mitra | AI Business Advisor" },
      { property: "og:description", content: "Make confident business decisions with locally relevant AI insights." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Idea Validator", icon: Lightbulb },
  { label: "Feasibility Engine", icon: CircleGauge },
  { label: "Schemes", icon: FileCheck2 },
  { label: "Settings", icon: Settings },
];

const months = [
  { name: "Oct", income: 54, expense: 36 },
  { name: "Nov", income: 66, expense: 42 },
  { name: "Dec", income: 60, expense: 46 },
  { name: "Jan", income: 76, expense: 49 },
  { name: "Feb", income: 84, expense: 53 },
  { name: "Mar", income: 94, expense: 57 },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && <button aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-foreground/25 lg:hidden" onClick={onClose} />}
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-border bg-card p-5 transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="mb-9 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-1">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-positive text-positive-foreground"><TrendingUp size={21} strokeWidth={2.5} /></div>
            <span className="truncate text-lg font-extrabold">Vyapar-Mitra</span>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Close menu" onClick={onClose}><X size={20} /></Button>
        </div>
        <nav className="space-y-1.5" aria-label="Main navigation">
          {navItems.map((item) => <Button key={item.label} variant={item.active ? "default" : "ghost"} className="h-11 w-full justify-start px-3" onClick={onClose}><item.icon size={19} /><span>{item.label}</span>{item.active && <ChevronRight className="ml-auto" size={17} />}</Button>)}
        </nav>
        <div className="mt-auto rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-card">
          <div className="mb-3 grid size-9 place-items-center rounded-lg bg-positive text-positive-foreground"><Sparkles size={18} /></div>
          <p className="font-bold">AI Business Assistant</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Get 24/7 free data-driven guidance for your local business.</p>
          <Button variant="lime" className="mt-4 w-full">Get Free Advice</Button>
        </div>
      </aside>
    </>
  );
}

function CardTitle({ children, detail }: { children: React.ReactNode; detail?: string }) {
  return <div className="flex items-center justify-between gap-3"><h2 className="text-base font-bold">{children}</h2>{detail && <span className="text-xs font-medium text-muted-foreground">{detail}</span>}</div>;
}

function CashflowChart() {
  return <div className="mt-6">
    <div className="mb-5 flex items-center gap-5 text-xs font-medium text-muted-foreground"><span className="flex items-center gap-2"><i className="size-2.5 rounded-full bg-chart-income" />Income</span><span className="flex items-center gap-2"><i className="size-2.5 rounded-full bg-chart-expense" />Expenses</span></div>
    <div className="relative h-44 border-b border-border">
      <div className="absolute inset-0 flex flex-col justify-between"><i className="border-t border-dashed border-border" /><i className="border-t border-dashed border-border" /><i className="border-t border-dashed border-border" /><i /></div>
      <div className="absolute inset-0 flex items-end justify-around gap-3 px-1">
        {months.map((month) => <div key={month.name} className="flex h-full flex-1 items-end justify-center gap-1.5"><div className="w-full max-w-5 rounded-t-md bg-chart-income" style={{ height: `${month.income}%` }} /><div className="w-full max-w-5 rounded-t-md bg-chart-expense" style={{ height: `${month.expense}%` }} /></div>)}
      </div>
    </div>
    <div className="mt-3 flex justify-around text-[11px] font-medium text-muted-foreground">{months.map((month) => <span key={month.name}>{month.name}</span>)}</div>
  </div>;
}

function AiAssistant() {
  const [messages, setMessages] = useState([
    { from: "user", text: "Is a snack shop viable in Pune?" },
    { from: "ai", text: "Yes, you have high demand and only 3 competitors nearby." },
  ]);
  const [input, setInput] = useState("");
  function send(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    setMessages((current) => [...current, { from: "user", text: value }, { from: "ai", text: "I’ll assess local demand, competition, and expected costs for you." }]);
    setInput("");
  }
  return <section className="dashboard-card flex min-h-[440px] flex-col overflow-hidden p-6 lg:row-span-2">
    <div className="flex items-center gap-3 border-b border-border pb-5"><div className="grid size-10 place-items-center rounded-xl bg-positive text-positive-foreground"><Bot size={21} /></div><div><h2 className="font-bold">Vyapar AI Assistant</h2><p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground"><i className="size-2 rounded-full bg-positive" />Online · ready to help</p></div></div>
    <div className="flex flex-1 flex-col justify-end gap-4 py-6">
      {messages.map((message, index) => <div key={`${message.from}-${index}`} className={cn("max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6", message.from === "user" ? "ml-auto rounded-br-md bg-foreground text-background" : "rounded-bl-md bg-muted text-foreground")}>
        {message.from === "ai" && <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-positive-foreground"><Sparkles size={13} className="text-positive" />VYAPAR AI</div>}{message.text}
      </div>)}
    </div>
    <form className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-border bg-background p-2" onSubmit={send}>
      <Button type="button" variant="ghost" size="icon" aria-label="Use voice search"><Mic size={18} /></Button>
      <input value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Ask your business question..." aria-label="Ask Vyapar AI" />
      <Button size="icon" variant="dark" aria-label="Send message"><Send size={17} /></Button>
    </form>
  </section>;
}

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  return <div className="min-h-screen bg-background text-foreground">
    <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
    <div className="lg:pl-[250px]">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={20} /></Button>
          <label className="relative min-w-0 lg:max-w-xl"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} /><input className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-ring" placeholder="Search business ideas or districts..." /></label>
          <div className="flex items-center gap-3">
            <div className="hidden items-center rounded-xl border border-border bg-card p-1 md:flex">{["English", "हिंदी", "मराठी"].map((item) => <Button key={item} variant={language === item ? "default" : "ghost"} size="sm" onClick={() => setLanguage(item)}>{item}</Button>)}</div>
            <div className="flex items-center gap-2.5"><div className="grid size-10 shrink-0 place-items-center rounded-full bg-warning text-sm font-bold text-warning-foreground">RK</div><div className="hidden sm:block"><p className="text-sm font-bold">Ramesh K.</p><p className="text-xs text-muted-foreground">Pune, MH</p></div></div>
          </div>
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-7"><p className="text-sm font-semibold text-positive-foreground">Friday, 4 September</p><h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Namaste, Ramesh</h1><p className="mt-1 text-sm text-muted-foreground">Here’s how your business plan is shaping up.</p></div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="dashboard-card p-6 lg:col-span-8"><CardTitle detail="Shivajinagar, Pune">Market Insights</CardTitle><div className="mt-6 grid gap-5 sm:grid-cols-3">{marketMetrics.map((metric) => <div key={metric.label} className="rounded-xl border border-border bg-background p-5"><div className={cn("mb-3 grid size-10 place-items-center rounded-xl", metric.tone)}><metric.icon size={20} /></div><p className="text-xs font-medium text-muted-foreground">{metric.label}</p><p className="mt-1.5 text-2xl font-extrabold">{metric.value}</p><p className="mt-1 text-xs text-muted-foreground">{metric.note}</p></div>)}</div><div className="mt-6 space-y-4">{demandBars.map((bar) => <div key={bar.label}><div className="flex items-center justify-between text-sm font-medium"><span>{bar.label}</span><span className="text-muted-foreground">{bar.value}%</span></div><div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-positive" style={{ width: `${bar.value}%` }} /></div></div>)}</div></section>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            <section className="dashboard-card p-6"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-muted-foreground">Est. Break-Even</p><p className="mt-2 text-3xl font-extrabold">4.2 <span className="text-lg">Months</span></p><p className="mt-2 text-xs font-semibold text-positive-foreground">2 weeks earlier than average</p></div><div className="grid size-11 place-items-center rounded-xl bg-positive/15 text-positive-foreground"><Gauge size={22} /></div></div></section>
            <section className="dashboard-card p-6"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-muted-foreground">Local Risk</p><p className="mt-2 text-3xl font-extrabold">Low</p><p className="mt-2 text-xs text-muted-foreground">Shivajinagar, Pune</p></div><div className="grid size-11 place-items-center rounded-xl bg-warning/20 text-warning-foreground"><MapPin size={22} /></div></div></section>
          </div>
          <section className="dashboard-card p-6 lg:col-span-4"><CardTitle detail="₹50,000">Capital Allocation</CardTitle><p className="mt-2 text-xs text-muted-foreground">Suggested launch budget</p><div className="mt-7 flex h-3 overflow-hidden rounded-full bg-muted"><span className="w-[50%] bg-foreground" /><span className="w-[30%] bg-positive" /><span className="w-[20%] bg-warning" /></div><div className="mt-6 space-y-4">{[["Inventory", "₹25,000", "bg-foreground"], ["Rent", "₹15,000", "bg-positive"], ["Marketing", "₹10,000", "bg-warning"]].map(([name, amount, color]) => <div key={name} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2.5 font-medium"><i className={cn("size-2.5 rounded-full", color)} />{name}</span><strong>{amount}</strong></div>)}</div></section>
          <section className="dashboard-card p-6 lg:col-span-4"><CardTitle detail="Strong">Business Viability</CardTitle><div className="mt-5 flex flex-col items-center"><div className="relative h-28 w-56 overflow-hidden"><div className="absolute left-0 top-0 h-56 w-56 rounded-full bg-muted" /><div className="absolute left-0 top-0 h-56 w-56 rounded-full" style={{ background: "conic-gradient(var(--color-positive) 0deg 148deg, transparent 148deg 180deg, transparent 180deg)" }} /><div className="absolute left-7 top-7 h-44 w-44 rounded-full bg-card" /></div><div className="-mt-11 text-center"><p className="text-4xl font-extrabold">82<span className="text-xl text-muted-foreground">%</span></p><p className="mt-1 text-xs text-muted-foreground">Viability score</p></div><div className="mt-8 flex items-center gap-2 rounded-lg bg-positive/15 px-3 py-2 text-xs font-semibold text-positive-foreground"><ShieldCheck size={16} />Recommended to proceed</div></div></section>
          <AiAssistant />
          <section className="dashboard-card p-6 lg:col-span-8"><CardTitle detail="2 matches">Matched Government Schemes</CardTitle><div className="mt-5 divide-y divide-border">{[["PM MUDRA Yojana", "Collateral-free loans up to ₹10 lakh", WalletCards], ["MSME Credit Guarantee", "Credit support for micro enterprises", ShieldCheck]].map(([name, detail, Icon]) => { const SchemeIcon = Icon as typeof WalletCards; return <div key={name as string} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-4 first:pt-0 last:pb-0"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted"><SchemeIcon size={19} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-bold">{name as string}</h3><span className="rounded-full bg-positive/15 px-2 py-0.5 text-[10px] font-bold text-positive-foreground">Eligible</span></div><p className="mt-1 truncate text-xs text-muted-foreground">{detail as string}</p></div><Button variant="outline" size="sm">Apply <ChevronRight size={14} /></Button></div>; })}</div></section>
          <section className="dashboard-card p-6 lg:col-span-5"><CardTitle detail={`${done}/${actions.length} done`}>Action Plan</CardTitle><p className="mt-2 text-xs text-muted-foreground">Next steps to launch your shop</p><div className="mt-5 space-y-3">{actions.map((action, index) => <button key={action.title} type="button" onClick={() => toggleAction(index)} className={cn("flex w-full items-start gap-3 rounded-xl border p-4 text-left transition", action.done ? "border-positive/40 bg-positive/10" : "border-border bg-background hover:border-foreground/25")}><span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border", action.done ? "border-positive bg-positive text-positive-foreground" : "border-border")}>{action.done && <Check size={13} strokeWidth={3} />}</span><span className="min-w-0"><span className={cn("block text-sm font-semibold", action.done && "line-through opacity-70")}>{action.title}</span><span className="mt-0.5 block text-xs text-muted-foreground">{action.meta}</span></span></button>)}</div></section>
          <section className="dashboard-card p-6 lg:col-span-7"><CardTitle detail="Shivajinagar, Pune">Location Analysis</CardTitle><div className="mt-6 grid gap-5 sm:grid-cols-2">{locationStats.map((stat) => <div key={stat.label} className="rounded-xl border border-border bg-background p-5"><p className="text-xs font-medium text-muted-foreground">{stat.label}</p><p className="mt-1.5 text-xl font-extrabold">{stat.value}</p><p className={cn("mt-1 text-xs font-semibold", stat.good ? "text-positive-foreground" : "text-warning-foreground")}>{stat.note}</p></div>)}</div><div className="mt-6 flex items-start gap-3 rounded-xl bg-muted p-4 text-sm leading-6"><MapPin size={18} className="mt-0.5 shrink-0 text-positive-foreground" />Peak footfall is between 5–9 PM near the college gate — plan evening stock and staffing accordingly.</div></section>
        </div>
      </main>
    </div>
  </div>;
}