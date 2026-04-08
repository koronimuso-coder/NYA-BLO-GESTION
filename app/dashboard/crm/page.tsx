"use client";

import { useState } from "react";
import { Plus, Filter, LayoutGrid, List } from "lucide-react";
import { KanbanBoard } from "@/components/crm/KanbanBoard";
import { LeadList } from "@/components/crm/LeadList";
import { CosmoModal } from "@/components/ui/CosmoModal";
import { AddLeadForm } from "@/components/forms/AddLeadForm";

export default function CRMPage() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">CRM Unifié</h1>
          <p className="text-sm text-dogon-muted">Pipeline commercial cross-entreprises</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-dogon-card border border-dogon-sirius rounded-md p-1 flex">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-sm transition-colors ${viewMode === "kanban" ? "bg-dogon-sirius text-white" : "text-dogon-muted hover:text-white"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-sm transition-colors ${viewMode === "list" ? "bg-dogon-sirius text-white" : "text-dogon-muted hover:text-white"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 bg-dogon-sirius hover:bg-dogon-sirius/80 text-white px-3 py-2 text-sm rounded-md border border-dogon-sirius transition-colors">
            <Filter className="h-4 w-4" />
            Filtres
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-dogon-indigo hover:bg-dogon-indigo/90 text-white px-3 py-2 text-sm font-medium rounded-md shadow flex-shrink-0 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouveau Lead
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-dogon-card rounded-xl border border-dogon-sirius p-4 shadow-sm overflow-hidden flex flex-col custom-scrollbar">
        {/* L'intérieur prend tout l'espace restant et gère son scroll si Kanban dépasse */}
        {viewMode === "kanban" ? <KanbanBoard /> : <LeadList />}
      </div>

      <CosmoModal title="Nouveau Lead" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddLeadForm onClose={() => setIsModalOpen(false)} />
      </CosmoModal>
    </div>
  );
}
