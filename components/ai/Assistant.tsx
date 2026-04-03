"use client";

import { useState } from "react";
import { MessageSquareText, X, Send, Loader2, Sparkles } from "lucide-react";

export function Assistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{role: "user"|"ai", content: string}[]>([
    { role: "ai", content: "Bonjour ! Je suis Nommo, votre assistant exécutif. En quoi puis-je vous aider pour le pilotage de vos entreprises aujourd'hui ?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage = prompt;
    setPrompt("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: "ai", content: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: "ai", content: "Désolé, une erreur technique m'empêche de vous répondre. (Erreur API)" }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Erreur de connexion au serveur AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Bouton Flottant (Bot) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-dogon-or text-dogon-nuit shadow-lg shadow-dogon-or/20 hover:scale-105 transition-transform ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles className="h-6 w-6" />
      </button>

      {/* Fenêtre Chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] z-50 bg-dogon-card border border-dogon-or/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="p-4 bg-dogon-or/10 border-b border-dogon-or/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-dogon-or/20 rounded-md">
                <Sparkles className="h-4 w-4 text-dogon-or" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Nommo AI</h3>
                <p className="text-[10px] text-dogon-or uppercase tracking-wider">Assistant Exécutif</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-dogon-muted hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user" ? "bg-dogon-indigo text-white rounded-br-none" : "bg-dogon-sirius/50 border border-dogon-sirius text-dogon-text rounded-bl-none leading-relaxed"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-dogon-sirius/50 border border-dogon-sirius text-dogon-muted flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-dogon-or" /> 
                  <span className="text-xs">Réflexion Nommo...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-dogon-sirius bg-dogon-nuit">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Demander une analyse métier..."
                className="w-full bg-dogon-card border border-dogon-sirius rounded-full pl-4 pr-12 py-2.5 text-sm text-white placeholder-dogon-muted focus:outline-none focus:border-dogon-or focus:ring-1 focus:ring-dogon-or transition-colors"
              />
              <button 
                type="submit" 
                disabled={!prompt.trim() || isLoading}
                className="absolute right-1.5 p-1.5 bg-dogon-or text-dogon-nuit rounded-full disabled:opacity-50 hover:bg-dogon-or/80 transition-colors"
              >
                <Send className="h-4 w-4 ml-0.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
