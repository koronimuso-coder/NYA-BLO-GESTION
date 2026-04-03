"use client";

import { useState } from "react";
import { MonitorPlay, FolderKanban, CheckCircle2, Clock, Globe, Smartphone, BarChart, Loader2 } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { where } from "firebase/firestore";

export default function NyaBloModulePage() {
  const [activeTab, setActiveTab] = useState<"projects" | "roadmap">("projects");

  // Real-time projects from Firestore for Digital
  const { data: projects, loading: loadingProjects } = useFirestoreCollection("projects", [
    where("company_id", "==", "nya-blo-digital")
  ]);

  if (loadingProjects) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-dogon-indigo" />
        <p className="text-dogon-indigo font-medium animate-pulse">Chargement de l'environnement Digital NYA BLO...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-12">
      {/* En-tête Module */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 rounded-xl relative p-6 overflow-hidden border border-dogon-indigo/20">
        <div className="absolute inset-0 bg-gradient-to-r from-dogon-card to-dogon-card/50 z-0"></div>
        <div className="absolute top-0 left-0 w-1/2 h-full bg-dogon-indigo/5 skew-y-12 blur-3xl z-0"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-dogon-indigo/20 rounded-lg border border-dogon-indigo/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <MonitorPlay className="h-8 w-8 text-dogon-indigo" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">NYA BLO Digital</h1>
            <p className="text-sm text-dogon-indigo font-medium tracking-wide uppercase">Secteur: Ingénierie Logicielle & Marketing</p>
          </div>
        </div>

        <div className="relative z-10 flex border border-dogon-sirius rounded-lg bg-dogon-nuit p-1">
          <button 
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${activeTab === 'projects' ? 'bg-dogon-indigo text-white shadow-sm' : 'text-dogon-text hover:text-white'}`}
          >
            <FolderKanban className="h-4 w-4" /> Projets en cours
          </button>
        </div>
      </div>

      {activeTab === "projects" && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project: any) => (
            <div key={project.id} className="bg-dogon-card rounded-xl border border-dogon-sirius p-5 flex flex-col hover:border-dogon-indigo/50 transition-colors group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-16 h-16 bg-dogon-indigo/5 -mr-8 -mt-8 rounded-full"></div>
              
              <div className="flex justify-between items-start mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase ${
                  (project.name || '').includes('Site') ? 'bg-dogon-indigo/20 text-dogon-indigo' : 
                  (project.name || '').includes('App') ? 'bg-dogon-violet/20 text-dogon-violet' : 
                  'bg-dogon-or/20 text-dogon-or'
                } border border-dogon-sirius`}>
                  {(project.name || '').includes('Site') ? <Globe className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                  {project.type || "Projet Tech"}
                </span>
                <span className="text-[10px] font-mono text-dogon-muted opacity-50">{project.id.slice(0, 8)}</span>
              </div>
              
              <h3 className="text-base font-bold text-white mb-1 uppercase tracking-tight">{project.name}</h3>
              <p className="text-xs text-dogon-muted mb-6 tracking-wide">Client: <span className="text-white font-medium">{project.client_name || project.client}</span></p>

              <div className="mt-auto space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest mb-2">
                    <span className="text-dogon-muted">Progression du Flux</span>
                    <span className="text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-dogon-nuit rounded-full h-1.5 border border-dogon-sirius/50 overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        project.progress > 80 ? 'bg-dogon-success shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 
                        project.progress > 30 ? 'bg-dogon-indigo shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 
                        'bg-dogon-or shadow-[0_0_10px_rgba(212,168,83,0.3)]'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-dogon-sirius/50">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-dogon-muted uppercase tracking-wider">
                    <Clock className="h-3.5 w-3.5" /> Échéance: {project.date || "Q2 2025"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {project.status === "Finalisation" && <CheckCircle2 className="h-4 w-4 text-dogon-success" />}
                    <span className={`text-[10px] font-bold uppercase ${project.status === 'En cours' ? 'text-dogon-or' : 'text-dogon-success'}`}>{project.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
              <div className="col-span-full py-16 text-center text-dogon-muted border-2 border-dashed border-dogon-sirius/30 rounded-xl uppercase tracking-[0.2em] text-[10px]">
                  Aucun projet digital n'a encore été initié dans cette cosmogonie.
              </div>
          )}
        </div>
      )}
    </div>
  );
}
