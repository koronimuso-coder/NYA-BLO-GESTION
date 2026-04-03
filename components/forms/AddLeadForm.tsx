"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export function AddLeadForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_id: "galf-formation",
    client_name: "",
    value: "",
    phone: "",
    status: "NEW"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, "leads"), {
        company_id: formData.company_id,
        client_name: formData.client_name,
        value: Number(formData.value) || 0,
        phone: formData.phone,
        status: formData.status,
        created_at: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création du lead", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-dogon-muted uppercase mb-1 font-bold">Entreprise Ciblée</label>
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
        <label className="block text-xs text-dogon-muted uppercase mb-1 font-bold">Nom / Raison Sociale</label>
        <input 
          type="text" required
          value={formData.client_name}
          onChange={(e) => setFormData({...formData, client_name: e.target.value})}
          className="w-full bg-dogon-nuit border border-dogon-sirius rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-dogon-or"
          placeholder="Ex: Entreprise XYZ ou Mr. Konan"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-dogon-muted uppercase mb-1 font-bold">Contact (Tél / Email)</label>
          <input 
             type="text"
             value={formData.phone}
             onChange={(e) => setFormData({...formData, phone: e.target.value})}
             className="w-full bg-dogon-nuit border border-dogon-sirius rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-dogon-or"
             placeholder="Ex: 01 02 03 04 05"
          />
        </div>
        <div>
          <label className="block text-xs text-dogon-muted uppercase mb-1 font-bold">Valeur Estimée</label>
          <input 
            type="number" min="0" required
            value={formData.value}
            onChange={(e) => setFormData({...formData, value: e.target.value})}
            className="w-full bg-dogon-nuit border border-dogon-sirius rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-dogon-or"
            placeholder="Ex: 350000"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs text-dogon-muted uppercase mb-1 font-bold">Statut Initial</label>
        <select 
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          className="w-full bg-dogon-nuit border border-dogon-sirius rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-dogon-or"
        >
          <option value="NEW">Nouveau</option>
          <option value="CONTACTED">Contacté</option>
          <option value="INTERESTED">Intéressé</option>
          <option value="QUOTE_SENT">Devis Envoyé</option>
          <option value="NEGOTIATION">En Négociation</option>
        </select>
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
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-dogon-indigo text-dogon-nuit rounded-lg hover:bg-dogon-indigo/90 transition-colors"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Enregistrer Lead
        </button>
      </div>
    </form>
  );
}
