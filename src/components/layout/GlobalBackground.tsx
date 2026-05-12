"use client";

import { motion } from "framer-motion";

const siteBackgroundImage = "/journey/seed-to-herb.webp";

export function GlobalBackground() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[4px]"
        style={{
          backgroundImage: `url(${siteBackgroundImage})`,
          opacity: 1,
        }}
      />
    </motion.div>
  );
}
