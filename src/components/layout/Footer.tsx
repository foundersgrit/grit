import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="w-full bg-dark-slate text-white border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="font-structural text-3xl tracking-wide lowercase">
              grit
            </Link>
            <p className="font-editorial text-sm text-gray-300 max-w-xs">
              Built to endure. Designed for repetition, not replacement.
            </p>
          </div>

          {/* About GRIT & Customer Service */}
          <div className="flex flex-col gap-4 font-structural uppercase text-sm">
            <h4 className="text-gray-400 mb-2">About GRIT</h4>
            <Link href="/our-story" className="hover:text-wattle transition-colors">Our Story</Link>
            <Link href="/sustainability" className="hover:text-wattle transition-colors">Sustainability</Link>
            <Link href="/contact" className="hover:text-wattle transition-colors">Contact</Link>
          </div>

          <div className="flex flex-col gap-4 font-structural uppercase text-sm">
            <h4 className="text-gray-400 mb-2">Customer Service</h4>
            <Link href="/support/faq" className="hover:text-wattle transition-colors">FAQ</Link>
            <Link href="/support/returns-repairs" className="hover:text-wattle transition-colors">Returns & Repairs</Link>
            <Link href="/account/orders" className="hover:text-wattle transition-colors">Order Tracking</Link>
          </div>

          {/* Community & Legal */}
          <div className="flex flex-col gap-4 font-structural uppercase text-sm">
            <h4 className="text-gray-400 mb-2">Community</h4>
            <Link href="/the-arena" className="hover:text-wattle transition-colors">The Arena</Link>
            <Link href="/journal" className="hover:text-wattle transition-colors">Journal</Link>
            
            <h4 className="text-gray-400 mb-2 mt-4">Legal</h4>
            <Link href="/privacy" className="hover:text-wattle transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-wattle transition-colors">Terms of Service</Link>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1">
            <h4 className="font-structural uppercase text-xl mb-2">Stay. The work isn't finished.</h4>
            <p className="font-editorial text-sm text-gray-400">Join the community. Earn your gear.</p>
          </div>
          <form className="flex w-full md:w-auto gap-4" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="ENTER EMAIL" 
              className="px-4 py-2 bg-bottle-green border border-white/20 text-white font-structural uppercase text-sm focus:outline-none focus:border-wattle w-full md:w-64"
            />
            <Button variant="accent" type="submit">Join</Button>
          </form>
        </div>
      </div>
    </footer>
  );
}
