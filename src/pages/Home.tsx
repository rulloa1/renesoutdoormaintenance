/*
 * DESIGN: Industrial Brutalism + Organic Contrast
 * - Near-black base, neon lime accent, Barlow Condensed headings
 * - Asymmetric hero: left text, right full-bleed image
 * - GSAP ScrollTrigger animations: fade-up, stagger, scale
 * - Left-anchored content, rule lines, tag badges
 */
import { Link } from "wouter";
import { ArrowRight, Phone, Mail, CheckCircle2, Scissors, Leaf, Droplets, Flower2 } from "lucide-react";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663491975491/Lsy8wiS8aMn4LGx9qSEa7e/hero-yard-PQzk4FydgeYTL7spwcfZ2J.webp";
const MOWING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663491975491/Lsy8wiS8aMn4LGx9qSEa7e/service-mowing-VpqJSLytwbDBFi5bPSEezy.webp";
const MULCH_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663491975491/Lsy8wiS8aMn4LGx9qSEa7e/service-mulch-M9sUnziza2fYy6d4xPRFuV.webp";
const POWERWASH_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663491975491/Lsy8wiS8aMn4LGx9qSEa7e/service-powerwash-c6NnWSRHpzeu9uFWjAVAMM.webp";
const CLEANUP_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663491975491/Lsy8wiS8aMn4LGx9qSEa7e/service-cleanup-HiJDjfMDvBHyk97bE49UdS.webp";

// Gallery images - Real before and after photos
const GALLERY_BEFORE_1 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663491975491/Lsy8wiS8aMn4LGx9qSEa7e/1_797f8610.webp";
const GALLERY_AFTER_1 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663491975491/Lsy8wiS8aMn4LGx9qSEa7e/image2_bd23c7df.webp";
const GALLERY_BEFORE_2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663491975491/Lsy8wiS8aMn4LGx9qSEa7e/image5_7c0cf69e.webp";
const GALLERY_AFTER_2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663491975491/Lsy8wiS8aMn4LGx9qSEa7e/image1_e8ac9821.jpeg";

const galleryProjects = [
  { before: GALLERY_BEFORE_1, after: GALLERY_AFTER_1, title: "Mulch & Landscaping Refresh", service: "Mulch Installation & Landscaping" },
  { before: GALLERY_BEFORE_2, after: GALLERY_AFTER_2, title: "Yard Cleanup & Restoration", service: "Cleanup & Yard Maintenance" },
];

const services = [
  {
    icon: <Scissors size={22} className="text-[#B5E61D]" />,
    title: "Yard Maintenance",
    desc: "Routine mowing, edging, trimming, and seasonal upkeep that keeps the property crisp and cared for.",
    img: MOWING_IMG,
  },
  {
    icon: <Leaf size={22} className="text-[#B5E61D]" />,
    title: "Cleanups & Removals",
    desc: "Leaf cleanup, debris clearing, overgrowth removal, and refresh work for a cleaner exterior presentation.",
    img: CLEANUP_IMG,
  },
  {
    icon: <Flower2 size={22} className="text-[#B5E61D]" />,
    title: "Mulch & Garden Beds",
    desc: "Fresh mulch installation, planting support, garden-bed touchups, and exterior power washing for a finished look.",
    img: MULCH_IMG,
  },
  {
    icon: <Droplets size={22} className="text-[#B5E61D]" />,
    title: "Power Washing",
    desc: "High-pressure cleaning of driveways, walkways, patios, and exterior surfaces for a like-new finish.",
    img: POWERWASH_IMG,
  },
];

