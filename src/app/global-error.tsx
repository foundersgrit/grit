"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Technical Audit Log
    console.error("CRITICAL SYSTEM FAILURE:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-bottle-green text-white font-structural min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center space-y-12">
          <div className="inline-block px-4 py-2 bg-red-900/30 border border-red-500/50 text-red-500 text-xs uppercase tracking-[0.5em] mb-4">
            Critical System Breach
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            System Failure.
          </h1>
          
          <p className="font-editorial text-lg text-gray-400 max-w-lg mx-auto leading-relaxed">
            The arena terminal has encountered a non-recoverable exception. Persistence protocol suggests a hard manual restart.
          </p>

          <div className="bg-black/40 border border-white/5 p-8 font-mono text-left text-xs text-red-400/70 overflow-x-auto">
            <p className="mb-2">ERROR_DIGEST: {error.digest || "UNKNOWN_PROTO"}</p>
            <p className="opacity-50">LOCATION: GLOBAL_ERROR_BOUNDARY</p>
          </div>

          <div className="flex flex-col gap-6 items-center">
            <Button 
                variant="accent" 
                size="lg" 
                className="w-full max-w-xs"
                onClick={() => reset()}
            >
              Reboot Terminal
            </Button>
            <button 
                onClick={() => window.location.href = "/"}
                className="font-structural text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              Exfiltrate To Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
