"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { concerns } from "@/lib/concerns";
import { Shield, Flame, Activity, Heart, Zap, Dumbbell } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Shield, Flame, Activity, Heart, Zap, Dumbbell };

export default function ConcernsIndexPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-[#56615B] mb-3">
          <Link href="/" className="hover:text-[#1F5D3B]">Home</Link>
          <span>/</span><span className="text-[#201B12]">Health Concerns</span>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#201B12] mb-3">Shop by Concern</h1>
          <p className="text-[#56615B] max-w-xl">Find targeted Ayurvedic solutions for your specific health needs.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {concerns.map((concern, i) => {
            const Icon = iconMap[concern.icon] || Shield;
            return (
              <motion.div key={concern.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link href={`/concern/${concern.slug}`} className="group block overflow-hidden rounded-2xl shadow-ambient-sm hover:shadow-ambient transition-all duration-500 hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden bg-[#F7F0E6]">
                    <img src={concern.image} alt={concern.name} className="w-full h-full object-contain" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black/35 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="font-serif text-xl text-white" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.65)" }}>
                          {concern.name}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <p className="text-sm text-[#56615B] line-clamp-2">{concern.description}</p>
                    <span className="inline-block mt-3 text-sm font-medium text-[#C9A961]">Explore →</span>
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