const features = [
  "Clean, sharp curb appeal",
  "Simple booking for day and time",
  "Reliable local outdoor service",
  "No complicated process",
];

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  const servicesGridRef = useRef<HTMLDivElement>(null);
  const whyRenesSectionRef = useRef<HTMLDivElement>(null);
  const ctaBannerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stagger service cards on scroll
    if (servicesGridRef.current) {
      const cards = servicesGridRef.current.querySelectorAll(":scope > div");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          scrollTrigger: {
            trigger: servicesGridRef.current,
            start: "top 70%",
            end: "top 40%",
            scrub: false,
          },
        }
      );
    }

    // Why Rene's section: left image slides in, right text fades
    if (whyRenesSectionRef.current) {
      const leftCol = whyRenesSectionRef.current.querySelector(".why-left");
      const rightCol = whyRenesSectionRef.current.querySelector(".why-right");

      if (leftCol) {
        gsap.fromTo(
          leftCol,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            scrollTrigger: {
              trigger: whyRenesSectionRef.current,
              start: "top 70%",
              end: "top 40%",
              scrub: false,
            },
          }
        );
      }

      if (rightCol) {
        gsap.fromTo(
          rightCol,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            scrollTrigger: {
              trigger: whyRenesSectionRef.current,
              start: "top 70%",
              end: "top 40%",
              scrub: false,
            },
          }
        );
      }
    }

    // Gallery items fade in on scroll
    if (galleryRef.current) {
      const items = galleryRef.current.querySelectorAll(".gallery-item");
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 70%",
            end: "top 40%",
            scrub: false,
          },
        }
      );
    }

    // CTA banner text animation
    if (ctaBannerRef.current) {
      const h2 = ctaBannerRef.current.querySelector("h2");
      const p = ctaBannerRef.current.querySelector("p");
      const buttons = ctaBannerRef.current.querySelectorAll("a, button");

      if (h2 && p) {
        gsap.fromTo(
          [h2, p],
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
              trigger: ctaBannerRef.current,
              start: "top 80%",
              end: "top 60%",
              scrub: false,
            },
          }
        );
      }

      if (buttons.length > 0) {
        gsap.fromTo(
          buttons,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            scrollTrigger: {
              trigger: ctaBannerRef.current,
              start: "top 80%",
              end: "top 60%",
              scrub: false,
            },
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-[#0D0D0D]">
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background image — right side, full bleed */}
        <div className="absolute inset-0 md:left-[45%]">
          <img
            src={HERO_IMG}
            alt="Beautifully maintained yard"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay — fades image into dark bg */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]/30" />
        </div>

        {/* Content */}
        <div className="relative container pb-20 md:pb-28">
          <div className="max-w-2xl">
            {/* Tag */}
            <div className="mb-6">
              <span className="tag-lime">Now Booking</span>
            </div>

            {/* Headline */}
            <h1
              className="text-[clamp(3.5rem,10vw,7rem)] leading-[0.9] font-black uppercase tracking-tight text-white mb-6"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Restore Your{" "}
              <span className="text-[#B5E61D]">Outdoor</span>
              <br />
              Appearance
            </h1>

            {/* Subtext */}
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Yard maintenance, cleaning, mulch, planting, and power washing. Clean local outdoor care with bold curb appeal and straightforward booking.
            </p>

            {/* Feature list */}
            <ul className="mb-10 flex flex-col gap-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-white/70 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <CheckCircle2 size={15} className="text-[#B5E61D] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link href="/booking">
                <span className="btn-lime">
                  Book Your Service <ArrowRight size={16} />
                </span>
              </Link>
              <Link href="/services">
                <span className="btn-outline-lime">
                  View Services
                </span>
              </Link>
            </div>

            {/* Contact strip */}
            <div className="mt-10 flex flex-wrap gap-5 pt-8 border-t border-white/10">
              <a href="tel:8325422979" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <Phone size={14} className="text-[#B5E61D]" />
                832-542-2979
              </a>
              <a href="mailto:renelklever@gmail.com" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <Mail size={14} className="text-[#B5E61D]" />
                renelklever@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Decorative bottom rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#B5E61D]/40 via-[#B5E61D]/10 to-transparent" />
      </section>

      {/* ─── SERVICE TAGS TICKER ──────────────────────────────── */}
      <div className="bg-[#B5E61D] py-3 overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap animate-[ticker_20s_linear_infinite]">
          {["Yard Maintenance", "Cleanup & Removal", "Lay Mulch", "Gardening", "Power Washing", "Yard Maintenance", "Cleanup & Removal", "Lay Mulch", "Gardening", "Power Washing"].map((item, i) => (
            <span
              key={i}
              className="text-[#0D0D0D] font-black text-sm uppercase tracking-widest shrink-0"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {item} <span className="mx-2 opacity-40">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── SERVICES PREVIEW ─────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#111111]">
        <div className="container">
          {/* Section header */}
          <div className="mb-14">
            <span className="rule-lime mb-4 block" />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[#B5E61D] text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Our Services
                </p>
                <h2
                  className="text-[clamp(2.5rem,6vw,4.5rem)] leading-none font-black uppercase text-white"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Practical Outdoor Work<br />
                  <span className="text-[#B5E61D]">With a Strong Finish</span>
                </h2>
              </div>
              <Link href="/services">
                <span className="btn-outline-lime shrink-0">
                  All Services <ArrowRight size={15} />
                </span>
              </Link>
            </div>
          </div>

          {/* Service cards — staggered grid with GSAP */}
          <div ref={servicesGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((svc) => (
              <div key={svc.title} className="group service-card">
                <div className="relative overflow-hidden bg-[#1A1A1A] border border-white/5 hover:border-[#B5E61D]/40 transition-all duration-300 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={svc.img}
                      alt={svc.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
                  </div>
                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {svc.icon}
                      <h3
                        className="text-white font-bold uppercase tracking-wide text-base"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {svc.title}
                      </h3>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {svc.desc}
                    </p>
                  </div>
                  {/* Hover lime rule */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#B5E61D] group-hover:w-full transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY RENE'S ───────────────────────────────────────── */}
      <section ref={whyRenesSectionRef} className="py-20 md:py-28 bg-[#0D0D0D]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: image */}
            <div className="why-left">
              <div className="relative">
                <img
                  src={MOWING_IMG}
                  alt="Professional lawn mowing"
                  className="w-full aspect-[4/3] object-cover"
                />
                {/* Decorative lime border offset */}
                <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-[#B5E61D]/30 pointer-events-none" />
                {/* Stat badge */}
                <div className="absolute -bottom-5 left-6 bg-[#B5E61D] px-5 py-3">
                  <p className="text-[#0D0D0D] font-black text-2xl leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Local
                  </p>
                  <p className="text-[#0D0D0D]/70 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Houston Area
                  </p>
                </div>
              </div>
            </div>

            {/* Right: content */}
            <div className="why-right">
              <span className="rule-lime mb-5 block" />
              <p className="text-[#B5E61D] text-xs font-bold uppercase tracking-widest mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Why Rene's
              </p>
              <h2
                className="text-[clamp(2.2rem,5vw,3.8rem)] leading-none font-black uppercase text-white mb-6"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Outdoor Care<br />
                <span className="text-[#B5E61D]">Done Right</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                From regular yard maintenance to mulch, planting, cleanup, and power washing, Rene's Outdoor Maintenance helps homeowners keep their exterior looking neat, healthy, and ready to impress — without a complicated process.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  { label: "Clean Lines", sub: "Sharp edging & mow patterns" },
                  { label: "Sharp Finishes", sub: "Detail-oriented results" },
                  { label: "Easy Scheduling", sub: "Pick your day and time" },
                  { label: "Reliable Service", sub: "Show up and get it done" },
                ].map((item) => (
                  <div key={item.label} className="border-l-2 border-[#B5E61D] pl-4">
                    <p className="text-white font-bold uppercase text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {item.label}
                    </p>
                    <p className="text-white/40 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {item.sub}
                    </p>
                  </div>
                ))}
              </div>
              <Link href="/booking">
                <span className="btn-lime">
                  Book a Service <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GALLERY ───────────────────────────────────────────── */}
      <section ref={galleryRef} className="py-20 md:py-28 bg-[#111111]">
        <div className="container">
          {/* Section header */}
          <div className="mb-14">
            <span className="rule-lime mb-4 block" />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[#B5E61D] text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Our Work
                </p>
                <h2
                  className="text-[clamp(2.5rem,6vw,4.5rem)] leading-none font-black uppercase text-white"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Before & After<br />
                  <span className="text-[#B5E61D]">Transformations</span>
                </h2>
              </div>
            </div>
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {galleryProjects.map((project, idx) => (
              <div key={idx} className="gallery-item group">
                <div className="mb-4">
                  <p className="text-[#B5E61D] text-xs font-bold uppercase tracking-widest mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {project.service}
                  </p>
                  <h3
                    className="text-xl font-black uppercase text-white"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {project.title}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Before */}
                  <div className="relative overflow-hidden bg-[#1A1A1A] border border-white/10">
                    <div className="absolute top-2 left-2 bg-[#B5E61D] text-[#0D0D0D] px-2 py-1 text-xs font-bold uppercase tracking-widest z-10" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      Before
                    </div>
                    <img
                      src={project.before}
                      alt="Before"
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {/* After */}
                  <div className="relative overflow-hidden bg-[#1A1A1A] border border-white/10">
                    <div className="absolute top-2 left-2 bg-[#B5E61D] text-[#0D0D0D] px-2 py-1 text-xs font-bold uppercase tracking-widest z-10" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      After
                    </div>
                    <img
                      src={project.after}
                      alt="After"
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────────────── */}
      <section ref={ctaBannerRef} className="bg-[#B5E61D] py-14 md:py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2
                className="text-[clamp(2rem,5vw,3.5rem)] leading-none font-black uppercase text-[#0D0D0D] mb-2"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Ready to Book?
              </h2>
              <p className="text-[#0D0D0D]/60 text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Choose your services, pick a day and time, and send the request.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link href="/booking">
                <span className="inline-flex items-center gap-2 bg-[#0D0D0D] text-white font-black text-sm uppercase tracking-widest px-7 py-3 hover:bg-[#1A1A1A] transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Request Booking <ArrowRight size={16} />
                </span>
              </Link>
              <a
                href="tel:8325422979"
                className="inline-flex items-center gap-2 border-2 border-[#0D0D0D] text-[#0D0D0D] font-black text-sm uppercase tracking-widest px-7 py-3 hover:bg-[#0D0D0D] hover:text-[#B5E61D] transition-all" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                <Phone size={15} />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
