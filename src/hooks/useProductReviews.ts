"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { hasSupabasePublicEnv, supabase } from "@/lib/supabase/client";

export type ProductReview = {
  id: string;
  product_id: string;
  product_name: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export function useProductReviews(productId?: string, limit: number = 12) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (productId) params.set("product_id", productId);
    return params.toString();
  }, [limit, productId]);

  const loadReviews = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/reviews?${queryString}`, { cache: "no-store" });
      const result = (await response.json()) as {
        reviews?: ProductReview[];
        error?: string;
      };
      if (!response.ok) {
        throw new Error(result.error ?? "Unable to load reviews.");
      }
      setReviews(result.reviews ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    void loadReviews();

    if (!hasSupabasePublicEnv) {
      return undefined;
    }

    const suffix =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const channel = supabase
      .channel(`product-reviews-live-${suffix}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "product_reviews",
          filter: productId ? `product_id=eq.${productId}` : undefined,
        },
        () => {
          void loadReviews();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadReviews, productId]);

  return { reviews, loading, error, refresh: loadReviews };
}
