"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { GlobalBackground } from "@/components/layout/GlobalBackground";
import { Navbar } from "@/components/layout/Navbar";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="min-h-screen bg-[#f7f4ec]">{children}</main>;
  }

  return (
    <>
      <GlobalBackground />
      <div className="relative z-10 flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
