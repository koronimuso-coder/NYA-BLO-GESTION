"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import AuthGuard from "@/components/auth/AuthGuard";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="h-screen flex overflow-hidden bg-dogon-nuit">
        {/* Sidebar Desktop */}
        <Sidebar aria-label="Menu Principal" />
        
        <div className="lg:pl-64 flex flex-col w-0 flex-1 overflow-hidden">
          {/* Header avec action menu pour mobile (mocked) */}
          <Header onMenuClick={() => {}} />

          <main id="main-content" className="flex-1 relative z-0 overflow-y-auto focus:outline-none custom-scrollbar">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

    </AuthGuard>
  );
}
