import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsApp } from "@mui/icons-material";

export const metadata = {
  title: "Contact Us - GRIT",
  description: "Reach out directly via WhatsApp, Email, or our contact form. We listen and respond within 24 hours.",
};

export default function ContactPage() {
  return (
    <div className="flex-1 bg-dark-slate pt-32 pb-32 font-structural">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-16">
          <h1 className="text-4xl md:text-7xl uppercase tracking-tighter mb-4 text-white leading-none">
            We're Here.
          </h1>
          <p className="font-editorial text-gray-400 max-w-2xl">
            Reach out however works for you. Whether it's a structural failure, a sizing query, or a partnership proposal—we listen.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32">
          {/* Left Column: Form */}
          <div className="order-2 lg:order-1">
            <h2 className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-8 border-b border-white/10 pb-4">
              Direct Inquiry
            </h2>
            <ContactForm />
          </div>

          {/* Right Column: Info */}
          <div className="order-1 lg:order-2 space-y-16">
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-8 border-b border-white/10 pb-4">
                Primary Channel
              </h2>
              <a 
                href="https://wa.me/8801700000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-6 p-8 bg-bottle-green/30 border border-wattle/30 hover:border-wattle hover:bg-bottle-green/50 transition-all"
              >
                <WhatsApp className="text-wattle text-4xl" />
                <div>
                   <span className="block font-structural text-2xl text-white uppercase tracking-tight group-hover:text-wattle transition-colors">WhatsApp Support</span>
                   <span className="block font-editorial text-sm text-gray-400">Message us directly. We respond within 24 hours.</span>
                </div>
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
               <div>
                  <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Email</h3>
                  <a href="mailto:support@gritapparel.com" className="text-white hover:text-wattle transition-colors lowercase tracking-wide">
                    support@gritapparel.com
                  </a>
               </div>
               <div>
                  <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Location</h3>
                  <p className="text-white uppercase tracking-tight text-sm leading-relaxed">
                    Industrial Zone A, Uttara<br/>
                    Dhaka 1230, Bangladesh
                  </p>
               </div>
               <div>
                  <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Business Hours</h3>
                  <p className="text-white uppercase tracking-tight text-sm leading-relaxed">
                    Saturday - Thursday<br/>
                    09:00 - 18:00 (GMT+6)
                  </p>
               </div>
            </div>

            <div className="p-8 border border-white/5 bg-white/5 italic font-editorial text-gray-400 text-sm leading-relaxed">
              "Every message is evidence of a conversation. We don't use automated replies because your work isn't automated. A human from our team will respond."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
