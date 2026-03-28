import { supabase } from "@/lib/supabase/client";
import { products as fallbackCatalog } from "@/lib/products";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  description: string;
  shortDescription: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
  image: string;
  images: string[];
  concerns: string[];
  inStock: boolean;
  featured: boolean;
  badge?: string;
}

type CategoryRow = {
  "Product Name": string;
  Category: string | null;
  Quantity: string | null;
  Price: string | null;
  images: string[] | null;
};

type ConcernRow = {
  "Product Name": string;
  Concern: string | null;
  Quantity: string | null;
  Price: number | null;
  images: string[] | null;
};

const blankProductImage = "/blank-product.svg";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function categoryToSlug(value: string): string {
  const normalized = value.toLowerCase().trim();

  const mapping: Array<{ match: RegExp; slug: string }> = [
    { match: /churna/, slug: "churna" },
    { match: /pak/, slug: "pak" },
    { match: /capsule/, slug: "capsules" },
    { match: /oil|tail/, slug: "oils" },
    { match: /powder/, slug: "powders" },
    { match: /juice/, slug: "juices" },
    { match: /syrup|arishta|asava/, slug: "syrups" },
  ];

  const found = mapping.find((entry) => entry.match.test(normalized));
  return found?.slug ?? slugify(value);
}

function concernToSlug(value: string): string {
  const normalized = value.toLowerCase().trim();

  const mapping: Array<{ match: RegExp; slug: string }> = [
    { match: /immun/, slug: "immunity-booster" },
    { match: /digest|gut|constipat/, slug: "digestive-care" },
    { match: /diabet|sugar|glucose/, slug: "diabetic-care" },
    { match: /heart|cardiac|cholesterol|bp|blood pressure/, slug: "cardiac-care" },
    { match: /pain|joint|muscle|inflamm/, slug: "pain-relief" },
    { match: /men|male|vitality|testosterone/, slug: "mens-health" },
  ];

  const found = mapping.find((entry) => entry.match.test(normalized));
  return found?.slug ?? slugify(value);
}

function parsePrice(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const parsed = Number.parseFloat(cleaned);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.round(parsed));
    }
  }

  return 0;
}

function parseImages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
}

function isNetworkLikeError(message: string): boolean {
  return /failed to fetch|fetch failed|networkerror|load failed/i.test(message);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type QueryResult<T> = {
  data: T[];
  errorMessage: string | null;
};

async function queryWithRetry<T>(
  runQuery: () => Promise<{ data: T[] | null; error: { message: string } | null }>,
  attempts: number = 3
): Promise<QueryResult<T>> {
  let lastErrorMessage: string | null = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let data: T[] | null = null;
    let error: { message: string } | null = null;

    try {
      const result = await runQuery();
      data = result.data;
      error = result.error;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      error = { message };
    }

    if (!error) {
      return { data: data ?? [], errorMessage: null };
    }

    lastErrorMessage = error.message;
    const shouldRetry = isNetworkLikeError(error.message) && attempt < attempts;

    if (!shouldRetry) {
      break;
    }

    await sleep(250 * attempt);
  }

  return { data: [], errorMessage: lastErrorMessage };
}

