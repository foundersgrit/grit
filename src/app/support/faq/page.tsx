import { FAQAccordion } from "@/components/support/FAQAccordion";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "FAQ - GRIT Support",
  description: "Quick answers to common questions about gear, orders, and the arena. টেকসই পোশাক এবং শিপিং সংক্রান্ত প্রশ্ন।",
  keywords: ["FAQ", "Shipping", "Returns", "টেকসই পোশাক"],
  alternates: {
    languages: {
      "bn-BD": "/bn/support/faq"
    }
  }
};

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are your delivery times for Dhaka?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Standard delivery within Dhaka Metro zones takes 2-3 business days."
        }
      },
      {
        "@type": "Question",
        "name": "How do I pay via bKash or Nagad?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Select your preferred provider at checkout. You'll be shown our merchant number. Send the total amount, then enter your Transaction ID in the checkout portal."
        }
      }
    ]
  };

  return (
    <div className="flex-1 bg-dark-slate py-32">
      <JsonLd data={faqSchema} />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-16">
          <h1 className="font-structural text-4xl md:text-6xl uppercase tracking-tighter mb-4 text-white">
            Common Inquiries
          </h1>
          <p className="font-editorial text-gray-400">
            We&apos;ll sort this out. Here&apos;s exactly what you need to know about how we operate.
          </p>
        </div>
        
        <FAQAccordion />
      </div>
    </div>
  );
}
