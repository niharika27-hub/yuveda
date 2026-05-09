"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Lightbulb } from "lucide-react";
import { getConcernBySlug } from "@/lib/concerns";
import { getProductPriceLabel, getProductsByConcernFromList, isProductPurchasable, Product } from "@/lib/products-live";
import { useCartStore } from "@/store/useCartStore";
import { notFound } from "next/navigation";
import { useRealtimeProducts } from "@/hooks/useRealtimeProducts";

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const purchasable = isProductPurchasable(product);
  return (
    <div className="group">
      <Link href={`/product/${product.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-ambient-sm hover:shadow-ambient transition-all duration-500 hover:-translate-y-1">
        <div className="h-52 overflow-hidden bg-[#F2E6D7]">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain p-3 transition-transform duration-700 group-hover:scale-105" />
        </div>
        <div className="p-4">
          <p className="text-xs text-[#56615B] mb-1">{product.category}</p>
          <h3 className="font-serif text-base text-[#201B12] font-medium mb-2 group-hover:text-[#1F5D3B] transition-colors">{product.name}</h3>
          <div className="flex items-center gap-1.5 mb-3">
            {[...Array(5)].map((_, j) => (<Star key={j} className={`w-3 h-3 ${j < Math.floor(product.rating) ? "fill-[#C9A961] text-[#C9A961]" : "text-[#EDE1D2]"}`} />))}
            <span className="text-xs text-[#56615B]">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#1F5D3B]">{getProductPriceLabel(product)}</span>
            {product.originalPrice > product.price && <span className="text-sm text-[#56615B] line-through">₹{product.originalPrice}</span>}
          </div>
        </div>
      </Link>
      <button onClick={() => addItem(product)} disabled={!purchasable} className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#E8F3EC] text-[#1F5D3B] text-sm font-medium hover:bg-[#1F5D3B] hover:text-white transition-all disabled:cursor-not-allowed disabled:bg-[#EDE1D2] disabled:text-[#8A8F88]">
        <ShoppingCart className="w-4 h-4" /> {purchasable ? "Add to Cart" : "Price unavailable"}
      </button>
    </div>
  );
}

export function ConcernPageClient({ slug }: { slug: string }) {
  const { products, loading, error } = useRealtimeProducts();
  const concern = getConcernBySlug(slug);

  if (!concern) notFound();

  const concernProducts = getProductsByConcernFromList(products, slug);

  return (
    <div className="pt-24 pb-16">
      {/* Banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img src="/journey/seed-to-herb.webp" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.65)" }}>
            <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/concern" className="hover:text-white">Concerns</Link>
              <span>/</span>
              <span className="text-white">{concern.name}</span>
            </div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-4xl sm:text-5xl text-white mb-3">
              {concern.name}
            </motion.h1>
            <p className="text-white/70 max-w-lg">{concern.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-10 p-8 bg-[#FEF2E3] rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[#C9A961]" />
            <h2 className="font-serif text-xl text-[#201B12]">Ayurvedic Tips for {concern.name}</h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {concern.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-[#201B12]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F5D3B] mt-2 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Products */}
        <div className="mt-12">
          <h2 className="font-serif text-3xl text-[#201B12] mb-8">Recommended Products</h2>
          {loading && <p className="text-sm text-[#56615B] mb-3">Loading live products...</p>}
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {concernProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
