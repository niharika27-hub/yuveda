"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Stethoscope } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1920&h=1080&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#004526]/90 via-[#1F5D3B]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8F3] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A961]/20 text-[#E4C278] text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A961]" />
              Ancient Wisdom for Modern Life
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1] mb-6"
          >
            Rooted in Nature.{" "}
            <span className="text-[#C9A961]">Powered by Ayurveda.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg"
          >
            Unlock the timeless secrets of natural medicine. Meticulously
            sourced, scientifically backed, and designed for your holistic
            well-being.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full btn-gradient text-white font-medium text-base hover:shadow-lg hover:shadow-[#1F5D3B]/30 transition-all duration-300"
            >
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/consultation"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#C9A961] text-[#C9A961] font-medium text-base hover:bg-[#C9A961] hover:text-[#251A00] transition-all duration-300"
            >
              <Stethoscope className="w-4 h-4" />
              Book Consultation
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex gap-10 mt-14"
          >
            {[
              { value: "500+", label: "Products" },
              { value: "50K+", label: "Happy Customers" },
              { value: "100%", label: "Natural" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-serif font-bold text-[#C9A961]">
                  {stat.value}
                </p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
