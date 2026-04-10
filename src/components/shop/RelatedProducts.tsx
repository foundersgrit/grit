"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { productsRef } from "@/lib/firebase/collections";
import { query, where, limit, getDocs } from "firebase/firestore";
import { ProductCard } from "@/components/shop/ProductCard";
import { FadeIn, FadeInStagger } from "@/components/ui/FadeIn";

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const q = query(
          productsRef,
          where("category", "==", category),
          limit(10) // Fetch a few more to filter out current
        );
        
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs
          .map(doc => doc.data() as Product)
          .filter(p => p.id !== currentProductId)
          .slice(0, 4);

        setProducts(fetched);
      } catch (err) {
        console.error("Failed to fetch related gear:", err);
      } finally {
        setLoading(false);
      }
    }

    if (category) fetchRelated();
  }, [category, currentProductId]);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-24 border-t border-white/5 bg-bottle-green">
      <div className="container mx-auto px-6">
        <FadeIn>
          <h2 className="font-structural text-3xl uppercase tracking-widest mb-16">
            Built for the Same Arena
          </h2>
        </FadeIn>
        
        <FadeInStagger>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {products.map((product) => (
              <FadeIn key={product.id}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        </FadeInStagger>
      </div>
    </section>
  );
}
