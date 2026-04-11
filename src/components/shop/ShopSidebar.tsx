"use client";

import { Category, CategorySlug } from "@/types";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Close, Tune } from "@mui/icons-material";
import { Button } from "@/components/ui/Button";

interface ShopSidebarProps {
  categories: Category[];
}

export function ShopSidebar({ categories }: ShopSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    <>
      {/* Mobile Trigger */}
      <div className="md:hidden flex gap-4 mb-12">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="flex-1 flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 font-structural text-[10px] uppercase tracking-[0.3em] text-white active:bg-white/10"
        >
          <Tune sx={{ fontSize: 16 }} className="text-wattle" /> Filter Gear
        </button>
        <select 
          value={activeSort}
          onChange={(e) => handleFilter("sort", e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 py-4 px-4 font-structural text-[10px] uppercase tracking-[0.3em] text-white focus:outline-none appearance-none text-center"
        >
           <option value="newest">Newest</option>
           <option value="price-low">Price ±</option>
           <option value="price-high">Price ∓</option>
        </select>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0">
        <SidebarContent 
          categories={categories}
          pathname={pathname}
          activeSize={activeSize}
          activeColor={activeColor}
          activeSort={activeSort}
          handleFilter={handleFilter}
          setIsMobileOpen={setIsMobileOpen}
          isMobileOpen={false}
        />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[500] md:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-dark-slate border-r border-white/10 z-[510] md:hidden p-8 flex flex-col pt-20"
            >
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white"
              >
                <Close />
              </button>
              <h2 className="font-structural text-2xl uppercase tracking-tighter mb-12">Gear Specifications</h2>
              <div className="flex-1 overflow-y-auto scrollbar-none">
                <SidebarContent 
                  categories={categories}
                  pathname={pathname}
                  activeSize={activeSize}
                  activeColor={activeColor}
                  activeSort={activeSort}
                  handleFilter={handleFilter}
                  setIsMobileOpen={setIsMobileOpen}
                  isMobileOpen={true}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface SidebarContentProps {
  categories: Category[];
  pathname: string;
  activeSize: string | null;
  activeColor: string | null;
  activeSort: string;
  handleFilter: (name: string, value: string) => void;
  setIsMobileOpen: (open: boolean) => void;
  isMobileOpen: boolean;
}

const SidebarContent = ({ 
  categories, 
  pathname, 
  activeSize, 
  activeColor, 
  activeSort, 
  handleFilter,
  setIsMobileOpen,
  isMobileOpen
}: SidebarContentProps) => (
  <div className="flex flex-col gap-12">
    <div className="md:mb-12">
      <h2 className="text-[10px] tracking-[0.3em] uppercase mb-8 text-gray-500 font-structural">Categories</h2>
      <nav className="flex flex-col gap-5">
        <Link 
          href="/shop" 
          onClick={() => setIsMobileOpen(false)}
          className={`text-sm uppercase tracking-widest transition-all ${
            pathname === "/shop" ? "text-wattle font-black border-l-2 border-wattle pl-4" : "text-gray-400 hover:text-white pl-4 border-l-2 border-transparent"
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
              onClick={() => setIsMobileOpen(false)}
              className={`text-sm uppercase tracking-widest transition-all ${
                isActive ? "text-wattle font-black border-l-2 border-wattle pl-4" : "text-gray-400 hover:text-white pl-4 border-l-2 border-transparent"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </nav>
    </div>

    <div className="md:mb-12">
      <h2 className="text-[10px] tracking-[0.3em] uppercase mb-8 text-gray-500 font-structural">Size</h2>
      <div className="grid grid-cols-4 gap-2">
        {["S", "M", "L", "XL"].map((size) => (
          <button 
            key={size}
            onClick={() => handleFilter("size", size)}
            className={`h-12 border flex items-center justify-center text-xs transition-all font-structural ${
              activeSize === size ? "bg-wattle text-bottle-green border-wattle font-black" : "border-white/10 text-white hover:border-white/30"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>

    <div className="md:mb-12">
      <h2 className="text-[10px] tracking-[0.3em] uppercase mb-8 text-gray-500 font-structural">Color</h2>
      <div className="flex flex-col gap-4">
        {["Bottle Green", "Dark Slate", "Khaki"].map((color) => {
            const val = color.toLowerCase().replace(" ", "-");
            const isActive = activeColor === val;
            return (
              <button 
                key={color} 
                className="flex items-center gap-4 group text-xs uppercase tracking-widest text-left"
                onClick={() => handleFilter("color", val)}
              >
                <div className={`w-5 h-5 border transition-all ${
                  isActive ? "bg-wattle border-wattle" : "border-white/20 group-hover:border-wattle/50"
                }`} />
                <span className={`${isActive ? "text-wattle font-black" : "text-gray-400 group-hover:text-white transition-colors"}`}>
                  {color}
                </span>
              </button>
            );
        })}
      </div>
    </div>

    <div>
      <h2 className="text-[10px] tracking-[0.3em] uppercase mb-8 text-gray-500 font-structural">Sort Logic</h2>
      <select 
        value={activeSort}
        onChange={(e) => handleFilter("sort", e.target.value)}
        className="w-full bg-white/5 border border-white/10 px-4 py-4 text-xs uppercase tracking-[0.2em] text-white focus:outline-none focus:border-wattle appearance-none font-structural"
      >
        <option value="newest" className="bg-dark-slate">Newest Arrivals</option>
        <option value="price-low" className="bg-dark-slate">Price: Decending (Low)</option>
        <option value="price-high" className="bg-dark-slate">Price: Ascending (High)</option>
      </select>
    </div>

    {isMobileOpen && (
      <div className="mt-12 pt-12 border-t border-white/10">
         <Button variant="primary" className="w-full py-6" onClick={() => setIsMobileOpen(false)}>Apply Specs</Button>
      </div>
    )}
  </div>
);
