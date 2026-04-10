"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [hoverType, setHoverType] = useState<"none" | "link" | "button" | "image">("none");

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a")) setHoverType("link");
      else if (target.closest("button")) setHoverType("button");
      else if (target.closest("img")) setHoverType("image");
      else setHoverType("none");
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleHover);
    
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleHover);
    };
  }, [cursorX, cursorY]);

  // Only show on desktop
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 rounded-full border border-wattle z-[9999] pointer-events-none mix-blend-difference flex items-center justify-center"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
        x: "-50%",
        y: "-50%",
      }}
      animate={{
        scale: hoverType === "none" ? 1 : 2.5,
        backgroundColor: hoverType === "none" ? "transparent" : "rgba(204,218,71,0.2)",
      }}
    >
      {hoverType !== "none" && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-1 h-1 bg-wattle rounded-full" 
        />
      )}
    </motion.div>
  );
}
