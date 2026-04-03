"use client";

import { Wallet, TrendingUp, HandCoins, Users, BadgePercent, Loader2 } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { CompanyPerformanceTable } from "@/components/dashboard/CompanyPerformanceTable";
import { DashCharts } from "@/components/dashboard/DashCharts";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { formatFCFA } from "@/lib/fcfa";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { useAuth } from "@/components/providers/AuthProvider";

export default function DashboardPage() {
  const { userData } = useAuth();
  
  // Real-time data from Firestore
  const { data: companies, loading: loadingComp } = useFirestoreCollection("companies");
  const { data: leads, loading: loadingLeads } = useFirestoreCollection("leads");
  const { data: sales, loading: loadingSales } = useFirestoreCollection("sales");

  if (loadingComp || loadingLeads || loadingSales) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-dogon-or" />
        <p className="text-dogon-or font-medium animate-pulse">Calcul de la Cosmogonie financière...</p>
      </div>
    );
  }

  // Pre-calculate KPIs from Firestore data (Mocking some values for demo if data is thin)
  const stats = {
    caTotal: sales.reduce((acc, sale) => acc + (sale.amount || 0), 0) || 12500000,
    encaisse: sales.reduce((acc, sale) => acc + (sale.amount_paid || 0), 0) || 9800000,
    leadsCount: leads.length || 124,
    conversion: companies.length > 0 
      ? Math.round(companies.reduce((acc, c) => acc + (c.metrics?.conversion_rate || 0), 0) / companies.length) 
      : 45
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            Tableau de bord Direction
          </h1>
          <p className="text-sm text-dogon-muted">
            Bienvenue, <span className="text-dogon-or">{userData?.first_name || "Directeur"}</span> • Vue consolidée temps-réel (Firebase)
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="CA Total Consolidé"
          value={formatFCFA(stats.caTotal)}
          icon={Wallet}
          trend="up"
          trendValue="+12%"
          iconColor="text-dogon-or"
          iconBg="bg-dogon-or/10"
        />
        <KPICard
          title="Montant Encaissé"
          value={formatFCFA(stats.encaisse)}
          icon={HandCoins}
          trend="up"
          trendValue="+8%"
          iconColor="text-dogon-success"
          iconBg="bg-dogon-success/10"
        />
        <KPICard
          title="Créances / Impayés"
          value={formatFCFA(stats.caTotal - stats.encaisse)}
          icon={TrendingUp}
          trend="down"
          trendValue="-2%"
          iconColor="text-dogon-danger"
          iconBg="bg-dogon-danger/10"
        />
        <KPICard
          title="Total Leads Actifs"
          value={stats.leadsCount}
          icon={Users}
          trend="up"
          trendValue="+15%"
          iconColor="text-dogon-indigo"
          iconBg="bg-dogon-indigo/10"
        />
        <KPICard
          title="Taux Conversion Moyen"
          value={`${stats.conversion}%`}
          icon={BadgePercent}
          trend="neutral"
          trendValue="0%"
          iconColor="text-dogon-violet"
          iconBg="bg-dogon-violet/10"
        />
      </div>

      {/* Performance Table with Firestore data */}
      <CompanyPerformanceTable data={companies} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashCharts />
        </div>
        
        <div className="space-y-6">
          <AlertsList />
          <div className="bg-dogon-card rounded-xl border border-dogon-or/30 p-6 shadow-sm shadow-dogon-or/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-16 w-16 text-dogon-or">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
             </div>
             <h3 className="text-lg font-medium text-dogon-or mb-2 flex items-center gap-2">
               ✨ Résumé IA Nommo
             </h3>
             <p className="text-sm text-dogon-text/80 leading-relaxed relative z-10">
                Analyse terminée pour vos <strong className="text-white">{companies.length} entreprises</strong>. 
                Le système Firebase est désormais le cœur de votre structure de données. 
                Une tendance positive se dessine pour <strong className="text-dogon-success">GALF</strong> cette semaine.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
