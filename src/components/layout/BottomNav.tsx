"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Search, ShoppingCart, AccountCircle } from "@mui/icons-material";
import { useCart } from "@/components/providers/CartContext";
import { motion } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();
  const { itemCount, setIsCartDrawerOpen } = useCart();

  const navItems = [
    { label: "Home", icon: <Home />, href: "/" },
    { label: "Shop", icon: <ShoppingBag />, href: "/shop" },
    { label: "Search", icon: <Search />, href: "/search" },
    { label: "Account", icon: <AccountCircle />, href: "/account/profile" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 bg-bottle-green/90 backdrop-blur-xl border-t border-white/10 z-[100] md:hidden flex items-center justify-around px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.label} href={item.href} className="flex flex-col items-center justify-center gap-1 group w-full">
            <div className={`transition-all duration-300 ${isActive ? "text-wattle scale-110" : "text-gray-500 group-hover:text-white"}`}>
              {item.icon}
            </div>
            <span className={`font-structural text-[8px] uppercase tracking-widest ${isActive ? "text-wattle" : "text-gray-600"}`}>
              {item.label}
            </span>
            {isActive && (
              <motion.div 
                layoutId="activeTab"
                className="absolute -bottom-1 w-8 h-[1px] bg-wattle"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
      
      {/* Search and Cart are special */}
      <button 
        onClick={() => setIsCartDrawerOpen(true)}
        className="flex flex-col items-center justify-center gap-1 group w-full relative"
      >
        <div className="text-gray-500 group-hover:text-white transition-colors">
          <ShoppingCart />
        </div>
        <span className="font-structural text-[8px] uppercase tracking-widest text-gray-600">Cart</span>
        {itemCount > 0 && (
          <span className="absolute top-0 right-1/2 translate-x-3 -translate-y-1 w-4 h-4 bg-wattle text-bottle-green text-[8px] font-structural flex items-center justify-center font-black">
            {itemCount}
          </span>
        )}
      </button>
    </nav>
  );
}
