"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/components/providers/CartContext";
import { useComparison } from "@/components/providers/ComparisonContext";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Visibility, CompareArrows } from "@mui/icons-material";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { selectedProducts, toggleProduct } = useComparison();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const isSelectedForComparison = selectedProducts.some(p => p.id === product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.variants && product.variants.length > 0) {
      addItem(product, product.variants[0], 1);
    }
  };

  const openQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleProduct(product);
  };

  return (
    <>
      <Link href={`/shop/${product.category}/${product.slug}`} className="group block h-full">
        <div className="relative aspect-[3/4] overflow-hidden bg-dark-slate mb-6">
          <motion.div
            className="h-full w-full"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image 
              src={product.images[0]} 
              alt={product.name} 
              fill 
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 mix-blend-luminosity grayscale group-hover:grayscale-0"
            />
          </motion.div>
          
          {/* Action Overlay (Desktop) */}
          <div className="hidden md:flex absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 gap-2">
            <Button 
              variant="primary" 
              className="flex-1 py-3"
              onClick={handleQuickAdd}
            >
              Add To Cart
            </Button>
            <button 
              onClick={openQuickView}
              className="bg-white/20 backdrop-blur-md text-white p-3 hover:bg-white hover:text-bottle-green transition-colors"
              aria-label="Quick View"
            >
              <Visibility fontSize="small" />
            </button>
          </div>

          {/* Comparison Checkbox (Always visible if selected, otherwise hover) */}
          <div className={`absolute top-4 left-4 z-10 transition-all duration-300 ${isSelectedForComparison ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <button 
              onClick={handleCompareToggle}
              className={`p-2 backdrop-blur-md border transition-all ${
                isSelectedForComparison ? "bg-wattle border-wattle text-bottle-green" : "bg-black/40 border-white/20 text-white hover:border-wattle hover:text-wattle"
              }`}
              aria-label={isSelectedForComparison ? "Remove from comparison" : "Add to comparison"}
            >
              <CompareArrows sx={{ fontSize: 16 }} />
            </button>
          </div>

          {/* Quick Add (Mobile) */}
          <div className="md:hidden absolute right-3 bottom-3 z-10">
            <button 
              onClick={handleQuickAdd}
              className="p-3 bg-wattle text-bottle-green rounded-none shadow-lg active:scale-95 transition-transform"
              aria-label="Quick Add to Cart"
            >
              <ShoppingCart fontSize="small" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <h3 className="font-structural text-xl uppercase tracking-tighter text-white transition-colors group-hover:text-wattle">
            {product.name}
          </h3>
          <p className="font-editorial text-lg text-gray-400">
            ৳{product.price.toFixed(2)}
          </p>
        </div>
      </Link>

      <QuickViewModal 
        product={isQuickViewOpen ? product : null} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </>
  );
}
