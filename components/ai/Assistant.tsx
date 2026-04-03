"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Sparkles, Zap, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestoreCollection } from "@/hooks/useFirestore";

export function Assistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{role: "user"|"ai", content: string}[]>([
    { role: "ai", content: "Bonjour ! Je suis Nommo, votre assistant exécutif. En quoi puis-je vous aider pour le pilotage de vos entreprises aujourd'hui ?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: sales } = useFirestoreCollection("sales");
  const { data: leads } = useFirestoreCollection("leads");
  const { data: companies } = useFirestoreCollection("companies");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage = prompt;
    setPrompt("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const dbStats = `L'utilisateur a ${sales?.length || 0} ventes, ${leads?.length || 0} prospects actifs sur ${companies?.length || 0} entreprises.
      Ventes: ${JSON.stringify(sales || []).substring(0, 800)}
      Leads: ${JSON.stringify(leads || []).substring(0, 500)}`;

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage, contextData: dbStats }),
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

  return (
    <>
      {/* Dynamic Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            {/* Pulse Rings */}
            <div className="absolute inset-0 rounded-full bg-dogon-or animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-full bg-dogon-or animate-ping opacity-10 [animation-delay:0.5s]"></div>
            
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-4 rounded-full bg-dogon-or text-dogon-nuit shadow-[0_0_20px_rgba(202,174,103,0.4)] hover:scale-110 active:scale-95 transition-all group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
              <BrainCircuit className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassmorphism Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 h-[550px] z-50 bg-dogon-card/90 backdrop-blur-xl border border-dogon-or/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
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
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-dogon-muted hover:text-white hover:bg-white/5 rounded-md transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ x: msg.role === "user" ? 10 : -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={idx} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    msg.role === "user" 
                      ? "bg-dogon-indigo text-white rounded-br-none border border-white/10" 
                      : "bg-dogon-sirius/30 backdrop-blur-md border border-dogon-sirius text-dogon-text rounded-bl-none leading-relaxed"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
