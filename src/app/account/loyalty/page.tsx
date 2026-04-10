"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUserContext } from "@/components/providers/UserProvider";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Bolt, MilitaryTech, EmojiEvents, History, Checklist, Flare, ChevronRight, InfoOutlined } from "@mui/icons-material";
import { useToast } from "@/components/providers/ToastProvider";
import { claimDailyXP } from "@/app/actions/loyalty";

export default function LoyaltyPage() {
  const { user } = useAuth();
  const { loyalty, isLoading } = useUserContext();
  const { showToast } = useToast();
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaimDaily = async () => {
    setIsClaiming(true);
    try {
      const result = await claimDailyXP();
      showToast(`Daily XP secured. +${result.xpAwarded} XP | Streak: ${result.streak} Days`);
    } catch (err: any) {
      showToast(err.message || "Claim attempt failed.");
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-wattle/30 border-t-wattle rounded-full animate-spin" />
      </div>
    );
  }

  const currentLoyalty = loyalty || {
    totalXP: 0,
    currentTier: "Foundation",
    streakDays: 0,
    achievements: [],
    challenges: []
  };

  const nextTierXP = currentLoyalty.currentTier === "Foundation" ? 1000 : currentLoyalty.currentTier === "Endurance" ? 2500 : 5000;
  const progress = Math.min(100, (currentLoyalty.totalXP / nextTierXP) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-20">
      
      {/* Header & Daily XP */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <h1 className="font-structural text-5xl md:text-7xl uppercase tracking-tighter text-white leading-none">The Progression</h1>
          <p className="font-editorial text-lg text-gray-500 max-w-xl">
             Your mission success translates to technical progression. Every deployment, every streak, and every challenge completed elevates your status in the arena.
          </p>
        </div>
        
        <div className="bg-bottle-green/20 border border-wattle/30 p-8 flex flex-col items-center justify-center text-center gap-6 group relative overflow-hidden">
           <div className="absolute inset-0 bg-wattle/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="relative z-10">
              <span className="font-structural text-[10px] uppercase tracking-widest text-wattle block mb-2">Daily Engagement Reward</span>
              <div className="font-structural text-4xl text-white mb-6">Secured XP Check-in</div>
              <Button 
                variant="accent" 
                className="px-12 py-6 uppercase tracking-widest text-sm"
                onClick={handleClaimDaily}
                disabled={isClaiming}
              >
                {isClaiming ? "Verifying..." : "Claim Daily 50 XP"}
              </Button>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Tier Card */}
        <div className="md:col-span-2 bg-dark-slate border border-white/5 p-12 relative overflow-hidden">
           <div className="absolute -top-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
              <MilitaryTech sx={{ fontSize: 300 }} />
           </div>
           
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-12">
                 <div className="w-16 h-16 bg-wattle flex items-center justify-center rounded-none shadow-[0_0_30px_rgba(204,218,71,0.2)]">
                    <MilitaryTech className="text-bottle-green" sx={{ fontSize: 32 }} />
                 </div>
                 <div>
                    <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500 block">Current Status</span>
                    <h2 className="font-structural text-4xl text-white uppercase">{currentLoyalty.currentTier}</h2>
                 </div>
              </div>

              <div className="mt-auto space-y-6">
                 <div className="flex justify-between items-end font-structural text-[10px] uppercase tracking-widest">
                    <span className="text-gray-500">Progression to {currentLoyalty.currentTier === "Foundation" ? "Endurance" : "Arena"}</span>
                    <span className="text-white">{currentLoyalty.totalXP} / {nextTierXP} XP</span>
                 </div>
                 <div className="h-2 bg-white/5 relative">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${progress}%` }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                       className="absolute top-0 left-0 h-full bg-wattle shadow-[0_0_15px_rgba(204,218,71,0.5)]"
                    />
                 </div>
                 <p className="font-editorial text-xs text-gray-400">
                    {currentLoyalty.currentTier === "Iron Will" 
                       ? "Max progression achieved. You are a legendary operative of the arena."
                       : `Unlock ${currentLoyalty.currentTier === "Foundation" ? "Endurance" : "Arena"} status at ${nextTierXP} XP to access exclusive logistics and rewards.`
                    }
                 </p>
              </div>
           </div>
        </div>

        {/* Streak & XP Card */}
        <div className="space-y-8">
           <div className="bg-dark-slate border border-white/5 p-8 flex flex-col justify-between h-1/2 group">
              <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Training Streak</span>
              <div className="mt-4 flex items-baseline gap-4">
                 <span className="font-structural text-7xl text-white leading-none group-hover:text-wattle transition-colors">{currentLoyalty.streakDays}</span>
                 <span className="font-structural text-sm text-wattle uppercase tracking-widest">Days</span>
              </div>
              <p className="font-editorial text-[10px] text-gray-600 uppercase mt-4">7-day milestone awards 500 XP bonus.</p>
           </div>
           
           <div className="bg-dark-slate border border-white/5 p-8 flex flex-col justify-between h-1/2 group">
              <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Total Lifetime XP</span>
              <div className="mt-4 flex items-baseline gap-4">
                 <span className="font-structural text-7xl text-white leading-none">{currentLoyalty.totalXP}</span>
                 <span className="font-structural text-sm text-gray-500 uppercase tracking-widest">Points</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                 <Bolt className="text-wattle" sx={{ fontSize: 16 }} />
                 <span className="font-structural text-[10px] text-wattle uppercase tracking-widest">Priority Status Active</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Achievements Section */}
        <div className="space-y-10">
           <h3 className="font-structural text-2xl uppercase tracking-widest text-white border-b border-white/5 pb-4 flex items-center gap-4">
              <EmojiEvents sx={{ fontSize: 24 }} /> Achievement Vault
           </h3>
           <div className="grid gap-6">
              {currentLoyalty.achievements.length === 0 ? (
                 <div className="py-20 border border-dashed border-white/10 text-center opacity-30">
                    <p className="font-editorial italic">Earn your first achievement to unlock the vault.</p>
                 </div>
              ) : (
                 currentLoyalty.achievements.map(ach => (
                    <div key={ach.id} className="bg-white/5 border border-white/5 p-6 flex items-center gap-6">
                       <div className="w-12 h-12 bg-wattle/10 flex items-center justify-center text-wattle">
                          <Flare />
                       </div>
                       <div>
                          <h4 className="font-structural text-sm uppercase tracking-widest text-white">{ach.name}</h4>
                          <p className="font-editorial text-xs text-gray-500">{ach.description}</p>
                       </div>
                       <div className="ml-auto flex flex-col items-end">
                          <span className="font-structural text-[10px] text-wattle">+{ach.xpAwarded} XP</span>
                          <span className="font-editorial text-[8px] text-gray-700 uppercase mt-1">{new Date(ach.earnedAt).toLocaleDateString()}</span>
                       </div>
                    </div>
                 ))
              )}
           </div>
        </div>

        {/* Challenges/Recent Activity */}
        <div className="space-y-10">
           <h3 className="font-structural text-2xl uppercase tracking-widest text-white border-b border-white/5 pb-4 flex items-center gap-4">
              <Checklist sx={{ fontSize: 24 }} /> Active Missions
           </h3>
           <div className="space-y-4">
              <div className="p-8 border border-white/10 bg-black/20 flex flex-col gap-6">
                 <div className="flex justify-between items-start">
                    <div>
                       <h4 className="font-structural text-lg uppercase text-white">First Blood</h4>
                       <p className="font-editorial text-xs text-gray-400">Secure your first kit in the arena.</p>
                    </div>
                    <span className="font-structural text-[10px] text-wattle px-2 py-0.5 border border-wattle/30">Active</span>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-structural text-gray-500">
                       <span>Progress</span>
                       <span>0 / 1</span>
                    </div>
                    <div className="h-1 bg-white/5 w-full">
                       <div className="h-full bg-gray-700 w-0" />
                    </div>
                 </div>
                 <div className="flex justify-between items-center bg-white/5 p-4">
                    <span className="font-structural text-[10px] uppercase text-gray-400">Reward</span>
                    <span className="font-structural text-xs text-wattle">1000 XP + Achievement</span>
                 </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-dark-slate border border-white/5 opacity-50 grayscale">
                 <div className="w-10 h-10 bg-white/5 flex items-center justify-center text-gray-600">
                    <History />
                 </div>
                 <div>
                    <h4 className="font-structural text-xs uppercase text-gray-300">The 7-Day Push</h4>
                    <p className="font-editorial text-[10px] text-gray-500 mt-1">Unlock on 7-day streak.</p>
                 </div>
                 <ChevronRight className="ml-auto text-gray-700" />
              </div>
           </div>
        </div>
      </div>

      <div className="mt-20 p-12 bg-wattle/5 border border-wattle/10 text-center space-y-8">
         <InfoOutlined className="text-wattle" sx={{ fontSize: 40 }} />
         <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-structural text-3xl uppercase tracking-tighter text-white">High Intensity Gear</h2>
            <p className="font-editorial text-gray-400 leading-relaxed">
               As you progress through tiers, you unlock access to high-intensity technical gear, early access to limited kit deployments, and dedicated support lines. Stay the course.
            </p>
         </div>
         <Button variant="outline" className="px-12 py-6 border-white/10 uppercase tracking-widest text-xs">
            Review Technical Tiers
         </Button>
      </div>
    </div>
  );
}
