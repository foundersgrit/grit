"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { CardGiftcard, Mail, CalendarMonth, ConfirmationNumber, InfoOutlined } from "@mui/icons-material";
import { useToast } from "@/components/providers/ToastProvider";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

export default function GiftCardsPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    amount: 1000,
    recipientName: "",
    recipientEmail: "",
    personalMessage: "",
    deliveryDate: new Date().toISOString().split("T")[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Logic for gift card purchase would go here (Persistence to 'giftCards' collection)
    // For now, simulating success.
    setTimeout(() => {
      showToast("Gift card added to cart. Secure your kit to send.");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-20 items-start">
        
        {/* Left Column: Form */}
        <div className="space-y-12">
          <header>
            <span className="font-structural text-xs uppercase tracking-[0.5em] text-wattle mb-4 block">Deployment Option</span>
            <h1 className="font-structural text-5xl md:text-7xl uppercase tracking-tighter text-white mb-6">Give Endurance</h1>
            <p className="font-editorial text-lg text-gray-400 max-w-xl">
              The best gear is the gear someone earns. Give them the choice. A GRIT digital gift card is a tactical credit for those who stay.
            </p>
          </header>

          <form onSubmit={handlePurchase} className="space-y-8 bg-dark-slate p-8 border border-white/5 relative">
            {/* Amount Selection */}
            <div>
              <label className="font-structural text-[10px] uppercase tracking-widest text-gray-500 mb-4 block">Select Operational Credit (৳)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PRESET_AMOUNTS.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setFormData({...formData, amount: amt})}
                    className={`py-4 border font-structural text-xl transition-all ${
                      formData.amount === amt 
                        ? "bg-wattle text-bottle-green border-wattle shadow-[0_0_15px_rgba(204,218,71,0.2)]" 
                        : "border-white/10 text-gray-400 hover:border-white/30"
                    }`}
                  >
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="flex flex-col gap-2">
              <label className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Custom Amount (Min 500)</label>
              <input 
                type="number"
                min="500"
                max="25000"
                className="bg-black/20 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle font-mono text-xl"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Recipient Name</label>
                <input 
                  required
                  className="bg-black/20 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Recipient Email</label>
                <input 
                  required
                  type="email"
                  className="bg-black/20 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({...formData, recipientEmail: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Personal Mission Note (Optional)</label>
              <textarea 
                maxLength={200}
                rows={3}
                className="bg-black/20 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle font-editorial resize-none"
                placeholder="Stay the course."
                value={formData.personalMessage}
                onChange={(e) => setFormData({...formData, personalMessage: e.target.value})}
              />
              <div className="text-right">
                <span className="text-[10px] font-mono text-gray-600">{formData.personalMessage.length}/200</span>
              </div>
            </div>

            <Button variant="accent" size="lg" className="w-full py-8 text-xl uppercase tracking-widest flex gap-3" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : <>Send Endurance <CardGiftcard /></>}
            </Button>
          </form>
        </div>

        {/* Right Column: Preview */}
        <div className="sticky top-32 space-y-8">
          <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Asset Preview</span>
          
          <motion.div 
            layout
            className="w-full aspect-[16/10] bg-dark-slate border border-white/10 p-10 relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-wattle/10 rounded-full blur-[80px]" />
            
            <div className="relative h-full flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <div className="font-structural text-4xl text-white tracking-tighter opacity-90">GRIT.</div>
                <div className="text-right">
                  <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500 block">Status</span>
                  <span className="font-structural text-xs text-wattle uppercase tracking-widest">Digital Asset</span>
                </div>
              </div>

              <div>
                <span className="font-structural text-sm uppercase tracking-[0.3em] text-gray-500 block mb-2">Endurance Credit</span>
                <div className="font-structural text-8xl text-white leading-none tracking-tighter">
                  ৳{formData.amount}
                </div>
              </div>

              <div className="flex justify-between items-end pt-8 border-t border-white/5">
                <div>
                  <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500 block">Recipient</span>
                  <span className="font-structural text-sm text-white uppercase tracking-widest">{formData.recipientName || "Operative Name"}</span>
                </div>
                <div className="text-right">
                   <ConfirmationNumber className="text-wattle/50" sx={{ fontSize: 40 }} />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="bg-bottle-green/10 border border-white/5 p-6 space-y-4">
             <div className="flex items-start gap-4">
                <InfoOutlined className="text-wattle mt-1" sx={{ fontSize: 18 }} />
                <div className="space-y-2">
                   <h4 className="font-structural text-sm uppercase text-white tracking-widest">Tactical Protocol</h4>
                   <p className="font-editorial text-xs text-gray-400 leading-relaxed">
                     Gift cards are valid for 12 months from issuance. They can be redeemed for any gear in the arena. Credits are non-transferable once linked to an operative account.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
