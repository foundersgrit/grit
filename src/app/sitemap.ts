import { MetadataRoute } from "next";
import { MOCK_PRODUCTS, MOCK_JOURNAL_ENTRIES, CATEGORIES, MOCK_ARENA_ENTRIES } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
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
    "/support",
    "/support/faq",
    "/support/returns-repairs"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "monthly" as any,
    priority: route === "" ? 1 : 0.5,
  }));

  // Product Categories
  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/shop/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as any,
    priority: 0.8,
  }));

  // Individual Products
  const productPages = MOCK_PRODUCTS.map((prod) => ({
    url: `${baseUrl}/shop/${prod.category}/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as any,
    priority: 0.8,
  }));

  // Journal Articles
  const journalPages = MOCK_JOURNAL_ENTRIES.map((post) => ({
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
