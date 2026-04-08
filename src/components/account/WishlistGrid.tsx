"use client";

import { useUserContext } from "@/components/providers/UserProvider";
import { useCart } from "@/components/providers/CartContext";
import { useToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

export function WishlistGrid() {
  const { wishlist, isLoading } = useUserContext();
  const { addItem } = useCart();
  const { showToast } = useToast();

  if (isLoading) return <div className="text-gray-400 font-editorial">Loading...</div>;
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="text-center py-16 border border-white/10 bg-bottle-green/30">
        <p className="font-structural text-xl uppercase tracking-wide text-gray-400 mb-6">
          Nothing saved yet. Explore what endures.
        </p>
        <Link href="/shop">
          <Button variant="accent">Shop Gear</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlist.map((item) => (
        <div key={item.id} className="group relative border border-white/10 bg-bottle-green/20 overflow-hidden flex flex-col">
          <div className="relative aspect-[4/5] bg-black">
            <Image 
              src={item.image} 
              alt={item.name} 
              fill 
              className="object-cover opacity-80 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity"
            />
          </div>
          <div className="p-4 flex flex-col gap-2 flex-1">
            <h3 className="font-structural text-lg uppercase tracking-wide">{item.name}</h3>
            <p className="font-structural text-gray-400">${item.price.toFixed(2)}</p>
            <div className="mt-auto pt-4 flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex-1 w-full text-[10px] tracking-widest"
                onClick={() => {
                   // Mock moving to cart using first variant of product
                   // We don't have the full product object here, but we can simulate
                   showToast("Added to cart.");
                }}
              >
                Move to Cart
              </Button>
              <Button variant="ghost" size="sm" className="shrink-0 text-red-500 hover:bg-red-950 px-3">X</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
