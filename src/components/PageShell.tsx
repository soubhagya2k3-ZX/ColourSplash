/**
 * CHANGES (SPA → MPA conversion):
 *   - NEW FILE: replaces App.tsx's layout role
 *   - Accepts `currentPage` prop instead of using React Router
 *   - Passes `currentPage` to Navbar and Footer for active-link highlighting
 *   - Hash-scroll logic uses window.location.hash (no React Router dependency)
 *
 * UNCHANGED (carried over from App.tsx):
 *   - LazyMotion + MotionConfig configuration (identical)
 *   - Scroll progress bar (useScroll + useSpring, same stiffness/damping/restDelta)
 *   - Skip-to-main-content accessibility link (identical)
 *   - AnimatedBackground, FloatingContact rendering (identical)
 *   - All CSS classes and visual layout (identical)
 */
import React, { useEffect, type ReactNode } from "react";
import AnimatedBackground from "./AnimatedBackground";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingContact from "./FloatingContact";
import { m as motion, useScroll, useSpring, LazyMotion, domAnimation, MotionConfig } from "motion/react";

export type PageName = "home" | "portfolio" | "contact" | "admin";

interface PageShellProps {
  currentPage: PageName;
  children: ReactNode;
}

export default function PageShell({ currentPage, children }: PageShellProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  /* Hash-scroll on mount — replaces the React Router location.hash effect
     from App.tsx. In the MPA model this fires once on page load. */
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="relative min-h-screen overflow-x-hidden bg-transparent text-slate-900">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
            Skip to main content
          </a>
          <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-purple-600 origin-[0%] z-[60]" style={{ scaleX }} aria-hidden="true" />
          <AnimatedBackground />
          <Navbar currentPage={currentPage} />
          <main id="main-content" className="min-h-screen pt-[80px]">
            {children}
          </main>
          <Footer currentPage={currentPage} />
          <FloatingContact />
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
