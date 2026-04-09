"use client";

import React, { useRef } from "react";
import { User, Shield, Bell, Database, Save, Camera, Sparkles, Building, Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function SettingsPage() {
  const { profile } = useAuth();
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".page-header", { y: -20, opacity: 0, duration: 1 });
    tl.from(".settings-card", { x: -30, opacity: 0, stagger: 0.1, duration: 0.8 }, "-=0.6");
  }, { scope: container });

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
         {/* Sidebar Tabs Mock */}
         <div className="lg:col-span-1 space-y-4">
            {[
              { id: "profile", label: "Profil Utilisateur", icon: User, active: true },
              { id: "security", label: "Sécurité & Accès", icon: Shield, active: false },
              { id: "notifications", label: "Notifications", icon: Bell, active: false },
              { id: "company", label: "Configuration Entreprise", icon: Building, active: false },
              { id: "system", label: "Paramètres Système", icon: Database, active: false },
            ].map((tab) => (
              <button 
                key={tab.id}
                className={`w-full flex items-center gap-4 p-5 rounded-3xl transition-all ${
                  tab.active 
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
            <div className="settings-card bg-white p-10 rounded-[48px] shadow-premium border border-[#E8DCC4] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF3E0]/50 rounded-bl-full -mr-32 -mt-32" />
               
               <div className="flex items-center gap-6 mb-12 relative z-10">
                  <div className="relative group">
                     <div className="w-24 h-24 rounded-[32px] bg-[#5C3D2E] flex items-center justify-center border-4 border-[#FAF3E0] shadow-xl relative overflow-hidden">
                        <User className="w-12 h-12 text-[#FAF3E0]" />
                        <div className="absolute inset-0 dogon-pattern opacity-10" />
                     </div>
                     <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-[#1A0F0A] shadow-lg border-2 border-white hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5" />
                     </button>
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-[#5C3D2E] font-dogon">{profile?.displayName || "Administrateur Dogon"}</h3>
                     <p className="text-[#A66037] font-bold text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> {profile?.role?.replace('_', ' ') || 'Super Admin'}
                     </p>
                  </div>
               </div>

               <form className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest pl-1">Nom Complet</label>
                        <input defaultValue={profile?.displayName || ""} className="w-full p-5 rounded-2xl bg-[#FAF3E0]/30 border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold text-[#5C3D2E]" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest pl-1">Adresse E-mail</label>
                        <input defaultValue={profile?.email || ""} className="w-full p-5 rounded-2xl bg-[#FAF3E0]/30 border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold text-[#5C3D2E]" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest pl-1">Fuseau Horaire</label>
                        <div className="relative">
                           <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B89E7E]" />
                           <select className="w-full pl-14 pr-5 py-5 rounded-2xl bg-[#FAF3E0]/30 border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold text-[#5C3D2E] appearance-none">
                              <option>(GMT+00:00) Abidjan / Bamako</option>
                              <option>(GMT+01:00) Paris / Lagos</option>
                           </select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest pl-1">Langue Interface</label>
                        <select className="w-full p-5 rounded-2xl bg-[#FAF3E0]/30 border-none focus:ring-2 focus:ring-[#D4AF37]/20 font-bold text-[#5C3D2E] appearance-none">
                           <option>Français (Afrique)</option>
                           <option>Bambara (Beta)</option>
                           <option>English (UK)</option>
                        </select>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-[#E8DCC4]">
                     <button className="px-10 py-5 rounded-2xl dogon-gradient text-white font-bold text-lg shadow-xl shadow-[#A66037]/20 hover:shadow-2xl hover:shadow-[#A66037]/40 transition-all flex items-center justify-center gap-3 active:scale-95">
                        <Save className="w-6 h-6" />
                        Sauvegarder les Changements
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
    </div>
  );
}
