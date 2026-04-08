"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

/**
 * Root page — Cinematic Entrance to the NYA BLO Universe.
 */
export default function Home() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Sirius star animation
    gsap.fromTo(
      ".sirius",
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }
    );

    // Main content stagger
    tl.fromTo(
      ".hero-element",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
    );

    // Call to action button
    tl.fromTo(
      ".cta-btn",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.4"
    );

    // Features section
    tl.fromTo(
      ".feature-item",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" },
      "-=0.2"
    );

    // Footer
    tl.fromTo(
      ".footer-branding",
      { opacity: 0 },
      { opacity: 0.3, duration: 2, delay: 0.5 }
    );

  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="min-h-screen bg-dogon-nuit flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,20,44,1)_0%,rgba(6,11,25,1)_100%)]"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dogon-indigo/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-dogon-or/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      {/* Decorative Sirius (Star) */}
      <div className="sirius absolute top-10 right-10 flex flex-col items-center gap-1">
        <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]"></div>
        <span className="text-[10px] text-dogon-muted font-mono tracking-widest uppercase opacity-50">Sirius B</span>
      </div>

      {/* Logo & Content */}
      <div className="z-10 flex flex-col items-center text-center px-6">
        <div className="hero-element">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-dogon-indigo/20 border border-dogon-indigo/30 rounded-full text-dogon-indigo text-xs font-bold uppercase tracking-widest mb-8">
            <Sparkles className="h-3 w-3" />
            Cosmogonie Business OS
          </div>
        </div>

        <h1 className="hero-element text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
          NYA <span className="text-dogon-or">BLO</span>
        </h1>

        <p className="hero-element text-dogon-muted max-w-lg text-lg leading-relaxed mb-10">
          Pilotez l&apos;excellence panafricaine. Une plateforme unifiée pour GALF, Yoela et Nya Blo Digital, guidée par l&apos;intelligence de Nommo.
        </p>

        <div className="cta-btn flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard">
            <button className="px-8 py-4 bg-dogon-or text-dogon-nuit font-bold rounded-full hover:bg-white transition-all flex items-center gap-2 group duration-300 transform hover:scale-105">
              ENTRER DANS L&apos;UNIVERS
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left border-t border-dogon-sirius/30 pt-12">
          <div className="feature-item space-y-2">
            <div className="flex items-center gap-2 text-dogon-or font-bold text-sm uppercase tracking-widest">
              <Shield className="h-4 w-4" />
              Souveraineté
            </div>
            <p className="text-dogon-muted text-xs leading-relaxed">
              Données sécurisées et souveraines au cœur de votre stratégie.
            </p>
          </div>
          <div className="feature-item space-y-2">
            <div className="flex items-center gap-2 text-dogon-or font-bold text-sm uppercase tracking-widest">
              <Zap className="h-4 w-4" />
              Puissance
            </div>
            <p className="text-dogon-muted text-xs leading-relaxed">
              Vitesse de traitement et synchronisation en temps réel multi-filiales.
            </p>
          </div>
          <div className="feature-item space-y-2">
            <div className="flex items-center gap-2 text-dogon-or font-bold text-sm uppercase tracking-widest">
              <Sparkles className="h-4 w-4" />
              Vision
            </div>
            <p className="text-dogon-muted text-xs leading-relaxed">
              L&apos;IA Nommo distille vos données en insights décisionnels futurs.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="footer-branding absolute bottom-8 text-[10px] text-white font-mono tracking-[0.4em] uppercase">
        © 2025 NYA BLO Group • Designed for Excellence
      </div>
    </main>
  );
}
