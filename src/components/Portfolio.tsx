import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { m as motion, AnimatePresence } from "motion/react";
import { viewportConfig } from "../utils/animations";
import { usePortfolio } from "../hooks/usePortfolio";
import { X, ArrowUpRight } from "lucide-react";

/**
 * A portfolio item, normalised after fetching.
 * `image` is the canonical key the UI reads; `image_url` (Firestore-shaped)
 * is mapped onto it inside services/api.ts.
 */
interface PortfolioItem {
  id: string | number;
  title: string;
  category: string;
  image: string;
  sketchImage?: string;
  tags?: string[];
  challenge?: string;
  solution?: string;
  result?: string;
}

/** Bento layout class pattern — looped over project index. */
const BENTO_CLASSES = [
  "md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-auto",
  "md:col-span-1 md:row-span-1 aspect-square md:aspect-auto",
  "md:col-span-1 md:row-span-1 aspect-square md:aspect-auto",
  "md:col-span-1 md:row-span-1 aspect-[4/5] md:aspect-auto",
  "md:col-span-2 md:row-span-1 aspect-video md:aspect-auto",
  "md:col-span-3 md:row-span-1 aspect-video md:aspect-auto",
] as const;

interface ProjectCardProps {
  project: PortfolioItem;
  index: number;
  filter: string;
  onSelect: (p: PortfolioItem) => void;
}

const ProjectCard = React.memo(function ProjectCard({
  project,
  index,
  filter,
  onSelect,
}: ProjectCardProps) {
  const gridClass =
    filter === "All"
      ? BENTO_CLASSES[index % BENTO_CLASSES.length]
      : "md:col-span-1 md:row-span-1 aspect-square md:aspect-auto";

  const handleClick = useCallback(() => onSelect(project), [project, onSelect]);
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(project);
      }
    },
    [project, onSelect],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: Math.min(index * 0.04, 0.2) }}
      onClick={handleClick}
      onKeyDown={handleKey}
      role="button"
      tabIndex={0}
      aria-label={`Open project details for ${project.title}`}
      className={`group relative rounded-3xl overflow-hidden cursor-pointer w-full h-full shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.15)] transition-shadow duration-500 border border-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${gridClass}`}
    >
      <div className="relative w-full h-full overflow-hidden bg-slate-900">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          width={800}
          height={600}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.5s] ease-out group-hover:scale-[1.03] opacity-60 grayscale group-hover:grayscale-[0.8] group-hover:opacity-30"
        />

        {project.sketchImage && (
          <img
            src={project.sketchImage}
            alt=""
            loading="lazy"
            decoding="async"
            width={800}
            height={600}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:brightness-110 transition-all duration-1000 ease-in-out grayscale group-hover:grayscale-0"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 via-slate-900/10 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-500/30 rounded-[50%_40%_60%_30%] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-blue-500/30 rounded-[30%_60%_40%_70%] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent group-hover:from-slate-950/80 transition-colors duration-500 z-10 pointer-events-none" />

      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-10 transform opacity-80 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-out will-change-transform pointer-events-none">
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/20 rounded-md text-[9px] uppercase font-bold tracking-wider text-white border border-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-orange-400 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-3 transition-all duration-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" aria-hidden="true" /> {project.category}
        </p>
        <h3 className="text-3xl md:text-5xl font-bold font-heading text-white leading-tight">
          {project.title}
        </h3>

        {project.result && (
          <div className="mt-4 inline-block bg-gradient-to-r from-orange-500/90 to-pink-500/90 px-3 py-1.5 rounded-lg border border-white/20 self-start">
            <p className="text-white text-xs font-bold font-heading tracking-wide">
              Result: {project.result}
            </p>
          </div>
        )}
      </div>

      <div
        className="absolute top-8 right-8 z-20 w-12 h-12 rounded-full bg-white/95 text-slate-900 flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 shadow-xl"
        aria-hidden="true"
      >
        <ArrowUpRight size={24} className="group-hover:rotate-45 transition-transform duration-300" />
      </div>
    </motion.div>
  );
});

