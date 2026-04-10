import { ProductDetail } from "@/components/shop/ProductDetail";
import { ReviewSection } from "@/components/shop/ReviewSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { notFound } from "next/navigation";
import { CategorySlug } from "@/types";
import { getProductBySlug, searchProducts } from "@/lib/search";

interface ProductPageProps {
  params: Promise<{ category: CategorySlug; slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found - GRIT" };
  
  return {
    title: `${product.name} - GRIT`,
    description: product.description,
  };
}

export async function generateStaticParams() {
  const products = await searchProducts({});
  return products.map((product) => ({
    category: product.category,
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images[0],
    "sku": product.variants[0]?.sku,
    "brand": {
      "@type": "Brand",
      "name": "GRIT"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": product.price,
      "highPrice": product.price,
      "offerCount": "1",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="flex-1 bg-dark-slate pt-32 pb-32">
      <JsonLd data={productSchema} />
      <div className="container mx-auto px-4 max-w-7xl">
        <ProductDetail product={product} />
        
        {/* Live Reviews System (Section C1) */}
        <section id="reviews" className="mt-40">
           <ReviewSection productId={product.id} />
        </section>
      </div>
    </div>
  );
}
