"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, WishlistItem, LoyaltyStatus } from "@/types";
import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/lib/firebase/config";
import { collection, query, where, onSnapshot, doc, orderBy } from "firebase/firestore";

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

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setTimeout(() => {
        setOrders([]);
        setWishlist([]);
        setLoyalty(null);
        setReferral(null);
        setIsLoading(false);
      }, 0);
      return;
    }

    setIsLoading(true);

    // 1. Subscribe to Orders
    const ordersQuery = query(
      collection(db, "orders"), 
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
    }, (error) => {
      console.error("Firestore Orders subscription error:", error);
    });

    // 2. Subscribe to Wishlist
    const wishlistCollection = collection(db, "users", user.uid, "wishlist");
    const unsubscribeWishlist = onSnapshot(wishlistCollection, (snapshot) => {
      const wishlistData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WishlistItem[];
      setWishlist(wishlistData);
    }, (error) => {
      console.error("Firestore Wishlist subscription error:", error);
    });

    // 3. Subscribe to Profile/Loyalty/Referral
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.loyalty) {
          setLoyalty(data.loyalty as LoyaltyStatus);
        }
        if (data.referral) {
          setReferral(data.referral as UserReferral);
        }
      }
    }, (error) => {
      console.error("Firestore Profile subscription error:", error);
    });

    setIsLoading(false);

    return () => {
      unsubscribeOrders();
      unsubscribeWishlist();
      unsubscribeProfile();
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
