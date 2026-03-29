"use client";

import Image from "next/image";
import Link from "next/link";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import type { StringTune as StringTuneClass } from "@fiddle-digital/string-tune";
import {
  ArrowRight,
  Droplets,
  HeartHandshake,
  Leaf,
  Sparkles,
  Star,
} from "lucide-react";
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

const stats = [
  { label: "Formulations Crafted", value: "70+" },
  { label: "Botanical Ingredients", value: "120+" },
  { label: "Support Availability", value: "7 Days" },
  { label: "Customer Satisfaction", value: "4.9/5" },
];

const ingredientSpotlight = [
  {
    label: "NEEM",
    image: "/images/neem-leaf.jpg",
    alt: "Neem leaf ingredient spotlight",
  },
  {
    label: "TULSI",
    image: "/images/tulsi-plant.jpg",
    alt: "Tulsi plant ingredient spotlight",
  },
  {
    label: "AMLA",
    image: "/images/amla.jpg",
    alt: "Amla fruit ingredient spotlight",
  },
  {
    label: "BRAHMI",
    image: "/images/brahmi.jpg",
    alt: "Brahmi herb ingredient spotlight",
  },
  {
    label: "ASHWAGANDHA",
    image: "/images/ashwagandha.jpg",
    alt: "Ashwagandha ingredient spotlight",
  },
  {
    label: "SHATAVARI",
    image: "/images/shatavari.jpg",
    alt: "Shatavari ingredient spotlight",
  },
  {
    label: "GILOY",
    image: "/images/giloy.jpg",
    alt: "Giloy vine ingredient spotlight",
  },
];

const ingredientMarquee = [...ingredientSpotlight, ...ingredientSpotlight];

