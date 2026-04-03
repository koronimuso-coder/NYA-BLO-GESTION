"use client";

import { useState } from "react";
import { User, Bell, Shield, Database, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function SettingsPage() {
  const { user, logOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"profil" | "database">("profil");
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch("/api/admin/reboot");
      if (res.ok) {
        setSeedResult("✅ Base de données initialisée avec succès !");
      } else {
        setSeedResult("❌ Erreur lors de l'initialisation.");
      }
    } catch {
      setSeedResult("❌ Erreur de connexion au script d'initialisation.");
    } finally {
      setIsSeeding(false);
    }
  };

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
                  <button 
                    onClick={() => setActiveTab("profil")}
                    className={`p-3 flex items-center gap-3 text-sm font-bold rounded-lg cursor-pointer transition-colors ${activeTab === 'profil' ? 'text-white bg-dogon-sirius/30' : 'text-dogon-muted hover:bg-dogon-sirius/10 hover:text-white'}`}>
                      <User className="h-4 w-4" /> Profil Administrateur
                  </button>
                  <button 
                    onClick={() => setActiveTab("database")}
                    className={`p-3 flex items-center gap-3 text-sm font-bold rounded-lg cursor-pointer transition-colors ${activeTab === 'database' ? 'text-white bg-dogon-sirius/30' : 'text-dogon-muted hover:bg-dogon-sirius/10 hover:text-white'}`}>
                      <Database className="h-4 w-4" /> Base de données
                  </button>
                  <span className="p-3 flex items-center gap-3 text-sm text-dogon-muted opacity-50 cursor-not-allowed">
                      <Bell className="h-4 w-4" /> Notifications
                  </span>
                  <span className="p-3 flex items-center gap-3 text-sm text-dogon-muted opacity-50 cursor-not-allowed">
                      <Shield className="h-4 w-4" /> Sécurité
                  </span>
              </nav>
          </div>

          {/* Contenu paramètre */}
          <div className="flex-1 bg-dogon-card rounded-xl border border-dogon-sirius p-6">
             {activeTab === "profil" ? (
               <>
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
               </>
             ) : (
               <>
                 <h2 className="text-lg font-bold text-white mb-6 tracking-tight uppercase border-b border-dogon-sirius pb-4">Gestion de la Base de Données</h2>
                 
                 <div className="space-y-6 max-w-2xl">
                    <div className="p-4 bg-dogon-sirius/20 border border-dogon-sirius rounded-xl">
                      <h3 className="text-dogon-or font-bold mb-2 flex items-center gap-2">
                        <Database className="h-4 w-4" /> Cosmogonie Financière
                      </h3>
                      <p className="text-sm text-dogon-muted mb-6 leading-relaxed">
                        L'initialisation de la base de données peuple votre instance Firestore avec les données de démonstration : 
                        Entreprises (GALF, Yoela), Leads CRM, et Registres de Ventes. 
                        <strong> Utilisez cette fonction lors du premier déploiement.</strong>
                      </p>
                      
                      <button 
                        onClick={handleSeed}
                        disabled={isSeeding}
                        className="w-full py-3 bg-dogon-or text-dogon-nuit font-bold rounded-lg hover:bg-dogon-or/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                      >
                        {isSeeding ? <><Loader2 className="h-4 w-4 animate-spin" /> Synchronisation...</> : "Initialiser les données (SEED)"}
                      </button>

                      {seedResult && (
                        <p className={`mt-4 text-sm font-medium text-center p-2 rounded ${seedResult.includes('✅') ? 'bg-dogon-success/10 text-dogon-success' : 'bg-dogon-danger/10 text-dogon-danger'}`}>
                          {seedResult}
                        </p>
                      )}
                    </div>

                    <div className="mt-8 p-4 bg-dogon-nuit border border-dogon-sirius rounded-xl opacity-60">
                       <h4 className="text-xs font-bold uppercase tracking-widest text-dogon-muted mb-2">Statut Firestore</h4>
                       <div className="flex items-center gap-2 text-dogon-success text-sm">
                          <div className="h-2 w-2 rounded-full bg-dogon-success animate-pulse"></div>
                          Connecté (Projet: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID})
                       </div>
                    </div>
                 </div>
               </>
             )}
          </div>
      </div>
    </div>
  );
}
