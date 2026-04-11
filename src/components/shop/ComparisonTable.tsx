"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import { Close, ShoppingCart } from "@mui/icons-material";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/providers/CartContext";
import Image from "next/image";

interface ComparisonTableProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export function ComparisonTable({ isOpen, onClose, products }: ComparisonTableProps) {
  const { addItem } = useCart();

  if (products.length === 0) return null;

  // Extract all unique specs across products
  const specKeys = Array.from(new Set(
    products.flatMap(p => Object.keys(p.specifications || {}))
  ));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full h-full bg-dark-slate border border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-bottle-green/30">
              <h2 className="font-structural text-3xl uppercase tracking-tighter">Gear Comparison</h2>
              <button 
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors"
                aria-label="Close Comparison"
              >
                <Close />
              </button>
            </div>

            {/* Scrollable Table Area */}
            <div className="flex-1 overflow-x-auto p-12 scrollbar-none">
              <div className="min-w-[800px] h-full flex flex-col">
                {/* Product Headers */}
                <div className="grid grid-cols-[250px_1fr_1fr_1fr] gap-8 border-b border-white/10 pb-8 sticky top-0 bg-dark-slate z-10">
                  <div className="flex flex-col justify-end">
                    <span className="font-structural text-xs uppercase tracking-widest text-gray-500">Spec Matrix</span>
                  </div>
                  {products.map(product => (
                    <div key={product.id} className="flex flex-col gap-4">
                      <div className="relative aspect-[3/4] bg-black/40 border border-white/5 overflow-hidden">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover mix-blend-luminosity" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-structural text-lg uppercase tracking-tight text-white">{product.name}</h3>
                        <p className="font-structural text-wattle font-black text-xl">৳{product.price.toFixed(2)}</p>
                      </div>
                      <Button 
                        variant="primary" 
                        size="sm"
                        className="w-full text-[10px]"
                        onClick={() => {
                          if (product.variants.length > 0) {
                            addItem(product, product.variants[0], 1);
                          }
                        }}
                      >
                         Deploy Now
                      </Button>
                    </div>
                  ))}
                  {/* Fill empty slots */}
                  {[...Array(3 - products.length)].map((_, i) => (
                    <div key={i} className="flex flex-col opacity-20 filter blur-[2px]">
                       <div className="aspect-[3/4] border border-dashed border-white/20 bg-white/5" />
                    </div>
                  ))}
                </div>

                {/* Specs Layer */}
                <div className="flex-1">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-6 font-structural text-[10px] uppercase tracking-widest text-gray-500">Category</td>
                        {products.map(p => (
                          <td key={p.id} className="py-6 px-4 font-editorial text-sm text-white capitalize">{p.category}</td>
                        ))}
                      </tr>
                      {specKeys.map(key => (
                        <tr key={key} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                          <td className="py-6 font-structural text-[10px] uppercase tracking-widest text-gray-500">{key}</td>
                          {products.map(p => (
                            <td key={p.id} className="py-6 px-4 font-editorial text-sm text-gray-300">
                               {(p.specifications as Record<string, string>)[key] || "—"}
                            </td>
                          ))}
                          {[...Array(3 - products.length)].map((_, i) => (
                            <td key={i} className="py-6 px-4" />
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
