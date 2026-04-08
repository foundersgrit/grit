"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/CartContext";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const { cart, isCartDrawerOpen, setIsCartDrawerOpen, removeItem, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150]"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bottle-green border-l border-white/10 z-[160] flex flex-col shadow-2xl"
          >
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-structural text-xl uppercase tracking-tighter">Your Payload</h2>
              <button 
                onClick={() => setIsCartDrawerOpen(false)}
                className="text-gray-400 hover:text-white transition-colors uppercase text-[10px] tracking-widest"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 scrollbar-none">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="font-editorial text-gray-400 mb-8">Your cart is currently empty. The mission hasn't started.</p>
                  <Link href="/shop" onClick={() => setIsCartDrawerOpen(false)}>
                    <Button variant="secondary">Go to Shop</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-6 animate-fade-in">
                      <div className="relative w-20 aspect-square bg-dark-slate border border-white/5 shrink-0 overflow-hidden">
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-structural text-sm uppercase tracking-wide leading-tight">{item.name}</h3>
                          <span className="font-structural text-sm">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="font-structural text-[10px] text-gray-500 uppercase tracking-widest mb-4">
                          Size: {item.selectedSize} / Color: {item.selectedColor}
                        </p>
                        <div className="flex justify-between items-center">
                           <span className="font-editorial text-xs text-wattle">Qty: {item.quantity}</span>
                           <button 
                            onClick={() => removeItem(item.id)}
                            className="text-[10px] uppercase tracking-widest text-red-500/70 hover:text-red-500 transition-colors"
                           >
                            Remove
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 bg-black/40 border-t border-white/10 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                  <span className="font-structural text-sm uppercase tracking-widest text-gray-400">Subtotal</span>
                  <span className="font-structural text-3xl text-wattle font-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="grid gap-3">
                  <Link href="/checkout" onClick={() => setIsCartDrawerOpen(false)}>
                    <Button variant="accent" className="w-full py-6 uppercase text-lg">Proceed To Checkout</Button>
                  </Link>
                  <Link href="/cart" onClick={() => setIsCartDrawerOpen(false)}>
                    <Button variant="secondary" className="w-full py-4 text-xs font-structural">View Full Cart</Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
