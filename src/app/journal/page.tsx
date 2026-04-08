import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MOCK_JOURNAL_ENTRIES } from "@/lib/data";

export const metadata = {
  title: "Journal - GRIT",
  description: "Evidence of work. Editorial content and stories.",
};

export default function JournalPage() {
  const featuredArticle = MOCK_JOURNAL_ENTRIES[0];
  const regularArticles = MOCK_JOURNAL_ENTRIES.slice(1);

  return (
    <main className="min-h-screen bg-dark-slate text-white selection:bg-khaki selection:text-dark-slate">
      {/* Journal Header */}
      <section className="py-24 border-b border-white/10">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-structural text-5xl md:text-7xl uppercase tracking-tighter mb-6 text-center">
            The Journal
          </h1>
          <p className="font-editorial text-xl text-gray-400 text-center max-w-2xl mx-auto">
            Dispatches from the grind. Thoughts on endurance, discipline, and the mechanics of lasting effort.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 border-b border-white/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center group cursor-pointer">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
              <Image 
                src={featuredArticle.featuredImage}
                alt={featuredArticle.title}
                fill
                priority
                className="object-cover opacity-80 group-hover:opacity-60 group-hover:scale-[1.02] transition-all duration-700 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-khaki mix-blend-overlay opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
            </div>
            
            <div className="pr-4 md:pl-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-structural text-xs uppercase tracking-widest text-[#F2B759] border border-[#F2B759] px-3 py-1">
                  {featuredArticle.category}
                </span>
                <span className="font-structural text-xs text-gray-400 uppercase tracking-widest">
                  {featuredArticle.date}
                </span>
              </div>
              
              <h2 className="font-structural text-4xl md:text-5xl uppercase tracking-tight mb-6 group-hover:text-[#F2B759] transition-colors leading-none">
                {featuredArticle.title}
              </h2>
              
              <p className="font-editorial text-xl text-gray-300 leading-relaxed mb-8 border-l-2 border-white/10 pl-6">
                {featuredArticle.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                 <span className="font-structural text-sm text-gray-400 uppercase tracking-widest">{featuredArticle.author}</span>
                 <Button variant="ghost" className="text-white group-hover:text-[#F2B759] border border-white/20 px-6 py-2">
                   Read Full Article
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
            {regularArticles.map((article) => (
              <article key={article.id} className="group cursor-pointer">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black mb-8">
                  <Image 
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-50 group-hover:scale-[1.03] transition-all duration-700 mix-blend-luminosity"
                  />
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-structural text-xs uppercase tracking-widest text-khaki">
                    {article.category}
                  </span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="font-structural text-xs text-gray-400 uppercase tracking-widest">
                    {article.date}
                  </span>
                </div>
                
                <h3 className="font-structural text-3xl uppercase tracking-wide mb-4 group-hover:text-khaki transition-colors leading-tight">
                  {article.title}
                </h3>
                
                <p className="font-editorial text-lg text-gray-400 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
