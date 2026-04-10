"use client";

import Link from "next/link";
import { Search, Person, ShoppingCart, Menu, Close, PersonOutline } from "@mui/icons-material";
import { useAuth } from "@/components/providers/AuthProvider";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useCart } from "@/components/providers/CartContext";
import { useState, useEffect, useRef } from "react";
import { NotificationPanel } from "./NotificationPanel";

export function Header() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  
  // Cart shake animation state
  const [shouldShake, setShouldShake] = useState(false);
  const prevItemCount = useRef(itemCount);

  useEffect(() => {
    if (itemCount > prevItemCount.current) {
      setShouldShake(true);
      const timer = setTimeout(() => setShouldShake(false), 300);
      return () => clearTimeout(timer);
    }
    prevItemCount.current = itemCount;
  }, [itemCount]);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY.current ? "down" : "up";
    
    // Header Visibility Logic (Section A6)
    if (latest > 100 && direction === "down" && !isMenuOpen) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }

    // Header Style Logic
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    lastScrollY.current = latest;
  });

  const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "Our Story", href: "/our-story" },
    { label: "The Arena", href: "/the-arena" },
    { label: "Journal", href: "/journal" },
    { label: "Sustainability", href: "/sustainability" },
  ];

  return (
    <motion.header 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled 
          ? "bg-bottle-green/95 backdrop-blur-md border-white/10 py-4 shadow-lg" 
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-structural text-3xl tracking-wide lowercase text-white hover:text-white/80 transition-colors">
          grit
        </Link>

        {/* Primary Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 font-structural text-sm tracking-widest uppercase">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-white hover:text-wattle transition-colors focus:outline-none focus:ring-1 focus:ring-wattle focus:ring-offset-4 focus:ring-offset-bottle-green">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-6 text-white">
          <button className="hover:text-wattle transition-colors focus:outline-none focus:ring-2 focus:ring-wattle focus:ring-offset-2 focus:ring-offset-bottle-green" aria-label="Search">
            <Search fontSize="small" />
          </button>
          <Link href="/account/profile" className="hover:text-wattle transition-colors focus:outline-none focus:ring-2 focus:ring-wattle focus:ring-offset-2 focus:ring-offset-bottle-green" aria-label="Account Dashboard">
            <Person fontSize="small" />
          </Link>
          <NotificationPanel />
          
          <Link href="/cart" className="relative group focus:outline-none" aria-label={`Cart, ${itemCount} items`}>
            <motion.div
              animate={shouldShake ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.3 }}
              className="text-white group-hover:text-wattle transition-colors"
            >
              <ShoppingCart fontSize="small" />
            </motion.div>
            
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  key={itemCount}
                  aria-live="polite"
                  className="absolute -top-2 -right-2 bg-wattle text-bottle-green text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 -mr-2 hover:text-wattle transition-colors focus:outline-none" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <Close /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 top-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
              />
              <motion.nav 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-bottle-green border-l border-white/10 z-[70] md:hidden flex flex-col p-8 pt-24"
              >
                <div className="flex flex-col gap-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      onClick={() => setIsMenuOpen(false)}
                      className="font-structural text-4xl uppercase tracking-tighter text-white hover:text-wattle transition-colors border-b border-white/5 pb-4"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {/* Account / Auth */}
                  <div className="flex items-center gap-2">
                    <NotificationPanel />
                    {user ? (
                      <Link href="/account/profile" className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Person sx={{ fontSize: 24 }} />
                      </Link>
                    ) : (
                      <Link href="/account/login" className="p-2 text-gray-400 hover:text-white transition-colors">
                        <PersonOutline sx={{ fontSize: 24 }} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>

      </div>
    </motion.header>
  );
}
