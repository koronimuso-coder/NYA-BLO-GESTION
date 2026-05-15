"use client";

import React, { useRef, useState } from "react";
import { User, Shield, Bell, Database, Save, Camera, Sparkles, Building, Globe, Loader2, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import toast from "react-hot-toast";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const TABS = [
  { id: "profile", label: "Profil Utilisateur", icon: User },
  { id: "security", label: "Sécurité & Accès", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "company", label: "Configuration Entreprise", icon: Building },
  { id: "system", label: "Paramètres Système", icon: Database },
];

export default function SettingsPage() {
  const { profile, user } = useAuth();
  const container = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form fields
  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [email] = useState(profile?.email || "");

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".page-header", { y: -20, opacity: 0, duration: 1 });
    tl.from(".settings-card", { x: -30, opacity: 0, stagger: 0.1, duration: 0.8 }, "-=0.6");
  }, { scope: container });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: displayName.trim(),
      });
      setSaved(true);
      toast.success("Profil mis à jour avec succès");
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={container} className="space-y-8 pb-12 relative">
      <div className="absolute inset-0 dogon-pattern opacity-5 pointer-events-none" />

      <div className="page-header flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-[#5C3D2E] font-dogon uppercase tracking-tight">Paramètres</h1>
          <p className="text-[#B89E7E] mt-1">Configurez votre espace de gestion et vos préférences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
         {/* Sidebar Tabs */}
         <div className="lg:col-span-1 space-y-4">
            {TABS.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-3xl transition-all ${
                  activeTab === tab.id 
                    ? "bg-[#5C3D2E] text-white shadow-xl shadow-[#5C3D2E]/20 translate-x-2" 
                    : "bg-white text-[#B89E7E] hover:bg-[#FAF3E0] hover:text-[#5C3D2E] border border-[#E8DCC4]"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wide">{tab.label}</span>
              </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="lg:col-span-2 space-y-8">
            {activeTab === "profile" && (
            <div className="settings-card bg-white p-10 rounded-[48px] shadow-premium border border-[#E8DCC4] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF3E0]/50 rounded-bl-full -mr-32 -mt-32" />
               
               <div className="flex items-center gap-6 mb-12 relative z-10">
                  <div className="relative group">
                     <div className="w-24 h-24 rounded-[32px] bg-[#5C3D2E] flex items-center justify-center border-4 border-[#FAF3E0] shadow-xl relative overflow-hidden">
                        <span className="text-4xl font-bold text-[#FAF3E0]">{displayName?.charAt(0) || "U"}</span>
                        <div className="absolute inset-0 dogon-pattern opacity-10" />
                     </div>
                     <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-[#1A0F0A] shadow-lg border-2 border-white hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5" />
                     </button>
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-[#5C3D2E] font-dogon">{displayName || "Administrateur"}</h3>
                     <p className="text-[#A66037] font-bold text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> {profile?.role?.replace('_', ' ') || 'Super Admin'}
                     </p>
                  </div>
               </div>

               <form onSubmit={handleSave} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest pl-1">Nom Complet</label>
                        <input 
                          value={displayName} 
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full p-5 rounded-2xl bg-[#FAF3E0]/30 border-2 border-transparent focus:border-[#D4AF37] focus:bg-white outline-none transition-all font-bold text-[#5C3D2E]" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest pl-1">Adresse E-mail</label>
                        <input 
                          value={email} 
                          disabled
                          className="w-full p-5 rounded-2xl bg-[#FAF3E0]/30 border-none font-bold text-[#B89E7E] cursor-not-allowed" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest pl-1">Fuseau Horaire</label>
                        <div className="relative">
                           <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B89E7E]" />
                           <select className="w-full pl-14 pr-5 py-5 rounded-2xl bg-[#FAF3E0]/30 border-2 border-transparent focus:border-[#D4AF37] outline-none font-bold text-[#5C3D2E] appearance-none">
                              <option>(GMT+00:00) Abidjan / Bamako</option>
                              <option>(GMT+01:00) Paris / Lagos</option>
                           </select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest pl-1">Langue Interface</label>
                        <select className="w-full p-5 rounded-2xl bg-[#FAF3E0]/30 border-2 border-transparent focus:border-[#D4AF37] outline-none font-bold text-[#5C3D2E] appearance-none">
                           <option>Français (Afrique)</option>
                           <option>Bambara (Beta)</option>
                           <option>English (UK)</option>
                        </select>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-[#E8DCC4]">
                     <button 
                       type="submit"
                       disabled={saving}
                       className="px-10 py-5 rounded-2xl dogon-gradient text-white font-bold text-lg shadow-xl shadow-[#A66037]/20 hover:shadow-2xl hover:shadow-[#A66037]/40 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                     >
                        {saving ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : saved ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <Save className="w-6 h-6" />
                        )}
                        {saving ? "Sauvegarde..." : saved ? "Sauvegardé !" : "Sauvegarder les Changements"}
                     </button>
                  </div>
               </form>
            </div>
            )}

            {activeTab === "security" && (
            <div className="settings-card bg-white p-10 rounded-[48px] shadow-premium border border-[#E8DCC4]">
               <h3 className="text-2xl font-bold text-[#5C3D2E] font-dogon mb-8">Sécurité & Accès</h3>
               <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-[#FAF3E0]/30 rounded-3xl">
                    <div>
                      <p className="font-bold text-[#5C3D2E]">Authentification à deux facteurs</p>
                      <p className="text-sm text-[#B89E7E]">Protégez votre compte avec une double vérification</p>
                    </div>
                    <div className="w-14 h-8 bg-[#E8DCC4] rounded-full relative cursor-pointer">
                      <div className="w-6 h-6 bg-white rounded-full absolute top-1 left-1 shadow-md transition-all" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-[#FAF3E0]/30 rounded-3xl">
                    <div>
                      <p className="font-bold text-[#5C3D2E]">Sessions actives</p>
                      <p className="text-sm text-[#B89E7E]">1 appareil connecté en ce moment</p>
                    </div>
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase">Sécurisé</span>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-[#FAF3E0]/30 rounded-3xl">
                    <div>
                      <p className="font-bold text-[#5C3D2E]">Changer le mot de passe</p>
                      <p className="text-sm text-[#B89E7E]">Dernière modification il y a 30 jours</p>
                    </div>
                    <button className="px-6 py-2.5 rounded-2xl border-2 border-[#A66037] text-[#A66037] font-bold text-sm hover:bg-[#A66037] hover:text-white transition-all">Modifier</button>
                  </div>
               </div>
            </div>
            )}

            {activeTab === "notifications" && (
            <div className="settings-card bg-white p-10 rounded-[48px] shadow-premium border border-[#E8DCC4]">
               <h3 className="text-2xl font-bold text-[#5C3D2E] font-dogon mb-8">Notifications</h3>
               <div className="space-y-6">
                  {["Nouvelles saisies de vente", "Rapports hebdomadaires", "Alertes de recouvrement", "Mises à jour système"].map((notif) => (
                    <div key={notif} className="flex items-center justify-between p-6 bg-[#FAF3E0]/30 rounded-3xl">
                      <p className="font-bold text-[#5C3D2E]">{notif}</p>
                      <div className="w-14 h-8 bg-[#D4AF37] rounded-full relative cursor-pointer">
                        <div className="w-6 h-6 bg-white rounded-full absolute top-1 right-1 shadow-md" />
                      </div>
                    </div>
                  ))}
               </div>
            </div>
            )}

            {activeTab === "company" && (
            <div className="settings-card bg-white p-10 rounded-[48px] shadow-premium border border-[#E8DCC4]">
               <h3 className="text-2xl font-bold text-[#5C3D2E] font-dogon mb-8">Configuration Entreprise</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest pl-1">Nom de l&apos;Entreprise</label>
                    <input defaultValue="NYA BLO SARL" className="w-full p-5 rounded-2xl bg-[#FAF3E0]/30 border-2 border-transparent focus:border-[#D4AF37] outline-none font-bold text-[#5C3D2E]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest pl-1">Devise</label>
                    <select className="w-full p-5 rounded-2xl bg-[#FAF3E0]/30 border-2 border-transparent focus:border-[#D4AF37] outline-none font-bold text-[#5C3D2E] appearance-none">
                      <option>FCFA (XOF)</option>
                      <option>EUR (€)</option>
                      <option>USD ($)</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest pl-1">Adresse du Siège</label>
                    <input defaultValue="Abidjan, Côte d'Ivoire" className="w-full p-5 rounded-2xl bg-[#FAF3E0]/30 border-2 border-transparent focus:border-[#D4AF37] outline-none font-bold text-[#5C3D2E]" />
                  </div>
               </div>
            </div>
            )}

            {activeTab === "system" && (
            <div className="settings-card bg-white p-10 rounded-[48px] shadow-premium border border-[#E8DCC4]">
               <h3 className="text-2xl font-bold text-[#5C3D2E] font-dogon mb-8">Paramètres Système</h3>
               <div className="space-y-6">
                  <div className="p-6 bg-[#FAF3E0]/30 rounded-3xl">
                    <p className="font-bold text-[#5C3D2E] mb-1">Version de l&apos;Application</p>
                    <p className="text-sm text-[#B89E7E]">NB GEST v2.1.0 — Build {new Date().toISOString().split('T')[0]}</p>
                  </div>
                  <div className="p-6 bg-[#FAF3E0]/30 rounded-3xl">
                    <p className="font-bold text-[#5C3D2E] mb-1">Base de Données</p>
                    <p className="text-sm text-[#B89E7E]">Firebase Firestore — Connecté <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full ml-1" /></p>
                  </div>
                  <div className="p-6 bg-[#FAF3E0]/30 rounded-3xl">
                    <p className="font-bold text-[#5C3D2E] mb-1">Stockage Utilisé</p>
                    <div className="mt-3 h-3 bg-[#E8DCC4] rounded-full overflow-hidden">
                      <div className="h-full w-1/4 bg-gradient-to-r from-[#A66037] to-[#D4AF37] rounded-full" />
                    </div>
                    <p className="text-xs text-[#B89E7E] mt-2">~25% utilisé sur la capacité totale</p>
                  </div>
               </div>
            </div>
            )}
         </div>
      </div>
    </div>
  );
}
