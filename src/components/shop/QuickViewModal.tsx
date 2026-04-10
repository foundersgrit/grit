"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/providers/CartContext";
import { useState } from "react";
import { Close } from "@mui/icons-material";
import Link from "next/link";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product?.variants[0]?.color || "");

  if (!product) return null;

  const currentVariants = product.variants.filter(v => v.color === selectedColor);
  const availableSizes = Array.from(new Set(currentVariants.map(v => v.size)));
  const selectedVariant = currentVariants.find(v => v.size === selectedSize);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    if (selectedVariant) {
      addItem({
        id: `${product.id}-${selectedVariant.size}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        selectedSize: selectedVariant.size,
        selectedColor: selectedVariant.color
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-bottle-green border border-white/10 shadow-2xl grid md:grid-cols-2 overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-white z-10 p-2 bg-black/20 rounded-full"
            >
              <Close />
            </button>

            {/* Left: Product Image */}
            <div className="relative aspect-square md:aspect-auto bg-dark-slate">
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                className="object-cover mix-blend-luminosity" 
              />
            </div>

            {/* Right: Info */}
            <div className="p-12 flex flex-col justify-between">
              <div>
                <h2 className="font-structural text-3xl uppercase tracking-tighter mb-2 text-white">{product.name}</h2>
                <p className="font-structural text-xl text-wattle mb-8">${product.price.toFixed(2)}</p>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="font-structural text-[10px] uppercase tracking-widest text-gray-500 mb-4">Select Size</h3>
                    <div className="flex gap-2">
                       {availableSizes.map(size => (
                         <button
                           key={size}
                           onClick={() => setSelectedSize(size)}
                           className={`w-10 h-10 text-[10px] uppercase tracking-widest border transition-all ${
                             selectedSize === size ? "bg-wattle text-bottle-green border-wattle" : "border-white/10 text-gray-400 hover:border-white/30"
                           }`}
                         >
                           {size}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div>
                     <h3 className="font-structural text-[10px] uppercase tracking-widest text-gray-500 mb-4">Color</h3>
                     <div className="flex gap-2">
                        {Array.from(new Set(product.variants.map(v => v.color))).map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-all ${
                              selectedColor === color ? "border-wattle text-wattle" : "border-white/10 text-gray-400 hover:border-white/30"
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                     </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-12">
                <Button 
                  variant="primary" 
                  className="w-full py-6 uppercase text-sm"
                  disabled={!selectedSize}
                  onClick={handleAddToCart}
                >
                  Add To Deployment
                </Button>
                <Link 
                  href={`/shop/${product.category}/${product.slug}`}
                  onClick={onClose}
                  className="text-center font-structural text-[10px] uppercase tracking-widest text-gray-500 hover:text-white underline underline-offset-4"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
