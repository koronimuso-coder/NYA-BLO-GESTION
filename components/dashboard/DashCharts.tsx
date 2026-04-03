"use client";

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip, BarChart, Bar,
  Legend
} from 'recharts';
import { formatFCFA } from '@/lib/fcfa';

const caData = [
  { name: 'Oct', 'NYA BLO': 2400000, 'GALF': 6500000, 'Flowers': 1200000, 'Beauty': 1800000 },
  { name: 'Nov', 'NYA BLO': 3100000, 'GALF': 7000000, 'Flowers': 1500000, 'Beauty': 2100000 },
  { name: 'Déc', 'NYA BLO': 4200000, 'GALF': 6800000, 'Flowers': 2800000, 'Beauty': 3200000 },
  { name: 'Jan', 'NYA BLO': 3500000, 'GALF': 7200000, 'Flowers': 1800000, 'Beauty': 2500000 },
  { name: 'Fév', 'NYA BLO': 3800000, 'GALF': 8000000, 'Flowers': 2000000, 'Beauty': 2800000 },
  { name: 'Mar', 'NYA BLO': 4500000, 'GALF': 8500000, 'Flowers': 2200000, 'Beauty': 3000000 },
];

const sectorData = [
  { name: 'Formation BTP', value: 8500000, color: '#D4A853' }, // Or Dogon
  { name: 'Digital & Tech', value: 4500000, color: '#6366F1' }, // Indigo Dogon
  { name: 'Beauté & Soins', value: 3000000, color: '#8B5CF6' }, // Violet Sigi
  { name: 'Événementiel (Fleurs)', value: 2200000, color: '#EF4444' }, // Rouge Binu
];

const topCommercialsData = [
  { name: 'Koffi A.', ca: 6500000, leads: 45 },
  { name: 'Aminata C.', ca: 5200000, leads: 38 },
  { name: 'Aya K.', ca: 3800000, leads: 20 },
];

export function DashCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      
      {/* Evolution du CA */}
      <div className="bg-dogon-card rounded-xl border border-dogon-sirius p-6 shadow-sm lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white">Évolution du CA (6 mois)</h3>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={caData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1D2E" vertical={false} />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E2130', borderColor: '#1A1D2E', borderRadius: '8px' }}
                itemStyle={{ color: '#F8FAFC' }}
                formatter={(value: number) => formatFCFA(value)}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="GALF" stroke="#D4A853" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="NYA BLO" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Beauty" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Flowers" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Répartition par Secteur */}
      <div className="bg-dogon-card rounded-xl border border-dogon-sirius p-6 shadow-sm">
        <h3 className="text-lg font-medium text-white mb-6">Répartition par secteur</h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <PieTooltip 
                contentStyle={{ backgroundColor: '#1E2130', borderColor: '#1A1D2E', borderRadius: '8px' }}
                formatter={(value: number) => formatFCFA(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Top Commerciaux Mini-Bar */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-dogon-muted mb-4 uppercase tracking-wider">Top Commerciaux (Mois)</h3>
          <div className="space-y-4">
            {topCommercialsData.map((person, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white font-medium">{person.name}</span>
                  <span className="text-dogon-or font-mono">{formatFCFA(person.ca)}</span>
                </div>
                <div className="w-full bg-dogon-nuit rounded-full h-2 border border-dogon-sirius">
                  <div 
                    className="bg-dogon-indigo h-2 rounded-full" 
                    style={{ width: `${(person.ca / 8000000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
