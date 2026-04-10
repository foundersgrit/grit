"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/CartContext";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { Add, Remove, DeleteOutline, Bolt } from "@mui/icons-material";

export function CartDrawer() {
  const { cart, isCartDrawerOpen, setIsCartDrawerOpen, updateQuantity, removeItem, subtotal, lastAddedId } = useCart();

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
                className="text-gray-400 hover:text-white transition-colors uppercase text-[10px] tracking-widest outline-none"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 scrollbar-none">
              <AnimatePresence initial={false}>
                {cart.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <p className="font-editorial text-gray-400 mb-8 max-w-[200px]">Your cart is empty. Gear up for what&apos;s ahead.</p>
                    <Link href="/shop" onClick={() => setIsCartDrawerOpen(false)}>
                      <Button variant="outline">Go to Shop</Button>
                    </Link>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-8">
                    {cart.map((item) => {
                      const isNewlyAdded = item.id === lastAddedId;
                      
                      return (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          layout
                          className={`flex gap-6 p-4 transition-all duration-500 ${
                            isNewlyAdded 
                              ? "bg-wattle/5 border border-wattle/20 shadow-[0_0_20px_rgba(204,218,71,0.05)]" 
                              : "border border-transparent"
                          }`}
                        >
                          <div className="relative w-24 aspect-square bg-dark-slate border border-white/5 shrink-0 overflow-hidden">
                            <Image 
                              src={item.image} 
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                            {isNewlyAdded && (
                              <div className="absolute top-0 left-0 bg-wattle text-bottle-green font-structural text-[8px] px-1 font-black flex items-center gap-1">
                                <Bolt sx={{ fontSize: 8 }} /> Newly Deployed
                              </div>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-structural text-sm uppercase tracking-wide leading-tight">{item.name}</h3>
                                <span className={isNewlyAdded ? "font-structural text-sm text-wattle" : "font-structural text-sm text-white"}>
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                              <p className="font-structural text-[10px] text-gray-500 uppercase tracking-widest">
                                {item.selectedSize} / {item.selectedColor}
                              </p>
                            </div>
                            
                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center border border-white/10 px-2 py-1 gap-4 bg-black/20">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="text-gray-500 hover:text-wattle transition-colors"
                                >
                                  <Remove sx={{ fontSize: 14 }} />
                                </button>
                                
                                <AnimatePresence mode="wait">
                                  <motion.span 
                                    key={item.quantity}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="font-structural text-xs min-w-[12px] text-center"
                                  >
                                    {item.quantity}
                                  </motion.span>
                                </AnimatePresence>

                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="text-gray-500 hover:text-wattle transition-colors"
                                >
                                  <Add sx={{ fontSize: 14 }} />
                                </button>
                              </div>

                              <button 
                                onClick={() => removeItem(item.id)}
                                className="text-gray-500 hover:text-red-500 transition-colors p-2"
                                aria-label="Remove item"
                              >
                                <DeleteOutline sx={{ fontSize: 18 }} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {cart.length > 0 && (
              <div className="p-8 bg-black/40 border-t border-white/10 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                  <span className="font-structural text-sm uppercase tracking-widest text-gray-400">Battle Total</span>
                  <span className="font-structural text-3xl text-wattle font-black tracking-tighter">${subtotal.toFixed(2)}</span>
                </div>
                <div className="grid gap-3">
                  <Link href="/checkout" onClick={() => setIsCartDrawerOpen(false)}>
                    <Button variant="primary" className="w-full py-6 uppercase text-lg h-16">Proceed To Checkout</Button>
                  </Link>
                  <Link href="/cart" onClick={() => setIsCartDrawerOpen(false)}>
                    <Button variant="outline" className="w-full py-4 text-xs font-structural h-12">View Full Cart</Button>
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
