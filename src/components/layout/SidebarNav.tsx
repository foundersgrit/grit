"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

const NAV_ITEMS = [
  { href: "/account/profile", label: "Profile" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/loyalty", label: "Loyalty" }
];

export function SidebarNav() {
  const pathname = usePathname();

  // Don't show sidebar on login page
  if (pathname === "/account/login") return null;

  return (
    <aside className="w-full md:w-64 shrink-0 font-structural">
      <h2 className="text-sm tracking-[0.2em] uppercase mb-8 text-gray-400">Account</h2>
      <nav className="flex flex-col gap-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`text-lg uppercase tracking-wide transition-colors ${
                isActive ? "text-wattle border-l-2 border-wattle pl-4" : "text-white hover:text-gray-300 pl-4 border-l-2 border-transparent"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-left text-lg uppercase tracking-wide text-gray-400 hover:text-white pl-4 border-l-2 border-transparent transition-colors mt-8"
        >
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
