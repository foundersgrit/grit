"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationNumber, Bolt, History, InfoOutlined } from "@mui/icons-material";
import { useToast } from "@/components/providers/ToastProvider";

export default function GiftCardBalancePage() {
  const { showToast } = useToast();
  const [code, setCode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [cardDetails, setCardDetails] = useState<any>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setCardDetails(null);

    // Simulated balance check logic
    setTimeout(() => {
      if (code.startsWith("GRIT-")) {
        setCardDetails({
          code: code,
          balance: 1540,
          originalAmount: 2000,
          status: "active",
          expiresAt: "2027-04-10",
          transactions: [
             { orderId: "ORD-X92L1", amountUsed: 460, date: "2026-03-15" }
          ]
        });
        showToast("Asset balance verified.");
      } else {
        showToast("Invalid identification code.");
      }
      setIsChecking(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-20 min-h-[70vh]">
      <div className="flex flex-col md:flex-row gap-16 items-start">
        
        {/* Check Form */}
        <div className="flex-1 space-y-8">
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <ConfirmationNumber className="text-wattle" sx={{ fontSize: 20 }} />
              <span className="font-structural text-xs uppercase tracking-[0.5em] text-gray-500">Asset Audit</span>
            </div>
            <h1 className="font-structural text-6xl md:text-8xl uppercase tracking-tighter text-white mb-6 leading-none">The Balance</h1>
            <p className="font-editorial text-lg text-gray-400 max-w-xl leading-relaxed">
              Operational transparency is key. Verify the remaining endurance credit and history of any digital asset deployed in the arena.
            </p>
          </header>

          <form onSubmit={handleCheck} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Endurance Code</label>
              <input 
                required
                placeholder="GRIT-XXXX-XXXX-XXXX"
                className="bg-black/20 border border-white/10 px-6 py-4 text-white focus:outline-none focus:border-wattle font-mono tracking-widest text-lg uppercase transition-all"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <Button variant="accent" size="lg" className="w-full py-6 text-sm uppercase tracking-widest" disabled={isChecking}>
              {isChecking ? "Verifying..." : "Check Status"}
            </Button>
          </form>

          <div className="pt-8 border-t border-white/5 opacity-50 flex items-center gap-3">
             <Bolt sx={{ fontSize: 16 }} className="text-wattle" />
             <span className="font-structural text-[10px] uppercase tracking-widest text-white">Technical Verification Protocol Active</span>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="w-full md:w-96">
           <AnimatePresence mode="wait">
              {cardDetails ? (
                 <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-dark-slate border border-white/10 p-8 space-y-8 sticky top-32"
                 >
                    <div>
                       <span className="font-structural text-[10px] uppercase tracking-widest text-wattle block mb-2">Available Credit</span>
                       <div className="font-structural text-6xl text-white tracking-tighter">৳{cardDetails.balance}</div>
                       <span className="font-editorial text-[10px] text-gray-500 uppercase mt-2 block">Initial Amount: ৳{cardDetails.originalAmount}</span>
                    </div>

                    <div className="space-y-4">
                       <h4 className="font-structural text-xs uppercase tracking-widest text-white border-b border-white/5 pb-2 flex items-center gap-2">
                          <History sx={{ fontSize: 16 }} /> Mission History
                       </h4>
                       <div className="space-y-3">
                          {cardDetails.transactions.map((tx: any, idx: number) => (
                             <div key={idx} className="flex justify-between items-center text-[10px] uppercase font-mono">
                                <span className="text-gray-500">{tx.orderId}</span>
                                <span className="text-red-400">-৳{tx.amountUsed}</span>
                                <span className="text-gray-600">{tx.date}</span>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                       <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                          <span className="text-gray-500">Status</span>
                          <span className="text-white bg-wattle/10 px-2 py-1 border border-wattle/20">Operational</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] uppercase tracking-widest mt-4">
                          <span className="text-gray-500">Expires</span>
                          <span className="text-white">{cardDetails.expiresAt}</span>
                       </div>
                    </div>
                 </motion.div>
              ) : (
                 <div className="h-full border border-dashed border-white/5 p-12 flex flex-col items-center justify-center text-center opacity-20">
                    <ConfirmationNumber sx={{ fontSize: 48 }} className="mb-4" />
                    <p className="font-editorial text-xs uppercase tracking-widest">Awaiting Identification</p>
                 </div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
