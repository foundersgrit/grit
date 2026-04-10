"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";

const STORAGE_KEY = "grit_recently_viewed";
const MAX_ITEMS = 8;

export function useRecentlyViewed() {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync with LocalStorage for guests or initial load
  useEffect(() => {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local && !user) {
      setItems(JSON.parse(local));
    }
    setLoading(false);
  }, [user]);

  // Sync with Firestore for authenticated users
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.recentlyViewed) {
          setItems(userData.recentlyViewed);
        }
      }
    });

    return () => unsubscribe();
  }, [user]);

  const trackProduct = async (product: Product) => {
    // 1. Update Local State
    setItems((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const newItems = [product, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      return newItems;
    });

    // 2. Update Firestore if authenticated
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const currentRecent = userDoc.data().recentlyViewed || [];
          const filtered = currentRecent.filter((p: any) => p.id !== product.id);
          const newRecent = [product, ...filtered].slice(0, MAX_ITEMS);
          
          await updateDoc(userRef, {
            recentlyViewed: newRecent
          });
        }
      } catch (err) {
        console.error("Failed to sync recently viewed:", err);
      }
    }
  };

  return { items, trackProduct, loading };
}
