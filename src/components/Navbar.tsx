/**
 * CHANGES (SPA → MPA conversion):
 *   - Removed: import { Link, useLocation } from "react-router-dom"
 *   - Removed: const location = useLocation()
 *   - Added: currentPage prop (replaces useLocation for active-link detection)
 *   - Added: currentHash state + hashchange listener (maintains hash-active highlighting)
 *   - All <Link to="..."> replaced with <a href="...">
 *   - navLinks hrefs updated with trailing slashes for page routes
 *
 * UNCHANGED:
 *   - All animations (motion.nav, AnimatePresence, mobile menu transitions)
 *   - Scroll detection logic (isScrolled, rAF throttling)
 *   - Body scroll lock on mobile menu open
 *   - Escape key handler
 *   - All CSS classes, glass effect, gradient branding
 *   - React.memo wrapper
 *   - handleNavClick callback
 */
import React, { useState, useEffect, useCallback } from "react";
import { m as motion, AnimatePresence } from "motion/react";
import { Menu, X, Palette } from "lucide-react";
import type { PageName } from "./PageShell";

interface NavbarProps {
  currentPage?: PageName;
}

const Navbar = ({ currentPage }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /* Track the URL hash reactively so hash-links (About, Services) can show
     as "active" when on the home page — mirrors the old useLocation().hash. */
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    let ticking = false;
    let prev = window.scrollY > 50;
    setIsScrolled(prev);
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const next = window.scrollY > 50;
        if (next !== prev) {
          prev = next;
          setIsScrolled(next);
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleNavClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Determine which nav link is "active" using the currentPage prop
  // (replaces React Router's useLocation):
  // • hash links (e.g. /#about): match when on home AND hash equals
  // • root "/": match only on bare home (no hash)
  // • path routes: match by currentPage name
  const isLinkActive = (link: { href: string; hash: string }) => {
    if (link.hash) {
      return currentPage === "home" && currentHash === link.hash;
    }
    if (link.href === "/") {
      return currentPage === "home" && !currentHash;
    }
    if (link.href.startsWith("/portfolio")) return currentPage === "portfolio";
    if (link.href.startsWith("/contact")) return currentPage === "contact";
    return false;
  };

  const navLinks = [
    { name: "Home", href: "/", hash: "" },
    { name: "About", href: "/#about", hash: "#about" },
    { name: "Services", href: "/#services", hash: "#services" },
    { name: "Portfolio", href: "/portfolio/", hash: "" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Main Navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent ${
        isScrolled
          ? "bg-slate-50/95 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-slate-200/50"
          : "bg-transparent"
      }`}
    >
      <div
        className={`transition-all duration-500 max-w-7xl mx-auto px-6 flex justify-between items-center ${isScrolled ? "py-3" : "py-6"}`}
      >
        <a
          href="/"
          className="flex items-center gap-3 z-50 group focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-xl transition-all duration-300"
          aria-label="Colour Splash Studio Home"
        >
          <div
            className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl shadow-sm border border-orange-100/50 group-hover:shadow-md transition-all duration-500 group-hover:scale-105 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-purple-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Palette
              className="w-7 h-7 text-orange-500 relative z-10 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110"
              strokeWidth={2}
            />
          </div>
          <div className="flex flex-col justify-center group-hover:opacity-100 transition-opacity">
            <span className="font-heading text-[1.4rem] md:text-[1.6rem] text-slate-900 leading-none tracking-tight flex items-baseline drop-shadow-sm">
              <span className="font-extrabold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Colour
              </span>
              <span className="font-medium text-slate-800 ml-0.5">Splash</span>
            </span>
            <span className="font-sans text-[0.65rem] font-bold tracking-[0.3em] text-slate-400 uppercase leading-none mt-1.5 ml-0.5">
              Studio
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link);
              return (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-sm px-2 py-1 ${
                      isActive
                        ? "text-orange-500"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>
          <a
            href="/contact/"
            className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium transition-all hover:scale-105 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden z-50 text-slate-800 p-2 glass rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-0 left-0 w-full h-[100dvh] bg-slate-50/98 backdrop-blur-sm flex flex-col items-center justify-center px-6 overflow-hidden md:hidden"
          >
            <ul className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => {
                const isActive = isLinkActive(link);
                return (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a
                      href={link.href}
                      onClick={handleNavClick}
                      className={`text-2xl font-heading font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-md px-4 py-3 min-h-[44px] flex items-center ${
                        isActive ? "text-orange-500" : "text-slate-800"
                      }`}
                    >
                      {link.name}
                    </a>
                  </motion.li>
                );
              })}
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <a
                  href="/contact/"
                  onClick={handleNavClick}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 text-white text-lg font-medium shadow-lg shadow-purple-500/25 mt-4 inline-block focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 min-h-[44px]"
                >
                  Get Started
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default React.memo(Navbar);
