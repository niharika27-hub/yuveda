"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle2, Stethoscope, Leaf } from "lucide-react";

export default function ConsultationPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="pt-24 pb-16 min-h-[70vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#E8F3EC] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#1F5D3B]" />
          </div>
          <h1 className="font-serif text-3xl text-[#201B12] mb-3">Consultation Booked!</h1>
          <p className="text-[#56615B] mb-8">Our Ayurvedic expert will reach out to you shortly. Get ready for your personalized wellness journey.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full btn-gradient text-white font-medium">
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <div className="relative h-64 sm:h-72 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#004526] to-[#1F5D3B]" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 text-[#C9A961] text-sm font-medium mb-3">
                <Stethoscope className="w-4 h-4" />Your Journey to Balanced Wellness
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl text-white mb-3">Ayurvedic Consultation</h1>
              <p className="text-white/70 max-w-lg">Get personalized Ayurvedic advice from experienced practitioners. Begin your journey to holistic wellness today.</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-ambient p-8">
              <h2 className="font-serif text-2xl text-[#201B12] mb-6">Get Personalized Ayurvedic Plan</h2>
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#201B12] mb-1.5 block">Full Name</label>
                    <input required placeholder="Enter your name" className="w-full px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#201B12] mb-1.5 block">Age</label>
                    <input required type="number" placeholder="Your age" className="w-full px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#201B12] mb-1.5 block">Gender</label>
                  <select required className="w-full px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all appearance-none">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#201B12] mb-1.5 block">Health Concern</label>
                  <select required className="w-full px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all appearance-none">
                    <option value="">Select concern</option>
                    <option value="immunity">Immunity Booster</option>
                    <option value="digestive">Digestive Care</option>
                    <option value="diabetic">Diabetic Care</option>
                    <option value="cardiac">Cardiac Care</option>
                    <option value="pain">Pain Relief</option>
                    <option value="mens">Men&apos;s Health</option>
                    <option value="general">General Wellness</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#201B12] mb-1.5 block">Describe Your Condition</label>
                  <textarea required placeholder="Tell us about your health concerns, symptoms, lifestyle..." rows={4} className="w-full px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all resize-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#201B12] mb-1.5 block">
                      <Calendar className="w-4 h-4 inline mr-1" />Preferred Date
                    </label>
                    <input required type="date" className="w-full px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#201B12] mb-1.5 block">
                      <Clock className="w-4 h-4 inline mr-1" />Preferred Time
                    </label>
                    <select required className="w-full px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all appearance-none">
                      <option value="">Select time</option>
                      <option>9:00 AM - 10:00 AM</option>
                      <option>10:00 AM - 11:00 AM</option>
                      <option>11:00 AM - 12:00 PM</option>
                      <option>2:00 PM - 3:00 PM</option>
                      <option>3:00 PM - 4:00 PM</option>
                      <option>4:00 PM - 5:00 PM</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full py-4 rounded-full btn-gradient text-white font-medium text-base hover:shadow-lg hover:shadow-[#1F5D3B]/30 transition-all">
                  Book Consultation
                </button>
              </form>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 space-y-6">
            {/* Packages */}
            {[
              { title: "Initial Discovery", price: "₹499", duration: "30 min", desc: "First-time consultation to understand your Prakriti and health concerns." },
              { title: "Comprehensive Wellness", price: "₹999", duration: "60 min", desc: "Detailed health assessment with personalized Ayurvedic treatment plan." },
              { title: "Follow-up Alignment", price: "₹299", duration: "20 min", desc: "Progress review and treatment plan adjustments." },
            ].map((pkg) => (
              <div key={pkg.title} className="bg-white rounded-2xl shadow-ambient-sm p-6 hover:shadow-ambient transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-lg text-[#201B12]">{pkg.title}</h3>
                  <span className="text-lg font-bold text-[#C9A961]">{pkg.price}</span>
                </div>
                <p className="text-xs text-[#1F5D3B] font-medium mb-2">{pkg.duration} session</p>
                <p className="text-sm text-[#56615B]">{pkg.desc}</p>
              </div>
            ))}

            {/* Trust */}
            <div className="bg-[#E8F3EC] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-5 h-5 text-[#1F5D3B]" />
                <h3 className="font-serif text-lg text-[#201B12]">Why Consult with Yuveda?</h3>
              </div>
              <ul className="space-y-2 text-sm text-[#201B12]">
                {["Certified Ayurvedic practitioners", "Personalized treatment plans", "100% natural approach", "Follow-up support included"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F5D3B]" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
