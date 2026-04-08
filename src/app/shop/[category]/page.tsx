import { MOCK_PRODUCTS, CATEGORIES } from "@/lib/data";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopSidebar } from "@/components/shop/ShopSidebar";
import { notFound } from "next/navigation";
import { CategorySlug } from "@/types";

interface CategoryPageProps {
  params: Promise<{ category: CategorySlug }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryData = CATEGORIES.find(c => c.slug === category);
  if (!categoryData) return { title: "Category Not Found - GRIT" };
  
  return {
    title: `${categoryData.name} - GRIT Gear`,
    description: categoryData.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryData = CATEGORIES.find(c => c.slug === category);
  
  if (!categoryData) {
    notFound();
  }

  const categoryProducts = MOCK_PRODUCTS.filter(p => p.category === category);

  return (
    <div className="flex-1 bg-bottle-green text-white pt-32 pb-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          <ShopSidebar categories={CATEGORIES} />
          
          <div className="flex-1">
            <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="font-structural text-4xl md:text-6xl uppercase tracking-tighter mb-4 leading-none">
                  {categoryData.name}
                </h1>
                <p className="font-editorial text-gray-400 max-w-xl">
                  {categoryData.description}
                </p>
              </div>
              <span className="font-structural text-sm text-gray-500 uppercase tracking-widest whitespace-nowrap">
                {categoryProducts.length} Products
              </span>
            </div>

            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border border-white/10 bg-dark-slate/20">
                <p className="font-structural text-xl uppercase tracking-wide text-gray-400 mb-6">
                  No gear in this category yet. The work continues.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
