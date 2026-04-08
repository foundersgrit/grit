import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex-1 bg-bottle-green flex flex-col items-center justify-center p-6 text-center h-full">
      <div className="mb-12">
        <span className="font-structural text-3xl tracking-wide lowercase text-white opacity-50">grit</span>
      </div>
      
      <h1 className="font-structural text-6xl md:text-8xl uppercase tracking-tighter text-white mb-6">
        Wrong Turn.
      </h1>
      
      <p className="font-editorial text-xl text-gray-300 mb-12 max-w-md">
        This page doesn't exist. But you're still here. That counts.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-xs">
        <Link href="/">
          <Button variant="accent" size="lg" className="w-full">Back to Home</Button>
        </Link>
        <Link href="/shop" className="font-structural text-sm uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
          Explore the Shop
        </Link>
      </div>
    </div>
  );
}
