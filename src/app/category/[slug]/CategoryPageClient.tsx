"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { getCategoryBySlug } from "@/lib/categories";
import { getProductPriceLabel, getProductsByCategoryFromList, isProductPurchasable, Product } from "@/lib/products-live";
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
          {product.badge && <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1F5D3B] text-white text-xs font-medium">{product.badge}</span>}
        </div>
        <div className="p-4">
          <h3 className="font-serif text-base text-[#201B12] font-medium mb-2 group-hover:text-[#1F5D3B] transition-colors">{product.name}</h3>
          <p className="text-xs text-[#56615B] mb-3 line-clamp-2">{product.shortDescription}</p>
          <div className="flex items-center gap-1.5 mb-3">
            {[...Array(5)].map((_, j) => (
              <Star key={j} className={`w-3 h-3 ${j < Math.floor(product.rating) ? "fill-[#C9A961] text-[#C9A961]" : "text-[#EDE1D2]"}`} />
            ))}
            <span className="text-xs text-[#56615B]">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#1F5D3B]">{getProductPriceLabel(product)}</span>
            {product.originalPrice > product.price && <span className="text-sm text-[#56615B] line-through">₹{product.originalPrice}</span>}
          </div>
        </div>
      </Link>
      <button onClick={() => addItem(product)} disabled={!purchasable} className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#E8F3EC] text-[#1F5D3B] text-sm font-medium hover:bg-[#1F5D3B] hover:text-white transition-all duration-300 disabled:cursor-not-allowed disabled:bg-[#EDE1D2] disabled:text-[#8A8F88]">
        <ShoppingCart className="w-4 h-4" /> {purchasable ? "Add to Cart" : "Price unavailable"}
      </button>
    </div>
  );
}

export function CategoryPageClient({ slug }: { slug: string }) {
  const { products, loading, error } = useRealtimeProducts();
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const categoryProducts = getProductsByCategoryFromList(products, slug);

  return (
    <div className="pt-24 pb-16">
      {/* Banner */}
      <div className="relative h-56 sm:h-64 bg-[#F7F0E6] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center gap-2 text-sm text-[#56615B] mb-3">
            <Link href="/" className="hover:text-[#1F5D3B]">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#1F5D3B]">Shop</Link>
            <span>/</span>
            <span className="text-[#201B12]">{category.name}</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl sm:text-5xl text-[#201B12] mb-3"
          >
            {category.name}
          </motion.h1>
          <p className="text-[#56615B] max-w-lg">{category.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <p className="text-[#201B12] text-base font-semibold mb-8">
          {categoryProducts.length} products
        </p>
        {loading && <p className="text-sm text-[#56615B] mb-3">Loading live products...</p>}
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categoryProducts.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        {categoryProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#56615B] text-lg">No products in this category yet.</p>
            <Link href="/shop" className="mt-4 inline-block text-[#1F5D3B] font-medium">Browse All Products →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
