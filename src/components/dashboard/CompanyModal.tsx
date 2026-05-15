"use client";

import React, { useRef, useState } from "react";
import { X, Save, Building2, Globe, Phone, MapPin, Sparkles, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import toast from "react-hot-toast";

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyModal = ({ isOpen, onClose }: CompanyModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    domain: "Services",
    location: "Abidjan, Côte d'Ivoire",
    phone: "",
    email: ""
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
      await addDoc(collection(db, "companies"), {
        ...formData,
        createdAt: new Date().toISOString(),
        serverTimestamp: serverTimestamp()
      });
      
      toast.success("Entreprise ajoutée avec succès !");
      onClose();
      setFormData({ name: "", domain: "Services", location: "Abidjan, Côte d'Ivoire", phone: "", email: "" });
    } catch (error: any) {
      toast.error("Erreur lors de l'ajout.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
        <div className="bg-[#A66037] p-8 text-[#FAF3E0] flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 dogon-pattern opacity-10" />
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Nouvelle Filiale</span>
             </div>
             <h2 className="text-3xl font-bold font-dogon tracking-tight">Ajouter une Entreprise</h2>
          </div>
          <button type="button" onClick={onClose} className="relative z-10 p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-10 space-y-6">
           <div className="form-field space-y-2">
              <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Nom de l'entreprise</label>
              <div className="relative group">
                 <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B89E7E]" />
                 <input 
                   required
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                   className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold" 
                   placeholder="Ex: NB DIGITAL" 
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-field space-y-2">
                 <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Secteur</label>
                 <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B89E7E]" />
                    <select 
                      value={formData.domain}
                      onChange={(e) => setFormData({...formData, domain: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold"
                    >
                       <option>Services</option>
                       <option>Commerce</option>
                       <option>Digital</option>
                       <option>Agriculture</option>
                    </select>
                 </div>
              </div>
              <div className="form-field space-y-2">
                 <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Siège</label>
                 <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B89E7E]" />
                    <input 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold" 
                    />
                 </div>
              </div>
           </div>

           <div className="form-field flex gap-4 pt-4">
              <button type="button" className="flex-1 h-16 rounded-2xl border-2 border-[#E8DCC4] text-[#A66037] font-bold" onClick={onClose}>Annuler</button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-[2] h-16 rounded-2xl bg-[#A66037] text-white font-bold text-lg shadow-xl"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Enregistrer"}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyModal;
