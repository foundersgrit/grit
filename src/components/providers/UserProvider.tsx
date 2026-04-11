"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, WishlistItem, LoyaltyStatus, UserReferral } from "@/types";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/utils/supabase/client";

interface UserContextType {
  orders: Order[];
  wishlist: WishlistItem[];
  loyalty: LoyaltyStatus | null;
  referral: UserReferral | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltyStatus | null>(null);
  const [referral, setReferral] = useState<UserReferral | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      const timer = setTimeout(() => {
        setOrders(prev => prev.length ? [] : prev);
        setWishlist(prev => prev.length ? [] : prev);
        setLoyalty(prev => prev ? null : prev);
        setReferral(prev => prev ? null : prev);
        setIsLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const hydrateUserData = async () => {
      if (!user) return;
      
      try {
        // 1. Fetch Orders
        const { data: ordersData } = await supabase
          .from("orders")
          .select("*")
          .eq("profile_id", user.id)
          .order("created_at", { ascending: false });
        
        if (ordersData) setOrders(ordersData as Order[]);

        // 2. Fetch Wishlist
        const { data: wishlistData } = await supabase
          .from("wishlist")
          .select("id, product_id, products(name, price, images)")
          .eq("profile_id", user.id);
        
        if (wishlistData) {
          interface JoinedWishlistItem {
            id: string;
            product_id: string;
            products: { name: string; price: number; images: string[] } | null;
          }
          setWishlist((wishlistData as unknown as JoinedWishlistItem[]).map((item) => ({
            id: item.id,
            productId: item.product_id,
            name: item.products?.name || "Unknown Product",
            price: item.products?.price || 0,
            image: item.products?.images?.[0] || "/product_placeholder.png"
          })));
        }

        // 3. Fetch Profile Metadata (Loyalty & Referral)
        const { data: profileData } = await supabase
          .from("profiles")
          .select("loyalty, referral")
          .eq("id", user.id)
          .single();
        
        if (profileData) {
          if (profileData.loyalty) setLoyalty(profileData.loyalty as LoyaltyStatus);
          if (profileData.referral) setReferral(profileData.referral as UserReferral);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Hydration failure:", err);
        setIsLoading(false);
      }
    };

    // Defer hydration to avoid cascading render lint error
    const hydrationTimer = setTimeout(() => {
      hydrateUserData();
    }, 0);

    // 4. Realtime Subscriptions
    const profileChannel = supabase
      .channel(`profile:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
        () => {
          const t = setTimeout(() => hydrateUserData(), 0);
          return () => clearTimeout(t);
        }
      )
      .subscribe();

    return () => {
      clearTimeout(hydrationTimer);
      supabase.removeChannel(profileChannel);
    };
  }, [user, authLoading]);

  return (
    <UserContext.Provider value={{ orders, wishlist, loyalty, referral, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
