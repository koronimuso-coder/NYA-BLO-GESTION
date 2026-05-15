"use client";

import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  TrendingUp, 
  Target, 
  CreditCard, 
  AlertCircle,
  Calendar,
  ArrowRight,
  User,
  Loader2
} from "lucide-react";


import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from "recharts";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { collection, query, limit, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface DashboardEntry {
  id: string;
  clientName: string;
  totalAmount: number;
  paidAmount: number;
  companyId: string;
  createdAt: string;
}

interface DashboardStats {
  total: string;
  paid: string;
  pending: string;
  conversion: string;
}

export default function DashboardPage() {
  const { profile, loading } = useAuth();

  const container = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<DashboardEntry[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
     total: "0",
     paid: "0",
     pending: "0",
     conversion: "0%"
  });

  console.log("Connecté en tant que :", profile?.displayName);


  useEffect(() => {
    // Real-time listener for ALL entries for stats
    const qAll = query(collection(db, "daily_entries"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(qAll, (snapshot) => {
      const allDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as DashboardEntry[];
      
      // Update stats based on ALL data
      let t = 0;
      let p = 0;
      snapshot.docs.forEach(d => {
        const data = d.data();
        t += Number(data.totalAmount || 0);
        p += Number(data.paidAmount || 0);
      });
      
      setStats({
        total: t.toLocaleString(),
        paid: p.toLocaleString(),
        pending: (t - p).toLocaleString(),
        conversion: t > 0 ? Math.round((p / t) * 100) + "%" : "0%"
      });

      // Update recent entries (last 5)
      setEntries(allDocs.slice(0, 5));
    }, (error) => {
      console.error("Dashboard Real-time Error:", error);
    });

    return () => unsubscribe();
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".page-header", { y: -30, opacity: 0, duration: 1 });
    tl.from(".kpi-card", { scale: 0.8, opacity: 0, stagger: 0.1, duration: 0.8 }, "-=0.6");
    tl.from(".chart-box", { y: 40, opacity: 0, stagger: 0.2, duration: 1 }, "-=0.4");
  }, { scope: container });

  if (loading || !profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
        <p className="text-[#A66037] font-bold animate-pulse">Synchronisation avec les archives Dogon...</p>
      </div>
    );
  }

  return (
    <div ref={container} className="space-y-8 pb-10">

      <div className="page-header flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-dogon uppercase tracking-tight">Tableau de Bord Réel</h1>
          <p className="text-[#B89E7E] mt-1">Données issues de votre infrastructure Firebase.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-premium border border-[#E8DCC4]">
           <Calendar className="w-4 h-4 text-secondary" />
           <span className="text-sm font-bold text-primary">Temps Réel</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Ventes (Réel)" value={stats.total} trend="Live" isPositive={true} icon={Target} subtitle="Données synchronisées" />
        <KpiCard title="Encaissements" value={stats.paid} trend="Live" isPositive={true} icon={CreditCard} subtitle="Fonds perçus" />
        <KpiCard title="En Attente" value={stats.pending} trend="Recouvrement" isPositive={false} icon={AlertCircle} subtitle="À percevoir" />
        <KpiCard title="Activités" value={entries.length.toString()} trend="Sync" isPositive={true} icon={TrendingUp} subtitle="Dernières saisies" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="chart-box bg-white p-8 rounded-[40px] shadow-premium border border-[#E8DCC4]">
           <h3 className="font-bold text-xl text-primary font-dogon mb-8">Flux de Trésorerie</h3>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={entries.map(e => ({ name: e.clientName || "Client", total: e.totalAmount, paid: e.paidAmount }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DCC460" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="total" stroke="#5C3D2E" strokeWidth={3} fill="#5C3D2E10" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="chart-box bg-white p-8 rounded-[40px] shadow-premium border border-[#E8DCC4]">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-bold text-xl text-primary font-dogon">Dernières Opérations</h3>
               <button className="text-xs font-bold text-secondary uppercase tracking-[0.2em] flex items-center hover:translate-x-1 transition-transform">
                  Historique complet <ArrowRight className="ml-1 w-4 h-4" />
               </button>
            </div>
            <div className="space-y-6">
               {entries.map((entry, i) => (
                  <div key={i} className="flex gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-[#FAF3E0] flex items-center justify-center shrink-0 border border-[#E8DCC4]">
                        <User className="w-6 h-6 text-[#5C3D2E]" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-primary truncate">{entry.clientName || "Client inconnu"}</p>
                        <p className="text-xs text-[#B89E7E] truncate">{entry.companyId} • {Number(entry.totalAmount).toLocaleString()} FCFA</p>
                     </div>
                     <span className="text-[10px] font-bold text-[#A66037]">{new Date(entry.createdAt).toLocaleDateString()}</span>
                  </div>
               ))}
               {entries.length === 0 && (
                  <p className="text-center py-10 text-slate-400 italic">Aucune donnée trouvée dans Firebase.</p>
               )}
            </div>
        </div>
      </div>
    </div>
  );
}

interface KpiCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ElementType;
  subtitle: string;
}

const KpiCard = ({ title, value, trend, isPositive, icon: Icon, subtitle }: KpiCardProps) => (

  <div className="kpi-card bg-white p-6 rounded-[32px] shadow-premium border border-[#E8DCC4] relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-[#5C3D2E]/5 rounded-bl-[80px] -mr-6 -mt-6 group-hover:bg-[#5C3D2E]/10 transition-all duration-500" />
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-[#5C3D2E]/5 p-3 rounded-2xl text-[#5C3D2E] group-hover:bg-[#5C3D2E] group-hover:text-white transition-all duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <div className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isPositive ? 'text-[#D4AF37]' : 'text-orange-600'}`}>
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[#B89E7E] text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-primary font-dogon mb-1">{value} FCFA</h3>
        <p className="text-[10px] text-[#A66037] font-medium">{subtitle}</p>
      </div>
    </div>
  </div>
);
