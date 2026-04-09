"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

export default function GSAPWrapper({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    // Page entry animation
    gsap.fromTo(container.current, 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, { dependencies: [pathname] });

  return (
    <div ref={container} className="w-full">
      {children}
    </div>
  );
}
