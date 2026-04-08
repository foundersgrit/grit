"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface FitCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export function FitCalculator({ isOpen, onClose, productName }: FitCalculatorProps) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [build, setBuild] = useState("average");
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const calculateSize = () => {
    const h = parseInt(height);
    const w = parseInt(weight);

    if (!h || !w) return;

    // Very basic structural logic for recommendation
    let size = "M";
    if (w < 65) size = "S";
    else if (w > 85) size = "XL";
    else if (w > 75) size = "L";

    if (build === "athletic" && size !== "XL") {
      // Suggest sizing up for athletic builds in this specific fit
      setRecommendation(size);
    } else {
      setRecommendation(size);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-dark-slate border border-white/10 p-8 md:p-12 overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              X
            </button>
            <h2 className="font-structural text-2xl uppercase tracking-tighter mb-2">Find Your Fit</h2>
            <p className="font-editorial text-gray-500 text-sm mb-8 leading-relaxed">
              Precision sizing for {productName}. Our gear is built with an athletic, structural silhouette.
            </p>

            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Height (cm)</label>
                  <input 
                    type="number" 
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="bg-bottle-green border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Weight (kg)</label>
                  <input 
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="bg-bottle-green border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Body Build</label>
                <div className="grid grid-cols-3 gap-2">
                  {["slim", "average", "athletic"].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBuild(b)}
                      className={`py-2 text-[10px] uppercase tracking-widest border transition-all ${
                        build === b ? "bg-wattle text-bottle-green border-wattle" : "border-white/10 text-gray-500 hover:border-white/30"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="secondary" onClick={calculateSize} className="mt-4">Calculate Size</Button>

              {recommendation && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-bottle-green border border-wattle/30 text-center"
                >
                  <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Recommended Size</span>
                  <span className="font-structural text-5xl text-wattle font-black">{recommendation}</span>
                  <p className="font-editorial text-xs text-gray-400 mt-4 leading-relaxed">
                    Based on your inputs, {recommendation} will provide the intended structural fit for training.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
