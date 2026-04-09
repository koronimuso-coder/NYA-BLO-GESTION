import React, { useRef, useState, useEffect } from "react";
import { Plus, Building2, MapPin, Phone, Mail, TrendingUp, Users, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface Company {
  id: string;
  name: string;
  sector: string;
  address: string;
  phone: string;
  email: string;
  staffCount: number;
  sales: string;
  status: string;
}

export default function CompaniesPage() {
  const container = useRef<HTMLDivElement>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "companies"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
      setCompanies(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useGSAP(() => {
    if (!loading) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".page-header", { y: -20, opacity: 0, duration: 0.8 });
      tl.from(".stat-card", { scale: 0.9, opacity: 0, stagger: 0.1, duration: 0.6 }, "-=0.4");
      tl.from(".company-card", { y: 30, opacity: 0, stagger: 0.15, duration: 0.8 }, "-=0.2");
    }
  }, { scope: container, dependencies: [loading] });

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
       <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
       <p className="text-[#A66037] font-bold">Récupération des archives filiales...</p>
    </div>
  );

  return (
    <div ref={container} className="space-y-8 pb-12 relative text-[#2D1A12]">
      <div className="absolute inset-0 dogon-pattern opacity-5 pointer-events-none" />
      
      <div className="page-header flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-[#5C3D2E] font-dogon uppercase tracking-tight">Gestion des Entreprises</h1>
          <p className="text-[#B89E7E] mt-1">Pilotez vos filiales et partenaires avec la sagesse Dogon.</p>
        </div>
        <Button variant="gold" className="rounded-2xl shadow-gold h-14 min-w-[240px]">
          <Plus className="w-5 h-5 mr-3" />
          Ajouter une Entreprise
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {[
          { label: "Total Filiales", value: companies.length.toString(), icon: Building2, color: "bg-[#5C3D2E]" },
          { label: "Performance Globale", value: "+28%", icon: TrendingUp, color: "bg-[#A66037]" },
          { label: "Forces de Vente", value: "Actif", icon: Users, color: "bg-[#D4AF37]" },
        ].map((stat, i) => (
          <div key={i} className="stat-card bg-white p-6 rounded-3xl shadow-premium border border-[#E8DCC4] flex items-center gap-6">
             <div className={`${stat.color} p-4 rounded-2xl text-[#FAF3E0] shadow-xl`}>
                <stat.icon className="w-6 h-6" />
             </div>
             <div>
                <p className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-[#5C3D2E] font-dogon">{stat.value}</h3>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {companies.map((company) => (
          <div key={company.id} className="company-card bg-white rounded-[40px] shadow-premium border border-[#E8DCC4] overflow-hidden flex flex-col hover:border-[#D4AF37]/50 transition-all group">
            <div className="p-8 pb-6">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-3xl bg-[#FAF3E0] flex items-center justify-center border border-[#E8DCC4] text-[#5C3D2E] group-hover:bg-[#5C3D2E] group-hover:text-[#FAF3E0] transition-all duration-500 shadow-sm relative overflow-hidden">
                     <Building2 className="w-8 h-8 relative z-10" />
                     <div className="absolute inset-0 dogon-pattern opacity-10" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      company.status === "Actif" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {company.status || "Actif"}
                    </span>
                    <Sparkles className="w-4 h-4 text-[#D3AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
               </div>
               
               <h3 className="text-2xl font-bold text-[#5C3D2E] font-dogon mb-1">{company.name}</h3>
               <p className="text-[#A66037] font-bold text-[10px] uppercase tracking-[0.2em] mb-7">{company.sector}</p>
               
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#2D1A12]/60 text-sm">
                     <MapPin className="w-4 h-4 text-[#A66037]" />
                     <span className="truncate">{company.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#2D1A12]/60 text-sm">
                     <Phone className="w-4 h-4 text-[#A66037]" />
                     <span>{company.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#2D1A12]/60 text-sm">
                     <Mail className="w-4 h-4 text-[#A66037]" />
                     <span className="truncate">{company.email}</span>
                  </div>
               </div>
            </div>

            <div className="mt-auto px-8 py-6 bg-[#FAF3E0]/30 border-t border-[#E8DCC4]/50 flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#B89E7E] uppercase tracking-widest">C.A Mensuel</span>
                  <span className="font-bold text-[#5C3D2E] text-lg">{company.sales || "0"} <span className="text-[10px]">FCFA</span></span>
               </div>
               <button className="w-12 h-12 rounded-2xl bg-white border border-[#E8DCC4] flex items-center justify-center text-[#5C3D2E] hover:bg-[#5C3D2E] hover:text-white transition-all group-hover:border-[#5C3D2E]">
                  <ArrowRight className="w-5 h-5" />
               </button>
            </div>
          </div>
        ))}
        {companies.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-[#E8DCC4]">
             <p className="text-[#B89E7E] italic">Aucune filiale enregistrée. Commencez par en ajouter une.</p>
          </div>
        )}
      </div>
    </div>
  );
}
