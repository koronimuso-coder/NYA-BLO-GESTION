"use client";

import { BarChart3, LineChart, PieChart, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";
import { formatFCFA } from "@/lib/fcfa";

export default function AnalyticsPage() {
  const { data: sales, loading: loadingSales } = useFirestoreCollection("sales");
  const { data: leads, loading: loadingLeads } = useFirestoreCollection("leads");
  
  const handleExportExcel = () => {
    exportToExcel(sales, "NYA_BLO_OS_Rapport_Ventes");
  };

  const handleExportPDF = () => {
    const columns = ["ID Vente", "Entreprise", "Client", "Prestation", "Montant (FCFA)", "Date"];
    const rows = sales.map(s => [
      s.id || "N/A",
      s.company_id || "Global",
      s.client_name || "Inconnu",
      s.item || "Détail masqué",
      formatFCFA(s.amount || 0),
      s.created_at ? new Date(s.created_at).toLocaleDateString("fr-FR") : "N/A"
    ]);
    exportToPDF("Rapport Légal Consolidé - Ventes", columns, rows, "NYA_BLO_OS_Rapport_Ventes");
  };

  if (loadingSales || loadingLeads) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-dogon-or animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Centre de Rapports & Analytiques</h1>
          <p className="text-sm text-dogon-muted">Génération de documents légaux et exports massifs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EXPORT VENTES */}
        <div className="bg-dogon-card rounded-xl border border-dogon-sirius shadow-sm p-8 text-center flex flex-col items-center">
          <div className="p-4 bg-dogon-nuit rounded-2xl border border-dogon-or/30 mb-6 relative group cursor-pointer" onClick={handleExportPDF}>
             <div className="absolute inset-0 bg-dogon-or/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <FileText className="h-12 w-12 text-dogon-or relative z-10" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Rapport PDF Consolidé</h2>
          <p className="text-dogon-muted text-sm mb-6 max-w-sm">
            Générez un PDF formel, aux couleurs de NYA BLO, reprenant la liste totale de vos ventes et créances actuelles ({sales.length} transactions).
          </p>
          <div className="flex gap-4 w-full">
             <button 
               onClick={handleExportPDF}
               className="flex-1 px-4 py-2 bg-dogon-or text-dogon-nuit hover:bg-dogon-or/90 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors flex justify-center items-center gap-2">
                 <FileText className="h-4 w-4" /> Enregistrer PDF
             </button>
          </div>
        </div>

        {/* EXPORT EXCEL */}
        <div className="bg-dogon-card rounded-xl border border-dogon-sirius shadow-sm p-8 text-center flex flex-col items-center">
          <div className="p-4 bg-dogon-nuit rounded-2xl border border-dogon-success/30 mb-6 relative group cursor-pointer" onClick={handleExportExcel}>
             <div className="absolute inset-0 bg-dogon-success/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <FileSpreadsheet className="h-12 w-12 text-dogon-success relative z-10" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Export Données Brutes (Excel)</h2>
          <p className="text-dogon-muted text-sm mb-6 max-w-sm">
            Téléchargez l'intégralité de vos ventes Firestore sous format .xlsx pour une exploitation comptable externe sur Ciel ou Sage.
          </p>
          <div className="flex gap-4 w-full">
             <button 
               onClick={handleExportExcel}
               className="flex-1 px-4 py-2 bg-dogon-success text-white hover:bg-dogon-success/90 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors flex justify-center items-center gap-2">
                 <FileSpreadsheet className="h-4 w-4" /> Exporter .XLSX
             </button>
          </div>
        </div>
      </div>
      
      {/* PLACEHOLDER CHARTS */}
      <div className="bg-dogon-nuit/50 rounded-xl border border-dogon-sirius/50 p-8 text-center opacity-40">
        <div className="flex gap-3 justify-center mb-4 text-dogon-muted">
           <BarChart3 className="h-6 w-6" /> <LineChart className="h-6 w-6" /> <PieChart className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold uppercase text-dogon-muted">Les visuels décisionnels seront disponibles dès intégration avec PowerBI/DataStudio</h3>
      </div>
    </div>
  );
}
