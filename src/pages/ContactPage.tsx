import React, { useEffect } from "react";
import { m as motion } from "motion/react";
import Contact from "../components/Contact";

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pt-24 min-h-screen"
    >
      <Contact />
    </motion.div>
  );
}
