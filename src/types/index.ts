// CMS-ready type definitions

export type ContentCategory = "The Arena" | "Effort Over Talent" | "Endurance";

export interface JournalEntry {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  category: ContentCategory;
  featuredImage: string;
  bodyContent: string;
}

export interface ArenaEntry {
  id: string;
  memberName: string;
  storyExcerpt: string;
  challengeName: string;
  spotlightImage: string;
  date: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  shippingAddress?: string;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered";

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
}

export type LoyaltyTier = "Foundation" | "Endurance" | "Arena" | "Iron Will";

export interface LoyaltyStatus {
  currentTier: LoyaltyTier;
  pointsToNextTier: number;
  progressPercentage: number;
  milestones: string[];
}

export type CategorySlug = "tops" | "bottoms" | "outerwear" | "baselayers" | "accessories" | "limited-editions";

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategorySlug;
  price: number;
  description: string;
  specifications: Record<string, string>;
  images: string[];
  variants: ProductVariant[];
}

export interface CartItem {
  id: string; // combination of product ID and variant ID
  productId: string;
  variantId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

