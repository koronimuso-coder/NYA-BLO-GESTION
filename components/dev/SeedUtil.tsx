"use client";

import { useState } from "react";
import { Database, Loader2, Check, AlertCircle } from "lucide-react";
import { seedFirestore } from "@/lib/firebase-seed";
import { useAuth } from "@/components/providers/AuthProvider";

export function SeedUtil() {
  const { userData } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Only show for admins (or mock admin)
  if (userData?.role !== "ADMIN") return null;

  const handleSeed = async () => {
    if (!confirm("Voulez-vous initialiser les données Firestore ? Cela créera les entreprises de base et les leads d'exemple.")) return;
    
    setStatus("loading");
    try {
      await seedFirestore();
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={handleSeed}
        disabled={status === "loading"}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm shadow-lg transition-all border ${
          status === "loading" ? "bg-dogon-sirius text-white cursor-wait" :
          status === "success" ? "bg-dogon-success text-white" :
          status === "error" ? "bg-dogon-danger text-white" :
          "bg-dogon-card text-dogon-or border-dogon-or/30 hover:bg-dogon-or hover:text-dogon-nuit active:scale-95"
        }`}
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> :
         status === "success" ? <Check className="h-4 w-4" /> :
         status === "error" ? <AlertCircle className="h-4 w-4" /> :
         <Database className="h-4 w-4" />}
        
        {status === "loading" ? "INITIALISATION..." :
         status === "success" ? "COSMOGONIE PRÊTE !" :
         status === "error" ? "ERREUR SEED" :
         "INITIALISER L'UNIVERS"}
      </button>
    </div>
  );
}
