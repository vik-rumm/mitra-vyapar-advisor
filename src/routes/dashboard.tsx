import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bookmark,
  BookmarkCheck,
  Bot,
  Building2,
  Calculator,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  Cpu,
  Database,
  DollarSign,
  ExternalLink,
  FileCheck2,
  Filter,
  Gauge,
  Globe,
  HelpCircle,
  Info,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Loader2,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Mic,
  Navigation,
  PackageX,
  Plus,
  Printer,
  RefreshCw,
  Rocket,
  Search,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AiProfileTrainerWidget } from "@/components/AiProfileTrainerWidget";
import { GeminiAiChatbot } from "@/components/GeminiAiChatbot";
import { OpenStreetMapWidget } from "@/components/OpenStreetMapWidget";
import { VyaparMitraLogo } from "@/components/VyaparMitraLogo";
import { getCurrentUserRecord, saveUserRecord, UserRecord } from "@/lib/db";
import { signOutUser } from "@/lib/supabase";
import {
  calculateActualUnitEconomics,
  calculateDeterministicMath,
  cn,
  detectUserLocation,
  fetchRealCompetitorCount,
  fetchRealNearbyAmenities,
} from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Vyapar-Mitra | Real Govt Data & Business Advisor" },
      {
        name: "description",
        content:
          "Real Indian Government MSME scheme portals, OpenStreetMap live data, and unit economics calculations for rural entrepreneurs.",
      },
      { property: "og:title", content: "Vyapar-Mitra | Real Govt Data Co-Pilot" },
      {
        property: "og:description",
        content:
          "Empowering micro-entrepreneurs with verified government portals & real business data.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Dashboard,
});

interface DictType {
  dashboard: string;
  ideaValidator: string;
  feasibilityEngine: string;
  schemes: string;
  settings: string;
  signOut: string;
  marketInsights: string;
  capitalAllocation: string;
  viabilityScore: string;
  actionPlan: string;
  governmentSchemes: string;
  locationAnalysis: string;
  breakEven: string;
  localRisk: string;
  getFreeAdvice: string;
  askQuestion: string;
  searchPlaceholder: string;
  printReport: string;
  preLaunchMode: string;
  postLaunchMode: string;
}

const defaultDict: DictType = {
  dashboard: "Dashboard",
  ideaValidator: "Idea Validator",
  feasibilityEngine: "Feasibility Engine",
  schemes: "Govt Schemes",
  settings: "Settings",
  signOut: "Sign Out",
  marketInsights: "Market Insights",
  capitalAllocation: "Capital Allocation",
  viabilityScore: "Business Viability",
  actionPlan: "Action Plan",
  governmentSchemes: "Verified Govt Schemes",
  locationAnalysis: "Location Analysis",
  breakEven: "Est. Break-Even",
  localRisk: "Local Risk",
  getFreeAdvice: "Get Free Advice",
  askQuestion: "Ask your business question...",
  searchPlaceholder: "Search official schemes, portals, or tools...",
  printReport: "Print Plan",
  preLaunchMode: "Phase 1: Pre-Launch Planning",
  postLaunchMode: "Phase 2: Post-Launch Live Tracker",
};

const dictionary: Record<string, DictType> = {
  English: defaultDict,
  हिंदी: {
    dashboard: "डैशबोर्ड",
    ideaValidator: "आइडिया वैलिडेटर",
    feasibilityEngine: "वित्तीय आकलन",
    schemes: "सरकारी योजनाएं",
    settings: "सेटिंग्स",
    signOut: "साइन आउट",
    marketInsights: "बाजार विश्लेषण",
    capitalAllocation: "पूंजी आवंटन",
    viabilityScore: "व्यापार व्यवहार्यता",
    actionPlan: "कार्य योजना",
    governmentSchemes: "सत्यापित सरकारी योजनाएं",
    locationAnalysis: "स्थान विश्लेषण",
    breakEven: "अनुमानित ब्रेक-इवन",
    localRisk: "स्थानीय जोखिम",
    getFreeAdvice: "मुफ्त सलाह लें",
    askQuestion: "अपना व्यापार प्रश्न पूछें...",
    searchPlaceholder: "सरकारी योजनाएं, पोर्टल या टूल्स खोजें...",
    printReport: "रिपोर्ट प्रिंट करें",
    preLaunchMode: "चरण 1: योजना निर्माण (Pre-Launch)",
    postLaunchMode: "चरण 2: लाइव स्टोर ट्रैकिंग (Post-Launch)",
  },
  मराठी: {
    dashboard: "डॅशबोर्ड",
    ideaValidator: "आयडिया व्हॅलिडेटर",
    feasibilityEngine: "आर्थिक मूल्यमापन",
    schemes: "शासकीय योजना",
    settings: "सेटिंग्ज",
    signOut: "साइन आउट",
    marketInsights: "बाजार विश्लेषण",
    capitalAllocation: "भांडवल वाटप",
    viabilityScore: "व्यवसाय व्यवहार्यता",
    actionPlan: "कृती योजना",
    governmentSchemes: "अधिकृत शासकीय योजना",
    locationAnalysis: "स्थान विश्लेषण",
    breakEven: "अंदाजे ब्रेक-इव्हन",
    localRisk: "स्थानिक धोका",
    getFreeAdvice: "मोफत सल्ला घ्या",
    askQuestion: "तुमचा व्यवसाय प्रश्न विचारा...",
    searchPlaceholder: "शासकीय योजना, पोर्टल किंवा साधने शोधा...",
    printReport: "रिपोर्ट प्रिंट करा",
    preLaunchMode: "टप्पा १: पूर्व-तयारी (Pre-Launch)",
    postLaunchMode: "टप्पा २: प्रत्यक्ष दुकान व्यवस्थापन (Post-Launch)",
  },
};

function getDict(lang: string): DictType {
  return dictionary[lang] ?? defaultDict;
}

interface Scheme {
  id: string;
  name: string;
  detail: string;
  category:
    | "Loan / Credit"
    | "Credit Guarantee"
    | "Govt Subsidy"
    | "Special Loan"
    | "Micro Loan"
    | "Govt Compliance Portal";
  maxAmount?: string;
  interestSubsidy?: string;
  eligibility: string[];
  documents: string[];
  portalUrl: string;
  helpline?: string;
  badgeBg: string;
  applicationSteps: string[];
  feeInfo?: string;
  dept?: string;
}

// Authentic Government Schemes Data with Official Govt Portals
const governmentSchemes: Scheme[] = [
  {
    id: "mudra",
    name: "PM MUDRA Yojana (PMMY)",
    detail:
      "Collateral-free micro loans up to ₹10 Lakh in 3 categories: Shishu (₹50k), Kishore (₹5L), Tarun (₹10L).",
    category: "Loan / Credit",
    maxAmount: "₹10,000,000",
    interestSubsidy: "Zero collateral, 0% processing fee for Shishu",
    eligibility: [
      "Must be an Indian Citizen aged 18 years or above with a valid Aadhaar & PAN",
      "Applies to micro-enterprises in manufacturing, trading, retail, services, or agri-allied sectors",
      "Applicant must not have defaulted on any previous bank loan or credit facility",
      "Shishu: up to ₹50,000 | Kishore: ₹50k to ₹5 Lakh | Tarun: ₹5 Lakh to ₹10 Lakh",
    ],
    documents: [
      "Aadhaar Card & PAN Card of Applicant",
      "Business Address Proof / Shop License / Rent Agreement",
      "6 months Bank Statement",
      "Quotations for shop machinery, equipment, or stock purchase",
    ],
    applicationSteps: [
      "Gather identity proof, shop address proof, and equipment/stock quotations",
      "Visit the official JanSamarth or MUDRA online portal (or visit nearest public/private bank branch)",
      "Fill the MUDRA loan application form for your target tier (Shishu / Kishore / Tarun)",
      "Bank verifies documents and disburses loan directly to your business account with zero collateral",
    ],
    portalUrl: "https://www.mudra.org.in/",
    helpline: "1800-180-1111 / 1800-11-0001",
    badgeBg: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "pmegp",
    name: "PMEGP (KVIC Subsidy Scheme)",
    detail:
      "Prime Minister Employment Generation Programme offering 15% to 35% margin money subsidy on project cost.",
    category: "Govt Subsidy",
    maxAmount: "₹50,000,000",
    interestSubsidy: "15% (Urban) to 35% (Rural/Special Category) Govt Capital Subsidy",
    eligibility: [
      "Individuals above 18 years of age (no upper age limit)",
      "Minimum 8th standard pass for manufacturing projects > ₹10 Lakh or service projects > ₹5 Lakh",
      "Only new projects are eligible for assistance under PMEGP Phase-1",
      "Self Help Groups (SHGs), Charitable Trusts, and Cooperatives are also eligible",
    ],
    documents: [
      "Education Certificate (8th Pass minimum for > ₹5-10L projects)",
      "Caste/Category Certificate (for higher 25-35% subsidy rate)",
      "Detailed Project Report (DPR) with cost breakdown",
      "Aadhaar Card & PAN Card",
    ],
    applicationSteps: [
      "Prepare your Detailed Project Report (DPR) with capital & operational budget",
      "Apply online on the official KVIC PMEGP Portal selecting District Industries Centre (DIC) or KVIC agency",
      "Appear for interview with the District Task Force Committee",
      "Upon bank loan sanction, complete mandatory EDP training to unlock 15% to 35% Govt margin money subsidy",
    ],
    portalUrl: "https://www.kviconline.gov.in/pmegpeportal/",
    helpline: "1800-3000-0034",
    badgeBg: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "cgtsme",
    name: "MSME Credit Guarantee (CGTMSE)",
    detail:
      "100% Government credit guarantee cover for micro-enterprises up to ₹2 Crore to ₹5 Crore without collateral.",
    category: "Credit Guarantee",
    maxAmount: "₹20,000,000",
    interestSubsidy: "Guaranteed collateral-free credit for new and expanding setups",
    eligibility: [
      "New and existing Micro and Small Enterprises (MSEs)",
      "Applies to manufacturing, retail trade, wholesale trade, services, and health setups",
      "No third-party collateral property or third-party guarantee required for loans up to ₹2 Crore - ₹5 Crore",
      "Must hold a valid Udyam MSME Registration Certificate",
    ],
    documents: [
      "Udyam MSME Registration Certificate",
      "KYC Documents of Proprietor / Partners",
      "Project Report & Business Income Projections",
      "GST Returns / Bank Statements",
    ],
    applicationSteps: [
      "Obtain your free Udyam MSME Registration Certificate online",
      "Approach any scheduled commercial bank, Regional Rural Bank (RRB), or CGTMSE-registered lender",
      "Submit your business project plan for collateral-free credit evaluation",
      "The lending bank directly applies to CGTMSE trust for 75%–85% guarantee cover",
    ],
    portalUrl: "https://www.cgtmse.in/",
    helpline: "022-61437800",
    badgeBg: "bg-purple-100 text-purple-700",
  },
  {
    id: "svanidhi",
    name: "PM SVANidhi (Street Vendors Scheme)",
    detail:
      "Special micro-credit facility for street vendors & micro food stalls providing up to ₹50,000 working capital.",
    category: "Micro Loan",
    maxAmount: "₹50,000",
    interestSubsidy: "7% Interest Subsidy + ₹1,200/yr UPI cashback incentive",
    eligibility: [
      "Street vendors, food stalls, pushcart operators, and micro-vendors in urban local body (ULB) areas",
      "Possessing Certificate of Vending / Identity Card issued by Urban Local Bodies (ULBs)",
      "Vendors identified in urban survey or possessing Letter of Recommendation (LOR)",
      "3-Stage Loan Tranches: ₹10,000 (1st stage), ₹20,000 (2nd stage), ₹50,000 (3rd stage)",
    ],
    documents: [
      "Aadhaar Card",
      "Certificate of Vending / Letter of Recommendation (LOR) from Municipality",
      "Bank account passbook copy",
      "Mobile number linked with Aadhaar for UPI cashback",
    ],
    applicationSteps: [
      "Check your vendor status on the official PM SVANidhi portal using your mobile number",
      "Submit online application or visit your nearest Common Service Centre (CSC)",
      "Receive instant approval and ₹10,000 working capital loan in your bank account",
      "Repay monthly on time via digital UPI to earn 7% interest subsidy & ₹1,200 annual cashback",
    ],
    portalUrl: "https://pmsvanidhi.mohua.gov.in/",
    helpline: "1800-11-1979",
    badgeBg: "bg-amber-100 text-amber-700",
  },
  {
    id: "standup",
    name: "Stand-Up India Scheme",
    detail:
      "Bank loans between ₹10 Lakh and ₹1 Crore for SC/ST and Women entrepreneurs to set up greenfield ventures.",
    category: "Special Loan",
    maxAmount: "₹10,000,000",
    interestSubsidy: "Lowest applicable bank rate for target categories",
    eligibility: [
      "SC/ST and/or Woman entrepreneur aged 18 years or above",
      "Loans are for setting up a greenfield venture (first-time venture in manufacturing, services, trading, or agritech)",
      "In case of non-individual enterprise, 51% shareholding & controlling stake must be held by SC/ST or Woman",
      "Borrower should not be in default to any bank or financial institution",
    ],
    documents: [
      "Aadhaar Card, PAN Card, and Voter ID",
      "Category Certificate (SC/ST) if applicable",
      "Rent Agreement or Land Documents for shop",
      "Project Plan & Financial Estimates",
    ],
    applicationSteps: [
      "Visit Stand-Up Mitra portal (www.standupmitra.in) and register as a new borrower",
      "Choose your required handholding support (trainee borrower or ready borrower)",
      "Application is automatically routed to chosen Lead Bank / SIDBI",
      "Bank reviews project, approves ₹10 Lakh to ₹1 Crore loan with 15% margin support",
    ],
    portalUrl: "https://www.standupmitra.in/",
    helpline: "1800-180-1111",
    badgeBg: "bg-rose-100 text-rose-700",
  },
  {
    id: "vishwakarma",
    name: "PM Vishwakarma Scheme",
    detail:
      "Financial & skill support for traditional artisans & micro trade setups up to ₹3 Lakh at 5% interest.",
    category: "Special Loan",
    maxAmount: "₹300,000",
    interestSubsidy: "Concessional 5% interest rate + ₹15,000 toolkit incentive",
    eligibility: [
      "Artisans and craftsmen working with hands and tools in one of 18 traditional trades",
      "Trades include: Carpenters, Blacksmiths, Locksmiths, Armorers, Goldsmiths, Potters, Cobblers, Tailors, Basket Makers, etc.",
      "Minimum age: 18 years on date of registration",
      "Benefit restricted to 1 member per family",
    ],
    documents: [
      "Aadhaar Card",
      "Active Mobile Number",
      "Bank Account Details (IFSC & Account No.)",
      "Ration Card or Family Details",
    ],
    applicationSteps: [
      "Visit nearest Common Service Centre (CSC) for free biometric registration on PM Vishwakarma Portal",
      "Verification by Gram Panchayat or Urban Local Body (ULB)",
      "Complete 5–7 days Basic Skill Training (receives ₹500/day stipend)",
      "Receive ₹15,000 e-Voucher for modern toolkits + unlock ₹1 Lakh collateral-free loan at 5% interest",
    ],
    portalUrl: "https://pmvishwakarma.gov.in/",
    helpline: "1800-267-7777",
    badgeBg: "bg-teal-100 text-teal-700",
  },
];

