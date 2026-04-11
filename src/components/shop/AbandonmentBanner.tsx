"use client";

import { useCart } from "@/components/providers/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "@mui/icons-material";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function AbandonmentBanner() {
  const { cart, itemCount, setIsCartDrawerOpen } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show on root path after a small delay
    if (itemCount > 0 && pathname !== "/cart" && pathname !== "/checkout") {
      const timer = setTimeout(() => {
        setIsVisible(prev => prev ? prev : true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(prev => !prev ? prev : false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [itemCount, pathname]);

  if (itemCount === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="w-full bg-wattle text-bottle-green px-6 py-3 flex items-center justify-center gap-4 z-[40]"
        >
          <ShoppingCart sx={{ fontSize: 16 }} />
          <span className="font-structural text-[10px] uppercase tracking-[0.2em] font-black">
            Mission incomplete. You have {itemCount} item{itemCount > 1 ? 's' : ''} waiting in your payload.
          </span>
          <button 
            onClick={() => setIsCartDrawerOpen(true)}
            className="border-b-2 border-bottle-green/30 font-structural text-[10px] uppercase tracking-widest hover:border-bottle-green transition-all"
          >
            Review Gear
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="ml-8 text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100"
          >
            Dismiss
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
