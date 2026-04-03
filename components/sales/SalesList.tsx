"use client";

import { useState } from "react";
import { FileText, MoreVertical, CreditCard, Search, Loader2 } from "lucide-react";
import { formatFCFA } from "@/lib/fcfa";
import { useFirestoreCollection } from "@/hooks/useFirestore";

export function SalesList() {
  const { data: sales, loading } = useFirestoreCollection("sales");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSales = sales.filter((s: any) => 
    s.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-dogon-or" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-dogon-card">
      {/* Barre de recherche */}
      <div className="p-4 border-b border-dogon-sirius flex justify-between items-center bg-dogon-card/50">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <Search className="h-4 w-4 text-dogon-muted" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-dogon-sirius rounded-md leading-5 bg-dogon-nuit text-dogon-text placeholder-dogon-muted focus:outline-none focus:border-dogon-indigo transition-colors"
            placeholder="Rechercher par référence, client..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-dogon-muted uppercase bg-dogon-sirius/30 sticky top-0 z-10 w-full">
            <tr>
              <th className="px-6 py-4 font-medium">Référence</th>
              <th className="px-6 py-4 font-medium">Client</th>
              <th className="px-6 py-4 font-medium">Entreprise</th>
              <th className="px-6 py-4 font-medium">Montant</th>
              <th className="px-6 py-4 font-medium">Statut Paiement</th>
              <th className="px-6 py-4 font-medium">Date d'émission</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale: any) => (
              <tr 
                key={sale.id} 
                className={`border-b border-dogon-sirius/50 hover:bg-dogon-sirius/20 transition-colors group ${sale.status === 'OVERDUE' ? 'bg-dogon-danger/5 hover:bg-dogon-danger/10' : ''}`}
              >
                <td className="px-6 py-4 font-mono text-dogon-muted font-medium text-xs uppercase">{sale.id.slice(0, 8)}</td>
                <td className="px-6 py-4 text-white font-medium">{sale.client_name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                    sale.company_id?.includes('digital') ? 'bg-dogon-indigo/10 border-dogon-indigo/30 text-dogon-indigo' :
                    sale.company_id?.includes('formation') ? 'bg-dogon-or/10 border-dogon-or/30 text-dogon-or' :
                    sale.company_id?.includes('flowers') ? 'bg-dogon-danger/10 border-dogon-danger/30 text-dogon-danger' :
                    'bg-dogon-violet/10 border-dogon-violet/30 text-dogon-violet'
                  } uppercase tracking-wider`}>
                    {sale.company_id?.split('-')[0] || "VENTE"}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-white font-medium">{formatFCFA(sale.amount || 0)}</td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                     sale.status === 'Payé' ? 'bg-dogon-success/10 border-dogon-success/30 text-dogon-success' :
                     sale.status === 'En attente' ? 'bg-dogon-alert/10 border-dogon-alert/30 text-dogon-alert' :
                     sale.status === 'Partiel' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                     'bg-dogon-danger/10 border-dogon-danger/30 text-dogon-danger'
                   } uppercase`}>
                    {sale.status || "PENDING"}
                  </span>
                </td>
                <td className="px-6 py-4 text-dogon-muted">
                    {sale.created_at ? new Date(sale.created_at).toLocaleDateString() : "Just now"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-dogon-indigo hover:text-dogon-indigo/80 bg-dogon-indigo/10 rounded" title="Enregistrer paiement">
                      <CreditCard className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-dogon-muted hover:text-white bg-dogon-sirius/50 rounded" title="Facture PDF">
                      <FileText className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-dogon-muted hover:text-white" title="Options">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSales.length === 0 && (
                <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-dogon-muted uppercase tracking-widest text-xs">
                        Aucune transaction détectée dans la cosmogonie.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
