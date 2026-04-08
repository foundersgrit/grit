"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, WishlistItem, LoyaltyStatus } from "@/types";
import { useSession } from "next-auth/react";

interface UserContextType {
  orders: Order[];
  wishlist: WishlistItem[];
  loyalty: LoyaltyStatus | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltyStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user) {
      // Load mock user data
      setOrders([
        { id: "o-1", orderNumber: "ORD-99321", date: "Oct 12, 2026", status: "Delivered", total: 185.00, itemCount: 2 },
        { id: "o-2", orderNumber: "ORD-99540", date: "Oct 01, 2026", status: "Processing", total: 65.00, itemCount: 1 }
      ]);
      setWishlist([
        { id: "w-1", productId: "p-1", name: "Endurance Tee V2", price: 45.00, image: "/images/journal_texture_1775667592289.png" },
        { id: "w-2", productId: "p-3", name: "Heavyweight Iron Pants", price: 115.00, image: "/images/arena_texture_1775667573740.png" }
      ]);
      setLoyalty({
        currentTier: "Endurance",
        pointsToNextTier: 250,
        progressPercentage: 65,
        milestones: ["First Purchase", "Entered The Arena: 30-Day Protocol", "1 Year Anniversary"]
      });
    } else {
      setOrders([]);
      setWishlist([]);
      setLoyalty(null);
    }
    
    setIsLoading(false);
  }, [session, status]);

  return (
    <UserContext.Provider value={{ orders, wishlist, loyalty, isLoading }}>
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
