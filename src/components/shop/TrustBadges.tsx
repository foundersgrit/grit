"use client";

import React from "react";
import { 
  Security, 
  SyncAlt, 
  Build, 
  LocalShipping, 
  VerifiedUser 
} from "@mui/icons-material";
import { FadeIn, FadeInStagger } from "@/components/ui/FadeIn";

interface TrustBadgeProps {
  layout?: "horizontal" | "vertical" | "grid";
  className?: string;
}

export function TrustBadges({ layout = "horizontal", className = "" }: TrustBadgeProps) {
  const badges = [
    {
      icon: <Security sx={{ fontSize: 20 }} />,
      label: "Secure Payments",
      description: "Encrypted transactions"
    },
    {
      icon: <SyncAlt sx={{ fontSize: 20 }} />,
      label: "Resilient Returns",
      description: "30-day hassle-free"
    },
    {
      icon: <Build sx={{ fontSize: 20 }} />,
      label: "Lifetime Support",
      description: "Repairs & maintenance"
    },
    {
      icon: <LocalShipping sx={{ fontSize: 20 }} />,
      label: "Free Deployment",
      description: "On orders over ৳3000"
    }
  ];

  if (layout === "grid") {
    return (
      <FadeInStagger className={`grid grid-cols-2 md:grid-cols-4 gap-8 ${className}`}>
        {badges.map((badge, i) => (
          <FadeIn key={i} className="flex flex-col items-center text-center p-6 bg-white/5 border border-white/10 group hover:border-wattle/50 transition-colors">
            <div className="text-wattle mb-4 group-hover:scale-110 transition-transform">{badge.icon}</div>
            <span className="font-structural text-[10px] uppercase tracking-widest text-white mb-1">{badge.label}</span>
            <span className="font-editorial text-[10px] text-gray-500">{badge.description}</span>
          </FadeIn>
        ))}
      </FadeInStagger>
    );
  }

  return (
    <div className={`flex flex-wrap gap-x-12 gap-y-6 ${className}`}>
      {badges.map((badge, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="text-wattle">{badge.icon}</div>
          <div className="flex flex-col">
            <span className="font-structural text-[9px] uppercase tracking-widest text-white leading-none mb-1">{badge.label}</span>
            <span className="font-editorial text-[9px] text-gray-500 leading-none">{badge.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
