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
      setOrders([]);
      setWishlist([]);
      setLoyalty(null);
      setReferral(null);
      setIsLoading(false);
      return;
    }

    const hydrateUserData = async () => {
      setIsLoading(true);

      // 1. Fetch Orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false });
      
      if (ordersData) setOrders(ordersData as any);

      // 2. Fetch Wishlist
      const { data: wishlistData } = await supabase
        .from("wishlist_items")
        .select("*, products(*)")
        .eq("profile_id", user.id);
      
      if (wishlistData) {
        setWishlist(wishlistData.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          name: item.products.name,
          price: item.products.price,
          image: item.products.images[0]
        })));
      }

      // 3. Fetch Profile/Loyalty/Referral
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (profileData) {
        if (profileData.loyalty) setLoyalty(profileData.loyalty as LoyaltyStatus);
        if (profileData.referral) setReferral(profileData.referral as UserReferral);
      }

      setIsLoading(false);
    };

    hydrateUserData();

    // 4. Realtime Subscriptions
    const profileChannel = supabase
      .channel(`profile:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
        (payload) => {
          const data = payload.new as any;
          if (data.loyalty) setLoyalty(data.loyalty);
          if (data.referral) setReferral(data.referral);
        }
      )
      .subscribe();

    return () => {
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
