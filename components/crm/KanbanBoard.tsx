"use client";

import { useState } from "react";
import { MoreHorizontal, Calendar, ArrowRightCircle, Loader2 } from "lucide-react";
import { formatFCFA } from "@/lib/fcfa";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const columns = [
  { id: "NEW", title: "Nouveau", color: "bg-dogon-indigo/20 text-dogon-indigo border-dogon-indigo/30" },
  { id: "CONTACTED", title: "Contacté", color: "bg-dogon-violet/20 text-dogon-violet border-dogon-violet/30" },
  { id: "INTERESTED", title: "Intéressé", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { id: "QUOTE_SENT", title: "Devis Envoyé", color: "bg-dogon-or/20 text-dogon-or border-dogon-or/30" },
  { id: "NEGOTIATION", title: "Négociation", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
];

export function KanbanBoard() {
  const { data: leads, loading } = useFirestoreCollection("leads");
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    try {
      const leadRef = doc(db, "leads", draggedLeadId);
      await updateDoc(leadRef, { status: columnId });
      console.log(`✅ Lead ${draggedLeadId} déplacé vers ${columnId}`);
    } catch (error) {
      console.error("❌ Erreur lors du déplacement du lead:", error);
    }
    setDraggedLeadId(null);
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-dogon-or" />
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {columns.map((column) => {
        const columnLeads = leads.filter((l: any) => (l.status || "NEW") === column.id);
        
        return (
          <div 
            key={column.id} 
            className="flex flex-col w-80 flex-shrink-0 bg-dogon-nuit/50 rounded-lg border border-dogon-sirius"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="p-3 border-b border-dogon-sirius flex justify-between items-center bg-dogon-card/50 rounded-t-lg">
              <h3 className="font-medium text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                <span className={`inline-block w-2 h-2 rounded-full ${column.color.split(' ')[0]}`}></span>
                {column.title}
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border bg-dogon-nuit font-bold ${column.color.split(' ').slice(1).join(' ')}`}>
                {columnLeads.length}
              </span>
            </div>

            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3 min-h-[500px]">
              {columnLeads.map((lead: any) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  className="bg-dogon-card border border-dogon-sirius hover:border-dogon-or hover:shadow-md hover:shadow-dogon-or/5 p-4 rounded-md cursor-grab active:cursor-grabbing transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-dogon-or/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-dogon-nuit text-dogon-or border border-dogon-or/20 uppercase">
                      {lead.company_id?.split('-')[0] || "CRM"}
                    </span>
                    <button className="text-dogon-muted opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <h4 className="font-bold text-white text-sm mb-1">{lead.client_name}</h4>
                  <p className="text-dogon-or font-mono text-sm mb-3">
                    {formatFCFA(lead.value || 0)}
                  </p>
                  
                  <div className="flex justify-between items-center text-[10px] text-dogon-muted pt-2 border-t border-dogon-sirius/50">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "Just now"}
                    </div>
                    {column.id === "NEGOTIATION" && (
                      <button title="Convertir en client" className="text-dogon-success hover:scale-110 transition-transform">
                        <ArrowRightCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {columnLeads.length === 0 && (
                <div className="h-32 w-full border-2 border-dashed border-dogon-sirius/30 rounded-lg flex items-center justify-center pointer-events-none">
                  <span className="text-dogon-muted text-xs opacity-50 uppercase tracking-widest font-bold">Déposer ici</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
