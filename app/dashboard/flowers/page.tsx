"use client";

import { useState } from "react";
import { Flower2, ShoppingBag, Truck, CalendarHeart, AlertCircle, Loader2 } from "lucide-react";
import { formatFCFA } from "@/lib/fcfa";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { where } from "firebase/firestore";

export default function FlowersModulePage() {
  const [activeTab, setActiveTab] = useState<"inventory" | "orders">("inventory");

  // Real-time inventory from Firestore for Flowers
  const { data: inventory, loading: loadingInv } = useFirestoreCollection("inventory", [
    where("company_id", "==", "yoela-flowers")
  ]);

  // Real-time sales acting as orders for now
  const { data: orders, loading: loadingOrders } = useFirestoreCollection("sales", [
    where("company_id", "==", "yoela-flowers")
  ]);

  if (loadingInv || loadingOrders) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-dogon-danger" />
        <p className="text-dogon-danger font-medium animate-pulse">Ouverture de la serre Yoela...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-12">
      {/* En-tête Module */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 rounded-xl relative p-6 overflow-hidden border border-dogon-danger/20">
        <div className="absolute inset-0 bg-gradient-to-r from-dogon-card to-dogon-card/50 z-0"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-dogon-danger/5 -skew-x-12 blur-3xl z-0"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-dogon-danger/20 rounded-lg border border-dogon-danger/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <Flower2 className="h-8 w-8 text-dogon-danger" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Yoela Flowers</h1>
            <p className="text-sm text-dogon-danger font-medium tracking-wide uppercase">Secteur: Artisanat Floral & Événementiel</p>
          </div>
        </div>

        <div className="relative z-10 flex border border-dogon-sirius rounded-lg bg-dogon-nuit p-1">
          <button 
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${activeTab === 'inventory' ? 'bg-dogon-danger text-white shadow-sm' : 'text-dogon-text hover:text-white'}`}
          >
            <ShoppingBag className="h-4 w-4" /> Stock / Inventaire
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${activeTab === 'orders' ? 'bg-dogon-danger text-white shadow-sm' : 'text-dogon-text hover:text-white'}`}
          >
            <CalendarHeart className="h-4 w-4" /> Commandes actives
          </button>
        </div>
      </div>

      {activeTab === "inventory" && (
        <div className="bg-dogon-card rounded-xl border border-dogon-sirius shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-dogon-sirius flex justify-between items-center bg-dogon-card/50">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              Inventaire Floral ({inventory.length} articles)
              {inventory.some((i: any) => i.stock <= i.min_stock) && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-1 bg-dogon-alert/10 text-dogon-alert border border-dogon-alert/20 rounded-full font-bold uppercase">
                  <AlertCircle className="h-3 w-3" /> Alertes Stock
                </span>
              )}
            </h2>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-dogon-muted uppercase bg-dogon-sirius/30">
              <tr>
                <th className="px-6 py-4 font-medium">Référence</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium text-right">Quantité disp.</th>
                <th className="px-6 py-4 font-medium">Prix Vente (Unité)</th>
                <th className="px-6 py-4 font-medium">État Stock</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item: any) => (
                <tr key={item.id} className="border-b border-dogon-sirius/50 hover:bg-dogon-sirius/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{item.name}</div>
                    <div className="text-[10px] text-dogon-muted font-mono">{item.id}</div>
                  </td>
                  <td className="px-6 py-4 text-dogon-muted select-none">
                    <span className="bg-dogon-sirius/50 px-2 py-1 rounded-sm text-[10px] font-bold uppercase">{item.type}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-white">
                    {item.stock}
                  </td>
                  <td className="px-6 py-4 text-dogon-danger font-mono font-medium">
                    {formatFCFA(item.price)}
                  </td>
                  <td className="px-6 py-4">
                    {item.stock <= item.min_stock ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-dogon-alert/10 text-dogon-alert border border-dogon-alert/20">
                       <span className="w-1.5 h-1.5 rounded-full bg-dogon-alert animate-pulse"></span>
                       CRITIQUE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-dogon-success/10 text-dogon-success border border-dogon-success/20">
                       <span className="w-1.5 h-1.5 rounded-full bg-dogon-success"></span>
                       NORMAL
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-dogon-card border border-dogon-sirius rounded-xl p-5 hover:border-dogon-danger/40 transition-colors group relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-dogon-danger/30"></div>
               <div className="flex justify-between items-start mb-4">
                 <span className="text-[10px] font-mono font-bold text-dogon-danger bg-dogon-danger/10 px-2 py-0.5 rounded border border-dogon-danger/20">{order.id || "CMD-000"}</span>
                 <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${order.status === 'Payé' ? 'bg-dogon-success/10 text-dogon-success border-dogon-success/20 flex items-center gap-1' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                   {order.status === 'À livrer' && <Truck className="h-3 w-3" />}
                   {order.status}
                 </span>
               </div>
               
               <h3 className="text-base font-bold text-white mb-1">{order.item || "Vente Florale"}</h3>
               <p className="text-xs text-dogon-muted mb-4">Client: <span className="text-white font-medium">{order.client_name}</span></p>

               <div className="flex justify-between items-center border-t border-dogon-sirius/50 pt-4">
                 <div className="text-dogon-muted text-[10px] uppercase font-bold tracking-widest">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : "Just Now"}
                 </div>
                 <div className="font-mono text-dogon-danger font-bold text-base">{formatFCFA(order.amount || 0)}</div>
               </div>
            </div>
          ))}
          {orders.length === 0 && (
              <div className="col-span-full py-12 text-center text-dogon-muted border-2 border-dashed border-dogon-sirius/30 rounded-xl">
                  Aucune commande active pour Yoela Flowers.
              </div>
          )}
        </div>
      )}
    </div>
  );
}
