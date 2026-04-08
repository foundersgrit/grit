"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";

export function RepairRequestForm() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    orderNumber: "",
    productName: "",
    issueDescription: "",
    resolutionPreference: "repair"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      showToast("Message sent.");
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="p-12 bg-bottle-green/30 border border-wattle/50 text-center animate-in fade-in zoom-in duration-500">
        <h3 className="font-structural text-2xl uppercase tracking-tighter mb-4 text-wattle">Request Logged.</h3>
        <p className="font-editorial text-gray-300 mb-8">
          We've received your repair data. Our team will review the structural details and message you with shipping instructions within 24 hours. The work continues.
        </p>
        <Button variant="secondary" onClick={() => setIsSuccess(false)}>New Request</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bottle-green/20 border border-white/10 p-8 md:p-12 flex flex-col gap-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Order Number</label>
          <input 
            required
            className="bg-dark-slate border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle focus:ring-1 focus:ring-wattle" 
            placeholder="ORD-99XXX"
            value={formData.orderNumber}
            onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Product Name</label>
          <input 
            required
            className="bg-dark-slate border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle focus:ring-1 focus:ring-wattle" 
            placeholder="e.g. Endurance Tee V2"
            value={formData.productName}
            onChange={(e) => setFormData({...formData, productName: e.target.value})}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Nature of the structural issue</label>
        <textarea 
          required
          rows={4}
          className="bg-dark-slate border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle focus:ring-1 focus:ring-wattle resize-none" 
          placeholder="Describe the failure point..."
          value={formData.issueDescription}
          onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
        />
      </div>

      <div>
        <h3 className="font-structural text-xs uppercase tracking-widest text-gray-500 mb-4">Preferred Resolution</h3>
        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              className="sr-only" 
              name="resolution" 
              checked={formData.resolutionPreference === "repair"} 
              onChange={() => setFormData({...formData, resolutionPreference: "repair"})}
            />
            <div className={`w-4 h-4 border transition-colors ${formData.resolutionPreference === "repair" ? "bg-wattle border-wattle" : "border-white/20 group-hover:border-white/40"}`} />
            <span className="text-sm uppercase tracking-widest font-structural">Repair</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              className="sr-only" 
              name="resolution" 
              checked={formData.resolutionPreference === "replace"} 
              onChange={() => setFormData({...formData, resolutionPreference: "replace"})}
            />
            <div className={`w-4 h-4 border transition-colors ${formData.resolutionPreference === "replace" ? "bg-wattle border-wattle" : "border-white/20 group-hover:border-white/40"}`} />
            <span className="text-sm uppercase tracking-widest font-structural">Replace</span>
          </label>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex flex-col gap-4 mb-8">
           <label className="font-structural text-xs uppercase tracking-widest text-gray-500 underline cursor-pointer hover:text-white transition-colors">
              + Upload Evidence (Photo of structural issue)
              <input type="file" className="hidden" accept="image/*" />
           </label>
           <p className="text-[10px] text-gray-600 uppercase tracking-widest italic">Optional but recommended for faster diagnosis.</p>
        </div>
        
        <Button variant="accent" size="lg" className="w-full md:w-auto px-12 py-4" disabled={isSubmitting}>
          {isSubmitting ? "Logging Request..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
}
