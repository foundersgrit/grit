"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Email, Smartphone, Campaign, Bolt, InfoOutlined } from "@mui/icons-material";
import { useToast } from "@/components/providers/ToastProvider";

export default function NotificationSettingsPage() {
  useAuth();
  const { showToast } = useToast();
  
  const [channels, setChannels] = useState({
    email_orders: true,
    email_referrals: true,
    email_marketing: false,
    push_status: true,
    push_rewards: true,
    sms_priority: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const toggleChannel = (id: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate persistence
    setTimeout(() => {
      showToast("Communication protocols updated.");
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="border-b border-white/5 pb-8">
        <h1 className="font-structural text-4xl uppercase tracking-tighter text-white mb-2">Communication Protocols</h1>
        <p className="font-editorial text-gray-400">Manage how we relay technical data, mission status, and recruitment rewards.</p>
      </header>

      <div className="grid gap-12">
        {/* Channel Section: Email */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 mb-4">
              <Email className="text-gray-500" sx={{ fontSize: 20 }} />
              <h3 className="font-structural text-xs uppercase tracking-widest text-white">Email Relays</h3>
           </div>
           
           <div className="grid gap-4">
              {[
                { id: "email_orders", label: "Order & Mission Status", desc: "Technical updates on your gear construction and deployment." },
                { id: "email_referrals", label: "Recruitment Rewards", desc: "Notification of successful crew recruitment and credit issuance." },
                { id: "email_marketing", label: "Limited Deployment Access", desc: "High-priority alerts for new kit launches and limited releases." }
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-6 bg-dark-slate border border-white/5 group hover:border-white/20 transition-all">
                   <div className="space-y-1">
                      <span className="font-structural text-sm uppercase text-white block">{item.label}</span>
                      <p className="font-editorial text-xs text-gray-500">{item.desc}</p>
                   </div>
                   <button 
                     onClick={() => toggleChannel(item.id as keyof typeof channels)}
                     className={`w-12 h-6 flex items-center px-1 transition-colors ${channels[item.id as keyof typeof channels] ? "bg-wattle" : "bg-white/5"}`}
                   >
                      <motion.div 
                        animate={{ x: channels[item.id as keyof typeof channels] ? 24 : 0 }}
                        className={`w-4 h-4 ${channels[item.id as keyof typeof channels] ? "bg-bottle-green" : "bg-gray-700"}`}
                      />
                   </button>
                </div>
              ))}
           </div>
        </section>

        {/* Channel Section: Push */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 mb-4">
              <Smartphone className="text-gray-500" sx={{ fontSize: 20 }} />
              <h3 className="font-structural text-xs uppercase tracking-widest text-white">High-Intensity Alerts (Push)</h3>
           </div>
           
           <div className="grid gap-4">
              {[
                { id: "push_status", label: "Technical Status Changes", desc: "Instant mobile alerts for mission-critical order progress." },
                { id: "push_rewards", label: "Loyalty Tier Escalation", desc: "Alerts when you secure new XP milestones or tier upgrades." }
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-6 bg-dark-slate border border-white/5 group hover:border-white/20 transition-all">
                   <div className="space-y-1">
                      <span className="font-structural text-sm uppercase text-white block">{item.label}</span>
                      <p className="font-editorial text-xs text-gray-500">{item.desc}</p>
                   </div>
                   <button 
                     onClick={() => toggleChannel(item.id as keyof typeof channels)}
                     className={`w-12 h-6 flex items-center px-1 transition-colors ${channels[item.id as keyof typeof channels] ? "bg-wattle" : "bg-white/5"}`}
                   >
                      <motion.div 
                        animate={{ x: channels[item.id as keyof typeof channels] ? 24 : 0 }}
                        className={`w-4 h-4 ${channels[item.id as keyof typeof channels] ? "bg-bottle-green" : "bg-gray-700"}`}
                      />
                   </button>
                </div>
              ))}
           </div>
        </section>
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-start gap-4 max-w-lg">
            <InfoOutlined className="text-gray-600 mt-1" sx={{ fontSize: 18 }} />
            <p className="font-editorial text-xs text-gray-500 leading-relaxed uppercase">
              Operational data is critical. Even with communications disabled, mission-critical legal data or policy shifts will still be relayed to your primary operative address.
            </p>
         </div>
         <Button 
           variant="accent" 
           size="lg" 
           className="px-16 py-6 uppercase tracking-widest text-xs"
           onClick={handleSave}
           disabled={isSaving}
         >
           {isSaving ? "Syncing..." : "Finalize Protocol"}
         </Button>
      </div>

      <div className="mt-20 p-8 border border-white/5 bg-bottle-green/10 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-wattle/10 flex items-center justify-center text-wattle">
               <Campaign />
            </div>
            <div>
               <h4 className="font-structural text-sm uppercase text-white tracking-widest">Global Broadcasts</h4>
               <p className="font-editorial text-[10px] text-gray-500">You are currently receiving all global arena announcements.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
