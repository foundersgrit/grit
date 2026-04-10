import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gritapparel.com";

import { ChatBubble } from "@mui/icons-material";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
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
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GRIT Gear",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A3625",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { UserProvider } from "@/components/providers/UserProvider";
import { CartProvider } from "@/components/providers/CartContext";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { ComparisonProvider } from "@/components/providers/ComparisonContext";
import { FirebaseAnalytics } from "@/components/analytics/FirebaseAnalytics";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { PageTransition } from "@/components/layout/PageTransition";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LiveChat } from "@/components/support/LiveChat";
import { ComparisonBar } from "@/components/shop/ComparisonBar";
import { SocialProof } from "@/components/shop/SocialProof";
import { BottomNav } from "@/components/layout/BottomNav";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { WelcomeFlow } from "@/components/onboarding/WelcomeFlow";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

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
                <ComparisonProvider>
                  <Suspense fallback={null}>
                    <FirebaseAnalytics />
                  </Suspense>
                  <Header />
                  <CartDrawer />
                  <main id="main-content" className="flex-1 w-full flex flex-col">
                    <PageTransition>
                      {children}
                    </PageTransition>
                  </main>
                  <WhatsAppButton />
                  <LiveChat />
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "GRIT",
                        "url": "https://www.gritapparel.com",
                        "logo": "https://www.gritapparel.com/images/brand_og_default_grit_1775671994429.png",
                        "sameAs": [
                          "https://www.instagram.com/grit",
                          "https://www.facebook.com/grit"
                        ],
                        "contactPoint": {
                          "@type": "ContactPoint",
                          "telephone": "+880-XXXXXXXXXX",
                          "contactType": "customer service",
                          "areaServed": "BD",
                          "availableLanguage": ["English", "Bengali"]
                        }
                      })
                    }}
                  />
                  <Footer />
                  <ComparisonBar />
                  <SocialProof />
                  <BottomNav />
                  <CustomCursor />
                  <WelcomeFlow />
                </ComparisonProvider>
              </UserProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
