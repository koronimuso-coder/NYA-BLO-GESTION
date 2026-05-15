"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, Save, TrendingUp, CreditCard, User, Building2, Sparkles, Loader2, Calendar, Phone, MapPin, MessageSquare, ShieldCheck, Zap, Plus, Trash2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, increment, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Company {
  id: string;
  name: string;
}

interface EntryItem {
  id: string;
  clientName: string;
  clientContact: string;
  engin: string;
  motif: string;
  totalAmount: string;
  paidAmount: string;
  canal: string;
  modePaiement: string;
}

const EntryModal = ({ isOpen, onClose }: EntryModalProps) => {
  const { profile } = useAuth();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Common Info
  const [commonData, setCommonData] = useState({
    date: new Date().toISOString().split('T')[0],
    companyId: "",
    session: "Matin",
    localisation: "Abidjan",
    status: "Confirmé",
    prochaineAction: "",
    observation: ""
  });

  // Individual Entries
  const [items, setItems] = useState<EntryItem[]>([
    { id: '1', clientName: "", clientContact: "", engin: "", motif: "", totalAmount: "", paidAmount: "", canal: "Direct", modePaiement: "Espèces" }
  ]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const q = query(collection(db, "companies"), orderBy("name", "asc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setCompanies(list);
        if (list.length > 0 && !commonData.companyId) {
           setCommonData(prev => ({ ...prev, companyId: list[0].name }));
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    if (isOpen) fetchCompanies();
  }, [isOpen]);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
      gsap.fromTo(contentRef.current, 
        { scale: 0.9, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "power4.out" }
      );
    }
  }, { dependencies: [isOpen] });

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), clientName: "", clientContact: "", engin: "", motif: "", totalAmount: "", paidAmount: "", canal: "Direct", modePaiement: "Espèces" }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof EntryItem, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Pour chaque personne dans la liste, on crée une entrée Firestore
      const promises = items.map(item => {
        const total = Number(item.totalAmount) || 0;
        const paid = Number(item.paidAmount) || 0;
        return addDoc(collection(db, "daily_entries"), {
          ...commonData,
          ...item,
          totalAmount: total,
          paidAmount: paid,
          resteAVerser: total - paid,
          createdAt: new Date().toISOString(),
          serverTimestamp: serverTimestamp()
        });
      });

      await Promise.all(promises);
      
      // Update user's entriesCount
      if (profile?.uid) {
        const userRef = doc(db, "users", profile.uid);
        await updateDoc(userRef, {
          entriesCount: increment(items.length)
        });
      }
      
      toast.success(`${items.length} saisie(s) enregistrée(s) !`);
      onClose();
      // Reset
      setItems([{ id: '1', clientName: "", clientContact: "", engin: "", motif: "", totalAmount: "", paidAmount: "", canal: "Direct", modePaiement: "Espèces" }]);
    } catch (error: any) {
      toast.error("Erreur lors de l'enregistrement.");
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
      
      <div 
        ref={contentRef}
        className="relative bg-[#FAF3E0] w-full max-w-6xl max-h-[95vh] rounded-[48px] shadow-2xl border border-white/20 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#5C3D2E] p-6 text-[#FAF3E0] flex justify-between items-center relative shrink-0">
          <div className="absolute inset-0 dogon-pattern opacity-10" />
          <div className="relative z-10 flex items-center gap-4">
             <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-[#5C3D2E]" />
             </div>
             <div>
                <h2 className="text-2xl font-bold font-dogon tracking-tight">Nouvelle Saisie Groupée</h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Enregistrez plusieurs personnes en une fois</p>
             </div>
          </div>
          <button type="button" onClick={onClose} className="relative z-10 p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
           <form onSubmit={handleSubmit} className="space-y-8">
              {/* Common Fields Row */}
              <div className="bg-white/50 p-6 rounded-[32px] border border-[#E8DCC4] grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Date</label>
                    <input 
                      type="date" 
                      value={commonData.date}
                      onChange={(e) => setCommonData({...commonData, date: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold text-sm" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Filiale</label>
                    <select 
                      value={commonData.companyId}
                      onChange={(e) => setCommonData({...commonData, companyId: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold text-sm appearance-none"
                    >
                       {companies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Session</label>
                    <select 
                      value={commonData.session}
                      onChange={(e) => setCommonData({...commonData, session: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold text-sm"
                    >
                       <option>Matin</option>
                       <option>Après-midi</option>
                       <option>Soir</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Localisation</label>
                    <input 
                      value={commonData.localisation}
                      onChange={(e) => setCommonData({...commonData, localisation: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold text-sm" 
                      placeholder="Abidjan" 
                    />
                 </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center px-2">
                    <h3 className="text-xs font-bold text-[#5C3D2E] uppercase tracking-widest">Liste des Personnes</h3>
                    <button 
                      type="button" 
                      onClick={addItem}
                      className="flex items-center gap-2 px-4 py-2 bg-[#A66037] text-white rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-lg"
                    >
                       <Plus className="w-4 h-4" /> Ajouter une ligne
                    </button>
                 </div>

                 <div className="space-y-4">
                    {items.map((item, index) => (
                       <div key={item.id} className="relative bg-white p-6 rounded-[32px] border border-[#E8DCC4] shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                          <div className="md:col-span-1 space-y-2">
                             <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest ml-1">Nom</label>
                             <input 
                               required
                               value={item.clientName}
                               onChange={(e) => updateItem(item.id, 'clientName', e.target.value)}
                               className="w-full px-4 py-3 rounded-xl bg-[#FAF3E0]/30 border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold text-sm" 
                             />
                          </div>
                          <div className="md:col-span-1 space-y-2">
                             <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest ml-1">Engin</label>
                             <input 
                               value={item.engin}
                               onChange={(e) => updateItem(item.id, 'engin', e.target.value)}
                               className="w-full px-4 py-3 rounded-xl bg-[#FAF3E0]/30 border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold text-sm" 
                             />
                          </div>
                          <div className="md:col-span-1 space-y-2">
                             <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest ml-1">Motif</label>
                             <input 
                               value={item.motif}
                               onChange={(e) => updateItem(item.id, 'motif', e.target.value)}
                               className="w-full px-4 py-3 rounded-xl bg-[#FAF3E0]/30 border-none focus:ring-1 focus:ring-[#D4AF37]/20 font-bold text-sm" 
                             />
                          </div>
                          <div className="md:col-span-1 space-y-2">
                             <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest ml-1">Total</label>
                             <input 
                               type="number"
                               required
                               value={item.totalAmount}
                               onChange={(e) => updateItem(item.id, 'totalAmount', e.target.value)}
                               className="w-full px-4 py-3 rounded-xl bg-[#FAF3E0]/30 border-none focus:ring-1 focus:ring-[#D4AF37]/20 font-bold text-sm text-primary" 
                             />
                          </div>
                          <div className="md:col-span-1 space-y-2">
                             <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest ml-1">Versé</label>
                             <input 
                               type="number"
                               required
                               value={item.paidAmount}
                               onChange={(e) => updateItem(item.id, 'paidAmount', e.target.value)}
                               className="w-full px-4 py-3 rounded-xl bg-[#FAF3E0]/30 border-none focus:ring-1 focus:ring-[#D4AF37]/20 font-bold text-sm text-emerald-600" 
                             />
                          </div>
                          <div className="md:col-span-1 space-y-2">
                             <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest ml-1">Canal</label>
                             <select 
                               value={item.canal}
                               onChange={(e) => updateItem(item.id, 'canal', e.target.value)}
                               className="w-full px-3 py-3 rounded-xl bg-[#FAF3E0]/30 border-none text-xs font-bold appearance-none"
                             >
                                <option>Social</option>
                                <option>Direct</option>
                                <option>Referral</option>
                             </select>
                          </div>
                          <div className="flex gap-2">
                             <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest ml-1">Paiement</label>
                                <select 
                                  value={item.modePaiement}
                                  onChange={(e) => updateItem(item.id, 'modePaiement', e.target.value)}
                                  className="w-full px-3 py-3 rounded-xl bg-[#FAF3E0]/30 border-none text-sm font-bold appearance-none"
                                >
                                   <option>Espèces</option>
                                   <option>Wave</option>
                                   <option>OM</option>
                                   <option>Momo</option>
                                </select>
                             </div>
                             {items.length > 1 && (
                                <button 
                                  type="button" 
                                  onClick={() => removeItem(item.id)}
                                  className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center mb-0"
                                >
                                   <Trash2 className="w-4 h-4" />
                                </button>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Action Fields (shared) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Prochaine Action Globale</label>
                    <input 
                      value={commonData.prochaineAction}
                      onChange={(e) => setCommonData({...commonData, prochaineAction: e.target.value})}
                      className="w-full px-4 py-4 rounded-2xl bg-white border border-[#E8DCC4] focus:ring-2 focus:ring-[#D4AF37]/20 font-bold text-sm" 
                      placeholder="Ex: Confirmer les livraisons demain" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-widest pl-1">Observations Générales</label>
                    <input 
                      value={commonData.observation}
                      onChange={(e) => setCommonData({...commonData, observation: e.target.value})}
                      className="w-full px-4 py-4 rounded-2xl bg-white border border-[#E8DCC4] focus:ring-2 focus:ring-[#D4AF37]/20 font-bold text-sm" 
                      placeholder="Note particulière..." 
                    />
                 </div>
              </div>

              {/* Submit Footer */}
              <div className="fixed bottom-0 left-0 right-0 p-8 bg-[#FAF3E0]/80 backdrop-blur-md border-t border-[#E8DCC4] z-20 flex justify-end gap-4 rounded-b-[48px]">
                 <button 
                   type="button" 
                   onClick={onClose}
                   className="px-8 h-14 rounded-2xl border-2 border-[#E8DCC4] text-[#A66037] font-bold"
                 >
                   Annuler
                 </button>
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="px-12 h-14 rounded-2xl dogon-gradient text-white font-bold text-lg shadow-xl disabled:opacity-50 flex items-center gap-3"
                 >
                   {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-6 h-6" /> Enregistrer {items.length} Saisies</>}
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default EntryModal;
