"use client";

import React from "react";
import { FadeIn } from "@/components/ui/FadeIn";

export function PressSection() {
  const logos = [
    { name: "Placeholder 1", src: "/press_placeholder_1.png" },
    { name: "Placeholder 2", src: "/press_placeholder_2.png" },
    { name: "Placeholder 3", src: "/press_placeholder_3.png" },
    { name: "Placeholder 4", src: "/press_placeholder_4.png" }
  ];

  // If no press, the user said skip. I'll provide a placeholder structure that can be toggled.
  const hasPress = false;

  if (!hasPress) return (
     <section className="py-12 bg-dark-slate/50 border-t border-white/5 opacity-50">
        <div className="container mx-auto px-6 text-center">
           <span className="font-structural text-[9px] uppercase tracking-[0.3em] text-gray-500">More Evidence Coming Soon</span>
        </div>
     </section>
  );

  return (
    <section className="py-24 bg-dark-slate/50 border-t border-white/5">
      <div className="container mx-auto px-6">
        <FadeIn>
          <h3 className="font-structural text-[10px] uppercase tracking-[0.4em] text-gray-500 text-center mb-16">
            Witnessed By
          </h3>
        </FadeIn>
        
        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 opacity-40 grayscale hover:grayscale-0 transition-all">
          {logos.map((logo, i) => (
            <div key={i} className="font-structural text-sm uppercase tracking-widest text-white/50 hover:text-white transition-colors">
               [LOGO: {logo.name}]
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
