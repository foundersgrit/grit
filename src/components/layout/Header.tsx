"use client";

import Link from "next/link";
import { Search, Person, ShoppingCart, Menu, Close } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/CartContext";
import { useState } from "react";

export function Header() {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "Our Story", href: "/our-story" },
    { label: "The Arena", href: "/the-arena" },
    { label: "Journal", href: "/journal" },
  ];

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 w-full bg-bottle-green/95 backdrop-blur-md border-b border-white/10"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
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
          <Link href="/account" className="hover:text-wattle transition-colors focus:outline-none focus:ring-2 focus:ring-wattle focus:ring-offset-2 focus:ring-offset-bottle-green" aria-label="Account Dashboard">
            <Person fontSize="small" />
          </Link>
          <Link href="/cart" className="hover:text-wattle transition-colors relative focus:outline-none focus:ring-2 focus:ring-wattle focus:ring-offset-2 focus:ring-offset-bottle-green" aria-label={`Cart, ${itemCount} items`}>
            <ShoppingCart fontSize="small" />
            {itemCount > 0 && (
              <span 
                aria-live="polite"
                className="absolute -top-2 -right-2 bg-wattle text-bottle-green text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
              >
                {itemCount}
              </span>
            )}
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
                className="fixed inset-0 top-20 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              />
              <motion.nav 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-20 right-0 bottom-0 w-4/5 max-w-sm bg-bottle-green border-l border-white/10 z-50 md:hidden flex flex-col p-8 pt-12"
              >
                <div className="flex flex-col gap-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      onClick={() => setIsMenuOpen(false)}
                      className="font-structural text-3xl uppercase tracking-tighter text-white hover:text-wattle transition-colors border-b border-white/5 pb-4"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link 
                    href="/account"
                    onClick={() => setIsMenuOpen(false)}
                    className="font-structural text-lg uppercase tracking-widest text-gray-400 mt-8"
                  >
                    Account Dashboard
                  </Link>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>

      </div>
    </motion.header>
  );
}

