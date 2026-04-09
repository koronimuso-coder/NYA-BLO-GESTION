"use client";

import React, { useState, useRef, useEffect } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const container = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  useGSAP(() => {

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    tl.from(".login-overlay", { opacity: 0, duration: 1.5 });
    tl.from(".login-content", { y: 100, opacity: 0, duration: 1.2 }, "-=1");
    tl.from(".form-element", { 
      y: 20, 
      opacity: 0, 
      stagger: 0.1, 
      duration: 0.8 
    }, "-=0.5");
    
    // Floating patterns animation
    gsap.to(".pattern-bg", {
      rotation: 360,
      duration: 100,
      repeat: -1,
      ease: "none"
    });
  }, { scope: container });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Bienvenue dans l'univers NYA BLO");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error(error);
      const firebaseError = error as { code: string };
      const message = firebaseError.code === "auth/invalid-credential" 
        ? "Identifiants incorrects. Vérifiez vos accès Dogon."
        : `Erreur: ${firebaseError.code}`;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1A0F0A] flex items-center justify-center">
       <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
    </div>
  );


  return (
    <div ref={container} className="relative min-h-screen flex items-center justify-center bg-[#1A0F0A] overflow-hidden">
      {/* Immersive Dogon Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A0F0A] via-[#2D1A12] to-[#5C3D2E] opacity-90" />
        <div className="pattern-bg absolute -top-1/2 -left-1/2 w-full h-full border border-[#D4AF37]/5 rounded-full scale-150 opacity-20" />
        <div className="absolute inset-0 dogon-pattern opacity-10" />
      </div>

      <div className="login-content relative z-10 w-full max-w-5xl flex flex-col md:flex-row bg-[#FAF3E0]/5 backdrop-blur-2xl rounded-[48px] border border-white/10 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
        
        {/* Left Side: Brand Experience */}
        <div className="md:w-1/2 p-12 lg:p-20 flex flex-col justify-between bg-gradient-to-br from-[#5C3D2E]/40 to-transparent">
          <div className="flex items-center gap-4 login-form">
            <div className="w-14 h-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
               <ShieldCheck className="w-8 h-8 text-[#1A0F0A]" />
            </div>
            <h1 className="text-3xl font-bold font-dogon text-white tracking-widest uppercase">NYA BLO</h1>
          </div>
          
          <div className="mt-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] mb-8">
              <Sparkles className="w-3 h-3" /> Architecture de Gestion
            </div>
            <h2 className="text-6xl font-bold text-white leading-[1.1] font-dogon mb-6">
              L&apos;harmonie de la <span className="text-[#A66037]">Terre</span> au service de vos <span className="text-[#D4AF37]">Ventes</span>.
            </h2>
            <p className="text-[#B89E7E] text-lg max-w-md leading-relaxed">
              Plus qu&apos;une gestion, un équilibre. Pilotez vos entreprises avec l&apos;élégance de nos origines.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-white/40 text-sm font-medium">
             <div className="h-px flex-1 bg-white/10" />
             © 2024 NYA BLO SARL
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 bg-white p-12 lg:p-20 flex flex-col justify-center">
          <div className="form-element mb-12">
            <h3 className="text-3xl font-bold text-[#2D1A12] font-dogon mb-2">Connexion</h3>
            <p className="text-slate-500 font-medium">Entrez dans votre espace de gestion.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="form-element space-y-2">
              <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-[0.2em] ml-1">E-mail Administratif</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#D4AF37] transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-5 rounded-[24px] bg-[#FAF3E0]/30 border-2 border-transparent focus:border-[#D4AF37] focus:bg-white outline-none transition-all font-medium"
                  placeholder="admin@nyablo.com"
                />
              </div>
            </div>

            <div className="form-element space-y-2">
              <label className="text-[10px] font-bold text-[#A66037] uppercase tracking-[0.2em] ml-1">Clé de Sécurité</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#D4AF37] transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-5 rounded-[24px] bg-[#FAF3E0]/30 border-2 border-transparent focus:border-[#D4AF37] focus:bg-white outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="form-element w-full py-6 rounded-[24px] dogon-gradient text-white text-lg font-bold shadow-xl shadow-[#A66037]/30 hover:shadow-2xl hover:shadow-[#A66037]/50 mt-4 h-auto"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Accéder au Dashboard <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <p className="form-element mt-12 text-center text-slate-400 text-sm">
            Besoin d&apos;aide ? <a href="#" className="text-[#A66037] font-bold hover:underline">Support NYA BLO</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function Button({ children, className, ...props }: any) {
  return (
    <button className={`relative overflow-hidden group transition-all active:scale-95 ${className}`} {...props}>
       <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
       <span className="relative z-10">{children}</span>
    </button>
  );
}
