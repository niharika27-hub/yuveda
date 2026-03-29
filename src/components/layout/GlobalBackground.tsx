"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const siteBackgroundImage = "/images/hero-forest.jpg";

export function GlobalBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [isCompactMotion, setIsCompactMotion] = useState(false);
  const pathname = usePathname();
  const isHomeRoute = pathname === "/";

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

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: prefersReducedMotion ? 150 : isCompactMotion ? 110 : 90,
    damping: prefersReducedMotion ? 34 : isCompactMotion ? 30 : 24,
    mass: 0.35,
  });

  const backgroundScale = useTransform(
    smoothProgress,
    [0, 1],
    [1.02, prefersReducedMotion ? 1.04 : isCompactMotion ? 1.06 : 1.1]
  );
  const backgroundY = useTransform(
    smoothProgress,
    [0, 1],
    [0, prefersReducedMotion ? -10 : isCompactMotion ? -22 : -48]
  );

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ y: backgroundY }}
    >
      <motion.div
        className="absolute inset-[-5%] bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `url(${siteBackgroundImage})`,
          scale: backgroundScale,
          opacity: isHomeRoute ? 0.48 : 0.7,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: isHomeRoute
            ? "rgba(16, 35, 25, 0.34)"
            : "rgba(16, 35, 25, 0.52)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 15%, rgba(201,168,76,0.15), transparent 45%), radial-gradient(circle at 85% 78%, rgba(45,74,62,0.24), transparent 44%)",
        }}
      />
    </motion.div>
  );
}
