"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { CartItem, Product, ProductVariant } from "@/types";
import { useToast } from "@/components/providers/ToastProvider";
import { useSession } from "next-auth/react";

interface CartContextType {
  cart: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  estimatedShipping: number;
  total: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { showToast } = useToast();
  const { data: session, status } = useSession();
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasMerged, setHasMerged] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Load from localStorage on mount
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

  // Save to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("grit_cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  // Handle Cart Merging on Login
  useEffect(() => {
    if (status === "authenticated" && isHydrated && !hasMerged) {
      // Simulation: Fetch "Account Cart" from mock backend
      const mockAccountCart: CartItem[] = [
        // Imagine some items from previous session
      ];

      if (mockAccountCart.length > 0) {
        setCart((prevGuestCart) => {
          const mergedCart = [...prevGuestCart];
          
          mockAccountCart.forEach((accountItem) => {
            const existingInGuest = mergedCart.find(i => i.id === accountItem.id);
            if (!existingInGuest) {
              // Only add if not in guest cart (Guest overwrites Account per rule)
              mergedCart.push(accountItem);
            }
          });

          return mergedCart;
        });

        showToast("Your previous saved items have been added to your cart.");
      }
      setHasMerged(true);
    } else if (status === "unauthenticated") {
      setHasMerged(false);
    }
  }, [status, isHydrated, hasMerged, showToast]);

  const addItem = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    const cartItemId = `${product.id}-${variant.id}`;
    
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === cartItemId);
      if (existingItem) {
        return prevCart.map((item) => 
          item.id === cartItemId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
        selectedSize: variant.size,
        selectedColor: variant.color
      };
      
      return [...prevCart, newItem];
    });

    setIsCartDrawerOpen(true);
    showToast("Added to cart.");
  };

  const removeItem = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
    showToast("Removed from cart.");
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setCart((prevCart) => 
      prevCart.map((item) => 
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const itemCount = useMemo(() => 
    cart.reduce((acc, item) => acc + item.quantity, 0), 
  [cart]);

  const subtotal = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), 
  [cart]);

  // Mock shipping logic: $10 for Standard, free over $150
  const estimatedShipping = useMemo(() => 
    subtotal === 0 || subtotal > 150 ? 0 : 10, 
  [subtotal]);

  const total = useMemo(() => subtotal + estimatedShipping, [subtotal, estimatedShipping]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      itemCount, 
      subtotal, 
      estimatedShipping, 
      total,
      isCartDrawerOpen,
      setIsCartDrawerOpen
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
