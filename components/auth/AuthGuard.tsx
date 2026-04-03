"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dogon-nuit gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-dogon-or animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-dogon-or animate-spin" />
          </div>
        </div>
        <p className="text-dogon-muted text-sm font-medium animate-pulse">Initialisation Cosmo-Saison...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
