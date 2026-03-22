import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GlobalBackground } from "@/components/layout/GlobalBackground";

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
      <body className="relative min-h-full overflow-x-clip bg-[#0d150f] text-[#201B12]">
        <GlobalBackground />
        <div className="relative z-10 flex min-h-full flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
