import React, { useEffect } from "react";
import { m as motion } from "motion/react";
import Portfolio from "../components/Portfolio";

/**
 * Dedicated /portfolio page.
 *
 * Entrance animation tuned for snappiness: 0.25s opacity-only fade with a
 * tiny 8px translate (down from 0.4s + 20px). Anything longer reads as lag
 * because the user clicked and expected immediate feedback. Layout/paint
 * happens once the route mounts; the animation just smooths the swap.
 */
export default function PortfolioPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen"
    >
      <Portfolio />
    </motion.div>
  );
}
