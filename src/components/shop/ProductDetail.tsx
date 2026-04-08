"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, ProductVariant } from "@/types";
import { useCart } from "@/components/providers/CartContext";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color || "");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const { addItem } = useCart();
  const { showToast } = useToast();

  const currentVariants = product.variants.filter(v => v.color === selectedColor);
  const availableSizes = Array.from(new Set(currentVariants.map(v => v.size)));
  
  const selectedVariant = currentVariants.find(v => v.size === selectedSize);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      showToast("Select a size first.");
      return;
    }
    addItem(product, selectedVariant, 1);
  };

  const handleAddToWishlist = () => {
    showToast("Saved to wishlist.");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
      {/* Left: Image Gallery */}
      <div className="flex flex-col gap-6">
        <div className="relative aspect-[4/5] bg-dark-slate overflow-hidden group cursor-zoom-in">
          <Image 
            src={product.images[activeImage]} 
            alt={product.name} 
            fill 
            priority
            className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 mix-blend-luminosity"
          />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {product.images.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`relative w-24 aspect-[4/5] shrink-0 border-2 transition-all ${
                activeImage === idx ? "border-wattle" : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`${product.name} thumbnail ${idx}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-structural text-4xl md:text-6xl uppercase tracking-tighter mb-4 leading-none text-white">
            {product.name}
          </h1>
          <p className="font-structural text-2xl text-wattle">${product.price.toFixed(2)}</p>
        </div>

        <p className="font-editorial text-lg text-gray-300 leading-relaxed border-l-2 border-white/10 pl-6 py-2">
          {product.description}
        </p>

        {/* Variant Selection */}
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="font-structural text-xs uppercase tracking-widest text-gray-400 mb-4">Color</h3>
            <div className="flex gap-3">
              {Array.from(new Set(product.variants.map(v => v.color))).map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 text-sm uppercase tracking-widest border transition-all ${
                    selectedColor === color ? "border-wattle text-wattle" : "border-white/10 text-gray-400 hover:border-white/30"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-structural text-xs uppercase tracking-widest text-gray-400">Size</h3>
              <button 
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs uppercase tracking-widest text-wattle underline underline-offset-4 hover:text-white transition-colors"
              >
                Size Guide
              </button>
            </div>
            <div className="flex gap-3">
              {availableSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 flex items-center justify-center text-sm uppercase tracking-widest border transition-all ${
                    selectedSize === size ? "bg-wattle text-bottle-green border-wattle" : "border-white/10 text-gray-400 hover:border-white/30"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 pt-8 border-t border-white/10 mt-4">
          <Button 
            variant="accent" 
            size="lg" 
            className="w-full py-8 text-2xl tracking-widest bg-wattle text-bottle-green hover:bg-white hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(204,218,71,0.2)]"
            onClick={handleAddToCart}
          >
            Add To Cart
          </Button>
           <Button variant="secondary" size="lg" className="w-full text-xs tracking-widest" onClick={handleAddToWishlist}>
            Add To Wishlist
          </Button>
        </div>

        {/* Tech Specs */}
        <div className="mt-12">
          <h3 className="font-structural text-xs uppercase tracking-widest text-gray-400 mb-6 border-b border-white/10 pb-4">
            Technical Specifications
          </h3>
          <table className="w-full font-editorial text-sm text-gray-300 border-collapse">
            <tbody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key} className="border-b border-white/5">
                  <td className="py-3 font-structural text-gray-500 uppercase tracking-wider">{key}</td>
                  <td className="py-3 text-right">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Size Guide Modal Overlay */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-dark-slate border border-white/10 p-12 overflow-hidden"
            >
               <button 
                onClick={() => setIsSizeGuideOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                X
              </button>
              <h2 className="font-structural text-3xl uppercase tracking-tighter mb-8">Size Guide</h2>
              <div className="font-editorial text-gray-300 space-y-6">
                <p>GRIT gear follows an athletic, structural fit. For a more relaxed silhouette, we recommend sizing up.</p>
                <div className="grid grid-cols-4 gap-4 border-y border-white/10 py-6 text-center text-xs uppercase tracking-widest">
                  <div className="font-structural text-gray-500">Size</div>
                  <div>Chest (in)</div>
                  <div>Waist (in)</div>
                  <div>Hips (in)</div>
                  {["S", "M", "L", "XL"].map(s => (
                    <React.Fragment key={s}>
                      <div className="font-structural text-wattle">{s}</div>
                      <div>34-36</div>
                      <div>28-30</div>
                      <div>34-36</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
