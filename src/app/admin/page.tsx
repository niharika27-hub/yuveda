import Link from "next/link";
import { Package, PanelsTopLeft } from "lucide-react";

export default function AdminPage() {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#657367]">
        Admin
      </p>
      <h1 className="mt-2 text-4xl font-semibold text-[#183628]">
        Yuveda CMS
      </h1>
      <p className="mt-3 max-w-2xl text-[#5b695d]">
        You are logged in as an admin. Manage products and content from here.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/products"
          className="rounded-lg border border-[#ddd4c2] bg-white p-5 shadow-ambient-sm transition hover:-translate-y-0.5 hover:shadow-ambient"
        >
          <Package className="mb-4 h-8 w-8 text-[#1f5d3b]" />
          <h2 className="text-xl font-semibold text-[#183628]">Products</h2>
          <p className="mt-2 text-sm text-[#657367]">
            Product management area.
          </p>
        </Link>
        <div className="rounded-lg border border-[#ddd4c2] bg-white p-5 shadow-ambient-sm">
          <PanelsTopLeft className="mb-4 h-8 w-8 text-[#1f5d3b]" />
          <h2 className="text-xl font-semibold text-[#183628]">Content</h2>
          <p className="mt-2 text-sm text-[#657367]">
            Homepage and CMS sections can be added here next.
          </p>
        </div>
      </div>
    </div>
  );
}
