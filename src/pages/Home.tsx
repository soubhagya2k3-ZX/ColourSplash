import React from "react";
import Hero from "../components/Hero";
import BrushStrokeDivider from "../components/BrushStrokeDivider";
import { m as motion } from "motion/react";
import Services from "../components/Services";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import Process from "../components/Process";
import FAQ from "../components/FAQ";
import About from "../components/About";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Hero />
      <BrushStrokeDivider />

      <About />
      <Process />
      <BrushStrokeDivider />

      <Services />
      <BrushStrokeDivider />

      <WhyChooseUs />
      <BrushStrokeDivider />

      <Testimonials />
      <BrushStrokeDivider />

      <FAQ />
      <BrushStrokeDivider />
    </motion.div>
  );
}
