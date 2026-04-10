"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import { CartItem, Product, ProductVariant, Cart } from "@/types";
import { useToast } from "@/components/providers/ToastProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/utils/supabase/client";

interface CartContextType {
  cart: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number, bundle?: { id: string, name: string }) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  estimatedShipping: number;
  bundleDiscount: number;
  total: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  lastAddedId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const syncInProgress = useRef(false);
  const supabase = createClient();

  // Load from localStorage on mount (Initial hydration)
  useEffect(() => {
    const savedCart = localStorage.getItem("grit_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage ONLY when guest (not logged in)
  useEffect(() => {
    if (isHydrated && !user) {
      localStorage.setItem("grit_cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated, user]);

  // Supabase Sync & Merge
  useEffect(() => {
    if (!isHydrated || authLoading) return;

    if (user) {
      const performMerge = async () => {
        syncInProgress.current = true;
        try {
          const { data: remoteCartData } = await supabase
            .from("carts")
            .select("*")
            .eq("profile_id", user.id)
            .single();
          
          const localCart = JSON.parse(localStorage.getItem("grit_cart") || "[]");
          
          if (localCart.length > 0) {
            const mergedItems = remoteCartData ? [...(remoteCartData.items as CartItem[])] : [];
            
            localCart.forEach((guestItem: CartItem) => {
              const existingIndex = mergedItems.findIndex(i => i.id === guestItem.id);
              if (existingIndex > -1) {
                mergedItems[existingIndex].quantity = Math.max(mergedItems[existingIndex].quantity, guestItem.quantity);
              } else {
                mergedItems.unshift(guestItem);
              }
            });

            await supabase
              .from("carts")
              .upsert({
                profile_id: user.id,
                items: mergedItems,
                updated_at: new Date().toISOString()
              });
            
            localStorage.removeItem("grit_cart");
            showToast("Cart synced.");
          }
        } catch (error) {
          console.error("Cart merge error:", error);
        } finally {
          syncInProgress.current = false;
        }
      };

      performMerge();

      const channel = supabase
        .channel(`cart:${user.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'carts', filter: `profile_id=eq.${user.id}` },
          (payload: any) => {
            if (!syncInProgress.current && payload.new && payload.new.items) {
              setCart(payload.new.items as CartItem[]);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, authLoading, isHydrated]);

  const updateSupabaseCart = async (newCart: CartItem[]) => {
    if (user) {
      syncInProgress.current = true;
      try {
        await supabase
          .from("carts")
          .upsert({
            profile_id: user.id,
            items: newCart,
            updated_at: new Date().toISOString()
          });
      } catch (err) {
        console.error("Error updating Supabase cart:", err);
      } finally {
        syncInProgress.current = false;
      }
    }
  };

  const addItem = async (product: any, variant: any, quantity: number = 1, bundle?: { id: string, name: string }) => {
    const cartItemId = bundle 
      ? `${product.id}-${variant.size}-${variant.color || 'default'}-${bundle.id}` 
      : `${product.id}-${variant.size}-${variant.color || 'default'}`;
    setLastAddedId(cartItemId);
    
    setCart((prevCart) => {
      let newCart: CartItem[] = [];
      const existingItem = prevCart.find((item) => item.id === cartItemId);
      
      if (existingItem) {
        newCart = prevCart.map((item) => 
          item.id === cartItemId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          variantId: variant.id || '',
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity,
          selectedSize: variant.size,
          selectedColor: variant.color || "Default",
          bundleId: bundle?.id,
          bundleName: bundle?.name
        };
        newCart = [newItem, ...prevCart]; // Prepend for recency
      }
      
      updateSupabaseCart(newCart);
      return newCart;
    });

    setIsCartDrawerOpen(true);
    showToast("Added to deployment.");
  };

  const removeItem = (cartItemId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== cartItemId);
      updateSupabaseCart(newCart);
      return newCart;
    });
    if (lastAddedId === cartItemId) setLastAddedId(null);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => 
        item.id === cartItemId ? { ...item, quantity } : item
      );
      updateSupabaseCart(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    updateSupabaseCart([]);
    setLastAddedId(null);
  };

  const subtotal = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), 
  [cart]);

  const estimatedShipping = useMemo(() => 
    subtotal === 0 || subtotal > 5000 ? 0 : 150, 
  [subtotal]);

  const bundleDiscount = useMemo(() => {
    // Group by bundleId
    const bundles: Record<string, CartItem[]> = {};
    cart.forEach(item => {
      if (item.bundleId) {
        if (!bundles[item.bundleId]) bundles[item.bundleId] = [];
        bundles[item.bundleId].push(item);
      }
    });

    let discount = 0;
    Object.values(bundles).forEach(items => {
      const count = items.reduce((acc, i) => acc + i.quantity, 0);
      const bundleSubtotal = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
      
      // Tiered discount matching KitBuilder logic
      if (count >= 4) discount += bundleSubtotal * 0.20;
      else if (count >= 3) discount += bundleSubtotal * 0.15;
      else if (count >= 2) discount += bundleSubtotal * 0.10;
    });
    
    return discount;
  }, [cart]);

  const total = useMemo(() => Math.max(0, subtotal + estimatedShipping - bundleDiscount), [subtotal, estimatedShipping, bundleDiscount]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      itemCount: cart.length, 
      subtotal, 
      estimatedShipping, 
      bundleDiscount,
      total,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      lastAddedId
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