function hashCode(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function makeBenefits(concerns: string[], category: string): string[] {
  const concernBenefits: Record<string, string[]> = {
    "immunity-booster": ["Supports natural immunity", "Rich in antioxidant support"],
    "digestive-care": ["Promotes digestive comfort", "Helps maintain regular metabolism"],
    "diabetic-care": ["Supports healthy glucose metabolism", "Helps maintain daily energy balance"],
    "cardiac-care": ["Supports cardiovascular wellness", "Helps maintain heart vitality"],
    "pain-relief": ["Helps with joint and muscle comfort", "Supports flexibility and movement"],
    "mens-health": ["Supports stamina and vitality", "Promotes strength and recovery"],
  };

  const items = concerns.flatMap((concern) => concernBenefits[concern] ?? []);

  return items.length > 0
    ? Array.from(new Set(items)).slice(0, 5)
    : [
        `Traditional ${category} support`,
        "Helps maintain overall wellness",
        "Suitable for daily wellness routines",
      ];
}

function buildProduct(
  name: string,
  category: string,
  categorySlug: string,
  quantity: string,
  price: number,
  concerns: string[],
  customImages?: string[]
): Product {
  const id = slugify(name);
  const stable = hashCode(name);
  const rating = 4.1 + (stable % 9) / 10;
  const reviews = 40 + (stable % 460);
  const featured = stable % 4 === 0;
  const originalPrice = Math.max(price, Math.round(price * 1.2));
  const fallbackImage = blankProductImage;
  const images = customImages && customImages.length > 0 ? customImages : [fallbackImage];
  const image = images[0] ?? fallbackImage;

  return {
    id,
    slug: id,
    name,
    category,
    categorySlug,
    price,
    originalPrice,
    rating: Number(rating.toFixed(1)),
    reviews,
    description: `${name} is sourced from your live Supabase catalog and curated in our ${category} range for everyday Ayurvedic wellness support.`,
    shortDescription: `${name} • ${quantity || "Standard pack"}`,
    ingredients: [name, "Traditional Ayurvedic herbs"],
    benefits: makeBenefits(concerns, category),
    usage: "Use as directed on label or as advised by your Ayurvedic practitioner.",
    image,
    images,
    concerns,
    inStock: true,
    featured,
    badge: featured ? "Live" : undefined,
  };
}

export async function fetchProductsFromSupabase(): Promise<Product[]> {
  const [categoryResult, concernResult] = await Promise.all([
    queryWithRetry(async () =>
      await supabase
        .from("products_by_category")
        .select('"Product Name",Category,Quantity,Price,images')
    ),
    queryWithRetry(async () =>
      await supabase
        .from("products_by_concern")
        .select('"Product Name",Concern,Quantity,Price,images')
    ),
  ]);

  const categoryData = categoryResult.data as CategoryRow[];
  const concernData = concernResult.data as ConcernRow[];

  if (categoryResult.errorMessage && concernResult.errorMessage) {
    console.error(
      "Supabase product fetch failed for both tables. Falling back to local catalog.",
      {
        categoryError: categoryResult.errorMessage,
        concernError: concernResult.errorMessage,
      }
    );
    return [...fallbackCatalog];
  }

  if (categoryData.length === 0 && concernData.length === 0) {
    return [...fallbackCatalog];
  }

  const concernsByName = new Map<string, Set<string>>();
  const priceByName = new Map<string, number>();
  const imagesByName = new Map<string, string[]>();

  for (const row of concernData) {
    const name = (row["Product Name"] ?? "").trim();
    if (!name) continue;

    const key = normalizeName(name);
    const mappedConcern = row.Concern ? concernToSlug(row.Concern) : null;

    if (mappedConcern) {
      if (!concernsByName.has(key)) {
        concernsByName.set(key, new Set());
      }
      concernsByName.get(key)?.add(mappedConcern);
    }

    const parsed = parsePrice(row.Price);
    if (parsed > 0) {
      priceByName.set(key, parsed);
    }

    const parsedImages = parseImages(row.images);
    if (parsedImages.length > 0) {
      imagesByName.set(key, parsedImages);
    }
  }

  const productsByName = new Map<string, Product>();

  for (const row of categoryData) {
    const name = (row["Product Name"] ?? "").trim();
    if (!name) continue;

    const key = normalizeName(name);
    const category = (row.Category ?? "General Wellness").trim() || "General Wellness";
    const categorySlug = categoryToSlug(category);
    const quantity = (row.Quantity ?? "").trim();
    const price = parsePrice(row.Price) || priceByName.get(key) || 0;
    const concerns = Array.from(concernsByName.get(key) ?? []);
    const images = parseImages(row.images);
    const mergedImages = images.length > 0 ? images : imagesByName.get(key) ?? [];

    productsByName.set(
      key,
      buildProduct(name, category, categorySlug, quantity, price, concerns, mergedImages)
    );
  }

  for (const row of concernData) {
    const name = (row["Product Name"] ?? "").trim();
    if (!name) continue;

    const key = normalizeName(name);
    if (productsByName.has(key)) continue;

    const concerns = Array.from(concernsByName.get(key) ?? []);
    const price = parsePrice(row.Price) || 0;
    const quantity = (row.Quantity ?? "").trim();
    const images = parseImages(row.images);

    productsByName.set(
      key,
      buildProduct(name, "General Wellness", "general", quantity, price, concerns, images)
    );
  }

  return Array.from(productsByName.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export function getProductsByCategoryFromList(
  products: Product[],
  categorySlug: string
): Product[] {
  return products.filter((product) => product.categorySlug === categorySlug);
}

export function getProductsByConcernFromList(
  products: Product[],
  concernSlug: string
): Product[] {
  return products.filter((product) => product.concerns.includes(concernSlug));
}

export function getProductByIdFromList(
  products: Product[],
  id: string
): Product | undefined {
  return products.find((product) => product.id === id || product.slug === id);
}

export function getRelatedProductsFromList(
  products: Product[],
  target: Product,
  limit: number = 4
): Product[] {
  return products
    .filter(
      (product) =>
        product.id !== target.id &&
        (product.categorySlug === target.categorySlug ||
          product.concerns.some((concern) => target.concerns.includes(concern)))
    )
    .slice(0, limit);
}

export function searchProductsInList(products: Product[], query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      product.shortDescription.toLowerCase().includes(q)
  );
}

export function subscribeProductsRealtime(onChange: () => void): () => void {
  const byCategory = supabase
    .channel("products-by-category-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products_by_category" },
      () => onChange()
    )
    .subscribe();

  const byConcern = supabase
    .channel("products-by-concern-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products_by_concern" },
      () => onChange()
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(byCategory);
    void supabase.removeChannel(byConcern);
  };
}
