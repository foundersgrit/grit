"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/components/providers/CartContext";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick add default: First variant
    if (product.variants.length > 0) {
      addItem(product, product.variants[0], 1);
    }
  };

  return (
    <Link href={`/shop/${product.category}/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-dark-slate mb-6">
        <Image 
          src={product.images[0]} 
          alt={product.name} 
          fill 
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity grayscale group-hover:grayscale-0"
        />
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <Button 
            variant="accent" 
            className="w-full text-bottle-green bg-wattle hover:bg-white font-structural uppercase text-xs tracking-widest py-3"
            onClick={handleQuickAdd}
          >
            Quick Add
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <h3 className="font-structural text-xl uppercase tracking-tighter text-white transition-colors group-hover:text-wattle">
          {product.name}
        </h3>
        <p className="font-structural text-gray-400">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
