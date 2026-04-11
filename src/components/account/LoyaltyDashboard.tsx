"use client";

import { useUserContext } from "@/components/providers/UserProvider";
import Image from "next/image";

const TIER_IMAGES: Record<string, string> = {
  "Foundation": "/images/loyalty_badge_foundation_1775668782419.png",
  "Endurance": "/images/loyalty_badge_endurance_1775668801214.png",
  "Arena": "/images/loyalty_badge_arena_1775668819910.png",
  "Iron Will": "/images/loyalty_badge_iron_will_1775668840319.png",
};

export function LoyaltyDashboard() {
  const { loyalty, isLoading } = useUserContext();

  if (isLoading) return <div className="text-gray-400 font-editorial">Checking status...</div>;
  if (!loyalty) return <div className="text-gray-400 font-editorial">Join the community to begin.</div>;

  const currentBadgeImage = TIER_IMAGES[loyalty.currentTier];

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row gap-8 items-center bg-bottle-green/30 border border-white/10 p-8">
        <div className="shrink-0 relative w-48 h-48 md:w-64 md:h-64 border border-white/5 bg-black">
          <Image 
            src={currentBadgeImage} 
            alt={`${loyalty.currentTier} Tier Badge`}
            fill
            className="object-cover mix-blend-luminosity opacity-90"
          />
        </div>
        <div className="flex-1 w-full text-center md:text-left">
          <h2 className="font-structural tracking-[0.2em] uppercase text-sm text-gray-400 mb-2">Current Standing</h2>
          <h3 className="font-structural text-5xl uppercase tracking-tighter text-wattle mb-6">
            {loyalty.currentTier}
          </h3>
          <p className="font-editorial text-lg text-gray-300 italic border-l-2 border-white/20 pl-4 py-1 mb-8">
            &quot;You&apos;re currently on pace for Elite status.&quot;
          </p>
          
          <div className="w-full bg-dark-slate h-2 mt-4 relative">
            <div 
              className="absolute left-0 top-0 h-full bg-wattle" 
              style={{ width: `${loyalty.progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 font-structural text-xs uppercase tracking-widest text-gray-400">
            <span>{loyalty.progressPercentage}%</span>
            <span>{loyalty.pointsToNextTier} rep to Next Tier</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-structural text-2xl uppercase tracking-wide border-b border-white/10 pb-4 mb-6">
          Milestone Evidence
        </h3>
        <div className="grid gap-4">
          {loyalty.milestones.map((milestone: string, i: number) => (
            <div key={i} className="bg-dark-slate p-4 border border-white/5 flex items-center gap-4">
              <div className="w-2 h-2 bg-wattle rotate-45 shrink-0" />
              <span className="font-editorial text-gray-300">{milestone}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
