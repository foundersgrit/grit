"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { Close, ChevronRight, ChevronLeft, Straighten } from "@mui/icons-material";

interface FitCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onRecommend: (size: string) => void;
}

export function FitCalculator({ isOpen, onClose, onRecommend }: FitCalculatorProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    height: 170, // cm
    weight: 70,  // kg
    fit: "regular" as "slim" | "regular" | "relaxed"
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const calculateSize = () => {
    const { height, weight, fit } = data;
    let base = "M";

    if (height > 185 || weight > 85) base = "XL";
    else if (height > 175 || weight > 75) base = "L";
    else if (height < 165 || weight < 60) base = "S";

    // Adjust for fit preference
    const sizes = ["S", "M", "L", "XL"];
    let idx = sizes.indexOf(base);
    if (fit === "slim" && idx > 0) idx--;
    if (fit === "relaxed" && idx < 3) idx++;

    return sizes[idx];
  };

  const handleFinish = async () => {
    const recommended = calculateSize();
    onRecommend(recommended);
    
    // Store in profile
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          measurements: data,
          recommendedSize: recommended,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Failed to save measurements:", err);
      }
    }
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg bg-dark-slate border border-white/10 p-12 overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-white"
            >
              <Close />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <Straighten className="text-wattle" />
              <h2 className="font-structural text-2xl uppercase tracking-tighter">Find Your Fit</h2>
            </div>

            <div className="min-h-[300px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-8"
                  >
                    <p className="font-editorial text-gray-400">Tell us about your build. We&apos;ll find your fit.</p>
                    <div className="space-y-6">
                      <div className="flex flex-col gap-2">
                        <label className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Height ({data.height}cm)</label>
                        <input 
                          type="range" 
                          min="150" max="210" 
                          value={data.height} 
                          onChange={e => setData({...data, height: parseInt(e.target.value)})}
                          className="w-full accent-wattle bg-white/5 h-1"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Weight ({data.weight}kg)</label>
                        <input 
                          type="range" 
                          min="45" max="130" 
                          value={data.weight} 
                          onChange={e => setData({...data, weight: parseInt(e.target.value)})}
                          className="w-full accent-wattle bg-white/5 h-1"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-8"
                  >
                    <p className="font-editorial text-gray-400">What silhouette do you prefer for your effort?</p>
                    <div className="grid gap-3">
                      {(["slim", "regular", "relaxed"] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setData({...data, fit: f})}
                          className={`w-full p-6 text-left border transition-all ${
                            data.fit === f ? "border-wattle bg-wattle/5 text-white" : "border-white/10 text-gray-500 hover:border-white/30"
                          }`}
                        >
                          <span className="font-structural text-sm uppercase tracking-widest block">{f} Fit</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
                {step > 1 ? (
                  <button onClick={prevStep} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                    <ChevronLeft fontSize="small" /> Back
                  </button>
                ) : <div />}
                
                {step < 2 ? (
                  <Button variant="primary" onClick={nextStep} className="px-8">
                    Next <ChevronRight fontSize="small" className="ml-2" />
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleFinish} className="px-8">
                    Calculate Fit
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
