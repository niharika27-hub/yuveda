"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-[70vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#E8F3EC] flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-[#1F5D3B]" />
          </div>
          <h1 className="font-serif text-3xl text-[#201B12] mb-3">Your Wishlist is Empty</h1>
          <p className="text-[#56615B] mb-8">Save items you love for later.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full btn-gradient text-white font-medium">
            Browse Products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl text-[#201B12]">Wishlist</h1>
            <p className="text-[#56615B] mt-1">{items.length} items saved</p>
          </div>
          <button onClick={clearWishlist} className="text-sm text-[#56615B] hover:text-red-500">Clear All</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((product) => (
            <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group">
              <Link href={`/product/${product.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-ambient-sm hover:shadow-ambient transition-all duration-500 hover:-translate-y-1">
                <div className="relative h-52 overflow-hidden bg-[#F2E6D7]">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <button onClick={(e) => { e.preventDefault(); removeItem(product.id); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#56615B] mb-1">{product.category}</p>
                  <h3 className="font-serif text-base text-[#201B12] font-medium mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#1F5D3B]">₹{product.price}</span>
                    {product.originalPrice > product.price && <span className="text-sm text-[#56615B] line-through">₹{product.originalPrice}</span>}
                  </div>
                </div>
              </Link>
              <button onClick={() => { addToCart(product); removeItem(product.id); }} className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#E8F3EC] text-[#1F5D3B] text-sm font-medium hover:bg-[#1F5D3B] hover:text-white transition-all">
                <ShoppingCart className="w-4 h-4" /> Move to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
