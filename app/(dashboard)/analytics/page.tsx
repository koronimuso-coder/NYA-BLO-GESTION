"use client";

import { BarChart3, LineChart, PieChart } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Analytiques Globaux</h1>
          <p className="text-sm text-dogon-muted">Rapports financiers et performances croisées</p>
        </div>
      </div>

      <div className="flex-1 min-h-[400px] bg-dogon-card rounded-xl border border-dogon-sirius shadow-sm flex flex-col items-center justify-center text-center p-8">
        <div className="grid grid-cols-3 gap-6 mb-8 opacity-50">
            <div className="p-4 bg-dogon-nuit rounded-2xl border border-dogon-sirius"><BarChart3 className="h-10 w-10 text-dogon-indigo" /></div>
            <div className="p-4 bg-dogon-nuit rounded-2xl border border-dogon-sirius"><LineChart className="h-10 w-10 text-dogon-or" /></div>
            <div className="p-4 bg-dogon-nuit rounded-2xl border border-dogon-sirius"><PieChart className="h-10 w-10 text-dogon-danger" /></div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Tableau de bord décisionnel</h2>
        <p className="text-dogon-muted max-w-md mx-auto mb-6">Le module d'analyse poussée croisant les données Firestore de l'ensemble des filiales est en cours de développement (V3).</p>
        <button className="px-6 py-2.5 bg-dogon-indigo hover:bg-dogon-indigo/80 text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-colors">
            Générer Rapport Global (PDF)
        </button>
      </div>
    </div>
  );
}
