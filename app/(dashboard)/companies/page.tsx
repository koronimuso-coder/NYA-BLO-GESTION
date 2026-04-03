"use client";

import { Building2, Search } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestore";

export default function CompaniesPage() {
  const { data: companies, loading } = useFirestoreCollection("companies");

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Gouvernance des Entreprises</h1>
          <p className="text-sm text-dogon-muted">Vue d'ensemble des startups du groupe NYA BLO</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 pt-4">
        {loading ? (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dogon-or"></div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companies.map((company: any) => (
                    <div key={company.id} className="bg-dogon-card border border-dogon-sirius rounded-xl p-6 hover:border-dogon-indigo transition-colors relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-dogon-nuit rounded-full -mr-10 -mt-10 border border-dogon-sirius opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-dogon-nuit border border-dogon-sirius rounded-lg shadow-sm">
                                    <Building2 className="h-6 w-6 text-dogon-muted" />
                                </div>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border bg-dogon-success/10 border-dogon-success/30 text-dogon-success uppercase">
                                    {company.status || "ACTIF"}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{company.name}</h3>
                            <p className="text-sm text-dogon-muted mb-6 uppercase tracking-wider">{company.sector}</p>
                            
                            <div className="grid grid-cols-2 gap-4 border-t border-dogon-sirius/50 pt-4">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-dogon-muted tracking-widest mb-1">C.A Mensuel Est.</p>
                                    <p className="text-lg font-mono text-dogon-or font-bold">{company.metrics?.monthly_ca ? (company.metrics.monthly_ca).toLocaleString() + " FCFA" : "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-dogon-muted tracking-widest mb-1">Taux Conversion</p>
                                    <p className="text-lg font-mono text-white font-bold">{company.metrics?.conversion_rate || 0}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
