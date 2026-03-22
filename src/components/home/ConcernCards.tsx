"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { concerns } from "@/lib/concerns";
import {
  Shield,
  Flame,
  Activity,
  Heart,
  Zap,
  Dumbbell,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Flame,
  Activity,
  Heart,
  Zap,
  Dumbbell,
};

export function ConcernCards() {
  return (
    <section className="py-20 bg-[#FFF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-[#C9A961] text-sm font-medium tracking-wider uppercase">
            Targeted Solutions
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#201B12] mt-2">
            Shop by Concern
          </h2>
          <p className="text-[#56615B] mt-3 max-w-xl mx-auto">
            Find the right Ayurvedic solutions tailored to your specific health
            needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {concerns.map((concern, i) => {
            const Icon = iconMap[concern.icon] || Shield;
            return (
              <motion.div
                key={concern.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={`/concern/${concern.slug}`}
                  className="group block p-6 bg-white rounded-2xl shadow-ambient-sm hover:shadow-ambient transition-all duration-500 hover:-translate-y-1"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: concern.color + "15" }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: concern.color }}
                    />
                  </div>
                  <h3 className="font-serif text-xl text-[#201B12] mb-2 group-hover:text-[#1F5D3B] transition-colors">
                    {concern.name}
                  </h3>
                  <p className="text-sm text-[#56615B] leading-relaxed line-clamp-2">
                    {concern.description}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[#C9A961] group-hover:gap-2 transition-all">
                    Explore Solutions →
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
