"use client";

import React, { useState } from "react";
import { useCart } from "@/components/providers/CartContext";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Step = 1 | 2 | 3;

export function CheckoutFlow() {
  const { cart, subtotal, estimatedShipping, total, clearCart } = useCart();
  const { data: session } = useSession();
  
  const [step, setStep] = useState<Step>(1);
  const [isGuest, setIsGuest] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Form States
  const [shippingInfo, setShippingInfo] = useState({
    email: session?.user?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    method: "standard"
  });

  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "cod" | "card">("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
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

  const handleConfirm = () => {
    setIsSubmitting(true);
    // Mock processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmed(true);
      clearCart();
    }, 2000);
  };

  if (isConfirmed) {
    return (
      <div className="text-center py-24 bg-bottle-green/20 border border-white/10 p-12">
        <h2 className="font-structural text-4xl md:text-6xl uppercase tracking-tighter mb-6">Order Confirmed.</h2>
        <p className="font-editorial text-xl text-gray-300 mb-12">
          Your gear is in the queue. We've received your data and payment. The work begins now.
        </p>
        {!session && (
          <div className="mb-12 bg-dark-slate p-8 border border-white/5 inline-block">
            <p className="font-editorial text-sm text-gray-400 mb-6">
              Your order is confirmed. Create an account to track it and start earning your place in the loyalty program.
            </p>
            <Link href="/account/login">
              <Button variant="accent">Create Account</Button>
            </Link>
          </div>
        )}
        <div className="flex justify-center gap-6">
          <Link href="/shop">
            <Button variant="secondary">Back To Shop</Button>
          </Link>
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-10"
            >
              {!session && !isGuest && (
                <div className="bg-bottle-green/30 border border-white/10 p-8">
                  <h3 className="font-structural text-xl uppercase tracking-tight mb-4 text-white">Guest or Member?</h3>
                  <p className="font-editorial text-sm text-gray-400 mb-8">
                    Sign in to track your order and earn your place in the loyalty program.
                  </p>
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button onClick={() => signIn()} variant="secondary" className="flex-1">Sign In</Button>
                    <Button onClick={() => setIsGuest(true)} variant="ghost" className="flex-1 border-white/10 text-white hover:text-wattle">Continue as Guest</Button>
                  </div>
                </div>
              )}

              {(session || isGuest) && (
                <div className="flex flex-col gap-8">
                  <h2 className="font-structural text-2xl uppercase tracking-widest border-b border-white/10 pb-4">Shipping Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="flex flex-col gap-2">
                      <label className="font-structural text-xs uppercase tracking-widest text-gray-500">First Name <span className="text-wattle">*</span></label>
                      <input 
                        className={`bg-dark-slate border px-4 py-3 text-white focus:outline-none transition-all ${errors.firstName ? 'border-red-500/50 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-bottle-green focus:ring-1 focus:ring-bottle-green'}`} 
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      />
                      {errors.firstName && <span className="text-[10px] text-red-400 font-editorial uppercase tracking-wider">{errors.firstName}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Last Name <span className="text-wattle">*</span></label>
                       <input 
                        className={`bg-dark-slate border px-4 py-3 text-white focus:outline-none transition-all ${errors.lastName ? 'border-red-500/50 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-bottle-green focus:ring-1 focus:ring-bottle-green'}`} 
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      />
                      {errors.lastName && <span className="text-[10px] text-red-400 font-editorial uppercase tracking-wider">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Address line 1 <span className="text-wattle">*</span></label>
                    <input 
                      className={`bg-dark-slate border px-4 py-3 text-white focus:outline-none transition-all ${errors.address ? 'border-red-500/50 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-bottle-green focus:ring-1 focus:ring-bottle-green'}`} 
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    />
                    {errors.address && <span className="text-[10px] text-red-400 font-editorial uppercase tracking-wider">{errors.address}</span>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-structural text-xs uppercase tracking-widest text-gray-500">City <span className="text-wattle">*</span></label>
                      <input 
                        className={`bg-dark-slate border px-4 py-3 text-white focus:outline-none transition-all ${errors.city ? 'border-red-500/50 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-bottle-green focus:ring-1 focus:ring-bottle-green'}`} 
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      />
                      {errors.city && <span className="text-[10px] text-red-400 font-editorial uppercase tracking-wider">{errors.city}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Postcode / Zip</label>
                       <input 
                        className="bg-dark-slate border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-bottle-green focus:ring-1 focus:ring-bottle-green" 
                        value={shippingInfo.zip}
                        onChange={(e) => setShippingInfo({...shippingInfo, zip: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                     <h3 className="font-structural text-xs uppercase tracking-widest text-gray-500 mb-6">Delivery Method</h3>
                     <div className="grid gap-4">
                        <label className={`flex justify-between items-center p-6 border cursor-pointer transition-colors ${shippingInfo.method === 'standard' ? 'border-wattle bg-wattle/5' : 'border-white/10 hover:border-white/30'}`}>
                           <input type="radio" className="sr-only" name="method" checked={shippingInfo.method === 'standard'} onChange={() => setShippingInfo({...shippingInfo, method: 'standard'})} />
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
              )}
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
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
                      onClick={() => setPaymentMethod(method.id as any)}
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
                      <div className="p-4 bg-dark-slate border border-white/5">
                        <span className="text-gray-400 text-xs block mb-2 uppercase tracking-widest">Merchant Number</span>
                        <span className="font-structural text-2xl text-wattle font-bold">+880 1700 000 000</span>
                      </div>
                      <div className="space-y-4 font-editorial text-sm text-gray-300">
                        <p>1. Open your {paymentMethod} app.</p>
                        <p>2. Select "Send Money" or "Make Payment" to our merchant number above.</p>
                        <p>3. Enter the Transaction ID from your confirmation message below.</p>
                      </div>
                      <div className="flex flex-col gap-2 pt-4">
                        <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Transaction ID <span className="text-wattle">*</span></label>
                        <input 
                           placeholder="8N72L09K"
                           className={`bg-dark-slate border px-4 py-3 text-white focus:outline-none font-mono transition-all ${errors.transactionId ? 'border-red-500/50 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-wattle'}`} 
                           value={transactionId}
                           onChange={(e) => setTransactionId(e.target.value)}
                        />
                        {errors.transactionId && <span className="text-[10px] text-red-400 font-editorial uppercase tracking-wider">{errors.transactionId}</span>}
                      </div>
                    </div>
                  )}

                  {paymentMethod === "cod" && (
                    <p className="font-editorial text-gray-300">
                      Pay when your order arrives. Available for Dhaka Metro zones only. We'll call to confirm your availability.
                    </p>
                  )}

                  {paymentMethod === "card" && (
                    <div className="flex flex-col gap-6">
                      <p className="font-editorial text-xs text-gray-400">Secure payment via Stripe (Mock Integration)</p>
                      <div className="bg-dark-slate p-4 border border-white/10 flex flex-col gap-4">
                        <div className="h-10 border border-white/5 flex items-center px-4 text-gray-600">CARD NUMBER</div>
                        <div className="flex gap-4">
                           <div className="flex-1 h-10 border border-white/5 flex items-center px-4 text-gray-600">MM/YY</div>
                           <div className="flex-1 h-10 border border-white/5 flex items-center px-4 text-gray-600">CVC</div>
                        </div>
                      </div>
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
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
                        {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                          <p className="font-mono text-xs text-wattle">TXN: {transactionId}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                        {cart.map(item => (
                          <div key={item.id} className="flex gap-4 text-xs font-editorial">
                            <span className="text-gray-500">{item.quantity}x</span>
                            <span className="text-white uppercase">{item.name}</span>
                            <span className="ml-auto text-gray-400">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-bottle-green p-12 border border-white/10 text-center">
                    <h3 className="font-structural text-3xl uppercase tracking-tighter mb-4 text-white">Final Confirmation</h3>
                    <p className="font-editorial text-gray-400 mb-8 max-w-sm mx-auto">
                      Review your order. Once confirmed, we start building and preparing your gear for its longest sessions.
                    </p>
                    <Button variant="accent" size="lg" className="w-full py-6 text-xl tracking-tighter" onClick={handleNext} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-bottle-green/30 border-t-bottle-green rounded-full animate-spin" />
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
        <h2 className="font-structural text-xl uppercase tracking-tight text-white mb-4">Total Burden</h2>
        <div className="flex flex-col gap-3 font-editorial text-sm text-gray-400 border-b border-white/10 pb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-white">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-white">{estimatedShipping === 0 ? "FREE" : `$${estimatedShipping.toFixed(2)}`}</span>
          </div>
        </div>
        <div className="flex justify-between font-structural text-3xl uppercase tracking-tighter text-wattle">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </aside>
    </div>
  );
}
