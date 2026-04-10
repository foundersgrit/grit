import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { FadeIn, FadeInStagger } from "@/components/ui/FadeIn";

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GRIT",
    "url": "https://www.gritapparel.com",
    "logo": "https://www.gritapparel.com/images/brand_og_default_grit_1775671994429.png",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+880 1700 000 000",
        "contactType": "customer service",
        "availableLanguage": ["English", "Bengali"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dhaka",
      "addressCountry": "BD"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "GRIT Dhaka",
    "image": "https://www.gritapparel.com/images/brand_og_default_grit_1775671994429.png",
    "@id": "https://www.gritapparel.com",
    "url": "https://www.gritapparel.com",
    "telephone": "+880 1700 000 000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Industrial Zone A, Uttara",
      "addressLocality": "Dhaka",
      "postalCode": "1230",
      "addressCountry": "BD"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "paymentAccepted": "Cash, Credit Card, bKash, Nagad",
    "priceRange": "$$"
  };

  return (
    <div className="w-full flex-1 flex flex-col">
       {/* Hero Section */}
       <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
         <Image 
           src="/hero_athlete.png"
           alt="GRIT Athlete showing intense effort"
           fill
           priority
           sizes="100vw"
           className="object-cover opacity-70 mix-blend-luminosity brightness-75 scale-105 duration-[15s] hover:scale-100 ease-in-out transition-transform"
         />
         {/* Background gradient mapping strictly to Brand Bottle Green */}
         <div className="absolute inset-0 bg-gradient-to-t from-bottle-green via-bottle-green/50 to-transparent pointer-events-none" />
         
         <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center mt-32 md:mt-40">
           <FadeIn>
             <h1 className="font-structural text-6xl md:text-[9rem] font-black uppercase tracking-tighter text-white mb-8 leading-[0.85]">
               Built<br/>To Endure.
             </h1>
           </FadeIn>
           <FadeIn delay={0.2}>
             <p className="font-editorial text-lg md:text-3xl text-gray-300 mb-16 max-w-2xl">
               Designed for repetition. Tested by effort. 
             </p>
           </FadeIn>
           <FadeIn delay={0.4}>
             <Button variant="primary" size="lg" className="px-16 py-8 text-xl tracking-widest">EARN YOUR GEAR</Button>
           </FadeIn>
         </div>
       </section>

       {/* Messaging Pillar: Effort Over Talent */}
       <section className="py-32 bg-dark-slate w-full border-t border-b border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-wattle rounded-full filter blur-[150px] opacity-10 pointer-events-none translate-x-1/2 -translate-y-1/2" />
         <div className="container mx-auto px-6 text-left md:text-center relative z-10">
            <FadeInStagger>
              <FadeIn>
                <h2 className="font-structural text-5xl md:text-[7rem] uppercase mb-8 text-wattle tracking-tighter leading-none">Effort Over Talent</h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="font-editorial text-xl md:text-2xl text-gray-300 max-w-4xl md:mx-auto mb-14 leading-relaxed tracking-wide">
                  We believe discipline beats shortcuts and consistency builds mastery. 
                  The work isn&apos;t finished. Show up.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <Button variant="outline" size="lg">READ THE JOURNAL</Button>
              </FadeIn>
            </FadeInStagger>
         </div>
       </section>
       
       {/* Featured Products / Collections */}
       <section className="py-32 w-full bg-bottle-green">
         <div className="container mx-auto px-6">
           <FadeIn>
             <div className="flex justify-between items-end mb-16 border-b border-white/20 pb-8">
               <h2 className="font-structural text-4xl uppercase tracking-widest">Tested Gear</h2>
               <Button variant="ghost">View Collection</Button>
             </div>
           </FadeIn>
           
           <FadeInStagger>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-16">
               {/* Product Cards */}
               {[1,2,3,4].map((item) => (
                  <FadeIn key={item}>
                    <div className="group cursor-pointer flex flex-col gap-6">
                      <div className="w-full aspect-[3/4] bg-dark-slate relative overflow-hidden flex items-center justify-center transition-all duration-500 hover:shadow-[0_0_40px_rgba(204,218,71,0.15)]">
                         <Image 
                           src="/product_endurance.png" 
                           alt={`Endurance Tee Product V${item}`} 
                           fill 
                           sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                           className="object-cover scale-[1.03] opacity-80 mix-blend-luminosity grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out" 
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-bottle-green/80 via-transparent to-transparent opacity-100 mix-blend-multiply pointer-events-none" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between w-full">
                           <h3 className="font-structural uppercase text-xl text-white tracking-wide group-hover:text-wattle transition-colors">Endurance Tee V{item}</h3>
                           <span className="font-structural font-bold text-wattle">৳4500</span>
                        </div>
                        <span className="font-editorial text-sm text-gray-400 capitalize">Bottle Green</span>
                      </div>
                    </div>
                  </FadeIn>
               ))}
             </div>
           </FadeInStagger>
         </div>
       </section>

       {/* The Arena Highlight */}
       <section className="py-32 w-full bg-dark-slate border-t border-wattle/20">
          <div className="container mx-auto px-6 flex flex-col items-center text-center">
            <FadeInStagger>
              <FadeIn>
                <h2 className="font-structural text-5xl md:text-7xl uppercase mb-8 tracking-tighter">The Arena</h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="font-editorial text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-14 tracking-wide leading-relaxed">
                  Progress isn&apos;t loud. It&apos;s consistent. Join a community of those who endure. Share your stories, face challenges, and earn your gear.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <Button variant="primary" size="lg">JOIN THE ARENA</Button>
              </FadeIn>
            </FadeInStagger>
          </div>
       </section>
    </div>
  );
}
