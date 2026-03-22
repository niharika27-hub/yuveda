import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yuveda | Premium Ayurvedic Wellness",
  description:
    "Rooted in Nature. Powered by Ayurveda. Discover premium Ayurvedic formulations for holistic wellness — Churna, Capsules, Oils, Juices & more.",
  keywords: [
    "Ayurveda",
    "Ayurvedic",
    "herbal medicine",
    "natural wellness",
    "Yuveda",
    "Churna",
    "Ayurvedic products",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFF8F3] text-[#201B12]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
