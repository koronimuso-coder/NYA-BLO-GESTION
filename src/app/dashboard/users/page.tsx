"use client";

import React, { useRef } from "react";
import { Plus, Users, ShieldCheck, Mail, Phone, MoreVertical, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const collaborators = [
  { id: "1", name: "Aminata Koné", role: "Gestionnaire Stock", email: "aminata@nyablo.com", status: "Active", entries: 142 },
  { id: "2", name: "Fatou Touré", role: "Commerciale Senior", email: "fatou@nyablo.com", status: "En Congé", entries: 89 },
  { id: "3", name: "Mariam Diallo", role: "Superviseur Digital", email: "mariam@nyablo.com", status: "Active", entries: 216 }
];

export default function UsersPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".page-header", { y: -20, opacity: 0, duration: 0.8 });
    tl.from(".user-row", { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 });
  }, { scope: container });

  return (
    <div ref={container} className="space-y-8 pb-12 relative">
      <div className="absolute inset-0 dogon-pattern opacity-5 pointer-events-none" />

      <div className="page-header flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-[#5C3D2E] font-dogon uppercase tracking-tight">Forces de Vente</h1>
          <p className="text-[#B89E7E] mt-1">Gérez vos collaboratrices et leurs niveaux d'accès.</p>
        </div>
        <Button variant="gold" className="rounded-2xl shadow-gold h-14 min-w-[240px]">
          <Plus className="w-5 h-5 mr-3" />
          Nouvelle Collaboratrice
        </Button>
      </div>

      <div className="bg-white rounded-[40px] shadow-premium border border-[#E8DCC4] overflow-hidden relative z-10">
        <div className="p-8 border-b border-[#E8DCC4] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF3E0]/30">
          <div className="relative group min-w-[320px]">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B89E7E]" />
             <input placeholder="Rechercher une force de vente..." className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-[#E8DCC4] focus:ring-2 focus:ring-[#D4AF37]/20 font-medium text-[#5C3D2E]" />
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-xl px-6 border-[#E8DCC4] text-[#B89E7E]">Filtres</Button>
             <Button variant="outline" className="rounded-xl px-6 border-[#E8DCC4] text-[#B89E7E]">Exporter</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-[#FAF3E0]/50 text-[#B89E7E] text-[10px] font-bold uppercase tracking-[0.2em]">
                <tr>
                   <th className="px-8 py-5">Collaboratrice</th>
                   <th className="px-8 py-5">Rôle & Rang</th>
                   <th className="px-8 py-5">Statut</th>
                   <th className="px-8 py-5">Activités (30j)</th>
                   <th className="px-8 py-5"></th>
                </tr>
             </thead>
             <tbody className="divide-y divide-[#E8DCC4]/30">
                {collaborators.map((user) => (
                  <tr key={user.id} className="user-row hover:bg-[#FAF3E0]/20 transition-colors group">
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-[#5C3D2E] flex items-center justify-center text-white font-bold relative overflow-hidden">
                              {user.name.charAt(0)}
                              <div className="absolute inset-0 dogon-pattern opacity-10" />
                           </div>
                           <div>
                              <p className="font-bold text-[#5C3D2E]">{user.name}</p>
                              <p className="text-xs text-[#B89E7E]">{user.email}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                           <span className="text-sm font-bold text-[#A66037]">{user.role}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                           user.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"
                        }`}>
                           {user.status}
                        </span>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2">
                              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                              <span className="font-bold text-[#5C3D2E]">{user.entries}</span>
                           </div>
                           <div className="w-24 h-1 bg-[#FAF3E0] rounded-full overflow-hidden">
                              <div className="h-full bg-[#A66037] rounded-full" style={{ width: `${(user.entries/300)*100}%` }} />
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <button className="p-3 rounded-xl hover:bg-[#E8DCC4]/30 transition-colors text-[#B89E7E]">
                           <MoreVertical className="w-5 h-5" />
                        </button>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
