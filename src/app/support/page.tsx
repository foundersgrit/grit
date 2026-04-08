import Link from "next/link";

export const metadata = {
  title: "Support Hub - GRIT",
  description: "How can we help? Navigate to FAQ, Returns & Repairs, or Contact Us.",
};

const SUPPORT_CARDS = [
  {
    title: "Frequently Asked Questions",
    description: "Quick answers to common questions about gear, orders, and the arena.",
    href: "/support/faq"
  },
  {
    title: "Returns & Repairs",
    description: "We build to last. When gear needs attention, we're here to reinforce it.",
    href: "/support/returns-repairs"
  },
  {
    title: "Contact Us",
    description: "Reach out directly. We listen and we respond within 24 hours.",
    href: "/contact"
  }
];

export default function SupportHubPage() {
  return (
    <div className="flex-1 bg-dark-slate py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="font-structural text-5xl md:text-7xl uppercase tracking-tighter mb-12 text-white">
          Support Hub
        </h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {SUPPORT_CARDS.map((card) => (
            <Link 
              key={card.href} 
              href={card.href}
              className="group p-10 border border-white/10 bg-bottle-green/20 hover:border-wattle hover:bg-bottle-green/40 transition-all flex flex-col items-start h-full"
            >
              <h2 className="font-structural text-2xl uppercase tracking-tight mb-4 group-hover:text-wattle transition-colors">
                {card.title}
              </h2>
              <p className="font-editorial text-gray-400 text-sm leading-relaxed mt-auto">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
