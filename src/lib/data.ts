import { JournalEntry, ArenaEntry, Category, Product } from "@/types";

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "j-1",
    title: "The Friction Required for Growth",
    slug: "friction-required-for-growth",
    excerpt: "Comfort is the enemy of progress. Why seeking out resistance is the only proven method for long-term adaptation.",
    author: "GRIT Editorial",
    date: "October 12, 2026",
    category: "The Arena",
    featuredImage: "/images/journal_texture_1775667592289.png",
    bodyContent: "Full article content goes here..."
  },
  {
    id: "j-2",
    title: "Consistency Over Intensity",
    slug: "consistency-over-intensity",
    excerpt: "A single extreme effort rarely yields results. The compounding interest of daily, grueling discipline outpaces sporadic talent every time.",
    author: "GRIT Editorial",
    date: "October 05, 2026",
    category: "Effort Over Talent",
    featuredImage: "/images/journal_texture_1775667592289.png",
    bodyContent: "Full article content goes here..."
  },
  {
    id: "j-3",
    title: "Built to Outlast",
    slug: "built-to-outlast",
    excerpt: "An inside look at our material selection process. If a fabric cannot withstand the repetitive abrasion of heavy work, it doesn't earn the GRIT label.",
    author: "GRIT Product Team",
    date: "September 28, 2026",
    category: "Endurance",
    featuredImage: "/images/our_story_manufacturing_1775667611834.png",
    bodyContent: "Full article content goes here..."
  }
];

export const MOCK_ARENA_ENTRIES: ArenaEntry[] = [
  {
    id: "a-1",
    memberName: "Alex Vance",
    storyExcerpt: "I failed the 100km ultramarathon twice. The third time, I didn't change my gear, I changed my mindset. The Endurance Tee V2 absorbed the punishment, but I provided the will.",
    challengeName: "The 100km Barrier Challenge",
    spotlightImage: "/images/arena_texture_1775667573740.png",
    date: "October 14, 2026"
  },
  {
    id: "a-2",
    memberName: "Sarah Jenkins",
    storyExcerpt: "Three years of early mornings. No audiences, no praise. Just the work. The callouses are the only trophy I need.",
    challengeName: "365 Days of Discomfort",
    spotlightImage: "/images/arena_texture_1775667573740.png",
    date: "October 09, 2026"
  },
  {
    id: "a-3",
    memberName: "Marcus Thorne",
    storyExcerpt: "They said a torn ACL was the end of my lifting career. Eighteen months of solitary rehab proved them wrong. You rebuild from the ground up.",
    challengeName: "The Reconstruction Protocol",
    spotlightImage: "/images/arena_texture_1775667573740.png",
    date: "September 30, 2026"
  }
];

export const CATEGORIES: Category[] = [
  { id: "cat-1", name: "Tops", slug: "tops", description: "Performance gear designed for movement and structural endurance." },
  { id: "cat-2", name: "Bottoms", slug: "bottoms", description: "Reinforced lower-body gear built for repetition and protection." },
  { id: "cat-3", name: "Outerwear", slug: "outerwear", description: "Heavyweight protection for the harshest environments." },
  { id: "cat-4", name: "Accessories", slug: "accessories", description: "Tools for your daily grind." }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "The Endurance Tee",
    slug: "endurance-tee",
    category: "tops",
    price: 45.00,
    description: "Built to move, reinforced to last. This is not just a tee; it's a structural tool for your longest sessions. Featuring a high-density vertical weave that breathes under pressure.",
    specifications: {
      "Material": "88% Recycled Polyester, 12% Spandex",
      "Weight": "160 GSM",
      "Care": "Machine wash cold, air dry to preserve structural integrity."
    },
    images: [
      "/images/product_endurance_tee_front_1775670128913.png",
      "/images/product_endurance_tee_texture_1775670143965.png"
    ],
    variants: [
      { id: "v-1-1", color: "Bottle Green", size: "S", sku: "ET-GRN-S", stock: 15 },
      { id: "v-1-2", color: "Bottle Green", size: "M", sku: "ET-GRN-M", stock: 20 },
      { id: "v-1-3", color: "Bottle Green", size: "L", sku: "ET-GRN-L", stock: 10 }
    ]
  },
  {
    id: "prod-2",
    name: "The Arena Jogger",
    slug: "arena-jogger",
    category: "bottoms",
    price: 95.00,
    description: "Engineered for the grind. The Arena Jogger features abrasion-resistant paneling on the knees and a tapered fit that stays out of your way during explosive movements.",
    specifications: {
      "Material": "94% Nylon, 6% Elastane with DWR Coating",
      "Weight": "280 GSM",
      "Care": "Tough enough for the machine. Avoid bleach."
    },
    images: [
      "/images/product_arena_jogger_front_1775670162067.png",
      "/images/product_arena_jogger_lifestyle_1775670182053.png"
    ],
    variants: [
      { id: "v-2-1", color: "Dark Slate", size: "S", sku: "AJ-SLT-S", stock: 5 },
      { id: "v-2-2", color: "Dark Slate", size: "M", sku: "AJ-SLT-M", stock: 12 },
      { id: "v-2-3", color: "Dark Slate", size: "L", sku: "AJ-SLT-L", stock: 8 }
    ]
  },
  {
    id: "prod-3",
    name: "The Stay Crew",
    slug: "stay-crew",
    category: "tops",
    price: 75.00,
    description: "Designed for repetition, not replacement. A heavyweight layering piece for early starts and late finishes. The Stay Crew holds its shape session after session.",
    specifications: {
      "Material": "100% Heavyweight Cotton Fleece",
      "Weight": "450 GSM",
      "Care": "Wash inside out. Air dry to maintain fleece loft."
    },
    images: [
      "/images/product_stay_crew_front_1775670199100.png",
      "/images/product_stay_crew_detail_1775670219137.png"
    ],
    variants: [
      { id: "v-3-1", color: "Bottle Green", size: "M", sku: "SC-GRN-M", stock: 18 },
      { id: "v-3-2", color: "Bottle Green", size: "L", sku: "SC-GRN-L", stock: 25 }
    ]
  }
];

