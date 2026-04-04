/*
 * DESIGN: Industrial Brutalism + Organic Contrast
 * - Near-black bg, neon lime accent, Barlow Condensed nav links
 * - Left-anchored brand, right-side nav links
 * - Sticky with subtle backdrop blur on scroll
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/booking", label: "Book Now" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand */}
          <Link href="/">
            <div className="flex flex-col leading-none cursor-pointer">
              <span
                className="text-[#B5E61D] font-bold tracking-widest text-[0.6rem] uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Rene's
              </span>
              <span
                className="text-white font-black uppercase tracking-tight text-xl leading-none"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Outdoor Maintenance
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`relative text-sm font-bold uppercase tracking-widest transition-colors duration-200 group ${
                    location === link.href
                      ? "text-[#B5E61D]"
                      : "text-white/70 hover:text-white"
                  }`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-[#B5E61D] transition-all duration-200 ${
                      location === link.href ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </span>
              </Link>
            ))}
            <a
              href="tel:8325422979"
              className="btn-lime text-sm py-2 px-4"
            >
              <Phone size={14} />
              832-542-2979
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0D0D0D] border-t border-white/5 px-4 pb-6 pt-2">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block py-3 text-lg font-bold uppercase tracking-widest border-b border-white/5 transition-colors ${
                    location === link.href ? "text-[#B5E61D]" : "text-white/70"
                  }`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <a
              href="tel:8325422979"
              className="btn-lime mt-4 justify-center"
            >
              <Phone size={14} />
              832-542-2979
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
