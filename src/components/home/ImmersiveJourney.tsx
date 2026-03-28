"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Droplets,
  Leaf,
  HeartHandshake,
  Sparkles,
  Star,
} from "lucide-react";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { useRealtimeProducts } from "@/hooks/useRealtimeProducts";

const storyChapters = [
  {
    title: "Sustainability First",
    description:
      "We work with conscious growers and seasonal harvesting cycles so each formula supports your body and the earth.",
    icon: Leaf,
  },
  {
    title: "Ayurvedic Roots",
    description:
      "Every blend follows classical Ayurvedic intelligence, balancing doshas with ingredients selected for harmony and long-term wellness.",
    icon: Droplets,
  },
  {
    title: "Care Beyond Checkout",
    description:
      "From product guidance to after-purchase support, we stay close to your wellness journey with honest, human care.",
    icon: HeartHandshake,
  },
];

const quotes = [
  {
    text: "It feels less like buying products and more like entering a wellness ritual.",
    name: "Aarohi, Bengaluru",
  },
  {
    text: "The quality is premium and the experience feels deeply calming.",
    name: "Rohan, Pune",
  },
  {
    text: "I came for stress support and stayed because Yuveda feels truly intentional.",
    name: "Nidhi, Delhi",
  },
];

const ingredients = ["Neem", "Tulsi", "Amla", "Brahmi", "Ashwagandha", "Shatavari"];

const mobileIngredientPositions = [
  { left: 12, top: 16 },
  { left: 88, top: 16 },
  { left: 96, top: 50 },
  { left: 78, top: 84 },
  { left: 22, top: 84 },
  { left: 4, top: 50 },
];

const ritualSteps = [
  {
    title: "Daily Alignment",
    copy: "Start with a simple morning tonic matched to your current energy and routine.",
    icon: Sparkles,
  },
  {
    title: "Gentle Nourishment",
    copy: "Use targeted formulations that support digestion, heart health, and calm vitality.",
    icon: Droplets,
  },
  {
    title: "Consistent Care",
    copy: "Build steady wellness momentum through practical rituals that fit modern schedules.",
    icon: HeartHandshake,
  },
  {
    title: "Deep Renewal",
    copy: "Transition from symptom chasing to whole-body balance grounded in Ayurvedic wisdom.",
    icon: Leaf,
  },
];

const originBlocks = [
  {
    title: "Sourced With Integrity",
    copy: "We partner with trusted growers and seasonal harvest cycles to preserve potency and purity.",
  },
  {
    title: "Crafted For Absorption",
    copy: "Each formulation is structured for real-world use, blending classical methods and practical delivery.",
  },
  {
    title: "Backed By Transparency",
    copy: "Clear labels, ingredient-led education, and responsive customer support at every stage.",
  },
];

