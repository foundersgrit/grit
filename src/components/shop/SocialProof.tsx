"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { ordersRef } from "@/lib/firebase/collections";
import Image from "next/image";

interface ProofOrder {
  id: string;
  items: { name: string; image: string }[];
  shippingAddress: { city: string };
  createdAt: any;
}

export function SocialProof() {
  const [orders, setOrders] = useState<ProofOrder[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const q = query(ordersRef, orderBy("createdAt", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const orderData = doc.data();
        return {
          id: doc.id,
          items: orderData.items || [],
          shippingAddress: orderData.shippingAddress || { city: "Unknown" },
          createdAt: orderData.createdAt
        };
      }) as ProofOrder[];
      setOrders(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(true);
      
      const hideTimeout = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % orders.length);
        }, 500); // Wait for exit animation
      }, 5000);

      return () => clearTimeout(hideTimeout);
    }, 15000); // Show every 15 seconds

    return () => clearInterval(interval);
  }, [orders]);

  if (orders.length === 0) return null;
  const currentOrder = orders[currentIndex];
  if (!currentOrder) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-8 left-8 z-[200] hidden md:flex items-center gap-4 bg-bottle-green border border-white/10 p-4 shadow-2xl max-w-sm"
        >
          <div className="relative w-12 h-12 bg-dark-slate shrink-0">
             <Image 
                src={currentOrder.items[0]?.image || "/product_endurance.png"} 
                alt="Recent Order" 
                fill 
                className="object-cover mix-blend-luminosity grayscale opacity-60" 
             />
          </div>
          <div className="flex flex-col">
            <span className="font-structural text-[10px] uppercase tracking-widest text-wattle mb-1">Recent Deployment</span>
            <p className="font-structural text-[10px] text-white leading-tight uppercase">
              Someone in <span className="text-white font-black">{currentOrder.shippingAddress.city}</span> just earned their {currentOrder.items[0]?.name}.
            </p>
            <span className="font-editorial text-[9px] text-gray-500 mt-1 italic">Verified Purchase</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
