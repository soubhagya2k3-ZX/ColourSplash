/**
 * CHANGES (SPA → MPA conversion):
 *   - Removed: import { Link } from "react-router-dom"
 *   - Added: currentPage prop (future-proofing for active-link styling)
 *   - Quick Links: <Link to="..."> → <a href="...">, trailing slashes on page routes
 *   - Admin link: <Link to="/admin"> → <a href="/admin/">
 *
 * UNCHANGED:
 *   - All animations, ambient gradients, marquee strip
 *   - Live IST clock + online/offline status
 *   - Three premium CTA cards (WhatsApp, Email, Visit)
 *   - Social media links, signature text
 *   - React.memo wrapper, useFetchData hook usage
 *   - All CSS classes
 */
import React, { useEffect, useState } from "react";
import type { PageName } from "./PageShell";
import { m as motion } from "motion/react";
import {
  ArrowUpRight,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Sparkles,
  Lock,
} from "lucide-react";
import { COMPANY_DETAILS as fallbackCompanyDetails } from "../data";
import { getCompanyDetails } from "../services/api";
import { useFetchData } from "../hooks/useFetchData";

/**
 * Cinematic finale footer.
 *
 * Design intent: this is *not* a sitemap dump (the navbar already covers that).
 * It's a closing statement — a billboard-sized invitation to get in touch,
 * paired with three premium contact CTAs and ambient brand polish.
 *
 * Performance:
 *   • All motion is transform/opacity only.
 *   • Live clock uses one setInterval (cleared on unmount, no leaks).
 *   • The huge headline is decorative; aria-hidden for screen readers; the
 *     same intent is delivered through a real <h2> below.
 */
interface FooterProps {
  currentPage?: PageName;
}

