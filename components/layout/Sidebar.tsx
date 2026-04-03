"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Target,
  BarChart3,
  FileText,
  CheckSquare,
  Settings,
  GraduationCap,
  Flower2,
  Sparkles,
  MonitorPlay
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mainNavItems = [
  { title: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { title: "Entreprises", href: "/companies", icon: Building2 },
  { title: "CRM Unifié", href: "/crm", icon: Users },
  { title: "Ventes & Factures", href: "/sales", icon: Target },
];

const companyModules = [
  { title: "NYA BLO Digital", href: "/nya-blo", icon: MonitorPlay, color: "text-dogon-indigo" },
  { title: "GALF Formation", href: "/galf", icon: GraduationCap, color: "text-dogon-or" },
  { title: "Yoela Flowers", href: "/flowers", icon: Flower2, color: "text-dogon-danger" },
  { title: "Yoela Beauty", href: "/beauty", icon: Sparkles, color: "text-dogon-violet" },
];

const bottomNavItems = [
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Documents", href: "/documents", icon: FileText },
  { title: "Tâches", href: "/tasks", icon: CheckSquare },
  { title: "Paramètres", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const NavGroup = ({ title, items, isAppModule = false }: { title: string; items: any[]; isAppModule?: boolean }) => (
    <div className="mb-6">
      <h3 className="px-4 text-xs font-semibold text-dogon-muted uppercase tracking-wider mb-2">
        {title}
      </h3>
      <nav className="space-y-1 px-2">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-dogon-indigo/10 text-dogon-indigo"
                  : "text-dogon-text hover:bg-dogon-sirius hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-dogon-indigo" : isAppModule ? item.color : "text-dogon-muted group-hover:text-white"
                )}
                aria-hidden="true"
              />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-dogon-card border-r border-dogon-sirius z-20">
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-dogon-sirius">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-dogon-nuit border border-dogon-or/30 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-dogon-or" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L12 22M12 12L20 8M12 12L4 8M12 17L18 14M12 17L6 14" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-wider text-dogon-text uppercase">
              NYA BLO OS
            </span>
          </div>
        </div>

        <div className="flex-1 py-6">
          <NavGroup title="Principal" items={mainNavItems} />
          <NavGroup title="Modules Métier" items={companyModules} isAppModule />
          <NavGroup title="Système" items={bottomNavItems} />
        </div>
      </div>
    </div>
  );
}