export function ImmersiveJourney() {
  const { products } = useRealtimeProducts();
  const pageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isCompactMotion, setIsCompactMotion] = useState(false);
  const [isMobileHero, setIsMobileHero] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px), (pointer: coarse)");
    const updateMotionMode = (event?: MediaQueryListEvent) => {
      setIsCompactMotion(event ? event.matches : mediaQuery.matches);
    };

    updateMotionMode();
    mediaQuery.addEventListener("change", updateMotionMode);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionMode);
    };
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const updateMobileMode = (event?: MediaQueryListEvent) => {
      setIsMobileHero(event ? event.matches : mobileQuery.matches);
    };

    updateMobileMode();
    mobileQuery.addEventListener("change", updateMobileMode);

    return () => {
      mobileQuery.removeEventListener("change", updateMobileMode);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.85 : isCompactMotion ? 1.35 : 1.75,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 0.82,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [isCompactMotion, prefersReducedMotion]);

  const motionScale = prefersReducedMotion ? 0.28 : isCompactMotion ? 0.68 : 1;
  const revealDuration = prefersReducedMotion ? 0.3 : isCompactMotion ? 0.58 : 0.8;
  const staggerStep = prefersReducedMotion ? 0.04 : isCompactMotion ? 0.08 : 0.14;
  const cardEntryY = prefersReducedMotion ? 18 : isCompactMotion ? 46 : 80;

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: prefersReducedMotion ? 140 : isCompactMotion ? 95 : 70,
    damping: prefersReducedMotion ? 32 : isCompactMotion ? 26 : 22,
    mass: 0.3,
  });

  const heroParallaxY = useTransform(smoothProgress, [0, 0.28], [0, 220 * motionScale]);
  const heroTextY = useTransform(smoothProgress, [0, 0.2], [0, 90 * motionScale]);
  const heroGlow = useTransform(
    smoothProgress,
    [0, 0.18],
    [0.5, prefersReducedMotion ? 0.66 : 0.85]
  );


  const featured = products.filter((product) => product.featured).slice(0, 4);

  return (
    <div
      ref={pageRef}
      className="relative overflow-x-clip"
    >
      <motion.div
        style={{ scaleX: smoothProgress }}
        className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-gradient-to-r from-[#1f6f43] via-[#7fa74d] to-[#f29f3d]"
      />

      <div className="relative z-10">

      <section className="relative min-h-screen overflow-hidden">
        <motion.div
          style={{ y: heroParallaxY }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute left-[-8%] top-[-8%] h-[44vw] w-[44vw] rounded-full bg-[#2f8b4f]/15 blur-3xl" />
          <div className="absolute right-[-15%] top-[15%] h-[34vw] w-[34vw] rounded-full bg-[#f4a13d]/20 blur-3xl" />
          <div className="absolute bottom-[-18%] left-[28%] h-[40vw] w-[40vw] rounded-full bg-[#78a43d]/16 blur-3xl" />
        </motion.div>

        <motion.div
          style={{ opacity: heroGlow }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.7),rgba(255,255,255,0.08)_45%,transparent_70%)]"
        />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-14 lg:grid-cols-2">
            <motion.div style={{ y: heroTextY }} className="space-y-7">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: revealDuration, delay: staggerStep * 0.75 }}
                className="text-5xl font-semibold leading-[1.04] tracking-tight text-[#173822] sm:text-6xl lg:text-7xl"
              >
                Wellness that <span className="text-[#e07f11]">blooms</span>
                <br />
                with every scroll.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: revealDuration, delay: staggerStep * 1.4 }}
                className="max-w-xl text-base leading-relaxed text-[#355141] sm:text-lg"
              >
                Yuveda blends herbal intelligence and mindful design into a calm,
                cinematic journey. Discover remedies that feel ancient, elevated,
                and made for modern life.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: revealDuration, delay: staggerStep * 2 }}
                className="text-sm uppercase tracking-[0.28em] text-[#4f6958]"
              >
                Ancient Wisdom. Modern Wellness.
              </motion.p>
            </motion.div>

            <div className="relative mx-auto flex h-[430px] w-full max-w-[350px] items-center justify-center sm:h-[520px] sm:max-w-[520px]">
              {ingredients.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.35 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: revealDuration * 1.1, delay: staggerStep * index }}
                  className={`ingredient-orb ${isMobileHero ? "ingredient-orb-mobile" : ""}`}
                  style={{
                    left: isMobileHero
                      ? `${mobileIngredientPositions[index]?.left ?? 50}%`
                      : `${50 + Math.cos((index / ingredients.length) * Math.PI * 2) * 35}%`,
                    top: isMobileHero
                      ? `${mobileIngredientPositions[index]?.top ?? 50}%`
                      : `${50 + Math.sin((index / ingredients.length) * Math.PI * 2) * 35}%`,
                    animationDelay: `${index * 0.55}s`,
                  }}
                >
                  {item}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: revealDuration * 1.2, delay: staggerStep * 1.8 }}
                className="relative z-10 flex h-44 w-44 items-center justify-center rounded-full border border-[#1f6f43]/25 bg-white/75 text-center backdrop-blur-lg sm:h-56 sm:w-56"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#557163] sm:text-xs sm:tracking-[0.24em]">
                    Botanical Harmony
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[#174029] sm:mt-3 sm:text-3xl">
                    Yuveda
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: revealDuration }}
            className="mb-12 max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4e7a53]">
              Product Highlights
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-[#1d402a] sm:text-5xl">
              Blooming Lotus Collection
            </h2>
            <p className="mt-4 text-[#476654]">
              Each formula rises gently into focus, designed to solve real wellness concerns with elegant, minimal guidance.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((product, index) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: cardEntryY, scale: prefersReducedMotion ? 0.96 : 0.88 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: revealDuration, delay: index * staggerStep }}
                className="lotus-card group relative overflow-hidden rounded-[2rem] border border-[#1f6f43]/15 bg-[#fffdfa]/85 p-4 shadow-[0_20px_60px_rgba(27,55,35,0.14)] backdrop-blur"
              >
                <div className="relative h-56 w-full overflow-hidden rounded-[1.4rem]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute left-6 top-6 rounded-full bg-[#f29f3d]/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.17em] text-[#3a2100]">
                  {product.badge ?? "Herbal Pick"}
                </div>
                <div className="pb-3 pt-5">
                  <h3 className="text-xl font-semibold text-[#193d27]">{product.name}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#4f6b5a]">
                    {product.shortDescription}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-semibold text-[#1f6f43]">Rs. {product.price}</p>
                  <Link
                    href={`/product/${product.id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-[#1f6f43]/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#1f6f43] transition hover:bg-[#1f6f43] hover:text-white"
                  >
                    View
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-screen overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="flowing-water absolute inset-x-0 top-0 h-36" />
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: revealDuration }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5b7c66]">
              Brand Story
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-[#173722] sm:text-5xl">
              Chapters of Care
            </h2>
          </motion.div>

          <div className="space-y-6">
            {storyChapters.map((chapter, index) => {
              const Icon = chapter.icon;
              return (
                <motion.article
                  key={chapter.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: revealDuration, delay: index * (staggerStep * 0.9) }}
                  className="story-chapter rounded-[2rem] border border-[#1f6f43]/15 bg-white/75 p-8 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f6e6] text-[#1f6f43]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#5b7c66]">
                        Chapter {index + 1}
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold text-[#163621]">
                        {chapter.title}
                      </h3>
                      <p className="mt-2 max-w-2xl text-[#4b6857]">
                        {chapter.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative min-h-screen overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute left-[-8%] top-[14%] h-56 w-56 rounded-full bg-[#f3a43f]/20 blur-3xl" />
        <div className="absolute right-[-12%] bottom-[10%] h-72 w-72 rounded-full bg-[#2e7c45]/18 blur-3xl" />

        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: revealDuration }}
            className="mb-12 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5d7a67]">
              Interactive Testimonials
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-[#173821] sm:text-5xl">
              Illuminated Customer Scrolls
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {quotes.map((quote, index) => (
              <motion.article
                key={quote.name}
                initial={{
                  opacity: 0,
                  y: prefersReducedMotion ? 20 : 48,
                  rotate: prefersReducedMotion
                    ? 0
                    : index === 1
                      ? 0
                      : index === 0
                        ? -2.2
                        : 2.2,
                }}
                whileInView={{ opacity: 1, y: 0, rotate: index === 1 ? 0 : index === 0 ? -1 : 1 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: revealDuration * 0.95, delay: index * (staggerStep * 0.9) }}
                className="ink-scroll relative rounded-[2rem] border border-[#1f6f43]/15 bg-[#fff8e8]/92 p-7 shadow-[0_18px_50px_rgba(61,43,19,0.16)]"
              >
                <div className="mb-5 flex items-center gap-1 text-[#e08b1d]">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed text-[#3e4f41]">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-[#1e6c3f]">
                  {quote.name}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[80vh] px-4 pb-28 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center rounded-[2.6rem] border border-[#1f6f43]/20 bg-gradient-to-br from-[#f8fff3]/90 via-[#f4fbe9]/80 to-[#fff2de]/88 p-10 text-center shadow-[0_24px_80px_rgba(22,57,34,0.16)] backdrop-blur-sm sm:p-14">
          <motion.div
            initial={{ y: -60, opacity: 0, rotate: -15 }}
            whileInView={{ y: 0, opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: revealDuration * 1.15,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            className="leaf-landing mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#2f8b4f]/15 text-[#1f6f43]"
          >
            <Leaf className="h-8 w-8" />
          </motion.div>

          <h2 className="text-4xl font-semibold text-[#173a22] sm:text-5xl">
            Begin your Ayurvedic ritual.
          </h2>
          <p className="mt-4 max-w-2xl text-[#496755]">
            Explore curated formulations, discover personalized routines, and let each purchase feel like a step toward deeper balance.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#1f6f43] px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-[#165032]"
            >
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center gap-2 rounded-full border border-[#1f6f43]/30 bg-white/70 px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#1f6f43] transition hover:-translate-y-0.5 hover:border-[#1f6f43]"
            >
              Connect With Yuveda
            </Link>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[2.3rem] border border-white/30 bg-[#fff7eb]/92 p-8 shadow-[0_20px_70px_rgba(28,42,31,0.2)] backdrop-blur-sm sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: revealDuration }}
            className="mb-10 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4e7558]">
              Ritual Journey
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-[#173822] sm:text-5xl">
              A Slower Path To Lasting Wellness
            </h2>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2">
            {ritualSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: revealDuration * 0.9, delay: index * 0.08 }}
                  className="rounded-3xl border border-[#1f6f43]/15 bg-white/92 p-6"
                >
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7f4e6] text-[#1f6f43]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a3a25]">{step.title}</h3>
                  <p className="mt-2 text-[#4d6958]">{step.copy}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative min-h-screen px-4 pb-28 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[2.5rem] border border-white/25 bg-[#f5fbf0]/93 p-8 shadow-[0_24px_90px_rgba(23,49,33,0.22)] backdrop-blur-sm lg:grid-cols-[1.15fr_1fr] lg:p-12">
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: revealDuration }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4c7858]">
              Ingredient Origins
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-[#163621] sm:text-5xl">
              Built For Trust, Not Hype
            </h2>
            <div className="mt-7 space-y-4">
              {originBlocks.map((block) => (
                <article key={block.title} className="rounded-2xl border border-[#1f6f43]/12 bg-white/90 p-5">
                  <h3 className="text-lg font-semibold text-[#1d3d28]">{block.title}</h3>
                  <p className="mt-2 text-[#4b6756]">{block.copy}</p>
                </article>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: revealDuration * 1.05 }}
            className="grid content-start gap-4"
          >
            {[
              { label: "Formulations Crafted", value: "70+" },
              { label: "Botanical Ingredients", value: "120+" },
              { label: "Care Support Availability", value: "7 Days" },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-[#1f6f43]/15 bg-[#fffdf8]/95 p-6 text-center">
                <p className="text-4xl font-semibold text-[#1b6b3f]">{item.value}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[#5a7463]">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      </div>
    </div>
  );
}
