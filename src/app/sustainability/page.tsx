import Image from "next/image";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Sustainability",
  description: "Learn about GRIT's commitment to durability, responsible sourcing, and radical transparency. টেকসই ফ্যাশন এবং দায়িত্বশীল উৎপাদন।",
  keywords: ["sustainable fashion", "ethical sourcing", "durable gear", "টেকসই ফ্যাশন", "দায়িত্বশীল উৎপাদন"],
  alternates: {
    languages: {
      "bn-BD": "/bn/sustainability"
    }
  }
};


export default function SustainabilityPage() {
  return (
    <main className="min-h-screen bg-dark-slate text-white selection:bg-wattle selection:text-bottle-green">
      {/* Heavy Statement Hero */}
      <section className="pt-32 pb-24 border-b border-white/10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="font-structural text-sm tracking-[0.2em] uppercase mb-8 text-gray-400">Our Commitment</h1>
            <p className="font-structural text-4xl md:text-5xl uppercase tracking-tighter leading-tight mb-12">
               We build to last.<br />
               We source with intent.<br />
               We reduce what we can.
            </p>
            <div className="w-24 h-1 bg-wattle mx-auto"></div>
        </div>
      </section>

      {/* Core Values / Details */}
      <section className="py-24 border-b border-white/10 bg-bottle-green">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-12">
            
            <div className="border border-white/10 p-8 h-full bg-dark-slate">
              <h2 className="font-structural text-2xl uppercase mb-6 text-wattle">Endurance</h2>
              <p className="font-editorial text-gray-300 leading-relaxed">
                The most sustainable piece of clothing is the one you don't have to replace. We engineer failure points out of our garments. We test them until they break, then reinforce them so they don't break again.
              </p>
            </div>

            <div className="border border-white/10 p-8 h-full bg-dark-slate relative overflow-hidden group">
               <h2 className="font-structural text-2xl uppercase mb-6 text-wattle relative z-10">Responsibility</h2>
               <p className="font-editorial text-gray-300 leading-relaxed relative z-10">
                 Supply chains should not be secrets. We vet every partner mill and factory for fair labor practices. If a supplier cuts corners on human dignity, they do not cut fabric for GRIT.
               </p>
            </div>

            <div className="border border-white/10 p-8 h-full bg-dark-slate">
              <h2 className="font-structural text-2xl uppercase mb-6 text-wattle">Authenticity</h2>
               <p className="font-editorial text-gray-300 leading-relaxed">
                 We do not greenwash. We know that creating physical goods exacts a toll on the environment. Our promise is simply to minimize that toll through brutal efficiency and lasting quality.
               </p>
            </div>

          </div>
        </div>
      </section>

      {/* What We're Working On */}
      <section className="py-24 md:py-32 bg-dark-slate relative">
        <div className="absolute inset-0 z-0 opacity-10">
            <Image
                src="/images/our_story_manufacturing_1775667611834.png"
                alt="Manufacturing background"
                fill
                className="object-cover mix-blend-overlay"
            />
        </div>
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <div className="border-l-4 border-white pl-8">
            <h2 className="font-structural text-3xl md:text-4xl uppercase tracking-tighter mb-8">What We're Working On</h2>
            <p className="font-editorial text-xl text-gray-300 leading-relaxed mb-12">
              Progress is a mandatory state. We are not yet where we need to be. Here is exactly where we are focusing our current optimization efforts.
            </p>

            <ul className="space-y-8 font-editorial text-lg text-gray-400">
               <li className="flex gap-4 items-start">
                 <span className="font-structural text-wattle mt-1">01</span>
                 <div>
                   <strong className="text-white block font-structural uppercase mb-1 tracking-wide">Water usage in dyeing.</strong>
                   We are currently transitioning 40% of our production lines to waterless dye processes.
                 </div>
               </li>
               <li className="flex gap-4 items-start">
                 <span className="font-structural text-wattle mt-1">02</span>
                 <div>
                   <strong className="text-white block font-structural uppercase mb-1 tracking-wide">Recycled Polyesters.</strong>
                   Our current baseline materials are virgin technical synthetics for durability. We are testing recycled alternatives that do not compromise tear strength.
                 </div>
               </li>
               <li className="flex gap-4 items-start">
                 <span className="font-structural text-wattle mt-1">03</span>
                 <div>
                   <strong className="text-white block font-structural uppercase mb-1 tracking-wide">End of Life.</strong>
                   We are designing a take-back program for gear that has finally given out, to ensure it avoids landfills.
                 </div>
               </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
