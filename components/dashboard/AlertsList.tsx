"use client";

import { AlertTriangle, Clock, Box, ShieldAlert } from "lucide-react";
import { formatFCFA } from "@/lib/fcfa";

const alertsData = [
  {
    id: 1,
    type: "impaye",
    title: "Impayé critique > 30 jours",
    description: "Pharmacie Santé Plus (NYA BLO Digital) - Facture #NB-2024-089",
    amount: 300000,
    company: "NYA BLO",
    icon: ShieldAlert,
    color: "text-dogon-danger",
    bg: "bg-dogon-danger/10",
  },
  {
    id: 2,
    type: "lead",
    title: "Leads sans relance",
    description: "5 leads assignés à Koffi A. sont sans activité depuis plus de 72h.",
    amount: null,
    company: "GALF",
    icon: Clock,
    color: "text-dogon-alert",
    bg: "bg-dogon-alert/10",
  },
  {
    id: 3,
    type: "stock",
    title: "Stock critique",
    description: "Stock de Lys Blanc sous le seuil d'alerte (15 tiges restantes).",
    amount: null,
    company: "Flowers",
    icon: Box,
    color: "text-dogon-alert",
    bg: "bg-dogon-alert/10",
  },
  {
    id: 4,
    type: "session",
    title: "Remplissage session",
    description: "Session 'Pelle hydraulique' du 15 Mars à 90% (11/12 inscrits).",
    amount: null,
    company: "GALF",
    icon: AlertTriangle,
    color: "text-dogon-indigo",
    bg: "bg-dogon-indigo/10",
  }
];

export function AlertsList() {
  return (
    <div className="bg-dogon-card rounded-xl border border-dogon-sirius lg:col-span-1 shadow-sm">
      <div className="px-6 py-4 border-b border-dogon-sirius bg-dogon-card/50 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white flex items-center">
          Alertes & Actions
          <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-dogon-danger rounded-full">
            4
          </span>
        </h3>
      </div>
      <div className="p-4 space-y-4">
        {alertsData.map((alert) => (
          <div key={alert.id} className="flex p-4 rounded-lg bg-dogon-nuit border border-dogon-sirius hover:border-dogon-sirius/80 transition-colors">
            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${alert.bg}`}>
              <alert.icon className={`h-5 w-5 ${alert.color}`} />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-white">{alert.title}</h4>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-dogon-sirius text-dogon-muted">
                  {alert.company}
                </span>
              </div>
              <p className="mt-1 text-sm text-dogon-muted">{alert.description}</p>
              {alert.amount && (
                <p className="mt-2 text-sm font-mono text-dogon-danger font-medium border-t border-dogon-sirius/50 pt-2 inline-block">
                  Montant: {formatFCFA(alert.amount)}
                </p>
              )}
            </div>
          </div>
        ))}
        
        <button className="w-full mt-2 text-sm text-dogon-indigo hover:text-white py-2 transition-colors">
          Voir toutes les alertes →
        </button>
      </div>
    </div>
  );
}