const Footer = ({ currentPage }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const { data: companyData } = useFetchData(
    getCompanyDetails,
    fallbackCompanyDetails,
    "companyDetails"
  );

  // Live IST time — updates once a minute. Adds a subtle "we're real" signal.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const formattedTime = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const istHour = Number(
    now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false })
  );
  const isOnline = istHour >= 9 && istHour < 22;

  const whatsappNumber = companyData.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20Colour%20Splash,%20I'm%20interested%20in%20your%20services`;

  const taglines = [
    "Cinematic brand stories",
    "Premium content production",
    "Studio-grade reels & ads",
    "From whisper to wave",
    "Creative growth partner",
  ];

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white isolate">
      {/* ─── Ambient gradients ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60vw 60vh at 10% 0%, rgba(249,115,22,0.18), transparent 60%)," +
            "radial-gradient(70vw 70vh at 90% 30%, rgba(236,72,153,0.14), transparent 60%)," +
            "radial-gradient(80vw 60vh at 50% 100%, rgba(168,85,247,0.16), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.6) 35%, rgba(168,85,247,0.6) 65%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ─── Tagline marquee strip ──────────────────────────────────────── */}
      <div className="relative border-b border-white/5 py-4 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((group) => (
            <div
              key={group}
              className="flex items-center gap-6 md:gap-12 pr-6 md:pr-12 whitespace-nowrap"
              aria-hidden={group === 1 ? "true" : undefined}
            >
              {taglines.map((t, i) => (
                <React.Fragment key={`${group}-${i}`}>
                  <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-slate-300/80 flex items-center gap-2">
                    <Sparkles size={12} className="text-orange-400" aria-hidden="true" />
                    {t}
                  </span>
                  <span className="text-orange-400/40">◆</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Main canvas ────────────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 pt-20 md:pt-28 pb-12">
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0, margin: "0px 0px 100px 0px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-semibold mb-10"
        >
          <span className="relative flex w-2 h-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${
                isOnline ? "bg-emerald-400" : "bg-amber-400"
              } opacity-75 animate-ping`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isOnline ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
          </span>
          <span className="tracking-wider uppercase text-white/90">
            {isOnline ? "Studio's open" : "After hours"}
          </span>
          <span className="text-white/40">·</span>
          <span className="font-mono text-white/60 tabular-nums">{formattedTime} IST</span>
        </motion.div>

        {/* Three premium CTA cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 md:mb-20">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${companyData.phone}`}
            className="group relative overflow-hidden rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-400/40 p-6 md:p-7 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <div
              className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background:
                  "radial-gradient(40% 60% at 30% 100%, rgba(16,185,129,0.25), transparent 60%)",
              }}
              aria-hidden="true"
            />
            <div className="relative flex items-start justify-between mb-8">
              <span className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                <MessageCircle size={20} aria-hidden="true" />
              </span>
              <ArrowUpRight
                size={18}
                className="text-white/40 group-hover:text-emerald-400 group-hover:rotate-45 transition-all duration-500"
                aria-hidden="true"
              />
            </div>
            <p className="relative text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-1">
              WhatsApp Us
            </p>
            <p className="relative font-heading text-2xl md:text-3xl font-bold text-white leading-tight">
              Chat now
            </p>
            <p className="relative text-sm text-white/50 mt-2">{companyData.phone}</p>
          </a>

          {/* Email */}
          <a
            href={`mailto:${companyData.email}`}
            aria-label={`Email ${companyData.email}`}
            className="group relative overflow-hidden rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-orange-400/40 p-6 md:p-7 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <div
              className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background:
                  "radial-gradient(40% 60% at 30% 100%, rgba(249,115,22,0.25), transparent 60%)",
              }}
              aria-hidden="true"
            />
            <div className="relative flex items-start justify-between mb-8">
              <span className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-400/20 text-orange-400 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                <Mail size={20} aria-hidden="true" />
              </span>
              <ArrowUpRight
                size={18}
                className="text-white/40 group-hover:text-orange-400 group-hover:rotate-45 transition-all duration-500"
                aria-hidden="true"
              />
            </div>
            <p className="relative text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-1">
              Send a brief
            </p>
            <p className="relative font-heading text-2xl md:text-3xl font-bold text-white leading-tight">
              Drop a line
            </p>
            <p className="relative text-sm text-white/50 mt-2 break-all">{companyData.email}</p>
          </a>

          {/* Studio visit */}
          <a
            href={companyData.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${companyData.address}`}
            className="group relative overflow-hidden rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-pink-400/40 p-6 md:p-7 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <div
              className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background:
                  "radial-gradient(40% 60% at 30% 100%, rgba(236,72,153,0.25), transparent 60%)",
              }}
              aria-hidden="true"
            />
            <div className="relative flex items-start justify-between mb-8">
              <span className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-400/20 text-pink-400 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                <MapPin size={20} aria-hidden="true" />
              </span>
              <ArrowUpRight
                size={18}
                className="text-white/40 group-hover:text-pink-400 group-hover:rotate-45 transition-all duration-500"
                aria-hidden="true"
              />
            </div>
            <p className="relative text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-1">
              The Studio
            </p>
            <p className="relative font-heading text-2xl md:text-3xl font-bold text-white leading-tight">
              Visit us
            </p>
            <p className="relative text-sm text-white/50 mt-2">Bhubaneswar, Odisha</p>
          </a>
        </div>

        {/* Mid-row: signature + socials + quick links */}
        <div className="grid md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-white/5">
          <div className="md:col-span-5">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-3">
              Signature
            </p>
            <p className="text-white/70 text-base leading-relaxed max-w-md">
              We blend cinematic art direction with measurable digital strategy.
              Every frame, every pixel, every campaign — engineered to convert.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-4">
              Quick Links
            </p>
            <ul className="space-y-2.5">
              {[
                { name: "Services", href: "/#services" },
                { name: "Portfolio", href: "/portfolio/" },
                { name: "Process", href: "/#process" },
                { name: "FAQ", href: "/#faq" },
                { name: "Get Started", href: "/contact/" },
              ].map((l) => (
                <li key={l.name}>
                  <a
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors focus:outline-none focus:text-white"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-orange-400 transition-all duration-300" />
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-4">
              Follow the Splash
            </p>
            <div className="flex items-center gap-3 mb-6">
              <a
                href="https://www.instagram.com/coloursplash.in/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group relative w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-400/50 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <span
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(249,115,22,0.18), rgba(236,72,153,0.18) 50%, rgba(168,85,247,0.18))",
                  }}
                  aria-hidden="true"
                />
                <Instagram size={18} aria-hidden="true" className="relative" />
              </a>
              <a
                href="https://x.com/Coloursplash01"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="group relative w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-400/50 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <span
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(249,115,22,0.18), rgba(236,72,153,0.18) 50%, rgba(168,85,247,0.18))",
                  }}
                  aria-hidden="true"
                />
                <Twitter size={18} aria-hidden="true" className="relative" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="group relative w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-400/50 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <span
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(249,115,22,0.18), rgba(236,72,153,0.18) 50%, rgba(168,85,247,0.18))",
                  }}
                  aria-hidden="true"
                />
                <Facebook size={18} aria-hidden="true" className="relative" />
              </a>
              <a
                href={`tel:${companyData.phone.replace(/[\s+]/g, "")}`}
                aria-label={`Call ${companyData.phone}`}
                className="group relative w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-400/50 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <Phone size={18} aria-hidden="true" />
              </a>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              Replies within 4 hours during studio hours.
              <br />
              Mon–Sat · 9:00–22:00 IST.
            </p>
          </div>
        </div>

        {/* Bottom row: copyright · admin · legal */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/40">
          <p className="font-medium">
            © {currentYear} {companyData.name}. Crafted with{" "}
            <span className="text-orange-400" aria-hidden="true">
              ♥
            </span>{" "}
            in Bhubaneswar.
          </p>
          <div className="flex items-center gap-5 flex-wrap">
            <a
              href="#"
              className="hover:text-white transition-colors focus:outline-none focus:text-white focus:underline"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors focus:outline-none focus:text-white focus:underline"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors focus:outline-none focus:text-white focus:underline"
            >
              Cookies
            </a>
            <a
              href="/admin/"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none focus:text-white focus:underline"
            >
              <Lock size={11} aria-hidden="true" />
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
