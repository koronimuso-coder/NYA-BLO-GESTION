"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Sparkles, Zap, BrainCircuit } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export function Assistant() {
  const { userData } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [renderChat, setRenderChat] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{role: "user"|"ai", content: string}[]>([
    { role: "ai", content: "Bonjour ! Je suis Nommo, votre assistant exécutif. En quoi puis-je vous aider pour le pilotage de vos entreprises aujourd'hui ?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const lastPathnameRef = useRef(pathname);

  const { data: sales } = useFirestoreCollection("sales");
  const { data: leads } = useFirestoreCollection("leads");
  const { data: companies } = useFirestoreCollection("companies");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (pathname !== lastPathnameRef.current) {
      const getGreeting = () => {
        if (pathname.includes("/dashboard/galf")) return "Je vois que vous consultez le module GALF Formation. Voulez-vous une analyse de la rentabilité des sessions en cours ?";
        if (pathname.includes("/dashboard/flowers")) return "Bienvenue chez Yoela Flowers. Attention aux stocks périssables pour ce week-end !";
        if (pathname.includes("/dashboard/beauty")) return "Tableau de bord Beauté. Vos KPI de fidélisation sont en hausse de 5%.";
        if (pathname.includes("/dashboard/sales")) return "Vue Ventes. Nous avons plusieurs créances à régulariser aujourd'hui.";
        return null;
      };

      const greeting = getGreeting();
      if (greeting) {
        setMessages(prev => [...prev, { role: "ai", content: greeting }]);
      }
      lastPathnameRef.current = pathname;
    }
  }, [pathname, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage = prompt;
    setPrompt("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const dbStats = `L'utilisateur ${userData?.first_name || ""} est sur la page ${pathname}. 
      Statistiques: ${sales?.length || 0} ventes, ${leads?.length || 0} prospects actifs sur ${companies?.length || 0} entreprises.
      Ventes (Extraits): ${JSON.stringify(sales || []).substring(0, 500)}
      Leads (Extraits): ${JSON.stringify(leads || []).substring(0, 300)}`;

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           prompt: userMessage, 
           userName: userData?.first_name || "Directeur",
           contextData: dbStats 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: "ai", content: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: "ai", content: "Désolé, une erreur technique m'empêche de vous répondre. (Erreur API)" }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "ai", content: "Erreur de connexion au serveur AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const openChat = () => {
    setRenderChat(true);
    setIsOpen(true);
  };

  const closeChat = () => {
    if (chatRef.current) {
      gsap.to(chatRef.current, {
        y: 20, opacity: 0, scale: 0.95, duration: 0.3, ease: "power2.in", onComplete: () => {
          setIsOpen(false);
          setRenderChat(false);
        }
      });
    } else {
      setIsOpen(false);
      setRenderChat(false);
    }
  };

  useGSAP(() => {
    if (isOpen && chatRef.current) {
      gsap.fromTo(chatRef.current, 
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.2)" }
      );
    } else if (!isOpen && buttonRef.current && !renderChat) {
      gsap.fromTo(buttonRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
      );
    }
  }, [isOpen, renderChat]);

  // Animate new messages
  useGSAP(() => {
    if (isOpen && chatRef.current) {
      const messagesNodes = gsap.utils.toArray(".message-item");
      if (messagesNodes.length > 0) {
        const lastMessage = messagesNodes[messagesNodes.length - 1] as HTMLElement;
        const isUser = lastMessage.dataset.role === "user";
        gsap.fromTo(lastMessage, 
          { x: isUser ? 10 : -10, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    }
  }, [messages, isOpen]);

  return (
    <div ref={containerRef}>
      {/* Dynamic Floating Button */}
      {!renderChat && (
        <div
          ref={buttonRef}
          className="fixed bottom-6 right-6 z-50"
          style={{ opacity: 0, scale: 0 }}
        >
          {/* Pulse Rings */}
          <div className="absolute inset-0 rounded-full bg-dogon-or animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-full bg-dogon-or animate-ping opacity-10 [animation-delay:0.5s]"></div>
          
          <button
            onClick={openChat}
            className="relative p-4 rounded-full bg-dogon-or text-dogon-nuit shadow-[0_0_20px_rgba(202,174,103,0.4)] hover:scale-110 active:scale-95 transition-all group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
            <BrainCircuit className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Glassmorphism Chat Window */}
      {renderChat && (
        <div
          ref={chatRef}
          className="fixed bottom-6 right-6 w-80 md:w-96 h-[550px] z-50 bg-dogon-card/90 backdrop-blur-xl border border-dogon-or/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          style={{ opacity: 0, transform: "translateY(20px) scale(0.95)" }}
        >
          {/* Header */}
          <div className="p-4 bg-dogon-or/10 border-b border-dogon-or/20 flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-dogon-or to-transparent opacity-50"></div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2 bg-dogon-or/20 rounded-lg">
                  <Sparkles className="h-4 w-4 text-dogon-or" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-dogon-success rounded-full border border-dogon-card"></div>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Nommo AI</h3>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-2.5 w-2.5 text-dogon-or fill-dogon-or animate-pulse" />
                  <p className="text-[10px] text-dogon-or uppercase tracking-widest font-bold">L&apos;Esprit des Données</p>
                </div>
              </div>
            </div>
            <button onClick={closeChat} className="p-1.5 text-dogon-muted hover:text-white hover:bg-white/5 rounded-md transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`message-item flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                data-role={msg.role}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === "user" 
                    ? "bg-dogon-indigo text-white rounded-br-none border border-white/10" 
                    : "bg-dogon-sirius/30 backdrop-blur-md border border-dogon-sirius text-dogon-text rounded-bl-none leading-relaxed"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-dogon-sirius/20 border border-dogon-sirius/50 text-dogon-muted flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-dogon-or rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-dogon-or rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-dogon-or rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-dogon-or/70">Nommo distille...</span>
                </div>
              </div>
            )}
          </div>

          {/* Premium Input Container */}
          <div className="p-4 border-t border-dogon-sirius/50 bg-dogon-nuit/50 backdrop-blur-md">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Posez une question strategique..."
                className="w-full bg-dogon-card/50 border border-dogon-sirius rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-dogon-muted/50 focus:outline-none focus:border-dogon-or focus:ring-1 focus:ring-dogon-or transition-all"
              />
              <button 
                type="submit" 
                disabled={!prompt.trim() || isLoading}
                className="absolute right-1.5 p-2 bg-dogon-or text-dogon-nuit rounded-lg disabled:opacity-30 hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="text-center text-[9px] text-dogon-muted mt-2 opacity-50 uppercase tracking-tighter">
              IA Propulsée par Sirius Intelligence
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