export function ImmersiveJourney() {
  const { products } = useRealtimeProducts();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lenis: Lenis | null = null;
    let stringTune: StringTuneClass | null = null;
    let context: { revert: () => void } | null = null;
    let rafId: number | null = null;
    let canceled = false;

    const initAnimations = async () => {
      if (!pageRef.current) {
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const lowPowerDevice =
        typeof navigator !== "undefined" &&
        (navigator.hardwareConcurrency ?? 8) <= 6;
      const enableHeavyEffects = !lowPowerDevice;

      if (prefersReducedMotion) {
        return;
      }

      const [{ gsap }, { ScrollTrigger }, stringTuneModule] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          enableHeavyEffects ? import("@fiddle-digital/string-tune") : null,
        ]);

      if (canceled || !pageRef.current) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      if (stringTuneModule) {
        const { StringParallax, StringTune } = stringTuneModule;
        stringTune = StringTune.getInstance();
        stringTune.scrollDesktopMode = "default";
        stringTune.scrollMobileMode = "default";
        stringTune.setupSettings({
          parallax: 0.09,
          "parallax-bias": 0.14,
        });
        if (!stringTune.reuse(StringParallax)) {
          stringTune.use(StringParallax);
        }
        stringTune.start(45);
      }

      lenis = new Lenis({
        lerp: 0.11,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
        touchMultiplier: 0.9,
      });

      lenis.on("scroll", () => ScrollTrigger.update());

      const updateLenis = (time: number) => {
        lenis?.raf(time);
        rafId = window.requestAnimationFrame(updateLenis);
      };

      rafId = window.requestAnimationFrame(updateLenis);

      context = gsap.context(() => {
        gsap.from(".js-hero-content", {
          opacity: 0,
          y: 26,
          duration: 1.1,
          ease: "power3.out",
        });

        gsap.set(".js-scroll-progress", {
          scaleX: 0,
          transformOrigin: "left center",
        });

        const setProgress = gsap.quickSetter(".js-scroll-progress", "scaleX");
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => setProgress(self.progress),
        });

        gsap.utils.toArray<HTMLElement>(".js-fade-on-scroll").forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            y: 24,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          });
        });

        gsap.from(".js-herb-feature", {
          opacity: 0,
          x: -90,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#product-highlights",
            start: "top 74%",
          },
        });

        gsap.from(".js-banyan-card", {
          opacity: 0,
          y: 55,
          scale: 0.95,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".js-banyan-card",
            start: "top 83%",
          },
        });
      }, pageRef);

      ScrollTrigger.refresh();
    };

    void initAnimations();

    return () => {
      canceled = true;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      lenis?.destroy();
      stringTune?.destroy();
      context?.revert();
    };
  }, []);

  useEffect(() => {
    if (!pageRef.current) {
      return;
    }

    const supportsFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!supportsFinePointer) {
      return;
    }

    const targets = Array.from(
      pageRef.current.querySelectorAll<HTMLElement>(".js-glass-tilt")
    );

    const cleanupHandlers = targets.map((el) => {
      let rafToken = 0;

      const reset = () => {
        el.style.setProperty("--mx", "50%");
        el.style.setProperty("--my", "50%");
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      };

      const onMouseEnter = () => {
        el.classList.add("is-hovering");
      };

      const onMouseMove = (event: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const nx = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
        const ny = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
        const rotateX = (0.5 - ny) * 10;
        const rotateY = (nx - 0.5) * 12;

        if (rafToken) {
          window.cancelAnimationFrame(rafToken);
        }

        rafToken = window.requestAnimationFrame(() => {
          el.style.setProperty("--mx", `${nx * 100}%`);
          el.style.setProperty("--my", `${ny * 100}%`);
          el.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
          el.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
        });
      };

      const onMouseLeave = () => {
        el.classList.remove("is-hovering");
        if (rafToken) {
          window.cancelAnimationFrame(rafToken);
        }
        reset();
      };

      reset();
      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mouseleave", onMouseLeave);

      return () => {
        if (rafToken) {
          window.cancelAnimationFrame(rafToken);
        }
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mousemove", onMouseMove);
        el.removeEventListener("mouseleave", onMouseLeave);
      };
    });

    return () => {
      cleanupHandlers.forEach((cleanup) => cleanup());
    };
  }, []);

  const featured = products.filter((product) => product.featured).slice(0, 4);
  const highlightedProducts =
    featured.length > 0 ? featured : products.slice(0, 4);

  return (
    <div ref={pageRef} className="relative overflow-x-clip">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
        <div className="js-scroll-progress h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#c9a961] via-[#2f7a50] to-[#c9a961]/80" />
      </div>

      <section className="js-hero-section relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/journey/seed-to-herb.webp"
            alt=""
            fill
            priority
            quality={92}
            sizes="100vw"
            className="object-cover"
            aria-hidden
          />
        </div>

        <div className="js-hero-content relative mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1b2f24]/85">
              Ancient Wisdom. Modern Wellness.
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.04] tracking-tight text-[#1A2E25] sm:text-6xl lg:text-7xl">
              Wellness that blooms
              <br />
              with every scroll.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#264336]/90 sm:text-lg">
              Yuveda blends herbal intelligence and mindful design into a calm,
              cinematic experience grounded in Ayurveda.
            </p>
          </div>
        </div>
      </section>

      <section className="relative bg-[#F7F0E6] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4f6b5d]">
            Botanical Ingredient Ticker
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-[#1A2E25] sm:text-5xl">
            Ingredient Spotlight
          </h2>

          <div className="botanical-ticker mt-6">
            <div className="botanical-track">
              NEEM | TULSI | AMLA | BRAHMI | ASHWAGANDHA | SHATAVARI | NEEM |
              GILOY | TULSI | AMLA | BRAHMI | ASHWAGANDHA | SHATAVARI |
            </div>
          </div>

          <div className="ingredient-marquee mt-10" aria-label="Ingredient Spotlight Carousel">
            <div className="ingredient-lane">
              {ingredientMarquee.map((item, index) => (
              <article
                key={`${item.label}-${index}`}
                className="js-ingredient-card ingredient-card group w-[min(82vw,270px)] shrink-0 rounded-[12px] border border-transparent bg-[#f4ead9] p-3 transition-all duration-700 ease-out hover:border-[#C9A84C] hover:shadow-[0_0_0_1px_rgba(201,168,76,0.7),0_12px_30px_rgba(201,168,76,0.28)] sm:w-[260px] lg:w-[280px]"
              >
                <div
                  className="js-glass-tilt glass-hover-media relative aspect-square overflow-hidden rounded-[12px]"
                  style={{
                    backgroundImage: `url('${item.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="ingredient-media relative z-[1] object-cover"
                    quality={86}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 24vw"
                  />
                </div>
                <h3 className="mt-4 text-center text-base font-semibold tracking-[0.08em] text-[#2D4A3E]">
                  {item.label}
                </h3>
              </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="product-highlights"
        className="relative bg-[#efe3d0] px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <figure
            data-string="parallax"
            data-string-parallax="0.045"
            data-string-parallax-bias="0.08"
            className="js-herb-feature js-glass-tilt glass-hover-media js-scroll-parallax relative min-h-[340px] overflow-hidden rounded-[1.3rem] border border-[#2D4A3E]/20 shadow-[0_22px_42px_rgba(0,0,0,0.15)] sm:min-h-[420px]"
          >
            <Image
              src="/images/herb-flatlay.jpg"
              alt="Blooming Lotus Collection herb flatlay"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </figure>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4f6b5d]">
              Blooming Lotus Collection
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-[#1A2E25] sm:text-5xl">
              Product Highlights
            </h2>
            <p className="mt-4 text-[#476654]">
              Each formula is designed for practical ritual use while preserving
              botanical depth and classical Ayurvedic intelligence.
            </p>

            <div className="mt-6 grid gap-4">
              {highlightedProducts.map((product) => (
                <article
                  key={product.id}
                  className="js-fade-on-scroll rounded-2xl border border-[#2D4A3E]/15 bg-white/86 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[#193d27]">
                        {product.name}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#4f6b5a]">
                        {product.shortDescription}
                      </p>
                    </div>
                    <p className="shrink-0 text-lg font-semibold text-[#1f6f43]">
                      Rs. {product.price}
                    </p>
                  </div>
                  <Link
                    href={`/product/${product.id}`}
                    className="mt-4 inline-flex items-center gap-1 rounded-full border border-[#1f6f43]/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#1f6f43] transition hover:bg-[#1f6f43] hover:text-white"
                  >
                    View Product
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="relative h-[180px] w-full overflow-hidden" aria-hidden>
        <div
          data-string="parallax"
          data-string-parallax="0.028"
          data-string-parallax-bias="0.18"
          className="js-scroll-parallax absolute inset-0 will-change-transform"
        >
          <Image
            src="/images/forest-floor.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>

      <section
        id="brand-story"
        className="bg-[linear-gradient(180deg,#13281f_0%,#1b3a2d_55%,#244837_100%)] px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d9ddc8]">
              Brand Story
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-[#F7F0E6] sm:text-5xl">
              Chapters of Care
            </h2>
            <p className="mt-4 max-w-2xl text-[#F7F0E6]/86">
              Yuveda unfolds as a guided narrative of craft: from regenerative
              sourcing to mindful extraction and transparent ritual design.
            </p>

            <div className="mt-8 space-y-6">
              {storyChapters.map((chapter, index) => {
                const Icon = chapter.icon;
                return (
                  <article
                    key={chapter.title}
                    className="flex gap-4 border-l border-[#C9A84C]/35 pl-4"
                  >
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f6e6] text-[#1f6f43]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#d2c08a]">
                        Chapter {index + 1}
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold text-[#F7F0E6]">
                        {chapter.title}
                      </h3>
                      <p className="mt-2 text-[#F7F0E6]/84">
                        {chapter.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="js-banyan-card self-stretch justify-self-center lg:justify-self-end">
            <div className="js-glass-tilt glass-hover-media relative h-full min-h-[420px] w-[min(360px,100vw)] overflow-hidden rounded-2xl border border-[#C9A84C]/35 shadow-[0_18px_35px_rgba(0,0,0,0.25)]">
              <Image
                src="/images/banyan-tree.jpg"
                alt="Banyan tree representing sustainability first"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 360px"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
                <p className="font-serif text-lg italic text-[#F7F0E6]">
                  Rooted in centuries of botanical wisdom.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#F7F0E6] px-4 py-24 sm:px-6 lg:px-8">
        <div
          data-string="parallax"
          data-string-parallax="0.022"
          data-string-parallax-bias="0.14"
          className="js-scroll-parallax absolute inset-0 will-change-transform"
        >
          <Image
            src="/images/leaf-texture.jpg"
            alt=""
            fill
            className="pointer-events-none object-cover opacity-[0.12]"
            sizes="100vw"
            aria-hidden
          />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5d7a67]">
            Illuminated Customer Scrolls
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-[#173821] sm:text-5xl">
            Testimonials
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {quotes.map((quote) => (
              <article
                key={quote.name}
                className="js-fade-on-scroll rounded-[1.3rem] border border-[#1f6f43]/15 bg-[#fff8e8]/92 p-7 shadow-[0_18px_50px_rgba(61,43,19,0.16)]"
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
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e9dfcf] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <article
                key={item.label}
                className="rounded-xl border border-[#2D4A3E]/20 bg-white/60 p-5 text-center"
              >
                <p className="text-4xl font-semibold text-[#2D4A3E]">
                  {item.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#5a7463]">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6eee1] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4c7858]">
            Ritual Journey
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-[#163621] sm:text-5xl">
            A Slower Path To Lasting Wellness
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {ritualSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="rounded-3xl border border-[#1f6f43]/15 bg-white/92 p-6"
                >
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7f4e6] text-[#1f6f43]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a3a25]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[#4d6958]">{step.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#2D4A3E] px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-semibold text-[#F7F0E6] sm:text-5xl">
            Begin your Ayurvedic ritual.
          </h2>
          <p className="mt-4 text-[#F7F0E6]/90">
            Explore curated formulations, discover personalized routines, and let
            each purchase feel like a step toward deeper balance.
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
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/60 bg-[#F7F0E6] px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#2D4A3E] transition hover:-translate-y-0.5"
            >
              Connect With Yuveda
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .botanical-ticker {
          overflow: hidden;
          border-top: 1px solid rgba(45, 74, 62, 0.18);
          border-bottom: 1px solid rgba(45, 74, 62, 0.18);
          padding: 0.85rem 0;
          white-space: nowrap;
          color: #4a6557;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .botanical-track {
          display: inline-block;
          padding-left: 100%;
          animation: botanicalTicker 20s linear infinite;
        }

        @keyframes botanicalTicker {
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 900px) {
          .botanical-track {
            animation-duration: 24s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .botanical-track {
            animation: none;
            transform: none;
            padding-left: 0;
          }

          .ingredient-marquee {
            overflow-x: auto;
            scrollbar-width: none;
          }

          .ingredient-marquee::-webkit-scrollbar {
            display: none;
          }

          .ingredient-lane,
          .ingredient-card {
            animation: none;
            transform: none;
          }
        }

        .ingredient-marquee {
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 1) 8%,
            rgba(0, 0, 0, 1) 92%,
            rgba(0, 0, 0, 0)
          );
          -webkit-mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 1) 8%,
            rgba(0, 0, 0, 1) 92%,
            rgba(0, 0, 0, 0)
          );
        }

        .ingredient-lane {
          display: flex;
          gap: 1.2rem;
          width: max-content;
          animation: ingredientMarquee 52s linear infinite;
        }

        @media (max-width: 640px) {
          .ingredient-marquee {
            mask-image: linear-gradient(
              to right,
              rgba(0, 0, 0, 0),
              rgba(0, 0, 0, 1) 4%,
              rgba(0, 0, 0, 1) 96%,
              rgba(0, 0, 0, 0)
            );
            -webkit-mask-image: linear-gradient(
              to right,
              rgba(0, 0, 0, 0),
              rgba(0, 0, 0, 1) 4%,
              rgba(0, 0, 0, 1) 96%,
              rgba(0, 0, 0, 0)
            );
          }

          .ingredient-lane {
            gap: 0.85rem;
            animation-duration: 60s;
          }
        }

        .ingredient-card {
          animation: ingredientDrift 7.8s ease-in-out infinite;
        }

        .ingredient-card:nth-child(2n) {
          animation-delay: 1.2s;
        }

        .ingredient-card:nth-child(3n) {
          animation-delay: 2.1s;
        }

        @keyframes ingredientMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes ingredientDrift {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .js-scroll-parallax {
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }

        .glass-hover-media {
          --mx: 50%;
          --my: 50%;
          --rx: 0deg;
          --ry: 0deg;
          position: relative;
          transform-style: preserve-3d;
          transition:
            transform 420ms cubic-bezier(0.2, 0.9, 0.2, 1),
            box-shadow 420ms ease;
          will-change: transform;
        }

        .glass-hover-media::before,
        .glass-hover-media::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }

        .glass-hover-media::before {
          background: radial-gradient(
            circle at var(--mx) var(--my),
            rgba(255, 255, 255, 0.46),
            rgba(255, 255, 255, 0.02) 38%,
            rgba(255, 255, 255, 0) 62%
          );
          opacity: 0;
          transition: opacity 220ms ease;
        }

        .glass-hover-media::after {
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 22%,
            rgba(255, 255, 255, 0.35) 45%,
            rgba(255, 255, 255, 0.06) 52%,
            rgba(255, 255, 255, 0) 76%
          );
          transform: translateX(-120%);
          opacity: 0;
          transition:
            transform 900ms ease,
            opacity 420ms ease;
        }

        .glass-hover-media.is-hovering {
          transform: perspective(960px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(-2px);
          box-shadow: 0 22px 44px rgba(18, 40, 28, 0.22);
        }

        .ingredient-media {
          transition: transform 900ms ease;
        }

        .js-ingredient-card:hover .ingredient-media {
          transform: scale(1.055);
        }

        .glass-hover-media.is-hovering::before {
          opacity: 1;
        }

        .glass-hover-media.is-hovering::after {
          opacity: 0.9;
          transform: translateX(120%);
        }

        @media (hover: none), (pointer: coarse) {
          .glass-hover-media,
          .glass-hover-media.is-hovering {
            transform: none;
            box-shadow: none;
          }

          .glass-hover-media::before,
          .glass-hover-media::after {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
