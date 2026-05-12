import { hasSupabasePublicEnv, supabase } from "@/lib/supabase/client";
import { products as fallbackCatalog } from "@/lib/products";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  priceLabel: string;
  priceVariants: PriceVariant[];
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

export interface PriceVariant {
  quantity: string;
  price: number;
  priceLabel: string;
}

type CategoryRow = {
  "Product Name": string;
  Category: string | null;
  Quantity: string | null;
  Price: string | null;
  images: string[] | null;
  status?: string | null;
  stock_quantity?: number | null;
  featured?: boolean | null;
};

type ConcernRow = {
  "Product Name": string;
  Concern: string | null;
  Quantity: string | null;
  Price: number | null;
  images: string[] | null;
};

const blankProductImage = "/blank-product.svg";

const productImageByName: Record<string, string> = {
  "active energy": "/productimages/active_energy.jpeg",
  "active energy syrup": "/productimages/active_energy.jpeg",
  "aloe vera juice": "/productimages/Aloevera_sawaras.jpeg",
  "amba haldi powder": "/productimages/Haridra_khand.jpeg",
  "amla": "/productimages/amla_powder.jpeg",
  "amla capsule": "/productimages/Amla_kashaye%27.jpeg",
  "amla churna": "/productimages/amla_powder.jpeg",
  "amla juice": "/productimages/amla_powder.jpeg",
  "amla powder": "/productimages/amla_powder.jpeg",
  "amla reetha shikakai": "/productimages/amla_reetha.jpeg",
  "amla reetha shikakai powder": "/productimages/amla_reetha.jpeg",
  "arjuna capsule": "/productimages/Arjuna_kashaye.jpeg",
  "arjuna juice": "/productimages/Arjuna_kashaye.jpeg",
  "arjuna kashaya": "/productimages/Arjuna_kashaye.jpeg",
  "arjuna powder": "/productimages/ArjunChal_powder.jpeg",
  "arjun chaal": "/productimages/ArjunChal_powder.jpeg",
  "arthofit oil": "/productimages/Arthofit_SN_oil.jpeg",
  "ashwagandha": "/productimages/Ashwagandha_kashaye.jpeg",
  "ashwagandha capsule": "/productimages/Ashwagandha_kashaye.jpeg",
  "ashwagandha pak": "/productimages/Ashwagandha_pak.jpeg",
  "ashwagandha powder": "/productimages/Ashwagandha_kashaye.jpeg",
  "ayurpure": "/productimages/Ayurpure_syrup.jpeg",
  "badam oil": "/productimages/hair_oil.jpeg",
  "badam pak": "/productimages/Badam_pak.jpeg",
  "badam rogan oil": "/productimages/hair_oil.jpeg",
  "balya rattan syrup": "/productimages/active_energy.jpeg",
  "bed wet go": "/productimages/Bed_wet_go.jpeg",
  "bhringraj oil": "/productimages/mahabhringraj_oil.jpeg",
  "bhringraj powder": "/productimages/Bhringraj_powder.jpeg",
  "brahmi amla": "/productimages/BrahmiAmrita_syrup.jpeg",
  "castor oil": "/productimages/Castor_oil.jpeg",
  "chandan prabhavati": "/productimages/Arshar7_capsule.jpeg",
  "chawarka": "/productimages/Bed_wet_go.jpeg",
  "chawarka kids": "/productimages/Bed_wet_go.jpeg",
  "cheer oil": "/productimages/hair_oil.jpeg",
  "derma care": "/productimages/Derma_care_powder.jpeg",
  "derma care powder": "/productimages/Derma_care_powder.jpeg",
  "esand pak": "/productimages/Erand_pak.jpeg",
  "female cordial": "/productimages/hercordial_syrup.jpeg",
  "gajwan ark": "/productimages/ARQ_Gaujawan.jpeg",
  "garlic oil": "/productimages/Clove_oil.jpeg",
  "giloy juice": "/productimages/giloy_kashaye.jpeg",
  "giloy tablets": "/productimages/giloy_kashaye.jpeg",
  "ginger oil": "/productimages/Clove_oil.jpeg",
  "gokhru capsule": "/productimages/gokhru_powder.jpeg",
  "gokhru powder": "/productimages/gokhru_powder.jpeg",
  "gulab ark": "/productimages/Gulab_ARQ.jpeg",
  "hadjod capsule": "/productimages/Arshar7_capsule.jpeg",
  "harcodial syrup": "/productimages/hercordial_syrup.jpeg",
  "haridra capsule": "/productimages/Haridra_khand.jpeg",
  "herbocordial": "/productimages/hercordial_syrup.jpeg",
  "hibiscus powder": "/productimages/Hibiscus_powder.jpeg",
  "immunorattan": "/productimages/Immunerattan_syrup.jpeg",
  "immunorattan syrup": "/productimages/Immunerattan_syrup.jpeg",
  "immuvid": "/productimages/Immunerattan_syrup.jpeg",
  "indigo powder": "/productimages/indigo_powder.jpeg",
  "joshanda": "/productimages/joshanda.jpeg",
  "joshanda kadha": "/productimages/joshanda_kada.jpeg",
  "joshanda syrup": "/productimages/joshanda.jpeg",
  "kaddu oil": "/productimages/Kaddu_oil.jpeg",
  "kalounji oil": "/productimages/kalonji_oil.jpeg",
  "karela jamun juice": "/productimages/karela_kashaye.jpeg",
  "karela kashaya": "/productimages/karela_kashaye.jpeg",
  "kaunch beej powder": "/productimages/kaunch_beej.jpeg",
  "kastone": "/productimages/kastone-AB.jpeg",
  "khasni ark": "/productimages/Arq_kashni.jpeg",
  "khus khus oil": "/productimages/khas_khas_oil.jpeg",
  "konch beej powder": "/productimages/kaunch_beej.jpeg",
  "konch pak": "/productimages/Konch_pak.jpeg",
  "kuff ratan": "/productimages/KuffRattan_syrup.jpeg",
  "kuff ratan sf": "/productimages/KuffRattan_syrup.jpeg",
  "kutaj cure": "/productimages/Kutajcare_syrup.jpeg",
  "laxure adult": "/productimages/Laxure_syrup.jpeg",
  "laxure kids": "/productimages/Laxure_syrup.jpeg",
  "laxure kids syrup": "/productimages/Laxure_syrup.jpeg",
  "laxure syrup": "/productimages/Laxure_syrup.jpeg",
  "long & strong oil": "/productimages/mahanarayn_oil.jpeg",
  "lauki oil": "/productimages/lowki_oil.jpeg",
  "madhunashneem": "/productimages/Madhunashneem_churan.jpeg",
  "madhunashneem capsule": "/productimages/Madhunashneem_churan.jpeg",
  "madhunashneem powder": "/productimages/Madhunashneem_churan.jpeg",
  "maha bhringraj oil": "/productimages/mahabhringraj_oil.jpeg",
  "majun adam khas": "/productimages/Badam_pak.jpeg",
  "makoy ark": "/productimages/Makoy_Arq.jpeg",
  "malkangni oil": "/productimages/malkangni_oil.jpeg",
  "methi oil": "/productimages/Methi_oil.jpeg",
  "moosli pak": "/productimages/moosli_pak.jpeg",
  "moringa powder": "/productimages/moringa_powder.jpeg",
  "multani mitti": "/productimages/Multani_mitti_facepack.jpeg",
  "mulethi powder": "/productimages/moringa_powder.jpeg",
  "neem capsule": "/productimages/karela_kashaye.jpeg",
  "neem karela jamun powder": "/productimages/karela_kashaye.jpeg",
  "neem oil": "/productimages/indica_seed_oil.jpeg",
  "neem powder": "/productimages/moringa_powder.jpeg",
  "neem powder & oil": "/productimages/indica_seed_oil.jpeg",
  "onion oil": "/productimages/hair_oil.jpeg",
  "orange peel powder": "/productimages/Multani_mitti_facepack.jpeg",
  "pachanrattan syrup": "/productimages/pachanrattan_syrup.jpeg",
  "panchtrimool": "/productimages/moringa_powder.jpeg",
  "parush ratan": "/productimages/active_energy.jpeg",
  "pr gold capsule": "/productimages/Arshar7_capsule.jpeg",
  "prg capsule": "/productimages/Arshar7_capsule.jpeg",
  "punarnava ark": "/productimages/ARQ_Purnarnava.jpeg",
  "salam pak": "/productimages/Badam_pak.jpeg",
  "sandal oil": "/productimages/Chameli_oil.jpeg",
  "saunf ark": "/productimages/saunf_arq.jpeg",
  "shankh pushpi": "/productimages/BrahmiAmrita_syrup.jpeg",
  "shatavari": "/productimages/Shatawari_Powder.jpeg",
  "shatavari capsule": "/productimages/Shatawari_Powder.jpeg",
  "shatavari powder": "/productimages/Shatawari_Powder.jpeg",
  "shilajit": "/productimages/Arshar7_capsule.jpeg",
  "shilajit capsule": "/productimages/Arshar7_capsule.jpeg",
  "shilajit resin": "/productimages/Arshar7_capsule.jpeg",
  "slim fast capsules": "/productimages/Arshar7_capsule.jpeg",
  "soft bowel": "/productimages/soft_Bowl_Churan.jpeg",
  "soft bowel churna": "/productimages/soft_Bowl_Churan.jpeg",
  "soft bowel junior": "/productimages/soft_Bowl_Churan.jpeg",
  "supari pak": "/productimages/Badam_pak.jpeg",
  "triphala capsule": "/productimages/amla_powder.jpeg",
  "triphala churna": "/productimages/Bhumi_amla_churan.jpeg",
  "tulsi drops": "/productimages/Ayurpure_syrup.jpeg",
  "tulsi kashaya": "/productimages/joshanda_kada.jpeg",
  "turmeric oil": "/productimages/Dalchini_oil.jpeg",
  "uric acid syrup": "/productimages/uric_acid.jpeg",
  "uri rattan tablet": "/productimages/uric_acid.jpeg",
  "walnut oil": "/productimages/Lin_seed_oil.jpeg",
  yakritrattan: "/productimages/Yakirattan.jpeg",
};

