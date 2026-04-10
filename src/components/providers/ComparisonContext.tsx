"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { useToast } from "@/components/providers/ToastProvider";

interface ComparisonContextType {
  selectedProducts: Product[];
  toggleProduct: (product: Product) => void;
  clearComparison: () => void;
  isComparisonOpen: boolean;
  setIsComparisonOpen: (open: boolean) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const { showToast } = useToast();

  const toggleProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.find((p) => p.id === product.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        showToast("Maximum 3 products for comparison.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const clearComparison = () => setSelectedProducts([]);

  return (
    <ComparisonContext.Provider value={{ 
      selectedProducts, 
      toggleProduct, 
      clearComparison,
      isComparisonOpen,
      setIsComparisonOpen
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
