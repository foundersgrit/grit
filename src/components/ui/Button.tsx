import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {
    
    // Core brand styling implementation
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap font-structural text-sm uppercase transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wattle disabled:pointer-events-none disabled:opacity-50";
    
    // Variants heavily guarded by brand guidelines
    const variants = {
      primary: "bg-white text-bottle-green hover:bg-zinc-200", // "Bottle Green bg -> White logo/text" means primary action is often high contrast white
      secondary: "bg-dark-slate text-white border border-dark-slate hover:border-gray-400",
      accent: "bg-wattle text-bottle-green hover:bg-[#b0bd3a]", // "Wattle accent -> Bottle Green logo/text"
      ghost: "hover:bg-dark-slate text-white",
    };
    
    const sizes = {
      default: "h-12 px-8 py-2",
      sm: "h-9 rounded-md px-4",
      lg: "h-14 rounded-md px-10 text-base",
      icon: "h-12 w-12",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
