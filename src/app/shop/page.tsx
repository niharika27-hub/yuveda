"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Heart, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { products, Product } from "@/lib/products";
import { categories } from "@/lib/categories";
import { concerns } from "@/lib/concerns";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addWish, removeItem: removeWish, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link
        href={`/product/${product.id}`}
        className="block bg-white rounded-2xl overflow-hidden shadow-ambient-sm hover:shadow-ambient transition-all duration-500 hover:-translate-y-1"
      >
        <div className="relative h-52 overflow-hidden bg-[#F2E6D7]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1F5D3B] text-white text-xs font-medium">
              {product.badge}
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              wishlisted ? removeWish(product.id) : addWish(product);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${
                wishlisted ? "fill-red-500 text-red-500" : "text-[#201B12]"
              }`}
            />
          </button>
        </div>
        <div className="p-4">
          <p className="text-xs text-[#56615B] mb-1">{product.category}</p>
          <h3 className="font-serif text-base text-[#201B12] font-medium mb-2 group-hover:text-[#1F5D3B] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-[#56615B] mb-3 line-clamp-2">
            {product.shortDescription}
          </p>
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, j) => (
                <Star
                  key={j}
                  className={`w-3 h-3 ${
                    j < Math.floor(product.rating)
                      ? "fill-[#C9A961] text-[#C9A961]"
                      : "text-[#EDE1D2]"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-[#56615B]">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#1F5D3B]">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-[#56615B] line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
      <button
        onClick={() => addItem(product)}
        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#E8F3EC] text-[#1F5D3B] text-sm font-medium hover:bg-[#1F5D3B] hover:text-white transition-all duration-300"
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
    </motion.div>
  );
}

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.categorySlug));
    }
    if (selectedConcerns.length > 0) {
      result = result.filter((p) =>
        p.concerns.some((c) => selectedConcerns.includes(c))
      );
    }
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [selectedCategories, selectedConcerns, priceRange, sortBy]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const toggleConcern = (slug: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-serif text-lg text-[#201B12] mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat.slug}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                  selectedCategories.includes(cat.slug)
                    ? "bg-[#1F5D3B] border-[#1F5D3B]"
                    : "border-[#c0c9bf] group-hover:border-[#1F5D3B]"
                }`}
              >
                {selectedCategories.includes(cat.slug) && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12">
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#201B12] group-hover:text-[#1F5D3B] transition-colors">
                {cat.name}
              </span>
              <span className="text-xs text-[#56615B] ml-auto">
                ({cat.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Concerns */}
      <div>
        <h3 className="font-serif text-lg text-[#201B12] mb-3">
          Health Concern
        </h3>
        <div className="space-y-2">
          {concerns.map((con) => (
            <label
              key={con.slug}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                  selectedConcerns.includes(con.slug)
                    ? "bg-[#1F5D3B] border-[#1F5D3B]"
                    : "border-[#c0c9bf] group-hover:border-[#1F5D3B]"
                }`}
              >
                {selectedConcerns.includes(con.slug) && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12">
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#201B12] group-hover:text-[#1F5D3B] transition-colors">
                {con.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-serif text-lg text-[#201B12] mb-3">Price Range</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
            className="w-20 px-3 py-2 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:ring-1 focus:ring-[#1F5D3B]/20"
            placeholder="Min"
          />
          <span className="text-[#56615B]">—</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-20 px-3 py-2 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:ring-1 focus:ring-[#1F5D3B]/20"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Clear */}
      {(selectedCategories.length > 0 ||
        selectedConcerns.length > 0 ||
        priceRange[0] > 0 ||
        priceRange[1] < 1000) && (
        <button
          onClick={() => {
            setSelectedCategories([]);
            setSelectedConcerns([]);
            setPriceRange([0, 1000]);
          }}
          className="text-sm text-[#C9A961] hover:text-[#1F5D3B] transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-[#56615B] mb-3">
            <Link href="/" className="hover:text-[#1F5D3B]">Home</Link>
            <span>/</span>
            <span className="text-[#201B12]">Shop</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#201B12]">
            All Products
          </h1>
          <p className="text-[#56615B] mt-2">
            {filteredProducts.length} products available
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <FilterSidebar />
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-ambient-sm text-sm font-medium"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-[#56615B] hidden sm:block">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-2.5 pr-8 rounded-xl bg-white shadow-ambient-sm text-sm font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="name">Name</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#56615B] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[#56615B] text-lg">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedConcerns([]);
                    setPriceRange([0, 1000]);
                  }}
                  className="mt-4 text-[#1F5D3B] font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-[#FFF8F3] z-50 p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-xl">Filters</h2>
                <button onClick={() => setFiltersOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
