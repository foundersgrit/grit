import { ProductCard } from "@/components/shop/ProductCard";
import { ShopSidebar } from "@/components/shop/ShopSidebar";
import { searchProducts, getAllCategories, SearchOptions } from "@/lib/search";
import { CategorySlug } from "@/types";
import { Suspense } from "react";
import Link from "next/link";

export const metadata = {
  title: "Shop All Gear",
  description: "Browse our complete range of performance gear built to endure. টেকসই পোশাক এবং মানসম্পন্ন পারফরম্যান্স অ্যাপারেল।",
  keywords: ["performance apparel", "durable clothing", "training gear", "টেকসই পোশাক", "মানসম্পন্ন পোশাক"],
  alternates: {
    languages: {
      "bn-BD": "/bn/shop"
    }
  }
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const categoryFilter = params.category as CategorySlug;
  const sortFilter = params.sort as SearchOptions["sortBy"];
  const searchTerm = params.q as string;

  // Parallel fetch products and categories from Firestore
  const [products, categories] = await Promise.all([
    searchProducts({
      category: categoryFilter,
      sortBy: sortFilter,
      searchTerm: searchTerm
    }),
    getAllCategories()
  ]);

  return (
    <div className="flex-1 bg-bottle-green text-white pt-32 pb-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          <Suspense fallback={<div className="w-64 h-96 bg-black/10 animate-pulse border border-white/5" />}>
            <ShopSidebar categories={categories} />
          </Suspense>
          
          <div className="flex-1">
            <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="font-structural text-4xl md:text-6xl uppercase tracking-tighter mb-4 leading-none">
                  {categoryFilter ? (categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)) : "All Gear"}
                </h1>
                <p className="font-editorial text-gray-400 max-w-xl">
                  Tools for the grind. Every piece in this collection is reinforced at every failure point and tested strictly by actual effort.
                </p>
              </div>
              <span className="font-structural text-sm text-gray-500 uppercase tracking-widest whitespace-nowrap">
                {products.length} Products
              </span>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border border-dashed border-white/10 p-12">
                <p className="font-editorial text-gray-400 mb-8">No gear matches these specific survival parameters.</p>
                <Link href="/shop" className="text-wattle uppercase tracking-widest text-xs border-b border-wattle pb-1">Reset All Filters</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
