"use client";

import { Category, CategorySlug } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ShopSidebarProps {
  categories: Category[];
}

export function ShopSidebar({ categories }: ShopSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 shrink-0 font-structural">
      <div className="mb-12">
        <h2 className="text-sm tracking-[0.2em] uppercase mb-6 text-gray-400">Categories</h2>
        <nav className="flex flex-col gap-4">
          <Link 
            href="/shop" 
            className={`text-lg uppercase tracking-wide transition-colors ${
              pathname === "/shop" ? "text-wattle border-l-2 border-wattle pl-4" : "text-white hover:text-gray-300 pl-4 border-l-2 border-transparent"
            }`}
          >
            All Gear
          </Link>
          {categories.map((cat) => {
            const isActive = pathname === `/shop/${cat.slug}`;
            return (
              <Link 
                key={cat.id} 
                href={`/shop/${cat.slug}`}
                className={`text-lg uppercase tracking-wide transition-colors ${
                  isActive ? "text-wattle border-l-2 border-wattle pl-4" : "text-white hover:text-gray-300 pl-4 border-l-2 border-transparent"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mb-12">
        <h2 className="text-sm tracking-[0.2em] uppercase mb-6 text-gray-400">Size</h2>
        <div className="flex flex-wrap gap-2">
          {["S", "M", "L", "XL"].map((size) => (
            <button 
              key={size}
              className="w-10 h-10 border border-white/10 flex items-center justify-center text-xs hover:border-wattle hover:text-wattle transition-all"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-sm tracking-[0.2em] uppercase mb-6 text-gray-400">Color</h2>
        <div className="flex flex-col gap-3">
          {["Bottle Green", "Dark Slate", "Khaki"].map((color) => (
            <label key={color} className="flex items-center gap-3 cursor-pointer group text-sm uppercase tracking-wider">
              <input type="checkbox" className="sr-only" />
              <div className="w-4 h-4 border border-white/20 group-hover:border-wattle transition-colors" />
              <span className="group-hover:text-wattle transition-colors">{color}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm tracking-[0.2em] uppercase mb-6 text-gray-400">Sort By</h2>
        <select className="w-full bg-dark-slate border border-white/10 px-4 py-3 text-sm uppercase tracking-widest focus:outline-none focus:border-wattle">
          <option>Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>
    </aside>
  );
}
