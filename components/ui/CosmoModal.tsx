"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface CosmoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function CosmoModal({ isOpen, onClose, title, children }: CosmoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-md bg-dogon-card border border-dogon-or/30 rounded-2xl shadow-2xl p-6 mx-4 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight uppercase">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 text-dogon-muted hover:text-white rounded-full bg-dogon-nuit hover:bg-dogon-sirius transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
