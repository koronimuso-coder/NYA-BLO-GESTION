"use client";

import { formatFCFA } from "@/lib/fcfa";

interface CompanyData {
  id: string;
  name: string;
  sector: string;
  ca: number;
  sales: number;
  leads: number;
  conversion: number;
  trend: "up" | "down" | "neutral";
}

export function CompanyPerformanceTable({ data }: { data: any[] }) {
  return (
    <div className="bg-dogon-card rounded-xl border border-dogon-sirius overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-dogon-sirius bg-dogon-card/50">
        <h3 className="text-lg font-medium text-white">Performance par entreprise (Mois en cours)</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-dogon-muted uppercase bg-dogon-sirius/30">
            <tr>
              <th className="px-6 py-3 font-medium">Entreprise</th>
              <th className="px-6 py-3 font-medium">CA (Mois)</th>
              <th className="px-6 py-3 font-medium">Ventes</th>
              <th className="px-6 py-3 font-medium">Leads</th>
              <th className="px-6 py-3 font-medium">Conversion</th>
              <th className="px-6 py-3 font-medium">Tendance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((company, index) => (
              <tr 
                key={company.id} 
                className={`border-b border-dogon-sirius/50 hover:bg-dogon-sirius/20 transition-colors ${index === data.length - 1 ? 'border-none' : ''}`}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{company.name}</div>
                  <div className="text-xs text-dogon-muted">{company.sector}</div>
                </td>
                <td className="px-6 py-4 font-mono text-white">
                  {formatFCFA(company.ca)}
                </td>
                <td className="px-6 py-4 text-dogon-text">{company.sales}</td>
                <td className="px-6 py-4 text-dogon-text">{company.leads}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-dogon-nuit border border-dogon-sirius text-white">
                    {company.conversion}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className={`flex items-center ${
                    company.trend === 'up' ? 'text-dogon-success' : 
                    company.trend === 'down' ? 'text-dogon-danger' : 'text-dogon-alert'
                  }`}>
                    {company.trend === 'up' ? '↗' : company.trend === 'down' ? '↘' : '→'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
