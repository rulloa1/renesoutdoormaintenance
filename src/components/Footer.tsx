/*
 * DESIGN: Industrial Brutalism + Organic Contrast
 * - Near-black bg, neon lime accent, Barlow Condensed headings
 */
import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-white/10">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <span
                className="text-[#B5E61D] font-bold tracking-widest text-[0.6rem] uppercase block"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Rene's
              </span>
              <span
                className="text-white font-black uppercase tracking-tight text-2xl leading-none block"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Outdoor Maintenance
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Yard maintenance, cleanup, mulch, planting, and power washing with a straightforward booking experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-[#B5E61D] text-xs font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { href: "/booking", label: "Book a Service" },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="text-white/50 hover:text-white text-sm transition-colors duration-200">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-[#B5E61D] text-xs font-bold uppercase tracking-widest mb-4"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="tel:8325422979"
                className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
              >
                <Phone size={14} className="text-[#B5E61D] shrink-0" />
                832-542-2979
              </a>
              <a
                href="mailto:conrenel0@gmail.com"
                className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
              >
                <Mail size={14} className="text-[#B5E61D] shrink-0" />
                conrenel0@gmail.com
              </a>
              <div className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin size={14} className="text-[#B5E61D] shrink-0 mt-0.5" />
                Houston, TX Area
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <p className="text-white/30 text-xs">
              &copy; {new Date().getFullYear()} Rene's Outdoor Maintenance. All rights reserved.
            </p>
            <p className="text-white/20 text-xs">
              Website developed by <a href="https://smokeshopgrowth.com" target="_blank" rel="noopener noreferrer" className="text-[#B5E61D] hover:text-white transition-colors">Smoke Shop Growth</a>
            </p>
          </div>
          <div className="flex gap-4">
            <a href="tel:8325422979" className="text-white/30 hover:text-[#B5E61D] text-xs transition-colors">
              832-542-2979
            </a>
            <a href="mailto:renelklever@gmail.com" className="text-white/30 hover:text-[#B5E61D] text-xs transition-colors">
              renelklever@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
