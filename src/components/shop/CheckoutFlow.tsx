"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/components/providers/CartContext";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/providers/ToastProvider";
import { Bolt, CheckCircle, CheckCircleOutline } from "@mui/icons-material";
import { useUserContext } from "@/components/providers/UserProvider";
import { ReferralReward } from "@/types";

type Step = 1 | 2 | 3;

export function CheckoutFlow() {
  const { cart, subtotal, estimatedShipping, bundleDiscount, total: initialTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { referral } = useUserContext();
  
  const [step, setStep] = useState<Step>(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [appliedRewards, setAppliedRewards] = useState<string[]>([]);
  const [appliedGiftCard, setAppliedGiftCard] = useState<{code: string, balance: number} | null>(null);
  const [giftCardInput, setGiftCardInput] = useState("");
  const [isVerifyingGC, setIsVerifyingGC] = useState(false);
  
  // Form States
  const [shippingInfo, setShippingInfo] = useState({
    email: user?.email || "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    method: "standard"
  });

  useEffect(() => {
    if (user?.email && user.email !== shippingInfo.email) {
      setShippingInfo(prev => ({ ...prev, email: user.email || "" }));
    }
  }, [user?.email]);

  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "cod" | "card">("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate Adjusted Total
  const availableRewards = referral?.referralRewards.filter((r: ReferralReward) => !r.used) || [];
  const rewardDiscount = appliedRewards.length * 200;
  const initialBurden = initialTotal - rewardDiscount;
  
  const gcDiscount = appliedGiftCard ? Math.min(initialBurden, appliedGiftCard.balance) : 0;
  const finalTotal = Math.max(0, initialBurden - gcDiscount);

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!shippingInfo.email) newErrors.email = "Email is required.";
      if (!shippingInfo.phone) newErrors.phone = "Phone is required.";
      if (!shippingInfo.firstName) newErrors.firstName = "First name is required.";
      if (!shippingInfo.lastName) newErrors.lastName = "Last name is required.";
      if (!shippingInfo.address) newErrors.address = "Address is required.";
      if (!shippingInfo.city) newErrors.city = "City is required.";
    }
    
    if (step === 2) {
      if ((paymentMethod === "bkash" || paymentMethod === "nagad") && !transactionId) {
        newErrors.transactionId = "Transaction ID is required for verification.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) {
       return;
    }
    
    if (step < 3) setStep((s) => (s + 1) as Step);
    else handleConfirm();
  };

  const handleBack = () => {
    setErrors({});
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      // Create the order payload
      const orderData = {
        profile_id: user?.id || "guest",
        items: cart,
        shippingInfo,
        paymentInfo: {
          method: paymentMethod,
          transactionId: transactionId || null,
          status: paymentMethod === 'cod' ? 'pending' : 'awaiting_verification'
        },
        financials: {
          subtotal,
          shipping: estimatedShipping,
          rewardDiscount,
          bundleDiscount,
          giftCardDiscount: gcDiscount,
          total: finalTotal
        },
        appliedRewards,
        appliedGiftCard: appliedGiftCard?.code || null,
        status: 'received',
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error("Persistence failure.");

      setIsConfirmed(true);
      clearCart();
      showToast("Order secured.");
    } catch (err: unknown) {
      console.error("Checkout Failure:", err);
      showToast("Persistence failure. Our team has been notified.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isConfirmed) {
    return (
      <div className="flex flex-col gap-12 max-w-4xl mx-auto py-12">
        <div className="text-center py-24 bg-bottle-green/20 border border-white/10 p-12 relative overflow-hidden">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-wattle rounded-full flex items-center justify-center mx-auto mb-12 shadow-[0_0_50px_rgba(204,218,71,0.2)]"
          >
             <Bolt sx={{ fontSize: 48 }} className="text-bottle-green" />
          </motion.div>
          <h2 className="font-structural text-4xl md:text-7xl uppercase tracking-tighter mb-6 text-white leading-none">Order Secured.</h2>
          <p className="font-editorial text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Your gear is in the queue. We&apos;ve received your data and confirmed your deployment. The technical work begins now.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-16">
            <Link href="/shop">
              <Button variant="primary" className="px-12 py-6">Deploy More Gear</Button>
            </Link>
            <Link href="/account/orders">
              <Button variant="outline" className="px-12 py-6">Track Progress</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 py-12 border-t border-white/5">
            <div className="text-center">
              <span className="font-structural text-[10px] uppercase tracking-widest text-wattle block mb-2">Phase 01</span>
              <span className="font-structural text-xs text-white uppercase">Verification</span>
            </div>
            <div className="text-center opacity-40">
              <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Phase 02</span>
              <span className="font-structural text-xs text-white uppercase">Construction</span>
            </div>
            <div className="text-center opacity-40">
              <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Phase 03</span>
              <span className="font-structural text-xs text-white uppercase">Deployment</span>
            </div>
          </div>
        </div>

        {/* E4: What Happens Next & Trust */}
        <div className="grid md:grid-cols-2 gap-12">
           <div className="space-y-6">
              <h3 className="font-structural text-xl uppercase tracking-widest text-white">The Deployment Protocol</h3>
              <div className="space-y-4 font-editorial text-gray-400 text-sm">
                 <p>1. <span className="text-white">Verification:</span> Our team verifies your transaction ID. This usually takes 1-4 hours during business ops.</p>
                 <p>2. <span className="text-white">Construction:</span> Gear is pulled from the vault and inspected for structural integrity.</p>
                 <p>3. <span className="text-white">Transit:</span> Once cleared, you will receive a tracking code via SMS and Email.</p>
              </div>
           </div>
           
           <div className="bg-dark-slate p-8 border border-white/5">
              <h3 className="font-structural text-xs uppercase tracking-[0.3em] text-gray-500 mb-8 border-b border-white/5 pb-4">Secured By GRIT</h3>
              <div className="flex flex-col gap-6">
                 <div className="flex items-center gap-4">
                    <div className="text-wattle"><Bolt sx={{ fontSize: 20 }} /></div>
                    <span className="font-structural text-[10px] uppercase tracking-widest text-white">Priority Dispatch</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="text-wattle"><Bolt sx={{ fontSize: 20 }} /></div>
                    <span className="font-structural text-[10px] uppercase tracking-widest text-white">Full Transit Insurance</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="text-wattle"><Bolt sx={{ fontSize: 20 }} /></div>
                    <span className="font-structural text-[10px] uppercase tracking-widest text-white">Lifetime Technical Support</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-16 items-start">
      <div className="lg:col-span-2">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between md:justify-start gap-4 md:gap-12 mb-16 border-b border-white/5 pb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 flex items-center justify-center font-structural text-sm rounded-none border transition-all duration-300 ${
                  step >= s ? "bg-wattle text-bottle-green border-wattle shadow-[0_0_15px_rgba(204,218,71,0.3)]" : "border-white/10 text-gray-500"
                }`}>
                  {s}
                </div>
                <div className="flex flex-col">
                  <span className={`font-structural text-[10px] uppercase tracking-[0.2em] leading-none mb-1 ${
                    step >= s ? "text-wattle" : "text-gray-600"
                  }`}>
                    Step 0{s}
                  </span>
                  <span className={`font-structural text-sm uppercase tracking-widest whitespace-nowrap ${
                    step >= s ? "text-white" : "text-gray-500"
                  }`}>
                    {s === 1 ? "Shipping" : s === 2 ? "Payment" : "Review"}
                  </span>
                </div>
              </div>
              {s < 3 && <div className={`hidden md:block h-[1px] w-16 transition-colors duration-500 ${step > s ? "bg-wattle" : "bg-white/5"}`} />}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col gap-10"
            >
              <div className="flex flex-col gap-8">
                <h2 className="font-structural text-2xl uppercase tracking-widest border-b border-white/10 pb-4">Contact Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Email Address <span className="text-wattle">*</span></label>
                    <input 
                      type="email"
                      className={`bg-dark-slate border px-4 py-3 text-white focus:outline-none transition-all ${errors.email ? "border-red-500/50 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-wattle"}`} 
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    />
                    {errors.email && <span className="text-[10px] text-red-400 font-editorial uppercase tracking-wider">{errors.email}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Phone Number <span className="text-wattle">*</span></label>
                    <input 
                      type="tel"
                      className={`bg-dark-slate border px-4 py-3 text-white focus:outline-none transition-all ${errors.phone ? "border-red-500/50 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-wattle"}`} 
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    />
                    {errors.phone && <span className="text-[10px] text-red-400 font-editorial uppercase tracking-wider">{errors.phone}</span>}
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 bg-wattle/5 border-l-2 border-wattle px-6">
                  <span className="font-editorial text-sm text-gray-300">Fast Delivery Available</span>
                  <div className="text-right">
                    <span className="block font-structural text-[10px] uppercase tracking-widest text-wattle">Est. Arrival</span>
                    <span className="font-editorial text-xs text-white tracking-wide">Dhaka: 24h | Outside: 72h</span>
                  </div>
                </div>

                <h2 className="font-structural text-2xl uppercase tracking-widest border-b border-white/10 pb-4 mt-4">Shipping Destination</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="flex flex-col gap-2">
                      <label className="font-structural text-xs uppercase tracking-widest text-gray-500">First Name <span className="text-wattle">*</span></label>
                      <input 
                        className={`bg-dark-slate border px-4 py-3 text-white focus:outline-none transition-all ${errors.firstName ? "border-red-500/50 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-wattle"}`} 
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      />
                      {errors.firstName && <span className="text-[10px] text-red-400 font-editorial uppercase tracking-wider">{errors.firstName}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Last Name <span className="text-wattle">*</span></label>
                       <input 
                        className={`bg-dark-slate border px-4 py-3 text-white focus:outline-none transition-all ${errors.lastName ? "border-red-500/50 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-wattle"}`} 
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      />
                      {errors.lastName && <span className="text-[10px] text-red-400 font-editorial uppercase tracking-wider">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Address line 1 <span className="text-wattle">*</span></label>
                    <input 
                      className={`bg-dark-slate border px-4 py-3 text-white focus:outline-none transition-all ${errors.address ? "border-red-500/50 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-wattle"}`} 
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    />
                    {errors.address && <span className="text-[10px] text-red-400 font-editorial uppercase tracking-wider">{errors.address}</span>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-structural text-xs uppercase tracking-widest text-gray-500">City <span className="text-wattle">*</span></label>
                      <input 
                        className={`bg-dark-slate border px-4 py-3 text-white focus:outline-none transition-all ${errors.city ? "border-red-500/50 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-wattle"}`} 
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      />
                      {errors.city && <span className="text-[10px] text-red-400 font-editorial uppercase tracking-wider">{errors.city}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Postcode / Zip</label>
                       <input 
                        className="bg-dark-slate border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle transition-all" 
                        value={shippingInfo.zip}
                        onChange={(e) => setShippingInfo({...shippingInfo, zip: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                     <h3 className="font-structural text-xs uppercase tracking-widest text-gray-500 mb-6">Delivery Method</h3>
                     <div className="grid gap-4">
                        <label className={`flex justify-between items-center p-6 border cursor-pointer transition-colors ${shippingInfo.method === "standard" ? "border-wattle bg-wattle/5 outline outline-1 outline-wattle/30" : "border-white/10 hover:border-white/30"}`}>
                           <input type="radio" className="sr-only" name="method" checked={shippingInfo.method === "standard"} onChange={() => setShippingInfo({...shippingInfo, method: "standard"})} />
                           <div>
                              <span className="font-structural text-sm uppercase block mb-1">Standard Shipping</span>
                              <span className="font-editorial text-xs text-gray-400">3-5 Business Days</span>
                           </div>
                           <span className="font-structural font-bold">${estimatedShipping.toFixed(2)}</span>
                        </label>
                     </div>
                  </div>

                  <Button variant="accent" onClick={handleNext} className="mt-8 py-6 uppercase text-lg">Continue to Payment</Button>
                </div>
              </motion.div>
            )}


          {/* Step 2: Payment */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col gap-10"
            >
              <button onClick={handleBack} className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors w-fit">← Back to Shipping</button>
              
              <div className="flex flex-col gap-8">
                <h2 className="font-structural text-2xl uppercase tracking-widest border-b border-white/10 pb-4">Payment Method</h2>
                
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                  {[
                    { id: "bkash", label: "bKash" },
                    { id: "nagad", label: "Nagad" },
                    { id: "cod", label: "Cash on Delivery" },
                    { id: "card", label: "International Card" }
                  ].map((method) => (
                    <button 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as "bkash" | "nagad" | "cod" | "card")}
                      className={`px-8 py-3 whitespace-nowrap border text-xs uppercase tracking-widest transition-all ${
                        paymentMethod === method.id ? "bg-white text-dark-slate border-white" : "border-white/10 text-gray-500 hover:border-white/30"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>

                <div className="bg-bottle-green/30 border border-white/10 p-8">
                  {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
                    <div className="flex flex-col gap-6">
                      <div className="p-4 bg-dark-slate border border-white/5 border-l-4 border-wattle">
                        <span className="text-gray-400 text-xs block mb-2 uppercase tracking-widest">Merchant Number (Send Money)</span>
                        <div className="flex justify-between items-center">
                          <span className="font-structural text-2xl text-wattle font-bold">+880 1700 000 000</span>
                          <span className="bg-wattle/10 text-wattle px-3 py-1 text-[10px] font-structural uppercase">Personal</span>
                        </div>
                      </div>
                      <div className="space-y-4 font-editorial text-sm text-gray-300">
                        <p>1. Open your {paymentMethod} app.</p>
                        <p>2. Select {`"Send Money"`} to our merchant number above.</p>
                        <p>3. Enter the Transaction ID from your confirmation message below.</p>
                      </div>

                      <div className="flex flex-col gap-2 pt-4">
                        <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Transaction ID <span className="text-wattle">*</span></label>
                        <input 
                           placeholder="8N72L09K"
                           className={`bg-dark-slate border px-4 py-3 text-white focus:outline-none font-mono transition-all ${errors.transactionId ? "border-red-500/50 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-wattle"}`} 
                           value={transactionId}
                           onChange={(e) => setTransactionId(e.target.value)}
                        />
                        {errors.transactionId && <span className="text-[10px] text-red-400 font-editorial uppercase tracking-wider">{errors.transactionId}</span>}
                      </div>
                    </div>
                  )}

                  {paymentMethod === "cod" && (
                    <p className="font-editorial text-gray-300 italic">
                      Pay when your gear arrives. Available for Dhaka Metro zones only. We&apos;ll call to confirm your location before dispatch.
                    </p>
                  )}

                  {paymentMethod === "card" && (
                    <div className="flex flex-col gap-6">
                      <p className="font-editorial text-xs text-gray-400">Secure payment via Stripe integration</p>
                      <div className="bg-dark-slate p-4 border border-white/10 flex flex-col gap-4 opacity-50 cursor-not-allowed">
                        <div className="h-10 border border-white/5 flex items-center px-4 text-gray-600">CARD NUMBER</div>
                        <div className="flex gap-4">
                           <div className="flex-1 h-10 border border-white/5 flex items-center px-4 text-gray-600">MM/YY</div>
                           <div className="flex-1 h-10 border border-white/5 flex items-center px-4 text-gray-600">CVC</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-wattle uppercase tracking-widest">Card payments currently being reinforced. Please use Mobile Wallet.</span>
                    </div>
                  )}
                </div>

                {/* Referral Credits Selection */}
                {availableRewards.length > 0 && (
                   <div className="mt-8 pt-8 border-t border-white/5">
                      <h3 className="font-structural text-sm uppercase tracking-widest text-white mb-6">Apply Recruitment Credits</h3>
                      <div className="grid gap-4">
                         {availableRewards.map((reward: ReferralReward) => (
                            <button 
                               key={reward.id}
                               onClick={() => {
                                  if (appliedRewards.includes(reward.id)) {
                                     setAppliedRewards(prev => prev.filter(id => id !== reward.id));
                                  } else {
                                     setAppliedRewards(prev => [...prev, reward.id]);
                                  }
                               }}
                               className={`flex items-center justify-between p-4 border transition-all ${
                                  appliedRewards.includes(reward.id) 
                                     ? "border-wattle bg-wattle/5" 
                                     : "border-white/5 hover:border-white/20"
                               }`}
                            >
                               <div className="flex items-center gap-4 text-left">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${appliedRewards.includes(reward.id) ? "bg-wattle text-bottle-green" : "bg-white/5 text-gray-500"}`}>
                                     {appliedRewards.includes(reward.id) ? <CheckCircle sx={{ fontSize: 16 }} /> : <Bolt sx={{ fontSize: 16 }} />}
                                  </div>
                                  <div>
                                     <span className="font-structural text-xs uppercase text-white block">৳200 Credit</span>
                                     <span className="font-editorial text-[10px] text-gray-500 uppercase">Vault Ref: {reward.id.split('-')[1]}</span>
                                  </div>
                               </div>
                               <span className={`font-structural text-xs ${appliedRewards.includes(reward.id) ? "text-wattle" : "text-gray-500"}`}>
                                  {appliedRewards.includes(reward.id) ? "Applied" : "Apply"}
                               </span>
                            </button>
                         ))}
                      </div>
                   </div>
                )}

                {/* Gift Card Application */}
                <div className="mt-8 pt-8 border-t border-white/5">
                   <h3 className="font-structural text-sm uppercase tracking-widest text-white mb-6">Redeem Gift Card</h3>
                   {appliedGiftCard ? (
                      <div className="flex items-center justify-between p-4 bg-wattle/5 border border-wattle/50">
                         <div className="flex items-center gap-4">
                            <CheckCircleOutline className="text-wattle" sx={{ fontSize: 20 }} />
                            <div>
                               <span className="font-structural text-xs uppercase text-white block">{appliedGiftCard.code}</span>
                               <span className="font-editorial text-[10px] text-wattle uppercase">৳{gcDiscount.toFixed(2)} Applied</span>
                            </div>
                         </div>
                         <button onClick={() => setAppliedGiftCard(null)} className="text-[10px] uppercase font-structural text-gray-500 hover:text-white transition-colors">Remove</button>
                      </div>
                   ) : (
                      <div className="flex gap-4">
                         <input 
                            placeholder="GRIT-XXXX-XXXX-XXXX"
                            className="flex-1 bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle font-mono text-sm tracking-widest uppercase"
                            value={giftCardInput}
                            onChange={(e) => setGiftCardInput(e.target.value)}
                         />
                         <Button 
                            variant="outline" 
                            className="bg-white/5 border-white/5"
                            disabled={isVerifyingGC || !giftCardInput}
                            onClick={async () => {
                               setIsVerifyingGC(true);
                               // Simulated verification
                               setTimeout(() => {
                                  if (giftCardInput.startsWith("GRIT-")) {
                                     setAppliedGiftCard({ code: giftCardInput, balance: 2000 });
                                     showToast("Endurance credit applied.");
                                  } else {
                                     showToast("Invalid identification code.");
                                  }
                                  setIsVerifyingGC(false);
                                  setGiftCardInput("");
                               }, 1000);
                            }}
                         >
                            Apply
                         </Button>
                      </div>
                   )}
                </div>

                <Button variant="accent" onClick={handleNext} className="mt-8 py-6 uppercase text-lg">Review Order</Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col gap-10"
            >
               <button onClick={handleBack} className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors w-fit">← Back to Payment</button>
               
               <div className="flex flex-col gap-12">
                  <h2 className="font-structural text-2xl uppercase tracking-widest border-b border-white/10 pb-4">Review Your Work</h2>
                  
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-structural text-xs uppercase tracking-widest text-gray-500 mb-2">Shipping To</h4>
                        <p className="font-editorial text-white">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p className="font-editorial text-white">{shippingInfo.address}</p>
                        <p className="font-editorial text-white">{shippingInfo.city}, {shippingInfo.zip}</p>
                      </div>
                      <div>
                        <h4 className="font-structural text-xs uppercase tracking-widest text-gray-500 mb-2">Payment Via</h4>
                        <p className="font-editorial text-white uppercase">{paymentMethod}</p>
                        {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
                          <p className="font-mono text-xs text-wattle">TXN: {transactionId}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                        {cart.map(item => (
                          <div key={item.id} className="flex gap-4 text-xs font-editorial">
                            <span className="text-gray-500 font-bold">{item.quantity}x</span>
                            <span className="text-white uppercase tracking-wide">{item.name}</span>
                            <span className="ml-auto text-gray-400">৳{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center text-sm pt-4 border-t border-white/10">
                          <span className="text-gray-400 font-editorial uppercase">Subtotal</span>
                          <span className="text-white font-structural uppercase tracking-widest">৳{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400 font-editorial uppercase">Shipping</span>
                          <span className="text-white font-structural uppercase tracking-widest">৳{estimatedShipping.toFixed(2)}</span>
                        </div>
                        {rewardDiscount > 0 && (
                          <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-wattle font-editorial uppercase">Recruitment Credit</span>
                            <span className="text-wattle font-structural uppercase tracking-widest">-৳{rewardDiscount.toFixed(2)}</span>
                          </div>
                        )}
                        {gcDiscount > 0 && (
                          <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-wattle font-editorial uppercase">Gift Card Credit</span>
                            <span className="text-wattle font-structural uppercase tracking-widest">-৳{gcDiscount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                          <span className="text-white font-structural uppercase tracking-widest">Total</span>
                          <span className="text-white font-structural text-xl uppercase tracking-widest">৳{finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                  </div>

                  <div className="bg-black/20 p-12 border border-white/10 text-center">
                    <h3 className="font-structural text-3xl uppercase tracking-tighter mb-4 text-white">Final Confirmation</h3>
                    <p className="font-editorial text-gray-400 mb-8 max-w-sm mx-auto">
                      Review your order and prepare for delivery. Once confirmed, we start building and preparing your gear.
                    </p>
                    <Button variant="accent" size="lg" className="w-full py-6 text-xl tracking-tighter" onClick={handleNext} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-bottle-green/30 border-t-bottle-green rounded-full animate-spin" />
                          <span className="text-sm font-structural uppercase tracking-widest">Securing Order...</span>
                        </div>
                      ) : (
                        "Confirm Order"
                      )}
                    </Button>

                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Summary Sidebar for Checkout */}
      <aside className="sticky top-32 flex flex-col gap-8 bg-black/20 p-8 border border-white/10">
        <h2 className="font-structural text-xl uppercase tracking-tight text-white mb-4">Burden Assessment</h2>
        <div className="flex flex-col gap-3 font-editorial text-sm text-gray-400 border-b border-white/10 pb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-white">৳{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-white">{estimatedShipping === 0 ? "FREE" : `৳${estimatedShipping.toFixed(2)}`}</span>
          </div>
          {bundleDiscount > 0 && (
            <div className="flex justify-between text-wattle">
              <span>Kit Savings</span>
              <span>-৳{bundleDiscount.toFixed(2)}</span>
            </div>
          )}
          {rewardDiscount > 0 && (
            <div className="flex justify-between text-wattle">
              <span>Recruitment Credit</span>
              <span>-৳{rewardDiscount.toFixed(2)}</span>
            </div>
          )}
          {gcDiscount > 0 && (
            <div className="flex justify-between text-wattle">
              <span>Gift Card Credit</span>
              <span>-৳{gcDiscount.toFixed(2)}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between font-structural text-3xl uppercase tracking-tighter text-wattle">
          <span>Total</span>
          <span>৳{finalTotal.toFixed(2)}</span>
        </div>
      </aside>
    </div>
  );
}
