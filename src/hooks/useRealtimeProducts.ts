"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchProductsFromSupabase,
  Product,
  subscribeProductsRealtime,
} from "@/lib/products-live";

export function useRealtimeProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setError(null);
      const liveProducts = await fetchProductsFromSupabase();
      setProducts(liveProducts);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load products";
      setError(message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
    const unsubscribe = subscribeProductsRealtime(() => {
      void loadProducts();
    });

    return unsubscribe;
  }, [loadProducts]);

  return { products, loading, error, refresh: loadProducts };
}
