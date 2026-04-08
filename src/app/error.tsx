"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex-1 bg-bottle-green flex flex-col items-center justify-center p-6 text-center h-full">
      <div className="mb-12">
        <span className="font-structural text-3xl tracking-wide lowercase text-white opacity-50">grit</span>
      </div>
      
      <h1 className="font-structural text-6xl md:text-8xl uppercase tracking-tighter text-white mb-6">
        Something Broke.
      </h1>
      
      <p className="font-editorial text-xl text-gray-300 mb-12 max-w-md">
        A temporary setback. We're on it. The work continues.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-xs">
        <Button 
          variant="accent" 
          size="lg" 
          className="w-full"
          onClick={() => reset()}
        >
          Try Again
        </Button>
        <Link href="/" className="font-structural text-sm uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
