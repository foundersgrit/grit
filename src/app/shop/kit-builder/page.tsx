"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { useUserContext } from "@/components/providers/UserProvider";
import { useCart } from "@/components/providers/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bolt, CheckCircle, ChevronRight, ShoppingBag, InfoOutlined, Close } from "@mui/icons-material";
import { Product } from "@/types";
import { useToast } from "@/components/providers/ToastProvider";

// Mock Data for Categories (In real app, fetch from Firestore)
const CATEGORIES = [
  { id: "tops", name: "Step 01: Top", required: true },
  { id: "bottoms", name: "Step 02: Bottom", required: true },
  { id: "outerwear", name: "Step 03: Outerwear", required: false },
  { id: "accessories", name: "Step 04: Accessory", required: false },
];

// Mock Products (Filter these in real app)
const MOCK_PRODUCTS: Partial<Product>[] = [
  { id: "p1", name: "Endurance Tee", price: 1800, category: "tops", images: [] },
  { id: "p2", name: "Compression Armor", price: 2200, category: "tops", images: [] },
  { id: "p3", name: "Training Jogger", price: 3500, category: "bottoms", images: [] },
  { id: "p4", name: "Ventilation Shorts", price: 2800, category: "bottoms", images: [] },
  { id: "p5", name: "Alpha Windbreaker", price: 4500, category: "outerwear", images: [] },
  { id: "p6", name: "Technical Beanie", price: 1200, category: "accessories", images: [] },
  { id: "p7", name: "Tactical Socks", price: 800, category: "accessories", images: [] },
];

