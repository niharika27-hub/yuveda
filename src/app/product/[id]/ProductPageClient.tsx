"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Minus, Plus, ShieldCheck, Truck, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import { getProductByIdFromList, getRelatedProductsFromList, Product } from "@/lib/products-live";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notFound } from "next/navigation";
import { useRealtimeProducts } from "@/hooks/useRealtimeProducts";

function RelatedCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <div className="group">
      <Link
        href={`/product/${product.id}`}
        className="block bg-white rounded-2xl overflow-hidden shadow-ambient-sm hover:shadow-ambient transition-all duration-500 hover:-translate-y-1"
      >
        <div className="h-44 overflow-hidden bg-[#F2E6D7]">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>
        <div className="p-4">
          <p className="text-xs text-[#56615B] mb-1">{product.category}</p>
          <h3 className="font-serif text-sm text-[#201B12] font-medium line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1 mt-1.5 mb-2">
            {[...Array(5)].map((_, j) => (
              <Star key={j} className={`w-3 h-3 ${j < Math.floor(product.rating) ? "fill-[#C9A961] text-[#C9A961]" : "text-[#EDE1D2]"}`} />
            ))}
          </div>
          <span className="text-base font-bold text-[#1F5D3B]">₹{product.price}</span>
        </div>
      </Link>
      <button onClick={() => addItem(product)} className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#E8F3EC] text-[#1F5D3B] text-xs font-medium hover:bg-[#1F5D3B] hover:text-white transition-all">
        <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
      </button>
    </div>
  );
}

export function ProductPageClient({ id }: { id: string }) {
  const { products, loading, error } = useRealtimeProducts();
  const product = useMemo(() => getProductByIdFromList(products, id), [products, id]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addWish, removeItem: removeWish, isInWishlist } = useWishlistStore();

  if (!loading && !product) {
    notFound();
  }

  if (loading || !product) {
    return (
      <div className="pt-28 pb-16 px-4 text-center text-[#56615B]">
        Loading live product details...
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const related = getRelatedProductsFromList(products, product);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#56615B] mb-8">
          <Link href="/" className="hover:text-[#1F5D3B]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#1F5D3B]">Shop</Link>
          <span>/</span>
          <Link href={`/category/${product.categorySlug}`} className="hover:text-[#1F5D3B]">{product.category}</Link>
          <span>/</span>
          <span className="text-[#201B12]">{product.name}</span>
        </div>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-2xl overflow-hidden bg-[#F2E6D7] aspect-square mb-4 group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-[#1F5D3B] text-white text-sm font-medium">{product.badge}</span>
              )}
              {product.images.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => setSelectedImage((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden transition-all ${selectedImage === i ? "ring-2 ring-[#1F5D3B] ring-offset-2" : "opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-sm text-[#C9A961] font-medium">{product.category}</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#201B12] mt-1 mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < Math.floor(product.rating) ? "fill-[#C9A961] text-[#C9A961]" : "text-[#EDE1D2]"}`} />
                ))}
              </div>
              <span className="text-sm text-[#201B12] font-medium">{product.rating}</span>
              <span className="text-sm text-[#56615B]">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#1F5D3B]">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-[#56615B] line-through">₹{product.originalPrice}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C9A961]/20 text-[#C9A961] text-sm font-bold">{discount}% OFF</span>
                </>
              )}
            </div>

            <p className="text-[#56615B] leading-relaxed mb-8">{product.shortDescription}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-[#201B12]">Quantity:</span>
              <div className="flex items-center gap-0 bg-[#F2E6D7] rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-[#EDE1D2] transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-[#EDE1D2] transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => addItem(product, quantity)}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full btn-gradient text-white font-medium hover:shadow-lg hover:shadow-[#1F5D3B]/30 transition-all"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button
                onClick={() => wishlisted ? removeWish(product.id) : addWish(product)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${wishlisted ? "bg-red-50 text-red-500" : "bg-[#F2E6D7] text-[#201B12] hover:bg-[#E8F3EC]"}`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            <Link
              href="/checkout"
              onClick={() => addItem(product, quantity)}
              className="block w-full py-4 rounded-full border-2 border-[#C9A961] text-center text-[#C9A961] font-medium hover:bg-[#C9A961] hover:text-[#251A00] transition-all"
            >
              Buy Now
            </Link>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-[#EDE1D2]">
              {[
                { icon: Leaf, text: "100% Ayurvedic" },
                { icon: ShieldCheck, text: "Lab Tested" },
                { icon: Truck, text: "Free Shipping" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2 text-sm text-[#56615B]">
                  <badge.icon className="w-4 h-4 text-[#1F5D3B]" />
                  {badge.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mb-20">
          <TabsList className="w-full justify-start bg-[#FEF2E3] rounded-2xl p-1.5 h-auto flex-wrap">
            {["Description", "Ingredients", "Benefits", "How to Use", "Reviews"].map((tab) => (
              <TabsTrigger key={tab} value={tab.toLowerCase().replace(/ /g, "-")} className="rounded-xl py-2.5 px-5 text-sm data-[state=active]:bg-white data-[state=active]:text-[#1F5D3B] data-[state=active]:shadow-ambient-sm">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-8 max-w-3xl">
            <TabsContent value="description">
              <p className="text-[#201B12] leading-relaxed">{product.description}</p>
            </TabsContent>

            <TabsContent value="ingredients">
              <ul className="space-y-2">
                {product.ingredients.map((ing) => (
                  <li key={ing} className="flex items-start gap-2 text-[#201B12]">
                    <Leaf className="w-4 h-4 text-[#1F5D3B] mt-0.5 flex-shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="benefits">
              <ul className="space-y-2">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[#201B12]">
                    <ShieldCheck className="w-4 h-4 text-[#C9A961] mt-0.5 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="how-to-use">
              <p className="text-[#201B12] leading-relaxed">{product.usage}</p>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <p className="text-4xl font-serif font-bold text-[#1F5D3B]">{product.rating}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < Math.floor(product.rating) ? "fill-[#C9A961] text-[#C9A961]" : "text-[#EDE1D2]"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-[#56615B] mt-1">{product.reviews} reviews</p>
                </div>
              </div>
              <p className="text-[#56615B]">Customer reviews will appear here.</p>
            </TabsContent>
          </div>
        </Tabs>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl text-[#201B12] mb-8">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
