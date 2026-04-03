"use client";

import { useState } from "react";
import { Search, Filter, MoreHorizontal, ArrowUpRight, Loader2 } from "lucide-react";
import { formatFCFA } from "@/lib/fcfa";
import { useFirestoreCollection } from "@/hooks/useFirestore";

export function LeadList() {
  const { data: leads, loading } = useFirestoreCollection("leads");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = leads.filter((l: any) => 
    l.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-dogon-or" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-dogon-card rounded-md">
      {/* Search and Filters Bar inside list */}
      <div className="p-4 border-b border-dogon-sirius flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <Search className="h-4 w-4 text-dogon-muted" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-dogon-sirius rounded-md leading-5 bg-dogon-nuit text-dogon-text placeholder-dogon-muted focus:outline-none focus:border-dogon-indigo"
            placeholder="Rechercher un lead par nom ou entreprise..."
          />
        </div>
        <div className="flex gap-2">
            <select className="bg-dogon-nuit border border-dogon-sirius text-sm rounded-md py-2 px-3 text-dogon-text focus:border-dogon-indigo focus:outline-none">
              <option>Toutes entreprises</option>
              <option>NYA BLO</option>
              <option>GALF</option>
              <option>YOELA</option>
            </select>
            <select className="bg-dogon-nuit border border-dogon-sirius text-sm rounded-md py-2 px-3 text-dogon-text focus:border-dogon-indigo focus:outline-none">
              <option>Tous statuts</option>
              <option>NOUVEAU</option>
              <option>CONTACTÉ</option>
              <option>INTÉRESSÉ</option>
              <option>DEVIS ENVOYÉ</option>
              <option>NÉGOCIATION</option>
            </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-dogon-muted uppercase bg-dogon-sirius/30 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-medium">Client / Lead</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">Entreprise</th>
              <th className="px-6 py-4 font-medium">Valeur (Est.)</th>
              <th className="px-6 py-4 font-medium">Statut</th>
              <th className="px-6 py-4 font-medium">Création</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead: any) => (
              <tr 
                key={lead.id} 
                className="border-b border-dogon-sirius/50 hover:bg-dogon-sirius/20 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 font-medium text-white">{lead.client_name}</td>
                <td className="px-6 py-4 text-dogon-muted">{lead.phone || lead.email || "N/A"}</td>
                <td className="px-6 py-4">
                   <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-dogon-sirius text-dogon-or border border-dogon-or/10 uppercase">
                    {lead.company_id?.split('-')[0] || "CRM"}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-dogon-or">{formatFCFA(lead.value || 0)}</td>
                <td className="px-6 py-4">
                   <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border border-dogon-indigo/30 bg-dogon-indigo/10 text-dogon-indigo uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-dogon-indigo mr-2"></span>
                    {lead.status || "NEW"}
                  </span>
                </td>
                <td className="px-6 py-4 text-dogon-muted">
                    {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "Consolidé"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 text-dogon-muted hover:text-white" title="Ouvrir">
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-dogon-muted hover:text-white" title="Options">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
                <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-dogon-muted">
                        Aucun lead trouvé dans la cosmogonie actuelle.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
