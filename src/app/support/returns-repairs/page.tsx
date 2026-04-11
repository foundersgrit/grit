import Image from "next/image";
import { RepairRequestForm } from "@/components/support/RepairRequestForm";

export const metadata = {
  title: "Returns & Repairs - GRIT",
  description: "We build to last. When gear needs attention, we're here to reinforce it.",
};

export default function ReturnsRepairsPage() {
  return (
    <div className="flex-1 bg-dark-slate pt-32 pb-32">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Repair Program Section */}
        <section className="mb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h1 className="font-structural text-4xl md:text-7xl uppercase tracking-tighter mb-8 text-white leading-none">
                Built to Endure.<br/>Backed when Tested.
              </h1>
              <p className="font-editorial text-xl text-gray-300 mb-12 leading-relaxed italic border-l-2 border-wattle pl-6 py-2">
                &ldquo;We don&apos;t build disposable gear. We stand behind every thread. If your gear fails during its mission, we&apos;ll restore it.&rdquo;
              </p>
              
              <div className="space-y-12">
                <div className="flex gap-6 items-start">
                   <div className="w-10 h-10 rounded-full border border-wattle flex items-center justify-center font-structural text-wattle shrink-0">1</div>
                   <div>
                      <h3 className="font-structural text-lg uppercase tracking-tight text-white mb-2">Submit a Request</h3>
                      <p className="font-editorial text-sm text-gray-400">Log your structural issue using our interactive portal below. Focus on the failure point.</p>
                   </div>
                </div>
                <div className="flex gap-6 items-start">
                   <div className="w-10 h-10 rounded-full border border-wattle flex items-center justify-center font-structural text-wattle shrink-0">2</div>
                   <div>
                      <h3 className="font-structural text-lg uppercase tracking-tight text-white mb-2">Ship Your Gear</h3>
                      <p className="font-editorial text-sm text-gray-400">Receive shipping instructions. Send the gear that&apos;s earned its scars back to our facility.</p>
                   </div>
                </div>
                <div className="flex gap-6 items-start">
                   <div className="w-10 h-10 rounded-full border border-wattle flex items-center justify-center font-structural text-wattle shrink-0">3</div>
                   <div>
                      <h3 className="font-structural text-lg uppercase tracking-tight text-white mb-2">We Repair & Return</h3>
                      <p className="font-editorial text-sm text-gray-400">Our team restores structural integrity. Your gear ships back within 10-14 days. Stronger than before.</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-square bg-bottle-green overflow-hidden border border-white/10">
              <Image 
                src="/images/repair_stitching_detail_1775671227939.png" 
                alt="Repaired industrial stitching detail" 
                fill 
                className="object-cover mix-blend-luminosity opacity-90"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-slate p-8">
                <span className="font-structural text-xs uppercase tracking-[0.2em] text-wattle bg-bottle-green px-3 py-1">Reinforced Detail</span>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-structural text-3xl uppercase tracking-widest mb-4">Initial Assessment</h2>
            <p className="font-editorial text-gray-400 mb-12">Log your technical data here. The work continues even when the fabric is tested.</p>
            <RepairRequestForm />
          </div>
        </section>

        {/* Visual Evidence Section */}
        <section className="mb-32 grid md:grid-cols-2 gap-8">
           <div className="relative aspect-video overflow-hidden border border-white/5">
              <Image src="/images/worn_with_purpose_texture_1775671242255.png" alt="Worn fabric texture with purpose" fill className="object-cover opacity-70 grayscale" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="font-structural text-xl uppercase tracking-widest text-white border-y border-white/20 py-2 px-6 italic">Worn With Purpose</span>
              </div>
           </div>
           <div className="relative aspect-video overflow-hidden border border-white/5">
              <Image src="/images/repair_second_life_split_1775671259396.png" alt="Repair second life concept" fill className="object-cover opacity-70 grayscale" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="font-structural text-xl uppercase tracking-widest text-white border-y border-white/20 py-2 px-6 italic">Second Life</span>
              </div>
           </div>
        </section>

        {/* Standard Returns Section */}
        <section className="border-t border-white/10 pt-24 max-w-4xl">
           <h2 className="font-structural text-3xl uppercase tracking-tighter mb-8 text-white">Standard Returns</h2>
           <div className="grid md:grid-cols-2 gap-12 font-editorial text-gray-300">
              <div className="space-y-6">
                <p>Our &quot;No Gear Left Behind&quot; guarantee means we&apos;ll repair any technical defect within the first 12 months. Non-defect returns are accepted within 30 days of delivery.</p>
                <p>To be eligible for a return, your gear must be in the same condition you received it, unworn and unused, with all original validation tags attached.</p>
              </div>
              <div className="space-y-6">
                 <p className="font-structural text-xs uppercase tracking-widest text-gray-500">Refund Timelines</p>
                 <p>Our repair center is located in Melbourne. We typically turn around items in 14 days. Don&apos;t wait to gear back up. Refunds are processed within 5-7 business days of gear survival at our facility. You&apos;ll receive progress updates via email.</p>
                 <p className="text-xs italic">Note: bKash/Nagad transaction fees may be deducted by the provider from the final refund amount.</p>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
}
