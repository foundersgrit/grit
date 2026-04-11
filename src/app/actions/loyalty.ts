"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { LoyaltyStatus } from "@/types";

export async function claimDailyXP() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required.");

  // Fetch current profile
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("loyalty, updated_at")
    .eq("id", user.id)
    .single();

  if (fetchError || !profile) throw new Error("Profile retrieval failed.");

  const lastUpdate = profile.updated_at ? new Date(profile.updated_at) : new Date(0);
  const now = new Date();
  
  // Simple 24h check
  const hoursSinceLast = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
  if (hoursSinceLast < 24) {
    throw new Error("Daily telemetry already synchronized. Return in 24h.");
  }


  const currentLoyalty = (profile.loyalty as unknown as LoyaltyStatus) || {
    totalXP: 0,
    currentTier: "Foundation",
    streakDays: 0,
    achievements: [],
  };

  const xpAwarded = 50;
  const newXP = currentLoyalty.totalXP + xpAwarded;
  const newStreak = currentLoyalty.streakDays + 1;
  
  // Tier logic
  let newTier = currentLoyalty.currentTier;
  if (newXP >= 5000) newTier = "Iron Will";
  else if (newXP >= 2500) newTier = "Arena";
  else if (newXP >= 1000) newTier = "Endurance";

  const updatedLoyalty = {
    ...currentLoyalty,
    totalXP: newXP,
    currentTier: newTier,
    streakDays: newStreak,
    lastClaimAt: now.toISOString()
  };

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ 
        loyalty: updatedLoyalty,
        updated_at: now.toISOString()
    })
    .eq("id", user.id);

  if (updateError) throw updateError;

  return { 
    success: true, 
    xpAwarded, 
    streak: newStreak,
    totalXP: newXP
  };
}
