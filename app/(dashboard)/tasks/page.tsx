"use client";

import { CheckSquare, Clock } from "lucide-react";

export default function TasksPage() {
  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Tâches & Opérations</h1>
          <p className="text-sm text-dogon-muted">To-do list exécutive pour le pilotage</p>
        </div>
        <button className="bg-dogon-indigo hover:bg-dogon-indigo/90 text-white px-4 py-2 text-sm font-bold rounded-lg shadow-md transition-colors">
            Nouvelle Tâche
        </button>
      </div>

      <div className="flex-1 bg-dogon-card rounded-xl border border-dogon-sirius shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-dogon-sirius flex items-center justify-between bg-dogon-card/50">
             <h2 className="text-white font-medium">À faire aujourd'hui</h2>
             <span className="text-xs bg-dogon-sirius px-2 py-0.5 rounded text-dogon-muted">0/3 Complétées</span>
          </div>
          <div className="p-4 space-y-3">
              {[
                { label: "Validder le devis ACAD-CI (NYA BLO Digital)", time: "10:00", urgent: true },
                { label: "Vérifier le stock de Lys Blancs (Yoela Flowers)", time: "12:30", urgent: false },
                { label: "Paiement encamission formateurs (GALF)", time: "15:00", urgent: true }
              ].map((task, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-dogon-sirius bg-dogon-nuit hover:border-dogon-indigo/50 transition-colors group cursor-pointer">
                      <div className="w-5 h-5 rounded border border-dogon-muted group-hover:border-dogon-indigo flex-shrink-0"></div>
                      <div className="flex-1">
                          <p className={`text-sm font-medium ${task.urgent ? 'text-dogon-danger' : 'text-white'}`}>{task.label}</p>
                      </div>
                      <div className="text-xs text-dogon-muted flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3" /> {task.time}
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
