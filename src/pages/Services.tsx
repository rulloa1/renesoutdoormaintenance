/*
 * DESIGN: Industrial Brutalism + Organic Contrast
 * - Service cards with detailed descriptions and before/after imagery
 * - GSAP ScrollTrigger stagger animations
 * - Neon lime accents, Barlow Condensed headings
 */
import { useRef, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Scissors, Leaf, Droplets, Flower2 } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MOWING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663491975491/Lsy8wiS8aMn4LGx9qSEa7e/service-mowing-VpqJSLytwbDBFi5bPSEezy.webp";
const MULCH_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663491975491/Lsy8wiS8aMn4LGx9qSEa7e/service-mulch-M9sUnziza2fYy6d4xPRFuV.webp";
const POWERWASH_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663491975491/Lsy8wiS8aMn4LGx9qSEa7e/service-powerwash-c6NnWSRHpzeu9uFWjAVAMM.webp";
const CLEANUP_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663491975491/Lsy8wiS8aMn4LGx9qSEa7e/service-cleanup-HiJDjfMDvBHyk97bE49UdS.webp";

const servicesData = [
  {
    id: 1,
    icon: <Scissors size={28} className="text-[#B5E61D]" />,
    title: "Yard Maintenance",
    shortDesc: "Routine mowing, edging, trimming, and seasonal upkeep.",
    fullDesc: "Keep your property looking crisp and cared for with professional yard maintenance. We handle routine mowing with precision cuts, sharp edging along borders, trimming of overgrown areas, and seasonal upkeep to ensure your lawn stays healthy and attractive year-round.",
    benefits: [
      "Precision mowing with consistent patterns",
      "Sharp, clean edging along all borders",
      "Trimming and overgrowth removal",
      "Seasonal maintenance and upkeep",
      "Healthy, vibrant lawn appearance",
    ],
    image: MOWING_IMG,
  },
  {
    id: 2,
    icon: <Leaf size={28} className="text-[#B5E61D]" />,
    title: "Cleanups & Removals",
    shortDesc: "Leaf cleanup, debris clearing, and overgrowth removal.",
    fullDesc: "Transform your yard with comprehensive cleanup services. We remove fallen leaves, clear debris, eliminate overgrowth, and refresh your outdoor space for a cleaner, more polished exterior presentation.",
    benefits: [
      "Seasonal leaf cleanup and removal",
      "Debris clearing and hauling",
      "Overgrowth removal and trimming",
      "Yard refresh and restoration",
      "Professional disposal of yard waste",
    ],
    image: CLEANUP_IMG,
  },
  {
    id: 3,
    icon: <Flower2 size={28} className="text-[#B5E61D]" />,
    title: "Mulch & Garden Beds",
    shortDesc: "Fresh mulch installation, planting support, and garden-bed work.",
    fullDesc: "Enhance your landscaping with professional mulch installation and garden bed maintenance. We lay fresh mulch, provide planting support, maintain garden beds, and ensure clean, finished edges for a polished outdoor aesthetic.",
    benefits: [
      "Fresh mulch installation and layering",
      "Garden bed design and maintenance",
      "Planting support and arrangement",
      "Weed control and bed edging",
      "Landscape enhancement and curb appeal",
    ],
    image: MULCH_IMG,
  },
  {
    id: 4,
    icon: <Droplets size={28} className="text-[#B5E61D]" />,
    title: "Power Washing",
    shortDesc: "High-pressure cleaning of driveways, walkways, and patios.",
    fullDesc: "Restore surfaces to like-new condition with professional power washing. We clean driveways, walkways, patios, decks, and exterior surfaces, removing years of grime, stains, and buildup for a bright, fresh finish.",
    benefits: [
      "Driveway and walkway cleaning",
      "Patio and deck restoration",
      "Exterior surface cleaning",
      "Stain and grime removal",
      "Like-new appearance restoration",
    ],
    image: POWERWASH_IMG,
  },
];

export default function Services() {
  const servicesGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (servicesGridRef.current) {
      const cards = servicesGridRef.current.querySelectorAll(":scope > div");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            scrollTrigger: {
              trigger: servicesGridRef.current,
              start: "top 65%",
              end: "top 35%",
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
      {/* ─── PAGE HEADER ──────────────────────────────────────── */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-[#111111]">
        <div className="container">
          <span className="rule-lime mb-6 block" />
          <h1
            className="text-[clamp(3rem,8vw,5.5rem)] leading-none font-black uppercase text-white mb-6"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Our <span className="text-[#B5E61D]">Services</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            From routine maintenance to specialized cleanup and restoration, we offer a complete range of outdoor services designed to keep your property looking sharp and well-maintained.
          </p>
        </div>
      </section>

      {/* ─── SERVICES GRID ────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#0D0D0D]">
        <div className="container">
          <div ref={servicesGridRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {servicesData.map((service) => (
              <div
                key={service.id}
                className="group border border-white/10 hover:border-[#B5E61D]/40 transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-[#1A1A1A]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
                  {/* Icon badge */}
                  <div className="absolute top-4 left-4 bg-[#B5E61D] p-3 rounded-sm">
                    {service.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h2
                    className="text-2xl font-black uppercase text-white mb-3 tracking-tight"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {service.title}
                  </h2>
                  <p className="text-white/60 text-sm mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {service.fullDesc}
                  </p>

                  {/* Benefits list */}
                  <ul className="space-y-2 mb-8">
                    {service.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-3 text-white/50 text-sm"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <CheckCircle2 size={16} className="text-[#B5E61D] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/booking">
                    <span className="btn-lime text-sm py-2 px-4">
                      Book This Service <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>

                {/* Hover rule */}
                <div className="h-0.5 w-0 bg-[#B5E61D] group-hover:w-full transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#111111]">
        <div className="container">
          <span className="rule-lime mb-6 block" />
          <h2
            className="text-[clamp(2.5rem,6vw,4.5rem)] leading-none font-black uppercase text-white mb-12"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Why Choose<br />
            <span className="text-[#B5E61D]">Rene's Maintenance</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Local Expertise", desc: "Serving the Houston area with deep knowledge of local landscaping needs and seasonal requirements." },
              { title: "Professional Results", desc: "Attention to detail and precision in every project, from mowing patterns to mulch edging." },
              { title: "Easy Booking", desc: "Simple, straightforward scheduling. Choose your services, pick a day and time, and we handle the rest." },
              { title: "Reliable Service", desc: "Show up on time, complete the work professionally, and leave your property looking sharp." },
              { title: "Competitive Pricing", desc: "Quality outdoor maintenance at fair, transparent rates with no hidden fees." },
              { title: "Customer Focused", desc: "Your satisfaction is our priority. We listen to your needs and deliver results that impress." },
            ].map((item) => (
              <div key={item.title} className="border-l-2 border-[#B5E61D] pl-6">
                <h3
                  className="text-white font-bold uppercase text-base mb-2 tracking-wide"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ──────────────────────────────────────── */}
      <section className="bg-[#B5E61D] py-16 md:py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2
                className="text-[clamp(2rem,5vw,3.5rem)] leading-none font-black uppercase text-[#0D0D0D] mb-2"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Ready to Get Started?
              </h2>
              <p className="text-[#0D0D0D]/60 text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Book your service today and experience professional outdoor maintenance.
              </p>
            </div>
            <Link href="/booking">
              <span className="btn-lime bg-[#0D0D0D] text-white hover:bg-[#1A1A1A]">
                Book Now <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