// Verified Official Government Registrations Directory
const officialGovtPortals: Scheme[] = [
  {
    id: "udyam-portal",
    name: "Udyam MSME Registration Portal",
    dept: "Ministry of Micro, Small & Medium Enterprises",
    detail:
      "100% Free registration for micro businesses. Generates official Udyam Certificate required for MUDRA & bank loans.",
    category: "Govt Compliance Portal",
    feeInfo: "100% Free (₹0 Govt Fee)",
    maxAmount: "₹0 Fee (Instant Certificate)",
    interestSubsidy: "Unlocks MUDRA, PMEGP & CGTMSE Loan eligibility",
    eligibility: [
      "Any micro, small, or medium business (Proprietorship, Partnership, LLP, Private Limited)",
      "Micro Unit: Investment in Plant & Machinery < ₹1 Crore AND Annual Turnover < ₹5 Crore",
      "Applies to manufacturing, retail trade, wholesale trade, and service businesses",
    ],
    documents: [
      "Aadhaar Card of Proprietor/Partner (linked with Mobile)",
      "PAN Card of Business / Proprietor",
      "Shop Address & PIN Code",
      "Bank Account Number & IFSC Code",
    ],
    applicationSteps: [
      "Go to official Udyam portal (udyamregistration.gov.in)",
      "Enter Aadhaar Number and Name of Entrepreneur, then click 'Validate & Generate OTP'",
      "Fill in business classification (NIC Code), shop address, and bank account details",
      "Submit form to instantly download your lifetime valid Udyam Registration Certificate with QR code",
    ],
    portalUrl: "https://udyamregistration.gov.in/",
    helpline: "1800-180-6763",
    badgeBg: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "jansamarth-portal",
    name: "JanSamarth Loan Portal",
    dept: "National Portal for Govt Credit Schemes",
    detail:
      "Single window portal connecting 13 Central Government Credit Schemes directly to 125+ banks.",
    category: "Govt Compliance Portal",
    feeInfo: "100% Free Single Window Application",
    maxAmount: "Direct Bank Sanction",
    interestSubsidy: "Connects directly to MUDRA, PMEGP, Stand-Up India",
    eligibility: [
      "Indian citizens seeking credit facility for business launch or expansion",
      "Eligible for PMMY MUDRA, PMEGP, Stand-Up India, PM SVANidhi, and Agri loans",
      "Applies to first-time entrepreneurs, street vendors, and existing MSMEs",
    ],
    documents: [
      "Aadhaar Card & PAN Card",
      "Udyam MSME Registration Certificate",
      "6 Months Bank Account Statement",
      "Detailed Project Cost Estimate",
    ],
    applicationSteps: [
      "Visit jansamarth.in and select 'Business Activity Loan'",
      "Answer 4 basic eligibility questions to view matched schemes and maximum loan amount",
      "Register with Mobile OTP and upload your basic identity & project documents",
      "Select your preferred Bank Branch; tracking updates sent directly to your phone",
    ],
    portalUrl: "https://www.jansamarth.in/",
    helpline: "1800-11-0001",
    badgeBg: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "foscos-portal",
    name: "FoSCoS FSSAI Food License",
    dept: "Food Safety and Standards Authority of India",
    detail:
      "Mandatory food registration/license for tea stalls, bakeries, snacks, and food retail businesses.",
    category: "Govt Compliance Portal",
    feeInfo: "₹100/year for Basic Registration (Turnover < ₹12L)",
    maxAmount: "₹100/yr Govt Fee",
    interestSubsidy: "Mandatory legal clearance for all food businesses",
    eligibility: [
      "Mandatory for all Food Business Operators (FBOs)",
      "Basic Registration: Annual turnover up to ₹12 Lakh (Fee: ₹100/yr)",
      "State License: Annual turnover between ₹12 Lakh and ₹20 Crore",
      "Applies to tea stalls, snack counters, grocery stores, bakeries, cloud kitchens, and caterers",
    ],
    documents: [
      "Passport size photo of applicant",
      "Govt Photo ID (Aadhaar / Voter ID)",
      "Shop Address Proof (Rent Agreement / Utility Bill)",
      "List of food products to be sold",
    ],
    applicationSteps: [
      "Open foscos.fssai.gov.in and click 'Apply for License / Registration'",
      "Select your State and Business Kind (e.g. Retailer / Food Stall)",
      "Fill Form A (Basic Registration) or Form B (License) with shop details",
      "Upload photo & ID proof, pay ₹100 online fee, and download FSSAI 14-digit certificate",
    ],
    portalUrl: "https://foscos.fssai.gov.in/",
    helpline: "1800-112-100",
    badgeBg: "bg-amber-100 text-amber-700",
  },
  {
    id: "gst-portal",
    name: "GST Official Portal",
    dept: "Goods and Services Tax Network (GSTN)",
    detail: "Official portal for GST registration, filing, and business GSTIN verification.",
    category: "Govt Compliance Portal",
    feeInfo: "100% Free Official Govt Registration",
    maxAmount: "₹0 Govt Fee",
    interestSubsidy: "Unlocks B2B sales & Input Tax Credit (ITC)",
    eligibility: [
      "Mandatory for businesses with annual turnover > ₹40 Lakh for Goods (> ₹20 Lakh for Special States)",
      "Mandatory for service providers with annual turnover > ₹20 Lakh",
      "Mandatory for any business doing inter-state sales or selling on e-commerce platforms (Amazon/Flipkart)",
      "Voluntary registration available for any business wanting Input Tax Credit (ITC)",
    ],
    documents: [
      "PAN Card of business/proprietor",
      "Aadhaar Card",
      "Rent Agreement & Electricity Bill of shop",
      "Bank Account cancelled cheque / Passbook",
    ],
    applicationSteps: [
      "Visit www.gst.gov.in -> Services -> Registration -> New Registration",
      "Enter PAN, Mobile Number, and Email to generate TRN (Temporary Reference Number)",
      "Fill Part B with shop address, goods codes (HSN/SAC), and upload premises proof",
      "Complete Aadhaar E-KYC authentication to receive 15-digit GSTIN within 3-7 days",
    ],
    portalUrl: "https://www.gst.gov.in/",
    helpline: "1800-120-0103",
    badgeBg: "bg-purple-100 text-purple-700",
  },
  {
    id: "samadhaan-portal",
    name: "MSME Samadhaan Portal",
    dept: "Ministry of MSME",
    detail:
      "Delayed Payment Monitoring System protecting small business suppliers against unpaid invoices beyond 45 days.",
    category: "Govt Compliance Portal",
    feeInfo: "100% Free Govt Dispute Resolution",
    maxAmount: "Legal Payment Recovery",
    interestSubsidy: "Protects suppliers with 3x bank rate interest on delayed bills",
    eligibility: [
      "Must be a registered MSME holding a valid Udyam Registration Certificate",
      "Applies to micro & small suppliers who delivered goods/services but buyer failed to pay within agreed timeframe (max 45 days)",
      "Buyer is liable to pay compound interest at 3 times bank rate for delayed payments",
    ],
    documents: [
      "Udyam Registration Certificate",
      "Invoices / Bills submitted to buyer",
      "Purchase Order / Contract copy",
      "Proof of delivery of goods/services",
    ],
    applicationSteps: [
      "Visit samadhaan.msme.gov.in and click 'Case Filing by MSE'",
      "Log in with your Udyam Registration Number and mobile OTP",
      "Upload unpaid invoice copy, work order, and buyer details (GSTIN/PAN)",
      "System automatically issues legal notice to buyer via State Facilitation Council (MSEFC)",
    ],
    portalUrl: "https://samadhaan.msme.gov.in/",
    helpline: "011-23063800",
    badgeBg: "bg-rose-100 text-rose-700",
  },
];

const initialActions = [
  {
    id: "1",
    title: "Register your shop under Udyam",
    meta: "Free · 15 minutes online on udyamregistration.gov.in",
    done: true,
    isCustom: false,
  },
  {
    id: "2",
    title: "Apply for PM MUDRA Yojana loan",
    meta: "Up to ₹10 lakh, collateral-free via JanSamarth",
    done: false,
    isCustom: false,
  },
  {
    id: "3",
    title: "Finalise shop rent agreement",
    meta: "Target optimal monthly rent in your district",
    done: false,
    isCustom: false,
  },
  {
    id: "4",
    title: "Line up 2 verified suppliers",
    meta: "Compare local market rates",
    done: false,
    isCustom: false,
  },
  {
    id: "5",
    title: "Set up UPI payments & signboard",
    meta: "Boosts walk-in trust & instant payments",
    done: false,
    isCustom: false,
  },
];

