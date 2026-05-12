import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";

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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="relative min-h-full overflow-x-clip bg-[#0d150f] text-[#201B12]">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
