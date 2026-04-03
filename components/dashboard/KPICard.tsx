"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // Wait, I need to create lib/utils.ts, let's just use raw template literals or create it.

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  iconColor = "text-dogon-indigo",
  iconBg = "bg-dogon-indigo/10"
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="bg-dogon-card rounded-xl border border-dogon-sirius p-6 shadow-sm shadow-black/20 hover:border-dogon-indigo/30 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-dogon-muted">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
      
      {trend && trendValue && (
        <div className="mt-4 flex items-center text-sm">
          <span
            className={`${
              trend === "up" ? "text-dogon-success" : trend === "down" ? "text-dogon-danger" : "text-dogon-muted"
            } font-medium flex items-center`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
          <span className="ml-2 text-dogon-muted/60">vs mois dernier</span>
        </div>
      )}
    </div>
  );
}
