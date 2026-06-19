import React from "react";
import { m as motion } from "motion/react";
import { viewportConfig } from "../utils/animations";
import { Zap } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";


const About = () => {
  const metrics = [
    {
      label: "Projects Completed",
      value: "22+",
      bgColor: "bg-white",
      valueColor: "text-orange-500",
      labelColor: "text-slate-600",
      transform: "translate-y-0 md:translate-y-8",
      isTextOnly: false,
    },
    {
      label: "Clients",
      value: "11+",
      bgColor: "bg-orange-50/80 border-orange-100/50",
      valueColor: "text-orange-600",
      labelColor: "text-orange-700",
      transform: "translate-y-0",
      isTextOnly: false,
    },
    {
      label: "Client Satisfaction",
      value: "99%",
      bgColor: "bg-purple-50/80 border-purple-100/50",
      valueColor: "text-slate-900",
      labelColor: "text-purple-700",
      transform: "translate-y-0 md:translate-y-8",
      isTextOnly: false,
    },
    {
      label: "On-Time Delivery",
      value: "100%",
      bgColor: "bg-white",
      valueColor: "text-slate-900",
      labelColor: "text-slate-600",
      transform: "translate-y-0",
      isTextOnly: false,
    },
  ];

  return (
    <section id="about" className="cv-skip py-24 px-6 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={{ duration: 0.25 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <span className="text-base leading-none">🚀</span> About Colour Splash Studio
            </div>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 leading-[1.1]">
              Not just an agency, your <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-orange-500 to-purple-600 text-transparent bg-clip-text pb-2">
                creative growth partner.
              </span>
            </h2>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              Based in Bhubaneswar,{" "}
              <strong className="text-slate-900 font-semibold">
                Colour Splash Studio
              </strong>{" "}
              was built on a simple premise: marketing shouldn't just look good,
              it needs to drive measurable results. We blend cutting-edge
              creative editing with data-backed digital strategies.
            </p>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              As a fast-growing modern creative studio, we are dedicated to helping
              local and online businesses scale through high-quality visual storytelling and
              premium content creation that captures attention and converts.
            </p>

            <a
              href="#services"
              className="inline-flex font-medium text-orange-500 hover:text-orange-400 transition-colors uppercase tracking-wider text-sm items-center gap-2"
            >
              Discover Our Approach <Zap size={16} />
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 },
              },
            }}
            className="grid grid-cols-2 gap-4 md:gap-6 md:pb-8"
          >
            {metrics.map((metric, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 20 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { type: "spring", stiffness: 100, damping: 15 },
                  },
                }}
                className={`p-6 md:p-8 rounded-[2rem] flex flex-col justify-center border shadow-xl shadow-slate-200/50 hover:scale-105 transition-transform duration-300 ${metric.bgColor} ${metric.transform}`}
              >
                <h3
                  className={`text-3xl md:text-4xl font-bold font-heading mb-2 leading-tight tracking-tight ${metric.valueColor}`}
                >
                  {metric.isTextOnly ? metric.value : <AnimatedCounter value={metric.value} />}
                </h3>
                <p
                  className={`text-sm md:text-base font-medium ${metric.labelColor}`}
                >
                  {metric.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(About);
