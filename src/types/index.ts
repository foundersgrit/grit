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

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses?: string[];
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  loyalty?: LoyaltyStatus;
  referral?: UserReferral;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered";

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  items: { name: string; image: string }[];
  shippingAddress: { city: string };
  createdAt: any;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
}

export type LoyaltyTier = "Foundation" | "Endurance" | "Arena" | "Iron Will";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
  xpAwarded: number;
}

export interface Challenge {
  challengeId: string;
  status: "active" | "completed" | "expired";
  progress: number; // 0-100
  startedAt: string;
  completedAt?: string;
}

export interface LoyaltyStatus {
  currentTier: LoyaltyTier;
  totalXP: number;
  currentTierXP: number;
  nextTierThreshold: number;
  progressPercentage: number;
  pointsToNextTier: number;
  streakDays: number;
  longestStreak: number;
  achievements: Achievement[];
  challenges: Challenge[];
  milestones: string[];
}

export interface ReferralReward {
  id: string;
  type: "discount" | "store-credit";
  amount: number;
  currency: string;
  earnedAt: string;
  used: boolean;
  orderId?: string;
}

export interface UserReferral {
  referralCode: string;
  referralLink: string;
  referralsCompleted: number;
  referralRewards: ReferralReward[];
  referredBy?: string;
}

export interface ReferralRecord {
  id: string;
  referrerUid: string;
  referredUid: string;
  referredEmail: string;
  status: "pending" | "registered" | "completed";
  createdAt: string;
  completedAt?: string;
}

export interface GiftCardTransaction {
  orderId: string;
  amountUsed: number;
  date: string;
}

export interface GiftCard {
  id: string;
  code: string;
  purchaserUid: string;
  recipientEmail: string;
  recipientName: string;
  personalMessage?: string;
  amount: number;
  currency: string;
  balance: number;
  status: "active" | "fully-redeemed" | "expired";
  purchasedAt: string;
  expiresAt: string;
  redeemedBy?: string;
  transactions: GiftCardTransaction[];
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
  bundleId?: string;
  bundleName?: string;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

