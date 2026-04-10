"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/components/providers/CartContext";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { RelatedProducts } from "./RelatedProducts";
import { FitCalculator } from "./FitCalculator";
import { ZoomIn, Close, ChevronLeft, ChevronRight, Straighten, Bolt, LocalOffer } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color || "");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isFitCalculatorOpen, setIsFitCalculatorOpen] = useState(false);
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { trackProduct } = useRecentlyViewed();
  const router = useRouter();

  // B1: Track view on mount
  useEffect(() => {
    trackProduct(product);
  }, [product.id, trackProduct]);

  const currentVariants = product.variants.filter(v => v.color === selectedColor);
  const availableSizes = Array.from(new Set(currentVariants.map(v => v.size)));
  const selectedVariant = currentVariants.find(v => v.size === selectedSize);

  // B6: Stock logic
  const isLowStock = selectedVariant && selectedVariant.stock < 5 && selectedVariant.stock > 0;
  const isOutOfStock = selectedVariant && selectedVariant.stock === 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast("Select a size first.");
      return;
    }
    if (isOutOfStock) {
      showToast("This variant is currently out of stock.");
      return;
    }
    if (selectedVariant) {
      addItem(product, selectedVariant, 1);
      showToast("Added to deployment.");
    }
  };

  // E3: Express Checkout
  const handleBuyNow = () => {
    if (!selectedSize) {
      showToast("Select a size first.");
      return;
    }
    if (selectedVariant) {
      addItem(product, selectedVariant, 1);
      router.push("/checkout");
    }
  };

  const nextImage = () => setActiveImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);

  return (
    <div className="flex flex-col gap-24">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-6">
          <div 
            className="relative aspect-[4/5] bg-dark-slate overflow-hidden group cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
          >
            <Image 
              src={product.images[activeImage]} 
              alt={product.name} 
              fill 
              priority
              className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 mix-blend-luminosity"
            />
            <div className="absolute bottom-6 right-6 p-3 bg-bottle-green/40 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn />
            </div>
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-structural text-4xl md:text-6xl uppercase tracking-tighter mb-4 leading-none text-white">
                {product.name}
              </h1>
              <p className="font-structural text-2xl text-wattle">৳{product.price.toFixed(2)}</p>
            </div>
            
            <div className="hidden lg:flex flex-col items-end">
               <span className="font-structural text-[9px] uppercase tracking-widest text-gray-500 mb-2">Technical Grade</span>
               <div className="px-3 py-1 bg-white/5 border border-white/10 font-structural text-[10px] text-white tracking-widest uppercase">
                  Endurance-V4
               </div>
            </div>
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
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedSize("");
                    }}
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
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors underline underline-offset-4"
                  >
                    Size Guide
                  </button>
                  <button 
                    onClick={() => setIsFitCalculatorOpen(true)}
                    className="text-[10px] uppercase tracking-widest text-wattle hover:text-white transition-colors underline underline-offset-4"
                  >
                    Find Your Fit
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                {availableSizes.map(size => {
                  const sizeVariant = currentVariants.find(v => v.size === size);
                  const isSizeOOS = sizeVariant?.stock === 0;
                  
                  return (
                    <button
                      key={size}
                      disabled={isSizeOOS}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center text-sm uppercase tracking-widest border transition-all relative ${
                        selectedSize === size 
                          ? "bg-wattle text-bottle-green border-wattle shadow-[0_0_15px_rgba(204,218,71,0.2)]" 
                          : isSizeOOS 
                            ? "border-white/5 text-gray-700 cursor-not-allowed" 
                            : size === recommendedSize
                              ? "border-wattle/50 text-wattle"
                              : "border-white/10 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      {size}
                      {size === recommendedSize && (
                        <div className="absolute -top-2 -right-2 bg-wattle text-bottle-green text-[8px] px-1 font-structural font-black">REC</div>
                      )}
                      {isSizeOOS && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-[1px] bg-gray-700 rotate-45" /></div>}
                    </button>
                  );
                })}
              </div>
              
              {isLowStock && (
                <p className="mt-4 text-[10px] uppercase tracking-widest text-orange-400 animate-pulse">
                  Only {selectedVariant?.stock} left in inventory.
                </p>
              )}
              
              {isOutOfStock && (
                <div className="mt-4 p-4 bg-dark-slate border border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">
                    This one&apos;s earned its rest. We&apos;ll let you know when it&apos;s back.
                  </p>
                  <Button variant="outline" size="sm" className="text-[10px]">Notify Me</Button>
                </div>
              )}
            </div>
          </div>

          {/* Actions (E3: Express Checkout) */}
          <div className="flex flex-col gap-4 pt-8 border-t border-white/10 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full py-8 text-xl tracking-widest h-20"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Sold Out" : "Add To Cart"}
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="w-full py-8 text-xl tracking-widest h-20 bg-white/5 border-white/10 hover:border-wattle hover:text-wattle"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                Buy It Now
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-gray-500">
                 <span className="w-2 h-2 rounded-full bg-green-500" /> Secure Checkout
              </div>
               <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-wattle" /> Free Shipping over ৳3000
               </div>
            </div>

            {/* Kit Suggestion */}
            <div className="mt-12 bg-bottle-green/10 border border-white/5 p-6 animate-in fade-in slide-in-from-bottom-4">
               <div className="flex items-center gap-2 mb-4">
                  <div className="text-wattle"><LocalOffer sx={{ fontSize: 16 }} /></div>
                  <span className="font-structural text-[10px] uppercase tracking-[0.3em] text-white">Strategic Kit Deployment</span>
               </div>
               <p className="font-editorial text-xs text-gray-400 mb-6">
                 This asset is part of <span className="text-white">The Foundation Kit</span>. Secured as a system, you save ৳850.
               </p>
               <Link href="/shop/bundles/foundation-kit">
                  <Button variant="outline" className="w-full text-[10px] py-4 bg-white/5 border-white/5 uppercase tracking-widest">
                    View Complete System
                  </Button>
               </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts currentProductId={product.id} category={product.category} />

      {/* B4: Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
          >
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-8 right-8 text-white z-[210] hover:text-wattle transition-colors"
            >
              <Close fontSize="large" />
            </button>
            <button onClick={prevImage} className="absolute left-8 text-white hover:text-wattle transition-colors">
              <ChevronLeft fontSize="large" />
            </button>
            <button onClick={nextImage} className="absolute right-8 text-white hover:text-wattle transition-colors">
              <ChevronRight fontSize="large" />
            </button>
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full h-full max-w-5xl max-h-[80vh]"
            >
              <Image src={product.images[activeImage]} alt={product.name} fill className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size Guide Modal */}
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
               <button onClick={() => setIsSizeGuideOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                <Close />
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

      <FitCalculator 
        isOpen={isFitCalculatorOpen} 
        onClose={() => setIsFitCalculatorOpen(false)} 
        onRecommend={(size) => setRecommendedSize(size)}
      />
    </div>
  );
}
