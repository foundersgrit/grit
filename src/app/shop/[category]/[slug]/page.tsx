import { MOCK_PRODUCTS } from "@/lib/data";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { notFound } from "next/navigation";
import { CategorySlug } from "@/types";

interface ProductPageProps {
  params: Promise<{ category: CategorySlug; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find(p => p.slug === slug);
  if (!product) return { title: "Product Not Found - GRIT" };
  
  return {
    title: `${product.name} - GRIT`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find(p => p.slug === slug);
  
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
        
        {/* Reviews Section Placeholder */}
        <section className="mt-32 border-t border-white/10 pt-24 text-white">
          <div className="max-w-4xl">
            <h2 className="font-structural text-3xl uppercase tracking-tighter mb-12">Customer Feedback</h2>
            <div className="space-y-12">
               {[1, 2].map(r => (
                 <div key={r} className="border-b border-white/5 pb-12">
                   <div className="flex items-center gap-4 mb-4">
                     <span className="font-structural text-wattle">★★★★★</span>
                     <span className="font-structural text-sm uppercase tracking-widest">Verified Striver</span>
                   </div>
                   <p className="font-editorial text-lg text-gray-300 leading-relaxed italic mb-4">
                     {r === 1 ? "The vertical weave isn't just marketing. It holds up under high abrasion on the platform. The best kit I've earned so far." : "Minimalist design with extreme durability. A rare combination in today's market."}
                   </p>
                   <span className="font-structural text-xs uppercase tracking-widest text-gray-500">October {12 - r}, 2026</span>
                 </div>
               ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
