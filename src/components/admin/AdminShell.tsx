"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogOut, Package, ShieldCheck } from "lucide-react";
import { isCurrentUserAdmin } from "@/lib/admin";
import { supabase } from "@/lib/supabase/client";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const ok = await isCurrentUserAdmin();
      if (!mounted) {
        return;
      }
      setAllowed(ok);
      setChecking(false);
      if (!ok) {
        router.replace("/login");
      }
    };

    void check();

    return () => {
      mounted = false;
    };
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ec]">
        <div className="rounded-lg border border-[#ded7c9] bg-white px-5 py-4 text-sm text-[#234334] shadow-ambient-sm">
          Checking admin access...
        </div>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#20342a]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#ded7c9] bg-[#123527] text-white lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
          <ShieldCheck className="h-5 w-5 text-[#d8bc6a]" />
          <span className="font-serif text-xl">Yuveda Admin</span>
        </div>
        <nav className="space-y-1 p-3">
          <Link href="/admin" className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 text-sm text-[#123527]">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/76 hover:bg-white/10">
            <Package className="h-4 w-4" />
            Products
          </Link>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#ded7c9] bg-[#fbfaf5]/92 px-4 backdrop-blur lg:px-8">
          <p className="text-sm font-medium text-[#456454]">Content management</p>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-lg border border-[#d6cfbf] bg-white px-3 py-2 text-sm text-[#4c604f] hover:bg-[#f1eadb]"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </header>
        <div className="px-4 py-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
