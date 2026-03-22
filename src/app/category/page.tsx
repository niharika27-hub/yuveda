"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "@/lib/categories";
import { Beaker, Cookie, Pill, Droplets, Leaf, GlassWater, Wine } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Beaker, Cookie, Pill, Droplets, Leaf, GlassWater, Wine };

export default function CategoriesIndexPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-[#56615B] mb-3">
          <Link href="/" className="hover:text-[#1F5D3B]">Home</Link>
          <span>/</span><span className="text-[#201B12]">Categories</span>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#201B12] mb-3">Shop by Category</h1>
          <p className="text-[#56615B] max-w-xl">Explore our curated range of traditional Ayurvedic formulations.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Leaf;
            return (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link href={`/category/${cat.slug}`} className="group block overflow-hidden rounded-2xl shadow-ambient-sm hover:shadow-ambient transition-all duration-500 hover:-translate-y-1">
                  <div className="relative h-44 overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#004526]/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h2 className="font-serif text-lg text-white font-medium">{cat.name}</h2>
                          <p className="text-white/60 text-xs">{cat.productCount} Products</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="glass-grid-panel rounded-b-2xl p-4">
                    <p className="text-xs text-[#56615B] line-clamp-2">{cat.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
