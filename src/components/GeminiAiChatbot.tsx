import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Trash2,
  X,
  Bot,
  User,
  Key,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  Calculator,
  ShoppingBag,
  Zap,
  Cpu,
  BrainCircuit,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  FileText,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { UserRecord } from "@/lib/db";
import { cn, parseCapitalNumber } from "@/lib/utils";
import { AiProfileTrainerWidget } from "@/components/AiProfileTrainerWidget";

interface ChatMessage {
  id: string;
  from: "user" | "ai";
  text: string;
  timestamp: string;
  modelUsed?: string;
  feedback?: "up" | "down";
}

interface GeminiAiChatbotProps {
  profile: UserRecord;
  language: string;
  open: boolean;
  onClose: () => void;
  onProfileUpdate?: (updated: UserRecord) => void;
}

export function GeminiAiChatbot({
  profile,
  language,
  open,
  onClose,
  onProfileUpdate,
}: GeminiAiChatbotProps) {
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("vyapar_chat_history") : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // Fall back
      }
    }
    const capFormatted = parseCapitalNumber(profile?.capital).toLocaleString("en-IN");
    return [
      {
        id: "welcome-1",
        from: "ai",
        text: `Hey ${profile?.fullName || "Entrepreneur"}! 👋 What can I help you with today?\n\nI have loaded your active profile:\n• **Business**: ${profile?.idea || "Micro Business"} (${profile?.categoryName || "Retail Shop"})\n• **Location**: ${profile?.location || "Local Market"}\n• **Capital**: ₹${capFormatted}\n\nAsk me about **PM Mudra loans**, **exact profit math**, **wholesale sourcing mandis**, or **mandatory permits**!`,
        timestamp: "Just now",
        modelUsed: "Vyapar AI Agent",
      },
    ];
  });

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Attachment state for document upload simulation
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Model Selection & API Keys
  const [selectedEngine, setSelectedEngine] = useState<"gemini" | "groq" | "deepseek">(() => {
    return (
      (typeof window !== "undefined" ? (localStorage.getItem("vyapar_ai_engine") as any) : null) ||
      "gemini"
    );
  });
  const [apiKey, setApiKey] = useState<string>(() => {
    return typeof window !== "undefined" ? localStorage.getItem("gemini_api_key") || "" : "";
  });
  const [groqApiKey, setGroqApiKey] = useState<string>(() => {
    return typeof window !== "undefined" ? localStorage.getItem("groq_api_key") || "" : "";
  });
  const [showKeyModal, setShowKeyModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save chat history & engine preference
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem("vyapar_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vyapar_ai_engine", selectedEngine);
    }
  }, [selectedEngine]);

  // Auto scroll to bottom
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, messages, isThinking]);

  // Voice Speech Synthesis
  function handleSpeak(id: string, text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Text-to-Speech is not supported on this browser.");
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`~•\[\]]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === "हिंदी" ? "hi-IN" : language === "मराठी" ? "mr-IN" : "en-IN";
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  }

  // Thumbs Feedback Handler
  function handleFeedback(id: string, rating: "up" | "down") {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, feedback: rating } : msg)));
    if (rating === "up") {
      toast.success("Thanks for your positive feedback! 👍");
    } else {
      toast.info("Feedback recorded. We'll refine response accuracy.");
    }
  }

  // Copy to clipboard
  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Advice copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Re-sync active user profile name, business details & capital into chat welcome message dynamically
  useEffect(() => {
    if (!profile) return;
    const capNum = parseCapitalNumber(profile.capital);
    const formattedCap = capNum.toLocaleString("en-IN");
    const activeName = profile.fullName ? profile.fullName.trim() : "Entrepreneur";
    const idea = profile.idea || "Micro Business";
    const location = profile.location || "Local Market";
    const cat = profile.categoryName || "Retail Shop";

    const newWelcomeText = `Hey ${activeName}! 👋 What can I help you with today?\n\nI have loaded your active profile:\n• **Business**: ${idea} (${cat})\n• **Location**: ${location}\n• **Capital**: ₹${formattedCap}\n\nAsk me about **PM Mudra loans**, **exact profit math**, **wholesale sourcing mandis**, or **mandatory permits**!`;

    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const first = prev[0];
      if (
        first &&
        first.from === "ai" &&
        (first.id.startsWith("welcome") ||
          first.text.includes("Ramesh") ||
          first.text.includes("NaN") ||
          !first.text.includes(activeName) ||
          !first.text.includes(formattedCap))
      ) {
        const updated = [...prev];
        updated[0] = { ...first, text: newWelcomeText };
        return updated;
      }
      return prev;
    });
  }, [profile, open]);

  // Clear Chat
  function handleClearChat() {
    const capNum = parseCapitalNumber(profile?.capital);
    const formattedCap = capNum.toLocaleString("en-IN");
    const activeName = profile?.fullName ? profile.fullName.trim() : "Entrepreneur";

    const welcomeMsg: ChatMessage = {
      id: Date.now().toString(),
      from: "ai",
      text: `Hey ${activeName}! 👋 Chat reset!\n\nI have loaded your active profile:\n• **Business**: ${profile?.idea || "Micro Business"} (${profile?.categoryName || "Retail Shop"})\n• **Location**: ${profile?.location || "Local Market"}\n• **Capital**: ₹${formattedCap}\n\nAsk me anything about your business!`,
      timestamp: "Just now",
      modelUsed: "Vyapar AI Agent",
    };
    setMessages([welcomeMsg]);
    toast.success("Chat history refreshed with active profile!");
  }

  // Voice Input (Speech Recognition)
  function startVoiceInput() {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : undefined;

    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "हिंदी" ? "hi-IN" : language === "मराठी" ? "mr-IN" : "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };

    recognition.start();
  }

  // Attachment handler
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file.name);
      toast.success(`Attached file: ${file.name}`);
    }
  }

  // Save API keys
  function handleSaveKeys() {
    if (typeof window !== "undefined") {
      localStorage.setItem("gemini_api_key", apiKey);
      localStorage.setItem("groq_api_key", groqApiKey);
    }
    setShowKeyModal(false);
    toast.success("AI Configuration saved!");
  }

  // Generate dynamic AI response (Live LLM API + Conversational Fallback)
  async function getAiResponse(
    userQuery: string,
    history: ChatMessage[],
  ): Promise<{ text: string; modelName: string }> {
    const systemPrompt = `You are Vyapar AI Co-Pilot, an elite Indian hyper-local micro-business consultant for rural and urban entrepreneurs.
User Business Profile & AI Trained Context:
- Name: ${profile.fullName || "Entrepreneur"}
- Business Idea: ${profile.idea || "Micro Business"}
- Category: ${profile.categoryName || "Retail Shop"}
- Location: ${profile.location || "Tier-2/3 District in India"}
- Starting Capital Budget: ₹${profile.capital || "50000"}
- Target Customers: ${profile.targetAudience || "Local Residents"}
- Operating Premises: ${profile.premisesType || "Rented Commercial Shop"}
- Target Monthly Profit Goal: ${profile.monthlyGoal || "₹50,000 / month"}
- Top Daily Business Bottleneck: ${profile.mainChallenge || "Customer Footfall & Wholesale Sourcing"}
- Nearby Competitor Density: ${profile.competitorCount || "Moderate (2-5 shops)"}
- Digital & Legal Registrations: ${profile.hasGstOrUdyam || "Udyam MSME + UPI Active"}
- Preferred Language: ${language}

Task: Provide clear, non-generic, natural, hyper-local business advice. If the user asks a simple greeting ("hi", "hello", "hey"), greet them warmly and ask how to help. Include specific numbers, margins, real government portals (udyamregistration.gov.in, jansamarth.in, kviconline.gov.in, foscos.fssai.gov.in), and actionable steps. Format with clean Markdown headers, bold text, and bullet points.`;

    // Filter recent chat turns for multi-turn context memory (excluding generic welcome)
    const recentHistory = history.slice(-6).filter((m) => !m.id.startsWith("welcome"));

    // 1. Groq / Llama-3.3-70B API
    if (selectedEngine === "groq" && groqApiKey) {
      try {
        const groqMessages = [
          { role: "system", content: systemPrompt },
          ...recentHistory.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
          { role: "user", content: userQuery },
        ];

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: groqMessages,
            temperature: 0.6,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) return { text: reply, modelName: "Groq Llama-3.3 70B" };
        }
      } catch (e) {
        console.warn("Groq API error", e);
      }
    }

    // 2. Google Gemini REST API
    const geminiKey =
      apiKey ||
      (import.meta as unknown as { env: Record<string, string> }).env?.["VITE_GEMINI_API_KEY"];

    if (geminiKey) {
      const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];

      const geminiContents = [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nUser Initial Inquiry Context.` }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am ready to advise you on your business." }],
        },
        ...recentHistory.map((m) => ({
          role: m.from === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        })),
        {
          role: "user",
          parts: [{ text: userQuery }],
        },
      ];

      for (const modelName of modelsToTry) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: geminiContents,
              }),
            },
          );

          if (res.ok) {
            const data = await res.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiText) return { text: aiText, modelName: `Google ${modelName}` };
          }
        } catch (err) {
          console.warn(`Gemini API (${modelName}) error:`, err);
        }
      }
    }

    // 3. Conversational AI Engine with Intent Analysis
    const synthesizedText = generateConversationalResponse(userQuery, profile, language);
    return { text: synthesizedText, modelName: "Vyapar AI Agent" };
  }

  // Handle Submit
  async function handleSubmit(e?: React.FormEvent, directQuery?: string) {
    if (e) e.preventDefault();
    const query = (directQuery || input).trim();
    if (!query || isThinking) return;

    const fullQuery = attachedFile ? `[Attached Document: ${attachedFile}]\n${query}` : query;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      from: "user",
      text: fullQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setAttachedFile(null);
    setIsThinking(true);

    try {
      const { text, modelName } = await getAiResponse(query, updatedMessages);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        from: "ai",
        text,
        timestamp: "Just now",
        modelUsed: modelName,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      toast.error("Failed to generate AI response. Please try again.");
    } finally {
      setIsThinking(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Drawer Window (Chatbase AI Agent Inspired UI) */}
      <div className="relative z-10 flex h-full w-full max-w-md sm:max-w-lg flex-col bg-slate-50 shadow-2xl border-l border-slate-200 transition-transform">
        {/* Sleek Dark Header Bar (Chatbase Style) */}
        <header className="flex items-center justify-between bg-slate-950 p-4 text-white shadow-md border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative grid size-9 place-items-center rounded-xl bg-slate-800 border border-slate-700 text-white shadow-inner">
              <Bot size={20} className="text-purple-400" />
              <span className="absolute -bottom-0.5 -right-0.5 flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500 border border-slate-950" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black tracking-tight text-white">Vyapar AI Agent</h2>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-extrabold text-purple-300 border border-slate-700">
                  {selectedEngine === "gemini"
                    ? "Gemini 2.0"
                    : selectedEngine === "groq"
                      ? "Groq 70B"
                      : "DeepSeek"}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                <span>{profile.location || "India"}</span>
                <span>&bull;</span>
                <span className="text-emerald-400 font-semibold">Online & Ready</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowTrainerModal((prev) => !prev)}
              className={cn(
                "rounded-xl px-2.5 py-1.5 transition cursor-pointer flex items-center gap-1 text-[11px] font-extrabold border",
                showTrainerModal
                  ? "bg-amber-400 text-slate-950 border-amber-300 shadow-sm"
                  : "text-amber-300 border-amber-400/30 hover:bg-white/10",
              )}
              title="Train AI Profile"
            >
              <BrainCircuit size={14} />
              <span className="hidden sm:inline">Train</span>
            </button>

            <button
              onClick={() => setShowKeyModal(true)}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
              title="Select AI Model & Configure Keys"
            >
              <Cpu
                size={16}
                className={apiKey || groqApiKey ? "text-amber-400" : "text-slate-400"}
              />
            </button>

            <button
              onClick={handleClearChat}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-rose-300 transition cursor-pointer"
              title="Clear Chat History"
            >
              <Trash2 size={16} />
            </button>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer ml-1"
              aria-label="Close Chat"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Collapsible In-Chat AI Trainer Widget */}
        {showTrainerModal && (
          <div className="p-3 bg-slate-900 border-b border-purple-800 animate-in slide-in-from-top-2">
            <AiProfileTrainerWidget
              profile={profile}
              onProfileUpdate={(updated) => {
                if (onProfileUpdate) onProfileUpdate(updated);
                toast.success("AI Profile updated for live chat context!");
              }}
            />
          </div>
        )}

        {/* AI Model & Keys Config Modal */}
        {showKeyModal && (
          <div className="bg-slate-900 text-white p-4 text-xs border-b border-purple-800 flex flex-col gap-3 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold flex items-center gap-1.5 text-amber-300 text-sm">
                <Zap size={16} /> Select Quality AI Engine & API Keys
              </span>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Preferred AI Model Engine:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "gemini", label: "Google Gemini", sub: "1.5 & 2.0 Flash" },
                  { id: "groq", label: "Groq AI", sub: "Llama-3.3 70B" },
                  { id: "deepseek", label: "DeepSeek R1", sub: "Analytical AI" },
                ].map((eng) => (
                  <button
                    key={eng.id}
                    type="button"
                    onClick={() => setSelectedEngine(eng.id as any)}
                    className={cn(
                      "rounded-xl p-2 text-left border transition cursor-pointer",
                      selectedEngine === eng.id
                        ? "border-purple-400 bg-purple-950/80 text-white shadow-sm"
                        : "border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800",
                    )}
                  >
                    <span className="block font-bold text-[11px]">{eng.label}</span>
                    <span className="block text-[9px] text-slate-400">{eng.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedEngine === "gemini" && (
              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">
                  Google Gemini API Key (Free at{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-amber-300"
                  >
                    Google AI Studio
                  </a>
                  ):
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-500"
                />
              </div>
            )}

            {selectedEngine === "groq" && (
              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">
                  Groq API Key (Free at{" "}
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-amber-300"
                  >
                    console.groq.com
                  </a>
                  ):
                </label>
                <input
                  type="password"
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-500"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={handleSaveKeys}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-black text-white hover:opacity-95 transition"
              >
                Save & Activate Model
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages Body (Chatbase Soft White/Grey Style) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col text-xs leading-relaxed max-w-[92%]",
                msg.from === "user" ? "ml-auto items-end" : "mr-auto items-start",
              )}
            >
              {/* Message Bubble Card */}
              <div
                className={cn(
                  "relative rounded-2xl p-4 shadow-xs transition-all text-xs sm:text-sm",
                  msg.from === "user"
                    ? "bg-slate-900 text-white rounded-tr-xs shadow-slate-900/10 font-medium"
                    : "bg-white text-slate-900 border border-slate-200/80 rounded-tl-xs shadow-slate-200/40",
                )}
              >
                {/* Formatted Content */}
                <div className="prose prose-xs max-w-none text-xs sm:text-sm leading-relaxed space-y-2">
                  <FormattedMessage text={msg.text} isUser={msg.from === "user"} />
                </div>
              </div>

              {/* Message Footer & Feedback Controls (Chatbase Style) */}
              <div
                className={cn(
                  "mt-1.5 flex items-center gap-2 text-[10px] text-slate-400 px-1 font-medium",
                  msg.from === "user" ? "justify-end" : "justify-start",
                )}
              >
                <span>{msg.timestamp}</span>

                {msg.from === "ai" && (
                  <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-2">
                    <button
                      onClick={() => handleFeedback(msg.id, "up")}
                      className={cn(
                        "p-1 rounded-md transition cursor-pointer hover:bg-slate-200/60",
                        msg.feedback === "up" ? "text-emerald-600 font-bold" : "text-slate-400",
                      )}
                      title="Thumbs Up - Good Response"
                    >
                      <ThumbsUp size={12} />
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, "down")}
                      className={cn(
                        "p-1 rounded-md transition cursor-pointer hover:bg-slate-200/60",
                        msg.feedback === "down" ? "text-rose-600 font-bold" : "text-slate-400",
                      )}
                      title="Thumbs Down - Needs Improvement"
                    >
                      <ThumbsDown size={12} />
                    </button>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer rounded-md"
                      title="Copy advice"
                    >
                      {copiedId === msg.id ? (
                        <Check size={12} className="text-emerald-600" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                    <button
                      onClick={() => handleSpeak(msg.id, msg.text)}
                      className={cn(
                        "p-1 rounded-md transition cursor-pointer",
                        speakingId === msg.id
                          ? "text-purple-600 animate-pulse"
                          : "text-slate-400 hover:text-purple-600",
                      )}
                      title="Text-to-Speech Audio"
                    >
                      {speakingId === msg.id ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator when AI is thinking */}
          {isThinking && (
            <div className="flex flex-col items-start mr-auto max-w-[85%] space-y-1">
              <div className="rounded-2xl rounded-tl-xs bg-white border border-slate-200 p-3.5 shadow-xs flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">
                  Vyapar AI Agent is replying...
                </span>
                <div className="flex gap-1">
                  <span
                    className="size-1.5 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="size-1.5 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="size-1.5 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips (Chatbase Style) */}
        <div className="bg-slate-100/90 border-t border-slate-200/80 p-2.5 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
          {[
            {
              label: "🎯 Scale Profit to ₹50k",
              prompt: `How can I scale monthly net profit to ₹50,000 for my ${profile.idea || "shop"} in ${profile.location || "my area"}?`,
            },
            {
              label: "🏛️ Mudra & PMEGP Loan",
              prompt: `Which collateral-free government loan (PM Mudra / PMEGP) applies to my ${profile.categoryName || "business"}?`,
            },
            {
              label: "📦 Sourcing Mandis",
              prompt: `Where can I source high-margin wholesale inventory near ${profile.location || "my area"}?`,
            },
            {
              label: "📊 Break-Even Math",
              prompt: `Calculate my daily break-even sales volume for ₹${profile.capital || "50000"} capital.`,
            },
            {
              label: "📋 Mandatory Licenses",
              prompt: `What licenses (FSSAI, Udyam MSME, Shop Act) do I need for ${profile.idea || "my shop"}?`,
            },
          ].map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleSubmit(undefined, chip.prompt)}
              className="shrink-0 rounded-xl bg-white border border-slate-200/90 hover:border-purple-300 hover:bg-purple-50/70 hover:text-purple-700 px-3 py-1.5 text-xs font-bold text-slate-700 transition shadow-2xs cursor-pointer flex items-center gap-1"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Attached File Indicator Badge */}
        {attachedFile && (
          <div className="bg-purple-50 border-t border-purple-200 px-4 py-1.5 text-xs text-purple-900 flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5 truncate">
              <FileText size={14} className="text-purple-600" />
              <span>Attached Document: {attachedFile}</span>
            </span>
            <button
              onClick={() => setAttachedFile(null)}
              className="text-purple-600 hover:text-purple-900 p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Floating Input Shell (Chatbase Style with Attachment & Mic) */}
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="border-t border-slate-200 bg-white p-3 flex items-center gap-2"
        >
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.png,.txt"
          />

          {/* Attachment Paperclip Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer"
            title="Attach business document or photo"
          >
            <Paperclip size={17} />
          </button>

          {/* Text Input Container */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your business..."
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3.5 pr-10 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 transition placeholder:text-slate-400"
            />

            {/* Voice Input Mic Button inside input */}
            <button
              type="button"
              onClick={startVoiceInput}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 grid size-7 place-items-center rounded-lg transition cursor-pointer",
                isListening
                  ? "text-rose-600 animate-pulse bg-rose-50"
                  : "text-slate-400 hover:text-slate-700",
              )}
              title="Voice Speech Input"
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>
          </div>

          {/* High Contrast Send Button (Chatbase Style) */}
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-xl text-white shadow-md transition cursor-pointer",
              input.trim() && !isThinking
                ? "bg-slate-950 hover:bg-slate-800 shadow-slate-900/20"
                : "bg-slate-300 cursor-not-allowed opacity-60",
            )}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}

// Markdown Formatter Helper Component for Rich Readable AI Advice
function FormattedMessage({ text, isUser }: { text: string; isUser: boolean }) {
  if (isUser) {
    return <span className="whitespace-pre-wrap font-medium">{text}</span>;
  }

  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 text-slate-800 font-sans">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        // Header lines (### or **)
        if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
          return (
            <h4
              key={i}
              className="font-black text-slate-900 text-xs sm:text-sm mt-2 text-slate-950 border-b border-slate-100 pb-1"
            >
              {trimmed.replace(/^#+\s*/, "")}
            </h4>
          );
        }

        // Bullet point lines
        if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
          const content = trimmed.replace(/^[•\-*]\s*/, "");
          return (
            <div
              key={i}
              className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-800 pl-1"
            >
              <span className="text-slate-950 font-bold mt-0.5">•</span>
              <span dangerouslySetInnerHTML={{ __html: parseBoldAndLinks(content) }} />
            </div>
          );
        }

        // Numbered steps
        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <div
              key={i}
              className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-800 pl-1 font-medium"
            >
              <span className="font-bold text-slate-950">{trimmed.match(/^\d+\./)?.[0]}</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: parseBoldAndLinks(trimmed.replace(/^\d+\.\s*/, "")),
                }}
              />
            </div>
          );
        }

        return (
          <p
            key={i}
            className="text-xs sm:text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseBoldAndLinks(trimmed) }}
          />
        );
      })}
    </div>
  );
}

