"use client";

import { useState } from "react";
import { GraduationCap, FolderOpen, Users, Calendar, Plus, Loader2 } from "lucide-react";
import { formatFCFA } from "@/lib/fcfa";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { where } from "firebase/firestore";

export default function GalfModulePage() {
  const [activeTab, setActiveTab] = useState<"sessions" | "catalog" | "candidats">("sessions");

  // Real-time data from Firestore for GALF only
  const { data: trainings, loading: loadingCatalog } = useFirestoreCollection("trainings", [
    where("company_id", "==", "galf-formation")
  ]);
  const { data: sessions, loading: loadingSessions } = useFirestoreCollection("sessions", [
    where("company_id", "==", "galf-formation")
  ]);

  if (loadingCatalog || loadingSessions) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-dogon-or" />
        <p className="text-dogon-or font-medium">Chargement des sessions GALF...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-12">
      {/* En-tête Module */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 rounded-xl relative p-6 overflow-hidden border border-dogon-or/20">
        <div className="absolute inset-0 bg-gradient-to-r from-dogon-card to-dogon-card/50 z-0"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-dogon-or/5 skew-x-12 blur-3xl z-0"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-dogon-or/20 rounded-lg border border-dogon-or/30 shadow-[0_0_15px_rgba(212,168,83,0.3)]">
            <GraduationCap className="h-8 w-8 text-dogon-or" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">GALF Formation</h1>
            <p className="text-sm text-dogon-or font-medium tracking-wide uppercase">Secteur: BTP & Industrie</p>
          </div>
        </div>

        <div className="relative z-10 flex border border-dogon-sirius rounded-lg bg-dogon-nuit p-1">
          <button 
            onClick={() => setActiveTab("sessions")}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${activeTab === 'sessions' ? 'bg-dogon-or text-dogon-nuit shadow-sm' : 'text-dogon-text hover:text-white'}`}
          >
            <Calendar className="h-4 w-4" /> Sessions
          </button>
          <button 
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${activeTab === 'catalog' ? 'bg-dogon-or text-dogon-nuit shadow-sm' : 'text-dogon-text hover:text-white'}`}
          >
            <FolderOpen className="h-4 w-4" /> Catalogue
          </button>
        </div>
      </div>

      {activeTab === "sessions" && (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">Sessions en cours et planifiées ({sessions.length})</h2>
              <button className="flex items-center gap-2 bg-dogon-or hover:bg-dogon-or/90 text-dogon-nuit px-3 py-2 text-sm font-bold rounded-md shadow transition-colors">
                <Plus className="h-4 w-4" /> Planifier session
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session: any) => (
                <div key={session.id} className="bg-dogon-card border border-dogon-sirius rounded-xl p-5 hover:border-dogon-or/40 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono font-bold text-dogon-or bg-dogon-or/10 px-2 py-0.5 rounded">{session.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${session.status === 'Ouvert' ? 'bg-dogon-success/10 text-dogon-success border-dogon-success/20' : 'bg-dogon-danger/10 text-dogon-danger border-dogon-danger/20'}`}>
                      {session.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 line-clamp-2 min-h-[40px]">{session.title}</h3>
                  
                  <div className="space-y-2 text-sm text-dogon-muted mb-6">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Début: {session.date}</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4" /> Inscrits: <span className="text-white font-medium">{session.enrolled}</span> / {session.capacity}</div>
                  </div>

                  <div className="w-full bg-dogon-nuit rounded-full h-2 border border-dogon-sirius mb-4">
                     <div 
                       className={`h-2 rounded-full ${session.status === 'Complet' ? 'bg-dogon-danger' : 'bg-dogon-or'}`}
                       style={{ width: `${(session.enrolled / session.capacity) * 100}%` }}
                     ></div>
                  </div>

                  <button className="w-full py-2 border border-dogon-sirius rounded-md text-sm text-white hover:bg-dogon-or/10 hover:border-dogon-or transition-colors opacity-0 group-hover:opacity-100">
                     Gérer la session
                  </button>
                </div>
              ))}
            </div>
        </div>
      )}

      {activeTab === "catalog" && (
        <div className="bg-dogon-card rounded-xl border border-dogon-sirius shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-dogon-sirius flex justify-between items-center bg-dogon-card/50">
            <h2 className="text-lg font-medium text-white">Catalogue des Formations ({trainings.length})</h2>
            <button className="flex items-center gap-2 bg-dogon-sirius hover:bg-dogon-sirius/80 text-white px-3 py-2 text-sm rounded-md transition-colors">
              <Plus className="h-4 w-4" /> Ajouter Formation
            </button>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-dogon-muted uppercase bg-dogon-sirius/30">
              <tr>
                <th className="px-6 py-4 font-medium">Intitulé</th>
                <th className="px-6 py-4 font-medium">Catégorie</th>
                <th className="px-6 py-4 font-medium">Tarif Unitaire</th>
                <th className="px-6 py-4 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {trainings.map((f: any, i) => (
                <tr key={i} className="border-b border-dogon-sirius/50 hover:bg-dogon-sirius/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{f.name}</td>
                  <td className="px-6 py-4 text-dogon-muted">{f.category}</td>
                  <td className="px-6 py-4 text-dogon-or font-mono">{formatFCFA(f.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${f.active ? 'bg-dogon-success/10 text-dogon-success' : 'bg-dogon-nuit text-dogon-muted border border-dogon-sirius'}`}>
                      {f.active ? 'Actif' : 'Archivé'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
