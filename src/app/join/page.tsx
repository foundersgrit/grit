"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import { motion } from "framer-motion";
import { MaskReveal } from "@/components/ui/MaskReveal";

function JoinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const referralCode = searchParams.get("ref");

  useEffect(() => {
    if (referralCode) {
      // Store in localStorage for 30 days logic (simplified for implementation)
      localStorage.setItem("grit_referral_code", referralCode);
      // Ensure it persists via cookies for cross-session reliability if needed
      document.cookie = `grit_referral_code=${referralCode}; path=/; max-age=${60 * 60 * 24 * 30}`;
    }
  }, [referralCode]);

  const handleAction = () => {
    if (user) {
      router.push("/account/referrals");
    } else {
      router.push("/account/login?mode=signup");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-dark-slate relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-wattle rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bottle-green rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center relative z-10"
      >
        <span className="font-structural text-xs uppercase tracking-[0.5em] text-wattle mb-8 block">Infiltration Protocol</span>
        
        <MaskReveal>
           <h1 className="font-structural text-5xl md:text-8xl uppercase tracking-tighter text-white mb-8 leading-[0.9]">
             {user ? "You're Already In." : "Join The Crew."}
           </h1>
        </MaskReveal>

        <p className="font-editorial text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          {user 
            ? "You have already secured your place in the arena. Access your dashboard to grow your own crew."
            : "You've been invited to join the GRIT arena. This isn't just gear—it's a commitment to endurance. Secure your kit and earn ৳200 off your first deployment."
          }
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <Button 
            variant="accent" 
            size="lg" 
            className="px-16 py-8 text-xl uppercase tracking-widest"
            onClick={handleAction}
          >
            {user ? "Go To Dashboard" : "Create Account"}
          </Button>
          {!user && (
            <Button 
              variant="outline" 
              size="lg" 
              className="px-12 py-8 text-xl h-full border-white/10 hover:border-wattle hover:text-wattle transition-all"
              onClick={() => router.push("/shop")}
            >
              Browse Gear
            </Button>
          )}
        </div>

        {referralCode && !user && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 pt-12 border-t border-white/5"
          >
            <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Technical Referral Marker</span>
            <code className="text-wattle font-mono text-sm tracking-widest bg-wattle/5 px-4 py-2 border border-wattle/10">
              CODE: {referralCode}
            </code>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-slate flex items-center justify-center font-structural text-wattle uppercase tracking-widest">Initialising Protocol...</div>}>
      <JoinContent />
    </Suspense>
  );
}
