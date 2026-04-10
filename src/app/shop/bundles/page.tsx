"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, Bolt, LocalOffer } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

const BUNDLES = [
  {
    id: "foundation-kit",
    name: "The Foundation Kit",
    slug: "foundation-kit",
    description: "The base of your arena presence. Essential top, training jogger, and baseline compression.",
    price: 4950,
    originalPrice: 5800,
    savings: 850,
    discountLabel: "15% OFF",
    image: "https://firebasestorage.googleapis.com/v0/b/grit-apparel.appspot.com/o/products%2Ffoundation-bundle.jpg?alt=media",
    items: ["Performance Tee", "Training Jogger", "Base Layer Top"]
  },
  {
    id: "arena-ready-set",
    name: "The Arena Ready",
    slug: "arena-ready-set",
    description: "High-intensity kit for the heaviest sessions. Compression top, tech shorts, and tactical outerwear.",
    price: 6400,
    originalPrice: 8000,
    savings: 1600,
    discountLabel: "20% OFF",
    image: "https://firebasestorage.googleapis.com/v0/b/grit-apparel.appspot.com/o/products%2Farena-bundle.jpg?alt=media",
    items: ["Compression Armor", "Ventilation Shorts", "Alpha Windbreaker"]
  },
  {
    id: "endurance-system",
    name: "The Endurance System",
    slug: "endurance-system",
    description: "The complete operative loadout. Full outfit including accessories for maximum climate resilience.",
    price: 9300,
    originalPrice: 12500,
    savings: 3200,
    discountLabel: "25% OFF",
    image: "https://firebasestorage.googleapis.com/v0/b/grit-apparel.appspot.com/o/products%2Fendurance-bundle.jpg?alt=media",
    items: ["Heavyweight Hoodie", "Endurance Pant", "Technical Beanie", "Tactical Socks"]
  }
];

export default function BundlesPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <header className="mb-20">
        <div className="flex items-center gap-4 mb-6">
          <Bolt className="text-wattle" sx={{ fontSize: 24 }} />
          <span className="font-structural text-xs uppercase tracking-[0.5em] text-gray-500">Gear Systems</span>
        </div>
        <h1 className="font-structural text-6xl md:text-8xl uppercase tracking-tighter text-white mb-8 leading-none">Kit Up.</h1>
        <p className="font-editorial text-xl text-gray-400 max-w-2xl leading-relaxed">
          GRIT gear works as a system. These curated kits are designed for synergy, rewarding those who commit to the full operative loadout.
        </p>
      </header>

      <div className="space-y-32">
        {BUNDLES.map((bundle, idx) => (
          <motion.section 
            key={bundle.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col ${idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-16 lg:gap-24 items-center`}
          >
            {/* Visual Column */}
            <div className="flex-1 w-full bg-dark-slate aspect-square relative group overflow-hidden">
               {/* Placeholder background until real images available */}
               <div className="absolute inset-0 bg-gradient-to-br from-bottle-green/20 to-black/40" />
               <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  <ShoppingBag sx={{ fontSize: 400 }} />
               </div>
               
               <div className="absolute top-8 left-8 bg-wattle text-bottle-green font-structural text-sm uppercase px-4 py-1 tracking-widest shadow-[0_10px_30px_rgba(204,218,71,0.3)]">
                  {bundle.discountLabel}
               </div>

               <div className="absolute bottom-8 right-8 text-right">
                  <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Total Savings</span>
                  <span className="font-structural text-3xl text-white">৳{bundle.savings}</span>
               </div>
            </div>

            {/* Content Column */}
            <div className="flex-1 space-y-8">
              <h2 className="font-structural text-4xl md:text-6xl uppercase tracking-tighter text-white leading-none">
                {bundle.name}
              </h2>
              <p className="font-editorial text-lg text-gray-400 max-w-lg leading-relaxed">
                {bundle.description}
              </p>

              <div className="space-y-4">
                <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500 block">Included Hardware</span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bundle.items.map(item => (
                    <li key={item} className="flex items-center gap-3 font-editorial text-sm text-white">
                      <div className="w-1.5 h-1.5 bg-wattle rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 flex flex-col gap-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-structural text-5xl text-white tracking-tighter">৳{bundle.price}</span>
                  <span className="font-structural text-xl text-gray-600 line-through tracking-tighter">৳{bundle.originalPrice}</span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <Link href={`/shop/bundles/${bundle.slug}`} className="flex-1">
                    <Button variant="accent" className="w-full py-8 text-lg uppercase tracking-widest group">
                       Configure Kit <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex-1 py-8 text-lg uppercase tracking-widest border-white/10">
                     Quick Add
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      <section className="mt-40 pt-40 border-t border-white/5 text-center">
         <h3 className="font-structural text-3xl uppercase tracking-tighter text-white mb-6">Build Your Own System</h3>
         <p className="font-editorial text-gray-400 max-w-xl mx-auto mb-10">
           Curated kits not enough? Use our structural kit builder to assemble your own gear system and unlock tiered discounts.
         </p>
         <Link href="/shop/kit-builder">
            <Button variant="outline" className="px-12 py-6 border-wattle text-wattle hover:bg-wattle hover:text-bottle-green">
               Open Kit Builder
            </Button>
         </Link>
      </section>
    </div>
  );
}
