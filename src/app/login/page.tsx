"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Leaf } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF8F3] to-[#FEF2E3]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004526] to-[#1F5D3B] flex items-center justify-center">
              <span className="text-white font-serif text-xl font-bold">Y</span>
            </div>
            <span className="font-serif text-2xl font-bold text-[#004526]">Yuveda</span>
          </Link>
          <h1 className="font-serif text-3xl text-[#201B12]">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-[#56615B] mt-2 text-sm">
            {isLogin ? "Sign in to continue your wellness journey" : "Join us on the path to holistic wellness"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-ambient p-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-[#201B12] mb-1.5 block">Full Name</label>
                <input placeholder="Enter your name" className="w-full px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all" />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-[#201B12] mb-1.5 block">Email</label>
              <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all" />
            </div>
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-[#201B12] mb-1.5 block">Phone</label>
                <input type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all" />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-[#201B12] mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Enter password" className="w-full px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#56615B] hover:text-[#201B12]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-[#c0c9bf]" />
                  <span className="text-[#56615B]">Remember me</span>
                </label>
                <button className="text-[#C9A961] hover:text-[#1F5D3B] transition-colors">Forgot password?</button>
              </div>
            )}
            <button type="submit" className="w-full py-3.5 rounded-full btn-gradient text-white font-medium hover:shadow-lg hover:shadow-[#1F5D3B]/30 transition-all">
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#56615B]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLogin(!isLogin)} className="ml-1 text-[#1F5D3B] font-medium hover:text-[#004526]">
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#56615B] mt-6 flex items-center justify-center gap-1">
          <Leaf className="w-3 h-3 text-[#1F5D3B]" /> Secured by Yuveda Wellness
        </p>
      </motion.div>
    </div>
  );
}
