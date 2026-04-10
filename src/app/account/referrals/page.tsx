"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUserContext } from "@/components/providers/UserProvider";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ContentCopy, Share, WhatsApp, GroupAdd, EmojiEvents, InfoOutlined } from "@mui/icons-material";
import { useToast } from "@/components/providers/ToastProvider";

export default function ReferralsPage() {
  const { user } = useAuth();
  const { loyalty, isLoading } = useUserContext();
  const { showToast } = useToast();
  const [isCopying, setIsCopying] = useState(false);

  // Note: referrals data might not be in loyalty, but in user doc root or a nested 'referral' field.
  // Based on my types update: UserProfile has 'referral: UserReferral'
  // I'll need to update UserProvider to expose 'referral' data if it's not already in 'loyalty'
  
  // For now, I'll assume we might need to fetch it or it's accessible.
  // I'll mocks the display data based on types if UserProvider isn't updated yet.
  
  const referralData = (loyalty as any)?.referral || {
    referralCode: "XXXXXXX",
    referralLink: "https://www.gritapparel.com/join?ref=XXXXXXX",
    referralsCompleted: 0,
    referralRewards: []
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralData.referralLink);
    setIsCopying(true);
    showToast("Referral link copied to clipboard.");
    setTimeout(() => setIsCopying(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `I train with GRIT. Join the arena — here's ৳200 off your first gear deployment: ${referralData.referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join the GRIT Arena',
          text: 'Join the crew and earn rewards for your endurance gear.',
          url: referralData.referralLink,
        });
      } catch (err) {
        console.error('Share failure:', err);
      }
    } else {
       handleCopyLink();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-wattle/30 border-t-wattle rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-12 pb-8 border-b border-white/5">
        <h1 className="font-structural text-4xl uppercase tracking-tight mb-2">Bring Your Crew</h1>
        <p className="font-editorial text-gray-400 max-w-2xl">
          The arena is better with more people in it. Share your code. Grow the crew. Earn deployment credits for every member who secures their first kit.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Referral Card */}
        <div className="bg-bottle-green/20 border border-white/10 p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <GroupAdd sx={{ fontSize: 120 }} />
          </div>
          
          <span className="font-structural text-[10px] uppercase tracking-widest text-wattle block mb-6">Your Technical Code</span>
          <div className="flex items-center gap-4 mb-8">
            <code className="flex-1 bg-black/40 border border-white/5 p-4 font-mono text-2xl text-white tracking-[0.2em] uppercase">
              {referralData.referralCode}
            </code>
            <Button variant="outline" className="h-16 w-16 p-0" onClick={handleCopyLink}>
              <ContentCopy />
            </Button>
          </div>

          <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500 block mb-4">Quick Deployment Links</span>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1 gap-2 border-white/5 hover:border-[#25D366] hover:text-[#25D366]"
              onClick={handleWhatsAppShare}
            >
              <WhatsApp sx={{ fontSize: 20 }} /> WhatsApp
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 gap-2 border-white/5"
              onClick={handleNativeShare}
            >
              <Share sx={{ fontSize: 20 }} /> Share Link
            </Button>
          </div>
        </div>

        {/* Stats Column */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-dark-slate border border-white/5 p-6 flex flex-col justify-between">
            <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Crew Size</span>
            <div className="mt-4">
              <span className="font-structural text-5xl text-white block leading-none">{referralData.referralsCompleted}</span>
              <span className="font-structural text-[10px] uppercase tracking-widest text-wattle mt-2 block">Secured Members</span>
            </div>
          </div>
          <div className="bg-dark-slate border border-white/5 p-6 flex flex-col justify-between">
            <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Rewards Earned</span>
            <div className="mt-4">
              <span className="font-structural text-5xl text-white block leading-none">
                ৳{referralData.referralRewards.length * 200}
              </span>
              <span className="font-structural text-[10px] uppercase tracking-widest text-wattle mt-2 block">Total Credits</span>
            </div>
          </div>
          <div className="col-span-2 bg-dark-slate border border-white/5 p-6">
             <div className="flex items-start gap-4">
                <InfoOutlined className="text-gray-500" sx={{ fontSize: 18 }} />
                <p className="font-editorial text-xs text-gray-400 leading-relaxed">
                  Referral rewards are awarded after your invited crew member completes their first order. Credits can be applied during the payment stage of any future deployment.
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Rewards List */}
      <h2 className="font-structural text-xl uppercase tracking-widest mb-8 text-white">Reward Vault</h2>
      <div className="space-y-4">
        {referralData.referralRewards.length === 0 ? (
          <div className="py-12 border border-dashed border-white/10 text-center rounded-none">
            <p className="font-editorial text-gray-500 italic">No rewards reported in your vault yet. Start recruiting.</p>
          </div>
        ) : (
          referralData.referralRewards.map((reward: any) => (
            <div key={reward.id} className="flex items-center justify-between p-6 bg-dark-slate border border-white/5">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${reward.used ? "bg-gray-800 text-gray-500" : "bg-wattle/10 text-wattle"}`}>
                  <EmojiEvents />
                </div>
                <div>
                  <h4 className="font-structural text-sm uppercase tracking-widest text-white">৳{reward.amount} Recruitment Credit</h4>
                  <p className="font-editorial text-[10px] text-gray-500 uppercase mt-1">Earned: {new Date(reward.earnedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className={`px-4 py-1 border font-structural text-[10px] uppercase tracking-widest ${
                reward.used ? "border-white/5 text-gray-600" : "border-wattle/50 text-wattle bg-wattle/5"
              }`}>
                {reward.used ? "Deployed" : "Available"}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-16 p-8 border border-white/5 bg-black/20 flex flex-col md:flex-row items-center gap-8 justify-between">
        <div>
          <h3 className="font-structural text-lg uppercase tracking-widest text-white mb-2">The Mission Outcome</h3>
          <p className="font-editorial text-sm text-gray-400 max-w-md">Every person you bring makes the arena stronger. Our gear is built for endurance—sharing it is the first step in the mission.</p>
        </div>
        <Button variant="outline" className="px-8" onClick={() => (window as any).Tawk_API?.toggle()}>
          Contact Intelligence
        </Button>
      </div>
    </div>
  );
}
