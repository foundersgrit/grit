import Link from "next/link";
import { Search, Person, ShoppingCart } from "@mui/icons-material";
import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 w-full bg-bottle-green/95 backdrop-blur-md border-b border-white/10"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-structural text-3xl tracking-wide lowercase text-white hover:text-white/80 transition-colors">
          grit
        </Link>

        {/* Primary Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-structural text-sm tracking-widest uppercase">
          <Link href="/shop" className="text-white hover:text-wattle transition-colors">Shop</Link>
          <Link href="/collections" className="text-white hover:text-wattle transition-colors">Collections</Link>
          <Link href="/our-story" className="text-white hover:text-wattle transition-colors">Our Story</Link>
          <Link href="/the-arena" className="text-white hover:text-wattle transition-colors">The Arena</Link>
          <Link href="/journal" className="text-white hover:text-wattle transition-colors">Journal</Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-6 text-white">
          <button className="hover:text-wattle transition-colors" aria-label="Search">
            <Search fontSize="small" />
          </button>
          <Link href="/account" className="hover:text-wattle transition-colors" aria-label="Account">
            <Person fontSize="small" />
          </Link>
          <button className="hover:text-wattle transition-colors" aria-label="Cart">
            <ShoppingCart fontSize="small" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
