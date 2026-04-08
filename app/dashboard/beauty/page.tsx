"use client";

import { useState } from "react";
import { Sparkles, CalendarClock, ListOrdered, Scissors, Clock, Loader2 } from "lucide-react";
import { formatFCFA } from "@/lib/fcfa";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { where } from "firebase/firestore";

export default function BeautyModulePage() {
  const [activeTab, setActiveTab] = useState<"appointments" | "services">("appointments");

  // Real-time appointments from Firestore for Beauty
  const { data: appointments, loading: loadingAppts } = useFirestoreCollection("appointments", [
    where("company_id", "==", "yoela-beauty")
  ]);

  if (loadingAppts) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-dogon-violet" />
        <p className="text-dogon-violet font-medium animate-pulse">Préparation du salon Yoela Beauty...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-12">
      {/* En-tête Module */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 rounded-xl relative p-6 overflow-hidden border border-dogon-violet/20">
        <div className="absolute inset-0 bg-gradient-to-r from-dogon-card to-dogon-card/50 z-0"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-dogon-violet/5 rounded-[100%] blur-3xl z-0"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-dogon-violet/20 rounded-lg border border-dogon-violet/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Sparkles className="h-8 w-8 text-dogon-violet" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Yoela Beauty</h1>
            <p className="text-sm text-dogon-violet font-medium tracking-wide uppercase">Secteur: Institut de Beauté & Soins</p>
          </div>
        </div>

        <div className="relative z-10 flex border border-dogon-sirius rounded-lg bg-dogon-nuit p-1">
          <button 
            onClick={() => setActiveTab("appointments")}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${activeTab === 'appointments' ? 'bg-dogon-violet text-white shadow-sm' : 'text-dogon-text hover:text-white'}`}
          >
            <CalendarClock className="h-4 w-4" /> Planning
          </button>
          <button 
            onClick={() => setActiveTab("services")}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${activeTab === 'services' ? 'bg-dogon-violet text-white shadow-sm' : 'text-dogon-text hover:text-white'}`}
          >
            <ListOrdered className="h-4 w-4" /> Prestations
          </button>
        </div>
      </div>

      {activeTab === "appointments" && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            Rendez-vous à venir <span className="text-sm font-normal text-dogon-muted">({appointments.length})</span>
          </h2>
          <div className="grid gap-4">
            {appointments.map((apt: any) => (
              <div key={apt.id} className="bg-dogon-card border border-dogon-sirius rounded-lg p-0 flex overflow-hidden group hover:border-dogon-violet/50 transition-colors">
                <div className="bg-dogon-sirius/30 w-32 flex flex-col items-center justify-center border-r border-dogon-sirius p-4">
                  <Clock className="h-5 w-5 text-dogon-violet mb-2" />
                  <span className="font-mono font-bold text-white text-xs uppercase tracking-tighter text-center">{apt.date || "Just Now"}</span>
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-white text-base">{apt.client_name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${apt.status === 'Confirmé' ? 'bg-dogon-success/10 text-dogon-success border-dogon-success/20' : 'bg-dogon-alert/10 text-dogon-alert border-dogon-alert/20'}`}>
                      {apt.status || "PÉVU"}
                    </span>
                  </div>
                  <p className="text-sm text-dogon-muted mb-2 tracking-tight">{apt.service || "Soins Mixte"}</p>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-dogon-muted">
                    <Scissors className="h-3 w-3" />
                    <span>Pris en charge par <span className="text-dogon-violet">L'ÉQuipe Yoela</span></span>
                  </div>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
                <div className="py-12 text-center text-dogon-muted border-2 border-dashed border-dogon-sirius/30 rounded-xl uppercase tracking-widest text-xs">
                    Aucun rendez-vous planifié dans le planning Cloud.
                </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "services" && (
        <div className="bg-dogon-card rounded-xl border border-dogon-sirius shadow-sm overflow-hidden flex flex-col">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-dogon-muted uppercase bg-dogon-sirius/30">
              <tr>
                <th className="px-6 py-4 font-medium">Prestation</th>
                <th className="px-6 py-4 font-medium">Durée moy.</th>
                <th className="px-6 py-4 font-medium text-right">Tarif</th>
                <th className="px-6 py-4 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-dogon-sirius/50 hover:bg-dogon-sirius/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-white uppercase tracking-tight">Lissage Brésilien + Soin Protéiné</div>
                  <div className="text-[10px] text-dogon-muted font-mono">SRV-01</div>
                </td>
                <td className="px-6 py-4 text-dogon-muted text-xs">2h 30m</td>
                <td className="px-6 py-4 text-right text-dogon-violet font-mono font-bold">{formatFCFA(45000)}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-dogon-success/10 text-dogon-success border border-dogon-success/20 uppercase">Disponible</span>
                </td>
              </tr>
              <tr className="border-b border-dogon-sirius/50 hover:bg-dogon-sirius/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-white uppercase tracking-tight">Manucure & Pédicure Spa</div>
                  <div className="text-[10px] text-dogon-muted font-mono">SRV-02</div>
                </td>
                <td className="px-6 py-4 text-dogon-muted text-xs">1h 15m</td>
                <td className="px-6 py-4 text-right text-dogon-violet font-mono font-bold">{formatFCFA(15000)}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-dogon-success/10 text-dogon-success border border-dogon-success/20 uppercase">Disponible</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
