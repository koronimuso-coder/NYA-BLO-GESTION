"use client";

import React, { useRef, useState } from "react";
import { X, Save, TrendingUp, CreditCard, User, Building2, Sparkles, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import toast from "react-hot-toast";


interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EntryModal = ({ isOpen, onClose }: EntryModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);


  // Form State
  const [formData, setFormData] = useState({
    clientName: "",
    companyId: "GALF SARL",
    totalAmount: "",
    paidAmount: "",
    observations: ""
  });

  useGSAP(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
      gsap.fromTo(contentRef.current, 
        { scale: 0.9, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "power4.out" }
      );
    }
  }, { dependencies: [isOpen] });

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "daily_entries"), {
        ...formData,
        totalAmount: Number(formData.totalAmount),
        paidAmount: Number(formData.paidAmount),
        createdAt: new Date().toISOString(),
        serverTimestamp: serverTimestamp()
      });
      
      toast.success("Saisie enregistrée avec succès !");
      onClose();
      setFormData({
        clientName: "",
        companyId: "GALF SARL",
        totalAmount: "",
        paidAmount: "",
        observations: ""
      });
    } catch (error: unknown) {
      const firebaseError = error as { message: string };
      console.error("Firestore Save Error:", firebaseError.message);

      toast.error("Erreur lors de l'enregistrement. Vérifiez vos permissions.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-[#1A0F0A]/60 backdrop-blur-md opacity-0"
        onClick={onClose}
      />
      
      <form 
        onSubmit={handleSubmit}
        ref={contentRef}
        className="relative bg-[#FAF3E0] w-full max-w-2xl rounded-[48px] shadow-2xl border border-white/20 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#5C3D2E] p-8 text-[#FAF3E0] flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 dogon-pattern opacity-10" />
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Saisie Réelle</span>
             </div>
             <h2 className="text-3xl font-bold font-dogon tracking-tight">Pointage Journalier</h2>
          </div>
          <button type="button" onClick={onClose} className="relative z-10 p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all active:scale-95">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-10 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="form-field space-y-2">
                 <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Client / Prospect</label>
                 <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B89E7E] group-focus-within:text-[#D4AF37] transition-colors" />
                    <input 
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-bold text-[#2D1A12] placeholder-[#B89E7E]/50" 
                      placeholder="Nom complet" 
                    />
                 </div>
              </div>
              <div className="form-field space-y-2">
                 <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Entreprise</label>
                 <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B89E7E] group-focus-within:text-[#D4AF37] transition-colors" />
                    <select 
                      value={formData.companyId}
                      onChange={(e) => setFormData({...formData, companyId: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-bold text-[#2D1A12] appearance-none"
                    >
                       <option>GALF SARL</option>
                       <option>NB FLOWERS</option>
                    </select>
                 </div>
              </div>
              <div className="form-field space-y-2">
                 <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Montant Total (FCFA)</label>
                 <div className="relative group">
                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B89E7E] group-focus-within:text-[#D4AF37] transition-colors" />
                    <input 
                      required
                      type="number" 
                      value={formData.totalAmount}
                      onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-bold text-[#2D1A12]" 
                      placeholder="0" 
                    />
                 </div>
              </div>
              <div className="form-field space-y-2">
                 <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Acompte Versé (FCFA)</label>
                 <div className="relative group">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B89E7E] group-focus-within:text-[#D4AF37] transition-colors" />
                    <input 
                      required
                      type="number" 
                      value={formData.paidAmount}
                      onChange={(e) => setFormData({...formData, paidAmount: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-bold text-[#2D1A12]" 
                      placeholder="0" 
                    />
                 </div>
              </div>
           </div>

           <div className="form-field space-y-2">
              <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Observations</label>
              <textarea 
                value={formData.observations}
                onChange={(e) => setFormData({...formData, observations: e.target.value})}
                className="w-full p-5 rounded-3xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-medium text-[#2D1A12] h-32 resize-none placeholder-[#B89E7E]/50"
                placeholder="Détails de la transaction..."
              />
           </div>

           <div className="form-field flex gap-4 pt-4">
              <button 
                type="button"
                className="flex-1 h-16 rounded-2xl border-2 border-[#E8DCC4] text-[#A66037] font-bold hover:bg-white transition-all active:scale-95" 
                onClick={onClose}
              >
                Annuler
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] h-16 rounded-2xl dogon-gradient text-white font-bold text-lg shadow-xl shadow-[#A66037]/20 hover:shadow-2xl hover:shadow-[#A66037]/40 transition-all active:scale-95 disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Enregistrer l&apos;Entrée <Save className="w-5 h-5" /></>}
                </span>
              </button>

           </div>
        </div>
      </form>
    </div>
  );
};

export default EntryModal;
