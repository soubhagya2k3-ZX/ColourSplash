import React from "react";
import { m as motion } from "motion/react";
import { viewportConfig } from "../utils/animations";
import { getTestimonials } from "../services/api";
import { useFetchData } from "../hooks/useFetchData";
import { TESTIMONIALS as fallbackData } from "../data";
import { Quote } from "lucide-react";

const Testimonials = () => {
  // Simulating future backend fetch
  const { data: testimonials } = useFetchData<any[]>(getTestimonials, fallbackData);

  return (
    <section id="testimonials" className="cv-skip py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            className="font-heading text-4xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight"
          >
            Trusted by Growing Businesses in <span className="text-gradient">Odisha</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-lg"
          >
            Real stories from authentic startup founders and local business owners.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 0.2, duration: 0.25 },
            },
          }}
          className="relative w-full py-6 overflow-hidden md:-mx-4 md:px-4 group"
        >
          {/* Gradient masks for smooth fade in/out at edges */}
          <div className="absolute inset-y-0 left-0 w-8 md:w-24 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 md:w-24 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none" />

          <div className="flex w-max shrink-0 gap-6 animate-marquee group-hover:[animation-play-state:paused] py-4" aria-live="off">
            {[...testimonials, ...testimonials].map((testimonial, index) => {
              const rating = testimonial.rating || 5;
              return (
                <div
                  key={`${testimonial.id}-${index}`}
                  style={{ width: "380px", maxWidth: "85vw" }}
                  className="glass-card p-8 rounded-3xl relative transition-all duration-500 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.15)] group/card overflow-hidden bg-white/60 hover:-translate-y-3 cursor-pointer shrink-0"
                >
                  {/* Dynamic lighting reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none " />
                  
                  {/* Artistic ink drop on hover */}
                  <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-400/20 blur-2xl rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 group-hover/card: pointer-events-none" />

                  <Quote
                    className="absolute top-8 right-8 text-slate-900/5 group-hover/card:text-orange-500/10 transition-colors duration-500"
                    size={80}
                  />

                  <div className="flex gap-1 mb-6 items-center drop-shadow-sm">
                    <span className="font-bold mr-1.5 text-lg text-slate-800">{rating}</span>
                    {[...Array(5)].map((_, i) => {
                      const fillPercentage = Math.max(0, Math.min(100, (rating - i) * 100));
                      return (
                        <div key={i} className="relative w-5 h-5">
                          <svg className="absolute inset-0 w-5 h-5 text-slate-200 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg className="absolute inset-0 w-5 h-5 text-orange-500 fill-current overflow-hidden" style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-lg leading-relaxed mb-8 relative z-10 text-slate-700 font-light">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-4 relative z-10">
                    <div>
                      <h4 className="font-bold text-slate-900 font-heading">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-slate-500 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Trusted By Bar */}
        <div className="mt-24 pt-12 border-t border-slate-200/50">
          <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">Trusted By</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-70">
            {["Sasmita’s Boutique", "Debasis Rout Café", "Urban Fit Studio", "EcoGlow"].map((client, i) => (
              <span key={i} className="text-xl md:text-2xl font-black font-heading text-slate-800 tracking-tight">
                {client}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default React.memo(Testimonials);
