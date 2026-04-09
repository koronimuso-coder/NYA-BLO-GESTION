"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Search, 
  MoreVertical,
  Target,
  LayoutGrid,
  TrendingUp,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/Button";

import EntryModal from "@/components/dashboard/EntryModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface Entry {
  id: string;
  createdAt: string;
  clientName: string;
  companyId: string;
  totalAmount: number;
  paidAmount: number;
}

export default function EntriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "daily_entries"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Entry));
      setEntries(docs);
      setLoading(false);
    }, (error) => {
       console.error("Entries data fetch error:", error);
       setLoading(false);
    });
    return () => unsubscribe();
  }, []);


  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".page-header", { y: -20, opacity: 0, duration: 0.8 });
    tl.from(".stats-bar", { y: 20, opacity: 0, duration: 0.8 }, "-=0.4");
  }, { scope: container });

  return (
    <div ref={container} className="space-y-8 pb-12 relative">
      <div className="page-header flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-dogon uppercase tracking-tight">Points Journaliers</h1>
          <p className="text-[#B89E7E] mt-1">Données réelles synchronisées en temps réel.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
              variant="gold" 
              className="rounded-2xl shadow-gold h-14"
              onClick={() => setIsModalOpen(true)}
           >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle Saisie Réelle
           </Button>
        </div>
      </div>

      <div className="stats-bar grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
            { label: "Saisies Totales", value: entries.length.toString(), icon: LayoutGrid, color: "text-primary" },
            { label: "Dernière Saisie", value: entries[0] ? new Date(entries[0].createdAt).toLocaleDateString() : "--", icon: TrendingUp, color: "text-[#A66037]" },
            { label: "Connecté", value: "Actif", icon: Target, color: "text-[#D4AF37]" },
         ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl shadow-premium border border-[#E8DCC4] flex items-center gap-4">
               <div className="w-12 h-12 bg-[#FAF3E0] rounded-2xl flex items-center justify-center text-[#5C3D2E] border border-[#E8DCC4]">
                  <stat.icon className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-xl font-bold font-dogon ${stat.color}`}>{stat.value}</p>
               </div>
            </div>
         ))}
      </div>

      <div className="bg-white rounded-[40px] shadow-premium border border-[#E8DCC4] overflow-hidden">
        <div className="p-8 border-b border-[#E8DCC4]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B89E7E] group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Chercher parmi les données réelles..." 
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#FAF3E0]/30 border-none focus:ring-2 focus:ring-[#D4AF37]/10 text-sm font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAF3E0]/50">
                <th className="px-8 py-5 text-[10px] font-bold text-[#A66037] uppercase tracking-[0.2em]">Date</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[#A66037] uppercase tracking-[0.2em]">Client</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[#A66037] uppercase tracking-[0.2em]">Entreprise</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[#A66037] uppercase tracking-[0.2em]">Total (FCFA)</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[#A66037] uppercase tracking-[0.2em]">Versé</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCC4]/20">
              {entries.map((entry) => (
                <tr key={entry.id} className="table-row hover:bg-[#FAF3E0]/30 transition-colors group">
                  <td className="px-8 py-6 font-bold text-primary text-sm">{new Date(entry.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-[#5C3D2E] text-[#FAF3E0] flex items-center justify-center text-[10px] font-bold">
                          {entry.clientName?.substring(0, 2).toUpperCase() || "C"}
                       </div>
                       <span className="font-semibold text-[#2D1A12] text-sm">{entry.clientName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-[#FAF3E0] rounded-lg text-[10px] font-bold text-[#A66037] uppercase tracking-tight">
                       {entry.companyId}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-primary text-sm">{Number(entry.totalAmount).toLocaleString()}</td>
                  <td className="px-8 py-6 text-emerald-600 font-bold text-sm">{Number(entry.paidAmount).toLocaleString()}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-[#B89E7E] hover:text-primary transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && !loading && (
                 <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic">
                       Aucune saisie trouvée. Utilisez le bouton &quot;Nouvelle Saisie&quot; pour commencer.
                    </td>
                 </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      <EntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
