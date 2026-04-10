import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Explore, WarningAmber } from "@mui/icons-material";

export default function NotFound() {
  return (
    <div className="flex-1 bg-bottle-green flex flex-col items-center justify-center p-6 text-center min-h-[70vh]">
      <div className="max-w-2xl w-full space-y-12">
        <div className="flex flex-col items-center gap-4">
           <WarningAmber className="text-wattle" sx={{ fontSize: 40 }} />
           <span className="font-structural text-xs uppercase tracking-[0.5em] text-gray-500">Navigation Breach</span>
        </div>
        
        <h1 className="font-structural text-7xl md:text-9xl font-black uppercase tracking-tighter text-white leading-none">
          Mission Rerouted.
        </h1>
        
        <p className="font-editorial text-lg md:text-xl text-gray-400 max-w-lg mx-auto leading-relaxed">
          The requested asset does not exist in this sector. Persistence is key, but redirection is necessary. 
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="accent" size="lg" className="w-full sm:px-12">Return To Base</Button>
          </Link>
          <Link href="/shop" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:px-12 flex gap-3">
               Explore Gear <Explore sx={{ fontSize: 18 }} />
            </Button>
          </Link>
        </div>

        <div className="pt-12 opacity-20 border-t border-white/5">
           <span className="font-structural text-[10px] uppercase tracking-widest text-white">Error Code: PROTO_404_MISSING_ASSET</span>
        </div>
      </div>
    </div>
  );
}
