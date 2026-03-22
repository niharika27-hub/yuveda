"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const siteBackgroundImage = "/journey/seed-to-herb.webp";

export function GlobalBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [isCompactMotion, setIsCompactMotion] = useState(false);

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
    [1.04, prefersReducedMotion ? 1.05 : isCompactMotion ? 1.08 : 1.13]
  );
  const backgroundY = useTransform(
    smoothProgress,
    [0, 1],
    [0, prefersReducedMotion ? -12 : isCompactMotion ? -30 : -64]
  );

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ y: backgroundY }}
    >
      <motion.div
        className="absolute inset-[-5%] bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: `url(${siteBackgroundImage})`, scale: backgroundScale }}
      />
      <div className="absolute inset-0 bg-black/20" />
    </motion.div>
  );
}
