"use client";

import { useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2, ArrowRight, Lock } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Inner component uses useSearchParams — must be inside Suspense
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(from);
      router.refresh();
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      if (
        firebaseErr.code === "auth/user-not-found" ||
        firebaseErr.code === "auth/wrong-password" ||
        firebaseErr.code === "auth/invalid-credential"
      ) {
        setError("Identifiants incorrects. Veuillez vérifier votre email et mot de passe.");
      } else if (firebaseErr.code === "auth/too-many-requests") {
        setError("Trop de tentatives. Veuillez patienter quelques instants.");
      } else {
        setError("Une erreur technique est survenue lors de la connexion.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-dogon-card/80 backdrop-blur-sm py-8 px-4 shadow-2xl shadow-black/50 sm:rounded-xl sm:px-10 border border-dogon-sirius">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-dogon-danger/10 border border-dogon-danger/20 text-dogon-danger rounded-md p-3 text-sm text-center">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-dogon-muted">Adresse email</label>
          <div className="mt-1">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full appearance-none rounded-md border border-dogon-sirius px-3 py-2 bg-dogon-nuit text-dogon-text placeholder-dogon-muted/50 focus:border-dogon-indigo focus:outline-none focus:ring-1 focus:ring-dogon-indigo sm:text-sm transition-colors"
              placeholder="directeur@nyablo.ci"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-dogon-muted">Mot de passe</label>
          <div className="mt-1">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full appearance-none rounded-md border border-dogon-sirius px-3 py-2 bg-dogon-nuit text-dogon-text placeholder-dogon-muted/50 focus:border-dogon-indigo focus:outline-none focus:ring-1 focus:ring-dogon-indigo sm:text-sm transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group flex w-full justify-center items-center rounded-md border border-transparent bg-dogon-indigo px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-dogon-indigo/90 focus:outline-none focus:ring-2 focus:ring-dogon-indigo focus:ring-offset-2 focus:ring-offset-dogon-nuit disabled:opacity-50 disabled:cursor-not-allowed transition-all gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Connexion sécurisée
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-xs text-dogon-muted/50 font-mono">
        v2.1.0 • Dogon Firebase Engine • NYA BLO SARL
      </div>
    </div>
  );
}

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".login-content",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-dogon-nuit flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-dogon-indigo/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-dogon-violet/10 blur-[100px] pointer-events-none" />

      <div
        className="login-content sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-dogon-card border border-dogon-or/20 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-dogon-or/5">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-dogon-or" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L12 22M12 12L20 8M12 12L4 8M12 17L18 14M12 17L6 14" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-dogon-text">NYA BLO BUSINESS OS</h2>
          <p className="mt-2 text-sm text-dogon-muted">Portail de direction centralisé • Firebase Edition</p>
        </div>

        <Suspense fallback={
          <div className="mt-8 bg-dogon-card/80 py-8 px-10 rounded-xl border border-dogon-sirius flex justify-center">
            <Loader2 className="h-8 w-8 text-dogon-or animate-spin" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
