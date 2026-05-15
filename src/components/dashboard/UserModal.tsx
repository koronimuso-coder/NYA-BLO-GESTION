"use client";

import React, { useRef, useState } from "react";
import { X, Save, User, ShieldCheck, Mail, Sparkles, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import toast from "react-hot-toast";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserModal = ({ isOpen, onClose }: UserModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    role: "sales_agent",
    active: true
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
      // Create profile in Firestore
      await addDoc(collection(db, "users"), {
        ...formData,
        createdAt: new Date().toISOString(),
        serverTimestamp: serverTimestamp()
      });
      
      toast.success("Collaboratrice ajoutée !");
      onClose();
      setFormData({ displayName: "", email: "", role: "sales_agent", active: true });
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
        className="relative bg-[#FAF3E0] w-full max-w-xl rounded-[48px] shadow-2xl border border-white/20 overflow-hidden"
      >
        <div className="bg-[#5C3D2E] p-8 text-[#FAF3E0] flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 dogon-pattern opacity-10" />
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Recrutement Force de Vente</span>
             </div>
             <h2 className="text-3xl font-bold font-dogon tracking-tight">Nouvelle Collaboratrice</h2>
          </div>
          <button type="button" onClick={onClose} className="relative z-10 p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-10 space-y-6">
           <div className="form-field space-y-2">
              <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Nom Complet</label>
              <div className="relative group">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B89E7E]" />
                 <input 
                   required
                   value={formData.displayName}
                   onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                   className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold" 
                   placeholder="Identité de la force de vente" 
                 />
              </div>
           </div>

           <div className="form-field space-y-2">
              <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Email</label>
              <div className="relative group">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B89E7E]" />
                 <input 
                   required
                   type="email"
                   value={formData.email}
                   onChange={(e) => setFormData({...formData, email: e.target.value})}
                   className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold" 
                   placeholder="contact@nyablo.com" 
                 />
              </div>
           </div>

           <div className="form-field space-y-2">
              <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Rôle</label>
              <div className="relative group">
                 <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B89E7E]" />
                 <select 
                   value={formData.role}
                   onChange={(e) => setFormData({...formData, role: e.target.value})}
                   className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold"
                 >
                    <option value="sales_agent">Agente Commerciale</option>
                    <option value="admin">Administratrice</option>
                    <option value="super_admin">Super Administratrice</option>
                 </select>
              </div>
           </div>

           <div className="form-field flex gap-4 pt-4">
              <button type="button" className="flex-1 h-16 rounded-2xl border-2 border-[#E8DCC4] text-[#A66037] font-bold" onClick={onClose}>Annuler</button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-[2] h-16 rounded-2xl dogon-gradient text-white font-bold text-lg shadow-xl"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Intégrer"}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default UserModal;
