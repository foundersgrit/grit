import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gritapparel.com"),
  title: {
    default: "GRIT | Built For Those Who Stay",
    template: "%s | GRIT — Built For Those Who Stay"
  },
  description: "Resilience-led performance apparel. Built to endure — physically, mentally, and ethically. Based in Dhaka, Bangladesh.",
  keywords: ["performance apparel", "durable clothing", "sustainable fashion", "GRIT", "Dhaka", "টেকসই পোশাক", "কঠোর পরিশ্রম"],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "bn-BD": "/bn"
    }
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "bn_BD",
    url: "https://www.gritapparel.com",
    siteName: "GRIT",
    images: [
      {
        url: "/images/brand_og_default_grit_1775671994429.png",
        width: 1200,
        height: 630,
        alt: "GRIT | Built For Those Who Stay"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "GRIT | Built For Those Who Stay",
    description: "Resilience-led performance apparel built to endure.",
    images: ["/images/brand_og_default_grit_1775671994429.png"],
    creator: "@grit"
  }
};

export const viewport = {
  themeColor: "#0A3625"
};



import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { UserProvider } from "@/components/providers/UserProvider";
import { CartProvider } from "@/components/providers/CartContext";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { CartDrawer } from "@/components/shop/CartDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased bg-bottle-green text-white">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-structural">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-wattle focus:text-bottle-green focus:px-4 focus:py-2 focus:outline-none">
          Skip to main content
        </a>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <UserProvider>
                <Header />
                <CartDrawer />
                <main id="main-content" className="flex-1 w-full flex flex-col">
                  {children}
                </main>
                <WhatsAppButton />
                <Footer />
              </UserProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
