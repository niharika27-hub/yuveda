export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Churna",
    slug: "churna",
    description: "Traditional herbal powders for digestive wellness, immunity, and holistic healing. Finely ground from the purest herbs.",
    icon: "Mortar",
    image: "https://images.unsplash.com/photo-1611241893603-3c359704e0ee?w=400&h=300&fit=crop",
    productCount: 4,
  },
  {
    id: "cat-2",
    name: "Pak",
    slug: "pak",
    description: "Rich herbal preparations blended with ghee and honey for strength, immunity, and rejuvenation.",
    icon: "Cookie",
    image: "https://images.unsplash.com/photo-1574226516831-e1dff420e562?w=400&h=300&fit=crop",
    productCount: 2,
  },
  {
    id: "cat-3",
    name: "Capsules",
    slug: "capsules",
    description: "Concentrated herbal extracts in convenient capsule form for modern lifestyle needs.",
    icon: "Pill",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    productCount: 4,
  },
  {
    id: "cat-4",
    name: "Oils",
    slug: "oils",
    description: "Therapeutic medicated oils for hair care, pain relief, and body nourishment prepared with ancient techniques.",
    icon: "Droplets",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop",
    productCount: 3,
  },
  {
    id: "cat-5",
    name: "Powders",
    slug: "powders",
    description: "Superfood powders packed with natural vitamins and minerals for daily nutrition and wellness.",
    icon: "Leaf",
    image: "https://images.unsplash.com/photo-1622467827417-bbe2237067a9?w=400&h=300&fit=crop",
    productCount: 3,
  },
  {
    id: "cat-6",
    name: "Juices",
    slug: "juices",
    description: "Cold-pressed herbal juices and tonics for internal cleansing, immunity, and vitality.",
    icon: "GlassWater",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop",
    productCount: 3,
  },
  {
    id: "cat-7",
    name: "Syrups",
    slug: "syrups",
    description: "Traditional Arishta and Asava preparations — fermented herbal syrups for deep healing and rejuvenation.",
    icon: "Wine",
    image: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=400&h=300&fit=crop",
    productCount: 3,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
