"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", isLoading = false, children, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    
    // Core brand styling implementation
    const baseStyles = "relative inline-flex items-center justify-center whitespace-nowrap font-structural text-sm uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wattle disabled:pointer-events-none disabled:opacity-50 overflow-hidden";
    
    // Variants strictly following STEP 2 Directive A3
    const variants = {
      // Primary CTAs (Wattle background)
      primary: "bg-wattle text-bottle-green hover:bg-[#b0bd3a] shadow-[0_0_15px_rgba(204,218,71,0.1)]", 
      // Secondary buttons (Dark Slate)
      secondary: "bg-dark-slate text-white border border-dark-slate hover:bg-black",
      // Outline style
      outline: "bg-transparent text-white border border-white/20 hover:bg-dark-slate hover:border-dark-slate",
      ghost: "hover:bg-dark-slate text-white",
      // Accent (Wattle border/text)
      accent: "bg-transparent text-wattle border border-wattle hover:bg-wattle hover:text-bottle-green",
    };
    
    const sizes = {
      default: "h-12 px-8 py-2",
      sm: "h-9 px-4",
      lg: "h-14 px-10 text-base",
      icon: "h-12 w-12",
    };

    const handleHaptic = () => {
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        if (variant === "primary") {
          window.navigator.vibrate(10);
        }
      }
    };

    const animationProps = shouldReduceMotion ? {} : {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.1 }
    };

    return (
      <motion.button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        onPointerDown={handleHaptic}
        {...animationProps}
        {...props}
      >
        <span className={cn("flex items-center gap-2", isLoading && "opacity-0")}>
          {children as React.ReactNode}
        </span>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="animate-spin h-5 w-5 text-current" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
