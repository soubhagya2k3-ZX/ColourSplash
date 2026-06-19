import React from "react";
import { m as motion } from "motion/react";
import { viewportConfig } from "../utils/animations";
import { Code, TrendingUp, Video, Target, ArrowRight, type LucideIcon } from "lucide-react";

import { SERVICES } from "../data";

interface ServicesProps {
  overviewOnly?: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  TrendingUp,
  Video,
  Target,
};

const Services: React.FC<ServicesProps> = ({ overviewOnly }) => {
  // Show 4 services max for the horizontal layout
  const displayServices = overviewOnly ? SERVICES.slice(0, 4) : SERVICES.slice(0, 4); 

  return (
    <section id="services" className="cv-skip py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative flex flex-col justify-start">
        {/* Section heading — always visible. Echoes the brand voice and frames the four pillars below. */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto relative z-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 text-xs font-bold uppercase tracking-[0.25em] mb-6 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
            What We Do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ delay: 0.05 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-slate-900 tracking-tight leading-[1.1]"
          >
            Services that <span className="text-gradient">splash</span> across every channel
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-base md:text-lg leading-relaxed"
          >
            From the first sketch to the final scroll-stopping ad — we craft
            cinematic content, scalable platforms, and data-backed campaigns
            that turn modern brands into unmissable experiences.
          </motion.p>
        </div>

        {/* The Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10 w-full pt-4 md:pt-12 pb-12">
          {displayServices.map((service, index) => {
            const IconComponent = ICON_MAP[service.icon];
            
            // Stagger alignments for the "up down" wavy look
            const translateY = [
              'md:-translate-y-8', 
              'md:translate-y-12', 
              'md:translate-y-2', 
              'md:translate-y-20'
            ][index];

            const colors = [
              'text-orange-500',
              'text-pink-500',
              'text-purple-500',
              'text-orange-500'
            ];
            const colorClass = colors[index];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                className={`w-full relative group ${translateY}`}
              >
                <div className="glass-card p-6 rounded-3xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group-hover:shadow-[0_20px_50px_rgba(249,115,22,0.15)] group-hover:border-orange-200/50 z-10 h-full flex flex-col bg-white/80 backdrop-blur-md border border-white/40">
                  
                  {/* Background Gradient Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex flex-col items-start h-full">
                    <div className={`relative w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-5 ${colorClass} group-hover:scale-110 transition-transform duration-500`}>
                      {IconComponent && <IconComponent size={24} />}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 font-heading mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-purple-600 transition-all duration-300 leading-tight">
                      {service.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                      {service.description}
                    </p>

                    <a href="/contact/" className="flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-purple-600 transition-colors uppercase tracking-wider mt-auto">
                      Learn More
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-8 md:mt-12 text-center relative z-20">
          <a href="/contact/" className="px-8 py-4 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-2 shadow-xl shadow-slate-900/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
            Start a Project
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Services);
