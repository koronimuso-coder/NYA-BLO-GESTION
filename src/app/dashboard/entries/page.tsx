"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Search, 
  MoreVertical,
  Target,
  LayoutGrid,
  TrendingUp,
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";

import EntryModal from "@/components/dashboard/EntryModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface Entry {
  id: string;
  date: string;
  clientName: string;
  companyId: string;
  totalAmount: number;
  paidAmount: number;
  resteAVerser: number;
  status: string;
  modePaiement: string;
  canal: string;
}

export default function EntriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(db, "daily_entries"), orderBy("date", "desc"));
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

  const filteredEntries = entries.filter(e => 
    e.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.companyId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.canal?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useGSAP(() => {
    if (!loading) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".page-header", { y: -20, opacity: 0, duration: 0.8 });
      tl.from(".stats-bar", { y: 20, opacity: 0, duration: 0.8 }, "-=0.4");
      tl.from(".table-row", { opacity: 0, y: 10, stagger: 0.05, duration: 0.4 });
    }
  }, { scope: container, dependencies: [loading] });

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
       <Loader2 className="w-12 h-12 text-[#A66037] animate-spin mb-4" />
       <p className="text-[#5C3D2E] font-bold">Ouverture des registres...</p>
    </div>
  );

  return (
    <div ref={container} className="space-y-8 pb-12 relative text-[#2D1A12]">
      <div className="absolute inset-0 dogon-pattern opacity-5 pointer-events-none" />
      
      <div className="page-header flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-[#5C3D2E] font-dogon uppercase tracking-tight">Points Journaliers</h1>
          <p className="text-[#B89E7E] mt-1">Données réelles synchronisées en temps réel.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
              variant="gold" 
              className="rounded-2xl shadow-gold h-14 relative z-20"
              onClick={() => setIsModalOpen(true)}
           >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle Saisie Réelle
           </Button>
        </div>
      </div>

      <div className="stats-bar grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
         {[
            { label: "Saisies Totales", value: entries.length.toString(), icon: LayoutGrid, color: "text-[#5C3D2E]" },
            { label: "Total Ventes", value: entries.reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0).toLocaleString() + " FCFA", icon: TrendingUp, color: "text-[#A66037]" },
            { label: "Total Encaissé", value: entries.reduce((acc, curr) => acc + Number(curr.paidAmount || 0), 0).toLocaleString() + " FCFA", icon: Target, color: "text-[#D4AF37]" },
            { label: "Total Reste", value: entries.reduce((acc, curr) => acc + Number(curr.resteAVerser || 0), 0).toLocaleString() + " FCFA", icon: AlertCircle, color: "text-red-500" },
         ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl shadow-premium border border-[#E8DCC4] flex items-center gap-4">
               <div className="w-12 h-12 bg-[#FAF3E0] rounded-2xl flex items-center justify-center text-[#5C3D2E] border border-[#E8DCC4]">
                  <stat.icon className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-lg font-bold font-dogon ${stat.color}`}>{stat.value}</p>
               </div>
            </div>
         ))}
      </div>

      <div className="bg-white rounded-[40px] shadow-premium border border-[#E8DCC4] overflow-hidden relative z-10">
        <div className="p-8 border-b border-[#E8DCC4]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B89E7E] group-focus-within:text-[#D4AF37] transition-colors" />
            <input 
              type="text" 
              placeholder="Rechercher par client, filiale ou statut..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#FAF3E0]/30 border-none focus:ring-2 focus:ring-[#D4AF37]/20 text-sm font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAF3E0]/50 text-[#A66037]">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Date</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Client</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Entreprise</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Total</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Versé</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Reste</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Paiement</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Canal</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Statut</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCC4]/20">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="table-row hover:bg-[#FAF3E0]/30 transition-colors group">
                  <td className="px-8 py-6 font-bold text-[#5C3D2E] text-sm whitespace-nowrap">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-[#5C3D2E] text-[#FAF3E0] flex items-center justify-center text-[10px] font-bold">
                          {entry.clientName?.substring(0, 2).toUpperCase() || "C"}
                       </div>
                       <span className="font-semibold text-[#2D1A12] text-sm whitespace-nowrap">{entry.clientName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-[#FAF3E0] rounded-lg text-[10px] font-bold text-[#A66037] uppercase tracking-tight">
                       {entry.companyId}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-[#5C3D2E] text-sm">{Number(entry.totalAmount).toLocaleString()}</td>
                  <td className="px-8 py-6 text-emerald-600 font-bold text-sm">{Number(entry.paidAmount).toLocaleString()}</td>
                  <td className="px-8 py-6 text-red-500 font-bold text-sm">{(entry.resteAVerser || 0).toLocaleString()}</td>
                  <td className="px-8 py-6">
                     <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold uppercase tracking-tight">
                        {entry.modePaiement || "Espèces"}
                     </span>
                  </td>
                  <td className="px-8 py-6">
                     <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold uppercase tracking-tight">
                        {entry.canal || "Direct"}
                     </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                       entry.status === 'Confirmé' ? 'bg-emerald-50 text-emerald-700' : 
                       entry.status === 'En attente' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                       {entry.status || 'Confirmé'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-[#B89E7E] hover:text-[#D4AF37] transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEntries.length === 0 && !loading && (
                 <tr>
                    <td colSpan={10} className="px-8 py-20 text-center text-[#B89E7E] italic text-sm">
                       Aucun résultat trouvé pour &quot;{searchTerm}&quot;.
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
