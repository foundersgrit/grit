"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/CartContext";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, subtotal, estimatedShipping, total, itemCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="flex-1 bg-dark-slate flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="font-structural text-4xl md:text-5xl uppercase tracking-tighter mb-6 text-white text-center">
            Your cart is empty.
          </h1>
          <p className="font-editorial text-gray-400 mb-12">
            Gear up for what&apos;s ahead. Nothing in here yet to help you endure.
          </p>
          <Link href="/shop">
            <Button variant="accent" size="lg">Explore What Endures</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-dark-slate pt-32 pb-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-structural text-4xl md:text-6xl uppercase tracking-tighter mb-12 text-white">
          The Staging Area
        </h1>

        <div className="grid lg:grid-cols-3 gap-16 items-start">
          {/* Cart Items Listing */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-6 border-b border-white/10 pb-8 group">
                <div className="relative w-32 aspect-[4/5] bg-bottle-green shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-luminosity opacity-80" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                       <h2 className="font-structural text-xl uppercase tracking-narrow text-white group-hover:text-wattle transition-colors">
                        {item.name}
                      </h2>
                      <span className="font-structural text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <p className="font-structural text-xs uppercase tracking-widest text-gray-500 mb-4">
                      {item.selectedColor} • {item.selectedSize}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-white/10">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-structural text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-xs uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Sidebar */}
          <aside className="bg-bottle-green/30 border border-white/10 p-8 flex flex-col gap-8">
            <h2 className="font-structural text-2xl uppercase tracking-tighter text-white">Summary</h2>
            
            <div className="flex flex-col gap-4 border-b border-white/10 pb-8 font-editorial text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-white">
                  {estimatedShipping === 0 ? "FREE" : `$${estimatedShipping.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between font-structural text-2xl uppercase tracking-widest text-white">
              <span>Total</span>
              <span className="text-wattle">${total.toFixed(2)}</span>
            </div>

            <div className="pt-4 flex flex-col gap-4">
              <Link href="/checkout">
                <Button variant="accent" size="lg" className="w-full py-6 text-xl tracking-tighter">
                  Proceed To Checkout
                </Button>
              </Link>
              <Link href="/shop" className="text-center">
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors cursor-pointer">
                  Continue Browsing
                </span>
              </Link>
            </div>
            
            <div className="p-4 bg-dark-slate/40 border border-white/5 text-[10px] uppercase tracking-widest text-gray-500 leading-relaxed">
              Shipping is free for all orders over $150. Gear is built to endure; shipping should not.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
