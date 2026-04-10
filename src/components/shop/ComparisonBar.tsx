"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useComparison } from "@/components/providers/ComparisonContext";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Close } from "@mui/icons-material";
import { ComparisonTable } from "./ComparisonTable";

export function ComparisonBar() {
  const { 
    selectedProducts, 
    toggleProduct, 
    clearComparison, 
    isComparisonOpen, 
    setIsComparisonOpen 
  } = useComparison();

  if (selectedProducts.length === 0) return null;

  return (
    <>
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 inset-x-0 z-[100] bg-dark-slate border-t border-wattle/30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
      >
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="font-structural text-[10px] uppercase tracking-widest text-wattle mb-1">Burden Match</span>
              <span className="font-structural text-lg uppercase text-white font-black">{selectedProducts.length} / 3 GEAR</span>
            </div>
            
            <div className="flex gap-4">
              {selectedProducts.map((product) => (
                <div key={product.id} className="relative w-12 h-16 bg-black/40 border border-white/10 group">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover opacity-60" />
                  <button 
                    onClick={() => toggleProduct(product)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Close sx={{ fontSize: 10 }} />
                  </button>
                </div>
              ))}
              {[...Array(3 - selectedProducts.length)].map((_, i) => (
                <div key={i} className="w-12 h-16 border border-dashed border-white/5 bg-white/5 flex items-center justify-center text-gray-700 font-structural text-[10px]">
                  +
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={clearComparison}
              className="font-structural text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              Clear
            </button>
            <Button 
              variant="primary" 
              disabled={selectedProducts.length < 2}
              onClick={() => setIsComparisonOpen(true)}
              className="px-12 py-6 text-xs"
            >
              Compare Specs
            </Button>
          </div>
        </div>
      </motion.div>

      <ComparisonTable 
        isOpen={isComparisonOpen} 
        onClose={() => setIsComparisonOpen(false)} 
        products={selectedProducts} 
      />
    </>
  );
}
