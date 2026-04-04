/*
 * DESIGN: Industrial Brutalism + Organic Contrast
 * - Service checkboxes with live summary
 * - Form with neon lime accents
 * - GSAP animations on form elements
 * - Barlow Condensed headings, DM Sans body
 */
import { useState, useRef, useEffect } from "react";
import { ArrowRight, Check, Phone, Mail, MapPin, Calendar, Clock, FileText, Scissors, Leaf, Droplets, Flower2 } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

const serviceOptions = [
  { id: "maintenance", label: "Yard Maintenance", icon: <Scissors size={18} /> },
  { id: "cleanup", label: "Yard Cleaning", icon: <Leaf size={18} /> },
  { id: "mulch", label: "Lay Mulch", icon: <Flower2 size={18} /> },
  { id: "gardening", label: "Gardening (Planting/Garden Bed)", icon: <Leaf size={18} /> },
  { id: "powerwash", label: "Power Wash", icon: <Droplets size={18} /> },
];

export default function Booking() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    date: "",
    time: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      const inputs = formRef.current.querySelectorAll("input, textarea, button");
      if (inputs.length > 0) {
        gsap.fromTo(
          inputs,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 70%",
              end: "top 40%",
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

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createAppointmentMutation = trpc.appointments.create.useMutation({
    onSuccess: () => {
      toast.success("Booking submitted! We'll contact you soon.");
      setSubmitted(true);
      setSelectedServices([]);
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        date: "",
        time: "",
        notes: "",
      });
      setTimeout(() => setSubmitted(false), 3000);
    },
    onError: (error) => {
      toast.error("Failed to submit booking. Please try again.");
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedServices.length || !formData.name || !formData.phone || !formData.email || !formData.address) {
      toast.error("Please fill in all required fields and select at least one service.");
      return;
    }

    createAppointmentMutation.mutate({
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      serviceAddress: formData.address,
      services: selectedServices,
      preferredDate: formData.date ? new Date(formData.date) : undefined,
      preferredTime: formData.time || undefined,
      notes: formData.notes || undefined,
    });
  };

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
            Book Your <span className="text-[#B5E61D]">Service</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Select one or more services, choose your preferred day and time, and send us your details. We'll confirm your appointment quickly.
          </p>
        </div>
      </section>

      {/* ─── BOOKING FORM ─────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#0D0D0D]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Service Selection */}
            <div className="lg:col-span-2">
              <div ref={formRef}>
                {/* Services Section */}
                <div className="mb-12">
                  <h2
                    className="text-2xl font-black uppercase text-white mb-6 tracking-tight"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    Select Services
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {serviceOptions.map((service) => (
                      <label
                        key={service.id}
                        className="group cursor-pointer"
                      >
                        <div
                          className={`flex items-center gap-3 p-4 border-2 transition-all duration-200 ${
                            selectedServices.includes(service.id)
                              ? "border-[#B5E61D] bg-[#B5E61D]/10"
                              : "border-white/10 hover:border-white/20 bg-[#1A1A1A]"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${
                              selectedServices.includes(service.id)
                                ? "border-[#B5E61D] bg-[#B5E61D]"
                                : "border-white/30"
                            }`}
                          >
                            {selectedServices.includes(service.id) && (
                              <Check size={14} className="text-[#0D0D0D]" />
                            )}
                          </div>
                          <div className="text-[#B5E61D]">{service.icon}</div>
                          <span
                            className="text-white font-bold uppercase text-sm tracking-wide"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                          >
                            {service.label}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id)}
                          onChange={() => toggleService(service.id)}
                          className="hidden"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-12">
                  <h2
                    className="text-2xl font-black uppercase text-white mb-6 tracking-tight"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    Your Information
                  </h2>
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-white/70 text-sm font-bold uppercase tracking-wide mb-2"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 text-white placeholder-white/30 focus:border-[#B5E61D] focus:outline-none transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-white/70 text-sm font-bold uppercase tracking-wide mb-2"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="(832) 542-2979"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 text-white placeholder-white/30 focus:border-[#B5E61D] focus:outline-none transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-white/70 text-sm font-bold uppercase tracking-wide mb-2"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 text-white placeholder-white/30 focus:border-[#B5E61D] focus:outline-none transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-white/70 text-sm font-bold uppercase tracking-wide mb-2"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        Service Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Street address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 text-white placeholder-white/30 focus:border-[#B5E61D] focus:outline-none transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Date & Time */}
                <div className="mb-12">
                  <h2
                    className="text-2xl font-black uppercase text-white mb-6 tracking-tight"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    Preferred Schedule
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-white/70 text-sm font-bold uppercase tracking-wide mb-2"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        Preferred Day
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 text-white focus:border-[#B5E61D] focus:outline-none transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>

                    {/* Time */}
                    <div>
                      <label
                        htmlFor="time"
                        className="block text-white/70 text-sm font-bold uppercase tracking-wide mb-2"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 text-white focus:border-[#B5E61D] focus:outline-none transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-12">
                  <h2
                    className="text-2xl font-black uppercase text-white mb-6 tracking-tight"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    Additional Notes
                  </h2>
                  <textarea
                    name="notes"
                    placeholder="Any special requests or details?"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 text-white placeholder-white/30 focus:border-[#B5E61D] focus:outline-none transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={createAppointmentMutation.isPending || submitted}
                  className="btn-lime inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createAppointmentMutation.isPending ? "Submitting..." : "Submit Booking"} <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right: Summary */}
            <div>
              <div className="sticky top-32 bg-[#111111] border border-white/10 p-6 rounded">
                <h3
                  className="text-xl font-black uppercase text-white mb-6"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Booking Summary
                </h3>

                {/* Selected Services */}
                <div className="mb-6">
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
                    Selected Services
                  </p>
                  {selectedServices.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedServices.map((id) => {
                        const service = serviceOptions.find((s) => s.id === id);
                        return (
                          <li key={id} className="flex items-center gap-2 text-white/70 text-sm">
                            <div className="w-1.5 h-1.5 bg-[#B5E61D]" />
                            {service?.label}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-white/40 text-sm">No services selected</p>
                  )}
                </div>

                {/* Contact Summary */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
                    Contact Info
                  </p>
                  {formData.name && (
                    <p className="text-white/70 text-sm mb-1">{formData.name}</p>
                  )}
                  {formData.phone && (
                    <p className="text-white/70 text-sm mb-1">{formData.phone}</p>
                  )}
                  {formData.email && (
                    <p className="text-white/70 text-sm">{formData.email}</p>
                  )}
                </div>

                {/* Schedule Summary */}
                {(formData.date || formData.time) && (
                  <div>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
                      Preferred Time
                    </p>
                    <p className="text-white/70 text-sm">
                      {formData.date && new Date(formData.date).toLocaleDateString()}
                      {formData.time && ` at ${formData.time}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
