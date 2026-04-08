import { MOCK_PRODUCTS, CATEGORIES } from "@/lib/data";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopSidebar } from "@/components/shop/ShopSidebar";

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


export default function ShopPage() {
  return (
    <div className="flex-1 bg-bottle-green text-white pt-32 pb-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          <ShopSidebar categories={CATEGORIES} />
          
          <div className="flex-1">
            <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="font-structural text-4xl md:text-6xl uppercase tracking-tighter mb-4 leading-none">
                  All Gear
                </h1>
                <p className="font-editorial text-gray-400 max-w-xl">
                  Tools for the grind. Every piece in this collection is reinforced at every failure point and tested strictly by actual effort.
                </p>
              </div>
              <span className="font-structural text-sm text-gray-500 uppercase tracking-widest whitespace-nowrap">
                {MOCK_PRODUCTS.length} Products
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
