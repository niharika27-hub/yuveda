"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { getProductPriceLabel, isProductPurchasable, Product } from "@/lib/products-live";
import { useCartStore } from "@/store/useCartStore";
import { useRef } from "react";
import { useRealtimeProducts } from "@/hooks/useRealtimeProducts";

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const purchasable = isProductPurchasable(product);

  return (
    <div className="flex-shrink-0 w-[280px] group">
      <Link
        href={`/product/${product.id}`}
        className="block bg-white rounded-2xl overflow-hidden shadow-ambient-sm hover:shadow-ambient transition-all duration-500 hover:-translate-y-1"
      >
        <div className="relative h-56 overflow-hidden bg-[#F2E6D7]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-3 transition-transform duration-700 group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1F5D3B] text-white text-xs font-medium">
              {product.badge}
            </span>
          )}
          {product.originalPrice > product.price && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#C9A961] text-[#251A00] text-xs font-bold">
              {Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              )}
              % OFF
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-[#56615B] mb-1">{product.category}</p>
          <h3 className="font-serif text-base text-[#201B12] font-medium mb-2 group-hover:text-[#1F5D3B] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, j) => (
                <Star
                  key={j}
                  className={`w-3.5 h-3.5 ${
                    j < Math.floor(product.rating)
                      ? "fill-[#C9A961] text-[#C9A961]"
                      : "text-[#EDE1D2]"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-[#56615B]">
              ({product.reviews})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#1F5D3B]">
                {getProductPriceLabel(product)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-[#56615B] line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          addItem(product);
        }}
        disabled={!purchasable}
        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#E8F3EC] text-[#1F5D3B] text-sm font-medium hover:bg-[#1F5D3B] hover:text-white transition-all duration-300 disabled:cursor-not-allowed disabled:bg-[#EDE1D2] disabled:text-[#8A8F88]"
      >
        <ShoppingCart className="w-4 h-4" />
        {purchasable ? "Add to Cart" : "Price unavailable"}
      </button>
    </div>
  );
}

export function FeaturedProducts() {
  const { products } = useRealtimeProducts();
  const featured = products.filter((product) => product.featured).slice(0, 8);
  const showcaseProducts = featured.length > 0 ? featured : products.slice(0, 8);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 bg-[#FEF2E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-[#C9A961] text-sm font-medium tracking-wider uppercase">
              Handpicked for You
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#201B12] mt-2">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#1F5D3B] hover:text-[#004526] transition-colors"
          >
            View All →
          </Link>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        >
          {showcaseProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#1F5D3B]"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
