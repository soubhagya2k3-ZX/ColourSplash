import React, { useEffect, useRef } from "react";
import { useInView, useSpring } from "motion/react";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

/**
 * Counter animation that bypasses React reconciliation.
 * Spring updates a ref directly via .on('change'), writing to .textContent.
 * Result: zero React re-renders during the count-up — pure GPU/DOM, 60fps even
 * with multiple counters animating simultaneously.
 */
const AnimatedCounter = ({ value, className }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px 200px 0px" });

  // Extract numeric and suffix portion: "30+" -> 30, "+"; "150k" -> 150, "k"
  const match = value.match(/([\d.]+)(.*)/);
  const numericValue = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1,
  });

  useEffect(() => {
    if (!isInView) return;
    spring.set(numericValue);
  }, [isInView, numericValue, spring]);

  useEffect(() => {
    // Subscribe to spring changes; write directly to the DOM (no re-render).
    const unsubscribe = spring.on("change", (latest) => {
      if (numberRef.current) {
        numberRef.current.textContent = String(Math.round(latest));
      }
    });
    return () => unsubscribe();
  }, [spring]);

  if (!match) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      <span ref={numberRef}>0</span>
      {suffix}
    </span>
  );
};

export default React.memo(AnimatedCounter);