export default function KitBuilderPage() {
  const [step, setStep] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Record<string, Product>>({});
  const { addItem } = useCart();
  const { showToast } = useToast();

  const currentCategory = CATEGORIES[step];
  const products = MOCK_PRODUCTS.filter(p => p.category === currentCategory.id) as Product[];

  const subtotal = useMemo(() => {
    return Object.values(selectedItems).reduce((acc, item) => acc + item.price, 0);
  }, [selectedItems]);

  const itemCount = Object.keys(selectedItems).length;
  
  const discountTier = useMemo(() => {
    if (itemCount >= 4) return 0.20; // 20%
    if (itemCount >= 3) return 0.15; // 15%
    if (itemCount >= 2) return 0.10; // 10%
    return 0;
  }, [itemCount]);

  const discountAmount = subtotal * discountTier;
  const finalPrice = subtotal - discountAmount;

  const handleToggleItem = (product: Product) => {
    setSelectedItems(prev => {
      const next = { ...prev };
      if (next[product.id]) {
        delete next[product.id];
      } else {
        // Remove other items in same category if category is single-choice (simplified)
        // For this builder, we'll allow 1 per category for simplicity
        Object.keys(next).forEach(id => {
          if (next[id].category === product.category) delete next[id];
        });
        next[product.id] = product;
      }
      return next;
    });
  };

  const handleFinish = () => {
    // Add all items to cart (in real app, add as a single bundle item or many)
    Object.values(selectedItems).forEach(item => {
      // Mocking add - in real app, need variant selection
      showToast(`${item.name} added to system.`);
    });
    showToast(`System Alpha finalized. ৳${discountAmount.toFixed(0)} savings applied.`);
  };

  return (
    <div className="min-h-screen bg-dark-slate py-12 px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        
        {/* Builder Area */}
        <div className="flex-1 space-y-12">
          <header className="flex items-center justify-between border-b border-white/5 pb-8">
            <div>
              <h1 className="font-structural text-4xl uppercase tracking-tighter text-white mb-2">Kit Builder</h1>
              <p className="font-editorial text-sm text-gray-500 uppercase tracking-widest leading-none">Assemble Your System</p>
            </div>
            <div className="flex gap-2">
               {CATEGORIES.map((_, idx) => (
                  <div key={idx} className={`w-12 h-1 ${idx <= step ? "bg-wattle" : "bg-white/5"}`} />
               ))}
            </div>
          </header>

          <main>
             <h2 className="font-structural text-2xl uppercase tracking-widest text-white mb-10 flex items-center gap-4">
               {currentCategory.name}
               {currentCategory.required && <span className="text-wattle text-[10px] tracking-normal px-2 py-0.5 border border-wattle/30">Required</span>}
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map(product => (
                   <button
                      key={product.id}
                      onClick={() => handleToggleItem(product)}
                      className={`relative flex flex-col items-start p-8 border hover:bg-white/5 transition-all text-left group ${
                        selectedItems[product.id] ? "border-wattle bg-wattle/5" : "border-white/10"
                      }`}
                   >
                      <div className="w-full aspect-square bg-black/20 mb-6 flex items-center justify-center opacity-40">
                         <ShoppingBag sx={{ fontSize: 64 }} />
                      </div>
                      <h4 className="font-structural text-lg uppercase text-white mb-2">{product.name}</h4>
                      <span className="font-editorial text-sm text-gray-400">৳{product.price}</span>
                      
                      {selectedItems[product.id] && (
                        <div className="absolute top-4 right-4 text-wattle">
                           <CheckCircle sx={{ fontSize: 24 }} />
                        </div>
                      )}
                   </button>
                ))}
             </div>
          </main>

          <footer className="flex justify-between items-center pt-12 border-t border-white/5">
             <Button 
                variant="outline" 
                onClick={() => setStep(prev => Math.max(0, prev - 1))}
                disabled={step === 0}
                className="px-12 py-6 uppercase tracking-widest text-xs border-white/5"
             >
                Previous Step
             </Button>
             
             {step < CATEGORIES.length - 1 ? (
                <Button 
                   variant="accent" 
                   onClick={() => setStep(prev => prev + 1)}
                   disabled={currentCategory.required && !Object.values(selectedItems).some(p => p.category === currentCategory.id)}
                   className="px-16 py-6 uppercase tracking-widest text-xs"
                >
                   Next Step <ChevronRight />
                </Button>
             ) : (
                <Button 
                   variant="accent" 
                   onClick={handleFinish}
                   className="px-16 py-6 uppercase tracking-widest text-xs"
                >
                   Finalize System
                </Button>
             )}
          </footer>
        </div>

        {/* System Overview Sidebar */}
        <aside className="w-full lg:w-[400px] space-y-8">
           <div className="bg-bottle-green/10 border border-white/10 p-8 sticky top-32">
              <h3 className="font-structural text-xl uppercase tracking-widest text-white mb-8 border-b border-white/5 pb-4">System Overview</h3>
              
              <div className="space-y-6 mb-12 min-h-[200px]">
                 {Object.keys(selectedItems).length === 0 ? (
                    <div className="text-center py-12 opacity-20">
                       <Bolt sx={{ fontSize: 64 }} />
                       <p className="font-editorial text-[10px] uppercase mt-4">No Hardware Selected</p>
                    </div>
                 ) : (
                    <div className="space-y-4">
                       {Object.values(selectedItems).map(item => (
                          <div key={item.id} className="flex justify-between items-center animate-in fade-in slide-in-from-right-2">
                             <div>
                                <span className="font-structural text-xs uppercase text-white block">{item.name}</span>
                                <span className="font-editorial text-[10px] text-gray-500 uppercase">{item.category}</span>
                             </div>
                             <span className="font-editorial text-xs text-white tracking-widest">৳{item.price}</span>
                          </div>
                       ))}
                    </div>
                 )}
              </div>

              {/* Tiered Discount Display */}
              <div className="bg-black/40 p-6 space-y-4 mb-8">
                 <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                    <span className="text-gray-500">Tier Progress</span>
                    <span className="text-wattle">{Math.round(discountTier * 100)}% Applied</span>
                 </div>
                 <div className="h-1 bg-white/5 flex gap-1">
                    {[1, 2, 3, 4].map(t => (
                       <div key={t} className={`flex-1 ${itemCount >= t ? "bg-wattle" : "bg-white/10"}`} />
                    ))}
                 </div>
                 <p className="font-editorial text-[10px] text-gray-500 text-center uppercase">
                    {itemCount < 4 ? `Add ${4 - itemCount} more to unlock 20% discount.` : "Max Tier Unlocked."}
                 </p>
              </div>

              <div className="space-y-4 font-structural text-sm uppercase tracking-widest">
                 <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>৳{subtotal}</span>
                 </div>
                 {discountAmount > 0 && (
                    <div className="flex justify-between text-wattle">
                       <span>Kit Discount</span>
                       <span>-৳{Math.round(discountAmount)}</span>
                    </div>
                 )}
                 <div className="flex justify-between text-2xl text-white pt-4 border-t border-white/10 tracking-tighter">
                    <span>Final</span>
                    <span>৳{Math.round(finalPrice)}</span>
                 </div>
              </div>

              <div className="mt-8 p-4 bg-wattle/5 border border-wattle/20 flex gap-3">
                 <InfoOutlined className="text-wattle" sx={{ fontSize: 16 }} />
                 <p className="font-editorial text-[10px] text-gray-400 leading-relaxed uppercase">
                   Your kit discount is calculated based on the number of technical layers in your system. Committing to a full outfit maximizes resilience and reduces cost.
                 </p>
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
}
