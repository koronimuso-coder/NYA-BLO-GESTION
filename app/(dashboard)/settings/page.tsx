"use client";

import { Settings2, User, Bell, Shield, Database } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function SettingsPage() {
  const { user, logOut } = useAuth();

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Paramètres Système</h1>
          <p className="text-sm text-dogon-muted">Configuration globale du NYA BLO OS</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full">
          {/* Menu latéral paramètres */}
          <div className="w-full md:w-64 bg-dogon-card rounded-xl border border-dogon-sirius overflow-hidden flex-shrink-0">
              <nav className="flex flex-col p-2 space-y-1">
                  <span className="p-3 flex items-center gap-3 text-sm font-bold text-white bg-dogon-sirius/30 rounded-lg cursor-pointer">
                      <User className="h-4 w-4" /> Profil Administrateur
                  </span>
                  <span className="p-3 flex items-center gap-3 text-sm text-dogon-muted hover:bg-dogon-sirius/10 hover:text-white rounded-lg cursor-pointer transition-colors">
                      <Settings2 className="h-4 w-4" /> Préférences
                  </span>
                  <span className="p-3 flex items-center gap-3 text-sm text-dogon-muted hover:bg-dogon-sirius/10 hover:text-white rounded-lg cursor-pointer transition-colors">
                      <Bell className="h-4 w-4" /> Notifications
                  </span>
                  <span className="p-3 flex items-center gap-3 text-sm text-dogon-muted hover:bg-dogon-sirius/10 hover:text-white rounded-lg cursor-pointer transition-colors">
                      <Shield className="h-4 w-4" /> Sécurité & Accès
                  </span>
                  <span className="p-3 flex items-center gap-3 text-sm text-dogon-muted hover:bg-dogon-sirius/10 hover:text-white rounded-lg cursor-pointer transition-colors">
                      <Database className="h-4 w-4" /> Base de données
                  </span>
              </nav>
          </div>

          {/* Contenu paramètre */}
          <div className="flex-1 bg-dogon-card rounded-xl border border-dogon-sirius p-6">
             <h2 className="text-lg font-bold text-white mb-6 tracking-tight uppercase border-b border-dogon-sirius pb-4">Profil Administrateur</h2>
             
             <div className="space-y-6 max-w-2xl">
                 <div className="flex items-center gap-6">
                     <div className="h-24 w-24 rounded-full bg-dogon-nuit border border-dogon-or flex items-center justify-center text-3xl font-bold text-dogon-or">
                         {user?.email?.charAt(0).toUpperCase() || "A"}
                     </div>
                     <div>
                         <button className="px-4 py-2 border border-dogon-sirius text-sm text-white rounded-lg hover:bg-dogon-sirius transition-colors">
                             Modifier Avatar
                         </button>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6 pt-4">
                     <div>
                         <label className="block text-xs uppercase text-dogon-muted font-bold tracking-widest mb-2">Email de Connexion</label>
                         <input type="email" disabled value={user?.email || ""} className="w-full bg-dogon-nuit border border-dogon-sirius rounded-lg p-3 text-sm text-white opacity-50 cursor-not-allowed" />
                     </div>
                     <div>
                         <label className="block text-xs uppercase text-dogon-muted font-bold tracking-widest mb-2">Rôle Système</label>
                         <input type="text" disabled value="CEO / Directeur Général" className="w-full bg-dogon-nuit border border-dogon-or/50 text-dogon-or rounded-lg p-3 text-sm font-bold opacity-80 cursor-not-allowed" />
                     </div>
                 </div>

                 <div className="pt-6 border-t border-dogon-sirius">
                     <button 
                        onClick={logOut}
                        className="px-6 py-2.5 bg-dogon-danger/10 text-dogon-danger border border-dogon-danger/30 rounded-lg hover:bg-dogon-danger hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
                     >
                         Déconnexion Systémique
                     </button>
                 </div>
             </div>
          </div>
      </div>
    </div>
  );
}
