"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Globe, 
  Zap, 
  Lock,
  ChevronDown
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.from(".hero-title", { y: 100, opacity: 0, duration: 1.5 });
    tl.from(".hero-subtitle", { y: 30, opacity: 0, duration: 1 }, "-=1");
    tl.from(".hero-cta", { scale: 0.8, opacity: 0, duration: 0.8 }, "-=0.5");
    tl.from(".nav-bar", { y: -50, opacity: 0, duration: 1 }, "-=1.5");
    
    gsap.to(".floating-shape", {
      y: "random(-20, 20)",
      x: "random(-20, 20)",
      duration: "random(2, 4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-[#1A0F0A] text-[#F7EAE3] selection:bg-[#D4AF37]/30 overflow-hidden font-outfit">
      {/* Background Patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#A66037]/20 rounded-full blur-[120px] floating-shape" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#5C3D2E]/20 rounded-full blur-[120px] floating-shape" />
        <div className="dogon-pattern absolute inset-0 opacity-10" />
      </div>

      {/* Navigation */}
      <nav className="nav-bar relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
             <ShieldCheck className="w-6 h-6 text-[#1A0F0A]" />
          </div>
          <span className="text-xl font-bold font-dogon tracking-widest text-white uppercase">NYA BLO</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
           <a href="#vision" className="text-sm font-bold uppercase tracking-widest hover:text-[#D4AF37] transition-colors">Vision</a>
           <a href="#modules" className="text-sm font-bold uppercase tracking-widest hover:text-[#D4AF37] transition-colors">Écosystème</a>
           <Link href="/login">
              <Button variant="gold" className="rounded-xl px-8 shadow-gold">Espace Pro</Button>
           </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-40 max-w-5xl mx-auto min-h-[80vh]">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] mb-8 hero-subtitle">
          <Sparkles className="w-3 h-3" /> L'excellence Dogon au service du Business
        </div>
        
        <h1 className="hero-title text-7xl md:text-9xl font-bold text-white font-dogon leading-[0.9] mb-10">
          SYMÉTRIE & <span className="text-[#A66037]">TERRE</span>.
        </h1>
        
        <p className="hero-subtitle text-xl md:text-2xl text-[#B89E7E] max-w-2xl leading-relaxed mb-12">
          Le premier système d'exploitation commercial inspiré par la sagesse ancestrale. Pilotez vos entreprises avec une harmonie absolue.
        </p>
        
        <div className="hero-cta flex flex-col sm:flex-row gap-4">
           <Link href="/login">
              <Button variant="gold" size="lg" className="rounded-2xl h-16 px-10 text-lg shadow-gold group">
                Commencer l'expédition <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
           </Link>
           <Button variant="outline" size="lg" className="rounded-2xl h-16 px-10 text-lg border-white/10 text-white hover:bg-white/5">
                Explorer l'Atlas
           </Button>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
           <ChevronDown className="w-6 h-6 text-[#D4AF37]" />
        </div>
      </main>

      {/* Features Preview */}
      <section id="modules" className="relative z-10 max-w-7xl mx-auto px-8 py-40">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={Globe}
              title="Multi-Filiale"
              desc="Gérez GALF, Flowers et toutes vos entités dans un seul écosystème unifié."
            />
            <FeatureCard 
              icon={Zap}
              title="Saisie Réelle"
              desc="Des points journaliers synchronisés en temps réel avec une précision chirurgicale."
            />
            <FeatureCard 
              icon={Lock}
              title="Étanchéité"
              desc="Sécurité Dogon garantie par Firebase pour une protection totale de vos secrets."
            />
         </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-8">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[#B89E7E] text-sm italic">© 2024 NYA BLO SARL. L'architecture du futur.</p>
            <div className="flex gap-6">
               <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Abidjan</span>
               <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Bamako</span>
               <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Dakar</span>
            </div>
         </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="group p-10 rounded-[40px] bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 transition-all">
       <div className="w-14 h-14 bg-[#A66037]/20 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6" />
       </div>
       <h3 className="text-2xl font-bold text-white font-dogon mb-4">{title}</h3>
       <p className="text-[#B89E7E] leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
