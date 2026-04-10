import { MetadataRoute } from "next";
import { searchProducts, fetchJournalEntries, getAllCategories } from "@/lib/search";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.gritapparel.com";

  // Static Pages
  const staticPages = [
    "",
    "/shop",
    "/collections",
    "/our-story",
    "/the-arena",
    "/journal",
    "/sustainability",
    "/contact",
    "/gift-cards",
    "/redeem",
    "/shop/bundles",
    "/shop/kit-builder",
    "/support",
    "/support/faq",
    "/support/returns-repairs"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" ? "daily" : "monthly") as any,
    priority: route === "" ? 1 : 0.5,
  }));

  // Fetch all dynamic content from Firestore
  const [products, journalEntries, categories] = await Promise.all([
    searchProducts(),
    fetchJournalEntries(),
    getAllCategories()
  ]);

  // Product Categories
  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/shop/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as any,
    priority: 0.8,
  }));

  // Individual Products
  const productPages = products.map((prod) => ({
    url: `${baseUrl}/shop/${prod.category}/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as any,
    priority: 0.8,
  }));

  // Journal Articles
  const journalPages = journalEntries.map((post) => ({
    url: `${baseUrl}/journal/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as any,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...journalPages
  ];
}
