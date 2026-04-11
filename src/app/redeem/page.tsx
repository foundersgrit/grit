"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationNumber, Bolt, ErrorOutline, CheckCircleOutline } from "@mui/icons-material";
import { useToast } from "@/components/providers/ToastProvider";

interface RedeemCardData {
  amount: number;
  balance: number;
  status: string;
}

function RedeemContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [cardData, setCardData] = useState<RedeemCardData | null>(null);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/account/login?redirect=/redeem?code=${code}`);
      return;
    }

    setIsVerifying(true);
    setStatus("idle");

    // Simulation of gift card verification and redemption
    setTimeout(() => {
      if (code.startsWith("GRIT-")) {
        setStatus("success");
        setCardData({
          amount: 2000,
          balance: 2000,
          status: "active"
        });
        showToast("Endurance credit secured. Your account balance has been updated.");
      } else {
        setStatus("error");
        showToast("Invalid recruitment code. Verification failed.");
      }
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8 bg-dark-slate relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-wattle rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-bottle-green/10 border border-white/5 p-10 relative z-10"
      >
        <header className="text-center mb-10">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ConfirmationNumber className="text-wattle" sx={{ fontSize: 32 }} />
          </div>
          <h1 className="font-structural text-3xl uppercase tracking-tighter text-white mb-2">Redeem Endurance</h1>
          <p className="font-editorial text-sm text-gray-500 uppercase tracking-widest">Digital Asset Verification</p>
        </header>

        <form onSubmit={handleRedeem} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Asset Code</label>
            <input 
              required
              placeholder="GRIT-XXXX-XXXX-XXXX"
              className={`bg-black/40 border px-6 py-4 text-white focus:outline-none font-mono tracking-widest text-center text-lg uppercase transition-all ${
                status === "error" ? "border-red-500/50" : status === "success" ? "border-green-500/50" : "border-white/10 focus:border-wattle"
              }`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            
            <AnimatePresence mode="wait">
              {status === "error" && (
                <motion.span 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-[10px] text-red-400 font-editorial uppercase flex items-center gap-1 justify-center mt-2"
                >
                  <ErrorOutline sx={{ fontSize: 12 }} /> Verification Failed. Invalid Code.
                </motion.span>
              )}
              {status === "success" && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-green-500/5 border border-green-500/20 p-4 mt-4 text-center"
                >
                  <CheckCircleOutline className="text-green-500 mb-2" sx={{ fontSize: 24 }} />
                  <span className="block font-structural text-xs text-white uppercase tracking-widest">৳{cardData?.amount} Secured</span>
                  <p className="font-editorial text-[10px] text-green-500/80 uppercase mt-1">Added to your Operative Account</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!cardData && (
            <Button 
              variant="accent" 
              size="lg" 
              className="w-full py-8 text-lg uppercase tracking-widest"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-bottle-green/30 border-t-bottle-green rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                "Identify Asset"
              )}
            </Button>
          )}

          {cardData && (
            <div className="flex flex-col gap-4">
               <Button 
                variant="primary" 
                size="lg" 
                className="w-full py-8 text-lg uppercase tracking-widest"
                onClick={() => router.push("/shop")}
              >
                Assemble Your Kit
              </Button>
               <Button 
                variant="outline" 
                className="w-full border-white/10 text-xs text-gray-400"
                onClick={() => setCardData(null)}
              >
                Redeem Another Card
              </Button>
            </div>
          )}
        </form>

        <footer className="mt-12 pt-8 border-t border-white/5">
           <div className="flex items-center gap-3 opacity-40">
              <Bolt sx={{ fontSize: 16 }} className="text-wattle" />
              <span className="font-structural text-[10px] uppercase tracking-[0.3em] text-white">Technical Verification Protocol 2.1</span>
           </div>
        </footer>
      </motion.div>
    </div>
  );
}

export default function RedeemPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-slate flex items-center justify-center font-structural text-wattle uppercase tracking-widest">Identifying Credits...</div>}>
      <RedeemContent />
    </Suspense>
  );
}
