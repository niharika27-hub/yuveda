"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-[70vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#E8F3EC] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-[#1F5D3B]" />
          </div>
          <h1 className="font-serif text-3xl text-[#201B12] mb-3">Your Cart is Empty</h1>
          <p className="text-[#56615B] mb-8">Looks like you haven&apos;t added any products yet.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full btn-gradient text-white font-medium hover:shadow-lg transition-all">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-[#56615B] mb-3">
          <Link href="/" className="hover:text-[#1F5D3B]">Home</Link>
          <span>/</span><span className="text-[#201B12]">Cart</span>
        </div>
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-serif text-4xl text-[#201B12]">Shopping Cart</h1>
          <button onClick={clearCart} className="text-sm text-[#56615B] hover:text-red-500 transition-colors">Clear Cart</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div key={item.product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex gap-5 p-5 bg-white rounded-2xl shadow-ambient-sm"
              >
                <Link href={`/product/${item.product.id}`} className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#F2E6D7] flex-shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#56615B]">{item.product.category}</p>
                      <Link href={`/product/${item.product.id}`} className="font-serif text-base sm:text-lg text-[#201B12] hover:text-[#1F5D3B] transition-colors">{item.product.name}</Link>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#56615B] hover:text-red-500 transition-colors flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-0 bg-[#F2E6D7] rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[#EDE1D2]">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[#EDE1D2]">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-lg font-bold text-[#1F5D3B]">₹{item.product.price * item.quantity}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-2xl shadow-ambient p-6">
              <h2 className="font-serif text-xl text-[#201B12] mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[#56615B]">Subtotal</span><span className="font-medium">₹{getTotal()}</span></div>
                <div className="flex justify-between"><span className="text-[#56615B]">Shipping</span><span className="text-[#1F5D3B] font-medium">Free</span></div>
                <div className="flex justify-between"><span className="text-[#56615B]">Tax (GST 18%)</span><span className="font-medium">₹{Math.round(getTotal() * 0.18)}</span></div>
              </div>
              <div className="border-t border-[#EDE1D2] mt-5 pt-5">
                <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-[#1F5D3B]">₹{Math.round(getTotal() * 1.18)}</span></div>
              </div>
              {/* Coupon */}
              <div className="mt-6">
                <div className="flex gap-2">
                  <input type="text" placeholder="Coupon code" className="flex-1 px-4 py-2.5 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:ring-1 focus:ring-[#1F5D3B]/20" />
                  <button className="px-4 py-2.5 rounded-xl bg-[#E8F3EC] text-[#1F5D3B] text-sm font-medium hover:bg-[#1F5D3B] hover:text-white transition-all">Apply</button>
                </div>
              </div>
              <Link href="/checkout" className="block w-full mt-6 py-4 rounded-full btn-gradient text-white text-center font-medium hover:shadow-lg hover:shadow-[#1F5D3B]/30 transition-all">
                Proceed to Checkout
              </Link>
              <Link href="/shop" className="block w-full mt-3 py-3 text-center text-sm text-[#56615B] hover:text-[#1F5D3B] transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
