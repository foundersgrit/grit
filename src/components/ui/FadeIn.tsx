"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  fullWidth?: boolean;
  className?: string;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  direction = "up", 
  fullWidth = false,
  className = "" 
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
      x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.5,
        delay,
        ease: "easeOut",
      },
    },
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px", amount: 0.2 }}
      variants={variants}
      className={cn(fullWidth ? "w-full" : "", className)}
    >
      {children}
    </motion.div>
  );
}

// Stagger Container
export function FadeInStagger({ 
  children, 
  staggerChildren = 0.1,
  className = "" 
}: { 
  children: React.ReactNode; 
  staggerChildren?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px", amount: 0.2 }}
      transition={{ staggerChildren }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Internal utility since we might not have cn helper globally in some contexts
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