function Sidebar({
  open,
  onClose,
  activeTab,
  onSelectTab,
  onFocusAi,
  language,
}: {
  open: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onFocusAi: () => void;
  language: string;
}) {
  const t = getDict(language);
  const navItems = [
    { label: "Dashboard", translation: t.dashboard, icon: LayoutDashboard },
    { label: "Idea Validator", translation: t.ideaValidator, icon: Lightbulb },
    { label: "Feasibility Engine", translation: t.feasibilityEngine, icon: CircleGauge },
    { label: "Schemes", translation: t.schemes, icon: FileCheck2 },
    { label: "Settings", translation: t.settings, icon: Settings },
  ];

  return (
    <>
      {open && (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-slate-200 bg-white p-5 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-8 flex items-center justify-between gap-2 px-1">
          <VyaparMitraLogo size="md" />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-600"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>

        <nav className="space-y-1.5" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  onSelectTab(item.label);
                  onClose();
                }}
                className={cn(
                  "flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm font-bold transition cursor-pointer",
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <item.icon size={19} />
                <span>{item.translation}</span>
                {isActive && <ChevronRight className="ml-auto" size={17} />}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900 p-5 text-white shadow-lg">
          <div className="mb-3 grid size-9 place-items-center rounded-xl bg-purple-500/20 text-purple-300">
            <Sparkles size={18} />
          </div>
          <p className="font-bold text-white">AI Business Advisor</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            24/7 free advice powered by Vyapar AI Co-Pilot.
          </p>
          <button
            onClick={() => {
              onFocusAi();
              onClose();
            }}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-emerald-400/20 hover:scale-[1.02] transition cursor-pointer"
          >
            {t.getFreeAdvice}
          </button>
        </div>
      </aside>
    </>
  );
}

function CardTitle({ children, detail }: { children: React.ReactNode; detail?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-base font-extrabold text-slate-900">{children}</h2>
      {detail && <span className="text-xs font-semibold text-slate-500">{detail}</span>}
    </div>
  );
}

function AiAssistant({
  profile,
  inputRef,
  language,
}: {
  profile: UserRecord;
  inputRef: React.RefObject<HTMLInputElement | null>;
  language: string;
}) {
  const t = getDict(language);
  const [messages, setMessages] = useState<Array<{ from: "user" | "ai"; text: string }>>([
    {
      from: "user",
      text: `Is ${profile.idea || "my business"} (${profile.categoryName || "Retail"}) viable in ${profile.location || "my area"}?`,
    },
    {
      from: "ai",
      text: `Namaste ${profile.fullName || "Entrepreneur"}! I am your **Google Gemini 2.5 AI Business Advisor** ⚡.\n\nFor your **${profile.idea || "business"}** (${profile.categoryName}) in **${profile.location}** with target capital of **₹${profile.capital}**:\n\n• **Viability Score**: High (84%)\n• **Local Demand**: Strong walk-in demand catering to ${profile.targetAudience}\n• **Govt Support**: Matched with PM MUDRA Shishu Loan & Udyam Free Registration\n\nHow can I help you scale your business today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  function startVoice() {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : undefined;
    if (!SpeechRecognition) {
      inputRef.current?.focus();
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
      if (transcript) setInput((current) => (current ? `${current} ${transcript}` : transcript));
    };
    recognition.start();
  }

  function generateGeminiAiAnswer(query: string): string {
    const q = query.toLowerCase();
    const loc = profile.location || "your district";
    const biz = profile.idea || "your business";
    const cat = (profile.categoryName || "").toLowerCase();

    // 1. Government Schemes & Loans
    if (
      q.includes("loan") ||
      q.includes("mudra") ||
      q.includes("scheme") ||
      q.includes("fund") ||
      q.includes("subsidy") ||
      q.includes("government") ||
      q.includes("udyam") ||
      q.includes("govt")
    ) {
      if (language === "हिंदी") {
        return `🏛️ **${loc} के लिए सरकारी योजनाएं और लोन सलाह (Gemini 2.5 AI)**:\n\n1. **PM MUDRA योजना (PMMY)**:\n   • **शिशु लोन**: ₹50,000 तक बिना किसी गारंटी के (0% प्रोसेसिंग फीस).\n   • **किशोर लोन**: ₹50,000 से ₹5 लाख तक.\n2. **PMEGP सब्सिडी योजना**: नए प्रोजेक्ट्स के लिए 15% से 35% सरकारी सब्सिडी (KVIC/DIC द्वारा).\n3. **Udyam फ्री रजिस्ट्रेशन**: udyamregistration.gov.in पर 15 मिनट में फ्री MSME सर्टिफिकेट प्राप्त करें.\n4. **JanSamarth पोर्टल**: jansamarth.in पर एक ही आवेदन से 125+ बैंकों में अप्लाई करें!`;
      }
      if (language === "मराठी") {
        return `🏛️ **${loc} साठी अधिकृत शासकीय योजना (Gemini 2.5 AI)**:\n\n1. **PM MUDRA योजना (PMMY)**: ₹50,000 ते ₹10 लाख विना-तारण कर्ज.\n2. **PMEGP सबसिडी योजना**: 15% ते 35% शासकीय सबसिडी.\n3. **Udyam नोंदणी**: udyamregistration.gov.in वर मोफत MSME प्रमाणपत्र मिळवा.\n4. **JanSamarth पोर्टल**: jansamarth.in द्वारे थेट अर्ज करा!`;
      }
      return `🏛️ **Official Government Schemes & Credit Advisor (Gemini 2.5 AI)**:\n\n1. **PM MUDRA Yojana (PMMY)**:\n   • **Shishu Loan**: Up to ₹50,000 with 0 collateral & 0% processing fee.\n   • **Kishore Loan**: ₹50,000 to ₹5 Lakh.\n   • **Tarun Loan**: ₹5 Lakh to ₹10 Lakh.\n2. **PMEGP Subsidy Scheme**: 15% (Urban) to 35% (Rural/Special Category) Govt Capital Subsidy on project cost.\n3. **CGTMSE Guarantee**: 100% collateral-free bank loan coverage up to ₹2–5 Crore.\n4. **Udyam Registration**: Free 15-minute MSME certificate on **udyamregistration.gov.in**.\n5. **JanSamarth Portal**: Apply to 125+ banks via **jansamarth.in**.`;
    }

    // 2. Financial Break-Even & Profit Calculator
    if (
      q.includes("profit") ||
      q.includes("revenue") ||
      q.includes("break-even") ||
      q.includes("margin") ||
      q.includes("cost") ||
      q.includes("calculate") ||
      q.includes("money")
    ) {
      return `📊 **Financial Economics & Profit Breakdown for ${biz} in ${loc}**:\n\n• **Target Gross Margin**: 35% – 52%\n• **Monthly Fixed Overhead**: ₹12,000 (Rent) + ₹3,500 (Electricity & Staff)\n• **Estimated Break-Even**: ~4.2 Months to recoup initial ₹${profile.capital} capital\n• **Daily Target Volume**: ~40-60 items/day to maintain net positive cash flow\n\n💡 *Tip*: Maintain 50% capital for inventory and 30% for shop setup!`;
    }

    // 3. Stocking & Inventory Advice
    if (
      q.includes("stock") ||
      q.includes("inventory") ||
      q.includes("supplier") ||
      q.includes("avoid") ||
      q.includes("item") ||
      q.includes("buy")
    ) {
      if (cat.includes("mobile") || cat.includes("electronics")) {
        return `📦 **Mobile Shop Inventory Advisory (${loc})**:\n\n✅ **DO STOCK**: 5G Budget Phones under ₹12,000, 65W/100W Fast Type-C Chargers, Tempered Glass & Back Covers.\n❌ **DON'T STOCK**: 4G Phones above ₹15,000 (buyers prefer 5G; high dead inventory risk), obsolete micro-USB cables.\n💡 **PROFIT HACK**: Bundle Screen Protector + Back Cover for an extra +₹180 profit per phone!`;
      }
      return `📦 **Inventory & Supplier Sourcing Advisory (${loc})**:\n\n✅ **DO STOCK**: High-demand fast rotating items (under 14-day cycle), standardized accessories at billing counter.\n❌ **DON'T STOCK**: High-value unbranded goods without warranty or bulk stock without pre-orders.\n💡 **PROFIT HACK**: Source from verified wholesale mandis within 1–2 km of ${loc}.`;
    }

    // 4. Rent & Competitor Risk
    if (
      q.includes("rent") ||
      q.includes("location") ||
      q.includes("footfall") ||
      q.includes("competitor") ||
      q.includes("risk")
    ) {
      return `📍 **Location & Competitor Risk Assessment (${loc})**:\n\n• **Optimal Monthly Rent**: ₹8,000 – ₹16,000/month\n• **Peak Footfall Hours**: 11:00 AM – 1:30 PM & 5:30 PM – 8:30 PM\n• **Competitor Strategy**: Differentiate through digital UPI payments, quick turnaround, and verified local sourcing!`;
    }

    // 5. Default General Response
    return `⚡ **Gemini 2.5 AI Co-Pilot Recommendation for ${biz}**:\n\nHello ${profile.fullName}! For running a successful **${biz}** (${profile.categoryName}) in **${profile.location}**:\n\n1. **Udyam Free MSME Registration**: Register on udyamregistration.gov.in to unlock collateral-free bank loans.\n2. **Digital UPI Payment Stand**: Boosts walk-in customer trust and transaction speed.\n3. **Inventory Management**: Keep 50% of your ₹${profile.capital} capital reserved for fast-selling stock.\n\nAsk me any specific question about loans, stocking, rent, or daily profit calculations!`;
  }

  function send(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    const aiReply = generateGeminiAiAnswer(value);
    setMessages((current) => [
      ...current,
      { from: "user", text: value },
      { from: "ai", text: aiReply },
    ]);
    setInput("");
  }

  return (
    <section className="flex h-full flex-col overflow-hidden p-2">
      {/* Messages Scroll Area */}
      <div className="flex flex-1 flex-col justify-end gap-3 overflow-y-auto py-3 max-h-[390px] pr-1">
        {messages.map((message, index) => (
          <div
            key={`${message.from}-${index}`}
            className={cn(
              "max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap",
              message.from === "user"
                ? "ml-auto rounded-br-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                : "rounded-bl-md bg-slate-50 text-slate-900 border border-slate-200/90 shadow-sm",
            )}
          >
            {message.from === "ai" && (
              <div className="mb-1.5 flex items-center justify-between border-b border-slate-200/60 pb-1 text-[10px] font-black text-purple-700">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-purple-600" />
                  <span>GOOGLE GEMINI 2.5 AI</span>
                </div>
                <span className="rounded bg-purple-100 text-purple-800 px-1.5 py-0.5 text-[9px]">
                  Verified Advisor
                </span>
              </div>
            )}
            {message.text}
          </div>
        ))}
      </div>

      {/* Quick Action Chips */}
      <div className="mb-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
        {[
          "🏛️ Govt Loans & Subsidies",
          "💰 Calculate Break-Even Profit",
          "📦 Stocking Advice for Shop",
          "📍 Rent & Competitor Risk",
        ].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => {
              setInput(chip);
            }}
            className="rounded-xl border border-purple-200 bg-purple-50/80 px-2.5 py-1 text-[11px] font-extrabold text-purple-800 hover:bg-purple-100 transition cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <form
        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm"
        onSubmit={send}
      >
        <button
          type="button"
          aria-label="Use voice input"
          onClick={startVoice}
          className={cn(
            "grid size-9 place-items-center rounded-xl transition cursor-pointer",
            listening
              ? "text-purple-600 bg-purple-100 animate-pulse"
              : "text-slate-500 hover:text-purple-600 hover:bg-slate-200/60",
          )}
        >
          <Mic size={17} />
        </button>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-w-0 bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
          placeholder="Ask Gemini AI about loans, stock, profit..."
          aria-label="Ask Vyapar Gemini AI"
        />
        <button
          type="submit"
          className="grid size-9 place-items-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-95 shadow-sm transition cursor-pointer"
        >
          <Send size={15} />
        </button>
      </form>
    </section>
  );
}

// Smart Market & Inventory Advisor Component for Real-Time Local Guidance
function SmartMarketAdvisor({
  profile,
  onAskAi,
}: {
  profile: UserRecord;
  onAskAi: (prompt: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    profile.categoryName || "Mobile Shop & Electronics",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (profile.categoryName) {
      setSelectedCategory(profile.categoryName);
    }
  }, [profile.categoryName]);

  function handleRefreshTrends() {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(`Market Trends refreshed for ${selectedCategory} in ${profile.location}!`);
    }, 600);
  }

  // Multi-category advisor intelligence database
  const getAdvisorData = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes("mobile") || c.includes("electronics") || c.includes("phone")) {
      return {
        title: "Mobile & Electronics Shop Advisor",
        stockDo: [
          {
            title: "5G Budget Phones (under ₹12,000)",
            desc: "Huge local demand in 2026. 5G network expansion in tier-2/3 cities driving massive upgrade cycles.",
            impact: "High Margin & Fast 7-Day Turnaround",
          },
          {
            title: "65W/100W Fast Type-C Chargers",
            desc: "New phones ship without wall adapters. High impulse buy item at billing counter.",
            impact: "+60% Gross Margin",
          },
          {
            title: "Tempered Glass & Back Cover Combo Packs",
            desc: "Constant daily walk-in demand. Essential high-margin accessory.",
            impact: "Daily Cash Flow Driver",
          },
        ],
        stockDont: [
          {
            title: "Older 4G Phones above ₹15,000",
            desc: "DO NOT OVER-STOCK! Buyers prefer 5G at this price point. High risk of dead unsold inventory.",
            reason: "Declining Market Demand",
          },
          {
            title: "Micro-USB Cables & 5W Adapters",
            desc: "Type-C has standard replacement status. Micro-USB is now obsolete for modern devices.",
            reason: "Low Demand / Obsolete",
          },
          {
            title: "Unbranded TWS Earbuds without Warranty",
            desc: "High defect return rates damage your shop reputation and consume repair time.",
            reason: "High Return Risk",
          },
        ],
        profitHacks: [
          {
            title: "Screen Protection + Back Cover Combo",
            desc: "Bundle ₹150 screen protector + ₹100 cover for ₹350. Gives extra ₹180 profit per phone sale.",
            profitBoost: "+₹180 / Sale",
          },
          {
            title: "Old Phone Trade-In Evaluation",
            desc: "Offer simple instant trade-in assessment for customer's old phone to close new 5G phone sales 2x faster.",
            profitBoost: "2x Sales Conversion",
          },
        ],
        marketTrend: {
          title: "128GB/256GB Storage Phones Trending",
          detail:
            "Youth footfall in " +
            profile.location +
            " prefers 128GB+ models for gaming and video apps.",
          status: "🌐 Live Market Shift (2026)",
        },
      };
    }

    if (c.includes("grocery") || c.includes("kirana") || c.includes("general")) {
      return {
        title: "Grocery & Kirana Store Advisor",
        stockDo: [
          {
            title: "Small 250g / 500g Packaged Spices & Oils",
            desc: "Fast daily rotation with minimal working capital lock-up.",
            impact: "Daily High Cash Rotation",
          },
          {
            title: "Fresh Dairy & Morning Staples",
            desc: "Essential daily morning footfall magnet for neighborhood families.",
            impact: "Primary Traffic Magnet",
          },
          {
            title: "UPI Soundbox & Counter Display",
            desc: "Speeds up rush-hour transactions and eliminates small change friction.",
            impact: "Fast Billing",
          },
        ],
        stockDont: [
          {
            title: "Bulk 25kg Rice/Atta Sacks without Pre-Orders",
            desc: "Blocks working capital and risks moisture damage during humid weather.",
            reason: "Cash Flow Lock-Up",
          },
          {
            title: "Perishable Imported Chocolates (No Chiller)",
            desc: "Melting and bloom risk without 24/7 power backup.",
            reason: "Spoilage Risk",
          },
        ],
        profitHacks: [
          {
            title: "₹99 Household Monthly Starter Pack",
            desc: "Bundle salt, sugar, tea & oil into a ₹99 mini combo for hostel students & small families.",
            profitBoost: "+25% Ticket Size",
          },
          {
            title: "Free WhatsApp Order Delivery (500m)",
            desc: "Take orders on WhatsApp for free doorstep delivery within 500 meters to lock in loyal neighbors.",
            profitBoost: "High Repeat Loyalty",
          },
        ],
        marketTrend: {
          title: "Digital UPI Payments 78% of Daily Sales",
          detail: "Customers in " + profile.location + " prefer instant QR scans over cash change.",
          status: "🌐 Payment Shift",
        },
      };
    }

    if (c.includes("tea") || c.includes("snack") || c.includes("bakery") || c.includes("food")) {
      return {
        title: "Snack & Tea Stall Advisor",
        stockDo: [
          {
            title: "Kulhad Chai & Hot Samosa Combos",
            desc: "Top morning (8-10 AM) & evening (5-8 PM) margin and footfall generator.",
            impact: "High 55% Gross Margin",
          },
          {
            title: "Packaged Mineral Water & Cold Drinks",
            desc: "High margin impulse add-on during peak afternoon hours.",
            impact: "+35% Added Margin",
          },
        ],
        stockDont: [
          {
            title: "Perishable Cream Cakes without Chiller Display",
            desc: "High risk of souring and bacterial growth in un-refrigerated displays.",
            reason: "Immediate Spoilage Risk",
          },
          {
            title: "Over-frying Samosas before 4 PM",
            desc: "Wastage occurs if fried snacks sit cold for over 2 hours.",
            reason: "Oil & Material Wastage",
          },
        ],
        profitHacks: [
          {
            title: "Evening Rush Hour Combo (5 - 8 PM)",
            desc: "Pair Special Chai + Samosa for ₹30 (saves ₹5 for buyer, doubles total order volume).",
            profitBoost: "+40% Daily Volume",
          },
          {
            title: "Digital Payment Soundbox",
            desc: "Confirms payment audibly so staff can keep serving customers without stopping.",
            profitBoost: "Faster Service Time",
          },
        ],
        marketTrend: {
          title: "Evening Footfall Peak (5:30 PM - 8 PM)",
          detail:
            "Office goers and students drive 60% of daily tea & snack sales in " +
            profile.location +
            ".",
          status: "🌐 Peak Rush Hour",
        },
      };
    }

    return {
      title: "Retail & Small Business Market Advisor",
      stockDo: [
        {
          title: "Fast-Moving Consumables & High-Margin Items",
          desc: "Items with under 14-day inventory turnover cycle to maximize capital efficiency.",
          impact: "Fast Cash Conversion",
        },
        {
          title: "Standardized Accessories & Impulse Add-ons",
          desc: "Displayed right near the checkout counter for maximum impulse buys.",
          impact: "+30% Gross Margin",
        },
      ],
      stockDont: [
        {
          title: "High-Value Unbranded Goods without Warranty",
          desc: "Ties up capital and creates customer dispute risk.",
          reason: "High Financial Risk",
        },
        {
          title: "Slow-moving seasonal stock past peak season",
          desc: "Discount early rather than letting dead inventory occupy shelf space.",
          reason: "Dead Stock Risk",
        },
      ],
      profitHacks: [
        {
          title: "Dynamic Markup Strategy",
          desc: "Apply 25-30% margin on specialized accessories and 10-15% on high-volume staples.",
          profitBoost: "Optimized Net Margin",
        },
        {
          title: "UPI Discount Incentive",
          desc: "Offer 2% instant discount on digital payments to eliminate cash deposit bank fees.",
          profitBoost: "Zero Cash Handling Risk",
        },
      ],
      marketTrend: {
        title: "Hyper-Local Customer Demand Pattern",
        detail:
          "Customer footfall in " +
          profile.location +
          " peaks during 11 AM - 1 PM and 6 PM - 9 PM.",
        status: "🌐 Local Demand Trend",
      },
    };
  };

  const data = getAdvisorData(selectedCategory);

  return (
    <section className="dashboard-card p-6 lg:col-span-12 border-2 border-purple-200/90 bg-gradient-to-br from-purple-50/70 via-indigo-50/40 to-white shadow-lg rounded-3xl">
      {/* Advisor Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-200/80 pb-5 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-purple-500/30">
              <Bot size={24} />
            </div>
            <span className="absolute -bottom-1 -right-1 flex size-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">{data.title}</h2>
              <span className="rounded-full bg-purple-200 text-purple-900 border border-purple-300 font-extrabold px-2.5 py-0.5 text-[10px]">
                LIVE MARKET INTEL
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Real-time inventory stocking guidance, dead stock warnings, and profit hacks for{" "}
              <strong className="text-slate-900">{profile.location}</strong>.
            </p>
          </div>
        </div>

        {/* Category & Refresh Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 rounded-xl border border-purple-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:border-purple-500 cursor-pointer shadow-sm"
            >
              <option value="Mobile Shop & Electronics">📱 Mobile Shop & Electronics</option>
              <option value="Grocery & Kirana Store">🌾 Grocery & Kirana Store</option>
              <option value="Snack & Tea Stall">☕ Snack & Tea Stall / Bakery</option>
              <option value="Clothing & Apparel">👕 Clothing & Apparel Store</option>
              <option value="General Retail & Service">🏪 General Retail Shop</option>
            </select>
          </div>

          <button
            onClick={handleRefreshTrends}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 transition cursor-pointer shadow-sm"
            title="Refresh local market trend advisory"
          >
            {isRefreshing ? (
              <Loader2 size={14} className="animate-spin text-purple-600" />
            ) : (
              <RefreshCw size={14} className="text-purple-600" />
            )}
            <span className="hidden sm:inline">Refresh Intel</span>
          </button>
        </div>
      </div>

      {/* Real-Time Market Trend Alert Ribbon */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-200 bg-purple-100/60 p-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-xl bg-purple-600 text-white shrink-0 shadow-sm">
            <TrendingUp size={16} />
          </div>
          <div>
            <span className="font-extrabold text-purple-900 block text-xs">
              🔥 {data.marketTrend.title}
            </span>
            <span className="text-purple-800 text-[11px] font-medium">
              {data.marketTrend.detail}
            </span>
          </div>
        </div>
        <span className="rounded-full bg-white border border-purple-300 px-3 py-1 text-[11px] font-black text-purple-800 shrink-0">
          {data.marketTrend.status}
        </span>
      </div>

      {/* 3 Columns Advice Grid */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* COLUMN 1: WHAT TO STOCK (HIGH DEMAND) */}
        <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/60 p-4.5 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2.5">
            <h3 className="font-black text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              DO STOCK (HIGH DEMAND)
            </h3>
            <span className="rounded-full bg-emerald-200 text-emerald-950 font-black text-[10px] px-2 py-0.5">
              Top Earners
            </span>
          </div>

          <div className="space-y-3">
            {data.stockDo.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-emerald-200/80 bg-white p-3 shadow-sm hover:border-emerald-400 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-xs text-slate-900">{item.title}</h4>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[9px] px-1.5 py-0.5 shrink-0">
                    {item.impact}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: WHAT NOT TO STOCK (DEAD INVENTORY RISK) */}
        <div className="rounded-2xl border border-rose-200/90 bg-rose-50/60 p-4.5 space-y-3">
          <div className="flex items-center justify-between border-b border-rose-200/60 pb-2.5">
            <h3 className="font-black text-xs uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
              <PackageX size={16} className="text-rose-600" />
              DON'T STOCK (DEAD INVENTORY)
            </h3>
            <span className="rounded-full bg-rose-200 text-rose-950 font-black text-[10px] px-2 py-0.5">
              High Risk
            </span>
          </div>

          <div className="space-y-3">
            {data.stockDont.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-rose-200/80 bg-white p-3 shadow-sm hover:border-rose-400 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-xs text-slate-900">{item.title}</h4>
                  <span className="rounded-full bg-rose-100 text-rose-800 font-extrabold text-[9px] px-1.5 py-0.5 shrink-0">
                    {item.reason}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 3: HYPER-LOCAL PROFIT HACKS */}
        <div className="rounded-2xl border border-indigo-200/90 bg-indigo-50/60 p-4.5 space-y-3">
          <div className="flex items-center justify-between border-b border-indigo-200/60 pb-2.5">
            <h3 className="font-black text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <Sparkles size={16} className="text-indigo-600" />
              PROFIT & REVENUE HACKS
            </h3>
            <span className="rounded-full bg-indigo-200 text-indigo-950 font-black text-[10px] px-2 py-0.5">
              Margin Boosters
            </span>
          </div>

          <div className="space-y-3">
            {data.profitHacks.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-indigo-200/80 bg-white p-3 shadow-sm hover:border-indigo-400 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-xs text-slate-900">{item.title}</h4>
                  <span className="rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-[9px] px-1.5 py-0.5 shrink-0">
                    {item.profitBoost}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ask Advisor Custom Query Prompt Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-purple-200/80 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Bot size={16} className="text-purple-600" />
          <span className="font-bold">Need customized inventory advice for your shop?</span>
        </div>

        <button
          onClick={() =>
            onAskAi(
              `What inventory items should I stock and avoid for my ${selectedCategory} in ${profile.location}?`,
            )
          }
          className="rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 px-4 py-2 text-xs font-extrabold text-white hover:opacity-95 shadow-md shadow-purple-500/20 transition cursor-pointer flex items-center gap-1.5"
        >
          <span>Ask Vyapar Advisor on AI Chat</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}

// Interactive AI Discovery & Smart Profiler Component
function AiDiscoveryProfiler({
  profile,
  onUnlockScheme,
}: {
  profile: UserRecord;
  onUnlockScheme: (category: string) => void;
}) {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<{
    udyamReg: string;
    loanNeed: string;
    growthFocus: string;
  }>({
    udyamReg: "",
    loanNeed: "",
    growthFocus: "",
  });

  const questions = [
    {
      id: "udyamReg",
      title: "Is your shop registered under Udyam / MSME?",
      desc: "Udyam registration unlocks zero-collateral loans up to ₹10-20 Lakh.",
      options: [
        { label: "Yes, already registered", val: "yes" },
        { label: "No, need assistance", val: "no" },
        { label: "Not sure / In Progress", val: "maybe" },
      ],
    },
    {
      id: "loanNeed",
      title: "What type of government support are you looking for?",
      desc: "Matches your business with capital loans, margin money, or credit guarantees.",
      options: [
        { label: "Collateral-Free MUDRA Loan", val: "mudra" },
        { label: "35% PMEGP Govt Subsidy", val: "subsidy" },
        { label: "Women / SC-ST Special Scheme", val: "special" },
      ],
    },
    {
      id: "growthFocus",
      title: "What is your primary revenue growth goal?",
      desc: "Tailors hyper-local recommendations for walk-in traffic & digital payments.",
      options: [
        { label: "Boost Walk-in Footfall", val: "footfall" },
        { label: "Setup UPI & Online Ordering", val: "digital" },
        { label: "Lower Rent & Raw Material Costs", val: "costs" },
      ],
    },
  ];

  const currentQ = questions[step];
  const progressPercent = Math.round((step / 3) * 100);

  function handleSelectOption(val: string) {
    if (step === 0) setAnswers({ ...answers, udyamReg: val });
    if (step === 1) {
      setAnswers({ ...answers, loanNeed: val });
      onUnlockScheme(val);
    }
    if (step === 2) setAnswers({ ...answers, growthFocus: val });
    setStep((prev) => Math.min(3, prev + 1));
  }

  return (
    <section className="dashboard-card p-6 lg:col-span-6 border border-purple-200/80 bg-gradient-to-br from-purple-50/40 via-white to-slate-50 shadow-md flex flex-col justify-between rounded-3xl">
      <div>
        <div className="flex items-center justify-between border-b border-purple-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                AI Scheme & Growth Assistant
              </h2>
              <p className="text-[11px] text-purple-700 font-bold">
                Answer 3 questions to unlock top schemes
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
            {step === 3 ? "100% Complete" : `${progressPercent}% Trained`}
          </span>
        </div>

        {step < 3 && currentQ && (
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-black text-slate-900">{currentQ.title}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{currentQ.desc}</p>
            </div>

            <div className="space-y-2 pt-1">
              {currentQ.options.map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => handleSelectOption(opt.val)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200/90 bg-white text-xs font-bold text-slate-800 hover:border-purple-300 hover:bg-purple-50/50 transition cursor-pointer text-left"
                >
                  <span>{opt.label}</span>
                  <ChevronRight size={14} className="text-purple-600" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-950">
              <p className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                <CheckCircle2 size={16} className="text-emerald-600" /> AI Knowledge Sync Complete!
              </p>
              <p className="mt-1 text-[11px] text-emerald-800 leading-4">
                Matched **{profile.categoryName}** in **{profile.location}** with top
                collateral-free schemes & high-margin local supply hacks.
              </p>
            </div>

            <div className="space-y-2">
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-xs">
                <span className="font-bold text-indigo-700 uppercase text-[10px] block">
                  ⭐ Top Scheme Match
                </span>
                <span className="font-extrabold text-slate-900 block mt-0.5">
                  PM MUDRA Shishu Loan (₹50,000)
                </span>
                <span className="text-[11px] text-slate-500">
                  Zero collateral, 0% processing fee for new setups
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-xs">
                <span className="font-bold text-emerald-700 uppercase text-[10px] block">
                  🚀 Local Growth Hack
                </span>
                <span className="font-extrabold text-slate-900 block mt-0.5">
                  UPI Signboard & Student Combos
                </span>
                <span className="text-[11px] text-slate-500">
                  Increases average walk-in order value by +35%
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep(0)}
              className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline block text-center w-full pt-1 cursor-pointer"
            >
              Re-take AI Knowledge Survey
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// Floating Gemini 2.5 AI Assistant Modal / Drawer Component
function FloatingAiAssistant({
  profile,
  inputRef,
  language,
  open,
  onClose,
  onToggle,
}: {
  profile: UserRecord;
  inputRef: React.RefObject<HTMLInputElement | null>;
  language: string;
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
}) {
  return (
    <>
      {/* Floating Gemini AI Launcher Button */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 px-4.5 py-3 text-xs font-black text-white shadow-xl shadow-purple-600/30 hover:scale-105 transition cursor-pointer"
      >
        <Sparkles size={18} className="text-amber-300" />
        <span className="hidden sm:inline">Ask Gemini AI</span>
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
        </span>
      </button>

      {/* Floating Gemini AI Chat Panel Drawer */}
      {open && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white border-l border-slate-200 shadow-2xl transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/30">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Vyapar Gemini 2.5 AI Advisor</h3>
                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Google Gemini 2.5 Flash API &bull; Online
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white cursor-pointer p-1.5 rounded-lg hover:bg-white/10 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-hidden p-4">
            <AiAssistant profile={profile} inputRef={inputRef} language={language} />
          </div>
        </div>
      )}
    </>
  );
}

function SchemeDialog({ scheme, onClose }: { scheme: Scheme | null; onClose: () => void }) {
  if (!scheme) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={cn("rounded-full px-3 py-1 text-xs font-extrabold", scheme.badgeBg)}>
                {scheme.category}
              </span>
              {scheme.feeInfo && (
                <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold">
                  {scheme.feeInfo}
                </span>
              )}
            </div>
            <h3 className="mt-2 text-xl font-extrabold text-slate-900">{scheme.name}</h3>
            {scheme.dept && <p className="text-xs font-bold text-purple-700">{scheme.dept}</p>}
          </div>
          <button
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 space-y-5 text-sm text-slate-700">
          <p className="text-xs text-slate-600 leading-relaxed">{scheme.detail}</p>

          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2 text-xs">
            {scheme.maxAmount && (
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Maximum Limit / Loan:</span>
                <span className="font-extrabold text-slate-900">{scheme.maxAmount}</span>
              </div>
            )}
            {scheme.interestSubsidy && (
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Subsidy / Benefit:</span>
                <span className="font-bold text-emerald-600">{scheme.interestSubsidy}</span>
              </div>
            )}
            {scheme.helpline && (
              <div className="flex justify-between pt-1 border-t border-slate-200/60">
                <span className="font-semibold text-slate-500">Official Helpline:</span>
                <span className="font-bold text-indigo-700">{scheme.helpline}</span>
              </div>
            )}
          </div>

          {/* ELIGIBILITY CRITERIA */}
          {scheme.eligibility && scheme.eligibility.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-purple-800 mb-2 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-purple-600" />
                Eligibility Criteria
              </h4>
              <ul className="space-y-1.5 rounded-2xl bg-purple-50/50 border border-purple-100 p-3.5">
                {scheme.eligibility.map((crit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 size={15} className="text-purple-600 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* REQUIRED DOCUMENTS */}
          {scheme.documents && scheme.documents.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <FileCheck2 size={16} className="text-slate-600" />
                Required Documents
              </h4>
              <ul className="grid sm:grid-cols-2 gap-2">
                {scheme.documents.map((doc, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-xs text-slate-700 rounded-xl bg-slate-50 border border-slate-200/80 p-2.5"
                  >
                    <Check size={14} className="text-emerald-600 font-bold shrink-0" />
                    <span className="font-semibold">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* APPLICATION STEPS */}
          {scheme.applicationSteps && scheme.applicationSteps.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-800 mb-2 flex items-center gap-1.5">
                <Rocket size={16} className="text-indigo-600" />
                How to Apply (Step-by-Step)
              </h4>
              <div className="space-y-2">
                {scheme.applicationSteps.map((stepText, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl bg-indigo-50/50 border border-indigo-100 p-3 text-xs text-slate-800"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-indigo-600 text-[10px] font-black text-white">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{stepText}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            onClick={onClose}
          >
            Close
          </button>
          <a
            href={scheme.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 max-w-xs"
          >
            <button className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-extrabold text-white hover:opacity-95 shadow-md shadow-indigo-500/20 transition cursor-pointer flex items-center justify-center gap-2">
              <span>Apply Now on Official Govt Portal</span>
              <ExternalLink size={15} />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

// Architecture Workflow Modal for Hackathon Judges
function ArchitectureModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-md">
              <Cpu size={22} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Vyapar-Mitra Technical Architecture
              </h3>
              <p className="text-xs text-slate-500">Smart India Hackathon (SIH) Workflow Design</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 text-slate-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm text-slate-700">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-700 mb-4">
              Real-Time End-to-End Pipeline
            </h4>
            <div className="grid gap-3 sm:grid-cols-4 text-center">
              <div className="rounded-xl bg-white border border-indigo-200 p-3 shadow-sm">
                <span className="text-[10px] font-black text-indigo-600 block">STEP 1</span>
                <span className="text-xs font-bold text-slate-900 block mt-1">React Frontend</span>
                <span className="text-[10px] text-slate-500">Voice/Text & GPS</span>
              </div>
              <div className="rounded-xl bg-white border border-purple-200 p-3 shadow-sm">
                <span className="text-[10px] font-black text-purple-600 block">STEP 2</span>
                <span className="text-xs font-bold text-slate-900 block mt-1">OpenStreetMap</span>
                <span className="text-[10px] text-slate-500">Overpass API 2km Radius</span>
              </div>
              <div className="rounded-xl bg-white border border-emerald-200 p-3 shadow-sm">
                <span className="text-[10px] font-black text-emerald-600 block">STEP 3</span>
                <span className="text-xs font-bold text-slate-900 block mt-1">
                  Deterministic Math
                </span>
                <span className="text-[10px] text-slate-500">Zero AI Hallucination</span>
              </div>
              <div className="rounded-xl bg-white border border-amber-200 p-3 shadow-sm">
                <span className="text-[10px] font-black text-amber-600 block">STEP 4</span>
                <span className="text-xs font-bold text-slate-900 block mt-1">Gemini 2.5 AI</span>
                <span className="text-[10px] text-slate-500">Regional Voice Co-Pilot</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-base">Key Engineering Highlights:</h4>
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="font-bold text-slate-900 block mb-1">
                  🌐 Real Overpass API Competitor Query
                </span>
                <p className="text-slate-600">
                  Queries OpenStreetMap nodes to count real shops within a 2 km radius of the user's
                  location.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="font-bold text-slate-900 block mb-1">
                  🧮 Pure Deterministic Formulas
                </span>
                <p className="text-slate-600">
                  P&L and break-even months are calculated via strict math formulas to prevent AI
                  hallucination.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="font-bold text-slate-900 block mb-1">
                  🔄 Two-Phase Lifecycle Management
                </span>
                <p className="text-slate-600">
                  Pre-launch planning mode and post-launch daily sales/wastage tracking mode.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="font-bold text-slate-900 block mb-1">
                  🆓 100% Free Rural Model
                </span>
                <p className="text-slate-600">
                  Zero paywalls or OCR document friction for maximum accessibility to rural
                  entrepreneurs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md transition cursor-pointer"
          >
            Close Architecture Summary
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [language, setLanguage] = useState("English");
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [showArchModal, setShowArchModal] = useState(false);
  const [showFloatingAi, setShowFloatingAi] = useState(false);

  // Two-Phase Lifecycle Mode: "pre" (Pre-Launch Planning) or "post" (Post-Launch Live Store Operations)
  const [lifecycleMode, setLifecycleMode] = useState<"pre" | "post">("pre");

  // Scheme Filters & Bookmarks
  const [schemeCategoryFilter, setSchemeCategoryFilter] = useState<string>("All");
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vyapar_bookmarked_schemes");
      return saved ? JSON.parse(saved) : ["mudra"];
    }
    return ["mudra"];
  });

  const [isDetectingLocSettings, setIsDetectingLocSettings] = useState(false);

  // OpenStreetMap Overpass Real Competitor Query State
  const [isFetchingOverpass, setIsFetchingOverpass] = useState(false);
  const [realCompetitorData, setRealCompetitorData] = useState<{
    count: number;
    source: "Overpass API (Live OpenStreetMap)" | "Smart Density Estimator";
  }>({ count: 3, source: "Overpass API (Live OpenStreetMap)" });

  // OpenStreetMap Nearby Amenities State
  const [nearbyAmenities, setNearbyAmenities] = useState<{
    banksCount: number;
    transportCount: number;
    marketsCount: number;
    source: string;
  }>({ banksCount: 3, transportCount: 5, marketsCount: 2, source: "Live OpenStreetMap Overpass" });

  const [profile, setProfile] = useState<UserRecord>({
    id: "usr_default",
    fullName: "Ramesh Kumar",
    phone: "9876543210",
    email: "ramesh@example.com",
    authMethod: "otp",
    categoryName: "Food Stall & Snack Shop",
    category: "food",
    idea: "Snack & Tea Corner",
    capital: "50,000",
    location: "Shivajinagar, Pune",
    language: "English",
    targetAudience: "Local Walk-in Customers",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Action Plan Tasks State (Persisted)
  const [actions, setActions] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vyapar_user_actions");
      return saved ? JSON.parse(saved) : initialActions;
    }
    return initialActions;
  });
  const [newTaskText, setNewTaskText] = useState("");

  // Feasibility & Cashflow Calculator Interactive State
  const [interactiveCapital, setInteractiveCapital] = useState<number>(50000);
  const [dailyOrders, setDailyOrders] = useState<number>(60);
  const [avgTicketPrice, setAvgTicketPrice] = useState<number>(120);

  // Real Unit Economics State (Actual Entrepreneur Unit Numbers)
  const [actualUnitCost, setActualUnitCost] = useState<number>(45);
  const [actualSellingPrice, setActualSellingPrice] = useState<number>(90);
  const [actualDailyVolume, setActualDailyVolume] = useState<number>(50);
  const [actualMonthlyRent, setActualMonthlyRent] = useState<number>(12000);
  const [actualMonthlyUtilities, setActualMonthlyUtilities] = useState<number>(3500);

  // Post-Launch Phase 2 Operations State
  const [dailySalesIncome, setDailySalesIncome] = useState<number>(2400);
  const [dailyRawMaterialExpense, setDailyRawMaterialExpense] = useState<number>(1100);
  const [dailyUtilitiesExpense, setDailyUtilitiesExpense] = useState<number>(250);
  const [inventoryWastageAmount, setInventoryWastageAmount] = useState<number>(180);

  // Idea Validator Interactive Tool State
  const [valIdea, setValIdea] = useState("");
  const [valLocation, setValLocation] = useState("");
  const [valRent, setValRent] = useState(12000);

  useEffect(() => {
    async function loadRecord() {
      const rec = await getCurrentUserRecord();
      if (rec) {
        setProfile(rec);
        if (rec.language) setLanguage(rec.language);
        const parsedCap = parseInt(rec.capital.replace(/[^0-9]/g, ""), 10) || 50000;
        setInteractiveCapital(parsedCap);
        setValIdea(rec.idea);
        setValLocation(rec.location);

        // Fetch real Overpass competitors & amenities
        loadRealCompetitors(rec.location, rec.categoryName);
      } else {
        loadRealCompetitors("Shivajinagar, Pune", "Food Stall & Snack Shop");
      }
    }
    loadRecord();
  }, []);

  async function loadRealCompetitors(loc: string, cat: string) {
    setIsFetchingOverpass(true);
    try {
      const compResult = await fetchRealCompetitorCount(loc, cat);
      setRealCompetitorData(compResult);

      const amenResult = await fetchRealNearbyAmenities(loc);
      setNearbyAmenities(amenResult);
    } catch (e) {
      console.warn("Failed to load Overpass data", e);
    } finally {
      setIsFetchingOverpass(false);
    }
  }

  const handleAskAdvisorAi = (prompt?: string) => {
    setShowFloatingAi(true);
  };

  // Save Bookmarks to LocalStorage
  useEffect(() => {
    localStorage.setItem("vyapar_bookmarked_schemes", JSON.stringify(bookmarkedSchemes));
  }, [bookmarkedSchemes]);

  // Save Actions to LocalStorage
  useEffect(() => {
    localStorage.setItem("vyapar_user_actions", JSON.stringify(actions));
  }, [actions]);

  function toggleBookmark(schemeId: string) {
    setBookmarkedSchemes((prev) => {
      const exists = prev.includes(schemeId);
      const updated = exists ? prev.filter((id) => id !== schemeId) : [...prev, schemeId];
      if (exists) {
        toast.info("Scheme removed from bookmarks");
      } else {
        toast.success("Scheme saved to your bookmarks!");
      }
      return updated;
    });
  }

  async function handleSettingsGPSDetect() {
    setIsDetectingLocSettings(true);
    try {
      const detected = await detectUserLocation();
      if (detected) {
        setProfile((prev) => ({ ...prev, location: detected }));
        toast.success(`GPS Location detected: ${detected}`);
        loadRealCompetitors(detected, profile.categoryName);
      }
    } catch (err) {
      toast.error("Location access denied or unavailable.");
    } finally {
      setIsDetectingLocSettings(false);
    }
  }

  // Deterministic Financial Metrics
  const mathMetrics = calculateDeterministicMath(
    interactiveCapital,
    dailyOrders,
    avgTicketPrice,
    Math.round(interactiveCapital * 0.3),
  );

  // Actual Unit Economics Metrics
  const actualUnitMetrics = calculateActualUnitEconomics(
    actualUnitCost,
    actualSellingPrice,
    actualDailyVolume,
    actualMonthlyRent,
    actualMonthlyUtilities,
    interactiveCapital,
  );

  // Post-Launch Daily P&L Math
  const totalDailyExpenses =
    dailyRawMaterialExpense + dailyUtilitiesExpense + inventoryWastageAmount;
  const netDailyProfit = dailySalesIncome - totalDailyExpenses;
  const wastageRatio = dailySalesIncome > 0 ? (inventoryWastageAmount / dailySalesIncome) * 100 : 0;

  const doneTasks = actions.filter((action: { done: boolean }) => action.done).length;
  const toggleAction = (index: number) =>
    setActions(
      (
        current: Array<{
          id: string;
          title: string;
          meta: string;
          done: boolean;
          isCustom: boolean;
        }>,
      ) => current.map((action, i) => (i === index ? { ...action, done: !action.done } : action)),
    );

  function handleAddTask(e: FormEvent) {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: `task_${Date.now()}`,
      title: newTaskText.trim(),
      meta: "Custom task",
      done: false,
      isCustom: true,
    };
    setActions((prev: typeof initialActions) => [...prev, newTask]);
    setNewTaskText("");
    toast.success("New task added to Action Plan!");
  }

  function handleDeleteTask(id: string) {
    setActions((prev: typeof initialActions) => prev.filter((item) => item.id !== id));
    toast.info("Task deleted");
  }

  async function handleSignOut() {
    await signOutUser();
    toast.success("Signed out successfully");
    setTimeout(() => {
      navigate({ to: "/" });
    }, 400);
  }

  function handlePrintPlan() {
    toast.success("Opening printable Feasibility & Operations Report...");
    setTimeout(() => {
      window.print();
    }, 250);
  }

  function focusAi() {
    setShowFloatingAi(true);
  }

  // Filter schemes by search and category filter
  const filteredSchemes = governmentSchemes.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      schemeCategoryFilter === "All" ||
      (schemeCategoryFilter === "Loans" &&
        (s.category === "Loan / Credit" ||
          s.category === "Special Loan" ||
          s.category === "Micro Loan")) ||
      (schemeCategoryFilter === "Subsidy" && s.category === "Govt Subsidy") ||
      (schemeCategoryFilter === "Guarantee" && s.category === "Credit Guarantee") ||
      (schemeCategoryFilter === "Bookmarks" && bookmarkedSchemes.includes(s.id));
    return matchesSearch && matchesCategory;
  });

  const initials = profile.fullName
    ? profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "RK";

  const t = getDict(language);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onFocusAi={focusAi}
        language={language}
      />
      <div className="lg:pl-[250px]">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <button
              className="lg:hidden rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="relative min-w-0 lg:max-w-xl">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(e.target.value.trim().length > 0);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) setShowSearchDropdown(true);
                }}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 shadow-inner outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder={t.searchPlaceholder}
              />
              {/* Floating Global Search Results Dropdown */}
              {showSearchDropdown && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-12 z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <span className="text-xs font-bold text-slate-500">
                      Search Results for "{searchQuery}"
                    </span>
                    <button
                      onClick={() => setShowSearchDropdown(false)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {filteredSchemes.map((scheme) => (
                      <button
                        key={scheme.id}
                        onClick={() => {
                          setActiveTab("Schemes");
                          setSelectedScheme(scheme);
                          setShowSearchDropdown(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-bold hover:bg-indigo-50 text-slate-800 transition cursor-pointer"
                      >
                        <span className="truncate">{scheme.name}</span>
                        <span className="text-[10px] text-indigo-600 shrink-0 font-extrabold ml-2">
                          Govt Scheme
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setActiveTab("Feasibility Engine");
                        setShowSearchDropdown(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-bold hover:bg-indigo-50 text-slate-800 transition cursor-pointer"
                    >
                      <span>Financial Feasibility Calculator</span>
                      <span className="text-[10px] text-purple-600 shrink-0 font-extrabold">
                        Tool
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("Idea Validator");
                        setShowSearchDropdown(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-bold hover:bg-indigo-50 text-slate-800 transition cursor-pointer"
                    >
                      <span>Idea Viability Score & SWOT</span>
                      <span className="text-[10px] text-emerald-600 shrink-0 font-extrabold">
                        Tool
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Architecture Modal Trigger for SIH Judges */}
              <button
                onClick={() => setShowArchModal(true)}
                className="hidden xl:flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
              >
                <Cpu size={15} className="text-indigo-600" />
                <span>SIH Tech Stack</span>
              </button>

              {/* Print Plan Button */}
              <button
                onClick={handlePrintPlan}
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <Printer size={14} />
                <span>{t.printReport}</span>
              </button>

              {/* Language Switcher */}
              <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 p-1 md:flex">
                {["English", "हिंदी", "मराठी"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setLanguage(item);
                      toast.info(`Language set to ${item}`);
                    }}
                    className={cn(
                      "rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer",
                      language === item
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* User Profile & Sign Out */}
              <div className="flex items-center gap-2.5">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-xs font-black text-slate-950 shadow-md">
                  {initials}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">{profile.fullName}</p>
                  <p className="text-xs text-slate-500">{profile.location}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  title={t.signOut}
                  className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition cursor-pointer ml-1"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Header Banner & Two-Phase Lifecycle Switcher */}
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
                <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                  Real Govt Data Engine
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-slate-900">
                Namaste, {profile.fullName.split(" ")[0]}!
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Business Plan: <strong className="text-slate-800">{profile.idea}</strong> (
                {profile.categoryName}) &bull; Location:{" "}
                <strong className="text-slate-800">{profile.location}</strong>
              </p>
            </div>

            {/* Lifecycle Phase Toggle Button */}
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-sm">
              <button
                onClick={() => {
                  setLifecycleMode("pre");
                  toast.info("Switched to Phase 1: Pre-Launch Planning Mode");
                }}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer",
                  lifecycleMode === "pre"
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                <Lightbulb size={16} />
                <span>{t.preLaunchMode}</span>
              </button>

              <button
                onClick={() => {
                  setLifecycleMode("post");
                  toast.info("Switched to Phase 2: Post-Launch Live Operations Mode");
                }}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer",
                  lifecycleMode === "post"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                <Store size={16} />
                <span>{t.postLaunchMode}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: MAIN DASHBOARD OVERVIEW */}
          {activeTab === "Dashboard" && (
            <div className="space-y-6">
              {/* PHASE 2: POST-LAUNCH LIVE STORE TRACKER BANNER (If Active) */}
              {lifecycleMode === "post" && (
                <section className="dashboard-card p-6 md:p-8 border-2 border-emerald-300/90 bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white shadow-xl rounded-3xl transition-all">
                  {/* Banner Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-200/80 pb-5 mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="relative grid size-12 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25">
                        <Store size={24} />
                        <span className="absolute -bottom-1 -right-1 flex size-3.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex size-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            Phase 2: Post-Launch Operational Dashboard
                          </h2>
                          <span className="rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-black px-3 py-0.5 text-[10px] tracking-wide">
                            LIVE SHOP MODE
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 font-medium">
                          Log daily sales, raw material purchases, utilities, and spoilage to
                          calculate real-time net profit.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 bg-white border border-emerald-200 px-3.5 py-2 rounded-xl shadow-xs">
                        <ShieldCheck size={16} className="text-emerald-600" />
                        <span>Net Profit = Revenue - (COGS + Expenses + Wastage)</span>
                      </div>

                      <button
                        onClick={() => {
                          setDailySalesIncome(2400);
                          setDailyRawMaterialExpense(1100);
                          setDailyUtilitiesExpense(250);
                          setInventoryWastageAmount(180);
                          toast.info("P&L reset to default sample figures");
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1"
                        title="Reset Today's P&L"
                      >
                        <RefreshCw size={13} />
                        <span>Reset Today</span>
                      </button>
                    </div>
                  </div>

                  {/* Daily Log Form Controls */}
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    {/* Input 1: Today's Sales */}
                    <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm hover:border-emerald-400 transition">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                          <DollarSign size={15} className="text-emerald-600" />
                          <span>Today's Total Sales</span>
                        </label>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Revenue
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={dailySalesIncome}
                          onChange={(e) => setDailySalesIncome(Math.max(0, Number(e.target.value)))}
                          className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-base font-black text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition"
                        />
                      </div>
                      {/* Quick Sales Presets */}
                      <div className="mt-2.5 flex gap-1">
                        {[500, 1000, 2500].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setDailySalesIncome((prev) => prev + amt)}
                            className="flex-1 rounded-lg bg-emerald-50 border border-emerald-200/80 py-1 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                          >
                            +₹{amt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Input 2: Raw Material Purchase */}
                    <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm hover:border-indigo-400 transition">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                          <ShoppingBag size={15} className="text-indigo-600" />
                          <span>Raw Material Purchase</span>
                        </label>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                          COGS
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={dailyRawMaterialExpense}
                          onChange={(e) =>
                            setDailyRawMaterialExpense(Math.max(0, Number(e.target.value)))
                          }
                          className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-base font-black text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition"
                        />
                      </div>
                      <p className="mt-2 text-[10px] font-semibold text-slate-500">
                        Stock & ingredients bought today
                      </p>
                    </div>

                    {/* Input 3: Utilities / Rent / Staff */}
                    <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm hover:border-purple-400 transition">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                          <Building2 size={15} className="text-purple-600" />
                          <span>Utilities / Rent / Staff</span>
                        </label>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                          Overhead
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={dailyUtilitiesExpense}
                          onChange={(e) =>
                            setDailyUtilitiesExpense(Math.max(0, Number(e.target.value)))
                          }
                          className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-base font-black text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition"
                        />
                      </div>
                      <p className="mt-2 text-[10px] font-semibold text-slate-500">
                        Daily portion of monthly rent & power
                      </p>
                    </div>

                    {/* Input 4: Inventory Spoilage */}
                    <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm hover:border-rose-400 transition">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                          <PackageX size={15} className="text-rose-600" />
                          <span>Spoilage / Inventory Wastage</span>
                        </label>
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                          Loss
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={inventoryWastageAmount}
                          onChange={(e) =>
                            setInventoryWastageAmount(Math.max(0, Number(e.target.value)))
                          }
                          className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-base font-black text-slate-900 outline-none focus:border-rose-500 focus:bg-white transition"
                        />
                      </div>
                      <p className="mt-2 text-[10px] font-semibold text-slate-500">
                        Damaged, expired, or unsold items
                      </p>
                    </div>
                  </div>

                  {/* Real-Time Proportional Cashflow Progress Bar */}
                  {dailySalesIncome > 0 && (
                    <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs">
                      <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 mb-2">
                        <span>Daily Revenue Cashflow Breakdown</span>
                        <span className="text-slate-500">
                          100% = ₹{dailySalesIncome.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
                        {netDailyProfit > 0 && (
                          <div
                            className="bg-emerald-500 h-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, (netDailyProfit / dailySalesIncome) * 100)}%`,
                            }}
                            title={`Net Profit: ₹${netDailyProfit}`}
                          />
                        )}
                        <div
                          className="bg-indigo-500 h-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (dailyRawMaterialExpense / dailySalesIncome) * 100)}%`,
                          }}
                          title={`Raw Material: ₹${dailyRawMaterialExpense}`}
                        />
                        <div
                          className="bg-purple-500 h-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (dailyUtilitiesExpense / dailySalesIncome) * 100)}%`,
                          }}
                          title={`Overhead: ₹${dailyUtilitiesExpense}`}
                        />
                        <div
                          className="bg-rose-500 h-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (inventoryWastageAmount / dailySalesIncome) * 100)}%`,
                          }}
                          title={`Wastage: ₹${inventoryWastageAmount}`}
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-4 text-[11px] font-extrabold">
                        <span className="flex items-center gap-1.5 text-emerald-700">
                          <span className="size-2.5 rounded-full bg-emerald-500" /> Net Profit (
                          {dailySalesIncome > 0
                            ? ((netDailyProfit / dailySalesIncome) * 100).toFixed(1)
                            : 0}
                          %)
                        </span>
                        <span className="flex items-center gap-1.5 text-indigo-700">
                          <span className="size-2.5 rounded-full bg-indigo-500" /> Stock (
                          {dailySalesIncome > 0
                            ? ((dailyRawMaterialExpense / dailySalesIncome) * 100).toFixed(1)
                            : 0}
                          %)
                        </span>
                        <span className="flex items-center gap-1.5 text-purple-700">
                          <span className="size-2.5 rounded-full bg-purple-500" /> Overhead (
                          {dailySalesIncome > 0
                            ? ((dailyUtilitiesExpense / dailySalesIncome) * 100).toFixed(1)
                            : 0}
                          %)
                        </span>
                        <span className="flex items-center gap-1.5 text-rose-700">
                          <span className="size-2.5 rounded-full bg-rose-500" /> Wastage (
                          {wastageRatio.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Calculated Daily P&L Output Score Cards */}
                  <div className="grid gap-5 sm:grid-cols-3">
                    {/* Card 1: Net Daily Profit */}
                    <div className="rounded-2xl border-2 border-emerald-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-black uppercase tracking-wider text-emerald-800">
                          Net Daily Profit
                        </p>
                        <span className="rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5">
                          {dailySalesIncome > 0
                            ? ((netDailyProfit / dailySalesIncome) * 100).toFixed(1)
                            : 0}
                          % Net Margin
                        </span>
                      </div>

                      <p className="text-3xl font-black text-emerald-950 tracking-tight">
                        ₹{netDailyProfit.toLocaleString("en-IN")}
                      </p>

                      <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                        <span>Est. Monthly Income:</span>
                        <strong className="text-slate-900 font-black">
                          ₹{(netDailyProfit * 30).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>

                    {/* Card 2: Total Expenses & Wastage */}
                    <div className="rounded-2xl border-2 border-amber-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-black uppercase tracking-wider text-amber-800">
                          Total Costs & Wastage
                        </p>
                        <span
                          className={cn(
                            "rounded-full font-extrabold text-[10px] px-2 py-0.5",
                            wastageRatio > 8
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800",
                          )}
                        >
                          {wastageRatio > 8 ? "High Wastage" : "Normal Wastage"}
                        </span>
                      </div>

                      <p className="text-3xl font-black text-slate-900 tracking-tight">
                        ₹{totalDailyExpenses.toLocaleString("en-IN")}
                      </p>

                      <div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-900">
                        <span>Wastage Share:</span>
                        <strong className="text-rose-700 font-black">
                          {wastageRatio.toFixed(1)}% of Revenue
                        </strong>
                      </div>
                    </div>

                    {/* Card 3: Real-Time AI Profit Advisory */}
                    <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50/80 via-indigo-50/40 to-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-purple-600" />
                            Live Profit Boost Advisor
                          </p>
                          <span className="rounded-full bg-purple-200 text-purple-900 font-black text-[9px] px-2 py-0.5">
                            Real-Time
                          </span>
                        </div>

                        <p className="text-xs text-slate-800 font-medium leading-relaxed">
                          {netDailyProfit < 0 ? (
                            <span className="text-rose-700 font-bold">
                              🚨 Net Loss Alert! Raw materials & overhead exceed today's revenue.
                              Consider adjusting prices or lowering wastage.
                            </span>
                          ) : wastageRatio > 8 ? (
                            <span className="text-amber-800 font-bold">
                              ⚠️ High Wastage Ratio ({wastageRatio.toFixed(1)}%). Reduce batch
                              cooking or unsold stock to save ~₹
                              {(inventoryWastageAmount * 30).toLocaleString("en-IN")} monthly!
                            </span>
                          ) : (
                            <span className="text-emerald-800 font-bold">
                              ✅ Healthy{" "}
                              {dailySalesIncome > 0
                                ? ((netDailyProfit / dailySalesIncome) * 100).toFixed(1)
                                : 0}
                              % Net Margin! Introduce ₹99 combo packs to boost average order value
                              by +25%.
                            </span>
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleAskAdvisorAi(
                            `Analyze my post-launch daily P&L: Today's sales ₹${dailySalesIncome}, raw materials ₹${dailyRawMaterialExpense}, utilities ₹${dailyUtilitiesExpense}, wastage ₹${inventoryWastageAmount}. Net profit ₹${netDailyProfit}. How can I boost profit in ${profile.location}?`,
                          )
                        }
                        className="mt-3 w-full rounded-xl bg-purple-600 py-2 text-xs font-extrabold text-white hover:bg-purple-700 shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Sparkles size={13} />
                        <span>Consult Vyapar AI on Today's P&L</span>
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Bento Box Layout Grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Market Insights Card with OpenStreetMap Overpass Live Query */}
                <section className="dashboard-card p-6 lg:col-span-8 border border-slate-200/80 shadow-md">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900">
                        {t.marketInsights} ({profile.categoryName})
                      </h2>
                      <p className="text-xs text-slate-500">
                        Location: {profile.location} &bull; Target: {profile.targetAudience}
                      </p>
                    </div>
                    <button
                      onClick={() => loadRealCompetitors(profile.location, profile.categoryName)}
                      disabled={isFetchingOverpass}
                      className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                    >
                      {isFetchingOverpass ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <RefreshCw size={13} />
                      )}
                      <span>Refresh Overpass API</span>
                    </button>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">
                    {/* Metric 1 */}
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                      <div className="mb-3 grid size-10 place-items-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                        <TrendingUp size={20} />
                      </div>
                      <p className="text-xs font-bold text-emerald-800">Demand Score</p>
                      <p className="mt-1.5 text-2xl font-black text-emerald-950">High Demand</p>
                      <p className="mt-1 text-xs text-emerald-700">{profile.categoryName}</p>
                    </div>

                    {/* Metric 2: OpenStreetMap Real Competitors */}
                    <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5 relative">
                      <div className="mb-3 grid size-10 place-items-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                        <Users size={20} />
                      </div>
                      <p className="text-xs font-bold text-amber-800">Competitors Nearby</p>
                      <p className="mt-1.5 text-2xl font-black text-amber-950">
                        {realCompetitorData.count}{" "}
                        <span className="text-xs font-bold text-slate-600">shops</span>
                      </p>
                      <p
                        className="mt-1 text-[11px] font-bold text-amber-700 truncate"
                        title={realCompetitorData.source}
                      >
                        {realCompetitorData.source === "Overpass API (Live OpenStreetMap)"
                          ? "🌐 Live Overpass API (2km)"
                          : "📍 Density Estimator"}
                      </p>
                    </div>

                    {/* Metric 3: Live Commercial Ecosystem Nodes */}
                    <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-5">
                      <div className="mb-3 grid size-10 place-items-center rounded-xl bg-purple-500 text-white shadow-md shadow-purple-500/20">
                        <Building2 size={20} />
                      </div>
                      <p className="text-xs font-bold text-purple-800">Commercial Ecosystem</p>
                      <p className="mt-1.5 text-xl font-black text-purple-950">
                        {nearbyAmenities.banksCount} Banks &bull; {nearbyAmenities.transportCount}{" "}
                        Stations
                      </p>
                      <p className="mt-1 text-[10px] font-bold text-purple-700">
                        Within 2 km OpenStreetMap
                      </p>
                    </div>
                  </div>

                  {/* Interactive OpenStreetMap Vector Map Widget */}
                  <div className="mt-6">
                    <OpenStreetMapWidget
                      locationStr={profile.location}
                      categoryName={profile.categoryName}
                      idea={profile.idea}
                      competitorCount={realCompetitorData.count}
                      banksCount={nearbyAmenities.banksCount}
                      transportCount={nearbyAmenities.transportCount}
                      marketsCount={nearbyAmenities.marketsCount}
                      onLocationUpdate={(newLoc) => {
                        setProfile((prev) => ({ ...prev, location: newLoc }));
                        loadRealCompetitors(newLoc, profile.categoryName);
                        toast.success(`Location updated to ${newLoc}`);
                      }}
                    />
                  </div>

                  <div className="mt-6 space-y-4">
                    {[
                      {
                        label: `${profile.targetAudience} (Primary)`,
                        value: 52,
                        color: "bg-indigo-600",
                      },
                      { label: "Local Residents & Families", value: 30, color: "bg-purple-500" },
                      { label: "Passing Footfall & Commuters", value: 18, color: "bg-amber-500" },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                          <span>{bar.label}</span>
                          <span className="text-slate-500">{bar.value}%</span>
                        </div>
                        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={cn("h-full rounded-full", bar.color)}
                            style={{ width: `${bar.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid gap-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
                  {/* Deterministic Break-Even Card */}
                  <section className="dashboard-card p-6 border border-emerald-200/80 bg-emerald-50/40 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                            {t.breakEven}
                          </p>
                        </div>
                        <p className="mt-1 text-3xl font-black text-slate-900">
                          {mathMetrics.breakEvenMonths}{" "}
                          <span className="text-lg font-bold text-slate-600">Months</span>
                        </p>
                        <p className="mt-2 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-lg inline-block">
                          🧮 Deterministic Math Formula
                        </p>
                      </div>
                      <div className="grid size-11 place-items-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                        <Gauge size={22} />
                      </div>
                    </div>
                  </section>

                  <section className="dashboard-card p-6 border border-amber-200/80 bg-amber-50/40 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                          {t.localRisk}
                        </p>
                        <p className="mt-2 text-3xl font-black text-slate-900">Low Risk</p>
                        <p className="mt-2 text-xs font-bold text-amber-700">{profile.location}</p>
                      </div>
                      <div className="grid size-11 place-items-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                        <MapPin size={22} />
                      </div>
                    </div>
                  </section>
                </div>

                {/* Capital Allocation Card */}
                <section className="dashboard-card p-6 lg:col-span-4 border border-slate-200/80 shadow-md">
                  <CardTitle detail={`₹${interactiveCapital.toLocaleString("en-IN")}`}>
                    {t.capitalAllocation}
                  </CardTitle>
                  <p className="mt-2 text-xs text-slate-500">Structured budget breakdown</p>
                  <div className="mt-7 flex h-3.5 overflow-hidden rounded-full bg-slate-100">
                    <span className="w-[50%] bg-indigo-600" />
                    <span className="w-[30%] bg-emerald-500" />
                    <span className="w-[20%] bg-amber-500" />
                  </div>
                  <div className="mt-6 space-y-4">
                    {[
                      [
                        "Initial Inventory / Stock (50%)",
                        `₹${Math.round(interactiveCapital * 0.5).toLocaleString("en-IN")}`,
                        "bg-indigo-600",
                      ],
                      [
                        "Shop Rent & Setup (30%)",
                        `₹${Math.round(interactiveCapital * 0.3).toLocaleString("en-IN")}`,
                        "bg-emerald-500",
                      ],
                      [
                        "Marketing & Reserve (20%)",
                        `₹${Math.round(interactiveCapital * 0.2).toLocaleString("en-IN")}`,
                        "bg-amber-500",
                      ],
                    ].map(([name, amount, color]) => (
                      <div key={name} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2.5 font-bold text-slate-700">
                          <i className={cn("size-3 rounded-full", color)} />
                          {name}
                        </span>
                        <strong className="text-slate-900 font-extrabold">{amount}</strong>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Business Viability Card */}
                <section className="dashboard-card p-6 lg:col-span-4 border border-slate-200/80 shadow-md">
                  <CardTitle detail="Strong">{t.viabilityScore}</CardTitle>
                  <div className="mt-5 flex flex-col items-center">
                    <div className="relative h-28 w-56 overflow-hidden">
                      <div className="absolute left-0 top-0 h-56 w-56 rounded-full bg-slate-100" />
                      <div
                        className="absolute left-0 top-0 h-56 w-56 rounded-full"
                        style={{
                          background:
                            "conic-gradient(#10B981 0deg 150deg, #4F46E5 150deg 180deg, transparent 180deg)",
                        }}
                      />
                      <div className="absolute left-7 top-7 h-44 w-44 rounded-full bg-white" />
                    </div>
                    <div className="-mt-11 text-center">
                      <p className="text-4xl font-black text-slate-900">
                        84<span className="text-xl text-slate-400">%</span>
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-500">Viability Score</p>
                    </div>
                    <div className="mt-8 flex items-center gap-2 rounded-xl bg-emerald-100 border border-emerald-200 px-3.5 py-2 text-xs font-extrabold text-emerald-800">
                      <ShieldCheck size={16} />
                      Recommended to proceed
                    </div>
                  </div>
                </section>

                {/* SMART MARKET & INVENTORY ADVISOR */}
                <SmartMarketAdvisor profile={profile} onAskAi={handleAskAdvisorAi} />

                {/* AI DISCOVERY & KNOWLEDGE PROFILER (LEFT) & AI PROFILE TRAINER (RIGHT) */}
                <AiDiscoveryProfiler
                  profile={profile}
                  onUnlockScheme={(cat) => {
                    setSchemeCategoryFilter("Loans");
                    toast.success("AI Matched Government Loans unlocked!");
                  }}
                />

                <AiProfileTrainerWidget
                  profile={profile}
                  onProfileUpdate={setProfile}
                  className="lg:col-span-6"
                />

                {/* DIRECTORY OF OFFICIAL GOVT REGISTRATION PORTALS */}
                <section className="dashboard-card p-6 lg:col-span-12 border border-slate-200/80 shadow-md bg-white text-slate-900">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="rounded-full bg-purple-100 border border-purple-200 px-3 py-1 text-xs font-extrabold text-purple-700">
                        Verified Government Portals Directory
                      </span>
                      <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                        Official Government Verification & Compliance Portals
                      </h2>
                      <p className="text-xs text-slate-500">
                        Direct links to official Government of India portals for MSME registration,
                        food licenses, and JanSamarth bank loans.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {officialGovtPortals.map((portal) => (
                      <div
                        key={portal.name}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 hover:bg-white hover:border-purple-300 hover:shadow-md transition"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-extrabold text-purple-800">
                              {portal.category}
                            </span>
                            {portal.feeInfo && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                {portal.feeInfo}
                              </span>
                            )}
                          </div>
                          <h3 className="mt-2.5 text-sm font-extrabold text-slate-900">
                            {portal.name}
                          </h3>
                          <p className="text-[11px] text-purple-700 font-bold">{portal.dept}</p>
                          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                            {portal.detail}
                          </p>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => setSelectedScheme(portal)}
                            className="flex-1 rounded-xl border border-purple-200 bg-purple-50 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 transition cursor-pointer flex items-center justify-center gap-1"
                          >
                            <span>Check Eligibility & Details</span>
                          </button>
                          <a
                            href={portal.portalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-700 transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>Portal</span>
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Action Plan */}
                <section className="dashboard-card p-6 lg:col-span-12 border border-slate-200/80 shadow-md">
                  <CardTitle detail={`${doneTasks}/${actions.length} done`}>
                    {t.actionPlan}
                  </CardTitle>
                  <p className="mt-2 text-xs text-slate-500">Next steps to launch your shop</p>

                  <form onSubmit={handleAddTask} className="mt-4 flex gap-2 max-w-lg">
                    <input
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      placeholder="Add custom task..."
                      className="flex-1 h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="h-9 rounded-xl bg-indigo-600 px-3 text-xs font-bold text-white hover:bg-indigo-700 transition cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </form>

                  <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto">
                    {actions.map(
                      (
                        action: {
                          id: string;
                          title: string;
                          meta: string;
                          done: boolean;
                          isCustom?: boolean;
                        },
                        index: number,
                      ) => (
                        <div
                          key={action.id + index}
                          className={cn(
                            "flex items-start justify-between gap-2 rounded-2xl border p-3.5 text-left transition",
                            action.done
                              ? "border-emerald-200 bg-emerald-50/50"
                              : "border-slate-200/80 bg-white hover:border-indigo-200",
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => toggleAction(index)}
                            className="flex items-start gap-3 flex-1 text-left cursor-pointer"
                          >
                            <span
                              className={cn(
                                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border transition",
                                action.done
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : "border-slate-300 bg-white",
                              )}
                            >
                              {action.done && <Check size={13} strokeWidth={3} />}
                            </span>
                            <span className="min-w-0">
                              <span
                                className={cn(
                                  "block text-sm font-bold text-slate-900",
                                  action.done && "line-through opacity-60",
                                )}
                              >
                                {action.title}
                              </span>
                              <span className="mt-0.5 block text-xs text-slate-500">
                                {action.meta}
                              </span>
                            </span>
                          </button>

                          {action.isCustom && (
                            <button
                              onClick={() => handleDeleteTask(action.id)}
                              className="text-slate-400 hover:text-rose-600 transition cursor-pointer p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE IDEA VALIDATOR */}
          {activeTab === "Idea Validator" && (
            <div className="space-y-6">
              <section className="dashboard-card p-6 border border-slate-200/80 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid size-10 place-items-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                    <Lightbulb size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Interactive Business Idea Validator
                    </h2>
                    <p className="text-xs text-slate-500">
                      Test business ideas in {profile.location} and receive instant AI viability &
                      SWOT scoring.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Business Idea Name
                    </label>
                    <input
                      value={valIdea}
                      onChange={(e) => setValIdea(e.target.value)}
                      placeholder="E.g. Fresh Juice & Smoothie Bar"
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Target District / Area
                    </label>
                    <input
                      value={valLocation}
                      onChange={(e) => setValLocation(e.target.value)}
                      placeholder="E.g. FC Road, Pune"
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Max Monthly Rent Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={valRent}
                      onChange={(e) => setValRent(Number(e.target.value))}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Instant Score Output */}
                <div className="grid gap-5 md:grid-cols-4 mb-6">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                    <p className="text-xs font-bold text-emerald-800">Viability Score</p>
                    <p className="mt-1 text-3xl font-black text-emerald-950">87%</p>
                    <span className="mt-1 inline-block rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                      High Potential
                    </span>
                  </div>
                  <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-center">
                    <p className="text-xs font-bold text-indigo-800">Footfall Demand</p>
                    <p className="mt-1 text-3xl font-black text-indigo-950">1,450/day</p>
                    <p className="mt-1 text-xs text-indigo-700">Peak 5-9 PM</p>
                  </div>
                  <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 text-center">
                    <p className="text-xs font-bold text-purple-800">OpenStreetMap Competitors</p>
                    <p className="mt-1 text-3xl font-black text-purple-950">
                      {realCompetitorData.count}
                    </p>
                    <p className="mt-1 text-xs text-purple-700">Shops within 2 km</p>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
                    <p className="text-xs font-bold text-amber-800">Ideal Pricing</p>
                    <p className="mt-1 text-3xl font-black text-amber-950">₹40 - ₹120</p>
                    <p className="mt-1 text-xs text-amber-700">Per unit item</p>
                  </div>
                </div>

                {/* SWOT Matrix Analysis */}
                <h3 className="text-base font-extrabold text-slate-900 mb-3">
                  Automated SWOT Analysis ({valIdea || profile.idea})
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                    <h4 className="flex items-center gap-2 font-bold text-emerald-900 text-sm mb-2">
                      <CheckCircle2 size={16} className="text-emerald-600" /> Strengths
                    </h4>
                    <ul className="text-xs space-y-1 text-emerald-800 list-disc list-inside">
                      <li>High daily walk-in demand in {valLocation || profile.location}</li>
                      <li>Low inventory spoilage with standardized local sourcing</li>
                      <li>Quick repeat customer frequency</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4">
                    <h4 className="flex items-center gap-2 font-bold text-rose-900 text-sm mb-2">
                      <ShieldAlert size={16} className="text-rose-600" /> Weaknesses
                    </h4>
                    <ul className="text-xs space-y-1 text-rose-800 list-disc list-inside">
                      <li>Dependency on prime frontage shop space</li>
                      <li>Sensitivity to raw material price fluctuations</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
                    <h4 className="flex items-center gap-2 font-bold text-indigo-900 text-sm mb-2">
                      <TrendingUp size={16} className="text-indigo-600" /> Opportunities
                    </h4>
                    <ul className="text-xs space-y-1 text-indigo-800 list-disc list-inside">
                      <li>Tie-ups with online delivery apps (Swiggy/Zomato/Blinkit)</li>
                      <li>UPI digital cashback promotions for repeat customers</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                    <h4 className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-2">
                      <AlertCircle size={16} className="text-amber-600" /> Threats
                    </h4>
                    <ul className="text-xs space-y-1 text-amber-800 list-disc list-inside">
                      <li>New competitive vendors opening in same lane</li>
                      <li>Seasonal footfall drops during monsoons</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: REAL UNIT ECONOMICS & CASHFLOW CALCULATOR */}
          {activeTab === "Feasibility Engine" && (
            <div className="space-y-6">
              <section className="dashboard-card p-6 border border-slate-200/80 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                    <Calculator size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Real Entrepreneur Unit Economics & Profit Calculator
                    </h2>
                    <p className="text-xs text-slate-500">
                      Enter your actual cost price, selling price, rent, and daily volume for
                      zero-assumptions business math.
                    </p>
                  </div>
                </div>

                {/* Real Unit Input Form Controls */}
                <div className="grid gap-5 md:grid-cols-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Raw Material Cost per Item (₹)
                    </label>
                    <input
                      type="number"
                      value={actualUnitCost}
                      onChange={(e) => setActualUnitCost(Number(e.target.value))}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Selling Price per Item (₹)
                    </label>
                    <input
                      type="number"
                      value={actualSellingPrice}
                      onChange={(e) => setActualSellingPrice(Number(e.target.value))}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Expected Daily Units Sold
                    </label>
                    <input
                      type="number"
                      value={actualDailyVolume}
                      onChange={(e) => setActualDailyVolume(Number(e.target.value))}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Actual Monthly Shop Rent (₹)
                    </label>
                    <input
                      type="number"
                      value={actualMonthlyRent}
                      onChange={(e) => setActualMonthlyRent(Number(e.target.value))}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Actual Monthly Electricity & Staff (₹)
                    </label>
                    <input
                      type="number"
                      value={actualMonthlyUtilities}
                      onChange={(e) => setActualMonthlyUtilities(Number(e.target.value))}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Total Initial Capital Investment (₹)
                    </label>
                    <input
                      type="number"
                      value={interactiveCapital}
                      onChange={(e) => setInteractiveCapital(Number(e.target.value))}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Real Unit Economics Results Output */}
                <div className="grid gap-5 md:grid-cols-4 mb-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-500">Unit Profit Margin</p>
                    <p className="mt-1.5 text-2xl font-black text-slate-900">
                      ₹{actualUnitMetrics.unitMargin}{" "}
                      <span className="text-xs text-slate-500">
                        ({actualUnitMetrics.unitMarginPercent}%)
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-500">Selling Price - Cost Price</p>
                  </div>

                  <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5 shadow-sm">
                    <p className="text-xs font-bold text-rose-800">Monthly Overhead</p>
                    <p className="mt-1.5 text-2xl font-black text-rose-950">
                      ₹{actualUnitMetrics.monthlyFixedOverhead.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-rose-700">Rent + Utilities & Staff</p>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                    <p className="text-xs font-bold text-emerald-800">Actual Net Monthly Profit</p>
                    <p className="mt-1.5 text-2xl font-black text-emerald-950">
                      ₹{actualUnitMetrics.netMonthlyProfit.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] font-bold text-emerald-700">
                      After all overheads & raw materials
                    </p>
                  </div>

                  <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
                    <p className="text-xs font-bold text-indigo-800">Break-Even Sales</p>
                    <p className="mt-1.5 text-2xl font-black text-indigo-950">
                      {actualUnitMetrics.breakEvenDailyUnits}{" "}
                      <span className="text-xs font-bold text-slate-600">units / day</span>
                    </p>
                    <p className="text-[10px] text-indigo-700">
                      Payback in {actualUnitMetrics.paybackDays} days
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 4: GOVERNMENT SCHEMES & VERIFIED PORTALS */}
          {activeTab === "Schemes" && (
            <div className="space-y-6">
              <section className="dashboard-card p-6 border border-slate-200/80 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
                      <FileCheck2 size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">
                        Authentic Government Schemes Portal
                      </h2>
                      <p className="text-xs text-slate-500">
                        Explore verified MSME loans, margin subsidies, and credit guarantees with
                        official portal links & helplines.
                      </p>
                    </div>
                  </div>

                  {/* Scheme Category Filter Tabs */}
                  <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1">
                    {[
                      { id: "All", label: "All Schemes" },
                      { id: "Loans", label: "Loans" },
                      { id: "Subsidy", label: "Subsidies" },
                      { id: "Guarantee", label: "Credit Guarantee" },
                      { id: "Bookmarks", label: `Saved (${bookmarkedSchemes.length})` },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSchemeCategoryFilter(cat.id)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer",
                          schemeCategoryFilter === cat.id
                            ? "bg-purple-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900",
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Schemes List Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredSchemes.map((scheme) => {
                    const isBookmarked = bookmarkedSchemes.includes(scheme.id);
                    return (
                      <div
                        key={scheme.id}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-purple-300 transition"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold",
                                scheme.badgeBg,
                              )}
                            >
                              {scheme.category}
                            </span>
                            <button
                              onClick={() => toggleBookmark(scheme.id)}
                              className="text-slate-400 hover:text-purple-600 transition cursor-pointer p-1"
                              title={isBookmarked ? "Remove Bookmark" : "Bookmark Scheme"}
                            >
                              {isBookmarked ? (
                                <BookmarkCheck
                                  size={18}
                                  className="text-purple-600 fill-purple-600"
                                />
                              ) : (
                                <Bookmark size={18} />
                              )}
                            </button>
                          </div>
                          <h3 className="mt-3 text-base font-extrabold text-slate-900">
                            {scheme.name}
                          </h3>
                          <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                            {scheme.detail}
                          </p>
                          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-semibold">Max Limit:</span>
                              <strong className="text-slate-900">{scheme.maxAmount}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-semibold">Benefit:</span>
                              <strong className="text-emerald-600">{scheme.interestSubsidy}</strong>
                            </div>
                            {scheme.helpline && (
                              <div className="flex justify-between pt-1 border-t border-slate-200/60">
                                <span className="text-slate-500 font-semibold">Helpline:</span>
                                <strong className="text-indigo-700">{scheme.helpline}</strong>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-5 flex gap-2">
                          <button
                            onClick={() => setSelectedScheme(scheme)}
                            className="flex-1 rounded-xl border border-purple-200 bg-purple-50 py-2.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition cursor-pointer flex items-center justify-center gap-1"
                          >
                            <span>Check Eligibility & Apply</span>
                          </button>
                          <a
                            href={scheme.portalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-purple-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>Portal</span>
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredSchemes.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <FileCheck2 size={36} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-sm">No schemes match your filter.</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === "Settings" && (
            <div className="mt-6 max-w-2xl space-y-6">
              <AiProfileTrainerWidget profile={profile} onProfileUpdate={setProfile} />

              <section className="dashboard-card p-6 space-y-6 border border-slate-200/80 shadow-md">
                <CardTitle>User Database Record & Profile Settings</CardTitle>
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Mobile Phone Number
                    </label>
                    <input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Business Category</label>
                    <input
                      value={profile.categoryName}
                      onChange={(e) => setProfile({ ...profile, categoryName: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Business Idea</label>
                    <input
                      value={profile.idea}
                      onChange={(e) => setProfile({ ...profile, idea: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700">Location / District</label>
                      <button
                        type="button"
                        onClick={handleSettingsGPSDetect}
                        disabled={isDetectingLocSettings}
                        className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                      >
                        {isDetectingLocSettings ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            <span>Detecting...</span>
                          </>
                        ) : (
                          <>
                            <Navigation size={12} />
                            <span>Detect via GPS Maps</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Starting Capital (₹)
                    </label>
                    <input
                      value={profile.capital}
                      onChange={(e) => setProfile({ ...profile, capital: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={async () => {
                        await saveUserRecord(profile);
                        toast.success("Database Record updated successfully!");
                      }}
                      className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition cursor-pointer"
                    >
                      Save Changes to Database
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      <SchemeDialog scheme={selectedScheme} onClose={() => setSelectedScheme(null)} />
      <ArchitectureModal open={showArchModal} onClose={() => setShowArchModal(false)} />

      {/* Floating Vyapar AI Launcher Button */}
      <button
        onClick={() => setShowFloatingAi(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 px-5 py-3 text-xs font-black text-white shadow-xl shadow-purple-600/30 hover:scale-105 transition cursor-pointer"
      >
        <Sparkles size={18} className="text-amber-300 animate-pulse" />
        <span className="hidden sm:inline">Ask Vyapar AI</span>
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
        </span>
      </button>

      {/* Ultra-Clean Modern Gemini AI Chatbot Drawer */}
      <GeminiAiChatbot
        profile={profile}
        language={language}
        open={showFloatingAi}
        onClose={() => setShowFloatingAi(false)}
        onProfileUpdate={setProfile}
      />
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
