import Image from "next/image";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Our Story",
  description: "Built for repetition, not replacement. Learn about GRIT's mission and commitment to endurance. কঠোর পরিশ্রম এবং অধ্যবসায়ের গল্প।",
  keywords: ["endurance", "perseverance", "manufacturing transparency", "কঠোর পরিশ্রম", "অধ্যবসায়"],
  alternates: {
    languages: {
      "bn-BD": "/bn/our-story"
    }
  }
};


export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-bottle-green text-white selection:bg-wattle selection:text-bottle-green">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center pt-20 border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-20 hidden md:block">
           <Image
            src="/images/our_story_manufacturing_1775667611834.png"
            alt="Meticulous manufacturing texture"
            fill
            className="object-cover mix-blend-luminosity"
            priority
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 max-w-4xl pt-24 text-center">
          <h1 className="font-structural text-5xl md:text-7xl uppercase tracking-tighter mb-8 leading-none">
            Effort Counts Twice.
          </h1>
          <p className="font-editorial text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Talent begins the journey; perseverance finishes it. We build gear for those who understand that progress isn&apos;t loud. It&apos;s consistent.
          </p>
        </div>
      </section>

      {/* Narrative Journey */}
      <section className="py-24 md:py-32 border-b border-white/10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <h2 className="font-structural text-sm wattle-accent tracking-[0.2em] uppercase mb-4 text-wattle">Why GRIT Exists</h2>
              <p className="font-editorial text-xl md:text-2xl text-gray-300 leading-relaxed mb-6">
                The market is saturated with disposable activewear meant to look good in a mirror. We saw a void for gear that looks best when it&apos;s covered in dirt, sweat, and chalk. GRIT was forged to fill that void. We don&apos;t sell an aesthetic; we sell a tool for your work.
              </p>
            </div>
            <div className="relative h-[400px] bg-dark-slate flex items-center justify-center p-8 border border-white/10">
               <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
                 <Image src="/images/arena_texture_1775667573740.png" alt="Industrial texture" fill className="object-cover" />
               </div>
               <p className="font-structural text-2xl uppercase tracking-wider text-white text-center relative z-10">We Sell Tools, Not Trends.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
             <div className="relative h-[400px] bg-dark-slate hidden md:flex items-center justify-center p-8 border border-white/10 order-2 md:order-1">
               <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
                 <Image src="/images/our_story_manufacturing_1775667611834.png" alt="Manufacturing Texture" fill className="object-cover" />
               </div>
               <p className="font-structural text-2xl uppercase tracking-wider text-white text-center relative z-10">Built To Outlast.</p>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-structural text-sm tracking-[0.2em] uppercase mb-4 text-wattle">What We Believe</h2>
              <p className="font-editorial text-xl md:text-2xl text-gray-300 leading-relaxed mb-6">
                We believe in the dignity of hard work. We believe that shortcuts are debts that eventually come due. We believe the physical act of showing up, day after day, builds not just muscle, but character. Our beliefs dictate our standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Radical Transparency Section */}
      <section className="py-24 md:py-32 bg-dark-slate border-b border-white/10">
         <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="font-structural text-4xl md:text-5xl uppercase tracking-tighter mb-8">Radical Transparency</h2>
            <p className="font-editorial text-xl text-gray-300 mx-auto leading-relaxed mb-16">
              When we say &quot;reinforced to last,&quot; we mean it. Here is how we build. No secrets. No corporate fluff.
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="p-8 border border-white/10 bg-bottle-green/30">
                <h3 className="font-structural text-xl uppercase mb-4">Material Sourcing</h3>
                <p className="font-editorial text-gray-400">
                  We source heavyweight, abrasive-resistant threads. If a supplier cannot trace their materials to ethical origins, we do not do business with them.
                </p>
              </div>
              <div className="p-8 border border-white/10 bg-bottle-green/30">
                <h3 className="font-structural text-xl uppercase mb-4">Stitching Physics</h3>
                <p className="font-editorial text-gray-400">
                  Double-stitched seams are our baseline. High-stress areas are triple-reinforced. We value durability over manufacturing speed.
                </p>
              </div>
              <div className="p-8 border border-white/10 bg-bottle-green/30">
                <h3 className="font-structural text-xl uppercase mb-4">Quality Testing</h3>
                <p className="font-editorial text-gray-400">
                  Machines don&apos;t wear GRIT. People do. Prototypes undergo 60 days of relentless, real-world testing by our community before reaching production.
                </p>
              </div>
            </div>
         </div>
      </section>

      {/* Where We're Going */}
      <section className="py-24 md:py-32 bg-bottle-green">
         <div className="container mx-auto px-4 max-w-4xl text-center">
             <h2 className="font-structural text-sm tracking-[0.2em] uppercase mb-4 text-wattle">Where We&apos;re Going</h2>
             <h3 className="font-structural text-3xl md:text-5xl uppercase tracking-tighter mb-8 leading-tight">
               The work is never finished. We continue to engineer better tools for a community that demands more from themselves.
             </h3>
             <Button variant="accent" size="lg" className="mt-8 text-bottle-green bg-wattle hover:bg-white transition-colors">
               Enter The Arena
             </Button>
         </div>
      </section>
    </main>
  );
}
