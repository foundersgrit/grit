"use client";

import { WhatsApp } from "@mui/icons-material";

export function WhatsAppButton() {
  return (
    <a 
      href="https://wa.me/8801700000000" 
      target="_blank" 
      rel="noopener noreferrer"
      className="md:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 bg-dark-slate border border-white/20 text-white flex items-center justify-center shadow-2xl hover:bg-bottle-green transition-all"
      aria-label="Contact on WhatsApp"
    >
      <WhatsApp fontSize="medium" />
    </a>
  );
}
