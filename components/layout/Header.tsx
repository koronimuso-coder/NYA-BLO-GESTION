"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Bell, Search, Menu, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 h-16 bg-dogon-card border-b border-dogon-sirius flex items-center shadow-sm shadow-dogon-nuit/50">
      <button
        type="button"
        className="px-4 text-dogon-muted hover:text-white focus:outline-none lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Ouvrir le menu</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-lg relative">
            <label htmlFor="search" className="sr-only">Recherche globale</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-dogon-muted" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-dogon-sirius rounded-md leading-5 bg-dogon-nuit text-dogon-text placeholder-dogon-muted focus:outline-none focus:placeholder-dogon-muted/70 focus:ring-1 focus:ring-dogon-indigo focus:border-dogon-indigo sm:text-sm transition-colors"
                placeholder="Rechercher des leads, ventes, entreprises..."
                type="search"
              />
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6 gap-4">
          <button
            type="button"
            className="p-1 rounded-full text-dogon-muted hover:text-white focus:outline-none relative"
          >
            <span className="sr-only">Voir les notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-dogon-danger ring-2 ring-dogon-card" />
          </button>

          <div className="relative">
            <button
              type="button"
              className="max-w-xs bg-dogon-nuit flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dogon-card focus:ring-dogon-indigo"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <span className="sr-only">Ouvrir le menu utilisateur</span>
              <div className="h-8 w-8 rounded-full bg-dogon-indigo/20 flex items-center justify-center border border-dogon-indigo/50">
                <span className="text-dogon-indigo font-bold text-xs uppercase">
                  {user?.email ? user.email.charAt(0) : "A"}
                </span>
              </div>
            </button>

            {showProfileMenu && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-dogon-card ring-1 ring-black ring-opacity-5 border border-dogon-sirius z-50">
                <div className="px-4 py-2 border-b border-dogon-sirius mb-1">
                  <p className="text-sm font-medium text-white truncate">
                    Administrateur
                  </p>
                  <p className="text-xs text-dogon-muted truncate">{user?.email}</p>
                  <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-dogon-indigo/10 border border-dogon-indigo/30 text-dogon-indigo uppercase tracking-wider">
                    DIRECTEUR
                  </span>
                </div>
                <a href="/settings" className="flex items-center px-4 py-2 text-sm text-dogon-text hover:bg-dogon-sirius hover:text-white transition-colors">
                  <UserIcon className="mr-2 h-4 w-4 text-dogon-muted" />
                  Mon profil
                </a>
                <button
                  onClick={logOut}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-dogon-danger hover:bg-dogon-danger/10 transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

