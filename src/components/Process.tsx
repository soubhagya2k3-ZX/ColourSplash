import React from "react";
import { m as motion } from "motion/react";
import { viewportConfig } from "../utils/animations";
import { Target, Lightbulb, Rocket, BarChart3 } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Discovery & Audit",
    description:
      "We dive deep into your brand, analyze your competitors, and find hidden opportunities.",
    icon: Target,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
  },
  {
    id: "02",
    title: "Strategy & Planning",
    description:
      "We map out a custom blueprint tailored to your goals, audience, and budget.",
    icon: Lightbulb,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
  },
  {
    id: "03",
    title: "Execution & Launch",
    description:
      "We bring the strategy to life with compelling creative assets and precision targeting.",
    icon: Rocket,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
  {
    id: "04",
    title: "Monitor & Optimize",
    description:
      "We rely on data to continuously optimize campaigns for better ROI and sustained growth.",
    icon: BarChart3,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
];

const Process = () => {
  return (
    <section id="process" className="cv-skip py-24 px-6 bg-transparent relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-medium text-sm inline-block mb-4 border border-slate-200 shadow-sm"
          >
            How We Create
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-6"
          >
            The Studio <span className="text-gradient">Process</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            A proven methodology that turns imagination into cinematic reality. We don't just design; we architect emotional connections through art and data.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {/* Animated SVG connecting line for desktop */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[10%] right-[10%] h-12 -z-10 pointer-events-none opacity-40">
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path 
                d="M0,50 C250,-20 350,120 500,50 C650,-20 850,120 1000,50" 
                stroke="url(#paint0_linear)" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeDasharray="10 10"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={viewportConfig}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="paint0_linear" x1="0" y1="50" x2="1000" y2="50" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f97316" />
                  <stop offset="0.5" stopColor="#ec4899" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ duration: 0.25, delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Static decorative ink drop — kept for visual depth, no per-frame work */}
                <div
                  className="absolute -top-10 -left-6 text-orange-500/10 pointer-events-none group-hover:text-orange-500/20 transition-colors duration-500"
                  aria-hidden="true"
                >
                   <svg width="60" height="60" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                     <path d="M48.4,-73.4C63.2,-64.1,75.9,-50.8,83.1,-34.5C90.3,-18.2,92.1,1.1,86.6,18.4C81.1,35.8,68.4,51.1,53.4,63.1C38.4,75.1,21.1,83.7,2.8,79.5C-15.5,75.3,-34.7,58.3,-50.2,42.5C-65.7,26.7,-77.4,12.2,-80.7,-3.6C-84,-19.4,-78.8,-36.5,-67.2,-48.9C-55.6,-61.2,-37.5,-68.8,-21.2,-72.1C-4.9,-75.4,9.6,-74.6,24.4,-77.7C39.2,-80.8,54.3,-87.7,48.4,-73.4Z" transform="translate(100 100)" />
                   </svg>
                </div>

                <div className="mb-6 relative transition-transform duration-500 group-hover:-translate-y-4 will-change-transform">
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-lg z-20">
                    {step.id}
                  </div>

                  {/* Icon Circle */}
                  <div
                    className={`w-20 h-20 rounded-full ${step.bgColor} ${step.color} flex items-center justify-center shadow-lg border-4 border-white z-10 relative group-hover:shadow-[0_15px_30px_-5px_rgba(249,115,22,0.3)] transition-all duration-500`}
                  >
                    <Icon size={32} />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-purple-600 transition-all duration-300">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Process);
