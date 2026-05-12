export interface Concern {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  tips: string[];
  color: string;
}

export const concerns: Concern[] = [
  {
    id: "con-1",
    name: "Immunity Booster",
    slug: "immunity-booster",
    description: "Strengthen your body's natural defense system with time-tested Ayurvedic herbs and formulations. Build resilience from within using the wisdom of ancient medicine.",
    icon: "Shield",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop",
    tips: [
      "Start your day with warm water and honey",
      "Include Amla and Tulsi in your daily diet",
      "Practice Pranayama (breathing exercises) daily",
      "Get 7-8 hours of quality sleep",
      "Consume Chyawanprash regularly during season changes",
    ],
    color: "#1F5D3B",
  },
  {
    id: "con-2",
    name: "Digestive Care",
    slug: "digestive-care",
    description: "Ayurveda considers digestion (Agni) as the cornerstone of health. Support your digestive fire with natural herbs that promote healthy gut function and regularity.",
    icon: "Flame",
    image: "/productimages/Yakirattan.jpeg",
    tips: [
      "Eat meals at regular times every day",
      "Chew food thoroughly — at least 32 times",
      "Drink warm water between meals",
      "Avoid cold drinks during meals",
      "Take a short walk after dinner",
    ],
    color: "#C9A961",
  },
  {
    id: "con-3",
    name: "Diabetic Care",
    slug: "diabetic-care",
    description: "Manage blood sugar levels naturally with Ayurvedic herbs known for their glucose-regulating properties. Support your pancreatic health the natural way.",
    icon: "Activity",
    image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop",
    tips: [
      "Include bitter foods like Karela in your diet",
      "Walk at least 30 minutes daily after meals",
      "Reduce refined carbohydrates and sugar",
      "Consume Methi (Fenugreek) soaked water in the morning",
      "Monitor blood sugar levels regularly",
    ],
    color: "#2D6A47",
  },
  {
    id: "con-4",
    name: "Cardiac Care",
    slug: "cardiac-care",
    description: "Support your heart health with Ayurvedic herbs like Arjuna that have been used for millennia. Maintain healthy blood pressure and cholesterol levels naturally.",
    icon: "Heart",
    image: "https://images.unsplash.com/photo-1544991875-5dc1b05f607d?w=400&h=300&fit=crop",
    tips: [
      "Practice daily meditation for stress management",
      "Include garlic and turmeric in your diet",
      "Exercise moderately for 30 minutes daily",
      "Limit salt and processed food intake",
      "Consume Arjuna bark tea regularly",
    ],
    color: "#004526",
  },
  {
    id: "con-5",
    name: "Pain Relief",
    slug: "pain-relief",
    description: "Find natural relief from joint pain, body aches, and inflammation with potent Ayurvedic oils and formulations that address the root cause.",
    icon: "Zap",
    image: "https://images.unsplash.com/photo-1600428877878-1a0ff561972c?w=400&h=300&fit=crop",
    tips: [
      "Apply warm Mahanarayan oil on affected joints",
      "Practice gentle yoga daily",
      "Include anti-inflammatory spices like Turmeric and Ginger",
      "Stay hydrated throughout the day",
      "Maintain a healthy body weight",
    ],
    color: "#5A4302",
  },
  {
    id: "con-6",
    name: "Men's Health",
    slug: "mens-health",
    description: "Enhance masculine vitality, strength, and overall wellness with Ayurvedic rasayanas and tonics specifically formulated for men's health needs.",
    icon: "Dumbbell",
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop",
    tips: [
      "Consume Ashwagandha regularly for stress management",
      "Exercise consistently — both cardio and strength",
      "Get adequate protein in your diet",
      "Maintain a consistent sleep schedule",
      "Include Shilajit and Safed Musli for vitality",
    ],
    color: "#1F5D3B",
  },
];

export function getConcernBySlug(slug: string): Concern | undefined {
  return concerns.find((c) => c.slug === slug);
}
