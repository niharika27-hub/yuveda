"use client";

import { motion } from "framer-motion";
import { Leaf, FlaskConical, BadgeCheck, Stethoscope } from "lucide-react";

const benefits = [
  {
    icon: Leaf,
    title: "100% Natural",
    description:
      "Every ingredient sourced directly from nature. No synthetic additives ever.",
  },
  {
    icon: FlaskConical,
    title: "No Chemicals",
    description:
      "Free from artificial preservatives, colors, and harmful chemicals.",
  },
  {
    icon: BadgeCheck,
    title: "Ayurvedic Formulations",
    description:
      "Time-tested recipes from ancient Ayurvedic texts, prepared traditionally.",
  },
  {
    icon: Stethoscope,
    title: "Doctor Recommended",
    description:
      "Trusted and recommended by Ayurvedic practitioners and modern doctors.",
  },
];

export function WhyYuveda() {
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
            The Yuveda Promise
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#201B12] mt-2">
            Why Choose Yuveda
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group text-center p-8 rounded-2xl bg-white shadow-ambient-sm hover:shadow-ambient transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#E8F3EC] flex items-center justify-center mx-auto mb-5 group-hover:bg-[#1F5D3B] transition-colors duration-300">
                <b.icon className="w-7 h-7 text-[#1F5D3B] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-lg text-[#201B12] mb-2">
                {b.title}
              </h3>
              <p className="text-sm text-[#56615B] leading-relaxed">
                {b.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
