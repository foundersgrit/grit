"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/utils/supabase/client";
import { Close, ChevronRight, GppGood, FitnessCenter, DirectionsRun, SelfImprovement } from "@mui/icons-material";

export function WelcomeFlow() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    discipline: "",
    fitPreference: "",
  });
  const supabase = createClient();

  useEffect(() => {
    async function checkFirstTime() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", user.id)
        .single();
      
      if (data && !data.onboarding_complete) {
        setIsOpen(true);
      }
    }
    
    checkFirstTime();
  }, [user]);

  const handleFinish = async () => {
    if (user) {
      await supabase
        .from("profiles")
        .update({
          discipline: onboardingData.discipline,
          fit_preference: onboardingData.fitPreference,
          onboarding_complete: true,
          onboarded_at: new Date().toISOString()
        })
        .eq("id", user.id);
    }
    setIsOpen(false);
  };

  const disciplines = [
    { id: "power", label: "Powerlifting", icon: <FitnessCenter /> },
    { id: "cali", label: "Calisthenics", icon: <GppGood /> },
    { id: "run", label: "Running", icon: <DirectionsRun /> },
    { id: "combat", label: "Combat", icon: <SelfImprovement /> }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-bottle-green/95 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-2xl bg-dark-slate border border-white/10 p-12 overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center mb-12">
               <span className="font-structural text-[10px] uppercase tracking-[0.4em] text-wattle">Phase {step} / 3</span>
               <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <Close />
               </button>
            </div>

            <div className="min-h-[400px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-8"
                  >
                    <h2 className="font-structural text-4xl uppercase tracking-tighter text-white">Select Your Discipline</h2>
                    <p className="font-editorial text-lg text-gray-400">The arena defines the requirement. Where do you put in the work?</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {disciplines.map(d => (
                        <button
                          key={d.id}
                          onClick={() => setOnboardingData({...onboardingData, discipline: d.id})}
                          className={`flex flex-col items-center justify-center p-8 border transition-all gap-4 group ${
                            onboardingData.discipline === d.id ? "bg-wattle border-wattle text-bottle-green" : "bg-white/5 border-white/10 text-white hover:border-white/30"
                          }`}
                        >
                          <div className={onboardingData.discipline === d.id ? "" : "text-wattle group-hover:scale-110 transition-transform"}>
                            {d.icon}
                          </div>
                          <span className="font-structural text-[10px] uppercase tracking-widest">{d.label}</span>
                        </button>
                      ))}
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
                    <h2 className="font-structural text-4xl uppercase tracking-tighter text-white">Fit Preference</h2>
                    <p className="font-editorial text-lg text-gray-400">Structural integrity meets personal preference. How should it feel?</p>
                    
                    <div className="grid gap-3">
                      {["Skin-Tight (Zero drag)", "Regular (Standard fit)", "Oversized (Freedom of motion)"].map(f => (
                        <button
                          key={f}
                          onClick={() => setOnboardingData({...onboardingData, fitPreference: f})}
                          className={`w-full p-6 text-left border transition-all ${
                            onboardingData.fitPreference === f ? "bg-wattle border-wattle text-bottle-green" : "bg-white/5 border-white/10 text-white hover:border-white/30"
                          }`}
                        >
                          <span className="font-structural text-xs uppercase tracking-widest">{f}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-12 text-center py-8"
                  >
                    <div className="w-20 h-20 bg-wattle rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(204,218,71,0.3)]">
                       <GppGood sx={{ fontSize: 40 }} className="text-bottle-green" />
                    </div>
                    <h2 className="font-structural text-5xl uppercase tracking-tighter text-white">Ready For Deployment</h2>
                    <p className="font-editorial text-xl text-gray-400 max-w-sm mx-auto">Your profile is configured. The arena awaits.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} className="font-structural text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                    Back
                  </button>
                ) : <div />}
                
                {step < 3 ? (
                  <Button 
                    variant="primary" 
                    disabled={step === 1 ? !onboardingData.discipline : !onboardingData.fitPreference}
                    onClick={() => setStep(step + 1)} 
                    className="px-12 py-6"
                  >
                    Next Phase <ChevronRight fontSize="small" className="ml-2" />
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleFinish} className="px-16 py-6 font-black tracking-[0.2em]">
                    ENTER ARENA
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
