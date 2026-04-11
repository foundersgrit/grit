"use client";

import { motion } from "framer-motion";

interface MaskRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

export function MaskReveal({ children, delay = 0, className = "", direction = "up" }: MaskRevealProps) {
  const variants = {
    hidden: { 
      clipPath: direction === "up" ? "inset(100% 0 0 0)" : direction === "down" ? "inset(0 0 100% 0)" : "inset(0 100% 0 0)",
      y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
      opacity: 0,
    },
    visible: { 
      clipPath: "inset(0% 0 0 0)",
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.8, 
        delay, 
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </div>
  );
}
