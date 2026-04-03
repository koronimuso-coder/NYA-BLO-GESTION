"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

/**
 * Root page — Cinematic Entrance to the NYA BLO Universe.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-dogon-nuit flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,20,44,1)_0%,rgba(6,11,25,1)_100%)]"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dogon-indigo/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-dogon-or/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      {/* Decorative Sirius (Star) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-10 right-10 flex flex-col items-center gap-1"
      >
        <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]"></div>
        <span className="text-[10px] text-dogon-muted font-mono tracking-widest uppercase opacity-50">Sirius B</span>
      </motion.div>

      {/* Logo & Content */}
      <div className="z-10 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-dogon-indigo/20 border border-dogon-indigo/30 rounded-full text-dogon-indigo text-xs font-bold uppercase tracking-widest mb-8">
            <Sparkles className="h-3 w-3" />
            Cosmogonie Business OS
          </div>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6"
        >
          NYA <span className="text-dogon-or">BLO</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-dogon-muted max-w-lg text-lg leading-relaxed mb-10"
        >
          Pilotez l&apos;excellence panafricaine. Une plateforme unifiée pour GALF, Yoela et Nya Blo Digital, guidée par l&apos;intelligence de Nommo.
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/dashboard">
            <button className="px-8 py-4 bg-dogon-or text-dogon-nuit font-bold rounded-full hover:bg-white hover:scale-105 transition-all flex items-center gap-2 group">
              ENTRER DANS L&apos;UNIVERS
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left border-t border-dogon-sirius/30 pt-12"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-dogon-or font-bold text-sm uppercase tracking-widest">
              <Shield className="h-4 w-4" />
              Souveraineté
            </div>
            <p className="text-dogon-muted text-xs leading-relaxed">
              Données sécurisées et souveraines au cœur de votre stratégie.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-dogon-or font-bold text-sm uppercase tracking-widest">
              <Zap className="h-4 w-4" />
              Puissance
            </div>
            <p className="text-dogon-muted text-xs leading-relaxed">
              Vitesse de traitement et synchronisation en temps réel multi-filiales.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-dogon-or font-bold text-sm uppercase tracking-widest">
              <Sparkles className="h-4 w-4" />
              Vision
            </div>
            <p className="text-dogon-muted text-xs leading-relaxed">
              L&apos;IA Nommo distille vos données en insights décisionnels futurs.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute bottom-8 text-[10px] text-white font-mono tracking-[0.4em] uppercase"
      >
        © 2025 NYA BLO Group • Designed for Excellence
      </motion.div>
    </main>
  );
}
