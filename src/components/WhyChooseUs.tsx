import React from "react";
import { m as motion } from "motion/react";
import { viewportConfig } from "../utils/animations";
import { Zap, Target, TrendingUp, Brush } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const points: Array<{
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  isTextOnly?: boolean;
  value?: string;
  suffix?: string;
}> = [
  {
    title: "ROI-First, Not Vanity Metrics",
    description: "Every frame is crafted to look premium and drive actual business results.",
    icon: Target,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    isTextOnly: true,
  },
  {
    title: "Creative + Consistent",
    description: "Content specifically designed for modern digital growth and engagement.",
    icon: Brush,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    isTextOnly: true,
  },
  {
    title: "Transparent & Hungry",
    description: "Always ahead of the curve, working actively as your remote creative team.",
    icon: TrendingUp,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    isTextOnly: true,
  },
  {
    title: "End-to-End Execution",
    description: "From creative ideation to cinematic production and data-driven deployment.",
    icon: Zap,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    isTextOnly: true,
  }
];

const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="cv-skip py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportConfig}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-white max-w-fit mx-auto mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 " />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-700">The Startup Advantage</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 tracking-tight"
          >
            Why Choose <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-transparent bg-clip-text drop-shadow-sm">Colour Splash</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-lg md:text-xl font-light leading-relaxed"
          >
            We focus on creativity, consistency, and measurable digital growth for modern brands.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 100, damping: 20 },
                  },
                }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative p-8 rounded-3xl bg-white/95 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] transition-all duration-500 overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className={`w-14 h-14 rounded-2xl ${point.bgColor} ${point.color} flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                
                <div className="relative z-10">
                  {point.isTextOnly ? (
                    <h3 className="text-xl font-bold font-heading text-slate-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-purple-600 transition-all duration-300">
                      {point.title}
                    </h3>
                  ) : (
                    <div className="flex items-baseline gap-1 mb-2">
                       <h3 className="text-3xl md:text-4xl font-extrabold font-heading text-slate-900 group-hover:text-orange-500 transition-colors duration-300 flex items-center">
                         <AnimatedCounter value={point.value || "0"} />
                         <span className="text-xl text-slate-500 ml-1">{point.suffix}</span>
                       </h3>
                    </div>
                  )}
                  
                  {!point.isTextOnly && (
                    <h4 className="font-bold text-slate-900 mb-2 truncate">
                      {point.title}
                    </h4>
                  )}
                  
                  <p className="text-slate-600 text-sm leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(WhyChooseUs);
