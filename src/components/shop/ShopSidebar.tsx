"use client";

import { Category } from "@/types";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface ShopSidebarProps {
  categories: Category[];
}

export function ShopSidebar({ categories }: ShopSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get(name) === value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const activeSize = searchParams.get("size");
  const activeColor = searchParams.get("color");
  const activeSort = searchParams.get("sort") || "newest";

  const handleFilter = (name: string, value: string) => {
    const query = createQueryString(name, value);
    router.push(`${pathname}?${query}`, { scroll: false });
  };

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
              onClick={() => handleFilter("size", size)}
              className={`w-10 h-10 border flex items-center justify-center text-xs transition-all ${
                activeSize === size ? "bg-wattle text-bottle-green border-wattle" : "border-white/10 text-white hover:border-white/30"
              }`}
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
            <label 
              key={color} 
              className="flex items-center gap-3 cursor-pointer group text-sm uppercase tracking-wider"
              onClick={() => handleFilter("color", color.toLowerCase().replace(" ", "-"))}
            >
              <div className={`w-4 h-4 border transition-colors ${
                activeColor === color.toLowerCase().replace(" ", "-") ? "bg-wattle border-wattle" : "border-white/20 group-hover:border-wattle"
              }`} />
              <span className={`${activeColor === color.toLowerCase().replace(" ", "-") ? "text-wattle" : "group-hover:text-wattle transition-colors"}`}>
                {color}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm tracking-[0.2em] uppercase mb-6 text-gray-400">Sort By</h2>
        <select 
          value={activeSort}
          onChange={(e) => handleFilter("sort", e.target.value)}
          className="w-full bg-dark-slate border border-white/10 px-4 py-3 text-sm uppercase tracking-widest focus:outline-none focus:border-wattle"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </aside>
  );
}
