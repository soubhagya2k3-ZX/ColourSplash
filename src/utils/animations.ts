/**
 * Shared animation configuration.
 *
 * The viewport config triggers animations 200px BEFORE an element enters
 * the visible viewport. Combined with `amount: 0`, this guarantees content
 * is fully animated in by the time the user actually scrolls to it,
 * eliminating the "blank-on-scroll" effect entirely.
 */
import type { ViewportOptions } from 'motion/react';

export const viewportConfig: ViewportOptions = {
  once: true,
  amount: 0,
  margin: '0px 0px 200px 0px',
};

/**
 * Eager viewport: fires immediately when ANY part of element enters the
 * viewport, with no negative offset. Useful for hero/above-the-fold elements.
 */
export const viewportConfigEager: ViewportOptions = {
  once: true,
  amount: 0,
  margin: '0px 0px 100px 0px',
};

/** Standard fade-up reveal. Subtle (16px), fast (0.4s), GPU-friendly. */
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};
