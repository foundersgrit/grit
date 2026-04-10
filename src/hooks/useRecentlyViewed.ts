"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/utils/supabase/client";

const STORAGE_KEY = "grit_recently_viewed";
const MAX_ITEMS = 8;

export function useRecentlyViewed() {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Sync with LocalStorage for guests or initial load
  useEffect(() => {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local && !user) {
      setItems(JSON.parse(local));
    }
    setLoading(false);
  }, [user]);

  // Sync with Supabase for authenticated users
  useEffect(() => {
    if (!user) return;

    const fetchRecentlyViewed = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("recently_viewed")
        .eq("id", user.id)
        .single();
      
      if (data?.recently_viewed) {
        setItems(data.recently_viewed as Product[]);
      }
    };

    fetchRecentlyViewed();

    // Subscribe to changes
    const channel = supabase
      .channel(`recent:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
        (payload) => {
          if (payload.new.recently_viewed) {
            setItems(payload.new.recently_viewed as Product[]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const trackProduct = async (product: Product) => {
    // 1. Update Local State & Storage
    const filtered = items.filter((p) => p.id !== product.id);
    const newItems = [product, ...filtered].slice(0, MAX_ITEMS);
    
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));

    // 2. Update Supabase if authenticated
    if (user) {
      try {
        await supabase
          .from("profiles")
          .update({
            recently_viewed: newItems
          })
          .eq("id", user.id);
      } catch (err) {
        console.error("Failed to sync recently viewed to Supabase:", err);
      }
    }
  };

  return { items, trackProduct, loading };
}