const Portfolio: React.FC = () => {
  const { data: portfolioItems } = usePortfolio() as { data: PortfolioItem[] };

  const [filter, setFilter] = useState<string>("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  // Reset tag filter when category changes
  useEffect(() => {
    setActiveTag(null);
  }, [filter]);

  const categories = useMemo<string[]>(() => {
    return ["All", ...Array.from(new Set(portfolioItems.map((p) => p.category)))];
  }, [portfolioItems]);

  const availableTags = useMemo<string[]>(() => {
    if (filter === "All") return [];
    const items = portfolioItems.filter((p) => p.category === filter);
    const tags = new Set<string>();
    items.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [filter, portfolioItems]);

  const displayPortfolio = useMemo<PortfolioItem[]>(() => {
    let items = portfolioItems;
    if (filter !== "All") items = items.filter((p) => p.category === filter);
    if (activeTag) items = items.filter((p) => p.tags?.includes(activeTag));
    return items;
  }, [filter, activeTag, portfolioItems]);

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  // Modal: lock body scroll, capture focus, restore properly on close.
  // Bug fix vs previous version: the original code reset `body.style.overflow`
  // to `"auto"`, which leaks an inline override even after close. Setting it
  // back to `""` lets the page's own stylesheet take over again.
  //
  // Focus trap: while the modal is open, Tab/Shift+Tab cycle ONLY through
  // focusable elements inside the modal. Without this, Tab can move focus to
  // elements behind the backdrop, which is both a UX and an accessibility bug.
  useEffect(() => {
    if (!selectedProject) return;

    lastFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Defer to next frame so the modal DOM exists before we focus.
    const focusFrame = requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    const FOCUSABLE =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
        return;
      }
      if (e.key !== "Tab") return;

      // Find the modal element and trap focus inside it.
      const modal = document.querySelector<HTMLElement>('[role="dialog"][aria-modal="true"]');
      if (!modal) return;
      const focusable = Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      lastFocusRef.current?.focus?.();
    };
  }, [selectedProject]);

  const handleSelect = useCallback((p: PortfolioItem) => setSelectedProject(p), []);
  const handleClose = useCallback(() => setSelectedProject(null), []);

  return (
    <section id="portfolio" className="pt-6 pb-24 px-6 relative overflow-hidden">
      <div className="absolute inset-x-0 inset-y-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-100/30 via-transparent to-transparent pointer-events-none -z-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              className="px-4 py-2 rounded-full bg-white text-pink-600 font-bold text-[10px] inline-block mb-6 border border-pink-100 shadow-sm uppercase tracking-[0.2em]"
            >
              The Gallery
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportConfig}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-slate-900 tracking-tight"
            >
              Selected{" "}
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-transparent bg-clip-text drop-shadow-sm">
                Masterpieces
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportConfig}
              transition={{ delay: 0.1 }}
              className="text-slate-600 text-lg font-light"
            >
              A cinematic glimpse into the brands we have transformed into art.
            </motion.p>
          </div>

          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportConfig}
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by category"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  aria-pressed={filter === cat}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                    filter === cat
                      ? "bg-slate-900 text-white shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
                      : "bg-white/95 border border-slate-200/60 text-slate-600 hover:text-slate-900 hover:bg-white hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>

            <AnimatePresence>
              {availableTags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: -10 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: -10 }}
                  className="flex flex-wrap gap-2 overflow-hidden"
                  role="group"
                  aria-label="Filter by tags"
                >
                  <button
                    type="button"
                    onClick={() => setActiveTag(null)}
                    aria-pressed={activeTag === null}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 ${
                      activeTag === null
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-transparent text-slate-500 border-slate-300 hover:border-slate-400 hover:text-slate-700"
                    }`}
                  >
                    All Tags
                  </button>
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveTag(tag)}
                      aria-pressed={activeTag === tag}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 ${
                        activeTag === tag
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-transparent text-slate-500 border-slate-300 hover:border-orange-400 hover:text-orange-600"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {displayPortfolio.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <p className="text-lg font-medium">No projects match the current filter.</p>
            <button
              type="button"
              onClick={() => {
                setFilter("All");
                setActiveTag(null);
              }}
              className="mt-4 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[360px]">
            <AnimatePresence mode="popLayout">
              {displayPortfolio.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  filter={filter}
                  onSelect={handleSelect}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Fullscreen project modal — rendered through portal so it escapes any
            transformed parents (which break position: fixed). */}
        {createPortal(
          <AnimatePresence mode="wait">
            {selectedProject && (
              <motion.div
                key="portfolio-modal"
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 pointer-events-none"
                role="dialog"
                aria-modal="true"
                aria-labelledby="portfolio-modal-title"
              >
                {/* Backdrop — quick crossfade with a subtle radial vignette to
                    draw the eye to the modal centre. */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={handleClose}
                  className="absolute inset-0 bg-slate-950/95 pointer-events-auto cursor-pointer"
                  style={{
                    backgroundImage:
                      "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(15,23,42,0.5), rgba(2,6,23,0.98))",
                  }}
                  aria-hidden="true"
                />

                {/* Modal shell — scales up from 92% with a gentle spring,
                    rotates 0.5° on entry for a hand-laid feeling, settles flat. */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 32, rotate: 0.5 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 24, rotate: -0.5 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 26,
                    mass: 0.9,
                  }}
                  className="relative w-full max-w-6xl bg-slate-50 rounded-[2rem] overflow-hidden shadow-2xl z-10 pointer-events-auto flex flex-col md:flex-row h-auto max-h-[95vh] md:max-h-[85vh] border border-white/20"
                >
                  {/* IMAGE PANEL */}
                  <div className="w-full md:w-[55%] h-[35vh] min-h-[250px] md:h-full relative shrink-0 overflow-hidden bg-slate-900">
                    {/* Wipe reveal — coloured panel slides off to expose the photo */}
                    <motion.div
                      initial={{ scaleX: 1 }}
                      animate={{ scaleX: 0 }}
                      exit={{ scaleX: 1 }}
                      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
                      className="absolute inset-0 z-10 origin-right pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(110deg,#f97316 0%,#ec4899 45%,#a855f7 80%)",
                      }}
                      aria-hidden="true"
                    />

                    {/* Image — slowly zooms in with a soft Ken Burns drift */}
                    <motion.img
                      initial={{ scale: 1.12, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.04, opacity: 0 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />

                    {/* Vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.5)_100%)] pointer-events-none" />

                    {/* Top-left category badge — slides in from the left */}
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.4, delay: 0.55 }}
                      className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-[0.2em] uppercase text-white"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" aria-hidden="true" />
                      {selectedProject.category}
                    </motion.div>
                  </div>

                  {/* CONTENT PANEL — children stagger in once the wipe lands */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: { staggerChildren: 0.06, delayChildren: 0.55 },
                      },
                      exit: {
                        transition: { staggerChildren: 0.03, staggerDirection: -1 },
                      },
                    }}
                    className="p-6 md:p-12 lg:p-16 w-full md:w-[45%] flex flex-col max-h-[60vh] md:max-h-full overflow-y-auto bg-slate-50 relative"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/5 rounded-full blur-2xl pointer-events-none" />

                    <button
                      ref={closeBtnRef}
                      type="button"
                      onClick={handleClose}
                      aria-label="Close project details"
                      className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors z-20 cursor-pointer shadow-md border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 hover:rotate-90 duration-300"
                    >
                      <X size={24} aria-hidden="true" />
                    </button>

                    {/* Slide-in accent line under the category */}
                    <motion.div
                      variants={{
                        hidden: { scaleX: 0 },
                        visible: { scaleX: 1 },
                        exit: { scaleX: 0 },
                      }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="origin-left h-0.5 w-12 bg-gradient-to-r from-orange-500 to-purple-600 mb-4 mt-6 md:mt-0"
                      aria-hidden="true"
                    />

                    <motion.p
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        visible: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: 6 },
                      }}
                      className="text-orange-500 font-bold tracking-[0.2em] uppercase text-xs mb-3 flex items-center gap-2"
                    >
                      {selectedProject.category}
                    </motion.p>

                    <motion.h3
                      id="portfolio-modal-title"
                      variants={{
                        hidden: { opacity: 0, y: 16 },
                        visible: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: 8 },
                      }}
                      className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-6 leading-tight tracking-tight"
                    >
                      {selectedProject.title}
                    </motion.h3>

                    {selectedProject.tags && selectedProject.tags.length > 0 && (
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 12 },
                          visible: { opacity: 1, y: 0 },
                          exit: { opacity: 0 },
                        }}
                        className="flex flex-wrap gap-2 mb-8"
                      >
                        {selectedProject.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 border border-slate-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </motion.div>
                    )}

                    <div className="space-y-6 flex-grow mb-12 relative z-10">
                      {selectedProject.challenge && (
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 14 },
                            visible: { opacity: 1, y: 0 },
                            exit: { opacity: 0 },
                          }}
                        >
                          <h4 className="text-slate-900 font-bold font-heading text-lg mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">
                              01
                            </span>
                            The Challenge
                          </h4>
                          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            {selectedProject.challenge}
                          </p>
                        </motion.div>
                      )}

                      {selectedProject.solution && (
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 14 },
                            visible: { opacity: 1, y: 0 },
                            exit: { opacity: 0 },
                          }}
                        >
                          <h4 className="text-slate-900 font-bold font-heading text-lg mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs">
                              02
                            </span>
                            The Solution
                          </h4>
                          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            {selectedProject.solution}
                          </p>
                        </motion.div>
                      )}

                      {selectedProject.result && (
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 14 },
                            visible: { opacity: 1, y: 0 },
                            exit: { opacity: 0 },
                          }}
                        >
                          <h4 className="text-slate-900 font-bold font-heading text-lg mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
                              03
                            </span>
                            The Result
                          </h4>
                          <div className="bg-gradient-to-r from-orange-50 to-purple-50 p-4 rounded-2xl border border-purple-100/50">
                            <p className="text-slate-800 font-semibold leading-relaxed text-sm md:text-base">
                              {selectedProject.result}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 14 },
                        visible: { opacity: 1, y: 0 },
                        exit: { opacity: 0 },
                      }}
                      className="mt-auto relative z-10"
                    >
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                          <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                            Client
                          </h4>
                          <p className="text-slate-900 font-semibold text-base">Confidential</p>
                        </div>
                        <div>
                          <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                            Year
                          </h4>
                          <p className="text-slate-900 font-semibold text-base">
                            {new Date().getFullYear()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
      </div>
    </section>
  );
};

export default React.memo(Portfolio);