const categoryFallbackImageBySlug: Record<string, string> = {
  capsules: "/productimages/Arshar7_capsule.jpeg",
  churna: "/productimages/amla_powder.jpeg",
  general: "/productimages/Ayurpure_syrup.jpeg",
  oils: "/productimages/hair_oil.jpeg",
  pak: "/productimages/Badam_pak.jpeg",
  powders: "/productimages/moringa_powder.jpeg",
  syrups: "/productimages/Ayurpure_syrup.jpeg",
};

const comingSoonImage = "/images/coming-soon.svg";

const suppressedFallbackImageNames = new Set([
  "amla juice",
  "rosemary oil",
  "shankh pushpi",
]);

function normalizeImagePath(value: string): string {
  const trimmed = value.trim().replace(/^['"]+|['"]+$/g, "");
  if (!trimmed) {
    return "";
  }

  const normalized = trimmed.replace(/\\/g, "/");

  if (/^(https?:)?\/\//i.test(normalized) || /^(data|blob):/i.test(normalized)) {
    return encodeURI(normalized);
  }

  let normalizedPath = normalized;

  if (normalizedPath.startsWith("public/")) {
    normalizedPath = normalizedPath.slice("public".length);
  }

  if (!normalizedPath.startsWith("/")) {
    normalizedPath = normalizedPath.includes("/")
      ? `/${normalizedPath}`
      : `/productimages/${normalizedPath}`;
  }

  normalizedPath = normalizedPath.replace(/\/{2,}/g, "/");
  return encodeURI(normalizedPath);
}

function resolveProductImages(
  name: string,
  categorySlug: string,
  customImages?: string[],
  allowFallback: boolean = true
): string[] {
  const suppliedImages = (customImages ?? [])
    .map((item) => normalizeImagePath(item))
    .filter((item) => item.length > 0);

  if (suppliedImages.length > 0) {
    return suppliedImages;
  }

  if (!allowFallback) {
    return [comingSoonImage];
  }

  if (suppressedFallbackImageNames.has(normalizeName(name))) {
    return [comingSoonImage];
  }

  const mapped = productImageByName[normalizeName(name)];
  if (mapped) {
    return [normalizeImagePath(mapped)];
  }

  const categoryFallback =
    categoryFallbackImageBySlug[categorySlug] ??
    categoryFallbackImageBySlug.general ??
    blankProductImage;

  return [categoryFallback];
}

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
    { match: /cough|cold/, slug: "cough-cold-relief" },
    { match: /digest|gut|constipat/, slug: "digestive-care" },
    { match: /diabet|sugar|glucose/, slug: "diabetic-care" },
    { match: /elder/, slug: "elderly-care" },
    { match: /hair/, slug: "hair-care" },
    { match: /kid|child/, slug: "kid-wellness" },
    { match: /heart|cardiac|cholesterol|bp|blood pressure/, slug: "cardiac-care" },
    { match: /pain|joint|muscle|inflamm/, slug: "pain-relief" },
    { match: /skin|face|beauty/, slug: "skin-care" },
    { match: /stress|sleep|mind/, slug: "stress-relief" },
    { match: /weight|slim|obesity/, slug: "weight-management" },
    { match: /women|female|period|pcos/, slug: "womens-health" },
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

function splitListValue(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function formatPriceLabel(value: string, price: number): string {
  const trimmed = value.trim();
  if (trimmed.includes("₹")) {
    return trimmed;
  }
  if (trimmed.length > 0) {
    return `₹${trimmed}`;
  }
  return price > 0 ? `₹${price}` : "Price unavailable";
}

function parsePriceVariants(quantity: string, priceValue: unknown): PriceVariant[] {
  const rawPrice =
    typeof priceValue === "number" && Number.isFinite(priceValue)
      ? String(priceValue)
      : typeof priceValue === "string"
        ? priceValue.trim()
        : "";

  if (!rawPrice) {
    return [];
  }

  const quantities = splitListValue(quantity);
  const prices = splitListValue(rawPrice);

  return prices
    .map((priceText, index) => {
      const price = parsePrice(priceText);
      if (price <= 0) {
        return null;
      }

      return {
        quantity: quantities[index] ?? quantities[0] ?? "Standard pack",
        price,
        priceLabel: formatPriceLabel(priceText, price),
      };
    })
    .filter((item): item is PriceVariant => item !== null);
}

export function getDefaultPriceVariant(product: Product): PriceVariant | undefined {
  return product.priceVariants?.[0];
}

export function getProductPrice(product: Product, variant?: PriceVariant): number {
  return variant?.price ?? getDefaultPriceVariant(product)?.price ?? product.price;
}

export function isProductPurchasable(product: Product): boolean {
  return ((product.priceVariants?.length ?? 0) > 0 || product.price > 0) && getProductPrice(product) > 0;
}

export function getProductPriceLabel(product: Product): string {
  const priceVariants = product.priceVariants ?? [];

  if (priceVariants.length === 0) {
    if (product.price > 0) {
      return product.priceLabel ?? `₹${product.price}`;
    }
    return "Price unavailable";
  }

  if (priceVariants.length > 1) {
    return `From ${product.priceLabel}`;
  }

  return product.priceLabel;
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
  price: unknown,
  concerns: string[],
  customImages?: string[],
  allowFallback: boolean = true
): Product {
  const id = slugify(name);
  const stable = hashCode(name);
  const rating = 4.1 + (stable % 9) / 10;
  const reviews = 40 + (stable % 460);
  const featured = stable % 4 === 0;
  const priceVariants = parsePriceVariants(quantity, price);
  const parsedPrice = parsePrice(price);
  const lowestVariant = priceVariants.reduce<PriceVariant | undefined>(
    (lowest, variant) => (!lowest || variant.price < lowest.price ? variant : lowest),
    undefined
  );
  const displayPrice = lowestVariant?.price ?? parsedPrice;
  const priceLabel = lowestVariant?.priceLabel ?? "Price unavailable";
  const originalPrice = displayPrice;
  const images = resolveProductImages(name, categorySlug, customImages, allowFallback);
  const image = images[0] ?? blankProductImage;

  return {
    id,
    slug: id,
    name,
    category,
    categorySlug,
    price: displayPrice,
    originalPrice,
    priceLabel,
    priceVariants,
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

function normalizeLegacyProduct(product: Product): Product {
  const priceVariants =
    product.priceVariants?.length > 0
      ? product.priceVariants
      : product.price > 0
        ? [
            {
              quantity: product.shortDescription || "Standard pack",
              price: product.price,
              priceLabel: `₹${product.price}`,
            },
          ]
        : [];

  return {
    ...product,
    originalPrice: product.originalPrice ?? product.price,
    priceLabel: product.priceLabel ?? priceVariants[0]?.priceLabel ?? "Price unavailable",
    priceVariants,
  };
}

export function getFallbackProducts(): Product[] {
  return (fallbackCatalog as Product[]).map(normalizeLegacyProduct);
}

export async function fetchProductsFromSupabase(): Promise<Product[]> {
  if (!hasSupabasePublicEnv) {
    return getFallbackProducts();
  }

  const [categoryResult, concernResult] = await Promise.all([
    queryWithRetry(async () =>
      await supabase
        .from("products_by_category")
        .select('"Product Name",Category,Quantity,Price,images,status,stock_quantity,featured')
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
    return getFallbackProducts();
  }

  if (categoryData.length === 0 && concernData.length === 0) {
    return getFallbackProducts();
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
    if (row.status && row.status !== "active") continue;
    const category = (row.Category ?? "General Wellness").trim() || "General Wellness";
    const categorySlug = categoryToSlug(category);
    const quantity = (row.Quantity ?? "").trim();
    const price = row.Price ?? priceByName.get(key) ?? 0;
    const concerns = Array.from(concernsByName.get(key) ?? []);
    const images = parseImages(row.images);
    const mergedImages = images.length > 0 ? images : imagesByName.get(key) ?? [];
    const product = buildProduct(
      name,
      category,
      categorySlug,
      quantity,
      price,
      concerns,
      mergedImages,
      true
    );

    productsByName.set(key, {
      ...product,
      featured: Boolean(row.featured) || product.featured,
      inStock: row.stock_quantity == null ? true : row.stock_quantity > 0,
      badge: row.featured ? "Featured" : product.badge,
    });
  }

  const mergedProducts = Array.from(productsByName.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // If live rows are malformed (for example, missing product names), avoid rendering an empty catalog.
  if (mergedProducts.length === 0) {
    return getFallbackProducts();
  }

  return mergedProducts;
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
  if (!hasSupabasePublicEnv) {
    return () => {};
  }

  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const byCategory = supabase
    .channel(`products-by-category-live-${suffix}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products_by_category" },
      () => onChange()
    )
    .subscribe();

  const byConcern = supabase
    .channel(`products-by-concern-live-${suffix}`)
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
