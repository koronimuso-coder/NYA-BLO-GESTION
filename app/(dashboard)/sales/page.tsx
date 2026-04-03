"use client";

import { useState } from "react";
import { Plus, Filter, Download } from "lucide-react";
import { SalesList } from "@/components/sales/SalesList";
import { CosmoModal } from "@/components/ui/CosmoModal";
import { AddSaleForm } from "@/components/forms/AddSaleForm";

export default function SalesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Ventes & Factures</h1>
          <p className="text-sm text-dogon-muted">Registre consolidé des transactions commerciales</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-dogon-sirius hover:bg-dogon-sirius/80 text-white px-3 py-2 text-sm rounded-md border border-dogon-sirius transition-colors">
            <Filter className="h-4 w-4" />
            Filtrer
          </button>
          <button className="flex items-center gap-2 bg-dogon-sirius hover:bg-dogon-sirius/80 text-white px-3 py-2 text-sm rounded-md border border-dogon-sirius transition-colors">
            <Download className="h-4 w-4" />
            Exporter
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-dogon-or hover:bg-dogon-or/90 text-dogon-nuit px-3 py-2 text-sm font-bold rounded-md shadow flex-shrink-0 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Vente
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-dogon-card rounded-xl border border-dogon-sirius shadow-sm overflow-hidden flex flex-col">
        <SalesList />
      </div>

      <CosmoModal title="Nouvelle Vente" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddSaleForm onClose={() => setIsModalOpen(false)} />
      </CosmoModal>
    </div>
  );
}

