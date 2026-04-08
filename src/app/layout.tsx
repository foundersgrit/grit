import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GRIT | Built To Endure",
  description: "Performance wear designed for repetition, not replacement.",
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased bg-bottle-green text-white">
      <body className="min-h-full flex flex-col font-structural">
        <Header />
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
