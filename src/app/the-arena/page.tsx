import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { fetchArenaEntries } from "@/lib/search";

export const metadata = {
  title: "The Arena",
  description: "A shared space of effort and stories. Enter The Arena and join the GRIT community. আমাদের কমিউনিটি এবং অনুপ্রেরণা।",
  keywords: ["community", "inspiration", "discipline", "অনুপ্রেরণা", "কমিউনিটি", "শৃঙ্খলা"],
  alternates: {
    languages: {
      "bn-BD": "/bn/the-arena"
    }
  }
};

export const revalidate = 3600; // Revalidate every hour

export default async function TheArenaPage() {
  const entries = await fetchArenaEntries();

  return (
    <main className="min-h-screen bg-dark-slate text-white selection:bg-wattle selection:text-bottle-green">
      {/* Header Topic */}
      <section className="pt-32 pb-16 px-4 border-b border-white/10 bg-bottle-green relative">
        <div className="absolute inset-0 z-0 opacity-20">
            <Image
            src="/images/arena_texture_1775667573740.png"
            alt="Arena matte texture"
            fill
            className="object-cover mix-blend-overlay grayscale"
            priority
            />
        </div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="max-w-2xl">
              <h1 className="font-structural text-6xl md:text-8xl uppercase tracking-tighter mb-6 leading-none">
                The Arena
              </h1>
              <p className="font-editorial text-xl md:text-2xl text-gray-300 leading-relaxed">
                This is not a feed for highlight reels. This is the evidence of work. A shared platform of discipline, setbacks, and perseverance.
              </p>
            </div>
            <div className="shrink-0 pb-4">
              <Button variant="accent" size="lg" className="w-full md:w-auto">Show Your Work</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Spotlights Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-structural text-3xl uppercase tracking-wide">Member Spotlights</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {entries.map((entry) => (
              <article 
                key={entry.id} 
                className="group relative bg-bottle-green border border-white/10 overflow-hidden transition-all hover:border-wattle/50"
              >
                {/* Spotlight Image with Hover Texture */}
                <div className="aspect-[4/3] relative overflow-hidden bg-black">
                  <Image 
                    src={entry.spotlightImage} 
                    alt={`Spotlight on ${entry.memberName}`} 
                    fill 
                    className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity"
                  />
                  {/* Subtle Khaki/Wattle Accent overlay on hover */}
                  <div className="absolute inset-0 bg-wattle mix-blend-color opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="font-structural text-xs uppercase tracking-widest text-wattle bg-dark-slate/80 px-2 py-1">
                      {entry.challengeName}
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <p className="font-structural text-sm text-gray-400 mb-2 uppercase tracking-wide">{entry.date}</p>
                  <h3 className="font-structural text-2xl uppercase tracking-wide text-white mb-4 group-hover:text-wattle transition-colors">
                    {entry.memberName}
                  </h3>
                  <blockquote className="font-editorial text-gray-300 leading-relaxed italic border-l-2 border-white/20 pl-4 py-1">
                    "{entry.storyExcerpt}"
                  </blockquote>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Ongoing Challenges Banner */}
      <section className="py-24 bg-bottle-green border-t border-white/10">
        <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="font-structural text-sm tracking-[0.2em] uppercase mb-4 text-khaki">Current Objective</h2>
            <h3 className="font-structural text-4xl md:text-6xl uppercase tracking-tighter mb-8 leading-tight">
              The 30-Day Endurance Protocol
            </h3>
            <p className="font-editorial text-xl text-gray-300 mx-auto max-w-2xl leading-relaxed mb-12">
              Commit to 30 days of uninterrupted, focused effort. Log your progress. Earn your gear. Prove it to yourself.
            </p>
            <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-dark-slate hover:border-white transition-all">
              Enter The Challenge
            </Button>
        </div>
      </section>
    </main>
  );
}
