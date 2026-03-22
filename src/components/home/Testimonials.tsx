"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Yuveda's Triphala Churna has completely transformed my digestion. I've been using it for 3 months and the results are incredible. Highly recommended!",
    avatar: "PS",
  },
  {
    name: "Rajesh Kumar",
    location: "Delhi",
    rating: 5,
    text: "The Ashwagandha KSM-66 capsules are outstanding. My stress levels have reduced significantly and I sleep much better now. Great quality!",
    avatar: "RK",
  },
  {
    name: "Anita Patel",
    location: "Ahmedabad",
    rating: 4,
    text: "I love the Chyawanprash. It tastes great and my family's immunity has improved noticeably. Haven't caught a cold this season!",
    avatar: "AP",
  },
  {
    name: "Vikram Singh",
    location: "Jaipur",
    rating: 5,
    text: "The Mahanarayan Tail is a miracle worker for my knee pain. After just 2 weeks of regular use, I can walk comfortably. Thank you Yuveda!",
    avatar: "VS",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-[#1F5D3B] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#004526]/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C9A961]/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-[#C9A961] text-sm font-medium tracking-wider uppercase">
            Real Stories
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-white mt-2">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-colors duration-300"
            >
              <Quote className="w-8 h-8 text-[#C9A961]/40 mb-4" />
              <p className="text-white/80 text-sm leading-relaxed mb-5">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-3.5 h-3.5 ${
                      j < t.rating
                        ? "fill-[#C9A961] text-[#C9A961]"
                        : "text-white/20"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A961] flex items-center justify-center text-[#251A00] font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
