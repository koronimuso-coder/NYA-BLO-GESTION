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
  Loader2,
  Activity
} from "lucide-react";

import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Legend
} from "recharts";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface DashboardEntry {
  id: string;
  clientName: string;
  totalAmount: number;
  paidAmount: number;
  resteAVerser: number;
  companyId: string;
  createdAt: string;
  date: string;
}

interface DashboardStats {
  total: string;
  paid: string;
  pending: string;
  conversion: string;
  count: number;
}

export default function DashboardPage() {
  const { profile, loading } = useAuth();

  const container = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<DashboardEntry[]>([]);
  const [recentEntries, setRecentEntries] = useState<DashboardEntry[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
     total: "0",
     paid: "0",
     pending: "0",
     conversion: "0%",
     count: 0
  });

  useEffect(() => {
    const qAll = query(collection(db, "daily_entries"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(qAll, (snapshot) => {
      const allDocs = snapshot.docs.map(doc => {
        const data = doc.data();
        const total = Number(data.totalAmount || 0);
        const paid = Number(data.paidAmount || 0);
        return {
          id: doc.id,
          ...data,
          totalAmount: total,
          paidAmount: paid,
          resteAVerser: data.resteAVerser != null ? Number(data.resteAVerser) : (total - paid),
        } as DashboardEntry;
      });
      
      let t = 0;
      let p = 0;
      allDocs.forEach(d => {
        t += d.totalAmount;
        p += d.paidAmount;
      });
      
      setStats({
        total: t.toLocaleString(),
        paid: p.toLocaleString(),
        pending: (t - p).toLocaleString(),
        conversion: t > 0 ? Math.round((p / t) * 100) + "%" : "0%",
        count: allDocs.length
      });

      setEntries(allDocs);
      setRecentEntries(allDocs.slice(0, 5));
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

  // Prepare chart data from last 10 entries (reversed for chronological order)
  const chartData = entries.slice(0, 10).reverse().map(e => ({
    name: e.clientName?.substring(0, 12) || "Client",
    total: e.totalAmount,
    paid: e.paidAmount,
    reste: e.totalAmount - e.paidAmount,
  }));

  return (
    <div ref={container} className="space-y-8 pb-10">

      <div className="page-header flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#A66037] font-bold uppercase tracking-[0.2em] mb-1">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="text-3xl font-bold text-primary font-dogon uppercase tracking-tight">
            Bienvenue{profile?.displayName ? `, ${profile.displayName.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="text-[#B89E7E] mt-1">Vue globale de vos activités commerciales en temps réel.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-premium border border-[#E8DCC4]">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-sm font-bold text-primary">Temps Réel</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-premium border border-[#E8DCC4]">
             <Calendar className="w-4 h-4 text-secondary" />
             <span className="text-sm font-bold text-primary">{stats.count} ops</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard title="Total Ventes" value={stats.total} trend="Live" isPositive={true} icon={Target} subtitle="Chiffre d'affaires global" />
        <KpiCard title="Encaissements" value={stats.paid} trend="Live" isPositive={true} icon={CreditCard} subtitle="Fonds perçus" />
        <KpiCard title="En Attente" value={stats.pending} trend="Recouvrement" isPositive={false} icon={AlertCircle} subtitle="Montant à percevoir" />
        <KpiCard title="Taux Conversion" value={stats.conversion} trend={stats.conversion} isPositive={true} icon={TrendingUp} subtitle="Encaissé / Total" showFCFA={false} />
        <KpiCard title="Opérations" value={stats.count.toString()} trend="Total" isPositive={true} icon={Activity} subtitle="Saisies enregistrées" showFCFA={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="chart-box bg-white p-8 rounded-[40px] shadow-premium border border-[#E8DCC4]">
           <h3 className="font-bold text-xl text-primary font-dogon mb-8">Flux de Trésorerie</h3>
           <div className="h-[350px] w-full">
              {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DCC460" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} />
                    <YAxis axisLine={false} tickLine={false} fontSize={11} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                    <Tooltip 
                      formatter={(value: unknown) => Number(value).toLocaleString() + " FCFA"}
                      contentStyle={{ borderRadius: '16px', border: '1px solid #E8DCC4', fontWeight: 'bold' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="total" name="Total" stroke="#5C3D2E" strokeWidth={3} fill="#5C3D2E15" />
                    <Area type="monotone" dataKey="paid" name="Encaissé" stroke="#059669" strokeWidth={2} fill="#05966910" />
                    <Area type="monotone" dataKey="reste" name="Reste" stroke="#DC2626" strokeWidth={2} fill="#DC262610" strokeDasharray="5 5" />
                 </AreaChart>
              </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[#B89E7E] italic">
                  Aucune donnée disponible pour le graphique.
                </div>
              )}
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
               {recentEntries.map((entry) => (
                  <div key={entry.id} className="flex gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-[#FAF3E0] flex items-center justify-center shrink-0 border border-[#E8DCC4]">
                        <User className="w-6 h-6 text-[#5C3D2E]" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-primary truncate">{entry.clientName || "Client inconnu"}</p>
                        <p className="text-xs text-[#B89E7E] truncate">{entry.companyId} • {Number(entry.totalAmount).toLocaleString()} FCFA</p>
                     </div>
                     <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-emerald-600">{Number(entry.paidAmount).toLocaleString()}</p>
                        <span className="text-[10px] font-bold text-[#A66037]">
                          {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : entry.date ? new Date(entry.date).toLocaleDateString() : "--"}
                        </span>
                     </div>
                  </div>
               ))}
               {recentEntries.length === 0 && (
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
  showFCFA?: boolean;
}

const KpiCard = ({ title, value, trend, isPositive, icon: Icon, subtitle, showFCFA = true }: KpiCardProps) => (

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
        <h3 className="text-xl font-bold text-primary font-dogon mb-1">{value}{showFCFA ? " FCFA" : ""}</h3>
        <p className="text-[10px] text-[#A66037] font-medium">{subtitle}</p>
      </div>
    </div>
  </div>
);
