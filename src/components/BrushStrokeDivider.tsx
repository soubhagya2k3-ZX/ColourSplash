import React from "react";
import { m as motion } from "motion/react";
import { viewportConfig } from "../utils/animations";

/**
 * Decorative brush-stroke divider used between sections.
 *
 * Optimisation notes:
 *  • The previous version inlined a feTurbulence + feDisplacementMap filter
 *    on every divider — and Home renders 7 of them. Removed the filter:
 *    rough edges weren't visible at the divider's tiny height and the
 *    filter was the most expensive part of the section break.
 *  • The path itself draws once on enter (pathLength tween) and never again.
 *  • aria-hidden — pure decoration.
 */
const BrushStrokeDivider = () => {
  return (
    <div
      className="w-full h-12 flex justify-center items-center overflow-hidden opacity-20 my-[-24px] relative z-0 pointer-events-none"
      aria-hidden="true"
    >
      <motion.svg
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        viewport={viewportConfig}
        width="100%"
        height="100%"
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        fill="none"
        stroke="url(#brush-gradient)"
        strokeWidth={6}
        strokeLinecap="round"
        className="max-w-4xl"
      >
        <defs>
          <linearGradient id="brush-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
            <stop offset="20%" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="80%" stopColor="#a855f7" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 50 20 Q 250 5 500 20 T 950 20" />
      </motion.svg>
    </div>
  );
};

export default React.memo(BrushStrokeDivider);
