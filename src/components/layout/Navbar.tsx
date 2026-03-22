"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { searchProducts, Product } from "@/lib/products";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  {
    href: "/category",
    label: "Categories",
    children: [
      { href: "/category/churna", label: "Churna" },
      { href: "/category/pak", label: "Pak" },
      { href: "/category/capsules", label: "Capsules" },
      { href: "/category/oils", label: "Oils" },
      { href: "/category/powders", label: "Powders" },
      { href: "/category/juices", label: "Juices" },
      { href: "/category/syrups", label: "Syrups" },
    ],
  },
  { href: "/concern", label: "Concerns" },
  { href: "/consultation", label: "Consultation" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setSearchResults(searchProducts(searchQuery).slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass shadow-ambient py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#004526] to-[#1F5D3B] flex items-center justify-center">
                <span className="text-white font-serif text-lg font-bold">Y</span>
              </div>
              <span className="font-serif text-2xl font-bold text-[#004526] tracking-tight group-hover:text-[#1F5D3B] transition-colors">
                Yuveda
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() =>
                    link.children && setActiveDropdown(link.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-[#201B12] hover:text-[#1F5D3B] transition-colors rounded-full hover:bg-[#E8F3EC]/60 flex items-center gap-1"
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.children && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-48 py-2 bg-white rounded-2xl shadow-ambient-lg overflow-hidden"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-[#201B12] hover:bg-[#E8F3EC] hover:text-[#1F5D3B] transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2.5 rounded-full hover:bg-[#E8F3EC]/60 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-[#201B12]" />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-ambient-lg overflow-hidden"
                    >
                      <div className="p-3">
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#F2E6D7] rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all placeholder:text-[#56615B]"
                          autoFocus
                        />
                      </div>
                      {searchResults.length > 0 && (
                        <div className="px-2 pb-2">
                          {searchResults.map((product) => (
                            <Link
                              key={product.id}
                              href={`/product/${product.id}`}
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FEF2E3] transition-colors"
                            >
                              <div className="w-10 h-10 rounded-lg bg-[#E8F3EC] overflow-hidden flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#201B12] truncate">
                                  {product.name}
                                </p>
                                <p className="text-xs text-[#C9A961] font-medium">
                                  ₹{product.price}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2.5 rounded-full hover:bg-[#E8F3EC]/60 transition-colors relative hidden sm:flex"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-[#201B12]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#C9A961] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2.5 rounded-full hover:bg-[#E8F3EC]/60 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-[#201B12]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#1F5D3B] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <Link
                href="/login"
                className="p-2.5 rounded-full hover:bg-[#E8F3EC]/60 transition-colors hidden sm:flex"
                aria-label="Account"
              >
                <User className="w-5 h-5 text-[#201B12]" />
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-full hover:bg-[#E8F3EC]/60 transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-[#FFF8F3] pt-24 px-6 lg:hidden overflow-y-auto"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3.5 text-lg font-medium text-[#201B12] hover:text-[#1F5D3B] hover:bg-[#E8F3EC] rounded-xl transition-colors"
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-6 space-y-0.5 mt-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-[#56615B] hover:text-[#1F5D3B] hover:bg-[#E8F3EC] rounded-xl transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-4">
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E8F3EC] text-[#1F5D3B] font-medium"
              >
                <Heart className="w-4 h-4" /> Wishlist
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1F5D3B] text-white font-medium"
              >
                <User className="w-4 h-4" /> Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
