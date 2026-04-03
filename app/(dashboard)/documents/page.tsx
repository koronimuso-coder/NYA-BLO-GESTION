"use client";

import { FileText, FolderUp, FolderArchive } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Centre Documentaire</h1>
          <p className="text-sm text-dogon-muted">Ressources, factures et contrats centralisés</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dogon-card border border-dogon-sirius rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-dogon-indigo hover:bg-dogon-sirius/20 transition-all">
              <FolderUp className="h-10 w-10 text-dogon-indigo mb-3" />
              <h3 className="text-white font-bold mb-1 tracking-tight">Importer un Document</h3>
              <p className="text-xs text-dogon-muted">Sécurisé sur Firebase Storage</p>
          </div>
          <div className="bg-dogon-card border border-dogon-sirius rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-dogon-or hover:bg-dogon-sirius/20 transition-all">
              <FileText className="h-10 w-10 text-dogon-or mb-3" />
              <h3 className="text-white font-bold mb-1 tracking-tight">Archives Factures</h3>
              <p className="text-xs text-dogon-muted">Générées automatiquement</p>
          </div>
          <div className="bg-dogon-card border border-dogon-sirius rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-dogon-danger hover:bg-dogon-sirius/20 transition-all">
              <FolderArchive className="h-10 w-10 text-dogon-danger mb-3" />
              <h3 className="text-white font-bold mb-1 tracking-tight">Contrats Légal</h3>
              <p className="text-xs text-dogon-muted">Accès restreint Direction</p>
          </div>
      </div>

      <div className="flex-1 bg-dogon-nuit border border-dogon-sirius border-dashed rounded-xl flex items-center justify-center">
          <p className="text-dogon-muted text-sm uppercase tracking-widest font-bold">Module en cours de synchronisation avec Storage...</p>
      </div>
    </div>
  );
}
