"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";

export function ContactForm() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Order Issue",
    message: ""
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
    }, 1200);
  };

  if (isSuccess) {
    return (
      <div className="p-12 bg-bottle-green/30 border border-wattle/50 text-center animate-in fade-in zoom-in duration-500">
        <h3 className="font-structural text-2xl uppercase tracking-tighter mb-4 text-wattle">Message Sent.</h3>
        <p className="font-editorial text-gray-300">
          We&apos;ve received your data. We respond within 24 hours. The work continues.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Name</label>
        <input 
          required
          className="bg-dark-slate border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle focus:ring-1 focus:ring-wattle" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Email Address</label>
        <input 
          required
          type="email"
          className="bg-dark-slate border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle focus:ring-1 focus:ring-wattle" 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Subject</label>
        <select 
          className="bg-dark-slate border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle focus:ring-1 focus:ring-wattle uppercase text-xs tracking-widest"
          value={formData.subject}
          onChange={(e) => setFormData({...formData, subject: e.target.value})}
        >
          <option>Order Issue</option>
          <option>Product Question</option>
          <option>Repair Request</option>
          <option>Partnership</option>
          <option>Other</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Message</label>
        <textarea 
          required
          rows={5}
          className="bg-dark-slate border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-wattle focus:ring-1 focus:ring-wattle resize-none" 
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
        />
      </div>

      <Button variant="accent" size="lg" className="w-full py-5 uppercase text-sm tracking-widest" disabled={isSubmitting}>
        {isSubmitting ? "Sending Message..." : "Send Message"}
      </Button>
    </form>
  );
}
