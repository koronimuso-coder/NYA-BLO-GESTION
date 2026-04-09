"use client";

import React, { useState, useRef } from "react";
import { 
  FileText, 
  Mail, 
  Share2, 
  FileSpreadsheet,
  Clock,
  ArrowRight,
  Sparkles,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ExportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".page-header", { y: -20, opacity: 0, duration: 0.8 });
    tl.from(".export-card", { 
      y: 20, 
      opacity: 0, 
      stagger: 0.1, 
      duration: 0.6 
    }, "-=0.4");
    
    tl.from(".history-item", {
      x: 20,
      opacity: 0,
      stagger: 0.05,
      duration: 0.5
    }, "-=0.2");
  }, { scope: container });

  const handleExport = (format: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Logic for real export would go here
    }, 2000);
  };

  return (
    <div ref={container} className="space-y-8 pb-12 relative">
      <div className="absolute inset-0 dogon-pattern opacity-5 pointer-events-none" />

      <div className="page-header flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-[#5C3D2E] font-dogon uppercase tracking-tight">Archives & Experts</h1>
          <p className="text-[#B89E7E] mt-1">Exportez la puissance de vos données commerciales.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-[#E8DCC4] shadow-sm">
           <button className="px-6 py-2.5 bg-[#5C3D2E] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg">Rapports</button>
           <button className="px-6 py-2.5 text-[#B89E7E] hover:text-[#5C3D2E] rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">Audit</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { title: "Rapport PDF", desc: "Format immuable pour impression", icon: FileText, format: "PDF", color: "bg-[#5C3D2E]/10 text-[#5C3D2E]" },
          { title: "Excel / CSV", desc: "Analyse brute et calculs", icon: FileSpreadsheet, format: "XLSX", color: "bg-[#A66037]/10 text-[#A66037]" },
          { title: "Envoi Email", desc: "Transmission directe sécurisée", icon: Mail, format: "EMAIL", color: "bg-[#D4AF37]/10 text-[#D4AF37]" },
          { title: "Lien Public", desc: "Consultation web dynamique", icon: Share2, format: "LINK", color: "bg-[#B89E7E]/10 text-[#B89E7E]" },
        ].map((item, i) => (
          <div key={i} className="export-card bg-white p-8 rounded-[40px] shadow-premium border border-[#E8DCC4] hover:border-[#D4AF37]/30 transition-all flex flex-col items-center text-center group">
             <div className={`${item.color} p-6 rounded-3xl mb-6 group-hover:scale-110 transition-transform relative overflow-hidden`}>
                <item.icon className="w-8 h-8 relative z-10" />
                <div className="absolute inset-0 dogon-pattern opacity-5" />
             </div>
             <h3 className="text-xl font-bold text-[#5C3D2E] font-dogon mb-2">{item.title}</h3>
             <p className="text-sm text-[#B89E7E] mb-8 leading-relaxed px-2">{item.desc}</p>
             <button 
                className="w-full py-4 rounded-2xl border-2 border-[#FAF3E0] text-[#5C3D2E] font-bold hover:bg-[#FAF3E0] transition-all flex items-center justify-center gap-2 group-hover:border-[#D4AF37]/50"
                onClick={() => handleExport(item.format)}
                disabled={isGenerating}
             >
                {isGenerating ? "Traitement..." : "Générer"}
                <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
         <div className="export-card lg:col-span-2 bg-white p-10 rounded-[48px] shadow-premium border border-[#E8DCC4] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF3E0]/50 rounded-bl-full -mr-32 -mt-32" />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#5C3D2E] rounded-xl flex items-center justify-center">
                     <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#5C3D2E] font-dogon">Configuration Maître</h3>
               </div>
               <span className="text-[10px] font-bold text-[#A66037] uppercase tracking-[0.3em]">Options Ancestrales</span>
            </div>
            
            <div className="space-y-8 relative z-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest pl-1">Cycle Temporel</label>
                     <div className="relative">
                        <select className="w-full p-5 rounded-2xl bg-[#FAF3E0]/30 border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold text-[#5C3D2E] appearance-none">
                           <option>Lune Actuelle (Mois)</option>
                           <option>Double Lune (60 jours)</option>
                           <option>Grande Récolte (Saison)</option>
                           <option>Cycle Annuel 2024</option>
                        </select>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest pl-1">Source de Données</label>
                     <div className="relative">
                        <select className="w-full p-5 rounded-2xl bg-[#FAF3E0]/30 border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold text-[#5C3D2E] appearance-none">
                           <option>Harmonie Totale (Toutes)</option>
                           <option>GALF SARL</option>
                           <option>NB FLOWERS</option>
                        </select>
                     </div>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest pl-1">Essences à extraire</label>
                  <div className="flex flex-wrap gap-4">
                     {["C.A", "Recouvrements", "Prospects", "Loyauté"].map(tag => (
                        <label key={tag} className="flex items-center gap-2 bg-[#FAF3E0]/50 px-6 py-4 rounded-2xl border-2 border-transparent hover:border-[#D4AF37]/30 cursor-pointer transition-all has-[:checked]:bg-[#5C3D2E] has-[:checked]:text-white shadow-sm">
                           <input type="checkbox" className="hidden" defaultChecked={["C.A", "Recouvrements"].includes(tag)} />
                           <span className="text-sm font-bold">{tag}</span>
                        </label>
                     ))}
                  </div>
               </div>

               <Button variant="gold" className="w-full h-16 rounded-[24px] text-lg shadow-gold relative overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-3">
                     Édifier le Rapport <FileText className="w-5 h-5" />
                  </span>
               </Button>
            </div>
         </div>

         <div className="export-card bg-white p-10 rounded-[48px] shadow-premium border border-[#E8DCC4]">
            <div className="flex items-center gap-3 mb-8">
               <Clock className="w-6 h-6 text-[#A66037]" />
               <h3 className="text-2xl font-bold text-[#5C3D2E] font-dogon">Généalogie</h3>
            </div>
            <div className="space-y-8">
               {[1,2,3,4].map(i => (
                  <div key={i} className="history-item flex gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-[#FAF3E0] flex items-center justify-center shrink-0 border border-[#E8DCC4]">
                        <Search className="w-5 h-5 text-[#5C3D2E]" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-[#5C3D2E] mb-1">Rapport de Lune {i}</p>
                        <p className="text-[10px] text-[#B89E7E] font-bold uppercase tracking-tight">Il y a {i} jour(s)</p>
                        <div className="flex items-center gap-4 mt-4">
                           <button className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-1">Prendre <ArrowRight className="w-3 h-3" /></button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
