import React, { useRef } from "react";
import { m as motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Play, Palette, Brush, Droplet, PenTool } from "lucide-react";



const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transform values
  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const floatingCard1Y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const floatingCard2Y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative flex flex-col pt-32 pb-0 overflow-hidden min-h-[100vh]"
    >
      <div className="flex-1 flex items-center px-6 w-full mb-16 relative">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10 relative">
          {/* Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
            style={{ y: textY, opacity: textOpacity }}
            className="max-w-2xl"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 " />
              Premium Creative Studio
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="font-heading text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-[-0.02em] mb-6 text-slate-900 drop-shadow-sm"
            >
              From a Whisper to a Wave —
              <span className="text-transparent border-none bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 block pt-2 pb-4 tracking-tight drop-shadow-md">Let’s Build Your Digital Presence.</span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1,
                  },
                },
              }}
              className="text-slate-600 text-lg md:text-2xl font-medium mb-10 max-w-xl leading-relaxed opacity-90"
            >
              Turning concepts into impactful cinematic experiences through modern art direction and dynamic motion design.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <a
                href="/contact/"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Get Started
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </a>

              <a
                href="/portfolio/"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-800 font-medium hover:bg-slate-50 shadow-sm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <Play size={18} className="text-orange-500" aria-hidden="true" />
                View Portfolio
              </a>
            </motion.div>
          </motion.div>

          {/* Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center pointer-events-none"
          >
            {/* Abstract floating elements simulating a creative composition */}
            <div className="relative w-full max-w-lg aspect-square">
              {/* Dynamic artistic glow layer */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-300/40 via-pink-400/20 to-transparent rounded-[40%_60%_70%_30%] blur-2xl"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300/40 via-purple-400/20 to-transparent rounded-[70%_30%_50%_50%] blur-2xl"
        />

              {/* Main Artwork Frame */}
              <motion.div
                style={{ y: floatingCard1Y }}
                className="absolute z-10 w-full h-full motion-optimize"
              >
                <div
                  className="absolute top-0 right-5 w-[70%] h-[80%] glass-card rounded-[2rem] overflow-hidden p-3 shadow-2xl group pointer-events-auto cursor-pointer border-[0.5px] border-white/40 motion-optimize hero-card-a"
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900">
                    {/*
                      Hero card uses a two-image hover reveal:
                      • Bottom layer = the "final" cinematic render (visible on hover).
                        Vivid paint pour — directly evokes the ColourSplash brand.
                      • Top layer    = the "concept sketch" (visible by default,
                        desaturated to look like an in-progress study).
                    */}
                    <img
                      src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop"
                      alt="Vibrant cinematic paint splash representing finished creative work delivered by ColourSplash Studio"
                      decoding="async"
                      fetchPriority="high"
                      loading="eager"
                      width={1000}
                      height={667}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-90 "
                    />
                    {/* Sketch/Concept overlay — visible by default, fades on hover */}
                    <img
                      src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=1000&auto=format&fit=crop"
                      alt="Designer's hand-drawn concept sketch for a brand campaign"
                      decoding="async"
                      loading="eager"
                      width={1000}
                      height={667}
                      className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-1000 ease-in-out grayscale contrast-150"
                    />
                    {/* Ink overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start gap-2">
                       <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] text-white tracking-widest font-bold uppercase border border-white/20">
                          Interactive
                       </div>
                       <p className="text-white text-sm font-medium">Hover for final render</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                style={{ y: floatingCard2Y }}
                className="absolute z-20 w-full h-full motion-optimize"
              >
                <div
                  className="absolute bottom-[15%] left-0 w-64 glass-card rounded-[2rem] overflow-hidden p-6 flex flex-col gap-4 shadow-xl pointer-events-auto border-white/60 bg-white/40 motion-optimize hero-card-b"
                >
                  <div className="flex justify-between items-center">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-orange-100">
                      <div
                        className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(249,115,22,1)_360deg)] spin-slow motion-optimize"
                      />
                      <div className="absolute inset-0.5 bg-white rounded-full flex items-center justify-center text-orange-500 z-10 shadow-inner">
                        <Palette size={20} className="badge-wiggle motion-optimize" />
                      </div>
                    </div>
                    <div className="text-xl font-extrabold text-slate-800 tracking-tighter text-right leading-tight">100%<br/><span className="text-sm font-medium text-purple-600">Creative</span></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">Premium Quality</h4>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                      Delivering cinematic magic for modern brands.
                    </p>
                    <div className="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden shadow-inner isolate">
                      {/* Use scaleX so we animate transform instead of layout
                          (width). Same visual; GPU-only path. */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 0.85 }}
                        transition={{ delay: 1, duration: 0.6, ease: "circOut" }}
                        className="h-full origin-left bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-full motion-optimize"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Ambient Floating Sketch Elements — pure CSS animations */}
              <div
                 className="absolute top-[10%] left-[5%] z-30 w-16 h-16 opacity-40 text-orange-500 pointer-events-none drop-shadow-md flex items-center justify-center motion-optimize hero-anim-1"
                 aria-hidden="true"
              >
                  <PenTool size={48} strokeWidth={1} />
              </div>

              <div
                 className="absolute bottom-[20%] right-[-5%] z-30 w-16 h-16 opacity-40 text-purple-600 pointer-events-none drop-shadow-md flex items-center justify-center motion-optimize hero-anim-2"
                 aria-hidden="true"
              >
                  <Palette size={56} strokeWidth={1} />
              </div>

              <div
                 className="absolute top-[40%] right-[15%] z-30 w-12 h-12 opacity-50 text-pink-500 pointer-events-none drop-shadow-md flex items-center justify-center motion-optimize hero-anim-3"
                 aria-hidden="true"
              >
                  <Brush size={40} strokeWidth={1} />
              </div>

              <div
                 className="absolute top-[60%] left-[10%] z-30 w-12 h-12 opacity-50 text-blue-500 pointer-events-none drop-shadow-md flex items-center justify-center motion-optimize hero-anim-4"
                 aria-hidden="true"
              >
                  <Droplet size={36} strokeWidth={1} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative w-full bg-slate-50/95 border-t border-slate-200/50 py-8 overflow-hidden z-20 mt-auto shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.05)] flex items-center">
        {/* Subtle splash background in marquee */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
        
        {/* Trusted By Marquee */}
        <div className="flex w-max animate-[marquee_30s_linear_infinite] will-change-transform pt-1">
          {[1, 2].map((group) => (
            <div
              key={group}
              className="flex items-center gap-12 md:gap-24 pr-12 md:pr-24 whitespace-nowrap"
            >
              <span className="text-slate-500 font-bold tracking-widest uppercase text-xs flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Sasmita’s Boutique
              </span>
              <span className="text-slate-500 font-bold tracking-widest uppercase text-xs flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-pink-400" /> Debasis Rout Café
              </span>
              <span className="text-slate-500 font-bold tracking-widest uppercase text-xs flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Urban Fit Studio
              </span>
              <span className="text-slate-500 font-bold tracking-widest uppercase text-xs flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> EcoGlow
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Hero);
