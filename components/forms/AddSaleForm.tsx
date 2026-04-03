"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export function AddSaleForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_id: "nya-blo-digital",
    client_name: "",
    amount: "",
    item: "",
    status: "Payé"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name || !formData.amount) return;
    
    setLoading(true);
    try {
      const saleId = `V-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      await addDoc(collection(db, "sales"), {
        id: saleId,
        company_id: formData.company_id,
        client_name: formData.client_name,
        amount: Number(formData.amount),
        item: formData.item,
        status: formData.status,
        created_at: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création de la vente", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-dogon-muted uppercase mb-1 font-bold">Entreprise</label>
        <select 
          value={formData.company_id}
          onChange={(e) => setFormData({...formData, company_id: e.target.value})}
          className="w-full bg-dogon-nuit border border-dogon-sirius rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-dogon-or"
        >
          <option value="nya-blo-digital">NYA BLO Digital</option>
          <option value="galf-formation">GALF Formation</option>
          <option value="yoela-flowers">Yoela Flowers</option>
          <option value="yoela-beauty">Yoela Beauty</option>
        </select>
      </div>

      <div>
        <label className="block text-xs text-dogon-muted uppercase mb-1 font-bold">Client / Entité</label>
        <input 
          type="text" required
          value={formData.client_name}
          onChange={(e) => setFormData({...formData, client_name: e.target.value})}
          className="w-full bg-dogon-nuit border border-dogon-sirius rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-dogon-or"
          placeholder="Ex: Société ABC"
        />
      </div>

      <div>
        <label className="block text-xs text-dogon-muted uppercase mb-1 font-bold">Prestation / Produit</label>
        <input 
          type="text" required
          value={formData.item}
          onChange={(e) => setFormData({...formData, item: e.target.value})}
          className="w-full bg-dogon-nuit border border-dogon-sirius rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-dogon-or"
          placeholder="Ex: Refonte Site Web"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-dogon-muted uppercase mb-1 font-bold">Montant (FCFA)</label>
          <input 
            type="number" required min="0"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full bg-dogon-nuit border border-dogon-sirius rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-dogon-or"
            placeholder="Ex: 500000"
          />
        </div>
        <div>
          <label className="block text-xs text-dogon-muted uppercase mb-1 font-bold">Statut</label>
          <select 
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full bg-dogon-nuit border border-dogon-sirius rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-dogon-or"
          >
            <option value="Payé">Payé</option>
            <option value="En attente">En attente</option>
            <option value="Partiel">Acompte Payé</option>
            <option value="OVERDUE">En retard</option>
          </select>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <button 
          type="button" 
          onClick={onClose}
          className="px-4 py-2 text-sm text-dogon-muted hover:text-white transition-colors"
        >
          Annuler
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-dogon-or text-dogon-nuit rounded-lg hover:bg-dogon-or/90 transition-colors"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Enregistrer Vente
        </button>
      </div>
    </form>
  );
}
