import { ProductCard } from "@/components/shop/ProductCard";
import { ShopSidebar } from "@/components/shop/ShopSidebar";
import { notFound } from "next/navigation";
import { CategorySlug } from "@/types";
import { searchProducts, getCategoryBySlug, getAllCategories } from "@/lib/search";

interface CategoryPageProps {
  params: Promise<{ category: CategorySlug }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryData = await getCategoryBySlug(category);
  if (!categoryData) return { title: "Category Not Found - GRIT" };
  
  return {
    title: `${categoryData.name} - GRIT Gear`,
    description: categoryData.description,
  };
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  
  // Parallel fetch category data, products in this category, and all categories for sidebar
  const [categoryData, categoryProducts, allCategories] = await Promise.all([
    getCategoryBySlug(category),
    searchProducts({ category }),
    getAllCategories()
  ]);
  
  if (!categoryData) {
    notFound();
  }

  return (
    <div className="flex-1 bg-bottle-green text-white pt-32 pb-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          <ShopSidebar categories={allCategories} />
          
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
