"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "@/lib/categories";
import {
  Beaker,
  Cookie,
  Pill,
  Droplets,
  Leaf,
  GlassWater,
  Wine,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Beaker: Beaker,
  Cookie: Cookie,
  Pill: Pill,
  Droplets: Droplets,
  Leaf: Leaf,
  GlassWater: GlassWater,
  Wine: Wine,
};

export function CategoryGrid() {
  return (
    <section className="py-20 bg-[#FEF2E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-[#C9A961] text-sm font-medium tracking-wider uppercase">
            Explore Our Range
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#201B12] mt-2">
            Shop by Category
          </h2>
          <p className="text-[#56615B] mt-3 max-w-xl mx-auto">
            Discover our curated collection of traditional Ayurvedic
            formulations, each crafted with care.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Leaf;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="group block relative bg-[#2D7A4E] rounded-2xl overflow-hidden shadow-ambient hover:shadow-ambient-lg hover:bg-[#1F5D3B] transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#004526]/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-serif text-lg text-white font-medium">
                            {cat.name}
                          </h3>
                          <p className="text-white/60 text-xs">
                            {cat.productCount} Products
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#2D7A4E] p-4">
                    <p className="text-white text-sm leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