function parseBoldAndLinks(str: string): string {
  // Convert markdown links [text](url)
  let parsed = str.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-600 font-bold hover:underline font-semibold flex-inline items-center gap-0.5">$1 ↗</a>',
  );
  // Convert **bold**
  parsed = parsed.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-black text-slate-950">$1</strong>',
  );
  return parsed;
}

// Conversational AI Engine with Smart Intent Interception (Zero Repetitive Messages)
function generateConversationalResponse(
  userQuery: string,
  profile: UserRecord,
  lang: string,
): string {
  const q = userQuery.trim().toLowerCase();
  const cleanQ = q.replace(/[^a-z0-9 ]/g, "");
  const loc = profile.location || "your local market";
  const biz = profile.idea || "your micro business";
  const cat = (profile.categoryName || "").toLowerCase();
  const capital = Number(profile.capital || 50000);
  const name = profile.fullName ? profile.fullName.split(" ")[0] : "Entrepreneur";

  // 1. Natural Greeting Intent Interception ("hi", "hello", "hey", "namaste", "hie")
  const isGreeting =
    cleanQ === "hi" ||
    cleanQ === "hello" ||
    cleanQ === "hey" ||
    cleanQ === "hie" ||
    cleanQ === "namaste" ||
    cleanQ === "good morning" ||
    cleanQ === "good evening" ||
    cleanQ === "good afternoon" ||
    cleanQ === "yo" ||
    cleanQ === "sup";

  if (isGreeting) {
    return `Hey ${name}! 👋 What can I help you with today?\n\nI have your active business profile loaded:\n• **Idea**: ${biz} (${profile.categoryName || "Retail Shop"})\n• **Location**: ${loc}\n• **Capital**: ₹${capital.toLocaleString("en-IN")}\n\nAsk me about **PM Mudra loans**, **unit economics profit math**, **wholesale mandis**, or **mandatory permits**!`;
  }

  // 2. Introduction Intent Interception ("who are you", "what can you do")
  const isIntro =
    cleanQ.includes("who are you") ||
    cleanQ.includes("what can you do") ||
    cleanQ.includes("what is your name") ||
    cleanQ.includes("help me");

  if (isIntro) {
    return `I am your **Vyapar AI Business Agent** ⚡!\n\nI provide hyper-local advice for micro-entrepreneurs in India:\n• **Govt Credit & Subsidies**: Match your shop with PM Mudra, PMEGP, and CGTMSE loans.\n• **Unit Economics**: Calculate daily break-even sales and profit margins.\n• **Wholesale Sourcing**: Find high-margin stock in nearby mandis.\n• **Permits**: Step-by-step guidance for FSSAI, Udyam MSME, and GST registrations.`;
  }

  // 3. Gratitude Intent Interception ("thanks", "thank you")
  const isThanks =
    cleanQ.includes("thanks") ||
    cleanQ.includes("thank you") ||
    cleanQ.includes("dhanyawad") ||
    cleanQ.includes("great thanks");

  if (isThanks) {
    return `You're very welcome, ${name}! 🙏\n\nI am always here 24/7 whenever you need more advice for your **${biz}**. Good luck with your business!`;
  }

  // Extract query keywords for dynamic topic synthesis
  const isLoan =
    q.includes("loan") ||
    q.includes("scheme") ||
    q.includes("mudra") ||
    q.includes("subsidy") ||
    q.includes("pmegp") ||
    q.includes("cgtmse") ||
    q.includes("svanidhi") ||
    q.includes("udyam") ||
    q.includes("govt") ||
    q.includes("government") ||
    q.includes("bank");
  const isFinance =
    q.includes("profit") ||
    q.includes("math") ||
    q.includes("break-even") ||
    q.includes("margin") ||
    q.includes("rent") ||
    q.includes("cost") ||
    q.includes("capital") ||
    q.includes("revenue") ||
    q.includes("money") ||
    q.includes("calculate") ||
    q.includes("price") ||
    q.includes("ticket");
  const isStock =
    q.includes("stock") ||
    q.includes("buy") ||
    q.includes("avoid") ||
    q.includes("inventory") ||
    q.includes("item") ||
    q.includes("supplier") ||
    q.includes("mandi") ||
    q.includes("wholesale");
  const isLocation =
    q.includes("location") ||
    q.includes("competitor") ||
    q.includes("density") ||
    q.includes("risk") ||
    q.includes("area") ||
    q.includes("footfall") ||
    q.includes("traffic");
  const isLegal =
    q.includes("license") ||
    q.includes("permit") ||
    q.includes("fssai") ||
    q.includes("gst") ||
    q.includes("register") ||
    q.includes("tax") ||
    q.includes("compliance");

  // 4. LOAN & GOVERNMENT SCHEMES ANALYSIS
  if (isLoan) {
    return `### 🏛️ Verified Government Scheme & Credit Analysis (${loc})

Based on your business context (**${biz}** in **${loc}** with ₹${capital.toLocaleString("en-IN")} capital):

1. **PM MUDRA Yojana (PMMY)**:
   • **Shishu Tier (Up to ₹50,000)**: 0% collateral, 0% processing fee. Best for initial stock purchase.
   • **Kishore Tier (₹50,000 to ₹5 Lakh)**: For shop lease & infrastructure setup. Apply via [jansamarth.in](https://www.jansamarth.in).

2. **PMEGP KVIC Margin Money Subsidy**:
   • **Subsidy Rate**: **35%** Govt Capital Subsidy in rural areas, **25%** in urban areas.
   • **Requirement**: Submit a 1-page Project Report (DPR). Apply on [kviconline.gov.in](https://www.kviconline.gov.in/pmegpeportal/).

3. **Udyam MSME Portal (Mandatory Pre-requisite)**:
   • Get your instant lifetime certificate on [udyamregistration.gov.in](https://udyamregistration.gov.in) (100% Free).`;
  }

  // 5. FINANCIAL MATH & UNIT ECONOMICS ANALYSIS
  if (isFinance) {
    const estRent = Math.round(capital * 0.2);
    const estStock = Math.round(capital * 0.5);
    const estReserve = Math.round(capital * 0.3);
    const dailyTargetUnits = Math.ceil((estRent + 4000) / (150 * 0.35 * 30));

    return `### 📊 Real Unit Economics & Cashflow Analysis for ${biz}

Financial breakdown tailored for **${biz}** in **${loc}**:

### Capital Allocation (₹${capital.toLocaleString("en-IN")} Total)
• **Initial Inventory & Stock (50%)**: ₹${estStock.toLocaleString("en-IN")}
• **Shop Rent & Setup (20%)**: ₹${estRent.toLocaleString("en-IN")}
• **Emergency Working Reserve (30%)**: ₹${estReserve.toLocaleString("en-IN")}

### Operational Profit Math
• **Expected Gross Profit Margin**: **35% – 48%**
• **Target Daily Sales Volume**: **~${dailyTargetUnits} items/day** to stay net profitable
• **Payback Period**: **3.8 – 4.5 Months** to fully recover capital`;
  }

  // 6. INVENTORY & WHOLESALE SOURCING
  if (isStock) {
    return `### 📦 Wholesale Inventory & Sourcing Strategy for ${biz}

### Sourcing Guidelines for ${loc}:
• **Fast-Rotating Stock (70%)**: Focus on items with under 14-day turnover cycle.
• **High-Margin Impulse Add-ons (30%)**: Place near UPI billing stand for 35%+ gross margin.
• **Wholesale Mandis**: Source directly from regional APMC markets within 50km of ${loc} to save 8-12% transport costs!`;
  }

  // 7. LICENSING & LEGAL COMPLIANCE
  if (isLegal) {
    return `### 📋 Legal Compliance & Official Registrations for ${biz}

Mandatory legal approvals required in **${loc}**:

1. **Udyam MSME Certificate**: Free registration on [udyamregistration.gov.in](https://udyamregistration.gov.in) in 15 minutes.
2. **FSSAI Food License**: ₹100/year basic registration for food setups on [foscos.fssai.gov.in](https://foscos.fssai.gov.in).
3. **GSTIN Registration**: Mandatory only if turnover exceeds ₹40 Lakh for Goods or ₹20 Lakh for Services ([gst.gov.in](https://www.gst.gov.in)).`;
  }

  // 8. LOCATION & COMPETITOR DENSITY
  if (isLocation) {
    return `### 📍 Location & Competitor Density Analysis (${loc})

### Site Selection Guidelines for ${biz}:
• **Rent Budget**: Keep rent under **15%** of projected monthly turnover.
• **Peak Traffic Hours**: 11:00 AM – 1:30 PM & 5:30 PM – 8:30 PM in ${loc}.
• **Competitive Edge**: Set up instant UPI QR & Soundbox for zero cash change delays!`;
  }

  // 9. DYNAMIC SPECIFIC ANSWER FOR CUSTOM QUESTIONS
  return `### 💡 Advice for ${biz} in ${loc}

Regarding **"${userQuery}"**:

• **Context**: For a **${biz}** in **${loc}** with ₹${capital.toLocaleString("en-IN")} starting capital.
• **Key Recommendation**: Focus on high-margin fast-moving items, set up UPI digital payments, and apply for zero-collateral **PM Mudra Shishu** loan.
• **Next Step**: Register your shop for free on [udyamregistration.gov.in](https://udyamregistration.gov.in) to claim government benefits.

Would you like detailed calculations for loan application or wholesale sourcing?`;
}
