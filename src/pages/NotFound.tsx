import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D0D0D] text-white gap-6">
      <h1
        className="text-[10rem] leading-none font-black text-[#B5E61D]"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        404
      </h1>
      <p className="text-white/50 text-lg">Page not found.</p>
      <Link href="/" className="btn-lime">
        Back Home
      </Link>
    </div>
  );
}
